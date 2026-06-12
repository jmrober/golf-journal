# Minimal Golf Journal

A lightweight, voice-first golf journal and golf-specific improvement app.

The goal is simple: after a round, practice session, or workout, the golfer can dictate what happened naturally and the app turns it into clean, structured data that becomes useful over time.

## Core Idea

Most golf apps ask for too much manual input. This project should feel more like talking to a caddie or personal coach:

> “Played Timber Creek Saturday around 5:50 in the morning from the white tees. Walked 18 and shot 86, best round ever. Driver was decent, irons were good, putting was shaky. Cost was about 44 bucks.”

The app should parse that into a round entry with course, date, time, tees, score, walking/riding, cost, notes, and improvement themes.

## Product Principles

1. **Voice first, manual second**  
   Text forms exist for cleanup, but dictation should handle most logging.

2. **Low friction beats perfect data**  
   A mostly complete journal that gets used is better than a perfect system that feels like homework.

3. **Local-first when possible**  
   Store user data locally or cheaply. Use AI only when it creates clear value.

4. **Insights after enough data**  
   Do not over-coach from one round. Let patterns emerge across rounds, practice, and workouts.

5. **Built for the everyday golfer**  
   Not a tour-level shot tracker. This is for the golfer trying to improve while living a normal busy life.

## Folder Structure

```txt
minimal-golf-journal/
  README.md
  docs/
    PRD.md
    BUILD_PLAN.md
    ROADMAP.md
    DATA_MODEL.md
    DESIGN_SYSTEM.md
    AI_VOICE_PARSER.md
    AGENT_ROLES.md
```

## Recommended Tech Stack

### MVP Option

- **Frontend:** Next.js / React
- **Styling:** Tailwind CSS
- **Storage:** LocalStorage or IndexedDB to start
- **Database later:** Supabase or SQLite/Turso
- **AI parsing:** OpenAI, Anthropic, or local rules-based parser fallback
- **Deployment:** Vercel

### Why this stack

- Easy to build with Codex or Claude Code.
- Works well as a responsive web app on phone and desktop.
- Can become a PWA later so it feels app-like on the phone.
- Keeps early cost low.

## MVP Screens

1. **Dashboard**
   - Latest round
   - Average score
   - Best score
   - Rounds played
   - Cost this season
   - Quick “Add by Voice” button

2. **Add Entry**
   - Dictation/text input
   - Parsed preview
   - Save/edit flow

3. **Journal Timeline**
   - Rounds
   - Practice sessions
   - Workouts
   - Filters by type/course/date

4. **Round Detail**
   - Score
   - Course
   - Date/time
   - Cost
   - Weather
   - Notes
   - What worked / what did not

5. **Insights**
   - Score trend
   - Best/worst courses
   - Average cost
   - Common misses
   - Practice/workout correlation notes

6. **Settings / Export**
   - Export JSON/CSV
   - Data backup
   - AI provider settings later

## First Build Goal

Build a usable web app where the user can:

1. Add a dictated round.
2. See the parsed structured result.
3. Edit any field.
4. Save it to local storage.
5. View all rounds in a journal list.
6. See basic stats.

## Example Round Data

```json
{
  "type": "round",
  "courseName": "Timber Creek",
  "date": "2026-05-23",
  "teeTime": "05:50",
  "holes": 18,
  "tees": "white",
  "score": 86,
  "walking": true,
  "cost": 44,
  "weather": {
    "temperatureF": null,
    "conditions": null,
    "windMph": null
  },
  "notes": "Best round ever. Walked 18. Driver was decent, irons were good, putting was shaky.",
  "tags": ["best-round", "walking", "early-morning"]
}
```

## Development Workflow

Use this repo as the source of truth. Codex or Claude Code should read these docs before making changes.

Recommended order:

1. Read `docs/PRD.md`
2. Read `docs/DATA_MODEL.md`
3. Read `docs/AI_VOICE_PARSER.md`
4. Read `docs/DESIGN_SYSTEM.md`
5. Follow `docs/BUILD_PLAN.md`
6. Use `docs/AGENT_ROLES.md` if running multiple coding agents

## Current Status

The first working MVP is now scaffolded as a zero-dependency browser app.

Open `index.html` in a browser to try it. The app supports:

- Dictated/text round parsing
- Editable parsed preview
- Saving rounds to local storage
- Journal cards with edit/delete
- Basic stats and insights
- JSON export

The docs remain the source of truth for the fuller Next.js version.
