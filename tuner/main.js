import {
  noteNamesSharp,
  noteNamesFlat,
  noteNames,
  LETTERS,
  LETTER_TO_SEMITONE,
  TRUE_SPELLING_INTERVALS,
  HEJI_RULES,
  mod,
  floorDiv,
  gcd,
  reduceFraction,
  parseRatioInput,
  normalizeRatioToOctave,
  midiToFrequency,
  getNearestEtInfo,
  parsePitchClass,
  accidentalToString,
  buildPitchClass,
  getPitchClassSemitoneValue,
  analyzeRatioForTrueSpelling,
  getTrueSpellingLimit,
  getAccidentalType,
  axisMatches,
  getHejiAnnotationForAxisRatios,
} from "../src/lib/pitch.js";
const FUNDAMENTAL_CUSTOM_VALUE = "hz";
const PRIMES_UP_TO_97 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83,
  89, 97,
];
const PRIME_FAMILY_COLOR_OVERRIDES = new Map([
  [3, "#1f3fbf"], // deep blue
  [5, "#228b22"], // forest green
  [7, "#7b2cbf"], // purple
  [11, "#ff8c00"], // orange
  [13, "#4fc3ff"], // light blue
]);
const PRIME_FAMILY_COLORS = new Map(
  PRIMES_UP_TO_97.map((prime, index) => {
    const override = PRIME_FAMILY_COLOR_OVERRIDES.get(prime);
    if (override) {
      return [prime, override];
    }
    const hue = Math.round((index * 137.508) % 360);
    const saturation = 68;
    const lightness = 58;
    return [prime, `hsl(${hue} ${saturation}% ${lightness}%)`];
  })
);

const startBtn = document.getElementById("startBtn");
const tunerToggle = document.getElementById("tuner-toggle");
const leftRail = document.querySelector(".left-rail");
const micPowerToggle = document.getElementById("mic-power-toggle");
const micOverlay = document.getElementById("mic-overlay");
const activateMicLink = document.getElementById("activate-mic-link");
const statusEl = document.getElementById("status");
const hzEl = document.getElementById("hz");
const noteEl = document.getElementById("note");
const centsEl = document.getElementById("cents");
const outOfRangeReadoutEl = document.getElementById("out-of-range-readout");
const selfTestCard = document.getElementById("self-test-card");
const selfTestGoodEl = document.getElementById("self-test-good");
const selfTestWarnEl = document.getElementById("self-test-warn");
const selfTestBadEl = document.getElementById("self-test-bad");

const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const fundamentalOctaveDown = document.getElementById("fundamental-octave-down");
const fundamentalOctaveUp = document.getElementById("fundamental-octave-up");
const a4Input = document.getElementById("a4");
const ratiosInput = document.getElementById("ratios-input");
const showLabelModeNote = document.getElementById("show-label-mode-note");
const showLabelModeSargam = document.getElementById("show-label-mode-sargam");
const showLabelModeNone = document.getElementById("show-label-mode-none");
const decayModeToggle = document.getElementById("decay-mode");
const colorFamiliesToggle = document.getElementById("color-families");
const showCentsDeviationToggle = document.getElementById("show-cents-deviation");
const rangeSizeInput = document.getElementById("range-size");
const rangeReadout = document.getElementById("range-readout");
const show12EtToggle = document.getElementById("show-12et");
const referenceToggle = document.getElementById("reference-toggle");
const referenceLevel = document.getElementById("reference-level");
const micGainInput = document.getElementById("mic-gain");
const micMeterFill = document.getElementById("mic-meter-fill");
const micMeterText = document.getElementById("mic-meter-text");
const micPanel = document.getElementById("mic-panel");
const mobileSettingsBackdrop = document.getElementById("mobile-settings-backdrop");
const mobileSettingsClose = document.getElementById("mobile-settings-close");
const mobileRotateOverlay = document.getElementById("mobile-rotate-overlay");
const themeToggle = document.getElementById("theme-toggle");
const analysisToggle = document.getElementById("analysis-toggle");
const debugToggle = document.getElementById("debug-toggle");
const calibrateToggle = document.getElementById("calibrate-toggle");
const analysisPanel = document.getElementById("analysis-panel");
const debugPanel = document.getElementById("debug-panel");
const calibratePanel = document.getElementById("calibrate-panel");
const analysisPresetSelect = document.getElementById("analysis-preset-select");
const analysisRmsThresholdInput = document.getElementById("analysis-rms-threshold");
const analysisRmsWindowInput = document.getElementById("analysis-rms-window");
const analysisCorrThresholdInput = document.getElementById("analysis-corr-threshold");
const analysisRawInitConfirmInput = document.getElementById("analysis-raw-init-confirm");
const analysisRawInitStabilityInput = document.getElementById("analysis-raw-init-stability");
const analysisMinFreqInput = document.getElementById("analysis-min-freq");
const analysisMaxFreqInput = document.getElementById("analysis-max-freq");
const analysisJumpThresholdInput = document.getElementById("analysis-jump-threshold");
const analysisJumpConfirmInput = document.getElementById("analysis-jump-confirm");
const analysisVoiceEnterRmsFactorInput = document.getElementById("analysis-voice-enter-rms-factor");
const analysisVoiceExitRmsFactorInput = document.getElementById("analysis-voice-exit-rms-factor");
const analysisVoiceEnterCorrOffsetInput = document.getElementById("analysis-voice-enter-corr-offset");
const analysisVoiceExitCorrOffsetInput = document.getElementById("analysis-voice-exit-corr-offset");
const analysisVoiceEnterFramesInput = document.getElementById("analysis-voice-enter-frames");
const analysisVoiceExitFramesInput = document.getElementById("analysis-voice-exit-frames");
const analysisSmoothFollowInput = document.getElementById("analysis-smooth-follow");
const analysisIdleDecayInput = document.getElementById("analysis-idle-decay");
const analysisOnsetQuarantineInput = document.getElementById("analysis-onset-quarantine");
const analysisRangeMarginInput = document.getElementById("analysis-range-margin");
const analysisOutRangeHoldInput = document.getElementById("analysis-out-range-hold");
const anomalyEnabledInput = document.getElementById("anomaly-enabled");
const anomalyThresholdInput = document.getElementById("anomaly-threshold-st");
const anomalyPreMsInput = document.getElementById("anomaly-pre-ms");
const anomalyPostMsInput = document.getElementById("anomaly-post-ms");
const anomalyCooldownMsInput = document.getElementById("anomaly-cooldown-ms");
const anomalyClearButton = document.getElementById("anomaly-clear");
const anomalyCopyJsonButton = document.getElementById("anomaly-copy-json");
const anomalyCopyCsvButton = document.getElementById("anomaly-copy-csv");
const anomalyStatus = document.getElementById("anomaly-status");
const calRecordToggle = document.getElementById("cal-record-toggle");
const calPlayToggle = document.getElementById("cal-play-toggle");
const calRunButton = document.getElementById("cal-run");
const calResetButton = document.getElementById("cal-reset");
const calWindowClose = document.getElementById("cal-window-close");
const fundamentalSpellingDialog = document.getElementById("fundamental-spelling-dialog");
const fundamentalSpellingSharpButton = document.getElementById("fundamental-spelling-sharp");
const fundamentalSpellingFlatButton = document.getElementById("fundamental-spelling-flat");
const canvas = document.getElementById("viz");
const ctx = canvas.getContext("2d");
let performanceModeEnabled = false;
const isMobileMode = document.body.classList.contains("mobile-mode");

if (
  typeof HTMLDialogElement !== "undefined" &&
  !window.__tunerPerformanceDialogPatchInstalled
) {
  const nativeShowModal = HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal = function patchedShowModal(...args) {
    if (document.body.classList.contains("performance-mode")) {
      return;
    }
    return nativeShowModal.apply(this, args);
  };
  window.__tunerPerformanceDialogPatchInstalled = true;
}

let fundamentalSpelling = "sharp";
let ratioItems = [];
let ratioMarkers = [];

let audioContext = null;
let analyser = null;
let stream = null;
let micSource = null;
let micGainNode = null;
let analysisNotchFilters = [];
let timeData = null;
let rafId = 0;
let referenceOscillator = null;
let referenceGainNode = null;
let referenceEnabled = false;

let detectedPitchHz = null;
let smoothSemitone = null;
let displaySemitone = null;
let liveHasActivePitch = false;
let liveOutOfRangeDirection = 0;
let pendingJumpSemitone = null;
let pendingJumpFrames = 0;
let pendingOctaveSemitone = null;
let pendingOctaveFrames = 0;
let liveMedianSemitoneHistory = [];
let liveOnsetSemitoneHistory = [];
let inactivePitchFrames = 0;
let pendingOutOfRangeDirection = 0;
let pendingOutOfRangeFrames = 0;
let liveAcceptedRawSemitone = null;
let livePendingRawJumpSemitone = null;
let livePendingRawJumpFrames = 0;
let liveVoiced = false;
let liveVoicedEnterFrames = 0;
let liveVoicedExitFrames = 0;
let liveOnsetQuarantineFramesRemaining = 0;
let bottomDragActive = false;
let bottomDragStartY = 0;
let rangeOffsetStartValue = 0;
let rangeOffsetSemitones = 0;
const activeTouchPoints = new Map();
let pinchActive = false;
let pinchStartDistance = 0;
let pinchStartRange = 12;
let outOfRangeFrames = 0;
let rmsWindowValues = [];
let frameCounter = 0;
let decayTrailPoints = [];
let lastDecayTrailSampleMs = 0;
let liveInputStrength = 0;
let noPitchHoldSemitone = null;
let noPitchHoldStrength = 0;
let noPitchHoldLastMs = 0;
let lastInRangeTrackedSemitone = null;
let liveBlobTone = null;
const DECAY_TRAIL_DURATION_MS = 4800;
const selfTestState = {
  running: false,
  lastMs: 0,
  lastTone: null,
  totalsMs: { good: 0, warn: 0, bad: 0 },
};

function isTextEntryTarget(target) {
  if (!target) return false;
  if (target.isContentEditable) return true;
  const tag = String(target.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
}

function updateMobileOrientationLock() {
  if (!isMobileMode || !mobileRotateOverlay) {
    return;
  }
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  mobileRotateOverlay.hidden = !isLandscape;
}

function blockNativeMobileGesture(event) {
  if (!isMobileMode) {
    return;
  }
  event.preventDefault();
}

function closePerformanceModeUi() {
  setToolPanelOpen(analysisPanel, analysisToggle, false);
  setToolPanelOpen(calibratePanel, calibrateToggle, false);
  if (micPanel) {
    micPanel.hidden = true;
  }
  setCalibrationFocus(false);
  if (fundamentalSpellingDialog && fundamentalSpellingDialog.open) {
    try {
      fundamentalSpellingDialog.close("cancel");
    } catch (_error) {
      // noop
    }
  }
  document.querySelectorAll("dialog[open]").forEach((dialog) => {
    try {
      dialog.close("cancel");
    } catch (_error) {
      // noop
    }
  });
}

function setPerformanceMode(enabled) {
  performanceModeEnabled = Boolean(enabled);
  document.body.classList.toggle("performance-mode", performanceModeEnabled);
  if (performanceModeEnabled) {
    closePerformanceModeUi();
  }
}

function togglePerformanceMode() {
  setPerformanceMode(!performanceModeEnabled);
}

function resetSelfTestTotals() {
  selfTestState.totalsMs.good = 0;
  selfTestState.totalsMs.warn = 0;
  selfTestState.totalsMs.bad = 0;
}

function renderSelfTestResults() {
  const total =
    selfTestState.totalsMs.good + selfTestState.totalsMs.warn + selfTestState.totalsMs.bad;
  const pct = (value) => (total > 0 ? Math.round((value / total) * 100) : 0);
  if (selfTestGoodEl) selfTestGoodEl.textContent = `${pct(selfTestState.totalsMs.good)}%`;
  if (selfTestWarnEl) selfTestWarnEl.textContent = `${pct(selfTestState.totalsMs.warn)}%`;
  if (selfTestBadEl) selfTestBadEl.textContent = `${pct(selfTestState.totalsMs.bad)}%`;
}

function startSelfTest(nowMs) {
  if (isMobileMode) {
    return;
  }
  resetSelfTestTotals();
  selfTestState.running = true;
  selfTestState.lastMs = nowMs;
  selfTestState.lastTone = liveBlobTone;
  if (selfTestCard) selfTestCard.hidden = true;
}

function stopSelfTest(nowMs) {
  if (isMobileMode) {
    return;
  }
  updateSelfTest(nowMs, liveBlobTone);
  selfTestState.running = false;
  selfTestState.lastTone = null;
  renderSelfTestResults();
  if (selfTestCard) selfTestCard.hidden = false;
}

function updateSelfTest(nowMs, tone) {
  if (isMobileMode) {
    return;
  }
  if (!selfTestState.running) {
    return;
  }
  const delta = Math.max(0, nowMs - (selfTestState.lastMs || nowMs));
  const prevTone = selfTestState.lastTone;
  if (delta > 0 && (prevTone === "good" || prevTone === "warn" || prevTone === "bad")) {
    selfTestState.totalsMs[prevTone] += delta;
  }
  selfTestState.lastMs = nowMs;
  selfTestState.lastTone = tone;
}

const analysisConfig = {
  rmsThreshold: 0.01,
  rmsWindowFrames: 4,
  correlationThreshold: 0.88,
  minFreq: 70,
  maxFreq: 1400,
  jumpThreshold: 0.65,
  jumpConfirmFrames: 2,
  medianWindowFrames: 5,
  maxSemitoneStepPerFrame: 0.9,
  octaveFlipTolerance: 0.45,
  octaveFlipConfirmFrames: 3,
  smoothFollow: 0.18,
  stabilityDeadbandCents: 6,
  stabilityFollow: 0.008,
  stabilityMinCorrelation: 0.985,
  idleDecay: 0.95,
  onsetConfirmFrames: 3,
  onsetStabilitySemitones: 1.1,
  onsetResetFrames: 8,
  outOfRangeClampConfirmFrames: 2,
  outOfRangeClampCorrelation: 0.97,
  discontinuityThresholdSt: 2.8,
  discontinuityConfirmFrames: 2,
  discontinuityOctaveConfirmFrames: 4,
  rawInitConfirmFrames: 2,
  rawInitStabilitySemitones: 0.9,
  voiceEnterRmsFactor: 1.35,
  voiceExitRmsFactor: 0.78,
  voiceEnterCorrOffset: 0.04,
  voiceExitCorrOffset: -0.06,
  voiceEnterFrames: 2,
  voiceExitFrames: 5,
  onsetQuarantineFrames: 2,
  rangeMargin: 0.75,
  outOfRangeHoldFrames: 8,
};

const ANALYSIS_PRESET_BASE = Object.freeze({ ...analysisConfig });
const ANALYSIS_PRESETS = {
  balanced: { ...ANALYSIS_PRESET_BASE },
  stable: {
    ...ANALYSIS_PRESET_BASE,
    rmsWindowFrames: 5,
    correlationThreshold: 0.9,
    jumpThreshold: 0.58,
    jumpConfirmFrames: 3,
    smoothFollow: 0.14,
    stabilityDeadbandCents: 8,
    stabilityFollow: 0.006,
    onsetConfirmFrames: 4,
    onsetStabilitySemitones: 0.85,
    rawInitConfirmFrames: 3,
    rawInitStabilitySemitones: 0.7,
    voiceEnterRmsFactor: 1.45,
    voiceExitRmsFactor: 0.74,
    voiceEnterCorrOffset: 0.05,
    voiceExitCorrOffset: -0.07,
    voiceEnterFrames: 3,
    voiceExitFrames: 6,
    onsetQuarantineFrames: 3,
  },
  responsive: {
    ...ANALYSIS_PRESET_BASE,
    rmsThreshold: 0.009,
    rmsWindowFrames: 3,
    correlationThreshold: 0.86,
    jumpThreshold: 0.9,
    jumpConfirmFrames: 1,
    smoothFollow: 0.25,
    stabilityDeadbandCents: 4,
    stabilityFollow: 0.014,
    onsetConfirmFrames: 2,
    onsetStabilitySemitones: 1.45,
    rawInitConfirmFrames: 1,
    rawInitStabilitySemitones: 1.2,
    voiceEnterRmsFactor: 1.2,
    voiceExitRmsFactor: 0.86,
    voiceEnterCorrOffset: 0.02,
    voiceExitCorrOffset: -0.03,
    voiceEnterFrames: 1,
    voiceExitFrames: 3,
    onsetQuarantineFrames: 1,
  },
};

const anomalyCapture = {
  enabled: false,
  thresholdSt: 7,
  preMs: 1200,
  postMs: 1200,
  cooldownMs: 1200,
  maxRingMs: 12000,
  ringFrames: [],
  captures: [],
  activeCapture: null,
  lastTriggerMs: 0,
  prevFrame: null,
};

const THEME_STORAGE_KEY = "tuner-theme";
const SETTINGS_STORAGE_KEY = "tuner-settings-v1";

function readCookie(name) {
  const encoded = `${encodeURIComponent(name)}=`;
  const chunks = document.cookie ? document.cookie.split(";") : [];
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (trimmed.startsWith(encoded)) {
      return decodeURIComponent(trimmed.slice(encoded.length));
    }
  }
  return null;
}

function writeCookie(name, value, maxAgeSeconds = 31536000) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function readStoredSettings() {
  let raw = null;
  try {
    raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
  } catch (_error) {
    // no-op
  }
  if (!raw) {
    raw = readCookie(SETTINGS_STORAGE_KEY);
  }
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function writeStoredSettings(settings) {
  const serialized = JSON.stringify(settings);
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, serialized);
  } catch (_error) {
    // no-op
  }
  writeCookie(SETTINGS_STORAGE_KEY, serialized);
}

function getLabelMode() {
  if (showLabelModeSargam && showLabelModeSargam.checked) {
    return "sargam";
  }
  if (showLabelModeNone && showLabelModeNone.checked) {
    return "none";
  }
  return "note";
}

function setLabelMode(mode) {
  const normalized = mode === "sargam" || mode === "none" ? mode : "note";
  if (showLabelModeNote) {
    showLabelModeNote.checked = normalized === "note";
  }
  if (showLabelModeSargam) {
    showLabelModeSargam.checked = normalized === "sargam";
  }
  if (showLabelModeNone) {
    showLabelModeNone.checked = normalized === "none";
  }
}

function collectCurrentSettings() {
  return {
    fundamental: Number(fundamentalInput ? fundamentalInput.value : 130.81) || 130.81,
    a4: Number(a4Input ? a4Input.value : 440) || 440,
    ratios: String(ratiosInput ? ratiosInput.value : ""),
    range: Number(rangeSizeInput ? rangeSizeInput.value : 12) || 12,
    rangeOffset: Number(rangeOffsetSemitones) || 0,
    show12Et: Boolean(show12EtToggle ? show12EtToggle.checked : true),
    labelMode: getLabelMode(),
    showCentsDeviation: Boolean(showCentsDeviationToggle ? showCentsDeviationToggle.checked : true),
    decayMode: Boolean(decayModeToggle ? decayModeToggle.checked : false),
    colorFamilies: Boolean(colorFamiliesToggle ? colorFamiliesToggle.checked : false),
    anomalyCapture: {
      enabled: Boolean(anomalyCapture.enabled),
      thresholdSt: anomalyCapture.thresholdSt,
      preMs: anomalyCapture.preMs,
      postMs: anomalyCapture.postMs,
      cooldownMs: anomalyCapture.cooldownMs,
    },
    referenceLevel: Number(referenceLevel ? referenceLevel.value : -14) || -14,
    micGain: Number(micGainInput ? micGainInput.value : 1) || 1,
    fundamentalSpelling: fundamentalSpelling === "flat" ? "flat" : "sharp",
    analysisConfig: { ...analysisConfig },
  };
}

function persistSettings() {
  writeStoredSettings(collectCurrentSettings());
}

function formatQueryNumber(value, digits = 6) {
  if (!Number.isFinite(value)) {
    return "";
  }
  return String(Number(value.toFixed(digits)));
}

function normalizeRatiosForQuery(raw) {
  if (typeof raw !== "string") {
    return "";
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function syncStateToQueryString() {
  try {
    const current = new URL(window.location.href);
    const params = current.searchParams;
    const fundamental = Number(fundamentalInput ? fundamentalInput.value : NaN);
    const a4 = Number(a4Input ? a4Input.value : NaN);
    const refDb = Number(referenceLevel ? referenceLevel.value : NaN);
    const ratios = normalizeRatiosForQuery(ratiosInput ? ratiosInput.value : "");
    const range = Number(getRangeSemitoneValue());
    const rangeOffset = Number(getBottomSemitoneValue());

    if (Number.isFinite(fundamental) && fundamental > 0) {
      params.set("fundamental", formatQueryNumber(fundamental));
    } else {
      params.delete("fundamental");
    }
    if (Number.isFinite(a4) && a4 > 0) {
      params.set("a4", formatQueryNumber(a4));
    } else {
      params.delete("a4");
    }
    if (ratios) {
      params.set("ratios", ratios);
    } else {
      params.delete("ratios");
    }
    if (Number.isFinite(range)) {
      params.set("range", formatQueryNumber(range, 3));
    } else {
      params.delete("range");
    }
    if (Number.isFinite(rangeOffset)) {
      params.set("rangeOffset", formatQueryNumber(rangeOffset, 3));
    } else {
      params.delete("rangeOffset");
    }
    params.set("show12Et", show12EtToggle && show12EtToggle.checked ? "1" : "0");
    params.set("labelMode", getLabelMode());
    params.delete("showNoteNames");
    params.delete("showSargam");
    params.set(
      "showCentsDeviation",
      showCentsDeviationToggle && showCentsDeviationToggle.checked ? "1" : "0"
    );
    params.set("decayMode", decayModeToggle && decayModeToggle.checked ? "1" : "0");
    params.set("colorFamilies", colorFamiliesToggle && colorFamiliesToggle.checked ? "1" : "0");
    if (Number.isFinite(refDb)) {
      params.set("referenceLevel", formatQueryNumber(refDb, 2));
    } else {
      params.delete("referenceLevel");
    }
    params.set("referenceOn", referenceEnabled ? "1" : "0");

    const search = params.toString();
    const nextUrl = `${current.pathname}${search ? `?${search}` : ""}${current.hash || ""}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      history.replaceState(null, "", nextUrl);
    }
  } catch (_error) {
    // no-op
  }
}

function hasLiveAudioTrack(mediaStream) {
  if (!mediaStream || typeof mediaStream.getAudioTracks !== "function") {
    return false;
  }
  return mediaStream.getAudioTracks().some((track) => track && track.readyState === "live");
}

function resetMicGraphState() {
  try {
    if (micSource) {
      micSource.disconnect();
    }
  } catch (_error) {
    // no-op
  }
  try {
    if (micGainNode) {
      micGainNode.disconnect();
    }
  } catch (_error) {
    // no-op
  }
  try {
    if (analyser) {
      analyser.disconnect();
    }
  } catch (_error) {
    // no-op
  }
  analysisNotchFilters.forEach((filter) => {
    try {
      filter.disconnect();
    } catch (_error) {
      // no-op
    }
  });
  analysisNotchFilters = [];
  micSource = null;
  micGainNode = null;
  analyser = null;
  timeData = null;
}

function median(values) {
  if (!Array.isArray(values) || !values.length) {
    return null;
  }
  const sorted = values.filter((value) => Number.isFinite(value)).slice().sort((a, b) => a - b);
  if (!sorted.length) {
    return null;
  }
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) {
    return sorted[middle];
  }
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function percentile(values, p) {
  if (!Array.isArray(values) || !values.length) {
    return null;
  }
  const sorted = values.filter((value) => Number.isFinite(value)).slice().sort((a, b) => a - b);
  if (!sorted.length) {
    return null;
  }
  const clamped = Math.max(0, Math.min(1, Number(p)));
  const idx = clamped * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) {
    return sorted[lo];
  }
  const t = idx - lo;
  return sorted[lo] * (1 - t) + sorted[hi] * t;
}


function reduceToOctave(numerator, denominator) {
  let num = numerator;
  let den = denominator;
  let ratio = num / den;
  while (ratio < 1) {
    num *= 2;
    ratio = num / den;
  }
  while (ratio > 2) {
    den *= 2;
    ratio = num / den;
  }
  return { numerator: num, denominator: den, ratio };
}


function parseRatiosList(value) {
  const tokens = String(value || "")
    .split(/[\s,]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (!tokens.length) return [];

  const seen = new Set();
  const parsed = [];
  for (const token of tokens) {
    const ratio = parseRatioInput(token);
    if (!ratio) continue;
    const reduced = reduceFraction(ratio.numerator, ratio.denominator);
    if (!reduced.numerator || !reduced.denominator) continue;
    const octave = reduceToOctave(reduced.numerator, reduced.denominator);
    const octaveReduced = reduceFraction(octave.numerator, octave.denominator);
    const key = `${octaveReduced.numerator}/${octaveReduced.denominator}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parsed.push({
      numerator: octaveReduced.numerator,
      denominator: octaveReduced.denominator,
      ratio: octaveReduced.numerator / octaveReduced.denominator,
      octaveRatio: octaveReduced.numerator / octaveReduced.denominator,
      octaveSemitone: 12 * Math.log2(octaveReduced.numerator / octaveReduced.denominator),
      label: `${octaveReduced.numerator}/${octaveReduced.denominator}`,
    });
  }

  return parsed.sort((a, b) => a.ratio - b.ratio);
}

function getLargestPrimeFactorUpTo97(value) {
  let n = Math.abs(Math.trunc(value));
  if (!Number.isFinite(n) || n <= 1) {
    return null;
  }
  let largest = null;
  for (const prime of PRIMES_UP_TO_97) {
    if (prime * prime > n) {
      break;
    }
    while (n % prime === 0) {
      largest = prime;
      n = Math.trunc(n / prime);
    }
  }
  if (n > 1 && PRIME_FAMILY_COLORS.has(n)) {
    largest = n;
  }
  return largest;
}

function getRatioPrimeFamily(numerator, denominator) {
  const numeratorPrime = getLargestPrimeFactorUpTo97(numerator);
  const denominatorPrime = getLargestPrimeFactorUpTo97(denominator);
  if (numeratorPrime && denominatorPrime) {
    return Math.max(numeratorPrime, denominatorPrime);
  }
  return numeratorPrime || denominatorPrime || null;
}





function getFundamentalPitchClassForSpelling() {
  let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
  if (!Number.isFinite(fundamentalMidi)) {
    const fallback = getNearestEtInfo(
      Number(fundamentalInput.value) || 130.81,
      Number(a4Input.value) || 440
    );
    fundamentalMidi = fallback.midi;
  }
  return getFundamentalNoteNames()[mod(fundamentalMidi, 12)];
}

function getPitchClassFromRatio(ratio) {
  const a4 = Number(a4Input.value) || 440;
  const fundamental = getFundamentalHz();
  const freq = fundamental * ratio.ratio;
  const nearest = getNearestEtInfo(freq, a4);
  const nearestPitchClass = noteNames[mod(nearest.midi, 12)];
  const normalized = normalizeRatioToOctave(ratio.numerator, ratio.denominator);
  if (normalized) {
    const reducedNormalized = reduceFraction(normalized.numerator, normalized.denominator);
    if (reducedNormalized.numerator === reducedNormalized.denominator) {
      return {
        pitchClass: getFundamentalPitchClassForSpelling(),
        axisRatios: [],
      };
    }
  }
  const analysis = analyzeRatioForTrueSpelling(ratio.numerator, ratio.denominator);
  if (!analysis || !analysis.axisRatios.length) {
    return { pitchClass: nearestPitchClass, axisRatios: [] };
  }
  const axisRatios = analysis.axisRatios;
  const beyondLimit = axisRatios.some((axis) => {
    if (!axis.exp) return false;
    const limit = getTrueSpellingLimit(axis.ratio);
    return Number.isFinite(limit) && Math.abs(axis.exp) > limit;
  });
  const hasUnknownInterval = axisRatios.some((axis) => axis.exp && !TRUE_SPELLING_INTERVALS[axis.ratio]);
  const hasHigherPrime = axisRatios.some((axis) => axis.exp && Number(axis.ratio) >= 53);
  if (beyondLimit || hasUnknownInterval || hasHigherPrime) {
    return { pitchClass: nearestPitchClass, axisRatios };
  }

  let totalLetterShift = 0;
  let totalSemitoneShift = 0;
  axisRatios.forEach((axis) => {
    if (!axis.exp) return;
    const spec = TRUE_SPELLING_INTERVALS[axis.ratio];
    if (!spec) return;
    totalLetterShift += axis.exp * spec.letter;
    totalSemitoneShift += axis.exp * spec.semitones;
  });
  const basePitchClassText = getFundamentalPitchClassForSpelling();
  const base = parsePitchClass(basePitchClassText);
  const baseLetterIndex = Number.isFinite(base.letterIndex) ? base.letterIndex : 0;
  const baseAccidental = Number.isFinite(base.accidental) ? base.accidental : 0;
  const totalLetter = baseLetterIndex + totalLetterShift;
  const octaveShift = floorDiv(totalLetter, 7);
  const targetLetterIndex = mod(totalLetter, 7);
  const targetNatural = LETTER_TO_SEMITONE[LETTERS[targetLetterIndex]] + octaveShift * 12;
  const totalSemitone =
    baseAccidental + LETTER_TO_SEMITONE[LETTERS[baseLetterIndex]] + totalSemitoneShift;
  const accidental = totalSemitone - targetNatural;
  return {
    pitchClass: buildPitchClass(targetLetterIndex, accidental),
    axisRatios,
  };
}



function getRatioNoteLabelInfo(ratio) {
  const spelling = getPitchClassFromRatio(ratio);
  const heji = getHejiAnnotationForAxisRatios(spelling.axisRatios, spelling.pitchClass);
  const suffixText = (heji.suffixParts || [])
    .map((part) => `${part.text}${part.expLabel || ""}`)
    .join("");
  const intervalInfo = getIntervalQualityInfo(
    getFundamentalPitchClassForSpelling(),
    spelling.pitchClass
  );
  return {
    pitchClass: spelling.pitchClass,
    baseText: heji.baseText || spelling.pitchClass,
    suffixText,
    sargamText: getSargamLabel(intervalInfo, ratio),
    intervalText: intervalInfo ? intervalInfo.shortLabel : "",
  };
}

const INTERVAL_BASE_SEMITONES = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
};


function getIntervalQualityInfo(sourcePitchClass, targetPitchClass) {
  const source = parsePitchClass(sourcePitchClass);
  const target = parsePitchClass(targetPitchClass);
  const sourceLetter = Number.isFinite(source.letterIndex) ? mod(source.letterIndex, 7) : 0;
  const targetLetter = Number.isFinite(target.letterIndex) ? mod(target.letterIndex, 7) : 0;
  const degree = mod(targetLetter - sourceLetter, 7) + 1;
  const sourceSemitone = getPitchClassSemitoneValue(sourcePitchClass);
  const targetSemitone = getPitchClassSemitoneValue(targetPitchClass);
  const semitoneDiff = mod(targetSemitone - sourceSemitone, 12);
  const expected = INTERVAL_BASE_SEMITONES[degree];
  if (!Number.isFinite(expected)) {
    return null;
  }
  let delta = semitoneDiff - expected;
  while (delta > 6) delta -= 12;
  while (delta < -6) delta += 12;
  const perfectFamily = degree === 1 || degree === 4 || degree === 5;
  let quality = "";
  if (perfectFamily) {
    if (delta === 0) {
      quality = "P";
    } else if (delta > 0) {
      quality = "A".repeat(delta);
    } else {
      quality = "d".repeat(-delta);
    }
  } else if (delta === 0) {
    quality = "M";
  } else if (delta === -1) {
    quality = "m";
  } else if (delta > 0) {
    quality = "A".repeat(delta);
  } else {
    quality = "d".repeat(Math.max(1, -delta - 1));
  }
  return {
    degree,
    semitoneDiff,
    delta,
    quality,
    shortLabel: `${quality}${degree}`,
  };
}

function getSargamLabel(intervalInfo, ratio) {
  if (!intervalInfo) {
    return "";
  }
  const numerator = Number(ratio && ratio.numerator);
  const denominator = Number(ratio && ratio.denominator);
  const hasFiniteRatio = Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0;
  const reduced = hasFiniteRatio ? reduceFraction(numerator, denominator) : null;
  const ratioValue = reduced ? reduced.numerator / reduced.denominator : null;
  if (intervalInfo.degree === 1) {
    if (reduced && (reduced.numerator === reduced.denominator || reduced.numerator === reduced.denominator * 2)) {
      return "Sa";
    }
    if (Number.isFinite(ratioValue)) {
      return ratioValue > 1 ? "re" : "Ni";
    }
    return "Sa";
  }
  if (intervalInfo.shortLabel === "P5") {
    if (reduced) {
      if (reduced.numerator === 3 && reduced.denominator === 2) {
        return "Pa";
      }
      if (Number.isFinite(ratioValue)) {
        if (ratioValue < 1.5) {
          return "Ma";
        }
        if (ratioValue > 1.5) {
          return "dha";
        }
      }
    }
    return "Pa";
  }
  const key = intervalInfo.shortLabel;
  switch (key) {
    case "P1":
      return "Sa";
    case "m2":
      return "re";
    case "M2":
      return "Re";
    case "m3":
      return "ga";
    case "M3":
      return "Ga";
    case "P4":
      return "Ma";
    case "A4":
      return "Ma^";
    case "m6":
      return "dha";
    case "M6":
      return "Dha";
    case "m7":
      return "ni";
    case "M7":
      return "Ni";
    default:
      return key;
  }
}

function getOctaveReducedDisplayRatioLabel(ratio) {
  if (!ratio || !Number.isFinite(ratio.ratio) || ratio.ratio <= 2) {
    return ratio && ratio.label ? ratio.label : "";
  }
  const normalized = reduceToOctave(ratio.numerator, ratio.denominator);
  const reduced = reduceFraction(normalized.numerator, normalized.denominator);
  return `${reduced.numerator}/${reduced.denominator}`;
}

function getOctavePowerRatioLabel(semitone) {
  const octaveStep = Math.round(semitone / 12);
  if (Math.abs(semitone - octaveStep * 12) > 0.02) {
    return null;
  }
  if (octaveStep >= 0) {
    return `${2 ** octaveStep}/1`;
  }
  return `1/${2 ** Math.abs(octaveStep)}`;
}

function getFundamentalNoteNames() {
  return fundamentalSpelling === "flat" ? noteNamesFlat : noteNamesSharp;
}

function midiToFundamentalNoteName(midi) {
  const names = getFundamentalNoteNames();
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function getFundamentalSpellingFromPitchClass(pitchClass) {
  if (typeof pitchClass !== "string") return fundamentalSpelling;
  if (pitchClass.includes("b")) return "flat";
  if (pitchClass.includes("#") || pitchClass.includes("x")) return "sharp";
  return fundamentalSpelling;
}

function getEnharmonicOptions(midi) {
  const pc = mod(midi, 12);
  const sharp = noteNamesSharp[pc];
  const flat = noteNamesFlat[pc];
  if (sharp === flat) return null;
  return {
    sharp,
    flat,
    sharpLabel: `${sharp}${Math.floor(midi / 12) - 1}`,
    flatLabel: `${flat}${Math.floor(midi / 12) - 1}`,
  };
}

function hideFundamentalSpellingDialog() {
  if (fundamentalSpellingDialog) {
    fundamentalSpellingDialog.close();
  }
}

function showFundamentalSpellingDialog(midi) {
  const options = getEnharmonicOptions(midi);
  if (!options || !fundamentalSpellingDialog) {
    hideFundamentalSpellingDialog();
    return;
  }
  if (fundamentalSpellingSharpButton) {
    fundamentalSpellingSharpButton.textContent = options.sharpLabel;
  }
  if (fundamentalSpellingFlatButton) {
    fundamentalSpellingFlatButton.textContent = options.flatLabel;
  }
  if (!fundamentalSpellingDialog.open) {
    fundamentalSpellingDialog.showModal();
  }
}


function populateFundamentalNotes() {
  const startMidi = 0;
  const endMidi = 96;
  fundamentalNoteSelect.innerHTML = "";
  const customOption = document.createElement("option");
  customOption.value = FUNDAMENTAL_CUSTOM_VALUE;
  customOption.textContent = "Specify in Hz";
  fundamentalNoteSelect.appendChild(customOption);
  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    const option = document.createElement("option");
    option.value = String(midi);
    option.textContent = midiToFundamentalNoteName(midi);
    fundamentalNoteSelect.appendChild(option);
  }
}

function updateFundamentalNotes() {
  const a4 = Number(a4Input.value) || 440;
  const selectedValue = fundamentalNoteSelect.value || "";
  for (const option of Array.from(fundamentalNoteSelect.options)) {
    const midi = Number(option.value);
    if (option.value === FUNDAMENTAL_CUSTOM_VALUE) {
      option.textContent = "Specify in Hz";
      continue;
    }
    const freq = midiToFrequency(midi, a4);
    option.textContent = `${midiToFundamentalNoteName(midi)} (${freq.toFixed(2)} Hz)`;
  }
  fundamentalNoteSelect.value =
    selectedValue === FUNDAMENTAL_CUSTOM_VALUE ? FUNDAMENTAL_CUSTOM_VALUE : String(selectedValue);
}

function syncFundamentalNoteSelect() {
  const freq = Number(fundamentalInput.value);
  if (!Number.isFinite(freq) || freq <= 0) return;
  const a4 = Number(a4Input.value) || 440;
  const { midi } = getNearestEtInfo(freq, a4);
  const target = midiToFrequency(midi, a4);
  if (Math.abs(target - freq) <= 0.01) {
    fundamentalNoteSelect.value = String(midi);
  } else {
    fundamentalNoteSelect.value = FUNDAMENTAL_CUSTOM_VALUE;
  }
}

function adjustFundamentalByFactor(factor) {
  const current = Number(fundamentalInput.value);
  if (!Number.isFinite(current) || current <= 0) return;
  const min = Number(fundamentalInput.min) || 0;
  const max = Number(fundamentalInput.max) || Infinity;
  const next = Math.min(max, Math.max(min, current * factor));
  fundamentalInput.value = String(next);
  syncFundamentalNoteSelect();
  refreshMarkers();
  updateReferenceFrequency();
  rebuildAnalysisChain();
  persistSettings();
  syncStateToQueryString();
}

function applyFundamentalSpelling(nextSpelling) {
  fundamentalSpelling = nextSpelling === "flat" ? "flat" : "sharp";
  const selectedMidi = Number(fundamentalNoteSelect.value);
  populateFundamentalNotes();
  updateFundamentalNotes();
  if (Number.isFinite(selectedMidi)) {
    fundamentalNoteSelect.value = String(selectedMidi);
  } else {
    syncFundamentalNoteSelect();
  }
  refreshMarkers();
  drawViz();
  hideFundamentalSpellingDialog();
  persistSettings();
  syncStateToQueryString();
}

function onFundamentalNoteChange() {
  if (fundamentalNoteSelect.value === FUNDAMENTAL_CUSTOM_VALUE) return;
  const midi = Number(fundamentalNoteSelect.value);
  const a4 = Number(a4Input.value) || 440;
  const freq = midiToFrequency(midi, a4);
  fundamentalInput.value = String(freq);
  showFundamentalSpellingDialog(midi);
  refreshMarkers();
  updateReferenceFrequency();
  rebuildAnalysisChain();
  persistSettings();
  syncStateToQueryString();
}

function parseIncomingQuery() {
  const params = new URLSearchParams(window.location.search);
  const overrides = {
    fundamental: false,
    a4: false,
    ratios: false,
    range: false,
    rangeOffset: false,
    show12Et: false,
    labelMode: false,
    showCentsDeviation: false,
    decayMode: false,
    colorFamilies: false,
    referenceLevel: false,
    referenceOn: false,
  };
  const parseBoolParam = (value) => {
    if (value === "1" || value === "true") return true;
    if (value === "0" || value === "false") return false;
    return null;
  };
  const queryFundamental = Number(params.get("fundamental"));
  const queryA4 = Number(params.get("a4"));
  const queryRatios = params.get("ratios");
  const queryRange = Number(params.get("range"));
  const queryRangeOffset = Number(params.get("rangeOffset"));
  const queryLabelMode = params.get("labelMode");
  const queryShow12Et = parseBoolParam(params.get("show12Et"));
  const queryShowNoteNames = parseBoolParam(params.get("showNoteNames"));
  const queryShowSargam = parseBoolParam(params.get("showSargam"));
  const queryShowCentsDeviation = parseBoolParam(params.get("showCentsDeviation"));
  const queryDecayMode = parseBoolParam(params.get("decayMode"));
  const queryColorFamilies = parseBoolParam(params.get("colorFamilies"));
  const queryReferenceLevel = Number(params.get("referenceLevel"));
  const queryReferenceOn = params.get("referenceOn");

  if (Number.isFinite(queryA4) && queryA4 > 0) {
    a4Input.value = String(queryA4);
    overrides.a4 = true;
  }
  if (Number.isFinite(queryFundamental) && queryFundamental > 0) {
    fundamentalInput.value = String(queryFundamental);
    overrides.fundamental = true;
  }
  if (typeof queryRatios === "string" && queryRatios.trim()) {
    const normalized = normalizeRatiosForQuery(queryRatios);
    ratiosInput.value = normalized;
    overrides.ratios = true;
  }
  if (rangeSizeInput && Number.isFinite(queryRange)) {
    rangeSizeInput.value = String(clampNumber(queryRange, 12, 36, 12));
    overrides.range = true;
  }
  if (Number.isFinite(queryRangeOffset)) {
    rangeOffsetSemitones = clampNumber(queryRangeOffset, -12, 24, 0);
    overrides.rangeOffset = true;
  }
  if (queryLabelMode === "note" || queryLabelMode === "sargam" || queryLabelMode === "none") {
    setLabelMode(queryLabelMode);
    overrides.labelMode = true;
  } else if (typeof queryShowNoteNames === "boolean" || typeof queryShowSargam === "boolean") {
    if (queryShowSargam === true) {
      setLabelMode("sargam");
    } else if (queryShowNoteNames === false) {
      setLabelMode("none");
    } else {
      setLabelMode("note");
    }
    overrides.labelMode = true;
  }
  if (show12EtToggle && typeof queryShow12Et === "boolean") {
    show12EtToggle.checked = queryShow12Et;
    overrides.show12Et = true;
  }
  if (showCentsDeviationToggle && typeof queryShowCentsDeviation === "boolean") {
    showCentsDeviationToggle.checked = queryShowCentsDeviation;
    overrides.showCentsDeviation = true;
  }
  if (decayModeToggle && typeof queryDecayMode === "boolean") {
    decayModeToggle.checked = queryDecayMode;
    overrides.decayMode = true;
  }
  if (colorFamiliesToggle && typeof queryColorFamilies === "boolean") {
    colorFamiliesToggle.checked = queryColorFamilies;
    overrides.colorFamilies = true;
  }
  if (referenceLevel && Number.isFinite(queryReferenceLevel)) {
    referenceLevel.value = String(clampNumber(queryReferenceLevel, -30, 0, -14));
    overrides.referenceLevel = true;
  }
  if (queryReferenceOn === "0" || queryReferenceOn === "1") {
    overrides.referenceOn = true;
  }
  return overrides;
}

function applyStoredSettings(
  queryOverrides = {
    fundamental: false,
    a4: false,
    ratios: false,
    range: false,
    rangeOffset: false,
    show12Et: false,
    labelMode: false,
    showCentsDeviation: false,
    decayMode: false,
    colorFamilies: false,
    referenceLevel: false,
    referenceOn: false,
  }
) {
  const settings = readStoredSettings();
  if (!settings) {
    return null;
  }

  if (!queryOverrides.a4 && Number.isFinite(Number(settings.a4)) && Number(settings.a4) > 0) {
    a4Input.value = String(settings.a4);
  }
  if (
    !queryOverrides.fundamental &&
    Number.isFinite(Number(settings.fundamental)) &&
    Number(settings.fundamental) > 0
  ) {
    fundamentalInput.value = String(settings.fundamental);
  }
  if (!queryOverrides.ratios && typeof settings.ratios === "string" && settings.ratios.trim()) {
    ratiosInput.value = normalizeRatiosForQuery(settings.ratios);
  }
  if (!queryOverrides.range) {
    const storedRange = Number(settings.range);
    if (rangeSizeInput && Number.isFinite(storedRange)) {
      rangeSizeInput.value = String(clampNumber(storedRange, 12, 36, 12));
    } else if (rangeSizeInput && Number.isFinite(Number(settings.rangeTop))) {
      rangeSizeInput.value = String(clampNumber(Number(settings.rangeTop), 12, 36, 12));
    }
  }
  if (!queryOverrides.rangeOffset) {
    const storedOffset = Number(settings.rangeOffset);
    if (Number.isFinite(storedOffset)) {
      rangeOffsetSemitones = clampNumber(storedOffset, -12, 24, 0);
    } else if (Number.isFinite(Number(settings.rangeBottom))) {
      rangeOffsetSemitones = -clampNumber(Number(settings.rangeBottom), 0, 12, 0);
    }
  }
  const currentRange = getRangeSemitoneValue();
  rangeOffsetSemitones = clampNumber(rangeOffsetSemitones, -12, 36 - currentRange, 0);
  if (!queryOverrides.show12Et && typeof settings.show12Et === "boolean") {
    show12EtToggle.checked = settings.show12Et;
  }
  if (!queryOverrides.labelMode) {
    if (settings.labelMode === "note" || settings.labelMode === "sargam" || settings.labelMode === "none") {
      setLabelMode(settings.labelMode);
    } else if (typeof settings.showSargam === "boolean" || typeof settings.showNoteNames === "boolean") {
      if (settings.showSargam) {
        setLabelMode("sargam");
      } else if (settings.showNoteNames === false) {
        setLabelMode("none");
      } else {
        setLabelMode("note");
      }
    }
  }
  if (
    !queryOverrides.showCentsDeviation &&
    showCentsDeviationToggle &&
    typeof settings.showCentsDeviation === "boolean"
  ) {
    showCentsDeviationToggle.checked = settings.showCentsDeviation;
  }
  if (!queryOverrides.decayMode && decayModeToggle && typeof settings.decayMode === "boolean") {
    decayModeToggle.checked = settings.decayMode;
  }
  if (!queryOverrides.colorFamilies && colorFamiliesToggle && typeof settings.colorFamilies === "boolean") {
    colorFamiliesToggle.checked = settings.colorFamilies;
  }
  if (settings.anomalyCapture && typeof settings.anomalyCapture === "object") {
    const ac = settings.anomalyCapture;
    if (typeof ac.enabled === "boolean") {
      anomalyCapture.enabled = ac.enabled;
    }
    if (Number.isFinite(Number(ac.thresholdSt))) {
      anomalyCapture.thresholdSt = clampNumber(Number(ac.thresholdSt), 1, 24, 7);
    }
    if (Number.isFinite(Number(ac.preMs))) {
      anomalyCapture.preMs = clampNumber(Number(ac.preMs), 200, 4000, 1200);
    }
    if (Number.isFinite(Number(ac.postMs))) {
      anomalyCapture.postMs = clampNumber(Number(ac.postMs), 200, 4000, 1200);
    }
    if (Number.isFinite(Number(ac.cooldownMs))) {
      anomalyCapture.cooldownMs = clampNumber(Number(ac.cooldownMs), 200, 5000, 1200);
    }
  }
  if (
    !queryOverrides.referenceLevel &&
    referenceLevel &&
    Number.isFinite(Number(settings.referenceLevel))
  ) {
    referenceLevel.value = String(clampNumber(Number(settings.referenceLevel), -30, 0, -14));
  }
  if (micGainInput && Number.isFinite(Number(settings.micGain))) {
    micGainInput.value = String(clampNumber(Number(settings.micGain), 0.25, 4, 1));
  }
  if (settings.fundamentalSpelling === "flat" || settings.fundamentalSpelling === "sharp") {
    fundamentalSpelling = settings.fundamentalSpelling;
  }
  if (settings.analysisConfig && typeof settings.analysisConfig === "object") {
    applyAnalysisConfig(settings.analysisConfig);
  }

  return settings;
}

function dbToGain(db) {
  return Math.pow(10, db / 20);
}

async function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  return audioContext;
}

function getFundamentalHz() {
  const value = Number(fundamentalInput.value);
  return Number.isFinite(value) && value > 0 ? value : 130.81;
}

function shouldIgnoreReferenceInAnalysis() {
  return Boolean(referenceEnabled);
}

function getReferenceRejectFrequencies() {
  const base = getFundamentalHz();
  if (!Number.isFinite(base) || base <= 0 || !audioContext) {
    return [];
  }
  const nyquist = audioContext.sampleRate / 2;
  const freqs = [];
  for (let harmonic = 1; harmonic <= 6; harmonic += 1) {
    const frequency = base * harmonic;
    if (frequency >= nyquist - 20) {
      break;
    }
    freqs.push(frequency);
  }
  return freqs;
}

function rebuildAnalysisChain() {
  if (!micSource || !analyser || !audioContext || !micGainNode) {
    return;
  }

  try {
    micSource.disconnect();
  } catch (_error) {
    // no-op
  }
  analysisNotchFilters.forEach((filter) => {
    try {
      filter.disconnect();
    } catch (_error) {
      // no-op
    }
  });
  analysisNotchFilters = [];
  micSource.connect(micGainNode);

  let tail = micGainNode;
  if (shouldIgnoreReferenceInAnalysis()) {
    const rejectFrequencies = getReferenceRejectFrequencies();
    rejectFrequencies.forEach((frequency) => {
      const notch = audioContext.createBiquadFilter();
      notch.type = "notch";
      notch.frequency.value = frequency;
      notch.Q.value = 28;
      tail.connect(notch);
      tail = notch;
      analysisNotchFilters.push(notch);
    });
  }
  tail.connect(analyser);
}

function updateMicGain() {
  if (!micGainNode || !audioContext) {
    return;
  }
  const gainValue = Number(micGainInput ? micGainInput.value : 1);
  const target = Number.isFinite(gainValue) && gainValue > 0 ? gainValue : 1;
  const now = audioContext.currentTime;
  micGainNode.gain.cancelScheduledValues(now);
  micGainNode.gain.setTargetAtTime(target, now, 0.01);
}

function updateReferenceFrequency() {
  if (!referenceOscillator || !audioContext) {
    return;
  }
  const now = audioContext.currentTime;
  const target = getFundamentalHz();
  referenceOscillator.frequency.cancelScheduledValues(now);
  referenceOscillator.frequency.setTargetAtTime(target, now, 0.015);
}

function updateReferenceLevel() {
  if (!referenceGainNode || !audioContext) {
    return;
  }
  const levelDb = Number(referenceLevel ? referenceLevel.value : -14);
  const targetGain = dbToGain(Number.isFinite(levelDb) ? levelDb : -14);
  const now = audioContext.currentTime;
  referenceGainNode.gain.cancelScheduledValues(now);
  referenceGainNode.gain.setTargetAtTime(targetGain, now, 0.015);
}

function updateReferenceButton() {
  if (!referenceToggle) {
    return;
  }
  referenceToggle.textContent = referenceEnabled ? "Stop" : "Play";
}

async function startReferenceTone() {
  await ensureAudioContext();
  if (referenceEnabled) {
    return;
  }
  if (referenceOscillator) {
    try {
      referenceOscillator.stop();
    } catch (_error) {
      // no-op
    }
  }
  referenceGainNode = audioContext.createGain();
  referenceGainNode.gain.value = 0;
  referenceOscillator = audioContext.createOscillator();
  referenceOscillator.type = "sine";
  referenceOscillator.frequency.value = getFundamentalHz();
  referenceOscillator.connect(referenceGainNode);
  referenceGainNode.connect(audioContext.destination);
  referenceOscillator.start();
  referenceEnabled = true;
  updateReferenceLevel();
  rebuildAnalysisChain();
  updateReferenceButton();
}

function stopReferenceTone() {
  if (!referenceEnabled || !audioContext) {
    return;
  }
  referenceEnabled = false;
  rebuildAnalysisChain();
  updateReferenceButton();
  if (referenceGainNode) {
    const now = audioContext.currentTime;
    referenceGainNode.gain.cancelScheduledValues(now);
    referenceGainNode.gain.setTargetAtTime(0.0001, now, 0.03);
  }
  if (referenceOscillator) {
    const osc = referenceOscillator;
    const gainNode = referenceGainNode;
    referenceOscillator = null;
    referenceGainNode = null;
    setTimeout(() => {
      try {
        osc.stop();
      } catch (_error) {
        // no-op
      }
      try {
        osc.disconnect();
      } catch (_error) {
        // no-op
      }
      try {
        if (gainNode) {
          gainNode.disconnect();
        }
      } catch (_error) {
        // no-op
      }
    }, 80);
  }
}

async function toggleReferenceTone() {
  if (referenceEnabled) {
    stopReferenceTone();
  } else {
    await startReferenceTone();
  }
  persistSettings();
  syncStateToQueryString();
}

function getCssVar(name, fallback) {
  const value = getComputedStyle(document.body).getPropertyValue(name).trim();
  return value || fallback;
}

function applyTheme(theme) {
  const normalized = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("theme-dark", normalized === "dark");
  if (themeToggle) {
    themeToggle.checked = normalized === "dark";
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch (_error) {
    // Ignore storage failures.
  }
}

function initTheme() {
  let stored = null;
  try {
    stored = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (_error) {
    stored = null;
  }
  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
    return;
  }
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

function rebuildRatioItems() {
  const parsed = parseRatiosList(ratiosInput.value);
  if (parsed.length) {
    ratioItems = parsed;
  } else if (!ratioItems.length) {
    ratioItems = parseRatiosList("1/1 9/8 5/4 4/3 3/2 5/3 15/8 2/1");
  }
}

function refreshMarkers() {
  rebuildRatioItems();
  const bounds = getVisualizationSemitoneBounds();
  const minSemi = bounds.min;
  const maxSemi = bounds.max;
  const hasUnison = ratioItems.some((item) => item.numerator === 1 && item.denominator === 1);
  const hasOctave = ratioItems.some((item) => item.numerator === 2 && item.denominator === 1);
  const markers = [];
  for (const ratio of ratioItems) {
    const noteLabelInfo = getRatioNoteLabelInfo(ratio);
    const base = ratio.octaveSemitone;
    const primeFamily = getRatioPrimeFamily(ratio.numerator, ratio.denominator);
    const isUnisonRatio = ratio.numerator === 1 && ratio.denominator === 1;
    const isOctaveRatio = ratio.numerator === 2 && ratio.denominator === 1;
    for (let k = -6; k <= 6; k += 1) {
      const semi = base + 12 * k;
      if (semi < minSemi - 0.001 || semi > maxSemi + 0.001) continue;
      if (hasUnison && hasOctave) {
        if (isUnisonRatio && Math.abs(semi) > 0.001) continue;
        if (isOctaveRatio && Math.abs(semi) <= 0.001) continue;
      }
      const baseLabel = getOctaveReducedDisplayRatioLabel(ratio);
      let ratioLabel = baseLabel;
      if (isUnisonRatio || isOctaveRatio) {
        const octaveLabel = getOctavePowerRatioLabel(semi);
        if (octaveLabel) {
          ratioLabel = octaveLabel;
        }
      }
      markers.push({
        semitone: semi,
        label: ratioLabel,
        ratioLabel,
        noteLabelInfo,
        primeFamily,
      });
    }
  }
  ratioMarkers = markers.sort((a, b) => b.semitone - a.semitone);
}

function getRatioLabelForSemitone(ratio, semitone) {
  if (!ratio) {
    return "--";
  }
  const isUnisonRatio = ratio.numerator === 1 && ratio.denominator === 1;
  const isOctaveRatio = ratio.numerator === 2 && ratio.denominator === 1;
  if (isUnisonRatio || isOctaveRatio) {
    const octaveLabel = getOctavePowerRatioLabel(semitone);
    if (octaveLabel) {
      return octaveLabel;
    }
  }
  return getOctaveReducedDisplayRatioLabel(ratio) || ratio.label || "--";
}

function getNearestRatioAtSemitone(semitone) {
  if (!Number.isFinite(semitone) || !Array.isArray(ratioItems) || ratioItems.length === 0) {
    return null;
  }
  let best = null;
  for (const ratio of ratioItems) {
    const base = Number(ratio.octaveSemitone);
    if (!Number.isFinite(base)) {
      continue;
    }
    const k0 = Math.round((semitone - base) / 12);
    for (let dk = -1; dk <= 1; dk += 1) {
      const k = k0 + dk;
      const markerSemitone = base + 12 * k;
      const delta = semitone - markerSemitone;
      const absDelta = Math.abs(delta);
      if (!best || absDelta < best.absDelta) {
        best = {
          ratio,
          markerSemitone,
          deltaSemitone: delta,
          absDelta,
          label: getRatioLabelForSemitone(ratio, markerSemitone),
        };
      }
    }
  }
  if (!best) {
    return null;
  }
  return {
    ratio: best.ratio,
    markerSemitone: best.markerSemitone,
    cents: best.deltaSemitone * 100,
    centsAbs: best.absDelta * 100,
    label: best.label,
  };
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(canvas.clientWidth));
  const height = Math.max(1, Math.round(canvas.clientHeight));
  const targetWidth = Math.max(1, Math.round(width * dpr));
  const targetHeight = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureCanvasResolution() {
  const width = Math.max(1, Math.round(canvas.clientWidth));
  const height = Math.max(1, Math.round(canvas.clientHeight));
  const dpr = window.devicePixelRatio || 1;
  const targetWidth = Math.max(1, Math.round(width * dpr));
  const targetHeight = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    resizeCanvas();
  } else {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return { width, height };
}

function refreshLayoutAndViz() {
  resizeCanvas();
  positionMicPanel();
  positionAnalysisPanel();
  drawViz();
}

function scheduleStartupLayoutPasses() {
  let pass = 0;
  const runPass = () => {
    pass += 1;
    refreshLayoutAndViz();
    if (pass < 4) {
      requestAnimationFrame(runPass);
    }
  };
  requestAnimationFrame(runPass);
}

function drawViz() {
  const size = ensureCanvasResolution();
  const width = size.width;
  const height = size.height;
  const bounds = getVisualizationSemitoneBounds();
  const fundamental = Number(fundamentalInput.value) || 130.81;
  const a4 = Number(a4Input.value) || 440;
  const minSemi = bounds.min;
  const maxSemi = bounds.max;
  const decayEnabled = Boolean(decayModeToggle && decayModeToggle.checked);
  const lineX = Math.round(width * 0.5);
  const gridRightX = Math.min(width - 6, lineX + 248);
  const etLabelX = gridRightX;
  const etLineEndX = etLabelX - 52;
  const padTop = 30;
  const padBottom = 30;
  const innerHeight = Math.max(40, height - padTop - padBottom);
  const visibleSpan = Math.max(12, maxSemi - minSemi);
  const labelMode = getLabelMode();
  const showNoteNames = labelMode !== "none";
  const minSpan = 12;
  const maxSpan = 60;
  const spanMix = Math.min(1, Math.max(0, (visibleSpan - minSpan) / (maxSpan - minSpan)));
  const spanScaledFontSize = 14 + (1 - spanMix) * 14;
  const densityMultiplier = showNoteNames ? 1.25 : 1;
  const markerDensity = (ratioMarkers.length / visibleSpan) * densityMultiplier;
  const densityStart = 1.0;
  const densityEnd = 3.2;
  const densityMix = Math.min(1, Math.max(0, (markerDensity - densityStart) / (densityEnd - densityStart)));
  const densityReducedFont = spanScaledFontSize - densityMix * 8;
  const ratioLabelFontSize = Math.max(10, Math.min(28, densityReducedFont));
  const etLabelFontSize = ratioLabelFontSize;

  const yForSemitone = (semi) => {
    const t = (semi - minSemi) / (maxSemi - minSemi);
    return padTop + (1 - t) * innerHeight;
  };

  const vizBg = getCssVar("--viz-bg", "#0a1016");
  const grid = getCssVar("--viz-grid", "rgba(140,170,210,0.08)");
  const gridStrong = getCssVar("--viz-grid-strong", "rgba(140,170,210,0.28)");
  const lineColor = getCssVar("--viz-line", "#4fa9ff");
  const ratioColor = getCssVar("--viz-ratio", "#d2e2ff");
  const etColor = getCssVar("--viz-et", "#9fb6d4");
  const colorFamiliesEnabled = Boolean(colorFamiliesToggle && colorFamiliesToggle.checked);
  const familyFallbackColor = ratioColor;
  const blobGood = getCssVar("--viz-blob-good", "rgba(97,245,177,0.95)");
  const blobWarn = getCssVar("--viz-blob-warn", "rgba(246,198,93,0.95)");
  const blobBad = getCssVar("--viz-blob-bad", "rgba(255,109,109,0.95)");
  const blobGap = getCssVar("--viz-et", "rgba(159,182,212,0.9)");
  const toneColorFor = (tone) => (tone === "warn" ? blobWarn : tone === "bad" ? blobBad : blobGood);
  const markerColorFor = (marker) => {
    if (!colorFamiliesEnabled) {
      return ratioColor;
    }
    const familyPrime = marker && Number.isFinite(marker.primeFamily) ? marker.primeFamily : null;
    if (!familyPrime) {
      return familyFallbackColor;
    }
    return PRIME_FAMILY_COLORS.get(familyPrime) || familyFallbackColor;
  };

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = vizBg;
  ctx.fillRect(0, 0, width, height);

  if (show12EtToggle.checked) {
    for (let semi = Math.ceil(minSemi); semi <= Math.floor(maxSemi); semi += 1) {
      const y = yForSemitone(semi);
      const isOctave = semi % 12 === 0;
      ctx.strokeStyle = isOctave ? gridStrong : grid;
      ctx.lineWidth = isOctave ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(lineX, y);
      ctx.lineTo(etLineEndX, y);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lineX, padTop);
  ctx.lineTo(lineX, height - padBottom);
  ctx.stroke();

  ctx.font = `${ratioLabelFontSize}px 'IBM Plex Sans', sans-serif`;
  ctx.textBaseline = "middle";
  const hasActiveInput = Number.isFinite(displaySemitone) && liveHasActivePitch;

  function measureLabelPart(text, font) {
    if (!text) return 0;
    ctx.save();
    ctx.font = font;
    const width = ctx.measureText(text).width;
    ctx.restore();
    return width;
  }

  function partFont(part, scale = 1) {
    const size = Math.max(8, (Number(part.size) || ratioLabelFontSize) * scale);
    const family = part.family || "'IBM Plex Sans', sans-serif";
    return `${size}px ${family}`;
  }

  function getRatioMarkerTextParts(marker) {
    const useSargam = labelMode === "sargam";
    const parts = [
      {
        text: marker.ratioLabel || marker.label,
        size: ratioLabelFontSize,
        family: "'IBM Plex Sans', sans-serif",
      },
    ];
    if (showNoteNames && marker.noteLabelInfo) {
      parts.push({ text: " \u00b7 ", size: ratioLabelFontSize, family: "'IBM Plex Sans', sans-serif" });
      if (useSargam) {
        parts.push({
          text: marker.noteLabelInfo.sargamText || marker.noteLabelInfo.baseText || marker.noteLabelInfo.pitchClass || "",
          size: ratioLabelFontSize,
          family: "'IBM Plex Sans', sans-serif",
        });
      } else {
        parts.push({
          text: marker.noteLabelInfo.baseText || marker.noteLabelInfo.pitchClass || "",
          size: ratioLabelFontSize,
          family: "'IBM Plex Sans', sans-serif",
        });
        if (marker.noteLabelInfo.suffixText) {
          parts.push({
            text: marker.noteLabelInfo.suffixText,
            size: ratioLabelFontSize,
            family: "'HEJI2Text', 'IBM Plex Sans', sans-serif",
          });
        }
      }
    }
    return parts;
  }

  function getPartsTotalWidth(parts, scale = 1) {
    return parts.reduce((sum, part) => sum + measureLabelPart(part.text, partFont(part, scale)), 0);
  }

  function drawRatioMarkerText(parts, side, anchorX, y, totalWidth, scale = 1) {
    const width = Number.isFinite(totalWidth) ? totalWidth : getPartsTotalWidth(parts, scale);
    let x = side === "right" ? anchorX : anchorX - width;
    for (const part of parts) {
      if (!part.text) continue;
      ctx.font = partFont(part, scale);
      ctx.textAlign = "left";
      ctx.fillText(part.text, x, y);
      x += measureLabelPart(part.text, partFont(part, scale));
    }
  }

  const labelHeight = Math.max(12, ratioLabelFontSize * 0.9);
  const labelPad = 2;
  const laneStep = Math.max(20, ratioLabelFontSize * 1.4);
  const collisionProximityX = Math.max(6, ratioLabelFontSize * 0.35);
  const collisionProximityY = Math.max(6, ratioLabelFontSize * 0.3);
  const labelRects = [];
  let alternateOnOverlap = false;

  function getLabelRect(side, anchorX, y, totalWidth) {
    const left = side === "right" ? anchorX : anchorX - totalWidth;
    const right = left + totalWidth;
    return {
      left,
      right,
      top: y - labelHeight / 2 - labelPad,
      bottom: y + labelHeight / 2 + labelPad,
    };
  }

  function rectsOverlap(a, b, padX = 0, padY = 0) {
    return !(
      a.right + padX <= b.left - padX ||
      a.left - padX >= b.right + padX ||
      a.bottom + padY <= b.top - padY ||
      a.top - padY >= b.bottom + padY
    );
  }

  function isRectVisible(rect) {
    return rect.left >= 4 && rect.right <= width - 4;
  }

  function clampAnchorForSide(side, anchorX, totalWidth) {
    const minX = 4;
    const maxX = width - 4;
    if (side === "right") {
      const minAnchor = minX;
      const maxAnchor = maxX - totalWidth;
      if (!Number.isFinite(maxAnchor) || maxAnchor < minAnchor) {
        return minAnchor;
      }
      return Math.max(minAnchor, Math.min(maxAnchor, anchorX));
    }
    const minAnchor = minX + totalWidth;
    const maxAnchor = maxX;
    if (!Number.isFinite(minAnchor) || minAnchor > maxAnchor) {
      return maxAnchor;
    }
    return Math.max(minAnchor, Math.min(maxAnchor, anchorX));
  }

  function findPlacementForMarker(y, totalWidth, primarySide = "left") {
    const secondarySide = primarySide === "left" ? "right" : "left";
    const maxLaneSearch = 120;
    for (let laneIndex = 0; laneIndex <= maxLaneSearch; laneIndex += 1) {
      const primaryOffset = Math.max(18, ratioLabelFontSize * 1.25) + laneIndex * laneStep;
      const primaryAnchorX = primarySide === "right" ? lineX + primaryOffset : lineX - primaryOffset;
      const primaryRect = getLabelRect(primarySide, primaryAnchorX, y, totalWidth);
      const primaryCollision = labelRects.some((existing) =>
        rectsOverlap(primaryRect, existing, collisionProximityX, collisionProximityY)
      );
      if (!primaryCollision && isRectVisible(primaryRect)) {
        return { side: primarySide, lane: laneIndex, anchorX: primaryAnchorX, rect: primaryRect };
      }

      const secondaryOffset = Math.max(18, ratioLabelFontSize * 1.25) + laneIndex * laneStep;
      const secondaryAnchorX = secondarySide === "right" ? lineX + secondaryOffset : lineX - secondaryOffset;
      const secondaryRect = getLabelRect(secondarySide, secondaryAnchorX, y, totalWidth);
      const secondaryCollision = labelRects.some((existing) =>
        rectsOverlap(secondaryRect, existing, collisionProximityX, collisionProximityY)
      );
      if (!secondaryCollision && isRectVisible(secondaryRect)) {
        return { side: secondarySide, lane: laneIndex, anchorX: secondaryAnchorX, rect: secondaryRect };
      }
    }
    return null;
  }

  function findPlacementForSideOnly(y, totalWidth, side = "right") {
    const maxLaneSearch = 120;
    for (let laneIndex = 0; laneIndex <= maxLaneSearch; laneIndex += 1) {
      const offset = Math.max(18, ratioLabelFontSize * 1.25) + laneIndex * laneStep;
      const anchorX = side === "right" ? lineX + offset : lineX - offset;
      const rect = getLabelRect(side, anchorX, y, totalWidth);
      const collision = labelRects.some((existing) =>
        rectsOverlap(rect, existing, collisionProximityX, collisionProximityY)
      );
      if (!collision && isRectVisible(rect)) {
        return { side, lane: laneIndex, anchorX, rect };
      }
    }
    return null;
  }

  for (let index = 0; index < ratioMarkers.length; index += 1) {
    const marker = ratioMarkers[index];
    const markerAlpha = 1;
    const markerColor = markerColorFor(marker);
    const y = yForSemitone(marker.semitone);
    const isOctaveMarker = Math.abs(marker.semitone - Math.round(marker.semitone / 12) * 12) <= 0.02;
    const parts = getRatioMarkerTextParts(marker);
    const baselineOffset = Math.max(18, ratioLabelFontSize * 1.25);
    const baselineSide = isOctaveMarker ? "right" : "left";
    const scaleCandidates = isMobileMode
      ? [1, 0.94, 0.88, 0.82, 0.76, 0.7]
      : [1];

    let chosenScale = 1;
    let side = baselineSide;
    let anchorX = baselineSide === "right" ? lineX + baselineOffset : lineX - baselineOffset;
    let labelRect = null;
    let chosenTotalWidth = 0;

    for (let s = 0; s < scaleCandidates.length; s += 1) {
      const scale = scaleCandidates[s];
      const totalWidth = getPartsTotalWidth(parts, scale);
      const baselineAnchorRaw = baselineSide === "right" ? lineX + baselineOffset : lineX - baselineOffset;
      const baselineAnchor = clampAnchorForSide(baselineSide, baselineAnchorRaw, totalWidth);
      const baselineRect = getLabelRect(baselineSide, baselineAnchor, y, totalWidth);
      const baselineCollision =
        !isRectVisible(baselineRect) ||
        labelRects.some((existing) =>
          rectsOverlap(baselineRect, existing, collisionProximityX, collisionProximityY)
        );
      if (!baselineCollision) {
        chosenScale = scale;
        chosenTotalWidth = totalWidth;
        side = baselineSide;
        anchorX = baselineAnchor;
        labelRect = baselineRect;
        break;
      }

      const placement = isOctaveMarker
        ? findPlacementForSideOnly(y, totalWidth, "right") ||
          (isMobileMode ? findPlacementForSideOnly(y, totalWidth, "left") : null)
        : (() => {
            alternateOnOverlap = !alternateOnOverlap;
            const primarySide = alternateOnOverlap ? "right" : "left";
            return findPlacementForMarker(y, totalWidth, primarySide);
          })();
      if (placement) {
        chosenScale = scale;
        chosenTotalWidth = totalWidth;
        side = placement.side;
        anchorX = clampAnchorForSide(side, placement.anchorX, totalWidth);
        labelRect = getLabelRect(side, anchorX, y, totalWidth);
        break;
      }
    }

    if (!labelRect) {
      chosenScale = scaleCandidates[scaleCandidates.length - 1] || 1;
      chosenTotalWidth = getPartsTotalWidth(parts, chosenScale);
      side = isOctaveMarker ? (isMobileMode ? "left" : "right") : baselineSide;
      const fallbackAnchorRaw = side === "right" ? lineX + baselineOffset : lineX - baselineOffset;
      anchorX = clampAnchorForSide(side, fallbackAnchorRaw, chosenTotalWidth);
      labelRect = getLabelRect(side, anchorX, y, chosenTotalWidth);
    }

    const connectorEndX = side === "right" ? anchorX - 5 : anchorX + 5;

    ctx.globalAlpha = markerAlpha;
    ctx.strokeStyle = markerColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lineX, y);
    ctx.lineTo(connectorEndX, y);
    ctx.stroke();

    ctx.fillStyle = markerColor;
    drawRatioMarkerText(parts, side, anchorX, y, chosenTotalWidth, chosenScale);
    labelRects.push(labelRect);
    ctx.globalAlpha = 1;
  }

  if (show12EtToggle.checked) {
    const fundamentalMidi = 69 + 12 * Math.log2(fundamental / a4);
    ctx.font = `${etLabelFontSize}px 'IBM Plex Sans', sans-serif`;
    for (let semi = Math.ceil(minSemi); semi <= Math.floor(maxSemi); semi += 1) {
      const y = yForSemitone(semi);
      const midi = Math.round(fundamentalMidi + semi);
      const label = `${noteNamesSharp[mod(midi, 12)]}${Math.floor(midi / 12) - 1}`;
      ctx.fillStyle = etColor;
      ctx.textAlign = "right";
      ctx.fillText(label, etLabelX, y);
    }
  }

  if (decayEnabled && decayTrailPoints.length > 1) {
    const nowMs = performance.now();
    const trailDurationMs = DECAY_TRAIL_DURATION_MS;
    const trailSpeedPxPerMs = Math.max(0.04, lineX / trailDurationMs);
    const trailRightX = lineX;
    const visible = [];
    for (let i = 0; i < decayTrailPoints.length; i += 1) {
      const point = decayTrailPoints[i];
      const age = nowMs - point.t;
      if (age < 0 || age > trailDurationMs || !Number.isFinite(point.semitone)) {
        continue;
      }
      const x = trailRightX - age * trailSpeedPxPerMs;
      if (x < -32 || x > width + 32) {
        continue;
      }
      visible.push({
        x,
        y:
          Number(point.outDirection) < 0
            ? height
            : Number(point.outDirection) > 0
              ? 0
              : yForSemitone(point.semitone),
        alpha: 1 - age / trailDurationMs,
        tone: point.tone || "good",
        strength: Number.isFinite(point.strength) ? point.strength : 1,
      });
    }

    if (visible.length > 1) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i < visible.length; i += 1) {
        const prev = visible[i - 1];
        const next = visible[i];
        const strength = Math.max(0.08, Math.min(1, (prev.strength + next.strength) * 0.5));
        const alpha = Math.max(0, Math.min(1, (prev.alpha + next.alpha) * 0.5)) * strength;
        const color = toneColorFor(next.tone);

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * 0.92;
        ctx.lineWidth = 1.2 + 4.2 * alpha;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      const head = visible[visible.length - 1];
      if (head) {
        const radius = 4 + head.alpha * 7;
        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, radius);
        glow.addColorStop(0, toneColorFor(head.tone));
        glow.addColorStop(1, "rgba(97,245,177,0)");
        ctx.globalAlpha = head.alpha * Math.max(0.15, head.strength) * 0.42;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(head.x, head.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  if (hasActiveInput) {
    const y =
      liveOutOfRangeDirection < 0
        ? height
        : liveOutOfRangeDirection > 0
          ? 0
          : yForSemitone(displaySemitone);
    const nearestRatio = getNearestRatioAtSemitone(displaySemitone);
    const centsOff = nearestRatio ? nearestRatio.centsAbs : 0;
    const centsSigned = nearestRatio ? nearestRatio.cents : 0;
    const blobColor =
      centsOff <= 8 ? blobGood : centsOff <= 24 ? blobWarn : blobBad;

    ctx.fillStyle = blobColor;
    ctx.beginPath();
    ctx.arc(lineX, y, 10, 0, Math.PI * 2);
    ctx.fill();

    if (nearestRatio && (!showCentsDeviationToggle || showCentsDeviationToggle.checked)) {
      ctx.font = `${Math.max(10, ratioLabelFontSize)}px 'IBM Plex Sans', sans-serif`;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = etColor;
      const centsRounded = Math.round(centsSigned);
      const centsText = centsRounded === 0 ? "0" : `${centsRounded > 0 ? "+" : ""}${centsRounded}`;
      ctx.fillText(`${centsText}c`, lineX + 34, y - 18);
    }
    liveBlobTone = centsOff <= 8 ? "good" : centsOff <= 24 ? "warn" : "bad";
  } else if (Number.isFinite(noPitchHoldSemitone) && noPitchHoldStrength > 0) {
    const y = yForSemitone(noPitchHoldSemitone);
    const alpha = Math.max(0, Math.min(1, noPitchHoldStrength));
    const radius = 7 + 3 * alpha;
    ctx.save();
    ctx.globalAlpha = 0.2 + 0.7 * alpha;
    ctx.fillStyle = blobGap;
    ctx.beginPath();
    ctx.arc(lineX, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    liveBlobTone = null;
  } else {
    liveBlobTone = null;
  }
}

function computeRms(buffer) {
  if (!buffer || !buffer.length) {
    return 0;
  }
  let rms = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    const sample = buffer[i];
    rms += sample * sample;
  }
  return Math.sqrt(rms / buffer.length);
}

function getWindowedRms(rawRms) {
  const windowFrames = Math.max(1, Math.round(analysisConfig.rmsWindowFrames));
  rmsWindowValues.push(rawRms);
  if (rmsWindowValues.length > windowFrames) {
    rmsWindowValues.splice(0, rmsWindowValues.length - windowFrames);
  }
  const total = rmsWindowValues.reduce((sum, value) => sum + value, 0);
  return total / Math.max(1, rmsWindowValues.length);
}

function detectPitchWithConfig(buffer, sampleRate, windowedRms, rawRms, cfg) {
  const size = buffer.length;
  if (windowedRms < cfg.rmsThreshold) {
    return { frequency: null, correlation: 0, reason: "rms_gate", rmsRaw: rawRms, rmsWindowed: windowedRms };
  }

  function correlationAtOffset(offset) {
    let corr = 0;
    for (let i = 0; i < size - offset; i += 1) {
      corr += Math.abs(buffer[i] - buffer[i + offset]);
    }
    return 1 - corr / (size - offset);
  }

  let bestOffset = -1;
  let bestCorrelation = 0;
  const minFreq = Math.max(20, cfg.minFreq);
  const maxFreq = Math.max(minFreq + 1, cfg.maxFreq);
  const minOffset = Math.floor(sampleRate / maxFreq);
  const maxOffset = Math.floor(sampleRate / minFreq);

  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    const correlation = correlationAtOffset(offset);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset === -1) {
    return { frequency: null, correlation: bestCorrelation, reason: "no_offset", rmsRaw: rawRms, rmsWindowed: windowedRms };
  }
  if (bestCorrelation < cfg.correlationThreshold) {
    return {
      frequency: null,
      correlation: bestCorrelation,
      reason: "correlation_gate",
      rmsRaw: rawRms,
      rmsWindowed: windowedRms,
    };
  }
  let refinedOffset = bestOffset;
  // Sub-sample peak interpolation reduces integer-lag quantization jitter.
  if (bestOffset > minOffset && bestOffset < maxOffset) {
    const corrPrev = correlationAtOffset(bestOffset - 1);
    const corrMid = bestCorrelation;
    const corrNext = correlationAtOffset(bestOffset + 1);
    const denom = corrPrev - 2 * corrMid + corrNext;
    if (Math.abs(denom) > 1e-9) {
      const shift = 0.5 * (corrPrev - corrNext) / denom;
      const clampedShift = Math.max(-1, Math.min(1, shift));
      refinedOffset = bestOffset + clampedShift;
    }
  }
  return {
    frequency: sampleRate / refinedOffset,
    correlation: bestCorrelation,
    reason: "ok",
    rmsRaw: rawRms,
    rmsWindowed: windowedRms,
  };
}

function detectPitch(buffer, sampleRate, windowedRms, rawRms) {
  return detectPitchWithConfig(buffer, sampleRate, windowedRms, rawRms, analysisConfig);
}

function updateInputMeter(buffer) {
  if (!micMeterFill || !micMeterText || !buffer || !buffer.length) {
    return;
  }
  let rms = 0;
  let peak = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    const sample = buffer[i];
    const abs = Math.abs(sample);
    if (abs > peak) {
      peak = abs;
    }
    rms += sample * sample;
  }
  rms = Math.sqrt(rms / buffer.length);
  const db = rms > 0 ? 20 * Math.log10(rms) : -120;
  const norm = Math.max(0, Math.min(1, (db + 60) / 60));
  micMeterFill.style.width = `${Math.round(norm * 100)}%`;
  micMeterFill.classList.remove("is-ok", "is-hot");

  let state = "Low";
  if (peak >= 0.98 || db > -8) {
    state = "Too high";
    micMeterFill.classList.add("is-hot");
  } else if (db >= -34) {
    state = "Healthy";
    micMeterFill.classList.add("is-ok");
  }
  micMeterText.textContent = `Input: ${state} (${Math.round(db)} dB)`;
}

function resetLiveTrackingState(clearSmooth = false) {
  pendingJumpSemitone = null;
  pendingJumpFrames = 0;
  pendingOctaveSemitone = null;
  pendingOctaveFrames = 0;
  liveMedianSemitoneHistory = [];
  liveOnsetSemitoneHistory = [];
  inactivePitchFrames = 0;
  pendingOutOfRangeDirection = 0;
  pendingOutOfRangeFrames = 0;
  liveAcceptedRawSemitone = null;
  livePendingRawJumpSemitone = null;
  livePendingRawJumpFrames = 0;
  liveVoiced = false;
  liveVoicedEnterFrames = 0;
  liveVoicedExitFrames = 0;
  liveOnsetQuarantineFramesRemaining = 0;
  if (clearSmooth) {
    smoothSemitone = null;
    displaySemitone = null;
    noPitchHoldSemitone = null;
    noPitchHoldStrength = 0;
    noPitchHoldLastMs = 0;
    lastInRangeTrackedSemitone = null;
  }
}

function updateNoPitchHoldState(nowMs, anchorSemitone = null, hasTrackedPitch = false) {
  if (hasTrackedPitch && Number.isFinite(anchorSemitone)) {
    noPitchHoldSemitone = anchorSemitone;
    noPitchHoldStrength = 1;
    noPitchHoldLastMs = nowMs;
    return;
  }
  if (!Number.isFinite(noPitchHoldSemitone) || noPitchHoldStrength <= 0) {
    noPitchHoldSemitone = null;
    noPitchHoldStrength = 0;
    noPitchHoldLastMs = nowMs;
    return;
  }
  const deltaMs = Math.max(0, nowMs - (noPitchHoldLastMs || nowMs));
  noPitchHoldLastMs = nowMs;
  const fadeTauMs = 420;
  noPitchHoldStrength *= Math.exp(-deltaMs / fadeTauMs);
  if (!Number.isFinite(noPitchHoldStrength) || noPitchHoldStrength < 0.03) {
    noPitchHoldSemitone = null;
    noPitchHoldStrength = 0;
  }
}

function getVoiceGateThresholds(cfg = analysisConfig) {
  const baseRms = Math.max(0.0001, Number(cfg.rmsThreshold) || 0.01);
  const baseCorr = clampNumber(Number(cfg.correlationThreshold), 0.5, 0.999, 0.88);
  const enterRmsFactor = Math.max(1, Number(cfg.voiceEnterRmsFactor) || 1.35);
  const exitRmsFactor = clampNumber(Number(cfg.voiceExitRmsFactor), 0.2, 1.2, 0.78);
  const enterCorrOffset = clampNumber(Number(cfg.voiceEnterCorrOffset), -0.1, 0.2, 0.04);
  const exitCorrOffset = clampNumber(Number(cfg.voiceExitCorrOffset), -0.25, 0.15, -0.06);
  return {
    enterRms: baseRms * enterRmsFactor,
    exitRms: baseRms * exitRmsFactor,
    enterCorr: clampNumber(baseCorr + enterCorrOffset, 0.5, 0.999, 0.9),
    exitCorr: clampNumber(baseCorr + exitCorrOffset, 0.35, 0.999, 0.82),
  };
}

function updateLiveVoicedState(hasCandidatePitch, rmsWindowed, correlation, cfg = analysisConfig) {
  const thresholds = getVoiceGateThresholds(cfg);
  const enterFramesRequired = Math.max(1, Math.round(cfg.voiceEnterFrames || 2));
  const exitFramesRequired = Math.max(1, Math.round(cfg.voiceExitFrames || 5));
  const enterReady =
    Boolean(hasCandidatePitch) &&
    Number(rmsWindowed) >= thresholds.enterRms &&
    Number(correlation) >= thresholds.enterCorr;
  const stayReady =
    Boolean(hasCandidatePitch) &&
    Number(rmsWindowed) >= thresholds.exitRms &&
    Number(correlation) >= thresholds.exitCorr;
  let entered = false;
  let exited = false;

  if (!liveVoiced) {
    if (enterReady) {
      liveVoicedEnterFrames += 1;
      if (liveVoicedEnterFrames >= enterFramesRequired) {
        liveVoiced = true;
        liveVoicedEnterFrames = 0;
        liveVoicedExitFrames = 0;
        entered = true;
        liveOnsetQuarantineFramesRemaining = Math.max(
          0,
          Math.round(Number(cfg.onsetQuarantineFrames) || 0)
        );
      }
    } else {
      liveVoicedEnterFrames = 0;
    }
    return { entered, exited, voiced: liveVoiced };
  }

  if (stayReady) {
    liveVoicedExitFrames = 0;
  } else {
    liveVoicedExitFrames += 1;
    if (liveVoicedExitFrames >= exitFramesRequired) {
      liveVoiced = false;
      liveVoicedExitFrames = 0;
      liveVoicedEnterFrames = 0;
      liveOnsetQuarantineFramesRemaining = 0;
      exited = true;
    }
  }
  return { entered, exited, voiced: liveVoiced };
}

function gateRawPitchCandidate(rawPitch, fundamental) {
  if (!Number.isFinite(rawPitch) || rawPitch <= 0 || !Number.isFinite(fundamental) || fundamental <= 0) {
    return { pitchHz: null, reason: "no_raw" };
  }
  const rawSemitone = 12 * Math.log2(rawPitch / fundamental);
  if (!Number.isFinite(rawSemitone)) {
    return { pitchHz: null, reason: "invalid_raw" };
  }

  const threshold = Math.max(0.1, Number(analysisConfig.discontinuityThresholdSt) || 2.8);
  const confirmFrames = Math.max(1, Math.round(analysisConfig.discontinuityConfirmFrames || 2));
  const octaveConfirmFrames = Math.max(
    1,
    Math.round(analysisConfig.discontinuityOctaveConfirmFrames || Math.max(confirmFrames + 1, 4))
  );
  const octaveTolerance = Math.max(0.05, Number(analysisConfig.octaveFlipTolerance) || 0.45);

  if (!Number.isFinite(liveAcceptedRawSemitone)) {
    const initConfirmFrames = Math.max(1, Math.round(analysisConfig.rawInitConfirmFrames || 2));
    const initTolerance = Math.max(0.05, Number(analysisConfig.rawInitStabilitySemitones) || 0.9);
    const nearPending =
      Number.isFinite(livePendingRawJumpSemitone) &&
      Math.abs(rawSemitone - livePendingRawJumpSemitone) <= initTolerance;
    if (nearPending) {
      livePendingRawJumpFrames += 1;
      livePendingRawJumpSemitone = livePendingRawJumpSemitone * 0.6 + rawSemitone * 0.4;
    } else {
      livePendingRawJumpSemitone = rawSemitone;
      livePendingRawJumpFrames = 1;
    }
    if (livePendingRawJumpFrames >= initConfirmFrames && Number.isFinite(livePendingRawJumpSemitone)) {
      liveAcceptedRawSemitone = livePendingRawJumpSemitone;
      livePendingRawJumpSemitone = null;
      livePendingRawJumpFrames = 0;
      return {
        pitchHz: fundamental * Math.pow(2, liveAcceptedRawSemitone / 12),
        reason: "accepted_initial",
      };
    }
    return { pitchHz: null, reason: "pending_initial" };
  }

  const jumpDelta = Math.abs(rawSemitone - liveAcceptedRawSemitone);
  if (jumpDelta <= threshold) {
    liveAcceptedRawSemitone = rawSemitone;
    livePendingRawJumpSemitone = null;
    livePendingRawJumpFrames = 0;
    return { pitchHz: rawPitch, reason: "accepted_nearby" };
  }

  const octaveLike = Math.abs(jumpDelta - 12) <= octaveTolerance;
  const requiredFrames = octaveLike ? octaveConfirmFrames : confirmFrames;
  const nearPending =
    Number.isFinite(livePendingRawJumpSemitone) &&
    Math.abs(rawSemitone - livePendingRawJumpSemitone) <= threshold;
  if (nearPending) {
    livePendingRawJumpFrames += 1;
    livePendingRawJumpSemitone = livePendingRawJumpSemitone * 0.65 + rawSemitone * 0.35;
  } else {
    livePendingRawJumpSemitone = rawSemitone;
    livePendingRawJumpFrames = 1;
  }

  if (livePendingRawJumpFrames >= requiredFrames && Number.isFinite(livePendingRawJumpSemitone)) {
    liveAcceptedRawSemitone = livePendingRawJumpSemitone;
    livePendingRawJumpSemitone = null;
    livePendingRawJumpFrames = 0;
    return {
      pitchHz: fundamental * Math.pow(2, liveAcceptedRawSemitone / 12),
      reason: octaveLike ? "accepted_octave_jump" : "accepted_far_jump",
    };
  }
  return { pitchHz: null, reason: octaveLike ? "rejected_octave_jump" : "rejected_far_jump" };
}

function updateTrackedSemitone(candidateSemitone, correlation = 1) {
  if (!Number.isFinite(candidateSemitone)) {
    resetLiveTrackingState(false);
    return false;
  }

  const medianWindowFrames = Math.max(1, Math.round(analysisConfig.medianWindowFrames || 1));
  liveMedianSemitoneHistory.push(candidateSemitone);
  if (liveMedianSemitoneHistory.length > medianWindowFrames) {
    liveMedianSemitoneHistory.splice(0, liveMedianSemitoneHistory.length - medianWindowFrames);
  }
  let stabilizedCandidate = median(liveMedianSemitoneHistory);
  if (!Number.isFinite(stabilizedCandidate)) {
    stabilizedCandidate = candidateSemitone;
  }

  if (!Number.isFinite(smoothSemitone)) {
    smoothSemitone = stabilizedCandidate;
    pendingJumpSemitone = null;
    pendingJumpFrames = 0;
    pendingOctaveSemitone = null;
    pendingOctaveFrames = 0;
    return true;
  }

  const octaveDelta = Math.abs(Math.abs(stabilizedCandidate - smoothSemitone) - 12);
  const octaveTolerance = Math.max(0.05, Number(analysisConfig.octaveFlipTolerance) || 0.45);
  let confirmedOctaveJump = false;
  if (octaveDelta <= octaveTolerance) {
    const jumpThreshold = Math.max(0.01, Number(analysisConfig.jumpThreshold) || 0.65);
    const nearPending =
      Number.isFinite(pendingOctaveSemitone) &&
      Math.abs(stabilizedCandidate - pendingOctaveSemitone) <= jumpThreshold;
    if (nearPending) {
      pendingOctaveFrames += 1;
      pendingOctaveSemitone = pendingOctaveSemitone * 0.65 + stabilizedCandidate * 0.35;
    } else {
      pendingOctaveSemitone = stabilizedCandidate;
      pendingOctaveFrames = 1;
    }
    if (pendingOctaveFrames < Math.max(1, Math.round(analysisConfig.octaveFlipConfirmFrames || 3))) {
      return false;
    }
    confirmedOctaveJump = true;
    if (Number.isFinite(pendingOctaveSemitone)) {
      stabilizedCandidate = pendingOctaveSemitone;
    }
    pendingOctaveSemitone = null;
    pendingOctaveFrames = 0;
  } else {
    pendingOctaveSemitone = null;
    pendingOctaveFrames = 0;
  }

  const unclampedCandidate = stabilizedCandidate;
  if (!confirmedOctaveJump) {
    const maxStep = Math.max(0.05, Number(analysisConfig.maxSemitoneStepPerFrame) || 0.9);
    const stepDelta = stabilizedCandidate - smoothSemitone;
    if (Math.abs(stepDelta) > maxStep) {
      stabilizedCandidate = smoothSemitone + Math.sign(stepDelta) * maxStep;
    }
  }

  const jumpThreshold = Math.max(0.01, Number(analysisConfig.jumpThreshold) || 0.65);
  const unclampedJumpDelta = Math.abs(unclampedCandidate - smoothSemitone);
  if (unclampedJumpDelta <= jumpThreshold) {
    const stableDeadbandSt = Math.max(0, Number(analysisConfig.stabilityDeadbandCents) || 0) / 100;
    const stableFollow = clampNumber(Number(analysisConfig.stabilityFollow), 0.0005, 0.2, 0.02);
    const stableCorrFloor = clampNumber(Number(analysisConfig.stabilityMinCorrelation), 0.8, 0.999, 0.985);
    if (unclampedJumpDelta <= stableDeadbandSt && Number(correlation) >= stableCorrFloor) {
      smoothSemitone = smoothSemitone * (1 - stableFollow) + stabilizedCandidate * stableFollow;
      pendingJumpSemitone = null;
      pendingJumpFrames = 0;
      return true;
    }
    const baseFollow = Number(analysisConfig.smoothFollow);
    const dynamicFollow = Math.min(
      0.95,
      Math.max(0.01, baseFollow + Math.min(0.55, unclampedJumpDelta * 0.07))
    );
    const corrNorm = clampNumber((Number(correlation) - 0.84) / 0.15, 0, 1, 1);
    const confidenceScale = 0.55 + 0.45 * corrNorm;
    const adaptiveFollow = dynamicFollow * confidenceScale;
    const follow = confirmedOctaveJump ? Math.max(adaptiveFollow, 0.58) : adaptiveFollow;
    smoothSemitone = smoothSemitone * (1 - follow) + stabilizedCandidate * follow;
    pendingJumpSemitone = null;
    pendingJumpFrames = 0;
    return true;
  }

  const nearPending =
    Number.isFinite(pendingJumpSemitone) &&
    Math.abs(unclampedCandidate - pendingJumpSemitone) <= jumpThreshold;
  if (nearPending) {
    pendingJumpFrames += 1;
    pendingJumpSemitone = pendingJumpSemitone * 0.65 + unclampedCandidate * 0.35;
    if (pendingJumpFrames >= Math.max(1, Math.round(analysisConfig.jumpConfirmFrames))) {
      smoothSemitone = smoothSemitone * 0.65 + pendingJumpSemitone * 0.35;
      pendingJumpSemitone = null;
      pendingJumpFrames = 0;
      return true;
    }
    return false;
  }

  pendingJumpSemitone = unclampedCandidate;
  pendingJumpFrames = 1;
  return false;
}

function updateReadout(freq, options = {}) {
  const outOfRange = Boolean(options.outOfRange);
  if (!freq || !Number.isFinite(freq)) {
    hzEl.textContent = "-- Hz";
    noteEl.textContent = "--";
    centsEl.textContent = "--";
    if (outOfRangeReadoutEl) {
      outOfRangeReadoutEl.textContent = outOfRange ? "Out of Range" : "";
    }
    statusEl.textContent = outOfRange ? "Out of range" : "Listening...";
    return;
  }
  const fundamental = getFundamentalHz();
  const semitone =
    Number.isFinite(fundamental) && fundamental > 0 ? 12 * Math.log2(freq / fundamental) : null;
  const nearestRatio = getNearestRatioAtSemitone(semitone);
  hzEl.textContent = `${freq.toFixed(2)} Hz`;
  noteEl.textContent = nearestRatio ? nearestRatio.label : "--";
  const cents = nearestRatio ? Math.round(nearestRatio.cents) : 0;
  centsEl.textContent = cents === 0 ? "0" : `${cents > 0 ? "+" : ""}${cents}`;
  if (outOfRangeReadoutEl) {
    outOfRangeReadoutEl.textContent = outOfRange ? "Out of Range" : "";
  }
  statusEl.textContent = "Tracking pitch";
}

function getVisualizationSemitoneBounds() {
  const min = getBottomSemitoneValue();
  const max = getTopSemitoneValue();
  if (min >= max) {
    return { min: 0, max: 12 };
  }
  return { min, max };
}

function isPitchWithinVisualizationRange(freq) {
  const fundamental = getFundamentalHz();
  if (!Number.isFinite(freq) || freq <= 0 || !Number.isFinite(fundamental) || fundamental <= 0) {
    return false;
  }
  const semitone = 12 * Math.log2(freq / fundamental);
  const bounds = getVisualizationSemitoneBounds();
  const margin = Math.max(0, analysisConfig.rangeMargin);
  return semitone >= bounds.min - margin && semitone <= bounds.max + margin;
}

function updateDecayTrail(nowMs) {
  const enabled = Boolean(decayModeToggle && decayModeToggle.checked);
  const trailDurationMs = DECAY_TRAIL_DURATION_MS;
  if (!enabled) {
    decayTrailPoints = [];
    lastDecayTrailSampleMs = 0;
    return;
  }
  const cutoff = nowMs - trailDurationMs;
  decayTrailPoints = decayTrailPoints.filter((point) => point && point.t >= cutoff);
  if (!liveHasActivePitch || !Number.isFinite(displaySemitone)) {
    return;
  }
  if (!lastDecayTrailSampleMs || nowMs - lastDecayTrailSampleMs >= 20) {
    let nearestDiff = null;
    for (let index = 0; index < ratioMarkers.length; index += 1) {
      const marker = ratioMarkers[index];
      const diff = Math.abs(marker.semitone - displaySemitone);
      if (!Number.isFinite(nearestDiff) || diff < nearestDiff) {
        nearestDiff = diff;
      }
    }
    const centsOff = Number.isFinite(nearestDiff) ? nearestDiff * 100 : 0;
    const tone = centsOff <= 8 ? "good" : centsOff <= 24 ? "warn" : "bad";
    decayTrailPoints.push({
      semitone: displaySemitone,
      outDirection: Number.isFinite(liveOutOfRangeDirection) ? liveOutOfRangeDirection : 0,
      t: nowMs,
      tone,
      strength: Math.max(0.08, Math.min(1, liveInputStrength || 0)),
    });
    lastDecayTrailSampleMs = nowMs;
  }
}

function normalizePitchToRange(rawPitch, fundamental, bounds, margin, referenceSemitone = null) {
  if (!Number.isFinite(rawPitch) || rawPitch <= 0 || !Number.isFinite(fundamental) || fundamental <= 0) {
    return { frequency: null, semitone: null, inRange: false, adjusted: false, outDirection: 0 };
  }
  const rawSemitone = 12 * Math.log2(rawPitch / fundamental);
  const minAllowed = bounds.min - margin;
  const maxAllowed = bounds.max + margin;
  const isInRange = (semi) => semi >= minAllowed && semi <= maxAllowed;
  const outDirection = rawSemitone < bounds.min ? -1 : rawSemitone > bounds.max ? 1 : 0;
  return {
    frequency: rawPitch,
    semitone: rawSemitone,
    inRange: isInRange(rawSemitone),
    adjusted: false,
    outDirection,
  };
}

function renderLoop() {
  const nowMs = performance.now();
  if (analyser && timeData && audioContext) {
    analyser.getFloatTimeDomainData(timeData);
    updateInputMeter(timeData);
    const rmsRaw = computeRms(timeData);
    const rmsWindowed = getWindowedRms(rmsRaw);
    const rmsFloor = Math.max(0.0001, analysisConfig.rmsThreshold);
    const rmsCeil = Math.max(rmsFloor * 10, 0.08);
    liveInputStrength = Math.max(0, Math.min(1, (rmsWindowed - rmsFloor) / (rmsCeil - rmsFloor)));
    const detection = detectPitch(timeData, audioContext.sampleRate, rmsWindowed, rmsRaw);
    const rawPitchDetected = detection.frequency;
    const fundamental = Number(fundamentalInput.value) || 130.81;
    const rawGate = gateRawPitchCandidate(rawPitchDetected, fundamental);
    const rawPitch = rawGate.pitchHz;
    const hasDetectedRaw = Boolean(rawPitchDetected && Number.isFinite(rawPitchDetected));
    const voicedState = updateLiveVoicedState(
      Boolean(rawPitch && Number.isFinite(rawPitch)),
      rmsWindowed,
      detection.correlation
    );
    if (voicedState.entered) {
      smoothSemitone = null;
      displaySemitone = null;
      pendingJumpSemitone = null;
      pendingJumpFrames = 0;
      pendingOctaveSemitone = null;
      pendingOctaveFrames = 0;
      liveMedianSemitoneHistory = [];
      liveOnsetSemitoneHistory = [];
      inactivePitchFrames = 0;
    } else if (voicedState.exited) {
      displaySemitone = null;
      smoothSemitone = null;
      liveMedianSemitoneHistory = [];
      liveOnsetSemitoneHistory = [];
    }
    const bounds = getVisualizationSemitoneBounds();
    const margin = Math.max(0, analysisConfig.rangeMargin);
    const normalized = normalizePitchToRange(rawPitch, fundamental, bounds, margin, smoothSemitone);
    const rawDetectedNormalized = normalizePitchToRange(
      rawPitchDetected,
      fundamental,
      bounds,
      margin,
      smoothSemitone
    );
    const rawDetectedOutOfRange = hasDetectedRaw && !rawDetectedNormalized.inRange;
    const inRange = normalized.inRange;
    const pitch = inRange ? normalized.frequency : null;
    const hasUsablePitch = Boolean(liveVoiced && pitch && Number.isFinite(pitch));
    detectedPitchHz = null;
    liveHasActivePitch = false;
    if (liveVoiced && rawPitch && Number.isFinite(rawPitch) && !inRange) {
      outOfRangeFrames += 1;
      liveOutOfRangeDirection = normalized.outDirection || 0;
      const clampConfirmFrames = Math.max(1, Math.round(analysisConfig.outOfRangeClampConfirmFrames || 2));
      const clampCorrGate = clampNumber(
        Number(analysisConfig.outOfRangeClampCorrelation),
        0.5,
        0.999,
        0.97
      );
      const confidentOutOfRange = Number(detection.correlation) >= clampCorrGate;
      if (liveOutOfRangeDirection !== pendingOutOfRangeDirection || !confidentOutOfRange) {
        pendingOutOfRangeDirection = liveOutOfRangeDirection;
        pendingOutOfRangeFrames = confidentOutOfRange ? 1 : 0;
      } else {
        pendingOutOfRangeFrames += 1;
      }
      const canClampToEdge =
        confidentOutOfRange &&
        pendingOutOfRangeDirection !== 0 &&
        pendingOutOfRangeFrames >= clampConfirmFrames;
      if (canClampToEdge) {
        displaySemitone = liveOutOfRangeDirection < 0 ? bounds.min : bounds.max;
        liveHasActivePitch = true;
      } else {
        displaySemitone = null;
        liveHasActivePitch = false;
      }
    } else {
      outOfRangeFrames = 0;
      liveOutOfRangeDirection = 0;
      pendingOutOfRangeDirection = 0;
      pendingOutOfRangeFrames = 0;
    }

    if (hasUsablePitch && detection.reason === "ok") {
      inactivePitchFrames = 0;
    } else if (liveVoiced && hasDetectedRaw && !rawPitch) {
      inactivePitchFrames = 0;
    } else {
      inactivePitchFrames += 1;
    }
    if (inactivePitchFrames >= Math.max(1, Math.round(analysisConfig.onsetResetFrames || 8))) {
      resetLiveTrackingState(true);
    }

    if (hasUsablePitch && fundamental > 0) {
      const semi = Number.isFinite(normalized.semitone)
        ? normalized.semitone
        : 12 * Math.log2(pitch / fundamental);
      if (!Number.isFinite(smoothSemitone) && liveOnsetQuarantineFramesRemaining > 0) {
        liveOnsetQuarantineFramesRemaining = Math.max(0, liveOnsetQuarantineFramesRemaining - 1);
        liveOnsetSemitoneHistory = [];
        displaySemitone = null;
        liveHasActivePitch = false;
      } else if (Number.isFinite(smoothSemitone)) {
        liveOnsetSemitoneHistory = [];
        updateTrackedSemitone(semi, detection.correlation);
        displaySemitone = Number.isFinite(smoothSemitone) ? smoothSemitone : semi;
      } else {
        const voicedThresholds = getVoiceGateThresholds(analysisConfig);
        const onsetCorrFloor = Math.max(voicedThresholds.enterCorr, 0.93);
        const onsetRmsFloor = Math.max(voicedThresholds.enterRms, (Number(analysisConfig.rmsThreshold) || 0.01) * 2.2);
        const onsetStableFrames = Math.max(1, Math.round(analysisConfig.onsetConfirmFrames || 3));
        const onsetStability = Math.max(0.1, Number(analysisConfig.onsetStabilitySemitones) || 1.1);
        const onsetTrusted = detection.correlation >= onsetCorrFloor && rmsWindowed >= onsetRmsFloor;
        if (!onsetTrusted) {
          liveOnsetSemitoneHistory = [];
          displaySemitone = null;
        } else {
          liveOnsetSemitoneHistory.push(semi);
          if (liveOnsetSemitoneHistory.length > onsetStableFrames) {
            liveOnsetSemitoneHistory.splice(0, liveOnsetSemitoneHistory.length - onsetStableFrames);
          }
          if (liveOnsetSemitoneHistory.length >= onsetStableFrames) {
            let minSemi = Infinity;
            let maxSemi = -Infinity;
            for (const value of liveOnsetSemitoneHistory) {
              if (value < minSemi) minSemi = value;
              if (value > maxSemi) maxSemi = value;
            }
            if (maxSemi - minSemi <= onsetStability) {
              smoothSemitone = median(liveOnsetSemitoneHistory);
              displaySemitone = smoothSemitone;
              pendingJumpSemitone = null;
              pendingJumpFrames = 0;
              pendingOctaveSemitone = null;
              pendingOctaveFrames = 0;
              liveMedianSemitoneHistory = [];
              liveOnsetSemitoneHistory = [];
            } else {
              displaySemitone = null;
            }
          } else {
            displaySemitone = null;
          }
        }
      }
      liveHasActivePitch = Number.isFinite(displaySemitone);
    } else if (liveVoiced && hasDetectedRaw && !rawPitch && Number.isFinite(smoothSemitone)) {
      // Rejected discontinuity frame: hold stable estimate instead of decaying/resetting.
      displaySemitone = smoothSemitone;
      liveHasActivePitch = true;
    } else if (!liveVoiced) {
      displaySemitone = null;
      liveHasActivePitch = false;
      liveOutOfRangeDirection = 0;
    } else if (!hasDetectedRaw && Number.isFinite(smoothSemitone)) {
      smoothSemitone *= analysisConfig.idleDecay;
      if (Math.abs(smoothSemitone) > 200 || !Number.isFinite(smoothSemitone)) {
        smoothSemitone = null;
      }
      resetLiveTrackingState(false);
      displaySemitone = null;
      liveHasActivePitch = false;
      liveOutOfRangeDirection = 0;
    } else if (!hasDetectedRaw) {
      resetLiveTrackingState(false);
      displaySemitone = null;
      liveHasActivePitch = false;
      liveOutOfRangeDirection = 0;
    }
    const filteredReadoutPitch =
      Number.isFinite(displaySemitone) && liveHasActivePitch && fundamental > 0
        ? fundamental * Math.pow(2, displaySemitone / 12)
        : null;
    const hasInRangeTrackedPitch =
      Number.isFinite(displaySemitone) && liveHasActivePitch && liveOutOfRangeDirection === 0;
    if (hasInRangeTrackedPitch) {
      lastInRangeTrackedSemitone = displaySemitone;
    }
    detectedPitchHz = filteredReadoutPitch;
    const showOutOfRange = rawDetectedOutOfRange;
    const readoutPitch =
      showOutOfRange && Number.isFinite(rawPitchDetected)
        ? rawPitchDetected
        : filteredReadoutPitch;
    updateReadout(readoutPitch, { outOfRange: showOutOfRange });

    const frame = {
      i: ++frameCounter,
      t_ms: Math.round(nowMs),
      detected_pitch_hz: rawPitchDetected,
      raw_pitch_hz: rawPitch,
      raw_semitone:
        rawPitch && Number.isFinite(rawPitch) && fundamental > 0 ? 12 * Math.log2(rawPitch / fundamental) : null,
      raw_gate_reason: rawGate.reason,
      voiced: liveVoiced,
      normalized_pitch_hz: normalized.frequency,
      in_range: Boolean(inRange),
      out_direction: normalized.outDirection || 0,
      used_pitch_hz: pitch,
      display_semitone: displaySemitone,
      smooth_semitone: smoothSemitone,
      rms_raw: detection.rmsRaw,
      rms_windowed: detection.rmsWindowed,
      correlation: detection.correlation,
      reason: detection.reason,
      min_semitone: bounds.min,
      max_semitone: bounds.max,
    };
    pushAnomalyFrame(frame, nowMs);
    maybeTriggerAnomaly(frame, nowMs);
    updateActiveAnomalyCapture(frame, nowMs);
    anomalyCapture.prevFrame = frame;
  }

  updateNoPitchHoldState(nowMs, lastInRangeTrackedSemitone, hasLiveAudioTrack(stream) && Number.isFinite(displaySemitone) && liveHasActivePitch && liveOutOfRangeDirection === 0);
  updateSelfTest(nowMs, liveBlobTone);
  updateDecayTrail(nowMs);

  drawViz();
  rafId = requestAnimationFrame(renderLoop);
}

async function start() {
  if (hasLiveAudioTrack(stream) && micSource && analyser && timeData) {
    return;
  }
  if (stream && !hasLiveAudioTrack(stream)) {
    try {
      stream.getTracks().forEach((track) => track.stop());
    } catch (_error) {
      // no-op
    }
    stream = null;
    resetMicGraphState();
  }
  try {
    await ensureAudioContext();
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      },
    });
    micSource = audioContext.createMediaStreamSource(stream);
    micGainNode = audioContext.createGain();
    micGainNode.gain.value = 1;
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0;
    updateMicGain();
    rebuildAnalysisChain();
    timeData = new Float32Array(analyser.fftSize);
    if (statusEl) {
      statusEl.textContent = "Listening...";
    }
    updateMicUiState();
    // Mic permission can change viewport/layout timing; force a fresh multi-pass redraw.
    scheduleStartupLayoutPasses();
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = "Microphone access failed. Allow mic access and refresh.";
    }
    console.error(error);
    updateMicUiState();
  }
}

function toggleMicPanel() {
  if (!micPanel) {
    return;
  }
  positionMicPanel();
  const opening = micPanel.hidden;
  micPanel.hidden = !opening;
  if (!opening) {
    setToolPanelOpen(analysisPanel, analysisToggle, false);
    setToolPanelOpen(calibratePanel, calibrateToggle, false);
    setCalibrationFocus(false);
  } else {
    positionAnalysisPanel();
  }
  if (isMobileMode && mobileSettingsBackdrop) {
    mobileSettingsBackdrop.hidden = !opening;
  }
  if (startBtn) {
    startBtn.classList.toggle("button-on", opening);
  }
}

function positionMicPanel() {
  if (!micPanel || !startBtn) {
    return;
  }
  if (isMobileMode) {
    micPanel.style.top = "";
    return;
  }
  if (window.matchMedia("(max-width: 760px)").matches) {
    micPanel.style.top = "";
    return;
  }
  const micButtonRect = startBtn.getBoundingClientRect();
  micPanel.style.top = `${Math.max(12, Math.round(micButtonRect.top))}px`;
}

function positionAnalysisPanel() {
  if (!analysisPanel || !analysisToggle) {
    return;
  }
  if (analysisPanel.hidden) {
    return;
  }
  const buttonRect = analysisToggle.getBoundingClientRect();
  const panelRect = analysisPanel.getBoundingClientRect();
  const panelWidth = Math.max(280, Math.round(panelRect.width || 460));
  const panelHeight = Math.max(220, Math.round(panelRect.height || 420));
  const margin = 12;
  let left = Math.round(buttonRect.left);
  let top = Math.round(buttonRect.bottom + 8);
  if (left + panelWidth > window.innerWidth - margin) {
    left = Math.max(margin, Math.round(window.innerWidth - panelWidth - margin));
  }
  if (top + panelHeight > window.innerHeight - margin) {
    top = Math.max(margin, Math.round(window.innerHeight - panelHeight - margin));
  }
  analysisPanel.style.left = `${left}px`;
  analysisPanel.style.top = `${top}px`;
}

function stopMic() {
  if (stream) {
    try {
      stream.getTracks().forEach((track) => track.stop());
    } catch (_error) {
      // no-op
    }
  }
  stream = null;
  resetMicGraphState();
  liveHasActivePitch = false;
  detectedPitchHz = null;
  resetLiveTrackingState(true);
  liveOutOfRangeDirection = 0;
  outOfRangeFrames = 0;
  rmsWindowValues = [];
  decayTrailPoints = [];
  lastDecayTrailSampleMs = 0;
  updateReadout(null, { outOfRange: false });
  if (micMeterFill) {
    micMeterFill.style.width = "0%";
    micMeterFill.classList.remove("is-ok", "is-hot");
  }
  if (micMeterText) {
    micMeterText.textContent = "Input: --";
  }
  updateMicUiState();
}

function updateMicUiState() {
  const micOn = hasLiveAudioTrack(stream);
  if (micPowerToggle) {
    micPowerToggle.textContent = micOn ? "Turn Mic Off" : "Turn Mic On";
  }
  if (micOverlay) {
    micOverlay.hidden = micOn;
  }
}

function updateRangeReadout() {
  const bounds = getVisualizationSemitoneBounds();
  rangeReadout.textContent = `${bounds.min >= 0 ? "+" : ""}${bounds.min}..${
    bounds.max >= 0 ? "+" : ""
  }${bounds.max}`;
}

function syncRangeNumberBoxesFromSliders() {
  // Kept for compatibility with existing init/update call sites.
  // Range is now represented by one slider plus offset state.
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

function getRangeSemitoneValue() {
  const value = Number(rangeSizeInput ? rangeSizeInput.value : 12);
  return Number.isFinite(value) ? value : 12;
}

function getBottomSemitoneValue() {
  const maxOffset = 36 - getRangeSemitoneValue();
  return clampNumber(Number(rangeOffsetSemitones), -12, maxOffset, 0);
}

function getTopSemitoneValue() {
  return getBottomSemitoneValue() + getRangeSemitoneValue();
}

function setRangeSemitoneValue(rangeSemitone) {
  if (!rangeSizeInput) {
    return;
  }
  const clamped = clampNumber(rangeSemitone, 12, 36, 12);
  rangeSizeInput.value = String(clamped);
  rangeOffsetSemitones = clampNumber(getBottomSemitoneValue(), -12, 36 - clamped, 0);
  syncRangeNumberBoxesFromSliders();
  updateRangeReadout();
  refreshMarkers();
}

function setRangeOffsetSemitoneValue(offsetSemitone) {
  const range = getRangeSemitoneValue();
  rangeOffsetSemitones = clampNumber(offsetSemitone, -12, 36 - range, 0);
  syncRangeNumberBoxesFromSliders();
  updateRangeReadout();
  refreshMarkers();
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function updateAnomalyStatus(message = "") {
  if (!anomalyStatus) {
    return;
  }
  const captures = anomalyCapture.captures.length;
  const activeText = anomalyCapture.activeCapture ? " (capturing)" : "";
  const prefix = `Captures: ${captures}${activeText}`;
  anomalyStatus.textContent = message ? `${prefix} · ${message}` : prefix;
}

function framesToCsv(frames) {
  if (!frames.length) {
    return "i,t_ms,raw_pitch_hz,in_range,used_pitch_hz,smooth_semitone,rms_raw,rms_windowed,correlation,reason,min_semitone,max_semitone\n";
  }
  const headers = Object.keys(frames[0]);
  const lines = [headers.join(",")];
  frames.forEach((row) => {
    const values = headers.map((key) => {
      const value = row[key];
      if (value == null) {
        return "";
      }
      if (typeof value === "string") {
        return `"${value.replace(/"/g, "\"\"")}"`;
      }
      return String(value);
    });
    lines.push(values.join(","));
  });
  return `${lines.join("\n")}\n`;
}

function pushAnomalyFrame(frame, nowMs) {
  anomalyCapture.ringFrames.push(frame);
  const cutoff = nowMs - anomalyCapture.maxRingMs;
  while (anomalyCapture.ringFrames.length && anomalyCapture.ringFrames[0].t_ms < cutoff) {
    anomalyCapture.ringFrames.shift();
  }
}

function startAnomalyCapture(nowMs, reason) {
  const preCutoff = nowMs - anomalyCapture.preMs;
  const preFrames = anomalyCapture.ringFrames.filter((frame) => frame.t_ms >= preCutoff);
  anomalyCapture.activeCapture = {
    reason,
    startedAtMs: nowMs,
    frames: preFrames.slice(),
  };
  anomalyCapture.lastTriggerMs = nowMs;
  updateAnomalyStatus(`triggered: ${reason}`);
}

function maybeTriggerAnomaly(frame, nowMs) {
  if (!anomalyCapture.enabled || anomalyCapture.activeCapture) {
    return;
  }
  if (nowMs - anomalyCapture.lastTriggerMs < anomalyCapture.cooldownMs) {
    return;
  }
  const prev = anomalyCapture.prevFrame;
  let reason = "";
  if (
    prev &&
    Number.isFinite(prev.raw_semitone) &&
    Number.isFinite(frame.raw_semitone) &&
    Math.abs(frame.raw_semitone - prev.raw_semitone) >= anomalyCapture.thresholdSt
  ) {
    reason = "raw semitone jump";
  } else if (
    prev &&
    prev.in_range &&
    !frame.in_range &&
    frame.out_direction < 0 &&
    Number.isFinite(frame.raw_semitone) &&
    Number.isFinite(frame.display_semitone) &&
    Math.abs(frame.raw_semitone - frame.display_semitone) >= anomalyCapture.thresholdSt * 0.5
  ) {
    reason = "dropped out of range (low)";
  }
  if (reason) {
    startAnomalyCapture(nowMs, reason);
  }
}

function updateActiveAnomalyCapture(frame, nowMs) {
  if (!anomalyCapture.activeCapture) {
    return;
  }
  anomalyCapture.activeCapture.frames.push(frame);
  if (nowMs - anomalyCapture.activeCapture.startedAtMs >= anomalyCapture.postMs) {
    anomalyCapture.captures.push(anomalyCapture.activeCapture);
    anomalyCapture.activeCapture = null;
    updateAnomalyStatus("capture complete");
  }
}

function getAnomalyFramesForExport() {
  if (!anomalyCapture.captures.length) {
    return [];
  }
  const latest = anomalyCapture.captures[anomalyCapture.captures.length - 1];
  return latest && Array.isArray(latest.frames) ? latest.frames : [];
}

function syncAnomalyControls() {
  if (anomalyEnabledInput) {
    anomalyEnabledInput.checked = anomalyCapture.enabled;
  }
  if (anomalyThresholdInput) {
    anomalyThresholdInput.value = String(anomalyCapture.thresholdSt);
  }
  if (anomalyPreMsInput) {
    anomalyPreMsInput.value = String(Math.round(anomalyCapture.preMs));
  }
  if (anomalyPostMsInput) {
    anomalyPostMsInput.value = String(Math.round(anomalyCapture.postMs));
  }
  if (anomalyCooldownMsInput) {
    anomalyCooldownMsInput.value = String(Math.round(anomalyCapture.cooldownMs));
  }
}

function bindAnalysisNumberInput(input, configKey, min, max, fallback, round = false) {
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    const parsed = Number(input.value);
    const value = clampNumber(parsed, min, max, fallback);
    analysisConfig[configKey] = round ? Math.round(value) : value;
    if (round) {
      input.value = String(Math.round(value));
    }
    syncAnalysisPresetSelect();
    persistSettings();
  });
}

function togglePanelVisibility(panel, toggleButton) {
  if (!panel || !toggleButton) {
    return;
  }
  const willShow = panel.hidden;
  panel.hidden = !willShow;
  toggleButton.classList.toggle("button-on", willShow);
}

function setToolPanelOpen(panel, toggleButton, open) {
  if (!panel || !toggleButton) {
    return;
  }
  panel.hidden = !open;
  toggleButton.classList.toggle("button-on", Boolean(open));
}

function cloneAnalysisConfig() {
  return { ...analysisConfig };
}

function isPresetValueMatch(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) {
    return Math.abs(na - nb) <= 1e-6;
  }
  return a === b;
}

function getMatchingAnalysisPresetName(config = analysisConfig) {
  const keys = Object.keys(ANALYSIS_PRESET_BASE);
  const presetEntries = Object.entries(ANALYSIS_PRESETS).filter(([name]) => name !== "balanced");
  for (const [presetName, presetConfig] of presetEntries) {
    let matches = true;
    for (const key of keys) {
      if (!isPresetValueMatch(config[key], presetConfig[key])) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return presetName;
    }
  }
  let matchesBalanced = true;
  for (const key of keys) {
    if (!isPresetValueMatch(config[key], ANALYSIS_PRESETS.balanced[key])) {
      matchesBalanced = false;
      break;
    }
  }
  return matchesBalanced ? "balanced" : "custom";
}

function syncAnalysisPresetSelect() {
  if (!analysisPresetSelect) {
    return;
  }
  analysisPresetSelect.value = getMatchingAnalysisPresetName(analysisConfig);
}

function applyAnalysisConfig(config) {
  Object.assign(analysisConfig, config);
  if (analysisRmsThresholdInput) analysisRmsThresholdInput.value = String(analysisConfig.rmsThreshold);
  if (analysisRmsWindowInput) analysisRmsWindowInput.value = String(Math.round(analysisConfig.rmsWindowFrames));
  if (analysisCorrThresholdInput)
    analysisCorrThresholdInput.value = String(analysisConfig.correlationThreshold);
  if (analysisRawInitConfirmInput)
    analysisRawInitConfirmInput.value = String(Math.round(analysisConfig.rawInitConfirmFrames));
  if (analysisRawInitStabilityInput)
    analysisRawInitStabilityInput.value = String(analysisConfig.rawInitStabilitySemitones);
  if (analysisMinFreqInput) analysisMinFreqInput.value = String(Math.round(analysisConfig.minFreq));
  if (analysisMaxFreqInput) analysisMaxFreqInput.value = String(Math.round(analysisConfig.maxFreq));
  if (analysisJumpThresholdInput)
    analysisJumpThresholdInput.value = String(analysisConfig.jumpThreshold);
  if (analysisJumpConfirmInput)
    analysisJumpConfirmInput.value = String(Math.round(analysisConfig.jumpConfirmFrames));
  if (analysisVoiceEnterRmsFactorInput)
    analysisVoiceEnterRmsFactorInput.value = String(analysisConfig.voiceEnterRmsFactor);
  if (analysisVoiceExitRmsFactorInput)
    analysisVoiceExitRmsFactorInput.value = String(analysisConfig.voiceExitRmsFactor);
  if (analysisVoiceEnterCorrOffsetInput)
    analysisVoiceEnterCorrOffsetInput.value = String(analysisConfig.voiceEnterCorrOffset);
  if (analysisVoiceExitCorrOffsetInput)
    analysisVoiceExitCorrOffsetInput.value = String(analysisConfig.voiceExitCorrOffset);
  if (analysisVoiceEnterFramesInput)
    analysisVoiceEnterFramesInput.value = String(Math.round(analysisConfig.voiceEnterFrames));
  if (analysisVoiceExitFramesInput)
    analysisVoiceExitFramesInput.value = String(Math.round(analysisConfig.voiceExitFrames));
  if (analysisSmoothFollowInput) analysisSmoothFollowInput.value = String(analysisConfig.smoothFollow);
  if (analysisIdleDecayInput) analysisIdleDecayInput.value = String(analysisConfig.idleDecay);
  if (analysisOnsetQuarantineInput)
    analysisOnsetQuarantineInput.value = String(Math.round(analysisConfig.onsetQuarantineFrames));
  if (analysisRangeMarginInput) analysisRangeMarginInput.value = String(analysisConfig.rangeMargin);
  if (analysisOutRangeHoldInput)
    analysisOutRangeHoldInput.value = String(Math.round(analysisConfig.outOfRangeHoldFrames));
  syncAnalysisPresetSelect();
  persistSettings();
}

// --- Calibration workbench (lazy-loaded) -----------------------------------
// The workbench lives in ./calibration.js and loads on first use of any
// calibration control, keeping its ~1,000 lines out of the startup bundle
// (audit §9 2.4). Until loaded, focus/status calls are safe no-ops: the cal
// window can only become visible through the workbench itself.
let calibrationApi = null;
let calibrationLoadPromise = null;

function loadCalibration() {
  if (!calibrationLoadPromise) {
    calibrationLoadPromise = import("./calibration.js").then((mod) => {
      calibrationApi = mod.initCalibration({
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
        getMicStream: () => stream,
        restartMicIfNeeded: async () => {
          if (!hasLiveAudioTrack(stream)) {
            stream = null;
            resetMicGraphState();
            await start();
          }
        },
        calibratePanel,
        calibrateToggle,
      });
      return calibrationApi;
    });
  }
  return calibrationLoadPromise;
}

function setCalibrationFocus(enabled) {
  if (calibrationApi) {
    calibrationApi.setCalibrationFocus(enabled);
  }
}

function setCalibrationStatus(text) {
  if (calibrationApi) {
    calibrationApi.setCalibrationStatus(text);
  }
}

const queryOverrides = parseIncomingQuery();
const storedSettings = applyStoredSettings(queryOverrides);
initTheme();
if (!(storedSettings && (storedSettings.fundamentalSpelling === "flat" || storedSettings.fundamentalSpelling === "sharp"))) {
  fundamentalSpelling = getFundamentalSpellingFromPitchClass(
    getNearestEtInfo(Number(fundamentalInput.value) || 130.81, Number(a4Input.value) || 440).pitchClass
  );
}
populateFundamentalNotes();
updateFundamentalNotes();
syncFundamentalNoteSelect();
updateRangeReadout();
syncRangeNumberBoxesFromSliders();
refreshMarkers();
updateReferenceButton();
updateMicUiState();
syncAnalysisPresetSelect();
syncStateToQueryString();
scheduleStartupLayoutPasses();
if (isMobileMode) {
  if (selfTestCard) {
    selfTestCard.hidden = true;
  }
  updateMobileOrientationLock();
}
rafId = requestAnimationFrame(renderLoop);

startBtn.addEventListener("click", () => {
  toggleMicPanel();
});

if (mobileSettingsClose) {
  mobileSettingsClose.addEventListener("click", () => {
    if (micPanel) {
      micPanel.hidden = true;
    }
    if (mobileSettingsBackdrop) {
      mobileSettingsBackdrop.hidden = true;
    }
    if (startBtn) {
      startBtn.classList.remove("button-on");
    }
    setToolPanelOpen(analysisPanel, analysisToggle, false);
    setToolPanelOpen(calibratePanel, calibrateToggle, false);
    setCalibrationFocus(false);
  });
}

if (mobileSettingsBackdrop) {
  mobileSettingsBackdrop.addEventListener("click", () => {
    if (micPanel) {
      micPanel.hidden = true;
    }
    mobileSettingsBackdrop.hidden = true;
    if (startBtn) {
      startBtn.classList.remove("button-on");
    }
    setToolPanelOpen(analysisPanel, analysisToggle, false);
    setToolPanelOpen(calibratePanel, calibrateToggle, false);
    setCalibrationFocus(false);
  });
}

if (micPowerToggle) {
  micPowerToggle.addEventListener("click", async () => {
    if (hasLiveAudioTrack(stream)) {
      stopMic();
    } else {
      await start();
    }
  });
}

if (activateMicLink) {
  activateMicLink.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!hasLiveAudioTrack(stream)) {
      await start();
    }
  });
}

if (tunerToggle && leftRail) {
  tunerToggle.addEventListener("click", () => {
    leftRail.classList.toggle("is-collapsed");
    const isCollapsed = leftRail.classList.contains("is-collapsed");
    tunerToggle.textContent = isCollapsed ? "▸" : "▾";
    tunerToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
    if (isCollapsed && micPanel) {
      micPanel.hidden = true;
      micPanel.style.top = "";
      if (startBtn) {
        startBtn.classList.remove("button-on");
      }
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    applyTheme(themeToggle.checked ? "dark" : "light");
    drawViz();
  });
}

ratiosInput.addEventListener("input", () => {
  refreshMarkers();
  persistSettings();
  syncStateToQueryString();
});

if (rangeSizeInput) {
  rangeSizeInput.addEventListener("input", () => {
    const value = clampNumber(Number(rangeSizeInput.value), 12, 36, 12);
    setRangeSemitoneValue(value);
    persistSettings();
    syncStateToQueryString();
  });
}

show12EtToggle.addEventListener("change", () => {
  drawViz();
  persistSettings();
  syncStateToQueryString();
});
const labelModeRadios = [showLabelModeNote, showLabelModeSargam, showLabelModeNone].filter(Boolean);
labelModeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    drawViz();
    persistSettings();
    syncStateToQueryString();
  });
});
if (showCentsDeviationToggle) {
  showCentsDeviationToggle.addEventListener("change", () => {
    drawViz();
    persistSettings();
    syncStateToQueryString();
  });
}
if (decayModeToggle) {
  decayModeToggle.addEventListener("change", () => {
    if (!decayModeToggle.checked) {
      decayTrailPoints = [];
      lastDecayTrailSampleMs = 0;
    }
    drawViz();
    persistSettings();
    syncStateToQueryString();
  });
}
if (colorFamiliesToggle) {
  colorFamiliesToggle.addEventListener("change", () => {
    drawViz();
    persistSettings();
    syncStateToQueryString();
  });
}

fundamentalInput.addEventListener("input", () => {
  syncFundamentalNoteSelect();
  refreshMarkers();
  updateReferenceFrequency();
  rebuildAnalysisChain();
  persistSettings();
  syncStateToQueryString();
});

a4Input.addEventListener("input", () => {
  const a4 = Number(a4Input.value) || 440;
  if (fundamentalNoteSelect.value !== FUNDAMENTAL_CUSTOM_VALUE) {
    const selectedMidi = Number(fundamentalNoteSelect.value);
    if (Number.isFinite(selectedMidi)) {
      fundamentalInput.value = String(midiToFrequency(selectedMidi, a4));
    }
  }
  updateFundamentalNotes();
  syncFundamentalNoteSelect();
  refreshMarkers();
  updateReferenceFrequency();
  rebuildAnalysisChain();
  persistSettings();
  syncStateToQueryString();
});

fundamentalNoteSelect.addEventListener("change", onFundamentalNoteChange);

if (fundamentalOctaveDown) {
  fundamentalOctaveDown.addEventListener("click", () => {
    adjustFundamentalByFactor(0.5);
  });
}

if (fundamentalOctaveUp) {
  fundamentalOctaveUp.addEventListener("click", () => {
    adjustFundamentalByFactor(2);
  });
}

if (fundamentalSpellingSharpButton) {
  fundamentalSpellingSharpButton.addEventListener("click", (event) => {
    event.preventDefault();
    applyFundamentalSpelling("sharp");
  });
}

if (fundamentalSpellingFlatButton) {
  fundamentalSpellingFlatButton.addEventListener("click", (event) => {
    event.preventDefault();
    applyFundamentalSpelling("flat");
  });
}

if (referenceToggle) {
  referenceToggle.addEventListener("click", () => {
    toggleReferenceTone();
  });
}

if (referenceLevel) {
  referenceLevel.addEventListener("input", () => {
    updateReferenceLevel();
    persistSettings();
    syncStateToQueryString();
  });
}

if (micGainInput) {
  micGainInput.addEventListener("input", () => {
    updateMicGain();
    persistSettings();
  });
}

if (analysisPresetSelect) {
  analysisPresetSelect.addEventListener("change", () => {
    const presetName = analysisPresetSelect.value;
    const preset = ANALYSIS_PRESETS[presetName];
    if (preset) {
      applyAnalysisConfig(preset);
      setCalibrationStatus(`Applied ${presetName} preset.`);
    }
  });
}

bindAnalysisNumberInput(analysisRmsThresholdInput, "rmsThreshold", 0.001, 0.2, 0.01, false);
bindAnalysisNumberInput(analysisRmsWindowInput, "rmsWindowFrames", 1, 32, 4, true);
bindAnalysisNumberInput(analysisCorrThresholdInput, "correlationThreshold", 0.5, 0.99, 0.88, false);
bindAnalysisNumberInput(analysisRawInitConfirmInput, "rawInitConfirmFrames", 1, 8, 2, true);
bindAnalysisNumberInput(analysisRawInitStabilityInput, "rawInitStabilitySemitones", 0.1, 3, 0.9, false);
bindAnalysisNumberInput(analysisMinFreqInput, "minFreq", 20, 400, 70, true);
bindAnalysisNumberInput(analysisMaxFreqInput, "maxFreq", 300, 3000, 1400, true);
bindAnalysisNumberInput(analysisJumpThresholdInput, "jumpThreshold", 0.1, 6, 0.65, false);
bindAnalysisNumberInput(analysisJumpConfirmInput, "jumpConfirmFrames", 1, 8, 2, true);
bindAnalysisNumberInput(analysisVoiceEnterRmsFactorInput, "voiceEnterRmsFactor", 1, 3, 1.35, false);
bindAnalysisNumberInput(analysisVoiceExitRmsFactorInput, "voiceExitRmsFactor", 0.2, 1.2, 0.78, false);
bindAnalysisNumberInput(analysisVoiceEnterCorrOffsetInput, "voiceEnterCorrOffset", 0, 0.2, 0.04, false);
bindAnalysisNumberInput(analysisVoiceExitCorrOffsetInput, "voiceExitCorrOffset", -0.25, 0.15, -0.06, false);
bindAnalysisNumberInput(analysisVoiceEnterFramesInput, "voiceEnterFrames", 1, 12, 2, true);
bindAnalysisNumberInput(analysisVoiceExitFramesInput, "voiceExitFrames", 1, 20, 5, true);
bindAnalysisNumberInput(analysisSmoothFollowInput, "smoothFollow", 0.01, 0.5, 0.18, false);
bindAnalysisNumberInput(analysisIdleDecayInput, "idleDecay", 0.8, 0.995, 0.95, false);
bindAnalysisNumberInput(analysisOnsetQuarantineInput, "onsetQuarantineFrames", 0, 12, 2, true);
bindAnalysisNumberInput(analysisRangeMarginInput, "rangeMargin", 0, 4, 0.75, false);
bindAnalysisNumberInput(analysisOutRangeHoldInput, "outOfRangeHoldFrames", 1, 60, 8, true);

if (analysisToggle) {
  analysisToggle.addEventListener("click", () => {
    if (micPanel && micPanel.hidden) {
      return;
    }
    const willOpen = Boolean(analysisPanel && analysisPanel.hidden);
    setToolPanelOpen(analysisPanel, analysisToggle, willOpen);
    setToolPanelOpen(calibratePanel, calibrateToggle, false);
    if (willOpen) {
      positionAnalysisPanel();
    }
    if (!willOpen) {
      setCalibrationFocus(false);
    }
  });
}

if (debugToggle) {
  debugToggle.addEventListener("click", () => {
    togglePanelVisibility(debugPanel, debugToggle);
  });
}

if (calibrateToggle) {
  calibrateToggle.addEventListener("click", () => {
    const willOpen = Boolean(calibratePanel && calibratePanel.hidden);
    setToolPanelOpen(calibratePanel, calibrateToggle, willOpen);
    setToolPanelOpen(analysisPanel, analysisToggle, false);
    if (willOpen) {
      void loadCalibration();
    } else {
      setCalibrationFocus(false);
    }
  });
}

if (anomalyEnabledInput) {
  anomalyEnabledInput.addEventListener("change", () => {
    anomalyCapture.enabled = anomalyEnabledInput.checked;
    persistSettings();
    updateAnomalyStatus(anomalyCapture.enabled ? "enabled" : "disabled");
  });
}
if (anomalyThresholdInput) {
  anomalyThresholdInput.addEventListener("input", () => {
    anomalyCapture.thresholdSt = clampNumber(Number(anomalyThresholdInput.value), 1, 24, 7);
    persistSettings();
  });
}
if (anomalyPreMsInput) {
  anomalyPreMsInput.addEventListener("input", () => {
    anomalyCapture.preMs = clampNumber(Number(anomalyPreMsInput.value), 200, 4000, 1200);
    anomalyPreMsInput.value = String(Math.round(anomalyCapture.preMs));
    persistSettings();
  });
}
if (anomalyPostMsInput) {
  anomalyPostMsInput.addEventListener("input", () => {
    anomalyCapture.postMs = clampNumber(Number(anomalyPostMsInput.value), 200, 4000, 1200);
    anomalyPostMsInput.value = String(Math.round(anomalyCapture.postMs));
    persistSettings();
  });
}
if (anomalyCooldownMsInput) {
  anomalyCooldownMsInput.addEventListener("input", () => {
    anomalyCapture.cooldownMs = clampNumber(Number(anomalyCooldownMsInput.value), 200, 5000, 1200);
    anomalyCooldownMsInput.value = String(Math.round(anomalyCapture.cooldownMs));
    persistSettings();
  });
}
if (anomalyClearButton) {
  anomalyClearButton.addEventListener("click", () => {
    anomalyCapture.captures = [];
    anomalyCapture.activeCapture = null;
    updateAnomalyStatus("cleared");
  });
}
if (anomalyCopyJsonButton) {
  anomalyCopyJsonButton.addEventListener("click", async () => {
    const frames = getAnomalyFramesForExport();
    try {
      await copyText(JSON.stringify(frames));
      updateAnomalyStatus("copied json");
    } catch (_error) {
      updateAnomalyStatus("copy failed");
    }
  });
}
if (anomalyCopyCsvButton) {
  anomalyCopyCsvButton.addEventListener("click", async () => {
    const frames = getAnomalyFramesForExport();
    try {
      await copyText(framesToCsv(frames));
      updateAnomalyStatus("copied csv");
    } catch (_error) {
      updateAnomalyStatus("copy failed");
    }
  });
}

syncAnomalyControls();
updateAnomalyStatus();

if (calRecordToggle) {
  calRecordToggle.addEventListener("click", async () => {
    try {
      const api = await loadCalibration();
      await api.toggleRecording();
    } catch (_error) {
      setCalibrationStatus("Recording failed. Check mic permissions.");
    }
  });
}

if (calPlayToggle) {
  calPlayToggle.addEventListener("click", async () => {
    try {
      const api = await loadCalibration();
      await api.togglePlayback();
    } catch (_error) {
      if (calibrationApi) {
        calibrationApi.setPlaybackStatus("Playback failed");
      }
    }
  });
}

if (calRunButton) {
  calRunButton.addEventListener("click", async () => {
    const api = await loadCalibration();
    void api.run();
  });
}

if (calResetButton) {
  calResetButton.addEventListener("click", async () => {
    const api = await loadCalibration();
    api.reset();
  });
}

if (calWindowClose) {
  calWindowClose.addEventListener("click", () => {
    setCalibrationFocus(false);
  });
}

window.addEventListener("keydown", (event) => {
  const key = String(event.key).toLowerCase();
  if (
    (event.code === "KeyF" || key === "f" || key === "ƒ") &&
    event.altKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.repeat
  ) {
    event.preventDefault();
    togglePerformanceMode();
    return;
  }
  if (event.defaultPrevented) {
    return;
  }
  if (event.repeat) {
    return;
  }
  if (isTextEntryTarget(event.target)) {
    return;
  }
  if (isMobileMode || key !== "t") {
    return;
  }
  event.preventDefault();
  const nowMs = performance.now();
  if (selfTestState.running) {
    stopSelfTest(nowMs);
  } else {
    startSelfTest(nowMs);
  }
});

window.addEventListener("resize", () => {
  refreshLayoutAndViz();
  updateMobileOrientationLock();
});

window.addEventListener("pageshow", () => {
  scheduleStartupLayoutPasses();
  updateMobileOrientationLock();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    scheduleStartupLayoutPasses();
    updateMobileOrientationLock();
  }
});

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    const nextRange = getRangeSemitoneValue() + direction;
    setRangeSemitoneValue(nextRange);
    persistSettings();
    syncStateToQueryString();
  },
  { passive: false }
);

function getTouchDistance() {
  const points = Array.from(activeTouchPoints.values());
  if (points.length < 2) {
    return 0;
  }
  const dx = points[0].x - points[1].x;
  const dy = points[0].y - points[1].y;
  return Math.sqrt(dx * dx + dy * dy);
}

canvas.addEventListener("pointerdown", (event) => {
  if (isMobileMode && event.pointerType === "touch") {
    event.preventDefault();
    activeTouchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (activeTouchPoints.size >= 2) {
      pinchActive = true;
      bottomDragActive = false;
      pinchStartDistance = getTouchDistance();
      pinchStartRange = getRangeSemitoneValue();
    } else {
      pinchActive = false;
      bottomDragActive = true;
      bottomDragStartY = event.clientY;
      rangeOffsetStartValue = getBottomSemitoneValue();
    }
  } else {
    bottomDragActive = true;
    bottomDragStartY = event.clientY;
    rangeOffsetStartValue = getBottomSemitoneValue();
  }
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (isMobileMode && event.pointerType === "touch") {
    event.preventDefault();
    if (activeTouchPoints.has(event.pointerId)) {
      activeTouchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    if (pinchActive && activeTouchPoints.size >= 2) {
      const distance = getTouchDistance();
      const delta = Math.round((distance - pinchStartDistance) / 14);
      setRangeSemitoneValue(pinchStartRange + delta);
      persistSettings();
      syncStateToQueryString();
      return;
    }
  }
  if (!bottomDragActive) {
    return;
  }
  const deltaY = event.clientY - bottomDragStartY;
  const semitoneOffset = Math.round(deltaY / 14);
  const nextOffset = rangeOffsetStartValue + semitoneOffset;
  setRangeOffsetSemitoneValue(nextOffset);
  persistSettings();
  syncStateToQueryString();
});

function stopBottomDrag(event) {
  if (isMobileMode && event.pointerType === "touch") {
    event.preventDefault();
    activeTouchPoints.delete(event.pointerId);
    if (activeTouchPoints.size < 2) {
      pinchActive = false;
    }
    if (activeTouchPoints.size === 1) {
      const lastPoint = Array.from(activeTouchPoints.values())[0];
      bottomDragActive = true;
      bottomDragStartY = lastPoint.y;
      rangeOffsetStartValue = getBottomSemitoneValue();
    } else if (activeTouchPoints.size === 0) {
      bottomDragActive = false;
    }
  } else {
    bottomDragActive = false;
  }
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch (_error) {
    // no-op
  }
}

canvas.addEventListener("pointerup", stopBottomDrag);
canvas.addEventListener("pointercancel", stopBottomDrag);

if (isMobileMode) {
  document.addEventListener("gesturestart", blockNativeMobileGesture, { passive: false });
  document.addEventListener("gesturechange", blockNativeMobileGesture, { passive: false });
  document.addEventListener("gestureend", blockNativeMobileGesture, { passive: false });
}

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(rafId);
  stopReferenceTone();
  if (stream) {
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }
  if (audioContext) {
    audioContext.close();
  }
});

// First-visit tip: recommend headphones + a reference fundamental. Auto-shows
// once per browser; the close/CTA/scrim/Escape all dismiss + persist the flag.
(() => {
  const TIP_STORAGE_KEY = "tuner-headphones-tip-seen";
  const tip = document.getElementById("tuner-headphones-tip");
  if (!tip) return;
  let seen = false;
  try {
    seen = window.localStorage.getItem(TIP_STORAGE_KEY) === "1";
  } catch (err) {}
  const close = () => {
    tip.hidden = true;
    try { window.localStorage.setItem(TIP_STORAGE_KEY, "1"); } catch (err) {}
  };
  tip.addEventListener("click", (event) => {
    if (event.target && event.target.dataset && "tunerTipClose" in event.target.dataset) {
      close();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (tip.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }, { capture: true });
  if (!seen) {
    tip.hidden = false;
    const cta = tip.querySelector(".tuner-tip-cta");
    if (cta) {
      try { cta.focus(); } catch (err) {}
    }
  }
})();
