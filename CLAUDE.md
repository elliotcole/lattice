# Tuning Lattice — Agent Guide

Interactive just-intonation lattice editor, deployed at tuninglattice.com (GitHub Pages, auto-deploy on push to `main`). Solo project by Elliot (composer); built piecemeal with AI assistance over 6 months. Companion to his book/essay *Tuning the Ear*.

## Current status: staged rebuild in progress

A full audit and 6-phase revision plan lives in **`AUDIT-2026-06.md`** — read it before structural work. Verdict: staged rebuild around an extracted core (strangler pattern), not big-bang rewrite.

**Done: Phase 0** (June 10, 2026) — wiring fixes, hygiene, CI gate, dead code deleted.
**Done: Phase 1** (June 10, 2026) — fixtures checked in (`fixtures/`), preset codec extracted to `src/serialization.js`, 100 vitest round-trip tests (`npm test`), eslint/prettier on extracted code, Vite 8.

**Next action: Phase 2** (§9 of the audit) — extract the shared core (ratio math, spelling, HEJI → monzo + bigint module imported by all three apps). Start with tuner↔overtones while `analyzeRatioForTrueSpelling` is still byte-identical.

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
| `fixtures/` + `tests/` | Creator exports + snapshot-sets; vitest round-trip suite (`npm test`) — the serialization compatibility gate |
| `vite.config.js` | Multi-page build: 6 entries (Vite 8/rolldown). `presentation.html` is NOT an entry |
| `docs/` | Hand-built docs page + design notes |

## Invariants & contracts

- **Serialization is the crown jewel.** One state shape serves URLs, files, presets, snapshots (`buildPresetStateSkeleton` / `applyPresetState`, ~main.js:24784+). Never rename or restructure a persisted field without a versioned migration. `v: 1` is currently written but never read — that changes in Phase 4.
- `scripts/regression-smoke.mjs` (`npm run check:regression`) greps main.js for four literal source lines guarding past bug fixes. If a legit refactor breaks a guard, update the guard in the same commit and say so — don't delete it silently. Replace guards with real tests as Phase 1 lands.
- Known duplication traps: canvas `draw()` (main.js:14201) and SVG export (`buildLayoutSvgString`, main.js:27446) are parallel renderers — **visual changes must be made in both** until Phase 3 unifies them. Ratio/spelling/HEJI code is copy-pasted (and drifted) across main/tuner/overtones — fix in all three or extract first.
- State lives in module globals **and the DOM** (e.g. `fundamentalInput.value`). After mutating state, you must call `draw()` and usually `schedulePresetUrlUpdate()` — forgetting these is the house bug class.

## Rules

- Run `npm test` and `npm run check:regression` before committing; `npm run lint` covers extracted modules.
- Never commit: `dist/`, `node_modules/`, `.venv*/`, `.DS_Store`, `.claude/projects/`.
- Push to `main` deploys to production immediately — don't push unverified work.
- Test changes against a saved Creator JSON round-trip (load → save → load) when touching serialization.
