// Calibration workbench — dev tool for tuning the pitch-detection analysis config.
// Extracted from tuner/main.js (Phase 2.4, audit §9): lazily imported so the
// ~1,000-line workbench stays out of the user bundle until a calibration
// control is first used. main.js owns the mic stream and analysis config;
// everything this module needs from it arrives via initCalibration(context).

// Provided by main.js via initCalibration:
let analysisConfig;
let ANALYSIS_PRESETS;
let clampNumber;
let computeRms;
let detectPitchWithConfig;
let getVoiceGateThresholds;
let median;
let getFundamentalHz;
let getVisualizationSemitoneBounds;
let normalizePitchToRange;
let applyAnalysisConfig;
let hasLiveAudioTrack;
let getMicStream;
let restartMicIfNeeded;
let calibratePanel;
let calibrateToggle;

const calRecordToggle = document.getElementById("cal-record-toggle");
const calPlayToggle = document.getElementById("cal-play-toggle");
const calRunButton = document.getElementById("cal-run");
const calStatus = document.getElementById("cal-status");
const calPlaybackStatus = document.getElementById("cal-playback-status");
const calCandidates = document.getElementById("cal-candidates");
const calWindow = document.getElementById("cal-window");
const calWindowStatus = document.getElementById("cal-window-status");
const calWindowProgress = document.getElementById("cal-window-progress");
const calWindowProgressText = document.getElementById("cal-window-progress-text");
const calWindowProgressFill = document.getElementById("cal-window-progress-fill");

const calibrationState = {
  mediaRecorder: null,
  recordStream: null,
  chunks: [],
  recording: false,
  audioUrl: "",
  playbackAudio: null,
  audioSamples: null,
  sampleRate: 0,
  round: 1,
  grossWinner: null,
  candidateSets: [],
  grossTraceBounds: null,
  isRunning: false,
};
const AUTO_PICK_TOP_CALIBRATION_CANDIDATE = true;

const calibrationRanges = {
  rmsThreshold: [0.003, 0.06],
  rmsWindowFrames: [1, 12],
  correlationThreshold: [0.72, 0.95],
  minFreq: [40, 120],
  maxFreq: [800, 2000],
  jumpThreshold: [0.2, 2.2],
  jumpConfirmFrames: [1, 4],
  medianWindowFrames: [3, 9],
  maxSemitoneStepPerFrame: [0.3, 2.4],
  octaveFlipTolerance: [0.2, 1.2],
  octaveFlipConfirmFrames: [1, 6],
  smoothFollow: [0.05, 0.35],
  stabilityDeadbandCents: [0, 20],
  stabilityFollow: [0.001, 0.12],
  stabilityMinCorrelation: [0.9, 0.999],
  idleDecay: [0.86, 0.985],
  onsetConfirmFrames: [2, 8],
  onsetStabilitySemitones: [0.3, 2.5],
  onsetResetFrames: [3, 24],
  outOfRangeClampConfirmFrames: [1, 6],
  outOfRangeClampCorrelation: [0.9, 0.999],
  discontinuityThresholdSt: [0.8, 8],
  discontinuityConfirmFrames: [1, 8],
  discontinuityOctaveConfirmFrames: [2, 10],
  rawInitConfirmFrames: [1, 6],
  rawInitStabilitySemitones: [0.2, 2.5],
  voiceEnterRmsFactor: [1, 2.5],
  voiceExitRmsFactor: [0.3, 1],
  voiceEnterCorrOffset: [0, 0.12],
  voiceExitCorrOffset: [-0.2, 0],
  voiceEnterFrames: [1, 6],
  voiceExitFrames: [1, 12],
  onsetQuarantineFrames: [0, 8],
  rangeMargin: [0.2, 2.2],
  outOfRangeHoldFrames: [3, 24],
};

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function mutateAround(base, min, max, factor = 0.2, integer = false) {
  const span = max - min;
  const delta = span * factor;
  const next = clampNumber(randomInRange(base - delta, base + delta), min, max, base);
  return integer ? Math.round(next) : next;
}

const calibrationIntegerKeys = new Set([
  "rmsWindowFrames",
  "minFreq",
  "maxFreq",
  "jumpConfirmFrames",
  "onsetConfirmFrames",
  "onsetResetFrames",
  "rawInitConfirmFrames",
  "voiceEnterFrames",
  "voiceExitFrames",
  "onsetQuarantineFrames",
  "discontinuityConfirmFrames",
  "discontinuityOctaveConfirmFrames",
  "outOfRangeHoldFrames",
  "medianWindowFrames",
  "outOfRangeClampConfirmFrames",
]);
const calibrationTunableKeys = new Set([
  "rmsThreshold",
  "rmsWindowFrames",
  "correlationThreshold",
  "jumpThreshold",
  "jumpConfirmFrames",
  "medianWindowFrames",
  "maxSemitoneStepPerFrame",
  "octaveFlipTolerance",
  "octaveFlipConfirmFrames",
  "smoothFollow",
  "stabilityDeadbandCents",
  "stabilityFollow",
  "stabilityMinCorrelation",
  "onsetConfirmFrames",
  "onsetStabilitySemitones",
  "onsetResetFrames",
  "discontinuityThresholdSt",
  "discontinuityConfirmFrames",
  "discontinuityOctaveConfirmFrames",
  "rawInitConfirmFrames",
  "rawInitStabilitySemitones",
  "voiceEnterRmsFactor",
  "voiceExitRmsFactor",
  "voiceEnterCorrOffset",
  "voiceExitCorrOffset",
  "voiceEnterFrames",
  "voiceExitFrames",
  "onsetQuarantineFrames",
  "rangeMargin",
  "outOfRangeHoldFrames",
  "outOfRangeClampConfirmFrames",
  "outOfRangeClampCorrelation",
]);

function normalizeCandidateConfig(config) {
  const normalized = {};
  Object.entries(calibrationRanges).forEach(([key, range]) => {
    const [min, max] = range;
    const fallback = analysisConfig[key];
    const integer = calibrationIntegerKeys.has(key);
    const value = clampNumber(config?.[key], min, max, fallback);
    normalized[key] = integer ? Math.round(value) : value;
  });
  return normalized;
}

function candidateConfigSignature(config) {
  const normalized = normalizeCandidateConfig(config);
  return Object.keys(calibrationRanges)
    .map((key) => `${key}:${Number(normalized[key]).toFixed(calibrationIntegerKeys.has(key) ? 0 : 5)}`)
    .join("|");
}

function getCalibrationMutationSpread(key, roundLabel) {
  const isFine = roundLabel === "fine";
  const base = isFine ? 0.05 : 0.1;
  if (
    key === "rmsThreshold" ||
    key === "correlationThreshold" ||
    key === "smoothFollow" ||
    key === "stabilityFollow" ||
    key === "stabilityMinCorrelation" ||
    key === "voiceEnterCorrOffset" ||
    key === "voiceExitCorrOffset"
  ) {
    return isFine ? 0.03 : 0.07;
  }
  if (
    key === "rmsWindowFrames" ||
    key === "jumpConfirmFrames" ||
    key === "onsetConfirmFrames" ||
    key === "rawInitConfirmFrames" ||
    key === "voiceEnterFrames" ||
    key === "voiceExitFrames" ||
    key === "onsetQuarantineFrames" ||
    key === "outOfRangeHoldFrames" ||
    key === "outOfRangeClampConfirmFrames" ||
    key === "discontinuityConfirmFrames" ||
    key === "discontinuityOctaveConfirmFrames"
  ) {
    return isFine ? 0.02 : 0.05;
  }
  return base;
}

function makeRandomCandidate(base = null, fine = false, spread = 0.2) {
  const roundLabel = fine ? "fine" : "gross";
  const anchor = normalizeCandidateConfig(base || analysisConfig);
  const next = { ...anchor };
  Object.entries(calibrationRanges).forEach(([key, range]) => {
    if (!calibrationTunableKeys.has(key)) {
      return;
    }
    const [min, max] = range;
    const integer = calibrationIntegerKeys.has(key);
    const keySpread = Math.max(0.005, getCalibrationMutationSpread(key, roundLabel) * spread);
    next[key] = mutateAround(anchor[key], min, max, keySpread, integer);
  });
  return normalizeCandidateConfig(next);
}

function buildCalibrationCandidates(roundLabel) {
  const targetCount = roundLabel === "gross" ? 10 : 6;
  const candidates = [];
  const seen = new Set();
  const addCandidate = (config, label) => {
    const normalized = normalizeCandidateConfig(config);
    const signature = candidateConfigSignature(normalized);
    if (seen.has(signature)) {
      return false;
    }
    seen.add(signature);
    candidates.push({ config: normalized, label });
    return true;
  };

  const base = roundLabel === "fine" ? calibrationState.grossWinner || analysisConfig : analysisConfig;
  addCandidate(analysisConfig, "Current");
  if (roundLabel === "fine" && calibrationState.grossWinner) {
    addCandidate(calibrationState.grossWinner, "Gross Winner");
  }
  if (roundLabel === "gross") {
    addCandidate(ANALYSIS_PRESETS.balanced, "Preset Balanced");
    addCandidate(ANALYSIS_PRESETS.stable, "Preset Stable");
    addCandidate(ANALYSIS_PRESETS.responsive, "Preset Responsive");
  }

  let attempts = 0;
  const localSpread = roundLabel === "fine" ? 0.8 : 1;
  while (candidates.length < targetCount && attempts < 80) {
    const candidate = makeRandomCandidate(base, true, localSpread);
    addCandidate(candidate, roundLabel === "fine" ? `Refine ${candidates.length + 1}` : `Mutate ${candidates.length + 1}`);
    attempts += 1;
  }
  while (candidates.length < targetCount) {
    addCandidate(makeRandomCandidate(base, true, roundLabel === "fine" ? 0.65 : 0.85), `Mutate ${candidates.length + 1}`);
  }
  return candidates;
}

function sampleTraceWithConfig(samples, sampleRate, cfg) {
  let frameSize = 4096;
  if (samples.length < frameSize * 2) {
    frameSize = 2048;
  }
  if (samples.length < frameSize * 2) {
    frameSize = 1024;
  }
  const hopSize = Math.max(256, Math.round(frameSize / 4));
  const trace = [];
  const rmsWindow = [];
  let smooth = null;
  let pending = null;
  let pendingFrames = 0;
  let pendingOctave = null;
  let pendingOctaveFrames = 0;
  let acceptedRawSemitone = null;
  let pendingRawJumpSemitone = null;
  let pendingRawJumpFrames = 0;
  let voiced = false;
  let voicedEnterFrames = 0;
  let voicedExitFrames = 0;
  let onsetQuarantineFramesRemaining = 0;
  const medianBuffer = [];
  const onsetBuffer = [];
  let inactiveFrames = 0;
  let outOfRangeCount = 0;
  let validCount = 0;
  let trackedCount = 0;
  let jumpCount = 0;
  let octaveRejectCount = 0;
  let confidenceTotal = 0;
  let usedCount = 0;
  const fundamental = getFundamentalHz();
  const bounds = getVisualizationSemitoneBounds();

  for (let start = 0; start + frameSize < samples.length; start += hopSize) {
    const slice = samples.subarray(start, start + frameSize);
    const rawRms = computeRms(slice);
    rmsWindow.push(rawRms);
    if (rmsWindow.length > Math.max(1, Math.round(cfg.rmsWindowFrames))) {
      rmsWindow.shift();
    }
    const windowedRms = rmsWindow.reduce((sum, value) => sum + value, 0) / rmsWindow.length;
    const detection = detectPitchWithConfig(slice, sampleRate, windowedRms, rawRms, cfg);
    const rawPitchDetected = detection.frequency;
    const hasDetectedRaw = Boolean(rawPitchDetected && Number.isFinite(rawPitchDetected));
    const rawDetectedSemitone =
      hasDetectedRaw && fundamental > 0 ? 12 * Math.log2(rawPitchDetected / fundamental) : null;
    let rawPitch = null;
    if (hasDetectedRaw && fundamental > 0) {
      const rawSemitoneDetected = 12 * Math.log2(rawPitchDetected / fundamental);
      const rawThreshold = Math.max(0.1, Number(cfg.discontinuityThresholdSt) || 2.8);
      const rawConfirmFrames = Math.max(1, Math.round(cfg.discontinuityConfirmFrames || 2));
      const rawOctaveConfirmFrames = Math.max(
        1,
        Math.round(cfg.discontinuityOctaveConfirmFrames || Math.max(rawConfirmFrames + 1, 4))
      );
      const rawOctaveTolerance = Math.max(0.05, Number(cfg.octaveFlipTolerance) || 0.45);
      if (!Number.isFinite(acceptedRawSemitone)) {
        const initConfirmFrames = Math.max(1, Math.round(cfg.rawInitConfirmFrames || 2));
        const initTolerance = Math.max(0.05, Number(cfg.rawInitStabilitySemitones) || 0.9);
        const nearPending =
          Number.isFinite(pendingRawJumpSemitone) &&
          Math.abs(rawSemitoneDetected - pendingRawJumpSemitone) <= initTolerance;
        if (nearPending) {
          pendingRawJumpFrames += 1;
          pendingRawJumpSemitone = pendingRawJumpSemitone * 0.6 + rawSemitoneDetected * 0.4;
        } else {
          pendingRawJumpSemitone = rawSemitoneDetected;
          pendingRawJumpFrames = 1;
        }
        if (pendingRawJumpFrames >= initConfirmFrames && Number.isFinite(pendingRawJumpSemitone)) {
          acceptedRawSemitone = pendingRawJumpSemitone;
          pendingRawJumpSemitone = null;
          pendingRawJumpFrames = 0;
          rawPitch = fundamental * Math.pow(2, acceptedRawSemitone / 12);
        }
      } else {
        const rawJumpDelta = Math.abs(rawSemitoneDetected - acceptedRawSemitone);
        if (rawJumpDelta <= rawThreshold) {
          acceptedRawSemitone = rawSemitoneDetected;
          pendingRawJumpSemitone = null;
          pendingRawJumpFrames = 0;
          rawPitch = rawPitchDetected;
        } else {
          const rawOctaveLike = Math.abs(rawJumpDelta - 12) <= rawOctaveTolerance;
          const rawRequiredFrames = rawOctaveLike ? rawOctaveConfirmFrames : rawConfirmFrames;
          const rawNearPending =
            Number.isFinite(pendingRawJumpSemitone) &&
            Math.abs(rawSemitoneDetected - pendingRawJumpSemitone) <= rawThreshold;
          if (rawNearPending) {
            pendingRawJumpFrames += 1;
            pendingRawJumpSemitone = pendingRawJumpSemitone * 0.65 + rawSemitoneDetected * 0.35;
          } else {
            pendingRawJumpSemitone = rawSemitoneDetected;
            pendingRawJumpFrames = 1;
          }
          if (pendingRawJumpFrames >= rawRequiredFrames && Number.isFinite(pendingRawJumpSemitone)) {
            acceptedRawSemitone = pendingRawJumpSemitone;
            pendingRawJumpSemitone = null;
            pendingRawJumpFrames = 0;
            rawPitch = fundamental * Math.pow(2, acceptedRawSemitone / 12);
          }
        }
      }
    }
    confidenceTotal += detection.correlation || 0;
    usedCount += 1;
    const voicedThresholds = getVoiceGateThresholds(cfg);
    const enterReady =
      Boolean(rawPitch && Number.isFinite(rawPitch)) &&
      windowedRms >= voicedThresholds.enterRms &&
      (detection.correlation || 0) >= voicedThresholds.enterCorr;
    const stayReady =
      Boolean(rawPitch && Number.isFinite(rawPitch)) &&
      windowedRms >= voicedThresholds.exitRms &&
      (detection.correlation || 0) >= voicedThresholds.exitCorr;
    const enterFramesRequired = Math.max(1, Math.round(cfg.voiceEnterFrames || 2));
    const exitFramesRequired = Math.max(1, Math.round(cfg.voiceExitFrames || 5));
    if (!voiced) {
      if (enterReady) {
        voicedEnterFrames += 1;
        if (voicedEnterFrames >= enterFramesRequired) {
          voiced = true;
          voicedEnterFrames = 0;
          voicedExitFrames = 0;
          onsetQuarantineFramesRemaining = Math.max(0, Math.round(Number(cfg.onsetQuarantineFrames) || 0));
          smooth = null;
          pending = null;
          pendingFrames = 0;
          pendingOctave = null;
          pendingOctaveFrames = 0;
          medianBuffer.length = 0;
          onsetBuffer.length = 0;
        }
      } else {
        voicedEnterFrames = 0;
      }
    } else if (stayReady) {
      voicedExitFrames = 0;
    } else {
      voicedExitFrames += 1;
      if (voicedExitFrames >= exitFramesRequired) {
        voiced = false;
        voicedExitFrames = 0;
        voicedEnterFrames = 0;
        onsetQuarantineFramesRemaining = 0;
        smooth = null;
        pending = null;
        pendingFrames = 0;
        pendingOctave = null;
        pendingOctaveFrames = 0;
        medianBuffer.length = 0;
        onsetBuffer.length = 0;
      }
    }

    let inRange = false;
    let pitch = null;
    let rawSemitone = null;
    let displaySemitone = null;
    if (rawPitch && Number.isFinite(rawPitch) && fundamental > 0) {
      rawSemitone = 12 * Math.log2(rawPitch / fundamental);
      const normalized = normalizePitchToRange(
        rawPitch,
        fundamental,
        bounds,
        Math.max(0, cfg.rangeMargin),
        smooth
      );
      inRange = normalized.inRange;
      pitch = inRange ? normalized.frequency : null;
      if (pitch && Number.isFinite(pitch)) {
        validCount += 1;
      }
      if (!inRange) {
        outOfRangeCount += 1;
      }
    }

    const hasUsablePitch = Boolean(voiced && pitch && Number.isFinite(pitch) && detection.reason === "ok");
    const hasRejectedRawJump = voiced && hasDetectedRaw && !rawPitch;
    if (hasUsablePitch || hasRejectedRawJump) {
      inactiveFrames = 0;
    } else {
      inactiveFrames += 1;
    }
    if (inactiveFrames >= Math.max(1, Math.round(cfg.onsetResetFrames || 8))) {
      smooth = null;
      pending = null;
      pendingFrames = 0;
      pendingOctave = null;
      pendingOctaveFrames = 0;
      acceptedRawSemitone = null;
      pendingRawJumpSemitone = null;
      pendingRawJumpFrames = 0;
      medianBuffer.length = 0;
      onsetBuffer.length = 0;
    }

    if (hasUsablePitch && pitch && Number.isFinite(pitch)) {
      const semi = 12 * Math.log2(pitch / fundamental);
      if (!Number.isFinite(smooth)) {
        if (onsetQuarantineFramesRemaining > 0) {
          onsetQuarantineFramesRemaining = Math.max(0, onsetQuarantineFramesRemaining - 1);
          onsetBuffer.length = 0;
        } else {
        const onsetCorrFloor = Math.max(voicedThresholds.enterCorr, 0.93);
        const onsetRmsFloor = Math.max(voicedThresholds.enterRms, (Number(cfg.rmsThreshold) || 0.01) * 2.2);
        const onsetStableFrames = Math.max(1, Math.round(cfg.onsetConfirmFrames || 3));
        const onsetStability = Math.max(0.1, Number(cfg.onsetStabilitySemitones) || 1.1);
        const onsetTrusted = detection.correlation >= onsetCorrFloor && windowedRms >= onsetRmsFloor;
        if (onsetTrusted) {
          onsetBuffer.push(semi);
          if (onsetBuffer.length > onsetStableFrames) {
            onsetBuffer.splice(0, onsetBuffer.length - onsetStableFrames);
          }
          if (onsetBuffer.length >= onsetStableFrames) {
            let minSemi = Infinity;
            let maxSemi = -Infinity;
            for (const value of onsetBuffer) {
              if (value < minSemi) minSemi = value;
              if (value > maxSemi) maxSemi = value;
            }
            if (maxSemi - minSemi <= onsetStability) {
              smooth = median(onsetBuffer);
              onsetBuffer.length = 0;
            }
          }
        } else {
          onsetBuffer.length = 0;
        }
        }
      } else {
        onsetBuffer.length = 0;
      }

      const medianWindowFrames = Math.max(1, Math.round(cfg.medianWindowFrames || 1));
      medianBuffer.push(semi);
      if (medianBuffer.length > medianWindowFrames) {
        medianBuffer.splice(0, medianBuffer.length - medianWindowFrames);
      }
      let candidateSemi = median(medianBuffer);
      if (!Number.isFinite(candidateSemi)) {
        candidateSemi = semi;
      }

      let allowUpdate = true;
      let confirmedOctaveJump = false;
      if (Number.isFinite(smooth)) {
        const octaveTolerance = Math.max(0.05, Number(cfg.octaveFlipTolerance) || 0.45);
        const octaveDelta = Math.abs(Math.abs(candidateSemi - smooth) - 12);
        if (octaveDelta <= octaveTolerance) {
          const jumpThreshold = Math.max(0.01, Number(cfg.jumpThreshold) || 0.65);
          const nearPending =
            Number.isFinite(pendingOctave) && Math.abs(candidateSemi - pendingOctave) <= jumpThreshold;
          if (nearPending) {
            pendingOctaveFrames += 1;
            pendingOctave = pendingOctave * 0.65 + candidateSemi * 0.35;
          } else {
            pendingOctave = candidateSemi;
            pendingOctaveFrames = 1;
          }
          if (pendingOctaveFrames < Math.max(1, Math.round(cfg.octaveFlipConfirmFrames || 3))) {
            allowUpdate = false;
            octaveRejectCount += 1;
          } else {
            confirmedOctaveJump = true;
            if (Number.isFinite(pendingOctave)) {
              candidateSemi = pendingOctave;
            }
            pendingOctave = null;
            pendingOctaveFrames = 0;
          }
        } else {
          pendingOctave = null;
          pendingOctaveFrames = 0;
        }
      }

      if (allowUpdate) {
        if (!Number.isFinite(smooth)) {
          pending = null;
          pendingFrames = 0;
          displaySemitone = null;
        } else {
          const unclampedCandidateSemi = candidateSemi;
          if (!confirmedOctaveJump) {
            const maxStep = Math.max(0.05, Number(cfg.maxSemitoneStepPerFrame) || 0.9);
            const stepDelta = candidateSemi - smooth;
            if (Math.abs(stepDelta) > maxStep) {
              candidateSemi = smooth + Math.sign(stepDelta) * maxStep;
            }
          }
          const jumpThreshold = Math.max(0.01, Number(cfg.jumpThreshold) || 0.65);
          const delta = Math.abs(unclampedCandidateSemi - smooth);
          if (delta <= jumpThreshold) {
            const stableDeadbandSt = Math.max(0, Number(cfg.stabilityDeadbandCents) || 0) / 100;
            const stableFollow = clampNumber(Number(cfg.stabilityFollow), 0.0005, 0.2, 0.02);
            const stableCorrFloor = clampNumber(Number(cfg.stabilityMinCorrelation), 0.8, 0.999, 0.985);
            if (delta <= stableDeadbandSt && Number(detection.correlation) >= stableCorrFloor) {
              smooth = smooth * (1 - stableFollow) + candidateSemi * stableFollow;
              pending = null;
              pendingFrames = 0;
            } else {
              const baseFollow = Number(cfg.smoothFollow);
              const dynamicFollow = Math.min(
                0.95,
                Math.max(0.01, baseFollow + Math.min(0.55, delta * 0.07))
              );
              const corrNorm = clampNumber((Number(detection.correlation) - 0.84) / 0.15, 0, 1, 1);
              const confidenceScale = 0.55 + 0.45 * corrNorm;
              const adaptiveFollow = dynamicFollow * confidenceScale;
              const follow = confirmedOctaveJump ? Math.max(adaptiveFollow, 0.58) : adaptiveFollow;
              smooth = smooth * (1 - follow) + candidateSemi * follow;
              pending = null;
              pendingFrames = 0;
            }
          } else if (Number.isFinite(pending) && Math.abs(unclampedCandidateSemi - pending) <= jumpThreshold) {
            pendingFrames += 1;
            pending = pending * 0.65 + unclampedCandidateSemi * 0.35;
            if (pendingFrames >= Math.max(1, Math.round(cfg.jumpConfirmFrames))) {
              smooth = smooth * 0.65 + pending * 0.35;
              pending = null;
              pendingFrames = 0;
            } else {
              jumpCount += 1;
            }
          } else {
            pending = unclampedCandidateSemi;
            pendingFrames = 1;
            jumpCount += 1;
          }
          displaySemitone = smooth;
        }
      } else {
        pending = null;
        pendingFrames = 0;
      }
    } else if (hasDetectedRaw && !rawPitch && Number.isFinite(smooth)) {
      displaySemitone = smooth;
    } else if (Number.isFinite(smooth)) {
      smooth *= cfg.idleDecay;
      if (!Number.isFinite(smooth) || Math.abs(smooth) > 200) {
        smooth = null;
      }
      pending = null;
      pendingFrames = 0;
      pendingOctave = null;
      pendingOctaveFrames = 0;
      medianBuffer.length = 0;
    }

    trace.push({
      t: start / sampleRate,
      semitone: Number.isFinite(displaySemitone) ? displaySemitone : null,
      rawSemitone,
      rawDetectedSemitone,
      rawPitch,
      inRange,
      reason: detection.reason,
    });
    if (Number.isFinite(displaySemitone)) {
      trackedCount += 1;
    }
  }

  let deltaSum = 0;
  let deltaCount = 0;
  let accelSum = 0;
  let accelCount = 0;
  let octaveFlipCount = 0;
  let extremeJumpCount = 0;
  let prevSemi = null;
  let prevDelta = null;
  let currentRun = 0;
  let maxRun = 0;
  let runTotal = 0;
  let runCount = 0;
  trace.forEach((point) => {
    if (!Number.isFinite(point.semitone)) {
      if (currentRun > 0) {
        runTotal += currentRun;
        runCount += 1;
        maxRun = Math.max(maxRun, currentRun);
      }
      currentRun = 0;
      prevSemi = null;
      prevDelta = null;
      return;
    }
    currentRun += 1;
    if (Number.isFinite(prevSemi)) {
      const delta = point.semitone - prevSemi;
      const absDelta = Math.abs(delta);
      deltaSum += absDelta;
      deltaCount += 1;
      if (absDelta >= 1.8) {
        extremeJumpCount += 1;
      }
      if (Math.abs(absDelta - 12) <= Math.max(0.4, (cfg.octaveFlipTolerance || 0.45) * 1.35)) {
        octaveFlipCount += 1;
      }
      if (Number.isFinite(prevDelta)) {
        accelSum += Math.abs(delta - prevDelta);
        accelCount += 1;
      }
      prevDelta = delta;
    }
    prevSemi = point.semitone;
  });
  if (currentRun > 0) {
    runTotal += currentRun;
    runCount += 1;
    maxRun = Math.max(maxRun, currentRun);
  }

  const meanDelta = deltaCount ? deltaSum / deltaCount : 0;
  const meanAccel = accelCount ? accelSum / accelCount : 0;
  const meanRun = runCount ? runTotal / runCount : 0;
  const confidenceMean = usedCount ? confidenceTotal / usedCount : 0;
  const trackingCoverage = trace.length ? trackedCount / trace.length : 0;
  const lowCoveragePenalty = trackingCoverage < 0.45 ? (0.45 - trackingCoverage) * 320 : 0;
  const score =
    validCount * 2.3 +
    trackingCoverage * 260 +
    confidenceMean * 80 +
    maxRun * 0.8 +
    meanRun * 0.35 -
    lowCoveragePenalty -
    jumpCount * 2.4 -
    outOfRangeCount * 1.35 -
    meanDelta * 36 -
    meanAccel * 20 -
    extremeJumpCount * 16 -
    octaveFlipCount * 24 -
    octaveRejectCount * 10;
  return {
    trace,
    score,
    metrics: {
      validCount,
      jumpCount,
      outOfRangeCount,
      confidenceMean,
      meanDelta,
      meanAccel,
      octaveFlipCount,
      extremeJumpCount,
      octaveRejectCount,
      maxRun,
      meanRun,
      trackingCoverage,
    },
  };
}

function isUsableCalibrationCandidate(result) {
  if (!result || !Array.isArray(result.trace) || !result.trace.length) {
    return false;
  }
  const tracked = result.trace.filter((point) => Number.isFinite(point.semitone)).length;
  const minTracked = Math.max(12, Math.round(result.trace.length * 0.14));
  const coverage = Number(result.metrics?.trackingCoverage) || 0;
  const extremeJumps = Number(result.metrics?.extremeJumpCount || 0);
  return (
    tracked >= minTracked &&
    coverage >= 0.2 &&
    Number(result.metrics?.validCount || 0) >= 1 &&
    extremeJumps <= Math.max(8, Math.round(tracked * 0.1))
  );
}

function clearCalibrationCandidates() {
  if (calCandidates) {
    calCandidates.innerHTML = "";
  }
}

function setCalibrationStatus(text) {
  if (calStatus) {
    calStatus.textContent = text;
  }
}

function setCalibrationWindowStatus(text) {
  if (calWindowStatus) {
    calWindowStatus.textContent = text || "";
  }
}

function setCalibrationProgress(active, completed = 0, total = 1, text = "") {
  if (calWindowProgress) {
    calWindowProgress.hidden = !active;
  }
  if (calWindowProgressText) {
    calWindowProgressText.textContent = text || "Running calibration...";
  }
  if (calWindowProgressFill) {
    const safeTotal = Math.max(1, Number(total) || 1);
    const safeCompleted = clampNumber(Number(completed), 0, safeTotal, 0);
    const percent = (safeCompleted / safeTotal) * 100;
    calWindowProgressFill.style.width = `${percent.toFixed(1)}%`;
  }
}

async function yieldToUi() {
  await new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function setCalibrationRunning(active) {
  calibrationState.isRunning = Boolean(active);
  if (calRunButton) {
    calRunButton.disabled = calibrationState.isRunning;
  }
}

function setCalibrationPlaybackStatus(text) {
  if (calPlaybackStatus) {
    calPlaybackStatus.textContent = text;
  }
}

function updateCalPlayButton() {
  if (!calPlayToggle) {
    return;
  }
  const isPlaying = Boolean(
    calibrationState.playbackAudio && !calibrationState.playbackAudio.paused
  );
  calPlayToggle.textContent = isPlaying ? "Pause Rec" : "Play Rec";
}

function cleanupCalibrationPlayback() {
  if (calibrationState.playbackAudio) {
    calibrationState.playbackAudio.pause();
    calibrationState.playbackAudio.src = "";
    calibrationState.playbackAudio = null;
  }
  if (calibrationState.audioUrl) {
    URL.revokeObjectURL(calibrationState.audioUrl);
    calibrationState.audioUrl = "";
  }
  updateCalPlayButton();
  setCalibrationPlaybackStatus("Playback: --");
}

function setCalibrationFocus(enabled) {
  const open = Boolean(enabled);
  document.body.classList.toggle("calibration-focus", open);
  if (calWindow) {
    calWindow.hidden = !open;
  }
}

function onCalibrationCandidatePicked(candidate, roundLabel) {
  if (roundLabel === "gross") {
    calibrationState.grossWinner = candidate.config;
    calibrationState.round = 2;
    void runCalibrationCandidates();
    return;
  }
  applyAnalysisConfig(candidate.config);
  setCalibrationStatus("Calibration applied. You can repeat to refine further.");
  setCalibrationWindowStatus("Calibration applied.");
  setCalibrationProgress(false, 0, 1, "");
  if (calibratePanel) {
    calibratePanel.hidden = true;
  }
  if (calibrateToggle) {
    calibrateToggle.classList.remove("button-on");
  }
  setCalibrationFocus(false);
}

async function runCalibrationCandidates() {
  if (!calibrationState.audioSamples || !calibrationState.sampleRate) {
    setCalibrationStatus("Record a sample first.");
    return;
  }
  if (calibrationState.isRunning) {
    return;
  }
  setCalibrationRunning(true);
  try {
    setCalibrationFocus(true);
    const roundLabel = calibrationState.round <= 1 ? "gross" : "fine";
    const generated = buildCalibrationCandidates(roundLabel);
    setCalibrationProgress(true, 0, generated.length, `Scoring ${roundLabel} candidates...`);
    setCalibrationStatus(`Running ${roundLabel} calibration...`);
    setCalibrationWindowStatus(`Running ${roundLabel} calibration...`);
    await yieldToUi();
    const scored = [];
    for (let i = 0; i < generated.length; i += 1) {
      const entry = generated[i];
      const config = entry.config;
      const result = sampleTraceWithConfig(calibrationState.audioSamples, calibrationState.sampleRate, config);
      scored.push({ config, label: entry.label, result });
      setCalibrationProgress(true, i + 1, generated.length, `Scoring ${roundLabel} candidates... ${i + 1}/${generated.length}`);
      await yieldToUi();
    }
  const seen = new Set(scored.map((candidate) => candidateConfigSignature(candidate.config)));
  const usable = scored
    .filter((candidate) => isUsableCalibrationCandidate(candidate.result))
    .sort((a, b) => b.result.score - a.result.score);
  const seedConfig =
    (usable.length ? usable[0].config : null) ||
    (roundLabel === "fine" ? calibrationState.grossWinner : null) ||
    analysisConfig;
  let extraAttempts = 0;
  while (usable.length < 6 && extraAttempts < 180) {
    const spread = roundLabel === "fine" ? 0.55 : 0.75;
    const cfg = makeRandomCandidate(seedConfig, true, spread);
    const sig = candidateConfigSignature(cfg);
    if (seen.has(sig)) {
      extraAttempts += 1;
      continue;
    }
    seen.add(sig);
    const result = sampleTraceWithConfig(calibrationState.audioSamples, calibrationState.sampleRate, cfg);
    if (isUsableCalibrationCandidate(result)) {
      usable.push({ config: cfg, label: `${roundLabel === "fine" ? "Refine" : "Mutate"} extra ${usable.length + 1}`, result });
      usable.sort((a, b) => b.result.score - a.result.score);
    }
    extraAttempts += 1;
    if (extraAttempts % 3 === 0) {
      setCalibrationProgress(true, Math.min(generated.length, usable.length), generated.length, `Refining viable candidates... ${usable.length}/6`);
      await yieldToUi();
    }
  }
  const candidates = usable.slice(0, 6);
  calibrationState.candidateSets = candidates;
  const scoredTop = scored.slice().sort((a, b) => b.result.score - a.result.score)[0];
  const top = candidates[0] || scoredTop || null;
  if (AUTO_PICK_TOP_CALIBRATION_CANDIDATE && top) {
    const roundName = roundLabel === "gross" ? "gross" : "fine";
    setCalibrationRunning(false);
    setCalibrationProgress(true, 1, 1, `Applying best ${roundName} candidate...`);
    setCalibrationStatus(`Auto-selecting top ${roundName} candidate (${top.result.score.toFixed(1)}).`);
    setCalibrationWindowStatus(`Auto-selecting top ${roundName} candidate.`);
    onCalibrationCandidatePicked(top, roundLabel);
    return;
  }
  setCalibrationStatus("Calibration could not find a reliable candidate. Try recording again.");
  setCalibrationWindowStatus("No reliable candidate found.");
    setCalibrationRunning(false);
    setCalibrationProgress(false, 0, 1, "");
  } catch (_error) {
    setCalibrationRunning(false);
    setCalibrationProgress(false, 0, 1, "");
    setCalibrationStatus("Calibration failed. Try recording again.");
    setCalibrationWindowStatus("Calibration failed.");
  }
}

function resetCalibration() {
  cleanupCalibrationPlayback();
  setCalibrationRunning(false);
  calibrationState.round = 1;
  calibrationState.grossWinner = null;
  calibrationState.candidateSets = [];
  calibrationState.grossTraceBounds = null;
  calibrationState.audioSamples = null;
  calibrationState.sampleRate = 0;
  clearCalibrationCandidates();
  setCalibrationProgress(false, 0, 1, "");
  setCalibrationStatus("Record 10-20s of your source, then calibrate.");
  setCalibrationWindowStatus("");
  setCalibrationFocus(false);
}

async function decodeRecordedCalibrationAudio(blob) {
  cleanupCalibrationPlayback();
  calibrationState.audioUrl = URL.createObjectURL(blob);
  calibrationState.playbackAudio = new Audio(calibrationState.audioUrl);
  calibrationState.playbackAudio.addEventListener("timeupdate", () => {
    const audio = calibrationState.playbackAudio;
    if (!audio) return;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const total = Number.isFinite(audio.duration) ? audio.duration : 0;
    setCalibrationPlaybackStatus(`Playback: ${current.toFixed(1)}s / ${total.toFixed(1)}s`);
  });
  calibrationState.playbackAudio.addEventListener("ended", () => {
    updateCalPlayButton();
  });
  updateCalPlayButton();
  setCalibrationPlaybackStatus("Playback: ready");
  const ctxLocal = new AudioContext();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await ctxLocal.decodeAudioData(arrayBuffer);
    const channel = audioBuffer.getChannelData(0);
    calibrationState.audioSamples = new Float32Array(channel);
    calibrationState.sampleRate = audioBuffer.sampleRate;
    setCalibrationFocus(false);
    setCalibrationStatus(
      `Recorded ${(audioBuffer.duration).toFixed(1)}s @ ${Math.round(audioBuffer.sampleRate)} Hz. Ready to calibrate.`
    );
    setCalibrationWindowStatus("Ready to calibrate.");
  } finally {
    await ctxLocal.close();
  }
}

async function toggleCalibrationRecording() {
  if (calibrationState.recording) {
    calibrationState.mediaRecorder.stop();
    return;
  }
  let streamLocal = null;
  const liveStream = getMicStream();
  if (hasLiveAudioTrack(liveStream)) {
    const clonedTrack = liveStream.getAudioTracks()[0].clone();
    streamLocal = new MediaStream([clonedTrack]);
  } else {
    streamLocal = await navigator.mediaDevices.getUserMedia({ audio: true });
  }
  const recorder = new MediaRecorder(streamLocal);
  calibrationState.recordStream = streamLocal;
  calibrationState.mediaRecorder = recorder;
  calibrationState.chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      calibrationState.chunks.push(event.data);
    }
  };
  recorder.onstop = async () => {
    calibrationState.recording = false;
    if (calRecordToggle) {
      calRecordToggle.textContent = "Start Rec";
    }
    const blob = new Blob(calibrationState.chunks, { type: recorder.mimeType || "audio/webm" });
    streamLocal.getTracks().forEach((track) => track.stop());
    await restartMicIfNeeded();
    await decodeRecordedCalibrationAudio(blob);
  };
  recorder.start();
  calibrationState.recording = true;
  if (calRecordToggle) {
    calRecordToggle.textContent = "Stop Rec";
  }
  setCalibrationStatus("Recording... perform your short test phrase.");
}

async function toggleCalibrationPlayback() {
  const audio = calibrationState.playbackAudio;
  if (!audio) {
    setCalibrationPlaybackStatus("Playback: no recording");
    return;
  }
  if (audio.paused) {
    await audio.play();
  } else {
    audio.pause();
  }
  updateCalPlayButton();
}
export function initCalibration(context) {
  ({
    analysisConfig,
    ANALYSIS_PRESETS,
    clampNumber,
    computeRms,
    detectPitchWithConfig,
    getVoiceGateThresholds,
    median,
    getFundamentalHz,
    getVisualizationSemitoneBounds,
    normalizePitchToRange,
    applyAnalysisConfig,
    hasLiveAudioTrack,
    getMicStream,
    restartMicIfNeeded,
    calibratePanel,
    calibrateToggle,
  } = context);
  return {
    setCalibrationFocus,
    setCalibrationStatus,
    toggleRecording: toggleCalibrationRecording,
    togglePlayback: toggleCalibrationPlayback,
    run: runCalibrationCandidates,
    reset: resetCalibration,
    setPlaybackStatus: setCalibrationPlaybackStatus,
  };
}
