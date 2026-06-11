# Tuning Lattice — Agent Guide

Interactive just-intonation lattice editor, deployed at tuninglattice.com (GitHub Pages, auto-deploy on push to `main`). Solo project by Elliot (composer); built piecemeal with AI assistance over 6 months. Companion to his book/essay *Tuning the Ear*.

## Current status: staged rebuild in progress

A full audit and 6-phase revision plan lives in **`AUDIT-2026-06.md`** — read it before structural work. Verdict: staged rebuild around an extracted core (strangler pattern), not big-bang rewrite.

**Done: Phase 0** (June 10, 2026) — wiring fixes, hygiene, CI gate, dead code deleted.
**Done: Phase 1** (June 10, 2026) — fixtures checked in (`fixtures/`), preset codec extracted to `src/serialization.js`, 100 vitest round-trip tests (`npm test`), eslint/prettier on extracted code, Vite 8.

**Done: Phase 2** (June 10–11, 2026) — `src/lib/pitch.js` (ratio math, ET mapping, spelling, HEJI) imported by all three apps, ~1,080 duplicated lines gone, drift decisions documented in its header. Tuner calibration workbench split into lazy-loaded `tuner/calibration.js` (2.4) — loads on first use, tuner entry 68→56 kB. Shared `src/theme.css` token sheet @imported by all five surfaces (2.3) — exactly-agreeing tokens only; remaining drift documented in its header (panel family, overtones muted-ink, viz-grid dark, satellites' text-primary). Audit 2.3's type/spacing/z-index scales and main-app alias-layer deletion are NOT done — they land with Phase 3 styling work. The monzo+bigint exact-arithmetic representation is also NOT done — pitch.js shares the float-based logic; exact arithmetic lands with Phase 3/4 restructuring.

**Next action: Phase 3.**

Decisions already made (don't re-ask):
- Tech: open to anything; TypeScript welcome.
- Compatibility: old saved files may break **only if** a migration script converts them. Elliot has 40+ exported Creator JSONs in `~/Library/CloudStorage/Dropbox/_Projects/Tuning the Ear/Diagrams/` — these must keep loading (check them in as test fixtures, Phase 1).
- Scope: main app, tuner, overtones, tuning-the-ear deck, and docs are all in play.

## Repo map

| Path | What |
|---|---|
| `index.html` + `src/main.js` | Main editor. **main.js is 33k lines / 1MB — beyond a single read window. Never read it whole; grep for line numbers, read targeted slices. Do not let it grow.** |
| `src/style.css` | 4,733 lines; token system at top, five themes via `body[data-theme]` |
| `tuner/` | Standalone mic tuner (own monolith, `mobile/` variant, UA-sniff redirect) |
| `overtones/` | Overtone explorer (imports `src/custom-oscillators.js` — only cross-app sharing) |
| `tuning-the-ear/` + `src/tuning-the-ear/` | Book-companion diagram deck; imported from Dropbox via `scripts/import-tuning-the-ear.mjs` (hardcoded path) |
| `src/tour-steps.js` | Declarative tour content — the pattern to emulate |
| `src/serialization.js` | Preset codec (encode/decode + LZ-string), pure, extracted Phase 1 |
| `src/lib/pitch.js` | Shared pitch core: note tables, ratio math, ET/spelling, HEJI — imported by main, tuner, overtones. Drift decisions documented in its header |
| `fixtures/` + `tests/` | Creator exports + snapshot-sets; vitest round-trip suite (`npm test`) — the serialization compatibility gate |
| `vite.config.js` | Multi-page build: 6 entries (Vite 8/rolldown). `presentation.html` is NOT an entry |
| `docs/` | Hand-built docs page + design notes |

## Invariants & contracts

- **Serialization is the crown jewel.** One state shape serves URLs, files, presets, snapshots (`buildPresetStateSkeleton` / `applyPresetState`, ~main.js:24784+). Never rename or restructure a persisted field without a versioned migration. `v: 1` is currently written but never read — that changes in Phase 4.
- `scripts/regression-smoke.mjs` (`npm run check:regression`) greps main.js for four literal source lines guarding past bug fixes. If a legit refactor breaks a guard, update the guard in the same commit and say so — don't delete it silently. Replace guards with real tests as Phase 1 lands.
- Known duplication traps: canvas `draw()` and SVG export (`buildLayoutSvgString`) are parallel renderers — **visual changes must be made in both** until Phase 3 unifies them. Ratio/spelling/HEJI math now lives in `src/lib/pitch.js` (shared by all three apps) — change it there, never re-inline copies. main.js's `getHejiAnnotation` (DOM-bound) is still local but consumes the shared rules/helpers.
- State lives in module globals **and the DOM** (e.g. `fundamentalInput.value`). After mutating state, you must call `draw()` and usually `schedulePresetUrlUpdate()` — forgetting these is the house bug class.

## Rules

- Run `npm test` and `npm run check:regression` before committing; `npm run lint` covers extracted modules.
- Never commit: `dist/`, `node_modules/`, `.venv*/`, `.DS_Store`, `.claude/projects/`.
- Push to `main` deploys to production immediately — don't push unverified work.
- Test changes against a saved Creator JSON round-trip (load → save → load) when touching serialization.
