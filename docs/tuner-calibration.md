# Tuner Calibration Workflow

Use a fixed calibration pack so tuning changes are judged against the same material.

## Recommended loop

1. Record or collect a small pack:
- steady sine
- steady sung vowel
- step jumps
- glissando
- silence/noise

2. For each clip, inspect:
- median cents error
- p95 cents jitter
- lock-on time after step changes
- octave error count
- false voiced rate in silence/noise

3. Adjust analysis constants in `tuner/main.js` and re-run checks.

## Current stability controls added

- Raw pitch init confirmation (`rawInitConfirmFrames`, `rawInitStabilitySemitones`)
- Voiced/unvoiced hysteresis (`voiceEnter*`, `voiceExit*`)
- Onset quarantine (`onsetQuarantineFrames`)
- Confidence-weighted adaptive smoothing in tracking

## Notes

- Keep one canonical filtered pitch for all readouts and labels.
- Prefer low jitter on steady tones over very low-latency noise-following.
- If response is too slow, reduce `voiceExitFrames`/`onsetQuarantineFrames` first, then raise `smoothFollow`.
