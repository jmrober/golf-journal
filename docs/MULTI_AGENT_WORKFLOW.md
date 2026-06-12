# Phone and Multi-Agent Workflow

Use this workflow when building Minimal Golf Journal from a phone with multiple Codex agents.

## One-Time Setup

1. Keep this repo committed before starting parallel work.
2. Push the repo to GitHub.
3. Start one main coordinator thread for product direction and reviews.
4. Start separate agent threads for narrow implementation tasks.

## Coordinator Thread

The coordinator owns product direction, task slicing, and review.

Suggested prompt:

```text
You are coordinating the Minimal Golf Journal app. Read README.md, AGENTS.md, and the docs folder. Keep work scoped to the MVP. Break work into small branches for focused agents. Review finished work before merge.
```

## Agent Threads

Each agent should work on one branch and one concern.

Suggested agents:

- `codex/parser-entry-types`: entry type detection and parser improvements.
- `codex/mobile-polish`: mobile layout, navigation, cards, and form ergonomics.
- `codex/storage-model`: localStorage structure, import/export, and data migration.
- `codex/insights-v1`: score trends, costs, walking percentage, courses, and tags.
- `codex/qa-flow`: browser testing, regression checks, and bug reports.

## Branch Pattern

Use the `codex/` prefix:

```bash
git checkout -b codex/parser-entry-types
git checkout -b codex/mobile-polish
git checkout -b codex/storage-model
git checkout -b codex/insights-v1
git checkout -b codex/qa-flow
```

## Phone-Friendly Task Prompts

Parser agent:

```text
Work only on parsing and entry-type detection. Add support for round, practice, workout, and note entries. Keep the patch small and explain parser changes. Avoid redesigning UI.
```

Mobile UI agent:

```text
Improve the mobile-first app experience. Focus on layout, cards, bottom navigation, empty states, and form ergonomics. Keep parser logic unchanged unless absolutely necessary.
```

Storage agent:

```text
Move stored entries closer to docs/DATA_MODEL.md. Add migration-safe localStorage helpers and keep existing saved data working.
```

Insights agent:

```text
Improve useful MVP insights from saved local data. Prioritize understandable patterns over charts. Avoid adding dependencies unless clearly justified.
```

QA agent:

```text
Test the app like a golfer using it after a round. Check parse, edit, save, delete, sample data, export, and mobile width. Report issues with reproduction steps and suggested file locations.
```

## Merge Rules

- Review one branch at a time.
- Run `node --check app.js` before merge.
- Test the main app flow in a browser before merge.
- Resolve conflicts in favor of the product docs and the smallest working patch.
- Keep merged branches small enough to understand from a phone.

## GitHub Remote

If this machine has a GitHub remote ready:

```bash
git remote add origin <github-repo-url>
git push -u origin main
```

If working entirely from a phone, create the GitHub repo first, then add it as the remote from whichever Codex surface has repo access.
