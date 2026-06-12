# AI Voice Parser

## Purpose

The AI voice parser turns messy dictated golf notes into structured app data.

The parser should support both:

1. **AI-powered parsing** for flexible natural language.
2. **Rules-based fallback** for cost control and offline resilience.

The MVP can start with a mock parser, then replace it with a real AI call.

## Parser Goals

The parser should:

- Detect the entry type.
- Extract known fields.
- Preserve the original raw input.
- Identify missing critical fields.
- Avoid inventing details.
- Return clean JSON.
- Provide confidence scores when possible.

## Entry Types

The parser should classify input as one of:

- `round`
- `practice`
- `workout`
- `note`

## Golden Rule

Never make up details. If the user does not mention a value, return `null`, an empty array, or a missing field warning.

## Required Parser Output

```ts
export type ParseResult = {
  entryType: "round" | "practice" | "workout" | "note";
  confidence: number;
  parsedEntry: Partial<JournalEntry>;
  missingRequiredFields: string[];
  warnings: string[];
  suggestedQuestions: string[];
};
```

## System Prompt

Use this as the base instruction for an AI model:

```txt
You are a structured data parser for a golf journal app.

Your job is to convert the user's dictated golf, practice, workout, or journal note into structured JSON.

Rules:
- Return JSON only.
- Do not include markdown.
- Do not invent missing details.
- If a detail is not provided, use null or omit the field.
- Preserve the user's tone in the notes field when useful.
- Infer common golf terms carefully.
- Walking means the user walked the round.
- Riding means the user used a cart.
- If the user says "shot 86," score is 86.
- If the user says "played 18," holes is 18.
- If the user says "white tees," tees is "white".
- If the user gives a cost like "44 bucks," cost is 44.
- If the user gives a time like "5:39 in the morning," teeTime is "05:39".
- If the entry is a round, required fields are courseName, entryDate, holes, and score.
- Return missingRequiredFields for required fields that are not present.
```

## Round Parsing Example

### Input

```txt
Played Shadowbrooke at 5:39 a.m., walked 18, shot 91. Cost was 44 dollars. It was expensive and mid. Driver was leaking right and putting was okay.
```

### Output

```json
{
  "entryType": "round",
  "confidence": 0.94,
  "parsedEntry": {
    "type": "round",
    "source": "voice",
    "courseName": "Shadowbrooke",
    "teeTime": "05:39",
    "holes": 18,
    "score": 91,
    "walking": true,
    "riding": false,
    "cost": 44,
    "title": "Shadowbrooke — 91",
    "summary": "Walked 18 at Shadowbrooke and shot 91.",
    "notes": "It was expensive and mid. Driver was leaking right and putting was okay.",
    "tags": ["walking", "early-morning"],
    "performance": {
      "driver": {
        "rating": 2,
        "notes": "Driver was leaking right."
      },
      "putting": {
        "rating": 3,
        "notes": "Putting was okay."
      }
    },
    "weaknesses": ["Driver miss right"],
    "strengths": []
  },
  "missingRequiredFields": ["entryDate"],
  "warnings": [],
  "suggestedQuestions": ["What date did you play this round?"]
}
```

## Practice Parsing Example

### Input

```txt
Practiced in the garage for 35 minutes. Focused on driver tempo and starting line. Still missing right but contact felt better.
```

### Output

```json
{
  "entryType": "practice",
  "confidence": 0.9,
  "parsedEntry": {
    "type": "practice",
    "source": "voice",
    "title": "Driver tempo practice",
    "summary": "35-minute garage session focused on driver tempo and starting line.",
    "location": "garage",
    "durationMinutes": 35,
    "focusAreas": ["driver", "tempo", "starting line"],
    "whatWorked": ["Contact felt better"],
    "needsWork": ["Still missing right"],
    "tags": ["garage", "driver"]
  },
  "missingRequiredFields": ["entryDate"],
  "warnings": [],
  "suggestedQuestions": ["Was this practice session today?"]
}
```

## Workout Parsing Example

### Input

```txt
Did a golf workout today. Pull ups, goblet squats, heavy carries, and core. About 35 minutes. Felt good but hips were tight.
```

### Output

```json
{
  "entryType": "workout",
  "confidence": 0.9,
  "parsedEntry": {
    "type": "workout",
    "source": "voice",
    "title": "Golf strength workout",
    "summary": "35-minute golf workout with pull-ups, goblet squats, carries, and core.",
    "workoutType": "golf-specific",
    "durationMinutes": 35,
    "exercises": [
      { "name": "Pull-ups" },
      { "name": "Goblet squats" },
      { "name": "Heavy carries" },
      { "name": "Core" }
    ],
    "energyLevel": 4,
    "soreness": "Hips were tight.",
    "golfRelevance": "Strength, carries, and core work support golf fitness.",
    "tags": ["strength", "core", "carries"]
  },
  "missingRequiredFields": [],
  "warnings": [],
  "suggestedQuestions": []
}
```

## Low-Cost Parsing Strategy

To avoid ridiculous AI costs:

1. First run a lightweight local parser for obvious fields.
2. Use AI only when the input is ambiguous or when summarization is needed.
3. Cache parse results.
4. Never re-parse saved entries unless the raw input changes.
5. Use small/cheap models for extraction.
6. Use a larger model only for deeper seasonal insights.

## Rules-Based Parser Ideas

Regex and simple logic can extract:

- Scores: `shot 86`, `scored 91`, `carded an 88`
- Holes: `played 18`, `walked 9`, `18 holes`
- Cost: `$44`, `44 bucks`, `cost was 44`
- Time: `5:39 a.m.`, `5:50 in the morning`
- Walking: `walked`, `walking`
- Riding: `cart`, `rode`, `riding`
- Tees: `white tees`, `blue tees`, `tips`
- Course: phrase after `played`, before `at`, or known course list

## Missing Field Behavior

For a round, if required fields are missing:

- Missing course: ask “What course did you play?”
- Missing score: ask “What did you shoot?”
- Missing holes: default to user setting if available, otherwise ask.
- Missing date: assume today only if the user says “today”; otherwise ask or use current date with warning.

## UI Preview Requirement

After parsing, show a preview screen before saving:

- Parsed fields
- Missing fields
- Notes
- Tags
- Save button
- Edit button

MVP should not silently save AI-parsed entries without review.
