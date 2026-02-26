const SVG_NS = "http://www.w3.org/2000/svg";

const chartStage = document.getElementById("chart-stage");
const tooltipEl = document.getElementById("chart-tooltip");
const statusEl = document.getElementById("status");

const notesInput = document.getElementById("notes-input");
const ratioRootHzInput = document.getElementById("ratio-root-hz");
const a4HzInput = document.getElementById("a4-hz");
const overtoneCountInput = document.getElementById("overtone-count");
const overtoneCountReadout = document.getElementById("overtone-count-readout");
const yScaleInput = document.getElementById("y-scale");
const autoRangeInput = document.getElementById("auto-range");
const rangeMinInput = document.getElementById("range-min");
const rangeMaxInput = document.getElementById("range-max");
const alignToleranceInput = document.getElementById("align-tolerance");
const alignToleranceReadout = document.getElementById("align-tolerance-readout");
const pointSizeInput = document.getElementById("point-size");
const showAlignmentsInput = document.getElementById("show-alignments");
const showLabelsInput = document.getElementById("show-labels");
const showOvertoneNumbersInput = document.getElementById("show-overtone-numbers");
const showCombinationInput = document.getElementById("show-combination");
const fusionControls = document.getElementById("fusion-controls");
const showFusionInput = document.getElementById("show-fusion");
const fusionClusterCentsInput = document.getElementById("fusion-cluster-cents");
const fusionClusterCentsReadout = document.getElementById("fusion-cluster-cents-readout");
const roughnessControls = document.getElementById("roughness-controls");
const showRoughnessInput = document.getElementById("show-roughness");
const roughnessAnimateInput = document.getElementById("roughness-animate");
const roughnessBeatMinInput = document.getElementById("roughness-beat-min");
const roughnessBeatMaxInput = document.getElementById("roughness-beat-max");
const comboDifferenceInput = document.getElementById("combo-difference");
const comboSumInput = document.getElementById("combo-sum");
const comboOrder2Input = document.getElementById("combo-order2");
const combinationControls = document.getElementById("combination-controls");
const volumeInput = document.getElementById("volume");
const waveformInput = document.getElementById("waveform");
const attackInput = document.getElementById("attack");
const decayInput = document.getElementById("decay");
const sustainInput = document.getElementById("sustain");
const releaseInput = document.getElementById("release");
const lfoDepthInput = document.getElementById("lfo-depth");
const lfoRateInput = document.getElementById("lfo-rate");
const allNotesOffButton = document.getElementById("all-notes-off");
const exportWidthInput = document.getElementById("export-width");
const exportHeightInput = document.getElementById("export-height");
const exportSvgButton = document.getElementById("export-svg");
const exportPdfButton = document.getElementById("export-pdf");
const themeToggle = document.getElementById("theme-toggle");

const state = {
  notesText: notesInput.value,
  ratioRootHz: Number(ratioRootHzInput.value) || 220,
  a4Hz: Number(a4HzInput.value) || 440,
  overtoneCount: Number(overtoneCountInput.value) || 16,
  yScale: yScaleInput.value === "linear" ? "linear" : "log",
  autoRange: autoRangeInput.checked,
  rangeMin: Number(rangeMinInput.value) || 40,
  rangeMax: Number(rangeMaxInput.value) || 6000,
  alignToleranceCents: Number(alignToleranceInput.value) || 1,
  pointSize: Number(pointSizeInput.value) || 4,
  showAlignments: showAlignmentsInput.checked,
  showLabels: showLabelsInput.checked,
  showOvertoneNumbers: showOvertoneNumbersInput ? showOvertoneNumbersInput.checked : true,
  showCombination: showCombinationInput.checked,
  showFusion: showFusionInput ? showFusionInput.checked : true,
  fusionClusterCents: Number(fusionClusterCentsInput?.value ?? 1) || 1,
  showRoughness: showRoughnessInput ? showRoughnessInput.checked : true,
  roughnessAnimate: roughnessAnimateInput ? roughnessAnimateInput.checked : true,
  roughnessBeatMinHz: Number(roughnessBeatMinInput?.value ?? 0.5) || 0.5,
  roughnessBeatMaxHz: Number(roughnessBeatMaxInput?.value ?? 20) || 20,
  showComboDifference: comboDifferenceInput.checked,
  showComboSum: comboSumInput.checked,
  showComboOrder2: comboOrder2Input.checked,
  synthVolumeDb: Number(volumeInput?.value ?? -12),
  synthWaveform: waveformInput?.value || "sine",
  synthAttack: Number(attackInput?.value ?? 0.02),
  synthDecay: Number(decayInput?.value ?? 0.2),
  synthSustain: Number(sustainInput?.value ?? 0.6),
  synthRelease: Number(releaseInput?.value ?? 0.6),
  lfoDepth: Number(lfoDepthInput?.value ?? 0.65),
  lfoRateControl: Number(lfoRateInput?.value ?? 50),
  exportWidth: Number(exportWidthInput.value) || 1800,
  exportHeight: Number(exportHeightInput.value) || 1100,
  themeDark: false,
};

const OVERTONES_STATE_PARAM = "o";

let chartModel = null;
let renderTimer = null;
let highlightedSourceDots = [];
let lKeyHeld = false;
let lfoArm = null;
let alignmentFocusMode = false;
let stateUrlTimer = null;
let suspendStateUrlSync = false;

let audioCtx = null;
let masterGain = null;
const activeVoices = new Map();
const playingTargets = new Map();
const lfoTargetStates = new Map();
let spaceRecallTargets = new Map();
let spaceMuted = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function encodeStateBase64Url(value) {
  const json = JSON.stringify(value);
  const utf8 = encodeURIComponent(json).replace(
    /%([0-9A-F]{2})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16))
  );
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeStateBase64Url(encoded) {
  const normalized = String(encoded || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  const binary = atob(padded);
  const escaped = Array.from(binary)
    .map((ch) => `%${ch.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");
  return JSON.parse(decodeURIComponent(escaped));
}

function getSerializedState() {
  return {
    notesText: state.notesText,
    ratioRootHz: state.ratioRootHz,
    a4Hz: state.a4Hz,
    overtoneCount: state.overtoneCount,
    yScale: state.yScale,
    autoRange: state.autoRange,
    rangeMin: state.rangeMin,
    rangeMax: state.rangeMax,
    alignToleranceCents: state.alignToleranceCents,
    pointSize: state.pointSize,
    showAlignments: state.showAlignments,
    showLabels: state.showLabels,
    showOvertoneNumbers: state.showOvertoneNumbers,
    showCombination: state.showCombination,
    showFusion: state.showFusion,
    fusionClusterCents: state.fusionClusterCents,
    showRoughness: state.showRoughness,
    roughnessAnimate: state.roughnessAnimate,
    roughnessBeatMinHz: state.roughnessBeatMinHz,
    roughnessBeatMaxHz: state.roughnessBeatMaxHz,
    showComboDifference: state.showComboDifference,
    showComboSum: state.showComboSum,
    showComboOrder2: state.showComboOrder2,
    synthVolumeDb: state.synthVolumeDb,
    synthWaveform: state.synthWaveform,
    synthAttack: state.synthAttack,
    synthDecay: state.synthDecay,
    synthSustain: state.synthSustain,
    synthRelease: state.synthRelease,
    lfoDepth: state.lfoDepth,
    lfoRateControl: state.lfoRateControl,
    exportWidth: state.exportWidth,
    exportHeight: state.exportHeight,
    themeDark: state.themeDark,
  };
}

function updateStateUrl() {
  if (suspendStateUrlSync) {
    return;
  }
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
  hashParams.set(OVERTONES_STATE_PARAM, encodeStateBase64Url(getSerializedState()));
  const nextHash = hashParams.toString();
  if (location.hash === `#${nextHash}`) {
    return;
  }
  history.replaceState(null, "", `${location.pathname}${location.search}#${nextHash}`);
}

function scheduleStateUrlUpdate(delay = 220) {
  if (suspendStateUrlSync) {
    return;
  }
  if (stateUrlTimer) {
    clearTimeout(stateUrlTimer);
  }
  stateUrlTimer = setTimeout(() => {
    stateUrlTimer = null;
    updateStateUrl();
  }, delay);
}

function readStateFromUrl() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) {
    return null;
  }
  const params = new URLSearchParams(hash);
  const encoded = params.get(OVERTONES_STATE_PARAM);
  if (!encoded) {
    return null;
  }
  try {
    return decodeStateBase64Url(encoded);
  } catch {
    return null;
  }
}

function applyStateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }
  suspendStateUrlSync = true;
  try {
    if (typeof snapshot.notesText === "string") {
      state.notesText = snapshot.notesText;
      notesInput.value = snapshot.notesText;
    }
    if (Number.isFinite(snapshot.ratioRootHz)) {
      state.ratioRootHz = Math.max(0.01, Number(snapshot.ratioRootHz));
      ratioRootHzInput.value = String(state.ratioRootHz);
    }
    if (Number.isFinite(snapshot.a4Hz)) {
      state.a4Hz = Math.max(1, Number(snapshot.a4Hz));
      a4HzInput.value = String(state.a4Hz);
    }
    if (Number.isFinite(snapshot.overtoneCount)) {
      state.overtoneCount = clamp(Math.round(Number(snapshot.overtoneCount)), 2, 48);
      overtoneCountInput.value = String(state.overtoneCount);
    }
    if (snapshot.yScale === "linear" || snapshot.yScale === "log") {
      state.yScale = snapshot.yScale;
      yScaleInput.value = state.yScale;
    }
    if (typeof snapshot.autoRange === "boolean") {
      state.autoRange = snapshot.autoRange;
      autoRangeInput.checked = snapshot.autoRange;
    }
    if (Number.isFinite(snapshot.rangeMin)) {
      state.rangeMin = Math.max(0.01, Number(snapshot.rangeMin));
      rangeMinInput.value = String(state.rangeMin);
    }
    if (Number.isFinite(snapshot.rangeMax)) {
      state.rangeMax = Math.max(state.rangeMin + 0.01, Number(snapshot.rangeMax));
      rangeMaxInput.value = String(state.rangeMax);
    }
    if (Number.isFinite(snapshot.alignToleranceCents)) {
      state.alignToleranceCents = clamp(Number(snapshot.alignToleranceCents), 1, 4);
      alignToleranceInput.value = String(state.alignToleranceCents);
    }
    if (Number.isFinite(snapshot.pointSize)) {
      state.pointSize = clamp(Number(snapshot.pointSize), 2, 10);
      pointSizeInput.value = String(state.pointSize);
    }
    if (typeof snapshot.showAlignments === "boolean") {
      state.showAlignments = snapshot.showAlignments;
      showAlignmentsInput.checked = snapshot.showAlignments;
    }
    if (typeof snapshot.showLabels === "boolean") {
      state.showLabels = snapshot.showLabels;
      showLabelsInput.checked = snapshot.showLabels;
    }
    if (typeof snapshot.showOvertoneNumbers === "boolean" && showOvertoneNumbersInput) {
      state.showOvertoneNumbers = snapshot.showOvertoneNumbers;
      showOvertoneNumbersInput.checked = snapshot.showOvertoneNumbers;
    }
    if (typeof snapshot.showCombination === "boolean") {
      state.showCombination = snapshot.showCombination;
      showCombinationInput.checked = snapshot.showCombination;
    }
    if (typeof snapshot.showFusion === "boolean" && showFusionInput) {
      state.showFusion = snapshot.showFusion;
      showFusionInput.checked = snapshot.showFusion;
    }
    if (Number.isFinite(snapshot.fusionClusterCents) && fusionClusterCentsInput) {
      state.fusionClusterCents = clamp(Number(snapshot.fusionClusterCents), 1, 4);
      fusionClusterCentsInput.value = String(state.fusionClusterCents);
    }
    if (typeof snapshot.showRoughness === "boolean" && showRoughnessInput) {
      state.showRoughness = snapshot.showRoughness;
      showRoughnessInput.checked = snapshot.showRoughness;
    }
    if (typeof snapshot.roughnessAnimate === "boolean" && roughnessAnimateInput) {
      state.roughnessAnimate = snapshot.roughnessAnimate;
      roughnessAnimateInput.checked = snapshot.roughnessAnimate;
    }
    if (Number.isFinite(snapshot.roughnessBeatMinHz) && roughnessBeatMinInput) {
      state.roughnessBeatMinHz = clamp(Number(snapshot.roughnessBeatMinHz), 0.1, 40);
      roughnessBeatMinInput.value = String(state.roughnessBeatMinHz);
    }
    if (Number.isFinite(snapshot.roughnessBeatMaxHz) && roughnessBeatMaxInput) {
      state.roughnessBeatMaxHz = clamp(Number(snapshot.roughnessBeatMaxHz), 0.1, 80);
      roughnessBeatMaxInput.value = String(state.roughnessBeatMaxHz);
    }
    if (state.roughnessBeatMaxHz <= state.roughnessBeatMinHz) {
      state.roughnessBeatMaxHz = clamp(state.roughnessBeatMinHz + 0.5, 0.2, 80);
      if (roughnessBeatMaxInput) {
        roughnessBeatMaxInput.value = String(state.roughnessBeatMaxHz);
      }
    }
    if (typeof snapshot.showComboDifference === "boolean") {
      state.showComboDifference = snapshot.showComboDifference;
      comboDifferenceInput.checked = snapshot.showComboDifference;
    }
    if (typeof snapshot.showComboSum === "boolean") {
      state.showComboSum = snapshot.showComboSum;
      comboSumInput.checked = snapshot.showComboSum;
    }
    if (typeof snapshot.showComboOrder2 === "boolean") {
      state.showComboOrder2 = snapshot.showComboOrder2;
      comboOrder2Input.checked = snapshot.showComboOrder2;
    }
    if (Number.isFinite(snapshot.synthVolumeDb)) {
      state.synthVolumeDb = clamp(Number(snapshot.synthVolumeDb), -60, 0);
      if (volumeInput) volumeInput.value = String(state.synthVolumeDb);
    }
    if (
      snapshot.synthWaveform === "sine" ||
      snapshot.synthWaveform === "triangle" ||
      snapshot.synthWaveform === "sawtooth" ||
      snapshot.synthWaveform === "square"
    ) {
      state.synthWaveform = snapshot.synthWaveform;
      if (waveformInput) waveformInput.value = state.synthWaveform;
    }
    if (Number.isFinite(snapshot.synthAttack)) {
      state.synthAttack = Math.max(0.005, Number(snapshot.synthAttack));
      if (attackInput) attackInput.value = String(state.synthAttack);
    }
    if (Number.isFinite(snapshot.synthDecay)) {
      state.synthDecay = Math.max(0.01, Number(snapshot.synthDecay));
      if (decayInput) decayInput.value = String(state.synthDecay);
    }
    if (Number.isFinite(snapshot.synthSustain)) {
      state.synthSustain = clamp(Number(snapshot.synthSustain), 0, 1);
      if (sustainInput) sustainInput.value = String(state.synthSustain);
    }
    if (Number.isFinite(snapshot.synthRelease)) {
      state.synthRelease = Math.max(0.01, Number(snapshot.synthRelease));
      if (releaseInput) releaseInput.value = String(state.synthRelease);
    }
    if (Number.isFinite(snapshot.lfoDepth)) {
      state.lfoDepth = clamp(Number(snapshot.lfoDepth), 0, 1);
      if (lfoDepthInput) lfoDepthInput.value = String(state.lfoDepth);
    }
    if (Number.isFinite(snapshot.lfoRateControl)) {
      state.lfoRateControl = clamp(Number(snapshot.lfoRateControl), 0, 100);
      if (lfoRateInput) lfoRateInput.value = String(state.lfoRateControl);
    }
    if (Number.isFinite(snapshot.exportWidth)) {
      state.exportWidth = clampExportSize(Number(snapshot.exportWidth), 1800);
      exportWidthInput.value = String(state.exportWidth);
    }
    if (Number.isFinite(snapshot.exportHeight)) {
      state.exportHeight = clampExportSize(Number(snapshot.exportHeight), 1100);
      exportHeightInput.value = String(state.exportHeight);
    }
    if (typeof snapshot.themeDark === "boolean") {
      state.themeDark = snapshot.themeDark;
      themeToggle.checked = snapshot.themeDark;
      document.body.classList.toggle("theme-dark", snapshot.themeDark);
    }
  } finally {
    suspendStateUrlSync = false;
  }
}

function formatHz(freq) {
  if (!Number.isFinite(freq)) {
    return "--";
  }
  if (freq >= 1000) {
    return `${freq.toFixed(1)} Hz`;
  }
  return `${freq.toFixed(2)} Hz`;
}

function isEditableTarget(target) {
  if (!(target instanceof Element)) {
    return false;
  }
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.closest('input, textarea, select, [contenteditable="true"]')
  );
}

function lfoRateFromControl(value) {
  const normalized = clamp(Number(value) || 0, 0, 100) / 100;
  return 0.1 * 100 ** normalized;
}

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 10 ** (state.synthVolumeDb / 20);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

function stopVoiceForKey(key, immediate = false) {
  const voice = activeVoices.get(key);
  if (!voice || !audioCtx) {
    return;
  }
  const now = audioCtx.currentTime;
  const release = immediate ? 0.02 : Math.max(0.01, state.synthRelease);

  voice.ampGain.gain.cancelScheduledValues(now);
  voice.ampGain.gain.setValueAtTime(Math.max(0.0001, voice.ampGain.gain.value), now);
  voice.ampGain.gain.exponentialRampToValueAtTime(0.0001, now + release);
  try {
    voice.osc.stop(now + release + 0.02);
  } catch {}
  if (voice.lfoOsc) {
    try {
      voice.lfoOsc.stop(now + release + 0.02);
    } catch {}
  }
  activeVoices.delete(key);
}

function setVoiceLfoForKey(key, lfoState) {
  const voice = activeVoices.get(key);
  if (!voice || !audioCtx) {
    return;
  }
  const now = audioCtx.currentTime;
  const depth = clamp(state.lfoDepth, 0, 1);
  const sustainLevel = Math.max(0.0001, 0.2 * clamp(state.synthSustain, 0, 1));
  if (!lfoState || lfoState.mode === "off") {
    if (voice.lfoOsc) {
      try {
        voice.lfoOsc.stop(now + 0.01);
      } catch {}
      voice.lfoOsc.disconnect();
      voice.lfoDepthGain.disconnect();
      voice.lfoOsc = null;
      voice.lfoDepthGain = null;
    }
    voice.ampGain.gain.cancelScheduledValues(now);
    voice.ampGain.gain.setTargetAtTime(sustainLevel, now, 0.03);
    return;
  }
  if (lfoState.mode === "stable") {
    if (voice.lfoOsc) {
      try {
        voice.lfoOsc.stop(now + 0.01);
      } catch {}
      voice.lfoOsc.disconnect();
      voice.lfoDepthGain.disconnect();
      voice.lfoOsc = null;
      voice.lfoDepthGain = null;
    }
    voice.ampGain.gain.cancelScheduledValues(now);
    voice.ampGain.gain.setTargetAtTime(sustainLevel, now, 0.03);
    return;
  }

  const periodSec = Math.max(0.06, Number(lfoState.periodSec) || 1);
  const rate = 1 / periodSec;
  if (lfoState.mode === "cycle") {
    if (!voice.lfoOsc) {
      const lfoOsc = audioCtx.createOscillator();
      const lfoDepthGain = audioCtx.createGain();
      lfoOsc.type = "sine";
      lfoOsc.frequency.value = rate;
      lfoDepthGain.gain.value = depth;
      lfoOsc.connect(lfoDepthGain);
      lfoDepthGain.connect(voice.ampGain.gain);
      voice.lfoOsc = lfoOsc;
      voice.lfoDepthGain = lfoDepthGain;
      voice.ampGain.gain.cancelScheduledValues(now);
      voice.ampGain.gain.setValueAtTime(Math.max(0.0001, voice.ampGain.gain.value), now);
      lfoOsc.start(now);
    } else {
      voice.lfoOsc.frequency.setValueAtTime(rate, now);
      voice.lfoDepthGain.gain.setValueAtTime(depth, now);
    }
  }
}

function resolveTargetFrequency(target) {
  if (!target) {
    return NaN;
  }
  if (target.kind === "harmonic") {
    const note = chartModel?.notes?.[target.noteIndex];
    if (!note) {
      return NaN;
    }
    return note.freq * target.harmonic;
  }
  if (target.kind === "combo") {
    return target.freq;
  }
  return Number(target.freq);
}

function startVoiceForTarget(key, target, { lfoState = null } = {}) {
  const freq = resolveTargetFrequency(target);
  if (!(freq > 0)) {
    return;
  }
  ensureAudioContext();
  if (!audioCtx || !masterGain) {
    return;
  }
  stopVoiceForKey(key, true);

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const ampGain = audioCtx.createGain();
  osc.type = state.synthWaveform;
  osc.frequency.setValueAtTime(freq, now);
  ampGain.gain.setValueAtTime(0.0001, now);
  osc.connect(ampGain);
  ampGain.connect(masterGain);
  osc.start(now);

  const attack = Math.max(0.005, state.synthAttack);
  const decay = Math.max(0.01, state.synthDecay);
  const sustain = clamp(state.synthSustain, 0, 1);
  ampGain.gain.exponentialRampToValueAtTime(0.2, now + attack);
  ampGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.2 * sustain), now + attack + decay);

  activeVoices.set(key, { key, osc, ampGain, lfoOsc: null, lfoDepthGain: null });
  if (lfoState) {
    setVoiceLfoForKey(key, lfoState);
  }
}

function refreshActiveVoicesFromState() {
  const validKeys = new Set();
  Array.from(playingTargets.entries()).forEach(([key, target]) => {
    const freq = resolveTargetFrequency(target);
    if (freq > 0) {
      validKeys.add(key);
      return;
    }
    playingTargets.delete(key);
    lfoTargetStates.delete(key);
  });

  Array.from(activeVoices.keys()).forEach((key) => {
    if (!validKeys.has(key)) {
      stopVoiceForKey(key, true);
    }
  });

  validKeys.forEach((key) => {
    const target = playingTargets.get(key);
    if (!target) {
      return;
    }
    const lfoState = lfoTargetStates.get(key) || null;
    const targetFreq = resolveTargetFrequency(target);
    if (!(targetFreq > 0)) {
      return;
    }
    if (!activeVoices.has(key)) {
      startVoiceForTarget(key, target, { lfoState });
      return;
    }
    const voice = activeVoices.get(key);
    if (voice) {
      voice.osc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.02);
      setVoiceLfoForKey(key, lfoState);
    }
  });
}

function toggleTargetPlayback(key, target) {
  if (!key || !target) {
    return;
  }
  spaceMuted = false;
  spaceRecallTargets = new Map();
  if (playingTargets.has(key)) {
    playingTargets.delete(key);
    lfoTargetStates.delete(key);
    stopVoiceForKey(key);
    return;
  }
  playingTargets.set(key, target);
  startVoiceForTarget(key, target, { lfoState: lfoTargetStates.get(key) || null });
  scheduleRender();
}

function toggleTargetLfo(key, target) {
  if (!key || !target) {
    return;
  }
  spaceMuted = false;
  spaceRecallTargets = new Map();
  const current = lfoTargetStates.get(key) || null;
  if (current && current.mode === "cycle") {
    lfoTargetStates.set(key, { mode: "stable", periodSec: current.periodSec });
    setVoiceLfoForKey(key, { mode: "stable", periodSec: current.periodSec });
    scheduleRender();
    return;
  }
  if (current && current.mode === "stable") {
    lfoTargetStates.delete(key);
    setVoiceLfoForKey(key, null);
    playingTargets.delete(key);
    stopVoiceForKey(key);
    scheduleRender();
    return;
  }
  const period = 1 / lfoRateFromControl(state.lfoRateControl);
  const next = { mode: "cycle", periodSec: period };
  lfoTargetStates.set(key, next);
  if (!playingTargets.has(key)) {
    playingTargets.set(key, target);
    startVoiceForTarget(key, target, { lfoState: next });
    scheduleRender();
    return;
  }
  setVoiceLfoForKey(key, next);
  scheduleRender();
}

function armTargetLfoCycle(key, target) {
  if (!key || !target) {
    return;
  }
  const nowMs = performance.now();
  lfoArm = { key, target, startMs: nowMs };
  if (!playingTargets.has(key)) {
    playingTargets.set(key, target);
    startVoiceForTarget(key, target, { lfoState: null });
    scheduleRender();
  }
}

function commitLfoArmIfNeeded() {
  if (!lfoArm) {
    return;
  }
  const elapsedMs = Math.max(80, performance.now() - lfoArm.startMs);
  const periodSec = clamp(elapsedMs / 1000, 0.08, 8);
  const next = { mode: "cycle", periodSec };
  lfoTargetStates.set(lfoArm.key, next);
  if (!playingTargets.has(lfoArm.key)) {
    playingTargets.set(lfoArm.key, lfoArm.target);
    startVoiceForTarget(lfoArm.key, lfoArm.target, { lfoState: next });
  } else {
    setVoiceLfoForKey(lfoArm.key, next);
  }
  lfoArm = null;
  scheduleRender();
}

function hardAllNotesOff() {
  Array.from(activeVoices.keys()).forEach((key) => stopVoiceForKey(key, true));
  playingTargets.clear();
  lfoTargetStates.clear();
  spaceRecallTargets = new Map();
  spaceMuted = false;
  lfoArm = null;
  scheduleRender();
}

function toggleSpacePlayback() {
  const currentlyPlaying = Array.from(playingTargets.entries()).map(([key, target]) => ({
    key,
    target,
    lfo: lfoTargetStates.get(key) || null,
  }));
  if (currentlyPlaying.length) {
    spaceRecallTargets = new Map(currentlyPlaying.map((entry) => [entry.key, entry]));
    currentlyPlaying.forEach((entry) => stopVoiceForKey(entry.key, false));
    playingTargets.clear();
    spaceMuted = true;
    scheduleRender();
    return;
  }
  if (spaceMuted && spaceRecallTargets.size) {
    Array.from(spaceRecallTargets.entries()).forEach(([key, entry]) => {
      if (resolveTargetFrequency(entry.target) > 0) {
        playingTargets.set(key, entry.target);
        if (entry.lfo) {
          lfoTargetStates.set(key, entry.lfo);
        }
      }
    });
    refreshActiveVoicesFromState();
    spaceMuted = false;
    scheduleRender();
  }
}

function updateMasterVolume() {
  if (!masterGain || !audioCtx) {
    return;
  }
  const now = audioCtx.currentTime;
  const target = 10 ** (state.synthVolumeDb / 20);
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(target, now, 0.02);
}

function updateActiveLfoSettings() {
  Array.from(activeVoices.keys()).forEach((key) => {
    const stateForKey = lfoTargetStates.get(key);
    if (stateForKey && stateForKey.mode === "cycle") {
      setVoiceLfoForKey(key, stateForKey);
    }
  });
}

function getLfoPulseLevelForKey(key, nowSec) {
  const lfoState = lfoTargetStates.get(key);
  if (!lfoState || lfoState.mode === "off") {
    return 1;
  }
  if (lfoState.mode === "stable") {
    return 1;
  }
  const periodSec = Math.max(0.06, Number(lfoState.periodSec) || 1);
  const phase = ((nowSec % periodSec) / periodSec) * Math.PI * 2;
  const osc = 0.5 + 0.5 * Math.sin(phase);
  return 0.25 + 0.75 * osc;
}

function startVisualAnimationLoop(svg) {
  const run = () => {
    if (!document.body.contains(svg)) {
      return;
    }
    const nowSec = performance.now() / 1000;
    const playingElements = svg.querySelectorAll("[data-playing='1'][data-play-key]");
    playingElements.forEach((element) => {
      const key = element.getAttribute("data-play-key");
      const pulse = getLfoPulseLevelForKey(key, nowSec);
      element.setAttribute("stroke-opacity", String(pulse));
    });
    const roughElements = svg.querySelectorAll("[data-rough-animate='1'][data-rough-rate]");
    roughElements.forEach((element) => {
      const rateHz = clamp(Number(element.getAttribute("data-rough-rate")) || 0, 0.2, 20);
      const base = clamp(Number(element.getAttribute("data-rough-base-opacity")) || 0.2, 0.02, 1);
      const osc = 0.5 + 0.5 * Math.sin(nowSec * Math.PI * 2 * rateHz);
      const opacity = clamp(base * (0.72 + 0.28 * osc), 0.02, 1);
      if (element.tagName === "line") {
        element.setAttribute("stroke-opacity", String(opacity));
      } else {
        element.setAttribute("fill-opacity", String(opacity));
      }
    });
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function centsBetween(f1, f2) {
  if (!(f1 > 0) || !(f2 > 0)) {
    return Infinity;
  }
  return 1200 * Math.log2(f2 / f1);
}

function parseNoteToken(token, ratioRootHz, a4Hz) {
  const notes = [];
  const errors = [];
  const hzMatch = token.match(/^([0-9]+(?:\.[0-9]+)?)hz$/i);
  const ratioMatch = token.match(/^([0-9]+(?:\.[0-9]+)?)[/:]([0-9]+(?:\.[0-9]+)?)$/);
  const midiMatch = token.match(/^[0-9]+$/);

  if (hzMatch) {
    const freq = Number(hzMatch[1]);
    if (!(freq > 0)) {
      errors.push(`Invalid Hz token: ${token}`);
      return { notes, errors };
    }
    notes.push({
      input: token,
      type: "hz",
      freq,
      sourceLabel: token.toLowerCase(),
    });
    return { notes, errors };
  }

  if (ratioMatch) {
    const numerator = Number(ratioMatch[1]);
    const denominator = Number(ratioMatch[2]);
    if (!(numerator > 0) || !(denominator > 0)) {
      errors.push(`Invalid ratio token: ${token}`);
      return { notes, errors };
    }
    const ratio = numerator / denominator;
    const freq = ratioRootHz * ratio;
    notes.push({
      input: token,
      type: "ratio",
      ratio,
      numerator,
      denominator,
      freq,
      sourceLabel: `${numerator}/${denominator}`,
    });
    return { notes, errors };
  }

  if (midiMatch) {
    const midi = Number(token);
    if (!Number.isInteger(midi) || midi < 0 || midi > 127) {
      errors.push(`MIDI out of range (0..127): ${token}`);
      return { notes, errors };
    }
    const freq = a4Hz * 2 ** ((midi - 69) / 12);
    notes.push({
      input: token,
      type: "midi",
      midi,
      freq,
      sourceLabel: `m${midi}`,
    });
    return { notes, errors };
  }

  errors.push(`Unrecognized token: ${token}`);
  return { notes, errors };
}

function parseNotes(text, ratioRootHz, a4Hz) {
  const rawLines = String(text || "").split(/\r?\n/);
  const notes = [];
  const errors = [];
  const chords = [];

  rawLines.forEach((line, lineIndex) => {
    const tokens = line
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean);
    if (!tokens.length) {
      return;
    }
    const chordNoteIndexes = [];
    tokens.forEach((token) => {
      const parsed = parseNoteToken(token, ratioRootHz, a4Hz);
      if (parsed.errors.length) {
        parsed.errors.forEach((error) => errors.push(`Line ${lineIndex + 1}: ${error}`));
      }
      parsed.notes.forEach((note) => {
        notes.push(note);
        chordNoteIndexes.push(notes.length - 1);
      });
    });
    if (chordNoteIndexes.length) {
      chords.push({ index: chords.length, noteIndexes: chordNoteIndexes });
    }
  });

  if (!chords.length && notes.length) {
    chords.push({
      index: 0,
      noteIndexes: notes.map((_, index) => index),
    });
  }

  return { notes, errors, chords };
}

function computeCombinationTones(notes, chords, pairsMode = "adjacent") {
  const tones = [];
  const chordList = Array.isArray(chords) && chords.length
    ? chords
    : [{ index: 0, noteIndexes: notes.map((_, index) => index) }];
  chordList.forEach((chord) => {
    const chordIndexes = (chord?.noteIndexes || []).filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < notes.length);
    if (chordIndexes.length < 2) {
      return;
    }
    if (pairsMode === "adjacent") {
      for (let i = 0; i < chordIndexes.length - 1; i += 1) {
        const a = chordIndexes[i];
        const b = chordIndexes[i + 1];
        const f1 = notes[a].freq;
        const f2 = notes[b].freq;
        const lower = Math.min(f1, f2);
        const upper = Math.max(f1, f2);

        tones.push({
          kind: "combo",
          type: "difference",
          freq: Math.abs(upper - lower),
          noteA: a,
          noteB: b,
          formula: "|f2-f1|",
        });
        tones.push({
          kind: "combo",
          type: "sum",
          freq: upper + lower,
          noteA: a,
          noteB: b,
          formula: "f1+f2",
        });
        tones.push({
          kind: "combo",
          type: "order2a",
          freq: 2 * lower - upper,
          noteA: a,
          noteB: b,
          formula: "2f1-f2",
        });
        tones.push({
          kind: "combo",
          type: "order2b",
          freq: 2 * upper - lower,
          noteA: a,
          noteB: b,
          formula: "2f2-f1",
        });
      }
      return;
    }
    for (let i = 0; i < chordIndexes.length; i += 1) {
      for (let j = i + 1; j < chordIndexes.length; j += 1) {
        const a = chordIndexes[i];
        const b = chordIndexes[j];
        const f1 = notes[a].freq;
        const f2 = notes[b].freq;
        const lower = Math.min(f1, f2);
        const upper = Math.max(f1, f2);

        tones.push({
          kind: "combo",
          type: "difference",
          freq: Math.abs(upper - lower),
          noteA: a,
          noteB: b,
          formula: "|f2-f1|",
        });
        tones.push({
          kind: "combo",
          type: "sum",
          freq: upper + lower,
          noteA: a,
          noteB: b,
          formula: "f1+f2",
        });
        tones.push({
          kind: "combo",
          type: "order2a",
          freq: 2 * lower - upper,
          noteA: a,
          noteB: b,
          formula: "2f1-f2",
        });
        tones.push({
          kind: "combo",
          type: "order2b",
          freq: 2 * upper - lower,
          noteA: a,
          noteB: b,
          formula: "2f2-f1",
        });
      }
    }
  });
  return tones.filter((tone) => tone.freq > 0 && Number.isFinite(tone.freq));
}

function quantile(sorted, q) {
  if (!sorted.length) {
    return null;
  }
  const index = clamp(Math.floor((sorted.length - 1) * q), 0, sorted.length - 1);
  return sorted[index];
}

function computeAutoRange(overtones, combinations, includeCombinations) {
  const samples = overtones.map((point) => point.freq);
  if (includeCombinations) {
    combinations.forEach((point) => {
      samples.push(point.freq);
    });
  }
  const values = samples
    .filter((freq) => Number.isFinite(freq) && freq > 0)
    .sort((a, b) => a - b);

  if (!values.length) {
    return { min: 40, max: 6000 };
  }

  const low = quantile(values, 0.02) ?? values[0];
  const high = quantile(values, 0.98) ?? values[values.length - 1];
  let min = low * 0.94;
  let max = high * 1.08;

  min = clamp(min, 8, 20000);
  max = clamp(max, 40, 30000);

  if (max <= min) {
    max = min * 2;
  }
  if (max / min < 1.6) {
    max = min * 1.6;
  }
  return { min, max };
}

function computeAlignmentClusters(points, toleranceCents) {
  if (toleranceCents <= 0 || points.length < 2) {
    return [];
  }

  const sorted = [...points].sort((a, b) => a.freq - b.freq);
  const clusters = [];
  let current = [];
  let logSum = 0;
  let noteSet = new Set();

  function finalizeCurrent() {
    if (current.length < 2 || noteSet.size < 2) {
      current = [];
      logSum = 0;
      noteSet = new Set();
      return;
    }
    const center = Math.exp(logSum / current.length);
    clusters.push({
      centerFreq: center,
      points: current,
      uniqueNotes: noteSet.size,
    });
    current = [];
    logSum = 0;
    noteSet = new Set();
  }

  for (const point of sorted) {
    const pointNotes = point.noteIndexes || [];
    if (!current.length) {
      current.push(point);
      logSum = Math.log(point.freq);
      pointNotes.forEach((index) => noteSet.add(index));
      continue;
    }
    const centerFreq = Math.exp(logSum / current.length);
    const cents = Math.abs(centsBetween(centerFreq, point.freq));
    if (cents <= toleranceCents) {
      current.push(point);
      logSum += Math.log(point.freq);
      pointNotes.forEach((index) => noteSet.add(index));
      continue;
    }
    finalizeCurrent();
    current.push(point);
    logSum = Math.log(point.freq);
    pointNotes.forEach((index) => noteSet.add(index));
  }
  finalizeCurrent();

  return clusters.slice(0, 120);
}

function fusionPointWeight(point) {
  if (!point || !(point.freq > 0)) {
    return 0;
  }
  if (point.kind === "overtone") {
    const harmonic = Math.max(1, Number(point.harmonic) || 1);
    return 1 / harmonic ** 0.88;
  }
  if (point.kind === "combo") {
    if (point.type === "difference") return 0.42;
    if (point.type === "sum") return 0.3;
    return 0.24;
  }
  return 0.35;
}

function buildFusionDensityClusters(points, toleranceCents) {
  if (!points.length) {
    return [];
  }
  const sorted = [...points].sort((a, b) => a.freq - b.freq);
  const clusters = [];
  let current = [];
  let weightedLogSum = 0;
  let weightSum = 0;
  let noteSet = new Set();

  function finalize() {
    if (!current.length || !(weightSum > 0)) {
      current = [];
      weightedLogSum = 0;
      weightSum = 0;
      noteSet = new Set();
      return;
    }
    const centerFreq = Math.exp(weightedLogSum / weightSum);
    clusters.push({
      centerFreq,
      strengthRaw: weightSum,
      count: current.length,
      uniqueNotes: noteSet.size,
    });
    current = [];
    weightedLogSum = 0;
    weightSum = 0;
    noteSet = new Set();
  }

  for (const point of sorted) {
    const weight = Math.max(1e-6, Number(point.weight) || 0);
    if (!(weight > 0)) {
      continue;
    }
    if (!current.length) {
      current.push(point);
      weightedLogSum = Math.log(point.freq) * weight;
      weightSum = weight;
      (point.noteIndexes || []).forEach((idx) => noteSet.add(idx));
      continue;
    }
    const centerFreq = Math.exp(weightedLogSum / weightSum);
    if (Math.abs(centsBetween(centerFreq, point.freq)) <= toleranceCents) {
      current.push(point);
      weightedLogSum += Math.log(point.freq) * weight;
      weightSum += weight;
      (point.noteIndexes || []).forEach((idx) => noteSet.add(idx));
      continue;
    }
    finalize();
    current.push(point);
    weightedLogSum = Math.log(point.freq) * weight;
    weightSum = weight;
    (point.noteIndexes || []).forEach((idx) => noteSet.add(idx));
  }
  finalize();

  const maxStrength = Math.max(1e-6, ...clusters.map((cluster) => cluster.strengthRaw));
  return clusters
    .map((cluster, index) => ({
      ...cluster,
      id: index,
      strength: cluster.strengthRaw / maxStrength,
      tip: `Fusion density
${cluster.count} components near ${formatHz(cluster.centerFreq)}
${cluster.uniqueNotes} source notes`,
    }))
    .slice(0, 220);
}

function computeFusionBeatBands(points, minBeatHz, maxBeatHz, centerToleranceCents) {
  if (points.length < 2 || !(maxBeatHz > minBeatHz) || !(maxBeatHz > 0)) {
    return [];
  }
  const strongest = [...points]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 180)
    .sort((a, b) => a.freq - b.freq);
  if (strongest.length < 2) {
    return [];
  }

  const interactions = [];
  const sigma = 6;
  const sigma2 = 2 * sigma * sigma;
  for (let i = 0; i < strongest.length; i += 1) {
    const a = strongest[i];
    for (let j = i + 1; j < strongest.length; j += 1) {
      const b = strongest[j];
      const delta = b.freq - a.freq;
      if (delta > maxBeatHz) {
        break;
      }
      if (delta < minBeatHz) {
        continue;
      }
      const centerFreq = (a.freq + b.freq) / 2;
      const baseWeight = a.weight * b.weight;
      const perceptualEmphasis = Math.exp(-((delta - 4) ** 2) / sigma2);
      const strengthRaw = baseWeight * (0.3 + 0.7 * perceptualEmphasis);
      if (!(strengthRaw > 1e-4)) {
        continue;
      }
      interactions.push({
        centerFreq,
        deltaHz: delta,
        strengthRaw,
        pairCount: 1,
      });
    }
  }

  if (!interactions.length) {
    return [];
  }

  const merged = [];
  const sorted = interactions.sort((a, b) => a.centerFreq - b.centerFreq);
  let current = null;
  for (const entry of sorted) {
    if (!current) {
      current = {
        weightedLogSum: Math.log(entry.centerFreq) * entry.strengthRaw,
        weightedDeltaSum: entry.deltaHz * entry.strengthRaw,
        strengthRaw: entry.strengthRaw,
        pairCount: entry.pairCount,
      };
      continue;
    }
    const center = Math.exp(current.weightedLogSum / current.strengthRaw);
    if (Math.abs(centsBetween(center, entry.centerFreq)) <= centerToleranceCents) {
      current.weightedLogSum += Math.log(entry.centerFreq) * entry.strengthRaw;
      current.weightedDeltaSum += entry.deltaHz * entry.strengthRaw;
      current.strengthRaw += entry.strengthRaw;
      current.pairCount += entry.pairCount;
      continue;
    }
    merged.push(current);
    current = {
      weightedLogSum: Math.log(entry.centerFreq) * entry.strengthRaw,
      weightedDeltaSum: entry.deltaHz * entry.strengthRaw,
      strengthRaw: entry.strengthRaw,
      pairCount: entry.pairCount,
    };
  }
  if (current) {
    merged.push(current);
  }

  const maxStrength = Math.max(1e-6, ...merged.map((item) => item.strengthRaw));
  return merged
    .map((item, index) => {
      const centerFreq = Math.exp(item.weightedLogSum / item.strengthRaw);
      const deltaHz = item.weightedDeltaSum / item.strengthRaw;
      return {
        id: index,
        centerFreq,
        deltaHz,
        pairCount: item.pairCount,
        strengthRaw: item.strengthRaw,
        strength: item.strengthRaw / maxStrength,
        tip: `Beat-friction band
Center: ${formatHz(centerFreq)}
Typical |f2-f1|: ${deltaHz.toFixed(2)} Hz
Interacting pairs: ${item.pairCount}`,
      };
    })
    .slice(0, 140);
}

function noteColor(index, darkMode) {
  const hue = Math.round((205 + index * 137.508) % 360);
  const sat = 68;
  const light = darkMode ? 64 : 44;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function createSvgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value == null) {
      return;
    }
    node.setAttribute(key, String(value));
  });
  return node;
}

function niceLinearStep(range, targetTicks = 8) {
  if (!(range > 0)) {
    return 1;
  }
  const rough = range / targetTicks;
  const exponent = Math.floor(Math.log10(rough));
  const base = 10 ** exponent;
  const ratio = rough / base;
  if (ratio <= 1) return 1 * base;
  if (ratio <= 2) return 2 * base;
  if (ratio <= 5) return 5 * base;
  return 10 * base;
}

function linearTicks(min, max) {
  const ticks = [];
  const step = niceLinearStep(max - min, 7);
  const first = Math.ceil(min / step) * step;
  for (let value = first; value <= max + step * 0.5; value += step) {
    ticks.push({ freq: value, major: true });
  }
  return ticks;
}

function logTicks(min, max) {
  const ticks = [];
  const startExp = Math.floor(Math.log10(min));
  const endExp = Math.ceil(Math.log10(max));
  for (let exp = startExp; exp <= endExp; exp += 1) {
    for (const mul of [1, 2, 5]) {
      const freq = mul * 10 ** exp;
      if (freq < min || freq > max) {
        continue;
      }
      ticks.push({ freq, major: mul === 1 });
    }
  }
  return ticks;
}

function getNumericInputValue(input, fallback) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function buildModel() {
  const parsed = parseNotes(state.notesText, state.ratioRootHz, state.a4Hz);
  const notes = parsed.notes;
  const chords = parsed.chords && parsed.chords.length
    ? parsed.chords
    : (notes.length ? [{ index: 0, noteIndexes: notes.map((_, index) => index) }] : []);

  const overtones = [];
  for (let noteIndex = 0; noteIndex < notes.length; noteIndex += 1) {
    const base = notes[noteIndex].freq;
    for (let harmonic = 1; harmonic <= state.overtoneCount; harmonic += 1) {
      overtones.push({
        kind: "overtone",
        noteIndex,
        harmonic,
        playKey: `harmonic:${noteIndex}:${harmonic}`,
        freq: base * harmonic,
        noteIndexes: [noteIndex],
      });
    }
  }

  const allCombinations = computeCombinationTones(notes, chords, "all");
  const visibleCombinations = allCombinations.filter((tone) => {
    if (!state.showCombination) {
      return false;
    }
    if (tone.type === "difference") {
      return state.showComboDifference;
    }
    if (tone.type === "sum") {
      return state.showComboSum;
    }
    if (tone.type === "order2a" || tone.type === "order2b") {
      return state.showComboOrder2;
    }
    return false;
  });

  const autoRange = computeAutoRange(overtones, visibleCombinations, state.showCombination);
  let rangeMin = state.autoRange ? autoRange.min : state.rangeMin;
  let rangeMax = state.autoRange ? autoRange.max : state.rangeMax;

  rangeMin = Math.max(1e-4, rangeMin);
  rangeMax = Math.max(rangeMin + 1, rangeMax);
  if (state.yScale === "log" && rangeMin <= 0) {
    rangeMin = 1;
  }

  const visibleOvertones = overtones.filter((point) => point.freq >= rangeMin && point.freq <= rangeMax);
  const visibleComboPoints = visibleCombinations
    .filter((point) => point.freq >= rangeMin && point.freq <= rangeMax)
    .map((point) => ({
      ...point,
      playKey: `combo:${point.noteA}:${point.noteB}:${point.type}:${point.freq.toFixed(6)}`,
      noteIndexes: [point.noteA, point.noteB],
    }));
  const weightedFusionPoints = [...visibleOvertones, ...visibleComboPoints]
    .map((point) => ({
      ...point,
      weight: fusionPointWeight(point),
    }))
    .filter((point) => point.weight > 0);
  const beatMin = clamp(state.roughnessBeatMinHz, 0.1, 40);
  const beatMax = clamp(state.roughnessBeatMaxHz, beatMin + 0.1, 80);
  const chordAnalyses = chords.map((chord, chordIndex) => {
    const noteSet = new Set(chord.noteIndexes);
    const chordPoints = weightedFusionPoints.filter((point) =>
      (point.noteIndexes || []).some((idx) => noteSet.has(idx))
    );
    const densityNodes = buildFusionDensityClusters(
      chordPoints,
      clamp(state.fusionClusterCents, 1, 4)
    );
    const roughnessBands =
      state.showRoughness && chordPoints.length > 1
        ? computeFusionBeatBands(
          chordPoints,
          beatMin,
          beatMax,
          clamp(state.fusionClusterCents * 0.8, 0.8, 4)
        )
      : [];
    const chordAlignmentSource = [
      ...visibleOvertones.filter((point) => noteSet.has(point.noteIndex)),
      ...visibleComboPoints.filter(
        (point) => noteSet.has(point.noteA) && noteSet.has(point.noteB)
      ),
    ];
    const chordRawClusters = computeAlignmentClusters(
      chordAlignmentSource,
      state.alignToleranceCents
    );
    const chordMaxPoints = Math.max(
      1,
      ...chordRawClusters.map((cluster) => cluster.points.length)
    );
    const alignmentClusters = chordRawClusters.map((cluster, index) => ({
      ...cluster,
      id: `${chordIndex}:${index}`,
      chordIndex,
      strength: cluster.points.length / chordMaxPoints,
      tip: `Chord ${chordIndex + 1}
${cluster.uniqueNotes} notes align near ${formatHz(cluster.centerFreq)}`,
    }));
    return {
      chordIndex,
      noteIndexes: chord.noteIndexes,
      fusionDensityNodes: densityNodes,
      roughnessBands,
      sourcePoints: chordPoints,
      alignmentClusters,
    };
  });
  const clusters = chordAnalyses.flatMap((analysis) => analysis.alignmentClusters || []);
  const alignmentMemberPlayKeys = new Set();
  clusters.forEach((cluster) => {
    cluster.points.forEach((point) => {
      if (point.playKey) {
        alignmentMemberPlayKeys.add(point.playKey);
      }
    });
  });

  return {
    notes,
    chords,
    chordAnalyses,
    errors: parsed.errors,
    overtones,
    visibleOvertones,
    visibleCombinations,
    visibleComboPoints,
    roughnessBeatMinHz: beatMin,
    roughnessBeatMaxHz: beatMax,
    clusters,
    alignmentMemberPlayKeys,
    rangeMin,
    rangeMax,
  };
}

function yMapper(minHz, maxHz, yTop, yBottom, scaleMode) {
  if (scaleMode === "linear") {
    const denom = maxHz - minHz || 1;
    return (freq) => {
      const t = (freq - minHz) / denom;
      return yBottom - t * (yBottom - yTop);
    };
  }
  const logMin = Math.log(minHz);
  const logMax = Math.log(maxHz);
  const denom = logMax - logMin || 1;
  return (freq) => {
    const t = (Math.log(freq) - logMin) / denom;
    return yBottom - t * (yBottom - yTop);
  };
}

function computeNoteBand(noteCount, xLeft, xRight) {
  const totalWidth = Math.max(0, xRight - xLeft);
  if (noteCount <= 0 || totalWidth <= 0) {
    return { left: xLeft, right: xRight };
  }

  const idealWidth = noteCount * 46;
  const minWidth = Math.min(totalWidth * 0.68, noteCount * 54);
  const maxWidth = totalWidth * 0.88;
  const bandWidth = clamp(idealWidth, minWidth, maxWidth);
  const left = xLeft + (totalWidth - bandWidth) / 2;
  return { left, right: left + bandWidth };
}

function xForNote(noteIndex, noteCount, xLeft, xRight) {
  const width = xRight - xLeft;
  if (noteCount <= 0) {
    return xLeft + width / 2;
  }
  return xLeft + ((noteIndex + 0.5) / noteCount) * width;
}

function comboOffset(type) {
  if (type === "difference") return -12;
  if (type === "sum") return 12;
  if (type === "order2a") return -20;
  if (type === "order2b") return 20;
  return 0;
}

function describeComboTone(point, notes) {
  const sourceA = notes[point.noteA];
  const sourceB = notes[point.noteB];
  const labelA = sourceA ? sourceA.input : `#${point.noteA + 1}`;
  const labelB = sourceB ? sourceB.input : `#${point.noteB + 1}`;
  const freqA = sourceA ? sourceA.freq : NaN;
  const freqB = sourceB ? sourceB.freq : NaN;

  let title = "Combination tone";
  if (point.type === "difference") title = "Difference tone";
  if (point.type === "sum") title = "Summation tone";
  if (point.type === "order2a" || point.type === "order2b") title = "2nd-order combination tone";

  return `${title}
Formula: ${point.formula}
Source notes: ${labelA} and ${labelB}
Source freqs: ${formatHz(freqA)} + ${formatHz(freqB)}
Result: ${formatHz(point.freq)}`;
}

function buildChartSvg(model, width, height) {
  const rootStyle = getComputedStyle(document.body);
  const axisColor = rootStyle.getPropertyValue("--viz-axis").trim() || "rgba(20,20,20,0.8)";
  const gridColor = rootStyle.getPropertyValue("--viz-grid").trim() || "rgba(0,0,0,0.08)";
  const gridStrongColor = rootStyle.getPropertyValue("--viz-grid-strong").trim() || "rgba(0,0,0,0.16)";
  const textPrimary = rootStyle.getPropertyValue("--text-primary").trim() || "#111";
  const textSecondary = rootStyle.getPropertyValue("--muted-ink").trim() || "#444";
  const vizBg = rootStyle.getPropertyValue("--viz-bg").trim() || "#fff";
  const alignBandColor = rootStyle.getPropertyValue("--align-band").trim() || "rgba(70,119,160,0.15)";
  const comboDiffColor = rootStyle.getPropertyValue("--combo-diff").trim() || "#d45d4c";
  const comboSumColor = rootStyle.getPropertyValue("--combo-sum").trim() || "#b6802e";
  const comboOrder2Color = rootStyle.getPropertyValue("--combo-order2").trim() || "#6e58b4";

  const frameLeft = 86;
  const frameRight = width - 22;
  const chordsForLayout = model.chords && model.chords.length
    ? model.chords
    : (model.notes.length ? [{ index: 0, noteIndexes: model.notes.map((_, i) => i) }] : []);
  const slotEntries = [];
  chordsForLayout.forEach((chord, chordIndex) => {
    chord.noteIndexes.forEach((noteIndex) => {
      slotEntries.push({ type: "note", chordIndex, noteIndex, width: 1 });
    });
    if (state.showFusion) {
      slotEntries.push({ type: "fusion", chordIndex, width: 0.92 });
    }
    if (state.showRoughness) {
      slotEntries.push({ type: "rough", chordIndex, width: 0.92 });
    }
    if (chordIndex < chordsForLayout.length - 1) {
      slotEntries.push({ type: "gap", width: 0.68 });
    }
  });
  const layoutCount = Math.max(model.notes.length, slotEntries.length || model.notes.length);
  const noteBand = computeNoteBand(layoutCount, frameLeft, frameRight);
  const totalSlotUnits = Math.max(
    1,
    slotEntries.reduce((sum, entry) => sum + (entry.width || 1), 0)
  );
  const slotUnitWidth = (noteBand.right - noteBand.left) / totalSlotUnits;
  const noteXByIndex = {};
  const fusionXByChord = {};
  const roughnessXByChord = {};
  let unitCursor = 0;
  slotEntries.forEach((entry) => {
    const widthUnits = entry.width || 1;
    const x = noteBand.left + (unitCursor + widthUnits / 2) * slotUnitWidth;
    if (entry.type === "note") {
      noteXByIndex[entry.noteIndex] = x;
    } else if (entry.type === "fusion") {
      fusionXByChord[entry.chordIndex] = x;
    } else if (entry.type === "rough") {
      roughnessXByChord[entry.chordIndex] = x;
    }
    unitCursor += widthUnits;
  });

  const noteXs = Object.values(noteXByIndex);
  const fusionXs = Object.values(fusionXByChord);
  const roughnessXs = Object.values(roughnessXByChord);
  const chordRegions = chordsForLayout.map((chord, chordIndex) => {
    const xs = [
      ...chord.noteIndexes.map((idx) => noteXByIndex[idx]).filter((x) => Number.isFinite(x)),
      ...(state.showFusion && Number.isFinite(fusionXByChord[chordIndex]) ? [fusionXByChord[chordIndex]] : []),
      ...(state.showRoughness && Number.isFinite(roughnessXByChord[chordIndex]) ? [roughnessXByChord[chordIndex]] : []),
    ];
    const minX = xs.length ? Math.min(...xs) : noteBand.left;
    const maxX = xs.length ? Math.max(...xs) : noteBand.right;
    const pad = Math.max(10, slotUnitWidth * 0.4);
    return {
      chordIndex,
      left: minX - pad,
      right: maxX + pad,
    };
  });
  const rightmostDataX = Math.max(
    noteBand.left,
    ...noteXs,
    ...fusionXs,
    ...roughnessXs
  );
  const leftmostDataX = Math.min(
    noteBand.right,
    ...(noteXs.length ? noteXs : [noteBand.left])
  );
  const columnStep =
    model.notes.length > 0 ? (noteBand.right - noteBand.left) / model.notes.length : Infinity;
  const baseXLabelMode = columnStep >= 84 ? "full" : columnStep >= 58 ? "compact" : "sparse";
  const xLabelMode = baseXLabelMode;
  const plotTop = 24;
  const bottomMargin =
    xLabelMode === "full" ? (model.notes.length > 10 ? 88 : 74) : xLabelMode === "compact" ? 94 : 102;
  const plotBottom = height - bottomMargin;
  const noteBandWidth = Math.max(0, rightmostDataX - leftmostDataX);
  const horizontalPad = clamp(noteBandWidth * 0.1, 30, 68);
  const plotLeft = Math.max(76, leftmostDataX - horizontalPad);
  const fusionReserve = state.showFusion ? clamp(columnStep * 1.15, 56, 96) : 0;
  const roughReserve = state.showRoughness ? clamp(columnStep * 1.15, 56, 96) : 0;
  const rightGutter = clamp(noteBandWidth * 0.2, 80, 180) + fusionReserve + roughReserve;
  const plotRight = Math.min(width - 12, rightmostDataX + horizontalPad + rightGutter);
  const plotWidth = Math.max(100, plotRight - plotLeft);
  const plotHeight = Math.max(80, plotBottom - plotTop);
  const fusionColumnWidth = clamp(columnStep * 0.78, 22, 42);
  const roughnessColumnWidth = clamp(columnStep * 0.78, 22, 42);
  const defaultFusionX = state.showFusion
    ? clamp(
        rightmostDataX + Math.max(columnStep * 0.92, fusionColumnWidth * 0.9),
        plotLeft + 24,
        plotRight - (state.showRoughness ? roughnessColumnWidth + 34 : fusionColumnWidth * 0.85)
      )
    : NaN;
  const defaultRoughnessX = state.showRoughness
    ? clamp(
        rightmostDataX + Math.max(columnStep * 1.7, roughnessColumnWidth + 24),
        plotLeft + 24,
        plotRight - roughnessColumnWidth * 0.85
      )
    : NaN;
  const furthestColumnX = Math.max(
    rightmostDataX,
    ...(state.showFusion ? Object.values(fusionXByChord) : []),
    ...(state.showRoughness ? Object.values(roughnessXByChord) : []),
    Number.isFinite(defaultFusionX) ? defaultFusionX : -Infinity,
    Number.isFinite(defaultRoughnessX) ? defaultRoughnessX : -Infinity
  );
  const isAlignmentFocus = alignmentFocusMode && state.showAlignments;

  const yForFreq = yMapper(model.rangeMin, model.rangeMax, plotTop, plotBottom, state.yScale);
  const ticks = state.yScale === "log" ? logTicks(model.rangeMin, model.rangeMax) : linearTicks(model.rangeMin, model.rangeMax);

  const svg = createSvgEl("svg", {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    "aria-label": "Overtones chart",
    role: "img",
  });

  svg.appendChild(
    createSvgEl("rect", {
      x: 0,
      y: 0,
      width,
      height,
      fill: vizBg,
    })
  );

  const gridLayer = createSvgEl("g");
  ticks.forEach((tick) => {
    const y = yForFreq(tick.freq);
    if (y < plotTop - 0.5 || y > plotBottom + 0.5) {
      return;
    }
    gridLayer.appendChild(
      createSvgEl("text", {
        x: plotLeft - 8,
        y: y + 4,
        fill: textSecondary,
        "font-size": 11,
        "font-family": "Lexend, IBM Plex Sans, sans-serif",
        "text-anchor": "end",
      })
    ).textContent = formatHz(tick.freq);
  });
  svg.appendChild(gridLayer);

  const axisLayer = createSvgEl("g");
  axisLayer.appendChild(
    createSvgEl("line", {
      x1: plotLeft,
      y1: plotTop,
      x2: plotLeft,
      y2: plotBottom,
      stroke: axisColor,
      "stroke-width": 1.4,
    })
  );
  axisLayer.appendChild(
    createSvgEl("line", {
      x1: plotLeft,
      y1: plotBottom,
      x2: plotRight,
      y2: plotBottom,
      stroke: axisColor,
      "stroke-width": 1.4,
    })
  );
  const yLabel = createSvgEl("text", {
    x: Math.max(12, plotLeft - 102),
    y: plotTop + plotHeight / 2,
    fill: textSecondary,
    "font-size": 12,
    "font-family": "Lexend, IBM Plex Sans, sans-serif",
    transform: `rotate(-90 ${Math.max(12, plotLeft - 102)} ${plotTop + plotHeight / 2})`,
    "text-anchor": "middle",
  });
  yLabel.textContent = `Frequency spectrum (${state.yScale})`;
  axisLayer.appendChild(yLabel);

  const xLabel = createSvgEl("text", {
    x: plotLeft + plotWidth / 2,
    y: plotBottom + (xLabelMode === "full" ? 50 : 54),
    fill: textSecondary,
    "font-size": 12,
    "font-family": "Lexend, IBM Plex Sans, sans-serif",
    "text-anchor": "middle",
  });
  xLabel.textContent = "Input notes";
  axisLayer.appendChild(xLabel);
  svg.appendChild(axisLayer);

  const noteX = [];
  const noteLayer = createSvgEl("g");
  const drawHzLineForNotes = state.showLabels && xLabelMode === "full";
  for (let noteIndex = 0; noteIndex < model.notes.length; noteIndex += 1) {
    const x = Number.isFinite(noteXByIndex[noteIndex])
      ? noteXByIndex[noteIndex]
      : xForNote(noteIndex, model.notes.length, noteBand.left, noteBand.right);
    noteX[noteIndex] = x;

    noteLayer.appendChild(
      createSvgEl("line", {
        x1: x,
        y1: plotTop,
        x2: x,
        y2: plotBottom,
        stroke: gridColor,
        "stroke-width": 1,
      })
    );

    const token = model.notes[noteIndex].input;
    if (state.showLabels) {
      const tokenY = xLabelMode === "full" ? plotBottom + 18 : plotBottom + 24;
      const labelTop = createSvgEl("text", {
        x,
        y: tokenY,
        fill: textPrimary,
        "font-size": xLabelMode === "full" ? 11 : 10,
        "font-family": "IBM Plex Sans, Lexend, sans-serif",
        "text-anchor": xLabelMode === "full" ? "middle" : "end",
      });
      if (xLabelMode !== "full") {
        labelTop.setAttribute("transform", `rotate(-32 ${x} ${tokenY})`);
      }
      labelTop.textContent = token;
      noteLayer.appendChild(labelTop);
    }

    if (drawHzLineForNotes) {
      const labelBottom = createSvgEl("text", {
        x,
        y: plotBottom + 32,
        fill: textSecondary,
        "font-size": 10,
        "font-family": "Lexend, IBM Plex Sans, sans-serif",
        "text-anchor": "middle",
      });
      labelBottom.textContent = formatHz(model.notes[noteIndex].freq);
      noteLayer.appendChild(labelBottom);
    }
  }
  if (state.showFusion) {
    chordsForLayout.forEach((chord, chordIndex) => {
      const fusionX = Number.isFinite(fusionXByChord[chordIndex]) ? fusionXByChord[chordIndex] : null;
      if (!(fusionX != null)) {
        return;
      }
      noteLayer.appendChild(
        createSvgEl("line", {
          x1: fusionX,
          y1: plotTop,
          x2: fusionX,
          y2: plotBottom,
          stroke: gridStrongColor,
          "stroke-width": 1.2,
          "stroke-dasharray": "4 3",
        })
      );
      if (state.showLabels) {
        const tokenY = xLabelMode === "full" ? plotBottom + 18 : plotBottom + 24;
        const label = createSvgEl("text", {
          x: fusionX,
          y: tokenY,
          fill: textPrimary,
          "font-size": xLabelMode === "full" ? 11 : 10,
          "font-family": "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "middle",
        });
        label.textContent = "Fusion";
        noteLayer.appendChild(label);
      }
    });
  }
  if (state.showRoughness) {
    chordsForLayout.forEach((chord, chordIndex) => {
      const roughnessX = Number.isFinite(roughnessXByChord[chordIndex]) ? roughnessXByChord[chordIndex] : null;
      if (!(roughnessX != null)) {
        return;
      }
      noteLayer.appendChild(
        createSvgEl("line", {
          x1: roughnessX,
          y1: plotTop,
          x2: roughnessX,
          y2: plotBottom,
          stroke: gridStrongColor,
          "stroke-width": 1.2,
          "stroke-dasharray": "2 4",
        })
      );
      if (state.showLabels) {
        const tokenY = xLabelMode === "full" ? plotBottom + 18 : plotBottom + 24;
        const label = createSvgEl("text", {
          x: roughnessX,
          y: tokenY,
          fill: textPrimary,
          "font-size": xLabelMode === "full" ? 11 : 10,
          "font-family": "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "middle",
        });
        label.textContent = "Roughness";
        noteLayer.appendChild(label);
      }
    });
  }
  svg.appendChild(noteLayer);

  if (state.showAlignments && model.clusters.length) {
    const alignLayer = createSvgEl("g");
    const regionByChord = new Map(chordRegions.map((region) => [region.chordIndex, region]));
    model.clusters.forEach((cluster, idx) => {
      const centerY = yForFreq(cluster.centerFreq);
      if (!(centerY >= plotTop && centerY <= plotBottom)) {
        return;
      }
      const region = regionByChord.get(cluster.chordIndex);
      if (!region) {
        return;
      }
      const xLeft = clamp(region.left, plotLeft, plotRight - 2);
      const xRight = clamp(region.right, xLeft + 1, plotRight);
      const halfBand = state.alignToleranceCents > 0 ? state.alignToleranceCents / 2 : 0;
      const topFreq = cluster.centerFreq * 2 ** (halfBand / 1200);
      const bottomFreq = cluster.centerFreq / 2 ** (halfBand / 1200);
      const y1 = yForFreq(topFreq);
      const y2 = yForFreq(bottomFreq);
      const bandTop = Math.min(y1, y2);
      const bandHeight = Math.abs(y2 - y1);

      if (bandHeight > 0.75) {
        const hue = Math.round(278 - cluster.strength * 272);
        const sat = Math.round(72 + cluster.strength * 16);
        const light = state.themeDark
          ? Math.round(56 - cluster.strength * 10)
          : Math.round(58 - cluster.strength * 8);
        alignLayer.appendChild(
          createSvgEl("rect", {
            x: xLeft,
            y: bandTop,
            width: Math.max(1, xRight - xLeft),
            height: bandHeight,
            fill: `hsl(${hue}, ${sat}%, ${light}%)`,
            "fill-opacity": state.themeDark ? 0.2 : 0.17,
            "data-align-band": "1",
            "data-align-id": cluster.id,
          })
        );
      }
      const lineHue = Math.round(278 - cluster.strength * 272);
      const lineSat = Math.round(78 + cluster.strength * 14);
      const lineLight = state.themeDark
        ? Math.round(68 - cluster.strength * 12)
        : Math.round(50 - cluster.strength * 6);
      alignLayer.appendChild(
        createSvgEl("line", {
          x1: xLeft,
          y1: centerY,
          x2: xRight,
          y2: centerY,
          stroke: `hsl(${lineHue}, ${lineSat}%, ${lineLight}%)`,
          "stroke-width": 1,
          "data-align-band": "1",
          "data-align-id": cluster.id,
          "data-tip": cluster.tip,
        })
      );
      if (idx > 120) {
        return;
      }
    });

    svg.appendChild(alignLayer);
  }

  if (state.showFusion) {
    const fusionLayer = createSvgEl("g");
    (model.chordAnalyses || []).forEach((analysis) => {
      const fusionX = fusionXByChord[analysis.chordIndex];
      if (!Number.isFinite(fusionX)) {
        return;
      }
      (analysis.fusionDensityNodes || []).forEach((node) => {
        if (!(node.centerFreq >= model.rangeMin && node.centerFreq <= model.rangeMax)) {
          return;
        }
        const y = yForFreq(node.centerFreq);
        const radius = clamp(3 + node.strength * 18, 3, 26);
        const hue = Math.round(36 - node.strength * 18);
        const sat = Math.round(82 + node.strength * 12);
        const light = state.themeDark
          ? Math.round(58 - node.strength * 9)
          : Math.round(56 - node.strength * 7);
        fusionLayer.appendChild(
          createSvgEl("circle", {
            cx: fusionX,
            cy: y,
            r: radius,
            fill: `hsl(${hue}, ${sat}%, ${light}%)`,
            "fill-opacity": 0.22 + node.strength * 0.62,
            stroke: `hsl(${Math.max(4, hue - 10)}, ${Math.min(95, sat + 4)}%, ${Math.max(24, light - 18)}%)`,
            "stroke-opacity": 0.35 + node.strength * 0.4,
            "stroke-width": 0.9 + node.strength * 1.1,
            "data-tip": `Chord ${analysis.chordIndex + 1}\n${node.tip}`,
          })
        );
      });
    });

    svg.appendChild(fusionLayer);
  }

  if (state.showRoughness) {
    const roughLayer = createSvgEl("g");
    (model.chordAnalyses || []).forEach((analysis) => {
      const roughnessX = roughnessXByChord[analysis.chordIndex];
      if (!Number.isFinite(roughnessX)) {
        return;
      }
      const bandLeft = roughnessX - roughnessColumnWidth * 0.66;
      const bandWidth = roughnessColumnWidth * 1.32;
      (analysis.roughnessBands || []).forEach((band) => {
        const halfDelta = Math.max(0.05, band.deltaHz / 2);
        const lowFreq = Math.max(model.rangeMin, band.centerFreq - halfDelta);
        const highFreq = Math.min(model.rangeMax, band.centerFreq + halfDelta);
        if (!(highFreq > lowFreq)) {
          return;
        }
        const y1 = yForFreq(highFreq);
        const y2 = yForFreq(lowFreq);
        const top = Math.min(y1, y2);
        const h = Math.abs(y2 - y1);
        if (h < 0.7) {
          return;
        }
        const hue = Math.round(16 - band.strength * 10);
        const sat = Math.round(84 + band.strength * 10);
        const light = state.themeDark
          ? Math.round(56 - band.strength * 8)
          : Math.round(52 - band.strength * 8);
        roughLayer.appendChild(
          createSvgEl("rect", {
            x: bandLeft,
            y: top,
            width: bandWidth,
            height: h,
            rx: 4,
            fill: `hsl(${hue}, ${sat}%, ${light}%)`,
            "fill-opacity": 0.12 + band.strength * 0.18,
            "data-tip": `Chord ${analysis.chordIndex + 1}\n${band.tip}`,
            "data-rough-animate": state.roughnessAnimate ? "1" : "0",
            "data-rough-rate": band.deltaHz,
            "data-rough-base-opacity": String(0.12 + band.strength * 0.18),
          })
        );
        roughLayer.appendChild(
          createSvgEl("line", {
            x1: bandLeft,
            y1: yForFreq(band.centerFreq),
            x2: bandLeft + bandWidth,
            y2: yForFreq(band.centerFreq),
            stroke: `hsl(${hue}, ${sat}%, ${Math.max(30, light - 14)}%)`,
            "stroke-width": 1.1,
            "stroke-opacity": 0.45 + band.strength * 0.35,
            "data-tip": `Chord ${analysis.chordIndex + 1}\n${band.tip}`,
            "data-rough-animate": state.roughnessAnimate ? "1" : "0",
            "data-rough-rate": band.deltaHz,
            "data-rough-base-opacity": String(0.45 + band.strength * 0.35),
          })
        );
      });
    });
    svg.appendChild(roughLayer);
  }

  const overtoneLayer = createSvgEl("g");
  for (let noteIndex = 0; noteIndex < model.notes.length; noteIndex += 1) {
    const color = noteColor(noteIndex, state.themeDark);
    const x = noteX[noteIndex];
    const baseFreq = model.notes[noteIndex].freq;
    const baseY = yForFreq(baseFreq);

    for (let harmonic = 1; harmonic <= state.overtoneCount; harmonic += 1) {
      const freq = baseFreq * harmonic;
      if (freq < model.rangeMin || freq > model.rangeMax) {
        continue;
      }
      const y = yForFreq(freq);
      if (harmonic > 1 && baseY >= plotTop && baseY <= plotBottom) {
        overtoneLayer.appendChild(
          createSvgEl("line", {
            x1: x,
            y1: baseY,
            x2: x,
            y2: y,
            stroke: color,
            "stroke-opacity": 0.26,
            "stroke-width": 1,
          })
        );
      }

      const alpha = clamp(0.98 - (harmonic - 1) / state.overtoneCount * 0.7, 0.2, 0.98);
      const radius =
        harmonic === 1
          ? state.pointSize + 1.2
          : clamp(state.pointSize * (1 - (harmonic - 1) / (state.overtoneCount * 1.8)), 1.2, 8);
      const playKey = `harmonic:${noteIndex}:${harmonic}`;
      const isPlaying = activeVoices.has(playKey);
      const isAlignmentMember = model.alignmentMemberPlayKeys.has(playKey);
      const circle = createSvgEl("circle", {
        cx: x,
        cy: y,
        r: radius,
        fill: color,
        "fill-opacity": alpha,
        stroke: isPlaying ? "#f4de58" : color,
        "stroke-width": isPlaying ? 2.4 : 0.45,
        "data-play-key": playKey,
        "data-play-freq": freq,
        "data-play-kind": "harmonic",
        "data-play-note-index": noteIndex,
        "data-play-harmonic": harmonic,
        "data-align-member": isAlignmentMember ? "1" : "0",
        "data-playing": isPlaying ? "1" : "0",
        "data-note-index": noteIndex,
        "data-harmonic": harmonic,
        "data-tip": `${model.notes[noteIndex].input}
Harmonic ${harmonic}
${formatHz(freq)}`,
      });
      if (isAlignmentFocus && !isAlignmentMember) {
        circle.setAttribute("opacity", "0.4");
      }
      overtoneLayer.appendChild(circle);

      if (state.showOvertoneNumbers) {
        const hText = createSvgEl("text", {
          x: x + radius + 2.5,
          y: y + 3,
          fill: textSecondary,
          "font-size": 9,
          "font-family": "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "start",
        });
        hText.textContent = String(harmonic);
        overtoneLayer.appendChild(hText);
      }
    }
  }
  svg.appendChild(overtoneLayer);

  if (state.showCombination && model.visibleComboPoints.length) {
    const comboLayer = createSvgEl("g");
    model.visibleComboPoints.forEach((point) => {
      const xMid = (noteX[point.noteA] + noteX[point.noteB]) / 2 + comboOffset(point.type);
      const y = yForFreq(point.freq);
      let color = comboDiffColor;
      if (point.type === "sum") color = comboSumColor;
      if (point.type === "order2a" || point.type === "order2b") color = comboOrder2Color;

      const r = state.pointSize + 1.2;
      const playKey = point.playKey;
      const isPlaying = activeVoices.has(playKey);
      const isAlignmentMember = model.alignmentMemberPlayKeys.has(playKey);
      const diamond = createSvgEl("path", {
        d: `M ${xMid} ${y - r} L ${xMid + r} ${y} L ${xMid} ${y + r} L ${xMid - r} ${y} Z`,
        fill: color,
        "fill-opacity": 0.88,
        stroke: isPlaying ? "#f4de58" : color,
        "stroke-width": isPlaying ? 2.4 : 0.8,
        "data-play-key": playKey,
        "data-play-freq": point.freq,
        "data-play-kind": "combo",
        "data-align-member": isAlignmentMember ? "1" : "0",
        "data-playing": isPlaying ? "1" : "0",
        "data-combo-source-a": point.noteA,
        "data-combo-source-b": point.noteB,
        "data-combo-type": point.type,
        "data-tip": describeComboTone(point, model.notes),
      });
      if (isAlignmentFocus && !isAlignmentMember) {
        diamond.setAttribute("opacity", "0.4");
      }
      comboLayer.appendChild(diamond);
    });
    svg.appendChild(comboLayer);
  }

  if (!model.notes.length) {
    const emptyTitle = createSvgEl("text", {
      x: plotLeft + plotWidth / 2,
      y: plotTop + plotHeight / 2 - 10,
      fill: textPrimary,
      "font-size": 16,
      "font-family": "Noto Serif, serif",
      "text-anchor": "middle",
    });
    emptyTitle.textContent = "Enter notes to visualize overtones";
    svg.appendChild(emptyTitle);

    const emptyHint = createSvgEl("text", {
      x: plotLeft + plotWidth / 2,
      y: plotTop + plotHeight / 2 + 14,
      fill: textSecondary,
      "font-size": 12,
      "font-family": "Lexend, sans-serif",
      "text-anchor": "middle",
    });
    emptyHint.textContent = "Formats: 69  |  440hz  |  3/2  |  7:4";
    svg.appendChild(emptyHint);
  }

  if (isAlignmentFocus) {
    const all = svg.querySelectorAll("line,path,circle,text,rect,polyline,polygon,ellipse");
    all.forEach((element) => {
      element.setAttribute("opacity", "0.4");
    });
    svg.querySelectorAll("[data-align-band='1']").forEach((band) => {
      band.setAttribute("opacity", "1");
    });
    svg.querySelectorAll("[data-align-member='1']").forEach((member) => {
      member.setAttribute("opacity", "1");
    });
  }

  return svg;
}

function attachTooltip(svg) {
  let dimmedElements = [];
  let highlightedComboTarget = null;
  let highlightedLinkLines = [];

  const DIM_SELECTOR = "line,path,circle,text,rect,polyline,polygon,ellipse";

  const applyGlobalDim = () => {
    if (dimmedElements.length) {
      return;
    }
    const elements = svg.querySelectorAll(DIM_SELECTOR);
    elements.forEach((element) => {
      const prevOpacity = element.getAttribute("opacity");
      if (prevOpacity == null) {
        element.setAttribute("data-prev-opacity", "");
      } else {
        element.setAttribute("data-prev-opacity", prevOpacity);
      }
      element.setAttribute("opacity", "0.5");
      dimmedElements.push(element);
    });
  };

  const clearGlobalDim = () => {
    if (!dimmedElements.length) {
      return;
    }
    dimmedElements.forEach((element) => {
      const prevOpacity = element.getAttribute("data-prev-opacity");
      if (prevOpacity == null || prevOpacity === "") {
        element.removeAttribute("opacity");
      } else {
        element.setAttribute("opacity", prevOpacity);
      }
      element.removeAttribute("data-prev-opacity");
    });
    dimmedElements = [];
  };

  const clearHighlightedSourceDots = () => {
    if (highlightedLinkLines.length) {
      highlightedLinkLines.forEach((line) => {
        if (line && line.parentNode) {
          line.parentNode.removeChild(line);
        }
      });
      highlightedLinkLines = [];
    }
    if (highlightedComboTarget) {
      highlightedComboTarget.setAttribute("stroke-width", "0.8");
      highlightedComboTarget.removeAttribute("filter");
      highlightedComboTarget = null;
    }
    if (!highlightedSourceDots.length) {
      clearGlobalDim();
      return;
    }
    highlightedSourceDots.forEach((dot) => {
      dot.setAttribute("stroke-width", "0.45");
      dot.removeAttribute("filter");
      const savedOpacity = dot.getAttribute("data-prev-fill-opacity");
      if (savedOpacity != null) {
        dot.setAttribute("fill-opacity", savedOpacity);
        dot.removeAttribute("data-prev-fill-opacity");
      }
    });
    highlightedSourceDots = [];
    clearGlobalDim();
  };

  const highlightComboSources = (target) => {
    if (highlightedComboTarget === target && highlightedSourceDots.length) {
      return;
    }
    clearHighlightedSourceDots();
    applyGlobalDim();
    const sourceA = Number(target.getAttribute("data-combo-source-a"));
    const sourceB = Number(target.getAttribute("data-combo-source-b"));
    const comboType = target.getAttribute("data-combo-type") || "difference";
    if (!Number.isFinite(sourceA) || !Number.isFinite(sourceB)) {
      clearGlobalDim();
      return;
    }
    target.setAttribute("opacity", "1");
    target.setAttribute("stroke-width", "1.8");
    target.setAttribute("filter", "drop-shadow(0 0 5px rgba(0,0,0,0.45))");
    highlightedComboTarget = target;
    const targetBox = target.getBBox();
    const targetX = targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;
    const sourceSpecs =
      comboType === "order2a"
        ? [
            { noteIndex: sourceA, harmonic: 2 },
            { noteIndex: sourceB, harmonic: 1 },
          ]
        : comboType === "order2b"
          ? [
              { noteIndex: sourceB, harmonic: 2 },
              { noteIndex: sourceA, harmonic: 1 },
            ]
          : [
              { noteIndex: sourceA, harmonic: 1 },
              { noteIndex: sourceB, harmonic: 1 },
            ];
    sourceSpecs.forEach((spec) => {
      const selector = `circle[data-note-index="${spec.noteIndex}"][data-harmonic="${spec.harmonic}"]`;
      const dot = svg.querySelector(selector);
      if (!dot) {
        return;
      }
      const prevOpacity = dot.getAttribute("fill-opacity") || "1";
      dot.setAttribute("data-prev-fill-opacity", prevOpacity);
      dot.setAttribute("opacity", "1");
      dot.setAttribute("fill-opacity", "1");
      dot.setAttribute("stroke-width", "3.2");
      dot.setAttribute("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.55))");
      highlightedSourceDots.push(dot);
      const sourceX = Number(dot.getAttribute("cx"));
      const sourceY = Number(dot.getAttribute("cy"));
      if (Number.isFinite(sourceX) && Number.isFinite(sourceY)) {
        const connector = createSvgEl("line", {
          x1: targetX,
          y1: targetY,
          x2: sourceX,
          y2: sourceY,
          stroke: "rgba(18, 24, 32, 0.45)",
          "stroke-width": 1.1,
          "stroke-dasharray": "3 3",
          "pointer-events": "none",
        });
        svg.appendChild(connector);
        highlightedLinkLines.push(connector);
      }
    });
  };

  const rectsIntersect = (a, b) =>
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

  const gatherProtectedRects = () => {
    const rects = [];
    if (highlightedComboTarget) {
      rects.push(highlightedComboTarget.getBoundingClientRect());
    }
    highlightedSourceDots.forEach((dot) => {
      rects.push(dot.getBoundingClientRect());
    });
    return rects.map((rect) => ({
      left: rect.left - 8,
      top: rect.top - 8,
      right: rect.right + 8,
      bottom: rect.bottom + 8,
    }));
  };

  const placeTooltip = (event) => {
    const gap = 14;
    const tooltipWidth = tooltipEl.offsetWidth || 220;
    const tooltipHeight = tooltipEl.offsetHeight || 60;
    const protectedRects = gatherProtectedRects();

    const candidates = [
      { x: event.clientX + gap, y: event.clientY + gap },
      { x: event.clientX + gap, y: event.clientY - tooltipHeight - gap },
      { x: event.clientX - tooltipWidth - gap, y: event.clientY + gap },
      { x: event.clientX - tooltipWidth - gap, y: event.clientY - tooltipHeight - gap },
      { x: event.clientX - tooltipWidth / 2, y: event.clientY - tooltipHeight - gap },
      { x: event.clientX - tooltipWidth / 2, y: event.clientY + gap },
    ];

    const clampedCandidates = candidates.map((candidate) => {
      const x = clamp(candidate.x, 8, window.innerWidth - tooltipWidth - 8);
      const y = clamp(candidate.y, 8, window.innerHeight - tooltipHeight - 8);
      const rect = { left: x, top: y, right: x + tooltipWidth, bottom: y + tooltipHeight };
      const collisions = protectedRects.reduce(
        (count, protectedRect) => count + (rectsIntersect(rect, protectedRect) ? 1 : 0),
        0
      );
      return { x, y, collisions };
    });

    const best =
      clampedCandidates.find((candidate) => candidate.collisions === 0) ||
      clampedCandidates.sort((a, b) => a.collisions - b.collisions)[0];
    tooltipEl.style.left = `${best.x}px`;
    tooltipEl.style.top = `${best.y}px`;
  };

  svg.addEventListener("pointermove", (event) => {
    if (!(event.target instanceof Element)) {
      clearHighlightedSourceDots();
      tooltipEl.hidden = true;
      return;
    }
    const target = event.target.closest("[data-tip]");
    if (!target) {
      clearHighlightedSourceDots();
      tooltipEl.hidden = true;
      return;
    }
    if (target.hasAttribute("data-combo-source-a")) {
      highlightComboSources(target);
    } else {
      clearHighlightedSourceDots();
    }
    tooltipEl.textContent = target.getAttribute("data-tip") || "";
    tooltipEl.hidden = false;
    placeTooltip(event);
  });

  svg.addEventListener("pointerleave", () => {
    clearHighlightedSourceDots();
    tooltipEl.hidden = true;
  });

  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    if (!(event.target instanceof Element)) {
      return;
    }
    const alignTarget = event.target.closest("[data-align-band='1']");
    const playTarget = event.target.closest("[data-play-key][data-play-freq]");
    if (alignTarget && !playTarget) {
      event.preventDefault();
      alignmentFocusMode = !alignmentFocusMode;
      scheduleRender();
      return;
    }
    if (alignmentFocusMode) {
      alignmentFocusMode = false;
      scheduleRender();
    }
    if (!playTarget) {
      return;
    }
    const key = playTarget.getAttribute("data-play-key");
    const freq = Number(playTarget.getAttribute("data-play-freq"));
    const kind = playTarget.getAttribute("data-play-kind") || "harmonic";
    if (!key || !(freq > 0)) {
      return;
    }
    event.preventDefault();
    const targetMeta =
      kind === "harmonic"
        ? {
            kind: "harmonic",
            noteIndex: Number(playTarget.getAttribute("data-play-note-index")),
            harmonic: Number(playTarget.getAttribute("data-play-harmonic")),
          }
        : { kind: "combo", freq };
    if (lKeyHeld) {
      armTargetLfoCycle(key, targetMeta);
    } else {
      const lfoState = lfoTargetStates.get(key) || null;
      if (lfoState) {
        toggleTargetLfo(key, targetMeta);
      } else {
        toggleTargetPlayback(key, targetMeta);
      }
    }
  });
}

function syncControlReadouts() {
  overtoneCountReadout.textContent = String(state.overtoneCount);
  alignToleranceReadout.textContent = `${state.alignToleranceCents.toFixed(1)}c`;
  if (fusionClusterCentsReadout) {
    fusionClusterCentsReadout.textContent = `${state.fusionClusterCents.toFixed(1)}c`;
  }
  rangeMinInput.disabled = state.autoRange;
  rangeMaxInput.disabled = state.autoRange;
  combinationControls.style.opacity = state.showCombination ? "1" : "0.6";
  if (fusionControls) {
    fusionControls.style.opacity = state.showFusion ? "1" : "0.78";
  }
  if (roughnessControls) {
    roughnessControls.style.opacity = state.showRoughness ? "1" : "0.78";
  }
}

function updateStatus(model) {
  if (!model) {
    statusEl.textContent = "No data";
    return;
  }
  const summary = [
    `${model.notes.length} input notes`,
    `${model.visibleOvertones.length} visible overtone points`,
    `${model.clusters.length} alignment clusters`,
    `${model.visibleComboPoints.length} combination/difference points`,
  ];
  if (state.showFusion && Array.isArray(model.chordAnalyses)) {
    const fusionCount = model.chordAnalyses.reduce(
      (sum, analysis) => sum + ((analysis.fusionDensityNodes && analysis.fusionDensityNodes.length) || 0),
      0
    );
    summary.push(`${fusionCount} fusion nodes`);
  }
  if (state.showRoughness && Array.isArray(model.chordAnalyses)) {
    const roughCount = model.chordAnalyses.reduce(
      (sum, analysis) => sum + ((analysis.roughnessBands && analysis.roughnessBands.length) || 0),
      0
    );
    summary.push(`${roughCount} roughness bands`);
  }

  if (!model.errors.length) {
    statusEl.textContent = summary.join(" · ");
    return;
  }

  const message = model.errors.slice(0, 6).join("\n");
  const extra = model.errors.length > 6 ? `\n... ${model.errors.length - 6} more` : "";
  statusEl.textContent = `${summary.join(" · ")}\n${message}${extra}`;
}

function renderChart() {
  chartModel = buildModel();

  if (state.autoRange) {
    state.rangeMin = chartModel.rangeMin;
    state.rangeMax = chartModel.rangeMax;
    rangeMinInput.value = chartModel.rangeMin.toFixed(chartModel.rangeMin < 100 ? 2 : 1);
    rangeMaxInput.value = chartModel.rangeMax.toFixed(chartModel.rangeMax < 100 ? 2 : 1);
  }

  const width = Math.max(500, Math.floor(chartStage.clientWidth || window.innerWidth));
  const height = Math.max(360, Math.floor(chartStage.clientHeight || window.innerHeight));
  const svg = buildChartSvg(chartModel, width, height);
  chartStage.replaceChildren(svg);
  attachTooltip(svg);
  startVisualAnimationLoop(svg);
  refreshActiveVoicesFromState();

  updateStatus(chartModel);
}

function scheduleRender(delay = 0) {
  if (renderTimer) {
    clearTimeout(renderTimer);
  }
  renderTimer = setTimeout(() => {
    renderTimer = null;
    syncControlReadouts();
    renderChart();
    scheduleStateUrlUpdate();
  }, delay);
}

function serializeSvg(svg, { withXmlHeader = true } = {}) {
  const clone = svg.cloneNode(true);
  clone.removeAttribute("role");
  clone.removeAttribute("aria-label");
  clone.setAttribute("xmlns", SVG_NS);
  const serialized = new XMLSerializer().serializeToString(clone);
  return withXmlHeader ? `<?xml version="1.0" encoding="UTF-8"?>\n${serialized}` : serialized;
}

function clampExportSize(value, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return clamp(Math.round(value), 300, 6000);
}

function buildExportSvgString(width, height, options = {}) {
  const model = buildModel();
  const svg = buildChartSvg(model, width, height);
  return serializeSvg(svg, options);
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function exportSvg() {
  const width = clampExportSize(state.exportWidth, 1800);
  const height = clampExportSize(state.exportHeight, 1100);
  const svgText = buildExportSvgString(width, height, { withXmlHeader: true });
  downloadBlob(
    `overtones-${new Date().toISOString().slice(0, 10)}.svg`,
    new Blob([svgText], { type: "image/svg+xml;charset=utf-8" })
  );
}

function exportPdf() {
  const width = clampExportSize(state.exportWidth, 1800);
  const height = clampExportSize(state.exportHeight, 1100);
  const svgText = buildExportSvgString(width, height, { withXmlHeader: false });
  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Allow pop-ups to export PDF.");
    return;
  }
  const title = "Overtones Diagram";
  win.document.open();
  win.document.title = title;
  win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lexend:wght@200..700&family=Noto+Serif:wght@400..700&family=IBM+Plex+Sans:wght@300..700&display=swap"
      rel="stylesheet"
    />
    <style>
      @page { size: ${width}px ${height}px; margin: 0; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: white; }
      body { display: grid; place-items: center; }
      svg { width: ${width}px; height: ${height}px; display: block; }
    </style>
  </head>
  <body>
    ${svgText}
    <script>
      window.onload = () => {
        const waitFonts = document.fonts ? document.fonts.ready : Promise.resolve();
        waitFonts.finally(() => setTimeout(() => window.print(), 240));
      };
    </script>
  </body>
</html>`);
  win.document.close();
}

notesInput.addEventListener("input", () => {
  state.notesText = notesInput.value;
  scheduleRender(90);
});

ratioRootHzInput.addEventListener("input", () => {
  state.ratioRootHz = Math.max(0.01, getNumericInputValue(ratioRootHzInput, 220));
  scheduleRender();
});

a4HzInput.addEventListener("input", () => {
  state.a4Hz = Math.max(1, getNumericInputValue(a4HzInput, 440));
  scheduleRender();
});

overtoneCountInput.addEventListener("input", () => {
  state.overtoneCount = clamp(Math.round(getNumericInputValue(overtoneCountInput, 16)), 2, 48);
  scheduleRender();
});

yScaleInput.addEventListener("change", () => {
  state.yScale = yScaleInput.value === "linear" ? "linear" : "log";
  scheduleRender();
});

autoRangeInput.addEventListener("change", () => {
  state.autoRange = autoRangeInput.checked;
  scheduleRender();
});

rangeMinInput.addEventListener("input", () => {
  state.rangeMin = Math.max(0.01, getNumericInputValue(rangeMinInput, state.rangeMin));
  if (state.rangeMin >= state.rangeMax) {
    state.rangeMax = state.rangeMin + 1;
    rangeMaxInput.value = String(state.rangeMax);
  }
  scheduleRender();
});

rangeMaxInput.addEventListener("input", () => {
  state.rangeMax = Math.max(state.rangeMin + 0.01, getNumericInputValue(rangeMaxInput, state.rangeMax));
  if (state.rangeMax <= state.rangeMin) {
    state.rangeMin = Math.max(0.01, state.rangeMax - 1);
    rangeMinInput.value = String(state.rangeMin);
  }
  scheduleRender();
});

alignToleranceInput.addEventListener("input", () => {
  state.alignToleranceCents = clamp(getNumericInputValue(alignToleranceInput, 1), 1, 4);
  scheduleRender();
});

pointSizeInput.addEventListener("input", () => {
  state.pointSize = clamp(getNumericInputValue(pointSizeInput, 4), 2, 10);
  scheduleRender();
});

showAlignmentsInput.addEventListener("change", () => {
  state.showAlignments = showAlignmentsInput.checked;
  scheduleRender();
});

showLabelsInput.addEventListener("change", () => {
  state.showLabels = showLabelsInput.checked;
  scheduleRender();
});

if (showOvertoneNumbersInput) {
  showOvertoneNumbersInput.addEventListener("change", () => {
    state.showOvertoneNumbers = showOvertoneNumbersInput.checked;
    scheduleRender();
  });
}

showCombinationInput.addEventListener("change", () => {
  state.showCombination = showCombinationInput.checked;
  scheduleRender();
});

if (showFusionInput) {
  showFusionInput.addEventListener("change", () => {
    state.showFusion = showFusionInput.checked;
    scheduleRender();
  });
}

if (fusionClusterCentsInput) {
  fusionClusterCentsInput.addEventListener("input", () => {
    state.fusionClusterCents = clamp(getNumericInputValue(fusionClusterCentsInput, 1), 1, 4);
    scheduleRender();
  });
}

if (showRoughnessInput) {
  showRoughnessInput.addEventListener("change", () => {
    state.showRoughness = showRoughnessInput.checked;
    scheduleRender();
  });
}

if (roughnessAnimateInput) {
  roughnessAnimateInput.addEventListener("change", () => {
    state.roughnessAnimate = roughnessAnimateInput.checked;
    scheduleRender();
  });
}

if (roughnessBeatMinInput) {
  roughnessBeatMinInput.addEventListener("input", () => {
    state.roughnessBeatMinHz = clamp(getNumericInputValue(roughnessBeatMinInput, 0.5), 0.1, 40);
    if (state.roughnessBeatMaxHz <= state.roughnessBeatMinHz) {
      state.roughnessBeatMaxHz = clamp(state.roughnessBeatMinHz + 0.5, 0.2, 80);
      if (roughnessBeatMaxInput) {
        roughnessBeatMaxInput.value = String(state.roughnessBeatMaxHz);
      }
    }
    scheduleRender();
  });
}

if (roughnessBeatMaxInput) {
  roughnessBeatMaxInput.addEventListener("input", () => {
    state.roughnessBeatMaxHz = clamp(getNumericInputValue(roughnessBeatMaxInput, 20), 0.1, 80);
    if (state.roughnessBeatMaxHz <= state.roughnessBeatMinHz) {
      state.roughnessBeatMaxHz = clamp(state.roughnessBeatMinHz + 0.5, 0.2, 80);
      roughnessBeatMaxInput.value = String(state.roughnessBeatMaxHz);
    }
    scheduleRender();
  });
}

comboDifferenceInput.addEventListener("change", () => {
  state.showComboDifference = comboDifferenceInput.checked;
  scheduleRender();
});

comboSumInput.addEventListener("change", () => {
  state.showComboSum = comboSumInput.checked;
  scheduleRender();
});

comboOrder2Input.addEventListener("change", () => {
  state.showComboOrder2 = comboOrder2Input.checked;
  scheduleRender();
});

if (volumeInput) {
  volumeInput.addEventListener("input", () => {
    state.synthVolumeDb = clamp(getNumericInputValue(volumeInput, -12), -60, 0);
    updateMasterVolume();
    scheduleStateUrlUpdate();
  });
}

if (waveformInput) {
  waveformInput.addEventListener("change", () => {
    state.synthWaveform = waveformInput.value || "sine";
    refreshActiveVoicesFromState();
    scheduleStateUrlUpdate();
  });
}

if (attackInput) {
  attackInput.addEventListener("input", () => {
    state.synthAttack = Math.max(0.005, getNumericInputValue(attackInput, 0.02));
    scheduleStateUrlUpdate();
  });
}

if (decayInput) {
  decayInput.addEventListener("input", () => {
    state.synthDecay = Math.max(0.01, getNumericInputValue(decayInput, 0.2));
    scheduleStateUrlUpdate();
  });
}

if (sustainInput) {
  sustainInput.addEventListener("input", () => {
    state.synthSustain = clamp(getNumericInputValue(sustainInput, 0.6), 0, 1);
    scheduleStateUrlUpdate();
  });
}

if (releaseInput) {
  releaseInput.addEventListener("input", () => {
    state.synthRelease = Math.max(0.01, getNumericInputValue(releaseInput, 0.6));
    scheduleStateUrlUpdate();
  });
}

if (lfoDepthInput) {
  lfoDepthInput.addEventListener("input", () => {
    state.lfoDepth = clamp(getNumericInputValue(lfoDepthInput, 0.65), 0, 1);
    updateActiveLfoSettings();
    scheduleStateUrlUpdate();
  });
}

if (lfoRateInput) {
  lfoRateInput.addEventListener("input", () => {
    state.lfoRateControl = clamp(getNumericInputValue(lfoRateInput, 50), 0, 100);
    updateActiveLfoSettings();
    scheduleStateUrlUpdate();
  });
}

if (allNotesOffButton) {
  allNotesOffButton.addEventListener("click", () => {
    hardAllNotesOff();
  });
}

exportWidthInput.addEventListener("input", () => {
  state.exportWidth = clampExportSize(getNumericInputValue(exportWidthInput, 1800), 1800);
  scheduleStateUrlUpdate();
});

exportHeightInput.addEventListener("input", () => {
  state.exportHeight = clampExportSize(getNumericInputValue(exportHeightInput, 1100), 1100);
  scheduleStateUrlUpdate();
});

themeToggle.addEventListener("change", () => {
  state.themeDark = themeToggle.checked;
  document.body.classList.toggle("theme-dark", state.themeDark);
  scheduleRender();
});

exportSvgButton.addEventListener("click", exportSvg);
exportPdfButton.addEventListener("click", exportPdf);

window.addEventListener("resize", () => {
  scheduleRender(40);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "l" || event.key === "L") {
    lKeyHeld = true;
    return;
  }
  if (event.code === "Space") {
    if (isEditableTarget(event.target)) {
      return;
    }
    event.preventDefault();
    toggleSpacePlayback();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "l" || event.key === "L") {
    lKeyHeld = false;
    commitLfoArmIfNeeded();
  }
});

applyStateSnapshot(readStateFromUrl());
syncControlReadouts();
renderChart();
scheduleStateUrlUpdate(0);
