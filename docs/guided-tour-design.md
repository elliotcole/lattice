# Guided Tour — Design

Status: agreed, Phase 1 in progress.

## Core concept

A pure-overlay guide layer, completely separate from the snapshot/preset
infrastructure. Steps are instructional bubbles that sit on top of a
fully-interactive app. No state seeding, no snapshot restore, no state mutation
of any kind. The user's lattice is whatever they made — the tour never touches
it.

The tour replaces the current preset-based tour (`startTour()` at
`src/main.js:4009`), which loads a preset per stage and therefore destroys
whatever the user was building. The whole point of the redesign: teach the
user verbs ("shift-click to create a note", "press space to play") without
ever wiping their work.

## Anchoring

- Edge-anchored screen-space positioning:
  `{ corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center" | "left-center" | "right-center", dx, dy }`.
- One position per step, fixed in screen space. No world-tracking, no
  element-tracking.
- No tails, no arrows, no pointing at specific elements — bubble copy tells
  the user what to look at.
- Default anchor (when a step omits one):
  `{ corner: "top-right", dx: -24, dy: 24 }`.

## Flow control

- **Next**: Next button + Right arrow.
- **Back**: Back button + Left arrow (symmetric).
- **Skip/exit**: *not* in the bubble. Lives in the separate tour banner — see
  below.
- **Escape**: does *not* advance or skip the tour. Escape stays useful for
  other app behaviors.
- **Final step**: a synthetic closing card (`isFinal: true` on the step) where
  Next becomes "Done".
- **No resume**: tour always starts at step 1, every time. No mid-tour
  persistence.
- **No auto-dismiss on interaction**: bubble stays up until the user
  explicitly advances or exits. The user can interact with the app freely
  while the bubble is visible.

## Keybind scoping

Right/Left arrow are claimed by the tour only when:

- no text input / `<textarea>` / `contenteditable` has focus, AND
- no interaction mode is active (reuse `getInteractionMode()` from
  `src/main.js:20032`).

## Tour banner (separate DOM element)

- New DOM element, **not** shared with the existing `#banner-message`.
- Lives in `.hint-row`, visually adjacent to the existing banner.
- Content: `Guided tour i/n · [Explore on my own]` where the link exits the
  tour.
- Always visible during a tour, independent of any interaction-mode banner.
  No precedence math, no mutual exclusion.
- Rationale: if the tour banner shared priority with interaction-mode
  banners, the "Explore on my own" affordance could vanish exactly when a
  confused user most wants it (e.g. they enter alignment mode by accident
  mid-tour). Isolation is cheaper than integration.

## Stacking

```
welcome overlay  >  chrome/menus  >  tour bubble  >  canvas
```

Bubble goes **under** chrome so user dropdowns always win. Rationale: the
user has recourse to close their own menu, so a menu covering the bubble is
recoverable; a bubble covering a menu is not.

## Click-through

Bubble captures clicks on itself only. Everything else passes through to the
app. No backdrop, no dimming.

## Step schema

```js
{
  id: "create-notes",
  title: "Create notes",                          // optional
  body: "Shift-click anywhere on the lattice\nto create a note.",
                                                  // \n renders as line break via
                                                  // white-space: pre-wrap
  anchor: { corner: "top-right", dx: -24, dy: 24 }, // optional, has default
  isFinal: true,                                  // optional, only on closing step
}
```

No `onEnter`/`onExit`/`waitFor`/`highlightSelector`. Add those fields the
moment a step demands them, not before.

## Data location

`src/tour-steps.js` — separate JS module, static ES import, exports a const
array. JS over JSON so copy can use template literals and comments. Separate
file so `main.js` (already ~20k lines) doesn't grow.

First pass is hand-written in a text editor. In-app editor comes in Phase 2.

## Learn & Get Help modal

- Replaces the "Read Docs" link at `index.html:267`.
- New `<dialog>` element reusing the existing `.custom-ratio-dialog` base
  class, matching the Find Interval dialog pattern at `index.html:1567`.
- Opened by clicking "Learn & Get Help" button.
- Closed by X, click-backdrop, or Escape.
- MVP content:
  - **User's Guide** → opens `/docs/` in a new tab
  - **Guided Tour** → calls `startTour()` (the new runner)
  - **Video Demo** → grayed out placeholder (coming soon)
  - **Snapshot Demo** → grayed out placeholder (coming soon)

## Welcome overlay integration

The existing welcome overlay's "Take a tour" button gets rewired from the
current preset-loading `startTour()` to the new tour runner. Existing
`WELCOME_STORAGE_KEY` first-visit auto-show behavior is preserved.

## Retirement

Removed/replaced:
- `startTour()` at `src/main.js:4009` (preset-loading version)
- `findTourPresetEntry()` at `src/main.js:3997`
- The `__tour` / `tour`-tagged preset lookup

Kept (rewired):
- `window.replayTour` global → calls the new runner.
- `showWelcomeOverlay`, `hideWelcomeOverlay`, `markWelcomed` — unchanged.

## In-app edit mode (Phase 2)

Not in Phase 1, but scoped:

- Entered via `window.tourEdit()` console function or an "Edit tour" button
  in Learn & Get Help.
- Inline contenteditable on bubble body. Enter inserts newline.
- Bubble is draggable on its chrome; on release, system computes nearest
  viewport corner + dx/dy offset and writes to the step.
- Toolbar on the bubble: `+ add step after`, `✕ delete`, `↓ duplicate`,
  reorder arrows, `📋 Export`, `◀ prev` / `next ▶`.
- Drafts autosave (debounced) to `localStorage` under a versioned key. On
  page load in edit mode, drafts override the committed module; outside edit
  mode, drafts are ignored.
- Export serializes the draft to a formatted
  `export const tourSteps = [ ... ]` snippet and copies it to the clipboard.
  The user pastes into `src/tour-steps.js` and commits.
- `window.clearTourDraft()` console function to wipe the draft.

## Implementation phasing

**Phase 1 — working tour (no authoring tools):**

1. Core tour runner + bubble rendering + Next/Back + arrow-key handling
2. Tour banner element with progress + Explore-on-my-own link
3. `src/tour-steps.js` with a hand-written first-draft sequence
4. Learn & Get Help `<dialog>`, replacing Read Docs
5. Welcome overlay "Take a tour" rewired to new runner
6. Retirement of old preset-based tour code

**Phase 2 — in-app authoring:**

7. Edit mode (inline contenteditable, drag-to-reposition, localStorage
   drafts, clipboard export)
