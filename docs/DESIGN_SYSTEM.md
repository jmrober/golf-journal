# Design System

## Design Direction

Minimal Golf Journal should feel calm, fast, and premium. It should have the feel of an early morning round: quiet, focused, and clean.

The app should avoid the look of busy sports dashboards. This is a journal and improvement tool first.

## Visual Keywords

- Minimal
- Calm
- Private
- Premium
- Early morning
- Golf notebook
- Caddie-like
- Clean data
- Low friction

## UX Principles

### 1. Primary action is always obvious

The app exists so the user can log quickly. The “Add Entry” action should be visible and easy to reach.

### 2. Cards over tables

On mobile, entries should appear as clean cards. Tables can be used later for desktop export/admin views.

### 3. Show the story and the stat

A round is not just “91.” It is also what happened. Each entry should show both the number and a short human summary.

### 4. Editability builds trust

AI parsing should always be reviewable. Users need to correct fields easily.

### 5. Do not overwhelm early

Only show advanced insights when enough data exists.

## Color Palette

Suggested colors:

```css
--background: #F7F5EF;
--surface: #FFFFFF;
--surface-muted: #ECE7DB;
--text-primary: #17201A;
--text-secondary: #5F675F;
--border: #D9D2C3;
--green-primary: #1F5A3D;
--green-soft: #DDE9DF;
--sand: #D9C7A3;
--warning: #A15C20;
--danger: #9B2C2C;
```

## Typography

Use a modern sans-serif.

Recommended:

- Inter
- Geist
- System UI

Type scale:

```css
--font-xs: 12px;
--font-sm: 14px;
--font-md: 16px;
--font-lg: 20px;
--font-xl: 28px;
--font-2xl: 36px;
```

## Layout

### Mobile First

Primary target is phone usage after a round.

- Max content width: 720px
- Mobile padding: 16px
- Desktop padding: 24px
- Bottom navigation on mobile
- Top nav optional on desktop

## Core Components

### Primary Button

Used for:

- Add Entry
- Parse Entry
- Save Entry

Style:

- Dark green background
- White text
- Rounded corners
- Large touch target

### Secondary Button

Used for:

- Edit
- Cancel
- Export

Style:

- White or transparent background
- Border
- Dark text

### Entry Card

Should show:

- Entry type label
- Date
- Title
- Summary
- Main stat
- Tags

Round card example:

```txt
ROUND · MAY 30
Shadowbrooke
91
Walked 18 · $44 · 5:39 AM
Driver leaked right. Putting okay.
```

### Stat Card

Should show:

- Label
- Value
- Small context

Example:

```txt
Average Score
88.5
Across 2 rounds
```

### Voice Input Box

This should feel like the heart of the app.

Elements:

- Large text area
- Placeholder examples
- Parse button
- Optional microphone hint
- Recent examples later

Placeholder:

```txt
Tell me about your round...
Example: Played Timber Creek Saturday at 5:50 AM, walked 18 from the white tees and shot 86. Driver was decent, putting was shaky.
```

### Parsed Preview

Show the extracted fields in sections:

- Round details
- Performance notes
- Missing fields
- Raw note

Fields should be editable before save.

## Interaction Patterns

### Add Entry Flow

1. User enters dictated text.
2. User taps Parse.
3. App shows preview.
4. Missing fields are highlighted.
5. User edits fields.
6. User saves.

### Empty States

Dashboard empty state:

```txt
No rounds logged yet.
Start by adding your first round.
```

Insights empty state:

```txt
Log a few rounds first. Insights get better after 3–5 rounds.
```

## Tone of Voice

Use simple, direct language.

Good:

- “Add your round”
- “What did you shoot?”
- “Missing score”
- “You usually score better when walking”

Avoid:

- “Optimize performance matrix”
- “Leverage longitudinal analytics”
- “AI has generated a complex improvement framework”

## Accessibility

- Touch targets at least 44px tall.
- Good color contrast.
- Inputs must have labels.
- Do not rely on color alone for errors.
- Support keyboard navigation.

## Design Inspiration

Think:

- Apple Notes simplicity
- Whoop-style readiness cards
- Linear-level polish
- Golf notebook energy
- Early morning tee sheet calm
