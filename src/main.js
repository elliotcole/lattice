import { customOscillatorTypes, customOscillators } from "web-audio-oscillators";
const canvas = document.getElementById("lattice");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const audioToggle = document.getElementById("audio-toggle");
const resetButton = document.getElementById("reset-lattice");
const exportScaleButton = document.getElementById("export-scale");
const themeSelect = document.getElementById("theme-select");
const optionsToggle = document.getElementById("options-toggle");
const optionsPanel = document.getElementById("options-panel");
const ratioWheelToggle = document.getElementById("ratio-wheel-toggle");
const ratioWheelDrawer = document.getElementById("ratio-wheel-drawer");
const ratioWheelClose = document.getElementById("ratio-wheel-close");
const ratioWheelLarge = document.getElementById("ratio-wheel-large");
const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const a4Input = document.getElementById("a4");
const ratioXSelect = document.getElementById("ratio-x");
const ratioYSelect = document.getElementById("ratio-y");
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
const attackReadout = document.getElementById("attack-readout");
const decayReadout = document.getElementById("decay-readout");
const sustainReadout = document.getElementById("sustain-readout");
const releaseReadout = document.getElementById("release-readout");

const view = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  dragStart: { x: 0, y: 0 },
  dragOffsetStart: { x: 0, y: 0 },
  lastPointer: { x: 0, y: 0 },
};

let audioCtx = null;
let masterGain = null;
let hoverNodeId = null;
let hoverDeactivateId = null;
let themeColors = null;
let lfoDepth = 1;
let lfoArmingId = null;
let lfoArmingStart = 0;
let lfoAnimating = false;
let lastLfoTapTime = 0;
let lastLfoTapId = null;
const activeKeys = new Map();

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const primes = [2, 3, 5, 7, 11, 13];
const GRID_COLS = 20;
const GRID_ROWS = 20;
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
const ISOMETRIC_ROWS = [
  { keys: "1234567890", yOffset: -2 },
  { keys: "qwertyuiop", yOffset: -1 },
  { keys: "asdfghjkl", yOffset: 0 },
  { keys: "zxcvbnm", yOffset: 1 },
];
const DEACTIVATE_SIZE = 8;
let nodes = [];
let nodeById = new Map();
let edges = [];
let voices = [];
let pitchInstances = [];
let nextVoiceId = 1;
const MIN_FREQ = 40;
const MAX_FREQ = 19000;

function buildLattice() {
  const result = [];
  const cols = GRID_COLS;
  const rows = GRID_ROWS;
  const spacing = 120;
  let id = 0;
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const ratioX = Number(ratioXSelect.value) || 3;
  const ratioY = Number(ratioYSelect.value) || 5;
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const pitchIndex = y * cols + x;
      const exponentX = x - centerX;
      const exponentY = centerY - y;
      const baseRatio = buildRatioComponents(ratioX, ratioY, exponentX, exponentY);
      const reduced = reduceToOctave(baseRatio.numerator, baseRatio.denominator);
      const etInfo = getNearestEtInfo(fundamental * reduced.ratio, a4);
      const isCenter = exponentX === 0 && exponentY === 0;
      result.push({
        id: id++,
        numerator: reduced.numerator,
        denominator: reduced.denominator,
        exponentX,
        exponentY,
        gridX: x,
        gridY: y,
        coordinate: {
          x: (x - centerX) * spacing,
          y: (y - centerY) * spacing,
        },
        freq: fundamental * reduced.ratio,
        cents_from_et: etInfo.cents,
        note_name: etInfo.name,
        pitch_class: etInfo.pitchClass,
        active: isCenter,
        playing: false,
        volume: 0,
        isCenter,
        baseVoiceId: null,
      });
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
}

function updateNodeRatios() {
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const ratioX = Number(ratioXSelect.value) || 3;
  const ratioY = Number(ratioYSelect.value) || 5;

  nodes.forEach((node) => {
    const baseRatio = buildRatioComponents(ratioX, ratioY, node.exponentX, node.exponentY);
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
    while (freq < MIN_FREQ) {
      freq *= 2;
      octave += 1;
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

function updateNodePlaybackState() {
  nodes.forEach((node) => {
    node.playing = false;
    node._hasLfo = false;
  });
  voices.forEach((voice) => {
    if (voice.releasing) {
      return;
    }
    const node = nodeById.get(voice.nodeId);
    if (!node) {
      return;
    }
    node.playing = true;
    if (voice.lfoActive) {
      node._hasLfo = true;
    }
  });
}

function removeVoiceById(voiceId) {
  voices = voices.filter((voice) => voice.id !== voiceId);
  nodes.forEach((node) => {
    if (node.baseVoiceId === voiceId) {
      node.baseVoiceId = null;
    }
  });
  updateNodePlaybackState();
}

function findVoiceById(voiceId) {
  return voices.find((voice) => voice.id === voiceId) || null;
}

function findIsometricRowForKey(key) {
  for (const row of ISOMETRIC_ROWS) {
    const index = row.keys.indexOf(key);
    if (index !== -1) {
      return { row, index };
    }
  }
  return null;
}

function getIsometricAnchorX() {
  const centerY = Math.floor(GRID_ROWS / 2);
  const rowYs = new Set(ISOMETRIC_ROWS.map((row) => centerY + row.yOffset));
  let minX = null;
  let anchorY = null;
  nodes.forEach((node) => {
    if (!node.active || !rowYs.has(node.gridY)) {
      return;
    }
    if (minX == null || node.gridX < minX || (node.gridX === minX && node.gridY < anchorY)) {
      minX = node.gridX;
      anchorY = node.gridY;
    }
  });
  return minX;
}

function getActiveNodesInRow(gridY, minX) {
  return nodes
    .filter((node) => node.active && node.gridY === gridY && node.gridX >= minX)
    .sort((a, b) => a.gridX - b.gridX);
}

function findIsometricNodeForKey(key, compress = false) {
  const centerY = Math.floor(GRID_ROWS / 2);
  const match = findIsometricRowForKey(key);
  if (!match) {
    return null;
  }

  const y = centerY + match.row.yOffset;
  if (y < 0 || y >= GRID_ROWS) {
    return null;
  }

  const baseX = getIsometricAnchorX();
  if (baseX == null) {
    return null;
  }

  if (compress) {
    const activeRow = getActiveNodesInRow(y, baseX);
    return activeRow[match.index] || null;
  }

  const x = baseX + match.index;
  if (x < 0 || x >= GRID_COLS) {
    return null;
  }

  return findNodeByGrid(x, y);

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
  } else if (mode === "iso") {
    const node = findIsometricNodeForKey(key, false);
    if (!node || !node.active) {
      return;
    }
    voice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
      source: "keyboard",
    });
  } else if (mode === "iso-compact") {
    const node = findIsometricNodeForKey(key, true);
    if (!node || !node.active) {
      return;
    }
    voice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
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

function buildEdges(nodesList, cols) {
  const lookup = new Map(nodesList.map((node) => [node.id, node]));
  const edgesList = [];

  nodesList.forEach((node) => {
    const col = node.id % cols;
    const right = lookup.get(node.id + 1);
    const down = lookup.get(node.id + cols);

    if (right && col < cols - 1) {
      edgesList.push([node, right]);
    }

    if (down) {
      edgesList.push([node, down]);
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

function buildRatioComponents(ratioX, ratioY, exponentX, exponentY) {
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

function getDeactivateRect(node) {
  const pos = worldToScreen(node.coordinate);
  const radius = getNodeRadius(node);
  const size = DEACTIVATE_SIZE;
  const padding = 4;
  return {
    x: pos.x - radius - size - padding,
    y: pos.y - radius - size - padding,
    size,
  };
}

function isPointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.size &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.size
  );
}

function findDeactivateNodeAtPoint(screenPoint) {
  for (const node of nodes) {
    if (!node.active || node.isCenter) {
      continue;
    }
    const rect = getDeactivateRect(node);
    if (isPointInRect(screenPoint, rect)) {
      return node;
    }
  }
  return null;
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

function worldToScreen(point) {
  return {
    x: (point.x + view.offsetX) * view.zoom + canvas.clientWidth / 2,
    y: (point.y + view.offsetY) * view.zoom + canvas.clientHeight / 2,
  };
}

function screenToWorld(point) {
  return {
    x: (point.x - canvas.clientWidth / 2) / view.zoom - view.offsetX,
    y: (point.y - canvas.clientHeight / 2) / view.zoom - view.offsetY,
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!themeColors) {
    refreshThemeColors();
  }

  ctx.strokeStyle = themeColors.edge;
  ctx.lineWidth = 1.5;
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    const start = worldToScreen(a.coordinate);
    const end = worldToScreen(b.coordinate);
    const radiusA = getNodeRadius(a);
    const radiusB = getNodeRadius(b);
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

  nodes.forEach((node) => {
    const isHovered = node.id === hoverNodeId;
    const isVisible = node.isCenter || node.active || isHovered;
    const alpha = node.active || node.isCenter ? 1 : isHovered ? 0.3 : 0;

    if (!isVisible) {
      return;
    }

    const pos = worldToScreen(node.coordinate);
    const radius = getNodeRadius(node);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.strokeStyle = themeColors.nodeStroke;
    ctx.lineWidth = 2;
    ctx.fillStyle = node.playing ? themeColors.playFill : "transparent";
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const now = performance.now();
    const lfoPulse = getNodeLfoPulse(node.id, now);
    if (lfoArmingId === node.id || lfoPulse > 0) {
      const pulse =
        lfoArmingId === node.id
          ? 0.6 + 0.4 * Math.sin((now - lfoArmingStart) / 120)
          : lfoPulse;
      ctx.save();
      ctx.globalAlpha = Math.min(alpha, pulse);
      ctx.strokeStyle = themeColors.lfo;
      ctx.lineWidth = lfoPulse > 0 ? 3 : 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

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

    if (hoverDeactivateId === node.id) {
      const rect = getDeactivateRect(node);
      ctx.strokeStyle = themeColors.deactivate;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rect.x, rect.y);
      ctx.lineTo(rect.x + rect.size, rect.y + rect.size);
      ctx.moveTo(rect.x + rect.size, rect.y);
      ctx.lineTo(rect.x, rect.y + rect.size);
      ctx.stroke();
    }
    ctx.restore();
  });

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
  const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
  envGain.gain.setValueAtTime(0.0001, now);
  const attack = Number(attackSlider.value) || 0.02;
  const decay = Number(decaySlider.value) || 0.2;
  const sustain = Number(sustainSlider.value) || 0.6;
  envGain.gain.exponentialRampToValueAtTime(0.2, now + attack);
  envGain.gain.exponentialRampToValueAtTime(0.2 * sustain, now + attack + decay);
  if (isOneShot) {
    const release = Number(releaseSlider.value) || 0.6;
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + release);
  }

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
    lfoHalfPeriod: options.lfoHalfPeriod || 0,
    lfoStartMs: options.lfoStartMs || 0,
    source: options.source || "keyboard",
  };

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
  updateNodePlaybackState();

  if (voice.lfoActive) {
    ensureLfoLoop();
  }

  if (isOneShot) {
    const release = Number(releaseSlider.value) || 0.6;
    const stopAt = now + attack + decay + release + 0.05;
    oscillator.stop(stopAt);
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
  updateNodePlaybackState();

  const now = audioCtx.currentTime;
  const release = immediate ? 0.02 : Number(releaseSlider.value) || 0.6;
  if (envGain) {
    envGain.gain.cancelScheduledValues(now);
    envGain.gain.setValueAtTime(Math.max(envGain.gain.value, 0.0001), now);
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    osc.stop(now + release + 0.05);
  } else {
    osc.stop(now + 0.1);
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

  statusEl.textContent = "Audio: on";
  audioToggle.textContent = "Disable Audio";
}

function disableAudio() {
  if (!audioCtx) {
    return;
  }

  stopAllVoices();
  audioCtx.suspend();
  statusEl.textContent = "Audio: off";
  audioToggle.textContent = "Enable Audio";
}

function toggleAudio() {
  if (!audioCtx || audioCtx.state === "suspended") {
    enableAudio();
  } else {
    disableAudio();
  }
}

function onPointerDown(event) {
  const screenPoint = { x: event.offsetX, y: event.offsetY };
  const world = screenToWorld(screenPoint);
  const hit = hitTest(world);
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
    return;
  }

  view.dragging = true;
  view.dragStart = { x: event.offsetX, y: event.offsetY };
  view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  canvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (!view.dragging) {
    const world = screenToWorld({ x: event.offsetX, y: event.offsetY });
    const hit = hitTest(world);
    const deactivateHit = findDeactivateNodeAtPoint({ x: event.offsetX, y: event.offsetY });
    const nextHoverId = hit ? hit.id : null;
    const nextDeactivateId = deactivateHit ? deactivateHit.id : null;
    if (nextHoverId !== hoverNodeId || nextDeactivateId !== hoverDeactivateId) {
      hoverNodeId = nextHoverId;
      hoverDeactivateId = nextDeactivateId;
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
}

function onPointerUp(event) {
  if (lfoArmingId != null) {
    const now = performance.now();
    const duration = (now - lfoArmingStart) / 1000;
    const node = nodes.find((item) => item.id === lfoArmingId);
    lfoArmingId = null;
    if (node && duration >= 0.15) {
      node.active = true;
      updatePitchInstances();
      const voice = startVoice({
        nodeId: node.id,
        octave: 0,
        freq: node.freq,
        lfoActive: true,
        lfoHalfPeriod: duration,
        lfoStartMs: now,
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

  if (!view.dragging) {
    return;
  }

  const moved = Math.hypot(
    event.offsetX - view.dragStart.x,
    event.offsetY - view.dragStart.y
  );

  view.dragging = false;

  if (moved < 4) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const world = screenToWorld(screenPoint);
    const deactivateHit = findDeactivateNodeAtPoint(screenPoint);
    if (deactivateHit) {
      deactivateHit.active = false;
      stopVoicesForNode(deactivateHit.id, false);
      updatePitchInstances();
      draw();
      return;
    }
    const hit = hitTest(world);
    if (hit) {
      const baseVoice = hit.baseVoiceId ? findVoiceById(hit.baseVoiceId) : null;
      if (baseVoice && baseVoice.lfoActive) {
        stopVoice(baseVoice);
        hit.baseVoiceId = null;
        draw();
        return;
      }
      if (!hit.active) {
        hit.active = true;
        updatePitchInstances();
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
  hoverDeactivateId = null;
  lfoArmingId = null;
  if (view.dragging) {
    view.dragging = false;
  }
  draw();
}

function onWheel(event) {
  event.preventDefault();
  const zoomDelta = event.deltaY > 0 ? 0.92 : 1.08;
  const before = screenToWorld({ x: event.offsetX, y: event.offsetY });
  view.zoom = Math.min(2.2, Math.max(0.5, view.zoom * zoomDelta));
  const after = screenToWorld({ x: event.offsetX, y: event.offsetY });

  view.offsetX += before.x - after.x;
  view.offsetY += before.y - after.y;
  draw();
}

function hitTest(worldPoint) {
  const radius = 36 / view.zoom;
  return nodes.find((node) => {
    const dx = node.coordinate.x - worldPoint.x;
    const dy = node.coordinate.y - worldPoint.y;
    return Math.hypot(dx, dy) <= radius;
  });
}

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.clientWidth * scale);
  canvas.height = Math.floor(canvas.clientHeight * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  draw();
}

function populateRatioSelect(selectEl, defaultValue) {
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

function getLfoValue(voice, nowMs) {
  if (!voice.lfoActive || voice.lfoHalfPeriod <= 0) {
    return 1;
  }
  const elapsed = (nowMs - voice.lfoStartMs) / 1000;
  if (elapsed < 0) {
    return 1;
  }
  const phase = (elapsed / voice.lfoHalfPeriod) % 2;
  return phase <= 1 ? phase : 2 - phase;
}

function getLfoGainValue(voice, nowMs) {
  if (!voice.lfoActive) {
    return 1;
  }
  const value = getLfoValue(voice, nowMs);
  return (1 - lfoDepth) + lfoDepth * value;
}

function getNodeLfoPulse(nodeId, nowMs) {
  let pulse = 0;
  voices.forEach((voice) => {
    if (voice.nodeId === nodeId && voice.lfoActive) {
      pulse = Math.max(pulse, getLfoGainValue(voice, nowMs));
    }
  });
  return pulse;
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

function drawRatioWheel(canvasEl) {
  if (!canvasEl || !themeColors) {
    return;
  }
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

  if (!angles.length) {
    return;
  }

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

function updateRatioWheels() {
  if (ratioWheelDrawer && !ratioWheelDrawer.hidden) {
    drawRatioWheel(ratioWheelLarge);
  }
}

function lfoLoop() {
  const now = performance.now();
  let needsFrame = false;

  voices.forEach((voice) => {
    if (!voice.lfoActive || !voice.lfoGain) {
      return;
    }
    voice.lfoGain.gain.value = getLfoGainValue(voice, now);
    needsFrame = true;
  });

  if (lfoArmingId != null) {
    needsFrame = true;
  }

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
    textPrimary: styles.getPropertyValue("--text-primary").trim() || "#1e1e1e",
    textSecondary: styles.getPropertyValue("--text-secondary").trim() || "#2a2a2a",
    deactivate: styles.getPropertyValue("--deactivate").trim() || "rgba(16, 19, 22, 0.2)",
    lfo: styles.getPropertyValue("--lfo").trim() || "#3b82f6",
    playFill: styles.getPropertyValue("--play-fill").trim() || "#f3d64d",
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
  optionsToggle.setAttribute("aria-expanded", String(!isOpen));
  optionsPanel.hidden = isOpen;
}

function openRatioWheelDrawer() {
  if (!ratioWheelDrawer) {
    return;
  }
  ratioWheelDrawer.hidden = false;
  updateRatioWheels();
}

function closeRatioWheelDrawer() {
  if (!ratioWheelDrawer) {
    return;
  }
  ratioWheelDrawer.hidden = true;
}

function toggleRatioWheelDrawer() {
  if (!ratioWheelDrawer) {
    return;
  }
  if (ratioWheelDrawer.hidden) {
    openRatioWheelDrawer();
  } else {
    closeRatioWheelDrawer();
  }
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

function rebuildLattice() {
  stopAllVoices();
  nodes = buildLattice();
  nodeById = new Map(nodes.map((node) => [node.id, node]));
  edges = buildEdges(nodes, GRID_COLS);
  updatePitchInstances();
  draw();
}

function resetLattice() {
  stopAllVoices();
  activeKeys.clear();
  nodes.forEach((node) => {
    node.active = node.isCenter;
    node.playing = false;
    node.baseVoiceId = null;
  });
  updatePitchInstances();
  view.zoom = 1;
  view.offsetX = 0;
  view.offsetY = 0;
  hoverNodeId = null;
  hoverDeactivateId = null;
  draw();
}

populateRatioSelect(ratioXSelect, 3);
populateRatioSelect(ratioYSelect, 5);
populateWaveformOptions();
populateFundamentalNotes();
updateFundamentalNotes();
fundamentalNoteSelect.value = "60";
onFundamentalNoteChange();
rebuildLattice();

audioToggle.addEventListener("click", toggleAudio);
resetButton.addEventListener("click", resetLattice);
exportScaleButton.addEventListener("click", exportToScaleWorkshop);
if (themeSelect) {
  themeSelect.addEventListener("change", onThemeSelectChange);
}
if (optionsToggle) {
  optionsToggle.addEventListener("click", toggleOptionsPanel);
}
if (ratioWheelToggle) {
  ratioWheelToggle.addEventListener("click", toggleRatioWheelDrawer);
}
if (ratioWheelClose) {
  ratioWheelClose.addEventListener("click", closeRatioWheelDrawer);
}
fundamentalInput.addEventListener("input", updateNodeFrequencies);
ratioXSelect.addEventListener("change", updateNodeRatios);
ratioYSelect.addEventListener("change", updateNodeRatios);
a4Input.addEventListener("input", () => {
  updateFundamentalNotes();
  updateNodeFrequencies();
});
fundamentalNoteSelect.addEventListener("change", onFundamentalNoteChange);
volumeSlider.addEventListener("input", updateVolume);
if (lfoDepthSlider) {
  lfoDepthSlider.addEventListener("input", updateLfoDepth);
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
      source: voice.source,
    });
    if (newVoice && wasBase) {
      wasBase.baseVoiceId = newVoice.id;
    }
  });
});
attackSlider.addEventListener("input", updateEnvelopeReadouts);
decaySlider.addEventListener("input", updateEnvelopeReadouts);
sustainSlider.addEventListener("input", updateEnvelopeReadouts);
releaseSlider.addEventListener("input", updateEnvelopeReadouts);

updateEnvelopeReadouts();
updateLfoDepth();
initTheme();
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointerleave", onPointerLeave);
canvas.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRatioWheelDrawer();
  }
});

resizeCanvas();
