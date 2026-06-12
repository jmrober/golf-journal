# Data Model

## Overview

The app should store all journal entries in a consistent structure. The MVP can use browser local storage or IndexedDB. Later versions can move to Supabase, SQLite, Turso, or another database.

Primary entities:

- UserSettings
- JournalEntry
- RoundEntry
- PracticeEntry
- WorkoutEntry
- WeatherSnapshot
- InsightSummary

## TypeScript Types

```ts
export type EntryType = "round" | "practice" | "workout" | "note";

export type EntrySource = "voice" | "text" | "manual" | "import";

export type WeatherSnapshot = {
  temperatureF?: number | null;
  feelsLikeF?: number | null;
  conditions?: string | null;
  windMph?: number | null;
  humidityPercent?: number | null;
};

export type PerformanceCategory = {
  rating?: 1 | 2 | 3 | 4 | 5 | null;
  notes?: string | null;
};

export type RoundPerformance = {
  driver?: PerformanceCategory;
  approach?: PerformanceCategory;
  shortGame?: PerformanceCategory;
  putting?: PerformanceCategory;
  penalties?: PerformanceCategory;
  mentalGame?: PerformanceCategory;
  energy?: PerformanceCategory;
};

export type BaseJournalEntry = {
  id: string;
  type: EntryType;
  source: EntrySource;
  createdAt: string;
  updatedAt: string;
  entryDate: string;
  rawInput?: string;
  title: string;
  summary?: string;
  notes?: string;
  tags: string[];
};

export type RoundEntry = BaseJournalEntry & {
  type: "round";
  courseName: string;
  teeTime?: string | null;
  holes: 9 | 18;
  tees?: string | null;
  score: number;
  walking?: boolean | null;
  riding?: boolean | null;
  cost?: number | null;
  weather?: WeatherSnapshot | null;
  performance?: RoundPerformance;
  strengths?: string[];
  weaknesses?: string[];
  followUpPracticeIdeas?: string[];
  roundRating?: 1 | 2 | 3 | 4 | 5 | null;
};

export type PracticeEntry = BaseJournalEntry & {
  type: "practice";
  location?: string | null;
  durationMinutes?: number | null;
  focusAreas: string[];
  drills?: string[];
  whatWorked?: string[];
  needsWork?: string[];
};

export type WorkoutExercise = {
  name: string;
  sets?: number | null;
  reps?: number | string | null;
  weight?: number | string | null;
  notes?: string | null;
};

export type WorkoutEntry = BaseJournalEntry & {
  type: "workout";
  workoutType?: "strength" | "mobility" | "core" | "conditioning" | "recovery" | "golf-specific" | null;
  durationMinutes?: number | null;
  exercises?: WorkoutExercise[];
  energyLevel?: 1 | 2 | 3 | 4 | 5 | null;
  soreness?: string | null;
  golfRelevance?: string | null;
};

export type NoteEntry = BaseJournalEntry & {
  type: "note";
};

export type JournalEntry = RoundEntry | PracticeEntry | WorkoutEntry | NoteEntry;
```

## User Settings

```ts
export type UserSettings = {
  userName?: string;
  defaultWalking: boolean;
  defaultHoles: 9 | 18;
  defaultTees?: string;
  homeCourses?: string[];
  handicapGoal?: number | null;
  scoringGoal?: number | null;
  aiParsingEnabled: boolean;
  weatherLookupEnabled: boolean;
};
```

## Local Storage Shape

For the simplest MVP:

```ts
const STORAGE_KEY = "minimal-golf-journal:v1";

type AppStorage = {
  version: 1;
  settings: UserSettings;
  entries: JournalEntry[];
};
```

## Example Round Entry

```json
{
  "id": "round_2026_05_23_timber_creek",
  "type": "round",
  "source": "voice",
  "createdAt": "2026-05-23T12:00:00.000Z",
  "updatedAt": "2026-05-23T12:00:00.000Z",
  "entryDate": "2026-05-23",
  "rawInput": "Played Timber Creek Saturday around 5:50 in the morning from the white tees. Walked 18 and shot 86, best round ever.",
  "title": "Timber Creek — 86",
  "summary": "Best round ever. Walked 18 from the white tees.",
  "courseName": "Timber Creek",
  "teeTime": "05:50",
  "holes": 18,
  "tees": "white",
  "score": 86,
  "walking": true,
  "riding": false,
  "cost": null,
  "weather": null,
  "notes": "Best round ever.",
  "tags": ["walking", "best-round", "early-morning"],
  "strengths": [],
  "weaknesses": [],
  "followUpPracticeIdeas": [],
  "roundRating": 5
}
```

## Required Fields by Entry Type

### Round

Required before save:

- type
- entryDate
- courseName
- holes
- score

Recommended:

- teeTime
- tees
- walking/riding
- cost
- notes

### Practice

Required before save:

- type
- entryDate
- focusAreas or notes

### Workout

Required before save:

- type
- entryDate
- workoutType or notes

## Data Validation Rules

- Score must be a positive number.
- Holes must be 9 or 18.
- Cost cannot be negative.
- Round date cannot be far in the future.
- If walking is true, riding should be false.
- If riding is true, walking should be false.
- Empty tags should be removed.
- Course names should preserve user-entered casing.

## Derived Stats

These should not be manually stored unless cached later:

```ts
export type DerivedGolfStats = {
  roundsPlayed: number;
  averageScore: number | null;
  bestScore: number | null;
  worstScore: number | null;
  totalCost: number;
  averageCost: number | null;
  walkingRounds: number;
  walkingPercentage: number | null;
  mostPlayedCourses: Array<{ courseName: string; count: number }>;
};
```

## Future Database Tables

If moved to a relational database later:

- users
- journal_entries
- rounds
- practice_sessions
- workouts
- workout_exercises
- weather_snapshots
- entry_tags
- ai_parse_events

## Migration Notes

Always include a storage version. When the schema changes, write a migration from the old storage shape to the new one.
