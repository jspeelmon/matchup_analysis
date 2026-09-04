# MML Matchup Analysis Discoverability Prototype

A high-fidelity, click-through web prototype exploring three ways fans can
discover **Matchup Analysis**:

- **Flow 1 & Flow 2** replace the **Perfect Bracket Tracker** widget on the
  March Madness Live (MML) home screen with a Matchup Analysis
  discoverability widget, in two states — Picks Open and Picks Closed.
  Tapping either widget navigates into a rebuild of the existing Matchup
  Analysis destination screen (Abilene Christian vs. California Baptist).
- **Flow 3** is a regular-season, non-BCG entry point: a compact
  Matchup Analysis widget in the right rail of an NCAA.com article lets fans
  build their own men's or women's Division I matchup from scratch via a
  "Build Your Matchup" modal, then lands on a separate NCAA.com-styled
  Matchup Analysis destination with no bracket-picking controls.

Flow 1 and Flow 2 (their markup, styles, scripts, and destination) were left
completely untouched while adding Flow 3 — Flow 3 uses its own isolated
`css/flow3.css` and `js/flow3.js` files and its own destination page,
`matchup-analysis-ncaa.html`, rather than modifying any shared file's
existing rules or behavior.

## Source of truth

Built from a Figma inspection (Dev Mode: components, auto-layout, spacing,
type styles, color tokens, and layer hierarchy) of:

- **Perfect Bracket Tracker** (`Perfect Bracket Tracker → Delivery`, node
  `1308:32512`) — used for widget placement, sizing, card anatomy (hero panel
  + matchup column + footer), and home-screen swimlane structure.
- **Matchup Analysis** (`Bracket Challenge Game`, node `15968:468648`) — used
  for the destination screen's team lockups, tab bar, score hero, and stat
  rows, and as the content source (teams, seeds, score of 39 vs. 88.4).
- **NCAA.com Article + Right Rail** (`Articles → Delivery`, node
  `2001:48924`) — used for Flow 3's article layout, right-rail width (335px
  outer / 300px content), ad placement, and right-rail navigation module.
- **Option-selection visual reference** (`Bracket Challenge Game`, node
  `15975:612619`) — used only for the "Build Your Matchup" modal's visual
  language (heading treatment, selection-row styling, Calculate button),
  never as a literal team-selector pattern.
- **Men's/Women's toggle reference** (`Women's Integration 2027`, node
  `13:79656`) — used for the toggle's structure, states, and typography.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Launcher linking to all three flows |
| `flow1.html` | MML Home — **Picks Open**. Widget copy: "Compare teams before making your pick." |
| `flow2.html` | MML Home — **Picks Closed**. Widget copy: "Get deeper insights before game time." |
| `matchup-analysis.html` | Shared destination screen for Flow 1 & Flow 2 |
| `flow3.html` | NCAA.com football article — regular season, non-BCG. Compact right-rail widget opens the "Build Your Matchup" modal. |
| `matchup-analysis-ncaa.html` | Flow 3's own destination screen — adapted from the Flow 2 destination, with pick controls, "Make Pick" divider, and BCG messaging removed |

Both home screens keep the widget in the exact swimlane position formerly
occupied by Perfect Bracket Tracker, reuse the same nav/ticker/article-card
patterns, and only vary the widget's state pill, supporting copy, and
contextual messaging — per the "don't design two radically different
widgets" requirement.

## Running it

No build step or dependencies required — it's static HTML/CSS/JS. Serve the
folder with any static file server, e.g.:

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765/index.html`.

## Design system notes

- Colors, spacing, and layout come directly from Figma tokens: `#17171D`
  (ink), `#8F909B` / `#C1C2CA` / `#DFDFE7` (neutrals), `#009CDE` (MML
  accent), and the real **team colors** already defined in the design system
  (`#171F3B` California Baptist, `#582C83` Abilene Christian).
- **Font substitution:** MML's real typeface, *Ringside* (Compressed /
  Condensed / Wide / Regular), is a licensed font not installed in this
  environment, so this prototype substitutes **Oswald** (for the
  Compressed/Condensed display headlines) and **Inter** (for Wide/Regular UI
  and body text) at matching sizes, weights, and letter-spacing to preserve
  the same visual rhythm. Swap the `@font-face`/Google Fonts `<link>` in each
  page's `<head>` for the real Ringside files to get a pixel-exact match.
- The Matchup Analysis Score (39 vs. 88.4), seeds (12 vs. 12), and team
  colors reused on the widget are the same values shown on the real
  destination screen, so the widget's "insight" stat directly foreshadows
  what a user finds after tapping through.

## Flow 3 notes

- The right-rail widget never shows a preset matchup — both "Team" slots are
  neutral placeholders, and the copy explicitly supports both men's and
  women's DI basketball, since the widget can appear next to any article
  (the demonstrated article is about football).
- The "Build Your Matchup" modal defaults to Men's selected, both dropdowns
  empty, and Calculate disabled. Switching the Men's/Women's toggle clears
  both dropdown selections and re-filters both team lists. Selecting a team
  in one dropdown disables it as a duplicate option in the other. Calculate
  only enables once two different teams are selected.
- Regardless of which two teams are chosen, Calculate always lands on the
  California Baptist vs. Abilene Christian content (matching the rest of the
  prototype's fixed destination data) — per the brief, this prototype
  demonstrates the discovery/selection flow, not a live stats engine.
- `matchup-analysis-ncaa.html` is a separate file from `matchup-analysis.html`
  — the original Flow 2 destination is untouched. The NCAA.com version
  removes the radio buttons, "Make Pick" divider, and the BCG "My
  Picks/Leaderboard/Groups" header bar in favor of a simple NCAA.com header,
  and has no video on its Overview tab.
