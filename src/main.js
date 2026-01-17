import { customOscillatorTypes, customOscillators } from "web-audio-oscillators";
const canvas = document.getElementById("lattice");
const ctx = canvas.getContext("2d");
const audioToggle = document.getElementById("audio-toggle");
const resetButton = document.getElementById("reset-lattice");
const exportScaleButton = document.getElementById("export-scale");
const themeSelect = document.getElementById("theme-select");
const optionsToggle = document.getElementById("options-toggle");
const optionsPanel = document.getElementById("options-panel");
const midiEnable = document.getElementById("midi-enable");
const midiPortSelect = document.getElementById("midi-port");
const midiChannelSelect = document.getElementById("midi-channel");
const presetToggle = document.getElementById("preset-toggle");
const presetPanel = document.getElementById("preset-panel");
const presetList = document.getElementById("preset-list");
const topBar = document.querySelector(".top-bar");
const controlsPanel = document.querySelector(".controls");
const synthPanel = document.querySelector(".synth-panel");
const envelopeToggle = document.getElementById("envelope-toggle");
const envelopePanel = document.getElementById("envelope-panel");
const animationToggle = document.getElementById("animation-toggle");
const animationPanel = document.getElementById("animation-panel");
const ratioWheelToggle = document.getElementById("ratio-wheel-toggle");
const ratioWheelPanel = document.getElementById("ratio-wheel-panel");
const ratioWheelLarge = document.getElementById("ratio-wheel-large");
const ratioWheelMini = document.getElementById("ratio-wheel-mini");
const uiHint = document.getElementById("ui-hint");
const zModeMessage = document.getElementById("z-mode-message");
const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const a4Input = document.getElementById("a4");
const ratioXSelect = document.getElementById("ratio-x");
const ratioYSelect = document.getElementById("ratio-y");
const ratioZSelect = document.getElementById("ratio-z");
const volumeSlider = document.getElementById("volume");
const volumeReadout = document.getElementById("volume-readout");
const lfoDepthSlider = document.getElementById("lfo-depth");
const lfoDepthReadout = document.getElementById("lfo-depth-readout");
const keyboardModeSelect = document.getElementById("keyboard-mode");
const waveformSelect = document.getElementById("waveform");
const attackSlider = document.getElementById("attack");
const decaySlider = document.getElementById("decay");
const sustainSlider = document.getElementById("sustain");
const releaseSlider = document.getElementById("release");
const oneShotCheckbox = document.getElementById("one-shot");
const looperToggle = document.getElementById("looper-toggle");
const looperClear = document.getElementById("looper-clear");
const tempoSlider = document.getElementById("tempo");
const tempoReadout = document.getElementById("tempo-readout");
const patternLengthSlider = document.getElementById("pattern-length");
const patternLengthReadout = document.getElementById("pattern-length-readout");
const patternLengthModeInputs = document.querySelectorAll(
  'input[name="pattern-length-mode"]'
);
const sequencePatternSelect = document.getElementById("sequence-pattern");
const rhythmPatternSelect = document.getElementById("rhythm-pattern");
const octavePatternSelect = document.getElementById("octave-pattern");
const patternBuildButton = document.getElementById("pattern-build");
const scorePlayToggle = document.getElementById("score-play-toggle");
const lfoPresetSelect = document.getElementById("lfo-preset");
const lfoPlayToggle = document.getElementById("lfo-play-toggle");
const lfoStopButton = document.getElementById("lfo-stop");
const sequenceLfoDensitySlider = document.getElementById("sequence-lfo-density");
const sequenceLfoDensityReadout = document.getElementById("sequence-lfo-density-readout");
const allNotesOffButton = document.getElementById("all-notes-off");
const attackReadout = document.getElementById("attack-readout");
const decayReadout = document.getElementById("decay-readout");
const sustainReadout = document.getElementById("sustain-readout");
const releaseReadout = document.getElementById("release-readout");
const mode3dCheckbox = document.getElementById("mode-3d");
const nav3dPanel = document.getElementById("nav-3d");
const navAddModeToggle = document.getElementById("nav-add-mode");
const navAxesToggle = document.getElementById("nav-axes");
const navGridToggle = document.getElementById("nav-grid");
const nav3dButtons = nav3dPanel ? nav3dPanel.querySelectorAll("button[data-view], button[data-action]") : [];

const view = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  rotating: false,
  dragStart: { x: 0, y: 0 },
  dragOffsetStart: { x: 0, y: 0 },
  rotateStart: { x: 0, y: 0 },
  rotateAnglesStart: { x: 0, y: 0 },
  lastPointer: { x: 0, y: 0 },
  rotX: 0,
  rotY: 0,
};

let audioCtx = null;
let masterGain = null;
let hoverNodeId = null;
let themeColors = null;
let lfoDepth = 1;
let lfoArmingId = null;
let lfoArmingStart = 0;
let lfoAnimating = false;
let lfoStopTimers = [];
let sequenceLfoTimers = [];
let sequenceLfoCycleTimer = null;
let sequenceLfoVoices = new Map();
let sequenceLfoOverlap = 4;
let lfoPresetPlaying = false;
let midiAccess = null;
let midiInput = null;
let midiEnabled = false;
const midiActiveNotes = new Map();
let lastLfoTapTime = 0;
let lastLfoTapId = null;
const activeKeys = new Map();

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const primes = [
  3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73,
  79, 83, 89, 97,
];
const GRID_COLS = 20;
const GRID_ROWS = 20;
const GRID_DEPTH = 7;
const GRID_SPACING = 120;
const BUILTIN_WAVEFORMS = ["sine", "triangle", "square", "sawtooth"];
const CUSTOM_WAVEFORMS = new Set(customOscillatorTypes || []);
const KEYBOARD_MAP = {
  z: 0,
  s: 1,
  x: 2,
  d: 3,
  c: 4,
  v: 5,
  g: 6,
  b: 7,
  h: 8,
  n: 9,
  j: 10,
  m: 11,
  y: 12,
  ",": 12,
  "7": 13,
  u: 14,
  "8": 15,
  i: 16,
  o: 17,
  "0": 18,
  p: 19,
  "-": 20,
  "[": 21,
  "=": 22,
  "]": 23,
  "\\": 24,
};
const KEYBOARD_BASE_MIDI = 60;
const ISOMORPHIC_ROWS = [
  { keys: "1234567890", yOffset: -2 },
  { keys: "qwertyuiop", yOffset: -1 },
  { keys: "asdfghjkl;", yOffset: 0 },
  { keys: "zxcvbnm,./", yOffset: 1 },
];
const KEYBOARD_ROW_SKEW = [-0.6, -0.35, -0.15, 0];
const GOLDEN_DURATIONS = [
  0.5835921350012612,
  0.36067977499789805,
  0.5835921350012612,
  0.5835921350012612,
  0.36067977499789805,
  0.5835921350012612,
  0.36067977499789805,
  0.5835921350012612,
];
const MAX_SEQUENCE_LFO_WAIT_BEATS = 32;
let nodes = [];
let nodeById = new Map();
let edges = [];
let voices = [];
let pitchInstances = [];
let nextVoiceId = 1;
const MIN_FREQ = 40;
const MAX_FREQ = 19000;
let is3DMode = false;
let isFlattened2D = false;
let showAxes = true;
let showGrid = true;
let gridDepth = 1;
let gridCenterZ = 0;
let zModeActive = false;
let zModeAnchor = null;
let zKeyHeld = false;
let isAddMode = false;
let shiftHeld = false;
let isomorphicKeyMap = null;
let isomorphicLayout = null;
let isomorphicDirty = true;
let keyboardKeyPositions = null;
let looperState = "idle";
let looperEvents = [];
let looperStartMs = 0;
let looperLoopDurationMs = 0;
let looperCycleTimer = null;
let looperTimeouts = [];
let looperVoicesByNode = new Map();
let patternPlayerState = "idle";
let patternNextTimer = null;
let patternOffTimers = [];
let patternActiveNodes = [];
let patternSequenceState = null;
let patternRhythmState = null;
let patternOctaveState = null;
let patternVoices = new Set();
let tempoBpm = 120;
let patternLengthValue = 1;
let patternLengthMode = "sustain";

function markIsomorphicDirty() {
  isomorphicDirty = true;
  isomorphicKeyMap = null;
  isomorphicLayout = null;
}

function updateLooperButton() {
  if (!looperToggle) {
    return;
  }
  if (looperState === "recording") {
    looperToggle.textContent = "Play";
    looperToggle.classList.add("button-on");
  } else if (looperState === "playing") {
    looperToggle.textContent = "Stop";
    looperToggle.classList.add("button-on");
  } else if (looperState === "ready") {
    looperToggle.textContent = "Play";
    looperToggle.classList.remove("button-on");
  } else {
    looperToggle.textContent = "Record";
    looperToggle.classList.remove("button-on");
  }
}

function updateScoreButton() {
  if (!scorePlayToggle) {
    return;
  }
  if (patternPlayerState === "playing") {
    scorePlayToggle.textContent = "Stop";
    scorePlayToggle.classList.add("button-on");
  } else {
    scorePlayToggle.textContent = "Play";
    scorePlayToggle.classList.remove("button-on");
  }
}

function updateTempoReadout() {
  if (!tempoSlider || !tempoReadout) {
    return;
  }
  tempoBpm = Number(tempoSlider.value) || 120;
  tempoReadout.textContent = `${tempoBpm} BPM`;
}

function updatePatternLengthReadout() {
  if (!patternLengthSlider || !patternLengthReadout) {
    return;
  }
  patternLengthValue = Number(patternLengthSlider.value) || 1;
  patternLengthReadout.textContent =
    patternLengthMode === "gate"
      ? `${patternLengthValue.toFixed(2)}x`
      : `${patternLengthValue.toFixed(2)} beats`;
}

function updateLfoPlayButton() {
  if (!lfoPlayToggle) {
    return;
  }
  lfoPlayToggle.textContent = lfoPresetPlaying ? "Stop" : "Play";
  lfoPlayToggle.classList.toggle("button-on", lfoPresetPlaying);
}

function updateSequenceLfoDensityReadout() {
  if (!sequenceLfoDensitySlider || !sequenceLfoDensityReadout) {
    return;
  }
  sequenceLfoOverlap = Number(sequenceLfoDensitySlider.value) || 4;
  sequenceLfoDensityReadout.textContent = `${sequenceLfoOverlap.toFixed(0)}`;
}

function beatsToMs(beats) {
  return (beats * 60000) / tempoBpm;
}

function stopPatternVoices() {
  patternVoices.forEach((voice) => stopVoice(voice));
  patternVoices = new Set();
}

function getActiveNodeOrder() {
  return nodes
    .filter((node) => node.active)
    .map((node) => ({
      nodeId: node.id,
      ratio: node.numerator / node.denominator,
    }))
    .sort((a, b) => a.ratio - b.ratio)
    .map((item) => item.nodeId);
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildEuclideanPattern(steps, pulses) {
  if (pulses <= 0) {
    return Array.from({ length: steps }, () => 0);
  }
  if (pulses >= steps) {
    return Array.from({ length: steps }, () => 1);
  }
  let pattern = [];
  let counts = [];
  let remainders = [];
  remainders.push(pulses);
  let divisor = steps - pulses;
  let level = 0;

  while (true) {
    counts.push(Math.floor(divisor / remainders[level]));
    remainders.push(divisor % remainders[level]);
    divisor = remainders[level];
    level += 1;
    if (remainders[level] <= 1) {
      break;
    }
  }
  counts.push(divisor);

  const build = (lvl) => {
    if (lvl === -1) {
      pattern.push(0);
      return;
    }
    if (lvl === -2) {
      pattern.push(1);
      return;
    }
    for (let i = 0; i < counts[lvl]; i += 1) {
      build(lvl - 1);
    }
    if (remainders[lvl] !== 0) {
      build(lvl - 2);
    }
  };

  build(level);

  while (pattern.length && pattern[0] === 0) {
    pattern.push(pattern.shift());
  }

  return pattern;
}

function buildEuclideanDurations(pulses) {
  if (pulses <= 0) {
    return [0.5];
  }
  let steps = Math.round(pulses * 1.5);
  if (steps % 2 === 1) {
    steps += 1;
  }
  if (steps < pulses) {
    steps = pulses + (pulses % 2);
  }
  const pattern = buildEuclideanPattern(steps, pulses);
  const durations = [];
  let count = 0;
  pattern.forEach((hit) => {
    count += 1;
    if (hit === 1) {
      durations.push(count * 0.5);
      count = 0;
    }
  });
  if (count > 0) {
    durations[0] = (durations[0] || 0) + count * 0.5;
  }
  return durations.length ? durations : [0.5];
}

function buildBloomsDurations() {
  const count = Math.floor(Math.random() * 4) + 3;
  const durations = [];
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    const value = 0.1 + Math.random() * 0.7;
    durations.push(value);
    total += value;
  }
  const remainder = Math.max(0.1, 12 - total);
  durations.push(remainder);
  return durations;
}

function getLeftRightOrderIndices() {
  return patternActiveNodes
    .map((nodeId, index) => {
      const node = nodeById.get(nodeId);
      if (!node) {
        return null;
      }
      const pos = worldToScreen(node.coordinate);
      return { index, x: pos.x, y: pos.y };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.x !== b.x) {
        return a.x - b.x;
      }
      return a.y - b.y;
    })
    .map((item) => item.index);
}

function getSpiralInOrderIndices() {
  const centerX = canvas.clientWidth / 2;
  const centerY = canvas.clientHeight / 2;
  return patternActiveNodes
    .map((nodeId, index) => {
      const node = nodeById.get(nodeId);
      if (!node) {
        return null;
      }
      const pos = worldToScreen(node.coordinate);
      const dx = pos.x - centerX;
      const dy = pos.y - centerY;
      return {
        index,
        radius: Math.hypot(dx, dy),
        angle: Math.atan2(dy, dx),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.radius !== b.radius) {
        return b.radius - a.radius;
      }
      return a.angle - b.angle;
    })
    .map((item) => item.index);
}

function getMerukhandOrderIndices(count) {
  if (count < 3) {
    return Array.from({ length: count }, (_, index) => index);
  }
  const permutations = [
    [0, 1, 2],
    [1, 0, 2],
    [0, 2, 1],
    [2, 0, 1],
    [1, 2, 0],
    [2, 1, 0],
  ];
  const order = [];
  for (let i = 0; i <= count - 3; i += 1) {
    for (let j = i + 1; j <= count - 2; j += 1) {
      for (let k = j + 1; k <= count - 1; k += 1) {
        const trio = [i, j, k];
        permutations.forEach((perm) => {
          order.push(trio[perm[0]], trio[perm[1]], trio[perm[2]]);
        });
      }
    }
  }
  return order;
}

function getPlainBobMinorOps() {
  return ["x", "16", "x", "16", "x", "16", "12", "16", "x", "16", "x", "16"];
}

function applyPlaceNotation(row, op) {
  const n = row.length;
  if (n < 2) {
    return row.slice();
  }
  if (op === "x") {
    const next = row.slice();
    for (let i = 0; i < n - 1; i += 2) {
      const temp = next[i];
      next[i] = next[i + 1];
      next[i + 1] = temp;
    }
    return next;
  }
  let fixed = [];
  if (op === "16") {
    fixed = [1, 6];
  } else if (op === "12") {
    fixed = [1, 2];
  } else {
    fixed = op.split("").map((digit) => Number(digit));
  }
  const fixedPositions = new Set(fixed.filter((pos) => pos >= 1 && pos <= n).map((pos) => pos - 1));
  const next = row.slice();
  let i = 0;
  while (i < n - 1) {
    if (fixedPositions.has(i) || fixedPositions.has(i + 1)) {
      i += 1;
      continue;
    }
    const temp = next[i];
    next[i] = next[i + 1];
    next[i + 1] = temp;
    i += 2;
  }
  return next;
}

function buildPatternStates(preserveIndices = false) {
  const prevSequenceIndex = patternSequenceState ? patternSequenceState.index : 0;
  const prevSequenceStep = patternSequenceState ? patternSequenceState.stepInLead : 0;
  const prevSequencePos = patternSequenceState ? patternSequenceState.posInRow : 0;
  const prevSequenceCycles = patternSequenceState ? patternSequenceState.cyclesCompleted : 0;
  const prevRhythmIndex = patternRhythmState ? patternRhythmState.index : 0;
  const prevOctaveIndex = patternOctaveState ? patternOctaveState.index : 0;
  patternActiveNodes = getActiveNodeOrder();
  const count = patternActiveNodes.length;
  const sequencePattern = sequencePatternSelect ? sequencePatternSelect.value : "ascending";
  const rhythmPattern = rhythmPatternSelect ? rhythmPatternSelect.value : "steady";
  const octavePattern = octavePatternSelect ? octavePatternSelect.value : "unison";

  let order = Array.from({ length: count }, (_, index) => index);
  if (sequencePattern === "descending") {
    order = order.reverse();
  } else if (sequencePattern === "shuffle") {
    order = shuffleArray(order);
  } else if (sequencePattern === "mutate") {
    order = shuffleArray(order);
  } else if (sequencePattern === "left-right") {
    order = getLeftRightOrderIndices();
  } else if (sequencePattern === "spiral-in") {
    order = getSpiralInOrderIndices();
  } else if (sequencePattern === "merukhand") {
    order = getMerukhandOrderIndices(count);
  }
  if (sequencePattern === "plain-bob-minor") {
    patternSequenceState = {
      type: sequencePattern,
      row: Array.from({ length: count }, (_, index) => index),
      posInRow: preserveIndices ? prevSequencePos % Math.max(count, 1) : 0,
      stepInLead: preserveIndices ? prevSequenceStep % getPlainBobMinorOps().length : 0,
      ops: getPlainBobMinorOps(),
    };
  } else if (sequencePattern === "mutate") {
    patternSequenceState = {
      type: sequencePattern,
      order,
      octaveOffsets: Array.from({ length: order.length }, () => 0),
      index: preserveIndices ? prevSequenceIndex : 0,
      cyclesCompleted: preserveIndices ? prevSequenceCycles : 0,
    };
  } else {
    patternSequenceState = {
      type: sequencePattern,
      order,
      index: preserveIndices ? prevSequenceIndex : 0,
    };
  }

  let rhythmValues = [0.5];
  if (rhythmPattern === "random") {
    rhythmValues = [0.25, 0.25, 0.5, 1, 2];
  } else if (rhythmPattern === "euclidean") {
    rhythmValues = buildEuclideanDurations(count);
  } else if (rhythmPattern === "golden") {
    rhythmValues = [...GOLDEN_DURATIONS];
  } else if (rhythmPattern === "blooms") {
    rhythmValues = buildBloomsDurations();
  } else if (rhythmPattern === "even-pairs") {
    rhythmValues = [0, 0.5];
  }
  patternRhythmState = {
    type: rhythmPattern,
    values: rhythmValues,
    index: preserveIndices ? prevRhythmIndex : 0,
  };

  patternOctaveState = {
    type: octavePattern,
    values:
      octavePattern === "random"
        ? [-1, 0, 1, 2]
        : octavePattern === "down-unison"
          ? [-1, 0, 0, 0]
          : octavePattern === "down-up"
            ? [-1, 0, 1, 0]
            : [0],
    index: preserveIndices ? prevOctaveIndex : 0,
  };
}

function maybeMutateSequence(state, count) {
  if (!state || state.type !== "mutate" || !state.order.length) {
    return;
  }
  if (state.cyclesCompleted < 4) {
    return;
  }
  if (state.cyclesCompleted % 2 !== 0) {
    return;
  }
  const targetIndex = Math.floor(Math.random() * state.order.length);
  if (Math.random() < 0.5 && count > 0) {
    let nextIndex = state.order[targetIndex];
    for (let i = 0; i < 4; i += 1) {
      const candidate = Math.floor(Math.random() * count);
      if (candidate !== nextIndex) {
        nextIndex = candidate;
        break;
      }
    }
    state.order[targetIndex] = nextIndex;
  } else {
    const delta = Math.random() < 0.5 ? -1 : 1;
    state.octaveOffsets[targetIndex] = (state.octaveOffsets[targetIndex] || 0) + delta;
  }
}

function nextSequenceStep() {
  if (!patternSequenceState || !patternActiveNodes.length) {
    return null;
  }
  if (patternSequenceState.type === "random") {
    return { index: Math.floor(Math.random() * patternActiveNodes.length), octaveOffset: 0 };
  }
  if (patternSequenceState.type === "plain-bob-minor") {
    const row = patternSequenceState.row;
    if (!row || row.length === 0) {
      return null;
    }
    const index = row[patternSequenceState.posInRow];
    patternSequenceState.posInRow += 1;
    if (patternSequenceState.posInRow >= row.length) {
      const op = patternSequenceState.ops[patternSequenceState.stepInLead];
      patternSequenceState.row = applyPlaceNotation(row, op);
      patternSequenceState.stepInLead =
        (patternSequenceState.stepInLead + 1) % patternSequenceState.ops.length;
      patternSequenceState.posInRow = 0;
    }
    return { index, octaveOffset: 0 };
  }
  if (
    patternSequenceState.type === "left-right" &&
    patternSequenceState.index % patternSequenceState.order.length === 0
  ) {
    patternSequenceState.order = getLeftRightOrderIndices();
  }
  if (
    patternSequenceState.type === "spiral-in" &&
    patternSequenceState.index % patternSequenceState.order.length === 0
  ) {
    patternSequenceState.order = getSpiralInOrderIndices();
  }
  if (patternSequenceState.type === "mutate") {
    if (patternSequenceState.index % patternSequenceState.order.length === 0) {
      if (patternSequenceState.index > 0) {
        patternSequenceState.cyclesCompleted += 1;
        maybeMutateSequence(patternSequenceState, patternActiveNodes.length);
      }
    }
    const stepIndex =
      patternSequenceState.index % patternSequenceState.order.length;
    const value = patternSequenceState.order[stepIndex];
    const octaveOffset = patternSequenceState.octaveOffsets[stepIndex] || 0;
    patternSequenceState.index += 1;
    return { index: value, octaveOffset };
  }
  const value = patternSequenceState.order[
    patternSequenceState.index % patternSequenceState.order.length
  ];
  patternSequenceState.index += 1;
  return { index: value, octaveOffset: 0 };
}

function nextRhythmBeats() {
  if (!patternRhythmState) {
    return 1;
  }
  if (patternRhythmState.type === "random") {
    const values = patternRhythmState.values;
    return values[Math.floor(Math.random() * values.length)];
  }
  if (
    patternRhythmState.type === "euclidean" &&
    patternRhythmState.index % patternRhythmState.values.length === 0
  ) {
    patternRhythmState.values = buildEuclideanDurations(patternActiveNodes.length);
  }
  if (
    patternRhythmState.type === "blooms" &&
    patternRhythmState.index % patternRhythmState.values.length === 0
  ) {
    patternRhythmState.values = buildBloomsDurations();
  }
  const value =
    patternRhythmState.values[patternRhythmState.index % patternRhythmState.values.length];
  patternRhythmState.index += 1;
  return value;
}

function nextOctaveOffset() {
  if (!patternOctaveState) {
    return 0;
  }
  if (patternOctaveState.type === "random") {
    const values = patternOctaveState.values;
    return values[Math.floor(Math.random() * values.length)];
  }
  const value =
    patternOctaveState.values[patternOctaveState.index % patternOctaveState.values.length];
  patternOctaveState.index += 1;
  return value;
}

function scheduleNextPatternEvent(delayMs) {
  if (patternNextTimer) {
    clearTimeout(patternNextTimer);
  }
  patternNextTimer = setTimeout(() => {
    if (patternPlayerState !== "playing") {
      return;
    }
    const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
    const step = nextSequenceStep();
    const nextIndex = step ? step.index : null;
    const durationBeats = nextRhythmBeats();
    const octave = nextOctaveOffset() + (step ? step.octaveOffset : 0);
    if (nextIndex != null) {
      const nodeId = patternActiveNodes[nextIndex];
      const node = nodeById.get(nodeId);
      if (node) {
        const freq = node.freq * Math.pow(2, octave);
        const voice = startVoice({
          nodeId: node.id,
          octave,
          freq,
          source: "pattern",
        });
        if (voice) {
          patternVoices.add(voice);
          draw();
          if (isOneShot) {
            const attack = Number(attackSlider.value) || 0.02;
            const decay = Number(decaySlider.value) || 0.2;
            const release = Number(releaseSlider.value) || 0.6;
            const cleanupMs = (attack + decay + release) * 1000 + 60;
            const cleanupTimer = setTimeout(() => {
              patternVoices.delete(voice);
              draw();
            }, Math.max(0, cleanupMs));
            patternOffTimers.push(cleanupTimer);
          } else {
            const lengthBeats =
              patternLengthMode === "gate"
                ? durationBeats * patternLengthValue
                : patternLengthValue;
            const offTimer = setTimeout(() => {
              stopVoice(voice);
              patternVoices.delete(voice);
              draw();
            }, Math.max(0, beatsToMs(lengthBeats)));
            patternOffTimers.push(offTimer);
          }
        }
      }
    }
    scheduleNextPatternEvent(beatsToMs(durationBeats));
  }, Math.max(0, delayMs));
}

function startPatternPlayback() {
  if (!patternSequenceState) {
    buildPatternStates(false);
  }
  patternPlayerState = "playing";
  updateScoreButton();
  scheduleNextPatternEvent(0);
}

function stopPatternPlayback() {
  if (patternNextTimer) {
    clearTimeout(patternNextTimer);
    patternNextTimer = null;
  }
  patternOffTimers.forEach((timer) => clearTimeout(timer));
  patternOffTimers = [];
  stopPatternVoices();
  patternPlayerState = "idle";
  updateScoreButton();
  draw();
}

function disableVoiceLfo(voice) {
  if (!voice) {
    return;
  }
  voice.lfoActive = false;
  voice.lfoHalfPeriod = 0;
  voice.lfoStartMs = 0;
  if (voice.lfoGain) {
    voice.lfoGain.gain.value = 1;
  }
}

function randomizeLfosForActiveNodes() {
  const now = performance.now();
  const activeNodes = nodes.filter((node) => node.active);
  if (!activeNodes.length) {
    return;
  }
  activeNodes.forEach((node) => {
    if (node.baseVoiceId) {
      const baseVoice = findVoiceById(node.baseVoiceId);
      if (baseVoice) {
        stopVoice(baseVoice, true);
      }
      node.baseVoiceId = null;
    }
    voices.forEach((voice) => {
      if (voice.nodeId === node.id && voice.source === "node") {
        stopVoice(voice, true);
      }
    });
    const duration = 2 + Math.random() * 8;
    const phaseOffset = Math.random() * duration * 1000;
    const curve = 0.5 + Math.random() * 2.2;
    const voice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
      lfoActive: true,
      lfoHalfPeriod: duration,
      lfoStartMs: now - phaseOffset,
      lfoCurve: curve,
      source: "random-lfo",
    });
    if (voice) {
      node.baseVoiceId = voice.id;
    }
  });
  ensureLfoLoop();
  draw();
}

function clearLfoStopTimers() {
  lfoStopTimers.forEach((timer) => clearTimeout(timer));
  lfoStopTimers = [];
}

function clearSequenceLfoTimers() {
  sequenceLfoTimers.forEach((timer) => clearTimeout(timer));
  sequenceLfoTimers = [];
  if (sequenceLfoCycleTimer) {
    clearInterval(sequenceLfoCycleTimer);
    sequenceLfoCycleTimer = null;
  }
}

function stopSequenceLfoVoices() {
  sequenceLfoVoices.forEach((voice) => stopVoice(voice));
  sequenceLfoVoices = new Map();
}

function getSequenceOrderIndices() {
  if (!patternSequenceState || !patternActiveNodes.length) {
    return [];
  }
  const type = patternSequenceState.type;
  if (type === "plain-bob-minor" && Array.isArray(patternSequenceState.row)) {
    return [...patternSequenceState.row];
  }
  if (Array.isArray(patternSequenceState.order)) {
    return [...patternSequenceState.order];
  }
  return Array.from({ length: patternActiveNodes.length }, (_, index) => index);
}

function getSequenceNodeOrder() {
  const type = patternSequenceState ? patternSequenceState.type : "ascending";
  if (type === "left-right") {
    const indices = getLeftRightOrderIndices();
    return indices.map((index) => patternActiveNodes[index]).filter((id) => id != null);
  }
  if (type === "spiral-in") {
    const indices = getSpiralInOrderIndices();
    return indices.map((index) => patternActiveNodes[index]).filter((id) => id != null);
  }
  const indices = getSequenceOrderIndices();
  const seen = new Set();
  const result = [];
  indices.forEach((index) => {
    const nodeId = patternActiveNodes[index];
    if (nodeId == null || seen.has(nodeId)) {
      return;
    }
    seen.add(nodeId);
    result.push(nodeId);
  });
  return result;
}

function scheduleSequenceLfoCycle(voice, startTime, beatSec, waitStartBeats, waitEndBeats) {
  if (!voice.lfoGain) {
    return;
  }
  const cycleSec = (16 + waitStartBeats + waitEndBeats) * beatSec;
  const riseSec = 8 * beatSec;
  const fallSec = 8 * beatSec;
  const waitStartSec = waitStartBeats * beatSec;
  const waitEndSec = waitEndBeats * beatSec;
  const startFade = startTime + waitStartSec;
  const endRise = startFade + riseSec;
  const endFall = endRise + fallSec;
  const endCycle = startTime + cycleSec;
  voice.lfoGain.gain.cancelScheduledValues(startTime);
  voice.lfoGain.gain.setValueAtTime(0, startTime);
  voice.lfoGain.gain.linearRampToValueAtTime(0, startFade);
  voice.lfoGain.gain.linearRampToValueAtTime(1, endRise);
  voice.lfoGain.gain.linearRampToValueAtTime(0, endFall);
  voice.lfoGain.gain.setValueAtTime(0, endCycle);
}

function scheduleSequenceLfoCycleForOrder(order, startTime, beatSec, waitBeats) {
  const cycleSec = (16 + waitBeats) * beatSec;
  const nextIds = new Set(order);
  const activeNodes = new Set(patternActiveNodes);
  sequenceLfoVoices.forEach((voice, nodeId) => {
    if (!nextIds.has(nodeId) || !activeNodes.has(nodeId)) {
      stopVoice(voice);
      sequenceLfoVoices.delete(nodeId);
    }
  });
  order.forEach((nodeId, index) => {
    const node = nodeById.get(nodeId);
    if (!node) {
      return;
    }
    let voice = sequenceLfoVoices.get(nodeId);
    if (!voice) {
      voice = startVoice({
        nodeId: node.id,
        octave: 0,
        freq: node.freq,
        source: "lfo-sequence",
        ignoreOneShot: true,
      });
      if (!voice) {
        return;
      }
      if (voice.lfoGain) {
        voice.lfoGain.gain.setValueAtTime(0, audioCtx.currentTime);
      }
      sequenceLfoVoices.set(nodeId, voice);
    }
    const offsetBeats = index * 4;
    const offsetSec = offsetBeats * beatSec;
    const start = startTime + offsetSec;
    const waitStartBeats = Math.min(waitBeats, offsetBeats);
    const waitEndBeats = Math.max(0, waitBeats - waitStartBeats);
    voice.lfoSequenceStartSec = startTime;
    voice.lfoSequenceCycleSec = cycleSec;
    voice.lfoSequenceBeatSec = beatSec;
    voice.lfoSequenceOffsetSec = offsetSec;
    voice.lfoSequenceWaitStartBeats = waitStartBeats;
    voice.lfoSequenceWaitEndBeats = waitEndBeats;
    scheduleSequenceLfoCycle(voice, start, beatSec, waitStartBeats, waitEndBeats);
  });
}

function getSequenceLfoWaitBeats() {
  const min = 2;
  const max = 16;
  const clamped = Math.max(min, Math.min(max, sequenceLfoOverlap));
  const t = (clamped - min) / (max - min);
  return MAX_SEQUENCE_LFO_WAIT_BEATS * (1 - t);
}

function scheduleNextSequenceLfoCycle(beatSec) {
  if (sequenceLfoCycleTimer) {
    clearTimeout(sequenceLfoCycleTimer);
    sequenceLfoCycleTimer = null;
  }
  const waitBeats = getSequenceLfoWaitBeats();
  const cycleSec = (16 + waitBeats) * beatSec;
  sequenceLfoCycleTimer = setTimeout(() => {
    const nextOrder = getSequenceNodeOrder();
    const startTime = audioCtx.currentTime;
    if (nextOrder.length) {
      scheduleSequenceLfoCycleForOrder(
        nextOrder,
        startTime,
        beatSec,
        waitBeats
      );
    }
    scheduleNextSequenceLfoCycle(beatSec);
  }, cycleSec * 1000);
}

function startSequenceLfos() {
  if (!audioCtx || audioCtx.state !== "running") {
    enableAudio();
  }
  clearSequenceLfoTimers();
  stopSequenceLfoVoices();
  const beatSec = 60 / tempoBpm;
  const now = audioCtx.currentTime;
  const order = getSequenceNodeOrder();
  if (!order.length) {
    return;
  }
  const waitBeats = getSequenceLfoWaitBeats();
  scheduleSequenceLfoCycleForOrder(order, now, beatSec, waitBeats);
  scheduleNextSequenceLfoCycle(beatSec);
  draw();
  ensureLfoLoop();
}

function scheduleLfoStopsAtCycleEnd() {
  clearLfoStopTimers();
  clearSequenceLfoTimers();
  const now = performance.now();
  voices.forEach((voice) => {
    if (voice.releasing) {
      return;
    }
    let remaining = null;
    if (voice.lfoActive) {
      const halfPeriod = Number(voice.lfoHalfPeriod) || 0;
      if (halfPeriod <= 0) {
        return;
      }
      const period = halfPeriod * 2;
      const elapsed = (now - voice.lfoStartMs) / 1000;
      const phase = ((elapsed % period) + period) % period;
      remaining = period - phase;
    } else if (voice.source === "lfo-sequence" && voice.lfoSequenceCycleSec) {
      const cycleSec = voice.lfoSequenceCycleSec;
      const elapsed = (audioCtx ? audioCtx.currentTime : 0) - voice.lfoSequenceStartSec;
      const phase = ((elapsed % cycleSec) + cycleSec) % cycleSec;
      remaining = cycleSec - phase;
    } else {
      return;
    }
    const timer = setTimeout(() => {
      stopVoice(voice, false);
      const node = nodeById.get(voice.nodeId);
      if (node && node.baseVoiceId === voice.id) {
        node.baseVoiceId = null;
      }
      draw();
    }, Math.max(0, remaining * 1000));
    lfoStopTimers.push(timer);
  });
}

function stopLfoPresets() {
  lfoPresetPlaying = false;
  updateLfoPlayButton();
  scheduleLfoStopsAtCycleEnd();
  clearSequenceLfoTimers();
  stopSequenceLfoVoices();
}

function allNotesOff() {
  stopPatternPlayback();
  stopLooperPlayback();
  clearLfoStopTimers();
  clearSequenceLfoTimers();
  stopSequenceLfoVoices();
  lfoArmingId = null;
  lfoArmingStart = 0;
  stopAllVoices();
  nodes.forEach((node) => {
    node.baseVoiceId = null;
  });
  draw();
}

function refreshPatternFromActiveNodes() {
  if (!sequencePatternSelect) {
    return;
  }
  buildPatternStates(true);
}

function clearLooperTimers() {
  looperTimeouts.forEach((timer) => clearTimeout(timer));
  looperTimeouts = [];
  if (looperCycleTimer) {
    clearInterval(looperCycleTimer);
    looperCycleTimer = null;
  }
}

function stopLooperVoices() {
  looperVoicesByNode.forEach((voicesList) => {
    voicesList.forEach((voice) => stopVoice(voice));
  });
  looperVoicesByNode = new Map();
}

function startLooperRecording() {
  looperEvents = [];
  looperStartMs = performance.now();
  looperLoopDurationMs = 0;
  looperState = "recording";
  updateLooperButton();
}

function scheduleLooperCycle() {
  looperEvents.forEach((event) => {
    const timer = setTimeout(() => {
      if (looperState !== "playing") {
        return;
      }
      const node = nodeById.get(event.nodeId);
      if (!node) {
        return;
      }
      if (event.type === "on") {
        const octave = Number(event.octave) || 0;
        const voice = startVoice({
          nodeId: node.id,
          octave,
          freq: node.freq * Math.pow(2, octave),
          source: "looper",
        });
        if (voice) {
          const list = looperVoicesByNode.get(node.id) || [];
          list.push(voice);
          looperVoicesByNode.set(node.id, list);
          draw();
        }
      } else if (event.type === "off") {
        const list = looperVoicesByNode.get(node.id);
        if (list && list.length) {
          const targetOctave = Number(event.octave) || 0;
          const matchIndex = list.findIndex((voice) => voice.octave === targetOctave);
          const voice = matchIndex >= 0 ? list.splice(matchIndex, 1)[0] : list.shift();
          if (voice) {
            stopVoice(voice);
            draw();
          }
        }
      }
    }, event.t);
    looperTimeouts.push(timer);
  });
}

function startLooperPlayback() {
  if (!looperEvents.length) {
    looperState = "idle";
    updateLooperButton();
    return;
  }
  looperLoopDurationMs = Math.max(looperLoopDurationMs, 250);
  looperState = "playing";
  updateLooperButton();
  clearLooperTimers();
  stopLooperVoices();
  scheduleLooperCycle();
  looperCycleTimer = setInterval(scheduleLooperCycle, looperLoopDurationMs);
}

function stopLooperPlayback() {
  clearLooperTimers();
  stopLooperVoices();
  looperState = looperEvents.length ? "ready" : "idle";
  updateLooperButton();
  draw();
}

function clearLooper() {
  clearLooperTimers();
  stopLooperVoices();
  looperEvents = [];
  looperLoopDurationMs = 0;
  looperState = "idle";
  updateLooperButton();
  draw();
}

function buildLattice() {
  const result = [];
  const cols = GRID_COLS;
  const rows = GRID_ROWS;
  const spacing = GRID_SPACING;
  let id = 0;
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const ratioX = Number(ratioXSelect.value) || 3;
  const ratioY = Number(ratioYSelect.value) || 5;
  const ratioZ = Number(ratioZSelect.value) || 7;
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  const depth = is3DMode || isFlattened2D ? GRID_DEPTH : 1;
  gridDepth = depth;
  gridCenterZ = Math.floor(depth / 2);

  for (let z = 0; z < depth; z += 1) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const exponentX = x - centerX;
        const exponentY = centerY - y;
        const exponentZ = gridCenterZ - z;
        const baseRatio = buildRatioComponents(
          ratioX,
          ratioY,
          ratioZ,
          exponentX,
          exponentY,
          exponentZ
        );
        const reduced = reduceToOctave(baseRatio.numerator, baseRatio.denominator);
        const etInfo = getNearestEtInfo(fundamental * reduced.ratio, a4);
        const isCenter = exponentX === 0 && exponentY === 0 && exponentZ === 0;
        result.push({
          id: id++,
          numerator: reduced.numerator,
          denominator: reduced.denominator,
          exponentX,
          exponentY,
          exponentZ,
          gridX: x,
          gridY: y,
          gridZ: z,
          coordinate: {
            x: (x - centerX) * spacing,
            y: (y - centerY) * spacing,
            z: (z - gridCenterZ) * spacing,
          },
          freq: fundamental * reduced.ratio,
          cents_from_et: etInfo.cents,
          note_name: etInfo.name,
          pitch_class: etInfo.pitchClass,
          active: isCenter,
          isCenter,
          baseVoiceId: null,
        });
      }
    }
  }

  return result;
}

function updateNodeFrequencies() {
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  nodes.forEach((node) => {
    const ratio = node.numerator / node.denominator;
    node.freq = fundamental * ratio;
    const etInfo = getNearestEtInfo(node.freq, a4);
    node.cents_from_et = etInfo.cents;
    node.note_name = etInfo.name;
    node.pitch_class = etInfo.pitchClass;
  });
  updatePitchInstances();
  updateVoiceFrequencies();
  draw();
  schedulePresetUrlUpdate();
}

function updateNodeRatios() {
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const ratioX = Number(ratioXSelect.value) || 3;
  const ratioY = Number(ratioYSelect.value) || 5;
  const ratioZ = Number(ratioZSelect.value) || 7;

  nodes.forEach((node) => {
    const baseRatio = buildRatioComponents(
      ratioX,
      ratioY,
      ratioZ,
      node.exponentX,
      node.exponentY,
      node.exponentZ || 0
    );
    const reduced = reduceToOctave(baseRatio.numerator, baseRatio.denominator);
    node.numerator = reduced.numerator;
    node.denominator = reduced.denominator;
    node.freq = fundamental * reduced.ratio;
    const etInfo = getNearestEtInfo(node.freq, a4);
    node.cents_from_et = etInfo.cents;
    node.note_name = etInfo.name;
    node.pitch_class = etInfo.pitchClass;
  });

  updatePitchInstances();
  updateVoiceFrequencies();
  draw();
  schedulePresetUrlUpdate();
}

function updateVoiceFrequencies() {
  const fundamental = Number(fundamentalInput.value) || 220;
  voices.forEach((voice) => {
    const node = nodes.find((item) => item.id === voice.nodeId);
    if (!node || !voice.oscillator) {
      return;
    }
    const baseRatio = node.numerator / node.denominator;
    const freq = fundamental * baseRatio * Math.pow(2, voice.octave);
    voice.freq = freq;
    voice.oscillator.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.01);
  });
}

function getKeyboardMode() {
  return keyboardModeSelect ? keyboardModeSelect.value : "off";
}

function findNearestNodeByFrequency(targetFreq) {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  nodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    const distance = Math.abs(1200 * Math.log2(node.freq / targetFreq));
    if (distance < bestDistance) {
      best = node;
      bestDistance = distance;
    }
  });

  return best;
}

function findNodeForMidi(targetMidi, a4) {
  const targetPitchClass = noteNames[targetMidi % 12];
  let best = null;
  let bestCents = Number.POSITIVE_INFINITY;

  nodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    if (node.pitch_class !== targetPitchClass) {
      return;
    }
    const cents = Math.abs(node.cents_from_et);
    if (cents < bestCents) {
      best = node;
      bestCents = cents;
    }
  });

  if (best) {
    return best;
  }

  const targetFreq = midiToFrequency(targetMidi, a4);
  return findNearestNodeByFrequency(targetFreq);
}

function findNodeByGrid(gridX, gridY) {
  return nodes.find((node) => node.gridX === gridX && node.gridY === gridY) || null;
}

function updatePitchInstances() {
  const fundamental = Number(fundamentalInput.value) || 220;
  pitchInstances = [];

  nodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    const baseRatio = node.numerator / node.denominator;
    let freq = fundamental * baseRatio;
    let octave = 0;
    while (freq / 2 >= MIN_FREQ) {
      freq /= 2;
      octave -= 1;
    }
    while (freq <= MAX_FREQ) {
      pitchInstances.push({
        nodeId: node.id,
        ratio: baseRatio,
        octave,
        freq,
      });
      freq *= 2;
      octave += 1;
    }
  });

  pitchInstances.sort((a, b) => a.freq - b.freq);
}

function findNearestPitchInstance(targetFreq) {
  if (!pitchInstances.length) {
    return null;
  }
  let best = pitchInstances[0];
  let bestDistance = Math.abs(Math.log2(best.freq / targetFreq));
  for (let i = 1; i < pitchInstances.length; i += 1) {
    const candidate = pitchInstances[i];
    const distance = Math.abs(Math.log2(candidate.freq / targetFreq));
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

function getVoiceBaseEnvelope(voice, nowSec) {
  if (!voice || voice.startTimeSec == null) {
    return 0;
  }
  const elapsed = nowSec - voice.startTimeSec;
  if (elapsed <= 0) {
    return 0;
  }
  const attack = voice.envAttackSec || 0;
  const decay = voice.envDecaySec || 0;
  const sustain = Math.max(0, Math.min(1, Number(voice.envSustain) || 0));
  const peakGain = voice.peakGain || 0;
  if (attack > 0 && elapsed < attack) {
    return (elapsed / attack) * peakGain;
  }
  const afterAttack = elapsed - attack;
  if (decay > 0 && afterAttack < decay) {
    const from = peakGain;
    const to = peakGain * sustain;
    return from + (to - from) * (afterAttack / decay);
  }
  return peakGain * sustain;
}

function getVoiceEnvelopeLevel(voice, nowSec) {
  const base = getVoiceBaseEnvelope(voice, nowSec);
  if (voice.releaseStartSec == null || voice.releaseDurationSec == null) {
    return base;
  }
  if (nowSec < voice.releaseStartSec) {
    return base;
  }
  const releaseElapsed = nowSec - voice.releaseStartSec;
  if (releaseElapsed >= voice.releaseDurationSec) {
    return 0;
  }
  const startLevel = voice.releaseStartLevel ?? base;
  return Math.max(0, startLevel * (1 - releaseElapsed / voice.releaseDurationSec));
}

function getVoiceAmplitude(voice, nowSec, nowMs) {
  if (!voice) {
    return 0;
  }
  const envLevel = getVoiceEnvelopeLevel(voice, nowSec);
  if (envLevel <= 0) {
    return 0;
  }
  let lfoLevel = 1;
  if (voice.lfoActive) {
    lfoLevel = getLfoGainValue(voice, nowMs);
  } else if (voice.source === "lfo-sequence") {
    lfoLevel = getSequenceLfoValue(voice, nowSec);
  }
  const masterLevel = masterGain ? Number(masterGain.gain.value) || 0 : 1;
  const normalized = (envLevel / 0.2) * lfoLevel * masterLevel;
  return Math.max(0, normalized);
}

function getNodeAmplitudeMap(nowSec, nowMs) {
  const amps = new Map();
  voices.forEach((voice) => {
    const amp = getVoiceAmplitude(voice, nowSec, nowMs);
    if (amp <= 0) {
      return;
    }
    const sum = (amps.get(voice.nodeId) || 0) + amp;
    amps.set(voice.nodeId, sum);
  });
  return amps;
}

function removeVoiceById(voiceId) {
  voices = voices.filter((voice) => voice.id !== voiceId);
  nodes.forEach((node) => {
    if (node.baseVoiceId === voiceId) {
      node.baseVoiceId = null;
    }
  });
}

function findVoiceById(voiceId) {
  return voices.find((voice) => voice.id === voiceId) || null;
}

function computeRowBandThreshold(values) {
  if (values.length < 2) {
    return Math.max(14, GRID_SPACING * view.zoom * 0.35);
  }
  const sorted = [...values].sort((a, b) => a - b);
  const diffs = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const diff = sorted[i] - sorted[i - 1];
    if (diff > 0) {
      diffs.push(diff);
    }
  }
  if (!diffs.length) {
    return Math.max(14, GRID_SPACING * view.zoom * 0.35);
  }
  diffs.sort((a, b) => a - b);
  const median = diffs[Math.floor(diffs.length / 2)];
  return Math.max(14, median * 0.6);
}

function getScreenAxisDir() {
  const origin = projectPoint({ x: 0, y: 0, z: 0 });
  const xAxis = projectPoint({ x: GRID_SPACING, y: 0, z: 0 });
  const yAxis = projectPoint({ x: 0, y: GRID_SPACING, z: 0 });
  const xVec = {
    x: (xAxis.x - origin.x) * view.zoom,
    y: (xAxis.y - origin.y) * view.zoom,
  };
  const yVec = {
    x: (yAxis.x - origin.x) * view.zoom,
    y: (yAxis.y - origin.y) * view.zoom,
  };
  const xScore = Math.abs(xVec.x);
  const yScore = Math.abs(yVec.x);
  const useXAxis = xScore >= yScore;
  let raw = useXAxis ? xVec : yVec;
  const length = Math.hypot(raw.x, raw.y) || 1;
  let dir = { x: raw.x / length, y: raw.y / length };
  if (dir.x < 0) {
    dir = { x: -dir.x, y: -dir.y };
  }
  return { dir, perp: { x: -dir.y, y: dir.x }, axis: useXAxis ? "x" : "y" };
}

function buildScreenIsomorphicLayout() {
  const activeNodes = nodes.filter((node) => node.active);
  if (!activeNodes.length) {
    return new Map();
  }

  const projected = activeNodes.map((node) => {
    const pos = worldToScreen(node.coordinate);
    return { node, x: pos.x, y: pos.y };
  });

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  projected.forEach((item) => {
    minX = Math.min(minX, item.x);
    maxX = Math.max(maxX, item.x);
    minY = Math.min(minY, item.y);
    maxY = Math.max(maxY, item.y);
  });
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const items = projected.map((item) => ({
    ...item,
    uNorm: (item.x - minX) / spanX,
    vNorm: (item.y - minY) / spanY,
  }));

  const rowThreshold = (() => {
    const values = items.map((item) => item.vNorm);
    if (values.length < 2) {
      return 0.15;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const diffs = [];
    for (let i = 1; i < sorted.length; i += 1) {
      const diff = sorted[i] - sorted[i - 1];
      if (diff > 0) {
        diffs.push(diff);
      }
    }
    if (!diffs.length) {
      return 0.15;
    }
    diffs.sort((a, b) => a - b);
    const median = diffs[Math.floor(diffs.length / 2)];
    return Math.max(0.08, median * 0.6);
  })();
  const minRowGapNorm = Math.max(0.08, 32 / spanY);
  const minColGapNorm = Math.max(0.08, 32 / spanX);

  const rows = [];
  const sortedByV = [...items].sort((a, b) => a.vNorm - b.vNorm);
  const updateRowStats = (row, item) => {
    const gridY = item.node.gridY;
    row.items.push(item);
    row.centerV = (row.centerV * (row.items.length - 1) + item.vNorm) / row.items.length;
    const nextCount = (row.gridYCounts.get(gridY) || 0) + 1;
    row.gridYCounts.set(gridY, nextCount);
    if (row.dominantGridY == null || nextCount > row.gridYCounts.get(row.dominantGridY)) {
      row.dominantGridY = gridY;
    }
  };

  sortedByV.forEach((item) => {
    const last = rows[rows.length - 1];
    if (!last) {
      rows.push({
        centerV: item.vNorm,
        items: [item],
        gridYCounts: new Map([[item.node.gridY, 1]]),
        dominantGridY: item.node.gridY,
      });
      return;
    }
    const gap = Math.abs(item.vNorm - last.centerV);
    const prefersRow = item.node.gridY === last.dominantGridY;
    const threshold = Math.max(minRowGapNorm, prefersRow ? rowThreshold * 1.6 : rowThreshold);
    if (gap > threshold) {
      rows.push({
        centerV: item.vNorm,
        items: [item],
        gridYCounts: new Map([[item.node.gridY, 1]]),
        dominantGridY: item.node.gridY,
      });
      return;
    }
    updateRowStats(last, item);
  });

  const maxRows = ISOMORPHIC_ROWS.length;
  if (rows.length > maxRows) {
    while (rows.length > maxRows) {
      let closest = null;
      for (let i = 0; i < rows.length - 1; i += 1) {
        const gap = Math.abs(rows[i + 1].centerV - rows[i].centerV);
        if (!closest || gap < closest.gap) {
          closest = { index: i, gap };
        }
      }
      if (!closest) {
        break;
      }
      const rowA = rows[closest.index];
      const rowB = rows[closest.index + 1];
      const mergedItems = rowA.items.concat(rowB.items);
      const centerV =
        mergedItems.reduce((sum, item) => sum + item.vNorm, 0) / mergedItems.length;
      const gridYCounts = new Map(rowA.gridYCounts);
      rowB.gridYCounts.forEach((count, key) => {
        gridYCounts.set(key, (gridYCounts.get(key) || 0) + count);
      });
      let dominantGridY = null;
      gridYCounts.forEach((count, key) => {
        if (dominantGridY == null || count > gridYCounts.get(dominantGridY)) {
          dominantGridY = key;
        }
      });
      rows.splice(closest.index, 2, {
        centerV,
        items: mergedItems,
        gridYCounts,
        dominantGridY,
      });
    }
  }

  const countClusters = (values, minGap) => {
    if (!values.length) {
      return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    if (sorted.length === 1) {
      return 1;
    }
    const diffs = [];
    for (let i = 1; i < sorted.length; i += 1) {
      const diff = sorted[i] - sorted[i - 1];
      if (diff > 0) {
        diffs.push(diff);
      }
    }
    if (!diffs.length) {
      return 1;
    }
    diffs.sort((a, b) => a - b);
    const median = diffs[Math.floor(diffs.length / 2)];
    const threshold = Math.max(minGap, median * 0.6);
    let count = 1;
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i] - sorted[i - 1] > threshold) {
        count += 1;
      }
    }
    return count;
  };

  const computeVisualExtraColumns = (values, minGap) => {
    if (values.length < 2) {
      return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < sorted.length; i += 1) {
      const diff = sorted[i] - sorted[i - 1];
      if (diff >= minGap) {
        gaps.push(diff);
      }
    }
    if (!gaps.length) {
      return 0;
    }
    gaps.sort((a, b) => a - b);
    const median = gaps[Math.floor(gaps.length / 2)];
    const maxGap = gaps[gaps.length - 1];
    if (median <= 0) {
      return 0;
    }
    const ratio = maxGap / median;
    if (ratio < 1.6) {
      return 0;
    }
    return Math.min(6, Math.floor(ratio) - 1);
  };

  let columnsNeeded = 1;
  rows.forEach((row) => {
    const uValues = row.items.map((item) => item.uNorm);
    const sortedU = [...uValues].sort((a, b) => a - b);
    let minU = sortedU[0] ?? 0;
    let maxU = sortedU[sortedU.length - 1] ?? 0;
    let medianGap = 0;
    if (sortedU.length > 1) {
      const gaps = [];
      for (let i = 1; i < sortedU.length; i += 1) {
        const gap = sortedU[i] - sortedU[i - 1];
        if (gap > 0) {
          gaps.push(gap);
        }
      }
      gaps.sort((a, b) => a - b);
      medianGap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0;
    }
    const baseColumns = countClusters(uValues, minColGapNorm);
    const extraColumns = computeVisualExtraColumns(uValues, minColGapNorm);
    const span = Math.max(0, maxU - minU);
    const gapSize = Math.max(minColGapNorm, medianGap || minColGapNorm);
    const minColsForSpan = sortedU.length
      ? 1 + Math.ceil(span / gapSize)
      : 1;
    columnsNeeded = Math.max(
      columnsNeeded,
      baseColumns + extraColumns,
      minColsForSpan
    );
  });

  const getKeyboardRowsForCount = (count) => {
    if (count <= 1) {
      return [ISOMORPHIC_ROWS[2]];
    }
    if (count === 2) {
      return [ISOMORPHIC_ROWS[1], ISOMORPHIC_ROWS[2]];
    }
    if (count === 3) {
      return [ISOMORPHIC_ROWS[1], ISOMORPHIC_ROWS[2], ISOMORPHIC_ROWS[3]];
    }
    return ISOMORPHIC_ROWS;
  };

  const buildLayoutForConfig = (rowCount, columnsTarget) => {
    const keyboardRows = getKeyboardRowsForCount(rowCount);
    const keyboardSkews = keyboardRows.map((row) => {
      const index = ISOMORPHIC_ROWS.indexOf(row);
      return KEYBOARD_ROW_SKEW[index] || 0;
    });
    const maxRowKeys = Math.max(...keyboardRows.map((row) => row.keys.length));
    const columns = Math.max(1, Math.min(columnsTarget, maxRowKeys));

    const rowMeta = keyboardRows.map((row, rowIndex) => {
      const rowColumns = Math.min(columns, row.keys.length);
      const startIndex = Math.max(0, Math.floor((row.keys.length - rowColumns) / 2));
      const rowStart = keyboardSkews[rowIndex] + startIndex;
      const rowEnd = rowStart + rowColumns - 1;
      return {
        row,
        columns: rowColumns,
        startIndex,
        rowStart,
        rowEnd,
        centerV: rows[rowIndex]
          ? rows[rowIndex].centerV
          : rowIndex / Math.max(1, rows.length - 1),
      };
    });
    const minStart = Math.min(...rowMeta.map((meta) => meta.rowStart));
    const maxEnd = Math.max(...rowMeta.map((meta) => meta.rowEnd));
    const keySpan = Math.max(1, maxEnd - minStart);

    const layout = new Map();
    rows.forEach((rowGroup, rowIndex) => {
      const meta = rowMeta[rowIndex];
      if (!meta) {
        return;
      }
      rowGroup.items.forEach((item) => {
        const uKey = minStart + item.uNorm * keySpan;
        const rawIndex = uKey - meta.rowStart;
        const keyIndex = clamp(
          Math.floor(rawIndex + 0.5 - 1e-6),
          0,
          meta.columns - 1
        );
        const key = meta.row.keys[meta.startIndex + keyIndex];
        const keyCenterU = (meta.rowStart + keyIndex - minStart) / keySpan;
        const keyCenterV = meta.centerV;
        const dist =
          Math.pow(item.uNorm - keyCenterU, 2) + Math.pow(item.vNorm - keyCenterV, 2);
        const existing = layout.get(key);
        if (!existing || dist < existing.dist) {
          layout.set(key, { node: item.node, dist });
        }
      });
    });
    const mappedNodes = new Set();
    layout.forEach((value) => {
      mappedNodes.add(value.node.id);
    });
    return {
      layout,
      mappedCount: mappedNodes.size,
      maxRowKeys,
    };
  };

  let best = { layout: new Map(), mappedCount: 0 };
  let foundAll = false;
  for (let rowCount = rows.length; rowCount <= maxRows; rowCount += 1) {
    const maxRowKeys = Math.max(
      ...getKeyboardRowsForCount(rowCount).map((row) => row.keys.length)
    );
    const startColumns = Math.max(1, Math.min(columnsNeeded, maxRowKeys));
    for (let columns = startColumns; columns <= maxRowKeys; columns += 1) {
      const candidate = buildLayoutForConfig(rowCount, columns);
      if (candidate.mappedCount > best.mappedCount) {
        best = { layout: candidate.layout, mappedCount: candidate.mappedCount };
      }
      if (candidate.mappedCount === items.length) {
        best = { layout: candidate.layout, mappedCount: candidate.mappedCount };
        foundAll = true;
        break;
      }
    }
    if (foundAll) {
      break;
    }
  }

  const result = new Map();
  best.layout.forEach((value, key) => {
    result.set(key, value.node);
  });

  return result;
}

function drawKeyBanner(pos, radius, label, alpha) {
  const paddingX = 6;
  const paddingY = 3;
  const fontSize = 11;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(label);
  const textWidth = metrics.width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = fontSize + paddingY * 2;
  const x = pos.x - boxWidth / 2;
  const y = pos.y - radius - boxHeight - 3;
  ctx.fillStyle = "rgba(10, 15, 20, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, pos.x, y + boxHeight / 2);
  ctx.restore();
}

function findIsomorphicNodeForKey(key) {
  ensureIsomorphicMaps();
  return isomorphicLayout.get(key) || null;
}

function getKeyboardKeyPositions() {
  if (keyboardKeyPositions) {
    return keyboardKeyPositions;
  }
  const positions = new Map();
  ISOMORPHIC_ROWS.forEach((row, rowIndex) => {
    const skew = KEYBOARD_ROW_SKEW[rowIndex] || 0;
    row.keys.split("").forEach((key, colIndex) => {
      positions.set(key, { x: colIndex + skew, y: rowIndex });
    });
  });
  keyboardKeyPositions = positions;
  return positions;
}

function findNearestIsomorphicNodeForKey(key) {
  const target = getKeyboardKeyPositions().get(key);
  if (!target) {
    return null;
  }
  ensureIsomorphicMaps();
  if (!isomorphicLayout) {
    return null;
  }
  let bestNode = null;
  let bestDist = Number.POSITIVE_INFINITY;
  let bestX = Number.POSITIVE_INFINITY;
  const positions = getKeyboardKeyPositions();
  isomorphicLayout.forEach((node, layoutKey) => {
    if (!node || !node.active) {
      return;
    }
    const pos = positions.get(layoutKey);
    if (!pos) {
      return;
    }
    const dx = pos.x - target.x;
    const dy = pos.y - target.y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist - 1e-6 || (Math.abs(dist - bestDist) < 1e-6 && pos.x < bestX)) {
      bestDist = dist;
      bestNode = node;
      bestX = pos.x;
    }
  });
  return bestNode;
}

function ensureIsomorphicMaps() {
  if (!isomorphicDirty && isomorphicLayout && isomorphicKeyMap) {
    return;
  }
  const layout = buildScreenIsomorphicLayout();
  const keyMap = new Map();
  layout.forEach((node, layoutKey) => {
    if (node && node.active) {
      keyMap.set(node.id, layoutKey.toUpperCase());
    }
  });
  isomorphicLayout = layout;
  isomorphicKeyMap = keyMap;
  isomorphicDirty = false;
}

function handleKeyDown(event) {
  const mode = getKeyboardMode();
  if (mode === "off") {
    return;
  }

  const tag = event.target.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
    return;
  }

  const key = event.key.toLowerCase();
  if (activeKeys.has(key)) {
    return;
  }

  const a4 = Number(a4Input.value) || 440;
  let voice = null;

  if (mode === "piano") {
    if (!(key in KEYBOARD_MAP)) {
      return;
    }
    const semitone = KEYBOARD_MAP[key];
    const targetMidi = KEYBOARD_BASE_MIDI + semitone;
    const targetFreq = midiToFrequency(targetMidi, a4);
    const instance = findNearestPitchInstance(targetFreq);
    if (!instance) {
      return;
    }
    voice = startVoice({
      nodeId: instance.nodeId,
      octave: instance.octave,
      freq: instance.freq,
      source: "keyboard",
    });
  } else if (mode === "iso" || mode === "iso-fuzzy") {
    const node = findIsomorphicNodeForKey(key);
    const resolved =
      node || (mode === "iso-fuzzy" ? findNearestIsomorphicNodeForKey(key) : null);
    if (!resolved || !resolved.active) {
      return;
    }
    voice = startVoice({
      nodeId: resolved.id,
      octave: 0,
      freq: resolved.freq,
      source: "keyboard",
    });
  }

  if (!voice) {
    return;
  }

  activeKeys.set(key, voice.id);
  draw();
}

function handleKeyUp(event) {
  const mode = getKeyboardMode();
  if (mode === "off") {
    return;
  }

  const key = event.key.toLowerCase();
  const voiceId = activeKeys.get(key);
  if (voiceId == null) {
    return;
  }

  const voice = findVoiceById(voiceId);
  activeKeys.delete(key);
  const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
  if (isOneShot) {
    return;
  }
  stopVoice(voice);
  draw();
}

function buildEdges(nodesList, cols, rows, depth) {
  const lookup = new Map(
    nodesList.map((node) => [`${node.gridX},${node.gridY},${node.gridZ || 0}`, node])
  );
  const edgesList = [];

  nodesList.forEach((node) => {
    const x = node.gridX;
    const y = node.gridY;
    const z = node.gridZ || 0;
    const right = lookup.get(`${x + 1},${y},${z}`);
    const down = lookup.get(`${x},${y + 1},${z}`);
    const forward = lookup.get(`${x},${y},${z + 1}`);

    if (right && x < cols - 1) {
      edgesList.push([node, right]);
    }

    if (down && y < rows - 1) {
      edgesList.push([node, down]);
    }

    if (forward && z < depth - 1) {
      edgesList.push([node, forward]);
    }
  });

  return edgesList;
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

function buildRatioComponents(ratioX, ratioY, ratioZ, exponentX, exponentY, exponentZ) {
  let numerator = 1;
  let denominator = 1;

  if (exponentX >= 0) {
    numerator *= Math.pow(ratioX, exponentX);
  } else {
    denominator *= Math.pow(ratioX, Math.abs(exponentX));
  }

  if (exponentY >= 0) {
    numerator *= Math.pow(ratioY, exponentY);
  } else {
    denominator *= Math.pow(ratioY, Math.abs(exponentY));
  }

  if (exponentZ >= 0) {
    numerator *= Math.pow(ratioZ, exponentZ);
  } else {
    denominator *= Math.pow(ratioZ, Math.abs(exponentZ));
  }

  return { numerator, denominator };
}

function getNearestEtInfo(freq, a4) {
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midi = Math.min(127, Math.max(0, Math.round(midiFloat)));
  const etFreq = a4 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / etFreq);
  const pitchClass = noteNames[midi % 12];
  const name = `${pitchClass}${Math.floor(midi / 12) - 1}`;
  return { midi, etFreq, cents, name, pitchClass };
}

function getNodeRadius(node) {
  return node.active ? 35 : 32;
}

function midiToNoteName(midi) {
  return `${noteNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function midiToFrequency(midi, a4) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

function populateFundamentalNotes() {
  const startMidi = 0;
  const endMidi = 96;
  fundamentalNoteSelect.innerHTML = "";
  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    const option = document.createElement("option");
    option.value = String(midi);
    option.textContent = midiToNoteName(midi);
    fundamentalNoteSelect.appendChild(option);
  }
}

function updateFundamentalNotes() {
  const a4 = Number(a4Input.value) || 440;
  const selectedMidi = Number(fundamentalNoteSelect.value || 0);
  Array.from(fundamentalNoteSelect.options).forEach((option) => {
    const midi = Number(option.value);
    const freq = midiToFrequency(midi, a4);
    option.textContent = `${midiToNoteName(midi)} (${freq.toFixed(2)} Hz)`;
  });
  fundamentalNoteSelect.value = String(selectedMidi);
}

function populateWaveformOptions() {
  if (!waveformSelect) {
    return;
  }
  const selected = waveformSelect.value || "sine";
  waveformSelect.innerHTML = "";
  const extras = customOscillatorTypes
    ? customOscillatorTypes.filter((type) => !BUILTIN_WAVEFORMS.includes(type))
    : [];
  const waveforms = [...BUILTIN_WAVEFORMS, ...extras];
  waveforms.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    waveformSelect.appendChild(option);
  });
  waveformSelect.value = waveforms.includes(selected) ? selected : "sine";
}

function onFundamentalNoteChange() {
  const midi = Number(fundamentalNoteSelect.value);
  const a4 = Number(a4Input.value) || 440;
  const freq = midiToFrequency(midi, a4);
  fundamentalInput.value = freq.toFixed(2);
  updateNodeFrequencies();
}

function projectPoint(point, disableScale = false) {
  if (!is3DMode && !isFlattened2D) {
    return { x: point.x, y: point.y, depth: 0, scale: 1 };
  }
  const cosY = Math.cos(view.rotY);
  const sinY = Math.sin(view.rotY);
  const cosX = Math.cos(view.rotX);
  const sinX = Math.sin(view.rotX);

  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;
  const y1 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  const scaleRaw = disableScale ? 1 : 1 / (1 + z2 * 0.002);
  const scale = disableScale ? 1 : Math.max(0.15, scaleRaw);
  return { x: x1 * scale, y: y1 * scale, depth: z2, scale };
}

function projectPointWithAngles(point, rotX, rotY, disableScale = false) {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);

  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;
  const y1 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  const scaleRaw = disableScale ? 1 : 1 / (1 + z2 * 0.002);
  const scale = disableScale ? 1 : Math.max(0.15, scaleRaw);
  return { x: x1 * scale, y: y1 * scale, depth: z2, scale };
}

function worldToScreen(point, disableScale = false) {
  const projected = projectPoint(point, disableScale);
  return {
    x: (projected.x + view.offsetX) * view.zoom + canvas.clientWidth / 2,
    y: (projected.y + view.offsetY) * view.zoom + canvas.clientHeight / 2,
    depth: projected.depth,
    scale: projected.scale,
  };
}

function screenToWorld(point) {
  return {
    x: (point.x - canvas.clientWidth / 2) / view.zoom - view.offsetX,
    y: (point.y - canvas.clientHeight / 2) / view.zoom - view.offsetY,
  };
}

const AXIS_EDGE_COLORS = {
  x: "rgba(59, 130, 246, 0.5)",
  y: "rgba(239, 68, 68, 0.5)",
  z: "rgba(16, 185, 129, 0.5)",
};
const LIGHT_DIR = { x: -0.6, y: -0.8 };

function draw3DEdges() {

  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    const start = worldToScreen(a.coordinate);
    const end = worldToScreen(b.coordinate);
    const radiusA = getNodeRadius(a) * (start.scale || 1);
    const radiusB = getNodeRadius(b) * (end.scale || 1);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const edgeStart = {
      x: start.x + ux * radiusA,
      y: start.y + uy * radiusA,
    };
    const edgeEnd = {
      x: end.x - ux * radiusB,
      y: end.y - uy * radiusB,
    };
    let color = AXIS_EDGE_COLORS.x;
    if (a.gridY !== b.gridY) {
      color = AXIS_EDGE_COLORS.y;
    } else if (a.gridZ !== b.gridZ) {
      color = AXIS_EDGE_COLORS.z;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(edgeStart.x, edgeStart.y);
    ctx.lineTo(edgeEnd.x, edgeEnd.y);
    ctx.stroke();
  });
}

function getSphereFill(pos, radius, baseFill, shadowColor) {
  const lx = pos.x + LIGHT_DIR.x * radius * 0.7;
  const ly = pos.y + LIGHT_DIR.y * radius * 0.7;
  const gradient = ctx.createRadialGradient(lx, ly, radius * 0.2, pos.x, pos.y, radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.35)");
  gradient.addColorStop(0.45, baseFill);
  gradient.addColorStop(1, shadowColor);
  return gradient;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!themeColors) {
    refreshThemeColors();
  }

  if (is3DMode && showGrid) {
    drawGrid();
  }

  if (is3DMode && (showAxes || (zModeActive && isAddMode))) {
    drawAxes();
  }

  if (is3DMode) {
    draw3DEdges();
  } else {
    ctx.strokeStyle = themeColors.edge;
    ctx.lineWidth = 1.5;
    edges.forEach(([a, b]) => {
      if (!a.active || !b.active) {
        return;
      }
      const start = worldToScreen(a.coordinate);
      const end = worldToScreen(b.coordinate);
      const radiusA = getNodeRadius(a) * (start.scale || 1);
      const radiusB = getNodeRadius(b) * (end.scale || 1);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) {
        return;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const edgeStart = {
        x: start.x + ux * radiusA,
        y: start.y + uy * radiusA,
      };
      const edgeEnd = {
        x: end.x - ux * radiusB,
        y: end.y - uy * radiusB,
      };
      ctx.beginPath();
      ctx.moveTo(edgeStart.x, edgeStart.y);
      ctx.lineTo(edgeEnd.x, edgeEnd.y);
      ctx.stroke();
    });
  }

  const nodeRenderList = nodes
    .map((node) => ({ node, pos: worldToScreen(node.coordinate) }))
    .sort((a, b) => a.pos.depth - b.pos.depth);
  const nowMs = performance.now();
  const nowSec = audioCtx ? audioCtx.currentTime : nowMs / 1000;
  const nodeAmplitudes = getNodeAmplitudeMap(nowSec, nowMs);

  const keyboardMode = getKeyboardMode();
  const isIsomorphicMode = keyboardMode === "iso" || keyboardMode === "iso-fuzzy";
  if (isIsomorphicMode) {
    ensureIsomorphicMaps();
  }
  const keyMap = isIsomorphicMode ? isomorphicKeyMap : null;

  nodeRenderList.forEach(({ node, pos }) => {
    const isHovered = node.id === hoverNodeId;
    const canShowInactive = isInactiveNodeAvailable(node);
    const canInteractInactive = !is3DMode || isAddMode;
    const amplitude = nodeAmplitudes.get(node.id) || 0;
    const brightness = 1 - Math.exp(-amplitude * 1.5);
    const isVisible =
      node.isCenter ||
      node.active ||
      brightness > 0.01 ||
      (isHovered && canShowInactive && canInteractInactive);
    let alpha = node.active || node.isCenter ? 1 : isHovered ? 0.3 : 0;
    if (zModeActive && zModeAnchor) {
      const inZLine = node.gridX === zModeAnchor.x && node.gridY === zModeAnchor.y;
      if (!inZLine) {
        alpha *= 0.3;
      }
    }

    if (!isVisible) {
      return;
    }

    const radius = getNodeRadius(node) * (pos.scale || 1);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.strokeStyle = themeColors.nodeStroke;
    ctx.lineWidth = 2;
    if (is3DMode) {
      const baseFill = brightness > 0 ? themeColors.playFill : "rgba(255, 255, 255, 0.02)";
      const shadowColor = brightness > 0
        ? "rgba(243, 214, 77, 0.55)"
        : "rgba(0, 0, 0, 0.22)";
      if (brightness > 0) {
        ctx.shadowColor = themeColors.lfo;
        ctx.shadowBlur = Math.max(6, radius * 0.6);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      ctx.fillStyle = getSphereFill(pos, radius, baseFill, shadowColor);
    } else {
      ctx.fillStyle = brightness > 0 ? themeColors.playFill : "transparent";
    }
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    if (brightness > 0) {
      ctx.save();
      ctx.globalAlpha *= brightness;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fill();
    }
    if (is3DMode && brightness > 0) {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
    ctx.stroke();

    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = "21px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${node.numerator}:${node.denominator}`, pos.x, pos.y);

    ctx.font = "11px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = themeColors.textSecondary;
    const cents = Math.round(node.cents_from_et);
    const centsLabel = `${cents >= 0 ? "+" : ""}${cents}¢`;
    ctx.fillText(`${node.note_name} ${centsLabel}`, pos.x + radius + 6, pos.y + radius - 10);

    if (keyMap && node.active) {
      const keyLabel = keyMap.get(node.id);
      if (keyLabel) {
        if (is3DMode) {
          drawKeyBanner(pos, radius, keyLabel, alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = '11px "Courier New", monospace';
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillStyle = themeColors.textSecondary;
          ctx.fillText(keyLabel, pos.x - radius - 3, pos.y - radius - 3);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  });

  updateZModeMessage();

  updateRatioWheels();
}

function startVoice(options) {
  if (!audioCtx || !masterGain) {
    return null;
  }

  if (audioCtx.state !== "running") {
    return null;
  }

  const now = audioCtx.currentTime;
  const velocity = Math.max(0, Math.min(1, Number(options.velocity ?? 1)));
  const waveformType = waveformSelect.value || "sine";
  const oscillator = CUSTOM_WAVEFORMS.has(waveformType)
    ? customOscillators[waveformType](audioCtx)
    : audioCtx.createOscillator();
  const envGain = audioCtx.createGain();
  const lfoGain = audioCtx.createGain();

  if (!CUSTOM_WAVEFORMS.has(waveformType)) {
    oscillator.type = waveformType;
  }
  oscillator.frequency.value = options.freq;
  const isOneShot =
    Boolean(oneShotCheckbox && oneShotCheckbox.checked) && !options.ignoreOneShot;
  envGain.gain.setValueAtTime(0.0001, now);
  const attack = Number(attackSlider.value) || 0.02;
  const decay = Number(decaySlider.value) || 0.2;
  const sustain = Number(sustainSlider.value) || 0.6;
  const peakGain = Math.max(0.0001, 0.2 * velocity);
  envGain.gain.exponentialRampToValueAtTime(peakGain, now + attack);
  envGain.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, peakGain * sustain),
    now + attack + decay
  );

  const voice = {
    id: nextVoiceId++,
    nodeId: options.nodeId,
    octave: options.octave,
    freq: options.freq,
    oscillator,
    envGain,
    lfoGain,
    lfoActive: Boolean(options.lfoActive),
    releasing: false,
    startTimeSec: now,
    envAttackSec: attack,
    envDecaySec: decay,
    envSustain: sustain,
    envReleaseSec: Number(releaseSlider.value) || 0.6,
    peakGain,
    releaseStartSec: null,
    releaseDurationSec: null,
    releaseStartLevel: null,
    lfoHalfPeriod: options.lfoHalfPeriod || 0,
    lfoStartMs: options.lfoStartMs || 0,
    lfoCurve: Number.isFinite(options.lfoCurve) ? options.lfoCurve : 1,
    source: options.source || "keyboard",
    loopOffRecorded: false,
  };

  if (isOneShot) {
    const release = Number(releaseSlider.value) || 0.6;
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + release);
    voice.releaseStartSec = now + attack + decay;
    voice.releaseDurationSec = release;
    voice.releaseStartLevel = peakGain * sustain;
  }

  lfoGain.gain.value = voice.lfoActive ? getLfoGainValue(voice, performance.now()) : 1;
  oscillator.connect(envGain).connect(lfoGain).connect(masterGain);
  oscillator.start(now);
  oscillator.onended = () => {
    oscillator.disconnect();
    if (envGain) {
      envGain.disconnect();
    }
    if (lfoGain) {
      lfoGain.disconnect();
    }
    removeVoiceById(voice.id);
  };

  voices.push(voice);

  ensureLfoLoop();

  if (isOneShot) {
    const release = Number(releaseSlider.value) || 0.6;
    const stopAt = now + attack + decay + release + 0.05;
    oscillator.stop(stopAt);
  }

  if (looperState === "recording" && voice.source !== "looper") {
    const t = performance.now() - looperStartMs;
    looperEvents.push({ type: "on", nodeId: voice.nodeId, t, octave: voice.octave });
    looperLoopDurationMs = Math.max(looperLoopDurationMs, t);
    if (isOneShot) {
      const release = Number(releaseSlider.value) || 0.6;
      const offAt = t + (attack + decay + release) * 1000;
      looperEvents.push({
        type: "off",
        nodeId: voice.nodeId,
        t: offAt,
        octave: voice.octave,
      });
      looperLoopDurationMs = Math.max(looperLoopDurationMs, offAt);
      voice.loopOffRecorded = true;
    }
  }

  return voice;
}

function stopVoice(voice, immediate = false) {
  if (!voice || !voice.oscillator || !audioCtx) {
    return;
  }

  const osc = voice.oscillator;
  const envGain = voice.envGain;
  const lfoGain = voice.lfoGain;
  voice.oscillator = null;
  voice.releasing = true;
  voice.lfoActive = false;
  if (lfoGain) {
    lfoGain.gain.value = 1;
  }

  const now = audioCtx.currentTime;
  const release = immediate ? 0.02 : Number(releaseSlider.value) || 0.6;
  const baseLevel = getVoiceBaseEnvelope(voice, now);
  voice.releaseStartSec = now;
  voice.releaseDurationSec = release;
  voice.releaseStartLevel = baseLevel;
  ensureLfoLoop();
  if (envGain) {
    envGain.gain.cancelScheduledValues(now);
    envGain.gain.setValueAtTime(Math.max(envGain.gain.value, 0.0001), now);
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    osc.stop(now + release + 0.05);
  } else {
    osc.stop(now + 0.1);
  }

  if (looperState === "recording" && voice.source !== "looper" && !voice.loopOffRecorded) {
    const t = performance.now() - looperStartMs;
    looperEvents.push({ type: "off", nodeId: voice.nodeId, t, octave: voice.octave });
    looperLoopDurationMs = Math.max(looperLoopDurationMs, t);
    voice.loopOffRecorded = true;
  }

}

function stopVoicesForNode(nodeId, immediate = false) {
  voices.forEach((voice) => {
    if (voice.nodeId === nodeId) {
      stopVoice(voice, immediate);
    }
  });
}

function stopAllVoices() {
  const active = [...voices];
  active.forEach((voice) => stopVoice(voice, true));
}

function enableAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    updateVolume();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  audioToggle.textContent = "Disable Audio";
  audioToggle.classList.add("button-on");
}

function disableAudio() {
  if (!audioCtx) {
    return;
  }

  stopAllVoices();
  audioCtx.suspend();
  audioToggle.textContent = "Enable Audio";
  audioToggle.classList.remove("button-on");
}

function toggleAudio() {
  if (!audioCtx || audioCtx.state === "suspended") {
    enableAudio();
  } else {
    disableAudio();
  }
}

function enableAudioFromGesture() {
  if (audioCtx && audioCtx.state === "running") {
    return;
  }
  enableAudio();
  window.removeEventListener("pointerdown", enableAudioFromGesture);
  window.removeEventListener("keydown", enableAudioFromGesture);
}


function populateMidiChannels() {
  if (!midiChannelSelect) {
    return;
  }
  midiChannelSelect.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All";
  midiChannelSelect.appendChild(allOption);
  for (let channel = 0; channel < 16; channel += 1) {
    const option = document.createElement("option");
    option.value = String(channel);
    option.textContent = String(channel);
    midiChannelSelect.appendChild(option);
  }
}

function populateMidiPorts() {
  if (!midiPortSelect || !midiAccess) {
    return;
  }
  const current = midiPortSelect.value;
  midiPortSelect.innerHTML = "";
  const inputs = Array.from(midiAccess.inputs.values());
  if (!inputs.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No MIDI inputs";
    midiPortSelect.appendChild(option);
    return;
  }
  inputs.forEach((input) => {
    const option = document.createElement("option");
    option.value = input.id;
    option.textContent = input.name || `MIDI ${input.id}`;
    midiPortSelect.appendChild(option);
  });
  const nextValue = inputs.find((input) => input.id === current) ? current : inputs[0].id;
  midiPortSelect.value = nextValue;
  selectMidiInput(nextValue);
}

function handleMidiMessage(event) {
  if (!midiEnabled) {
    return;
  }
  const [status, data1, data2] = event.data;
  const command = status & 0xf0;
  const channel = status & 0x0f;
  if (midiChannelSelect && midiChannelSelect.value !== "all") {
    const selected = Number(midiChannelSelect.value);
    if (!Number.isNaN(selected) && channel !== selected) {
      return;
    }
  }
  if (!audioCtx || audioCtx.state !== "running") {
    enableAudio();
  }
  const velocity = data2 / 127;
  const key = `${channel}:${data1}`;
  if (command === 0x90 && data2 > 0) {
    const targetFreq = midiToFrequency(data1, Number(a4Input.value) || 440);
    const instance = findNearestPitchInstance(targetFreq);
    if (!instance) {
      return;
    }
    const voice = startVoice({
      nodeId: instance.nodeId,
      octave: instance.octave,
      freq: instance.freq,
      source: "midi",
      velocity,
    });
    if (voice) {
      midiActiveNotes.set(key, voice.id);
      draw();
    }
  } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
    const voiceId = midiActiveNotes.get(key);
    if (voiceId == null) {
      return;
    }
    const voice = findVoiceById(voiceId);
    midiActiveNotes.delete(key);
    stopVoice(voice);
    draw();
  }
}

function selectMidiInput(inputId) {
  if (!midiAccess) {
    return;
  }
  if (midiInput) {
    midiInput.onmidimessage = null;
  }
  const nextInput = Array.from(midiAccess.inputs.values()).find((input) => input.id === inputId);
  if (!nextInput) {
    midiInput = null;
    return;
  }
  midiInput = nextInput;
  midiInput.onmidimessage = handleMidiMessage;
}

async function initMidi() {
  if (!navigator.requestMIDIAccess) {
    alert("Web MIDI is not supported in this browser.");
    return;
  }
  try {
    midiAccess = await navigator.requestMIDIAccess();
    midiAccess.onstatechange = () => {
      populateMidiPorts();
    };
    populateMidiPorts();
    populateMidiChannels();
  } catch (error) {
    console.warn("MIDI access failed", error);
  }
}

function onPointerDown(event) {
  closeTopMenus();
  closeBottomMenus();
  const screenPoint = { x: event.offsetX, y: event.offsetY };
  const hit = hitTestScreen(screenPoint);
  const now = performance.now();

  if (event.shiftKey && hit) {
    const isDoubleTap = lastLfoTapId === hit.id && now - lastLfoTapTime < 320;
    lastLfoTapId = hit.id;
    lastLfoTapTime = now;
    if (isDoubleTap) {
      lfoArmingId = hit.id;
      lfoArmingStart = now;
      ensureLfoLoop();
      canvas.setPointerCapture(event.pointerId);
      draw();
      return;
    }
  }

  if (is3DMode) {
    if (event.shiftKey) {
      view.dragging = true;
      view.dragStart = { x: event.offsetX, y: event.offsetY };
      view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
    } else {
      view.rotating = true;
      view.rotateStart = { x: event.offsetX, y: event.offsetY };
      view.rotateAnglesStart = { x: view.rotX, y: view.rotY };
    }
    view.lastPointer = { x: event.offsetX, y: event.offsetY };
    canvas.setPointerCapture(event.pointerId);
    return;
  }

  view.dragging = true;
  view.dragStart = { x: event.offsetX, y: event.offsetY };
  view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  canvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (view.rotating) {
    const dx = event.offsetX - view.rotateStart.x;
    const dy = event.offsetY - view.rotateStart.y;
    view.rotY = view.rotateAnglesStart.y + dx * 0.005;
    view.rotX = view.rotateAnglesStart.x + dy * 0.005;
    view.rotX = Math.max(-1.2, Math.min(1.2, view.rotX));
    draw();
    markIsomorphicDirty();
    schedulePresetUrlUpdate();
    return;
  }
  if (!view.dragging) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    const nextHoverId = hit ? hit.id : null;
    if (nextHoverId !== hoverNodeId) {
      hoverNodeId = nextHoverId;
      draw();
    }
    return;
  }

  const dx = (event.offsetX - view.dragStart.x) / view.zoom;
  const dy = (event.offsetY - view.dragStart.y) / view.zoom;
  view.offsetX = view.dragOffsetStart.x + dx;
  view.offsetY = view.dragOffsetStart.y + dy;
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function onPointerUp(event) {
  const wasRotating = view.rotating;
  let moved = 0;
  if (view.rotating) {
    moved = Math.hypot(
      event.offsetX - view.rotateStart.x,
      event.offsetY - view.rotateStart.y
    );
    view.rotating = false;
    markIsomorphicDirty();
  }
  if (lfoArmingId != null) {
    const now = performance.now();
    const duration = (now - lfoArmingStart) / 1000;
    const node = nodes.find((item) => item.id === lfoArmingId);
    lfoArmingId = null;
    if (node && duration >= 0.15) {
      if (node.baseVoiceId) {
        const baseVoice = findVoiceById(node.baseVoiceId);
        if (baseVoice) {
          stopVoice(baseVoice, true);
        }
        node.baseVoiceId = null;
      }
      voices.forEach((voice) => {
        if (voice.nodeId === node.id && voice.source === "node") {
          stopVoice(voice, true);
        }
      });
      const voice = startVoice({
        nodeId: node.id,
        octave: 0,
        freq: node.freq,
        lfoActive: true,
        lfoHalfPeriod: duration,
        lfoStartMs: now,
        lfoCurve: 1,
        source: "node",
      });
      if (voice) {
        node.baseVoiceId = voice.id;
        ensureLfoLoop();
      }
    }
    draw();
    return;
  }

  if (view.dragging) {
    moved = Math.hypot(
      event.offsetX - view.dragStart.x,
      event.offsetY - view.dragStart.y
    );
    view.dragging = false;
    markIsomorphicDirty();
  }

  if (moved < 4) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    if (hit) {
      if (event.altKey && hit.active && !hit.isCenter) {
        hit.active = false;
        stopVoicesForNode(hit.id, false);
        updatePitchInstances();
        refreshPatternFromActiveNodes();
        updateUiHint();
        markIsomorphicDirty();
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      if (zKeyHeld) {
        if (!is3DMode) {
          if (mode3dCheckbox) {
            mode3dCheckbox.checked = true;
          }
          set3DMode(true);
        }
        zModeActive = true;
        zModeAnchor = { x: hit.gridX, y: hit.gridY };
        updateAddModeFromShift();
        draw();
        schedulePresetUrlUpdate();
        return;
      }
      if (is3DMode && !isAddMode && !hit.active && !hit.isCenter) {
        return;
      }
      const baseVoice = hit.baseVoiceId ? findVoiceById(hit.baseVoiceId) : null;
      if (baseVoice && baseVoice.lfoActive) {
        disableVoiceLfo(baseVoice);
        draw();
        return;
      }
      if (!hit.active) {
        hit.active = true;
        updatePitchInstances();
        refreshPatternFromActiveNodes();
        updateUiHint();
        markIsomorphicDirty();
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      if (baseVoice) {
        stopVoice(baseVoice);
        hit.baseVoiceId = null;
      } else {
        const voice = startVoice({
          nodeId: hit.id,
          octave: 0,
          freq: hit.freq,
          source: "node",
        });
        if (voice) {
          hit.baseVoiceId = voice.id;
        }
      }
    }
    draw();
  }
}

function onPointerLeave() {
  hoverNodeId = null;
  lfoArmingId = null;
  view.rotating = false;
  if (view.dragging) {
    view.dragging = false;
  }
  draw();
}

function onWheel(event) {
  event.preventDefault();
  const zoomDelta = event.deltaY > 0 ? 0.92 : 1.08;
  if (is3DMode) {
    view.zoom = Math.min(2.2, Math.max(0.5, view.zoom * zoomDelta));
    draw();
    markIsomorphicDirty();
    schedulePresetUrlUpdate();
    return;
  }
  const before = screenToWorld({ x: event.offsetX, y: event.offsetY });
  view.zoom = Math.min(2.2, Math.max(0.5, view.zoom * zoomDelta));
  const after = screenToWorld({ x: event.offsetX, y: event.offsetY });

  view.offsetX += before.x - after.x;
  view.offsetY += before.y - after.y;
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function isInactiveNodeAvailable(node) {
  if (!is3DMode) {
    return shiftHeld && (node.gridZ || 0) === gridCenterZ;
  }
  const z = node.gridZ || 0;
  if (zModeActive && zModeAnchor) {
    return node.gridX === zModeAnchor.x && node.gridY === zModeAnchor.y;
  }
  return z === gridCenterZ;
}

function hitTestScreen(screenPoint) {
  const radius = 36 / view.zoom;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestDepth = Number.NEGATIVE_INFINITY;

  nodes.forEach((node) => {
    if (!node.active && (!isInactiveNodeAvailable(node) || (is3DMode && !isAddMode))) {
      return;
    }
    const projected = worldToScreen(node.coordinate);
    const dx = projected.x - screenPoint.x;
    const dy = projected.y - screenPoint.y;
    const distance = Math.hypot(dx, dy);
    const adjustedRadius = radius * (projected.scale || 1);
    if (distance <= adjustedRadius) {
      if (distance < bestDistance || projected.depth > bestDepth) {
        best = node;
        bestDistance = distance;
        bestDepth = projected.depth;
      }
    }
  });

  return best;
}

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.clientWidth * scale);
  canvas.height = Math.floor(canvas.clientHeight * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  markIsomorphicDirty();
  draw();
}

function updateRatioWheelPosition() {
  if (!ratioWheelToggle || !ratioWheelPanel) {
    return;
  }
  const gap = 8;
  const buttonRect = ratioWheelToggle.getBoundingClientRect();
  const panelWidth = Math.min(420, window.innerWidth * 0.9);
  const maxLeft = Math.max(8, window.innerWidth - panelWidth - 8);
  const left = Math.min(Math.max(buttonRect.right - panelWidth, 8), maxLeft);
  const top = Math.round(buttonRect.bottom + gap);
  document.documentElement.style.setProperty("--ratio-wheel-left", `${Math.round(left)}px`);
  document.documentElement.style.setProperty("--ratio-wheel-top", `${top}px`);
}

function populateRatioSelect(selectEl, defaultValue, includeOne = false) {
  if (includeOne) {
    const option = document.createElement("option");
    option.value = "1";
    option.textContent = "1";
    if (defaultValue === 1) {
      option.selected = true;
    }
    selectEl.appendChild(option);
  }
  primes.forEach((prime) => {
    const option = document.createElement("option");
    option.value = String(prime);
    option.textContent = String(prime);
    if (prime === defaultValue) {
      option.selected = true;
    }
    selectEl.appendChild(option);
  });
}

function updateVolume() {
  const db = Number(volumeSlider.value);
  volumeReadout.textContent = `${db} dB`;
  if (!masterGain) {
    return;
  }
  const amplitude = Math.pow(10, db / 20);
  masterGain.gain.setTargetAtTime(amplitude, audioCtx.currentTime, 0.01);
}

function updateEnvelopeReadouts() {
  attackReadout.textContent = `${Number(attackSlider.value).toFixed(2)}s`;
  decayReadout.textContent = `${Number(decaySlider.value).toFixed(2)}s`;
  sustainReadout.textContent = `${Number(sustainSlider.value).toFixed(2)}`;
  releaseReadout.textContent = `${Number(releaseSlider.value).toFixed(2)}s`;
}

function updateLfoDepth() {
  lfoDepth = Number(lfoDepthSlider.value);
  if (Number.isNaN(lfoDepth)) {
    lfoDepth = 1;
  }
  if (lfoDepthReadout) {
    lfoDepthReadout.textContent = `${Math.round(lfoDepth * 100)}%`;
  }
}

function drawAxes() {
  const axisLengthXY = GRID_SPACING * (GRID_COLS / 2);
  const axisLengthZ = GRID_SPACING * (gridDepth / 2);
  ctx.lineWidth = 1.5;

  if (zModeActive && zModeAnchor) {
    const centerX = Math.floor(GRID_COLS / 2);
    const centerY = Math.floor(GRID_ROWS / 2);
    const anchorPoint = {
      x: (zModeAnchor.x - centerX) * GRID_SPACING,
      y: (zModeAnchor.y - centerY) * GRID_SPACING,
      z: 0,
    };
    const start = worldToScreen({ ...anchorPoint, z: -axisLengthZ });
    const end = worldToScreen({ ...anchorPoint, z: axisLengthZ });
    ctx.strokeStyle = AXIS_EDGE_COLORS.z;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    return;
  }

  const axes = [
    {
      start: { x: -axisLengthXY, y: 0, z: 0 },
      end: { x: axisLengthXY, y: 0, z: 0 },
      color: AXIS_EDGE_COLORS.x,
    },
    {
      start: { x: 0, y: -axisLengthXY, z: 0 },
      end: { x: 0, y: axisLengthXY, z: 0 },
      color: AXIS_EDGE_COLORS.y,
    },
    {
      start: { x: 0, y: 0, z: -axisLengthZ },
      end: { x: 0, y: 0, z: axisLengthZ },
      color: AXIS_EDGE_COLORS.z,
    },
  ];

  axes.forEach((axis) => {
    const start = worldToScreen(axis.start, true);
    const end = worldToScreen(axis.end, true);
    ctx.strokeStyle = axis.color;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });
}

function drawGrid() {
  const size = GRID_SPACING * (GRID_COLS / 2);
  const sizeZ = GRID_SPACING * (gridDepth / 2);
  const step = GRID_SPACING;
  const coarseStep = GRID_SPACING * 2;
  ctx.save();
  ctx.strokeStyle = themeColors.edge;
  ctx.lineWidth = 1;

  const drawLine = (start, end, baseAlpha) => {
    const avgDepth = (start.depth + end.depth) / 2;
    const depthFade = Number.isFinite(avgDepth)
      ? Math.max(0.12, Math.min(1, 1 - Math.max(0, avgDepth) / 2000))
      : 1;
    ctx.globalAlpha = baseAlpha * depthFade;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const drawPlaneGrid = (plane, planeAlpha) => {
    const [axisA, axisB, axisConst] = plane;
    const limitA = axisA === "z" ? sizeZ : size;
    const limitB = axisB === "z" ? sizeZ : size;
    const stepA = axisA === "z" ? step : coarseStep;
    const stepB = axisB === "z" ? step : coarseStep;
    for (let a = -limitA; a <= limitA; a += stepA) {
      const start = { x: 0, y: 0, z: 0 };
      const end = { x: 0, y: 0, z: 0 };
      start[axisA] = a;
      end[axisA] = a;
      start[axisB] = -limitB;
      end[axisB] = limitB;
      start[axisConst.axis] = axisConst.value;
      end[axisConst.axis] = axisConst.value;
      drawLine(worldToScreen(start), worldToScreen(end), planeAlpha);
    }
    for (let b = -limitB; b <= limitB; b += stepB) {
      const start = { x: 0, y: 0, z: 0 };
      const end = { x: 0, y: 0, z: 0 };
      start[axisB] = b;
      end[axisB] = b;
      start[axisA] = -limitA;
      end[axisA] = limitA;
      start[axisConst.axis] = axisConst.value;
      end[axisConst.axis] = axisConst.value;
      drawLine(worldToScreen(start), worldToScreen(end), planeAlpha);
    }
  };

  drawPlaneGrid(["x", "y", { axis: "z", value: 0 }], 0.35);
  ctx.restore();
}

function getLfoValue(voice, nowMs) {
  if (!voice.lfoActive || voice.lfoHalfPeriod <= 0) {
    return 1;
  }
  const elapsed = (nowMs - voice.lfoStartMs) / 1000;
  if (elapsed < 0) {
    return 1;
  }
  const phase = (elapsed / voice.lfoHalfPeriod) % 2;
  const normalized = phase <= 1 ? phase : 2 - phase;
  const value = normalized;
  const curve = Math.max(0.2, Number(voice.lfoCurve) || 1);
  return Math.pow(value, curve);
}

function getLfoGainValue(voice, nowMs) {
  if (!voice.lfoActive) {
    return 1;
  }
  const value = getLfoValue(voice, nowMs);
  return (1 - lfoDepth) + lfoDepth * value;
}

function getSequenceLfoValue(voice, nowSec) {
  if (!voice || voice.lfoSequenceStartSec == null || !voice.lfoSequenceCycleSec) {
    return 0;
  }
  const beatSec = voice.lfoSequenceBeatSec || (60 / tempoBpm);
  const riseSec = 8 * beatSec;
  const fallSec = 8 * beatSec;
  const cycleSec = voice.lfoSequenceCycleSec;
  const offsetSec = Number(voice.lfoSequenceOffsetSec) || 0;
  const elapsed = nowSec - (voice.lfoSequenceStartSec + offsetSec);
  if (elapsed < 0) {
    return 0;
  }
  const phase = elapsed % cycleSec;
  const waitStartSec = (Number(voice.lfoSequenceWaitStartBeats) || 0) * beatSec;
  const waitEndSec = (Number(voice.lfoSequenceWaitEndBeats) || 0) * beatSec;
  if (phase < waitStartSec) {
    return 0;
  }
  if (phase < waitStartSec + riseSec) {
    return (phase - waitStartSec) / riseSec;
  }
  if (phase < waitStartSec + riseSec + fallSec) {
    return 1 - (phase - waitStartSec - riseSec) / fallSec;
  }
  return 0;
}

function getActiveRatioAngles() {
  const seen = new Set();
  const entries = [];

  nodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    const ratio = node.numerator / node.denominator;
    const cents = 1200 * Math.log2(ratio);
    const key = cents.toFixed(3);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    entries.push({
      ratio,
      cents,
      numerator: node.numerator,
      denominator: node.denominator,
    });
  });

  entries.sort((a, b) => a.cents - b.cents);
  return entries.map((entry) => ({
    ratio: entry.ratio,
    cents: entry.cents,
    numerator: entry.numerator,
    denominator: entry.denominator,
    angle: -Math.PI / 2 + (2 * Math.PI * entry.cents) / 1200,
  }));
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function formatIntervalRatio(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function resizeWheelCanvas(canvasEl) {
  if (!canvasEl) {
    return;
  }
  const rect = canvasEl.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  const targetWidth = Math.max(1, Math.floor(rect.width * scale));
  const targetHeight = Math.max(1, Math.floor(rect.height * scale));
  if (canvasEl.width !== targetWidth || canvasEl.height !== targetHeight) {
    canvasEl.width = targetWidth;
    canvasEl.height = targetHeight;
  }
}

function drawRatioWheel(canvasEl, options = {}) {
  if (!canvasEl || !themeColors) {
    return;
  }
  const { showLabels = true, showIntervals = true } = options;
  resizeWheelCanvas(canvasEl);
  const ctx2d = canvasEl.getContext("2d");
  if (!ctx2d) {
    return;
  }
  const width = canvasEl.width;
  const height = canvasEl.height;
  ctx2d.clearRect(0, 0, width, height);

  const angles = getActiveRatioAngles();
  const radius = Math.min(width, height) * 0.4;
  const cx = width / 2;
  const cy = height / 2;

  ctx2d.strokeStyle = themeColors.wheelRing;
  ctx2d.lineWidth = 2;
  ctx2d.beginPath();
  ctx2d.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx2d.stroke();

  ctx2d.strokeStyle = themeColors.wheelLine;
  angles.forEach((item) => {
    const x = cx + Math.cos(item.angle) * radius;
    const y = cy + Math.sin(item.angle) * radius;
    ctx2d.beginPath();
    ctx2d.moveTo(cx, cy);
    ctx2d.lineTo(x, y);
    ctx2d.stroke();
  });

  if (!angles.length || (!showLabels && !showIntervals)) {
    return;
  }

  if (showLabels) {
    const fontSize = Math.max(9, Math.round(width * 0.04));
    ctx2d.fillStyle = themeColors.wheelText;
    ctx2d.font = `${fontSize}px Georgia`;
    ctx2d.textAlign = "center";
    ctx2d.textBaseline = "middle";

    const fundamental = Number(fundamentalInput.value) || 220;
    const a4 = Number(a4Input.value) || 440;

    angles.forEach((item) => {
      const noteInfo = getNearestEtInfo(fundamental * item.ratio, a4);
      const centsRounded = Math.round(noteInfo.cents);
      const centsLabel = `${centsRounded >= 0 ? "+" : ""}${centsRounded}¢`;
      const label = `${noteInfo.pitchClass} ${centsLabel}`;
      const labelRadius = radius + fontSize * 1.5;
      const lx = cx + Math.cos(item.angle) * labelRadius;
      const ly = cy + Math.sin(item.angle) * labelRadius;
      ctx2d.fillText(label, lx, ly);
    });
  }

  if (showIntervals) {
    const sliceFont = Math.max(10, Math.round(width * 0.03));
    ctx2d.font = `${sliceFont}px Georgia`;

    for (let i = 0; i < angles.length; i += 1) {
      const current = angles[i];
      const next = angles[(i + 1) % angles.length];
      let endAngle = next.angle;
      if (endAngle <= current.angle) {
        endAngle += Math.PI * 2;
      }
      const midAngle = (current.angle + endAngle) / 2;
      const midRadius = radius * 0.55;
      const mx = cx + Math.cos(midAngle) * midRadius;
      const my = cy + Math.sin(midAngle) * midRadius;

      const nextNum =
        i === angles.length - 1 ? next.numerator * 2 : next.numerator;
      const nextDen = next.denominator;
      const intervalNum = nextNum * current.denominator;
      const intervalDen = nextDen * current.numerator;
      const intervalLabel = formatIntervalRatio(intervalNum, intervalDen);
      ctx2d.fillText(intervalLabel, mx, my);
    }
  }
}

function updateRatioWheels() {
  if (ratioWheelPanel && !ratioWheelPanel.hidden) {
    drawRatioWheel(ratioWheelLarge);
  }
  if (ratioWheelMini) {
    drawRatioWheel(ratioWheelMini, { showLabels: false, showIntervals: false });
  }
}

function updateUiHint() {
  if (!uiHint) {
    return;
  }
  if (keyboardModeSelect && keyboardModeSelect.value === "piano") {
    uiHint.textContent =
      "Two octave piano layout, starting on Z (as C) and Y (C an octave higher)\n(click to hide)";
    return;
  }
  if (!is3DMode) {
    uiHint.textContent =
      "Drag to pan. Scroll to zoom. Shift-click to add. Option-click to remove. Shift double-click & hold for LFO.\n(click to hide)";
    return;
  }
  uiHint.textContent =
    "3D Mode:\nShift-click to add\nOption-click to remove\nZ-click to access Z axis\nClick-drag to rotate\nShift double-click & hold for LFO\nArrow keys to pan\nScroll to zoom\n(click to hide)";
}

function updateZModeMessage() {
  if (!zModeMessage) {
    return;
  }
  if (!zModeActive || !zModeAnchor) {
    zModeMessage.hidden = true;
    zModeMessage.textContent = "";
    return;
  }
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const coordX = zModeAnchor.x - centerX;
  const coordY = centerY - zModeAnchor.y;
  zModeMessage.textContent = `Editing Z axis for node [${coordX},${coordY}]: press Escape to return`;
  zModeMessage.hidden = false;
}

function updateAddModeFromShift() {
  if (!is3DMode) {
    isAddMode = false;
  } else {
    isAddMode = shiftHeld || zModeActive;
  }
  if (navAddModeToggle) {
    navAddModeToggle.checked = isAddMode;
  }
}

function set3DMode(enabled) {
  const activeKeys = captureActiveNodeKeys();
  const had3DNodes = gridDepth > 1;
  is3DMode = enabled;
  isFlattened2D = !enabled && had3DNodes;
  markIsomorphicDirty();
  if (nav3dPanel) {
    nav3dPanel.hidden = !enabled;
  }
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
  if (!enabled) {
    zModeActive = false;
    zModeAnchor = null;
  }
  if (enabled && uiHint) {
    uiHint.hidden = false;
  }
  updateAddModeFromShift();
  updateUiHint();
  if (enabled && !had3DNodes) {
    rebuildLattice(activeKeys);
  } else {
    draw();
  }
}

function setViewPreset(preset) {
  if (!is3DMode) {
    return;
  }
  view.offsetX = 0;
  view.offsetY = 0;
  view.zoom = 1;
  if (preset === "xy") {
    view.rotX = 0;
    view.rotY = 0;
  } else if (preset === "zy") {
    view.rotX = 0;
    view.rotY = Math.PI / 2;
  } else if (preset === "quarter") {
    view.rotX = -0.6;
    view.rotY = 0.7;
  }
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function applyNavAction(action) {
  const step = 0.1;
  const panStep = 40 / view.zoom;
  if (action === "rot-up") {
    view.rotX = Math.max(-1.2, view.rotX - step);
  } else if (action === "rot-down") {
    view.rotX = Math.min(1.2, view.rotX + step);
  } else if (action === "rot-left") {
    view.rotY -= step;
  } else if (action === "rot-right") {
    view.rotY += step;
  } else if (action === "pan-up") {
    view.offsetY -= panStep;
  } else if (action === "pan-down") {
    view.offsetY += panStep;
  } else if (action === "pan-left") {
    view.offsetX -= panStep;
  } else if (action === "pan-right") {
    view.offsetX += panStep;
  } else if (action === "zoom-in") {
    view.zoom = Math.min(2.2, view.zoom * 1.1);
  } else if (action === "zoom-out") {
    view.zoom = Math.max(0.5, view.zoom / 1.1);
  } else if (action === "best-view") {
    applyBestView();
    schedulePresetUrlUpdate();
    return;
  }
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function applyBestView() {
  if (!is3DMode) {
    return;
  }
  const activeNodes = nodes.filter((node) => node.active);
  if (!activeNodes.length) {
    return;
  }

  const yawSteps = [];
  for (let yaw = -Math.PI; yaw <= Math.PI; yaw += Math.PI / 6) {
    yawSteps.push(yaw);
  }
  const pitchSteps = [];
  for (let pitch = -0.9; pitch <= 0.9; pitch += Math.PI / 9) {
    pitchSteps.push(pitch);
  }

  const preferredRotX = -0.6;
  const preferredRotY = 0.7;
  const orientationWeight = 50;
  const angleDistance = (a, b) => {
    const diff = Math.atan2(Math.sin(a - b), Math.cos(a - b));
    return Math.abs(diff);
  };

  let best = { score: Number.POSITIVE_INFINITY, rotX: view.rotX, rotY: view.rotY };

  pitchSteps.forEach((rotX) => {
    yawSteps.forEach((rotY) => {
      let score = 0;
      for (let i = 0; i < activeNodes.length; i += 1) {
        const nodeA = activeNodes[i];
        const projA = projectPointWithAngles(nodeA.coordinate, rotX, rotY);
        const radiusA = getNodeRadius(nodeA) * projA.scale;
        for (let j = i + 1; j < activeNodes.length; j += 1) {
          const nodeB = activeNodes[j];
          const projB = projectPointWithAngles(nodeB.coordinate, rotX, rotY);
          const radiusB = getNodeRadius(nodeB) * projB.scale;
          const dx = projA.x - projB.x;
          const dy = projA.y - projB.y;
          const dist = Math.hypot(dx, dy);
          const overlap = radiusA + radiusB - dist;
          if (overlap > 0) {
            score += overlap * overlap;
          }
        }
      }
      const orientationPenalty =
        orientationWeight *
        (Math.pow(rotX - preferredRotX, 2) +
          Math.pow(angleDistance(rotY, preferredRotY), 2));
      score += orientationPenalty;
      if (score < best.score) {
        best = { score, rotX, rotY };
      }
    });
  });

  view.rotX = best.rotX;
  view.rotY = best.rotY;

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  activeNodes.forEach((node) => {
    const proj = projectPointWithAngles(node.coordinate, view.rotX, view.rotY);
    const radius = getNodeRadius(node) * proj.scale;
    minX = Math.min(minX, proj.x - radius);
    maxX = Math.max(maxX, proj.x + radius);
    minY = Math.min(minY, proj.y - radius);
    maxY = Math.max(maxY, proj.y + radius);
  });

  const topBar = document.querySelector(".top-bar");
  const leftNav = document.getElementById("nav-3d");
  const synthPanel = document.querySelector(".synth-panel");
  const topBarRect = topBar ? topBar.getBoundingClientRect() : null;
  const leftNavRect =
    leftNav && !leftNav.hidden ? leftNav.getBoundingClientRect() : null;
  const synthRect = synthPanel ? synthPanel.getBoundingClientRect() : null;
  const safeTop = topBarRect ? topBarRect.height : 0;
  const safeLeft = leftNavRect ? leftNavRect.width : 0;
  const safeBottom = synthRect ? synthRect.height : 0;
  const safeRight = 0;

  const padding = 80;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const availableWidth = Math.max(1, canvas.clientWidth - safeLeft - safeRight - padding);
  const availableHeight = Math.max(1, canvas.clientHeight - safeTop - safeBottom - padding);
  const zoomX = availableWidth / width;
  const zoomY = availableHeight / height;
  view.zoom = Math.min(2.2, Math.max(0.5, Math.min(zoomX, zoomY)));

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const targetCenterX = safeLeft + (canvas.clientWidth - safeLeft - safeRight) / 2;
  const targetCenterY = safeTop + (canvas.clientHeight - safeTop - safeBottom) / 2;
  view.offsetX = (targetCenterX - canvas.clientWidth / 2) / view.zoom - centerX;
  view.offsetY = (targetCenterY - canvas.clientHeight / 2) / view.zoom - centerY;
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function lfoLoop() {
  const nowMs = performance.now();
  const nowSec = audioCtx ? audioCtx.currentTime : nowMs / 1000;
  let needsFrame = false;

  voices.forEach((voice) => {
    let voiceNeedsFrame = false;
    if (voice.lfoActive && voice.lfoGain) {
      voice.lfoGain.gain.value = getLfoGainValue(voice, nowMs);
      voiceNeedsFrame = true;
    }
    if (voice.source === "lfo-sequence") {
      voiceNeedsFrame = true;
    }
    const attack = voice.envAttackSec || 0;
    const decay = voice.envDecaySec || 0;
    if (voice.releaseStartSec != null && voice.releaseDurationSec != null) {
      if (nowSec < voice.releaseStartSec + voice.releaseDurationSec) {
        voiceNeedsFrame = true;
      }
    } else if (voice.startTimeSec != null && nowSec < voice.startTimeSec + attack + decay) {
      voiceNeedsFrame = true;
    }
    if (voiceNeedsFrame) {
      needsFrame = true;
    }
  });

  if (needsFrame) {
    draw();
    requestAnimationFrame(lfoLoop);
  } else {
    lfoAnimating = false;
  }
}

function ensureLfoLoop() {
  if (!lfoAnimating) {
    lfoAnimating = true;
    requestAnimationFrame(lfoLoop);
  }
}

function refreshThemeColors() {
  const styles = getComputedStyle(document.body);
  themeColors = {
    edge: styles.getPropertyValue("--edge").trim() || "rgba(0, 0, 0, 0.18)",
    nodeStroke: styles.getPropertyValue("--node-stroke").trim() || "rgba(0, 0, 0, 0.35)",
    nodeActive: styles.getPropertyValue("--node-active").trim() || "#c94b3d",
    textPrimary: styles.getPropertyValue("--text-primary").trim() || "#1e1e1e",
    textSecondary: styles.getPropertyValue("--text-secondary").trim() || "#2a2a2a",
    lfo: styles.getPropertyValue("--lfo").trim() || "#3b82f6",
    playFill: styles.getPropertyValue("--play-fill").trim() || "#f3d64d",
    looperFill: styles.getPropertyValue("--looper-fill").trim() || "#f1c94a",
    wheelLine: styles.getPropertyValue("--wheel-line").trim() || "rgba(16, 19, 22, 0.65)",
    wheelRing: styles.getPropertyValue("--wheel-ring").trim() || "rgba(16, 19, 22, 0.2)",
    wheelText: styles.getPropertyValue("--wheel-text").trim() || "#000000",
  };
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  if (themeSelect) {
    themeSelect.value = theme;
  }
  refreshThemeColors();
  draw();
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("lattice-theme", nextTheme);
}

function onThemeSelectChange() {
  if (!themeSelect) {
    return;
  }
  const selected = themeSelect.value === "dark" ? "dark" : "light";
  applyTheme(selected);
  localStorage.setItem("lattice-theme", selected);
}

function initTheme() {
  const saved = localStorage.getItem("lattice-theme");
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);
}

function toggleOptionsPanel() {
  if (!optionsToggle || !optionsPanel) {
    return;
  }
  const isOpen = optionsToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeTopMenus("options");
  }
  optionsToggle.setAttribute("aria-expanded", String(!isOpen));
  optionsPanel.hidden = isOpen;
  optionsPanel.classList.toggle("panel-open", !isOpen);
  const parentPanel = optionsToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.toggle("panel-open", !isOpen);
  }
  syncTopMenuPanelState();
}

function togglePresetPanel() {
  if (!presetToggle || !presetPanel) {
    return;
  }
  const isOpen = presetToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeTopMenus("presets");
  }
  presetToggle.setAttribute("aria-expanded", String(!isOpen));
  presetPanel.hidden = isOpen;
  presetPanel.classList.toggle("panel-open", !isOpen);
  const parentPanel = presetToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.toggle("panel-open", !isOpen);
  }
  syncTopMenuPanelState();
}

function toggleEnvelopePanel() {
  if (!envelopeToggle || !envelopePanel) {
    return;
  }
  const isOpen = envelopeToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeBottomMenus("envelope");
  }
  envelopeToggle.setAttribute("aria-expanded", String(!isOpen));
  envelopePanel.hidden = isOpen;
  envelopePanel.classList.toggle("panel-open", !isOpen);
  syncBottomMenuPanelState();
}

function toggleAnimationPanel() {
  if (!animationToggle || !animationPanel) {
    return;
  }
  const isOpen = animationToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeBottomMenus("animation");
  }
  animationToggle.setAttribute("aria-expanded", String(!isOpen));
  animationPanel.hidden = isOpen;
  animationPanel.classList.toggle("panel-open", !isOpen);
  syncBottomMenuPanelState();
}

function closeRatioWheelPanel() {
  if (!ratioWheelToggle || !ratioWheelPanel) {
    return;
  }
  ratioWheelToggle.setAttribute("aria-expanded", "false");
  ratioWheelPanel.hidden = true;
  ratioWheelPanel.classList.remove("panel-open");
  syncTopMenuPanelState();
}

function toggleRatioWheelPanel() {
  if (!ratioWheelToggle || !ratioWheelPanel) {
    return;
  }
  const isOpen = ratioWheelToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeTopMenus("ratio-wheel");
  }
  ratioWheelToggle.setAttribute("aria-expanded", String(!isOpen));
  ratioWheelPanel.hidden = isOpen;
  ratioWheelPanel.classList.toggle("panel-open", !isOpen);
  if (!isOpen) {
    updateRatioWheelPosition();
    updateRatioWheels();
  }
  syncTopMenuPanelState();
}

function closeOptionsPanel() {
  if (!optionsToggle || !optionsPanel) {
    return;
  }
  optionsToggle.setAttribute("aria-expanded", "false");
  optionsPanel.hidden = true;
  optionsPanel.classList.remove("panel-open");
  const parentPanel = optionsToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.remove("panel-open");
  }
}

function closePresetPanel() {
  if (!presetToggle || !presetPanel) {
    return;
  }
  presetToggle.setAttribute("aria-expanded", "false");
  presetPanel.hidden = true;
  presetPanel.classList.remove("panel-open");
  const parentPanel = presetToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.remove("panel-open");
  }
}

function closeEnvelopePanel() {
  if (!envelopeToggle || !envelopePanel) {
    return;
  }
  envelopeToggle.setAttribute("aria-expanded", "false");
  envelopePanel.hidden = true;
  envelopePanel.classList.remove("panel-open");
}

function closeAnimationPanel() {
  if (!animationToggle || !animationPanel) {
    return;
  }
  animationToggle.setAttribute("aria-expanded", "false");
  animationPanel.hidden = true;
  animationPanel.classList.remove("panel-open");
}

function closeTopMenus(except = "") {
  if (except !== "options") {
    closeOptionsPanel();
  }
  if (except !== "presets") {
    closePresetPanel();
  }
  if (except !== "ratio-wheel") {
    closeRatioWheelPanel();
  }
  syncTopMenuPanelState();
}

function closeBottomMenus(except = "") {
  if (except !== "envelope") {
    closeEnvelopePanel();
  }
  if (except !== "animation") {
    closeAnimationPanel();
  }
  syncBottomMenuPanelState();
}

function syncTopMenuPanelState() {
  if (!controlsPanel) {
    return;
  }
  const anyOpen =
    (optionsPanel && !optionsPanel.hidden) ||
    (presetPanel && !presetPanel.hidden) ||
    (ratioWheelPanel && !ratioWheelPanel.hidden);
  controlsPanel.classList.toggle("panel-open", anyOpen);
}

function syncBottomMenuPanelState() {
  if (!synthPanel) {
    return;
  }
  const anyOpen =
    (envelopePanel && !envelopePanel.hidden) ||
    (animationPanel && !animationPanel.hidden);
  synthPanel.classList.toggle("panel-open", anyOpen);
}

async function loadPresets() {
  if (!presetList) {
    return;
  }
  presetList.innerHTML = "";
  try {
    const response = await fetch(new URL("./presets.json", import.meta.url));
    if (!response.ok) {
      throw new Error(`Preset fetch failed: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Preset data is not an array");
    }
    if (data.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "preset-empty";
      emptyItem.textContent = "No presets yet.";
      presetList.appendChild(emptyItem);
      return;
    }
    data.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return;
      }
      const [name, uri] = entry;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = String(name);
      const uriString = String(uri);
      if (uriString.startsWith("http://") || uriString.startsWith("https://")) {
        try {
          const parsed = new URL(uriString);
          if (parsed.hash) {
            link.href = `${window.location.origin}${window.location.pathname}${parsed.hash}`;
          } else {
            link.href = `${window.location.origin}${parsed.pathname}${parsed.search}`;
          }
        } catch (error) {
          link.href = uriString;
        }
      } else if (uriString.startsWith("#")) {
        link.href = `${window.location.origin}${window.location.pathname}${uriString}`;
      } else if (uriString.startsWith("/")) {
        link.href = `${window.location.origin}${uriString}`;
      } else {
        link.href = `${window.location.origin}/${uriString}`;
      }
      link.target = "_self";
      link.rel = "noopener";
      item.appendChild(link);
      presetList.appendChild(item);
    });
  } catch (error) {
    const errorItem = document.createElement("li");
    errorItem.className = "preset-empty";
    errorItem.textContent = "Failed to load presets.";
    presetList.appendChild(errorItem);
    console.warn(error);
  }
}

const PRESET_PARAM = "s";
let presetSyncEnabled = false;
let presetUpdateTimer = null;

function encodePresetState(state) {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodePresetState(encoded) {
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

function getPresetState() {
  const active = nodes
    .filter((node) => node.active)
    .map((node) => [node.exponentX, node.exponentY, node.exponentZ || 0]);
  return {
    v: 1,
    active,
    mode3d: is3DMode,
    view: {
      zoom: view.zoom,
      offsetX: view.offsetX,
      offsetY: view.offsetY,
      rotX: view.rotX,
      rotY: view.rotY,
    },
    axes: showAxes,
    grid: showGrid,
    ratios: [
      Number(ratioXSelect.value) || 3,
      Number(ratioYSelect.value) || 5,
      Number(ratioZSelect.value) || 7,
    ],
    fundamental: Number(fundamentalInput.value) || 220,
    a4: Number(a4Input.value) || 440,
    synth: {
      volume: Number(volumeSlider.value),
      lfoDepth: Number(lfoDepthSlider.value),
      keyboardMode: keyboardModeSelect ? keyboardModeSelect.value : "off",
      waveform: waveformSelect ? waveformSelect.value : "sine",
      attack: Number(attackSlider.value),
      decay: Number(decaySlider.value),
      sustain: Number(sustainSlider.value),
      release: Number(releaseSlider.value),
      oneShot: Boolean(oneShotCheckbox && oneShotCheckbox.checked),
    },
  };
}

function updatePresetUrl() {
  if (!presetSyncEnabled) {
    return;
  }
  const encoded = encodePresetState(getPresetState());
  const nextHash = `${PRESET_PARAM}=${encoded}`;
  if (location.hash === `#${nextHash}`) {
    return;
  }
  history.replaceState(null, "", `${location.pathname}${location.search}#${nextHash}`);
}

function schedulePresetUrlUpdate() {
  if (!presetSyncEnabled) {
    return;
  }
  if (presetUpdateTimer) {
    clearTimeout(presetUpdateTimer);
  }
  presetUpdateTimer = setTimeout(updatePresetUrl, 250);
}

function readPresetFromUrl() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) {
    return null;
  }
  const params = new URLSearchParams(hash);
  const encoded = params.get(PRESET_PARAM);
  if (!encoded) {
    return null;
  }
  try {
    return decodePresetState(encoded);
  } catch (error) {
    return null;
  }
}

function applyPresetState(state) {
  if (!state || typeof state !== "object") {
    return;
  }
  if (typeof state.axes === "boolean") {
    showAxes = state.axes;
    if (navAxesToggle) {
      navAxesToggle.checked = showAxes;
    }
  }
  if (typeof state.grid === "boolean") {
    showGrid = state.grid;
    if (navGridToggle) {
      navGridToggle.checked = showGrid;
    }
  }
  const viewState = state.view && typeof state.view === "object" ? state.view : null;
  const activeHasZ = Array.isArray(state.active)
    ? state.active.some((entry) => Array.isArray(entry) && Number(entry[2]) !== 0)
    : false;
  const wants3D = Boolean(state.mode3d) || activeHasZ;
  if (mode3dCheckbox) {
    mode3dCheckbox.checked = wants3D;
  }
  is3DMode = wants3D;
  isFlattened2D = false;
  if (nav3dPanel) {
    nav3dPanel.hidden = !wants3D;
  }
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
  if (!wants3D) {
    zModeActive = false;
    zModeAnchor = null;
  }
  updateAddModeFromShift();
  updateUiHint();
  if (Number.isFinite(state.fundamental)) {
    fundamentalInput.value = String(state.fundamental);
  }
  if (Number.isFinite(state.a4)) {
    a4Input.value = String(state.a4);
  }
  if (Array.isArray(state.ratios)) {
    const [x, y, z] = state.ratios;
    if (Number.isFinite(x)) {
      ratioXSelect.value = String(x);
    }
    if (Number.isFinite(y)) {
      ratioYSelect.value = String(y);
    }
    if (Number.isFinite(z) && ratioZSelect) {
      ratioZSelect.value = String(z);
    }
  }

  if (state.synth && typeof state.synth === "object") {
    if (Number.isFinite(state.synth.volume)) {
      volumeSlider.value = String(state.synth.volume);
      updateVolume();
    }
    if (Number.isFinite(state.synth.lfoDepth) && lfoDepthSlider) {
      lfoDepthSlider.value = String(state.synth.lfoDepth);
      updateLfoDepth();
    }
    if (keyboardModeSelect && typeof state.synth.keyboardMode === "string") {
      keyboardModeSelect.value = state.synth.keyboardMode;
      updateUiHint();
      markIsomorphicDirty();
    }
    if (waveformSelect && typeof state.synth.waveform === "string") {
      waveformSelect.value = state.synth.waveform;
      waveformSelect.dispatchEvent(new Event("change"));
    }
    if (Number.isFinite(state.synth.attack)) {
      attackSlider.value = String(state.synth.attack);
    }
    if (Number.isFinite(state.synth.decay)) {
      decaySlider.value = String(state.synth.decay);
    }
    if (Number.isFinite(state.synth.sustain)) {
      sustainSlider.value = String(state.synth.sustain);
    }
    if (Number.isFinite(state.synth.release)) {
      releaseSlider.value = String(state.synth.release);
    }
    if (oneShotCheckbox && typeof state.synth.oneShot === "boolean") {
      oneShotCheckbox.checked = state.synth.oneShot;
    }
    updateEnvelopeReadouts();
  }

  if (viewState) {
    if (Number.isFinite(viewState.zoom)) {
      view.zoom = Math.min(2.2, Math.max(0.5, viewState.zoom));
    }
    if (Number.isFinite(viewState.offsetX)) {
      view.offsetX = viewState.offsetX;
    }
    if (Number.isFinite(viewState.offsetY)) {
      view.offsetY = viewState.offsetY;
    }
    if (Number.isFinite(viewState.rotX)) {
      view.rotX = Math.max(-1.2, Math.min(1.2, viewState.rotX));
    }
    if (Number.isFinite(viewState.rotY)) {
      view.rotY = viewState.rotY;
    }
  }

  updateFundamentalNotes();

  const activeKeys = new Set();
  if (Array.isArray(state.active)) {
    state.active.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return;
      }
      const [x, y, z = 0] = entry;
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
        return;
      }
      activeKeys.add(`${x},${y},${z}`);
    });
  }
  rebuildLattice(activeKeys);
}

function formatActiveRatiosForScaleWorkshop() {
  const ratios = nodes
    .filter((node) => node.active)
    .map((node) => ({
      numerator: node.numerator,
      denominator: node.denominator,
      ratio: node.numerator / node.denominator,
    }))
    .filter((item) => item.numerator !== item.denominator)
    .sort((a, b) => a.ratio - b.ratio);

  const withoutOctave = ratios.filter(
    (item) => !(item.numerator === 2 && item.denominator === 1)
  );
  withoutOctave.push({ numerator: 2, denominator: 1, ratio: 2 });

  if (!withoutOctave.length) {
    return "";
  }

  return withoutOctave
    .map((item) => `${item.numerator}/${item.denominator}`)
    .join("\n");
}

async function copyTextToClipboard(text) {
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

async function exportToScaleWorkshop() {
  const ratiosText = formatActiveRatiosForScaleWorkshop();
  if (!ratiosText) {
    alert("No active nodes to export.");
    return;
  }

  window.open("https://scaleworkshop.plainsound.org/?version=3.1.0", "_blank", "noopener");

  try {
    await copyTextToClipboard(ratiosText);
    alert("Ratios copied. Paste them into the Scale Data box in Scale Workshop.");
  } catch (error) {
    alert("Couldn't copy to clipboard. Paste manually:\n\n" + ratiosText);
  }
}

function captureActiveNodeKeys() {
  const keys = new Set();
  nodes.forEach((node) => {
    if (node.active) {
      const z = node.exponentZ || 0;
      keys.add(`${node.exponentX},${node.exponentY},${z}`);
    }
  });
  return keys;
}

function applyActiveNodeKeys(keys) {
  if (!keys || !keys.size) {
    return;
  }
  nodes.forEach((node) => {
    const z = node.exponentZ || 0;
    const key = `${node.exponentX},${node.exponentY},${z}`;
    if (keys.has(key)) {
      node.active = true;
    }
  });
  updatePitchInstances();
  markIsomorphicDirty();
}

function rebuildLattice(activeKeys = null) {
  stopAllVoices();
  nodes = buildLattice();
  nodeById = new Map(nodes.map((node) => [node.id, node]));
  applyActiveNodeKeys(activeKeys);
  edges = buildEdges(nodes, GRID_COLS, GRID_ROWS, gridDepth);
  updatePitchInstances();
  markIsomorphicDirty();
  refreshPatternFromActiveNodes();
  draw();
}

function resetLattice() {
  stopAllVoices();
  activeKeys.clear();
  nodes.forEach((node) => {
    node.active = node.isCenter;
    node.baseVoiceId = null;
  });
  updatePitchInstances();
  refreshPatternFromActiveNodes();
  updateUiHint();
  view.zoom = 1;
  view.offsetX = 0;
  view.offsetY = 0;
  view.rotX = 0;
  view.rotY = 0;
  hoverNodeId = null;
  markIsomorphicDirty();
  draw();
  schedulePresetUrlUpdate();
}

populateRatioSelect(ratioXSelect, 3);
populateRatioSelect(ratioYSelect, 5);
populateRatioSelect(ratioZSelect, 7, true);
populateWaveformOptions();
populateFundamentalNotes();
updateFundamentalNotes();
if (navAxesToggle) {
  showAxes = navAxesToggle.checked;
}
if (navGridToggle) {
  showGrid = navGridToggle.checked;
}
if (mode3dCheckbox) {
  is3DMode = mode3dCheckbox.checked;
  if (nav3dPanel) {
    nav3dPanel.hidden = !is3DMode;
  }
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
}
updateAddModeFromShift();
updateUiHint();
fundamentalNoteSelect.value = "60";
onFundamentalNoteChange();
const presetState = readPresetFromUrl();
if (presetState) {
  applyPresetState(presetState);
} else {
  rebuildLattice();
}
presetSyncEnabled = true;
updatePresetUrl();

audioToggle.addEventListener("click", toggleAudio);
resetButton.addEventListener("click", resetLattice);
window.addEventListener("hashchange", () => {
  const presetState = readPresetFromUrl();
  if (presetState) {
    applyPresetState(presetState);
  }
});
if (mode3dCheckbox) {
  mode3dCheckbox.addEventListener("change", () => {
    set3DMode(mode3dCheckbox.checked);
    schedulePresetUrlUpdate();
  });
}
if (navAxesToggle) {
  navAxesToggle.addEventListener("change", () => {
    showAxes = navAxesToggle.checked;
    draw();
    schedulePresetUrlUpdate();
  });
}
if (navGridToggle) {
  navGridToggle.addEventListener("change", () => {
    showGrid = navGridToggle.checked;
    draw();
    schedulePresetUrlUpdate();
  });
}
if (nav3dButtons && nav3dButtons.length) {
  nav3dButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const viewPreset = button.getAttribute("data-view");
      const action = button.getAttribute("data-action");
      if (viewPreset) {
        setViewPreset(viewPreset);
      } else if (action) {
        applyNavAction(action);
      }
    });
  });
}
exportScaleButton.addEventListener("click", exportToScaleWorkshop);
if (themeSelect) {
  themeSelect.addEventListener("change", onThemeSelectChange);
}
if (optionsToggle) {
  optionsToggle.addEventListener("click", toggleOptionsPanel);
}
if (midiEnable) {
  midiEnable.addEventListener("change", async () => {
    midiEnabled = midiEnable.checked;
    if (midiEnabled && !midiAccess) {
      await initMidi();
    }
  });
}
if (midiPortSelect) {
  midiPortSelect.addEventListener("change", () => {
    selectMidiInput(midiPortSelect.value);
  });
}
if (envelopeToggle) {
  envelopeToggle.addEventListener("click", toggleEnvelopePanel);
}
if (animationToggle) {
  animationToggle.addEventListener("click", toggleAnimationPanel);
}
if (ratioWheelToggle) {
  ratioWheelToggle.addEventListener("click", toggleRatioWheelPanel);
}
if (presetToggle) {
  presetToggle.addEventListener("click", togglePresetPanel);
}
if (uiHint) {
  uiHint.addEventListener("click", () => {
    uiHint.hidden = true;
  });
}
fundamentalInput.addEventListener("input", updateNodeFrequencies);
ratioXSelect.addEventListener("change", updateNodeRatios);
ratioYSelect.addEventListener("change", updateNodeRatios);
if (ratioZSelect) {
  ratioZSelect.addEventListener("change", updateNodeRatios);
}
a4Input.addEventListener("input", () => {
  updateFundamentalNotes();
  updateNodeFrequencies();
});
fundamentalNoteSelect.addEventListener("change", onFundamentalNoteChange);
volumeSlider.addEventListener("input", () => {
  updateVolume();
  schedulePresetUrlUpdate();
});
if (lfoDepthSlider) {
  lfoDepthSlider.addEventListener("input", () => {
    updateLfoDepth();
    schedulePresetUrlUpdate();
  });
}
waveformSelect.addEventListener("change", () => {
  const snapshot = [...voices];
  snapshot.forEach((voice) => {
    const wasBase = nodes.find((node) => node.baseVoiceId === voice.id);
    stopVoice(voice, true);
    const newVoice = startVoice({
      nodeId: voice.nodeId,
      octave: voice.octave,
      freq: voice.freq,
      lfoActive: voice.lfoActive,
      lfoHalfPeriod: voice.lfoHalfPeriod,
      lfoStartMs: voice.lfoStartMs,
      lfoCurve: voice.lfoCurve,
      source: voice.source,
    });
    if (newVoice && wasBase) {
      wasBase.baseVoiceId = newVoice.id;
    }
  });
  schedulePresetUrlUpdate();
});
keyboardModeSelect.addEventListener("change", updateUiHint);
keyboardModeSelect.addEventListener("change", () => {
  markIsomorphicDirty();
  draw();
  schedulePresetUrlUpdate();
});
attackSlider.addEventListener("input", () => {
  updateEnvelopeReadouts();
  schedulePresetUrlUpdate();
});
decaySlider.addEventListener("input", () => {
  updateEnvelopeReadouts();
  schedulePresetUrlUpdate();
});
sustainSlider.addEventListener("input", () => {
  updateEnvelopeReadouts();
  schedulePresetUrlUpdate();
});
releaseSlider.addEventListener("input", () => {
  updateEnvelopeReadouts();
  schedulePresetUrlUpdate();
});
if (oneShotCheckbox) {
  oneShotCheckbox.addEventListener("change", schedulePresetUrlUpdate);
}
if (looperToggle) {
  looperToggle.addEventListener("click", () => {
    if (looperState === "recording") {
      startLooperPlayback();
      return;
    }
    if (looperState === "playing") {
      stopLooperPlayback();
      return;
    }
    if (looperState === "ready") {
      startLooperPlayback();
      return;
    }
    startLooperRecording();
  });
}
if (looperClear) {
  looperClear.addEventListener("click", () => {
    clearLooper();
  });
}
if (scorePlayToggle) {
  scorePlayToggle.addEventListener("click", () => {
    if (patternPlayerState === "playing") {
      stopPatternPlayback();
    } else {
      startPatternPlayback();
    }
  });
}
if (patternBuildButton) {
  patternBuildButton.addEventListener("click", () => {
    buildPatternStates(false);
    if (patternPlayerState === "playing") {
      stopPatternPlayback();
      startPatternPlayback();
    }
  });
}
if (lfoPlayToggle) {
  lfoPlayToggle.addEventListener("click", () => {
    if (lfoPresetPlaying) {
      stopLfoPresets();
      return;
    }
    const preset = lfoPresetSelect ? lfoPresetSelect.value : "random";
    if (preset === "sequence") {
      startSequenceLfos();
    } else {
      randomizeLfosForActiveNodes();
    }
    lfoPresetPlaying = true;
    updateLfoPlayButton();
  });
}
if (lfoPresetSelect) {
  lfoPresetSelect.addEventListener("change", () => {
    if (lfoPresetPlaying) {
      stopLfoPresets();
    }
  });
}
if (lfoStopButton) {
  lfoStopButton.addEventListener("click", () => {
    scheduleLfoStopsAtCycleEnd();
  });
}
if (allNotesOffButton) {
  allNotesOffButton.addEventListener("click", () => {
    allNotesOff();
  });
}
if (tempoSlider) {
  tempoSlider.addEventListener("input", () => {
    updateTempoReadout();
  });
}
if (patternLengthSlider) {
  patternLengthSlider.addEventListener("input", () => {
    updatePatternLengthReadout();
  });
}
if (patternLengthModeInputs.length) {
  patternLengthModeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const selected = document.querySelector(
        'input[name="pattern-length-mode"]:checked'
      );
      patternLengthMode = selected ? selected.value : "sustain";
      updatePatternLengthReadout();
    });
  });
}
if (sequenceLfoDensitySlider) {
  sequenceLfoDensitySlider.addEventListener("input", () => {
    updateSequenceLfoDensityReadout();
  });
}

updateEnvelopeReadouts();
updateLfoDepth();
updateTempoReadout();
updatePatternLengthReadout();
updateSequenceLfoDensityReadout();
initTheme();
updateLooperButton();
updateScoreButton();
updateLfoPlayButton();
buildPatternStates();
populateMidiChannels();
loadPresets();
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointerleave", onPointerLeave);
canvas.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", resizeCanvas);
window.addEventListener("resize", updateRatioWheelPosition);
window.addEventListener("pointerdown", enableAudioFromGesture);
window.addEventListener("keydown", enableAudioFromGesture);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("keydown", (event) => {
  if (event.key === "Shift") {
    shiftHeld = true;
    updateAddModeFromShift();
    draw();
  }
  if (event.key.toLowerCase() === "z") {
    zKeyHeld = true;
  }
  if (event.key === "ArrowUp") {
    view.offsetY += (is3DMode ? 1 : -1) * (24 / view.zoom);
    draw();
  }
  if (event.key === "ArrowDown") {
    view.offsetY -= (is3DMode ? 1 : -1) * (24 / view.zoom);
    draw();
  }
  if (event.key === "ArrowLeft") {
    view.offsetX += (is3DMode ? 1 : -1) * (24 / view.zoom);
    draw();
  }
  if (event.key === "ArrowRight") {
    view.offsetX -= (is3DMode ? 1 : -1) * (24 / view.zoom);
    draw();
  }
  if (event.key === "Escape") {
    closeRatioWheelPanel();
    zModeActive = false;
    zModeAnchor = null;
    updateAddModeFromShift();
    draw();
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key === "Shift") {
    shiftHeld = false;
    updateAddModeFromShift();
    draw();
  }
  if (event.key.toLowerCase() === "z") {
    zKeyHeld = false;
  }
});

resizeCanvas();
updateRatioWheelPosition();
