const canvas = document.getElementById("lattice");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const audioToggle = document.getElementById("audio-toggle");
const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const a4Input = document.getElementById("a4");
const ratioXSelect = document.getElementById("ratio-x");
const ratioYSelect = document.getElementById("ratio-y");
const volumeSlider = document.getElementById("volume");
const volumeReadout = document.getElementById("volume-readout");
const keyboardModeRadios = document.querySelectorAll('input[name="keyboard-mode"]');
const waveformSelect = document.getElementById("waveform");
const attackSlider = document.getElementById("attack");
const decaySlider = document.getElementById("decay");
const sustainSlider = document.getElementById("sustain");
const releaseSlider = document.getElementById("release");
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
const activeKeys = new Map();

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const primes = [2, 3, 5, 7, 11, 13];
const GRID_COLS = 20;
const GRID_ROWS = 20;
const KEYBOARD_MAP = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
};
const KEYBOARD_BASE_MIDI = 60;
const ISOMETRIC_ROWS = [
  { keys: "1234567890", yOffset: -2 },
  { keys: "qwertyuiop", yOffset: -1 },
  { keys: "asdfghjkl", yOffset: 0 },
  { keys: "zxcvbnm", yOffset: 1 },
];
let nodes = [];
let edges = [];

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
        oscillator: null,
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
    if (node.oscillator) {
      node.oscillator.frequency.setTargetAtTime(node.freq, audioCtx.currentTime, 0.01);
    }
  });
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
    if (node.oscillator) {
      node.oscillator.frequency.setTargetAtTime(node.freq, audioCtx.currentTime, 0.01);
    }
  });

  draw();
}

function getKeyboardMode() {
  const selected = Array.from(keyboardModeRadios).find((radio) => radio.checked);
  return selected ? selected.value : "off";
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

function getLeftmostActiveCenterX() {
  const centerY = Math.floor(GRID_ROWS / 2);
  let minX = null;
  nodes.forEach((node) => {
    if (node.active && node.gridY === centerY) {
      if (minX == null || node.gridX < minX) {
        minX = node.gridX;
      }
    }
  });
  return minX;
}

function findIsometricNodeForKey(key) {
  const centerY = Math.floor(GRID_ROWS / 2);
  const baseX = getLeftmostActiveCenterX();
  if (baseX == null) {
    return null;
  }

  for (const row of ISOMETRIC_ROWS) {
    const index = row.keys.indexOf(key);
    if (index === -1) {
      continue;
    }
    const x = baseX + index;
    const y = centerY + row.yOffset;
    if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) {
      return null;
    }
    return findNodeByGrid(x, y);
  }

  return null;
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
  let node = null;

  if (mode === "piano") {
    if (!(key in KEYBOARD_MAP)) {
      return;
    }
    const targetMidi = KEYBOARD_BASE_MIDI + KEYBOARD_MAP[key];
    node = findNodeForMidi(targetMidi, a4);
  } else if (mode === "iso") {
    node = findIsometricNodeForKey(key);
  }

  if (!node || !node.active) {
    return;
  }

  node.playing = true;
  startNodeTone(node);
  activeKeys.set(key, node.id);
  draw();
}

function handleKeyUp(event) {
  const mode = getKeyboardMode();
  if (mode === "off") {
    return;
  }

  const key = event.key.toLowerCase();
  const nodeId = activeKeys.get(key);
  if (nodeId == null) {
    return;
  }

  const node = nodes.find((item) => item.id === nodeId);
  if (node) {
    node.playing = false;
    stopNodeTone(node);
  }
  activeKeys.delete(key);
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

  ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
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
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 2;
    ctx.fillStyle = node.playing ? "#f3d64d" : "transparent";
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1e1e1e";
    ctx.font = "21px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${node.numerator}:${node.denominator}`, pos.x, pos.y);

    ctx.font = "11px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const cents = Math.round(node.cents_from_et);
    const centsLabel = `${cents >= 0 ? "+" : ""}${cents}¢`;
    ctx.fillText(`${node.note_name} ${centsLabel}`, pos.x + radius + 6, pos.y + radius - 10);
    ctx.restore();
  });
}

function startNodeTone(node) {
  if (!audioCtx || !masterGain) {
    return;
  }

  if (audioCtx.state !== "running") {
    return;
  }

  if (node.oscillator) {
    return;
  }

  const now = audioCtx.currentTime;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = waveformSelect.value || "sine";
  oscillator.frequency.value = node.freq;
  gain.gain.setValueAtTime(0.0001, now);
  const attack = Number(attackSlider.value) || 0.02;
  const decay = Number(decaySlider.value) || 0.2;
  const sustain = Number(sustainSlider.value) || 0.6;
  gain.gain.exponentialRampToValueAtTime(0.2, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.2 * sustain, now + attack + decay);

  oscillator.connect(gain).connect(masterGain);
  oscillator.start(now);

  node.oscillator = oscillator;
  node._gain = gain;
}

function stopNodeTone(node) {
  if (!node.oscillator || !audioCtx) {
    return;
  }

  const osc = node.oscillator;
  const gain = node._gain;
  node.oscillator = null;
  node._gain = null;

  const now = audioCtx.currentTime;
  if (gain) {
    const release = Number(releaseSlider.value) || 0.6;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    osc.stop(now + release + 0.05);
  } else {
    osc.stop(now + 0.1);
  }

  osc.onended = () => {
    osc.disconnect();
    if (gain) {
      gain.disconnect();
    }
  };
}

function stopAllTones() {
  nodes.forEach((node) => {
    node.playing = false;
    stopNodeTone(node);
  });
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

  stopAllTones();
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
}

function onPointerUp(event) {
  if (!view.dragging) {
    return;
  }

  const moved = Math.hypot(
    event.offsetX - view.dragStart.x,
    event.offsetY - view.dragStart.y
  );

  view.dragging = false;

  if (moved < 4) {
    const world = screenToWorld({ x: event.offsetX, y: event.offsetY });
    const hit = hitTest(world);
    if (hit) {
      if (!hit.active) {
        hit.active = true;
        hit.playing = false;
      } else {
        hit.playing = !hit.playing;
        if (hit.playing) {
          startNodeTone(hit);
        } else {
          stopNodeTone(hit);
        }
      }
    }
    draw();
  }
}

function onPointerLeave() {
  hoverNodeId = null;
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

function rebuildLattice() {
  stopAllTones();
  nodes = buildLattice();
  edges = buildEdges(nodes, GRID_COLS);
  draw();
}

populateRatioSelect(ratioXSelect, 3);
populateRatioSelect(ratioYSelect, 5);
populateFundamentalNotes();
updateFundamentalNotes();
fundamentalNoteSelect.value = "48";
onFundamentalNoteChange();
rebuildLattice();

audioToggle.addEventListener("click", toggleAudio);
fundamentalInput.addEventListener("input", updateNodeFrequencies);
ratioXSelect.addEventListener("change", updateNodeRatios);
ratioYSelect.addEventListener("change", updateNodeRatios);
a4Input.addEventListener("input", () => {
  updateFundamentalNotes();
  updateNodeFrequencies();
});
fundamentalNoteSelect.addEventListener("change", onFundamentalNoteChange);
volumeSlider.addEventListener("input", updateVolume);
waveformSelect.addEventListener("change", () => {
  nodes.forEach((node) => {
    if (node.oscillator) {
      node.oscillator.type = waveformSelect.value;
    }
  });
});
attackSlider.addEventListener("input", updateEnvelopeReadouts);
decaySlider.addEventListener("input", updateEnvelopeReadouts);
sustainSlider.addEventListener("input", updateEnvelopeReadouts);
releaseSlider.addEventListener("input", updateEnvelopeReadouts);

updateEnvelopeReadouts();
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointerleave", onPointerLeave);
canvas.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

resizeCanvas();
