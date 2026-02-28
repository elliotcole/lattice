import { customOscillators } from "../src/custom-oscillators";
import intervalChartData from "../src/interval-names.json";

const SVG_NS = "http://www.w3.org/2000/svg";

const chartStage = document.getElementById("chart-stage");
const tooltipEl = document.getElementById("chart-tooltip");
const statusEl = document.getElementById("status");
const modeLiveButton = document.getElementById("mode-live");
const modePrintButton = document.getElementById("mode-print");

const notesInput = document.getElementById("notes-input");
const ratioRootHzInput = document.getElementById("ratio-root-hz");
const a4HzInput = document.getElementById("a4-hz");
const viewZoomInput = document.getElementById("view-zoom");
const viewZoomReadout = document.getElementById("view-zoom-readout");
const layoutScaleInput = document.getElementById("layout-scale");
const layoutScaleReadout = document.getElementById("layout-scale-readout");
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
const printPaperInput = document.getElementById("print-paper");
const printMarginInput = document.getElementById("print-margin");
const printShowComponentLabelInput = document.getElementById("print-show-component-label");
const printShowComponentHzInput = document.getElementById("print-show-component-hz");
const printShowComponentRatioInput = document.getElementById("print-show-component-ratio");
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
const customTextInspector = document.getElementById("custom-text-inspector");
const printCustomSelectedTextInput = document.getElementById("print-custom-selected-text");
const printCustomSelectedFontInput = document.getElementById("print-custom-selected-font");
const printCustomSelectedSizeInput = document.getElementById("print-custom-selected-size");
const printCustomSelectedSizeReadout = document.getElementById("print-custom-selected-size-readout");
const printCustomDeleteSelectedButton = document.getElementById("print-custom-delete-selected");

const customTextModal = document.getElementById("custom-text-modal");
const customTextModalTitle = customTextModal?.querySelector("h3") || null;
const customTextInput = document.getElementById("custom-text-input");
const customTextFontInput = document.getElementById("custom-text-font");
const customTextSizeInput = document.getElementById("custom-text-size");
const customTextSizeReadout = document.getElementById("custom-text-size-readout");
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

const state = {
  notesText: notesInput.value,
  ratioRootHz: Number(ratioRootHzInput.value) || 220,
  a4Hz: Number(a4HzInput.value) || 440,
  viewZoom: Number(viewZoomInput?.value) || 1,
  layoutScale: Number(layoutScaleInput?.value) || 1,
  overtoneCount: Number(overtoneCountInput.value) || 8,
  yScale: yScaleInput.value === "linear" ? "linear" : "log",
  harmonicScalingMode: harmonicScalingInput?.value || "pink",
  colorScheme: colorSchemeInput?.value || "hayward-vine",
  autoRange: autoRangeInput.checked,
  rangeMin: Number(rangeMinInput.value) || 40,
  rangeMax: Number(rangeMaxInput.value) || 6000,
  alignToleranceCents: Number(alignToleranceInput.value) || 1,
  pointSize: Number(pointSizeInput.value) || 4,
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
  printShowAxisText: printShowAxisTextInput ? printShowAxisTextInput.checked : true,
  printShowLegend: printShowLegendInput ? printShowLegendInput.checked : true,
  printDistanceMode: printDistanceModeInput ? printDistanceModeInput.checked : false,
  printCustomLabelFont: customTextFontInput?.value || "Noto Serif",
  printCustomLabelSize: Number(customTextSizeInput?.value ?? 18) || 18,
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
  printComboLinksVisible: {},
  printChordTitleOverrides: {},
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

function cloneJson(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function getStateSnapshotFlat() {
  return {
    notesText: state.notesText,
    ratioRootHz: state.ratioRootHz,
    a4Hz: state.a4Hz,
    viewZoom: state.viewZoom,
    layoutScale: state.layoutScale,
    overtoneCount: state.overtoneCount,
    yScale: state.yScale,
    harmonicScalingMode: state.harmonicScalingMode,
    colorScheme: state.colorScheme,
    autoRange: state.autoRange,
    rangeMin: state.rangeMin,
    rangeMax: state.rangeMax,
    alignToleranceCents: state.alignToleranceCents,
    pointSize: state.pointSize,
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
    printComboLinksVisible: cloneJson(state.printComboLinksVisible, {}),
    printChordTitleOverrides: cloneJson(state.printChordTitleOverrides, {}),
  };
}

function getSerializedState() {
  modeSnapshots[appMode] = getStateSnapshotFlat();
  if (!modeSnapshots[MODE_LIVE]) {
    modeSnapshots[MODE_LIVE] = getStateSnapshotFlat();
  }
  if (!modeSnapshots[MODE_PRINT]) {
    const seed = getStateSnapshotFlat();
    seed.themeDark = false;
    seed.printDistanceMode = false;
    modeSnapshots[MODE_PRINT] = seed;
  }
  return {
    mode: appMode,
    live: modeSnapshots[MODE_LIVE],
    print: modeSnapshots[MODE_PRINT],
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
    if (Number.isFinite(snapshot.viewZoom) && viewZoomInput) {
      state.viewZoom = clamp(Number(snapshot.viewZoom), 0.3, 3);
      viewZoomInput.value = String(state.viewZoom);
    }
    if (Number.isFinite(snapshot.layoutScale) && layoutScaleInput) {
      state.layoutScale = clamp(Number(snapshot.layoutScale), 0.6, 1.8);
      layoutScaleInput.value = String(state.layoutScale);
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
      if (customTextFontInput) {
        customTextFontInput.value = snapshot.printCustomLabelFont;
      }
    }
    if (Number.isFinite(snapshot.printCustomLabelSize)) {
      state.printCustomLabelSize = clamp(Number(snapshot.printCustomLabelSize), 8, 72);
      if (customTextSizeInput) {
        customTextSizeInput.value = String(state.printCustomLabelSize);
      }
      if (customTextSizeReadout) {
        customTextSizeReadout.textContent = String(state.printCustomLabelSize);
      }
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
    if (snapshot.printComboLinksVisible && typeof snapshot.printComboLinksVisible === "object") {
      state.printComboLinksVisible = cloneJson(snapshot.printComboLinksVisible, {});
    }
    if (snapshot.printChordTitleOverrides && typeof snapshot.printChordTitleOverrides === "object") {
      state.printChordTitleOverrides = cloneJson(snapshot.printChordTitleOverrides, {});
    }
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
  printDistancePendingKey = null;
}

function setAppMode(nextMode, { skipRender = false } = {}) {
  const mode = nextMode === MODE_PRINT ? MODE_PRINT : MODE_LIVE;
  if (mode === appMode) {
    syncModeButtons();
    return;
  }
  modeSnapshots[appMode] = getStateSnapshotFlat();
  appMode = mode;
  const snap = modeSnapshots[mode];
  if (snap && typeof snap === "object") {
    applyStateSnapshot(snap);
  } else {
    modeSnapshots[mode] = getStateSnapshotFlat();
  }
  if (appMode === MODE_PRINT) {
    hardAllNotesOff();
    lKeyHeld = false;
    state.themeDark = false;
    themeToggle.checked = false;
    document.body.classList.remove("theme-dark");
  } else {
    printDistancePendingKey = null;
    closeCustomTextDialog(null);
  }
  syncModeButtons();
  if (!skipRender) {
    scheduleRender();
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

function formatAxisHzCompact(freq) {
  if (!Number.isFinite(freq)) {
    return "";
  }
  if (freq >= 1000) {
    return `${Math.round(freq / 1000)} kHz`;
  }
  return `${Math.round(freq)} Hz`;
}

function gcdInt(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
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
  const g = gcdInt(bestNum, bestDen);
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

  Array.from(playingTargets.keys()).forEach((key) => {
    if (groups.allChordKeys.has(key)) {
      playingTargets.delete(key);
      lfoTargetStates.delete(key);
      return;
    }
    if (typeof key === "string" && key.startsWith("combo:")) {
      const comboMeta = parseComboPlayKey(key);
      if (comboMeta && noteSet.has(comboMeta.noteA) && noteSet.has(comboMeta.noteB)) {
        playingTargets.delete(key);
        lfoTargetStates.delete(key);
      }
    }
  });

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

function annotateFusionNodesWithAlignment(fusionNodes, alignmentClusters, matchToleranceCents) {
  const nodes = Array.isArray(fusionNodes) ? fusionNodes : [];
  const clusters = Array.isArray(alignmentClusters) ? alignmentClusters : [];
  const tol = Math.max(0, Number(matchToleranceCents) || 0);
  if (!nodes.length) {
    return [];
  }
  return nodes.map((node) => {
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
        best = {
          id: cluster.id,
          centerFreq: cluster.centerFreq,
          memberCount,
          uniqueNotes: Number(cluster.uniqueNotes) || 0,
          memberPlayKeys: (cluster.points || [])
            .map((point) => point?.playKey)
            .filter(Boolean),
          delta,
        };
      }
    });
    return {
      ...node,
      alignmentClusterId: best?.id || "",
      alignmentCenterFreq: best?.centerFreq || NaN,
      alignmentMemberCount: best?.memberCount || 0,
      alignmentUniqueNotes: best?.uniqueNotes || 0,
      alignmentMemberPlayKeys: best?.memberPlayKeys || [],
      alignmentDeltaCents: best?.delta ?? Infinity,
      labelEligible: (best?.memberCount || 0) > 1,
    };
  });
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

function buildFusionAllModeNodes(points, toleranceCents) {
  if (!points.length) {
    return [];
  }
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
    const hasCombo = comboPoints.length > 0;
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
    const radius = clamp(Math.max(allModeRadius, alignOnlyFloor), 3, 22);
    const shape = hasHarmonic ? "circle" : "diamond";
    return {
      id: index,
      centerFreq,
      shape,
      radius,
      alignStrength,
      naturalShare,
      hasCombo,
      hasHarmonic,
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
  const harmonicBase = palette?.fusion?.harmonic || "#c56a42";
  const comboBase = palette?.fusion?.combo || "#4a8f81";
  if (fusionMode === "all") {
    const naturalShare = clamp(Number(node.naturalShare) || 0, 0, 1);
    const alignStrength = clamp(Number(node.alignStrength) || 0, 0, 1);
    const radius = clamp(Number(node.radius) || 3, 2, 24);
    if (node.shape === "diamond") {
      const fillBase = mixHex(comboBase, "#ffffff", themeDark ? 0.1 : 0.18);
      const fill = mixHex(fillBase, "#ffffff", 0.28 * (1 - alignStrength));
      const stroke = mixHex(comboBase, "#000000", 0.2 + alignStrength * 0.35);
      return {
        shape: "diamond",
        radius,
        fill,
        fillOpacity: 0.24 + alignStrength * 0.56,
        stroke,
        strokeOpacity: 0.45 + alignStrength * 0.35,
        strokeWidth: 0.9 + alignStrength * 1.2,
      };
    }
    const harmonicMix = mixHex(comboBase, harmonicBase, 0.25 + naturalShare * 0.75);
    const fill = mixHex(harmonicMix, "#ffffff", (themeDark ? 0.18 : 0.24) * (1 - alignStrength));
    const stroke = mixHex(harmonicMix, "#000000", 0.18 + alignStrength * 0.3);
    return {
      shape: "circle",
      radius,
      fill,
      fillOpacity: 0.22 + alignStrength * 0.6,
      stroke,
      strokeOpacity: 0.35 + alignStrength * 0.42,
      strokeWidth: 0.9 + alignStrength * 1.2,
    };
  }

  const strength = clamp(Number(node.strength) || 0, 0, 1);
  const naturalShare = clamp(Number(node.naturalShare) || 0, 0, 1);
  const radius = clamp(3 + strength * 18, 3, 26);
  const alignColor = mixHex(comboBase, harmonicBase, 0.32 + naturalShare * 0.68);
  const fill = mixHex(alignColor, "#ffffff", (themeDark ? 0.15 : 0.22) * (1 - strength));
  const stroke = mixHex(alignColor, "#000000", 0.2 + strength * 0.32);
  return {
    shape: "circle",
    radius,
    fill,
    fillOpacity: 0.22 + strength * 0.62,
    stroke,
    strokeOpacity: 0.35 + strength * 0.4,
    strokeWidth: 0.9 + strength * 1.1,
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
Typical |f2-f1|: ${deltaHz.toFixed(2)} Hz
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
    combo: { difference: "#d45d4c", sum: "#b6802e", order2: "#6e58b4" },
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
    combo: { difference: "#ff2f1f", sum: "#ffc400", order2: "#1764ff" },
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
    combo: { difference: "#ff1493", sum: "#00e676", order2: "#00b0ff" },
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
    combo: { difference: "#ff4d94", sum: "#ff9d00", order2: "#7f5bff" },
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
    combo: { difference: "#b45309", sum: "#eab308", order2: "#0f766e" },
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

let customTextDialogResolver = null;

function openCustomTextDialog(initialText = "", options = {}) {
  if (!isPrintMode() || !customTextModal || !customTextInput) {
    return Promise.resolve(null);
  }
  if (customTextDialogResolver) {
    customTextDialogResolver(null);
    customTextDialogResolver = null;
  }
  customTextDialogMode = options.mode === "style" ? "style" : "custom";
  customTextInput.value = String(initialText || "");
  const modalFont = String(options.font || state.printCustomLabelFont || "Noto Serif");
  const modalSize = clamp(
    Number(options.size ?? state.printCustomLabelSize ?? 18),
    8,
    72
  );
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
  if (customTextFontInput) {
    customTextFontInput.value = modalFont;
  }
  if (customTextSizeInput) {
    customTextSizeInput.value = String(modalSize);
  }
  if (customTextSizeReadout) {
    customTextSizeReadout.textContent = String(modalSize);
  }
  customTextModal.hidden = false;
  customTextModal.style.display = "grid";
  if (customTextDialogMode === "style") {
    customTextFontInput?.focus();
  } else {
    customTextInput.focus();
    customTextInput.select();
  }
  return new Promise((resolve) => {
    customTextDialogResolver = resolve;
  });
}

function closeCustomTextDialog(result) {
  if (!customTextModal) {
    return;
  }
  customTextModal.hidden = true;
  customTextModal.style.display = "none";
  customTextDialogMode = "custom";
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
    const fusionCoincidentPoints = filterFusionCoincidentPoints(
      chordPoints,
      clamp(state.fusionClusterCents, 0, 4),
      beatMin,
      beatMax
    );
    const rawFusionNodes =
      state.fusionMode === "all"
        ? buildFusionAllModeNodes(chordPoints, clamp(state.fusionClusterCents, 0, 4))
        : buildFusionDensityClusters(
            fusionCoincidentPoints,
            clamp(state.fusionClusterCents, 0, 4)
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
    const fusionNodes = annotateFusionNodesWithAlignment(
      rawFusionNodes,
      alignmentClusters,
      fusionAlignmentMatchCents
    );
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
  const axisStrokeW = inPrintMode ? 1.8 : 1.4;
  const columnStrokeW = inPrintMode ? 0.7 : 1;
  const stemStrokeW = inPrintMode ? 0.8 : 1;
  const stemOpacity = inPrintMode ? 0.18 : 0.26;

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
  const slotEntries = [];
  chordsForLayout.forEach((chord, chordIndex) => {
    chord.noteIndexes.forEach((noteIndex) => {
      slotEntries.push({ type: "note", chordIndex, noteIndex, width: 1 });
    });
    if (useAlignmentLabelLane) {
      slotEntries.push({ type: "alignlabel", chordIndex, width: 1.15 });
    }
    if (state.showFusion) {
      slotEntries.push({ type: "fusion", chordIndex, width: 0.92 });
    }
    if (state.showRoughness) {
      slotEntries.push({ type: "rough", chordIndex, width: 0.92 });
    }
    if (chordIndex < chordsForLayout.length - 1) {
      slotEntries.push({ type: "gap", width: useAlignmentLabelLane ? 0.9 : 0.68 });
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
  const alignLabelLaneXByChord = {};
  let unitCursor = 0;
  slotEntries.forEach((entry) => {
    const widthUnits = entry.width || 1;
    const x = noteBand.left + (unitCursor + widthUnits / 2) * slotUnitWidth;
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
  const plotTop = inPrintMode ? pageInnerTop + clamp(pageHeight * 0.01, 8, 16) : 24;
  const bottomReserve = resolveBottomReserve(
    inPrintMode,
    xLabelMode,
    model.notes.length,
    showChordControls
  );
  const rawPlotBottom = (inPrintMode ? pageInnerBottom : height) - bottomReserve;
  const maxPlotBottom = inPrintMode ? pageInnerBottom : height - 8;
  const plotBottom = Math.min(maxPlotBottom, Math.max(plotTop + 64, rawPlotBottom));
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
  const printComponentMeta = {};
  const maxFusionRadiusByChord = {};
  const isPrintHidden = (key) =>
    inPrintMode && key && typeof state.printHiddenKeys === "object" && state.printHiddenKeys[key];

  const yForFreq = yMapper(model.rangeMin, model.rangeMax, plotTop, plotBottom, state.yScale);
  const ticks = state.yScale === "log" ? logTicks(model.rangeMin, model.rangeMax) : linearTicks(model.rangeMin, model.rangeMax);
  const showPrintAxisText = !inPrintMode || state.printShowAxisText;
  const sceneScale = clamp(Number(state.layoutScale) || 1, 0.6, 1.8);
  const sceneAnchorX = plotLeft;
  const sceneAnchorY = plotTop;
  const sceneShiftX = sceneAnchorX * (1 - sceneScale);
  const sceneShiftY = sceneAnchorY * (1 - sceneScale);

  const svg = createSvgEl("svg", {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    "aria-label": "Overtones chart",
    role: "img",
    "data-scene-shift-x": sceneShiftX,
    "data-scene-shift-y": sceneShiftY,
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
    })
  );
  axisLayer.appendChild(
    createSvgEl("line", {
      x1: plotLeft,
      y1: plotBottom,
      x2: plotRight,
      y2: plotBottom,
      stroke: axisColor,
      "stroke-width": axisStrokeW,
    })
  );
  const yLabelX = plotLeft - 62;
  if (showPrintAxisText) {
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
    });
    yLabel.textContent = `Frequency spectrum (${state.yScale})`;
    axisLayer.appendChild(yLabel);
  }

  diagramRoot.appendChild(axisLayer);

  const noteX = [];
  const noteLayer = createSvgEl("g");
  const dragHitLayer = inPrintMode ? createSvgEl("g") : null;
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
        "text-anchor": xLabelMode === "full" ? "middle" : "end",
        "data-auto-text-class": inPrintMode ? "axis" : null,
      });
      if (xLabelMode !== "full") {
        labelTop.setAttribute("transform", `rotate(-32 ${x} ${tokenY})`);
      }
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
        })
      );

      const title = createSvgEl("text", {
        x: center,
        y: labelY,
        fill: textSecondary,
        "font-size": 10,
        "font-family": "Lexend, IBM Plex Sans, sans-serif",
        "text-anchor": "middle",
        "data-print-chord-title-index": inPrintMode ? String(chordIndex) : null,
        style: inPrintMode ? "cursor:text" : null,
      });
      const defaultChordTitle = `Chord ${chordIndex + 1}`;
      const overriddenChordTitle = String(state.printChordTitleOverrides?.[chordIndex] || "").trim();
      title.textContent = inPrintMode
        ? (overriddenChordTitle || defaultChordTitle)
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
      const targetRight = Number.isFinite(fusionX) ? fusionX : region.right;
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
      const xRight = clamp(xRightBase, plotLeft + 2, plotRight);
      const xLeft = clamp(Math.min(leftmostAlignedX, xRight - 1), plotLeft, xRight - 1);
      const halfBand = state.alignToleranceCents > 0 ? state.alignToleranceCents / 2 : 0;
      const topFreq = cluster.centerFreq * 2 ** (halfBand / 1200);
      const bottomFreq = cluster.centerFreq / 2 ** (halfBand / 1200);
      const y1 = yForFreq(topFreq);
      const y2 = yForFreq(bottomFreq);
      const bandTop = Math.min(y1, y2);
      const bandHeight = Math.abs(y2 - y1);
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
      const fusionRadius = state.showFusion && matchedFusionVisual ? matchedFusionVisual.radius : 0;
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
        const minRadius = state.fusionMode === "all" ? 2 : 3;
        const maxRadius = state.fusionMode === "all" ? 24 : 26;
        const ampScale = clamp((visual.radius - minRadius) / Math.max(1e-6, maxRadius - minRadius), 0, 1);
        maxFusionRadiusByChord[analysis.chordIndex] = Math.max(
          maxFusionRadiusByChord[analysis.chordIndex] || 0,
          visual.radius
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
        if (visual.shape === "diamond") {
          const r = visual.radius;
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
            createSvgEl("path", {
              d: `M ${fusionX} ${y - r} L ${fusionX + r} ${y} L ${fusionX} ${y + r} L ${fusionX - r} ${y} Z`,
              fill: fusionFill,
              "fill-opacity": visual.fillOpacity,
              stroke: isPlaying ? "#f4de58" : fusionStroke,
              "stroke-width": isPlaying ? 2.4 : visual.strokeWidth,
              "stroke-opacity": visual.strokeOpacity,
              ...commonFusionAttrs,
            })
          );
          if (!inPrintMode) {
            fusionLayer.appendChild(
              createSvgEl("circle", {
                cx: fusionX,
                cy: y,
                r: r + Math.max(5, state.pointSize * 1.2),
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
        overtoneLayer.appendChild(
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
      const alpha = clamp(0.14 + 0.84 * harmonicGain, 0.14, 0.98);
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
          ? `rgba(0,0,0,${alpha})`
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
      const chordBounds = chordNoteXBounds[point.chordIndex] || null;
      let xMid = comboDefaultX;
      if (inPrintMode && Number.isFinite(comboOverride) && chordBounds) {
        xMid = clamp(comboOverride, chordBounds.min, chordBounds.max);
      }
      const y = yForFreq(point.freq);
      let color = comboDiffColor;
      if (point.type === "sum") color = comboSumColor;
      if (point.type === "order2a" || point.type === "order2b") color = comboOrder2Color;

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
      printComponentMeta[playKey] = {
        x: xMid,
        y,
        freq: point.freq,
        playKey,
        kind: "combo",
        comboType: point.type,
        parentKeys,
        chordIndex: point.chordIndex,
      };
      const commonAttrs = {
        fill: comboFill,
        "fill-opacity": 0.88,
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
        "data-combo-drag-min": chordBounds ? chordBounds.min : "",
        "data-combo-drag-max": chordBounds ? chordBounds.max : "",
        "data-tip": describeComboTone(point, model.notes),
        style: inPrintMode ? "cursor:ew-resize" : null,
      };
      const shapeNode =
        point.type === "difference"
          ? createSvgEl("rect", {
              ...commonAttrs,
              x: xMid - r * 1.35,
              y: y - r * 0.5,
              width: r * 2.7,
              height: r,
              rx: Math.max(0.6, r * 0.2),
            })
          : createSvgEl("path", {
              ...commonAttrs,
              d: `M ${xMid} ${y - r} L ${xMid + r} ${y} L ${xMid} ${y + r} L ${xMid - r} ${y} Z`,
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
          "data-combo-drag-min": chordBounds ? chordBounds.min : "",
          "data-combo-drag-max": chordBounds ? chordBounds.max : "",
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
    const lowestFundamental = model.notes.length
      ? Math.min(...model.notes.map((note) => note.freq).filter((freq) => freq > 0))
      : Math.max(1e-9, state.ratioRootHz);
    const alignedPlayKeys = model.alignmentMemberPlayKeys || new Set();
    const componentLabelFont = componentTextStyle
      ? `${componentTextStyle.font}, IBM Plex Sans, Lexend, sans-serif`
      : "IBM Plex Sans, Lexend, sans-serif";
    const componentLabelSize = componentTextStyle ? componentTextStyle.size : 9.5;
    const buildComponentLabelLines = (freq, { useFusionToggles = false } = {}) => {
      const showHz = useFusionToggles ? state.fusionReadoutHz : state.printShowComponentHz;
      const showRatio = useFusionToggles ? state.fusionReadoutRatio : state.printShowComponentRatio;
      const ratioBase = useFusionToggles
        ? Math.max(1e-9, lowestFundamental)
        : Math.max(1e-9, state.ratioRootHz);
      const ratio = showRatio ? formatRatioApprox(freq / ratioBase) : "";
      const hzText = showHz ? formatHz(freq) : "";
      const lines = [];
      if (showRatio && showHz) {
        if (ratio && hzText) lines.push(`${ratio} ${hzText}`);
        else if (ratio) lines.push(ratio);
        else if (hzText) lines.push(hzText);
        return lines;
      }
      if (showRatio && ratio) lines.push(ratio);
      if (showHz && hzText) lines.push(hzText);
      return lines;
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
      const labelLines = buildComponentLabelLines(meta.freq, { useFusionToggles: false });
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
      labelLines.forEach((line, index) => {
        const span = createSvgEl("tspan", {
          x: labelX,
          dy: index === 0 ? 0 : 10,
        });
        span.textContent = line;
        text.appendChild(span);
      });
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
        const labelLines = buildComponentLabelLines(band.freq, { useFusionToggles: true });
        if (!labelLines.length) {
          return;
        }
        const labelId = `alignment:${band.id}`;
        if (isPrintHidden(`label:${labelId}`)) {
          return;
        }
        const offset = state.printLabelOffsets?.[labelId] || {};
        const defaultDx = 2;
        const defaultDy = 0;
        const labelX = band.labelX + (Number.isFinite(offset.dx) ? offset.dx : defaultDx);
        const labelY = band.y + (Number.isFinite(offset.dy) ? offset.dy : defaultDy);
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
          "data-hide-key": `label:${labelId}`,
          "data-label-parent-align-id": band.id,
          "data-auto-text-class": "component",
          style: "cursor:move",
        });
        text.textContent = labelLines.join(" ");
        printLayer.appendChild(text);
        autoRelaxLabels.push({
          el: text,
          baseX: band.labelX,
          baseY: band.y,
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
      const comboLabelId = `comboexpr:${key}`;
      const comboOffset = state.printLabelOffsets?.[comboLabelId] || {};
      const comboDefaultDx = 10;
      const comboDefaultDy = -10;
      const comboX = meta.x + (Number.isFinite(comboOffset.dx) ? comboOffset.dx : comboDefaultDx);
      const comboY = meta.y + (Number.isFinite(comboOffset.dy) ? comboOffset.dy : comboDefaultDy);
      printLayer.appendChild(
        createSvgEl("text", {
          x: comboX,
          y: comboY,
          fill: "#111",
          "font-size": 9.5,
          "font-family": "IBM Plex Sans, Lexend, sans-serif",
          "text-anchor": "start",
          "data-print-label-id": comboLabelId,
          "data-print-default-dx": String(comboDefaultDx),
          "data-print-default-dy": String(comboDefaultDy),
          "data-hide-key": `comboparent:${key}`,
          "data-label-parent-key": key,
          style: "cursor:move",
        })
      ).textContent = (() => {
        const p1 = parents[0]?.freq || 0;
        const p2 = parents[1]?.freq || 0;
        if (meta.comboType === "sum") {
          return `${p1.toFixed(2)} + ${p2.toFixed(2)} = ${meta.freq.toFixed(2)} Hz`;
        }
        if (meta.comboType === "order2a") {
          return `(${p1.toFixed(2)}) - (${p2.toFixed(2)}) = ${meta.freq.toFixed(2)} Hz`;
        }
        if (meta.comboType === "order2b") {
          return `(${p1.toFixed(2)}) - (${p2.toFixed(2)}) = ${meta.freq.toFixed(2)} Hz`;
        }
        return `|${p1.toFixed(2)} - ${p2.toFixed(2)}| = ${meta.freq.toFixed(2)} Hz`;
      })();
      autoRelaxLabels.push({
        el: printLayer.lastChild,
        baseX: comboX,
        baseY: comboY,
        manual: Number.isFinite(comboOffset.dx) || Number.isFinite(comboOffset.dy),
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
        parts.push(`Δ ${Math.abs(a.freq - b.freq).toFixed(2)} Hz`);
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

    if (state.printShowLegend) {
      const legendX = plotRight - 172;
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
  svg.appendChild(diagramRoot);

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
  const applyCanvasPan = () => {
    const zoom = clamp(Number(state.viewZoom) || 1, 0.3, 3);
    svg.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${zoom})`;
    svg.style.transformOrigin = "0 0";
    svg.style.willChange = "transform";
    svg.style.cursor = panDragState ? "grabbing" : "grab";
    svg.style.userSelect = panDragState ? "none" : "";
    svg.style.webkitUserSelect = panDragState ? "none" : "";
    svg.style.touchAction = "none";
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
    if (!cancelled && finishedState.kind === "combo-x" && !finishedState.moved) {
      const comboKey = finishedState.id;
      const next = { ...(state.printComboLinksVisible || {}) };
      next[comboKey] = !next[comboKey];
      state.printComboLinksVisible = next;
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
      "[data-play-key],[data-print-label-id],[data-custom-text-id],[data-column-id],[data-component-key],[data-rough-play-items],[data-align-band='1'],[data-chord-action]"
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
    const startPanX = canvasPanX;
    const startPanY = canvasPanY;
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
    panDragState = null;
    clearDragSelectionBlock();
    applyCanvasPan();
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

  svg.addEventListener("pointermove", (event) => {
    if (panDragState && panDragState.pointerId === event.pointerId) {
      event.preventDefault();
      const dx = event.clientX - panDragState.startClientX;
      const dy = event.clientY - panDragState.startClientY;
      canvasPanX = panDragState.startPanX + dx;
      canvasPanY = panDragState.startPanY + dy;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        panDragState.moved = true;
      }
      applyCanvasPan();
      return;
    }
    if (printMode) {
      if (
        printDragState &&
        printDragState.pointerId === event.pointerId &&
        (
          printDragState.kind === "column" ||
          printDragState.kind === "label" ||
          printDragState.kind === "combo-x" ||
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
              dy: printDragState.startDy + dy,
            },
          };
          scheduleRender(0);
        } else if (printDragState.kind === "combo-x") {
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
      state.viewZoom = clamp((Number(state.viewZoom) || 1) * factor, 0.3, 3);
      if (viewZoomInput) {
        viewZoomInput.value = String(state.viewZoom);
      }
      if (viewZoomReadout) {
        viewZoomReadout.textContent = `${Math.round(state.viewZoom * 100)}%`;
      }
      applyCanvasPan();
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
    if (!printMode) {
      return;
    }
    endPrintDrag(event, { cancelled: false });
  });

  svg.addEventListener("pointercancel", (event) => {
    endCanvasPan(event);
    if (!printMode) {
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
    if (printMode) {
      const hideTarget = event.target.closest("[data-hide-key]");
      if (event.altKey && hideTarget) {
        const hideKey = hideTarget.getAttribute("data-hide-key");
        if (hideKey) {
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
      if (chordTitleTarget && event.detail > 1) {
        event.preventDefault();
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
                font: String(result.font || item.font || "Noto Serif"),
                size: clamp(Number(result.size ?? item.size ?? 18), 8, 72),
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
      if (!Number.isInteger(chordIndex) || chordIndex < 0) {
        return;
      }
      event.preventDefault();
      const defaultChordTitle = `Chord ${chordIndex + 1}`;
      const currentTitle = String(state.printChordTitleOverrides?.[chordIndex] || "").trim() || defaultChordTitle;
      openCustomTextDialog(currentTitle, {
        title: `Edit ${defaultChordTitle}`,
        saveText: "Save",
        font: state.printCustomLabelFont || "Noto Serif",
        size: state.printCustomLabelSize || 18,
      }).then((result) => {
        if (!result) {
          return;
        }
        const next = String(result.text || "").trim();
        const overrides = { ...(state.printChordTitleOverrides || {}) };
        if (!next || next === defaultChordTitle) {
          delete overrides[chordIndex];
        } else {
          overrides[chordIndex] = next;
        }
        state.printChordTitleOverrides = overrides;
        scheduleRender();
        scheduleStateUrlUpdate();
      });
      return;
    }
  });
}

function syncControlReadouts() {
  syncModeButtons();
  syncColorSchemeControl();
  if (viewZoomReadout) {
    viewZoomReadout.textContent = `${Math.round((Number(state.viewZoom) || 1) * 100)}%`;
  }
  if (layoutScaleReadout) {
    layoutScaleReadout.textContent = `${Math.round((Number(state.layoutScale) || 1) * 100)}%`;
  }
  overtoneCountReadout.textContent = String(state.overtoneCount);
  alignToleranceReadout.textContent = `${state.alignToleranceCents.toFixed(1)}c`;
  if (fusionClusterCentsReadout) {
    fusionClusterCentsReadout.textContent = `${state.fusionClusterCents.toFixed(1)}c`;
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
  if (printShowLegendInput) {
    printShowLegendInput.disabled = !state.showCombination;
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

function exportSizeFromPaperPreset() {
  const presets = {
    "letter-portrait": { width: 1700, height: 2200 },
    "letter-landscape": { width: 2200, height: 1700 },
    "a4-portrait": { width: 1654, height: 2339 },
    "a4-landscape": { width: 2339, height: 1654 },
  };
  return presets[state.printPaper] || presets["letter-landscape"];
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
  const paperSize = exportSizeFromPaperPreset();
  const width = isPrintMode()
    ? paperSize.width
    : clampExportSize(state.exportWidth, 1800);
  const height = isPrintMode()
    ? paperSize.height
    : clampExportSize(state.exportHeight, 1100);
  const svgText = buildExportSvgString(width, height, { withXmlHeader: true });
  downloadBlob(
    `overtones-${new Date().toISOString().slice(0, 10)}.svg`,
    new Blob([svgText], { type: "image/svg+xml;charset=utf-8" })
  );
}

function exportPdf() {
  const paperSize = exportSizeFromPaperPreset();
  const width = isPrintMode()
    ? paperSize.width
    : clampExportSize(state.exportWidth, 1800);
  const height = isPrintMode()
    ? paperSize.height
    : clampExportSize(state.exportHeight, 1100);
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

if (printAddCustomTextButton) {
  printAddCustomTextButton.addEventListener("click", () => {
    if (!isPrintMode()) {
      return;
    }
    openCustomTextDialog("").then((result) => {
      if (!result || !result.text?.trim()) {
        return;
      }
      state.printDistanceMode = false;
      printDistancePendingKey = null;
      if (printDistanceModeInput) {
        printDistanceModeInput.checked = false;
      }
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: String(result.text || ""),
        font: String(result.font || state.printCustomLabelFont || "Noto Serif"),
        size: clamp(Number(result.size ?? state.printCustomLabelSize ?? 18), 8, 72),
        x: Number.isFinite(lastDiagramCenter.x) ? lastDiagramCenter.x : 640,
        y: Number.isFinite(lastDiagramCenter.y) ? lastDiagramCenter.y : 360,
      };
      state.printCustomTexts = [...(state.printCustomTexts || []), item];
      state.printSelectedCustomTextId = item.id;
      scheduleRender();
      scheduleStateUrlUpdate();
    });
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
    if (!isPrintMode()) {
      closeCustomTextDialog(null);
      return;
    }
    const text = String(customTextInput?.value || "");
    const font = String(customTextFontInput?.value || "Noto Serif");
    const size = clamp(Number(customTextSizeInput?.value) || 18, 8, 72);
    if (customTextDialogMode === "custom") {
      state.printCustomLabelFont = font;
      state.printCustomLabelSize = size;
    }
    closeCustomTextDialog({ text, font, size });
  });
}

if (customTextCancelButton) {
  customTextCancelButton.addEventListener("click", () => {
    closeCustomTextDialog(null);
  });
}

if (customTextModal) {
  customTextModal.addEventListener("pointerdown", (event) => {
    if (event.target === customTextModal) {
      event.preventDefault();
      closeCustomTextDialog(null);
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
      closeCustomTextDialog(null);
    }
  });
}

if (customTextSizeInput) {
  customTextSizeInput.addEventListener("input", () => {
    if (!isPrintMode()) {
      return;
    }
    const size = clamp(getNumericInputValue(customTextSizeInput, 18), 8, 72);
    if (customTextSizeReadout) {
      customTextSizeReadout.textContent = String(size);
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

window.addEventListener("keydown", (event) => {
  if (isPrintMode()) {
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

const initialUrlState = readStateFromUrl();
if (
  initialUrlState &&
  typeof initialUrlState === "object" &&
  initialUrlState.live &&
  initialUrlState.print
) {
  modeSnapshots[MODE_LIVE] = cloneJson(initialUrlState.live, null);
  modeSnapshots[MODE_PRINT] = cloneJson(initialUrlState.print, null);
  applyStateSnapshot(
    initialUrlState.mode === MODE_PRINT
      ? modeSnapshots[MODE_PRINT]
      : modeSnapshots[MODE_LIVE]
  );
  appMode = initialUrlState.mode === MODE_PRINT ? MODE_PRINT : MODE_LIVE;
} else {
  applyStateSnapshot(initialUrlState);
  modeSnapshots[MODE_LIVE] = getStateSnapshotFlat();
  const printSeed = getStateSnapshotFlat();
  printSeed.themeDark = false;
  printSeed.printDistanceMode = false;
  modeSnapshots[MODE_PRINT] = printSeed;
  appMode = MODE_LIVE;
}
if (appMode === MODE_PRINT) {
  state.themeDark = false;
  themeToggle.checked = false;
  document.body.classList.remove("theme-dark");
}
syncModeButtons();
syncControlReadouts();
renderChart();
scheduleStateUrlUpdate(0);
