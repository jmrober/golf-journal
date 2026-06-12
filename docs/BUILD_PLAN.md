# Build Plan

## Goal

Build a working MVP as a responsive web app that can run on a phone. The first version should support adding golf journal entries, saving them locally, and viewing basic insights.

## Recommended Build Order

### Phase 0 — Repo Setup

Create the app scaffold.

Recommended stack:

```txt
Next.js
TypeScript
Tailwind CSS
localStorage or IndexedDB
Vercel deployment
```

Suggested commands:

```bash
npx create-next-app@latest minimal-golf-journal --typescript --tailwind --eslint --app
cd minimal-golf-journal
npm run dev
```

## Phase 1 — Static App Shell

Build the app without persistence first.

Screens:

- Dashboard
- Add Entry
- Journal
- Insights
- Settings

Components:

- AppShell
- BottomNav
- StatCard
- EntryCard
- VoiceInputBox
- ParsedPreview
- EmptyState
- Button
- TextArea
- Input

Acceptance criteria:

- App loads on desktop and phone sizes.
- Bottom navigation works.
- Screens are visually clean.
- No backend required.

## Phase 2 — Data Model and Local Storage

Add TypeScript models from `DATA_MODEL.md`.

Create files:

```txt
src/lib/types.ts
src/lib/storage.ts
src/lib/stats.ts
src/lib/sample-data.ts
```

Build storage functions:

```ts
getEntries()
saveEntry(entry)
updateEntry(entry)
deleteEntry(id)
exportJson()
importJson()
```

Acceptance criteria:

- Entries persist after refresh.
- User can delete an entry.
- Sample data can be loaded for testing.

## Phase 3 — Manual Round Entry

Before voice parsing, build a manual add/edit flow.

Fields:

- Course
- Date
- Tee time
- Holes
- Tees
- Score
- Walking/riding
- Cost
- Notes
- Tags

Acceptance criteria:

- User can add a round manually.
- User can edit a round.
- User can save and view it in timeline.
- Dashboard stats update.

## Phase 4 — Voice/Text Parser Mock

Build a parser function that uses local rules first.

Create:

```txt
src/lib/parser/rules-parser.ts
src/lib/parser/types.ts
```

Start with common extraction:

- Course
- Score
- Holes
- Time
- Walking/riding
- Cost
- Tees
- Tags

Acceptance criteria:

- User can paste/dictate text into an input.
- App shows parsed preview.
- User can edit before saving.
- Parser does not need to be perfect.

## Phase 5 — Practice and Workout Entries

Add support for:

- Practice entry
- Workout entry
- General note

Acceptance criteria:

- Timeline supports multiple entry types.
- Add screen can save practice/workout/note entries.
- Cards visually distinguish entry types.

## Phase 6 — Insights

Create basic derived stats.

Stats:

- Total rounds
- Average score
- Best score
- Worst score
- Total cost
- Average cost
- Walking percentage
- Most played courses
- Recent score trend
- Common tags/issues

Acceptance criteria:

- Stats update when entries change.
- Insights are understandable without charts.
- Simple chart can be added later.

## Phase 7 — AI Parser Integration

Only after the app works locally, add AI parsing.

Create:

```txt
src/app/api/parse/route.ts
src/lib/parser/ai-parser.ts
```

Flow:

1. User submits raw text.
2. Rules parser extracts obvious fields.
3. AI parser fills structure and summary.
4. User reviews result.
5. User saves.

Acceptance criteria:

- API key is stored in `.env.local`.
- Errors fail gracefully.
- User can still use manual entry if AI fails.

## Phase 8 — PWA Polish

Make it feel phone-friendly.

Tasks:

- Add app manifest.
- Add home screen icon.
- Improve mobile spacing.
- Make primary action thumb-friendly.
- Add export button.

Acceptance criteria:

- App can be added to phone home screen.
- App feels usable after a real golf round.

## Suggested File Structure After Build

```txt
src/
  app/
    page.tsx
    add/page.tsx
    journal/page.tsx
    insights/page.tsx
    settings/page.tsx
    api/parse/route.ts
  components/
    AppShell.tsx
    BottomNav.tsx
    EntryCard.tsx
    ParsedPreview.tsx
    StatCard.tsx
    VoiceInputBox.tsx
  lib/
    types.ts
    storage.ts
    stats.ts
    sample-data.ts
    parser/
      types.ts
      rules-parser.ts
      ai-parser.ts
```

## First Codex Prompt

```txt
You are building Minimal Golf Journal, a voice-first golf journal web app.

Read the docs in /docs before coding.

Start by creating a Next.js TypeScript Tailwind app structure with these routes:
- /
- /add
- /journal
- /insights
- /settings

Build a clean mobile-first UI with mock data only. Do not add a backend yet. Use the product requirements and design system from the docs.
```

## Second Codex Prompt

```txt
Now add the TypeScript data model and local storage layer based on docs/DATA_MODEL.md.

Create storage helpers for adding, updating, deleting, listing, exporting, and importing journal entries.

Wire the dashboard, journal, and insights screens to local storage.
```

## Third Codex Prompt

```txt
Now build the Add Entry flow.

Create a voice/text input screen where the user can paste or dictate a natural round summary. Add a rules-based parser that extracts score, holes, course, tee time, walking/riding, cost, tees, notes, and tags.

Show a parsed preview before saving. Allow manual edits. Save to local storage.
```
