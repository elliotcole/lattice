const FUNDAMENTAL_CUSTOM_VALUE = "hz";
const noteNamesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteNamesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_TO_SEMITONE = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const TRUE_SPELLING_INTERVALS = {
  3: { letter: 4, semitones: 7 },
  5: { letter: 2, semitones: 4 },
  7: { letter: 6, semitones: 10 },
  11: { letter: 3, semitones: 5 },
  13: { letter: 5, semitones: 9 },
  17: { letter: 0, semitones: 1, maxSteps: 2 },
  19: { letter: 2, semitones: 3 },
  23: { letter: 3, semitones: 6 },
  29: { letter: 6, semitones: 10 },
  31: { letter: 0, semitones: 0, maxSteps: 4 },
  37: { letter: 1, semitones: 2 },
  41: { letter: 2, semitones: 4 },
  43: { letter: 3, semitones: 5 },
  47: { letter: 3, semitones: 6 },
};
const HEJI_RULES = [
  {
    mode: "repeatBaseAccidental",
    ratio: 5,
    axis: "any",
    base: 2,
    posSingle: { none: "m", sharp: "u", doubleSharp: "U", flat: "d", doubleFlat: "D" },
    negSingle: { none: "o", sharp: "w", doubleSharp: "W", flat: "f", doubleFlat: "F" },
    posPair: { none: "l", sharp: "t", doubleSharp: "T", flat: "c", doubleFlat: "C" },
    negPair: { none: "p", sharp: "x", doubleSharp: "X", flat: "g", doubleFlat: "G" },
    replaceAccidental: true,
    usePairAsSingle: true,
    useSingleBeyondPair: true,
    maxSymbols: 2,
  },
  { mode: "repeat", ratio: 17, axis: "any", glyphPos: ":", glyphNeg: ";" },
  { mode: "repeatBase", ratio: 7, axis: "any", glyphPos: "<", glyphNeg: ">", glyphPosPair: ",", glyphNegPair: ".", base: 2 },
  { mode: "repeat", ratio: 11, axis: "any", glyphPos: "4", glyphNeg: "5" },
  { mode: "repeat", ratio: 13, axis: "any", glyphPos: "0", glyphNeg: "9" },
  { mode: "repeat", ratio: 19, axis: "any", glyphPos: "/", glyphNeg: "\\" },
  { mode: "repeat", ratio: 23, axis: "any", glyphPos: "3", glyphNeg: "6" },
  { mode: "repeat", ratio: 29, axis: "any", glyphPos: "2", glyphNeg: "7" },
  { mode: "repeat", ratio: 31, axis: "any", glyphPos: "1", glyphNeg: "8" },
  { mode: "repeat", ratio: 37, axis: "any", glyphPos: "á", glyphNeg: "à" },
  { mode: "repeat", ratio: 41, axis: "any", glyphPos: "+", glyphNeg: "-" },
  { mode: "repeat", ratio: 43, axis: "any", glyphPos: "é", glyphNeg: "è" },
  { mode: "repeat", ratio: 47, axis: "any", glyphPos: "í", glyphNeg: "ì" },
];
const PRIMES_UP_TO_97 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83,
  89, 97,
];
const PRIME_FAMILY_COLORS = new Map(
  PRIMES_UP_TO_97.map((prime, index) => {
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

const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const fundamentalOctaveDown = document.getElementById("fundamental-octave-down");
const fundamentalOctaveUp = document.getElementById("fundamental-octave-up");
const a4Input = document.getElementById("a4");
const ratiosInput = document.getElementById("ratios-input");
const showNoteNamesToggle = document.getElementById("show-note-names");
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
const themeToggle = document.getElementById("theme-toggle");
const analysisToggle = document.getElementById("analysis-toggle");
const debugToggle = document.getElementById("debug-toggle");
const calibrateToggle = document.getElementById("calibrate-toggle");
const analysisPanel = document.getElementById("analysis-panel");
const debugPanel = document.getElementById("debug-panel");
const calibratePanel = document.getElementById("calibrate-panel");
const analysisRmsThresholdInput = document.getElementById("analysis-rms-threshold");
const analysisRmsWindowInput = document.getElementById("analysis-rms-window");
const analysisCorrThresholdInput = document.getElementById("analysis-corr-threshold");
const analysisMinFreqInput = document.getElementById("analysis-min-freq");
const analysisMaxFreqInput = document.getElementById("analysis-max-freq");
const analysisJumpThresholdInput = document.getElementById("analysis-jump-threshold");
const analysisJumpConfirmInput = document.getElementById("analysis-jump-confirm");
const analysisSmoothFollowInput = document.getElementById("analysis-smooth-follow");
const analysisIdleDecayInput = document.getElementById("analysis-idle-decay");
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
const calStatus = document.getElementById("cal-status");
const calPlaybackStatus = document.getElementById("cal-playback-status");
const calCandidates = document.getElementById("cal-candidates");
const calWindow = document.getElementById("cal-window");
const calWindowClose = document.getElementById("cal-window-close");
const calWindowStatus = document.getElementById("cal-window-status");
const fundamentalSpellingDialog = document.getElementById("fundamental-spelling-dialog");
const fundamentalSpellingSharpButton = document.getElementById("fundamental-spelling-sharp");
const fundamentalSpellingFlatButton = document.getElementById("fundamental-spelling-flat");
const canvas = document.getElementById("viz");
const ctx = canvas.getContext("2d");

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
let bottomDragActive = false;
let bottomDragStartY = 0;
let rangeOffsetStartValue = 0;
let rangeOffsetSemitones = 0;
let outOfRangeFrames = 0;
let rmsWindowValues = [];
let frameCounter = 0;
let decayTrailPoints = [];
let lastDecayTrailSampleMs = 0;
let liveInputStrength = 0;
const DECAY_TRAIL_DURATION_MS = 4800;

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
  stabilityFollow: 0.02,
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
  rangeMargin: 0.75,
  outOfRangeHoldFrames: 8,
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
};

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
  rangeMargin: [0.2, 2.2],
  outOfRangeHoldFrames: [3, 24],
};
const THEME_STORAGE_KEY = "tuner-theme";
const SETTINGS_STORAGE_KEY = "tuner-settings-v1";
const trueSpellingLimitCache = new Map();

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

function collectCurrentSettings() {
  return {
    fundamental: Number(fundamentalInput ? fundamentalInput.value : 261.63) || 261.63,
    a4: Number(a4Input ? a4Input.value : 440) || 440,
    ratios: String(ratiosInput ? ratiosInput.value : ""),
    range: Number(rangeSizeInput ? rangeSizeInput.value : 12) || 12,
    rangeOffset: Number(rangeOffsetSemitones) || 0,
    show12Et: Boolean(show12EtToggle ? show12EtToggle.checked : true),
    showNoteNames: Boolean(showNoteNamesToggle ? showNoteNamesToggle.checked : true),
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

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
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

function gcd(a, b) {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function reduceFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: Math.trunc(numerator / divisor),
    denominator: Math.trunc(denominator / divisor),
  };
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

function floorDiv(value, divisor) {
  return Math.floor(value / divisor);
}

function parseRatioInput(value) {
  if (!value) return null;
  const cleaned = String(value).trim().replace(/\s+/g, "");
  if (!cleaned) return null;
  const divider = cleaned.includes(":") ? ":" : cleaned.includes("/") ? "/" : null;
  let numerator = null;
  let denominator = null;
  if (!divider) {
    numerator = Math.trunc(Number(cleaned));
    denominator = 1;
  } else {
    const parts = cleaned.split(divider);
    if (parts.length !== 2) return null;
    numerator = Math.trunc(Number(parts[0]));
    denominator = Math.trunc(Number(parts[1]));
  }
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (numerator <= 0 || denominator <= 0) return null;
  return { numerator, denominator };
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

function parsePitchClass(pitchClass) {
  const match = String(pitchClass || "").match(/^([A-G])([#bx]*)$/);
  if (!match) {
    return { letterIndex: 0, accidental: 0 };
  }
  const letter = match[1];
  const accidentalText = match[2] || "";
  let accidental = 0;
  for (const char of accidentalText) {
    if (char === "#") {
      accidental += 1;
    } else if (char === "b") {
      accidental -= 1;
    } else if (char === "x") {
      accidental += 2;
    }
  }
  return { letterIndex: LETTERS.indexOf(letter), accidental };
}

function accidentalToString(accidental) {
  if (!accidental) return "";
  if (accidental > 0) {
    if (accidental === 1) return "#";
    if (accidental === 2) return "x";
    return "#x";
  }
  if (accidental === -1) return "b";
  if (accidental === -2) return "bb";
  return "bbb";
}

function buildPitchClass(letterIndex, accidental) {
  const letter = LETTERS[mod(letterIndex, LETTERS.length)];
  const clamped = Math.max(-3, Math.min(3, accidental));
  return `${letter}${accidentalToString(clamped)}`;
}

function normalizeRatioToOctave(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  let num = numerator;
  let den = denominator;
  let shift = 0;
  let ratio = num / den;
  while (ratio < 1) {
    num *= 2;
    shift -= 1;
    ratio = num / den;
  }
  while (ratio > 2) {
    den *= 2;
    shift += 1;
    ratio = num / den;
  }
  return { numerator: num, denominator: den, shift };
}

function analyzeRatioForTrueSpelling(numerator, denominator) {
  const normalized = normalizeRatioToOctave(numerator, denominator);
  if (!normalized) return null;
  const reduced = reduceFraction(normalized.numerator, normalized.denominator);
  let num = Math.abs(reduced.numerator);
  let den = Math.abs(reduced.denominator);
  let octaveShift = normalized.shift;

  while (num % 2 === 0 && den % 2 === 0) {
    num /= 2;
    den /= 2;
  }
  while (num % 2 === 0) {
    num /= 2;
    octaveShift += 1;
  }
  while (den % 2 === 0) {
    den /= 2;
    octaveShift -= 1;
  }

  const axisRatios = [];
  for (const primeKey of Object.keys(TRUE_SPELLING_INTERVALS)) {
    const prime = Number(primeKey);
    let exponent = 0;
    while (num % prime === 0) {
      num /= prime;
      exponent += 1;
    }
    while (den % prime === 0) {
      den /= prime;
      exponent -= 1;
    }
    if (exponent) {
      axisRatios.push({ ratio: prime, exp: exponent });
    }
  }
  if (num !== 1 || den !== 1 || !axisRatios.length) {
    return null;
  }
  return { axisRatios, octaveShift };
}

function getTrueSpellingLimit(ratio) {
  const key = Number(ratio);
  if (trueSpellingLimitCache.has(key)) {
    return trueSpellingLimitCache.get(key);
  }
  const spec = TRUE_SPELLING_INTERVALS[key];
  if (!spec) {
    trueSpellingLimitCache.set(key, null);
    return null;
  }
  if (Number.isFinite(spec.maxSteps)) {
    trueSpellingLimitCache.set(key, spec.maxSteps);
    return spec.maxSteps;
  }
  const base = { letterIndex: 0, accidental: 0 };
  let maxSteps = 0;
  for (let step = 1; step < 30; step += 1) {
    const letterShift = step * spec.letter;
    const semitoneShift = step * spec.semitones;
    const totalLetter = base.letterIndex + letterShift;
    const octaveShift = floorDiv(totalLetter, 7);
    const targetLetterIndex = mod(totalLetter, 7);
    const targetNatural = LETTER_TO_SEMITONE[LETTERS[targetLetterIndex]] + octaveShift * 12;
    const totalSemitone =
      base.accidental + LETTER_TO_SEMITONE[LETTERS[base.letterIndex]] + semitoneShift;
    const accidental = totalSemitone - targetNatural;
    if (Math.abs(accidental) > 3) {
      break;
    }
    maxSteps = step;
  }
  trueSpellingLimitCache.set(key, maxSteps);
  return maxSteps;
}

function getFundamentalPitchClassForSpelling() {
  let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
  if (!Number.isFinite(fundamentalMidi)) {
    const fallback = getNearestEtInfo(
      Number(fundamentalInput.value) || 261.63,
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

function getAccidentalType(noteName) {
  if (/[#x]/.test(noteName)) return "sharp";
  if (/b/.test(noteName)) return "flat";
  return "none";
}

function axisMatches(rule, axisState) {
  if (rule.axis !== "any" && rule.axis !== axisState.axis) return false;
  if (!Number.isFinite(axisState.exponent)) return false;
  if (Number.isFinite(rule.ratio) && axisState.ratio !== rule.ratio) return false;
  if (rule.mode === "repeat" || rule.mode === "repeatBase" || rule.mode === "repeatBaseAccidental") {
    return axisState.exponent !== 0;
  }
  if (rule.exponent === "anyNonZero" && axisState.exponent === 0) return false;
  if (Number.isFinite(rule.exponent) && axisState.exponent !== rule.exponent) return false;
  return true;
}

function getHejiAnnotationForAxisRatios(axisRatios, baseText) {
  const accidentalType = getAccidentalType(baseText || "");
  const sharpCount = (baseText.match(/#/g) || []).length;
  const flatCount = (baseText.match(/b/g) || []).length;
  const doubleSharpCount = (baseText.match(/x/g) || []).length;
  const axisStates = (axisRatios || []).map((axis) => ({
    axis: "any",
    ratio: Number(axis.ratio),
    exponent: Number(axis.exp),
  }));
  const nextBase = String(baseText || "").replace(/[x#b]/g, "");
  const suffixParts = [];

  for (let i = 0; i < sharpCount; i += 1) {
    suffixParts.push({ text: "v", expLabel: "", source: "default" });
  }
  for (let i = 0; i < flatCount; i += 1) {
    suffixParts.push({ text: "e", expLabel: "", source: "default" });
  }
  for (let i = 0; i < doubleSharpCount; i += 1) {
    suffixParts.push({ text: "V", expLabel: "", source: "default" });
  }

  HEJI_RULES.forEach((rule) => {
    const expected = rule.accidental ?? "any";
    if (expected !== "any" && expected !== accidentalType) return;
    const matches = axisStates.some((axisState) => axisMatches(rule, axisState));
    if (!matches) return;

    if (rule.replaceAccidental && (accidentalType === "sharp" || accidentalType === "flat")) {
      const keepSharps = doubleSharpCount > 0 ? sharpCount : 0;
      const keepFlats = flatCount > 2 ? flatCount - 2 : 0;
      let keptSharps = 0;
      let keptFlats = 0;
      for (let index = suffixParts.length - 1; index >= 0; index -= 1) {
        if (suffixParts[index].source !== "default") continue;
        const part = suffixParts[index];
        if (part.text === "v" && keptSharps < keepSharps) {
          keptSharps += 1;
          continue;
        }
        if (part.text === "e" && keptFlats < keepFlats) {
          keptFlats += 1;
          continue;
        }
        suffixParts.splice(index, 1);
      }
    }

    if (rule.mode === "repeatBaseAccidental") {
      const base = Number(rule.base) || 2;
      const accidentalKey =
        doubleSharpCount > 0
          ? "doubleSharp"
          : flatCount > 1
            ? "doubleFlat"
            : accidentalType || "none";
      axisStates.forEach((axisState) => {
        if (!axisMatches(rule, axisState)) return;
        const exp = Number(axisState.exponent);
        if (!exp) return;
        const absExp = Math.abs(exp);
        const pairCount = Math.floor(absExp / base);
        const remainder = absExp % base;
        const usePairAsSingle = Boolean(rule.usePairAsSingle);
        const useSingleBeyondPair = Boolean(rule.useSingleBeyondPair);
        const maxSymbols = Number(rule.maxSymbols ?? (usePairAsSingle ? 1 : 2));
        const showExponent = absExp > maxSymbols ? String(absExp) : "";
        const pairGlyph = exp > 0 ? rule.posPair?.[accidentalKey] || "" : rule.negPair?.[accidentalKey] || "";
        const singleGlyph = exp > 0 ? rule.posSingle?.[accidentalKey] || "" : rule.negSingle?.[accidentalKey] || "";
        let glyphs = "";
        if (useSingleBeyondPair && absExp > base) {
          glyphs = String(singleGlyph);
        } else if (usePairAsSingle) {
          glyphs = absExp >= base ? String(pairGlyph) : String(singleGlyph);
        } else {
          glyphs = String(pairGlyph).repeat(pairCount);
          if (remainder) glyphs += String(singleGlyph);
        }
        if (glyphs.length > maxSymbols) glyphs = glyphs.slice(0, maxSymbols);
        if (glyphs) suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
      });
      return;
    }

    if (rule.mode === "repeatBase") {
      const base = Number(rule.base) || 2;
      axisStates.forEach((axisState) => {
        if (!axisMatches(rule, axisState)) return;
        const exp = Number(axisState.exponent);
        if (!exp) return;
        const absExp = Math.abs(exp);
        const pairCount = Math.floor(absExp / base);
        const remainder = absExp % base;
        const maxSymbols = Number(rule.maxSymbols ?? 2);
        const showExponent = absExp > maxSymbols ? String(absExp) : "";
        let glyphs = "";
        if (exp > 0) {
          if (rule.glyphPosPair) glyphs += String(rule.glyphPosPair).repeat(pairCount);
          if (rule.glyphPos && remainder) glyphs += String(rule.glyphPos);
        } else {
          if (rule.glyphNegPair) glyphs += String(rule.glyphNegPair).repeat(pairCount);
          if (rule.glyphNeg && remainder) glyphs += String(rule.glyphNeg);
        }
        if (glyphs.length > maxSymbols) glyphs = glyphs.slice(0, maxSymbols);
        if (glyphs) suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
      });
      return;
    }

    if (rule.mode === "repeat") {
      axisStates.forEach((axisState) => {
        if (!axisMatches(rule, axisState)) return;
        const exp = Number(axisState.exponent);
        if (!exp) return;
        const absExp = Math.abs(exp);
        const maxSymbols = Number(rule.maxSymbols ?? 1);
        const glyph =
          exp > 0
            ? String(rule.glyphPos || "").repeat(Math.min(absExp, maxSymbols))
            : String(rule.glyphNeg || "").repeat(Math.min(absExp, maxSymbols));
        const showExponent = absExp > maxSymbols ? String(absExp) : "";
        if (glyph) suffixParts.push({ text: glyph, expLabel: showExponent, source: "rule" });
      });
    }
  });

  if (suffixParts.length > 1) {
    const ordered = [];
    suffixParts.forEach((part) => {
      if (part.source === "rule") ordered.push(part);
    });
    suffixParts.forEach((part) => {
      if (part.source !== "rule") ordered.push(part);
    });
    return { baseText: nextBase, suffixParts: ordered };
  }
  return { baseText: nextBase, suffixParts };
}

function getRatioNoteLabelInfo(ratio) {
  const spelling = getPitchClassFromRatio(ratio);
  const heji = getHejiAnnotationForAxisRatios(spelling.axisRatios, spelling.pitchClass);
  const suffixText = (heji.suffixParts || [])
    .map((part) => `${part.text}${part.expLabel || ""}`)
    .join("");
  return {
    pitchClass: spelling.pitchClass,
    baseText: heji.baseText || spelling.pitchClass,
    suffixText,
  };
}

function getOctaveReducedDisplayRatioLabel(ratio) {
  if (!ratio || !Number.isFinite(ratio.ratio) || ratio.ratio <= 2) {
    return ratio && ratio.label ? ratio.label : "";
  }
  const normalized = reduceToOctave(ratio.numerator, ratio.denominator);
  const reduced = reduceFraction(normalized.numerator, normalized.denominator);
  return `${reduced.numerator}/${reduced.denominator}`;
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

function midiToFrequency(midi, a4) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

function getNearestEtInfo(freq, a4) {
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midi = Math.min(127, Math.max(0, Math.round(midiFloat)));
  const etFreq = a4 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / etFreq);
  const pitchClass = noteNamesSharp[midi % 12];
  const name = `${pitchClass}${Math.floor(midi / 12) - 1}`;
  return { midi, etFreq, cents, name, pitchClass };
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
    referenceLevel: false,
    referenceOn: false,
  };
  const queryFundamental = Number(params.get("fundamental"));
  const queryA4 = Number(params.get("a4"));
  const queryRatios = params.get("ratios");
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
  queryOverrides = { fundamental: false, a4: false, ratios: false, referenceLevel: false, referenceOn: false }
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
  const storedRange = Number(settings.range);
  if (rangeSizeInput && Number.isFinite(storedRange)) {
    rangeSizeInput.value = String(clampNumber(storedRange, 12, 36, 12));
  } else if (rangeSizeInput && Number.isFinite(Number(settings.rangeTop))) {
    rangeSizeInput.value = String(clampNumber(Number(settings.rangeTop), 12, 36, 12));
  }
  const storedOffset = Number(settings.rangeOffset);
  if (Number.isFinite(storedOffset)) {
    rangeOffsetSemitones = clampNumber(storedOffset, -12, 24, 0);
  } else if (Number.isFinite(Number(settings.rangeBottom))) {
    rangeOffsetSemitones = -clampNumber(Number(settings.rangeBottom), 0, 12, 0);
  }
  const currentRange = getRangeSemitoneValue();
  rangeOffsetSemitones = clampNumber(rangeOffsetSemitones, -12, 36 - currentRange, 0);
  if (typeof settings.show12Et === "boolean") {
    show12EtToggle.checked = settings.show12Et;
  }
  if (showNoteNamesToggle && typeof settings.showNoteNames === "boolean") {
    showNoteNamesToggle.checked = settings.showNoteNames;
  }
  if (showCentsDeviationToggle && typeof settings.showCentsDeviation === "boolean") {
    showCentsDeviationToggle.checked = settings.showCentsDeviation;
  }
  if (decayModeToggle && typeof settings.decayMode === "boolean") {
    decayModeToggle.checked = settings.decayMode;
  }
  if (colorFamiliesToggle && typeof settings.colorFamilies === "boolean") {
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
  return Number.isFinite(value) && value > 0 ? value : 261.63;
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
        const octaveStep = Math.round(semi / 12);
        if (Math.abs(semi - octaveStep * 12) <= 0.02) {
          const octaveOrdinal = octaveStep + 1;
          if (octaveOrdinal >= 1) {
            ratioLabel = `${octaveOrdinal}/1`;
          }
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

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawViz() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const bounds = getVisualizationSemitoneBounds();
  const fundamental = Number(fundamentalInput.value) || 261.63;
  const a4 = Number(a4Input.value) || 440;
  const minSemi = bounds.min;
  const maxSemi = bounds.max;
  const decayEnabled = Boolean(decayModeToggle && decayModeToggle.checked);
  const lineX = Math.round(width * (decayEnabled ? 0.62 : 0.45));
  const gridRightX = Math.min(width - 6, lineX + 248);
  const etLabelX = gridRightX;
  const etLineEndX = etLabelX - 52;
  const octaveGuideLeftX = Math.max(18, lineX - Math.max(24, etLineEndX - lineX));
  const padTop = 30;
  const padBottom = 30;
  const innerHeight = Math.max(40, height - padTop - padBottom);
  const visibleSpan = Math.max(12, maxSemi - minSemi);
  const showNoteNames = Boolean(showNoteNamesToggle && showNoteNamesToggle.checked);
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

  for (let semi = Math.ceil(minSemi); semi <= Math.floor(maxSemi); semi += 1) {
    if (semi % 12 !== 0) {
      continue;
    }
    const y = yForSemitone(semi);
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lineX, y);
    ctx.lineTo(octaveGuideLeftX, y);
    ctx.stroke();
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
  let nearestMarker = null;
  if (hasActiveInput) {
    for (const marker of ratioMarkers) {
      const diff = Math.abs(marker.semitone - displaySemitone);
      if (!nearestMarker || diff < nearestMarker.diff) {
        nearestMarker = { diff, marker };
      }
    }
  }

  function measureLabelPart(text, font) {
    if (!text) return 0;
    ctx.save();
    ctx.font = font;
    const width = ctx.measureText(text).width;
    ctx.restore();
    return width;
  }

  function getRatioMarkerTextParts(marker) {
    const parts = [
      { text: marker.ratioLabel || marker.label, font: `${ratioLabelFontSize}px 'IBM Plex Sans', sans-serif` },
    ];
    if (showNoteNames && marker.noteLabelInfo) {
      parts.push({ text: " \u00b7 ", font: `${ratioLabelFontSize}px 'IBM Plex Sans', sans-serif` });
      parts.push({
        text: marker.noteLabelInfo.baseText || marker.noteLabelInfo.pitchClass || "",
        font: `${ratioLabelFontSize}px 'IBM Plex Sans', sans-serif`,
      });
      if (marker.noteLabelInfo.suffixText) {
        parts.push({
          text: marker.noteLabelInfo.suffixText,
          font: `${ratioLabelFontSize}px 'HEJI2Text', 'IBM Plex Sans', sans-serif`,
        });
      }
    }
    return parts;
  }

  function getPartsTotalWidth(parts) {
    return parts.reduce((sum, part) => sum + measureLabelPart(part.text, part.font), 0);
  }

  function drawRatioMarkerText(parts, side, anchorX, y, totalWidth) {
    const width = Number.isFinite(totalWidth) ? totalWidth : getPartsTotalWidth(parts);
    let x = side === "right" ? anchorX : anchorX - width;
    for (const part of parts) {
      if (!part.text) continue;
      ctx.font = part.font;
      ctx.textAlign = "left";
      ctx.fillText(part.text, x, y);
      x += measureLabelPart(part.text, part.font);
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

    const fallbackLane = maxLaneSearch + 1;
    const fallbackOffset = Math.max(18, ratioLabelFontSize * 1.25) + fallbackLane * laneStep;
    const fallbackAnchorX = primarySide === "right" ? lineX + fallbackOffset : lineX - fallbackOffset;
    const fallbackRect = getLabelRect(primarySide, fallbackAnchorX, y, totalWidth);
    return { side: primarySide, lane: fallbackLane, anchorX: fallbackAnchorX, rect: fallbackRect };
  }

  for (let index = 0; index < ratioMarkers.length; index += 1) {
    const marker = ratioMarkers[index];
    const markerAlpha = 1;
    const markerColor = markerColorFor(marker);
    const y = yForSemitone(marker.semitone);
    const parts = getRatioMarkerTextParts(marker);
    const totalWidth = getPartsTotalWidth(parts);
    const baselineOffset = Math.max(18, ratioLabelFontSize * 1.25);
    const baselineAnchorX = lineX - baselineOffset;
    const baselineRect = getLabelRect("left", baselineAnchorX, y, totalWidth);
    const baselineCollision =
      !isRectVisible(baselineRect) ||
      labelRects.some((existing) =>
        rectsOverlap(baselineRect, existing, collisionProximityX, collisionProximityY)
      );

    let side = "left";
    let anchorX = baselineAnchorX;
    let labelRect = baselineRect;
    if (baselineCollision) {
      alternateOnOverlap = !alternateOnOverlap;
      const primarySide = alternateOnOverlap ? "right" : "left";
      const placement = findPlacementForMarker(y, totalWidth, primarySide);
      side = placement.side;
      anchorX = placement.anchorX;
      labelRect = placement.rect;
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
    drawRatioMarkerText(parts, side, anchorX, y, totalWidth);
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
        y: yForSemitone(point.semitone),
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
    const displayFreq = fundamental > 0 ? fundamental * Math.pow(2, displaySemitone / 12) : null;
    const etInfo = Number.isFinite(displayFreq) ? getNearestEtInfo(displayFreq, a4) : null;
    const centsOff = nearestMarker ? nearestMarker.diff * 100 : 0;
    const centsSigned = etInfo ? etInfo.cents : 0;
    const blobColor =
      centsOff <= 8 ? blobGood : centsOff <= 24 ? blobWarn : blobBad;

    ctx.fillStyle = blobColor;
    ctx.beginPath();
    ctx.arc(lineX, y, 10, 0, Math.PI * 2);
    ctx.fill();

    if (etInfo && (!showCentsDeviationToggle || showCentsDeviationToggle.checked)) {
      ctx.textAlign = "left";
      ctx.fillStyle = etColor;
      const centsRounded = Math.round(centsSigned);
      const centsText = centsRounded === 0 ? "0" : `${centsRounded > 0 ? "+" : ""}${centsRounded}`;
      ctx.fillText(`${centsText}c`, lineX + 34, y - 18);
    }
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
  if (clearSmooth) {
    smoothSemitone = null;
    displaySemitone = null;
  }
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
    liveAcceptedRawSemitone = rawSemitone;
    livePendingRawJumpSemitone = null;
    livePendingRawJumpFrames = 0;
    return { pitchHz: rawPitch, reason: "accepted_initial" };
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
    const follow = confirmedOctaveJump ? Math.max(dynamicFollow, 0.6) : dynamicFollow;
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
  const a4 = Number(a4Input.value) || 440;
  if (!freq || !Number.isFinite(freq)) {
    hzEl.textContent = "-- Hz";
    noteEl.textContent = "--";
    centsEl.textContent = "--";
    statusEl.textContent = "Listening...";
    return;
  }
  const nearest = getNearestEtInfo(freq, a4);
  hzEl.textContent = `${freq.toFixed(2)} Hz`;
  noteEl.textContent = nearest.name;
  const cents = Math.round(nearest.cents);
  centsEl.textContent = cents === 0 ? "0" : `${cents > 0 ? "+" : ""}${cents}`;
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
    const fundamental = Number(fundamentalInput.value) || 261.63;
    const rawGate = gateRawPitchCandidate(rawPitchDetected, fundamental);
    const rawPitch = rawGate.pitchHz;
    const hasDetectedRaw = Boolean(rawPitchDetected && Number.isFinite(rawPitchDetected));
    const bounds = getVisualizationSemitoneBounds();
    const margin = Math.max(0, analysisConfig.rangeMargin);
    const normalized = normalizePitchToRange(rawPitch, fundamental, bounds, margin, smoothSemitone);
    const inRange = normalized.inRange;
    const pitch = inRange ? normalized.frequency : null;
    const hasUsablePitch = Boolean(pitch && Number.isFinite(pitch));
    detectedPitchHz = null;
    liveHasActivePitch = false;
    if (rawPitch && Number.isFinite(rawPitch) && !inRange) {
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
      if (Number.isFinite(smoothSemitone)) {
        liveOnsetSemitoneHistory = [];
        updateTrackedSemitone(semi, detection.correlation);
        displaySemitone = Number.isFinite(smoothSemitone) ? smoothSemitone : semi;
      } else {
        const onsetCorrFloor = Math.max(Number(analysisConfig.correlationThreshold) || 0.88, 0.94);
        const onsetRmsFloor = Math.max((Number(analysisConfig.rmsThreshold) || 0.01) * 2.2, 0.02);
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
    } else if (hasDetectedRaw && !rawPitch && Number.isFinite(smoothSemitone)) {
      // Rejected discontinuity frame: hold stable estimate instead of decaying/resetting.
      displaySemitone = smoothSemitone;
      liveHasActivePitch = true;
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
    detectedPitchHz = filteredReadoutPitch;
    const showOutOfRange = outOfRangeFrames >= Math.max(1, Math.round(analysisConfig.outOfRangeHoldFrames));
    updateReadout(filteredReadoutPitch, { outOfRange: showOutOfRange });

    const frame = {
      i: ++frameCounter,
      t_ms: Math.round(nowMs),
      detected_pitch_hz: rawPitchDetected,
      raw_pitch_hz: rawPitch,
      raw_semitone:
        rawPitch && Number.isFinite(rawPitch) && fundamental > 0 ? 12 * Math.log2(rawPitch / fundamental) : null,
      raw_gate_reason: rawGate.reason,
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
  if (startBtn) {
    startBtn.classList.toggle("button-on", opening);
  }
}

function positionMicPanel() {
  if (!micPanel || !startBtn) {
    return;
  }
  if (window.matchMedia("(max-width: 760px)").matches) {
    micPanel.style.top = "";
    return;
  }
  const micButtonRect = startBtn.getBoundingClientRect();
  micPanel.style.top = `${Math.max(12, Math.round(micButtonRect.top))}px`;
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

function cloneAnalysisConfig() {
  return { ...analysisConfig };
}

function applyAnalysisConfig(config) {
  Object.assign(analysisConfig, config);
  if (analysisRmsThresholdInput) analysisRmsThresholdInput.value = String(analysisConfig.rmsThreshold);
  if (analysisRmsWindowInput) analysisRmsWindowInput.value = String(Math.round(analysisConfig.rmsWindowFrames));
  if (analysisCorrThresholdInput)
    analysisCorrThresholdInput.value = String(analysisConfig.correlationThreshold);
  if (analysisMinFreqInput) analysisMinFreqInput.value = String(Math.round(analysisConfig.minFreq));
  if (analysisMaxFreqInput) analysisMaxFreqInput.value = String(Math.round(analysisConfig.maxFreq));
  if (analysisJumpThresholdInput)
    analysisJumpThresholdInput.value = String(analysisConfig.jumpThreshold);
  if (analysisJumpConfirmInput)
    analysisJumpConfirmInput.value = String(Math.round(analysisConfig.jumpConfirmFrames));
  if (analysisSmoothFollowInput) analysisSmoothFollowInput.value = String(analysisConfig.smoothFollow);
  if (analysisIdleDecayInput) analysisIdleDecayInput.value = String(analysisConfig.idleDecay);
  if (analysisRangeMarginInput) analysisRangeMarginInput.value = String(analysisConfig.rangeMargin);
  if (analysisOutRangeHoldInput)
    analysisOutRangeHoldInput.value = String(Math.round(analysisConfig.outOfRangeHoldFrames));
  persistSettings();
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function mutateAround(base, min, max, factor = 0.2, integer = false) {
  const span = max - min;
  const delta = span * factor;
  const next = clampNumber(randomInRange(base - delta, base + delta), min, max, base);
  return integer ? Math.round(next) : next;
}

function makeRandomCandidate(base = null, fine = false) {
  const next = {};
  Object.entries(calibrationRanges).forEach(([key, range]) => {
    const [min, max] = range;
    const integer =
      key === "rmsWindowFrames" ||
      key === "minFreq" ||
      key === "maxFreq" ||
      key === "jumpConfirmFrames" ||
      key === "onsetConfirmFrames" ||
      key === "onsetResetFrames" ||
      key === "discontinuityConfirmFrames" ||
      key === "discontinuityOctaveConfirmFrames" ||
      key === "outOfRangeHoldFrames";
    if (fine && base) {
      next[key] = mutateAround(base[key], min, max, 0.12, integer);
    } else {
      const value = randomInRange(min, max);
      next[key] = integer ? Math.round(value) : value;
    }
  });
  return next;
}

function sampleTraceWithConfig(samples, sampleRate, cfg) {
  const frameSize = 2048;
  const hopSize = 512;
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
  const medianBuffer = [];
  const onsetBuffer = [];
  let inactiveFrames = 0;
  let outOfRangeCount = 0;
  let validCount = 0;
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
        acceptedRawSemitone = rawSemitoneDetected;
        pendingRawJumpSemitone = null;
        pendingRawJumpFrames = 0;
        rawPitch = rawPitchDetected;
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

    const hasUsablePitch = Boolean(pitch && Number.isFinite(pitch) && detection.reason === "ok");
    const hasRejectedRawJump = hasDetectedRaw && !rawPitch;
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

    if (pitch && Number.isFinite(pitch)) {
      const semi = 12 * Math.log2(pitch / fundamental);
      if (!Number.isFinite(smooth)) {
        const onsetCorrFloor = Math.max(Number(cfg.correlationThreshold) || 0.88, 0.94);
        const onsetRmsFloor = Math.max((Number(cfg.rmsThreshold) || 0.01) * 2.2, 0.02);
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
              const follow = confirmedOctaveJump ? Math.max(dynamicFollow, 0.6) : dynamicFollow;
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
      rawPitch,
      inRange,
      reason: detection.reason,
    });
  }

  let deltaSum = 0;
  let deltaCount = 0;
  let accelSum = 0;
  let accelCount = 0;
  let octaveFlipCount = 0;
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
  const score =
    validCount * 2.3 +
    confidenceMean * 80 +
    maxRun * 0.8 +
    meanRun * 0.35 -
    jumpCount * 2.4 -
    outOfRangeCount * 1.35 -
    meanDelta * 36 -
    meanAccel * 20 -
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
      octaveRejectCount,
      maxRun,
      meanRun,
    },
  };
}

function renderCandidateTrace(cardCanvas, trace, bounds) {
  const cctx = cardCanvas.getContext("2d");
  const width = cardCanvas.width;
  const height = cardCanvas.height;
  cctx.clearRect(0, 0, width, height);
  cctx.fillStyle = "rgba(0,0,0,0.1)";
  cctx.fillRect(0, 0, width, height);

  cctx.strokeStyle = "rgba(170,180,200,0.4)";
  cctx.lineWidth = 1;
  cctx.beginPath();
  cctx.moveTo(0, height - 0.5);
  cctx.lineTo(width, height - 0.5);
  cctx.stroke();

  let first = true;
  let hasAnySegment = false;
  cctx.strokeStyle = "#57a7ff";
  cctx.lineWidth = 1.5;
  cctx.beginPath();
  for (let i = 0; i < trace.length; i += 1) {
    const point = trace[i];
    const displaySemi = point.semitone;
    if (!Number.isFinite(displaySemi)) {
      first = true;
      continue;
    }
    const x = (i / Math.max(1, trace.length - 1)) * width;
    const y = ((bounds.max - displaySemi) / Math.max(0.001, bounds.max - bounds.min)) * height;
    if (first) {
      cctx.moveTo(x, y);
      first = false;
      hasAnySegment = true;
    } else {
      cctx.lineTo(x, y);
      hasAnySegment = true;
    }
  }
  if (hasAnySegment) {
    cctx.stroke();
  }
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

function renderCalibrationCandidates(candidates, roundLabel) {
  if (!calCandidates) {
    return;
  }
  clearCalibrationCandidates();
  const allSemitones = [];
  candidates.forEach((candidate) => {
    candidate.result.trace.forEach((point) => {
      if (Number.isFinite(point.semitone)) {
        allSemitones.push(point.semitone);
      } else if (Number.isFinite(point.rawSemitone)) {
        allSemitones.push(point.rawSemitone);
      }
    });
  });
  let bounds = { min: -24, max: 24 };
  if (allSemitones.length) {
    const min = Math.min(...allSemitones);
    const max = Math.max(...allSemitones);
    const paddedMin = Math.floor(min - 2);
    const paddedMax = Math.ceil(max + 2);
    if (paddedMax - paddedMin >= 6) {
      bounds = {
        min: Math.max(-48, paddedMin),
        max: Math.min(72, paddedMax),
      };
    }
  }
  candidates.forEach((candidate, idx) => {
    const card = document.createElement("article");
    card.className = "cal-card";
    const canvasEl = document.createElement("canvas");
    canvasEl.width = 240;
    canvasEl.height = 66;
    renderCandidateTrace(canvasEl, candidate.result.trace, bounds);
    const meta = document.createElement("div");
    meta.className = "meter-text";
    meta.textContent =
      `Score ${candidate.result.score.toFixed(1)} · valid ${candidate.result.metrics.validCount} · ` +
      `jumps ${candidate.result.metrics.jumpCount} · jag ${candidate.result.metrics.meanDelta.toFixed(2)} · ` +
      `oct ${candidate.result.metrics.octaveFlipCount}`;
    const pickBtn = document.createElement("button");
    pickBtn.type = "button";
    pickBtn.className = "tiny-button";
    pickBtn.textContent = `Pick ${idx + 1}`;
    pickBtn.addEventListener("click", () => {
      onCalibrationCandidatePicked(candidate, roundLabel);
    });
    card.append(canvasEl, meta, pickBtn);
    calCandidates.appendChild(card);
  });
}

function onCalibrationCandidatePicked(candidate, roundLabel) {
  if (roundLabel === "gross") {
    calibrationState.grossWinner = candidate.config;
    calibrationState.round = 2;
    runCalibrationCandidates();
    return;
  }
  applyAnalysisConfig(candidate.config);
  setCalibrationStatus("Calibration applied. You can repeat to refine further.");
  setCalibrationWindowStatus("Calibration applied.");
  if (calibratePanel) {
    calibratePanel.hidden = true;
  }
  if (calibrateToggle) {
    calibrateToggle.classList.remove("button-on");
  }
  setCalibrationFocus(false);
}

function runCalibrationCandidates() {
  if (!calibrationState.audioSamples || !calibrationState.sampleRate) {
    setCalibrationStatus("Record a sample first.");
    return;
  }
  setCalibrationFocus(true);
  const roundLabel = calibrationState.round <= 1 ? "gross" : "fine";
  const candidateCount = roundLabel === "gross" ? 6 : 6;
  const base = roundLabel === "fine" ? calibrationState.grossWinner : null;
  const candidates = [];
  for (let i = 0; i < candidateCount; i += 1) {
    const config = makeRandomCandidate(base, roundLabel === "fine");
    const result = sampleTraceWithConfig(calibrationState.audioSamples, calibrationState.sampleRate, config);
    candidates.push({ config, result });
  }
  candidates.sort((a, b) => b.result.score - a.result.score);
  calibrationState.candidateSets = candidates;
  renderCalibrationCandidates(candidates, roundLabel);
  const message =
    roundLabel === "gross"
      ? "Gross pass: pick the trace that best matches your performance."
      : "Fine pass: pick the best refinement.";
  setCalibrationStatus(message);
  setCalibrationWindowStatus(message);
}

function resetCalibration() {
  cleanupCalibrationPlayback();
  calibrationState.round = 1;
  calibrationState.grossWinner = null;
  calibrationState.candidateSets = [];
  calibrationState.audioSamples = null;
  calibrationState.sampleRate = 0;
  clearCalibrationCandidates();
  setCalibrationStatus("Record 10-20s of your source, then run candidates.");
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
      `Recorded ${(audioBuffer.duration).toFixed(1)}s @ ${Math.round(audioBuffer.sampleRate)} Hz. Run candidates.`
    );
    setCalibrationWindowStatus("Run candidates to compare settings.");
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
  if (hasLiveAudioTrack(stream)) {
    const clonedTrack = stream.getAudioTracks()[0].clone();
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
    if (!hasLiveAudioTrack(stream)) {
      stream = null;
      resetMicGraphState();
      await start();
    }
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

const queryOverrides = parseIncomingQuery();
const storedSettings = applyStoredSettings(queryOverrides);
initTheme();
if (!(storedSettings && (storedSettings.fundamentalSpelling === "flat" || storedSettings.fundamentalSpelling === "sharp"))) {
  fundamentalSpelling = getFundamentalSpellingFromPitchClass(
    getNearestEtInfo(Number(fundamentalInput.value) || 261.63, Number(a4Input.value) || 440).pitchClass
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
resizeCanvas();
positionMicPanel();
syncStateToQueryString();
drawViz();
rafId = requestAnimationFrame(renderLoop);

startBtn.addEventListener("click", () => {
  toggleMicPanel();
});

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
  });
}

show12EtToggle.addEventListener("change", () => {
  drawViz();
  persistSettings();
});
if (showNoteNamesToggle) {
  showNoteNamesToggle.addEventListener("change", () => {
    drawViz();
    persistSettings();
  });
}
if (showCentsDeviationToggle) {
  showCentsDeviationToggle.addEventListener("change", () => {
    drawViz();
    persistSettings();
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
  });
}
if (colorFamiliesToggle) {
  colorFamiliesToggle.addEventListener("change", () => {
    drawViz();
    persistSettings();
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

bindAnalysisNumberInput(analysisRmsThresholdInput, "rmsThreshold", 0.001, 0.2, 0.01, false);
bindAnalysisNumberInput(analysisRmsWindowInput, "rmsWindowFrames", 1, 32, 4, true);
bindAnalysisNumberInput(analysisCorrThresholdInput, "correlationThreshold", 0.5, 0.99, 0.88, false);
bindAnalysisNumberInput(analysisMinFreqInput, "minFreq", 20, 400, 70, true);
bindAnalysisNumberInput(analysisMaxFreqInput, "maxFreq", 300, 3000, 1400, true);
bindAnalysisNumberInput(analysisJumpThresholdInput, "jumpThreshold", 0.1, 6, 0.65, false);
bindAnalysisNumberInput(analysisJumpConfirmInput, "jumpConfirmFrames", 1, 8, 2, true);
bindAnalysisNumberInput(analysisSmoothFollowInput, "smoothFollow", 0.01, 0.5, 0.18, false);
bindAnalysisNumberInput(analysisIdleDecayInput, "idleDecay", 0.8, 0.995, 0.95, false);
bindAnalysisNumberInput(analysisRangeMarginInput, "rangeMargin", 0, 4, 0.75, false);
bindAnalysisNumberInput(analysisOutRangeHoldInput, "outOfRangeHoldFrames", 1, 60, 8, true);

if (analysisToggle) {
  analysisToggle.addEventListener("click", () => {
    togglePanelVisibility(analysisPanel, analysisToggle);
  });
}

if (debugToggle) {
  debugToggle.addEventListener("click", () => {
    togglePanelVisibility(debugPanel, debugToggle);
  });
}

if (calibrateToggle) {
  calibrateToggle.addEventListener("click", () => {
    togglePanelVisibility(calibratePanel, calibrateToggle);
    if (calibratePanel && calibratePanel.hidden) {
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
resetCalibration();

if (calRecordToggle) {
  calRecordToggle.addEventListener("click", async () => {
    try {
      await toggleCalibrationRecording();
    } catch (_error) {
      setCalibrationStatus("Recording failed. Check mic permissions.");
    }
  });
}

if (calPlayToggle) {
  calPlayToggle.addEventListener("click", async () => {
    try {
      await toggleCalibrationPlayback();
    } catch (_error) {
      setCalibrationPlaybackStatus("Playback failed");
    }
  });
  updateCalPlayButton();
}

if (calRunButton) {
  calRunButton.addEventListener("click", () => {
    runCalibrationCandidates();
  });
}

if (calResetButton) {
  calResetButton.addEventListener("click", () => {
    resetCalibration();
  });
}

if (calWindowClose) {
  calWindowClose.addEventListener("click", () => {
    setCalibrationFocus(false);
  });
}

window.addEventListener("resize", () => {
  resizeCanvas();
  positionMicPanel();
  drawViz();
});

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    const nextRange = getRangeSemitoneValue() + direction;
    setRangeSemitoneValue(nextRange);
    persistSettings();
  },
  { passive: false }
);

canvas.addEventListener("pointerdown", (event) => {
  bottomDragActive = true;
  bottomDragStartY = event.clientY;
  rangeOffsetStartValue = getBottomSemitoneValue();
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!bottomDragActive) {
    return;
  }
  const deltaY = event.clientY - bottomDragStartY;
  const semitoneOffset = Math.round(deltaY / 14);
  const nextOffset = rangeOffsetStartValue + semitoneOffset;
  setRangeOffsetSemitoneValue(nextOffset);
  persistSettings();
});

function stopBottomDrag(event) {
  bottomDragActive = false;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch (_error) {
    // no-op
  }
}

canvas.addEventListener("pointerup", stopBottomDrag);
canvas.addEventListener("pointercancel", stopBottomDrag);

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
