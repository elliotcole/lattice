# Revision Audit - Step 1 (Baseline + Hotspots)

Date: 2026-02-16

## Scope
- No behavior changes.
- Establish baseline size/complexity and identify low-risk refactor seams.

## Baseline
- Main application logic is concentrated in `src/main.js` (~27,821 lines).
- Total `src/*.js` + `src/*.css`: ~31,180 lines.
- Build currently passes (`npm run build`).

## Hotspots (Largest Functions in `src/main.js`)
Approximate line spans from static scan:
- `closeLayoutFontPopover` (~1419 lines)
- `queuePresetFontRecalc` (~1399 lines)
- `applyPresetState` (~1152 lines)
- `resetLattice` (~1106 lines)
- `draw` (~865 lines)
- `onPointerDown` (~643 lines)
- `onPointerUp` (~500 lines)
- `getPresetState` (~467 lines)
- `applyFundamentalSpelling` (~426 lines)
- `onPointerMove` (~353 lines)

## Coupling Signals
- URI update calls are heavily distributed (`schedulePresetUrlUpdate`/`updatePresetUrl` callsites are numerous), which increases regression risk when touchpoints change.
- Input handling (`onPointerDown`/`onPointerMove`/`onPointerUp`) and rendering (`draw`) are large and tightly coupled to many state concerns.
- Preset serialization/deserialization (`getPresetState`/`applyPresetState`) are central and broad, making schema drift a key risk area.

## Immediate Low-Risk Refactor Targets
1. Extract pure helpers from large functions without changing call order:
   - `getPresetState` / `applyPresetState`: split by domain (`layout`, `audio`, `tuner`, `line labels`, `custom nodes`).
2. Centralize URI scheduling:
   - Introduce one small wrapper used by all UI mutation paths to reduce missed updates and duplicate calls.
3. Pointer pipeline cleanup:
   - Extract shared drag/session bookkeeping used by pointer handlers.
4. Draw pipeline segmentation:
   - Separate scene passes (`nodes`, `edges`, `labels`, overlays) behind pure render helpers.

## Guardrails For Next Step
- Preserve URL schema and backward compatibility.
- Keep refactors mechanical and incremental (no user-facing behavior changes per PR/commit).
- After each extraction:
  - Run `npm run build`.
  - Smoke test: pointer drag/release, custom node drag, line-label drag, refresh/copy-link restore.

## Proposed Step 2
- Start with serialization seam extraction:
  - Create small pure modules/helpers for preset `layout` and `line-label` state encode/decode.
  - Keep current function signatures and call sites intact.
