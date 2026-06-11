import {
  noteNamesSharp,
  noteNames,
  LETTERS,
  LETTER_TO_SEMITONE,
  TRUE_SPELLING_INTERVALS,
  HEJI_RULES,
  mod,
  floorDiv,
  gcd,
  reduceFraction,
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
import { customOscillators } from "../src/custom-oscillators";
import intervalChartData from "../src/interval-names.json";

const SVG_NS = "http://www.w3.org/2000/svg";

const chartStage = document.getElementById("chart-stage");
const tooltipEl = document.getElementById("chart-tooltip");
const statusEl = document.getElementById("status");
const modeLiveButton = document.getElementById("mode-live");
const modePrintButton = document.getElementById("mode-print");

const notesInput = document.getElementById("notes-input");
const ratioRootNoteInput = document.getElementById("ratio-root-note");
const ratioRootHzInput = document.getElementById("ratio-root-hz");
const ratioRootNoteCustomWrap = document.getElementById("ratio-root-note-custom-wrap");
const ratioRootNoteCustomInput = document.getElementById("ratio-root-note-custom");
const a4HzInput = document.getElementById("a4-hz");
const viewZoomInput = document.getElementById("view-zoom");
const viewZoomReadout = document.getElementById("view-zoom-readout");
const layoutScaleInput = document.getElementById("layout-scale");
const layoutScaleReadout = document.getElementById("layout-scale-readout");
const printHeightInput = document.getElementById("print-height");
const printHeightReadout = document.getElementById("print-height-readout");
const overtoneCountInput = document.getElementById("overtone-count");
const overtoneCountReadout = document.getElementById("overtone-count-readout");
const yScaleInput = document.getElementById("y-scale");
const harmonicScalingInput = document.getElementById("harmonic-scaling");
const colorSchemeInput = document.getElementById("color-scheme");
const autoRangeInput = document.getElementById("auto-range");
const rangeMinInput = document.getElementById("range-min");
const rangeMaxInput = document.getElementById("range-max");
const alignToleranceInput = document.getElementById("align-tolerance");
const alignToleranceReadout = document.getElementById("align-tolerance-readout");
const pointSizeInput = document.getElementById("point-size");
const stackLineSizeInput = document.getElementById("stack-line-size");
const stackLineSizeReadout = document.getElementById("stack-line-size-readout");
const alphaFalloffInput = document.getElementById("alpha-falloff");
const comboSizeInput = document.getElementById("combo-size");
const showAlignmentsInput = document.getElementById("show-alignments");
const showLabelsInput = document.getElementById("show-labels");
const showOvertoneNumbersInput = document.getElementById("show-overtone-numbers");
const showStemsInput = document.getElementById("show-stems");
const showCombinationInput = document.getElementById("show-combination");
const showChordControlsInput = document.getElementById("show-chord-controls");
const fusionControls = document.getElementById("fusion-controls");
const showFusionInput = document.getElementById("show-fusion");
const fusionReadoutRatioInput = document.getElementById("fusion-readout-ratio");
const fusionReadoutHzInput = document.getElementById("fusion-readout-hz");
const fusionModeInput = document.getElementById("fusion-mode");
const fusionClusterCentsInput = document.getElementById("fusion-cluster-cents");
const fusionClusterCentsReadout = document.getElementById("fusion-cluster-cents-readout");
const fusionScaleInput = document.getElementById("fusion-scale");
const fusionScaleReadout = document.getElementById("fusion-scale-readout");
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
const saveChartButton = document.getElementById("save-chart");
const openChartButton = document.getElementById("open-chart");
const openChartInput = document.getElementById("open-chart-input");
const themeToggle = document.getElementById("theme-toggle");
const printPaperInput = document.getElementById("print-paper");
const printMarginInput = document.getElementById("print-margin");
const printShowComponentLabelInput = document.getElementById("print-show-component-label");
const printShowComponentHzInput = document.getElementById("print-show-component-hz");
const printShowComponentRatioInput = document.getElementById("print-show-component-ratio");
const printShowComponentNoteInput = document.getElementById("print-show-component-note");
const printShowAxisTextInput = document.getElementById("print-show-axis-text");
const printShowLegendInput = document.getElementById("print-show-legend");
const printDistanceModeInput = document.getElementById("print-distance-mode");
const printDistanceShowRatioInput = document.getElementById("print-distance-show-ratio");
const printDistanceShowHzInput = document.getElementById("print-distance-show-hz");
const printDistanceShowIntervalInput = document.getElementById("print-distance-show-interval");
const printRestoreHiddenButton = document.getElementById("print-restore-hidden");
const printResetLayoutButton = document.getElementById("print-reset-layout");
const printTextStylesPanel = document.getElementById("print-text-styles-panel");
const printStyleOvertoneFontInput = document.getElementById("print-style-overtone-font");
const printStyleOvertoneSizeInput = document.getElementById("print-style-overtone-size");
const printStyleOvertoneSizeReadout = document.getElementById("print-style-overtone-size-readout");
const printStyleComponentFontInput = document.getElementById("print-style-component-font");
const printStyleComponentSizeInput = document.getElementById("print-style-component-size");
const printStyleComponentSizeReadout = document.getElementById("print-style-component-size-readout");
const printStyleAxisFontInput = document.getElementById("print-style-axis-font");
const printStyleAxisSizeInput = document.getElementById("print-style-axis-size");
const printStyleAxisSizeReadout = document.getElementById("print-style-axis-size-readout");
const printAddCustomTextButton = document.getElementById("print-add-custom-text");
const printAddCustomLabelButton = document.getElementById("print-add-custom-label");
const customTextInspector = document.getElementById("custom-text-inspector");
const printCustomSelectedTextInput = document.getElementById("print-custom-selected-text");
const printCustomSelectedFontInput = document.getElementById("print-custom-selected-font");
const printCustomSelectedSizeInput = document.getElementById("print-custom-selected-size");
const printCustomSelectedSizeReadout = document.getElementById("print-custom-selected-size-readout");
const printCustomDeleteSelectedButton = document.getElementById("print-custom-delete-selected");

const customTextModal = document.getElementById("custom-text-modal");
const customTextModalTitle = customTextModal?.querySelector("h3") || null;
const customTextInput = document.getElementById("custom-text-input");
const customTextSaveButton = document.getElementById("custom-text-save");
const customTextCancelButton = document.getElementById("custom-text-cancel");

if (customTextModal) {
  customTextModal.hidden = true;
  customTextModal.style.display = "none";
}

const PRINT_AUTO_TEXT_STYLE_DEFAULTS = {
  overtone: { font: "IBM Plex Sans", size: 8.5 },
  component: { font: "IBM Plex Sans", size: 9.5 },
  axis: { font: "Lexend", size: 11 },
};

const RATIO_ROOT_CUSTOM_VALUE = "hz";

const state = {
  notesText: notesInput.value,
  ratioRootNoteCustom: ratioRootNoteCustomInput?.value || "A",
  ratioRootHz: Number(ratioRootHzInput.value) || 220,
  a4Hz: Number(a4HzInput.value) || 440,
  viewZoom: Number(viewZoomInput?.value) || 1,
  layoutScale: Number(layoutScaleInput?.value) || 1,
  printGraphHeight: clamp(Number(printHeightInput?.value) || 1, 0.45, 1),
  overtoneCount: Number(overtoneCountInput.value) || 8,
  yScale: yScaleInput.value === "linear" ? "linear" : "log",
  harmonicScalingMode: harmonicScalingInput?.value || "pink",
  colorScheme: colorSchemeInput?.value || "hayward-vine",
  autoRange: autoRangeInput.checked,
  rangeMin: Number(rangeMinInput.value) || 40,
  rangeMax: Number(rangeMaxInput.value) || 6000,
  alignToleranceCents: Number(alignToleranceInput.value) || 1,
  pointSize: Number(pointSizeInput.value) || 4,
  stackLineSize: clamp((Number(stackLineSizeInput?.value ?? 100) || 100) / 100, 0.25, 3),
  alphaFalloff: alphaFalloffInput ? alphaFalloffInput.checked : true,
  comboSize: Number(comboSizeInput?.value) || 4,
  showAlignments: showAlignmentsInput.checked,
  showLabels: showLabelsInput ? showLabelsInput.checked : true,
  showOvertoneNumbers: showOvertoneNumbersInput ? showOvertoneNumbersInput.checked : true,
  showStems: showStemsInput ? showStemsInput.checked : true,
  showCombination: showCombinationInput.checked,
  showChordControls: showChordControlsInput ? showChordControlsInput.checked : true,
  showFusion: showFusionInput ? showFusionInput.checked : true,
  fusionReadoutRatio: fusionReadoutRatioInput ? fusionReadoutRatioInput.checked : true,
  fusionReadoutHz: fusionReadoutHzInput ? fusionReadoutHzInput.checked : true,
  fusionMode: fusionModeInput?.value || "align",
  fusionClusterCents: Number(fusionClusterCentsInput?.value ?? 1) || 1,
  fusionScale: clamp((Number(fusionScaleInput?.value ?? 100) || 100) / 100, 0.5, 1.5),
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
  exportWidth: Number(exportWidthInput?.value) || 1800,
  exportHeight: Number(exportHeightInput?.value) || 1100,
  themeDark: false,
  printPaper: printPaperInput?.value || "letter-landscape",
  printMargin: Number(printMarginInput?.value ?? 44) || 44,
  printColorMode: "greyscale",
  printShowComponentLabel: printShowComponentLabelInput
    ? printShowComponentLabelInput.checked
    : true,
  printShowComponentHz: printShowComponentHzInput ? printShowComponentHzInput.checked : true,
  printShowComponentRatio: printShowComponentRatioInput
    ? printShowComponentRatioInput.checked
    : false,
  printShowComponentNote: printShowComponentNoteInput
    ? printShowComponentNoteInput.checked
    : false,
  printShowAxisText: printShowAxisTextInput ? printShowAxisTextInput.checked : true,
  printShowLegend: printShowLegendInput ? printShowLegendInput.checked : true,
  printDistanceMode: printDistanceModeInput ? printDistanceModeInput.checked : false,
  printCustomLabelFont: "Noto Serif",
  printCustomLabelSize: 18,
  printAutoTextStyles: cloneJson(PRINT_AUTO_TEXT_STYLE_DEFAULTS, PRINT_AUTO_TEXT_STYLE_DEFAULTS),
  printSelectedCustomTextId: null,
  printDistanceShowRatio: printDistanceShowRatioInput ? printDistanceShowRatioInput.checked : true,
  printDistanceShowHz: printDistanceShowHzInput ? printDistanceShowHzInput.checked : true,
  printDistanceShowInterval: printDistanceShowIntervalInput
    ? printDistanceShowIntervalInput.checked
    : true,
  printHiddenKeys: {},
  printColumnOverrides: {},
  printLabelOffsets: {},
  printComponentXOverrides: {},
  printDiagramOffsetX: 0,
  printDiagramOffsetY: 0,
  printDistanceAnnotations: [],
  printCustomTexts: [],
  printCustomLabels: [],
  printComboLinksVisible: {},
  printChordTitleOverrides: {},
  printAlignmentLabelOverrides: {},
  printYAxisLabelOverride: "",
  printYAxisLabelHasOverride: false,
};

const intervalNameEntries = Array.isArray(intervalChartData)
  ? intervalChartData
      .map((entry) => {
        const numerator = Number(entry?.numerator);
        const denominator = Number(entry?.denominator);
        const name = String(entry?.name || "").trim();
        if (!(numerator > 0) || !(denominator > 0) || !name) {
          return null;
        }
        const ratio = numerator / denominator;
        if (!(ratio > 0)) {
          return null;
        }
        return {
          name,
          ratio,
          cents: 1200 * Math.log2(ratio),
        };
      })
      .filter(Boolean)
  : [];

const OVERTONES_STATE_PARAM = "o";
const OVERTONES_STORAGE_KEY = "overtones-state-v2";
const MODE_LIVE = "live";
const MODE_PRINT = "print";

let chartModel = null;
let renderTimer = null;
let highlightedSourceDots = [];
let lKeyHeld = false;
let lfoArm = null;
let alignmentFocusMode = false;
let stateUrlTimer = null;
let suspendStateUrlSync = false;
let appMode = MODE_LIVE;
const modeSnapshots = {
  [MODE_LIVE]: null,
  [MODE_PRINT]: null,
};
let printDragState = null;
let printDistancePendingKey = null;
let printLabelDragFocus = null;
let canvasPanX = 0;
let canvasPanY = 0;
let panDragState = null;
let lastDiagramCenter = { x: 640, y: 360 };
let syncingCustomInspector = false;
let customTextDialogMode = "custom";
let pendingCustomLabelTarget = false;
let pendingCustomLabelActionId = 0;
let customActionSequence = 0;
let customTextDialogResolver = null;
let customTextDialogOpenedAt = 0;

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

function nextCustomActionId() {
  customActionSequence += 1;
  return customActionSequence;
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

function cloneJson(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}




function midiToFundamentalNoteName(midi) {
  return `${noteNamesSharp[mod(midi, 12)]}${Math.floor(midi / 12) - 1}`;
}





function normalizePitchClassText(value) {
  const raw = String(value || "")
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .trim();
  const match = raw.match(/^([A-Ga-g])\s*([#bx]*)/);
  if (!match) {
    return "";
  }
  return `${match[1].toUpperCase()}${match[2] || ""}`;
}





function getRatioRootFallbackPitchClass() {
  const nearest = getNearestEtInfo(Math.max(1e-9, state.ratioRootHz), Math.max(1e-9, state.a4Hz));
  return nearest?.pitchClass || "A";
}

function getFundamentalPitchClassForSpelling() {
  if (ratioRootNoteInput && ratioRootNoteInput.value !== RATIO_ROOT_CUSTOM_VALUE) {
    const midi = Number(ratioRootNoteInput.value);
    if (Number.isFinite(midi)) {
      return noteNamesSharp[mod(midi, 12)];
    }
  }
  const customPitchClass = normalizePitchClassText(state.ratioRootNoteCustom);
  return customPitchClass || getRatioRootFallbackPitchClass();
}



function getPitchClassFromRatioValue(ratioValue, freq) {
  const a4 = Math.max(1e-9, Number(state.a4Hz) || 440);
  const nearest = getNearestEtInfo(freq, a4);
  const nearestPitchClass = nearest ? noteNames[mod(nearest.midi, 12)] : "A";
  if (!(ratioValue > 0) || !Number.isFinite(ratioValue)) {
    return { pitchClass: nearestPitchClass, axisRatios: [] };
  }
  const approx = approximateRatio(ratioValue, 2048);
  if (!approx) {
    return { pitchClass: nearestPitchClass, axisRatios: [] };
  }
  const approxValue = approx.numerator / approx.denominator;
  const approxErrorCents = Math.abs(1200 * Math.log2(ratioValue / Math.max(1e-9, approxValue)));
  if (approxErrorCents > 0.75) {
    return { pitchClass: nearestPitchClass, axisRatios: [] };
  }

  const normalized = normalizeRatioToOctave(approx.numerator, approx.denominator);
  if (normalized) {
    const reducedNormalized = reduceFraction(normalized.numerator, normalized.denominator);
    if (reducedNormalized.numerator === reducedNormalized.denominator) {
      return {
        pitchClass: getFundamentalPitchClassForSpelling(),
        axisRatios: [],
      };
    }
  }
  const analysis = analyzeRatioForTrueSpelling(approx.numerator, approx.denominator);
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

function getNearestEtPitchClassForFreq(freq) {
  const a4 = Math.max(1e-9, Number(state.a4Hz) || 440);
  const nearest = getNearestEtInfo(freq, a4);
  return nearest ? noteNames[mod(nearest.midi, 12)] : noteNamesSharp[0];
}

function buildNoteSpellingInfo(freq, options = {}) {
  if (!(freq > 0) || !Number.isFinite(freq)) {
    return null;
  }
  const allowHeji = options?.allowHeji !== false;
  const ratioBase = Math.max(1e-9, state.ratioRootHz);
  const ratioValue = freq / ratioBase;
  const spelling = allowHeji
    ? getPitchClassFromRatioValue(ratioValue, freq)
    : { pitchClass: getNearestEtPitchClassForFreq(freq), axisRatios: [] };
  const pitchClassText = spelling.pitchClass || noteNamesSharp[0];
  const heji = allowHeji
    ? getHejiAnnotationForAxisRatios(spelling.axisRatios, pitchClassText)
    : { baseText: pitchClassText, suffixParts: [] };
  const hejiParts = (heji.suffixParts || [])
    .filter((part) => part?.source === "rule")
    .map((part) => ({
      glyphText: String(part?.text || ""),
      expText: String(part?.expLabel || ""),
    }))
    .filter((part) => part.glyphText || part.expText);
  const ruleSuffixText = hejiParts.map((part) => `${part.glyphText}${part.expText}`).join("");
  const a4 = Math.max(1e-9, Number(state.a4Hz) || 440);
  const baseText = String(heji.baseText || pitchClassText || "");
  const pitchMatch = baseText.match(/^([A-G])([#bx]*)$/);
  const letterText = pitchMatch?.[1] || String(pitchClassText || "").slice(0, 1);
  const accidentalText = pitchMatch?.[2] || "";
  const pitchPrefixText = `${letterText}${accidentalText}`;
  const pitchClassForOctave = pitchClassText;
  const semitoneValue = mod(getPitchClassSemitoneValue(pitchClassForOctave), 12);
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midiBase = Math.round((midiFloat - semitoneValue) / 12);
  const midi = semitoneValue + 12 * midiBase;
  const octaveText = String(Math.floor(midi / 12) - 1);
  const text = `${pitchPrefixText}${ruleSuffixText}${octaveText}`;
  return {
    pitchClassText,
    pitchPrefixText,
    baseText,
    suffixText: ruleSuffixText,
    hejiParts,
    octaveText,
    text,
  };
}

function populateRatioRootNotes() {
  if (!ratioRootNoteInput) {
    return;
  }
  ratioRootNoteInput.innerHTML = "";
  const customOption = document.createElement("option");
  customOption.value = RATIO_ROOT_CUSTOM_VALUE;
  customOption.textContent = "Specify in Hz";
  ratioRootNoteInput.appendChild(customOption);
  for (let midi = 0; midi <= 96; midi += 1) {
    const option = document.createElement("option");
    option.value = String(midi);
    option.textContent = midiToFundamentalNoteName(midi);
    ratioRootNoteInput.appendChild(option);
  }
}

function updateRatioRootNoteOptions() {
  if (!ratioRootNoteInput) {
    return;
  }
  const a4 = Math.max(1, Number(state.a4Hz) || 440);
  const selectedValue = ratioRootNoteInput.value || "";
  Array.from(ratioRootNoteInput.options).forEach((option) => {
    if (option.value === RATIO_ROOT_CUSTOM_VALUE) {
      option.textContent = "Specify in Hz";
      return;
    }
    const midi = Number(option.value);
    const freq = midiToFrequency(midi, a4);
    option.textContent = `${midiToFundamentalNoteName(midi)} (${formatHz(freq)})`;
  });
  if (selectedValue) {
    ratioRootNoteInput.value = selectedValue;
  }
}

function syncRatioRootCustomInputVisibility() {
  if (!ratioRootNoteCustomWrap || !ratioRootNoteInput) {
    return;
  }
  const show = ratioRootNoteInput.value === RATIO_ROOT_CUSTOM_VALUE;
  ratioRootNoteCustomWrap.hidden = !show;
}

function syncRatioRootNoteSelectFromFrequency() {
  if (!ratioRootNoteInput) {
    return;
  }
  const freq = Number(state.ratioRootHz);
  const a4 = Math.max(1, Number(state.a4Hz) || 440);
  const nearest = getNearestEtInfo(freq, a4);
  if (!nearest) {
    ratioRootNoteInput.value = RATIO_ROOT_CUSTOM_VALUE;
    syncRatioRootCustomInputVisibility();
    return;
  }
  const targetFreq = midiToFrequency(nearest.midi, a4);
  if (Math.abs(targetFreq - freq) <= 0.01) {
    ratioRootNoteInput.value = String(nearest.midi);
  } else {
    ratioRootNoteInput.value = RATIO_ROOT_CUSTOM_VALUE;
  }
  syncRatioRootCustomInputVisibility();
}

function getStateSnapshotFlat() {
  return {
    notesText: state.notesText,
    ratioRootNoteCustom: state.ratioRootNoteCustom,
    ratioRootHz: state.ratioRootHz,
    a4Hz: state.a4Hz,
    viewZoom: state.viewZoom,
    layoutScale: state.layoutScale,
    printGraphHeight: state.printGraphHeight,
    overtoneCount: state.overtoneCount,
    yScale: state.yScale,
    harmonicScalingMode: state.harmonicScalingMode,
    colorScheme: state.colorScheme,
    autoRange: state.autoRange,
    rangeMin: state.rangeMin,
    rangeMax: state.rangeMax,
    alignToleranceCents: state.alignToleranceCents,
    pointSize: state.pointSize,
    stackLineSize: state.stackLineSize,
    alphaFalloff: state.alphaFalloff,
    comboSize: state.comboSize,
    showAlignments: state.showAlignments,
    showLabels: state.showLabels,
    showOvertoneNumbers: state.showOvertoneNumbers,
    showStems: state.showStems,
    showCombination: state.showCombination,
    showChordControls: state.showChordControls,
    showFusion: state.showFusion,
    fusionReadoutRatio: state.fusionReadoutRatio,
    fusionReadoutHz: state.fusionReadoutHz,
    fusionMode: state.fusionMode,
    fusionClusterCents: state.fusionClusterCents,
    fusionScale: state.fusionScale,
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
    printPaper: state.printPaper,
    printMargin: state.printMargin,
    printColorMode: state.printColorMode,
    printShowComponentLabel: state.printShowComponentLabel,
    printShowComponentHz: state.printShowComponentHz,
    printShowComponentRatio: state.printShowComponentRatio,
    printShowComponentNote: state.printShowComponentNote,
    printShowAxisText: state.printShowAxisText,
    printShowLegend: state.printShowLegend,
    printDistanceMode: state.printDistanceMode,
    printCustomLabelFont: state.printCustomLabelFont,
    printCustomLabelSize: state.printCustomLabelSize,
    printAutoTextStyles: cloneJson(state.printAutoTextStyles, PRINT_AUTO_TEXT_STYLE_DEFAULTS),
    printSelectedCustomTextId: state.printSelectedCustomTextId,
    printDistanceShowRatio: state.printDistanceShowRatio,
    printDistanceShowHz: state.printDistanceShowHz,
    printDistanceShowInterval: state.printDistanceShowInterval,
    printHiddenKeys: cloneJson(state.printHiddenKeys, {}),
    printColumnOverrides: cloneJson(state.printColumnOverrides, {}),
    printLabelOffsets: cloneJson(state.printLabelOffsets, {}),
    printComponentXOverrides: cloneJson(state.printComponentXOverrides, {}),
    printDiagramOffsetX: state.printDiagramOffsetX,
    printDiagramOffsetY: state.printDiagramOffsetY,
    printDistanceAnnotations: cloneJson(state.printDistanceAnnotations, []),
    printCustomTexts: cloneJson(state.printCustomTexts, []),
    printCustomLabels: cloneJson(state.printCustomLabels, []),
    printComboLinksVisible: cloneJson(state.printComboLinksVisible, {}),
    printChordTitleOverrides: cloneJson(state.printChordTitleOverrides, {}),
    printAlignmentLabelOverrides: cloneJson(state.printAlignmentLabelOverrides, {}),
    printYAxisLabelOverride: state.printYAxisLabelOverride,
    printYAxisLabelHasOverride: state.printYAxisLabelHasOverride,
  };
}

function normalizeSnapshotFlat(snapshot) {
  const defaults = getStateSnapshotFlat();
  const incoming = snapshot && typeof snapshot === "object" ? snapshot : {};
  const merged = { ...defaults, ...incoming };
  merged.printAutoTextStyles = cloneJson(
    incoming.printAutoTextStyles && typeof incoming.printAutoTextStyles === "object"
      ? incoming.printAutoTextStyles
      : defaults.printAutoTextStyles,
    defaults.printAutoTextStyles
  );
  merged.printHiddenKeys = cloneJson(incoming.printHiddenKeys, defaults.printHiddenKeys);
  merged.printColumnOverrides = cloneJson(incoming.printColumnOverrides, defaults.printColumnOverrides);
  merged.printLabelOffsets = cloneJson(incoming.printLabelOffsets, defaults.printLabelOffsets);
  merged.printComponentXOverrides = cloneJson(incoming.printComponentXOverrides, defaults.printComponentXOverrides);
  merged.printDistanceAnnotations = cloneJson(incoming.printDistanceAnnotations, defaults.printDistanceAnnotations);
  merged.printCustomTexts = cloneJson(incoming.printCustomTexts, defaults.printCustomTexts);
  merged.printCustomLabels = cloneJson(incoming.printCustomLabels, defaults.printCustomLabels);
  merged.printComboLinksVisible = cloneJson(incoming.printComboLinksVisible, defaults.printComboLinksVisible);
  merged.printChordTitleOverrides = cloneJson(incoming.printChordTitleOverrides, defaults.printChordTitleOverrides);
  merged.printAlignmentLabelOverrides = cloneJson(
    incoming.printAlignmentLabelOverrides,
    defaults.printAlignmentLabelOverrides
  );
  return merged;
}

function syncSharedNotesAcrossModes() {
  const sharedNotes = String(state.notesText ?? "");
  state.notesText = sharedNotes;
  notesInput.value = sharedNotes;
  if (modeSnapshots[MODE_LIVE] && typeof modeSnapshots[MODE_LIVE] === "object") {
    modeSnapshots[MODE_LIVE].notesText = sharedNotes;
  }
  if (modeSnapshots[MODE_PRINT] && typeof modeSnapshots[MODE_PRINT] === "object") {
    modeSnapshots[MODE_PRINT].notesText = sharedNotes;
  }
}

function getSerializedState() {
  modeSnapshots[appMode] = getStateSnapshotFlat();
  if (!modeSnapshots[MODE_LIVE]) {
    modeSnapshots[MODE_LIVE] = getStateSnapshotFlat();
  }
  modeSnapshots[MODE_LIVE] = normalizeSnapshotFlat(modeSnapshots[MODE_LIVE]);
  if (!modeSnapshots[MODE_PRINT]) {
    const seed = getStateSnapshotFlat();
    seed.themeDark = false;
    seed.printDistanceMode = false;
    modeSnapshots[MODE_PRINT] = seed;
  }
  modeSnapshots[MODE_PRINT] = normalizeSnapshotFlat(modeSnapshots[MODE_PRINT]);
  syncSharedNotesAcrossModes();
  return {
    mode: appMode,
    live: modeSnapshots[MODE_LIVE],
    print: modeSnapshots[MODE_PRINT],
  };
}

function toSerializedState(value) {
  const root = value && typeof value === "object" ? value : null;
  if (!root) {
    return null;
  }
  const payload = root.data && typeof root.data === "object" ? root.data : root;
  if (payload.live && payload.print) {
    return {
      mode: payload.mode === MODE_PRINT ? MODE_PRINT : MODE_LIVE,
      live: normalizeSnapshotFlat(cloneJson(payload.live, null)),
      print: normalizeSnapshotFlat(cloneJson(payload.print, null)),
    };
  }
  if (payload && typeof payload === "object") {
    const flat = normalizeSnapshotFlat(cloneJson(payload, null));
    const live = normalizeSnapshotFlat(cloneJson(flat, null));
    const print = normalizeSnapshotFlat({
      ...cloneJson(flat, null),
      themeDark: false,
      printDistanceMode: false,
    });
    return {
      mode: payload.mode === MODE_PRINT ? MODE_PRINT : MODE_LIVE,
      live,
      print,
    };
  }
  return null;
}

function saveStateToStorage(serialized = null) {
  try {
    const next = serialized && typeof serialized === "object" ? serialized : getSerializedState();
    const wrapped = {
      format: "overtones-chart-state",
      version: 2,
      savedAt: new Date().toISOString(),
      data: next,
    };
    window.localStorage?.setItem(OVERTONES_STORAGE_KEY, JSON.stringify(wrapped));
  } catch {}
}

function readStateFromStorage() {
  try {
    const raw = window.localStorage?.getItem(OVERTONES_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function applySerializedState(serialized) {
  const normalized = toSerializedState(serialized);
  if (!normalized) {
    return false;
  }
  modeSnapshots[MODE_LIVE] = normalizeSnapshotFlat(cloneJson(normalized.live, null));
  modeSnapshots[MODE_PRINT] = normalizeSnapshotFlat(cloneJson(normalized.print, null));
  applyStateSnapshot(normalized.mode === MODE_PRINT ? modeSnapshots[MODE_PRINT] : modeSnapshots[MODE_LIVE]);
  appMode = normalized.mode === MODE_PRINT ? MODE_PRINT : MODE_LIVE;
  return true;
}

function getSerializedSavedAtMs(value) {
  const root = value && typeof value === "object" ? value : null;
  if (!root) {
    return 0;
  }
  const savedAt = typeof root.savedAt === "string" ? Date.parse(root.savedAt) : NaN;
  if (Number.isFinite(savedAt) && savedAt > 0) {
    return savedAt;
  }
  return 0;
}

function chooseInitialSerializedState(urlState, storedState) {
  const urlNormalized = toSerializedState(urlState);
  const storedNormalized = toSerializedState(storedState);
  const hasUrl = Boolean(urlNormalized);
  const hasStored = Boolean(storedNormalized);
  if (!hasUrl && !hasStored) {
    return null;
  }
  if (hasUrl && !hasStored) {
    return urlState;
  }
  if (!hasUrl && hasStored) {
    return storedState;
  }
  const urlMs = getSerializedSavedAtMs(urlState);
  const storedMs = getSerializedSavedAtMs(storedState);
  if (storedMs > urlMs) {
    return storedState;
  }
  return urlState;
}

function updateStateUrl() {
  if (suspendStateUrlSync) {
    return;
  }
  const serialized = getSerializedState();
  saveStateToStorage(serialized);
  try {
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    hashParams.set(OVERTONES_STATE_PARAM, encodeStateBase64Url(buildChartSaveDocument(serialized)));
    const nextHash = hashParams.toString();
    if (location.hash === `#${nextHash}`) {
      return;
    }
    history.replaceState(null, "", `${location.pathname}${location.search}#${nextHash}`);
  } catch {}
}

function finalizeLoadedState() {
  if (appMode === MODE_PRINT) {
    state.themeDark = false;
    themeToggle.checked = false;
    document.body.classList.remove("theme-dark");
  }
  updateRatioRootNoteOptions();
  syncRatioRootNoteSelectFromFrequency();
  if (ratioRootNoteCustomInput) {
    ratioRootNoteCustomInput.value = state.ratioRootNoteCustom;
  }
  syncSharedNotesAcrossModes();
  syncModeButtons();
  syncControlReadouts();
  renderChart();
  scheduleStateUrlUpdate(0);
}

function scheduleStateUrlUpdate(delay = 220) {
  if (suspendStateUrlSync) {
    return;
  }
  // Persist immediately so rapid refresh/navigation doesn't lose recent edits.
  saveStateToStorage();
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
    if (typeof snapshot.ratioRootNoteCustom === "string") {
      state.ratioRootNoteCustom = snapshot.ratioRootNoteCustom || "A";
      if (ratioRootNoteCustomInput) {
        ratioRootNoteCustomInput.value = state.ratioRootNoteCustom;
      }
    }
    if (Number.isFinite(snapshot.ratioRootHz)) {
      state.ratioRootHz = Math.max(0.01, Number(snapshot.ratioRootHz));
      ratioRootHzInput.value = String(state.ratioRootHz);
      syncRatioRootNoteSelectFromFrequency();
    }
    if (Number.isFinite(snapshot.a4Hz)) {
      state.a4Hz = Math.max(1, Number(snapshot.a4Hz));
      a4HzInput.value = String(state.a4Hz);
      updateRatioRootNoteOptions();
      syncRatioRootNoteSelectFromFrequency();
    }
    if (Number.isFinite(snapshot.viewZoom) && viewZoomInput) {
      state.viewZoom = clamp(Number(snapshot.viewZoom), 0.3, 3);
      viewZoomInput.value = String(state.viewZoom);
    }
    if (Number.isFinite(snapshot.layoutScale) && layoutScaleInput) {
      state.layoutScale = clamp(Number(snapshot.layoutScale), 0.6, 1.8);
      layoutScaleInput.value = String(state.layoutScale);
    }
    if (Number.isFinite(snapshot.printGraphHeight)) {
      state.printGraphHeight = clamp(Number(snapshot.printGraphHeight), 0.45, 1);
      if (printHeightInput) {
        printHeightInput.value = String(state.printGraphHeight);
      }
    }
    if (Number.isFinite(snapshot.overtoneCount)) {
      state.overtoneCount = clamp(Math.round(Number(snapshot.overtoneCount)), 2, 48);
      overtoneCountInput.value = String(state.overtoneCount);
    }
    if (snapshot.yScale === "linear" || snapshot.yScale === "log") {
      state.yScale = snapshot.yScale;
      yScaleInput.value = state.yScale;
    }
    if (
      snapshot.harmonicScalingMode === "pink" ||
      snapshot.harmonicScalingMode === "sqrt" ||
      snapshot.harmonicScalingMode === "flat" ||
      snapshot.harmonicScalingMode === "steep"
    ) {
      state.harmonicScalingMode = snapshot.harmonicScalingMode;
      if (harmonicScalingInput) {
        harmonicScalingInput.value = state.harmonicScalingMode;
      }
    }
    if (isColorSchemeId(snapshot.colorScheme)) {
      state.colorScheme = snapshot.colorScheme;
      if (colorSchemeInput) {
        colorSchemeInput.value = state.colorScheme;
      }
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
    if (Number.isFinite(snapshot.stackLineSize) && stackLineSizeInput) {
      state.stackLineSize = clamp(Number(snapshot.stackLineSize), 0.25, 3);
      stackLineSizeInput.value = String(Math.round(state.stackLineSize * 100));
    }
    if (typeof snapshot.alphaFalloff === "boolean" && alphaFalloffInput) {
      state.alphaFalloff = snapshot.alphaFalloff;
      alphaFalloffInput.checked = snapshot.alphaFalloff;
    }
    if (Number.isFinite(snapshot.comboSize) && comboSizeInput) {
      state.comboSize = clamp(Number(snapshot.comboSize), 2, 10);
      comboSizeInput.value = String(state.comboSize);
    } else if (Number.isFinite(snapshot.pointSize) && comboSizeInput) {
      // Backward compatibility for older links where combo size followed point size.
      state.comboSize = clamp(Number(snapshot.pointSize), 2, 10);
      comboSizeInput.value = String(state.comboSize);
    }
    if (typeof snapshot.showAlignments === "boolean") {
      state.showAlignments = snapshot.showAlignments;
      showAlignmentsInput.checked = snapshot.showAlignments;
    }
    if (typeof snapshot.showLabels === "boolean") {
      state.showLabels = snapshot.showLabels;
      if (showLabelsInput) {
        showLabelsInput.checked = snapshot.showLabels;
      }
    }
    if (typeof snapshot.showOvertoneNumbers === "boolean" && showOvertoneNumbersInput) {
      state.showOvertoneNumbers = snapshot.showOvertoneNumbers;
      showOvertoneNumbersInput.checked = snapshot.showOvertoneNumbers;
    }
    if (typeof snapshot.showStems === "boolean" && showStemsInput) {
      state.showStems = snapshot.showStems;
      showStemsInput.checked = snapshot.showStems;
    }
    if (typeof snapshot.showCombination === "boolean") {
      state.showCombination = snapshot.showCombination;
      showCombinationInput.checked = snapshot.showCombination;
    }
    if (typeof snapshot.showChordControls === "boolean" && showChordControlsInput) {
      state.showChordControls = snapshot.showChordControls;
      showChordControlsInput.checked = snapshot.showChordControls;
    }
    if (typeof snapshot.showFusion === "boolean" && showFusionInput) {
      state.showFusion = snapshot.showFusion;
      showFusionInput.checked = snapshot.showFusion;
    }
    if (typeof snapshot.fusionReadoutRatio === "boolean" && fusionReadoutRatioInput) {
      state.fusionReadoutRatio = snapshot.fusionReadoutRatio;
      fusionReadoutRatioInput.checked = snapshot.fusionReadoutRatio;
    }
    if (typeof snapshot.fusionReadoutHz === "boolean" && fusionReadoutHzInput) {
      state.fusionReadoutHz = snapshot.fusionReadoutHz;
      fusionReadoutHzInput.checked = snapshot.fusionReadoutHz;
    }
    if ((snapshot.fusionMode === "align" || snapshot.fusionMode === "all") && fusionModeInput) {
      state.fusionMode = snapshot.fusionMode;
      fusionModeInput.value = snapshot.fusionMode;
    }
    if (Number.isFinite(snapshot.fusionClusterCents) && fusionClusterCentsInput) {
      state.fusionClusterCents = clamp(Number(snapshot.fusionClusterCents), 0, 4);
      fusionClusterCentsInput.value = String(state.fusionClusterCents);
    }
    if (Number.isFinite(snapshot.fusionScale)) {
      state.fusionScale = clamp(Number(snapshot.fusionScale), 0.5, 1.5);
      if (fusionScaleInput) {
        fusionScaleInput.value = String(Math.round(state.fusionScale * 100));
      }
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
      snapshot.synthWaveform === "semisine" ||
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
      if (exportWidthInput) {
        exportWidthInput.value = String(state.exportWidth);
      }
    }
    if (Number.isFinite(snapshot.exportHeight)) {
      state.exportHeight = clampExportSize(Number(snapshot.exportHeight), 1100);
      if (exportHeightInput) {
        exportHeightInput.value = String(state.exportHeight);
      }
    }
    if (typeof snapshot.themeDark === "boolean") {
      state.themeDark = snapshot.themeDark;
      themeToggle.checked = snapshot.themeDark;
      document.body.classList.toggle("theme-dark", snapshot.themeDark);
    }
    if (
      snapshot.printPaper === "letter-portrait" ||
      snapshot.printPaper === "letter-landscape" ||
      snapshot.printPaper === "a4-portrait" ||
      snapshot.printPaper === "a4-landscape"
    ) {
      state.printPaper = snapshot.printPaper;
      if (printPaperInput) {
        printPaperInput.value = snapshot.printPaper;
      }
    }
    if (Number.isFinite(snapshot.printMargin)) {
      state.printMargin = clamp(Number(snapshot.printMargin), 8, 220);
      if (printMarginInput) {
        printMarginInput.value = String(state.printMargin);
      }
    }
    if (snapshot.printColorMode === "greyscale" || isColorSchemeId(snapshot.printColorMode)) {
      state.printColorMode = snapshot.printColorMode;
    } else if (typeof snapshot.printGrayscale === "boolean") {
      // Backward compatibility for previous boolean print grayscale state.
      state.printColorMode = snapshot.printGrayscale
        ? "greyscale"
        : (isColorSchemeId(state.colorScheme) ? state.colorScheme : "hayward-vine");
    }
    if (typeof snapshot.printShowComponentLabel === "boolean") {
      state.printShowComponentLabel = snapshot.printShowComponentLabel;
      if (printShowComponentLabelInput) {
        printShowComponentLabelInput.checked = snapshot.printShowComponentLabel;
      }
    }
    if (typeof snapshot.printShowComponentHz === "boolean") {
      state.printShowComponentHz = snapshot.printShowComponentHz;
      if (printShowComponentHzInput) {
        printShowComponentHzInput.checked = snapshot.printShowComponentHz;
      }
    }
    if (typeof snapshot.printShowComponentRatio === "boolean") {
      state.printShowComponentRatio = snapshot.printShowComponentRatio;
      if (printShowComponentRatioInput) {
        printShowComponentRatioInput.checked = snapshot.printShowComponentRatio;
      }
    }
    if (typeof snapshot.printShowComponentNote === "boolean") {
      state.printShowComponentNote = snapshot.printShowComponentNote;
      if (printShowComponentNoteInput) {
        printShowComponentNoteInput.checked = snapshot.printShowComponentNote;
      }
    }
    if (typeof snapshot.printShowAxisText === "boolean") {
      state.printShowAxisText = snapshot.printShowAxisText;
      if (printShowAxisTextInput) {
        printShowAxisTextInput.checked = snapshot.printShowAxisText;
      }
    }
    if (typeof snapshot.printShowLegend === "boolean") {
      state.printShowLegend = snapshot.printShowLegend;
      if (printShowLegendInput) {
        printShowLegendInput.checked = snapshot.printShowLegend;
      }
    }
    if (typeof snapshot.printDistanceMode === "boolean") {
      state.printDistanceMode = snapshot.printDistanceMode;
      if (printDistanceModeInput) {
        printDistanceModeInput.checked = snapshot.printDistanceMode;
      }
    }
    if (typeof snapshot.printCustomLabelFont === "string") {
      state.printCustomLabelFont = snapshot.printCustomLabelFont;
    }
    if (Number.isFinite(snapshot.printCustomLabelSize)) {
      state.printCustomLabelSize = clamp(Number(snapshot.printCustomLabelSize), 8, 72);
    }
    if (snapshot.printAutoTextStyles && typeof snapshot.printAutoTextStyles === "object") {
      const next = cloneJson(PRINT_AUTO_TEXT_STYLE_DEFAULTS, PRINT_AUTO_TEXT_STYLE_DEFAULTS);
      ["overtone", "component", "axis"].forEach((key) => {
        const incoming = snapshot.printAutoTextStyles[key];
        if (!incoming || typeof incoming !== "object") {
          return;
        }
        if (typeof incoming.font === "string" && incoming.font.trim()) {
          next[key].font = incoming.font.trim();
        }
        if (Number.isFinite(incoming.size)) {
          next[key].size = clamp(Number(incoming.size), 8, 72);
        }
      });
      state.printAutoTextStyles = next;
    }
    if (typeof snapshot.printSelectedCustomTextId === "string" || snapshot.printSelectedCustomTextId == null) {
      state.printSelectedCustomTextId = snapshot.printSelectedCustomTextId || null;
    }
    if (typeof snapshot.printDistanceShowRatio === "boolean") {
      state.printDistanceShowRatio = snapshot.printDistanceShowRatio;
      if (printDistanceShowRatioInput) {
        printDistanceShowRatioInput.checked = snapshot.printDistanceShowRatio;
      }
    }
    if (typeof snapshot.printDistanceShowHz === "boolean") {
      state.printDistanceShowHz = snapshot.printDistanceShowHz;
      if (printDistanceShowHzInput) {
        printDistanceShowHzInput.checked = snapshot.printDistanceShowHz;
      }
    }
    if (typeof snapshot.printDistanceShowInterval === "boolean") {
      state.printDistanceShowInterval = snapshot.printDistanceShowInterval;
      if (printDistanceShowIntervalInput) {
        printDistanceShowIntervalInput.checked = snapshot.printDistanceShowInterval;
      }
    }
    if (snapshot.printHiddenKeys && typeof snapshot.printHiddenKeys === "object") {
      state.printHiddenKeys = cloneJson(snapshot.printHiddenKeys, {});
    }
    if (snapshot.printColumnOverrides && typeof snapshot.printColumnOverrides === "object") {
      state.printColumnOverrides = cloneJson(snapshot.printColumnOverrides, {});
    }
    if (snapshot.printLabelOffsets && typeof snapshot.printLabelOffsets === "object") {
      state.printLabelOffsets = cloneJson(snapshot.printLabelOffsets, {});
    }
    if (snapshot.printComponentXOverrides && typeof snapshot.printComponentXOverrides === "object") {
      state.printComponentXOverrides = cloneJson(snapshot.printComponentXOverrides, {});
    }
    if (Number.isFinite(snapshot.printDiagramOffsetX)) {
      state.printDiagramOffsetX = Number(snapshot.printDiagramOffsetX);
    }
    if (Number.isFinite(snapshot.printDiagramOffsetY)) {
      state.printDiagramOffsetY = Number(snapshot.printDiagramOffsetY);
    }
    if (Array.isArray(snapshot.printDistanceAnnotations)) {
      state.printDistanceAnnotations = cloneJson(snapshot.printDistanceAnnotations, []);
    }
    if (Array.isArray(snapshot.printCustomTexts)) {
      state.printCustomTexts = cloneJson(snapshot.printCustomTexts, []);
    }
    if (Array.isArray(snapshot.printCustomLabels)) {
      state.printCustomLabels = cloneJson(snapshot.printCustomLabels, []);
    }
    if (snapshot.printComboLinksVisible && typeof snapshot.printComboLinksVisible === "object") {
      state.printComboLinksVisible = cloneJson(snapshot.printComboLinksVisible, {});
    }
    if (snapshot.printChordTitleOverrides && typeof snapshot.printChordTitleOverrides === "object") {
      state.printChordTitleOverrides = cloneJson(snapshot.printChordTitleOverrides, {});
    }
    if (
      snapshot.printAlignmentLabelOverrides &&
      typeof snapshot.printAlignmentLabelOverrides === "object"
    ) {
      state.printAlignmentLabelOverrides = cloneJson(snapshot.printAlignmentLabelOverrides, {});
    }
    if (typeof snapshot.printYAxisLabelOverride === "string") {
      state.printYAxisLabelOverride = snapshot.printYAxisLabelOverride;
    }
    if (typeof snapshot.printYAxisLabelHasOverride === "boolean") {
      state.printYAxisLabelHasOverride = snapshot.printYAxisLabelHasOverride;
    } else if (
      typeof snapshot.printYAxisLabelOverride === "string" &&
      snapshot.printYAxisLabelOverride.trim().length > 0
    ) {
      // Backward compatibility: non-empty previous override implies customized.
      state.printYAxisLabelHasOverride = true;
    } else {
      state.printYAxisLabelHasOverride = false;
    }
    enforceComboLegendVisibility();
  } finally {
    suspendStateUrlSync = false;
  }
}

function isPrintMode() {
  return appMode === MODE_PRINT;
}

function syncModeButtons() {
  if (modeLiveButton) {
    modeLiveButton.classList.toggle("is-active", appMode === MODE_LIVE);
  }
  if (modePrintButton) {
    modePrintButton.classList.toggle("is-active", appMode === MODE_PRINT);
  }
  document.body.classList.toggle("mode-print", appMode === MODE_PRINT);
}

function syncColorSchemeControl() {
  if (!colorSchemeInput) {
    return;
  }
  const greyscaleOption = colorSchemeInput.querySelector("option[value='greyscale']");
  if (greyscaleOption) {
    greyscaleOption.hidden = !isPrintMode();
  }
  if (isPrintMode()) {
    const mode = state.printColorMode === "greyscale" || isColorSchemeId(state.printColorMode)
      ? state.printColorMode
      : "greyscale";
    colorSchemeInput.value = mode;
    return;
  }
  if (!isColorSchemeId(state.colorScheme)) {
    state.colorScheme = "hayward-vine";
  }
  colorSchemeInput.value = state.colorScheme;
}

function restorePrintHiddenState() {
  state.printHiddenKeys = {};
}

function resetPrintLayoutState() {
  state.printColumnOverrides = {};
  state.printLabelOffsets = {};
  state.printComponentXOverrides = {};
  state.printDiagramOffsetX = 0;
  state.printDiagramOffsetY = 0;
  state.printYAxisLabelOverride = "";
  state.printYAxisLabelHasOverride = false;
  printDistancePendingKey = null;
  pendingCustomLabelTarget = false;
  pendingCustomLabelActionId = 0;
}

function hasAnyVisibleComboTypes() {
  return Boolean(state.showComboDifference || state.showComboSum || state.showComboOrder2);
}

function enforceComboLegendVisibility() {
  if (state.showCombination && hasAnyVisibleComboTypes()) {
    return;
  }
  state.printShowLegend = false;
  if (printShowLegendInput) {
    printShowLegendInput.checked = false;
  }
}

function setAppMode(nextMode, { skipRender = false } = {}) {
  const mode = nextMode === MODE_PRINT ? MODE_PRINT : MODE_LIVE;
  if (mode === appMode) {
    syncModeButtons();
    return;
  }
  const sharedNotes = String(state.notesText ?? "");
  modeSnapshots[appMode] = getStateSnapshotFlat();
  appMode = mode;
  const snap = modeSnapshots[mode];
  if (snap && typeof snap === "object") {
    applyStateSnapshot(snap);
  } else {
    modeSnapshots[mode] = getStateSnapshotFlat();
  }
  state.notesText = sharedNotes;
  syncSharedNotesAcrossModes();
  if (appMode === MODE_PRINT) {
    hardAllNotesOff();
    lKeyHeld = false;
    state.themeDark = false;
    themeToggle.checked = false;
    document.body.classList.remove("theme-dark");
  } else {
    printDistancePendingKey = null;
    pendingCustomLabelTarget = false;
    pendingCustomLabelActionId = 0;
    closeCustomTextDialog(null, "mode-switch-to-live");
  }
  syncModeButtons();
  if (!skipRender) {
    scheduleRender();
  }
  scheduleStateUrlUpdate(0);
}

function waitAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function ensurePrintModeReadyForPanelAction(context = {}) {
  const wasPrintMode = isPrintMode();
  if (!isPrintMode()) {
    setAppMode(MODE_PRINT);
  }
  if (!wasPrintMode) {
    // Allow mode class/render scheduling to settle before panel action opens UI.
    await waitAnimationFrame();
    await waitAnimationFrame();
  }
}

function forceResetCustomTextDialog(reason = "force-reset") {
  const modalVisible = Boolean(customTextModal && !customTextModal.hidden);
  const resolverSet = Boolean(customTextDialogResolver);
  if (!modalVisible && !resolverSet) {
    return;
  }
  closeCustomTextDialog(null, reason);
}

function formatHz(freq) {
  if (!Number.isFinite(freq)) {
    return "--";
  }
  return `${formatHzValue(freq)} Hz`;
}

function formatHzValue(freq) {
  if (!Number.isFinite(freq)) {
    return "--";
  }
  const roundedTenths = Math.round(freq * 10) / 10;
  const roundedInt = Math.round(roundedTenths);
  return Math.abs(roundedTenths - roundedInt) < 1e-9
    ? String(roundedInt)
    : roundedTenths.toFixed(1);
}

function formatHzForCalculation(freq) {
  if (!Number.isFinite(freq)) {
    return "--";
  }
  return `${formatHzValue(freq)} Hz`;
}

function describeComboCalculation(pointType, lowerFreq, upperFreq) {
  const lower = formatHzForCalculation(lowerFreq);
  const upper = formatHzForCalculation(upperFreq);
  if (pointType === "difference") {
    return `${upper} - ${lower}`;
  }
  if (pointType === "sum") {
    return `${lower} + ${upper}`;
  }
  if (pointType === "order2a") {
    return `2 * ${lower} - ${upper}`;
  }
  if (pointType === "order2b") {
    return `2 * ${upper} - ${lower}`;
  }
  return `${lower} + ${upper}`;
}

function formatAxisHzCompact(freq) {
  if (!Number.isFinite(freq)) {
    return "";
  }
  if (freq >= 1000) {
    const khz = freq / 1000;
    const roundedTenths = Math.round(khz * 10) / 10;
    const roundedInt = Math.round(roundedTenths);
    const valueText = Math.abs(roundedTenths - roundedInt) < 1e-9
      ? String(roundedInt)
      : roundedTenths.toFixed(1);
    return `${valueText} kHz`;
  }
  return `${formatHzValue(freq)} Hz`;
}


function approximateRatio(value, maxDenominator = 1024) {
  if (!(value > 0) || !Number.isFinite(value)) {
    return null;
  }
  let bestNum = 1;
  let bestDen = 1;
  let bestErr = Math.abs(value - 1);
  for (let den = 1; den <= maxDenominator; den += 1) {
    const num = Math.max(1, Math.round(value * den));
    const err = Math.abs(value - num / den);
    if (err < bestErr) {
      bestErr = err;
      bestNum = num;
      bestDen = den;
    }
  }
  const g = gcd(bestNum, bestDen);
  return { numerator: bestNum / g, denominator: bestDen / g };
}

function formatRatioApprox(value) {
  const approx = approximateRatio(value);
  if (!approx) {
    return "";
  }
  return `${approx.numerator}/${approx.denominator}`;
}

function nearestIntervalNameForRatio(ratio) {
  if (!(ratio > 0) || !intervalNameEntries.length) {
    return "";
  }
  const cents = 1200 * Math.log2(ratio);
  let best = null;
  let bestDelta = Infinity;
  intervalNameEntries.forEach((entry) => {
    const delta = Math.abs(entry.cents - cents);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = entry;
    }
  });
  if (!best) {
    return "";
  }
  return `${best.name} (${bestDelta.toFixed(2)}c)`;
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

function harmonicScalingGain(harmonic, mode = state.harmonicScalingMode) {
  const h = Math.max(1, Number(harmonic) || 1);
  if (mode === "flat") {
    return 1;
  }
  if (mode === "sqrt") {
    return 1 / Math.sqrt(h);
  }
  if (mode === "steep") {
    return 1 / h ** 1.4;
  }
  // Default pink-like rolloff
  return 1 / h;
}

function targetAmplitudeScale(target) {
  if (!target) {
    return 0.35;
  }
  if (target.kind === "harmonic") {
    return clamp(harmonicScalingGain(target.harmonic), 0.04, 1);
  }
  if (target.kind === "fusion") {
    return clamp(Number(target.ampScale) || 0.2, 0.04, 1);
  }
  if (target.kind === "combo") {
    return 0.18;
  }
  return 0.35;
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
  const sustainLevel = Math.max(0.0001, voice.baseGain * clamp(state.synthSustain, 0, 1));
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
  const osc =
    state.synthWaveform === "semisine" && customOscillators?.semisine
      ? customOscillators.semisine(audioCtx)
      : audioCtx.createOscillator();
  const ampGain = audioCtx.createGain();
  const ampScale = targetAmplitudeScale(target);
  const baseGain = 0.2 * ampScale;
  if (state.synthWaveform !== "semisine") {
    osc.type = state.synthWaveform;
  }
  osc.frequency.setValueAtTime(freq, now);
  ampGain.gain.setValueAtTime(0.0001, now);
  osc.connect(ampGain);
  ampGain.connect(masterGain);
  osc.start(now);

  const attack = Math.max(0.005, state.synthAttack);
  const decay = Math.max(0.01, state.synthDecay);
  const sustain = clamp(state.synthSustain, 0, 1);
  ampGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, baseGain), now + attack);
  ampGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, baseGain * sustain), now + attack + decay);

  activeVoices.set(key, { key, osc, ampGain, lfoOsc: null, lfoDepthGain: null, baseGain, target });
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
      const baseGain = 0.2 * targetAmplitudeScale(target);
      voice.baseGain = baseGain;
      voice.target = target;
      voice.ampGain.gain.setTargetAtTime(
        Math.max(0.0001, baseGain * clamp(state.synthSustain, 0, 1)),
        audioCtx.currentTime,
        0.05
      );
      setVoiceLfoForKey(key, lfoState);
    }
  });
}

function parseComboPlayKey(key) {
  if (typeof key !== "string" || !key.startsWith("combo:")) {
    return null;
  }
  const parts = key.split(":");
  if (parts.length < 4) {
    return null;
  }
  const noteA = Number(parts[1]);
  const noteB = Number(parts[2]);
  if (!Number.isFinite(noteA) || !Number.isFinite(noteB)) {
    return null;
  }
  return { noteA, noteB };
}

function pointToPlaybackTarget(point) {
  if (!point || !point.playKey) {
    return null;
  }
  if (point.kind === "overtone") {
    return {
      key: point.playKey,
      target: { kind: "harmonic", noteIndex: point.noteIndex, harmonic: point.harmonic },
    };
  }
  if (point.kind === "combo") {
    return {
      key: point.playKey,
      target: { kind: "combo", freq: point.freq },
    };
  }
  return null;
}

function collectChordTargetGroups(model, chordIndex) {
  const chord = model?.chords?.[chordIndex];
  if (!chord || !Array.isArray(chord.noteIndexes)) {
    return {
      allChordKeys: new Set(),
      fundamentals: [],
      overtones: [],
      tones: [],
    };
  }
  const noteSet = new Set(chord.noteIndexes);
  const allChordKeys = new Set();
  const fundamentals = [];
  const overtones = [];
  const tones = [];
  const pushTarget = (list, key, target) => {
    if (!key || !target) {
      return;
    }
    list.push({ key, target });
    allChordKeys.add(key);
  };

  chord.noteIndexes.forEach((noteIndex) => {
    const fundamentalKey = `harmonic:${noteIndex}:1`;
    const fundamentalTarget = { kind: "harmonic", noteIndex, harmonic: 1 };
    pushTarget(fundamentals, fundamentalKey, fundamentalTarget);
    pushTarget(tones, fundamentalKey, fundamentalTarget);
  });

  (model.visibleOvertones || []).forEach((point) => {
    if (!noteSet.has(point.noteIndex)) {
      return;
    }
    const key = point.playKey || `harmonic:${point.noteIndex}:${point.harmonic}`;
    const target = { kind: "harmonic", noteIndex: point.noteIndex, harmonic: point.harmonic };
    pushTarget(overtones, key, target);
    pushTarget(tones, key, target);
  });

  if (state.showCombination) {
    (model.visibleComboPoints || []).forEach((point) => {
      if (!noteSet.has(point.noteA) || !noteSet.has(point.noteB)) {
        return;
      }
      pushTarget(tones, point.playKey, { kind: "combo", freq: point.freq });
    });
  }

  const toneByKey = new Map();
  tones.forEach((item) => {
    if (!toneByKey.has(item.key)) {
      toneByKey.set(item.key, item);
    }
  });
  const overtoneByKey = new Map();
  overtones.forEach((item) => {
    if (!overtoneByKey.has(item.key)) {
      overtoneByKey.set(item.key, item);
    }
  });
  const fundamentalByKey = new Map();
  fundamentals.forEach((item) => {
    if (!fundamentalByKey.has(item.key)) {
      fundamentalByKey.set(item.key, item);
    }
  });

  return {
    allChordKeys,
    fundamentals: Array.from(fundamentalByKey.values()),
    overtones: Array.from(overtoneByKey.values()),
    tones: Array.from(toneByKey.values()),
  };
}

function applyChordPlaybackAction(chordIndex, action) {
  const model = chartModel || buildModel();
  const chord = model?.chords?.[chordIndex];
  if (!chord) {
    return;
  }
  const noteSet = new Set(chord.noteIndexes || []);
  const groups = collectChordTargetGroups(model, chordIndex);
  const selectedMap = new Map();
  if (action === "fundamentals") {
    groups.fundamentals.forEach((item) => selectedMap.set(item.key, item.target));
  } else if (action === "all-overtones") {
    groups.overtones.forEach((item) => selectedMap.set(item.key, item.target));
  } else if (action === "all-tones") {
    groups.tones.forEach((item) => selectedMap.set(item.key, item.target));
  }
  const selectedKeys = Array.from(selectedMap.keys());
  const playingChordKeys = Array.from(playingTargets.keys()).filter((key) => {
    if (groups.allChordKeys.has(key)) {
      return true;
    }
    if (typeof key === "string" && key.startsWith("combo:")) {
      const comboMeta = parseComboPlayKey(key);
      return !!(comboMeta && noteSet.has(comboMeta.noteA) && noteSet.has(comboMeta.noteB));
    }
    return false;
  });
  const selectedFullyOn =
    selectedKeys.length > 0 && selectedKeys.every((key) => playingTargets.has(key));
  const selectedExclusivelyOn =
    selectedFullyOn && playingChordKeys.length === selectedKeys.length;

  const removeChordPlaybackTargets = (includeFusion = false) => {
    Array.from(playingTargets.entries()).forEach(([key, target]) => {
      let belongsToChord = false;
      if (groups.allChordKeys.has(key)) {
        belongsToChord = true;
      } else if (target?.kind === "harmonic" && Number.isFinite(target.noteIndex)) {
        belongsToChord = noteSet.has(target.noteIndex);
      } else if (typeof key === "string" && key.startsWith("combo:")) {
        const comboMeta = parseComboPlayKey(key);
        belongsToChord = !!(comboMeta && noteSet.has(comboMeta.noteA) && noteSet.has(comboMeta.noteB));
      } else if (includeFusion && typeof key === "string" && key.startsWith("fusion:")) {
        const parts = key.split(":");
        const keyChordIndex = Number(parts[1]);
        belongsToChord = Number.isFinite(keyChordIndex) && keyChordIndex === chordIndex;
      }
      if (!belongsToChord) {
        return;
      }
      playingTargets.delete(key);
      lfoTargetStates.delete(key);
    });
  };

  removeChordPlaybackTargets(action === "off");

  if (action !== "off" && !selectedExclusivelyOn) {
    selectedMap.forEach((target, key) => {
      playingTargets.set(key, target);
      lfoTargetStates.delete(key);
    });
  }

  spaceMuted = false;
  refreshActiveVoicesFromState();
  scheduleRender();
}

function applyRoughnessBandPlaybackToggle(playItems) {
  const unique = new Map();
  (playItems || []).forEach((item) => {
    if (!item?.key || !item?.target) {
      return;
    }
    unique.set(item.key, item.target);
  });
  if (!unique.size) {
    return;
  }
  const entries = Array.from(unique.entries());
  const allOn = entries.every(([key]) => playingTargets.has(key));
  if (allOn) {
    entries.forEach(([key]) => {
      playingTargets.delete(key);
      lfoTargetStates.delete(key);
    });
  } else {
    entries.forEach(([key, target]) => {
      playingTargets.set(key, target);
      lfoTargetStates.delete(key);
    });
  }
  spaceMuted = false;
  refreshActiveVoicesFromState();
  scheduleRender();
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

function appendCombinationFamily(tones, noteA, noteB, lower, upper, chordIndex) {
  tones.push({
    kind: "combo",
    type: "difference",
    freq: Math.abs(upper - lower),
    noteA,
    noteB,
    chordIndex,
    formula: "|f2-f1|",
  });
  tones.push({
    kind: "combo",
    type: "sum",
    freq: upper + lower,
    noteA,
    noteB,
    chordIndex,
    formula: "f1+f2",
  });
  tones.push({
    kind: "combo",
    type: "order2a",
    freq: 2 * lower - upper,
    noteA,
    noteB,
    chordIndex,
    formula: "2f1-f2",
  });
  tones.push({
    kind: "combo",
    type: "order2b",
    freq: 2 * upper - lower,
    noteA,
    noteB,
    chordIndex,
    formula: "2f2-f1",
  });
}

function computeCombinationTones(notes, chords, pairsMode = "adjacent") {
  const tones = [];
  const chordList = Array.isArray(chords) && chords.length
    ? chords
    : [{ index: 0, noteIndexes: notes.map((_, index) => index) }];
  chordList.forEach((chord, chordIndexFromLoop) => {
    const chordIndex = Number.isInteger(chord?.index) ? chord.index : chordIndexFromLoop;
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
        appendCombinationFamily(tones, a, b, lower, upper, chordIndex);
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
        appendCombinationFamily(tones, a, b, lower, upper, chordIndex);
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
  let weightSum = 0;
  let noteSet = new Set();

  function finalizeCurrent() {
    if (current.length < 2 || noteSet.size < 2) {
      current = [];
      logSum = 0;
      weightSum = 0;
      noteSet = new Set();
      return;
    }
    const center = Math.exp(logSum / current.length);
    clusters.push({
      centerFreq: center,
      points: current,
      uniqueNotes: noteSet.size,
      weightSum,
    });
    current = [];
    logSum = 0;
    weightSum = 0;
    noteSet = new Set();
  }

  for (const point of sorted) {
    const pointNotes = point.noteIndexes || [];
    if (!current.length) {
      current.push(point);
      logSum = Math.log(point.freq);
      weightSum = Math.max(0.0001, Number(point.weight) || 1);
      pointNotes.forEach((index) => noteSet.add(index));
      continue;
    }
    const centerFreq = Math.exp(logSum / current.length);
    const cents = Math.abs(centsBetween(centerFreq, point.freq));
    if (cents <= toleranceCents) {
      current.push(point);
      logSum += Math.log(point.freq);
      weightSum += Math.max(0.0001, Number(point.weight) || 1);
      pointNotes.forEach((index) => noteSet.add(index));
      continue;
    }
    finalizeCurrent();
    current.push(point);
    logSum = Math.log(point.freq);
    weightSum = Math.max(0.0001, Number(point.weight) || 1);
    pointNotes.forEach((index) => noteSet.add(index));
  }
  finalizeCurrent();

  return clusters.slice(0, 120);
}

function computeOvertoneRenderGeometry(harmonic, harmonicCountHint = state.overtoneCount) {
  const harmonicCount = clamp(Math.round(Number(harmonicCountHint) || 8), 2, 48);
  const fundamentalRadius = (state.pointSize + 1.2) * 1.75;
  const smallestRadius = clamp(
    state.pointSize * (1 - (harmonicCount - 1) / (harmonicCount * 1.8)),
    1.2,
    8
  );
  const maxOvertoneGain = harmonicScalingGain(1);
  const minOvertoneGain = harmonicScalingGain(harmonicCount);
  const overtoneGainSpan = Math.max(1e-6, maxOvertoneGain - minOvertoneGain);
  const overtoneFlatSizing = Math.abs(maxOvertoneGain - minOvertoneGain) < 1e-5;
  const harmonicIndex = clamp(Math.round(Number(harmonic) || 1), 1, harmonicCount);
  const harmonicGain = harmonicScalingGain(harmonicIndex);
  const gainNorm = overtoneFlatSizing
    ? 1
    : clamp((harmonicGain - minOvertoneGain) / overtoneGainSpan, 0, 1);
  return {
    radius: smallestRadius + (fundamentalRadius - smallestRadius) * gainNorm,
    fillOpacity: clamp(0.14 + 0.84 * harmonicGain, 0.14, 0.98),
  };
}

function computeComboRenderGeometry(comboType) {
  const radius = state.comboSize + 1.2;
  const isSummation = comboType === "sum";
  const isSecondOrder = comboType === "order2a" || comboType === "order2b";
  return {
    shape: isSummation ? "diamond" : "rect",
    radius,
    width: isSummation ? radius * 2 : radius * 2.7,
    fillOpacity: isSecondOrder ? (0.88 * (2 / 3)) : 0.88,
  };
}

function fusionAggregationScaleForCount(count) {
  const n = Math.max(1, Math.round(Number(count) || 1));
  if (n <= 2) {
    return 1;
  }
  return clamp(1 - 0.1 * (n - 2), 0.45, 1);
}

function aggregateFusionComponentGeometry(points, harmonicCountHint = state.overtoneCount) {
  const entries = Array.isArray(points) ? points : [];
  let equivalentDiameterTotal = 0;
  let rectWidthTotal = 0;
  let diamondDiameterTotal = 0;
  entries.forEach((point) => {
    if (!point || typeof point !== "object") {
      return;
    }
    if (point.kind === "overtone") {
      const overtone = computeOvertoneRenderGeometry(point.harmonic, harmonicCountHint);
      const diameter = overtone.radius * 2;
      equivalentDiameterTotal += diameter;
      return;
    }
    if (point.kind === "combo") {
      const combo = computeComboRenderGeometry(point.type);
      equivalentDiameterTotal += combo.width;
      if (combo.shape === "rect") {
        rectWidthTotal += combo.width;
      } else {
        diamondDiameterTotal += combo.width;
      }
    }
  });
  if (entries.length > 1) {
    const aggregationScale = fusionAggregationScaleForCount(entries.length);
    equivalentDiameterTotal *= aggregationScale;
    rectWidthTotal *= aggregationScale;
    diamondDiameterTotal *= aggregationScale;
  }
  let singletonRadius = NaN;
  let singletonFillOpacity = NaN;
  if (entries.length === 1) {
    const only = entries[0];
    if (only?.kind === "overtone") {
      const overtone = computeOvertoneRenderGeometry(only.harmonic, harmonicCountHint);
      singletonRadius = overtone.radius;
      singletonFillOpacity = overtone.fillOpacity;
    } else if (only?.kind === "combo") {
      const combo = computeComboRenderGeometry(only.type);
      singletonRadius = combo.radius;
      singletonFillOpacity = combo.fillOpacity;
    }
  }
  return {
    equivalentDiameterTotal,
    rectWidthTotal,
    diamondDiameterTotal,
    singletonRadius,
    singletonFillOpacity,
  };
}

function normalizeComboTypeForFusion(pointType) {
  if (pointType === "sum") {
    return "sum";
  }
  if (pointType === "order2a" || pointType === "order2b") {
    return "order2";
  }
  return "difference";
}

function emptyFusionComboTypeCounts() {
  return { difference: 0, sum: 0, order2: 0 };
}

function tallyFusionComboTypeCounts(points) {
  const counts = emptyFusionComboTypeCounts();
  (Array.isArray(points) ? points : []).forEach((point) => {
    if (!point || point.kind !== "combo") {
      return;
    }
    const key = normalizeComboTypeForFusion(point.type);
    counts[key] += 1;
  });
  return counts;
}

function resolveFusionShape(hasHarmonic, hasDifference, hasSummation) {
  if (hasHarmonic) {
    return "circle";
  }
  if (hasDifference && hasSummation) return "circle";
  if (hasDifference) return "rect";
  if (hasSummation) return "diamond";
  return "circle";
}

function fusionShapeIncludesCircle(shape) {
  return (
    shape === "circle" ||
    shape === "circle-rect" ||
    shape === "circle-diamond" ||
    shape === "circle-rect-diamond"
  );
}

function fusionShapeIncludesRect(shape) {
  return (
    shape === "rect" ||
    shape === "rect-diamond" ||
    shape === "circle-rect" ||
    shape === "circle-rect-diamond"
  );
}

function fusionShapeIncludesDiamond(shape) {
  return (
    shape === "diamond" ||
    shape === "rect-diamond" ||
    shape === "circle-diamond" ||
    shape === "circle-rect-diamond"
  );
}

function fusionVisualHalfSpan(visual) {
  if (!visual || typeof visual !== "object") {
    return 0;
  }
  const circleExtent = fusionShapeIncludesCircle(visual.shape) ? Number(visual.radius) || 0 : 0;
  const rectExtent = fusionShapeIncludesRect(visual.shape) && Number.isFinite(visual.rectRadius)
    ? Number(visual.rectRadius) * 1.35
    : fusionShapeIncludesRect(visual.shape)
      ? (Number(visual.radius) || 0) * 1.35
      : 0;
  const diamondExtent = fusionShapeIncludesDiamond(visual.shape) && Number.isFinite(visual.diamondRadius)
    ? Number(visual.diamondRadius)
    : fusionShapeIncludesDiamond(visual.shape)
      ? Number(visual.radius) || 0
      : 0;
  return Math.max(0, circleExtent, rectExtent, diamondExtent);
}

function annotateFusionNodesWithAlignment(fusionNodes, alignmentClusters, matchToleranceCents) {
  const nodes = Array.isArray(fusionNodes) ? fusionNodes : [];
  const clusters = Array.isArray(alignmentClusters) ? alignmentClusters : [];
  const tol = Math.max(0, Number(matchToleranceCents) || 0);
  const classifyClusterComposition = (cluster) => {
    const points = Array.isArray(cluster?.points) ? cluster.points : [];
    let harmonicCount = 0;
    let differenceCount = 0;
    let sumCount = 0;
    points.forEach((point) => {
      if (!point || typeof point !== "object") {
        return;
      }
      if (point.kind === "overtone") {
        harmonicCount += 1;
        return;
      }
      if (point.kind === "combo") {
        if (point.type === "sum") {
          sumCount += 1;
        } else {
          differenceCount += 1;
        }
      }
    });
    const memberCount = points.length;
    const hasHarmonic = harmonicCount > 0;
    const hasDifference = differenceCount > 0;
    const hasSummation = sumCount > 0;
    const comboTypeCounts = tallyFusionComboTypeCounts(points);
    const shape = memberCount > 1
      ? resolveFusionShape(hasHarmonic, hasDifference, hasSummation)
      : "";
    return {
      memberCount,
      hasHarmonic,
      hasDifference,
      hasSummation,
      comboTypeCounts,
      shape,
    };
  };
  const matchedClusterIds = new Set();
  const annotated = nodes.map((node) => {
    let best = null;
    clusters.forEach((cluster) => {
      if (!(cluster?.centerFreq > 0) || !(node?.centerFreq > 0)) {
        return;
      }
      const delta = Math.abs(centsBetween(cluster.centerFreq, node.centerFreq));
      if (delta > tol) {
        return;
      }
      const memberCount = Number(cluster.points?.length) || 0;
      if (
        !best ||
        delta < best.delta - 1e-9 ||
        (Math.abs(delta - best.delta) <= 1e-9 && memberCount > best.memberCount)
      ) {
        const composition = classifyClusterComposition(cluster);
        best = {
          id: cluster.id,
          centerFreq: cluster.centerFreq,
          memberCount: composition.memberCount,
          uniqueNotes: Number(cluster.uniqueNotes) || 0,
          memberPlayKeys: (cluster.points || [])
            .map((point) => point?.playKey)
            .filter(Boolean),
          hasHarmonic: composition.hasHarmonic,
          hasDifference: composition.hasDifference,
          hasSummation: composition.hasSummation,
          comboTypeCounts: composition.comboTypeCounts,
          shape: composition.shape,
          delta,
        };
      }
    });
    if (best?.id) {
      matchedClusterIds.add(best.id);
    }
    return {
      ...node,
      alignmentClusterId: best?.id || "",
      alignmentCenterFreq: best?.centerFreq || NaN,
      alignmentMemberCount: best?.memberCount || 0,
      alignmentUniqueNotes: best?.uniqueNotes || 0,
      alignmentMemberPlayKeys: best?.memberPlayKeys || [],
      alignmentDeltaCents: best?.delta ?? Infinity,
      alignmentHasHarmonic: Boolean(best?.hasHarmonic),
      alignmentHasDifference: Boolean(best?.hasDifference),
      alignmentHasSummation: Boolean(best?.hasSummation),
      alignmentComboTypeCounts: best?.comboTypeCounts || emptyFusionComboTypeCounts(),
      alignmentShape: best?.shape || "",
      labelEligible: (best?.memberCount || 0) > 1,
    };
  });
  clusters.forEach((cluster) => {
    if (!(cluster?.centerFreq > 0) || matchedClusterIds.has(cluster.id)) {
      return;
    }
    const composition = classifyClusterComposition(cluster);
    if (composition.memberCount <= 1 || !composition.shape) {
      return;
    }
    const strength = clamp(Number(cluster.strength) || 0.38, 0.18, 1);
    const naturalShare = composition.hasHarmonic ? 1 : 0;
    const geometry = aggregateFusionComponentGeometry(cluster.points || [], state.overtoneCount);
    let radius = clamp(3 + strength * 18, 3, 240);
    let rectRadius = NaN;
    let diamondRadius = NaN;
    if (fusionShapeIncludesCircle(composition.shape) && geometry.equivalentDiameterTotal > 0) {
      radius = clamp(geometry.equivalentDiameterTotal / 2, 1.2, 240);
    } else if (composition.shape === "rect" && geometry.rectWidthTotal > 0) {
      radius = clamp(geometry.rectWidthTotal / 2.7, 1.2, 240);
    } else if (composition.shape === "diamond" && geometry.diamondDiameterTotal > 0) {
      radius = clamp(geometry.diamondDiameterTotal / 2, 1.2, 240);
    } else if (fusionShapeIncludesRect(composition.shape) || fusionShapeIncludesDiamond(composition.shape)) {
      rectRadius = geometry.rectWidthTotal > 0 ? geometry.rectWidthTotal / 2.7 : NaN;
      diamondRadius = geometry.diamondDiameterTotal > 0 ? geometry.diamondDiameterTotal / 2 : NaN;
      const maxExtent = Math.max(
        fusionShapeIncludesCircle(composition.shape) ? radius : 0,
        Number.isFinite(diamondRadius) ? diamondRadius : 0,
        Number.isFinite(rectRadius) ? rectRadius * 1.35 : 0
      );
      if (maxExtent > 0) {
        radius = clamp(maxExtent, 1.2, 240);
      }
      if (fusionShapeIncludesRect(composition.shape) && !Number.isFinite(rectRadius)) {
        rectRadius = radius / 1.35;
      }
      if (fusionShapeIncludesDiamond(composition.shape) && !Number.isFinite(diamondRadius)) {
        diamondRadius = radius;
      }
    }
    const tipBase = String(cluster.tip || "").trim();
    const mixText = composition.hasDifference && composition.hasSummation
      ? "Difference + summation overlap"
      : composition.hasDifference
        ? "Difference-only overlap"
        : composition.hasSummation
          ? "Summation-only overlap"
          : "Alignment overlap";
    annotated.push({
      id: `align:${cluster.id}`,
      centerFreq: Number(cluster.centerFreq),
      strength,
      naturalShare,
      alignStrength: strength,
      radius,
      rectRadius,
      diamondRadius,
      count: composition.memberCount,
      tip: tipBase ? `${tipBase}\n${mixText}` : mixText,
      alignmentClusterId: cluster.id,
      alignmentCenterFreq: Number(cluster.centerFreq),
      alignmentMemberCount: composition.memberCount,
      alignmentUniqueNotes: Number(cluster.uniqueNotes) || 0,
      alignmentMemberPlayKeys: (cluster.points || [])
        .map((point) => point?.playKey)
        .filter(Boolean),
      alignmentDeltaCents: 0,
      alignmentHasHarmonic: composition.hasHarmonic,
      alignmentHasDifference: composition.hasDifference,
      alignmentHasSummation: composition.hasSummation,
      alignmentComboTypeCounts: composition.comboTypeCounts,
      alignmentShape: composition.shape,
      labelEligible: true,
    });
  });
  return annotated;
}

function fusionPointWeight(point) {
  if (!point || !(point.freq > 0)) {
    return 0;
  }
  if (point.kind === "overtone") {
    return harmonicScalingGain(point.harmonic);
  }
  if (point.kind === "combo") {
    // Keep combo/difference tones perceptually secondary to natural partials.
    if (point.type === "difference") return 0.2;
    if (point.type === "sum") return 0.14;
    return 0.1;
  }
  return 0.18;
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
  let naturalWeight = 0;
  let comboWeight = 0;
  let noteSet = new Set();

  function finalize() {
    if (!current.length || !(weightSum > 0)) {
      current = [];
      weightedLogSum = 0;
      weightSum = 0;
      naturalWeight = 0;
      comboWeight = 0;
      noteSet = new Set();
      return;
    }
    const centerFreq = Math.exp(weightedLogSum / weightSum);
    const naturalShare = naturalWeight / Math.max(1e-6, naturalWeight + comboWeight);
    clusters.push({
      centerFreq,
      strengthRaw: weightSum,
      count: current.length,
      uniqueNotes: noteSet.size,
      naturalWeight,
      comboWeight,
      naturalShare,
    });
    current = [];
    weightedLogSum = 0;
    weightSum = 0;
    naturalWeight = 0;
    comboWeight = 0;
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
      if (point.kind === "overtone") {
        naturalWeight += weight;
      } else {
        comboWeight += weight;
      }
      (point.noteIndexes || []).forEach((idx) => noteSet.add(idx));
      continue;
    }
    const centerFreq = Math.exp(weightedLogSum / weightSum);
    if (Math.abs(centsBetween(centerFreq, point.freq)) <= toleranceCents) {
      current.push(point);
      weightedLogSum += Math.log(point.freq) * weight;
      weightSum += weight;
      if (point.kind === "overtone") {
        naturalWeight += weight;
      } else {
        comboWeight += weight;
      }
      (point.noteIndexes || []).forEach((idx) => noteSet.add(idx));
      continue;
    }
    finalize();
    current.push(point);
    weightedLogSum = Math.log(point.freq) * weight;
    weightSum = weight;
    if (point.kind === "overtone") {
      naturalWeight += weight;
    } else {
      comboWeight += weight;
    }
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
${cluster.uniqueNotes} source notes
Natural share: ${(cluster.naturalShare * 100).toFixed(0)}%`,
    }))
    .slice(0, 220);
}

function pointsShareSourceNote(a, b) {
  const aNotes = a?.noteIndexes || [];
  const bNotes = b?.noteIndexes || [];
  if (!aNotes.length || !bNotes.length) {
    return false;
  }
  const bSet = new Set(bNotes);
  return aNotes.some((noteIndex) => bSet.has(noteIndex));
}

function filterFusionCoincidentPoints(points, coincidenceCents, beatMinHz, beatMaxHz) {
  if (!points.length) {
    return [];
  }
  const coincCents = Math.max(0, Number(coincidenceCents) || 0);
  const minBeat = Math.max(0.01, Number(beatMinHz) || 0.5);
  const maxBeat = Math.max(minBeat + 0.01, Number(beatMaxHz) || 20);
  const support = new Array(points.length).fill(0);

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j += 1) {
      const b = points[j];
      if (a.playKey && b.playKey && a.playKey === b.playKey) {
        continue;
      }
      if (pointsShareSourceNote(a, b)) {
        continue;
      }
      const deltaHz = Math.abs(a.freq - b.freq);
      const cents = Math.abs(centsBetween(a.freq, b.freq));
      const isCoincident = cents <= coincCents;
      const isBeatRange = deltaHz >= minBeat && deltaHz <= maxBeat;
      if (!isCoincident || isBeatRange) {
        continue;
      }
      support[i] += b.weight;
      support[j] += a.weight;
    }
  }

  const maxSupport = Math.max(1e-6, ...support);
  return points
    .map((point, index) => ({
      ...point,
      fusionSupport: support[index],
    }))
    .filter((point) => point.fusionSupport > 0)
    .map((point) => ({
      ...point,
      weight: point.weight * (1 + point.fusionSupport / maxSupport),
    }));
}

function buildFusionAllModeNodes(points, toleranceCents, harmonicCountHint = state.overtoneCount) {
  if (!points.length) {
    return [];
  }
  const harmonicCount = clamp(Math.round(Number(harmonicCountHint) || 8), 2, 48);
  const tol = Math.max(0, Number(toleranceCents) || 0);
  const support = new Array(points.length).fill(0);
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      if (a.playKey && b.playKey && a.playKey === b.playKey) {
        continue;
      }
      if (pointsShareSourceNote(a, b)) {
        continue;
      }
      if (Math.abs(centsBetween(a.freq, b.freq)) <= tol) {
        support[i] += b.weight;
        support[j] += a.weight;
      }
    }
  }
  const maxSupport = Math.max(1e-6, ...support);
  const sorted = points
    .map((point, index) => ({
      ...point,
      alignSupport: support[index] / maxSupport,
    }))
    .sort((a, b) => a.freq - b.freq);
  const groups = [];
  let current = null;
  sorted.forEach((point) => {
    if (!current) {
      current = [point];
      return;
    }
    const center =
      current.reduce((sum, item) => sum + Math.log(item.freq) * item.weight, 0) /
      Math.max(1e-6, current.reduce((sum, item) => sum + item.weight, 0));
    const centerFreq = Math.exp(center);
    if (Math.abs(centsBetween(centerFreq, point.freq)) <= tol) {
      current.push(point);
    } else {
      groups.push(current);
      current = [point];
    }
  });
  if (current && current.length) {
    groups.push(current);
  }

  return groups.map((group, index) => {
    const weightSum = Math.max(1e-6, group.reduce((sum, point) => sum + point.weight, 0));
    const centerFreq = Math.exp(
      group.reduce((sum, point) => sum + Math.log(point.freq) * point.weight, 0) / weightSum
    );
    const harmonicPoints = group.filter((point) => point.kind === "overtone");
    const comboPoints = group.filter((point) => point.kind === "combo");
    const hasHarmonic = harmonicPoints.length > 0;
    const hasDifference = comboPoints.some((point) => point.type !== "sum");
    const hasSummation = comboPoints.some((point) => point.type === "sum");
    const hasCombo = comboPoints.length > 0;
    const comboTypeCounts = tallyFusionComboTypeCounts(comboPoints);
    const alignStrength =
      group.reduce((sum, point) => sum + (point.alignSupport || 0), 0) / Math.max(1, group.length);
    const naturalShare =
      harmonicPoints.reduce((sum, point) => sum + point.weight, 0) /
      Math.max(1e-6, weightSum);
    const baseRadius = hasHarmonic ? 2.3 : 2.6;
    const mixBoost = hasHarmonic && hasCombo ? 1.3 : 0;
    const alignBoost = 4.8 * alignStrength;
    const densityBoost = Math.min(3.2, Math.log1p(group.length) * 1.35);
    const allModeRadius = baseRadius + mixBoost + alignBoost + densityBoost;
    const alignOnlyFloor = 3 + alignStrength * 18;
    let radius = clamp(Math.max(allModeRadius, alignOnlyFloor), 3, 240);
    const shape = resolveFusionShape(hasHarmonic, hasDifference, hasSummation);
    const geometry = aggregateFusionComponentGeometry(group, harmonicCount);
    let rectRadius = NaN;
    let diamondRadius = NaN;
    if (group.length === 1) {
      radius = clamp(Number(geometry.singletonRadius) || radius, 1.2, 240);
    } else if (fusionShapeIncludesCircle(shape) && geometry.equivalentDiameterTotal > 0) {
      radius = clamp(geometry.equivalentDiameterTotal / 2, 1.2, 240);
    } else if (shape === "rect" && geometry.rectWidthTotal > 0) {
      radius = clamp(geometry.rectWidthTotal / 2.7, 1.2, 240);
    } else if (shape === "diamond" && geometry.diamondDiameterTotal > 0) {
      radius = clamp(geometry.diamondDiameterTotal / 2, 1.2, 240);
    } else if (fusionShapeIncludesRect(shape) || fusionShapeIncludesDiamond(shape)) {
      rectRadius = geometry.rectWidthTotal > 0 ? geometry.rectWidthTotal / 2.7 : NaN;
      diamondRadius = geometry.diamondDiameterTotal > 0 ? geometry.diamondDiameterTotal / 2 : NaN;
      const maxExtent = Math.max(
        fusionShapeIncludesCircle(shape) ? radius : 0,
        Number.isFinite(diamondRadius) ? diamondRadius : 0,
        Number.isFinite(rectRadius) ? rectRadius * 1.35 : 0
      );
      if (maxExtent > 0) {
        radius = clamp(maxExtent, 1.2, 240);
      }
      if (fusionShapeIncludesRect(shape) && !Number.isFinite(rectRadius)) {
        rectRadius = radius / 1.35;
      }
      if (fusionShapeIncludesDiamond(shape) && !Number.isFinite(diamondRadius)) {
        diamondRadius = radius;
      }
    }
    return {
      id: index,
      centerFreq,
      shape,
      radius,
      rectRadius,
      diamondRadius,
      singletonRadius: geometry.singletonRadius,
      singletonFillOpacity: geometry.singletonFillOpacity,
      alignStrength,
      naturalShare,
      hasCombo,
      hasHarmonic,
      comboTypeCounts,
      count: group.length,
      tip: `Fusion ${shape}
${group.length} components near ${formatHz(centerFreq)}
Alignment boost: ${(alignStrength * 100).toFixed(0)}%
${hasHarmonic && hasCombo ? "Harmonics + combo overlap" : hasCombo ? "Combo/difference only" : "Harmonic only"}`,
    };
  });
}

function getFusionNodeVisual(node, fusionMode, themeDark, scheme) {
  const palette = scheme || activeColorScheme();
  const unifiedBase = palette?.fusion?.harmonic || palette?.fusion?.combo || "#4a8f81";
  const fusionScale = clamp(Number(state.fusionScale) || 1, 0.5, 1.5);
  const comboPalette = {
    difference: palette?.combo?.difference || "#d45d4c",
    sum: palette?.combo?.sum || "#b6802e",
    order2: palette?.combo?.order2Rect || palette?.combo?.order2 || "#2f8a45",
  };
  const resolveRenderableShape = (shape) => {
    if (shape === "rect" || shape === "diamond" || shape === "circle") {
      return shape;
    }
    return "circle";
  };
  const alignmentShape =
    typeof node?.alignmentShape === "string"
      ? resolveRenderableShape(node.alignmentShape)
      : "";
  const nodeShape =
    typeof node?.shape === "string"
      ? resolveRenderableShape(node.shape)
      : "";
  const preferredShape = alignmentShape || nodeShape || "circle";
  const alignStrength = clamp(Number(node.alignStrength) || Number(node.strength) || 0, 0, 1);
  const singleton = Number(node.count) === 1;
  const comboTypeCounts = {
    ...emptyFusionComboTypeCounts(),
    ...(node?.comboTypeCounts || {}),
    ...(node?.alignmentComboTypeCounts || {}),
  };
  const comboCountTotal =
    (Number(comboTypeCounts.difference) || 0) +
    (Number(comboTypeCounts.sum) || 0) +
    (Number(comboTypeCounts.order2) || 0);
  let comboBlend = unifiedBase;
  if (comboCountTotal > 0) {
    const diffShare = (Number(comboTypeCounts.difference) || 0) / comboCountTotal;
    const sumShare = (Number(comboTypeCounts.sum) || 0) / comboCountTotal;
    const order2Share = (Number(comboTypeCounts.order2) || 0) / comboCountTotal;
    comboBlend = mixHex(unifiedBase, comboPalette.difference, 0.34 * diffShare);
    comboBlend = mixHex(comboBlend, comboPalette.sum, 0.34 * sumShare);
    comboBlend = mixHex(comboBlend, comboPalette.order2, 0.34 * order2Share);
    comboBlend = mixHex(unifiedBase, comboBlend, 0.62);
  }
  const colorBase = comboCountTotal > 0 ? comboBlend : unifiedBase;
  const radius = singleton
    ? clamp(Number(node.singletonRadius) || Number(node.radius) || 3, 1.2, 240)
    : clamp(Number(node.radius) || 3, 2, 240);
  const rectRadius = preferredShape === "rect" && Number.isFinite(node.rectRadius)
    ? clamp(Number(node.rectRadius), 1.2, 240)
    : NaN;
  const diamondRadius = preferredShape === "diamond" && Number.isFinite(node.diamondRadius)
    ? clamp(Number(node.diamondRadius), 1.2, 240)
    : NaN;
  const singletonFillOpacity = singleton
    ? clamp(Number(node.singletonFillOpacity) || 0.32, 0.08, 1)
    : null;
  const fill = mixHex(colorBase, "#ffffff", (themeDark ? 0.18 : 0.24) * (1 - alignStrength));
  const stroke = mixHex(colorBase, "#000000", 0.18 + alignStrength * 0.3);
  return {
    shape: preferredShape,
    radius: radius * fusionScale,
    rectRadius: Number.isFinite(rectRadius) ? rectRadius * fusionScale : NaN,
    diamondRadius: Number.isFinite(diamondRadius) ? diamondRadius * fusionScale : NaN,
    fill,
    fillOpacity: singleton ? singletonFillOpacity : (0.22 + alignStrength * 0.6),
    stroke,
    strokeOpacity: 0.35 + alignStrength * 0.42,
    strokeWidth: 0.9 + alignStrength * 1.2,
  };
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
        playItems: [pointToPlaybackTarget(a), pointToPlaybackTarget(b)].filter(Boolean),
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
        playItems: [...(entry.playItems || [])],
      };
      continue;
    }
    const center = Math.exp(current.weightedLogSum / current.strengthRaw);
    if (Math.abs(centsBetween(center, entry.centerFreq)) <= centerToleranceCents) {
      current.weightedLogSum += Math.log(entry.centerFreq) * entry.strengthRaw;
      current.weightedDeltaSum += entry.deltaHz * entry.strengthRaw;
      current.strengthRaw += entry.strengthRaw;
      current.pairCount += entry.pairCount;
      current.playItems.push(...(entry.playItems || []));
      continue;
    }
    merged.push(current);
    current = {
      weightedLogSum: Math.log(entry.centerFreq) * entry.strengthRaw,
      weightedDeltaSum: entry.deltaHz * entry.strengthRaw,
      strengthRaw: entry.strengthRaw,
      pairCount: entry.pairCount,
      playItems: [...(entry.playItems || [])],
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
      const itemMap = new Map();
      (item.playItems || []).forEach((playItem) => {
        if (playItem?.key && playItem?.target) {
          itemMap.set(playItem.key, playItem.target);
        }
      });
      return {
        id: index,
        centerFreq,
        deltaHz,
        pairCount: item.pairCount,
        strengthRaw: item.strengthRaw,
        strength: item.strengthRaw / maxStrength,
        playItems: Array.from(itemMap.entries()).map(([key, target]) => ({ key, target })),
        tip: `Beat-friction band
Center: ${formatHz(centerFreq)}
Typical |f2-f1|: ${formatHz(Math.abs(deltaHz))}
Interacting pairs: ${item.pairCount}`,
      };
    })
    .slice(0, 140);
}

const COLOR_SCHEMES = {
  "hayward-vine": {
    overtonePrimeColors: {
      1: "#0f0f0f",
      2: "#4a4a4a",
      3: "#6fb6ff",
      5: "#d54848",
      7: "#1f3f8f",
      11: "#e58a2a",
      13: "#7b4cc9",
      17: "#2f8a45",
      19: "#d4b022",
      23: "#2a8c8a",
    },
    combo: { difference: "#d45d4c", sum: "#b6802e", order2: "#6e58b4", order2Rect: "#2f8a45" },
    fusion: { harmonic: "#c56a42", combo: "#4a8f81" },
    roughness: { base: "#cf5f34" },
  },
  "ember-cobalt": {
    overtonePrimeColors: {
      1: "#2b0f08",
      2: "#5f3a33",
      3: "#2f6fff",
      5: "#ff5a36",
      7: "#0a2f9c",
      11: "#ff9f1c",
      13: "#6b2fb8",
      17: "#1f8f6b",
      19: "#f5cc00",
      23: "#0f7c96",
    },
    combo: { difference: "#ff2f1f", sum: "#ffc400", order2: "#1764ff", order2Rect: "#00a3a3" },
    fusion: { harmonic: "#ff7b39", combo: "#3f86ff" },
    roughness: { base: "#e53a1f" },
  },
  "aurora-mint": {
    overtonePrimeColors: {
      1: "#063b35",
      2: "#3f6f69",
      3: "#00c9c8",
      5: "#ff2fa1",
      7: "#3b4dff",
      11: "#8bf000",
      13: "#a14dff",
      17: "#00a86b",
      19: "#f7ff4f",
      23: "#1dd6ff",
    },
    combo: { difference: "#ff1493", sum: "#00e676", order2: "#00b0ff", order2Rect: "#ff8c00" },
    fusion: { harmonic: "#00bf84", combo: "#00d2ff" },
    roughness: { base: "#ff3ea0" },
  },
  "nocturne-ink": {
    overtonePrimeColors: {
      1: "#0a0f2e",
      2: "#424c7a",
      3: "#7ea8ff",
      5: "#f45b93",
      7: "#3041b5",
      11: "#d27a1f",
      13: "#b38bff",
      17: "#4d9f8a",
      19: "#c6da57",
      23: "#3aa0d8",
    },
    combo: { difference: "#ff4d94", sum: "#ff9d00", order2: "#7f5bff", order2Rect: "#2ec4b6" },
    fusion: { harmonic: "#8b93ff", combo: "#4db7d9" },
    roughness: { base: "#d65a87" },
  },
  "sunset-brass": {
    overtonePrimeColors: {
      1: "#2d2104",
      2: "#7a6532",
      3: "#4f8dff",
      5: "#d45500",
      7: "#1f4780",
      11: "#ffb300",
      13: "#9156a9",
      17: "#5f8d1e",
      19: "#ffd54a",
      23: "#00897b",
    },
    combo: { difference: "#b45309", sum: "#eab308", order2: "#0f766e", order2Rect: "#2563eb" },
    fusion: { harmonic: "#d97706", combo: "#6d28d9" },
    roughness: { base: "#c2410c" },
  },
};

function isColorSchemeId(value) {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(COLOR_SCHEMES, value);
}

function activeColorScheme() {
  if (isColorSchemeId(state.colorScheme)) {
    return COLOR_SCHEMES[state.colorScheme];
  }
  return COLOR_SCHEMES["hayward-vine"];
}

function activeRenderColorScheme(inPrintMode) {
  if (inPrintMode && isColorSchemeId(state.printColorMode)) {
    return COLOR_SCHEMES[state.printColorMode];
  }
  return activeColorScheme();
}

function hexToRgb(hex) {
  const cleaned = String(hex || "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(cleaned)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(colorA, colorB, t) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const m = clamp(Number(t) || 0, 0, 1);
  return rgbToHex({
    r: a.r + (b.r - a.r) * m,
    g: a.g + (b.g - a.g) * m,
    b: a.b + (b.b - a.b) * m,
  });
}

function greatestPrimeFactor(value) {
  let n = Math.max(1, Math.floor(Math.abs(Number(value) || 1)));
  if (n <= 1) {
    return 1;
  }
  let last = 1;
  while (n % 2 === 0) {
    last = 2;
    n /= 2;
  }
  let factor = 3;
  while (factor * factor <= n) {
    while (n % factor === 0) {
      last = factor;
      n /= factor;
    }
    factor += 2;
  }
  if (n > 1) {
    last = n;
  }
  return last || 1;
}

function liveOvertoneColor(harmonic) {
  const scheme = activeColorScheme();
  const primeColors = scheme.overtonePrimeColors || COLOR_SCHEMES["hayward-vine"].overtonePrimeColors;
  const gpf = greatestPrimeFactor(harmonic);
  if (primeColors[gpf]) {
    return primeColors[gpf];
  }
  if (gpf > 23) {
    return primeColors[23];
  }
  return primeColors[2];
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

function labelDragFocusFromElement(labelEl, labelId) {
  if (!(labelEl instanceof Element) || !labelId) {
    return null;
  }
  const parentKeys = [];
  const directParentKey = labelEl.getAttribute("data-label-parent-key");
  if (directParentKey) {
    parentKeys.push(directParentKey);
  }
  const parentAKey = labelEl.getAttribute("data-label-parent-a-key");
  const parentBKey = labelEl.getAttribute("data-label-parent-b-key");
  if (parentAKey) {
    parentKeys.push(parentAKey);
  }
  if (parentBKey) {
    parentKeys.push(parentBKey);
  }
  const alignId = labelEl.getAttribute("data-label-parent-align-id") || "";
  return {
    labelId,
    parentKeys: Array.from(new Set(parentKeys)),
    alignId,
  };
}

function collectPrintLabelHazards(root) {
  if (!root) {
    return [];
  }
  const hazards = [];
  const pushHazards = (selector, weight, pad = 2) => {
    root.querySelectorAll(selector).forEach((el) => {
      if (!(el instanceof SVGGraphicsElement)) {
        return;
      }
      const box = el.getBBox();
      if (!(box.width > 0 || box.height > 0)) {
        return;
      }
      hazards.push({
        x: box.x - pad,
        y: box.y - pad,
        w: box.width + pad * 2,
        h: box.height + pad * 2,
        weight,
      });
    });
  };
  // Highest priority: avoid covering nodes.
  pushHazards("circle[data-component-key],path[data-component-key],rect[data-component-key]", 120, 4);
  // Next: avoid covering lines/bands.
  pushHazards("line[data-align-band],rect[data-align-band],line[data-hide-key^='comboparent:'],line", 22, 2);
  // Finally: avoid axis/grid text.
  pushHazards("text:not([data-print-label-id])", 10, 2);
  return hazards;
}

function nudgePrintLabelsToReduceCollisions(labels, minY, maxY, hazards = []) {
  if (!Array.isArray(labels) || labels.length < 2) {
    return;
  }
  const working = labels
    .filter((item) => item?.el && !item.manual)
    .sort((a, b) => (a.baseX - b.baseX) || (a.baseY - b.baseY));
  const placed = [];

  const intersects = (a, b) =>
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;

  const setCandidatePlacement = (item, candidate) => {
    const dx = Number(candidate?.dx || 0);
    const dy = Number(candidate?.dy || 0);
    const x = item.baseX + dx;
    const y = item.baseY + dy;
    item.el.setAttribute("x", String(x));
    item.el.setAttribute("y", String(y));
    item.el.setAttribute("text-anchor", candidate?.anchor || item.defaultAnchor || "start");
    item.el.setAttribute("data-print-default-dx", String(dx));
    item.el.setAttribute("data-print-default-dy", String(dy));
    item.el.querySelectorAll("tspan").forEach((span) => {
      // Preserve inline glyph/exponent spacing for note labels:
      // only line-start tspans should track the text anchor x.
      if (!span.hasAttribute("x")) {
        return;
      }
      span.setAttribute("x", String(x));
    });
  };

  working.forEach((item) => {
    const el = item.el;
    const candidates = Array.isArray(item.candidates) && item.candidates.length
      ? item.candidates
      : [{ dx: 0, dy: 0, anchor: item.defaultAnchor || "start" }];
    let bestRect = null;
    let bestScore = Infinity;
    let bestCandidate = candidates[0];

    candidates.forEach((candidate, index) => {
      setCandidatePlacement(item, candidate);
      const rect = el.getBBox();
      const box = { x: rect.x - 2, y: rect.y - 1, w: rect.width + 4, h: rect.height + 2 };
      const outOfBoundsPenalty =
        (box.y < minY ? (minY - box.y) : 0) +
        (box.y + box.h > maxY ? (box.y + box.h - maxY) : 0);
      const overlapCount = placed.reduce(
        (count, p) => count + (Math.abs(p.x - box.x) < 240 && intersects(box, p) ? 1 : 0),
        0
      );
      const hazardPenalty = hazards.reduce((sum, hazard) => {
        if (Math.abs(hazard.x - box.x) > 320) {
          return sum;
        }
        return sum + (intersects(box, hazard) ? (hazard.weight || 1) : 0);
      }, 0);
      const score = overlapCount * 1000 + hazardPenalty * 40 + outOfBoundsPenalty * 10 + index;
      if (score < bestScore) {
        bestScore = score;
        bestRect = box;
        bestCandidate = candidate;
      }
    });

    setCandidatePlacement(item, bestCandidate);
    if (bestRect) {
      placed.push(bestRect);
    } else {
      const rect = el.getBBox();
      placed.push({ x: rect.x - 2, y: rect.y - 1, w: rect.width + 4, h: rect.height + 2 });
    }
  });
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

function getPrintAutoTextStyle(classKey) {
  const defaults = PRINT_AUTO_TEXT_STYLE_DEFAULTS[classKey] || PRINT_AUTO_TEXT_STYLE_DEFAULTS.component;
  const style = state.printAutoTextStyles?.[classKey];
  const font = (style && typeof style.font === "string" && style.font.trim())
    ? style.font.trim()
    : defaults.font;
  const size = clamp(Number(style?.size ?? defaults.size), 8, 72);
  return { font, size };
}

function setPrintAutoTextStyle(classKey, patch) {
  const current = getPrintAutoTextStyle(classKey);
  const next = {
    font: typeof patch?.font === "string" && patch.font.trim() ? patch.font.trim() : current.font,
    size: Number.isFinite(patch?.size) ? clamp(Number(patch.size), 8, 72) : current.size,
  };
  state.printAutoTextStyles = {
    ...(state.printAutoTextStyles || cloneJson(PRINT_AUTO_TEXT_STYLE_DEFAULTS, PRINT_AUTO_TEXT_STYLE_DEFAULTS)),
    [classKey]: next,
  };
}

function openCustomTextDialog(initialText = "", options = {}) {
  if (!customTextModal || !customTextInput) {
    if (typeof window !== "undefined" && typeof window.prompt === "function") {
      const entered = window.prompt(String(options?.title || "Custom Text"), String(initialText || ""));
      if (entered == null) {
        return Promise.resolve(null);
      }
      return Promise.resolve({ text: String(entered) });
    }
    return Promise.resolve(null);
  }
  if (customTextDialogResolver) {
    customTextDialogResolver(null);
    customTextDialogResolver = null;
  }
  customTextDialogMode = options.mode === "style" ? "style" : "custom";
  customTextInput.value = String(initialText || "");
  const modalTitle = typeof options.title === "string" && options.title.trim()
    ? options.title.trim()
    : customTextDialogMode === "style" ? "Text Style" : "Custom Text";
  const modalSaveText = typeof options.saveText === "string" && options.saveText.trim()
    ? options.saveText.trim()
    : customTextDialogMode === "style" ? "Apply" : "Add Text";
  if (customTextModalTitle) {
    customTextModalTitle.textContent = modalTitle;
  }
  if (customTextSaveButton) {
    customTextSaveButton.textContent = modalSaveText;
  }
  if (customTextInput) {
    customTextInput.disabled = customTextDialogMode === "style";
  }
  customTextModal.hidden = false;
  customTextModal.style.display = "grid";
  customTextDialogOpenedAt = Date.now();
  customTextInput.focus();
  customTextInput.select();
  return new Promise((resolve) => {
    customTextDialogResolver = resolve;
  });
}

function closeCustomTextDialog(result, reason = "unknown") {
  if (!customTextModal) {
    return;
  }
  customTextModal.hidden = true;
  customTextModal.style.display = "none";
  customTextDialogMode = "custom";
  customTextDialogOpenedAt = 0;
  if (customTextInput) {
    customTextInput.disabled = false;
  }
  const resolver = customTextDialogResolver;
  customTextDialogResolver = null;
  if (resolver) {
    resolver(result || null);
  }
}

function getSelectedCustomTextItem() {
  const id = state.printSelectedCustomTextId;
  if (!id) {
    return null;
  }
  return (state.printCustomTexts || []).find((item) => item.id === id) || null;
}

function updateSelectedCustomTextItem(patch) {
  const selected = getSelectedCustomTextItem();
  if (!selected) {
    return false;
  }
  state.printCustomTexts = (state.printCustomTexts || []).map((item) =>
    item.id === selected.id ? { ...item, ...patch } : item
  );
  return true;
}

function buildModel() {
  const parsed = parseNotes(state.notesText, state.ratioRootHz, state.a4Hz);
  const notes = parsed.notes;
  const effectiveOvertoneCount = clamp(
    Math.round((Number(state.overtoneCount) || 8) / Math.max(0.01, Number(state.layoutScale) || 1)),
    2,
    48
  );
  const chords = parsed.chords && parsed.chords.length
    ? parsed.chords
    : (notes.length ? [{ index: 0, noteIndexes: notes.map((_, index) => index) }] : []);

  const overtones = [];
  for (let noteIndex = 0; noteIndex < notes.length; noteIndex += 1) {
    const base = notes[noteIndex].freq;
    for (let harmonic = 1; harmonic <= effectiveOvertoneCount; harmonic += 1) {
      overtones.push({
        kind: "overtone",
        noteIndex,
        harmonic,
        playKey: `harmonic:${noteIndex}:${harmonic}`,
        freq: base * harmonic,
        weight: harmonicScalingGain(harmonic),
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
      weight: fusionPointWeight(point),
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
  const fusionAlignmentMatchCents = Math.max(
    2,
    (Number(state.alignToleranceCents) || 1) * 1.5,
    (Number(state.fusionClusterCents) || 0) * 1.5
  );
  const chordAnalyses = chords.map((chord, chordIndex) => {
    const noteSet = new Set(chord.noteIndexes);
    const chordPoints = weightedFusionPoints.filter((point) =>
      (point.noteIndexes || []).some((idx) => noteSet.has(idx))
    );
    const rawFusionNodes = buildFusionAllModeNodes(
      chordPoints,
      clamp(state.fusionClusterCents, 0, 4),
      effectiveOvertoneCount
    );
    const roughnessBands =
      state.showRoughness && chordPoints.length > 1
        ? computeFusionBeatBands(
          chordPoints,
          beatMin,
          beatMax,
          clamp(state.fusionClusterCents * 0.8, 0.4, 4)
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
    const chordMaxWeight = Math.max(
      1e-6,
      ...chordRawClusters.map((cluster) => cluster.weightSum || 0)
    );
    const alignmentClusters = chordRawClusters.map((cluster, index) => ({
      ...cluster,
      id: `${chordIndex}:${index}`,
      chordIndex,
      strength:
        0.35 * (cluster.points.length / chordMaxPoints) +
        0.65 * ((cluster.weightSum || 0) / chordMaxWeight),
      tip: `Chord ${chordIndex + 1}
${cluster.uniqueNotes} notes align near ${formatHz(cluster.centerFreq)}`,
    }));
    const annotatedFusionNodes = annotateFusionNodesWithAlignment(
      rawFusionNodes,
      alignmentClusters,
      fusionAlignmentMatchCents
    );
    const fusionNodes =
      state.fusionMode === "all"
        ? annotatedFusionNodes
        : annotatedFusionNodes.filter((node) => Number(node.count) > 1);
    return {
      chordIndex,
      noteIndexes: chord.noteIndexes,
      fusionNodes,
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
    effectiveOvertoneCount,
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

  const print = isPrintMode();
  const idealWidth = noteCount * (print ? 64 : 46);
  const minWidth = Math.min(totalWidth * (print ? 0.82 : 0.68), noteCount * (print ? 74 : 54));
  const maxWidth = totalWidth * (print ? 0.95 : 0.88);
  const bandWidth = clamp(idealWidth, minWidth, maxWidth);
  const leftPad = print ? Math.min(8, totalWidth * 0.02) : 0;
  const left = xLeft + leftPad;
  return { left, right: left + bandWidth };
}

function resolvePageRect(width, height, inPrintMode) {
  const pageRatioMap = {
    "letter-portrait": 8.5 / 11,
    "letter-landscape": 11 / 8.5,
    "a4-portrait": 210 / 297,
    "a4-landscape": 297 / 210,
  };
  const pageRatio = pageRatioMap[state.printPaper] || pageRatioMap["letter-landscape"];
  const pagePadding = inPrintMode ? 18 : 0;
  let pageWidth = width - pagePadding * 2;
  let pageHeight = height - pagePadding * 2;
  if (inPrintMode) {
    if (pageWidth / pageHeight > pageRatio) {
      pageWidth = pageHeight * pageRatio;
    } else {
      pageHeight = pageWidth / pageRatio;
    }
  }
  const pageX = inPrintMode ? (width - pageWidth) / 2 : 0;
  const pageY = inPrintMode ? (height - pageHeight) / 2 : 0;
  return { pageX, pageY, pageWidth, pageHeight };
}

function resolveFrameBounds(width, height, inPrintMode, pageRect, printMargin) {
  const stageLeft = chartStage?.getBoundingClientRect?.().left || 0;
  const liveAxisTargetAbsX = 340;
  const liveAxisTargetLocalX = liveAxisTargetAbsX - stageLeft;
  if (!inPrintMode) {
    return {
      frameLeft: clamp(liveAxisTargetLocalX, 24, width - 220),
      frameRight: width - 22,
      pageInnerLeft: 0,
      pageInnerRight: width,
      pageInnerTop: 0,
      pageInnerBottom: height,
    };
  }
  const printAxisReserve = clamp(pageRect.pageWidth * 0.085, 56, 96);
  const printRightReserve = clamp(pageRect.pageWidth * 0.02, 12, 26);
  const pageInnerLeft = pageRect.pageX + printMargin;
  const pageInnerRight = pageRect.pageX + pageRect.pageWidth - printMargin;
  const pageInnerTop = pageRect.pageY + printMargin;
  const pageInnerBottom = pageRect.pageY + pageRect.pageHeight - printMargin;
  return {
    frameLeft: pageInnerLeft + printAxisReserve,
    frameRight: pageInnerRight - printRightReserve,
    pageInnerLeft,
    pageInnerRight,
    pageInnerTop,
    pageInnerBottom,
  };
}

function resolveBottomReserve(inPrintMode, xLabelMode, noteCount, showChordControls) {
  const baseReserve =
    xLabelMode === "full"
      ? (noteCount > 10 ? 86 : 74)
      : xLabelMode === "compact"
        ? 92
        : 100;
  const chordControlReserve = showChordControls && noteCount > 0 ? (inPrintMode ? 44 : 62) : 0;
  const printBuffer = inPrintMode ? 8 : 0;
  return baseReserve + chordControlReserve + printBuffer;
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
  const lowerFreq = Number.isFinite(freqA) && Number.isFinite(freqB) ? Math.min(freqA, freqB) : NaN;
  const upperFreq = Number.isFinite(freqA) && Number.isFinite(freqB) ? Math.max(freqA, freqB) : NaN;
  const calculation = describeComboCalculation(point.type, lowerFreq, upperFreq);

  let title = "Combination tone";
  if (point.type === "difference") title = "Difference tone";
  if (point.type === "sum") title = "Summation tone";
  if (point.type === "order2a" || point.type === "order2b") title = "2nd-order combination tone";

  return `${title}
Formula: ${point.formula}
Source notes: ${labelA} and ${labelB}
Calculation: ${calculation}
Result: ${formatHz(point.freq)}`;
}

function buildChartSvg(model, width, height) {
  const rootStyle = getComputedStyle(document.body);
  const inPrintMode = isPrintMode();
  const printIsGreyscale = inPrintMode && state.printColorMode === "greyscale";
  const colorScheme = activeRenderColorScheme(inPrintMode);
  const axisColor = rootStyle.getPropertyValue("--viz-axis").trim() || "rgba(20,20,20,0.8)";
  const gridColor = rootStyle.getPropertyValue("--viz-grid").trim() || "rgba(0,0,0,0.08)";
  const gridStrongColor = rootStyle.getPropertyValue("--viz-grid-strong").trim() || "rgba(0,0,0,0.16)";
  const textPrimary = rootStyle.getPropertyValue("--text-primary").trim() || "#111";
  const textSecondary = rootStyle.getPropertyValue("--muted-ink").trim() || "#444";
  const vizBg = rootStyle.getPropertyValue("--viz-bg").trim() || "#fff";
  const comboDiffColor = colorScheme?.combo?.difference || "#d45d4c";
  const comboSumColor = colorScheme?.combo?.sum || "#b6802e";
  const comboOrder2Color = colorScheme?.combo?.order2 || "#6e58b4";
  const comboOrder2RectColor = colorScheme?.combo?.order2Rect || comboOrder2Color || "#2f8a45";
  const alphaFalloff = state.alphaFalloff !== false;
  const stackLineScale = clamp(Number(state.stackLineSize) || 1, 0.25, 3);
  const axisStrokeW = inPrintMode ? 1.8 : 1.4;
  const columnStrokeW = inPrintMode ? 0.7 : 1;
  const stemStrokeW = (inPrintMode ? 0.8 : 1) * stackLineScale;
  const stemOpacity = alphaFalloff ? (inPrintMode ? 0.18 : 0.26) : 1;

  const { pageX, pageY, pageWidth, pageHeight } = resolvePageRect(width, height, inPrintMode);
  const printMargin = inPrintMode ? clamp(Number(state.printMargin) || 44, 8, 220) : 0;
  const {
    frameLeft,
    frameRight,
    pageInnerLeft,
    pageInnerRight,
    pageInnerTop,
    pageInnerBottom,
  } = resolveFrameBounds(width, height, inPrintMode, { pageX, pageY, pageWidth, pageHeight }, printMargin);
  const chordsForLayout = model.chords && model.chords.length
    ? model.chords
    : (model.notes.length ? [{ index: 0, noteIndexes: model.notes.map((_, i) => i) }] : []);
  const useAlignmentLabelLane = state.showAlignments && !state.showFusion && !state.showRoughness;
  const buildSlotEntries = (fusionWidthByChord = {}) => {
    const entries = [];
    chordsForLayout.forEach((chord, chordIndex) => {
      chord.noteIndexes.forEach((noteIndex) => {
        entries.push({ type: "note", chordIndex, noteIndex, width: 1 });
      });
      if (useAlignmentLabelLane) {
        entries.push({ type: "alignlabel", chordIndex, width: 1.15 });
      }
      if (state.showFusion) {
        entries.push({
          type: "fusion",
          chordIndex,
          width: clamp(Number(fusionWidthByChord[chordIndex]) || 0.92, 0.92, 5),
        });
      }
      if (state.showRoughness) {
        entries.push({ type: "rough", chordIndex, width: 0.92 });
      }
      if (chordIndex < chordsForLayout.length - 1) {
        entries.push({ type: "gap", width: useAlignmentLabelLane ? 0.9 : 0.68 });
      }
    });
    return entries;
  };
  const computeLayoutMetrics = (entries) => {
    const layoutCount = Math.max(model.notes.length, entries.length || model.notes.length);
    const noteBand = computeNoteBand(layoutCount, frameLeft, frameRight);
    const totalSlotUnits = Math.max(
      1,
      entries.reduce((sum, entry) => sum + (entry.width || 1), 0)
    );
    const slotUnitWidth = (noteBand.right - noteBand.left) / totalSlotUnits;
    return { layoutCount, noteBand, totalSlotUnits, slotUnitWidth };
  };
  const provisionalEntries = buildSlotEntries();
  const provisionalLayout = computeLayoutMetrics(provisionalEntries);
  const fusionWidthByChord = {};
  const fusionHalfSpanByChord = {};
  if (state.showFusion && provisionalLayout.slotUnitWidth > 0) {
    (model.chordAnalyses || []).forEach((analysis) => {
      let maxHalfSpan = 0;
      (analysis.fusionNodes || []).forEach((node) => {
        if (!(node.centerFreq >= model.rangeMin && node.centerFreq <= model.rangeMax)) {
          return;
        }
        const visual = getFusionNodeVisual(node, state.fusionMode, state.themeDark, colorScheme);
        const halfSpan = fusionVisualHalfSpan(visual);
        maxHalfSpan = Math.max(maxHalfSpan, halfSpan);
      });
      if (maxHalfSpan > 0) {
        fusionHalfSpanByChord[analysis.chordIndex] = maxHalfSpan;
      }
    });
    Object.entries(fusionHalfSpanByChord).forEach(([rawChordIndex, halfSpan]) => {
      const chordIndex = Number(rawChordIndex);
      if (!Number.isFinite(chordIndex)) {
        return;
      }
      const requiredPx = Math.max(26, halfSpan * 2 + 14);
      fusionWidthByChord[chordIndex] = requiredPx / provisionalLayout.slotUnitWidth;
    });
  }
  const slotEntries = buildSlotEntries(fusionWidthByChord);
  const { layoutCount, noteBand, totalSlotUnits, slotUnitWidth } = computeLayoutMetrics(slotEntries);
  const firstEntryCenterX = noteBand.left + slotUnitWidth * 0.5;
  const desiredFirstEntryCenterX = frameLeft + slotUnitWidth;
  const unboundedEntryShiftX = desiredFirstEntryCenterX - firstEntryCenterX;
  const maxDefaultEntryCenterX = noteBand.left + Math.max(0, totalSlotUnits - 0.5) * slotUnitWidth;
  const maxShiftRight = Math.max(0, frameRight - maxDefaultEntryCenterX);
  const entryShiftX = Math.min(unboundedEntryShiftX, maxShiftRight);
  const noteXByIndex = {};
  const fusionXByChord = {};
  const roughnessXByChord = {};
  const alignLabelLaneXByChord = {};
  let unitCursor = 0;
  slotEntries.forEach((entry) => {
    const widthUnits = entry.width || 1;
    const x = noteBand.left + (unitCursor + widthUnits / 2) * slotUnitWidth + entryShiftX;
    if (entry.type === "note") {
      const key = `note:${entry.noteIndex}`;
      noteXByIndex[entry.noteIndex] = inPrintMode && Number.isFinite(state.printColumnOverrides?.[key])
        ? Number(state.printColumnOverrides[key])
        : x;
    } else if (entry.type === "fusion") {
      const key = `fusion:${entry.chordIndex}`;
      fusionXByChord[entry.chordIndex] = inPrintMode && Number.isFinite(state.printColumnOverrides?.[key])
        ? Number(state.printColumnOverrides[key])
        : x;
    } else if (entry.type === "rough") {
      const key = `rough:${entry.chordIndex}`;
      roughnessXByChord[entry.chordIndex] = inPrintMode && Number.isFinite(state.printColumnOverrides?.[key])
        ? Number(state.printColumnOverrides[key])
        : x;
    } else if (entry.type === "alignlabel") {
      alignLabelLaneXByChord[entry.chordIndex] = x;
    }
    unitCursor += widthUnits;
  });

  const noteXs = Object.values(noteXByIndex);
  const fusionXs = Object.values(fusionXByChord);
  const roughnessXs = Object.values(roughnessXByChord);
  const chordNoteXBounds = {};
  chordsForLayout.forEach((chord, chordIndex) => {
    const xs = (chord.noteIndexes || [])
      .map((idx) => noteXByIndex[idx])
      .filter((x) => Number.isFinite(x));
    if (!xs.length) {
      return;
    }
    chordNoteXBounds[chordIndex] = {
      min: Math.min(...xs),
      max: Math.max(...xs),
    };
  });
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
  const xLabelMode = inPrintMode ? "full" : baseXLabelMode;
  const showChordControls = state.showChordControls;
  const basePlotTop = inPrintMode ? pageInnerTop + clamp(pageHeight * 0.01, 8, 16) : 24;
  const bottomReserve = resolveBottomReserve(
    inPrintMode,
    xLabelMode,
    model.notes.length,
    showChordControls
  );
  const rawPlotBottom = inPrintMode
    // In print mode, anchor from the page bottom so the x-axis offset mirrors
    // the y-axis offset from the left page edge.
    ? (pageY + pageHeight) - Math.max(0, frameLeft - pageX)
    : (height - bottomReserve);
  const maxPlotBottom = inPrintMode ? pageInnerBottom : height - 8;
  const plotBottom = Math.min(maxPlotBottom, Math.max(basePlotTop + 64, rawPlotBottom));
  const printGraphHeight = clamp(Number(state.printGraphHeight) || 1, 0.45, 1);
  const plotTop = inPrintMode
    ? clamp(
      plotBottom - (plotBottom - basePlotTop) * printGraphHeight,
      basePlotTop,
      plotBottom - 64
    )
    : basePlotTop;
  const noteBandWidth = Math.max(0, rightmostDataX - leftmostDataX);
  const horizontalPad = clamp(noteBandWidth * 0.1, 30, 68);
  const plotLeft = frameLeft;
  const fusionReserve = state.showFusion ? clamp(columnStep * 1.15, 56, 96) : 0;
  const roughReserve = state.showRoughness ? clamp(columnStep * 1.15, 56, 96) : 0;
  const rightGutter = clamp(noteBandWidth * 0.2, 80, 180) + fusionReserve + roughReserve;
  const desiredPlotRight = rightmostDataX + horizontalPad + rightGutter;
  const maxPlotRight = inPrintMode ? pageInnerRight : width - 12;
  const plotRight = clamp(desiredPlotRight, plotLeft + 100, Math.max(plotLeft + 100, maxPlotRight));
  const plotWidth = Math.max(100, plotRight - plotLeft);
  const plotHeight = Math.max(1, plotBottom - plotTop);
  lastDiagramCenter = {
    x: plotLeft + plotWidth / 2,
    y: plotTop + plotHeight / 2,
  };
  const fusionHalfSpanMax = Math.max(0, ...Object.values(fusionHalfSpanByChord));
  const fusionColumnWidth = state.showFusion
    ? clamp(Math.max(columnStep * 0.78, fusionHalfSpanMax * 2 + 14), 22, 340)
    : clamp(columnStep * 0.78, 22, 340);
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
  const printComponentMeta = {};
  const maxFusionRadiusByChord = {};
  const stackStemLayer = createSvgEl("g", { "data-stack-stem-layer": "1" });
  const isPrintHidden = (key) =>
    inPrintMode && key && typeof state.printHiddenKeys === "object" && state.printHiddenKeys[key];

  const yForFreq = yMapper(model.rangeMin, model.rangeMax, plotTop, plotBottom, state.yScale);
  const ticks = state.yScale === "log" ? logTicks(model.rangeMin, model.rangeMax) : linearTicks(model.rangeMin, model.rangeMax);
  const showPrintAxisText = !inPrintMode || state.printShowAxisText;
  const sceneScale = clamp(Number(state.layoutScale) || 1, 0.6, 1.8);
  const sceneAnchorX = plotLeft;
  const sceneAnchorY = plotTop;
  const sceneBaseShiftX = sceneAnchorX * (1 - sceneScale);
  const sceneBaseShiftY = sceneAnchorY * (1 - sceneScale);
  const printDiagramOffsetX = inPrintMode ? (Number(state.printDiagramOffsetX) || 0) : 0;
  const printDiagramOffsetY = inPrintMode ? (Number(state.printDiagramOffsetY) || 0) : 0;
  const sceneShiftX = sceneBaseShiftX + printDiagramOffsetX;
  const sceneShiftY = sceneBaseShiftY + printDiagramOffsetY;

  const svg = createSvgEl("svg", {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    "aria-label": "Overtones chart",
    role: "img",
    "data-scene-shift-x": sceneShiftX,
    "data-scene-shift-y": sceneShiftY,
    "data-export-page-x": pageX,
    "data-export-page-y": pageY,
    "data-export-page-width": pageWidth,
    "data-export-page-height": pageHeight,
  });

  svg.appendChild(
    createSvgEl("rect", {
      x: 0,
      y: 0,
      width,
      height,
      fill: inPrintMode ? "#ececec" : vizBg,
    })
  );

  if (inPrintMode) {
    svg.appendChild(
      createSvgEl("rect", {
        x: pageX,
        y: pageY,
        width: pageWidth,
        height: pageHeight,
        fill: "#ffffff",
        stroke: "rgba(0,0,0,0.28)",
        "stroke-width": 1,
      })
    );
  }
  const diagramRoot = createSvgEl("g", {
    "data-diagram-root": "1",
    "data-scene-base-shift-x": String(sceneBaseShiftX),
    "data-scene-base-shift-y": String(sceneBaseShiftY),
    "data-scene-scale": String(sceneScale),
    transform: `translate(${sceneShiftX}, ${sceneShiftY}) scale(${sceneScale})`,
  });
  const axisTextStyle = inPrintMode ? getPrintAutoTextStyle("axis") : null;
  const overtoneTextStyle = inPrintMode ? getPrintAutoTextStyle("overtone") : null;
  const componentTextStyle = inPrintMode ? getPrintAutoTextStyle("component") : null;

  const gridLayer = createSvgEl("g");
  if (showPrintAxisText) {
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
          "font-size": axisTextStyle ? axisTextStyle.size : 11,
          "font-family": axisTextStyle
            ? `${axisTextStyle.font}, Lexend, IBM Plex Sans, sans-serif`
            : "Lexend, IBM Plex Sans, sans-serif",
          "text-anchor": "end",
          "data-auto-text-class": inPrintMode ? "axis" : null,
        })
      ).textContent = formatAxisHzCompact(tick.freq);
    });
  }
  diagramRoot.appendChild(gridLayer);

  const axisLayer = createSvgEl("g");
  axisLayer.appendChild(
    createSvgEl("line", {
      x1: plotLeft,
      y1: plotTop,
      x2: plotLeft,
      y2: plotBottom,
      stroke: axisColor,
      "stroke-width": axisStrokeW,
      "data-export-include": inPrintMode ? "1" : null,
    })
  );
  const xAxisLine = createSvgEl("line", {
    x1: plotLeft,
    y1: plotBottom,
    x2: plotRight,
    y2: plotBottom,
    stroke: axisColor,
    "stroke-width": axisStrokeW,
    "data-export-include": inPrintMode ? "1" : null,
  });
  axisLayer.appendChild(xAxisLine);
  const yLabelX = plotLeft - 62;
  if (showPrintAxisText) {
    const defaultYAxisLabel = `Frequency spectrum (${state.yScale})`;
    const yAxisLabelText = state.printYAxisLabelHasOverride
      ? String(state.printYAxisLabelOverride || "").trim()
      : defaultYAxisLabel;
    const yLabel = createSvgEl("text", {
      x: yLabelX,
      y: plotTop + plotHeight / 2,
      fill: textSecondary,
      "font-size": axisTextStyle ? axisTextStyle.size : 12,
      "font-family": axisTextStyle
        ? `${axisTextStyle.font}, Lexend, IBM Plex Sans, sans-serif`
        : "Lexend, IBM Plex Sans, sans-serif",
      transform: `rotate(-90 ${yLabelX} ${plotTop + plotHeight / 2})`,
      "text-anchor": "middle",
      "data-auto-text-class": inPrintMode ? "axis" : null,
      "data-print-y-axis-label": inPrintMode ? "1" : null,
      "data-label-default-text": inPrintMode ? defaultYAxisLabel : null,
      "data-export-include": inPrintMode ? "1" : null,
      style: inPrintMode ? "cursor:pointer" : null,
    });
    yLabel.textContent = yAxisLabelText;
    axisLayer.appendChild(yLabel);
  }

  diagramRoot.appendChild(axisLayer);

  const noteX = [];
  const xAxisColumnXs = [];
  const noteLayer = createSvgEl("g");
  const dragHitLayer = inPrintMode ? createSvgEl("g") : null;
  const drawHzLineForNotes = state.showLabels && xLabelMode === "full";
  for (let noteIndex = 0; noteIndex < model.notes.length; noteIndex += 1) {
    const x = Number.isFinite(noteXByIndex[noteIndex])
      ? noteXByIndex[noteIndex]
      : xForNote(noteIndex, model.notes.length, noteBand.left, noteBand.right);
    noteX[noteIndex] = x;
    xAxisColumnXs.push(x);

    noteLayer.appendChild(
      createSvgEl("line", {
        x1: x,
        y1: plotTop,
        x2: x,
        y2: plotBottom,
        stroke: gridColor,
        "stroke-width": columnStrokeW,
      })
    );

    const token = model.notes[noteIndex].input;
    if (state.showLabels) {
      const tokenY = xLabelMode === "full" ? plotBottom + 18 : plotBottom + 24;
      const labelTop = createSvgEl("text", {
        x,
        y: tokenY,
        fill: textPrimary,
        "font-size": axisTextStyle ? axisTextStyle.size : xLabelMode === "full" ? 11 : 10,
        "font-family": axisTextStyle
          ? `${axisTextStyle.font}, IBM Plex Sans, Lexend, sans-serif`
          : "IBM Plex Sans, Lexend, sans-serif",
        "text-anchor": "middle",
        "data-auto-text-class": inPrintMode ? "axis" : null,
      });
      labelTop.textContent = token;
      noteLayer.appendChild(labelTop);
      if (dragHitLayer) {
        dragHitLayer.appendChild(
          createSvgEl("rect", {
            x: x - 28,
            y: tokenY - 24,
            width: 56,
            height: 30,
            fill: "rgba(0,0,0,0)",
              stroke: "rgba(0,0,0,0)",
              style: "cursor:ew-resize",
              "data-column-id": `note:${noteIndex}`,
              "data-column-origin": x,
            })
        );
      }
    }

    if (drawHzLineForNotes) {
      const labelBottom = createSvgEl("text", {
        x,
        y: plotBottom + 32,
        fill: textSecondary,
        "font-size": axisTextStyle ? axisTextStyle.size : 10,
        "font-family": axisTextStyle
          ? `${axisTextStyle.font}, Lexend, IBM Plex Sans, sans-serif`
          : "Lexend, IBM Plex Sans, sans-serif",
        "text-anchor": "middle",
        "data-auto-text-class": inPrintMode ? "axis" : null,
      });
      labelBottom.textContent = formatAxisHzCompact(model.notes[noteIndex].freq);
      noteLayer.appendChild(labelBottom);
    }
  }
  if (state.showFusion) {
    chordsForLayout.forEach((chord, chordIndex) => {
      const fusionX = Number.isFinite(fusionXByChord[chordIndex]) ? fusionXByChord[chordIndex] : null;
      if (!(fusionX != null)) {
        return;
      }
      xAxisColumnXs.push(fusionX);
      noteLayer.appendChild(
        createSvgEl("line", {
          x1: fusionX,
          y1: plotTop,
          x2: fusionX,
          y2: plotBottom,
          stroke: gridStrongColor,
          "stroke-width": inPrintMode ? 0.8 : 1.2,
          "stroke-dasharray": "4 3",
        })
      );
      if (state.showLabels) {
        const tokenY = xLabelMode === "full" ? plotBottom + 18 : plotBottom + 24;
        const label = createSvgEl("text", {
          x: fusionX,
          y: tokenY,
          fill: textPrimary,
          "font-size": axisTextStyle ? axisTextStyle.size : xLabelMode === "full" ? 11 : 10,
          "font-family": axisTextStyle
            ? `${axisTextStyle.font}, IBM Plex Sans, Lexend, sans-serif`
            : "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "middle",
          "data-auto-text-class": inPrintMode ? "axis" : null,
        });
        label.textContent = "Fusion";
        noteLayer.appendChild(label);
        if (dragHitLayer) {
          dragHitLayer.appendChild(
            createSvgEl("rect", {
              x: fusionX - 32,
              y: tokenY - 18,
              width: 64,
              height: 24,
              fill: "rgba(0,0,0,0)",
              stroke: "rgba(0,0,0,0)",
              style: "cursor:ew-resize",
              "data-column-id": `fusion:${chordIndex}`,
              "data-column-origin": fusionX,
            })
          );
        }
      }
    });
  }
  if (state.showRoughness) {
    chordsForLayout.forEach((chord, chordIndex) => {
      const roughnessX = Number.isFinite(roughnessXByChord[chordIndex]) ? roughnessXByChord[chordIndex] : null;
      if (!(roughnessX != null)) {
        return;
      }
      xAxisColumnXs.push(roughnessX);
      noteLayer.appendChild(
        createSvgEl("line", {
          x1: roughnessX,
          y1: plotTop,
          x2: roughnessX,
          y2: plotBottom,
          stroke: gridStrongColor,
          "stroke-width": inPrintMode ? 0.8 : 1.2,
          "stroke-dasharray": "2 4",
        })
      );
      if (state.showLabels) {
        const tokenY = xLabelMode === "full" ? plotBottom + 18 : plotBottom + 24;
        const label = createSvgEl("text", {
          x: roughnessX,
          y: tokenY,
          fill: textPrimary,
          "font-size": axisTextStyle ? axisTextStyle.size : xLabelMode === "full" ? 11 : 10,
          "font-family": axisTextStyle
            ? `${axisTextStyle.font}, IBM Plex Sans, Lexend, sans-serif`
            : "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "middle",
          "data-auto-text-class": inPrintMode ? "axis" : null,
        });
        label.textContent = "Roughness";
        noteLayer.appendChild(label);
        if (dragHitLayer) {
          dragHitLayer.appendChild(
            createSvgEl("rect", {
              x: roughnessX - 38,
              y: tokenY - 18,
              width: 76,
              height: 24,
              fill: "rgba(0,0,0,0)",
              stroke: "rgba(0,0,0,0)",
              style: "cursor:ew-resize",
              "data-column-id": `rough:${chordIndex}`,
              "data-column-origin": roughnessX,
            })
          );
        }
      }
    });
  }
  const xAxisRight = xAxisColumnXs.length
    ? clamp(Math.max(...xAxisColumnXs), plotLeft, plotRight)
    : plotRight;
  const xAxisRightWithGap = clamp(xAxisRight + columnStep * 0.5, plotLeft, plotRight);
  xAxisLine.setAttribute("x2", String(xAxisRightWithGap));
  const comboDragMinX = plotLeft;
  const comboDragMaxX = Math.max(plotLeft, xAxisRightWithGap);
  const comboXByPlayKey = new Map();
  if (state.showCombination && model.visibleComboPoints.length) {
    const comboCollisionNodes = [];
    model.visibleOvertones.forEach((point) => {
      const x = noteX[point.noteIndex];
      const y = yForFreq(point.freq);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return;
      }
      const geom = computeOvertoneRenderGeometry(point.harmonic, state.overtoneCount);
      const radius = Math.max(1.2, Number(geom.radius) || 1.2);
      comboCollisionNodes.push({
        x,
        y,
        hHalf: radius,
        vHalf: radius,
      });
    });
    const comboShapeHalfExtents = (comboType) => {
      const radius = state.comboSize + 1.2;
      if (comboType === "sum") {
        return { hHalf: radius, vHalf: radius };
      }
      return { hHalf: radius * 1.35, vHalf: radius * 0.5 };
    };
    const compareComboCandidateScore = (a, b) => {
      if (a.nodeOverlapCount !== b.nodeOverlapCount) {
        return a.nodeOverlapCount - b.nodeOverlapCount;
      }
      if (Math.abs(a.nodeOverlapPenalty - b.nodeOverlapPenalty) > 1e-6) {
        return a.nodeOverlapPenalty - b.nodeOverlapPenalty;
      }
      if (Math.abs(a.gridPenalty - b.gridPenalty) > 1e-6) {
        return a.gridPenalty - b.gridPenalty;
      }
      if (Math.abs(a.shift - b.shift) > 1e-6) {
        return a.shift - b.shift;
      }
      return 0;
    };
    model.visibleComboPoints.forEach((point) => {
      const playKey = point.playKey;
      if (!playKey) {
        return;
      }
      const baseX = (noteX[point.noteA] + noteX[point.noteB]) / 2 + comboOffset(point.type);
      const minX = comboDragMinX;
      const maxX = comboDragMaxX;
      const comboOverride = Number(state.printComponentXOverrides?.[playKey]);
      if (Number.isFinite(comboOverride)) {
        comboXByPlayKey.set(playKey, clamp(comboOverride, minX, maxX));
        return;
      }
      const y = yForFreq(point.freq);
      if (!Number.isFinite(y)) {
        comboXByPlayKey.set(playKey, clamp(baseX, minX, maxX));
        return;
      }
      const { hHalf, vHalf } = comboShapeHalfExtents(point.type);
      const safeWidth = Math.max(1, maxX - minX);
      const shiftStep = 2;
      const maxShift = clamp(Math.min(safeWidth * 0.45, Math.max(12, columnStep * 0.7)), 10, 84);
      const candidateShifts = [0];
      for (let shift = shiftStep; shift <= maxShift + 1e-6; shift += shiftStep) {
        candidateShifts.push(shift, -shift);
      }
      let bestX = clamp(baseX, minX, maxX);
      let bestScore = {
        nodeOverlapCount: Infinity,
        nodeOverlapPenalty: Infinity,
        gridPenalty: Infinity,
        shift: Infinity,
      };
      candidateShifts.forEach((shift) => {
        const candidateX = clamp(baseX + shift, minX, maxX);
        let nodeOverlapCount = 0;
        let nodeOverlapPenalty = 0;
        comboCollisionNodes.forEach((node) => {
          const yAllowance = vHalf + node.vHalf + 1;
          const yDelta = Math.abs(y - node.y);
          if (yDelta >= yAllowance) {
            return;
          }
          const xAllowance = hHalf + node.hHalf + 1;
          const xDelta = Math.abs(candidateX - node.x);
          if (xDelta >= xAllowance) {
            return;
          }
          nodeOverlapCount += 1;
          const xPenetration = xAllowance - xDelta;
          const yPenetration = yAllowance - yDelta;
          nodeOverlapPenalty += xPenetration * yPenetration;
        });
        let gridPenalty = 0;
        const gridDesiredGap = Math.max(2, Math.min(8, hHalf * 0.45));
        xAxisColumnXs.forEach((columnX) => {
          const gap = Math.abs(candidateX - columnX) - hHalf;
          if (gap < gridDesiredGap) {
            gridPenalty += gridDesiredGap - gap;
          }
        });
        const score = {
          nodeOverlapCount,
          nodeOverlapPenalty,
          gridPenalty,
          shift: Math.abs(candidateX - baseX),
        };
        if (compareComboCandidateScore(score, bestScore) < 0) {
          bestScore = score;
          bestX = candidateX;
        }
      });
      comboXByPlayKey.set(playKey, bestX);
      comboCollisionNodes.push({
        x: bestX,
        y,
        hHalf,
        vHalf,
      });
    });
  }

  if (showChordControls && chordsForLayout.length) {
    const controlsLayer = createSvgEl("g");
    const braceY = plotBottom + 44;
    const labelY = plotBottom + 62;
    const buttonY = plotBottom + 76;
    const buttonDefs = [
      { label: "Fundamentals", action: "fundamentals" },
      { label: "All Overtones", action: "all-overtones" },
      { label: "All Tones", action: "all-tones" },
      { label: "Off", action: "off" },
    ];
    chordsForLayout.forEach((chord, chordIndex) => {
      const chordNoteXs = (chord.noteIndexes || [])
        .map((noteIndex) => noteXByIndex[noteIndex])
        .filter((x) => Number.isFinite(x));
      if (!chordNoteXs.length) {
        return;
      }
      const chordLeft = Math.min(...chordNoteXs) - 10;
      const chordRight = Math.max(...chordNoteXs) + 10;
      const width = Math.max(84, chordRight - chordLeft);
      const left = (chordLeft + chordRight) / 2 - width / 2;
      const right = left + width;
      const center = (left + right) / 2;

      controlsLayer.appendChild(
        createSvgEl("path", {
          d: `M ${left} ${braceY} L ${left} ${braceY + 7} L ${right} ${braceY + 7} L ${right} ${braceY}`,
          fill: "none",
          stroke: gridStrongColor,
          "stroke-width": 1.1,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "data-export-include": inPrintMode ? "1" : null,
        })
      );

      const title = createSvgEl("text", {
        x: center,
        y: labelY,
        fill: textSecondary,
        "font-size": inPrintMode && axisTextStyle ? axisTextStyle.size : 10,
        "font-family": inPrintMode && axisTextStyle
          ? `${axisTextStyle.font}, Lexend, IBM Plex Sans, sans-serif`
          : "Lexend, IBM Plex Sans, sans-serif",
        "text-anchor": "middle",
        "data-print-chord-title-index": inPrintMode ? String(chordIndex) : null,
        "data-export-include": inPrintMode ? "1" : null,
        style: inPrintMode ? "cursor:pointer" : null,
      });
      const defaultChordTitle = `Chord ${chordIndex + 1}`;
      const hasChordTitleOverride = Object.prototype.hasOwnProperty.call(
        state.printChordTitleOverrides || {},
        chordIndex
      );
      const overriddenChordTitle = hasChordTitleOverride
        ? String(state.printChordTitleOverrides?.[chordIndex] ?? "").trim()
        : "";
      title.textContent = inPrintMode
        ? (hasChordTitleOverride ? overriddenChordTitle : defaultChordTitle)
        : `Play ${defaultChordTitle}`;
      controlsLayer.appendChild(title);

      if (inPrintMode) {
        return;
      }

      const widths = buttonDefs.map((def) => def.label.length * 6.2 + 6);
      const linkGap = 5;
      const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (buttonDefs.length - 1) * linkGap;
      let cursor = center - totalWidth / 2;
      buttonDefs.forEach((def, index) => {
        const w = widths[index];
        const x = cursor;
        const text = createSvgEl("text", {
          x,
          y: buttonY,
          fill: textPrimary,
          "font-size": 10,
          "font-family": "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "start",
          "text-decoration": "underline",
          style: "cursor:pointer",
          "data-chord-index": String(chordIndex),
          "data-chord-action": def.action,
          "data-tip": `${def.label} for chord ${chordIndex + 1}`,
        });
        text.textContent = def.label;
        controlsLayer.appendChild(text);
        cursor += w + linkGap;
      });
    });
    noteLayer.appendChild(controlsLayer);
  }
  if (dragHitLayer) {
    noteLayer.appendChild(dragHitLayer);
  }
  diagramRoot.appendChild(noteLayer);

  const alignmentBandLabelData = [];
  if (state.showAlignments && model.clusters.length) {
    const alignLayer = createSvgEl("g");
    const regionByChord = new Map(chordRegions.map((region) => [region.chordIndex, region]));
    const fusionByChord = new Map(
      (model.chordAnalyses || []).map((analysis) => [analysis.chordIndex, analysis.fusionNodes || []])
    );
    const alignFusionMatchCents = Math.max(
      2,
      (Number(state.alignToleranceCents) || 1) * 1.5,
      (Number(state.fusionClusterCents) || 0) * 1.5
    );
    model.clusters.forEach((cluster, idx) => {
      const centerY = yForFreq(cluster.centerFreq);
      if (!(centerY >= plotTop && centerY <= plotBottom)) {
        return;
      }
      const region = regionByChord.get(cluster.chordIndex);
      if (!region) {
        return;
      }
      const fusionX = Number.isFinite(fusionXByChord[cluster.chordIndex])
        ? fusionXByChord[cluster.chordIndex]
        : NaN;
      const pointXForClusterItem = (point) => {
        if (!point || !Number.isFinite(point.freq)) {
          return NaN;
        }
        if (Number.isInteger(point.noteIndex) && Number.isFinite(noteXByIndex[point.noteIndex])) {
          return noteXByIndex[point.noteIndex];
        }
        if (Number.isInteger(point.noteA) && Number.isInteger(point.noteB)) {
          if (point.playKey && Number.isFinite(comboXByPlayKey.get(point.playKey))) {
            return comboXByPlayKey.get(point.playKey);
          }
          const xA = noteXByIndex[point.noteA];
          const xB = noteXByIndex[point.noteB];
          if (Number.isFinite(xA) && Number.isFinite(xB)) {
            return (xA + xB) / 2 + comboOffset(point.type);
          }
        }
        return NaN;
      };
      const clusterPointXs = (cluster.points || [])
        .map((point) => pointXForClusterItem(point))
        .filter((x) => Number.isFinite(x));
      const leftmostAlignedX = clusterPointXs.length ? Math.min(...clusterPointXs) : region.left;
      const fusionNodes = fusionByChord.get(cluster.chordIndex) || [];
      let matchedFusionNode = null;
      let matchedDeltaCents = Infinity;
      fusionNodes.forEach((node) => {
        if (!(node.centerFreq > 0)) {
          return;
        }
        const deltaCents = Math.abs(centsBetween(cluster.centerFreq, node.centerFreq));
        if (deltaCents < matchedDeltaCents) {
          matchedDeltaCents = deltaCents;
          matchedFusionNode = node;
        }
      });
      const matchedFusionVisual =
        matchedFusionNode && matchedDeltaCents <= alignFusionMatchCents
          ? getFusionNodeVisual(matchedFusionNode, state.fusionMode, state.themeDark, colorScheme)
          : null;
      const fusionHalfSpan = state.showFusion && matchedFusionVisual
        ? fusionVisualHalfSpan(matchedFusionVisual)
        : 0;
      const targetRight = Number.isFinite(fusionX)
        ? (
            state.showFusion && matchedFusionVisual
              ? fusionX - fusionHalfSpan
              : fusionX
          )
        : region.right;
      const useLabelLaneForCluster =
        useAlignmentLabelLane && Number.isFinite(alignLabelLaneXByChord[cluster.chordIndex]);
      const minBandLabelGutter = useLabelLaneForCluster
        ? Math.max(6, columnStep / 3)
        : !state.showFusion && !state.showRoughness
          ? Math.max(8, columnStep * 0.5)
          : 2;
      const laneLabelX = useLabelLaneForCluster
        ? alignLabelLaneXByChord[cluster.chordIndex] + minBandLabelGutter
        : NaN;
      const xRightBase = useLabelLaneForCluster ? laneLabelX - 1 : targetRight;
      const alignmentLabelId = `alignment:${cluster.id}`;
      const alignmentLabelOffset = state.printLabelOffsets?.[alignmentLabelId] || {};
      // Keep alignment band endpoint attached to label drags along X.
      const alignmentEndpointDx = Number.isFinite(alignmentLabelOffset.dx)
        ? Number(alignmentLabelOffset.dx)
        : 0;
      const xRight = clamp(xRightBase + alignmentEndpointDx, plotLeft + 2, plotRight);
      const xLeft = clamp(Math.min(leftmostAlignedX, xRight - 1), plotLeft, xRight - 1);
      const halfBand = state.alignToleranceCents > 0 ? state.alignToleranceCents / 2 : 0;
      const topFreq = cluster.centerFreq * 2 ** (halfBand / 1200);
      const bottomFreq = cluster.centerFreq / 2 ** (halfBand / 1200);
      const y1 = yForFreq(topFreq);
      const y2 = yForFreq(bottomFreq);
      const bandTop = Math.min(y1, y2);
      const bandHeight = Math.abs(y2 - y1);
      const fusionRadius = state.showFusion && matchedFusionVisual ? fusionHalfSpan : 0;
      const labelX = useLabelLaneForCluster
        ? laneLabelX
        : Number.isFinite(fusionX)
          ? Math.max(xRight + 2, fusionX + fusionRadius + 7)
          : xRight + minBandLabelGutter;
      alignmentBandLabelData.push({
        id: cluster.id,
        chordIndex: cluster.chordIndex,
        freq: cluster.centerFreq,
        xLeft,
        xRight,
        y: centerY,
        labelX,
        minLabelX: labelX,
        members: Array.isArray(cluster.points) ? cluster.points.map((point) => point.playKey).filter(Boolean) : [],
      });
      const alignFillColor =
        printIsGreyscale
          ? "rgba(0,0,0,0.24)"
          : matchedFusionVisual?.fill || (state.themeDark ? "#9f8be8" : "#7a56de");
      const alignLineColor =
        printIsGreyscale
          ? "rgba(0,0,0,0.72)"
          : matchedFusionVisual?.fill || (state.themeDark ? "#b6a6f2" : "#6e4fdf");

      if (bandHeight > 0.75) {
        alignLayer.appendChild(
          createSvgEl("rect", {
            x: xLeft,
            y: bandTop,
            width: Math.max(1, xRight - xLeft),
            height: bandHeight,
            fill: alignFillColor,
            "fill-opacity": matchedFusionVisual
              ? clamp(matchedFusionVisual.fillOpacity * 0.58, 0.12, 0.52)
              : state.themeDark
                ? 0.2
                : 0.17,
            "data-align-band": "1",
            "data-align-id": cluster.id,
          })
        );
      }
      alignLayer.appendChild(
        createSvgEl("line", {
          x1: xLeft,
          y1: centerY,
          x2: xRight,
          y2: centerY,
          stroke: alignLineColor,
          "stroke-opacity": matchedFusionVisual
            ? clamp(matchedFusionVisual.fillOpacity, 0.18, 0.92)
            : 1,
          "stroke-width": inPrintMode ? 0.8 : 1,
          "data-align-band": "1",
          "data-align-id": cluster.id,
          "data-tip": cluster.tip,
        })
      );
      if (idx > 120) {
        return;
      }
    });

    if (alignmentBandLabelData.length) {
      const sharedAlignmentLabelX = alignmentBandLabelData.reduce((maxX, band) => {
        const candidate = Number.isFinite(band.minLabelX) ? band.minLabelX : band.labelX;
        return Number.isFinite(candidate) ? Math.max(maxX, candidate) : maxX;
      }, -Infinity);
      if (Number.isFinite(sharedAlignmentLabelX)) {
        alignmentBandLabelData.forEach((band) => {
          band.labelX = sharedAlignmentLabelX;
        });
      }
    }

    diagramRoot.appendChild(alignLayer);
  }

  if (state.showFusion) {
    const fusionLayer = createSvgEl("g");
    (model.chordAnalyses || []).forEach((analysis) => {
      const fusionX = fusionXByChord[analysis.chordIndex];
      if (!Number.isFinite(fusionX)) {
        return;
      }
      (analysis.fusionNodes || []).forEach((node) => {
        if (!(node.centerFreq >= model.rangeMin && node.centerFreq <= model.rangeMax)) {
          return;
        }
        const y = yForFreq(node.centerFreq);
        const visual = getFusionNodeVisual(node, state.fusionMode, state.themeDark, colorScheme);
        const playKey = `fusion:${analysis.chordIndex}:${node.id}:${node.centerFreq.toFixed(6)}`;
        if (isPrintHidden(playKey)) {
          return;
        }
        const isPlaying = activeVoices.has(playKey);
        const minRadius = 2;
        const maxRadius = 24;
        const ampScale = clamp((visual.radius - minRadius) / Math.max(1e-6, maxRadius - minRadius), 0, 1);
        const fusionHalfSpanForLayout = fusionVisualHalfSpan(visual);
        maxFusionRadiusByChord[analysis.chordIndex] = Math.max(
          maxFusionRadiusByChord[analysis.chordIndex] || 0,
          fusionHalfSpanForLayout
        );
        const fusionFill =
          printIsGreyscale
            ? `rgba(0,0,0,${clamp(0.18 + ampScale * 0.7, 0.15, 0.88)})`
            : visual.fill;
        const fusionStroke =
          printIsGreyscale ? "rgba(0,0,0,0.85)" : visual.stroke;
        printComponentMeta[playKey] = {
          x: fusionX,
          y,
          freq: node.centerFreq,
          playKey,
          kind: "fusion",
          alignmentMemberCount: Number(node.alignmentMemberCount) || 0,
          alignmentLabelFreq: Number.isFinite(node.alignmentCenterFreq)
            ? Number(node.alignmentCenterFreq)
            : NaN,
          labelEligible: Boolean(node.labelEligible),
          chordIndex: analysis.chordIndex,
        };
        if (
          fusionShapeIncludesRect(visual.shape) ||
          fusionShapeIncludesDiamond(visual.shape) ||
          fusionShapeIncludesCircle(visual.shape)
        ) {
          const r = visual.radius;
          const hasRect = fusionShapeIncludesRect(visual.shape);
          const hasDiamond = fusionShapeIncludesDiamond(visual.shape);
          const hasCircle = fusionShapeIncludesCircle(visual.shape);
          const rectR = hasRect && Number.isFinite(visual.rectRadius)
            ? Number(visual.rectRadius)
            : hasRect
              ? r / 1.35
              : NaN;
          const diamondR = hasDiamond && Number.isFinite(visual.diamondRadius)
            ? Number(visual.diamondRadius)
            : hasDiamond
              ? r
              : NaN;
          const hitR = Math.max(
            hasCircle ? r : 0,
            hasRect ? rectR * 1.35 : 0,
            hasDiamond ? diamondR : 0
          );
          const commonFusionAttrs = {
            "data-play-key": playKey,
            "data-play-freq": node.centerFreq,
            "data-play-kind": "fusion",
            "data-play-scale": ampScale,
            "data-component-key": playKey,
            "data-hide-key": playKey,
            "data-playing": isPlaying ? "1" : "0",
            "data-tip": `Chord ${analysis.chordIndex + 1}\n${node.tip}`,
          };
          if (hasCircle) {
            fusionLayer.appendChild(
              createSvgEl("circle", {
                cx: fusionX,
                cy: y,
                r,
                fill: fusionFill,
                "fill-opacity": hasRect || hasDiamond ? visual.fillOpacity * 0.72 : visual.fillOpacity,
                stroke: isPlaying ? "#f4de58" : fusionStroke,
                "stroke-opacity": visual.strokeOpacity,
                "stroke-width": isPlaying ? 2.4 : visual.strokeWidth,
                ...commonFusionAttrs,
              })
            );
          }
          if (hasRect) {
            fusionLayer.appendChild(
              createSvgEl("rect", {
                x: fusionX - rectR * 1.35,
                y: y - rectR * 0.5,
                width: rectR * 2.7,
                height: rectR,
                rx: Math.max(0.9, rectR * 0.22),
                fill: fusionFill,
                "fill-opacity": hasDiamond || hasCircle ? visual.fillOpacity * 0.9 : visual.fillOpacity,
                stroke: isPlaying ? "#f4de58" : fusionStroke,
                "stroke-width": isPlaying ? 2.4 : visual.strokeWidth,
                "stroke-opacity": visual.strokeOpacity,
                ...commonFusionAttrs,
              })
            );
          }
          if (hasDiamond) {
            fusionLayer.appendChild(
              createSvgEl("path", {
                d: `M ${fusionX} ${y - diamondR} L ${fusionX + diamondR} ${y} L ${fusionX} ${y + diamondR} L ${fusionX - diamondR} ${y} Z`,
                fill: fusionFill,
                "fill-opacity": hasRect || hasCircle ? visual.fillOpacity * 0.75 : visual.fillOpacity,
                stroke: isPlaying ? "#f4de58" : fusionStroke,
                "stroke-width": isPlaying ? 2.4 : visual.strokeWidth,
                "stroke-opacity": visual.strokeOpacity,
                ...commonFusionAttrs,
              })
            );
          }
          if (!inPrintMode) {
            fusionLayer.appendChild(
              createSvgEl("circle", {
                cx: fusionX,
                cy: y,
                r: hitR + Math.max(5, state.pointSize * 1.2),
                fill: "rgba(0,0,0,0.001)",
                stroke: "rgba(0,0,0,0)",
                "stroke-width": 0,
                ...commonFusionAttrs,
              })
            );
          }
          return;
        }
        const commonFusionAttrs = {
          "data-play-key": playKey,
          "data-play-freq": node.centerFreq,
          "data-play-kind": "fusion",
          "data-play-scale": ampScale,
          "data-component-key": playKey,
          "data-hide-key": playKey,
          "data-playing": isPlaying ? "1" : "0",
          "data-tip": `Chord ${analysis.chordIndex + 1}\n${node.tip}`,
        };
        fusionLayer.appendChild(
          createSvgEl("circle", {
            cx: fusionX,
            cy: y,
            r: visual.radius,
            fill: fusionFill,
            "fill-opacity": visual.fillOpacity,
            stroke: isPlaying ? "#f4de58" : fusionStroke,
            "stroke-opacity": visual.strokeOpacity,
            "stroke-width": isPlaying ? 2.4 : visual.strokeWidth,
            ...commonFusionAttrs,
          })
        );
        if (!inPrintMode) {
          fusionLayer.appendChild(
            createSvgEl("circle", {
              cx: fusionX,
              cy: y,
              r: visual.radius + Math.max(5, state.pointSize * 1.2),
              fill: "rgba(0,0,0,0.001)",
              stroke: "rgba(0,0,0,0)",
              "stroke-width": 0,
              ...commonFusionAttrs,
            })
          );
        }
      });
    });

    diagramRoot.appendChild(fusionLayer);
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
        const bandKey = `roughband:${analysis.chordIndex}:${band.id}`;
        if (isPrintHidden(bandKey)) {
          return;
        }
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
        const roughBase = colorScheme?.roughness?.base || "#cf5f34";
        const roughMid = mixHex(roughBase, "#ffffff", state.themeDark ? 0.12 : 0.2);
        const roughFillColor = mixHex(roughMid, "#ffffff", (1 - band.strength) * 0.22);
        const roughStrokeColor = mixHex(roughBase, "#000000", 0.2 + band.strength * 0.35);
        const roughFill =
          printIsGreyscale
            ? `rgba(0,0,0,${clamp(0.08 + band.strength * 0.28, 0.08, 0.5)})`
            : roughFillColor;
        const roughStroke =
          printIsGreyscale
            ? "rgba(0,0,0,0.75)"
            : roughStrokeColor;
        const roughPlayPayload = encodeURIComponent(JSON.stringify(band.playItems || []));
        roughLayer.appendChild(
          createSvgEl("rect", {
            x: bandLeft,
            y: top,
            width: bandWidth,
            height: h,
            rx: 4,
            fill: roughFill,
            "fill-opacity": 0.12 + band.strength * 0.18,
            "data-tip": `Chord ${analysis.chordIndex + 1}\n${band.tip}`,
            "data-rough-animate": state.roughnessAnimate ? "1" : "0",
            "data-rough-rate": band.deltaHz,
            "data-rough-base-opacity": String(0.12 + band.strength * 0.18),
            "data-rough-play-items": roughPlayPayload,
            "data-hide-key": bandKey,
          })
        );
        roughLayer.appendChild(
          createSvgEl("line", {
            x1: bandLeft,
            y1: yForFreq(band.centerFreq),
            x2: bandLeft + bandWidth,
            y2: yForFreq(band.centerFreq),
            stroke: roughStroke,
            "stroke-width": 1.1,
            "stroke-opacity": 0.45 + band.strength * 0.35,
            "data-tip": `Chord ${analysis.chordIndex + 1}\n${band.tip}`,
            "data-rough-animate": state.roughnessAnimate ? "1" : "0",
            "data-rough-rate": band.deltaHz,
            "data-rough-base-opacity": String(0.45 + band.strength * 0.35),
            "data-rough-play-items": roughPlayPayload,
            "data-hide-key": bandKey,
          })
        );
      });
    });
    diagramRoot.appendChild(roughLayer);
  }

  const overtoneLayer = createSvgEl("g");
  const harmonicCount = Number(model.effectiveOvertoneCount) || state.overtoneCount;
  const fundamentalRadius = (state.pointSize + 1.2) * 1.75;
  const smallestRadius = clamp(
    state.pointSize * (1 - (harmonicCount - 1) / (harmonicCount * 1.8)),
    1.2,
    8
  );
  const maxOvertoneGain = harmonicScalingGain(1);
  const minOvertoneGain = harmonicScalingGain(harmonicCount);
  const overtoneGainSpan = Math.max(1e-6, maxOvertoneGain - minOvertoneGain);
  const overtoneFlatSizing = Math.abs(maxOvertoneGain - minOvertoneGain) < 1e-5;
  for (let noteIndex = 0; noteIndex < model.notes.length; noteIndex += 1) {
    const x = noteX[noteIndex];
    const baseFreq = model.notes[noteIndex].freq;
    const baseY = yForFreq(baseFreq);

    for (let harmonic = 1; harmonic <= harmonicCount; harmonic += 1) {
      const color = liveOvertoneColor(harmonic);
      const freq = baseFreq * harmonic;
      if (freq < model.rangeMin || freq > model.rangeMax) {
        continue;
      }
      const y = yForFreq(freq);
      if (state.showStems && harmonic > 1 && baseY >= plotTop && baseY <= plotBottom) {
        const stemColor =
          printIsGreyscale ? "rgba(0,0,0,0.55)" : color;
        stackStemLayer.appendChild(
          createSvgEl("line", {
            x1: x,
            y1: baseY,
            x2: x,
            y2: y,
            stroke: stemColor,
            "stroke-opacity": stemOpacity,
            "stroke-width": stemStrokeW,
          })
        );
      }

      const harmonicGain = harmonicScalingGain(harmonic);
      const alpha = alphaFalloff ? clamp(0.14 + 0.84 * harmonicGain, 0.14, 0.98) : 1;
      const gainNorm = overtoneFlatSizing
        ? 1
        : clamp((harmonicGain - minOvertoneGain) / overtoneGainSpan, 0, 1);
      const radius = smallestRadius + (fundamentalRadius - smallestRadius) * gainNorm;
      const playKey = `harmonic:${noteIndex}:${harmonic}`;
      if (isPrintHidden(playKey)) {
        continue;
      }
      const isPlaying = activeVoices.has(playKey);
      const isAlignmentMember = model.alignmentMemberPlayKeys.has(playKey);
      const printFill =
        printIsGreyscale
          ? alphaFalloff
            ? `rgba(0,0,0,${alpha})`
            : "#000000"
          : color;
      printComponentMeta[playKey] = {
        x,
        y,
        freq,
        playKey,
        kind: "harmonic",
        noteIndex,
        harmonic,
      };
      const circle = createSvgEl("circle", {
        cx: x,
        cy: y,
        r: radius,
        fill: printFill,
        "fill-opacity": alpha,
        stroke: isPlaying ? "#f4de58" : printIsGreyscale ? "#222" : color,
        "stroke-width": isPlaying ? 2.4 : 0.45,
        "data-play-key": playKey,
        "data-play-freq": freq,
        "data-play-kind": "harmonic",
        "data-play-note-index": noteIndex,
        "data-play-harmonic": harmonic,
        "data-component-key": playKey,
        "data-hide-key": playKey,
        "data-align-member": isAlignmentMember ? "1" : "0",
        "data-playing": isPlaying ? "1" : "0",
        "data-note-index": noteIndex,
        "data-harmonic": harmonic,
        "data-tip": `${harmonic}
${formatHz(freq)}`,
      });
      if (isAlignmentFocus && !isAlignmentMember) {
        circle.setAttribute("opacity", "0.4");
      }
      overtoneLayer.appendChild(circle);
      if (!inPrintMode) {
        overtoneLayer.appendChild(
          createSvgEl("circle", {
            cx: x,
            cy: y,
            r: radius + Math.max(4, state.pointSize * 1.2),
            fill: "rgba(0,0,0,0.001)",
            stroke: "rgba(0,0,0,0)",
            "stroke-width": 0,
            "data-play-key": playKey,
            "data-play-freq": freq,
            "data-play-kind": "harmonic",
            "data-play-note-index": noteIndex,
            "data-play-harmonic": harmonic,
            "data-component-key": playKey,
            "data-note-index": noteIndex,
            "data-harmonic": harmonic,
            "data-tip": `${harmonic}
${formatHz(freq)}`,
          })
        );
      }

      if (state.showOvertoneNumbers) {
        const hText = createSvgEl("text", {
          x: x - radius - 2,
          y: y - radius - 2,
          fill: textSecondary,
          "font-size": overtoneTextStyle ? overtoneTextStyle.size : 8.5,
          "font-family": overtoneTextStyle
            ? `${overtoneTextStyle.font}, IBM Plex Sans, Lexend, sans-serif`
            : "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "end",
          "data-auto-text-class": inPrintMode ? "overtone" : null,
        });
        hText.textContent = String(harmonic);
        overtoneLayer.appendChild(hText);
      }
    }
  }
  diagramRoot.appendChild(overtoneLayer);

  if (state.showCombination && model.visibleComboPoints.length) {
    const comboLayer = createSvgEl("g");
    model.visibleComboPoints.forEach((point) => {
      const comboDefaultX = (noteX[point.noteA] + noteX[point.noteB]) / 2 + comboOffset(point.type);
      const comboOverride = Number(state.printComponentXOverrides?.[point.playKey]);
      const resolvedX = Number(comboXByPlayKey.get(point.playKey));
      let xMid = Number.isFinite(resolvedX) ? resolvedX : comboDefaultX;
      if (Number.isFinite(comboOverride)) {
        xMid = clamp(comboOverride, comboDragMinX, comboDragMaxX);
      }
      const y = yForFreq(point.freq);
      let color = comboDiffColor;
      if (point.type === "sum") color = comboSumColor;
      if (point.type === "order2a" || point.type === "order2b") color = comboOrder2RectColor;

      const r = state.comboSize + 1.2;
      const playKey = point.playKey;
      if (isPrintHidden(playKey)) {
        return;
      }
      const sourceSpecs =
        point.type === "order2a"
          ? [
              { noteIndex: point.noteA, harmonic: 2 },
              { noteIndex: point.noteB, harmonic: 1 },
            ]
          : point.type === "order2b"
            ? [
                { noteIndex: point.noteB, harmonic: 2 },
                { noteIndex: point.noteA, harmonic: 1 },
              ]
            : [
                { noteIndex: point.noteA, harmonic: 1 },
                { noteIndex: point.noteB, harmonic: 1 },
              ];
      const parentKeys = sourceSpecs.map(
        (spec) => `harmonic:${spec.noteIndex}:${spec.harmonic}`
      );
      const isPlaying = activeVoices.has(playKey);
      const isAlignmentMember = model.alignmentMemberPlayKeys.has(playKey);
      const comboFill =
        printIsGreyscale ? "rgba(0,0,0,0.84)" : color;
      const isSecondOrderCombo = point.type === "order2a" || point.type === "order2b";
      const comboFillOpacity = isSecondOrderCombo ? (0.88 * (2 / 3)) : 0.88;
      printComponentMeta[playKey] = {
        x: xMid,
        y,
        freq: point.freq,
        playKey,
        kind: "combo",
        comboType: point.type,
        parentKeys,
        noteIndexes: [point.noteA, point.noteB],
        chordIndex: point.chordIndex,
      };
      const commonAttrs = {
        fill: comboFill,
        "fill-opacity": comboFillOpacity,
        stroke: isPlaying ? "#f4de58" : printIsGreyscale ? "#222" : color,
        "stroke-width": isPlaying ? 2.4 : 0.8,
        "data-play-key": playKey,
        "data-play-freq": point.freq,
        "data-play-kind": "combo",
        "data-component-key": playKey,
        "data-hide-key": playKey,
        "data-align-member": isAlignmentMember ? "1" : "0",
        "data-playing": isPlaying ? "1" : "0",
        "data-combo-source-a": point.noteA,
        "data-combo-source-b": point.noteB,
        "data-combo-type": point.type,
        "data-combo-drag-min": comboDragMinX,
        "data-combo-drag-max": comboDragMaxX,
        "data-tip": describeComboTone(point, model.notes),
        style: inPrintMode ? "cursor:ew-resize" : null,
      };
      const shapeNode =
        point.type === "sum"
          ? createSvgEl("path", {
              ...commonAttrs,
              d: `M ${xMid} ${y - r} L ${xMid + r} ${y} L ${xMid} ${y + r} L ${xMid - r} ${y} Z`,
            })
          : createSvgEl("rect", {
              ...commonAttrs,
              x: xMid - r * 1.35,
              y: y - r * 0.5,
              width: r * 2.7,
              height: r,
              rx: Math.max(0.6, r * 0.2),
            });
      if (isAlignmentFocus && !isAlignmentMember) {
        shapeNode.setAttribute("opacity", "0.4");
      }
      comboLayer.appendChild(shapeNode);
      if (!inPrintMode) {
        const hitAttrs = {
          "data-play-key": playKey,
          "data-play-freq": point.freq,
          "data-play-kind": "combo",
          "data-component-key": playKey,
          "data-combo-source-a": point.noteA,
          "data-combo-source-b": point.noteB,
          "data-combo-type": point.type,
          "data-combo-drag-min": comboDragMinX,
          "data-combo-drag-max": comboDragMaxX,
          "data-tip": describeComboTone(point, model.notes),
        };
        comboLayer.appendChild(
          createSvgEl("circle", {
            cx: xMid,
            cy: y,
            r: r + Math.max(5, state.comboSize * 1.25),
            fill: "rgba(0,0,0,0.001)",
            stroke: "rgba(0,0,0,0)",
            "stroke-width": 0,
            ...hitAttrs,
          })
        );
      }
    });
    diagramRoot.appendChild(comboLayer);
  }

  if (inPrintMode) {
    const printLayer = createSvgEl("g");
    const autoRelaxLabels = [];
    const alignedPlayKeys = model.alignmentMemberPlayKeys || new Set();
    const componentLabelFont = componentTextStyle
      ? `${componentTextStyle.font}, IBM Plex Sans, Lexend, sans-serif`
      : "IBM Plex Sans, Lexend, sans-serif";
    const componentLabelSize = componentTextStyle ? componentTextStyle.size : 9.5;
    const buildComboExprText = (comboMeta, parentA, parentB) => {
      const p1 = parentA?.freq || 0;
      const p2 = parentB?.freq || 0;
      const p1Text = formatHzValue(p1);
      const p2Text = formatHzValue(p2);
      const comboText = formatHzValue(comboMeta?.freq || 0);
      if (comboMeta?.comboType === "sum") {
        return `${p1Text} + ${p2Text} = ${comboText} Hz`;
      }
      if (comboMeta?.comboType === "order2a" || comboMeta?.comboType === "order2b") {
        return `(${p1Text}) - (${p2Text}) = ${comboText} Hz`;
      }
      return `|${p1Text} - ${p2Text}| = ${comboText} Hz`;
    };
    const isRatioSourceNoteIndex = (noteIndex) => {
      return model.notes?.[noteIndex]?.type === "ratio";
    };
    const parseSourceNoteIndexesFromPlayKey = (playKey) => {
      const key = String(playKey || "");
      const harmonicMatch = key.match(/^harmonic:(\d+):\d+$/);
      if (harmonicMatch) {
        return [Number(harmonicMatch[1])];
      }
      const comboMatch = key.match(/^combo:(\d+):(\d+):/);
      if (comboMatch) {
        return [Number(comboMatch[1]), Number(comboMatch[2])];
      }
      return [];
    };
    const collectSourceNoteIndexesFromMeta = (meta, visited = new Set()) => {
      if (!meta || typeof meta !== "object") {
        return [];
      }
      const playKey = String(meta.playKey || "");
      if (playKey && visited.has(playKey)) {
        return [];
      }
      if (playKey) {
        visited.add(playKey);
      }
      if (Number.isInteger(meta.noteIndex) && meta.noteIndex >= 0) {
        return [meta.noteIndex];
      }
      const fromMetaNotes = Array.isArray(meta.noteIndexes)
        ? meta.noteIndexes.filter((idx) => Number.isInteger(idx) && idx >= 0)
        : [];
      if (fromMetaNotes.length) {
        return Array.from(new Set(fromMetaNotes));
      }
      const parentIndexes = [];
      (meta.parentKeys || []).forEach((parentKey) => {
        const parentMeta = printComponentMeta[parentKey];
        if (parentMeta) {
          parentIndexes.push(...collectSourceNoteIndexesFromMeta(parentMeta, visited));
        } else {
          parentIndexes.push(...parseSourceNoteIndexesFromPlayKey(parentKey));
        }
      });
      if (parentIndexes.length) {
        return Array.from(new Set(parentIndexes));
      }
      return Array.from(new Set(parseSourceNoteIndexesFromPlayKey(playKey)));
    };
    const collectSourceNoteIndexesFromBand = (band) => {
      const indexes = [];
      (band?.members || []).forEach((memberKey) => {
        const memberMeta = printComponentMeta[memberKey];
        if (memberMeta) {
          indexes.push(...collectSourceNoteIndexesFromMeta(memberMeta));
        } else {
          indexes.push(...parseSourceNoteIndexesFromPlayKey(memberKey));
        }
      });
      return Array.from(new Set(indexes.filter((idx) => Number.isInteger(idx) && idx >= 0)));
    };
    const hasOnlyRatioSourceNotes = (noteIndexes) => {
      return Array.isArray(noteIndexes) && noteIndexes.length > 0 && noteIndexes.every(isRatioSourceNoteIndex);
    };
    const buildComponentLabelLines = (freq, options = {}) => {
      const lines = [];
      if (state.printShowComponentNote) {
        const noteInfo = buildNoteSpellingInfo(freq, { allowHeji: options.allowHeji !== false });
        if (noteInfo && noteInfo.text) {
          lines.push({
            kind: "note",
            pitchClassText: noteInfo.pitchClassText,
            pitchPrefixText: noteInfo.pitchPrefixText,
            baseText: noteInfo.baseText,
            suffixText: noteInfo.suffixText,
            hejiParts: noteInfo.hejiParts,
            octaveText: noteInfo.octaveText,
            text: noteInfo.text,
          });
        }
      }
      if (state.printShowComponentRatio) {
        const ratio = formatRatioApprox(freq / Math.max(1e-9, state.ratioRootHz));
        if (ratio) {
          lines.push({ kind: "plain", text: ratio });
        }
      }
      if (state.printShowComponentHz) {
        const hzText = formatHz(freq);
        if (hzText) {
          lines.push({ kind: "plain", text: hzText });
        }
      }
      return lines;
    };
    const appendComponentLineSpan = (textEl, labelX, line, index) => {
      const prefixSpan = createSvgEl("tspan", {
        x: labelX,
        dy: index === 0 ? 0 : 10,
      });
      if (!line || typeof line !== "object" || line.kind !== "note") {
        prefixSpan.textContent = String(line?.text || "");
        textEl.appendChild(prefixSpan);
        return;
      }
      prefixSpan.textContent = String(line.pitchPrefixText || line.pitchClassText || line.baseText || "");
      textEl.appendChild(prefixSpan);
      const parts = Array.isArray(line.hejiParts) ? line.hejiParts : [];
      parts.forEach((part, partIndex) => {
        const glyphText = String(part?.glyphText || "");
        const expText = String(part?.expText || "");
        if (glyphText) {
          const suffixSpan = createSvgEl("tspan", {
            "font-family": "HEJI2Text, IBM Plex Sans, Lexend, sans-serif",
            dx: partIndex === 0 ? "0.18em" : "0.06em",
            "baseline-shift": "0.5em",
          });
          suffixSpan.textContent = glyphText;
          textEl.appendChild(suffixSpan);
        }
        if (expText) {
          const expSpan = createSvgEl("tspan", {
            "font-family": "IBM Plex Sans, Lexend, sans-serif",
            dx: "0.04em",
          });
          expSpan.textContent = expText;
          textEl.appendChild(expSpan);
        }
      });
      const octaveSpan = createSvgEl("tspan");
      if (parts.length) {
        octaveSpan.setAttribute("dx", "0.16em");
      }
      octaveSpan.textContent = String(line.octaveText || "");
      textEl.appendChild(octaveSpan);
    };
    const defaultLabelPos = (meta) => {
      if (meta.kind === "harmonic") {
        const laneX = (noteXByIndex[meta.noteIndex] || meta.x) + 10;
        return { dx: laneX - meta.x, dy: -7 };
      }
      if (meta.kind === "combo") {
        return { dx: 10, dy: -10 };
      }
      return { dx: 9, dy: -7 };
    };
    Object.values(printComponentMeta).forEach((meta) => {
      if (!state.printShowComponentLabel) {
        return;
      }
      if (meta.kind === "fusion") {
        return;
      }
      if (state.showAlignments && alignedPlayKeys.has(meta.playKey)) {
        return;
      }
      const metaSourceNoteIndexes = collectSourceNoteIndexesFromMeta(meta);
      const allowHeji = hasOnlyRatioSourceNotes(metaSourceNoteIndexes);
      let labelLines = buildComponentLabelLines(meta.freq, { allowHeji });
      if (meta.kind === "combo" && state.printComboLinksVisible?.[meta.playKey]) {
        const parents = (meta.parentKeys || [])
          .map((parentKey) => printComponentMeta[parentKey])
          .filter(Boolean);
        if (parents.length >= 2) {
          labelLines = [{ kind: "plain", text: buildComboExprText(meta, parents[0], parents[1]) }];
        }
      }
      if (!labelLines.length) {
        return;
      }
      const labelId = `component:${meta.playKey}`;
      if (isPrintHidden(`label:${labelId}`)) {
        return;
      }
      const offset = state.printLabelOffsets?.[labelId] || {};
      const defaults = defaultLabelPos(meta);
      const labelAnchorY = meta.y;
      const labelX = meta.x + (Number.isFinite(offset.dx) ? offset.dx : defaults.dx);
      const labelY = labelAnchorY + (Number.isFinite(offset.dy) ? offset.dy : defaults.dy);
      const isManual = Number.isFinite(offset.dx) || Number.isFinite(offset.dy);
      const text = createSvgEl("text", {
        x: labelX,
        y: labelY,
        fill: "#111",
        "font-size": componentLabelSize,
        "font-family": componentLabelFont,
        "text-anchor": "start",
        "data-print-label-id": labelId,
        "data-print-default-dx": String(defaults.dx),
        "data-print-default-dy": String(defaults.dy),
        "data-hide-key": `label:${labelId}`,
        "data-label-parent-key": meta.playKey,
        "data-auto-text-class": "component",
        style: "cursor:move",
      });
      labelLines.forEach((line, index) => appendComponentLineSpan(text, labelX, line, index));
      printLayer.appendChild(text);
      const componentCandidates = [
        { dx: 10, dy: -8, anchor: "start" }, // top-right
        { dx: -10, dy: -8, anchor: "end" }, // top-left
        { dx: 10, dy: 14, anchor: "start" }, // bottom-right
        { dx: -10, dy: 14, anchor: "end" }, // bottom-left
      ];
      autoRelaxLabels.push({
        el: text,
        baseX: meta.x,
        baseY: meta.y,
        defaultAnchor: "start",
        candidates: componentCandidates,
        manual: isManual,
      });
    });
    if (state.printShowComponentLabel && state.showAlignments) {
      alignmentBandLabelData.forEach((band) => {
        const bandSourceNoteIndexes = collectSourceNoteIndexesFromBand(band);
        const allowHeji = hasOnlyRatioSourceNotes(bandSourceNoteIndexes);
        const labelLines = buildComponentLabelLines(band.freq, { allowHeji });
        if (!labelLines.length) {
          return;
        }
        const defaultLabelText = labelLines
          .map((line) => String(line?.text || "").trim())
          .filter(Boolean)
          .join(" ");
        const overriddenLabelText = String(
          state.printAlignmentLabelOverrides?.[band.id] || ""
        ).trim();
        const hasOverride = Boolean(overriddenLabelText);
        const labelId = `alignment:${band.id}`;
        if (isPrintHidden(`label:${labelId}`)) {
          return;
        }
        const offset = state.printLabelOffsets?.[labelId] || {};
        const defaultDx = 2;
        const defaultDy = 0;
        const labelX = band.labelX + (Number.isFinite(offset.dx) ? offset.dx : defaultDx);
        const lineHeight = 10;
        const lineCount = hasOverride ? 1 : Math.max(1, labelLines.length);
        const blockHeight = (lineCount - 1) * lineHeight;
        const baselineCenterOffset = componentLabelSize * 0.33;
        const centeredLabelY =
          band.y - blockHeight / 2 + baselineCenterOffset;
        const labelY = centeredLabelY + (Number.isFinite(offset.dy) ? offset.dy : defaultDy);
        const isManual = Number.isFinite(offset.dx) || Number.isFinite(offset.dy);
        const text = createSvgEl("text", {
          x: labelX,
          y: labelY,
          fill: "#111",
          "font-size": componentLabelSize,
          "font-family": componentLabelFont,
          "text-anchor": "start",
          "dominant-baseline": "middle",
          "data-print-label-id": labelId,
          "data-print-default-dx": String(defaultDx),
          "data-print-default-dy": String(defaultDy),
          "data-label-default-text": defaultLabelText,
          "data-hide-key": `label:${labelId}`,
          "data-label-parent-align-id": band.id,
          "data-auto-text-class": "component",
          style: "cursor:ew-resize",
        });
        if (hasOverride) {
          text.textContent = overriddenLabelText;
        } else {
          labelLines.forEach((line, index) => appendComponentLineSpan(text, labelX, line, index));
        }
        printLayer.appendChild(text);
        autoRelaxLabels.push({
          el: text,
          baseX: band.labelX,
          baseY: centeredLabelY,
          defaultAnchor: "start",
          candidates: [
            { dx: 2, dy: 0, anchor: "start" },
            { dx: 2, dy: -12, anchor: "start" },
            { dx: 2, dy: 12, anchor: "start" },
          ],
          manual: isManual,
        });
      });
    }

    (state.printCustomLabels || []).forEach((item) => {
      if (!item || typeof item !== "object" || !item.id) {
        return;
      }
      const parentKey = String(item.parentKey || "");
      const parentMeta = printComponentMeta[parentKey];
      if (!parentMeta) {
        return;
      }
      const textValue = String(item.text || "");
      if (!textValue.trim()) {
        return;
      }
      const labelId = `customlabel:${item.id}`;
      const offset = state.printLabelOffsets?.[labelId] || {};
      const defaultDx = 10;
      const defaultDy = -24;
      const labelX = parentMeta.x + (Number.isFinite(offset.dx) ? offset.dx : defaultDx);
      const labelY = parentMeta.y + (Number.isFinite(offset.dy) ? offset.dy : defaultDy);
      const text = createSvgEl("text", {
        x: labelX,
        y: labelY,
        fill: "#111",
        "font-size": componentLabelSize,
        "font-family": componentLabelFont,
        "text-anchor": "start",
        "data-print-label-id": labelId,
        "data-custom-label-id": item.id,
        "data-print-default-dx": String(defaultDx),
        "data-print-default-dy": String(defaultDy),
        "data-label-parent-key": parentKey,
        "data-auto-text-class": "component",
        style: "cursor:move",
      });
      textValue.split(/\r?\n/).forEach((line, index) => {
        const span = createSvgEl("tspan", {
          x: labelX,
          dy: index === 0 ? 0 : 10,
        });
        span.textContent = line;
        text.appendChild(span);
      });
      printLayer.appendChild(text);
      autoRelaxLabels.push({
        el: text,
        baseX: parentMeta.x,
        baseY: parentMeta.y,
        defaultAnchor: "start",
        candidates: [
          { dx: 10, dy: -24, anchor: "start" },
          { dx: -10, dy: -24, anchor: "end" },
          { dx: 10, dy: 16, anchor: "start" },
          { dx: -10, dy: 16, anchor: "end" },
        ],
        manual: Number.isFinite(offset.dx) || Number.isFinite(offset.dy),
      });
    });

    Object.entries(printComponentMeta).forEach(([key, meta]) => {
      if (meta.kind !== "combo" || !state.printComboLinksVisible?.[key]) {
        return;
      }
      if (isPrintHidden(`comboparent:${key}`)) {
        return;
      }
      const parents = (meta.parentKeys || [])
        .map((parentKey) => printComponentMeta[parentKey])
        .filter(Boolean);
      if (!parents.length) {
        return;
      }
      parents.forEach((parent) => {
        printLayer.appendChild(
          createSvgEl("line", {
            x1: meta.x,
            y1: meta.y,
            x2: parent.x,
            y2: parent.y,
            stroke: "rgba(0,0,0,0.55)",
            "stroke-width": 1,
            "stroke-dasharray": "4 3",
            "data-hide-key": `comboparent:${key}`,
          })
        );
      });
    });

    (state.printDistanceAnnotations || []).forEach((annotation) => {
      const a = printComponentMeta[annotation.aKey];
      const b = printComponentMeta[annotation.bKey];
      if (!a || !b) {
        return;
      }
      const distanceHideKey = `distance:${annotation.id}`;
      if (isPrintHidden(distanceHideKey)) {
        return;
      }
      printLayer.appendChild(
        createSvgEl("line", {
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          stroke: "rgba(0,0,0,0.72)",
          "stroke-width": 1,
          "data-hide-key": distanceHideKey,
        })
      );
      const ratioValue = Math.max(a.freq, b.freq) / Math.max(1e-9, Math.min(a.freq, b.freq));
      const parts = [];
      if (state.printDistanceShowRatio) {
        const ratioLabel = formatRatioApprox(ratioValue);
        if (ratioLabel) {
          parts.push(ratioLabel);
        }
      }
      if (state.printDistanceShowHz) {
        parts.push(`Δ ${formatHz(Math.abs(a.freq - b.freq))}`);
      }
      if (state.printDistanceShowInterval) {
        const intervalLabel = nearestIntervalNameForRatio(ratioValue);
        if (intervalLabel) {
          parts.push(intervalLabel);
        }
      }
      if (!parts.length) {
        return;
      }
      const labelId = `distance:${annotation.id}`;
      const offset = state.printLabelOffsets?.[labelId] || {};
      const baseX = (a.x + b.x) / 2 + (Number.isFinite(offset.dx) ? offset.dx : 9);
      const baseY = (a.y + b.y) / 2 + (Number.isFinite(offset.dy) ? offset.dy : -8);
      const label = createSvgEl("text", {
        x: baseX,
        y: baseY,
        fill: "#111",
        "font-size": 9.5,
        "font-family": "IBM Plex Sans, Lexend, sans-serif",
        "text-anchor": "start",
        "data-print-label-id": labelId,
        "data-print-default-dx": "9",
        "data-print-default-dy": "-8",
        "data-hide-key": distanceHideKey,
        "data-label-parent-a-key": annotation.aKey,
        "data-label-parent-b-key": annotation.bKey,
        style: "cursor:move",
      });
      parts.forEach((line, index) => {
        const span = createSvgEl("tspan", {
          x: baseX,
          dy: index === 0 ? 0 : 10,
        });
        span.textContent = line;
        label.appendChild(span);
      });
      printLayer.appendChild(label);
      autoRelaxLabels.push({
        el: label,
        baseX,
        baseY,
        manual: Number.isFinite(offset.dx) || Number.isFinite(offset.dy),
      });
    });

    (state.printCustomTexts || []).forEach((item) => {
      if (!item || typeof item !== "object" || !item.id) {
        return;
      }
      const x = Number(item.x);
      const y = Number(item.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return;
      }
      const textValue = String(item.text || "");
      if (!textValue.trim()) {
        return;
      }
      const fontFamily = String(item.font || "Noto Serif");
      const fontSize = clamp(Number(item.size) || 18, 8, 72);
      const hideKey = `customtext:${item.id}`;
      if (isPrintHidden(hideKey)) {
        return;
      }
      const textEl = createSvgEl("text", {
        x,
        y,
        fill: "#111",
        "font-size": fontSize,
        "font-family": `${fontFamily}, Lexend, sans-serif`,
        "text-anchor": "start",
        "dominant-baseline": "hanging",
        "data-custom-text-id": item.id,
        "data-custom-text-selected": state.printSelectedCustomTextId === item.id ? "1" : "0",
        "data-hide-key": hideKey,
        style: "cursor:move",
      });
      const lines = textValue.split(/\r?\n/);
      lines.forEach((line, index) => {
        const span = createSvgEl("tspan", {
          x,
          dy: index === 0 ? 0 : Math.max(10, fontSize * 1.2),
        });
        span.textContent = line;
        textEl.appendChild(span);
      });
      printLayer.appendChild(textEl);
      if (state.printSelectedCustomTextId === item.id) {
        const box = textEl.getBBox();
        printLayer.insertBefore(
          createSvgEl("rect", {
            x: box.x - 4,
            y: box.y - 3,
            width: box.width + 8,
            height: box.height + 6,
            fill: "none",
            stroke: "rgba(0,0,0,0.45)",
            "stroke-width": 0.9,
            "stroke-dasharray": "3 2",
            "pointer-events": "none",
          }),
          textEl
        );
      }
    });

    if (state.printDistanceMode && printDistancePendingKey && printComponentMeta[printDistancePendingKey]) {
      const pending = printComponentMeta[printDistancePendingKey];
      printLayer.appendChild(
        createSvgEl("circle", {
          cx: pending.x,
          cy: pending.y,
          r: 8,
          fill: "none",
          stroke: "rgba(0,0,0,0.72)",
          "stroke-width": 1.2,
          "stroke-dasharray": "2 2",
          "pointer-events": "none",
        })
      );
    }

    if (state.printShowLegend && state.showCombination && hasAnyVisibleComboTypes()) {
      const legendX = plotLeft - 96;
      const legendY = plotTop + 18;
      const legendLabelId = "legend:combo-diff";
      const legendOffset = state.printLabelOffsets?.[legendLabelId] || {};
      const legendDx = Number.isFinite(legendOffset.dx) ? legendOffset.dx : 0;
      const legendDy = Number.isFinite(legendOffset.dy) ? legendOffset.dy : 0;
      const legend = createSvgEl("g", {
        transform: `translate(${legendDx}, ${legendDy})`,
        "data-print-label-id": legendLabelId,
        "data-print-default-dx": "0",
        "data-print-default-dy": "0",
        style: "cursor:move",
      });
      legend.appendChild(
        createSvgEl("path", {
          d: `M ${legendX} ${legendY} L ${legendX + 5} ${legendY + 5} L ${legendX} ${legendY + 10} L ${legendX - 5} ${legendY + 5} Z`,
          fill: "rgba(0,0,0,0.8)",
        })
      );
      const comboLegend = createSvgEl("text", {
        x: legendX + 11,
        y: legendY + 8,
        fill: "#111",
        "font-size": 9.5,
        "font-family": "IBM Plex Sans, Lexend, sans-serif",
        "text-anchor": "start",
      });
      comboLegend.textContent = "Summation";
      legend.appendChild(comboLegend);
      legend.appendChild(
        createSvgEl("rect", {
          x: legendX - 6,
          y: legendY + 20,
          width: 12,
          height: 6,
          rx: 1.4,
          fill: "rgba(0,0,0,0.8)",
        })
      );
      const diffLegend = createSvgEl("text", {
        x: legendX + 11,
        y: legendY + 27,
        fill: "#111",
        "font-size": 9.5,
        "font-family": "IBM Plex Sans, Lexend, sans-serif",
        "text-anchor": "start",
      });
      diffLegend.textContent = "Difference";
      legend.appendChild(diffLegend);
      printLayer.appendChild(legend);
      const legendContentBox = legend.getBBox();
      const legendPad = 8;
      legend.insertBefore(
        createSvgEl("rect", {
          x: legendContentBox.x - legendPad,
          y: legendContentBox.y - legendPad,
          width: legendContentBox.width + legendPad * 2,
          height: legendContentBox.height + legendPad * 2,
          rx: 4,
          fill: "rgba(255,255,255,0.86)",
          stroke: "rgba(0,0,0,0.25)",
          "stroke-width": 0.8,
        }),
        legend.firstChild
      );
    }

    diagramRoot.appendChild(printLayer);
    const printHazards = collectPrintLabelHazards(diagramRoot);
    nudgePrintLabelsToReduceCollisions(autoRelaxLabels, plotTop + 4, plotBottom - 6, printHazards);
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
    diagramRoot.appendChild(emptyTitle);

    const emptyHint = createSvgEl("text", {
      x: plotLeft + plotWidth / 2,
      y: plotTop + plotHeight / 2 + 14,
      fill: textSecondary,
      "font-size": 12,
      "font-family": "Lexend, sans-serif",
      "text-anchor": "middle",
    });
    emptyHint.textContent = "Formats: 69  |  440hz  |  3/2  |  7:4";
    diagramRoot.appendChild(emptyHint);
  }
  if (stackStemLayer.childNodes.length) {
    diagramRoot.insertBefore(stackStemLayer, diagramRoot.firstChild || null);
  }
  svg.appendChild(diagramRoot);
  const exportFallbackRect = {
    x: Math.max(0, Math.min(plotLeft, yLabelX - 22)),
    y: Math.max(0, plotTop - 16),
    width: Math.max(1, Math.min(width, Math.max(plotRight, xAxisRightWithGap + 24)) - Math.max(0, Math.min(plotLeft, yLabelX - 22))),
    height: (() => {
      const exportBaseBottom = drawHzLineForNotes ? plotBottom + 38 : plotBottom + 30;
      const exportChordBottom = showChordControls && chordsForLayout.length
        ? plotBottom + (inPrintMode ? 74 : 96)
        : exportBaseBottom;
      const bottom = Math.min(height, exportChordBottom);
      return Math.max(1, bottom - Math.max(0, plotTop - 16));
    })(),
  };
  let exportRect = exportFallbackRect;
  if (typeof diagramRoot.getBBox === "function") {
    try {
      const box = diagramRoot.getBBox();
      if (Number.isFinite(box.x) && Number.isFinite(box.y) && box.width > 0 && box.height > 0) {
        const pad = 16;
        exportRect = unionRects(exportRect, {
          x: box.x - pad,
          y: box.y - pad,
          width: box.width + pad * 2,
          height: box.height + pad * 2,
        });
      }
    } catch {}
  }
  const exportContentLeft = clamp(exportRect.x, 0, width);
  const exportContentTop = clamp(exportRect.y, 0, height);
  const exportContentRight = clamp(exportRect.x + exportRect.width, 0, width);
  const exportContentBottom = clamp(exportRect.y + exportRect.height, 0, height);
  const exportContentWidth = Math.max(1, exportContentRight - exportContentLeft);
  const exportContentHeight = Math.max(1, exportContentBottom - exportContentTop);
  svg.setAttribute("data-export-content-x", String(exportContentLeft));
  svg.setAttribute("data-export-content-y", String(exportContentTop));
  svg.setAttribute("data-export-content-width", String(exportContentWidth));
  svg.setAttribute("data-export-content-height", String(exportContentHeight));

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
  if (inPrintMode && printLabelDragFocus?.labelId) {
    const all = svg.querySelectorAll("line,path,circle,text,rect,polyline,polygon,ellipse");
    all.forEach((element) => {
      element.setAttribute("opacity", "0.22");
    });
    svg.querySelectorAll(`[data-print-label-id="${printLabelDragFocus.labelId}"]`).forEach((el) => {
      el.setAttribute("opacity", "1");
    });
    (printLabelDragFocus.parentKeys || []).forEach((key) => {
      svg.querySelectorAll(`[data-component-key="${key}"]`).forEach((el) => {
        el.setAttribute("opacity", "1");
      });
    });
    if (printLabelDragFocus.alignId) {
      svg.querySelectorAll(`[data-align-id="${printLabelDragFocus.alignId}"]`).forEach((el) => {
        el.setAttribute("opacity", "1");
      });
    }
  }

  return svg;
}

function attachTooltip(svg) {
  const printMode = isPrintMode();
  let dimmedElements = [];
  let highlightedComboTarget = null;
  let highlightedLinkLines = [];
  let printTextEditPending = false;
  const applyCanvasPan = () => {
    if (printMode) {
      svg.style.transform = "";
      svg.style.transformOrigin = "";
      svg.style.willChange = "";
      svg.style.cursor = panDragState ? "grabbing" : "";
      svg.style.userSelect = panDragState ? "none" : "";
      svg.style.webkitUserSelect = panDragState ? "none" : "";
      svg.style.touchAction = "none";
      return;
    }
    const zoom = clamp(Number(state.viewZoom) || 1, 0.3, 3);
    svg.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${zoom})`;
    svg.style.transformOrigin = "0 0";
    svg.style.willChange = "transform";
    svg.style.cursor = panDragState ? "grabbing" : "grab";
    svg.style.userSelect = panDragState ? "none" : "";
    svg.style.webkitUserSelect = panDragState ? "none" : "";
    svg.style.touchAction = "none";
  };
  const applyPrintDiagramOffsetPreview = (offsetX, offsetY) => {
    if (!printMode) {
      return;
    }
    const root = svg.querySelector("[data-diagram-root='1']");
    if (!(root instanceof SVGElement)) {
      return;
    }
    const baseShiftX = Number(root.getAttribute("data-scene-base-shift-x"));
    const baseShiftY = Number(root.getAttribute("data-scene-base-shift-y"));
    const scale = Number(root.getAttribute("data-scene-scale"));
    if (!Number.isFinite(baseShiftX) || !Number.isFinite(baseShiftY) || !Number.isFinite(scale)) {
      return;
    }
    const tx = baseShiftX + (Number(offsetX) || 0);
    const ty = baseShiftY + (Number(offsetY) || 0);
    root.setAttribute("transform", `translate(${tx}, ${ty}) scale(${scale})`);
  };
  const clearDragSelectionBlock = () => {
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    svg.style.userSelect = "";
    svg.style.webkitUserSelect = "";
  };
  const beginPrintDrag = (nextState, event) => {
    printDragState = nextState;
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    svg.style.userSelect = "none";
    svg.style.webkitUserSelect = "none";
    if (event?.target && typeof event.target.setPointerCapture === "function") {
      try {
        event.target.setPointerCapture(event.pointerId);
      } catch {}
    }
  };
  const endPrintDrag = (event, { cancelled = false } = {}) => {
    if (!printDragState) {
      clearDragSelectionBlock();
      return false;
    }
    if (event && printDragState.pointerId !== event.pointerId) {
      return false;
    }
    if (event?.target && typeof event.target.releasePointerCapture === "function") {
      try {
        if (event.target.hasPointerCapture?.(event.pointerId)) {
          event.target.releasePointerCapture(event.pointerId);
        }
      } catch {}
    }
    const finishedState = printDragState;
    printDragState = null;
    if (finishedState.kind === "label") {
      printLabelDragFocus = null;
    }
    clearDragSelectionBlock();
    if (!cancelled && printMode && finishedState.kind === "combo-x" && !finishedState.moved) {
      const comboKey = finishedState.id;
      const next = { ...(state.printComboLinksVisible || {}) };
      next[comboKey] = !next[comboKey];
      state.printComboLinksVisible = next;
    } else if (!cancelled && !printMode && finishedState.kind === "combo-x" && !finishedState.moved) {
      const key = finishedState.id;
      const freq = Number(finishedState.freq);
      if (key && freq > 0) {
        const targetMeta = { kind: "combo", freq };
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
      }
    }
    scheduleRender();
    scheduleStateUrlUpdate();
    return true;
  };
  const isPanEligibleTarget = (target) => {
    if (!(target instanceof Element)) {
      return false;
    }
    return !target.closest(
      "[data-play-key],[data-print-label-id],[data-custom-text-id],[data-column-id],[data-component-key],[data-rough-play-items],[data-align-band='1'],[data-chord-action],[data-print-chord-title-index]"
    );
  };
  const clientToDiagramPoint = (clientX, clientY) => {
    const root = svg.querySelector("[data-diagram-root='1']");
    if (!(root instanceof SVGGraphicsElement)) {
      return null;
    }
    const ctm = root.getScreenCTM();
    if (!ctm || typeof svg.createSVGPoint !== "function") {
      return null;
    }
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const local = point.matrixTransform(ctm.inverse());
    return {
      x: local.x,
      y: local.y,
    };
  };
  const beginCanvasPan = (event) => {
    const startPanX = printMode ? (Number(state.printDiagramOffsetX) || 0) : canvasPanX;
    const startPanY = printMode ? (Number(state.printDiagramOffsetY) || 0) : canvasPanY;
    panDragState = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPanX,
      startPanY,
      moved: false,
    };
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    svg.style.userSelect = "none";
    svg.style.webkitUserSelect = "none";
    if (event?.target && typeof event.target.setPointerCapture === "function") {
      try {
        event.target.setPointerCapture(event.pointerId);
      } catch {}
    }
    applyCanvasPan();
  };
  const endCanvasPan = (event) => {
    if (!panDragState) {
      return false;
    }
    if (event && panDragState.pointerId !== event.pointerId) {
      return false;
    }
    if (event?.target && typeof event.target.releasePointerCapture === "function") {
      try {
        if (event.target.hasPointerCapture?.(event.pointerId)) {
          event.target.releasePointerCapture(event.pointerId);
        }
      } catch {}
    }
    const finished = panDragState;
    panDragState = null;
    clearDragSelectionBlock();
    applyCanvasPan();
    if (printMode && finished?.moved) {
      scheduleRender(0);
      scheduleStateUrlUpdate();
    }
    return true;
  };
  applyCanvasPan();
  if (printMode) {
    tooltipEl.hidden = true;
  }

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

  const openChordTitleEditor = (chordIndex) => {
    if (!Number.isInteger(chordIndex) || chordIndex < 0 || printTextEditPending) {
      return;
    }
    printTextEditPending = true;
    const defaultChordTitle = `Chord ${chordIndex + 1}`;
    const overrides = { ...(state.printChordTitleOverrides || {}) };
    const hasOverride = Object.prototype.hasOwnProperty.call(overrides, chordIndex);
    const currentTitle = hasOverride ? String(overrides[chordIndex] ?? "") : defaultChordTitle;
    openCustomTextDialog(currentTitle, {
      title: `Edit ${defaultChordTitle}`,
      saveText: "Save",
    }).then((result) => {
      if (!result) {
        return;
      }
      const next = String(result.text || "");
      overrides[chordIndex] = next;
      state.printChordTitleOverrides = overrides;
      scheduleRender();
      scheduleStateUrlUpdate();
    }).finally(() => {
      printTextEditPending = false;
    });
  };
  const openYAxisLabelEditor = (labelEl) => {
    if (printTextEditPending) {
      return;
    }
    const defaultText = String(labelEl?.getAttribute("data-label-default-text") || "").trim()
      || `Frequency spectrum (${state.yScale})`;
    const currentText = state.printYAxisLabelHasOverride
      ? String(state.printYAxisLabelOverride || "")
      : (String(labelEl?.textContent || "").trim() || defaultText);
    printTextEditPending = true;
    openCustomTextDialog(currentText, {
      title: "Edit Y Axis Label",
      saveText: "Save",
    }).then((result) => {
      if (!result) {
        return;
      }
      const nextText = String(result.text || "");
      state.printYAxisLabelOverride = nextText;
      state.printYAxisLabelHasOverride = true;
      scheduleRender();
      scheduleStateUrlUpdate();
    }).finally(() => {
      printTextEditPending = false;
    });
  };
  const openAlignmentLabelEditor = (labelEl) => {
    const alignId = String(labelEl?.getAttribute("data-label-parent-align-id") || "").trim();
    if (!alignId || printTextEditPending) {
      return;
    }
    const defaultText = String(labelEl.getAttribute("data-label-default-text") || "").trim();
    const currentText = String(state.printAlignmentLabelOverrides?.[alignId] || "").trim()
      || defaultText
      || String(labelEl.textContent || "").trim();
    printTextEditPending = true;
    openCustomTextDialog(currentText, {
      title: "Edit Alignment Label",
      saveText: "Save",
    }).then((result) => {
      if (!result) {
        return;
      }
      const nextText = String(result.text || "").trim();
      const overrides = { ...(state.printAlignmentLabelOverrides || {}) };
      if (!nextText || (defaultText && nextText === defaultText)) {
        delete overrides[alignId];
      } else {
        overrides[alignId] = nextText;
      }
      state.printAlignmentLabelOverrides = overrides;
      scheduleRender();
      scheduleStateUrlUpdate();
    }).finally(() => {
      printTextEditPending = false;
    });
  };

  svg.addEventListener("pointermove", (event) => {
    if (panDragState && panDragState.pointerId === event.pointerId) {
      event.preventDefault();
      const dx = event.clientX - panDragState.startClientX;
      const dy = event.clientY - panDragState.startClientY;
      if (printMode) {
        state.printDiagramOffsetX = panDragState.startPanX + dx;
        state.printDiagramOffsetY = panDragState.startPanY + dy;
        applyPrintDiagramOffsetPreview(state.printDiagramOffsetX, state.printDiagramOffsetY);
      } else {
        canvasPanX = panDragState.startPanX + dx;
        canvasPanY = panDragState.startPanY + dy;
      }
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        panDragState.moved = true;
      }
      applyCanvasPan();
      return;
    }
    if (
      printDragState &&
      printDragState.pointerId === event.pointerId &&
      printDragState.kind === "combo-x"
    ) {
      event.preventDefault();
      const dx = event.clientX - printDragState.startClientX;
      const nextX = clamp(printDragState.startX + dx, printDragState.minX, printDragState.maxX);
      state.printComponentXOverrides = {
        ...(state.printComponentXOverrides || {}),
        [printDragState.id]: nextX,
      };
      if (printDragState.dragElement) {
        const previewDx = nextX - printDragState.startX;
        printDragState.dragElement.setAttribute("transform", `translate(${previewDx},0)`);
      }
      if (Math.abs(dx) > 2) {
        printDragState.moved = true;
      }
      return;
    }
    if (printMode) {
      if (
        printDragState &&
        printDragState.pointerId === event.pointerId &&
        (
          printDragState.kind === "column" ||
          printDragState.kind === "label" ||
          printDragState.kind === "custom-text"
        )
      ) {
        event.preventDefault();
        const dx = event.clientX - printDragState.startClientX;
        const dy = event.clientY - printDragState.startClientY;
        if (printDragState.kind === "column") {
          state.printColumnOverrides = {
            ...(state.printColumnOverrides || {}),
            [printDragState.id]: printDragState.startX + dx,
          };
          scheduleRender(0);
        } else if (printDragState.kind === "label") {
          state.printLabelOffsets = {
            ...(state.printLabelOffsets || {}),
            [printDragState.id]: {
              dx: printDragState.startDx + dx,
              dy: printDragState.lockY ? printDragState.startDy : printDragState.startDy + dy,
            },
          };
          scheduleRender(0);
        } else if (printDragState.kind === "custom-text") {
          const currentLocal = clientToDiagramPoint(event.clientX, event.clientY);
          if (!currentLocal) {
            return;
          }
          const nextX = printDragState.startX + (currentLocal.x - printDragState.startLocalX);
          const nextY = printDragState.startY + (currentLocal.y - printDragState.startLocalY);
          state.printCustomTexts = (state.printCustomTexts || []).map((item) =>
            item.id === printDragState.id
              ? { ...item, x: nextX, y: nextY }
              : item
          );
          scheduleRender(0);
        }
      }
      return;
    }
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

  svg.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      state.layoutScale = clamp((Number(state.layoutScale) || 1) * factor, 0.6, 1.8);
      if (layoutScaleInput) {
        layoutScaleInput.value = String(state.layoutScale);
      }
      if (layoutScaleReadout) {
        layoutScaleReadout.textContent = `${Math.round(state.layoutScale * 100)}%`;
      }
      scheduleRender(0);
      scheduleStateUrlUpdate();
    },
    { passive: false }
  );

  svg.addEventListener("pointerleave", () => {
    if (!printMode) {
      clearHighlightedSourceDots();
      tooltipEl.hidden = true;
    }
  });

  svg.addEventListener("pointerup", (event) => {
    if (endCanvasPan(event)) {
      return;
    }
    if (!printMode && printDragState?.kind !== "combo-x") {
      return;
    }
    endPrintDrag(event, { cancelled: false });
  });

  svg.addEventListener("pointercancel", (event) => {
    endCanvasPan(event);
    if (!printMode && printDragState?.kind !== "combo-x") {
      return;
    }
    endPrintDrag(event, { cancelled: true });
  });

  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    if (!(event.target instanceof Element)) {
      return;
    }
    const activeEl = document.activeElement;
    if (
      activeEl instanceof HTMLElement &&
      activeEl.closest(".left-rail") &&
      activeEl.matches("input, textarea, select, [contenteditable='true']")
    ) {
      activeEl.blur();
    }
    if (pendingCustomLabelTarget) {
      const targetComponent = event.target.closest("[data-component-key]");
      if (targetComponent) {
        const parentKey = targetComponent.getAttribute("data-component-key");
        pendingCustomLabelTarget = false;
        const actionId = pendingCustomLabelActionId || nextCustomActionId();
        pendingCustomLabelActionId = 0;
        event.preventDefault();
        forceResetCustomTextDialog("add-custom-label:pre-open-reset");
        openCustomTextDialog("", {
          title: "Add Custom Label",
          saveText: "Add Label",
        }).then((result) => {
          const text = String(result?.text || "").trim();
          if (!parentKey || !text) {
            scheduleRender(0);
            return;
          }
          const item = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            parentKey,
            text,
          };
          state.printCustomLabels = [...(state.printCustomLabels || []), item];
          state.printLabelOffsets = {
            ...(state.printLabelOffsets || {}),
            [`customlabel:${item.id}`]: { dx: 10, dy: -24 },
          };
          scheduleRender();
          scheduleStateUrlUpdate();
        });
        scheduleRender(0);
        return;
      }
    }
    if (printMode) {
      const hideTarget = event.target.closest("[data-hide-key]");
      const customLabelTarget = event.target.closest("[data-custom-label-id]");
      if (event.altKey && customLabelTarget) {
        const customLabelId = customLabelTarget.getAttribute("data-custom-label-id");
        if (customLabelId) {
          state.printCustomLabels = (state.printCustomLabels || []).filter((item) => item.id !== customLabelId);
          const labelKey = `customlabel:${customLabelId}`;
          if (state.printLabelOffsets && labelKey in state.printLabelOffsets) {
            const nextOffsets = { ...(state.printLabelOffsets || {}) };
            delete nextOffsets[labelKey];
            state.printLabelOffsets = nextOffsets;
          }
          event.preventDefault();
          scheduleRender();
          scheduleStateUrlUpdate();
          return;
        }
      }
      if (event.altKey && hideTarget) {
        const hideKey = hideTarget.getAttribute("data-hide-key");
        if (hideKey) {
          if (hideKey.startsWith("distance:")) {
            const distanceId = hideKey.slice("distance:".length).trim();
            if (distanceId) {
              state.printDistanceAnnotations = (state.printDistanceAnnotations || []).filter(
                (item) => String(item?.id || "") !== distanceId
              );
              if (state.printLabelOffsets && hideKey in state.printLabelOffsets) {
                const nextOffsets = { ...(state.printLabelOffsets || {}) };
                delete nextOffsets[hideKey];
                state.printLabelOffsets = nextOffsets;
              }
              if (state.printHiddenKeys && hideKey in state.printHiddenKeys) {
                const nextHidden = { ...(state.printHiddenKeys || {}) };
                delete nextHidden[hideKey];
                state.printHiddenKeys = nextHidden;
              }
              event.preventDefault();
              scheduleRender();
              scheduleStateUrlUpdate();
              return;
            }
          }
          const next = { ...(state.printHiddenKeys || {}) };
          next[hideKey] = !next[hideKey];
          state.printHiddenKeys = next;
          event.preventDefault();
          scheduleRender();
          return;
        }
      }
      const labelTarget = event.target.closest("[data-print-label-id]");
      if (labelTarget) {
        const labelId = labelTarget.getAttribute("data-print-label-id");
        if (labelId) {
          const customLabelId = String(labelTarget.getAttribute("data-custom-label-id") || "").trim();
          const alignmentId = String(labelTarget.getAttribute("data-label-parent-align-id") || "").trim();
          if (customLabelId && event.detail > 1) {
            event.preventDefault();
            const customLabel = (state.printCustomLabels || []).find((item) => item.id === customLabelId);
            if (!customLabel || printTextEditPending) {
              return;
            }
            printTextEditPending = true;
            openCustomTextDialog(String(customLabel.text || ""), {
              title: "Edit Custom Label",
              saveText: "Save",
            }).then((result) => {
              const nextText = String(result?.text || "").trim();
              if (nextText) {
                state.printCustomLabels = (state.printCustomLabels || []).map((item) =>
                  item.id === customLabelId ? { ...item, text: nextText } : item
                );
                scheduleRender();
                scheduleStateUrlUpdate();
              } else {
                scheduleRender(0);
              }
            }).finally(() => {
              printTextEditPending = false;
            });
            return;
          }
          if (alignmentId && event.detail > 1) {
            event.preventDefault();
            openAlignmentLabelEditor(labelTarget);
            return;
          }
          printLabelDragFocus = labelDragFocusFromElement(labelTarget, labelId);
          const offset = state.printLabelOffsets?.[labelId] || {};
          const fallbackDx = Number(labelTarget.getAttribute("data-print-default-dx"));
          const fallbackDy = Number(labelTarget.getAttribute("data-print-default-dy"));
          beginPrintDrag({
            kind: "label",
            id: labelId,
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startDx: Number.isFinite(offset.dx)
              ? offset.dx
              : Number.isFinite(fallbackDx)
                ? fallbackDx
                : 9,
            startDy: Number.isFinite(offset.dy)
              ? offset.dy
              : Number.isFinite(fallbackDy)
                ? fallbackDy
                : -7,
            lockY: Boolean(alignmentId),
          }, event);
          event.preventDefault();
          return;
        }
      }
      const customTextTarget = event.target.closest("[data-custom-text-id]");
      if (customTextTarget) {
        if (event.detail > 1) {
          event.preventDefault();
          return;
        }
        const customId = customTextTarget.getAttribute("data-custom-text-id");
        const customItem = (state.printCustomTexts || []).find((item) => item.id === customId);
        const startLocal = clientToDiagramPoint(event.clientX, event.clientY);
        if (customId && customItem) {
          state.printSelectedCustomTextId = customId;
          beginPrintDrag({
            kind: "custom-text",
            id: customId,
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startX: Number(customItem.x) || 0,
            startY: Number(customItem.y) || 0,
            startLocalX: Number(startLocal?.x) || 0,
            startLocalY: Number(startLocal?.y) || 0,
          }, event);
          event.preventDefault();
          scheduleRender(0);
          return;
        }
      }
      const chordTitleTarget = event.target.closest("[data-print-chord-title-index]");
      if (chordTitleTarget) {
        const chordIndex = Number(chordTitleTarget.getAttribute("data-print-chord-title-index"));
        if (event.detail > 1) {
          event.preventDefault();
          openChordTitleEditor(chordIndex);
        }
        return;
      }
      const yAxisLabelTarget = event.target.closest("[data-print-y-axis-label='1']");
      if (yAxisLabelTarget) {
        if (event.detail > 1) {
          event.preventDefault();
          openYAxisLabelEditor(yAxisLabelTarget);
        }
        return;
      }
      const columnTarget = event.target.closest("[data-column-id]");
      if (columnTarget) {
        const columnId = columnTarget.getAttribute("data-column-id");
        if (columnId) {
          const currentX = Number(state.printColumnOverrides?.[columnId]);
          let startX = currentX;
          if (!Number.isFinite(startX)) {
            const origin = Number(columnTarget.getAttribute("data-column-origin"));
            if (Number.isFinite(origin)) {
              startX = origin;
            } else {
              const bounds = columnTarget.getBBox();
              startX = bounds.x + bounds.width / 2;
            }
          }
          beginPrintDrag({
            kind: "column",
            id: columnId,
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startX,
          }, event);
          event.preventDefault();
          return;
        }
      }
      const componentTarget = event.target.closest("[data-component-key]");
      const comboTarget = event.target.closest("[data-play-kind='combo'][data-play-key]");
      if (comboTarget && !state.printDistanceMode) {
        const comboKey = comboTarget.getAttribute("data-play-key");
        const minX = Number(comboTarget.getAttribute("data-combo-drag-min"));
        const maxX = Number(comboTarget.getAttribute("data-combo-drag-max"));
        const freq = Number(comboTarget.getAttribute("data-play-freq"));
        if (comboKey && Number.isFinite(minX) && Number.isFinite(maxX) && minX < maxX) {
          const currentX = Number(state.printComponentXOverrides?.[comboKey]);
          const startX = Number.isFinite(currentX)
            ? currentX
            : (() => {
                const box = comboTarget.getBBox();
                return box.x + box.width / 2;
              })();
          beginPrintDrag({
            kind: "combo-x",
            id: comboKey,
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startX,
            minX,
            maxX,
            dragElement: comboTarget,
            moved: false,
            freq,
          }, event);
          event.preventDefault();
          return;
        }
      }
      if (componentTarget && state.printDistanceMode) {
        const componentKey = componentTarget.getAttribute("data-component-key");
        if (componentKey) {
          if (!printDistancePendingKey) {
            printDistancePendingKey = componentKey;
          } else if (printDistancePendingKey === componentKey) {
            printDistancePendingKey = null;
          } else {
            const annotations = Array.isArray(state.printDistanceAnnotations)
              ? [...state.printDistanceAnnotations]
              : [];
            const exists = annotations.some(
              (item) =>
                (item.aKey === printDistancePendingKey && item.bKey === componentKey) ||
                (item.aKey === componentKey && item.bKey === printDistancePendingKey)
            );
            if (!exists) {
              annotations.push({
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                aKey: printDistancePendingKey,
                bKey: componentKey,
              });
              state.printDistanceAnnotations = annotations;
            }
            printDistancePendingKey = null;
          }
          event.preventDefault();
          scheduleRender();
          return;
        }
      }
      if (isPanEligibleTarget(event.target)) {
        if (state.printSelectedCustomTextId) {
          state.printSelectedCustomTextId = null;
          scheduleRender(0);
        }
        beginCanvasPan(event);
        event.preventDefault();
      }
      return;
    }
    const comboTarget = event.target.closest("[data-play-kind='combo'][data-play-key]");
    if (comboTarget) {
      const comboKey = comboTarget.getAttribute("data-play-key");
      const minX = Number(comboTarget.getAttribute("data-combo-drag-min"));
      const maxX = Number(comboTarget.getAttribute("data-combo-drag-max"));
      const freq = Number(comboTarget.getAttribute("data-play-freq"));
      if (comboKey && Number.isFinite(minX) && Number.isFinite(maxX) && minX < maxX) {
        const currentX = Number(state.printComponentXOverrides?.[comboKey]);
        const startX = Number.isFinite(currentX)
          ? currentX
          : (() => {
              const box = comboTarget.getBBox();
              return box.x + box.width / 2;
            })();
        beginPrintDrag({
          kind: "combo-x",
          id: comboKey,
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startX,
          minX,
          maxX,
          dragElement: comboTarget,
          moved: false,
          freq,
        }, event);
        event.preventDefault();
        return;
      }
    }
    const chordActionTarget = event.target.closest("[data-chord-action][data-chord-index]");
    if (chordActionTarget) {
      const chordIndex = Number(chordActionTarget.getAttribute("data-chord-index"));
      const action = chordActionTarget.getAttribute("data-chord-action");
      if (Number.isFinite(chordIndex) && action) {
        event.preventDefault();
        applyChordPlaybackAction(chordIndex, action);
      }
      return;
    }
    const roughnessTarget = event.target.closest("[data-rough-play-items]");
    if (roughnessTarget) {
      const encoded = roughnessTarget.getAttribute("data-rough-play-items") || "";
      if (encoded) {
        try {
          const payload = JSON.parse(decodeURIComponent(encoded));
          if (Array.isArray(payload) && payload.length) {
            event.preventDefault();
            applyRoughnessBandPlaybackToggle(payload);
            return;
          }
        } catch {}
      }
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
      if (isPanEligibleTarget(event.target)) {
        beginCanvasPan(event);
        event.preventDefault();
      }
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
        : kind === "fusion"
          ? {
              kind: "fusion",
              freq,
              ampScale: clamp(Number(playTarget.getAttribute("data-play-scale")) || 0.2, 0.04, 1),
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

  svg.addEventListener("dblclick", (event) => {
    if (!printMode || !(event.target instanceof Element)) {
      return;
    }
    const customTextTarget = event.target.closest("[data-custom-text-id]");
    if (customTextTarget) {
      const customId = customTextTarget.getAttribute("data-custom-text-id");
      const customItem = (state.printCustomTexts || []).find((item) => item.id === customId);
      if (!customId || !customItem) {
        return;
      }
      event.preventDefault();
      state.printSelectedCustomTextId = customId;
      openCustomTextDialog(String(customItem.text || ""), {
        font: customItem.font || "Noto Serif",
        size: customItem.size ?? 18,
      }).then((result) => {
        if (!result) {
          scheduleRender(0);
          return;
        }
        const nextText = String(result.text || "").trim();
        if (!nextText) {
          scheduleRender(0);
          return;
        }
        state.printCustomTexts = (state.printCustomTexts || []).map((item) =>
          item.id === customId
            ? {
                ...item,
                text: nextText,
                font: String(item.font || "Noto Serif"),
                size: clamp(Number(item.size ?? 18), 8, 72),
              }
            : item
        );
        scheduleRender();
        scheduleStateUrlUpdate();
      });
      return;
    }
    const chordTitleTarget = event.target.closest("[data-print-chord-title-index]");
    if (chordTitleTarget) {
      const chordIndex = Number(chordTitleTarget.getAttribute("data-print-chord-title-index"));
      event.preventDefault();
      openChordTitleEditor(chordIndex);
      return;
    }
    const yAxisLabelTarget = event.target.closest("[data-print-y-axis-label='1']");
    if (yAxisLabelTarget) {
      event.preventDefault();
      openYAxisLabelEditor(yAxisLabelTarget);
      return;
    }
    const customLabelTarget = event.target.closest("[data-custom-label-id]");
    if (customLabelTarget) {
      const customLabelId = customLabelTarget.getAttribute("data-custom-label-id") || "";
      const customLabel = (state.printCustomLabels || []).find((item) => item.id === customLabelId);
      if (!customLabel || printTextEditPending) {
        return;
      }
      event.preventDefault();
      printTextEditPending = true;
      openCustomTextDialog(String(customLabel.text || ""), {
        title: "Edit Custom Label",
        saveText: "Save",
      }).then((result) => {
        const nextText = String(result?.text || "").trim();
        if (nextText) {
          state.printCustomLabels = (state.printCustomLabels || []).map((item) =>
            item.id === customLabelId ? { ...item, text: nextText } : item
          );
          scheduleRender();
          scheduleStateUrlUpdate();
        } else {
          scheduleRender(0);
        }
      }).finally(() => {
        printTextEditPending = false;
      });
      return;
    }
    const alignmentLabelTarget = event.target.closest("[data-label-parent-align-id]");
    if (alignmentLabelTarget) {
      event.preventDefault();
      openAlignmentLabelEditor(alignmentLabelTarget);
      return;
    }
  });
}

function syncControlReadouts() {
  syncModeButtons();
  syncColorSchemeControl();
  if (ratioRootNoteCustomInput) {
    if (ratioRootNoteCustomInput.value !== String(state.ratioRootNoteCustom || "")) {
      ratioRootNoteCustomInput.value = String(state.ratioRootNoteCustom || "");
    }
  }
  syncRatioRootCustomInputVisibility();
  if (viewZoomReadout) {
    viewZoomReadout.textContent = `${Math.round((Number(state.viewZoom) || 1) * 100)}%`;
  }
  if (layoutScaleReadout) {
    layoutScaleReadout.textContent = `${Math.round((Number(state.layoutScale) || 1) * 100)}%`;
  }
  if (printHeightReadout) {
    printHeightReadout.textContent = `${Math.round(clamp(Number(state.printGraphHeight) || 1, 0.45, 1) * 100)}%`;
  }
  overtoneCountReadout.textContent = String(state.overtoneCount);
  alignToleranceReadout.textContent = `${state.alignToleranceCents.toFixed(1)}c`;
  if (stackLineSizeInput) {
    stackLineSizeInput.value = String(Math.round(clamp(state.stackLineSize, 0.25, 3) * 100));
  }
  if (stackLineSizeReadout) {
    stackLineSizeReadout.textContent = `${Math.round(clamp(state.stackLineSize, 0.25, 3) * 100)}%`;
  }
  if (alphaFalloffInput) {
    alphaFalloffInput.checked = Boolean(state.alphaFalloff);
  }
  if (fusionClusterCentsReadout) {
    fusionClusterCentsReadout.textContent = `${state.fusionClusterCents.toFixed(1)}c`;
  }
  if (fusionScaleInput) {
    fusionScaleInput.value = String(Math.round(clamp(state.fusionScale, 0.5, 1.5) * 100));
  }
  if (fusionScaleReadout) {
    fusionScaleReadout.textContent = `${Math.round(clamp(state.fusionScale, 0.5, 1.5) * 100)}%`;
  }
  rangeMinInput.disabled = state.autoRange;
  rangeMaxInput.disabled = state.autoRange;
  combinationControls.style.opacity = state.showCombination ? "1" : "0.6";
  comboDifferenceInput.disabled = !state.showCombination;
  comboSumInput.disabled = !state.showCombination;
  comboOrder2Input.disabled = !state.showCombination;
  if (comboSizeInput) {
    comboSizeInput.disabled = !state.showCombination;
  }
  if (fusionControls) {
    fusionControls.style.opacity = state.showFusion ? "1" : "0.78";
  }
  if (fusionReadoutRatioInput) {
    fusionReadoutRatioInput.disabled = !state.showFusion;
  }
  if (fusionReadoutHzInput) {
    fusionReadoutHzInput.disabled = !state.showFusion;
  }
  if (roughnessControls) {
    roughnessControls.style.opacity = state.showRoughness ? "1" : "0.78";
  }
  if (printShowComponentHzInput) {
    printShowComponentHzInput.disabled = !state.printShowComponentLabel;
  }
  if (printShowComponentRatioInput) {
    printShowComponentRatioInput.disabled = !state.printShowComponentLabel;
  }
  if (printShowComponentNoteInput) {
    printShowComponentNoteInput.disabled = !state.printShowComponentLabel;
  }
  if (printShowLegendInput) {
    printShowLegendInput.disabled = !state.showCombination || !hasAnyVisibleComboTypes();
  }
  if (printDistanceModeInput) {
    printDistanceModeInput.disabled = !isPrintMode();
  }
  if (printTextStylesPanel) {
    printTextStylesPanel.hidden = !isPrintMode();
  }
  const styleOvertone = getPrintAutoTextStyle("overtone");
  const styleComponent = getPrintAutoTextStyle("component");
  const styleAxis = getPrintAutoTextStyle("axis");
  if (printStyleOvertoneFontInput) printStyleOvertoneFontInput.value = styleOvertone.font;
  if (printStyleOvertoneSizeInput) printStyleOvertoneSizeInput.value = String(styleOvertone.size);
  if (printStyleOvertoneSizeReadout) printStyleOvertoneSizeReadout.textContent = `${styleOvertone.size}`;
  if (printStyleComponentFontInput) printStyleComponentFontInput.value = styleComponent.font;
  if (printStyleComponentSizeInput) printStyleComponentSizeInput.value = String(styleComponent.size);
  if (printStyleComponentSizeReadout) printStyleComponentSizeReadout.textContent = `${styleComponent.size}`;
  if (printStyleAxisFontInput) printStyleAxisFontInput.value = styleAxis.font;
  if (printStyleAxisSizeInput) printStyleAxisSizeInput.value = String(styleAxis.size);
  if (printStyleAxisSizeReadout) printStyleAxisSizeReadout.textContent = `${styleAxis.size}`;
  if (printAddCustomTextButton) {
    printAddCustomTextButton.textContent = "Add Custom Text";
    printAddCustomTextButton.disabled = false;
  }
  if (printAddCustomLabelButton) {
    printAddCustomLabelButton.textContent = pendingCustomLabelTarget
      ? "Click A Component..."
      : "Add Custom Label";
    printAddCustomLabelButton.disabled = false;
  }
  let selectedCustom = getSelectedCustomTextItem();
  if (!selectedCustom && state.printSelectedCustomTextId) {
    state.printSelectedCustomTextId = null;
    selectedCustom = null;
  }
  if (customTextInspector) {
    customTextInspector.hidden = !selectedCustom || !isPrintMode();
  }
  syncingCustomInspector = true;
  try {
    if (printCustomSelectedTextInput) {
      printCustomSelectedTextInput.value = selectedCustom ? String(selectedCustom.text || "") : "";
      printCustomSelectedTextInput.disabled = !selectedCustom || !isPrintMode();
    }
    if (printCustomSelectedFontInput) {
      printCustomSelectedFontInput.value = selectedCustom
        ? String(selectedCustom.font || "Noto Serif")
        : "Noto Serif";
      printCustomSelectedFontInput.disabled = !selectedCustom || !isPrintMode();
    }
    if (printCustomSelectedSizeInput) {
      const size = selectedCustom
        ? clamp(Number(selectedCustom.size) || 18, 8, 72)
        : 18;
      printCustomSelectedSizeInput.value = String(size);
      printCustomSelectedSizeInput.disabled = !selectedCustom || !isPrintMode();
      if (printCustomSelectedSizeReadout) {
        printCustomSelectedSizeReadout.textContent = String(size);
      }
    }
    if (printCustomDeleteSelectedButton) {
      printCustomDeleteSelectedButton.disabled = !selectedCustom || !isPrintMode();
    }
  } finally {
    syncingCustomInspector = false;
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
      (sum, analysis) => sum + ((analysis.fusionNodes && analysis.fusionNodes.length) || 0),
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
    const modeHint = isPrintMode() && pendingCustomLabelTarget
      ? "\nAdd Custom Label: click a component to attach a label."
      : "";
    statusEl.textContent = `${summary.join(" · ")}${modeHint}`;
    return;
  }

  const message = model.errors.slice(0, 6).join("\n");
  const extra = model.errors.length > 6 ? `\n... ${model.errors.length - 6} more` : "";
  const modeHint = isPrintMode() && pendingCustomLabelTarget
    ? "\nAdd Custom Label: click a component to attach a label."
    : "";
  statusEl.textContent = `${summary.join(" · ")}\n${message}${extra}${modeHint}`;
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
  if (!isPrintMode()) {
    startVisualAnimationLoop(svg);
  }
  if (isPrintMode()) {
    hardAllNotesOff();
  } else {
    refreshActiveVoicesFromState();
  }

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

function normalizeSvgColor(color) {
  if (color == null) {
    return { color: "none", opacity: null };
  }
  const trimmed = String(color).trim();
  if (!trimmed) {
    return { color: "none", opacity: null };
  }
  if (trimmed === "none" || trimmed === "transparent") {
    return { color: "none", opacity: null };
  }
  const rgbaMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbaMatch) {
    const parts = rgbaMatch[1]
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const a = parts.length > 3 ? Number(parts[3]) : 1;
    if ([r, g, b].every((value) => Number.isFinite(value))) {
      const rgb = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      const opacity = Number.isFinite(a) ? clamp(a, 0, 1) : 1;
      return { color: rgb, opacity };
    }
  }
  const hexMatch = trimmed.match(/^#([0-9a-f]{4}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const values =
      hex.length === 4
        ? hex.split("").map((char) => parseInt(char + char, 16))
        : [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            parseInt(hex.slice(6, 8), 16),
          ];
    const [r, g, b, a = 255] = values;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    return { color: rgb, opacity: clamp(a / 255, 0, 1) };
  }
  return { color: trimmed, opacity: null };
}

function normalizeSvgColorAttributes(root) {
  const colorAttrs = ["fill", "stroke", "color", "stop-color", "flood-color", "lighting-color"];
  const normalizeOpacityValue = (value) => {
    if (value == null) {
      return null;
    }
    const text = String(value).trim();
    if (!text) {
      return null;
    }
    const numeric = Number(text);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return Number(clamp(numeric, 0, 1).toFixed(3));
  };
  const applyColorAttr = (el, colorAttr) => {
    if (!el.hasAttribute(colorAttr)) {
      return;
    }
    const normalized = normalizeSvgColor(el.getAttribute(colorAttr));
    el.setAttribute(colorAttr, normalized.color);
    const opacityAttr = `${colorAttr}-opacity`;
    if (!Number.isFinite(normalized.opacity) || normalized.color === "none") {
      return;
    }
    const existingOpacity = normalizeOpacityValue(el.getAttribute(opacityAttr));
    const combinedOpacity = existingOpacity == null
      ? normalized.opacity
      : clamp(existingOpacity * normalized.opacity, 0, 1);
    el.setAttribute(opacityAttr, String(Number(combinedOpacity.toFixed(3))));
  };
  const nodes = [root, ...Array.from(root.querySelectorAll("*"))];
  nodes.forEach((el) => {
    colorAttrs.forEach((colorAttr) => applyColorAttr(el, colorAttr));
  });
}

function serializeSvg(
  svg,
  { withXmlHeader = true, widthIn = NaN, heightIn = NaN } = {}
) {
  const clone = svg.cloneNode(true);
  clone.removeAttribute("role");
  clone.removeAttribute("aria-label");
  clone.setAttribute("version", "1.1");
  clone.setAttribute("xml:space", "preserve");
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  if (Number.isFinite(widthIn) && widthIn > 0) {
    clone.setAttribute("width", `${widthIn}in`);
  }
  if (Number.isFinite(heightIn) && heightIn > 0) {
    clone.setAttribute("height", `${heightIn}in`);
  }
  normalizeSvgColorAttributes(clone);
  const serialized = new XMLSerializer().serializeToString(clone);
  return withXmlHeader ? `<?xml version="1.0" encoding="UTF-8"?>\n${serialized}` : serialized;
}

function clampExportSize(value, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return clamp(Math.round(value), 300, 6000);
}

function exportSizeFromPaperPreset() {
  const presets = {
    "letter-portrait": { width: 1700, height: 2200, widthIn: 8.5, heightIn: 11 },
    "letter-landscape": { width: 2200, height: 1700, widthIn: 11, heightIn: 8.5 },
    "a4-portrait": { width: 1654, height: 2339, widthIn: 8.27, heightIn: 11.69 },
    "a4-landscape": { width: 2339, height: 1654, widthIn: 11.69, heightIn: 8.27 },
  };
  return presets[state.printPaper] || presets["letter-landscape"];
}

function ensureChartReadyForExport() {
  if (renderTimer) {
    clearTimeout(renderTimer);
    renderTimer = null;
  }
  syncControlReadouts();
  renderChart();
}

function parseSvgViewBox(svg) {
  if (!svg) {
    return null;
  }
  const raw = String(svg.getAttribute("viewBox") || "").trim();
  if (raw) {
    const parts = raw.split(/[\s,]+/).map((part) => Number(part));
    if (parts.length >= 4 && parts.every((value) => Number.isFinite(value))) {
      const [x, y, width, height] = parts;
      if (width > 0 && height > 0) {
        return { x, y, width, height };
      }
    }
  }
  const width = Number.parseFloat(String(svg.getAttribute("width") || ""));
  const height = Number.parseFloat(String(svg.getAttribute("height") || ""));
  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return { x: 0, y: 0, width, height };
  }
  return null;
}

function unionRects(a, b) {
  const left = Math.min(a.x, b.x);
  const top = Math.min(a.y, b.y);
  const right = Math.max(a.x + a.width, b.x + b.width);
  const bottom = Math.max(a.y + a.height, b.y + b.height);
  return {
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

function clampRectToBounds(rect, bounds) {
  const left = Math.max(bounds.x, rect.x);
  const top = Math.max(bounds.y, rect.y);
  const right = Math.min(bounds.x + bounds.width, rect.x + rect.width);
  const bottom = Math.min(bounds.y + bounds.height, rect.y + rect.height);
  if (!(right > left) || !(bottom > top)) {
    return { ...bounds };
  }
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function unionRectWithTaggedExportElements(sourceSvg, baseRect) {
  if (!(sourceSvg instanceof SVGElement)) {
    return baseRect;
  }
  let result = baseRect;
  const tagged = Array.from(sourceSvg.querySelectorAll("[data-export-include='1']"));
  tagged.forEach((node) => {
    if (!node || typeof node.getBBox !== "function") {
      return;
    }
    try {
      const box = node.getBBox();
      if (
        !Number.isFinite(box.x) ||
        !Number.isFinite(box.y) ||
        !Number.isFinite(box.width) ||
        !Number.isFinite(box.height) ||
        !(box.width > 0 || box.height > 0)
      ) {
        return;
      }
      const pad = 10;
      result = unionRects(result, {
        x: box.x - pad,
        y: box.y - pad,
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      });
    } catch {}
  });
  return result;
}

function resolveExportCropBounds(sourceSvg, inPrintMode) {
  const fullBounds = parseSvgViewBox(sourceSvg) || { x: 0, y: 0, width: 1200, height: 800 };
  if (!inPrintMode) {
    return fullBounds;
  }
  const pageX = Number(sourceSvg.getAttribute("data-export-page-x"));
  const pageY = Number(sourceSvg.getAttribute("data-export-page-y"));
  const pageWidth = Number(sourceSvg.getAttribute("data-export-page-width"));
  const pageHeight = Number(sourceSvg.getAttribute("data-export-page-height"));
  if (
    Number.isFinite(pageX) &&
    Number.isFinite(pageY) &&
    Number.isFinite(pageWidth) &&
    Number.isFinite(pageHeight) &&
    pageWidth > 0 &&
    pageHeight > 0
  ) {
    let exportRect = { x: pageX, y: pageY, width: pageWidth, height: pageHeight };
    const contentX = Number(sourceSvg.getAttribute("data-export-content-x"));
    const contentY = Number(sourceSvg.getAttribute("data-export-content-y"));
    const contentWidth = Number(sourceSvg.getAttribute("data-export-content-width"));
    const contentHeight = Number(sourceSvg.getAttribute("data-export-content-height"));
    if (
      Number.isFinite(contentX) &&
      Number.isFinite(contentY) &&
      Number.isFinite(contentWidth) &&
      Number.isFinite(contentHeight) &&
      contentWidth > 0 &&
      contentHeight > 0
    ) {
      exportRect = unionRects(exportRect, {
        x: contentX,
        y: contentY,
        width: contentWidth,
        height: contentHeight,
      });
    }
    const diagramRoot = sourceSvg.querySelector("[data-diagram-root]");
    if (diagramRoot && typeof diagramRoot.getBBox === "function") {
      try {
        const box = diagramRoot.getBBox();
        if (Number.isFinite(box.x) && Number.isFinite(box.y) && box.width > 0 && box.height > 0) {
          const pad = 12;
          const diagramRect = {
            x: box.x - pad,
            y: box.y - pad,
            width: box.width + pad * 2,
            height: box.height + pad * 2,
          };
          exportRect = unionRects(exportRect, diagramRect);
        }
      } catch {}
    }
    exportRect = unionRectWithTaggedExportElements(sourceSvg, exportRect);
    return clampRectToBounds(exportRect, fullBounds);
  }
  return fullBounds;
}

function sanitizeExportSvgClone(clone) {
  const nodes = [clone, ...Array.from(clone.querySelectorAll("*"))];
  nodes.forEach((el) => {
    el.removeAttribute("style");
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-")) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

function buildExportPayload({ withXmlHeader = true } = {}) {
  ensureChartReadyForExport();
  const sourceSvg = chartStage?.querySelector("svg");
  if (!(sourceSvg instanceof SVGElement)) {
    return null;
  }
  const inPrintMode = isPrintMode();
  const paperSize = exportSizeFromPaperPreset();
  const bounds = resolveExportCropBounds(sourceSvg, inPrintMode);
  const clone = sourceSvg.cloneNode(true);
  sanitizeExportSvgClone(clone);
  clone.setAttribute("viewBox", `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
  if (!inPrintMode) {
    clone.setAttribute("width", String(Math.round(bounds.width)));
    clone.setAttribute("height", String(Math.round(bounds.height)));
  }
  const svgText = serializeSvg(clone, {
    withXmlHeader,
    widthIn: inPrintMode ? paperSize.widthIn : NaN,
    heightIn: inPrintMode ? paperSize.heightIn : NaN,
  });
  return {
    svgText,
    bounds,
    inPrintMode,
    paperSize,
  };
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

function buildChartSaveDocument(serialized = null) {
  const next = serialized && typeof serialized === "object" ? serialized : getSerializedState();
  return {
    format: "overtones-chart-state",
    version: 2,
    savedAt: new Date().toISOString(),
    data: next,
  };
}

function saveChartToFile() {
  const documentPayload = buildChartSaveDocument();
  const text = `${JSON.stringify(documentPayload, null, 2)}\n`;
  downloadBlob("Overtones.json", new Blob([text], { type: "application/json;charset=utf-8" }));
}

async function openChartFromFile(file) {
  if (!(file instanceof File)) {
    return;
  }
  let parsed = null;
  try {
    const text = await file.text();
    parsed = JSON.parse(text);
  } catch {
    alert("Could not read that chart file.");
    return;
  }
  if (!applySerializedState(parsed)) {
    alert("That file is not a valid Overtones chart.");
    return;
  }
  finalizeLoadedState();
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
  const payload = buildExportPayload({ withXmlHeader: true });
  if (!payload) {
    alert("Nothing to export yet. Render the chart first.");
    return;
  }
  downloadBlob(
    `overtones-${new Date().toISOString().slice(0, 10)}.svg`,
    new Blob([payload.svgText], { type: "image/svg+xml;charset=utf-8" })
  );
}

function exportPdf() {
  const payload = buildExportPayload({ withXmlHeader: false });
  if (!payload) {
    alert("Nothing to export yet. Render the chart first.");
    return;
  }
  const pageWidthCss = payload.inPrintMode && Number.isFinite(payload.paperSize.widthIn)
    ? `${payload.paperSize.widthIn}in`
    : `${Math.round(payload.bounds.width)}px`;
  const pageHeightCss = payload.inPrintMode && Number.isFinite(payload.paperSize.heightIn)
    ? `${payload.paperSize.heightIn}in`
    : `${Math.round(payload.bounds.height)}px`;
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
      @page { size: ${pageWidthCss} ${pageHeightCss}; margin: 0; }
      @font-face {
        font-family: "HEJI2Text";
        src: url("/src/HEJI2Text.otf") format("opentype");
        font-display: swap;
      }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: white; overflow: hidden; }
      body { display: block; }
      svg { width: ${pageWidthCss}; height: ${pageHeightCss}; display: block; }
    </style>
  </head>
  <body>
    ${payload.svgText}
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
  syncSharedNotesAcrossModes();
  scheduleRender(90);
});

if (ratioRootNoteInput) {
  ratioRootNoteInput.addEventListener("change", () => {
    if (ratioRootNoteInput.value !== RATIO_ROOT_CUSTOM_VALUE) {
      const midi = Number(ratioRootNoteInput.value);
      if (Number.isFinite(midi)) {
        state.ratioRootHz = midiToFrequency(midi, Math.max(1, state.a4Hz));
        ratioRootHzInput.value = formatHzValue(state.ratioRootHz);
      }
    }
    syncRatioRootCustomInputVisibility();
    scheduleRender();
  });
}

if (ratioRootNoteCustomInput) {
  ratioRootNoteCustomInput.addEventListener("input", () => {
    state.ratioRootNoteCustom = ratioRootNoteCustomInput.value;
    scheduleRender();
  });
}

ratioRootHzInput.addEventListener("input", () => {
  state.ratioRootHz = Math.max(0.01, getNumericInputValue(ratioRootHzInput, 220));
  syncRatioRootNoteSelectFromFrequency();
  scheduleRender();
});

a4HzInput.addEventListener("input", () => {
  state.a4Hz = Math.max(1, getNumericInputValue(a4HzInput, 440));
  if (ratioRootNoteInput && ratioRootNoteInput.value !== RATIO_ROOT_CUSTOM_VALUE) {
    const midi = Number(ratioRootNoteInput.value);
    if (Number.isFinite(midi)) {
      state.ratioRootHz = midiToFrequency(midi, state.a4Hz);
      ratioRootHzInput.value = formatHzValue(state.ratioRootHz);
    }
  }
  updateRatioRootNoteOptions();
  syncRatioRootNoteSelectFromFrequency();
  scheduleRender();
});

if (viewZoomInput) {
  viewZoomInput.addEventListener("input", () => {
    state.viewZoom = clamp(getNumericInputValue(viewZoomInput, 1), 0.3, 3);
    if (viewZoomReadout) {
      viewZoomReadout.textContent = `${Math.round(state.viewZoom * 100)}%`;
    }
    scheduleRender(0);
  });
}

if (layoutScaleInput) {
  layoutScaleInput.addEventListener("input", () => {
    state.layoutScale = clamp(getNumericInputValue(layoutScaleInput, 1), 0.6, 1.8);
    if (layoutScaleReadout) {
      layoutScaleReadout.textContent = `${Math.round(state.layoutScale * 100)}%`;
    }
    scheduleRender();
  });
}

if (printHeightInput) {
  printHeightInput.addEventListener("input", () => {
    state.printGraphHeight = clamp(getNumericInputValue(printHeightInput, 1), 0.45, 1);
    if (printHeightReadout) {
      printHeightReadout.textContent = `${Math.round(state.printGraphHeight * 100)}%`;
    }
    scheduleRender();
  });
}

overtoneCountInput.addEventListener("input", () => {
  state.overtoneCount = clamp(Math.round(getNumericInputValue(overtoneCountInput, 8)), 2, 48);
  scheduleRender();
});

yScaleInput.addEventListener("change", () => {
  state.yScale = yScaleInput.value === "linear" ? "linear" : "log";
  scheduleRender();
});

if (harmonicScalingInput) {
  harmonicScalingInput.addEventListener("change", () => {
    const mode = harmonicScalingInput.value;
    if (mode === "pink" || mode === "sqrt" || mode === "flat" || mode === "steep") {
      state.harmonicScalingMode = mode;
    } else {
      state.harmonicScalingMode = "pink";
      harmonicScalingInput.value = "pink";
    }
    refreshActiveVoicesFromState();
    scheduleRender();
  });
}

if (colorSchemeInput) {
  colorSchemeInput.addEventListener("change", () => {
    const next = colorSchemeInput.value;
    if (isPrintMode()) {
      if (next === "greyscale" || isColorSchemeId(next)) {
        state.printColorMode = next;
      } else {
        state.printColorMode = "greyscale";
        colorSchemeInput.value = "greyscale";
      }
    } else {
      if (isColorSchemeId(next)) {
        state.colorScheme = next;
      } else {
        state.colorScheme = "hayward-vine";
        colorSchemeInput.value = state.colorScheme;
      }
    }
    scheduleRender();
  });
}

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

if (stackLineSizeInput) {
  stackLineSizeInput.addEventListener("input", () => {
    state.stackLineSize = clamp(getNumericInputValue(stackLineSizeInput, 100) / 100, 0.25, 3);
    scheduleRender();
  });
}

if (alphaFalloffInput) {
  alphaFalloffInput.addEventListener("change", () => {
    state.alphaFalloff = alphaFalloffInput.checked;
    scheduleRender();
  });
}

if (comboSizeInput) {
  comboSizeInput.addEventListener("input", () => {
    state.comboSize = clamp(getNumericInputValue(comboSizeInput, 4), 2, 10);
    scheduleRender();
  });
}

showAlignmentsInput.addEventListener("change", () => {
  state.showAlignments = showAlignmentsInput.checked;
  scheduleRender();
});

if (showLabelsInput) {
  showLabelsInput.addEventListener("change", () => {
    state.showLabels = showLabelsInput.checked;
    scheduleRender();
  });
}

if (showOvertoneNumbersInput) {
  showOvertoneNumbersInput.addEventListener("change", () => {
    state.showOvertoneNumbers = showOvertoneNumbersInput.checked;
    scheduleRender();
  });
}

if (showStemsInput) {
  showStemsInput.addEventListener("change", () => {
    state.showStems = showStemsInput.checked;
    scheduleRender();
  });
}

showCombinationInput.addEventListener("change", () => {
  state.showCombination = showCombinationInput.checked;
  enforceComboLegendVisibility();
  scheduleRender();
});

if (showChordControlsInput) {
  showChordControlsInput.addEventListener("change", () => {
    state.showChordControls = showChordControlsInput.checked;
    scheduleRender();
  });
}

if (showFusionInput) {
  showFusionInput.addEventListener("change", () => {
    state.showFusion = showFusionInput.checked;
    scheduleRender();
  });
}

if (fusionReadoutRatioInput) {
  fusionReadoutRatioInput.addEventListener("change", () => {
    state.fusionReadoutRatio = fusionReadoutRatioInput.checked;
    scheduleRender();
  });
}

if (fusionReadoutHzInput) {
  fusionReadoutHzInput.addEventListener("change", () => {
    state.fusionReadoutHz = fusionReadoutHzInput.checked;
    scheduleRender();
  });
}

if (fusionModeInput) {
  fusionModeInput.addEventListener("change", () => {
    state.fusionMode = fusionModeInput.value === "all" ? "all" : "align";
    scheduleRender();
  });
}

if (fusionClusterCentsInput) {
  fusionClusterCentsInput.addEventListener("input", () => {
    state.fusionClusterCents = clamp(getNumericInputValue(fusionClusterCentsInput, 1), 0, 4);
    scheduleRender();
  });
}

if (fusionScaleInput) {
  fusionScaleInput.addEventListener("input", () => {
    state.fusionScale = clamp(getNumericInputValue(fusionScaleInput, 100) / 100, 0.5, 1.5);
    scheduleRender(0);
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
  enforceComboLegendVisibility();
  scheduleRender();
});

comboSumInput.addEventListener("change", () => {
  state.showComboSum = comboSumInput.checked;
  enforceComboLegendVisibility();
  scheduleRender();
});

comboOrder2Input.addEventListener("change", () => {
  state.showComboOrder2 = comboOrder2Input.checked;
  enforceComboLegendVisibility();
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

if (exportWidthInput) {
  exportWidthInput.addEventListener("input", () => {
    state.exportWidth = clampExportSize(getNumericInputValue(exportWidthInput, 1800), 1800);
    scheduleStateUrlUpdate();
  });
}

if (exportHeightInput) {
  exportHeightInput.addEventListener("input", () => {
    state.exportHeight = clampExportSize(getNumericInputValue(exportHeightInput, 1100), 1100);
    scheduleStateUrlUpdate();
  });
}

themeToggle.addEventListener("change", () => {
  if (isPrintMode()) {
    themeToggle.checked = false;
    state.themeDark = false;
    document.body.classList.remove("theme-dark");
    scheduleRender();
    return;
  }
  state.themeDark = themeToggle.checked;
  document.body.classList.toggle("theme-dark", state.themeDark);
  scheduleRender();
});

exportSvgButton.addEventListener("click", exportSvg);
exportPdfButton.addEventListener("click", exportPdf);
if (saveChartButton) {
  saveChartButton.addEventListener("click", () => {
    saveChartToFile();
  });
}
if (openChartButton) {
  openChartButton.addEventListener("click", () => {
    openChartInput?.click();
  });
}
if (openChartInput) {
  openChartInput.addEventListener("change", async () => {
    const file = openChartInput.files?.[0] || null;
    openChartInput.value = "";
    if (!file) {
      return;
    }
    await openChartFromFile(file);
  });
}

if (modeLiveButton) {
  modeLiveButton.addEventListener("click", () => {
    setAppMode(MODE_LIVE);
  });
}

if (modePrintButton) {
  modePrintButton.addEventListener("click", () => {
    setAppMode(MODE_PRINT);
  });
}

if (printPaperInput) {
  printPaperInput.addEventListener("change", () => {
    state.printPaper = printPaperInput.value || "letter-landscape";
    scheduleRender();
  });
}

if (printMarginInput) {
  printMarginInput.addEventListener("input", () => {
    state.printMargin = clamp(getNumericInputValue(printMarginInput, 44), 8, 220);
    scheduleRender();
  });
}

if (printShowComponentLabelInput) {
  printShowComponentLabelInput.addEventListener("change", () => {
    state.printShowComponentLabel = printShowComponentLabelInput.checked;
    scheduleRender();
  });
}

if (printShowComponentHzInput) {
  printShowComponentHzInput.addEventListener("change", () => {
    state.printShowComponentHz = printShowComponentHzInput.checked;
    scheduleRender();
  });
}

if (printShowComponentRatioInput) {
  printShowComponentRatioInput.addEventListener("change", () => {
    state.printShowComponentRatio = printShowComponentRatioInput.checked;
    scheduleRender();
  });
}

if (printShowComponentNoteInput) {
  printShowComponentNoteInput.addEventListener("change", () => {
    state.printShowComponentNote = printShowComponentNoteInput.checked;
    scheduleRender();
  });
}

if (printShowAxisTextInput) {
  printShowAxisTextInput.addEventListener("change", () => {
    state.printShowAxisText = printShowAxisTextInput.checked;
    scheduleRender();
  });
}

if (printShowLegendInput) {
  printShowLegendInput.addEventListener("change", () => {
    state.printShowLegend = printShowLegendInput.checked;
    scheduleRender();
  });
}

if (printDistanceModeInput) {
  printDistanceModeInput.addEventListener("change", () => {
    state.printDistanceMode = printDistanceModeInput.checked;
    if (!state.printDistanceMode) {
      printDistancePendingKey = null;
    }
    scheduleRender();
  });
}

async function handleAddCustomTextButtonPress(event, trigger = "unknown") {
  if (event && Number.isFinite(event.button) && event.button !== 0) {
    return;
  }
  const actionId = nextCustomActionId();
  event?.preventDefault();
  event?.stopPropagation();
  if (customTextModal && !customTextModal.hidden && customTextDialogResolver) {
    customTextInput?.focus();
    return;
  }
  await ensurePrintModeReadyForPanelAction({ source: "add-custom-text", actionId, trigger });
  forceResetCustomTextDialog("add-custom-text:pre-open-reset");
  if (customTextModal && !customTextModal.hidden && customTextDialogResolver) {
    customTextInput?.focus();
    return;
  }
  pendingCustomLabelTarget = false;
  pendingCustomLabelActionId = 0;
  state.printDistanceMode = false;
  printDistancePendingKey = null;
  if (printDistanceModeInput) {
    printDistanceModeInput.checked = false;
  }
  syncControlReadouts();
  const result = await openCustomTextDialog("");
  if (!result || !result.text?.trim()) {
    return;
  }
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: String(result.text || ""),
    font: String(state.printCustomLabelFont || "Noto Serif"),
    size: clamp(Number(state.printCustomLabelSize ?? 18), 8, 72),
    x: Number.isFinite(lastDiagramCenter.x) ? lastDiagramCenter.x : 640,
    y: Number.isFinite(lastDiagramCenter.y) ? lastDiagramCenter.y : 360,
  };
  state.printCustomTexts = [...(state.printCustomTexts || []), item];
  state.printSelectedCustomTextId = item.id;
  scheduleRender();
  scheduleStateUrlUpdate();
}

async function handleAddCustomLabelButtonPress(event, trigger = "unknown") {
  if (event && Number.isFinite(event.button) && event.button !== 0) {
    return;
  }
  const actionId = nextCustomActionId();
  event?.preventDefault();
  event?.stopPropagation();
  await ensurePrintModeReadyForPanelAction({ source: "add-custom-label", actionId, trigger });
  pendingCustomLabelTarget = true;
  pendingCustomLabelActionId = actionId;
  state.printDistanceMode = false;
  printDistancePendingKey = null;
  if (printDistanceModeInput) {
    printDistanceModeInput.checked = false;
  }
  syncControlReadouts();
  scheduleRender(0);
}

if (printAddCustomTextButton) {
  printAddCustomTextButton.addEventListener("pointerdown", (event) => {
    void handleAddCustomTextButtonPress(event, "pointerdown");
  });
  printAddCustomTextButton.addEventListener("click", (event) => {
    if (event.detail !== 0) {
      return;
    }
    void handleAddCustomTextButtonPress(event, "click-keyboard");
  });
}

if (printAddCustomLabelButton) {
  printAddCustomLabelButton.addEventListener("pointerdown", (event) => {
    void handleAddCustomLabelButtonPress(event, "pointerdown");
  });
  printAddCustomLabelButton.addEventListener("click", (event) => {
    if (event.detail !== 0) {
      return;
    }
    void handleAddCustomLabelButtonPress(event, "click-keyboard");
  });
}

if (printCustomSelectedTextInput) {
  printCustomSelectedTextInput.addEventListener("input", () => {
    if (!isPrintMode() || syncingCustomInspector) {
      return;
    }
    if (updateSelectedCustomTextItem({ text: String(printCustomSelectedTextInput.value || "") })) {
      scheduleRender(0);
      scheduleStateUrlUpdate();
    }
  });
}

if (printCustomSelectedFontInput) {
  printCustomSelectedFontInput.addEventListener("change", () => {
    if (!isPrintMode() || syncingCustomInspector) {
      return;
    }
    const font = printCustomSelectedFontInput.value || "Noto Serif";
    if (updateSelectedCustomTextItem({ font })) {
      scheduleRender();
      scheduleStateUrlUpdate();
    }
  });
}

if (printCustomSelectedSizeInput) {
  printCustomSelectedSizeInput.addEventListener("input", () => {
    if (!isPrintMode() || syncingCustomInspector) {
      return;
    }
    const size = clamp(getNumericInputValue(printCustomSelectedSizeInput, 18), 8, 72);
    if (printCustomSelectedSizeReadout) {
      printCustomSelectedSizeReadout.textContent = String(size);
    }
    if (updateSelectedCustomTextItem({ size })) {
      scheduleRender(0);
      scheduleStateUrlUpdate();
    }
  });
}

if (printCustomDeleteSelectedButton) {
  printCustomDeleteSelectedButton.addEventListener("click", () => {
    if (!isPrintMode()) {
      return;
    }
    const selected = getSelectedCustomTextItem();
    if (!selected) {
      return;
    }
    state.printCustomTexts = (state.printCustomTexts || []).filter((item) => item.id !== selected.id);
    state.printSelectedCustomTextId = null;
    scheduleRender();
    scheduleStateUrlUpdate();
  });
}

if (customTextSaveButton) {
  customTextSaveButton.addEventListener("click", () => {
    const text = String(customTextInput?.value || "");
    closeCustomTextDialog({ text }, "save-button");
  });
}

if (customTextCancelButton) {
  customTextCancelButton.addEventListener("click", () => {
    closeCustomTextDialog(null, "cancel-button");
  });
}

if (customTextModal) {
  customTextModal.addEventListener("pointerdown", (event) => {
    if (event.target === customTextModal) {
      const elapsedMs = customTextDialogOpenedAt > 0 ? Date.now() - customTextDialogOpenedAt : Infinity;
      // Ignore backdrop dismiss in the first moment after opening to avoid
      // accidental close from rapid clicking while entering this mode.
      if (elapsedMs < 280) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      closeCustomTextDialog(null, "backdrop-pointerdown");
    }
  });
}

if (customTextInput) {
  customTextInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "enter") {
      event.preventDefault();
      customTextSaveButton?.click();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeCustomTextDialog(null, "escape-key");
    }
  });
}

if (printDistanceShowRatioInput) {
  printDistanceShowRatioInput.addEventListener("change", () => {
    state.printDistanceShowRatio = printDistanceShowRatioInput.checked;
    scheduleRender();
  });
}

if (printDistanceShowHzInput) {
  printDistanceShowHzInput.addEventListener("change", () => {
    state.printDistanceShowHz = printDistanceShowHzInput.checked;
    scheduleRender();
  });
}

if (printDistanceShowIntervalInput) {
  printDistanceShowIntervalInput.addEventListener("change", () => {
    state.printDistanceShowInterval = printDistanceShowIntervalInput.checked;
    scheduleRender();
  });
}

if (printStyleOvertoneFontInput) {
  printStyleOvertoneFontInput.addEventListener("change", () => {
    setPrintAutoTextStyle("overtone", { font: printStyleOvertoneFontInput.value });
    scheduleRender();
    scheduleStateUrlUpdate();
  });
}
if (printStyleOvertoneSizeInput) {
  printStyleOvertoneSizeInput.addEventListener("input", () => {
    const size = clamp(getNumericInputValue(printStyleOvertoneSizeInput, 8.5), 8, 72);
    if (printStyleOvertoneSizeReadout) printStyleOvertoneSizeReadout.textContent = `${size}`;
    setPrintAutoTextStyle("overtone", { size });
    scheduleRender(0);
    scheduleStateUrlUpdate();
  });
}
if (printStyleComponentFontInput) {
  printStyleComponentFontInput.addEventListener("change", () => {
    setPrintAutoTextStyle("component", { font: printStyleComponentFontInput.value });
    scheduleRender();
    scheduleStateUrlUpdate();
  });
}
if (printStyleComponentSizeInput) {
  printStyleComponentSizeInput.addEventListener("input", () => {
    const size = clamp(getNumericInputValue(printStyleComponentSizeInput, 9.5), 8, 72);
    if (printStyleComponentSizeReadout) printStyleComponentSizeReadout.textContent = `${size}`;
    setPrintAutoTextStyle("component", { size });
    scheduleRender(0);
    scheduleStateUrlUpdate();
  });
}
if (printStyleAxisFontInput) {
  printStyleAxisFontInput.addEventListener("change", () => {
    setPrintAutoTextStyle("axis", { font: printStyleAxisFontInput.value });
    scheduleRender();
    scheduleStateUrlUpdate();
  });
}
if (printStyleAxisSizeInput) {
  printStyleAxisSizeInput.addEventListener("input", () => {
    const size = clamp(getNumericInputValue(printStyleAxisSizeInput, 11), 8, 72);
    if (printStyleAxisSizeReadout) printStyleAxisSizeReadout.textContent = `${size}`;
    setPrintAutoTextStyle("axis", { size });
    scheduleRender(0);
    scheduleStateUrlUpdate();
  });
}

if (printResetLayoutButton) {
  printResetLayoutButton.addEventListener("click", () => {
    resetPrintLayoutState();
    scheduleRender();
  });
}

if (printRestoreHiddenButton) {
  printRestoreHiddenButton.addEventListener("click", () => {
    restorePrintHiddenState();
    scheduleRender();
  });
}

window.addEventListener("resize", () => {
  scheduleRender(40);
});

window.addEventListener("pagehide", () => {
  updateStateUrl();
});

window.addEventListener("beforeunload", () => {
  saveStateToStorage();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveStateToStorage();
  }
});

window.addEventListener("keydown", (event) => {
  if (isPrintMode()) {
    if (
      event.key === "Escape" &&
      pendingCustomLabelTarget &&
      !(customTextModal && !customTextModal.hidden)
    ) {
      pendingCustomLabelTarget = false;
      pendingCustomLabelActionId = 0;
      syncControlReadouts();
      scheduleRender(0);
    }
    return;
  }
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
  if (isPrintMode()) {
    return;
  }
  if (event.key === "l" || event.key === "L") {
    lKeyHeld = false;
    commitLfoArmIfNeeded();
  }
});

populateRatioRootNotes();
updateRatioRootNoteOptions();
if (ratioRootNoteCustomInput) {
  ratioRootNoteCustomInput.value = state.ratioRootNoteCustom;
}
syncRatioRootNoteSelectFromFrequency();

const initialUrlState = readStateFromUrl();
const initialStoredState = readStateFromStorage();
const preferredInitialState = chooseInitialSerializedState(initialUrlState, initialStoredState);
if (
  !applySerializedState(preferredInitialState) &&
  !applySerializedState(initialUrlState) &&
  !applySerializedState(initialStoredState)
) {
  applyStateSnapshot(preferredInitialState || initialUrlState || initialStoredState);
  modeSnapshots[MODE_LIVE] = getStateSnapshotFlat();
  const printSeed = getStateSnapshotFlat();
  printSeed.themeDark = false;
  printSeed.printDistanceMode = false;
  modeSnapshots[MODE_PRINT] = printSeed;
  appMode = MODE_LIVE;
}
finalizeLoadedState();
