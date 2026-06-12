# Active Agents

This file records the current agent setup for the Minimal Golf Journal workstream.

## PM / Coordinator

- PM Agent: `Bernoulli`
- Agent id: `019ebbe7-335d-7e33-a556-f4fd46b06f24`
- Purpose: plain-language summaries, prioritization, scope control, merge-risk callouts

## Area Agents

- Mobile Polish Agent: `Avicenna`
- Agent id: `019ebbe7-4d40-74a1-94d3-50d957a43f84`
- Focus: mobile layout, cards, voice/text controls, empty states, visual polish

- Parser Improvements Agent: `Boyle`
- Agent id: `019ebbe7-69a2-7570-b927-3cadb20e0b45`
- Focus: natural golf language parsing and entry classification

- Storage Model Agent: `James`
- Agent id: `019ebbe7-8521-7c91-83a0-10b1c3a5c93e`
- Focus: localStorage structure, data normalization, export/import readiness

- Insights Agent: `Meitner`
- Agent id: `019ebbe7-aec8-7c22-bab8-0b2c2f0b409d`
- Focus: score, cost, walking, course, tag, and practice/workout insight improvements

- QA Flow Agent: `Kierkegaard`
- Agent id: `019ebbe7-ceca-7be0-b2f6-25526a24686b`
- Focus: manual QA report, browser checks, bad-input cases, small targeted fixes

## Current Coordination Note

`app.js` is still the shared hotspot. Parser, storage, and insights work should be reviewed and merged one at a time until the app is split into modules.
