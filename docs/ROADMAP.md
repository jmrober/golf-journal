# Roadmap

## Version 0.1 — Documentation and App Shell

Status: ready to start

Goals:

- Finish product docs.
- Create app scaffold.
- Build static mobile-first screens.
- Use sample data only.

Deliverables:

- Dashboard
- Add Entry screen
- Journal screen
- Insights screen
- Settings screen

## Version 0.2 — Local Journal MVP

Goals:

- Add real local storage.
- Add manual round entry.
- Add edit/delete.
- Add JSON export.

Deliverables:

- Persistent rounds
- Round detail view
- Basic stats
- Export button

## Version 0.3 — Voice/Text Parser

Goals:

- Add dictated text input.
- Parse common round details.
- Show parsed preview.
- Let user correct fields before saving.

Deliverables:

- Rules-based parser
- Parsed preview UI
- Missing field warnings

## Version 0.4 — Practice and Workout Logs

Goals:

- Support non-round entries.
- Add practice session logging.
- Add golf workout logging.
- Display mixed timeline.

Deliverables:

- Practice model
- Workout model
- Entry type selector/inference
- Timeline filters

## Version 0.5 — Insights

Goals:

- Make the journal useful after 5+ rounds.
- Show trends and repeated issues.

Deliverables:

- Average score
- Best/worst score
- Cost tracking
- Walking percentage
- Common misses
- Course summaries

## Version 0.6 — AI Parsing

Goals:

- Add optional AI parsing.
- Keep cost low.
- Improve natural dictation quality.

Deliverables:

- `/api/parse` route
- AI parser prompt
- Fallback rules parser
- Error handling
- Parse confidence and warnings

## Version 0.7 — PWA

Goals:

- Make the web app feel like a phone app.

Deliverables:

- Manifest
- App icon
- Home screen install support
- Mobile polish

## Version 1.0 — Private Golf Journal

Goals:

- Stable, useful personal golf journal.
- Exportable data.
- Basic AI summaries.
- Ready for personal use all season.

Deliverables:

- Full local-first MVP
- Round/practice/workout entries
- Dashboard
- Insights
- Export/import
- PWA support

## Future Ideas

### Handicap Estimate

Estimate handicap from logged rounds. Make it clear this is not an official handicap.

### Course Intelligence

Show per-course stats:

- Average score
- Best score
- Cost
- Notes
- Repeated issues

### Seasonal Report

Generate a year-end report:

- Rounds played
- Best round
- Biggest improvement
- Most expensive course
- Most common weakness
- Practice plan for next season

### Golf-Specific Workout Correlation

Compare workouts and practice to later performance.

Example questions:

- Do scores improve after consistent mobility work?
- Does walking affect score or energy?
- Do workouts correlate with better late-round performance?

### AI Coach Mode

Only after enough data exists, add deeper coaching:

- Pattern recognition
- Practice plan
- Round prep
- Post-round recap
- Weakness prioritization

## What Not to Build Soon

Avoid these until the simple journal is excellent:

- Social features
- GPS shot tracking
- Native iOS/Android
- Payments
- Official handicap sync
- Swing video AI
