# Golf Journal Agent Guide

This repository is the working home for Minimal Golf Journal, a voice-first golf journal and improvement tracker.

## Product Direction

- Build for a recreational golfer logging after a round from a phone.
- Prioritize low-friction capture over perfect statistics.
- Keep the app private, calm, and journal-like rather than a busy sports dashboard.
- The core flow is: dictate or paste a note, parse it, review fields, save it, and see useful patterns over time.

## Current App

- The current MVP is a zero-dependency browser app.
- Open `index.html` directly, or run a static server from the repo root.
- Primary files:
  - `index.html` for app structure
  - `styles.css` for the visual system and responsive layout
  - `app.js` for localStorage, parsing, stats, and interactions
  - `docs/` for product requirements and build direction

## Build Priorities

1. Add support for practice, workout, and note entries.
2. Improve parser coverage for natural golf language.
3. Formalize the data model toward `docs/DATA_MODEL.md`.
4. Improve mobile ergonomics and app polish.
5. Expand insights only when the saved data supports them.

## Multi-Agent Rules

- Keep each agent scoped to one workstream.
- Prefer separate branches for parallel work, using the `codex/` prefix.
- Avoid multiple agents editing the same file at the same time.
- If a task must touch shared files like `app.js`, keep the patch small and explain the affected functions.
- Read relevant docs before changing behavior:
  - Product scope: `docs/PRD.md`
  - Data structures: `docs/DATA_MODEL.md`
  - Parser behavior: `docs/AI_VOICE_PARSER.md`
  - UI direction: `docs/DESIGN_SYSTEM.md`
  - Build order: `docs/BUILD_PLAN.md`

## Suggested Agent Workstreams

- `codex/parser-entry-types`: round, practice, workout, and note detection.
- `codex/mobile-polish`: layout, cards, navigation, empty states, and form ergonomics.
- `codex/storage-model`: typed data shape, import/export, and migration-friendly storage.
- `codex/insights-v1`: score trends, costs, walking percentage, courses, and tags.
- `codex/qa-flow`: browser testing, bug reports, and regression checks.

## Verification

Run these checks before finishing work when they apply:

```bash
node --check app.js
```

For UI changes, verify the main flow in a browser:

1. Add a dictated round.
2. Parse it.
3. Edit fields.
4. Save it.
5. Confirm journal, stats, insights, edit, delete, and export still work.
6. Check at a phone-width viewport for overflow or clipped text.

## Style Guidelines

- Keep UI mobile-first and thumb-friendly.
- Use clear labels, short copy, and restrained visual styling.
- Preserve the calm green/sand/white visual direction unless intentionally revising the design system.
- Do not add backend, auth, payments, GPS, shot tracking, or social features until the local journal MVP is solid.
