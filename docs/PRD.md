# PRD — Minimal Golf Journal

## 1. Product Summary

Minimal Golf Journal is a voice-first golf journal and improvement tracker. It lets a golfer dictate a round, practice session, or workout in plain language and turns that input into structured, searchable data.

The product should help the golfer answer:

- Am I improving?
- Where am I losing strokes?
- Which courses or conditions affect me most?
- How much am I spending on golf?
- Are my practice and workouts helping my scores?

## 2. Target User

The primary user is a recreational golfer who:

- Plays roughly once per week during the season.
- Often walks 18 holes.
- Wants to improve without manually tracking every shot.
- Wants to estimate handicap over time.
- Wants a private journal, not a social golf app.
- Wants to use their phone and voice dictation as much as possible.

## 3. Problem

Golf improvement apps often fail because they demand too much input. Shot tracking, GPS, club-by-club entry, and hole-by-hole scoring can become annoying during a round.

The user usually remembers the important story of the round afterward, but that information disappears unless it is captured quickly.

## 4. Product Promise

The user should be able to open the app after a round and say what happened. Within seconds, the app should create a useful journal entry that can be edited and saved.

## 5. MVP Goals

The MVP should prove that:

1. Voice/text dictation can create reliable structured golf entries.
2. A low-friction journal is more usable than a complex stat tracker.
3. Basic trends become useful after several rounds.
4. The product can be built cheaply without heavy AI usage.

## 6. MVP Feature Set

### 6.1 Add Entry by Voice or Text

The app needs an input box designed for natural dictation.

Supported entry types:

- Round
- Practice session
- Workout
- General note

The app should infer the type when possible.

### 6.2 Round Logging

A round entry should support:

- Course name
- Date
- Tee time
- Holes played
- Tees played
- Score
- Walking or riding
- Cost
- Weather
- Notes
- Tags
- Performance categories
- Sentiment / round rating

Performance categories for MVP:

- Driver / tee shots
- Approach / irons
- Short game
- Putting
- Penalties
- Mental game
- Energy / fitness

### 6.3 Practice Logging

A practice entry should support:

- Date
- Location
- Duration
- Focus area
- Drills
- What felt good
- What needs work
- Notes

Example focus areas:

- Driver
- Irons
- Wedges
- Putting
- Chipping
- Bunker
- Mobility
- Tempo

### 6.4 Workout Logging

A workout entry should support:

- Date
- Workout type
- Duration
- Exercises
- Sets/reps/weight when provided
- Energy level
- Soreness
- Golf relevance

Example workout types:

- Strength
- Mobility
- Core
- Carries
- Zone 2
- VO2 max
- Recovery

### 6.5 Journal Timeline

The user should see a chronological feed of entries.

Each card should show:

- Entry type
- Date
- Main result, such as score or workout name
- Summary line
- Tags

### 6.6 Round Detail

The round detail view should show:

- Course/date/time
- Score and holes
- Cost
- Walking/riding
- Weather
- Notes
- Parsed strengths
- Parsed weaknesses
- Follow-up practice ideas

### 6.7 Basic Insights

MVP insights should include:

- Rounds played
- Average score
- Best score
- Worst score
- Score trend
- Average cost per round
- Total cost
- Walking percentage
- Most common courses
- Most common improvement themes

### 6.8 Data Export

User should be able to export their data as:

- JSON
- CSV later

## 7. Non-Goals for MVP

Do not build these in the first version:

- Live GPS yardage
- Live shot tracking
- Official handicap integration
- Social profiles
- Course booking
- Payment processing
- Native mobile app
- Wearable integration
- Advanced strokes gained
- AI swing analysis from video

## 8. Key User Flows

### Flow 1 — Log a Round

1. User taps “Add Entry.”
2. User dictates round summary.
3. App parses the entry.
4. App displays structured preview.
5. User edits missing or wrong fields.
6. User saves.
7. Entry appears in journal.
8. Stats update.

### Flow 2 — Log Practice

1. User dictates practice session.
2. App identifies entry type as practice.
3. App extracts focus area, duration, drills, and notes.
4. User saves.
5. Practice appears in timeline.

### Flow 3 — Review Improvement

1. User opens Insights.
2. App shows score trend and repeated issues.
3. User sees themes like “putting shaky” or “miss right with driver.”
4. App suggests what to practice next.

## 9. Voice Input Examples

### Round Example

> Played Shadowbrooke at 5:39 in the morning, walked 18, shot 91, cost 44 dollars. Course was expensive and kind of mid. Driver was leaking right, putting was okay, irons were inconsistent.

### Practice Example

> Practiced for 35 minutes in the garage. Focused on driver tempo and starting line. Still missing right but contact felt better.

### Workout Example

> Did a golf workout today. Pull ups, goblet squats, carries, and core. About 35 minutes. Felt good but hips were tight.

## 10. Success Metrics

### Usability

- User can create a round entry in under 30 seconds.
- Parsed preview appears instantly or within a few seconds.
- User can edit any parsed field easily.

### Data Quality

- Course, score, date, holes, and walking/riding parse correctly most of the time.
- The app gracefully handles missing data.
- No entry should be saved without user review in MVP.

### Engagement

- User logs at least 80% of rounds played.
- User returns to Insights after 5+ rounds.
- User exports or reviews journal history by end of season.

## 11. UX Requirements

The app should feel:

- Minimal
- Fast
- Calm
- Premium but not flashy
- Built for early morning golf
- Useful without feeling like homework

## 12. Business Model Later

Possible future pricing:

- Free local journal
- One-time paid pro upgrade
- Low monthly AI insights plan
- Export/report pack
- Private coaching-style recap

The early product should avoid expensive recurring AI calls.
