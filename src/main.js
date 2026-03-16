import { customOscillatorTypes, customOscillators } from "./custom-oscillators";
import { loadSoundfont, startPresetNote } from "sfumato";
import soundfontUrl from "./soundfonts/HSStrings.sf2?url";
const karplusWorkletUrl = new URL("./karplus-worklet.js", import.meta.url);
const resonatorWorkletUrl = new URL("./modal-resonator-worklet.js", import.meta.url);
import intervalChartData from "./interval-names.json";
import opentype from "opentype.js";
const canvas = document.getElementById("lattice");
const ctx = canvas.getContext("2d");
const audioToggle = document.getElementById("audio-toggle");
const resetButton = document.getElementById("reset-lattice");
const exportScaleButton = document.getElementById("export-scale");
const themeSelect = document.getElementById("theme-select");
const optionsToggle = document.getElementById("options-toggle");
const optionsPanel = document.getElementById("options-panel");
const calculateToggle = document.getElementById("calculate-toggle");
const calculatePanel = document.getElementById("calculate-panel");
const intervalChartButton = document.getElementById("interval-chart");
const intervalChartOverlay = document.getElementById("interval-chart-overlay");
const intervalChartCloseButton = document.getElementById("interval-chart-close");
const intervalChartTypeList = document.getElementById("interval-chart-type-list");
const intervalChartTableBody = document.getElementById("interval-chart-table-body");
const intervalChartSearchInput = document.getElementById("interval-chart-search");
const intervalChartSelectAllButton = document.getElementById("interval-chart-select-all");
const intervalChartSelectNoneButton = document.getElementById("interval-chart-select-none");
const intervalChartListenToggle = document.getElementById("interval-chart-listen");
const intervalChartCustomInput = document.getElementById("interval-chart-custom-ratio");
const intervalChartCustomTextInput = document.getElementById("interval-chart-custom-text");
const intervalChartCustomActive = document.getElementById("interval-chart-custom-active");
const intervalChartCalcButton = document.getElementById("interval-chart-calc");
const intervalChartDirectionSelect = document.getElementById("interval-chart-direction");
const intervalChartSourceRatio = document.getElementById("interval-chart-source-ratio");
const intervalChartSuperparticularToggle = document.getElementById(
  "interval-chart-superparticular"
);
const layoutModeToggle = document.getElementById("layout-mode");
const layoutPanel = document.getElementById("layout-panel");
const layoutPanelToggle = document.getElementById("layout-panel-toggle");
const layoutExitButton = document.getElementById("layout-exit");
const layoutTitleInput = document.getElementById("layout-title");
const layoutCreatorInput = document.getElementById("layout-creator");
const layoutTitleSizeInput = document.getElementById("layout-title-size");
const layoutCreatorSizeInput = document.getElementById("layout-creator-size");
const layoutTitleMarginInput = document.getElementById("layout-title-margin");
const layoutTitleMarginReadout = document.getElementById("layout-title-margin-readout");
const layoutPageSizeSelect = document.getElementById("layout-page-size");
const layoutOrientationSelect = document.getElementById("layout-orientation");
const layoutScaleInput = document.getElementById("layout-scale");
const layoutScaleReadout = document.getElementById("layout-scale-readout");
const layoutSpaceTrigger = document.getElementById("layout-space-trigger");
const layoutSpacePopover = document.getElementById("layout-space-popover");
const layoutSpaceXInput = document.getElementById("layout-space-x");
const layoutSpaceYInput = document.getElementById("layout-space-y");
const layoutSpaceZInput = document.getElementById("layout-space-z");
const layoutSpaceZRow = document.getElementById("layout-space-z-row");
const layoutKeyMappingTrigger = document.getElementById("layout-key-mapping-trigger");
const layoutKeyMappingPopover = document.getElementById("layout-key-mapping-popover");
const layoutKeyMappingSizeInput = document.getElementById("layout-key-mapping-size");
const layoutKeyMappingOffsetInput = document.getElementById("layout-key-mapping-offset");
const layoutKeyMappingDarkToggle = document.getElementById("layout-key-mapping-dark");
const layoutKeyMappingTextButton = document.getElementById("layout-key-mapping-text");
const layoutKeyMappingTextDialog = document.getElementById("layout-key-mapping-text-dialog");
const octaveShiftDialog = document.getElementById("octave-shift-dialog");
const octaveShiftInput = document.getElementById("octave-shift-input");
const layoutKeyMappingPrefixInput = document.getElementById("layout-key-mapping-prefix");
const layoutKeyMappingSuffixInput = document.getElementById("layout-key-mapping-suffix");
const layoutFreezeButton = document.getElementById("layout-freeze");
const layoutShareLinkButton = document.getElementById("layout-share-link");
const layoutNodeSizeInput = document.getElementById("layout-node-size");
const layoutNodeSizeReadout = document.getElementById("layout-node-size-readout");
const layoutAlignXButton = document.getElementById("layout-align-x");
const layoutAlignYButton = document.getElementById("layout-align-y");
const layoutStraightenButton = document.getElementById("layout-straighten");
const layoutRatioTextSizeInput = document.getElementById("layout-ratio-text-size");
const layoutRatioTextReadout = document.getElementById("layout-ratio-text-readout");
const layoutNoteTextSizeInput = document.getElementById("layout-note-text-size");
const layoutNoteTextReadout = document.getElementById("layout-note-text-readout");
const layoutTriangleLabelSizeInput = document.getElementById("layout-triangle-label-size");
const layoutTriangleLabelReadout = document.getElementById("layout-triangle-label-readout");
const layoutCustomLabelSizeInput = document.getElementById("layout-custom-label-size");
const layoutCustomSizeGroup = document.getElementById("layout-custom-size-group");
const layoutNodeShapeSelect = document.getElementById("layout-node-shape");
const layoutFontsButton = document.getElementById("layout-fonts");
const layoutFontPopover = document.getElementById("layout-font-popover");
const layoutFontCancelButton = document.getElementById("layout-font-cancel");
const layoutFontDoneButton = document.getElementById("layout-font-done");
const layoutTitleFontSelect = document.getElementById("layout-title-font");
const layoutTitleWeightSelect = document.getElementById("layout-title-weight");
const layoutCreatorFontSelect = document.getElementById("layout-creator-font");
const layoutCreatorWeightSelect = document.getElementById("layout-creator-weight");
const layoutRatioFontSelect = document.getElementById("layout-ratio-font");
const layoutRatioWeightSelect = document.getElementById("layout-ratio-weight");
const layoutNoteFontSelect = document.getElementById("layout-note-font");
const layoutNoteWeightSelect = document.getElementById("layout-note-weight");
const layoutTriangleLabelFontSelect = document.getElementById("layout-triangle-label-font");
const layoutTriangleLabelWeightSelect = document.getElementById("layout-triangle-label-weight");
const layoutAxisFontSelect = document.getElementById("layout-axis-font");
const layoutAxisWeightSelect = document.getElementById("layout-axis-weight");
const layoutAxisSizeInput = document.getElementById("layout-axis-size");
const layoutLineLabelFontSelect = document.getElementById("layout-line-label-font");
const layoutLineLabelWeightSelect = document.getElementById("layout-line-label-weight");
const layoutLineLabelSizeInput = document.getElementById("layout-line-label-size");
const layoutCustomFontSelect = document.getElementById("layout-custom-font");
const layoutCustomWeightSelect = document.getElementById("layout-custom-weight");
const layoutKeyMappingFontSelect = document.getElementById("layout-key-mapping-font");
const layoutKeyMappingWeightSelect = document.getElementById("layout-key-mapping-weight");
const layoutCustomFontGroup = document.getElementById("layout-custom-font-group");
const layoutUnifySizeToggle = document.getElementById("layout-unify-size");
const layoutPerspectiveTextSizeToggle = document.getElementById("layout-perspective-text-size");
const layoutLineLabelsToggle = document.getElementById("layout-line-labels-toggle");
const layoutResetButton = document.getElementById("layout-reset");
const layoutFreezeFlattenToggle = document.getElementById("layout-freeze-flatten");
const exportSvgButton = document.getElementById("export-svg");
const exportPdfButton = document.getElementById("export-pdf");
const midiEnable = document.getElementById("midi-enable");
const midiPortSelect = document.getElementById("midi-port");
const midiChannelSelect = document.getElementById("midi-channel");
const midiOutEnable = document.getElementById("midi-out-enable");
const midiOutPortSelect = document.getElementById("midi-out-port");
const midiOutBendInput = document.getElementById("midi-out-bend");
const midiMenuToggle = document.getElementById("midi-menu-toggle");
const midiMenuPanel = document.getElementById("midi-menu-panel");
const presetToggle = document.getElementById("preset-toggle");
const presetOverlay = document.getElementById("preset-overlay");
const presetList = document.getElementById("preset-list");
const presetSearchInput = document.getElementById("preset-search");
const presetTagList = document.getElementById("preset-tag-list");
const presetCloseButton = document.getElementById("preset-close");
const presetSortSelect = document.getElementById("preset-sort");
const distanceSelectTriggers = document.querySelectorAll("[data-distance-select]");
const fileToggle = document.getElementById("file-toggle");
const filePanel = document.getElementById("file-panel");
const sharePresetButton = document.getElementById("share-preset");
const openOvertonesButton = document.getElementById("open-overtones");
const openTunerButton = document.getElementById("open-tuner");
const fileSharePopover = document.getElementById("file-share-popover");
const saveLatticeButton = document.getElementById("save-lattice");
const loadLatticeButton = document.getElementById("load-lattice");
const loadLatticeInput = document.getElementById("load-lattice-input");
const topBar = document.querySelector(".top-bar");
const controlActionsPanel = document.querySelector(".control-actions-panel");
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
const bannerMessage = document.getElementById("banner-message");
const layoutOverlay = document.getElementById("layout-overlay");
const creditsTrigger = document.getElementById("credits-trigger");
const creditsDialog = document.getElementById("credits-dialog");
const showHelpToggle = document.getElementById("show-help");
const keyboardHelp = document.getElementById("keyboard-help");
const keyboardMapPopover = document.getElementById("keyboard-map-popover");
const keyboardMapToggle = document.getElementById("keyboard-map-toggle");
const keyboardMapClear = document.getElementById("keyboard-map-clear");
const keyboardMapKeys = keyboardMapPopover
  ? Array.from(keyboardMapPopover.querySelectorAll(".piano-key"))
  : [];
const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const fundamentalOctaveDown = document.getElementById("fundamental-octave-down");
const fundamentalOctaveUp = document.getElementById("fundamental-octave-up");
const a4Input = document.getElementById("a4");
const tiltInput = document.getElementById("tilt");
const tiltReadout = document.getElementById("tilt-readout");
const ratioXSelect = document.getElementById("ratio-x");
const ratioYSelect = document.getElementById("ratio-y");
const ratioZSelect = document.getElementById("ratio-z");
const fundamentalSpellingDialog = document.getElementById("fundamental-spelling-dialog");
const fundamentalSpellingSharpButton = document.getElementById("fundamental-spelling-sharp");
const fundamentalSpellingFlatButton = document.getElementById("fundamental-spelling-flat");
const volumeSlider = document.getElementById("volume");
const volumeReadout = document.getElementById("volume-readout");
const lfoDepthSlider = document.getElementById("lfo-depth");
const lfoDepthReadout = document.getElementById("lfo-depth-readout");
const lfoRateSlider = document.getElementById("lfo-rate");
const lfoRateReadout = document.getElementById("lfo-rate-readout");
const keyboardModeSelect = document.getElementById("keyboard-mode");
const waveformSelect = document.getElementById("waveform");
const soundfontPresetSelect = document.getElementById("soundfont-preset");
const physicalModelSelect = document.getElementById("physical-model");
const waveformSelectGroup = document.getElementById("waveform-select-group");
const soundfontSelectGroup = document.getElementById("soundfont-select-group");
const physicalSelectGroup = document.getElementById("physical-select-group");
const synthModeInputs = document.querySelectorAll('input[name="synth-mode"]');
const attackSlider = document.getElementById("attack");
const decaySlider = document.getElementById("decay");
const sustainSlider = document.getElementById("sustain");
const releaseSlider = document.getElementById("release");
const oneShotCheckbox = document.getElementById("one-shot");
const looperToggle = document.getElementById("looper-toggle");
const looperClear = document.getElementById("looper-clear");
const looperQuantizeEnabledToggle = document.getElementById("looper-quantize-enabled");
const looperQuantizeMenuToggle = document.getElementById("looper-quantize-menu-toggle");
const looperQuantizeMenu = document.getElementById("looper-quantize-menu");
const looperQuantizeGridSelect = document.getElementById("looper-quantize-grid");
const looperQuantizeStrengthSlider = document.getElementById("looper-quantize-strength");
const looperQuantizeStrengthReadout = document.getElementById("looper-quantize-strength-readout");
const tempoSlider = document.getElementById("tempo");
const tempoReadout = document.getElementById("tempo-readout");
const patternLengthSlider = document.getElementById("pattern-length");
const patternLengthReadout = document.getElementById("pattern-length-readout");
const patternLengthGroup = document.getElementById("pattern-length-group");
const patternLengthNote = document.getElementById("pattern-length-note");
const patternLengthModeInputs = document.querySelectorAll(
  'input[name="pattern-length-mode"]'
);
const envelopeTimeModeInputs = document.querySelectorAll(
  'input[name="envelope-time"]'
);
const featureModeButtons = document.querySelectorAll("[data-feature-mode]");
const spellingModeButtons = document.querySelectorAll("[data-spelling-mode]");
const showHzToggle = document.getElementById("show-hz");
const showRatioCentsToggle = document.getElementById("show-ratio-cents");
const showCentsDeviationToggle = document.getElementById("show-cents-deviation");
const showCentsSignToggle = document.getElementById("show-cents-sign");
const directionalRatioLabelsToggle = document.getElementById("directional-ratio-labels");
const connectOrphansToggle = document.getElementById("connect-orphans");
const show3DShadingToggle = document.getElementById("show-3d-shading");
const hejiEnabledToggle = document.getElementById("heji-enabled");
const enharmonicsEnabledToggle = document.getElementById("enharmonics-enabled");
const enharmonicsGroup = document.getElementById("enharmonics-group");
const centsPrecisionButtons = document.querySelectorAll("[data-cents-precision]");
const hzPrecisionButtons = document.querySelectorAll("[data-hz-precision]");
const layoutKeyMappingButtons = document.querySelectorAll("[data-layout-key-mapping]");
const sequencePatternSelect = document.getElementById("sequence-pattern");
const rhythmPatternSelect = document.getElementById("rhythm-pattern");
const octavePatternSelect = document.getElementById("octave-pattern");
const patternBuildButton = document.getElementById("pattern-build");
const scorePlayToggle = document.getElementById("score-play-toggle");
const lfoPresetSelect = document.getElementById("lfo-preset");
const lfoPlayToggle = document.getElementById("lfo-play-toggle");
const lfoStopButton = document.getElementById("lfo-stop");
const allNotesOffButton = document.getElementById("all-notes-off");
const findRatioButton = document.getElementById("find-ratio");
const buildIntervalsButton = document.getElementById("build-intervals");
const addIntervalButton = document.getElementById("add-interval");
const customRatioDialog = document.getElementById("custom-ratio-dialog");
const triangleLabelDialog = document.getElementById("triangle-label-dialog");
const triangleLabelInput = document.getElementById("triangle-label-input");
const distanceLabelDialog = document.getElementById("distance-label-dialog");
const distanceLabelInput = document.getElementById("distance-label-input");
const findRatioDialog = document.getElementById("find-ratio-dialog");
const findRatioForm = document.getElementById("find-ratio-form");
const findRatioInput = document.getElementById("find-ratio-input");
const findRatioAxisRecommendation = document.getElementById("find-ratio-axis-recommendation");
const findRatioAxisDialog = document.getElementById("find-ratio-axis-dialog");
const findRatioAxisMessage = document.getElementById("find-ratio-axis-message");
const buildIntervalsDialog = document.getElementById("build-intervals-dialog");
const buildIntervalsForm = document.getElementById("build-intervals-form");
const buildIntervalsInput = document.getElementById("build-intervals-input");
const buildIntervalsPreview = document.getElementById("build-intervals-preview");
const buildIntervalsTicks = document.getElementById("build-intervals-ticks");
const buildIntervalsWarning = document.getElementById("build-intervals-warning");
const addIntervalDialog = document.getElementById("add-interval-dialog");
const addIntervalForm = document.getElementById("add-interval-form");
const addIntervalSelect = document.getElementById("add-interval-select");
const addIntervalInput = document.getElementById("add-interval-input");
const addIntervalDirection = document.getElementById("add-interval-direction");
const layoutCustomLabelDialog = document.getElementById("layout-custom-label-dialog");
const layoutCustomLabelInput = document.getElementById("layout-custom-label-input");
const customRatioNumerator = document.getElementById("custom-ratio-numerator");
const customRatioDenominator = document.getElementById("custom-ratio-denominator");
const customRatioReduceToggle = document.getElementById("custom-ratio-reduce");
const attackReadout = document.getElementById("attack-readout");
const decayReadout = document.getElementById("decay-readout");
const sustainReadout = document.getElementById("sustain-readout");
const releaseReadout = document.getElementById("release-readout");
const mode3dCheckbox = document.getElementById("mode-3d");
const mode2dRadio = document.getElementById("mode-2d");
const nav3dPanel = document.getElementById("nav-3d");
const navAddModeToggle = document.getElementById("nav-add-mode");
const navAxesToggle = document.getElementById("nav-axes");
const navGridToggle = document.getElementById("nav-grid");
const navCirclesToggle = document.getElementById("nav-circles");
const navKeyMappingsToggle = document.getElementById("nav-key-mappings");
const lineLabelsToggle = document.getElementById("line-labels-toggle");
const analysisShowDistancesToggle = document.getElementById("analysis-show-distances");
const analysisShowMicrotonalToggle = document.getElementById("analysis-show-microtonal");
const nav3dNavigationToggle = document.getElementById("nav-3d-navigation-toggle");
const nav3dNavigationBody = document.getElementById("nav-3d-navigation-body");
const navZoomInput = document.getElementById("nav-zoom");
const navDistanceInput = document.getElementById("nav-distance");
const layoutShowToggle = document.getElementById("layout-show-toggle");
const layoutShowBody = document.getElementById("layout-show-body");
const layoutKeyMappingsGroup = document.getElementById("layout-key-mappings-group");
const layoutHejiEnabledToggle = document.getElementById("layout-heji-enabled");
const layoutEnharmonicsEnabledToggle = document.getElementById("layout-enharmonics-enabled");
const layoutEnharmonicsGroup = document.getElementById("layout-enharmonics-group");
const layoutShowHzToggle = document.getElementById("layout-show-hz");
const layoutShowRatioCentsToggle = document.getElementById("layout-show-ratio-cents");
const layoutShowCentsDeviationToggle = document.getElementById("layout-show-cents-deviation");
const layoutCirclesToggle = document.getElementById("layout-circles");
const layoutKeyMappingsToggle = document.getElementById("layout-key-mappings-toggle");
const layoutShowDistancesToggle = document.getElementById("layout-show-distances");
const layoutShowMicrotonalToggle = document.getElementById("layout-show-microtonal");
const nav3dButtons = nav3dPanel ? nav3dPanel.querySelectorAll("button[data-view], button[data-action]") : [];
const viewPanelToggle = document.getElementById("view-panel-toggle");
const viewsPanel = nav3dPanel ? nav3dPanel.querySelector(".nav-3d-panel") : null;
const viewModeInputs = document.querySelectorAll('input[name="view-mode"]');
const viewModeButtons = document.querySelectorAll("[data-view-mode]");

const view = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  rotating: false,
  reducedEffects: false,
  interactionStart: { x: 0, y: 0, time: 0 },
  dragStart: { x: 0, y: 0 },
  dragOffsetStart: { x: 0, y: 0 },
  rotateStart: { x: 0, y: 0 },
  rotateAnglesStart: { x: 0, y: 0 },
  lastPointer: { x: 0, y: 0 },
  rotX: 0,
  rotY: 0,
};
let cameraDistance = 0;
let bestViewCandidates = [];
let bestViewIndex = 0;
let bestViewSignature = "";
const analysisLayers = { distances: false, microtonal: false };
let distanceSelectMode = false;
let addIntervalMode = false;
let addIntervalSourceNodeId = null;
let addIntervalSelectedRing = null;
let iHeld = false;
const distanceSelectedNodeKeys = new Set();
const distanceSelectedEdges = new Set();
const commaEdges = [];
const commaNodeRings = new Map();
const commaRatioMap = new Map();
let commaEntries = [];
let intervalChartEntries = [];
let intervalChartTypes = [];
let intervalChartLoaded = false;
let intervalChartSelectedTypes = new Set();
let intervalChartSearch = "";
let intervalChartListenEnabled = false;
let intervalChartAnimating = false;
const intervalChartActive = new Map();
const intervalChartRowMap = new Map();
let intervalChartSelectedKey = null;
let intervalChartDirection = "above";
let intervalChartSuperparticularOnly = false;
const INTERACTION_MODE_LABELS = {
  "distance-edit": "Distance Edit",
  "microtonal-intervals": "Interval Overlay",
  "axis-x": "X Axis Mode",
  "axis-y": "Y Axis Mode",
  "axis-z": "Z Axis Mode",
};
const DISTANCE_MODE_HELP =
  "Distance Edit\nDrag between nodes to create distance lines.\nDrag label to slide, drag line to curve.\nOption-click line to delete.\nDouble-click label to change interval name.";
const MICROTONAL_MODE_HELP =
  "Interval Overlay (analysis view)\nClick node to show connections.\nClick visible connections to listen.\nExcluded from PDF/SVG export.";
const DISTANCE_RING_COLOR = "rgba(72, 146, 255, 0.9)";
const ADD_INTERVAL_RING_COLOR = "rgba(220, 72, 72, 0.9)";
const MICROTONAL_HOVER_RING_COLOR = "rgba(134, 239, 172, 0.95)";
const MICROTONAL_SELECTED_RING_COLOR = "rgba(16, 185, 129, 0.95)";
const GUIDE_DEPTH_DENOM_MAX = 3.2;
const EDGE_LABEL_SIZE_DEFAULT = 12;
const distanceEdges = [];
const distanceEdgeOverrides = new Map();
let distanceLabelDrag = null;
let lineLabelDrag = null;
let distanceSelectDrag = null;
let distanceCurveDrag = null;
let pendingDistanceLabelClickTimer = null;
let pendingDistanceLabelClickKey = "";
let pendingDistanceLabelEditKey = "";
let microtonalHoverPairKey = "";
const microtonalSelectedNodeIds = new Set();
let bannerDismissedKey = "";
let currentBannerKey = "";
let tempBannerActive = false;
let tempBannerTimer = null;
let tempBannerHideTimer = null;
let performanceModeEnabled = false;
let keyboardModeToggleMemory = null;

if (
  typeof HTMLDialogElement !== "undefined" &&
  !window.__latticePerformanceDialogPatchInstalled
) {
  const nativeShowModal = HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal = function patchedShowModal(...args) {
    if (document.body.classList.contains("performance-mode")) {
      return;
    }
    return nativeShowModal.apply(this, args);
  };
  window.__latticePerformanceDialogPatchInstalled = true;
}

const ZOOM_MIN = 0.375;
const ZOOM_MAX = 2.95;

function clampZoom(value) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
}

function clampTiltDeg(value) {
  return Math.min(45, Math.max(-45, value));
}

function updateTiltReadout() {
  if (!tiltReadout) {
    return;
  }
  const shown = Math.abs(latticeTiltDeg) < 0.05 ? 0 : latticeTiltDeg;
  const formatted = shown.toFixed(shown % 1 === 0 ? 0 : 1);
  if ("value" in tiltReadout) {
    tiltReadout.value = formatted;
  } else {
    tiltReadout.textContent = `${formatted}\u00b0`;
  }
}

function setLatticeTilt(nextTiltDeg, options = {}) {
  const { syncControl = true } = options;
  const numeric = Number(nextTiltDeg);
  const clamped = Number.isFinite(numeric) ? clampTiltDeg(numeric) : 0;
  if (Math.abs(clamped - latticeTiltDeg) < 1e-6) {
    if (syncControl && tiltInput) {
      tiltInput.value = String(clamped);
    }
    updateTiltReadout();
    return;
  }
  latticeTiltDeg = clamped;
  const radians = (clamped * Math.PI) / 180;
  tiltCos = Math.cos(radians);
  tiltSin = Math.sin(radians);
  markIsomorphicDirty();
  if (syncControl && tiltInput) {
    tiltInput.value = String(clamped);
  }
  updateTiltReadout();
}

function clampCameraDistance(value) {
  return Math.min(600, Math.max(0, value));
}

function syncNavViewSliders() {
  if (navZoomInput) {
    navZoomInput.value = String(clampZoom(view.zoom));
  }
  if (navDistanceInput) {
    navDistanceInput.value = String(clampCameraDistance(cameraDistance));
  }
}

let audioCtx = null;
let masterGain = null;
let karplusWorkletReady = false;
let karplusWorkletLoading = null;
let resonatorWorkletReady = false;
let resonatorWorkletLoading = null;
let soundfontData = null;
let soundfontPreset = null;
let soundfontLoading = null;
let soundfontPresetList = [];
let hoverNodeId = null;
let themeColors = null;
let lfoDepth = 1;
let lfoRate = 1;
const LFO_RATE_MIN = 0.1;
const LFO_RATE_MAX = 10;
const LFO_RATE_RANGE = LFO_RATE_MAX / LFO_RATE_MIN;
const ENVELOPE_MIN = 0.005;
const ENVELOPE_MAX = 15;
const ENVELOPE_CURVE = 2;
const FUNDAMENTAL_CUSTOM_VALUE = "hz";
const KARPLUS_WAVEFORM = "plucked";
const RESONANT_WAVEFORM = "resonant";
const SOUNDFONT_WAVEFORM = "soundfont";
let lfoArmingId = null;
let lfoArmingStart = 0;
let lfoAnimating = false;
let lfoStopTimers = [];
let lfoPresetPlaying = false;
let midiAccess = null;
let midiInput = null;
let midiEnabled = false;
let midiOutEnabled = false;
let midiOutDevice = null;
let midiOutBendRange = 2;
const midiOutActive = new Map();
const midiOutChannelPool = Array.from({ length: 15 }, (_, i) => i + 2);
let oneShotPrevValue = null;
let synthMode = "waveform";
let soundfontPresetIndex = 0;
let currentSynthWaveform = "";
let lastCustomOctaveReduce = true;
let rHeld = false;
let tHeld = false;
let lHeld = false;
let vHeld = false;
let customTextHeld = false;
let fHeld = false;
let oHeld = false;
let mHeld = false;
let suppressClickAfterRespell = false;
let nodeVolumeAdjustMode = false;
let nodeVolumeSliderDrag = null;
let nodeVolumeSliderHitboxes = [];
const nodeVolumeLimits = new Map();

function resetHeldModifiers() {
  rHeld = false;
  tHeld = false;
  lHeld = false;
  vHeld = false;
  fHeld = false;
  oHeld = false;
  iHeld = false;
  cHeld = false;
  zKeyHeld = false;
  xKeyHeld = false;
  yKeyHeld = false;
  mHeld = false;
  customTextHeld = false;
}
const midiActiveNotes = new Map();
const activeKeys = new Map();
const triangleDiagonals = new Map();
const autoTriangleDiagonals = new Map();
let triangleHover = null;
let triangleLabelTargetKey = null;
let triangleLabelTargetTri = null;
const TRIANGLE_DIAGONAL_HIT_DISTANCE = 10;
const TRIANGLE_TRI_IDS = new Set(["abd", "acd", "abc", "bcd"]);
const triangleLabels = new Map();
let autoTrianglesDirty = true;
const TRIANGLE_TRI_TO_DIAG = {
  abd: "backslash",
  acd: "backslash",
  abc: "slash",
  bcd: "slash",
};
let layoutLabelHitboxVisible = false;
const layoutRenderedNoteLabelHitboxes = new Map();

function clearTriangleLabelsForCell(entry) {
  TRIANGLE_TRI_IDS.forEach((tri) => {
    triangleLabels.delete(triangleLabelKey({ ...entry, tri }));
  });
}

function computeTriangleLabelLayout(text, font, baseSize, points, fontWeight = 400) {
  if (!text || !points || points.length < 3) {
    return { size: baseSize };
  }
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;
  const maxBox = Math.min(boxWidth, boxHeight);
  const baseWidth = measureTextWidthWithWeight(text, baseSize, font, fontWeight);
  const minSize = Math.max(2, baseSize * 0.25);
  const a = points[0];
  const b = points[1];
  const c = points[2];
  const ab = Math.hypot(b.x - a.x, b.y - a.y);
  const bc = Math.hypot(c.x - b.x, c.y - b.y);
  const ca = Math.hypot(a.x - c.x, a.y - c.y);
  const avgEdge = (ab + bc + ca) / 3;
  const maxWidth = Math.max(8, Math.min(maxBox * 0.45, avgEdge * 0.5));
  let size = baseSize;
  if (baseWidth > maxWidth) {
    const scale = Math.max(minSize / baseSize, maxWidth / baseWidth);
    size = baseSize * scale;
  }
  return { size };
}

function getLayoutNoteLabelHitbox(node, pos, radius) {
  const rendered = layoutRenderedNoteLabelHitboxes.get(node.id);
  if (rendered) {
    return rendered;
  }
  const rawLabelPos = getLayoutNoteLabelPosition(node, pos, radius);
  const labelPos = { x: rawLabelPos.x, y: rawLabelPos.y };
  let width = 0;
  let height = layoutNoteTextSize;
  if (featureMode === "ratio") {
    if (!node.active && !node.isCustom && !node.isCenter) {
      return;
    }
    const displayInfo = getCachedDisplayInfo(node);
    const centsLabel = getCachedCentsReadout(
      node,
      {
        wrap: enharmonicsEnabled,
        requireHejiDetail: true,
        baseTextForHeji: displayInfo.pitchClass,
      },
      displayInfo
    );
    ctx.save();
    ctx.font = `${layoutNoteFontWeight} ${layoutNoteTextSize}px ${layoutNoteFont}`;
    const noteWidth = ctx.measureText(displayInfo.pitchClass || "").width;
    const centsWidth = centsLabel ? ctx.measureText(centsLabel).width : 0;
    ctx.restore();
    width = Math.max(noteWidth, centsWidth);
    if (hejiEnabled && centsLabel) {
      height += layoutNoteTextSize + 4;
    }
  } else {
    const ratioText = `${node.numerator}:${node.denominator}`;
    const displayInfo = getCachedDisplayInfo(node);
    const centsLabel = getCachedCentsReadout(
      node,
      { wrap: enharmonicsEnabled },
      displayInfo
    );
    width = Math.max(
      measureTextWidthWithWeight(
        ratioText,
        layoutNoteTextSize,
        layoutNoteFont,
        layoutNoteFontWeight
      ),
      measureTextWidthWithWeight(
        centsLabel,
        layoutNoteTextSize,
        layoutNoteFont,
        layoutNoteFontWeight
      )
    );
    height = centsLabel ? layoutNoteTextSize * 2 + 4 : layoutNoteTextSize;
  }
  const padding = Math.max(4, Math.round(layoutNoteTextSize * 0.25));
  return {
    left: labelPos.x - padding,
    top: labelPos.y - padding,
    width: width + padding * 2,
    height: height + padding * 2,
    labelPos,
  };
}

function serializeLayoutLabelOffsets() {
  return Array.from(layoutLabelOffsets.entries())
    .map(([id, offset]) => {
      const node = nodeById.get(id);
      if (!node) {
        return null;
      }
      if (node.isCustom) {
        const source = nodeById.get(node.sourceNodeId);
        const sourceExponents = Array.isArray(node.sourceExponents)
          ? node.sourceExponents
          : source
          ? [source.exponentX, source.exponentY, source.exponentZ || 0]
          : null;
        if (!sourceExponents) {
          return null;
        }
        return {
          sourceExponents,
          customSlot: node.customSlot,
          factorNumerator: node.factorNumerator,
          factorDenominator: node.factorDenominator,
          x: offset.x,
          y: offset.y,
        };
      }
      return {
        exponents: [node.exponentX, node.exponentY, node.exponentZ || 0],
        x: offset.x,
        y: offset.y,
      };
    })
    .filter(Boolean);
}

function serializeLayoutKeyMappingOffsets() {
  return Array.from(layoutKeyMappingOffsets.entries())
    .map(([id, offset]) => {
      const node = nodeById.get(id);
      if (!node) {
        return null;
      }
      if (node.isCustom) {
        const source = nodeById.get(node.sourceNodeId);
        const sourceExponents = Array.isArray(node.sourceExponents)
          ? node.sourceExponents
          : source
          ? [source.exponentX, source.exponentY, source.exponentZ || 0]
          : null;
        if (!sourceExponents) {
          return null;
        }
        return {
          sourceExponents,
          customSlot: node.customSlot,
          factorNumerator: node.factorNumerator,
          factorDenominator: node.factorDenominator,
          x: offset.x,
          y: offset.y,
        };
      }
      return {
        exponents: [node.exponentX, node.exponentY, node.exponentZ || 0],
        x: offset.x,
        y: offset.y,
      };
    })
    .filter(Boolean);
}

function serializeLayoutPositionOffsets() {
  const epsilon = 1e-9;
  return Array.from(layoutPositionOffsets.entries())
    .map(([key, offset]) => {
      const [expX, expY, expZ] = key.split(",").map(Number);
      const offsetX = Number(offset.x) || 0;
      const offsetY = Number(offset.y) || 0;
      const offsetZ = Number(offset.z) || 0;
      const hasOffset =
        Math.abs(offsetX) > epsilon ||
        Math.abs(offsetY) > epsilon ||
        Math.abs(offsetZ) > epsilon;
      if (!hasOffset) {
        return null;
      }
      if (Math.abs(offsetZ) > epsilon) {
        return [expX, expY, expZ, offsetX, offsetY, offsetZ];
      }
      return [expX, expY, expZ, offsetX, offsetY];
    })
    .filter(Boolean);
}

function serializeLayoutCustomNodePositions() {
  return customNodes
    .map((node) => {
      const coord = layoutPositions.get(node.id);
      if (!coord) {
        return null;
      }
      const source = nodeById.get(node.sourceNodeId);
      const sourceExponents = Array.isArray(node.sourceExponents)
        ? node.sourceExponents
        : source
        ? [source.exponentX, source.exponentY, source.exponentZ || 0]
        : null;
      if (!sourceExponents) {
        return null;
      }
      return {
        sourceExponents,
        customSlot: node.customSlot,
        factorNumerator: node.factorNumerator,
        factorDenominator: node.factorDenominator,
        x: coord.x,
        y: coord.y,
        z: coord.z,
      };
    })
    .filter(Boolean);
}

function serializeLayoutNodeShapes() {
  return Array.from(layoutNodeShapes.entries())
    .map(([id, shape]) => {
      const node = nodeById.get(id);
      if (!node || typeof shape !== "string" || !shape) {
        return null;
      }
      if (node.isCustom) {
        const source = nodeById.get(node.sourceNodeId);
        const sourceExponents = Array.isArray(node.sourceExponents)
          ? node.sourceExponents
          : source
          ? [source.exponentX, source.exponentY, source.exponentZ || 0]
          : null;
        if (!sourceExponents) {
          return null;
        }
        return {
          sourceExponents,
          customSlot: node.customSlot,
          factorNumerator: node.factorNumerator,
          factorDenominator: node.factorDenominator,
          shape,
        };
      }
      return {
        exponents: [node.exponentX, node.exponentY, node.exponentZ || 0],
        shape,
      };
    })
    .filter(Boolean);
}

function applyLayoutCustomNodePositions(entries) {
  if (!Array.isArray(entries)) {
    return;
  }
  const lookup = new Map();
  const legacyLookup = new Map();
  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const sourceNodeId = Number(entry.sourceNodeId);
    const customSlot = Number(entry.customSlot);
    const x = Number(entry.x);
    const y = Number(entry.y);
    const z = Number.isFinite(entry.z) ? Number(entry.z) : 0;
    if (!Number.isFinite(customSlot)) {
      return;
    }
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }
    const sourceExponents = Array.isArray(entry.sourceExponents)
      ? entry.sourceExponents.map(Number)
      : null;
    if (sourceExponents && sourceExponents.length >= 2) {
      const [expX, expY, expZ = 0] = sourceExponents;
      if (Number.isFinite(expX) && Number.isFinite(expY) && Number.isFinite(expZ)) {
        lookup.set(`${expX},${expY},${expZ}|${customSlot}`, { x, y, z });
      }
    }
    if (Number.isFinite(sourceNodeId)) {
      legacyLookup.set(`${sourceNodeId}|${customSlot}`, { x, y, z });
    }
  });
  customNodes.forEach((node) => {
    const source = nodeById.get(node.sourceNodeId);
    const fallbackExponents = Array.isArray(node.sourceExponents)
      ? node.sourceExponents
      : null;
    const expX = source ? source.exponentX : fallbackExponents ? fallbackExponents[0] : null;
    const expY = source ? source.exponentY : fallbackExponents ? fallbackExponents[1] : null;
    const expZ = source
      ? source.exponentZ || 0
      : fallbackExponents && Number.isFinite(fallbackExponents[2])
      ? fallbackExponents[2]
      : 0;
    const key = `${expX},${expY},${expZ}|${node.customSlot}`;
    if (lookup.has(key)) {
      layoutPositions.set(node.id, lookup.get(key));
      return;
    }
    const legacyKey = `${node.sourceNodeId}|${node.customSlot}`;
    if (legacyLookup.has(legacyKey)) {
      layoutPositions.set(node.id, legacyLookup.get(legacyKey));
      return;
    }
    layoutPositions.delete(node.id);
  });
}

function applyLayoutNodeShapes(entries) {
  layoutNodeShapes.clear();
  customNodes.forEach((node) => {
    layoutNodeShapes.set(node.id, "diamond");
  });
  if (!Array.isArray(entries)) {
    return;
  }
  const exponentMap = new Map();
  const customMap = new Map();
  nodes.forEach((node) => {
    if (!node.isCustom) {
      exponentMap.set(`${node.exponentX},${node.exponentY},${node.exponentZ || 0}`, node);
    } else if (Array.isArray(node.sourceExponents)) {
      const [expX, expY, expZ = 0] = node.sourceExponents;
      customMap.set(`${expX},${expY},${expZ}|${node.customSlot}`, node);
    }
  });
  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object" || typeof entry.shape !== "string" || !entry.shape) {
      return;
    }
    if (Array.isArray(entry.exponents) && entry.exponents.length >= 2) {
      const [expX, expY, expZ = 0] = entry.exponents.map(Number);
      const node = exponentMap.get(`${expX},${expY},${expZ}`);
      if (node) {
        layoutNodeShapes.set(node.id, entry.shape);
      }
      return;
    }
    const customSlot = Number(entry.customSlot);
    if (Number.isFinite(customSlot)) {
      const sourceExponents = Array.isArray(entry.sourceExponents)
        ? entry.sourceExponents
        : null;
      if (sourceExponents && sourceExponents.length >= 2) {
        const [expX, expY, expZ = 0] = sourceExponents.map(Number);
        const node = customMap.get(`${expX},${expY},${expZ}|${customSlot}`);
        if (node) {
          layoutNodeShapes.set(node.id, entry.shape);
        }
      }
    }
  });
}

function applyLayoutLabelOffsets(entries) {
  layoutLabelOffsets.clear();
  if (!Array.isArray(entries)) {
    return;
  }
  const exponentMap = new Map();
  const customMap = new Map();
  const customMapBySourceId = new Map();
  nodes.forEach((node) => {
    if (!node.isCustom) {
      exponentMap.set(
        `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
        node
      );
    } else if (Array.isArray(node.sourceExponents)) {
      const [expX, expY, expZ = 0] = node.sourceExponents;
      customMap.set(`${expX},${expY},${expZ}|${node.customSlot}`, node);
    }
    if (node.isCustom && Number.isFinite(node.sourceNodeId)) {
      customMapBySourceId.set(`${node.sourceNodeId}|${node.customSlot}`, node);
    }
  });
  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const x = Number(entry.x);
    const y = Number(entry.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }
    const customSlot = Number(entry.customSlot);
    if (Number.isFinite(customSlot)) {
      const sourceExponents = Array.isArray(entry.sourceExponents)
        ? entry.sourceExponents
        : null;
      if (sourceExponents && sourceExponents.length >= 2) {
        const [expX, expY, expZ = 0] = sourceExponents.map(Number);
        const node = customMap.get(`${expX},${expY},${expZ}|${customSlot}`);
        if (node) {
          layoutLabelOffsets.set(node.id, { x, y });
        }
        return;
      }
      const sourceNodeId = Number(entry.sourceNodeId);
      if (Number.isFinite(sourceNodeId)) {
        const node = customMapBySourceId.get(`${sourceNodeId}|${customSlot}`);
        if (node) {
          layoutLabelOffsets.set(node.id, { x, y });
        }
      }
      return;
    }
    if (Array.isArray(entry.exponents) && entry.exponents.length >= 2) {
      const [expX, expY, expZ = 0] = entry.exponents.map(Number);
      const node = exponentMap.get(`${expX},${expY},${expZ}`);
      if (node) {
        layoutLabelOffsets.set(node.id, { x, y });
      }
      return;
    }
    const id = Number(entry.id);
    if (Number.isFinite(id)) {
      const node = nodeById.get(id);
      if (node) {
        layoutLabelOffsets.set(node.id, { x, y });
      }
    }
  });
}

function applyLayoutKeyMappingOffsets(entries) {
  layoutKeyMappingOffsets.clear();
  if (!Array.isArray(entries)) {
    return;
  }
  const exponentMap = new Map();
  const customMap = new Map();
  const customMapBySourceId = new Map();
  nodes.forEach((node) => {
    if (!node.isCustom) {
      exponentMap.set(
        `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
        node
      );
    } else if (Array.isArray(node.sourceExponents)) {
      const [expX, expY, expZ = 0] = node.sourceExponents;
      customMap.set(`${expX},${expY},${expZ}|${node.customSlot}`, node);
    }
    if (node.isCustom && Number.isFinite(node.sourceNodeId)) {
      customMapBySourceId.set(`${node.sourceNodeId}|${node.customSlot}`, node);
    }
  });
  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const x = Number(entry.x);
    const y = Number(entry.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }
    const customSlot = Number(entry.customSlot);
    if (Number.isFinite(customSlot)) {
      const sourceExponents = Array.isArray(entry.sourceExponents)
        ? entry.sourceExponents
        : null;
      if (sourceExponents && sourceExponents.length >= 2) {
        const [expX, expY, expZ = 0] = sourceExponents.map(Number);
        const node = customMap.get(`${expX},${expY},${expZ}|${customSlot}`);
        if (node) {
          layoutKeyMappingOffsets.set(node.id, { x, y });
        }
        return;
      }
      const sourceNodeId = Number(entry.sourceNodeId);
      if (Number.isFinite(sourceNodeId)) {
        const node = customMapBySourceId.get(`${sourceNodeId}|${customSlot}`);
        if (node) {
          layoutKeyMappingOffsets.set(node.id, { x, y });
        }
      }
      return;
    }
    if (Array.isArray(entry.exponents) && entry.exponents.length >= 2) {
      const [expX, expY, expZ = 0] = entry.exponents.map(Number);
      const node = exponentMap.get(`${expX},${expY},${expZ}`);
      if (node) {
        layoutKeyMappingOffsets.set(node.id, { x, y });
      }
      return;
    }
    const id = Number(entry.id);
    if (Number.isFinite(id)) {
      const node = nodeById.get(id);
      if (node) {
        layoutKeyMappingOffsets.set(node.id, { x, y });
      }
    }
  });
}

function applyLayoutPositionOffsets(entries) {
  layoutPositionOffsets.clear();
  if (!Array.isArray(entries)) {
    return;
  }
  const exponentMap = new Map();
  nodes.forEach((node) => {
    if (!node.isCustom) {
      exponentMap.set(
        `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
        node
      );
    }
  });
  entries.forEach((entry) => {
    if (!entry) {
      return;
    }
    let expX;
    let expY;
    let expZ = 0;
    let offsetX = 0;
    let offsetY = 0;
    let offsetZ = 0;
    if (Array.isArray(entry)) {
      if (entry.length < 5) {
        return;
      }
      expX = Number(entry[0]);
      expY = Number(entry[1]);
      expZ = Number(entry[2]) || 0;
      offsetX = Number(entry[3]) || 0;
      offsetY = Number(entry[4]) || 0;
      offsetZ = Number(entry[5]) || 0;
    } else if (typeof entry === "object") {
      offsetX = Number(entry.offsetX) || 0;
      offsetY = Number(entry.offsetY) || 0;
      offsetZ = Number(entry.offsetZ) || 0;
      if (Array.isArray(entry.exponents) && entry.exponents.length >= 2) {
        [expX, expY, expZ = 0] = entry.exponents.map(Number);
      } else {
        return;
      }
    } else {
      return;
    }
    if (!Number.isFinite(expX) || !Number.isFinite(expY) || !Number.isFinite(expZ)) {
      return;
    }
    const node = exponentMap.get(`${expX},${expY},${expZ}`);
    if (!node) {
      return;
    }
    layoutPositionOffsets.set(`${expX},${expY},${expZ}`, {
      x: offsetX,
      y: offsetY,
      z: offsetZ,
    });
    const base = getLayoutBaseCoordinate(node);
    layoutPositions.set(node.id, {
      x: base.x + offsetX,
      y: base.y + offsetY,
      z: base.z + offsetZ,
    });
  });
}

function updateDragLock(drag, event) {
  if (!event.shiftKey || event.altKey) {
    drag.lockAxis = null;
    drag.lockOriginX = event.offsetX;
    drag.lockOriginY = event.offsetY;
    return null;
  }
  if (!drag.lockAxis) {
    const dx = event.offsetX - drag.lockOriginX;
    const dy = event.offsetY - drag.lockOriginY;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      return null;
    }
    drag.lockAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
  }
  return drag.lockAxis;
}

function updateProjectedAxisLock(drag, event) {
  if (!event.shiftKey || !event.altKey) {
    drag.axisLock = null;
    drag.axisLockJustSet = false;
    drag.axisLockOriginX = event.offsetX;
    drag.axisLockOriginY = event.offsetY;
    return null;
  }
  if (!drag.axisLock) {
    const originX = Number.isFinite(drag.axisLockOriginX)
      ? drag.axisLockOriginX
      : drag.lockOriginX;
    const originY = Number.isFinite(drag.axisLockOriginY)
      ? drag.axisLockOriginY
      : drag.lockOriginY;
    const dx = event.offsetX - originX;
    const dy = event.offsetY - originY;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      return null;
    }
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const settings = getAxisLegendSettings();
    const candidates = [
      { axis: "x", dir: settings.xDir },
      { axis: "y", dir: settings.yDir },
      { axis: "z", dir: settings.zDir },
    ].filter((entry) => hasActiveAxis(entry.axis) && !layoutAxisHidden[entry.axis]);
    const pool = candidates.length ? candidates : [
      { axis: "x", dir: settings.xDir },
      { axis: "y", dir: settings.yDir },
      { axis: "z", dir: settings.zDir },
    ];
    let best = null;
    let bestDot = -1;
    pool.forEach((entry) => {
      if (!entry.dir) {
        return;
      }
      const dot = Math.abs(ux * entry.dir.x + uy * entry.dir.y);
      if (dot > bestDot) {
        bestDot = dot;
        best = entry;
      }
    });
    drag.axisLock = best ? { axis: best.axis, dir: best.dir } : null;
    drag.axisLockJustSet = Boolean(drag.axisLock);
    drag.axisLockOriginX = event.offsetX;
    drag.axisLockOriginY = event.offsetY;
  }
  return drag.axisLock;
}

function syncLayoutViewFromCurrent() {
  layoutView = {
    zoom: view.zoom,
    offsetX: view.offsetX,
    offsetY: view.offsetY,
    rotX: view.rotX,
    rotY: view.rotY,
  };
}

function updateLayoutLinkControls() {
  if (layoutFreezeButton) {
    layoutFreezeButton.textContent = layoutLockPosition
      ? "Unfreeze"
      : "Freeze & Edit Layout";
  }
  if (layoutOverlay) {
    layoutOverlay.hidden = !(layoutMode && !layoutLockPosition);
  }
  if (layoutMode && !layoutLockPosition && distanceSelectMode) {
    setDistanceSelectMode(false);
  }
}

function refreshLayoutFromView({ flatten = false } = {}) {
  const preservedAxisOffsets = {
    x: { ...layoutAxisOffsets.x },
    y: { ...layoutAxisOffsets.y },
    z: { ...layoutAxisOffsets.z },
  };
  const preservedAxisAngles = { ...layoutAxisAngles };
  const preservedCustomLabels = layoutCustomLabels.map((entry) => ({
    ...entry,
    position: entry.position ? { ...entry.position } : null,
  }));
  const preservedCustomLabelId = layoutCustomLabelId;
  const preservedTitle = layoutTitle;
  const preservedCreator = layoutCreator;
  const preservedTitlePos = layoutTitlePosition ? { ...layoutTitlePosition } : null;
  const preservedCreatorPos = layoutCreatorPosition ? { ...layoutCreatorPosition } : null;
  const preservedNodeShapes = new Map(layoutNodeShapes);

  layoutPositions.clear();
  layoutPositionOffsets.clear();
  layoutLabelOffsets.clear();
  layoutKeyMappingOffsets.clear();
  layoutNodeShapes.clear();

  layoutAxisOffsets = preservedAxisOffsets;
  layoutAxisAngles = preservedAxisAngles;
  layoutCustomLabels = preservedCustomLabels;
  layoutCustomLabelId = preservedCustomLabelId;
  layoutTitle = preservedTitle;
  layoutCreator = preservedCreator;
  layoutTitlePosition = preservedTitlePos;
  layoutCreatorPosition = preservedCreatorPos;
  layoutNodeShapes = preservedNodeShapes;

  if (flatten) {
    const sourceView = {
      zoom: view.zoom,
      offsetX: view.offsetX,
      offsetY: view.offsetY,
      rotX: view.rotX,
      rotY: view.rotY,
    };
    layoutSourceView = { ...sourceView };
    layoutView = {
      zoom: sourceView.zoom,
      offsetX: sourceView.offsetX,
      offsetY: sourceView.offsetY,
      rotX: 0,
      rotY: 0,
    };
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    nodes.forEach((node) => {
      const coord = layoutMode ? getLayoutBaseCoordinate(node) : node.coordinate;
      const screen = worldToScreen(coord, false);
      const scale = Number.isFinite(screen.scale) ? screen.scale : 1;
      const safeScale = Math.max(0.15, scale);
      const projectedX = (screen.x - centerX) / sourceView.zoom - sourceView.offsetX;
      const projectedY = (screen.y - centerY) / sourceView.zoom - sourceView.offsetY;
      const worldX = projectedX / safeScale;
      const worldY = projectedY / safeScale;
      const z = (1 / safeScale - 1) / 0.002 - cameraDistance;
      const flattenedCoord = { x: worldX, y: worldY, z };
      layoutPositions.set(node.id, flattenedCoord);
      if (!node.isCustom) {
        const base = getLayoutBaseCoordinate(node);
        layoutPositionOffsets.set(
          `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
          {
            x: flattenedCoord.x - base.x,
            y: flattenedCoord.y - base.y,
            z: flattenedCoord.z - base.z,
          }
        );
      }
    });
    if (layoutMode) {
      view.zoom = layoutView.zoom;
      view.offsetX = layoutView.offsetX;
      view.offsetY = layoutView.offsetY;
      view.rotX = 0;
      view.rotY = 0;
      syncLayoutScaleInput();
    }
  } else {
    syncLayoutViewFromCurrent();
    if (layoutMode) {
      nodes.forEach((node) => ensureLayoutPosition(node));
    }
  }
  updateLayoutCustomLabelControls();
  draw();
  schedulePresetUrlUpdate();
}

const noteNamesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteNamesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
const HEJI_STEP_OFFSETS = {
  3: 7,
  5: 4,
  7: 10,
  11: 5,
  13: 9,
  17: 1,
  19: 3,
  23: 6,
  29: 10,
  31: 0,
  37: 2,
  41: 4,
  43: 5,
  47: 6,
};
const primes = [
  3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73,
  79, 83, 89, 97,
];
const AXIS_MIN_XY_DEFAULT = -8;
const AXIS_MAX_XY_DEFAULT = 8;
const AXIS_MIN_Z_DEFAULT = -3;
const AXIS_MAX_Z_DEFAULT = 3;
const AXIS_MIN_XY_LIMIT = -16;
const AXIS_MAX_XY_LIMIT = 16;
const AXIS_MIN_Z_LIMIT = -10;
const AXIS_MAX_Z_LIMIT = 10;
const DEFAULT_GRID_COLS = AXIS_MAX_XY_DEFAULT - AXIS_MIN_XY_DEFAULT + 1;
const DEFAULT_GRID_ROWS = AXIS_MAX_XY_DEFAULT - AXIS_MIN_XY_DEFAULT + 1;
const DEFAULT_GRID_DEPTH = AXIS_MAX_Z_DEFAULT - AXIS_MIN_Z_DEFAULT + 1;
const AXIS_RANGE_MAX_COLS = AXIS_MAX_XY_LIMIT - AXIS_MIN_XY_LIMIT + 1;
const AXIS_RANGE_MAX_ROWS = AXIS_MAX_XY_LIMIT - AXIS_MIN_XY_LIMIT + 1;
const AXIS_RANGE_MAX_DEPTH = AXIS_MAX_Z_LIMIT - AXIS_MIN_Z_LIMIT + 1;
let GRID_COLS = DEFAULT_GRID_COLS;
let GRID_ROWS = DEFAULT_GRID_ROWS;
let GRID_DEPTH = DEFAULT_GRID_DEPTH;
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
const PIANO_KEY_LABELS = new Map();
Object.entries(KEYBOARD_MAP).forEach(([key, semitone]) => {
  if (semitone >= 0 && semitone < 12 && !PIANO_KEY_LABELS.has(semitone)) {
    PIANO_KEY_LABELS.set(semitone, key);
  }
});
const PIANO_KEY_PITCH_CLASSES = new Map();
noteNamesSharp.forEach((name, index) => {
  PIANO_KEY_PITCH_CLASSES.set(name, index);
});
noteNamesFlat.forEach((name, index) => {
  if (!PIANO_KEY_PITCH_CLASSES.has(name)) {
    PIANO_KEY_PITCH_CLASSES.set(name, index);
  }
});
const KEYBOARD_BASE_MIDI = 60;
const HEJI_SUFFIX_Y_OFFSET = -0.52;
const HEJI_SVG_EXTRA_Y_OFFSET = 0.54;
const HEJI_REST_GAP = 0.08;
const HEJI_REST_GAP_PLAIN = -0.2;
const CENTS_CHAR = "¢";
const CENTS_SIZE_DELTA = 3;
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
let lineLabelOverrides = new Map();
let lineLabelPositionOverrides = new Map();
let voices = [];
let pitchInstances = [];
let nextVoiceId = 1;
const MIN_FREQ = 40;
const MAX_FREQ = 19000;
const SNAPSHOT_MORPH_MAX_CENTS = 500;
let is3DMode = false;
let isFlattened2D = false;
let showAxes = true;
let showGrid = true;
let gridDepth = 1;
let gridCenterZ = 0;
let latticeExponentOffset = { x: 0, y: 0, z: 0 };
const axisStack = [];
let zKeyHeld = false;
let xKeyHeld = false;
let yKeyHeld = false;
let isAddMode = false;
let shiftHeld = false;
let capsLockOn = false;

function syncCapsLockState(event) {
  if (!event.getModifierState) {
    return;
  }
  const nextState = event.getModifierState("CapsLock");
  if (nextState === capsLockOn) {
    return;
  }
  capsLockOn = nextState;
  updateAddModeFromShift();
  draw();
}
const AXIS_DIM_FACTOR = 0.35;

function getGridCoord(node, coord) {
  if (!node) {
    return 0;
  }
  const value = node[`grid${coord.toUpperCase()}`];
  if (Number.isFinite(value)) {
    return value;
  }
  if (coord === "z") {
    return gridCenterZ;
  }
  return 0;
}

function getActiveAxisEntry() {
  return axisStack.length ? axisStack[axisStack.length - 1] : null;
}

function axisModeActive() {
  return axisStack.length > 0;
}

function createAxisEntry(axis, node) {
  const anchor = {
    x: getGridCoord(node, "x"),
    y: getGridCoord(node, "y"),
    z: getGridCoord(node, "z"),
  };
  const coordinate = node ? getNodeDisplayCoordinate(node) : gridCoordToWorld(anchor);
  return { axis, anchor, nodeId: node && node.id ? node.id : null, coordinate };
}

function clearAxisStack() {
  if (!axisStack.length) {
    return;
  }
  axisStack.length = 0;
}

function popAxisStack() {
  if (!axisStack.length) {
    return;
  }
  axisStack.pop();
}

function pushAxisStack(axis, node) {
  axisStack.push(createAxisEntry(axis, node));
}

function gridCoordToWorld(coord) {
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const centerZ = gridCenterZ;
  return {
    x: (coord.x - centerX) * GRID_SPACING,
    y: (coord.y - centerY) * GRID_SPACING,
    z: (coord.z - centerZ) * GRID_SPACING,
  };
}

function getAxisAnchorWorld(entry) {
  if (!entry) {
    return null;
  }
  return entry.coordinate || gridCoordToWorld(entry.anchor);
}

function isNodeOnAxisEntry(node, entry) {
  if (!entry) {
    return true;
  }
  const gridX = getGridCoord(node, "x");
  const gridY = getGridCoord(node, "y");
  const gridZ = getGridCoord(node, "z");
  if (entry.axis === "z") {
    return gridX === entry.anchor.x && gridY === entry.anchor.y;
  }
  if (entry.axis === "x") {
    return gridY === entry.anchor.y && gridZ === entry.anchor.z;
  }
  return gridX === entry.anchor.x && gridZ === entry.anchor.z;
}

function isEdgeOnAxisEntry(a, b, entry) {
  if (!entry) {
    return true;
  }
  return isNodeOnAxisEntry(a, entry) && isNodeOnAxisEntry(b, entry);
}

function getRequestedAxisKey() {
  if (zKeyHeld) {
    return "z";
  }
  if (xKeyHeld) {
    return "x";
  }
  if (yKeyHeld) {
    return "y";
  }
  return null;
}

function activateAxisFromHit(axis, node) {
  if (!axis || !node) {
    return false;
  }
  const activeAxis = getActiveAxisEntry();
  if (activeAxis && !isNodeOnAxisEntry(node, activeAxis)) {
    return false;
  }
  const entry = createAxisEntry(axis, node);
  if (activeAxis && activeAxis.axis === axis) {
    axisStack[axisStack.length - 1] = entry;
  } else {
    pushAxisStack(axis, node);
  }
  updateAddModeFromShift();
  updateUiHint();
  updateBannerMessage();
  syncAnalysisLayerToggles();
  schedulePresetUrlUpdate();
  draw();
  return true;
}

function deactivateAxisMode() {
  if (!axisModeActive()) {
    return false;
  }
  popAxisStack();
  updateAddModeFromShift();
  updateUiHint();
  updateBannerMessage();
  schedulePresetUrlUpdate();
  draw();
  return true;
}
let isomorphicKeyMap = null;
let isomorphicLayout = null;
let isomorphicDirty = true;
let isomorphicTriangleKeyMap = null;
let isomorphicTriangleLayout = null;
let isomorphicTriangleDirty = true;
let triangleKeyboardActiveKeys = new Map();
let keyboardKeyPositions = null;
let looperState = "idle";
let looperEvents = [];
let looperStartMs = 0;
let looperLoopDurationMs = 0;
let looperCycleStartMs = 0;
let looperCycleTimer = null;
let looperTimeouts = [];
let looperVoicesByNode = new Map();
let looperQuantizeEnabled = false;
let looperQuantizeGrid = "16";
let looperQuantizeStrength = 1;
let patternPlayerState = "idle";
let patternNextTimer = null;
let patternOffTimers = [];
let patternActiveNodes = [];
let patternSequenceState = null;
let patternRhythmState = null;
let patternOctaveState = null;
let patternVoices = new Set();
let patternStepCounter = 0;
let tempoBpm = 120;
let patternLengthValue = 1;
let patternLengthMode = "sustain";
let envelopeTimeMode = "absolute";
let pendingPlayState = null;
const snapshotSlots = Array.from({ length: 10 }, () => null);
const snapshotLetterSlots = Array.from({ length: 26 }, () => null);
const SNAPSHOT_KEY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];
const snapshotKeyToSlot = new Map();
const snapshotLetterKeyToSlot = new Map();
let snapshotKeyboardContainer = null;
let snapshotKeyboardKeys = null;
let snapshotActiveIndex = -1;
let snapshotBaseState = null;
let pendingSnapshotIndex = -1;
let pendingSnapshotState = null;
let pendingSnapshotLetterKey = "";
let pendingSnapshotAtNextEvent = false;
let snapshotDeferToCycleEnd = false;
let snapshotRestorePlayNodes = true;
let snapshotConnectCommonTones = false;
let snapshotMorphEnabled = false;
let snapshotMorphTimeMs = 100;
let snapshotRestoreView = true;
let snapshotRestoreSequence = true;
let snapshotRestoreSynthSettings = true;
let snapshotRestoreKeyboardMode = true;
let snapshotRestoreLfos = true;
let snapshotRestoreLfoPhase = false;
let snapshotKeyboardMode = false;
let snapshotKeyboardActive = false;
let snapshotKeyboardPrevMode = "";
let snapshotActiveLetterKey = "";
let snapshotDebugEnabled = false;
let customNodes = [];
let nextCustomNodeId = 200000;
let pendingCustomAction = null;
let lastCustomFactor = { numerator: 5, denominator: 4 };
let cHeld = false;
let layoutMode = false;
let layoutAlignMode = "";
let layoutAlignAnchorId = null;
let layoutStraightenAnchorId = null;
let layoutStraightenDir = null;
let layoutDrag = null;
let layoutLabelDrag = null;
let layoutPositions = new Map();
let layoutPositionOffsets = new Map();
let layoutLabelOffsets = new Map();
let layoutKeyMappingOffsets = new Map();
let pendingLayoutLabelOffsets = null;
let pendingLayoutPositionOffsets = null;
let pendingLayoutKeyMappingOffsets = null;
let pendingLayoutCustomPositions = null;
let pendingLayoutNodeShapes = null;
let pendingLayoutSpacing = null;
let customNodeDrag = null;
let layoutNodeShapes = new Map();
let nodeSpellingOverrides = new Map();
let nodeOctaveOffsets = new Map();
let octaveShiftTargetId = null;
let layoutNodeSize = 35;
let layoutRatioTextSize = 21;
let layoutNoteTextSize = 14;
let layoutTriangleLabelTextSize = 20;
let layoutCustomLabelTextSize = 18;
let layoutKeyMappingTextSize = 11;
let layoutKeyMappingOffset = 6;
let layoutKeyMappingDark = false;
let layoutKeyMappingPrefix = "";
let layoutKeyMappingSuffix = "";
let layoutSpacing = { x: 1, y: 1, z: 1 };
let layoutNodeShape = "circle";
let layoutTitle = "";
let layoutCreator = "";
let layoutTitleSize = 28;
let layoutCreatorSize = 18;
let layoutTitleMargin = 32;
let layoutTitlePosition = null;
let layoutCreatorPosition = null;
let layoutUnifyNodeSize = true;
let layoutPerspectiveTextSize = false;
let layoutFreezeFlatten = false;
let layoutPageSize = "letter";
let layoutOrientation = "landscape";
let layoutLockPosition = false;
let layoutView = { zoom: 1, offsetX: 0, offsetY: 0, rotX: 0, rotY: 0 };
let layoutPrevState = null;
let layoutSourceView = null;
let layoutTitleFont = "Lexend";
let layoutRatioFont = "Noto Serif";
let layoutNoteFont = "Lexend";
let layoutTriangleLabelFont = "Noto Serif";
let layoutCustomLabelFont = "Noto Serif";
let layoutKeyMappingFont = "Lexend";
let layoutAxisLegendFont = "Noto Serif";
let layoutLineLabelFont = "Noto Serif";
let layoutCreatorFont = "Lexend";
let layoutTitleFontWeight = 400;
let layoutRatioFontWeight = 400;
let layoutNoteFontWeight = 200;
let layoutTriangleLabelFontWeight = 400;
let layoutCustomLabelFontWeight = 400;
let layoutKeyMappingFontWeight = 400;
let layoutAxisLegendFontWeight = 400;
let layoutLineLabelFontWeight = 400;
let layoutCreatorFontWeight = 400;
let layoutAxisLegendTextSize = 19;
let layoutLineLabelTextSize = 13;
let layoutCustomLabels = [];
let layoutCustomLabelPending = null;
let layoutCustomLabelId = 1;
let layoutCustomLabelEditId = null;
let layoutAxisOffsets = {
  x: { x: 0, y: 0 },
  y: { x: 0, y: 0 },
  z: { x: 0, y: 0 },
};
let layoutAxisHidden = { x: false, y: false, z: false };
let layoutAxisAngles = {
  x: null,
  y: null,
  z: null,
};
let layoutAxisDrag = null;
let layoutAxisEdit = null;
let layoutAxisEditDrag = null;
let layoutTitleDrag = null;
let layoutCreatorDrag = null;
let layoutCustomLabelDrag = null;
let layoutKeyMappingDrag = null;
const layoutUndoStack = [];
const layoutRedoStack = [];
const LAYOUT_UNDO_LIMIT = 50;
let layoutWheelUndoTimer = null;
let spellingMode = "simple";
let spellingHintActive = false;
let fundamentalSpelling = "sharp";
let featureMode = "ratio";
let showHz = false;
let showRatioCents = false;
let showCentsDeviation = true;
let showCentsSign = false;
let directionalRatioLabels = false;
let hejiEnabled = true;
let enharmonicsEnabled = true;
let enharmonicsEnabledPreference = true;
let centsPrecision = 0;
let hzPrecision = 2;
let showCircles = true;
let show3DShading = true;
let showLineLabels = true;
let showKeyMappings = true;
let layoutKeyMappingMode = "hide";
let showHelpEnabled = true;
let connectOrphansEnabled = false;
let latticeTiltDeg = 0;
let orphanGuideNodes = new Set();
let orphanGuideEdges = new Set();
let uiHintDismissed = false;
let uiHintKey = "";
let keyboardHelpTimer = null;
let customPianoMap = new Map();
let pendingCustomPianoMap = null;
let customPianoMapMode = false;
let customPianoSelectedKey = null;
let customPianoPreviewVoices = new Map();
let customPianoLabelMap = null;
let customPianoLabelDirty = true;
let customPianoMapClickActive = false;
const customPianoActiveKeys = new Map();
const labelCache = new Map();
let labelCacheKey = "";
let labelCacheDataVersion = 0;
const textWidthCache = new Map();
let drawPending = false;
const DEBUG_CENTS = false;
let tiltCos = 1;
let tiltSin = 0;
const DEBUG_R_CLICK = false;

const LAYOUT_PX_PER_IN = 96;
const LAYOUT_PAGE_SIZES = {
  letter: { widthIn: 8.5, heightIn: 11 },
  a4: { widthIn: 8.27, heightIn: 11.69 },
};
const LAYOUT_DEFAULTS = {
  nodeSize: 35,
  ratioTextSize: 21,
  noteTextSize: 14,
  triangleLabelTextSize: 20,
  customLabelTextSize: 18,
  keyMappingTextSize: 11,
  keyMappingOffset: 6,
  keyMappingDark: false,
  keyMappingPrefix: "",
  keyMappingSuffix: "",
  spacing: { x: 1, y: 1, z: 1 },
  nodeShape: "circle",
  title: "",
  creator: "",
  titleSize: 28,
  creatorSize: 18,
  titleMargin: 32,
  keyMappingsMode: "hide",
  unifyNodeSize: true,
  perspectiveTextSize: false,
  freezeFlatten: false,
  pageSize: "letter",
  orientation: "landscape",
  zoom: 1,
  lockPosition: false,
  view: { zoom: 1, offsetX: 0, offsetY: 0, rotX: 0, rotY: 0 },
  titleFont: "Lexend",
  ratioFont: "Noto Serif",
  noteFont: "Lexend",
  triangleLabelFont: "Noto Serif",
  customLabelFont: "Noto Serif",
  keyMappingFont: "Lexend",
  axisLegendFont: "Noto Serif",
  lineLabelFont: "Noto Serif",
  creatorFont: "Lexend",
  titleFontWeight: 400,
  ratioFontWeight: 400,
  noteFontWeight: 200,
  triangleLabelFontWeight: 400,
  customLabelFontWeight: 400,
  keyMappingFontWeight: 400,
  axisLegendFontWeight: 400,
  lineLabelFontWeight: 400,
  creatorFontWeight: 400,
  axisLegendTextSize: 19,
  lineLabelTextSize: 13,
  axisHidden: { x: false, y: false, z: false },
};

function updateNavModeSections() {
  if (!nav3dPanel) {
    return;
  }
  nav3dPanel.dataset.mode = is3DMode ? "3d" : "2d";
  nav3dPanel.querySelectorAll("[data-nav-mode]").forEach((element) => {
    const mode = element.getAttribute("data-nav-mode");
    element.hidden = (mode === "3d" && !is3DMode) || (mode === "2d" && is3DMode);
  });
}

function updateKeyMappingToggleVisibility() {
  if (!navKeyMappingsToggle) {
    return;
  }
  const container = navKeyMappingsToggle.closest(".control-group");
  const keyboardMode = getKeyboardMode();
  const showNavToggle =
    keyboardMode === "piano" ||
    keyboardMode === "piano-custom" ||
    keyboardMode === "iso" ||
    keyboardMode === "iso-fuzzy" ||
    keyboardMode === "iso-tri";
  if (container) {
    container.hidden = !showNavToggle;
    container.style.display = showNavToggle ? "" : "none";
  } else {
    navKeyMappingsToggle.hidden = !showNavToggle;
  }
  if (layoutKeyMappingsGroup) {
    layoutKeyMappingsGroup.hidden = keyboardMode !== "piano-custom";
    if (layoutKeyMappingsGroup.hidden && layoutKeyMappingPopover) {
      layoutKeyMappingPopover.hidden = true;
      if (layoutKeyMappingTrigger) {
        layoutKeyMappingTrigger.setAttribute("aria-expanded", "false");
      }
    }
  }
}

function updateNavPanelVisibility() {
  if (!nav3dPanel) {
    return;
  }
  nav3dPanel.hidden = layoutMode;
  updateNavModeSections();
}

function syncViewModeControls() {
  const mode = layoutMode ? "layout" : is3DMode ? "3d" : "2d";
  if (viewModeInputs.length) {
    viewModeInputs.forEach((input) => {
      input.checked = input.value === mode;
    });
  }
  if (viewModeButtons.length) {
    viewModeButtons.forEach((button) => {
      const isActive = button.dataset.viewMode === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }
}

function syncSpellingModeControls() {
  if (!spellingModeButtons.length) {
    return;
  }
  spellingModeButtons.forEach((button) => {
    const isActive = button.dataset.spellingMode === spellingMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncFeatureModeControls() {
  if (!featureModeButtons.length) {
    return;
  }
  featureModeButtons.forEach((button) => {
    const isActive = button.dataset.featureMode === featureMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncCentsPrecisionControls() {
  if (!centsPrecisionButtons.length) {
    return;
  }
  centsPrecisionButtons.forEach((button) => {
    const isActive = Number(button.dataset.centsPrecision) === centsPrecision;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncHzPrecisionControls() {
  if (!hzPrecisionButtons.length) {
    return;
  }
  hzPrecisionButtons.forEach((button) => {
    const isActive = Number(button.dataset.hzPrecision) === hzPrecision;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncLayoutKeyMappingControls() {
  if (!layoutKeyMappingButtons.length) {
    return;
  }
  layoutKeyMappingButtons.forEach((button) => {
    const isActive = button.dataset.layoutKeyMapping === layoutKeyMappingMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function getPianoKeyLabel(pitchClass) {
  const index = PIANO_KEY_PITCH_CLASSES.get(pitchClass);
  if (index == null) {
    return "";
  }
  const label = PIANO_KEY_LABELS.get(index) || "";
  return label ? label.toUpperCase() : "";
}

function shouldShowLayoutKeyMappingLabel(label, pitchClass) {
  if (layoutKeyMappingMode === "hide") {
    return false;
  }
  if (layoutKeyMappingMode === "all") {
    return true;
  }
  if (layoutKeyMappingMode !== "unique") {
    return true;
  }
  const pcIndex = PIANO_KEY_PITCH_CLASSES.get(pitchClass);
  if (pcIndex == null) {
    return true;
  }
  const allowed = new Set([noteNamesSharp[pcIndex], noteNamesFlat[pcIndex]]);
  const labels = String(label || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (!labels.length) {
    return false;
  }
  return labels.some((entry) => !allowed.has(entry));
}

function getLayoutKeyMappingLabelText(label) {
  const prefix = layoutKeyMappingPrefix || "";
  const suffix = layoutKeyMappingSuffix || "";
  const prefixText = prefix ? `${prefix} ` : "";
  const suffixText = suffix ? ` ${suffix}` : "";
  return `${prefixText}${label}${suffixText}`;
}

function setLayoutKeyMappingMode(nextMode) {
  const allowed = new Set(["hide", "unique", "all"]);
  const next = allowed.has(nextMode) ? nextMode : layoutKeyMappingMode;
  if (next === layoutKeyMappingMode) {
    return;
  }
  layoutKeyMappingMode = next;
  syncLayoutKeyMappingControls();
  schedulePresetUrlUpdate();
  draw();
}

function markIsomorphicDirty() {
  isomorphicDirty = true;
  isomorphicKeyMap = null;
  isomorphicLayout = null;
  isomorphicTriangleDirty = true;
  isomorphicTriangleKeyMap = null;
  isomorphicTriangleLayout = null;
  markAutoTrianglesDirty();
}

function updateLooperButton() {
  if (!looperToggle) {
    return;
  }
  if (looperState === "recording") {
    looperToggle.textContent = "Play";
    looperToggle.classList.add("button-on");
  } else if (looperState === "overdubbing") {
    looperToggle.textContent = "Play";
    looperToggle.classList.add("button-on");
  } else if (looperState === "playing") {
    looperToggle.textContent = "Overdub";
    looperToggle.classList.add("button-on");
  } else if (looperState === "ready") {
    looperToggle.textContent = "Play";
    looperToggle.classList.remove("button-on");
  } else {
    looperToggle.textContent = "Record";
    looperToggle.classList.remove("button-on");
  }
  updateBannerMessage();
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

function updateLooperQuantizeStrengthReadout() {
  if (!looperQuantizeStrengthReadout) {
    return;
  }
  looperQuantizeStrengthReadout.textContent = `${Math.round(looperQuantizeStrength * 100)}%`;
}

function updatePatternLengthAvailability() {
  const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
  patternLengthModeInputs.forEach((input) => {
    input.disabled = isOneShot;
  });
  if (patternLengthSlider) {
    patternLengthSlider.disabled = isOneShot;
  }
  if (patternLengthGroup) {
    patternLengthGroup.classList.toggle("is-disabled", isOneShot);
  }
  if (patternLengthNote) {
    patternLengthNote.hidden = !isOneShot;
  }
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

function getSnapshotPatternState() {
  if (patternPlayerState !== "playing") {
    return null;
  }
  if (!patternSequenceState || !patternRhythmState || !patternOctaveState) {
    return null;
  }
  return {
    sequence: patternSequenceState.type,
    rhythm: patternRhythmState.type,
    octave: patternOctaveState.type,
  };
}

function getSnapshotLooperState() {
  const looperActive = looperState === "playing" || looperState === "overdubbing";
  if (!looperActive || !Array.isArray(looperEvents) || !looperEvents.length) {
    return null;
  }
  const events = looperEvents
    .filter(
      (event) =>
        event &&
        (event.type === "on" || event.type === "off") &&
        Number.isFinite(event.nodeId) &&
        Number.isFinite(event.t)
    )
    .map((event) => ({
      type: event.type,
      nodeId: Math.trunc(event.nodeId),
      t: Math.max(0, Math.round(event.t)),
      octave: Number.isFinite(event.octave) ? Math.trunc(event.octave) : 0,
      oneShot: event.oneShot === true,
    }))
    .sort((a, b) => a.t - b.t);
  if (!events.length) {
    return null;
  }
  const maxEventT = events.reduce((max, event) => Math.max(max, event.t), 0);
  const requestedLoopDuration = Number(looperLoopDurationMs) || 0;
  const loopDurationMs = Math.max(250, Math.round(requestedLoopDuration), maxEventT);
  return {
    loopDurationMs,
    events,
  };
}

function restoreSnapshotLooper(snapshot) {
  const looper = snapshot && snapshot.looper;
  if (!looper || !Array.isArray(looper.events) || !looper.events.length) {
    clearLooper();
    return;
  }
  const events = looper.events
    .filter(
      (event) =>
        event &&
        (event.type === "on" || event.type === "off") &&
        Number.isFinite(event.nodeId) &&
        Number.isFinite(event.t)
    )
    .map((event) => ({
      type: event.type,
      nodeId: Math.trunc(event.nodeId),
      t: Math.max(0, Math.round(event.t)),
      octave: Number.isFinite(event.octave) ? Math.trunc(event.octave) : 0,
      oneShot: event.oneShot === true,
    }))
    .sort((a, b) => a.t - b.t);
  if (!events.length) {
    clearLooper();
    return;
  }
  clearLooperTimers();
  stopLooperVoices();
  looperEvents = events;
  const maxEventT = events.reduce((max, event) => Math.max(max, event.t), 0);
  const requestedLoopDuration = Number(looper.loopDurationMs) || 0;
  looperLoopDurationMs = Math.max(250, Math.round(requestedLoopDuration), maxEventT);
  startLooperPlayback();
}

function applySnapshotPatternState(snapshotPattern) {
  if (!snapshotPattern) {
    return;
  }
  const sequenceType = snapshotPattern.sequence || "ascending";
  const rhythmType = snapshotPattern.rhythm || "steady";
  const octaveType = snapshotPattern.octave || "unison";
  if (sequencePatternSelect) {
    sequencePatternSelect.value = sequenceType;
  }
  if (rhythmPatternSelect) {
    rhythmPatternSelect.value = rhythmType;
  }
  if (octavePatternSelect) {
    octavePatternSelect.value = octaveType;
  }
  buildPatternStates(false);
}

function getSnapshotLfoState() {
  const entries = [];
  const seen = new Set();
  const now = performance.now();
  voices.forEach((voice) => {
    if (!voice || !voice.lfoActive || voice.lfoHalfPeriod <= 0) {
      return;
    }
    const node = nodeById.get(voice.nodeId);
    const key = getSnapshotNodeKey(node);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    entries.push({
      key,
      half: Number(voice.lfoHalfPeriod) || 0,
      curve: Number.isFinite(voice.lfoCurve) ? voice.lfoCurve : 1,
      startOffsetMs: Number.isFinite(voice.lfoStartMs) ? voice.lfoStartMs - now : 0,
    });
  });
  return entries.length ? entries : null;
}

function restoreSnapshotLfos(snapshot) {
  if (!snapshotRestoreLfos || !snapshot || !Array.isArray(snapshot.lfos)) {
    return;
  }
  const now = performance.now();
  snapshot.lfos.forEach((entry) => {
    if (!entry || !entry.key) {
      return;
    }
    const node = getNodeBySnapshotKey(entry.key);
    if (!node) {
      return;
    }
    if (node.baseVoiceId) {
      const base = findVoiceById(node.baseVoiceId);
      if (base) {
        stopVoice(base, false);
      }
      node.baseVoiceId = null;
    }
    voices.forEach((voice) => {
      if (voice.nodeId === node.id && voice.lfoActive) {
        stopVoice(voice, false);
      }
    });
    const half = Number(entry.half) || 0;
    if (half <= 0) {
      return;
    }
    const startOffsetMs = Number(entry.startOffsetMs) || 0;
    const startMs = snapshotRestoreLfoPhase ? now + startOffsetMs : now;
    const voice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
      lfoActive: true,
      lfoHalfPeriod: half,
      lfoStartMs: startMs,
      lfoCurve: Number.isFinite(entry.curve) ? entry.curve : 1,
      source: "snapshot-lfo",
    });
    if (voice) {
      const attack = getEnvelopeAttackSeconds() || 0.02;
      const fadeIn = Math.max(0.03, attack);
      const nowSec = audioCtx ? audioCtx.currentTime : 0;
      const nowMs = performance.now();
      const minGain = 1 - lfoDepth;
      const targetGain = (1 - lfoDepth) + lfoDepth * getLfoValue(voice, nowMs);
      voice.lfoGain.gain.cancelScheduledValues(nowSec);
      voice.lfoGain.gain.setValueAtTime(minGain, nowSec);
      voice.lfoGain.gain.linearRampToValueAtTime(targetGain, nowSec + fadeIn);
      node.baseVoiceId = voice.id;
      ensureLfoLoop();
    }
  });
}

function startPatternPlaybackFromSnapshot() {
  patternStepCounter = 0;
  patternPlayerState = "playing";
  updateScoreButton();
  scheduleNextPatternEvent(0);
}

function updateLfoPlayButton() {
  if (!lfoPlayToggle) {
    return;
  }
  lfoPlayToggle.textContent = lfoPresetPlaying ? "Stop" : "Play";
  lfoPlayToggle.classList.toggle("button-on", lfoPresetPlaying);
}

function beatsToMs(beats) {
  return (beats * 60000) / tempoBpm;
}

function envelopeToSeconds(value) {
  const numeric = Number(value) || 0;
  if (envelopeTimeMode === "tempo") {
    return beatsToMs(numeric) / 1000;
  }
  return numeric;
}

function getEnvelopeAttackSeconds() {
  return envelopeToSeconds(getEnvelopeSliderValue(attackSlider));
}

function getEnvelopeDecaySeconds() {
  return envelopeToSeconds(getEnvelopeSliderValue(decaySlider));
}

function getEnvelopeReleaseSeconds() {
  return envelopeToSeconds(getEnvelopeSliderValue(releaseSlider));
}

function stopPatternVoices() {
  patternVoices.forEach((voice) => stopVoice(voice));
  patternVoices = new Set();
}

function clearPatternTimers() {
  if (patternNextTimer) {
    clearTimeout(patternNextTimer);
    patternNextTimer = null;
  }
  patternOffTimers.forEach((timer) => clearTimeout(timer));
  patternOffTimers = [];
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
  const safeSequenceIndex = preserveIndices && count
    ? prevSequenceIndex % count
    : 0;
  const safeRhythmIndex = preserveIndices ? prevRhythmIndex : 0;
  const safeOctaveIndex = preserveIndices ? prevOctaveIndex : 0;
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
  } else if (sequencePattern === "near-triads") {
    order = buildNearTriadSequenceOrder();
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
      index: preserveIndices ? safeSequenceIndex : 0,
      cyclesCompleted: preserveIndices ? prevSequenceCycles : 0,
    };
  } else {
    patternSequenceState = {
      type: sequencePattern,
      order,
      index: preserveIndices ? safeSequenceIndex : 0,
    };
  }

  const cycleLength = getSequenceOrderIndices().length;
  if (preserveIndices && cycleLength) {
    patternStepCounter = patternStepCounter % cycleLength;
  } else if (!preserveIndices) {
    patternStepCounter = 0;
  }

  let rhythmValues = [1];
  if (rhythmPattern === "random") {
    rhythmValues = [0.25, 0.25, 0.5, 1, 2];
  } else if (rhythmPattern === "half-beat") {
    rhythmValues = [0.5];
  } else if (rhythmPattern === "four-beats") {
    rhythmValues = [4];
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
    index: safeRhythmIndex,
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
    index: safeOctaveIndex,
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

function normalizeSequenceStepValue(value) {
  const indices = [];
  const collect = (entry) => {
    if (Array.isArray(entry)) {
      entry.forEach(collect);
      return;
    }
    if (Number.isFinite(entry)) {
      indices.push(entry);
    }
  };
  collect(value);
  return indices;
}

function nextSequenceStep() {
  if (!patternSequenceState || !patternActiveNodes.length) {
    return null;
  }
  if (patternSequenceState.type === "random") {
    const index = Math.floor(Math.random() * patternActiveNodes.length);
    return { indices: [index], octaveOffsets: [0] };
  }
  if (patternSequenceState.type === "plain-bob-minor") {
    const row = patternSequenceState.row;
    if (!row || row.length === 0) {
      return null;
    }
    const value = row[patternSequenceState.posInRow];
    const indices = normalizeSequenceStepValue(value);
    patternSequenceState.posInRow += 1;
    if (patternSequenceState.posInRow >= row.length) {
      const op = patternSequenceState.ops[patternSequenceState.stepInLead];
      patternSequenceState.row = applyPlaceNotation(row, op);
      patternSequenceState.stepInLead =
        (patternSequenceState.stepInLead + 1) % patternSequenceState.ops.length;
      patternSequenceState.posInRow = 0;
    }
    return indices.length ? { indices, octaveOffsets: indices.map(() => 0) } : null;
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
  if (
    patternSequenceState.type === "near-triads" &&
    patternSequenceState.index % patternSequenceState.order.length === 0
  ) {
    patternSequenceState.order = buildNearTriadSequenceOrder();
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
    const indices = normalizeSequenceStepValue(value);
    const octaveOffset = patternSequenceState.octaveOffsets[stepIndex] || 0;
    patternSequenceState.index += 1;
    return indices.length
      ? { indices, octaveOffsets: indices.map(() => octaveOffset) }
      : null;
  }
  const value =
    patternSequenceState.order[patternSequenceState.index % patternSequenceState.order.length];
  const indices = normalizeSequenceStepValue(value);
  patternSequenceState.index += 1;
  return indices.length ? { indices, octaveOffsets: indices.map(() => 0) } : null;
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

function applyPendingSnapshotForPattern(nextSnapshot, nextIndex, nextLetter) {
  pendingSnapshotState = null;
  pendingSnapshotIndex = -1;
  pendingSnapshotLetterKey = "";
  pendingSnapshotAtNextEvent = false;
  if (nextIndex >= 0) {
    snapshotActiveIndex = nextIndex;
  }
  if (nextLetter) {
    snapshotActiveLetterKey = nextLetter;
  }
  applyPresetState(nextSnapshot.state, {
    skipLayoutModeSwitch: true,
    skipStopVoices: true,
    preserveViewMode: true,
    preserveActiveVoicesOnSynthChange: true,
  });
  updateSnapshotUi();
  if (snapshotRestoreSequence) {
    if (nextSnapshot.pattern) {
      clearPatternTimers();
      stopPatternVoices();
      applySnapshotPatternState(nextSnapshot.pattern);
    } else {
      stopPatternPlayback();
      restoreSnapshotLooper(nextSnapshot);
      restoreSnapshotPlayState(nextSnapshot);
      restoreSnapshotLfos(nextSnapshot);
      return false;
    }
    restoreSnapshotLooper(nextSnapshot);
  }
  restoreSnapshotPlayState(nextSnapshot);
  restoreSnapshotLfos(nextSnapshot);
  return true;
}

function scheduleNextPatternEvent(delayMs) {
  if (patternNextTimer) {
    clearTimeout(patternNextTimer);
  }
  patternNextTimer = setTimeout(() => {
    if (patternPlayerState !== "playing") {
      return;
    }
    if (pendingSnapshotState && patternSequenceState) {
      const cycleLength = getSequenceOrderIndices().length;
      const atCycleEnd =
        cycleLength && patternStepCounter > 0 && patternStepCounter % cycleLength === 0;
      const shouldApply =
        snapshotDeferToCycleEnd ? atCycleEnd : pendingSnapshotAtNextEvent;
      if (shouldApply) {
        const nextSnapshot = pendingSnapshotState;
        const nextIndex = pendingSnapshotIndex;
        const nextLetter = pendingSnapshotLetterKey;
        const continuePattern = applyPendingSnapshotForPattern(
          nextSnapshot,
          nextIndex,
          nextLetter
        );
        if (!continuePattern) {
          return;
        }
      }
    }
    const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
    const step = nextSequenceStep();
    const durationBeats = nextRhythmBeats();
    const baseOctave = nextOctaveOffset();
    if (step) {
      patternStepCounter += 1;
    }
    const indices = step && Array.isArray(step.indices) ? step.indices : [];
    const octaveOffsets = step && Array.isArray(step.octaveOffsets) ? step.octaveOffsets : [];
    indices.forEach((nextIndex, idx) => {
      if (nextIndex == null) {
        return;
      }
      const nodeId = patternActiveNodes[nextIndex];
      const node = nodeById.get(nodeId);
      if (!node) {
        return;
      }
      const octave = baseOctave + (octaveOffsets[idx] || 0);
      const freq = node.freq * Math.pow(2, octave);
      const voice = startVoice({
        nodeId: node.id,
        octave,
        freq,
        source: "pattern",
      });
      if (!voice) {
        return;
      }
      patternVoices.add(voice);
      draw();
      if (isOneShot) {
        const attack = getEnvelopeAttackSeconds() || 0.02;
        const decay = getEnvelopeDecaySeconds() || 0.2;
        const release = getEnvelopeReleaseSeconds() || 0.6;
        const cleanupMs = (attack + decay + release) * 1000 + 60;
        const cleanupTimer = setTimeout(() => {
          patternVoices.delete(voice);
          draw();
        }, Math.max(0, cleanupMs));
        patternOffTimers.push(cleanupTimer);
      } else {
        const lengthBeats =
          patternLengthMode === "gate" ? durationBeats * patternLengthValue : patternLengthValue;
        const offTimer = setTimeout(() => {
          stopVoice(voice);
          patternVoices.delete(voice);
          draw();
        }, Math.max(0, beatsToMs(lengthBeats)));
        patternOffTimers.push(offTimer);
      }
    });
    scheduleNextPatternEvent(beatsToMs(durationBeats));
  }, Math.max(0, delayMs));
}

function startPatternPlayback() {
  if (!patternSequenceState) {
    buildPatternStates(false);
  }
  patternStepCounter = 0;
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
  patternStepCounter = 0;
  updateScoreButton();
  draw();
}

const PLAY_STATE_SKIP_SOURCES = new Set(["pattern", "looper", "interval-chart"]);

function isAudioPlaybackActive() {
  return Boolean(audioCtx && audioCtx.state === "running");
}

function serializePlayState() {
  if (!isAudioPlaybackActive()) {
    return null;
  }
  const activeVoices = voices.filter(
    (voice) =>
      voice &&
      !voice.releasing &&
      !PLAY_STATE_SKIP_SOURCES.has(voice.source || "") &&
      Number.isFinite(voice.nodeId)
  );
  const hasLfo = lfoPresetPlaying || activeVoices.some((voice) => voice.lfoActive);
  const hasPattern = patternPlayerState === "playing";
  if (!activeVoices.length && !hasPattern && !hasLfo) {
    return null;
  }
  const nodes = activeVoices.map((voice) => {
    const entry = { id: voice.nodeId };
    if (Number.isFinite(voice.octave) && voice.octave !== 0) {
      entry.octave = voice.octave;
    }
    if (voice.source) {
      entry.source = voice.source;
    }
    if (Number.isFinite(voice.peakGain)) {
      entry.velocity = Math.max(0, Math.min(1, voice.peakGain / 0.2));
    }
    if (voice.lfoActive) {
      entry.lfo = {
        half: Number(voice.lfoHalfPeriod) || 0,
        curve: Number.isFinite(voice.lfoCurve) ? voice.lfoCurve : 1,
      };
    }
    const node = nodeById.get(voice.nodeId);
    if (node && node.baseVoiceId === voice.id) {
      entry.base = true;
    }
    return entry;
  });
  const pattern = {
    playing: patternPlayerState === "playing",
    tempo: Number(tempoSlider ? tempoSlider.value : tempoBpm) || tempoBpm,
    lengthMode: patternLengthMode,
    lengthValue: patternLengthValue,
    sequence: sequencePatternSelect ? sequencePatternSelect.value : "ascending",
    rhythm: rhythmPatternSelect ? rhythmPatternSelect.value : "steady",
    octave: octavePatternSelect ? octavePatternSelect.value : "none",
  };
  const play = {
    active: true,
    pattern,
  };
  if (nodes.length) {
    play.nodes = nodes;
  }
  if (hasLfo) {
    play.lfo = { preset: lfoPresetPlaying };
  }
  return play;
}

function applyPlayState(play) {
  if (!play || !play.active) {
    return;
  }
  pendingPlayState = play;
  if (!isAudioPlaybackActive()) {
    return;
  }
  pendingPlayState = null;

  stopAllVoices();
  clearLfoStopTimers();
  nodes.forEach((node) => {
    node.baseVoiceId = null;
  });

  if (play.pattern) {
    if (tempoSlider && Number.isFinite(play.pattern.tempo)) {
      tempoSlider.value = String(play.pattern.tempo);
      updateTempoReadout();
    }
    if (sequencePatternSelect && play.pattern.sequence) {
      sequencePatternSelect.value = play.pattern.sequence;
    }
    if (rhythmPatternSelect && play.pattern.rhythm) {
      rhythmPatternSelect.value = play.pattern.rhythm;
    }
    if (octavePatternSelect && play.pattern.octave) {
      octavePatternSelect.value = play.pattern.octave;
    }
    if (patternLengthModeInputs.length) {
      patternLengthModeInputs.forEach((input) => {
        input.checked = input.value === play.pattern.lengthMode;
      });
      patternLengthMode = play.pattern.lengthMode || patternLengthMode;
    }
    if (patternLengthSlider && Number.isFinite(play.pattern.lengthValue)) {
      patternLengthSlider.value = String(play.pattern.lengthValue);
      updatePatternLengthReadout();
    }
    updatePatternLengthAvailability();
    if (play.pattern.playing) {
      startPatternPlayback();
    } else {
      stopPatternPlayback();
    }
  }

  if (play.lfo && typeof play.lfo.preset === "boolean") {
    lfoPresetPlaying = play.lfo.preset;
    updateLfoPlayButton();
  }

  if (Array.isArray(play.nodes)) {
    play.nodes.forEach((entry) => {
      if (!entry || !Number.isFinite(entry.id)) {
        return;
      }
      const node = nodeById.get(entry.id);
      if (!node) {
        return;
      }
      const octave = Number(entry.octave) || 0;
      const lfo = entry.lfo || null;
      const velocity = Number.isFinite(entry.velocity) ? entry.velocity : 1;
      const voice = startVoice({
        nodeId: node.id,
        octave,
        freq: node.freq * Math.pow(2, octave),
        velocity,
        lfoActive: lfo && lfo.half > 0,
        lfoHalfPeriod: lfo ? lfo.half : 0,
        lfoStartMs: lfo ? performance.now() : 0,
        lfoCurve: lfo && Number.isFinite(lfo.curve) ? lfo.curve : 1,
        source: entry.source || "preset",
      });
      if (voice) {
        if (entry.base || entry.source === "node" || entry.source === "random-lfo") {
          node.baseVoiceId = voice.id;
        }
      }
    });
  }
  draw();
}

function maybeApplyPendingPlayState() {
  if (!pendingPlayState) {
    return;
  }
  applyPlayState(pendingPlayState);
}

function resetPatternCycle({ restart = false } = {}) {
  buildPatternStates(false);
  if (restart && patternPlayerState === "playing") {
    if (patternNextTimer) {
      clearTimeout(patternNextTimer);
      patternNextTimer = null;
    }
    scheduleNextPatternEvent(0);
  }
}

function buildSnapshotState() {
  const state = getPresetState();
  if (!state) {
    return null;
  }
  const synthState = quantizeSnapshotSynthState(state.synth);
  delete state.layout;
  delete state.play;
  if (synthState) {
    state.synth = synthState;
  } else {
    delete state.synth;
  }
  if (layoutMode && layoutPrevState) {
    state.mode3d = Boolean(layoutPrevState.is3DMode);
    if (snapshotRestoreView) {
      state.view = {
        zoom: layoutPrevState.zoom,
        offsetX: layoutPrevState.offsetX,
        offsetY: layoutPrevState.offsetY,
        rotX: layoutPrevState.rotX,
        rotY: layoutPrevState.rotY,
      };
    }
  } else {
    state.mode3d = Boolean(is3DMode);
    if (snapshotRestoreView) {
      state.view = {
        zoom: view.zoom,
        offsetX: view.offsetX,
        offsetY: view.offsetY,
        rotX: view.rotX,
        rotY: view.rotY,
      };
    }
  }
  if (snapshotRestoreView && (!state.view || !Number.isFinite(state.view.zoom))) {
    state.view = {
      zoom: view.zoom,
      offsetX: view.offsetX,
      offsetY: view.offsetY,
      rotX: view.rotX,
      rotY: view.rotY,
    };
  }
  return JSON.parse(JSON.stringify(state));
}

function roundSnapshotValue(value, decimals) {
  if (!Number.isFinite(value)) {
    return value;
  }
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function quantizeSnapshotSynthState(synthState) {
  if (!synthState || typeof synthState !== "object") {
    return null;
  }
  const next = JSON.parse(JSON.stringify(synthState));
  if (Number.isFinite(next.volume)) {
    next.volume = Math.round(next.volume);
  }
  if (Number.isFinite(next.lfoDepth)) {
    next.lfoDepth = roundSnapshotValue(next.lfoDepth, 3);
  }
  if (Number.isFinite(next.lfoRate)) {
    next.lfoRate = roundSnapshotValue(next.lfoRate, 3);
  }
  if (Number.isFinite(next.attack)) {
    next.attack = roundSnapshotValue(next.attack, 3);
  }
  if (Number.isFinite(next.decay)) {
    next.decay = roundSnapshotValue(next.decay, 3);
  }
  if (Number.isFinite(next.sustain)) {
    next.sustain = roundSnapshotValue(next.sustain, 3);
  }
  if (Number.isFinite(next.release)) {
    next.release = roundSnapshotValue(next.release, 3);
  }
  return next;
}

function prepareSnapshotStateForRecall(snapshotState) {
  const nextState = JSON.parse(JSON.stringify(snapshotState));
  if (!snapshotRestoreView && nextState.view) {
    delete nextState.view;
  }
  const keyboardModeValue =
    nextState.synth && typeof nextState.synth.keyboardMode === "string"
      ? nextState.synth.keyboardMode
      : null;
  if (!snapshotRestoreSynthSettings && nextState.synth) {
    delete nextState.synth;
  }
  if (snapshotRestoreKeyboardMode && typeof keyboardModeValue === "string") {
    if (!nextState.synth || typeof nextState.synth !== "object") {
      nextState.synth = {};
    }
    nextState.synth.keyboardMode = keyboardModeValue;
  } else if (nextState.synth && typeof nextState.synth === "object") {
    delete nextState.synth.keyboardMode;
    if (!Object.keys(nextState.synth).length) {
      delete nextState.synth;
    }
  }
  return nextState;
}

function getNodeRatioKey(node) {
  if (!node) {
    return null;
  }
  const numerator = Number(node.numerator);
  const denominator = Number(node.denominator);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  const divisor = gcd(numerator, denominator);
  return `ratio:${numerator / divisor}:${denominator / divisor}`;
}

function getSnapshotNodeKey(node) {
  if (!node) {
    return null;
  }
  if (node.isCustom) {
    const source = Array.isArray(node.sourceExponents) ? node.sourceExponents : null;
    if (!source || source.length < 2 || node.customSlot == null) {
      return null;
    }
    const [x, y, z = 0] = source;
    return `custom:${x},${y},${z}|${node.customSlot}`;
  }
  if (!Number.isFinite(node.exponentX) || !Number.isFinite(node.exponentY)) {
    return null;
  }
  return `grid:${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
}

function getNodeBySnapshotKey(key) {
  if (!key || typeof key !== "string") {
    return null;
  }
  if (key.startsWith("ratio:")) {
    const parts = key.slice(6).split(":");
    if (parts.length < 2) {
      return null;
    }
    const numerator = Number(parts[0]);
    const denominator = Number(parts[1]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }
    const divisor = gcd(numerator, denominator);
    const normNum = numerator / divisor;
    const normDen = denominator / divisor;
    return (
      nodes.find((node) => {
        const nodeNum = Number(node.numerator);
        const nodeDen = Number(node.denominator);
        if (!Number.isFinite(nodeNum) || !Number.isFinite(nodeDen) || nodeDen === 0) {
          return false;
        }
        const nodeDiv = gcd(nodeNum, nodeDen);
        return nodeNum / nodeDiv === normNum && nodeDen / nodeDiv === normDen;
      }) || null
    );
  }
  if (key.startsWith("grid:")) {
    const parts = key.slice(5).split(",");
    if (parts.length < 3) {
      return null;
    }
    const [ex, ey, ez] = parts.map(Number);
    return (
      nodes.find(
        (node) =>
          !node.isCustom &&
          node.exponentX === ex &&
          node.exponentY === ey &&
          (node.exponentZ || 0) === ez
      ) || null
    );
  }
  if (key.startsWith("custom:")) {
    const rest = key.slice(7);
    const [expPart, slotPart] = rest.split("|");
    if (!expPart || slotPart == null) {
      return null;
    }
    const parts = expPart.split(",").map(Number);
    if (parts.length < 2) {
      return null;
    }
    const [ex, ey, ez = 0] = parts;
    const slot = Number(slotPart);
    return (
      nodes.find(
        (node) =>
          node.isCustom &&
          Array.isArray(node.sourceExponents) &&
          node.sourceExponents[0] === ex &&
          node.sourceExponents[1] === ey &&
          (node.sourceExponents[2] || 0) === ez &&
          node.customSlot === slot
      ) || null
    );
  }
  return null;
}

function getPlayingSnapshotKeys({ excludePattern = false } = {}) {
  const keys = new Set();
  voices.forEach((voice) => {
    if (!voice || voice.releasing || !Number.isFinite(voice.nodeId)) {
      return;
    }
    if (excludePattern && voice.source === "pattern") {
      return;
    }
    const key = getSnapshotNodeKey(nodeById.get(voice.nodeId));
    if (key) {
      keys.add(key);
    }
  });
  return Array.from(keys);
}

function deepEqualSnapshotValue(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a == null || b == null) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqualSnapshotValue(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        return false;
      }
      if (!deepEqualSnapshotValue(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function diffSnapshotState(base, next) {
  if (!base || !next || typeof base !== "object" || typeof next !== "object") {
    return next;
  }
  const diff = {};
  Object.keys(next).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(next, key)) {
      return;
    }
    const nextValue = next[key];
    const baseValue = base[key];
    if (deepEqualSnapshotValue(baseValue, nextValue)) {
      return;
    }
    if (
      nextValue &&
      baseValue &&
      typeof nextValue === "object" &&
      typeof baseValue === "object" &&
      !Array.isArray(nextValue) &&
      !Array.isArray(baseValue)
    ) {
      const childDiff = diffSnapshotState(baseValue, nextValue);
      if (childDiff && Object.keys(childDiff).length) {
        diff[key] = childDiff;
      }
      return;
    }
    diff[key] = nextValue;
  });
  return diff;
}

function mergeSnapshotState(base, diff) {
  if (!diff || typeof diff !== "object") {
    return base ? JSON.parse(JSON.stringify(base)) : diff;
  }
  if (!base || typeof base !== "object") {
    return JSON.parse(JSON.stringify(diff));
  }
  const result = Array.isArray(base) ? [...base] : { ...base };
  Object.keys(diff).forEach((key) => {
    const value = diff[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base &&
      typeof base[key] === "object" &&
      base[key] &&
      !Array.isArray(base[key])
    ) {
      result[key] = mergeSnapshotState(base[key], value);
    } else {
      result[key] = JSON.parse(JSON.stringify(value));
    }
  });
  return result;
}

function serializeSnapshotsForPreset() {
  const entries = [];
  snapshotSlots.forEach((snapshot, index) => {
    if (!snapshot) {
      return;
    }
    entries.push([index, snapshot]);
  });
  return entries;
}

function serializeLetterSnapshotsForPreset() {
  const entries = [];
  snapshotLetterSlots.forEach((snapshot, index) => {
    if (!snapshot) {
      return;
    }
    entries.push([index, snapshot]);
  });
  return entries;
}

function applySnapshotsFromPreset(value) {
  if (!Array.isArray(value)) {
    return;
  }
  snapshotSlots.fill(null);
  value.forEach((entry) => {
    if (!Array.isArray(entry) || entry.length < 2) {
      return;
    }
    const index = Number(entry[0]);
    const snapshot = entry[1];
    if (!Number.isFinite(index) || index < 0 || index >= snapshotSlots.length) {
      return;
    }
    if (!snapshot || typeof snapshot !== "object") {
      return;
    }
    if (!snapshot.state && snapshot.diff && snapshotBaseState) {
      snapshot.state = mergeSnapshotState(snapshotBaseState, snapshot.diff);
    }
    if (!snapshot.state) {
      return;
    }
    snapshotSlots[index] = snapshot;
  });
  updateSnapshotUi();
}

function applyLetterSnapshotsFromPreset(value) {
  if (!Array.isArray(value)) {
    return;
  }
  snapshotLetterSlots.fill(null);
  value.forEach((entry) => {
    if (!Array.isArray(entry) || entry.length < 2) {
      return;
    }
    const index = Number(entry[0]);
    const snapshot = entry[1];
    if (!Number.isFinite(index) || index < 0 || index >= snapshotLetterSlots.length) {
      return;
    }
    if (!snapshot || typeof snapshot !== "object") {
      return;
    }
    if (!snapshot.state && snapshot.diff && snapshotBaseState) {
      snapshot.state = mergeSnapshotState(snapshotBaseState, snapshot.diff);
    }
    if (!snapshot.state) {
      return;
    }
    snapshotLetterSlots[index] = snapshot;
  });
  updateSnapshotUi();
}

function buildSnapshotSetPayload({ compact = true } = {}) {
  const snapshots = serializeSnapshotsForPreset();
  const letterSnapshots = serializeLetterSnapshotsForPreset();
  const baseCandidate =
    snapshotBaseState ||
    (snapshots.length ? snapshots[0][1] && snapshots[0][1].state : null) ||
    buildSnapshotState();
  const base = baseCandidate ? JSON.parse(JSON.stringify(baseCandidate)) : null;
  const compactSnapshots = compact
    ? snapshots.map(([index, snapshot]) => {
        const diff = base && snapshot.state ? diffSnapshotState(base, snapshot.state) : null;
        const entry = {
          diff: diff && Object.keys(diff).length ? diff : null,
          playKeys: snapshot.playKeys,
          pattern: snapshot.pattern,
          looper: snapshot.looper,
          lfos: snapshot.lfos,
        };
        if (!entry.diff) {
          entry.state = snapshot.state;
        }
        return [index, entry];
      })
    : snapshots;
  const compactLetters = compact
    ? letterSnapshots.map(([index, snapshot]) => {
        const diff = base && snapshot.state ? diffSnapshotState(base, snapshot.state) : null;
        const entry = {
          diff: diff && Object.keys(diff).length ? diff : null,
          playKeys: snapshot.playKeys,
          pattern: snapshot.pattern,
          looper: snapshot.looper,
          lfos: snapshot.lfos,
        };
        if (!entry.diff) {
          entry.state = snapshot.state;
        }
        return [index, entry];
      })
    : letterSnapshots;
  return {
    v: 1,
    base,
    snapshots: compactSnapshots,
    snapshotsLetters: compactLetters,
    snapshotActive: snapshotActiveIndex >= 0 ? snapshotActiveIndex : null,
    snapshotActiveLetter: snapshotActiveLetterKey || null,
    snapshotSettings: {
      deferToCycleEnd: snapshotDeferToCycleEnd,
      restorePlayNodes: snapshotRestorePlayNodes,
      connectCommonTones: snapshotConnectCommonTones,
      morphEnabled: snapshotMorphEnabled,
      morphTimeMs: snapshotMorphTimeMs,
      restoreView: snapshotRestoreView,
      restoreSequence: snapshotRestoreSequence,
      restoreSynthSettings: snapshotRestoreSynthSettings,
      restoreKeyboardMode: snapshotRestoreKeyboardMode,
      restoreLfos: snapshotRestoreLfos,
      restoreLfoPhase: snapshotRestoreLfoPhase,
      useLetterKeys: snapshotKeyboardMode,
      lettersActive: snapshotKeyboardActive,
    },
  };
}

function applySnapshotSetPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  snapshotBaseState = payload.base || null;
  if (Array.isArray(payload.snapshots)) {
    applySnapshotsFromPreset(payload.snapshots);
  }
  if (Array.isArray(payload.snapshotsLetters)) {
    applyLetterSnapshotsFromPreset(payload.snapshotsLetters);
  }
  if (Number.isFinite(payload.snapshotActive)) {
    snapshotActiveIndex = Math.trunc(payload.snapshotActive);
  }
  if (typeof payload.snapshotActiveLetter === "string") {
    snapshotActiveLetterKey = payload.snapshotActiveLetter;
  }
  if (payload.snapshotSettings && typeof payload.snapshotSettings === "object") {
    const settings = payload.snapshotSettings;
    snapshotDeferToCycleEnd = Boolean(settings.deferToCycleEnd);
    snapshotRestorePlayNodes = Boolean(settings.restorePlayNodes);
    snapshotConnectCommonTones = Boolean(settings.connectCommonTones);
    snapshotMorphEnabled = Boolean(settings.morphEnabled);
    if (Number.isFinite(settings.morphTimeMs)) {
      snapshotMorphTimeMs = Math.max(1, Math.round(settings.morphTimeMs));
    }
    snapshotRestoreView = Boolean(settings.restoreView);
    snapshotRestoreSequence = Boolean(settings.restoreSequence);
    if (typeof settings.restoreSynthSettings === "boolean") {
      snapshotRestoreSynthSettings = settings.restoreSynthSettings;
    }
    if (typeof settings.restoreKeyboardMode === "boolean") {
      snapshotRestoreKeyboardMode = settings.restoreKeyboardMode;
    }
    snapshotRestoreLfos = Boolean(settings.restoreLfos);
    snapshotRestoreLfoPhase = Boolean(settings.restoreLfoPhase);
    snapshotKeyboardMode = Boolean(settings.useLetterKeys);
    snapshotKeyboardActive = Boolean(settings.lettersActive);
  }
  normalizeSnapshotMorphSettings();
  syncSnapshotSettingsControls();
  setKeyboardModeDisabled(snapshotKeyboardMode);
  updateSnapshotUi();
  return true;
}

function exportSnapshotSetToFile() {
  const payload = buildSnapshotSetPayload({ compact: true });
  if (!payload.snapshots.length && !payload.snapshotsLetters.length) {
    showFileSharePopover("Nothing to export yet.");
    return;
  }
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tuning-lattice-snapshots-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showFileSharePopover("Snapshot file downloaded.");
}

function updateSnapshotUi() {
  const buttons = document.querySelectorAll(".snapshot-slot");
  buttons.forEach((button) => {
    const index = Number(button.dataset.slot);
    if (!Number.isFinite(index)) {
      return;
    }
    button.classList.toggle("is-filled", Boolean(snapshotSlots[index]));
    button.classList.toggle("is-active", index === snapshotActiveIndex);
  });
  const keyButtons = document.querySelectorAll(".snapshot-key");
  keyButtons.forEach((button) => {
    const letter = button.dataset.key;
    const index = Number(button.dataset.slot);
    if (!letter || !Number.isFinite(index)) {
      return;
    }
    button.classList.toggle("is-filled", Boolean(snapshotLetterSlots[index]));
    button.classList.toggle("is-active", letter === snapshotActiveLetterKey);
  });
  if (snapshotKeyboardContainer) {
    snapshotKeyboardContainer.hidden = !snapshotKeyboardMode;
    const active =
      snapshotKeyboardActiveToggle && snapshotKeyboardModeToggle
        ? snapshotKeyboardModeToggle.checked && snapshotKeyboardActiveToggle.checked
        : snapshotKeyboardActive;
    snapshotKeyboardContainer.classList.toggle("is-inactive", !active);
    if (snapshotDebugEnabled) {
      console.log("[snapshot-letters-visual]", {
        active,
        mode: snapshotKeyboardModeToggle ? snapshotKeyboardModeToggle.checked : snapshotKeyboardMode,
        toggle: snapshotKeyboardActiveToggle ? snapshotKeyboardActiveToggle.checked : null,
        classList: snapshotKeyboardContainer.className,
      });
    }
  }
  const snapshotGrid = document.getElementById("snapshot-grid");
  if (snapshotGrid) {
    snapshotGrid.hidden = snapshotKeyboardMode;
  }
}

function logSnapshotDebug(stage, snapshot) {
  if (!snapshotDebugEnabled) {
    return;
  }
  const voiceList = voices.filter((voice) => voice);
  const missingNodeVoices = [];
  const mismatchedBaseVoices = [];
  const orphanBaseNodes = [];
  const baseMismatchNodes = [];
  voiceList.forEach((voice) => {
    const node = nodeById.get(voice.nodeId);
    if (!node) {
      missingNodeVoices.push(voice.id);
      return;
    }
    if (node.baseVoiceId !== voice.id) {
      mismatchedBaseVoices.push({ voiceId: voice.id, nodeId: node.id, base: node.baseVoiceId });
    }
  });
  nodes.forEach((node) => {
    if (!node.baseVoiceId) {
      return;
    }
    const voice = findVoiceById(node.baseVoiceId);
    if (!voice) {
      orphanBaseNodes.push(node.id);
      return;
    }
    if (voice.nodeId !== node.id) {
      baseMismatchNodes.push({
        nodeId: node.id,
        base: node.baseVoiceId,
        voiceNodeId: voice.nodeId,
      });
    }
  });
  console.groupCollapsed(
    `[snapshot] ${stage} | voices=${voiceList.length} | active=${snapshotActiveIndex}`
  );
  console.log("snapshotConnectCommonTones", snapshotConnectCommonTones);
  console.log("snapshotRestorePlayNodes", snapshotRestorePlayNodes);
  console.log("snapshotKeys", snapshot && snapshot.playKeys ? snapshot.playKeys.length : 0);
  if (missingNodeVoices.length) {
    console.warn("voices with missing node", missingNodeVoices);
  }
  if (mismatchedBaseVoices.length) {
    console.warn("voices not bound as base", mismatchedBaseVoices);
  }
  if (orphanBaseNodes.length) {
    console.warn("nodes with missing base voice", orphanBaseNodes);
  }
  if (baseMismatchNodes.length) {
    console.warn("nodes with base voice from other node", baseMismatchNodes);
  }
  console.groupEnd();
}

function saveSnapshot(index) {
  if (index < 0 || index >= snapshotSlots.length) {
    return;
  }
  const state = buildSnapshotState();
  if (!state) {
    return;
  }
  if (snapshotDebugEnabled) {
    console.groupCollapsed(`[snapshot-save] ${index}`);
    const voiceInfo = voices.map((voice) => ({
      id: voice.id,
      nodeId: voice.nodeId,
      source: voice.source,
      freq: Number.isFinite(voice.freq) ? Number(voice.freq.toFixed(3)) : null,
      releasing: voice.releasing,
    }));
    console.log("voices", voiceInfo);
    console.groupEnd();
  }
  snapshotSlots[index] = {
    state,
    playKeys: getPlayingSnapshotKeys({ excludePattern: patternPlayerState === "playing" }),
    pattern: getSnapshotPatternState(),
    looper: getSnapshotLooperState(),
    lfos: getSnapshotLfoState(),
  };
  if (snapshotDebugEnabled) {
    console.groupCollapsed(`[snapshot-save-keys] ${index}`);
    console.log("playKeys", snapshotSlots[index].playKeys);
    console.log("pattern", snapshotSlots[index].pattern);
    console.groupEnd();
  }
  updateSnapshotUi();
  const displayIndex = index === 9 ? 0 : index + 1;
  showTemporaryBanner(`Snapshot ${displayIndex} saved`);
}

function saveSnapshotLetter(letter, index) {
  if (index < 0 || index >= snapshotLetterSlots.length) {
    return;
  }
  const state = buildSnapshotState();
  if (!state) {
    return;
  }
  if (snapshotDebugEnabled) {
    console.groupCollapsed(`[snapshot-save-letter] ${letter}`);
    const voiceInfo = voices.map((voice) => ({
      id: voice.id,
      nodeId: voice.nodeId,
      source: voice.source,
      freq: Number.isFinite(voice.freq) ? Number(voice.freq.toFixed(3)) : null,
      releasing: voice.releasing,
    }));
    console.log("voices", voiceInfo);
    console.groupEnd();
  }
  snapshotLetterSlots[index] = {
    state,
    playKeys: getPlayingSnapshotKeys({ excludePattern: patternPlayerState === "playing" }),
    pattern: getSnapshotPatternState(),
    looper: getSnapshotLooperState(),
    lfos: getSnapshotLfoState(),
  };
  if (snapshotDebugEnabled) {
    console.groupCollapsed(`[snapshot-save-letter-keys] ${letter}`);
    console.log("playKeys", snapshotLetterSlots[index].playKeys);
    console.log("pattern", snapshotLetterSlots[index].pattern);
    console.groupEnd();
  }
  snapshotActiveLetterKey = letter;
  updateSnapshotUi();
  showTemporaryBanner(`Snapshot ${letter.toUpperCase()} saved`);
}

function recallSnapshotLetter(letter, index) {
  if (index < 0 || index >= snapshotLetterSlots.length) {
    return;
  }
  const snapshot = snapshotLetterSlots[index];
  if (!snapshot || !snapshot.state) {
    return;
  }
  const snapshotState = prepareSnapshotStateForRecall(snapshot.state);
  if (snapshotDeferToCycleEnd && patternPlayerState === "playing") {
    pendingSnapshotIndex = -1;
    pendingSnapshotState = { ...snapshot, state: snapshotState };
    pendingSnapshotLetterKey = letter;
    snapshotActiveLetterKey = letter;
    updateSnapshotUi();
    pendingSnapshotAtNextEvent = false;
    return;
  }
  if (patternPlayerState === "playing") {
    pendingSnapshotIndex = -1;
    pendingSnapshotState = { ...snapshot, state: snapshotState };
    pendingSnapshotLetterKey = letter;
    snapshotActiveLetterKey = letter;
    updateSnapshotUi();
    pendingSnapshotAtNextEvent = true;
    return;
  }
  snapshotActiveLetterKey = letter;
  applyPresetState(snapshotState, {
    skipLayoutModeSwitch: true,
    skipStopVoices: true,
    preserveViewMode: true,
    preserveActiveVoicesOnSynthChange: true,
  });
  if (snapshotRestoreSequence) {
    if (snapshot.pattern) {
      stopPatternPlayback();
      applySnapshotPatternState(snapshot.pattern);
      startPatternPlaybackFromSnapshot();
    } else {
      stopPatternPlayback();
      buildPatternStates(true);
    }
    restoreSnapshotLooper(snapshot);
  } else {
    buildPatternStates(true);
  }
  const morphHandled = restoreSnapshotPlayState(snapshot);
  if (!morphHandled) {
    restoreSnapshotLfos(snapshot);
  }
  updateSnapshotUi();
}

function recallSnapshot(index) {
  if (index < 0 || index >= snapshotSlots.length) {
    return;
  }
  const snapshot = snapshotSlots[index];
  if (!snapshot || !snapshot.state) {
    return;
  }
  const snapshotState = prepareSnapshotStateForRecall(snapshot.state);
  if (snapshotDeferToCycleEnd && patternPlayerState === "playing") {
    pendingSnapshotIndex = index;
    pendingSnapshotState = { ...snapshot, state: snapshotState };
    pendingSnapshotLetterKey = "";
    pendingSnapshotAtNextEvent = false;
    return;
  }
  if (patternPlayerState === "playing") {
    pendingSnapshotIndex = index;
    pendingSnapshotState = { ...snapshot, state: snapshotState };
    pendingSnapshotLetterKey = "";
    pendingSnapshotAtNextEvent = true;
    return;
  }
  snapshotActiveIndex = index;
  applyPresetState(snapshotState, {
    skipLayoutModeSwitch: true,
    skipStopVoices: true,
    preserveViewMode: true,
    preserveActiveVoicesOnSynthChange: true,
  });
  if (snapshotRestoreSequence) {
    if (snapshot.pattern) {
      stopPatternPlayback();
      applySnapshotPatternState(snapshot.pattern);
      startPatternPlaybackFromSnapshot();
    } else {
      stopPatternPlayback();
      buildPatternStates(true);
    }
    restoreSnapshotLooper(snapshot);
  } else {
    buildPatternStates(true);
  }
  const morphHandled = restoreSnapshotPlayState(snapshot);
  if (!morphHandled) {
    restoreSnapshotLfos(snapshot);
  }
  updateSnapshotUi();
}

function clearSnapshots() {
  snapshotSlots.fill(null);
  snapshotActiveIndex = -1;
  updateSnapshotUi();
}

function normalizeSnapshotMorphSettings() {
  snapshotMorphTimeMs = Math.max(1, Math.round(Number(snapshotMorphTimeMs) || 100));
  if (snapshotMorphEnabled) {
    snapshotRestorePlayNodes = true;
    snapshotConnectCommonTones = true;
  }
}

function buildSnapshotRecallTargets(snapshot) {
  const targets = [];
  if (!snapshot || !Array.isArray(snapshot.playKeys)) {
    return targets;
  }
  const lfoEntries = new Map();
  if (snapshotRestoreLfos && snapshot && Array.isArray(snapshot.lfos)) {
    snapshot.lfos.forEach((entry) => {
      if (entry && entry.key) {
        lfoEntries.set(entry.key, entry);
      }
    });
  }
  const seen = new Set();
  snapshot.playKeys.forEach((key) => {
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    const node = getNodeBySnapshotKey(key);
    if (!node || !Number.isFinite(node.freq)) {
      return;
    }
    const lfoEntry = lfoEntries.get(key) || null;
    targets.push({
      key,
      node,
      freq: node.freq,
      freqKey: node.freq.toFixed(6),
      hasLfo: Boolean(snapshotRestoreLfos && lfoEntry),
      lfoHalfPeriod: lfoEntry ? Number(lfoEntry.half) || 0 : 0,
      lfoCurve: lfoEntry && Number.isFinite(lfoEntry.curve) ? lfoEntry.curve : 1,
      lfoStartOffsetMs: lfoEntry ? Number(lfoEntry.startOffsetMs) || 0 : 0,
    });
  });
  return targets;
}

function getSnapshotMorphVoiceGroup(voice) {
  return snapshotRestoreLfos && voice && voice.lfoActive ? "lfo" : "plain";
}

function getSnapshotMorphTargetGroup(target) {
  return snapshotRestoreLfos && target && target.hasLfo ? "lfo" : "plain";
}

function getFrequencyDistanceCents(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.abs(1200 * Math.log2(a / b));
}

function matchSnapshotMorphGroup(currentVoices, targetEntries) {
  if (!currentVoices.length || !targetEntries.length) {
    return [];
  }
  const limit = SNAPSHOT_MORPH_MAX_CENTS;
  const adjacency = currentVoices.map((voice, currentIndex) =>
    targetEntries
      .map((target, targetIndex) => ({
        targetIndex,
        cents: getFrequencyDistanceCents(voice.freq, target.freq),
      }))
      .filter((entry) => entry.cents <= limit)
      .sort((a, b) => a.cents - b.cents)
  );
  const order = adjacency
    .map((edges, currentIndex) => ({
      currentIndex,
      edgeCount: edges.length,
      best: edges.length ? edges[0].cents : Number.POSITIVE_INFINITY,
    }))
    .filter((entry) => entry.edgeCount > 0)
    .sort((a, b) => a.edgeCount - b.edgeCount || a.best - b.best)
    .map((entry) => entry.currentIndex);
  const targetToCurrent = new Array(targetEntries.length).fill(-1);
  const visit = (currentIndex, seen) => {
    const edges = adjacency[currentIndex];
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      if (seen[edge.targetIndex]) {
        continue;
      }
      seen[edge.targetIndex] = true;
      if (
        targetToCurrent[edge.targetIndex] === -1 ||
        visit(targetToCurrent[edge.targetIndex], seen)
      ) {
        targetToCurrent[edge.targetIndex] = currentIndex;
        return true;
      }
    }
    return false;
  };
  order.forEach((currentIndex) => {
    visit(currentIndex, new Array(targetEntries.length).fill(false));
  });
  const matches = [];
  targetToCurrent.forEach((currentIndex, targetIndex) => {
    if (currentIndex >= 0) {
      matches.push({
        voice: currentVoices[currentIndex],
        target: targetEntries[targetIndex],
      });
    }
  });
  return matches;
}

function beginVoiceMorph(voice, options = {}) {
  if (!voice) {
    return;
  }
  const nowMs = performance.now();
  const durationMs = Math.max(1, Math.round(Number(options.durationMs) || snapshotMorphTimeMs));
  const morphGain = voice.morphGain && voice.morphGain.gain ? voice.morphGain.gain : null;
  const currentGain = morphGain ? morphGain.value : 1;
  const nextFromGain = Number.isFinite(options.fromGain) ? options.fromGain : currentGain;
  const nextToGain = Number.isFinite(options.toGain) ? options.toGain : currentGain;
  if (morphGain) {
    morphGain.cancelScheduledValues(audioCtx.currentTime);
    morphGain.setValueAtTime(nextFromGain, audioCtx.currentTime);
  }
  voice.morphState = {
    startMs: nowMs,
    durationMs,
    fromFreq: Number.isFinite(options.fromFreq) ? options.fromFreq : voice.freq,
    toFreq: Number.isFinite(options.toFreq) ? options.toFreq : voice.freq,
    fromGain: nextFromGain,
    toGain: nextToGain,
    stopAtEnd: Boolean(options.stopAtEnd),
  };
  ensureLfoLoop();
}

function createSnapshotTargetVoice(target, durationMs) {
  if (!target || !target.node || !Number.isFinite(target.freq)) {
    return null;
  }
  const now = performance.now();
  const voice = startVoice({
    nodeId: target.node.id,
    octave: 0,
    freq: target.freq,
    lfoActive: target.hasLfo,
    lfoHalfPeriod: target.hasLfo ? target.lfoHalfPeriod : 0,
    lfoStartMs:
      target.hasLfo && snapshotRestoreLfoPhase ? now + target.lfoStartOffsetMs : now,
    lfoCurve: target.hasLfo ? target.lfoCurve : 1,
    source: target.hasLfo ? "snapshot-lfo" : "snapshot",
    initialMorphGain: 0,
  });
  if (!voice) {
    return null;
  }
  target.node.baseVoiceId = voice.id;
  beginVoiceMorph(voice, {
    durationMs,
    fromFreq: target.freq,
    toFreq: target.freq,
    fromGain: 0,
    toGain: 1,
  });
  return voice;
}

function tryMorphSnapshotPlayState(snapshot) {
  if (
    !snapshotMorphEnabled ||
    !snapshotRestorePlayNodes ||
    !snapshotConnectCommonTones ||
    !audioCtx ||
    audioCtx.state !== "running" ||
    getCurrentWaveformType() === SOUNDFONT_WAVEFORM
  ) {
    return false;
  }
  if (voices.some((voice) => voice && !voice.releasing && voice.usesSoundfont)) {
    return false;
  }
  const targets = buildSnapshotRecallTargets(snapshot);
  const currentVoices = voices.filter(
    (voice) =>
      voice &&
      !voice.releasing &&
      voice.source !== "pattern" &&
      !voice.usesSoundfont &&
      Number.isFinite(voice.freq)
  );
  if (!targets.length && !currentVoices.length) {
    return false;
  }
  nodes.forEach((node) => {
    node.baseVoiceId = null;
  });
  const durationMs = snapshotMorphTimeMs;
  const groups = ["lfo", "plain"];
  const matches = [];
  const matchedVoiceIds = new Set();
  const matchedTargetKeys = new Set();
  groups.forEach((group) => {
    const groupVoices = currentVoices.filter((voice) => getSnapshotMorphVoiceGroup(voice) === group);
    const groupTargets = targets.filter((target) => getSnapshotMorphTargetGroup(target) === group);
    matchSnapshotMorphGroup(groupVoices, groupTargets).forEach((match) => {
      matches.push(match);
      matchedVoiceIds.add(match.voice.id);
      matchedTargetKeys.add(match.target.key);
    });
  });
  matches.forEach(({ voice, target }) => {
    voice.nodeId = target.node.id;
    voice.ratioKey = getNodeRatioKey(target.node);
    target.node.baseVoiceId = voice.id;
    beginVoiceMorph(voice, {
      durationMs,
      fromFreq: voice.freq,
      toFreq: target.freq,
      fromGain: 1,
      toGain: 1,
    });
  });
  currentVoices.forEach((voice) => {
    if (matchedVoiceIds.has(voice.id)) {
      return;
    }
    beginVoiceMorph(voice, {
      durationMs,
      fromFreq: voice.freq,
      toFreq: voice.freq,
      fromGain: 1,
      toGain: 0,
      stopAtEnd: true,
    });
  });
  targets.forEach((target) => {
    if (matchedTargetKeys.has(target.key)) {
      return;
    }
    createSnapshotTargetVoice(target, durationMs);
  });
  return true;
}

function restoreSnapshotPlayState(snapshot) {
  if (!snapshotRestorePlayNodes || !snapshot || !snapshot.playKeys) {
    return false;
  }
  if (!audioCtx || audioCtx.state !== "running") {
    return false;
  }
  if (tryMorphSnapshotPlayState(snapshot)) {
    return true;
  }
  if (snapshotDebugEnabled) {
    console.groupCollapsed("[snapshot-restore-play]");
    console.log("playKeys", snapshot.playKeys);
    const voiceInfo = voices.map((voice) => ({
      id: voice.id,
      nodeId: voice.nodeId,
      source: voice.source,
      freq: Number.isFinite(voice.freq) ? Number(voice.freq.toFixed(3)) : null,
      releasing: voice.releasing,
    }));
    console.log("voices-before", voiceInfo);
    console.groupEnd();
  }
  const lfoKeySet = new Set();
  if (snapshotRestoreLfos && snapshot.lfos) {
    snapshot.lfos.forEach((entry) => {
      if (entry && entry.key) {
        lfoKeySet.add(entry.key);
      }
    });
  }
  const targetKeys = new Set(
    snapshot.playKeys.filter((key) => (lfoKeySet.size ? !lfoKeySet.has(key) : true))
  );
  const targetFreqKeys = new Set();
  const targetNodes = new Map();
  const targetFreqMap = new Map();
  const targetLfoFreqKeys = new Set();
  targetKeys.forEach((key) => {
    const node = getNodeBySnapshotKey(key);
    if (!node || !Number.isFinite(node.freq)) {
      return;
    }
    const freqKey = node.freq.toFixed(6);
    targetFreqKeys.add(freqKey);
    targetNodes.set(key, { node, freqKey });
    if (!targetFreqMap.has(freqKey)) {
      targetFreqMap.set(freqKey, node);
    }
  });
  if (snapshotRestoreLfos && snapshot && Array.isArray(snapshot.lfos)) {
    snapshot.lfos.forEach((entry) => {
      if (!entry || !entry.key) {
        return;
      }
      const node = getNodeBySnapshotKey(entry.key);
      if (!node || !Number.isFinite(node.freq)) {
        return;
      }
      targetLfoFreqKeys.add(node.freq.toFixed(6));
    });
  }
  nodes.forEach((node) => {
    node.baseVoiceId = null;
  });
  const playingVoices = voices.filter((voice) => voice && !voice.releasing);
  const playingKeys = new Set();
  const playingFreqKeys = new Set();
  playingVoices.forEach((voice) => {
    const key = getSnapshotNodeKey(nodeById.get(voice.nodeId));
    if (key) {
      playingKeys.add(key);
    }
    if (Number.isFinite(voice.freq)) {
      playingFreqKeys.add(voice.freq.toFixed(6));
    }
  });
  if (snapshotConnectCommonTones) {
    playingVoices.forEach((voice) => {
      const freqKey = Number.isFinite(voice.freq) ? voice.freq.toFixed(6) : null;
      if (!freqKey || !targetFreqKeys.has(freqKey)) {
        stopVoice(voice, false);
        return;
      }
      if (snapshotRestoreLfos) {
        const shouldBeLfo = targetLfoFreqKeys.has(freqKey);
        if (voice.lfoActive !== shouldBeLfo) {
          stopVoice(voice, false);
          return;
        }
      }
      const node = targetFreqMap.get(freqKey);
      if (node) {
        voice.nodeId = node.id;
        voice.ratioKey = getNodeRatioKey(node);
        if (!node.baseVoiceId) {
          node.baseVoiceId = voice.id;
        }
      }
    });
    playingKeys.clear();
    playingFreqKeys.clear();
    voices.forEach((voice) => {
      if (!voice || voice.releasing) {
        return;
      }
      const key = getSnapshotNodeKey(nodeById.get(voice.nodeId));
      if (key) {
        playingKeys.add(key);
      }
      if (Number.isFinite(voice.freq)) {
        playingFreqKeys.add(voice.freq.toFixed(6));
      }
    });
  } else {
    const activeVoices = [...voices];
    activeVoices.forEach((voice) => stopVoice(voice, false));
    voices = [];
    patternVoices.clear();
    playingKeys.clear();
    playingFreqKeys.clear();
  }
  targetKeys.forEach((key) => {
    const entry = targetNodes.get(key);
    if (!entry) {
      return;
    }
    if (playingFreqKeys.has(entry.freqKey)) {
      return;
    }
    const voice = startVoice({
      nodeId: entry.node.id,
      octave: 0,
      freq: entry.node.freq,
      source: "snapshot",
    });
    if (voice) {
      entry.node.baseVoiceId = voice.id;
    }
  });
  if (snapshotDebugEnabled) {
    console.groupCollapsed("[snapshot-restore-play-after]");
    const voiceInfo = voices.map((voice) => ({
      id: voice.id,
      nodeId: voice.nodeId,
      source: voice.source,
      freq: Number.isFinite(voice.freq) ? Number(voice.freq.toFixed(3)) : null,
      releasing: voice.releasing,
    }));
    console.log("voices-after", voiceInfo);
    console.groupEnd();
  }
  return false;
}

function getSnapshotIndexFromEvent(event) {
  if (!event) {
    return null;
  }
  const key = event.key;
  if (key >= "1" && key <= "9") {
    return Number(key) - 1;
  }
  if (key === "0") {
    return 9;
  }
  if (event.code && event.code.startsWith("Digit")) {
    const digit = event.code.slice(5);
    if (digit === "0") {
      return 9;
    }
    if (digit >= "1" && digit <= "9") {
      return Number(digit) - 1;
    }
  }
  if (event.code && event.code.startsWith("Numpad")) {
    const digit = event.code.slice(6);
    if (digit === "0") {
      return 9;
    }
    if (digit >= "1" && digit <= "9") {
      return Number(digit) - 1;
    }
  }
  return null;
}

function getSnapshotIndexFromKeyboard(event) {
  if (!event) {
    return null;
  }
  const code = String(event.code || "");
  if (code.startsWith("Digit")) {
    const digit = code.slice(5);
    if (digit === "0") {
      return 9;
    }
    if (digit >= "1" && digit <= "9") {
      return Number(digit) - 1;
    }
  }
  if (code.startsWith("Key")) {
    const letter = code.slice(3).toLowerCase();
    return snapshotKeyToSlot.has(letter) ? snapshotKeyToSlot.get(letter) : null;
  }
  const key = String(event.key || "").toLowerCase();
  if (!key) {
    return null;
  }
  return snapshotKeyToSlot.has(key) ? snapshotKeyToSlot.get(key) : null;
}

function getSnapshotLetterIndexFromEvent(event) {
  const code = String(event.code || "");
  if (code.startsWith("Key")) {
    const letter = code.slice(3).toLowerCase();
    return snapshotLetterKeyToSlot.has(letter) ? snapshotLetterKeyToSlot.get(letter) : null;
  }
  const key = String(event.key || "").toLowerCase();
  if (!key) {
    return null;
  }
  return snapshotLetterKeyToSlot.has(key) ? snapshotLetterKeyToSlot.get(key) : null;
}

function setKeyboardModeDisabled(disabled) {
  if (!keyboardModeSelect) {
    return;
  }
  if (disabled) {
    if (!snapshotKeyboardPrevMode) {
      snapshotKeyboardPrevMode = keyboardModeSelect.value || "off";
    }
    keyboardModeSelect.value = "off";
    keyboardModeSelect.disabled = true;
    keyboardModeSelect.dispatchEvent(new Event("change"));
    return;
  }
  keyboardModeSelect.disabled = false;
  if (snapshotKeyboardPrevMode) {
    keyboardModeSelect.value = snapshotKeyboardPrevMode;
    snapshotKeyboardPrevMode = "";
    keyboardModeSelect.dispatchEvent(new Event("change"));
  }
}

function buildSnapshotKeyboard() {
  if (!snapshotKeyboardKeys) {
    return;
  }
  snapshotKeyboardKeys.innerHTML = "";
  snapshotKeyToSlot.clear();
  snapshotLetterKeyToSlot.clear();
  let slotIndex = 0;
  SNAPSHOT_KEY_ROWS.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "snapshot-keyboard-row";
    row.forEach((key) => {
      const slot = slotIndex % snapshotLetterSlots.length;
      snapshotLetterKeyToSlot.set(key, slot);
      snapshotKeyToSlot.set(key, slot);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "snapshot-key";
      button.dataset.key = key;
      button.dataset.slot = String(slot);
      const label = document.createElement("span");
      label.textContent = key.toUpperCase();
      button.appendChild(label);
      rowEl.appendChild(button);
      slotIndex += 1;
    });
    snapshotKeyboardKeys.appendChild(rowEl);
  });
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
  const waitScale = Math.min(1, 3 / activeNodes.length);
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
    const waitOffset = Math.random() * duration * 1000 * waitScale;
    const curve = 0.5 + Math.random() * 2.2;
    const voice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
      lfoActive: true,
      lfoHalfPeriod: duration,
      lfoStartMs: now + waitOffset,
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

function getSequenceOrderIndices() {
  if (!patternSequenceState || !patternActiveNodes.length) {
    return [];
  }
  const flattenEntry = (entry, result) => {
    if (Array.isArray(entry)) {
      entry.forEach((item) => flattenEntry(item, result));
      return;
    }
    if (Number.isFinite(entry)) {
      result.push(entry);
    }
  };
  const type = patternSequenceState.type;
  if (type === "plain-bob-minor" && Array.isArray(patternSequenceState.row)) {
    const flattened = [];
    patternSequenceState.row.forEach((entry) => flattenEntry(entry, flattened));
    return flattened;
  }
  if (Array.isArray(patternSequenceState.order)) {
    const flattened = [];
    patternSequenceState.order.forEach((entry) => flattenEntry(entry, flattened));
    return flattened;
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

function buildNearTriadSequenceOrder() {
  if (!patternActiveNodes.length) {
    return [];
  }
  const indexByNodeId = new Map(
    patternActiveNodes.map((id, index) => [id, index])
  );
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (node.active && !node.isCustom && node.gridX != null && node.gridY != null) {
      gridMap.set(`${node.gridX},${node.gridY},${node.gridZ || 0}`, node);
    }
  });
  const centerNode =
    nodes.find((node) => node.isCenter) ||
    nodes.find((node) => node.exponentX === 0 && node.exponentY === 0);
  const centerScreen = centerNode
    ? worldToScreen(getNodeDisplayCoordinate(centerNode))
    : { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
  const entries = [];
  const seen = new Set();
  const seenRatios = new Set();
  const addTriangle = (nodesForTri) => {
    if (nodesForTri.some((node) => !node || !node.active)) {
      return;
    }
    const ratioKey = nodesForTri
      .map((node) => `${node.numerator}:${node.denominator}`)
      .sort()
      .join("|");
    if (seenRatios.has(ratioKey)) {
      return;
    }
    const indices = nodesForTri
      .map((node) => indexByNodeId.get(node.id))
      .filter((idx) => idx != null);
    if (indices.length !== 3) {
      return;
    }
    const key = indices.slice().sort((a, b) => a - b).join(",");
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    seenRatios.add(ratioKey);
    const points = nodesForTri.map((node) =>
      worldToScreen(getNodeDisplayCoordinate(node))
    );
    const cx = (points[0].x + points[1].x + points[2].x) / 3;
    const cy = (points[0].y + points[1].y + points[2].y) / 3;
    const dx = cx - centerScreen.x;
    const dy = cy - centerScreen.y;
    entries.push({
      indices,
      dist: Math.hypot(dx, dy),
      angle: Math.atan2(dy, dx),
    });
  };
  for (let z = 0; z < gridDepth; z += 1) {
    for (let y = 0; y < GRID_ROWS - 1; y += 1) {
      for (let x = 0; x < GRID_COLS - 1; x += 1) {
        const cell = getTriangleCellNodes({ plane: "xy", x, y, z }, gridMap);
        if (!cell) {
          continue;
        }
        const { a, b, c, d } = cell;
        addTriangle([a, b, c]);
        addTriangle([b, c, d]);
        addTriangle([a, b, d]);
        addTriangle([a, c, d]);
      }
    }
  }
  if (gridDepth > 1) {
    for (let y = 0; y < GRID_ROWS; y += 1) {
      for (let z = 0; z < gridDepth - 1; z += 1) {
        for (let x = 0; x < GRID_COLS - 1; x += 1) {
          const cell = getTriangleCellNodes({ plane: "xz", x, y, z }, gridMap);
          if (!cell) {
            continue;
          }
          const { a, b, c, d } = cell;
          addTriangle([a, b, c]);
          addTriangle([b, c, d]);
          addTriangle([a, b, d]);
          addTriangle([a, c, d]);
        }
      }
    }
    for (let x = 0; x < GRID_COLS; x += 1) {
      for (let z = 0; z < gridDepth - 1; z += 1) {
        for (let y = 0; y < GRID_ROWS - 1; y += 1) {
          const cell = getTriangleCellNodes({ plane: "yz", x, y, z }, gridMap);
          if (!cell) {
            continue;
          }
          const { a, b, c, d } = cell;
          addTriangle([a, b, c]);
          addTriangle([b, c, d]);
          addTriangle([a, b, d]);
          addTriangle([a, c, d]);
        }
      }
    }
  }
  entries.sort((left, right) => {
    if (left.dist !== right.dist) {
      return left.dist - right.dist;
    }
    return left.angle - right.angle;
  });
  return entries.map((entry) => entry.indices);
}

const CUSTOM_SLOT_VECTORS = [
  { x: 0.5, y: -0.5 },
  { x: 0.5, y: 0.5 },
  { x: -0.5, y: 0.5 },
  { x: -0.5, y: -0.5 },
];

function getCustomSlotOffset(slot) {
  const normalizedSlot = Number.isFinite(slot) ? Math.max(0, Math.trunc(slot)) : 0;
  const ring = Math.floor(normalizedSlot / CUSTOM_SLOT_VECTORS.length) + 1;
  const vector = CUSTOM_SLOT_VECTORS[normalizedSlot % CUSTOM_SLOT_VECTORS.length];
  return {
    x: vector.x * GRID_SPACING * ring,
    y: vector.y * GRID_SPACING * ring,
  };
}

function getCustomNodesForSource(sourceId) {
  return customNodes.filter((node) => node.sourceNodeId === sourceId);
}

function findNextCustomSlot(sourceId) {
  const used = new Set(getCustomNodesForSource(sourceId).map((node) => node.customSlot));
  let index = 0;
  while (used.has(index)) {
    index += 1;
  }
  return index;
}

function computeCustomNodeCoordinate(sourceNode, slot) {
  if (!sourceNode || typeof slot !== "number") {
    return null;
  }
  const offset = getCustomSlotOffset(slot);
  const sourceZ = Number.isFinite(sourceNode.coordinate?.z) ? sourceNode.coordinate.z : 0;
  return {
    x: sourceNode.coordinate.x + offset.x,
    y: sourceNode.coordinate.y + offset.y,
    z: sourceZ,
  };
}

function createCustomNodeFromSource(sourceNode, slot, factorNumerator, factorDenominator) {
  if (!sourceNode || !sourceNode.id || typeof slot !== "number") {
    return null;
  }
  const coordinate = computeCustomNodeCoordinate(sourceNode, slot) || {
    x: sourceNode.coordinate.x,
    y: sourceNode.coordinate.y,
    z: Number.isFinite(sourceNode.coordinate?.z) ? sourceNode.coordinate.z : 0,
  };
  const sourceExponentZ = Number.isFinite(sourceNode.exponentZ) ? sourceNode.exponentZ : 0;
  const sourceGridZ = Number.isFinite(sourceNode.gridZ) ? sourceNode.gridZ : sourceExponentZ;
  const node = {
    id: nextCustomNodeId++,
    sourceNodeId: sourceNode.id,
    sourceExponents: [sourceNode.exponentX, sourceNode.exponentY, sourceNode.exponentZ || 0],
    customSlot: slot,
    factorNumerator: Math.max(1, Number(factorNumerator) || 1),
    factorDenominator: Math.max(1, Number(factorDenominator) || 1),
    numerator: 1,
    denominator: 1,
    exponentX: null,
    exponentY: null,
    exponentZ: sourceExponentZ,
    gridX: null,
    gridY: null,
    gridZ: sourceGridZ,
    coordinate: { ...coordinate },
    freq: 0,
    cents_from_et: 0,
    note_name: "",
    pitch_class: "",
    active: Boolean(sourceNode.active),
    isCenter: false,
    baseVoiceId: null,
    isCustom: true,
    octaveShift: 0,
    octaveShiftManual: false,
    octaveReduce: true,
    volumeMax: clampNodeVolume(sourceNode.volumeMax),
  };
  layoutNodeShapes.set(node.id, "diamond");
  return node;
}

function insertCustomNode(node) {
  if (!node) {
    return;
  }
  customNodes.push(node);
  nodes.push(node);
  nodeById.set(node.id, node);
}

function addCustomNodeToScene(node) {
  insertCustomNode(node);
  if (node && node.isCustom && !showLineLabels) {
    const sourceNode = nodeById.get(node.sourceNodeId);
    const edgeKey = getEdgeKey(sourceNode, node);
    if (edgeKey) {
      lineLabelOverrides.set(edgeKey, true);
    }
  }
  refreshCustomNodes();
  updatePitchInstances();
  markIsomorphicDirty();
  refreshPatternFromActiveNodes();
  schedulePresetUrlUpdate();
  draw();
}

function removeCustomNode(nodeId) {
  const node = nodeById.get(nodeId);
  if (!node || !node.isCustom) {
    return false;
  }
  customNodes = customNodes.filter((item) => item.id !== nodeId);
  nodes = nodes.filter((item) => item.id !== nodeId);
  nodeById.delete(nodeId);
  layoutNodeShapes.delete(nodeId);
  layoutPositions.delete(nodeId);
  layoutLabelOffsets.delete(nodeId);
  layoutKeyMappingOffsets.delete(nodeId);
  layoutPositionOffsets.delete(nodeId);
  return true;
}

function getCustomNodeDisplayInfo(node) {
  if (!node) {
    return null;
  }
  const freq = Number(node.freq);
  if (!Number.isFinite(freq)) {
    return null;
  }
  const a4 = Number(a4Input.value) || 440;
  const nearest = getNearestEtInfo(freq, a4);
  const preferredNames = getNoteNamesForNode(node);
  const nearestPitchClass = preferredNames[nearest.midi % 12];
  const nearestName = `${nearestPitchClass}${Math.floor(nearest.midi / 12) - 1}`;
  const nearestCents = Number.isFinite(node.cents_from_et) ? node.cents_from_et : nearest.cents;
  if (spellingMode === "true" || hejiEnabled) {
    const analysis = analyzeCustomRatio(node.derivedNumerator || node.numerator, node.derivedDenominator || node.denominator);
    if (analysis) {
      const info = buildTrueSpellingFromAxisRatios({
        node,
        axisRatios: analysis.axisRatios,
        freq,
        nearest,
        nearestPitchClass,
        nearestName,
        nearestCents,
      });
      info.octaveShift = Number.isFinite(info.octaveShift) ? info.octaveShift : analysis.octaveShift;
      return info;
    }
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const targetPc = nearest.midi % 12;
  const pitchClass =
    spellingMode === "simple"
      ? getManualSpellingForNode(node, targetPc)
      : nearestPitchClass;
  return {
    name: `${pitchClass}${Math.floor(nearest.midi / 12) - 1}`,
    pitchClass,
    cents: nearestCents,
  };
}

function refreshCustomNodes() {
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  customNodes.forEach((customNode) => {
    const source = nodeById.get(customNode.sourceNodeId);
    if (!source) {
      return;
    }
    const numerator = source.numerator * customNode.factorNumerator;
    const denominator = source.denominator * customNode.factorDenominator;
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return;
    }
    if (customNode.octaveReduce === false) {
      customNode.numerator = numerator;
      customNode.denominator = denominator;
      customNode.derivedNumerator = numerator;
      customNode.derivedDenominator = denominator;
      customNode.octaveShift = 0;
      customNode.octaveShiftManual = true;
      const ratioValue = numerator / denominator;
      if (!Number.isFinite(ratioValue)) {
        return;
      }
      customNode.freq = fundamental * ratioValue;
    } else {
      const normalized = normalizeRatioToOctave(numerator, denominator);
      if (!normalized) {
        return;
      }
      const reduced = reduceFraction(normalized.numerator, normalized.denominator);
      customNode.numerator = reduced.numerator;
      customNode.denominator = reduced.denominator;
      customNode.derivedNumerator = reduced.numerator;
      customNode.derivedDenominator = reduced.denominator;
      if (!customNode.octaveShiftManual) {
        customNode.octaveShift = normalized.shift;
      }
      const ratioValue = reduced.numerator / reduced.denominator;
      if (!Number.isFinite(ratioValue)) {
        return;
      }
      customNode.freq = fundamental * ratioValue;
    }
    const etInfo = getNearestEtInfo(customNode.freq, a4);
    customNode.cents_from_et = etInfo.cents;
    customNode.note_name = etInfo.name;
    customNode.pitch_class = etInfo.pitchClass;
    const analysis = analyzeCustomRatio(
      customNode.derivedNumerator || customNode.numerator,
      customNode.derivedDenominator || customNode.denominator
    );
    customNode.customAxisRatios = analysis ? analysis.axisRatios : [];
    const derivedInfo = getCustomNodeDisplayInfo(customNode);
    if (derivedInfo) {
      customNode.note_name = derivedInfo.name;
      customNode.pitch_class = derivedInfo.pitchClass;
    }
  });
  invalidateLabelCache();
}

function createCustomNodeForSource(sourceId, numerator, denominator, { octaveShift = 0, octaveReduce = true } = {}) {
  const source = nodeById.get(sourceId);
  if (!source || !source.active) {
    return;
  }
  const slot = findNextCustomSlot(sourceId);
  if (slot == null) {
    return;
  }
  const node = createCustomNodeFromSource(source, slot, numerator, denominator);
  if (!node) {
    return;
  }
  node.octaveReduce = octaveReduce;
  node.octaveShift = Number.isFinite(octaveShift) ? octaveShift : 0;
  node.octaveShiftManual = true;
  addCustomNodeToScene(node);
}

function updateCustomNodeFactor(nodeId, numerator, denominator, { octaveShift = 0, octaveReduce = true } = {}) {
  const node = nodeById.get(nodeId);
  if (!node || !node.isCustom) {
    return;
  }
  node.factorNumerator = Math.max(1, numerator);
  node.factorDenominator = Math.max(1, denominator);
  node.octaveReduce = octaveReduce;
  node.octaveShift = Number.isFinite(octaveShift) ? octaveShift : 0;
  node.octaveShiftManual = true;
  refreshCustomNodes();
  draw();
  schedulePresetUrlUpdate();
}

function applyCustomDialogResult(numerator, denominator) {
  if (!pendingCustomAction) {
    return;
  }
  const reduceEnabled = customRatioReduceToggle ? customRatioReduceToggle.checked : true;
  lastCustomOctaveReduce = reduceEnabled;
  lastCustomFactor = {
    numerator,
    denominator,
  };
  let factorNumerator = Math.max(1, Math.trunc(numerator));
  let factorDenominator = Math.max(1, Math.trunc(denominator));
  let octaveShift = 0;
  if (reduceEnabled) {
    const normalized = normalizeRatioToOctave(factorNumerator, factorDenominator);
    if (normalized) {
      const reduced = reduceFraction(normalized.numerator, normalized.denominator);
      factorNumerator = reduced.numerator;
      factorDenominator = reduced.denominator;
      octaveShift = normalized.shift;
    }
  }
  if (pendingCustomAction.type === "create") {
    createCustomNodeForSource(pendingCustomAction.sourceId, factorNumerator, factorDenominator, {
      octaveShift: reduceEnabled ? octaveShift : 0,
      octaveReduce: reduceEnabled,
    });
  } else if (pendingCustomAction.type === "edit") {
    updateCustomNodeFactor(pendingCustomAction.nodeId, factorNumerator, factorDenominator, {
      octaveShift: reduceEnabled ? octaveShift : 0,
      octaveReduce: reduceEnabled,
    });
  }
  pendingCustomAction = null;
}

function syncCustomNodesWithSource(sourceId, active) {
  if (!active) {
    return;
  }
  customNodes.forEach((node) => {
    if (node.sourceNodeId === sourceId) {
      node.active = active;
    }
  });
}

function openCustomRatioDialog(action) {
  if (!action) {
    return;
  }
  pendingCustomAction = action;
  let numerator = lastCustomFactor.numerator;
  let denominator = lastCustomFactor.denominator;
  if (action.type === "edit") {
    const node = nodeById.get(action.nodeId);
    if (node) {
      numerator = node.factorNumerator || numerator;
      denominator = node.factorDenominator || denominator;
      lastCustomOctaveReduce = node.octaveReduce !== false;
    }
  }
  if (customRatioNumerator) {
    customRatioNumerator.value = String(numerator);
  }
  if (customRatioDenominator) {
    customRatioDenominator.value = String(denominator);
  }
  if (customRatioReduceToggle) {
    setControlChecked(customRatioReduceToggle, lastCustomOctaveReduce);
  }
  if (customRatioDialog && typeof customRatioDialog.showModal === "function") {
    customRatioDialog.showModal();
    if (customRatioNumerator) {
      customRatioNumerator.focus();
    }
    return;
  }
  const promptNumerator = window.prompt("Numerator", String(numerator));
  if (promptNumerator == null) {
    pendingCustomAction = null;
    return;
  }
  const promptDenominator = window.prompt("Denominator", String(denominator));
  if (promptDenominator == null) {
    pendingCustomAction = null;
    return;
  }
  const num = Number(promptNumerator);
  const den = Number(promptDenominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
    alert("Please enter valid integers for numerator and denominator.");
    pendingCustomAction = null;
    return;
  }
  applyCustomDialogResult(Math.max(1, num), Math.max(1, den));
}

function handleCustomRatioDialogClose() {
  resetHeldModifiers();
  if (!customRatioDialog) {
    pendingCustomAction = null;
    return;
  }
  if (customRatioDialog.returnValue !== "confirm") {
    pendingCustomAction = null;
    return;
  }
  if (customRatioReduceToggle) {
    lastCustomOctaveReduce = customRatioReduceToggle.checked;
  }
  const numerator = Number(customRatioNumerator ? customRatioNumerator.value : lastCustomFactor.numerator);
  const denominator = Number(customRatioDenominator ? customRatioDenominator.value : lastCustomFactor.denominator);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    alert("Please enter valid integers for numerator and denominator.");
    pendingCustomAction = null;
    return;
  }
  applyCustomDialogResult(Math.max(1, numerator), Math.max(1, denominator));
}

const DIALOG_CONFIRM_VALUES = new Set(["confirm", "ok", "add", "done"]);
const DIALOG_CANCEL_VALUES = new Set(["cancel", "none", "clear"]);

function getDialogSubmitButton(form) {
  if (!form) {
    return null;
  }
  const buttons = Array.from(
    form.querySelectorAll('button[type="submit"], button:not([type])')
  );
  let submitter = buttons.find((button) => DIALOG_CONFIRM_VALUES.has(button.value));
  if (!submitter) {
    submitter = buttons.find(
      (button) => button.value && !DIALOG_CANCEL_VALUES.has(button.value)
    );
  }
  if (!submitter && buttons.length) {
    submitter = buttons[buttons.length - 1];
  }
  return submitter || null;
}

function setupDialogKeyDefaults(dialog) {
  if (!dialog) {
    return;
  }
  bindOptionalEvent(dialog, "keydown", (event) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close("cancel");
      return;
    }
    if (event.key !== "Enter") {
      return;
    }
    if (
      dialog.id === "find-ratio-dialog" ||
      dialog.id === "build-intervals-dialog"
    ) {
      return;
    }
    if (event.isComposing) {
      return;
    }
    const targetTag = event.target ? event.target.tagName : "";
    if (targetTag === "TEXTAREA") {
      return;
    }
    event.preventDefault();
    const form = dialog.querySelector('form[method="dialog"]');
    if (form) {
      const submitter = getDialogSubmitButton(form);
      if (submitter) {
        submitter.click();
        return;
      }
      if (typeof form.requestSubmit === "function") {
        form.requestSubmit();
        return;
      }
      form.submit();
      return;
    }
    const buttons = Array.from(dialog.querySelectorAll("button"));
    if (buttons.length) {
      buttons[buttons.length - 1].click();
    }
  });
}

function scheduleLfoStopsAtCycleEnd() {
  clearLfoStopTimers();
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
    } else {
      return;
    }
    const timer = setTimeout(() => {
      stopVoice(voice, true);
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
}

function allNotesOff() {
  stopPatternPlayback();
  stopLooperPlayback();
  clearLfoStopTimers();
  lfoArmingId = null;
  lfoArmingStart = 0;
  customPianoActiveKeys.clear();
  clearTriangleKeyboardActiveVoices();
  clearCustomPianoPreviewVoices();
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
  looperStartMs = 0;
  looperLoopDurationMs = 0;
  looperCycleStartMs = 0;
  looperState = "recording";
  updateLooperButton();
}

function stopLooperRecordingAndStartPlayback() {
  if (looperState !== "recording") {
    return;
  }
  if (looperEvents.length && looperStartMs > 0) {
    const elapsed = performance.now() - looperStartMs;
    looperLoopDurationMs = Math.max(looperLoopDurationMs, elapsed);
  }
  startLooperPlayback();
}

function startLooperOverdub() {
  if (looperState !== "playing" || !looperEvents.length || looperLoopDurationMs <= 0) {
    return;
  }
  looperState = "overdubbing";
  updateLooperButton();
}

function stopLooperOverdub() {
  if (looperState !== "overdubbing") {
    return;
  }
  looperState = "playing";
  updateLooperButton();
}

function shouldCaptureLooperInput(voice) {
  return (
    voice &&
    voice.source !== "looper" &&
    (looperState === "recording" || looperState === "overdubbing")
  );
}

function normalizeLoopEventTime(timeMs) {
  if (!Number.isFinite(timeMs)) {
    return 0;
  }
  if (!(looperLoopDurationMs > 0)) {
    return Math.max(0, timeMs);
  }
  const wrapped = ((timeMs % looperLoopDurationMs) + looperLoopDurationMs) % looperLoopDurationMs;
  return wrapped;
}

function getLooperEventTimestamp(nowMs = performance.now()) {
  if (looperState === "overdubbing" && looperLoopDurationMs > 0 && looperCycleStartMs > 0) {
    return normalizeLoopEventTime(nowMs - looperCycleStartMs);
  }
  if (!(looperStartMs > 0)) {
    looperStartMs = nowMs;
  }
  return Math.max(0, nowMs - looperStartMs);
}

function appendLooperEvent(type, nodeId, timeMs, octave, { wrap = false, oneShot = false } = {}) {
  const normalizedTime = wrap ? normalizeLoopEventTime(timeMs) : Math.max(0, timeMs);
  const nextEvent = {
    type,
    nodeId,
    t: normalizedTime,
    octave: Number.isFinite(octave) ? octave : 0,
  };
  if (oneShot) {
    nextEvent.oneShot = true;
  }
  looperEvents.push(nextEvent);
  looperEvents.sort((a, b) => a.t - b.t);
}

function getLooperQuantizeStepMs() {
  const bpm = Number(tempoSlider ? tempoSlider.value : tempoBpm) || tempoBpm || 120;
  const beatMs = 60000 / Math.max(1, bpm);
  switch (looperQuantizeGrid) {
    case "8":
      return beatMs / 2;
    case "16":
      return beatMs / 4;
    case "32":
      return beatMs / 8;
    case "8t":
      return beatMs / 3;
    case "16t":
      return beatMs / 6;
    default:
      return beatMs / 4;
  }
}

function getLooperQuantizeAnchorMs() {
  const firstOn = looperEvents.find((event) => event && event.type === "on");
  return firstOn && Number.isFinite(firstOn.t) ? Number(firstOn.t) : 0;
}

function getLooperPlaybackEventTime(event) {
  const baseTime = Math.max(0, Number(event && event.t) || 0);
  if (
    !looperQuantizeEnabled ||
    !event ||
    event.type !== "on" ||
    !(looperLoopDurationMs > 0)
  ) {
    return baseTime;
  }
  const stepMs = getLooperQuantizeStepMs();
  if (!(stepMs > 0)) {
    return baseTime;
  }
  const anchorMs = getLooperQuantizeAnchorMs();
  const relative = baseTime - anchorMs;
  const snapped = anchorMs + Math.round(relative / stepMs) * stepMs;
  const strength = Math.max(0, Math.min(1, looperQuantizeStrength));
  const blended = baseTime + (snapped - baseTime) * strength;
  return normalizeLoopEventTime(blended);
}

function scheduleLooperCycle() {
  looperCycleStartMs = performance.now();
  looperEvents.forEach((event) => {
    const eventTimeMs = getLooperPlaybackEventTime(event);
    const timer = setTimeout(() => {
      if (looperState !== "playing" && looperState !== "overdubbing") {
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
          forceOneShot: event.oneShot === true,
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
    }, eventTimeMs);
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
  looperCycleStartMs = performance.now();
  scheduleLooperCycle();
  looperCycleTimer = setInterval(scheduleLooperCycle, looperLoopDurationMs);
}

function stopLooperPlayback() {
  clearLooperTimers();
  stopLooperVoices();
  looperCycleStartMs = 0;
  looperState = looperEvents.length ? "ready" : "idle";
  updateLooperButton();
  draw();
}

function clearLooper() {
  clearLooperTimers();
  stopLooperVoices();
  looperEvents = [];
  looperLoopDurationMs = 0;
  looperCycleStartMs = 0;
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
  const offsetX = Number(latticeExponentOffset.x) || 0;
  const offsetY = Number(latticeExponentOffset.y) || 0;
  const offsetZ = Number(latticeExponentOffset.z) || 0;
  const depth = is3DMode || isFlattened2D ? GRID_DEPTH : 1;
  gridDepth = depth;
  gridCenterZ = Math.floor(depth / 2);

  for (let z = 0; z < depth; z += 1) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const exponentX = x - centerX - offsetX;
        const exponentY = centerY - y - offsetY;
        const exponentZ = gridCenterZ - z - offsetZ;
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
          octaveShift: 0,
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
  refreshCustomNodes();
  bumpLabelDataVersion();
  updatePitchInstances();
  updateVoiceFrequencies();
  draw();
  schedulePresetUrlUpdate();
}

function updateNodeRatios() {
  if (spellingMode === "true") {
    const activeKeys = captureActiveNodeKeys();
    rebuildLattice(activeKeys);
    return;
  }
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const ratioX = Number(ratioXSelect.value) || 3;
  const ratioY = Number(ratioYSelect.value) || 5;
  const ratioZ = Number(ratioZSelect.value) || 7;

  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
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

  refreshCustomNodes();
  bumpLabelDataVersion();
  updatePitchInstances();
  updateVoiceFrequencies();
  draw();
  schedulePresetUrlUpdate();
}

function recomputeNodeRatiosFromExponents() {
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const ratioX = Number(ratioXSelect.value) || 3;
  const ratioY = Number(ratioYSelect.value) || 5;
  const ratioZ = Number(ratioZSelect.value) || 7;

  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
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

  refreshCustomNodes();
  bumpLabelDataVersion();
  updatePitchInstances();
  updateVoiceFrequencies();
  draw();
  schedulePresetUrlUpdate();
}

function rebaseLatticeFromNode(node) {
  if (!node || node.isCustom) {
    return false;
  }
  const deltaX = Number(node.exponentX) || 0;
  const deltaY = Number(node.exponentY) || 0;
  const deltaZ = Number(node.exponentZ) || 0;
  if (!deltaX && !deltaY && !deltaZ) {
    return false;
  }
  latticeExponentOffset = {
    x: (Number(latticeExponentOffset.x) || 0) + deltaX,
    y: (Number(latticeExponentOffset.y) || 0) + deltaY,
    z: (Number(latticeExponentOffset.z) || 0) + deltaZ,
  };
  nodeOctaveOffsets = shiftExponentMap(nodeOctaveOffsets, deltaX, deltaY, deltaZ);
  const shiftedVolumes = shiftExponentMap(nodeVolumeLimits, deltaX, deltaY, deltaZ);
  nodeVolumeLimits.clear();
  if (shiftedVolumes && shiftedVolumes.size) {
    shiftedVolumes.forEach((value, key) => nodeVolumeLimits.set(key, value));
  }
  shiftLineLabelOverrides(deltaX, deltaY, deltaZ);
  nodes.forEach((entry) => {
    if (entry.isCustom) {
      return;
    }
    entry.exponentX -= deltaX;
    entry.exponentY -= deltaY;
    entry.exponentZ = (Number(entry.exponentZ) || 0) - deltaZ;
    const isCenter = entry.exponentX === 0 && entry.exponentY === 0 && entry.exponentZ === 0;
    entry.isCenter = isCenter;
    if (isCenter) {
      entry.active = true;
    }
  });
  applyNodeOctaveOffsets();
  recomputeNodeRatiosFromExponents();
  markIsomorphicDirty();
  return true;
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
    setVoiceFrequencyAtTime(voice, freq, audioCtx.currentTime, 0.01);
  });
}

function setVoiceFrequencyAtTime(voice, freq, when, timeConstant = 0.01) {
  if (!voice || !Number.isFinite(freq) || freq <= 0) {
    return;
  }
  voice.freq = freq;
  const oscillator = voice.oscillator;
  if (!oscillator) {
    updateMidiOutVoicePitch(voice);
    return;
  }
  if (oscillator.frequency && typeof oscillator.frequency.setTargetAtTime === "function") {
    oscillator.frequency.setTargetAtTime(freq, when, timeConstant);
  } else if (oscillator.frequency && typeof oscillator.frequency.setValueAtTime === "function") {
    oscillator.frequency.setValueAtTime(freq, when);
  } else if (oscillator.parameters && typeof oscillator.parameters.get === "function") {
    const frequencyParam = oscillator.parameters.get("frequency");
    if (frequencyParam) {
      if (typeof frequencyParam.setTargetAtTime === "function") {
        frequencyParam.setTargetAtTime(freq, when, timeConstant);
      } else if (typeof frequencyParam.setValueAtTime === "function") {
        frequencyParam.setValueAtTime(freq, when);
      } else {
        frequencyParam.value = freq;
      }
    }
  } else if ("frequency" in oscillator) {
    oscillator.frequency = freq;
  }
  updateMidiOutVoicePitch(voice);
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
  }
  const normalized = (envLevel / 0.2) * lfoLevel;
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

function buildScreenIsomorphicLayoutFromProjected(projected, getId, getValue) {
  if (!projected.length) {
    return new Map();
  }

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
  const items = projected.map((entry) => ({
    entry,
    uNorm: (entry.x - minX) / spanX,
    vNorm: (entry.y - minY) / spanY,
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
    const value = getValue(item.entry);
    const gridY = Number.isFinite(value?.gridY) ? value.gridY : Math.round(item.vNorm * 100);
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
      const value = getValue(item.entry);
      const gridY = Number.isFinite(value?.gridY) ? value.gridY : Math.round(item.vNorm * 100);
      rows.push({
        centerV: item.vNorm,
        items: [item],
        gridYCounts: new Map([[gridY, 1]]),
        dominantGridY: gridY,
      });
      return;
    }
    const gap = Math.abs(item.vNorm - last.centerV);
    const value = getValue(item.entry);
    const itemGridY = Number.isFinite(value?.gridY) ? value.gridY : Math.round(item.vNorm * 100);
    const prefersRow = itemGridY === last.dominantGridY;
    const threshold = Math.max(minRowGapNorm, prefersRow ? rowThreshold * 1.6 : rowThreshold);
    if (gap > threshold) {
      rows.push({
        centerV: item.vNorm,
        items: [item],
        gridYCounts: new Map([[itemGridY, 1]]),
        dominantGridY: itemGridY,
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
          layout.set(key, { entry: item.entry, dist });
        }
      });
    });
    const mappedItems = new Set();
    layout.forEach((value) => {
      mappedItems.add(getId(value.entry));
    });
    return {
      layout,
      mappedCount: mappedItems.size,
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
    result.set(key, getValue(value.entry));
  });

  return result;
}

function buildScreenIsomorphicLayout() {
  const activeNodes = nodes.filter((node) => node.active);
  if (!activeNodes.length) {
    return new Map();
  }
  const projected = activeNodes.map((node) => {
    const pos = worldToScreen(node.coordinate);
    return { id: node.id, value: node, x: pos.x, y: pos.y };
  });
  return buildScreenIsomorphicLayoutFromProjected(
    projected,
    (entry) => entry.id,
    (entry) => entry.value
  );
}

function drawKeyBanner(pos, radius, label, alpha) {
  const paddingX = 6;
  const paddingY = 3;
  const fontSize = 11;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${fontSize}px "Lexend", sans-serif`;
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

function drawTriangleKeyBanner(pos, label, alpha = 1) {
  const paddingX = 5;
  const paddingY = 2;
  const fontSize = 10;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${fontSize}px "Lexend", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textWidth = Math.max(1, ctx.measureText(label).width);
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = fontSize + paddingY * 2;
  const x = pos.x - boxWidth / 2;
  const y = pos.y - boxHeight / 2;
  ctx.fillStyle = "rgba(10, 15, 20, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, pos.x, pos.y);
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

function getEffectiveTriangleTargets() {
  ensureAutoTriangleDiagonals();
  const targets = [];
  const gridMap = getActiveGridNodeMap();
  const width = canvas ? canvas.clientWidth : 0;
  const height = canvas ? canvas.clientHeight : 0;
  const isPointInView = (point) => {
    if (!point || !point.visible) {
      return false;
    }
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      return false;
    }
    if (width <= 0 || height <= 0) {
      return true;
    }
    return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
  };
  const triIdsForDiag = (diag) =>
    diag === "backslash" ? ["abd", "acd"] : ["abc", "bcd"];
  forEachEffectiveTriangleDiagonal((entry) => {
    const triIds = triIdsForDiag(entry.diag);
    triIds.forEach((tri) => {
      const triNodes = getTriangleLabelPoints(tri, getTriangleCellNodes(entry, gridMap));
      if (!triNodes || triNodes.length !== 3) {
        return;
      }
      const projectedNodes = triNodes.map((node) => worldToScreen(node.coordinate));
      if (projectedNodes.some((point) => !isPointInView(point))) {
        return;
      }
      const centroid = {
        x: (triNodes[0].coordinate.x + triNodes[1].coordinate.x + triNodes[2].coordinate.x) / 3,
        y: (triNodes[0].coordinate.y + triNodes[1].coordinate.y + triNodes[2].coordinate.y) / 3,
        z: (triNodes[0].coordinate.z + triNodes[1].coordinate.z + triNodes[2].coordinate.z) / 3,
      };
      const id = `${triangleKey(entry)}:${tri}`;
      const screen = worldToScreen(centroid);
      targets.push({
        id,
        triangle: {
          plane: entry.plane,
          x: entry.x,
          y: entry.y,
          z: entry.z,
          diag: entry.diag,
          tri,
        },
        triNodes,
        coordinate: centroid,
        screen,
      });
    });
  });
  return targets;
}

function buildIsomorphicTriangleLayout() {
  const targets = getEffectiveTriangleTargets();
  if (!targets.length) {
    return new Map();
  }
  const projectedAll = targets.map((target) => {
    const pos = worldToScreen(target.coordinate);
    return { id: target.id, value: target, x: pos.x, y: pos.y };
  });
  const projected = projectedAll;
  if (!projected.length) {
    return new Map();
  }
  return buildScreenIsomorphicLayoutFromProjected(
    projected,
    (entry) => entry.id,
    (entry) => entry.value
  );
}

function ensureIsomorphicTriangleMaps() {
  if (!isomorphicTriangleDirty && isomorphicTriangleLayout && isomorphicTriangleKeyMap) {
    return;
  }
  const layout = buildIsomorphicTriangleLayout();
  const keyMap = new Map();
  layout.forEach((target, key) => {
    if (target && target.id) {
      keyMap.set(target.id, key.toUpperCase());
    }
  });
  isomorphicTriangleLayout = layout;
  isomorphicTriangleKeyMap = keyMap;
  isomorphicTriangleDirty = false;
}

function findIsomorphicTriangleForKey(key) {
  ensureIsomorphicTriangleMaps();
  return isomorphicTriangleLayout ? isomorphicTriangleLayout.get(key) || null : null;
}

function clearTriangleKeyboardActiveVoices() {
  if (!triangleKeyboardActiveKeys.size) {
    return;
  }
  triangleKeyboardActiveKeys.forEach((voiceIds) => {
    if (!Array.isArray(voiceIds)) {
      return;
    }
    voiceIds.forEach((voiceId) => {
      const voice = findVoiceById(voiceId);
      if (voice) {
        stopVoice(voice);
      }
    });
  });
  triangleKeyboardActiveKeys.clear();
}

function handleKeyDown(event) {
  const tag = event.target.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
    return;
  }
  const keyboardModeEnabled = snapshotKeyboardModeToggle
    ? snapshotKeyboardModeToggle.checked
    : snapshotKeyboardMode;
  const keyboardMappingActive = snapshotKeyboardActiveToggle
    ? snapshotKeyboardActiveToggle.checked
    : snapshotKeyboardActive;
  const snapshotLetterIndex =
    keyboardModeEnabled && keyboardMappingActive ? getSnapshotLetterIndexFromEvent(event) : null;
  const snapshotLetterHasSlot =
    snapshotLetterIndex != null && Boolean(snapshotLetterSlots[snapshotLetterIndex]);
  const snapshotLetterShortcutActive =
    keyboardModeEnabled &&
    keyboardMappingActive &&
    snapshotLetterIndex != null &&
    ((event.altKey && !event.metaKey && !event.ctrlKey) || snapshotLetterHasSlot);
  if (snapshotLetterShortcutActive) {
    return;
  }
  if (event.code === "Space") {
    if (layoutMode) {
      return;
    }
    if (document.activeElement !== canvas) {
      return;
    }
    if (event.shiftKey) {
      event.preventDefault();
      allNotesOff();
      return;
    }
    if (!patternSequenceState || !patternActiveNodes.length) {
      return;
    }
    event.preventDefault();
    if (patternPlayerState === "playing") {
      stopPatternPlayback();
    } else {
      startPatternPlayback();
    }
    return;
  }
  const key = event.key.toLowerCase();
  if (intervalChartOverlay && !intervalChartOverlay.hidden && key === "escape") {
    event.preventDefault();
    closeIntervalChart();
    return;
  }
  if (customPianoMapMode && key === "escape") {
    event.preventDefault();
    setCustomPianoMapMode(false);
    return;
  }
  if (layoutMode && (event.metaKey || event.ctrlKey) && key === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      redoLayoutChange();
    } else {
      undoLayoutChange();
    }
    return;
  }
  if (layoutMode && (event.metaKey || event.ctrlKey) && key === "y") {
    event.preventDefault();
    redoLayoutChange();
    return;
  }
  if (layoutMode && layoutAxisEdit && (key === "delete" || key === "backspace")) {
    event.preventDefault();
    pushLayoutUndoState();
    layoutAxisHidden[layoutAxisEdit] = true;
    layoutAxisEdit = null;
    layoutAxisEditDrag = null;
    updateUiHint();
    draw();
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutMode) {
    return;
  }
  if (!event.metaKey && !event.ctrlKey && !event.altKey) {
    if (event.code === "Backslash") {
      event.preventDefault();
      if (looperState === "recording") {
        stopLooperRecordingAndStartPlayback();
      } else if (looperState === "playing") {
        startLooperOverdub();
      } else if (looperState === "overdubbing") {
        stopLooperOverdub();
      } else if (looperState === "ready") {
        startLooperPlayback();
      } else if (looperState === "idle") {
        startLooperRecording();
      }
      return;
    }
    if (event.code === "BracketRight") {
      event.preventDefault();
      clearLooper();
      return;
    }
  }

  const mode = getKeyboardMode();
  if (mode === "off") {
    return;
  }
  if (mode === "piano-custom" && customPianoMapMode) {
    return;
  }
  if (mode !== "iso-tri" && activeKeys.has(key)) {
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
  } else if (mode === "piano-custom") {
    if (!(key in KEYBOARD_MAP)) {
      return;
    }
    if (customPianoActiveKeys.has(key)) {
      return;
    }
    const semitone = KEYBOARD_MAP[key];
    const pitchClass = ((semitone % 12) + 12) % 12;
    const octaveOffset = Math.floor(semitone / 12);
    const voices = startCustomPianoMappedVoices(pitchClass, "keyboard", 1, octaveOffset);
    if (!voices.length) {
      return;
    }
    customPianoActiveKeys.set(key, voices);
    draw();
    return;
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
  } else if (mode === "iso-tri") {
    if (triangleKeyboardActiveKeys.has(key)) {
      return;
    }
    const target = findIsomorphicTriangleForKey(key);
    if (!target || !Array.isArray(target.triNodes) || !target.triNodes.length) {
      return;
    }
    const voiceIds = [];
    target.triNodes.forEach((node) => {
      const voice = startVoice({
        nodeId: node.id,
        octave: 0,
        freq: node.freq,
        source: "keyboard",
      });
      if (voice) {
        voiceIds.push(voice.id);
      }
    });
    if (!voiceIds.length) {
      return;
    }
    triangleKeyboardActiveKeys.set(key, voiceIds);
    draw();
    return;
  }

  if (!voice) {
    return;
  }

  activeKeys.set(key, voice.id);
  draw();
}

function handleKeyUp(event) {
  if (layoutMode) {
    return;
  }
  const mode = getKeyboardMode();
  if (mode === "off") {
    return;
  }
  if (mode === "piano-custom" && customPianoMapMode) {
    return;
  }

  const key = event.key.toLowerCase();
  if (mode === "piano-custom") {
    const voiceIds = customPianoActiveKeys.get(key);
    if (!voiceIds) {
      return;
    }
    const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
    customPianoActiveKeys.delete(key);
    if (isOneShot) {
      return;
    }
    stopCustomPianoMappedVoices(voiceIds);
    return;
  }
  if (mode === "iso-tri") {
    const triVoiceIds = triangleKeyboardActiveKeys.get(key);
    if (!triVoiceIds) {
      return;
    }
    const isOneShot = Boolean(oneShotCheckbox && oneShotCheckbox.checked);
    triangleKeyboardActiveKeys.delete(key);
    if (isOneShot) {
      return;
    }
    triVoiceIds.forEach((voiceId) => {
      const voice = findVoiceById(voiceId);
      if (voice) {
        stopVoice(voice);
      }
    });
    draw();
    return;
  }
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

function getCentsForPitchClass(freq, a4, pitchClass) {
  if (!Number.isFinite(freq) || !Number.isFinite(a4)) {
    return 0;
  }
  const parsed = parsePitchClass(pitchClass);
  if (!Number.isFinite(parsed.letterIndex) || !Number.isFinite(parsed.accidental)) {
    return 0;
  }
  const targetPc = mod(
    LETTER_TO_SEMITONE[LETTERS[parsed.letterIndex]] + parsed.accidental,
    12
  );
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midiBase = Math.round((midiFloat - targetPc) / 12);
  const midi = targetPc + 12 * midiBase;
  const etFreq = a4 * Math.pow(2, (midi - 69) / 12);
  return 1200 * Math.log2(freq / etFreq);
}

function getNodeRadius(node) {
  if (node.isCustom) {
    return 35;
  }
  return 35;
}

function midiToNoteName(midi) {
  return `${noteNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function getFundamentalNoteNames() {
  return fundamentalSpelling === "flat" ? noteNamesFlat : noteNamesSharp;
}

function midiToFundamentalNoteName(midi) {
  const names = getFundamentalNoteNames();
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function getFundamentalSpellingFromPitchClass(pitchClass) {
  if (typeof pitchClass !== "string") {
    return fundamentalSpelling;
  }
  if (pitchClass.includes("b")) {
    return "flat";
  }
  if (pitchClass.includes("#") || pitchClass.includes("x")) {
    return "sharp";
  }
  return fundamentalSpelling;
}

function getEnharmonicOptions(midi) {
  const pc = mod(midi, 12);
  const sharp = noteNamesSharp[pc];
  const flat = noteNamesFlat[pc];
  if (sharp === flat) {
    return null;
  }
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
  Array.from(fundamentalNoteSelect.options).forEach((option) => {
    const midi = Number(option.value);
    if (option.value === FUNDAMENTAL_CUSTOM_VALUE) {
      option.textContent = "Specify in Hz";
      return;
    }
    const freq = midiToFrequency(midi, a4);
    option.textContent = `${midiToFundamentalNoteName(midi)} (${formatHzReadout(freq)})`;
  });
  fundamentalNoteSelect.value =
    selectedValue === FUNDAMENTAL_CUSTOM_VALUE ? FUNDAMENTAL_CUSTOM_VALUE : String(selectedValue);
}

function syncFundamentalNoteSelect() {
  const freq = Number(fundamentalInput.value);
  if (!Number.isFinite(freq) || freq <= 0) {
    return;
  }
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
  if (!fundamentalInput) {
    return;
  }
  const current = Number(fundamentalInput.value);
  if (!Number.isFinite(current) || current <= 0) {
    return;
  }
  const min = Number(fundamentalInput.min) || 0;
  const max = Number(fundamentalInput.max) || Infinity;
  const next = Math.min(max, Math.max(min, current * factor));
  fundamentalInput.value = String(next);
  syncFundamentalNoteSelect();
  updateNodeFrequencies();
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
  const waveforms = [...BUILTIN_WAVEFORMS];
  const semisineIndex = extras.indexOf("semisine");
  if (semisineIndex >= 0) {
    extras.splice(semisineIndex, 1);
    const sineIndex = waveforms.indexOf("sine");
    const insertAt = sineIndex >= 0 ? sineIndex + 1 : 0;
    waveforms.splice(insertAt, 0, "semisine");
  }
  waveforms.push(...extras);
  waveforms.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    waveformSelect.appendChild(option);
  });
  waveformSelect.value = waveforms.includes(selected) ? selected : "sine";
}

function populateSoundfontPresets() {
  if (!soundfontPresetSelect) {
    return;
  }
  soundfontPresetSelect.innerHTML = "";
  soundfontPresetList = [];
  if (soundfontData && Array.isArray(soundfontData.presets)) {
    soundfontData.presets.forEach((preset) => {
      const name = preset.header && preset.header.name ? preset.header.name : "";
      if (name === "FINALE" || name === "ENSEMBLE 2") {
        return;
      }
      soundfontPresetList.push(preset);
    });
    soundfontPresetList.forEach((preset, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      const name = preset.header && preset.header.name ? preset.header.name : `Preset ${index + 1}`;
      option.textContent = name;
      soundfontPresetSelect.appendChild(option);
    });
    soundfontPresetIndex = Math.min(
      Math.max(0, soundfontPresetIndex),
      Math.max(0, soundfontPresetList.length - 1)
    );
    soundfontPresetSelect.value = String(soundfontPresetIndex);
    soundfontPreset = soundfontPresetList[soundfontPresetIndex] || soundfontPresetList[0] || null;
  }
}

function syncSynthModeUI() {
  if (waveformSelectGroup) {
    waveformSelectGroup.hidden = synthMode !== "waveform";
    waveformSelectGroup.style.display = synthMode === "waveform" ? "" : "none";
  }
  if (soundfontSelectGroup) {
    soundfontSelectGroup.hidden = synthMode !== "soundfont";
    soundfontSelectGroup.style.display = synthMode === "soundfont" ? "" : "none";
  }
  if (physicalSelectGroup) {
    physicalSelectGroup.hidden = synthMode !== "physical";
    physicalSelectGroup.style.display = synthMode === "physical" ? "" : "none";
  }
  if (synthModeInputs.length) {
    synthModeInputs.forEach((input) => {
      input.checked = input.value === synthMode;
    });
  }
}

function getCurrentWaveformType() {
  if (synthMode === "soundfont") {
    return SOUNDFONT_WAVEFORM;
  }
  if (synthMode === "physical") {
    return physicalModelSelect ? physicalModelSelect.value || KARPLUS_WAVEFORM : KARPLUS_WAVEFORM;
  }
  return waveformSelect ? waveformSelect.value || "sine" : "sine";
}

function syncOneShotForWaveform(type) {
  if (!oneShotCheckbox) {
    return;
  }
  if (type === KARPLUS_WAVEFORM) {
    if (oneShotPrevValue == null) {
      oneShotPrevValue = oneShotCheckbox.checked;
    }
    setControlChecked(oneShotCheckbox, true);
    oneShotCheckbox.disabled = true;
  } else {
    oneShotCheckbox.disabled = false;
    if (oneShotPrevValue != null) {
      setControlChecked(oneShotCheckbox, oneShotPrevValue);
      oneShotPrevValue = null;
    }
  }
  updatePatternLengthAvailability();
}

function handleSynthTypeChange(options = {}) {
  const replaceActiveVoices = options.replaceActiveVoices !== false;
  const nextType = getCurrentWaveformType();
  syncOneShotForWaveform(nextType);
  if (nextType === SOUNDFONT_WAVEFORM) {
    ensureSoundfontLoaded();
  }
  if (nextType === KARPLUS_WAVEFORM) {
    ensureKarplusWorklet();
  }
  if (nextType === RESONANT_WAVEFORM) {
    ensureResonatorWorklet();
  }
  if (currentSynthWaveform === nextType) {
    schedulePresetUrlUpdate();
    return;
  }
  currentSynthWaveform = nextType;
  if (replaceActiveVoices) {
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
  }
  schedulePresetUrlUpdate();
}

function onFundamentalNoteChange() {
  if (fundamentalNoteSelect.value === FUNDAMENTAL_CUSTOM_VALUE) {
    return;
  }
  const midi = Number(fundamentalNoteSelect.value);
  const a4 = Number(a4Input.value) || 440;
  const freq = midiToFrequency(midi, a4);
  fundamentalInput.value = String(freq);
  updateNodeFrequencies();
  if (spellingMode === "true") {
    showFundamentalSpellingDialog(midi);
  } else {
    hideFundamentalSpellingDialog();
  }
}

function projectPoint(point, disableScale = false) {
  if (!is3DMode && !isFlattened2D) {
    return { x: point.x, y: point.y, depth: 0, scale: 1, scaleRaw: 1, denom: 1, visible: true };
  }
  const cosY = Math.cos(view.rotY);
  const sinY = Math.sin(view.rotY);
  const cosX = Math.cos(view.rotX);
  const sinX = Math.sin(view.rotX);

  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;
  const y1 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  const adjustedZ = z2 + cameraDistance;
  const denom = disableScale ? 1 : 1 + adjustedZ * 0.002;
  const scaleRaw = disableScale ? 1 : 1 / denom;
  const scale = disableScale ? 1 : Math.max(0.15, scaleRaw);
  const visible = disableScale ? true : denom > 0.02;
  return { x: x1 * scale, y: y1 * scale, depth: z2, scale, scaleRaw, denom, visible };
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

  const adjustedZ = z2 + cameraDistance;
  const denom = disableScale ? 1 : 1 + adjustedZ * 0.002;
  const scaleRaw = disableScale ? 1 : 1 / denom;
  const scale = disableScale ? 1 : Math.max(0.15, scaleRaw);
  const visible = disableScale ? true : denom > 0.02;
  return { x: x1 * scale, y: y1 * scale, depth: z2, scale, scaleRaw, denom, visible };
}

function worldToScreen(point, disableScale = false) {
  const projected = projectPoint(point, disableScale);
  const tiltedX = projected.x * tiltCos - projected.y * tiltSin;
  const tiltedY = projected.x * tiltSin + projected.y * tiltCos;
  return {
    x: (tiltedX + view.offsetX) * view.zoom + canvas.clientWidth / 2,
    y: (tiltedY + view.offsetY) * view.zoom + canvas.clientHeight / 2,
    depth: projected.depth,
    scale: projected.scale,
    scaleRaw: projected.scaleRaw,
    denom: projected.denom,
    visible: projected.visible,
  };
}

function screenToWorld(point) {
  const projectedX = (point.x - canvas.clientWidth / 2) / view.zoom - view.offsetX;
  const projectedY = (point.y - canvas.clientHeight / 2) / view.zoom - view.offsetY;
  const untiltedX = projectedX * tiltCos + projectedY * tiltSin;
  const untiltedY = -projectedX * tiltSin + projectedY * tiltCos;
  return {
    x: untiltedX,
    y: untiltedY,
  };
}

function shouldDisableLayoutScale() {
  return false;
}

function getLayoutNodeScreenScale(pos) {
  return layoutUnifyNodeSize ? 1 : pos.scale || 1;
}

function getLayoutNodeRadius(pos) {
  return layoutNodeSize * getLayoutNodeScreenScale(pos);
}

function syncLayoutPerspectiveTextToggleState() {
  if (layoutUnifyNodeSize) {
    layoutPerspectiveTextSize = false;
  }
  setControlChecked(layoutPerspectiveTextSizeToggle, layoutPerspectiveTextSize);
  setControlDisabled(layoutPerspectiveTextSizeToggle, layoutUnifyNodeSize);
}

function getLayoutInnerTextScale(radius) {
  if (!layoutMode || !layoutPerspectiveTextSize) {
    return 1;
  }
  const baseRadius = Math.max(1, Number(layoutNodeSize) || 1);
  const ratio = radius / baseRadius;
  return Math.min(1.8, Math.max(0.65, ratio));
}

function worldToCamera(point, disableScale = false) {
  const safePoint = {
    x: Number.isFinite(point.x) ? point.x : 0,
    y: Number.isFinite(point.y) ? point.y : 0,
    z: Number.isFinite(point.z) ? point.z : 0,
  };
  const cosY = Math.cos(view.rotY);
  const sinY = Math.sin(view.rotY);
  const cosX = Math.cos(view.rotX);
  const sinX = Math.sin(view.rotX);
  const x1 = safePoint.x * cosY + safePoint.z * sinY;
  const z1 = -safePoint.x * sinY + safePoint.z * cosY;
  const y1 = safePoint.y * cosX - z1 * sinX;
  const z2 = safePoint.y * sinX + z1 * cosX;
  const adjustedZ = z2 + cameraDistance;
  const denom = disableScale ? 1 : 1 + adjustedZ * 0.002;
  const scaleRaw = disableScale ? 1 : 1 / denom;
  const scale = disableScale ? 1 : Math.max(0.15, scaleRaw);
  return { x1, y1, z2, scale };
}

function cameraToWorld(camera) {
  const cosX = Math.cos(view.rotX);
  const sinX = Math.sin(view.rotX);
  const cosY = Math.cos(view.rotY);
  const sinY = Math.sin(view.rotY);
  const y = camera.y1 * cosX + camera.z2 * sinX;
  const z1 = -camera.y1 * sinX + camera.z2 * cosX;
  const x = camera.x1 * cosY - z1 * sinY;
  const z = camera.x1 * sinY + z1 * cosY;
  return { x, y, z };
}

function screenDeltaToWorldDelta(delta, baseCoord, disableScale = false) {
  const safeBase = {
    x: Number.isFinite(baseCoord.x) ? baseCoord.x : 0,
    y: Number.isFinite(baseCoord.y) ? baseCoord.y : 0,
    z: Number.isFinite(baseCoord.z) ? baseCoord.z : 0,
  };
  const camera = worldToCamera(safeBase, disableScale);
  const scale = camera.scale || 1;
  const untiltedDeltaX = delta.x * tiltCos + delta.y * tiltSin;
  const untiltedDeltaY = -delta.x * tiltSin + delta.y * tiltCos;
  const dx1 = untiltedDeltaX / (view.zoom * scale);
  const dy1 = untiltedDeltaY / (view.zoom * scale);
  const nextCamera = {
    x1: camera.x1 + dx1,
    y1: camera.y1 + dy1,
    z2: camera.z2,
  };
  const nextWorld = cameraToWorld(nextCamera);
  return {
    x: nextWorld.x - safeBase.x,
    y: nextWorld.y - safeBase.y,
    z: nextWorld.z - safeBase.z,
  };
}

function ensureLayoutPosition(node) {
  if (!layoutMode) {
    return node.coordinate;
  }
  const existing = layoutPositions.get(node.id);
  if (existing) {
    return existing;
  }
  const base = getLayoutBaseCoordinate(node);
  const offset = layoutPositionOffsets.get(
    `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`
  );
  const next = offset
    ? { x: base.x + offset.x, y: base.y + offset.y, z: base.z + offset.z }
    : base;
  layoutPositions.set(node.id, next);
  return next;
}

function getNodeDisplayCoordinate(node) {
  return layoutMode ? ensureLayoutPosition(node) : node.coordinate;
}

function getLayoutBaseCoordinate(node, spacing = layoutSpacing) {
  if (node.isCustom) {
    return {
      x: node.coordinate.x,
      y: node.coordinate.y,
      z: Number.isFinite(node.coordinate.z) ? node.coordinate.z : 0,
    };
  }
  return {
    x: node.coordinate.x * spacing.x,
    y: node.coordinate.y * spacing.y,
    z: (Number.isFinite(node.coordinate.z) ? node.coordinate.z : 0) * spacing.z,
  };
}

function getLayoutPageDimensions() {
  const size =
    LAYOUT_PAGE_SIZES[layoutPageSize] || LAYOUT_PAGE_SIZES.letter;
  const portraitWidth = size.widthIn;
  const portraitHeight = size.heightIn;
  const isLandscape = layoutOrientation === "landscape";
  const widthIn = isLandscape ? portraitHeight : portraitWidth;
  const heightIn = isLandscape ? portraitWidth : portraitHeight;
  return {
    widthIn,
    heightIn,
    widthPx: widthIn * LAYOUT_PX_PER_IN,
    heightPx: heightIn * LAYOUT_PX_PER_IN,
  };
}

function getLayoutPageRect() {
  const { widthPx, heightPx } = getLayoutPageDimensions();
  const left = (canvas.clientWidth - widthPx) / 2;
  const top = (canvas.clientHeight - heightPx) / 2;
  return { left, top, width: widthPx, height: heightPx };
}

function getDefaultLayoutNodeShape(node) {
  return node && node.isCustom ? "diamond" : layoutNodeShape;
}

function getLayoutNodeShape(node) {
  return layoutNodeShapes.get(node.id) || getDefaultLayoutNodeShape(node);
}

function getNodeNoteLabel(node) {
  const info = getCachedDisplayInfo(node);
  const noteText = featureMode === "ratio" ? info.pitchClass : info.name;
  const wrap = enharmonicsEnabled;
  const requireHejiDetail = featureMode === "ratio";
  const centsText = getCachedCentsReadout(
    node,
    {
      wrap,
      requireHejiDetail,
      baseTextForHeji: info.pitchClass,
    },
    info
  );
  if (!centsText) {
    return noteText;
  }
  const hasAccidental = /[#b]/.test(noteText);
  const hasParen = centsText.startsWith("(");
  const separator = !hasAccidental && !hasParen ? "" : " ";
  return `${noteText}${separator}${centsText}`;
}

function getNodePitchLabel(node) {
  return getCachedDisplayInfo(node).pitchClass;
}

function getNoteNamesForNode(node) {
  return noteNamesSharp;
}

function formatCents(value) {
  const precision = Math.min(2, Math.max(0, Number(centsPrecision) || 0));
  const numeric = Number.isFinite(value) ? value : 0;
  const factor = Math.pow(10, precision);
  let rounded = Math.round(numeric * factor) / factor;
  if (Object.is(rounded, -0)) {
    rounded = 0;
  }
  const text =
    precision > 0 && Number.isInteger(rounded)
      ? String(rounded)
      : precision > 0
      ? rounded.toFixed(precision)
      : String(Math.round(rounded));
  const sign = rounded >= 0 ? "+" : "";
  const centsSuffix = showCentsSign ? CENTS_CHAR : "";
  return `${sign}${text}${centsSuffix}`;
}

function formatHzNumber(value) {
  const precision = Math.min(2, Math.max(0, Number(hzPrecision) || 0));
  if (!Number.isFinite(value)) {
    return "";
  }
  const factor = Math.pow(10, precision);
  let rounded = Math.round(value * factor) / factor;
  if (Object.is(rounded, -0)) {
    rounded = 0;
  }
  if (precision > 0 && Number.isInteger(rounded)) {
    return String(rounded);
  }
  return precision > 0 ? rounded.toFixed(precision) : String(Math.round(rounded));
}

function formatHzReadout(value) {
  const text = formatHzNumber(value);
  return text ? `${text} Hz` : "";
}

function getRatioCents(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  const ratio = numerator / denominator;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return null;
  }
  const precision = Math.min(2, Math.max(0, Number(centsPrecision) || 0));
  const factor = Math.pow(10, precision);
  let rounded = Math.round(1200 * Math.log2(ratio) * factor) / factor;
  if (Object.is(rounded, -0)) {
    rounded = 0;
  }
  return rounded;
}

function measureTextWidth(text, size, font, context = ctx) {
  return measureTextWidthWithWeight(text, size, font, 400, context);
}

function measureTextWidthWithWeight(text, size, font, fontWeight = 400, context = ctx) {
  const canCache = context === ctx;
  const cacheKey = canCache ? `${font}|${fontWeight}|${size}|${text}` : "";
  if (canCache && textWidthCache.has(cacheKey)) {
    return textWidthCache.get(cacheKey);
  }
  context.save();
  context.font = `${fontWeight} ${size}px ${font}`;
  const width = context.measureText(text).width;
  context.restore();
  if (canCache) {
    textWidthCache.set(cacheKey, width);
  }
  return width;
}

function getCentsCharSize(size) {
  return Math.max(6, size - CENTS_SIZE_DELTA);
}

function measureCharWidth(char, size, font, fontWeight = 400, context = ctx) {
  return measureTextWidthWithWeight(char, size, font, fontWeight, context);
}

function drawTextWithSmallCent({
  text,
  x,
  y,
  font,
  size,
  fontWeight = 400,
  align = "left",
  baseline = "top",
  hejiAccidentals = false,
  hejiYOffset = 0,
  context = ctx,
  color = themeColors.textSecondary,
}) {
  const chars = Array.from(text || "");
  if (!chars.length) {
    return;
  }
  const widths = chars.map((char) => {
    const isCent = char === CENTS_CHAR;
    const isHeji = hejiAccidentals && (char === "v" || char === "e" || char === "V");
    const charSize = isCent ? getCentsCharSize(size) : size;
    const charFont = isHeji ? "HEJI2Text" : font;
    const charWeight = isHeji ? 400 : fontWeight;
    return measureCharWidth(char, charSize, charFont, charWeight, context);
  });
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }
  context.save();
  context.fillStyle = color;
  context.textAlign = "left";
  context.textBaseline = baseline;
  let cursorX = startX;
  chars.forEach((char, index) => {
    const isCent = char === CENTS_CHAR;
    const isHeji = hejiAccidentals && (char === "v" || char === "e" || char === "V");
    const charSize = isCent ? getCentsCharSize(size) : size;
    const charFont = isHeji ? "HEJI2Text" : font;
    const charWeight = isHeji ? 400 : fontWeight;
    context.font = `${charWeight} ${charSize}px ${charFont}`;
    context.fillText(char, cursorX, y + (isHeji ? hejiYOffset : 0));
    cursorX += widths[index];
  });
  context.restore();
}

async function buildSvgTextWithSmallCent({
  text,
  x,
  y,
  font,
  size,
  fontWeight = 400,
  align = "left",
  baseline = "text-before-edge",
  hejiAccidentals = false,
  hejiYOffset = 0,
  color,
}) {
  const chars = Array.from(text || "");
  if (!chars.length) {
    return "";
  }
  const widths = await Promise.all(chars.map(async (char) => {
    const isCent = char === CENTS_CHAR;
    const isHeji = hejiAccidentals && (char === "v" || char === "e" || char === "V");
    const charSize = isCent ? getCentsCharSize(size) : size;
    const charFont = isHeji ? "HEJI2Text" : font;
    const charWeight = isHeji ? 400 : fontWeight;
    return measureSvgCharWidth(char, charSize, charFont, charWeight);
  }));
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }
  let cursorX = startX;
  const nodes = [];
  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const isCent = char === CENTS_CHAR;
    const isHeji = hejiAccidentals && (char === "v" || char === "e" || char === "V");
    const charSize = isCent ? getCentsCharSize(size) : size;
    const charFont = isHeji ? "HEJI2Text" : font;
    const charWeight = isHeji ? 400 : fontWeight;
    const charY = y + (isHeji ? hejiYOffset : 0);
    nodes.push(
      await buildSvgTextElement({
        text: char,
        x: cursorX,
        y: charY,
        font: charFont,
        size: charSize,
        fontWeight: charWeight,
        anchor: "start",
        baseline,
        color,
      })
    );
    cursorX += widths[index];
  }
  return nodes.join("\n");
}

const STACKED_ASCENT_RATIO = 0.82;
const STACKED_DESCENT_RATIO = 0.18;

function computeRatioLabelLayout(
  numerator,
  denominator,
  font,
  baseSize,
  maxWidth,
  fontWeight = 400,
  maxHeight = null
) {
  const singleLine = `${numerator}:${denominator}`;
  let size = baseSize;
  let lines = [singleLine];
  let lineGap = 0;
  let width = measureTextWidthWithWeight(singleLine, size, font, fontWeight);
  if (width <= maxWidth) {
    return { lines, size, lineGap };
  }
  lines = [String(numerator), String(denominator)];
  lineGap = Math.round(size * 0.15);
  const minSize = Math.max(10, Math.round(baseSize * 0.6));
  const measureTwoLineHeight = () => {
    if (!maxHeight) {
      return 0;
    }
    return size * (STACKED_ASCENT_RATIO + STACKED_DESCENT_RATIO) * 2 + lineGap;
  };
  const measureTwoLine = () =>
    Math.max(
      measureTextWidthWithWeight(lines[0], size, font, fontWeight),
      measureTextWidthWithWeight(lines[1], size, font, fontWeight)
    );
  width = measureTwoLine();
  let height = maxHeight ? measureTwoLineHeight() : 0;
  while ((width > maxWidth || (maxHeight && height > maxHeight)) && size > minSize) {
    size -= 1;
    lineGap = Math.round(size * 0.15);
    width = measureTwoLine();
    height = maxHeight ? measureTwoLineHeight() : 0;
  }
  return { lines, size, lineGap };
}

function getFontMetrics(text, size, font, fontWeight = 400) {
  ctx.save();
  ctx.font = `${fontWeight} ${size}px ${font}`;
  const metrics = ctx.measureText(text);
  ctx.restore();
  const ascent = Number.isFinite(metrics.fontBoundingBoxAscent)
    ? metrics.fontBoundingBoxAscent
    : Number.isFinite(metrics.actualBoundingBoxAscent)
    ? metrics.actualBoundingBoxAscent
    : size * 0.8;
  const descent = Number.isFinite(metrics.fontBoundingBoxDescent)
    ? metrics.fontBoundingBoxDescent
    : Number.isFinite(metrics.actualBoundingBoxDescent)
    ? metrics.actualBoundingBoxDescent
    : size * 0.2;
  return {
    width: metrics.width,
    ascent,
    descent,
  };
}

function computeStackedRatioPositions(lines, font, size, fontWeight, centerY, lineGap) {
  const topMetrics = getFontMetrics(lines[0], size, font, fontWeight);
  const bottomMetrics = getFontMetrics(lines[1], size, font, fontWeight);
  const totalHeight =
    topMetrics.ascent +
    topMetrics.descent +
    lineGap +
    bottomMetrics.ascent +
    bottomMetrics.descent;
  const topY = centerY - totalHeight / 2;
  const topBaseline = topY + topMetrics.ascent;
  const bottomBaseline =
    topY + topMetrics.ascent + topMetrics.descent + lineGap + bottomMetrics.ascent;
  const lineY =
    (topBaseline + topMetrics.descent + bottomBaseline - bottomMetrics.ascent) / 2;
  const lineWidth = Math.max(topMetrics.width, bottomMetrics.width);
  return { topBaseline, bottomBaseline, lineY, lineWidth };
}

function computeStackedRatioPositionsFromLine(
  lines,
  font,
  size,
  fontWeight,
  lineY,
  lineGap
) {
  const topMetrics = getFontMetrics(lines[0], size, font, fontWeight);
  const bottomMetrics = getFontMetrics(lines[1], size, font, fontWeight);
  const topBaseline = lineY - lineGap / 2 - size * STACKED_DESCENT_RATIO;
  const bottomBaseline = lineY + lineGap / 2 + size * STACKED_ASCENT_RATIO;
  const lineWidth = Math.max(topMetrics.width, bottomMetrics.width);
  return { topBaseline, bottomBaseline, lineY, lineWidth };
}

function getLabelCacheKey() {
  return [
    featureMode,
    hejiEnabled ? "heji" : "no-heji",
    enharmonicsEnabled ? "enharmonics" : "no-enharmonics",
    spellingMode,
    centsPrecision,
    hzPrecision,
    showCentsSign ? "cents" : "no-cents",
    showHz ? "hz" : "no-hz",
    showRatioCents ? "ratio-cents" : "no-ratio-cents",
    fundamentalSpelling,
  ].join("|");
}

function invalidateLabelCache({ clearTextWidths = false } = {}) {
  labelCache.clear();
  labelCacheKey = "";
  if (clearTextWidths) {
    textWidthCache.clear();
  }
}

function bumpLabelDataVersion() {
  labelCacheDataVersion += 1;
  labelCache.clear();
}

function getNodeOctaveShift(node) {
  const shift = Number(node && node.octaveShift);
  return Number.isFinite(shift) ? shift : 0;
}

function clampNodeVolume(value) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(1, Math.max(0, value));
}

function getNodeVolumeKey(node) {
  if (!node) {
    return null;
  }
  if (node.isCustom) {
    const source = Array.isArray(node.sourceExponents) ? node.sourceExponents : null;
    if (!source || source.length < 2 || node.customSlot == null) {
      return null;
    }
    const [x, y, z = 0] = source;
    return `custom:${x},${y},${z}|${node.customSlot}`;
  }
  return `grid:${getOctaveOffsetKey(node)}`;
}

function getNodeVolumeLimit(node) {
  if (!node) {
    return 1;
  }
  if (node.isCustom) {
    return clampNodeVolume(node.volumeMax);
  }
  const key = getOctaveOffsetKey(node);
  return clampNodeVolume(nodeVolumeLimits.get(key));
}

function setNodeVolumeLimit(node, value) {
  if (!node) {
    return;
  }
  const normalized = clampNodeVolume(value);
  if (node.isCustom) {
    node.volumeMax = normalized;
    return;
  }
  const key = getOctaveOffsetKey(node);
  if (Math.abs(normalized - 1) < 1e-6) {
    nodeVolumeLimits.delete(key);
  } else {
    nodeVolumeLimits.set(key, normalized);
  }
  node.volumeMax = normalized;
}

function applyNodeVolumeLimits() {
  nodes.forEach((node) => {
    node.volumeMax = getNodeVolumeLimit(node);
  });
}

function applyNodeVolumeLimitToActiveVoices(node) {
  if (!node || !audioCtx) {
    return;
  }
  const max = getNodeVolumeLimit(node);
  voices.forEach((voice) => {
    if (!voice || voice.nodeId !== node.id) {
      return;
    }
    const oldPeak = Math.max(0.0001, Number(voice.peakGain) || 0.0001);
    const velocity = Math.max(0, Math.min(1, Number(voice.velocity ?? 1)));
    const newPeak = Math.max(0.0001, 0.2 * velocity * max);
    const scale = newPeak / oldPeak;
    voice.peakGain = newPeak;
    if (Number.isFinite(voice.releaseStartLevel)) {
      voice.releaseStartLevel *= scale;
    }
    if (voice.envGain && voice.envGain.gain) {
      const now = audioCtx.currentTime;
      const current = Math.max(0.0001, (voice.envGain.gain.value || 0.0001) * scale);
      voice.envGain.gain.cancelScheduledValues(now);
      voice.envGain.gain.setTargetAtTime(current, now, 0.01);
    }
  });
}

function setNodeVolumeAdjustMode(enabled) {
  const next = Boolean(enabled);
  if (nodeVolumeAdjustMode === next) {
    return;
  }
  nodeVolumeAdjustMode = next;
  if (!next) {
    nodeVolumeSliderDrag = null;
    nodeVolumeSliderHitboxes = [];
  }
  draw();
}

function getNodeVolumeModeAlpha(nowMs = performance.now()) {
  return nodeVolumeAdjustMode ? 1 : 0;
}

function hitTestNodeVolumeSlider(screenPoint) {
  if (!nodeVolumeAdjustMode || !screenPoint) {
    return null;
  }
  for (let i = nodeVolumeSliderHitboxes.length - 1; i >= 0; i -= 1) {
    const box = nodeVolumeSliderHitboxes[i];
    if (
      screenPoint.x >= box.left &&
      screenPoint.x <= box.left + box.width &&
      screenPoint.y >= box.top &&
      screenPoint.y <= box.top + box.height
    ) {
      return box;
    }
  }
  return null;
}

function updateNodeVolumeFromSlider(screenPoint, sliderEntry) {
  if (!screenPoint || !sliderEntry) {
    return false;
  }
  const node = nodeById.get(sliderEntry.nodeId);
  if (!node || !node.active) {
    return false;
  }
  const t = (sliderEntry.bottom - screenPoint.y) / Math.max(1, sliderEntry.height);
  const value = clampNodeVolume(t);
  const prev = getNodeVolumeLimit(node);
  if (Math.abs(value - prev) < 0.001) {
    return false;
  }
  setNodeVolumeLimit(node, value);
  applyNodeVolumeLimitToActiveVoices(node);
  schedulePresetUrlUpdate();
  return true;
}

function formatOctaveShiftLabel(shift) {
  if (!Number.isFinite(shift) || shift === 0) {
    return "";
  }
  const factor = Math.pow(2, Math.abs(shift));
  return shift > 0 ? `x${factor}` : `÷${factor}`;
}

function formatRatioCentsLabel(node) {
  if (!node) {
    return "";
  }
  const numerator = Number(node.numerator);
  const denominator = Number(node.denominator);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return "";
  }
  let ratio = numerator / denominator;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return "";
  }
  const shift = getNodeOctaveShift(node);
  if (Number.isFinite(shift) && shift !== 0) {
    ratio *= Math.pow(2, shift);
  }
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return "";
  }
  const cents = 1200 * Math.log2(ratio);
  if (!Number.isFinite(cents)) {
    return "";
  }
  const precision = Math.min(2, Math.max(0, Number(centsPrecision) || 0));
  const factor = Math.pow(10, precision);
  let rounded = Math.round(cents * factor) / factor;
  if (Object.is(rounded, -0)) {
    rounded = 0;
  }
  if (precision > 0 && Number.isInteger(rounded)) {
    return String(rounded);
  }
  return precision > 0 ? rounded.toFixed(precision) : String(Math.round(rounded));
}

function enforceCentsDisplayMode() {
  if (showRatioCents && showCentsDeviation) {
    showCentsDeviation = false;
  }
  if (showCentsDeviation) {
    showRatioCents = false;
  }
  const centsDeviationEnabled = Boolean(showCentsDeviation);
  if (!centsDeviationEnabled) {
    enharmonicsEnabled = false;
  } else {
    enharmonicsEnabled = Boolean(enharmonicsEnabledPreference);
  }
  setControlChecked(showCentsDeviationToggle, showCentsDeviation);
  setControlChecked(layoutShowCentsDeviationToggle, showCentsDeviation);
  setControlChecked(showRatioCentsToggle, showRatioCents);
  setControlChecked(layoutShowRatioCentsToggle, showRatioCents);
  setControlChecked(enharmonicsEnabledToggle, enharmonicsEnabled);
  setControlChecked(layoutEnharmonicsEnabledToggle, enharmonicsEnabled);
  setControlDisabled(enharmonicsEnabledToggle, !centsDeviationEnabled);
  setControlDisabled(layoutEnharmonicsEnabledToggle, !centsDeviationEnabled);
  if (enharmonicsGroup) {
    enharmonicsGroup.classList.toggle("is-disabled", !centsDeviationEnabled);
  }
  if (layoutEnharmonicsGroup) {
    layoutEnharmonicsGroup.classList.toggle("is-disabled", !centsDeviationEnabled);
  }
}

function getOctaveOffsetKey(node) {
  const z = node.exponentZ || 0;
  return `${node.exponentX},${node.exponentY},${z}`;
}

function parseExponentKey(key) {
  if (typeof key !== "string") {
    return null;
  }
  const parts = key.split(",");
  if (parts.length < 2) {
    return null;
  }
  const x = Number(parts[0]);
  const y = Number(parts[1]);
  const z = Number(parts.length > 2 ? parts[2] : 0);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null;
  }
  return { x, y, z };
}

function shiftExponentKey(key, deltaX, deltaY, deltaZ) {
  const parsed = parseExponentKey(key);
  if (!parsed) {
    return null;
  }
  return `${parsed.x - deltaX},${parsed.y - deltaY},${parsed.z - deltaZ}`;
}

function shiftExponentMap(map, deltaX, deltaY, deltaZ) {
  if (!map || !map.size) {
    return map;
  }
  const next = new Map();
  map.forEach((value, key) => {
    const nextKey = shiftExponentKey(key, deltaX, deltaY, deltaZ);
    if (nextKey) {
      next.set(nextKey, value);
    }
  });
  return next;
}

function shiftLineLabelOverrides(deltaX, deltaY, deltaZ) {
  if (!lineLabelOverrides.size && !lineLabelPositionOverrides.size) {
    return;
  }
  const remapKey = (key) => {
    if (typeof key !== "string") {
      return null;
    }
    const [aKey, bKey] = key.split("|");
    if (!aKey || !bKey) {
      return null;
    }
    const nextA = shiftExponentKey(aKey, deltaX, deltaY, deltaZ);
    const nextB = shiftExponentKey(bKey, deltaX, deltaY, deltaZ);
    if (!nextA || !nextB) {
      return null;
    }
    return nextA < nextB ? `${nextA}|${nextB}` : `${nextB}|${nextA}`;
  };
  const nextVisibility = new Map();
  lineLabelOverrides.forEach((value, key) => {
    const nextKey = remapKey(key);
    if (!nextKey) {
      return;
    }
    nextVisibility.set(nextKey, value);
  });
  const nextPositions = new Map();
  lineLabelPositionOverrides.forEach((value, key) => {
    const nextKey = remapKey(key);
    if (!nextKey || !Number.isFinite(value)) {
      return;
    }
    nextPositions.set(nextKey, value);
  });
  lineLabelOverrides = nextVisibility;
  lineLabelPositionOverrides = nextPositions;
}

function applyNodeOctaveOffsets() {
  nodes.forEach((node) => {
    if (node.isCustom) {
      if (!Number.isFinite(node.octaveShift)) {
        node.octaveShift = 0;
      }
      return;
    }
    const key = getOctaveOffsetKey(node);
    const shift = nodeOctaveOffsets.get(key);
    node.octaveShift = Number.isFinite(shift) ? shift : 0;
  });
}

function getNodeLabelCacheEntry(node) {
  const key = getLabelCacheKey();
  let entry = labelCache.get(node.id);
  if (!entry || entry.key !== key || entry.version !== labelCacheDataVersion) {
    entry = {
      key,
      version: labelCacheDataVersion,
      displayInfo: null,
      cents: new Map(),
      annotations: new Map(),
    };
    labelCache.set(node.id, entry);
  }
  return entry;
}

function getCachedDisplayInfo(node) {
  const entry = getNodeLabelCacheEntry(node);
  if (!entry.displayInfo) {
    entry.displayInfo = getDisplayNoteInfo(node);
  }
  return entry.displayInfo;
}

function getCentsCacheKey(options) {
  const wrap = options && options.wrap ? "w1" : "w0";
  const detail = options && options.requireHejiDetail ? "d1" : "d0";
  const baseText = options && options.baseTextForHeji ? options.baseTextForHeji : "";
  const show = showCentsDeviation ? "s1" : "s0";
  return `${wrap}|${detail}|${show}|${baseText}`;
}

function getCachedCentsReadout(node, options, displayInfo) {
  const entry = getNodeLabelCacheEntry(node);
  const cacheKey = getCentsCacheKey(options);
  if (entry.cents.has(cacheKey)) {
    return entry.cents.get(cacheKey);
  }
  const text = buildCentsReadout(node, { ...options, displayInfo });
  entry.cents.set(cacheKey, text);
  return text;
}

function getCachedHejiAnnotation(node, baseText) {
  const entry = getNodeLabelCacheEntry(node);
  const cacheKey = String(baseText || "");
  if (entry.annotations.has(cacheKey)) {
    return entry.annotations.get(cacheKey);
  }
  const annotation = getHejiAnnotation(node, baseText);
  entry.annotations.set(cacheKey, annotation);
  return annotation;
}

function getNearestNoteInfo(node) {
  if (!node) {
    return { name: "", pitchClass: "", cents: 0 };
  }
  const a4 = Number(a4Input.value) || 440;
  const freq = Number(node.freq);
  const nearest = getNearestEtInfo(freq, a4);
  const preferredNames = getNoteNamesForNode(node);
  const pitchClass = preferredNames[nearest.midi % 12];
  const name = `${pitchClass}${Math.floor(nearest.midi / 12) - 1}`;
  const cents = Number.isFinite(node.cents_from_et) ? node.cents_from_et : nearest.cents;
  return { ...nearest, pitchClass, name, cents };
}

function buildCentsReadout(
  node,
  {
    wrap = false,
    requireHejiDetail = false,
    baseTextForHeji = "",
    displayInfo = null,
  } = {}
) {
  if (!showCentsDeviation) {
    return "";
  }
  const info = displayInfo || getDisplayNoteInfo(node);
  if (!hejiEnabled && !enharmonicsEnabled) {
    const text = formatCents(info.cents);
    return text;
  }
  let hasHejiRule = false;
  if (requireHejiDetail && baseTextForHeji) {
    const annotation = getHejiAnnotation(node, baseTextForHeji);
    hasHejiRule = annotation.suffixParts.some((part) => part.source === "rule");
  }
  if (requireHejiDetail && !hasHejiRule && !enharmonicsEnabled) {
    return formatCents(info.cents);
  }
  const mapAccidentals = (text) =>
    hejiEnabled ? text.replace(/#/g, "v").replace(/b/g, "e").replace(/x/g, "V") : text;
  const baseText = baseTextForHeji || info.pitchClass || "";
  const sharpCount = (baseText.match(/#/g) || []).length;
  const doubleSharpCount = (baseText.match(/x/g) || []).length;
  const flatCount = (baseText.match(/b/g) || []).length;
  const hasHeavyAccidentals = sharpCount + doubleSharpCount * 2 >= 2 || flatCount >= 2;
  const includePitchClass = Math.abs(info.cents) > 50;
  const shouldAnnotate = enharmonicsEnabled && (includePitchClass || hasHeavyAccidentals);
  if (shouldAnnotate) {
    const nearest = getNearestNoteInfo(node);
    const targetPc = nearest.midi % 12;
    const preferredFallback = getPreferredEnharmonicPitchClass(
      baseText,
      targetPc,
      nearest.pitchClass
    );
    const freq = Number(node && node.freq);
    const a4 = Number(a4Input.value) || 440;
    const fallbackCents = preferredFallback
      ? getCentsForPitchClass(freq, a4, preferredFallback)
      : nearest.cents;
    if (DEBUG_CENTS) {
      console.log("Cents debug", {
        nodeId: node && node.id,
        isCustom: Boolean(node && node.isCustom),
        freq,
        baseText,
        infoPitchClass: info.pitchClass,
        infoCents: info.cents,
        nearestPitchClass: nearest.pitchClass,
        nearestCents: nearest.cents,
        preferredFallback,
        fallbackCents,
      });
    }
    const fallbackBase = `${preferredFallback}${formatCents(fallbackCents)}`;
    if (wrap) {
      const primary = formatCents(info.cents);
      const fallback = includePitchClass ? fallbackBase : preferredFallback;
      const mappedFallback = mapAccidentals(fallback);
      return `${primary} (${mappedFallback})`;
    }
    const primary = `${info.pitchClass}${formatCents(info.cents)}`;
    const fallback = includePitchClass ? fallbackBase : preferredFallback;
    return `${primary} / ${fallback}`;
  }
  const primary = formatCents(info.cents);
  return wrap ? mapAccidentals(primary) : primary;
}

function getHejiBaseAndDefaults(baseText) {
  const base = String(baseText || "");
  const suffixParts = [];
  const sharpCount = (base.match(/#/g) || []).length;
  const flatCount = (base.match(/b/g) || []).length;
  const doubleSharpCount = (base.match(/x/g) || []).length;
  for (let i = 0; i < sharpCount; i += 1) {
    suffixParts.push({ text: "v", expLabel: "", source: "default" });
  }
  for (let i = 0; i < flatCount; i += 1) {
    suffixParts.push({ text: "e", expLabel: "", source: "default" });
  }
  for (let i = 0; i < doubleSharpCount; i += 1) {
    suffixParts.push({ text: "V", expLabel: "", source: "default" });
  }
  return { baseText: base.replace(/[x#b]/g, ""), suffixParts };
}

function getDisplayNoteInfo(node) {
  if (!node) {
    return { name: "", pitchClass: "", cents: 0 };
  }
  if (node.isCustom) {
    const customInfo = getCustomNodeDisplayInfo(node);
    if (customInfo) {
      return customInfo;
    }
  }
  if (
    spellingMode === "true" &&
    !node.isCustom &&
    Number.isFinite(node.numerator) &&
    Number.isFinite(node.denominator) &&
    node.numerator === node.denominator
  ) {
    const a4 = Number(a4Input.value) || 440;
    let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
    if (!Number.isFinite(fundamentalMidi)) {
      const fallback = getNearestEtInfo(Number(fundamentalInput.value) || 220, a4);
      fundamentalMidi = fallback.midi;
    }
    const targetPc = mod(fundamentalMidi, 12);
    const pitchClass = getFundamentalNoteNames()[targetPc];
    const name = `${pitchClass}${Math.floor(fundamentalMidi / 12) - 1}`;
    const cents = getCentsForPitchClass(Number(node.freq), a4, pitchClass);
    return { name, pitchClass, cents };
  }
  const a4 = Number(a4Input.value) || 440;
  const freq = Number(node.freq);
  const nearest = getNearestEtInfo(freq, a4);
  const preferredNames = getNoteNamesForNode(node);
  const nearestPitchClass = preferredNames[nearest.midi % 12];
  const nearestName = `${nearestPitchClass}${Math.floor(nearest.midi / 12) - 1}`;
  const nearestCents = Number.isFinite(node.cents_from_et) ? node.cents_from_et : nearest.cents;
  if (spellingMode === "true") {
    return getTrueSpellingPitchClass(node);
  }
  if (!hejiEnabled) {
    const targetPc = nearest.midi % 12;
    const pitchClass =
      spellingMode === "simple"
        ? getManualSpellingForNode(node, targetPc)
        : nearestPitchClass;
    return {
      name: `${pitchClass}${Math.floor(nearest.midi / 12) - 1}`,
      pitchClass,
      cents: nearestCents,
    };
  }
  let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
  if (!Number.isFinite(fundamentalMidi)) {
    const fallback = getNearestEtInfo(Number(fundamentalInput.value) || 220, a4);
    fundamentalMidi = fallback.midi;
  }
  const basePc = ((fundamentalMidi % 12) + 12) % 12;
  const ratioX = Number(ratioXSelect.value);
  const ratioY = Number(ratioYSelect.value);
  const ratioZ = Number(ratioZSelect.value);
  const axisRatios = [
    { ratio: ratioX, exp: Number(node.exponentX) || 0 },
    { ratio: ratioY, exp: Number(node.exponentY) || 0 },
    { ratio: ratioZ, exp: Number(node.exponentZ) || 0 },
  ];
  const beyondLimit = axisRatios.some((axis) => {
    if (!axis.exp) {
      return false;
    }
    const limit = getTrueSpellingLimit(axis.ratio);
    if (!Number.isFinite(limit)) {
      return false;
    }
    return Math.abs(axis.exp) > limit;
  });
  if (beyondLimit) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const hasUnknownInterval = axisRatios.some(
    (axis) => axis.exp && !TRUE_SPELLING_INTERVALS[axis.ratio]
  );
  if (hasUnknownInterval) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const hasHigherPrime = axisRatios.some(
    (axis) => axis.exp && Number(axis.ratio) >= 53
  );
  if (hasHigherPrime) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  let totalOffset = 0;
  let hasOffsetAxis = false;
  axisRatios.forEach((axis) => {
    if (!axis.exp) {
      return;
    }
    const step = HEJI_STEP_OFFSETS[axis.ratio];
    if (!Number.isFinite(step)) {
      return;
    }
    hasOffsetAxis = true;
    totalOffset += axis.exp * step;
  });
  if (!hasOffsetAxis) {
    const targetPc = nearest.midi % 12;
    const pitchClass =
      spellingMode === "simple"
        ? getManualSpellingForNode(node, targetPc)
        : getFundamentalNoteNames()[mod(targetPc, 12)];
    const name = `${pitchClass}${Math.floor(nearest.midi / 12) - 1}`;
    return { name, pitchClass, cents: nearestCents };
  }
  const rawPc = basePc + totalOffset;
  const targetPc = ((rawPc % 12) + 12) % 12;
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midiBase = Math.round((midiFloat - targetPc) / 12);
  const midi = targetPc + 12 * midiBase;
  const etFreq = a4 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / etFreq);
  const basePitchClass = preferredNames[targetPc];
  const pitchClass =
    spellingMode === "simple"
      ? getManualSpellingForNode(node, targetPc)
      : basePitchClass;
  const name = `${pitchClass}${Math.floor(midi / 12) - 1}`;
  return { name, pitchClass, cents };
}

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
  {
    mode: "repeat",
    ratio: 17,
    axis: "any",
    glyphPos: ":",
    glyphNeg: ";",
  },
  {
    mode: "repeatBase",
    ratio: 7,
    axis: "any",
    glyphPos: "<",
    glyphNeg: ">",
    glyphPosPair: ",",
    glyphNegPair: ".",
    base: 2,
  },
  {
    mode: "repeat",
    ratio: 11,
    axis: "any",
    glyphPos: "4",
    glyphNeg: "5",
  },
  {
    mode: "repeat",
    ratio: 13,
    axis: "any",
    glyphPos: "0",
    glyphNeg: "9",
  },
  {
    mode: "repeat",
    ratio: 19,
    axis: "any",
    glyphPos: "/",
    glyphNeg: "\\",
  },
  {
    mode: "repeat",
    ratio: 23,
    axis: "any",
    glyphPos: "3",
    glyphNeg: "6",
  },
  {
    mode: "repeat",
    ratio: 29,
    axis: "any",
    glyphPos: "2",
    glyphNeg: "7",
  },
  {
    mode: "repeat",
    ratio: 31,
    axis: "any",
    glyphPos: "1",
    glyphNeg: "8",
  },
  {
    mode: "repeat",
    ratio: 37,
    axis: "any",
    glyphPos: "á",
    glyphNeg: "à",
  },
  {
    mode: "repeat",
    ratio: 41,
    axis: "any",
    glyphPos: "+",
    glyphNeg: "-",
  },
  {
    mode: "repeat",
    ratio: 43,
    axis: "any",
    glyphPos: "é",
    glyphNeg: "è",
  },
  {
    mode: "repeat",
    ratio: 47,
    axis: "any",
    glyphPos: "í",
    glyphNeg: "ì",
  },
];

function hasAccidental(noteName) {
  return /[#b]/.test(noteName);
}

function getAccidentalType(noteName) {
  if (/[#x]/.test(noteName)) {
    return "sharp";
  }
  if (/b/.test(noteName)) {
    return "flat";
  }
  return "none";
}

function axisMatches(rule, axisState) {
  if (rule.axis !== "any" && rule.axis !== axisState.axis) {
    return false;
  }
  if (!Number.isFinite(axisState.exponent)) {
    return false;
  }
  if (Number.isFinite(rule.ratio) && axisState.ratio !== rule.ratio) {
    return false;
  }
  if (rule.mode === "repeat" || rule.mode === "repeatBase" || rule.mode === "repeatBaseAccidental") {
    return axisState.exponent !== 0;
  }
  if (rule.exponent === "anyNonZero" && axisState.exponent === 0) {
    return false;
  }
  if (Number.isFinite(rule.exponent) && axisState.exponent !== rule.exponent) {
    return false;
  }
  return true;
}

function getHejiAnnotation(node, baseText) {
  if (!node) {
    return { baseText, suffixParts: [] };
  }
  const accidentalType = getAccidentalType(baseText || "");
  const sharpCount = (baseText.match(/#/g) || []).length;
  const flatCount = (baseText.match(/b/g) || []).length;
  const doubleSharpCount = (baseText.match(/x/g) || []).length;
  let axisStates = [];
  if (node.isCustom && Array.isArray(node.customAxisRatios) && node.customAxisRatios.length) {
    axisStates = node.customAxisRatios.map((axis) => ({
      axis: "any",
      ratio: Number(axis.ratio),
      exponent: Number(axis.exp),
    }));
  } else {
    axisStates = [
      { axis: "x", ratio: Number(ratioXSelect.value), exponent: Number(node.exponentX) },
      { axis: "y", ratio: Number(ratioYSelect.value), exponent: Number(node.exponentY) },
      { axis: "z", ratio: Number(ratioZSelect.value), exponent: Number(node.exponentZ) },
    ];
  }
  let nextBase = String(baseText).replace(/[x#b]/g, "");
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
  if (!hejiEnabled) {
    return { baseText: nextBase, suffixParts };
  }
  HEJI_RULES.forEach((rule) => {
    const expected = rule.accidental ?? "any";
    if (expected !== "any" && expected !== accidentalType) {
      return;
    }
    const matches = axisStates.some((axisState) => axisMatches(rule, axisState));
    if (matches) {
      if (rule.replaceAccidental && (accidentalType === "sharp" || accidentalType === "flat")) {
        const keepSharps = doubleSharpCount > 0 ? sharpCount : 0;
        const keepFlats = flatCount > 2 ? flatCount - 2 : 0;
        let keptSharps = 0;
        let keptFlats = 0;
        for (let index = suffixParts.length - 1; index >= 0; index -= 1) {
          if (suffixParts[index].source === "default") {
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
          if (!axisMatches(rule, axisState)) {
            return;
          }
          const exp = Number(axisState.exponent);
          if (!exp) {
            return;
          }
          const absExp = Math.abs(exp);
          const pairCount = Math.floor(absExp / base);
          const remainder = absExp % base;
          const usePairAsSingle = Boolean(rule.usePairAsSingle);
          const useSingleBeyondPair = Boolean(rule.useSingleBeyondPair);
          const maxSymbols = Number(rule.maxSymbols ?? (usePairAsSingle ? 1 : 2));
          const showExponent = absExp > maxSymbols ? String(absExp) : "";
          if (exp > 0) {
            const pairGlyph = rule.posPair?.[accidentalKey] || "";
            const singleGlyph = rule.posSingle?.[accidentalKey] || "";
            let glyphs = "";
            if (useSingleBeyondPair && absExp > base) {
              glyphs = String(singleGlyph);
            } else if (usePairAsSingle) {
              glyphs = absExp >= base ? String(pairGlyph) : String(singleGlyph);
            } else {
              glyphs = String(pairGlyph).repeat(pairCount);
              if (remainder) {
                glyphs += String(singleGlyph);
              }
            }
            if (glyphs.length > maxSymbols) {
              glyphs = glyphs.slice(0, maxSymbols);
            }
            if (glyphs) {
              suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
            }
          } else {
            const pairGlyph = rule.negPair?.[accidentalKey] || "";
            const singleGlyph = rule.negSingle?.[accidentalKey] || "";
            let glyphs = "";
            if (useSingleBeyondPair && absExp > base) {
              glyphs = String(singleGlyph);
            } else if (usePairAsSingle) {
              glyphs = absExp >= base ? String(pairGlyph) : String(singleGlyph);
            } else {
              glyphs = String(pairGlyph).repeat(pairCount);
              if (remainder) {
                glyphs += String(singleGlyph);
              }
            }
            if (glyphs.length > maxSymbols) {
              glyphs = glyphs.slice(0, maxSymbols);
            }
            if (glyphs) {
              suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
            }
          }
        });
      } else if (rule.mode === "repeatBase") {
        const base = Number(rule.base) || 2;
        axisStates.forEach((axisState) => {
          if (!axisMatches(rule, axisState)) {
            return;
          }
          const exp = Number(axisState.exponent);
          if (exp === 0) {
            return;
          }
          const absExp = Math.abs(exp);
          const pairCount = Math.floor(absExp / base);
          const remainder = absExp % base;
          const maxSymbols = Number(rule.maxSymbols ?? 2);
          const showExponent = absExp > maxSymbols ? String(absExp) : "";
          if (exp > 0) {
            let glyphs = "";
            if (rule.glyphPosPair) {
              glyphs += String(rule.glyphPosPair).repeat(pairCount);
            }
            if (rule.glyphPos && remainder) {
              glyphs += String(rule.glyphPos);
            }
            if (glyphs.length > maxSymbols) {
              glyphs = glyphs.slice(0, maxSymbols);
            }
            if (glyphs) {
              suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
            }
          } else {
            let glyphs = "";
            if (rule.glyphNegPair) {
              glyphs += String(rule.glyphNegPair).repeat(pairCount);
            }
            if (rule.glyphNeg && remainder) {
              glyphs += String(rule.glyphNeg);
            }
            if (glyphs.length > maxSymbols) {
              glyphs = glyphs.slice(0, maxSymbols);
            }
            if (glyphs) {
              suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
            }
          }
        });
      } else if (rule.mode === "repeat") {
        axisStates.forEach((axisState) => {
          if (!axisMatches(rule, axisState)) {
            return;
          }
          const exp = Number(axisState.exponent);
          if (exp > 0) {
            const maxSymbols = Number(rule.maxSymbols ?? 1);
            const glyphs = String(rule.glyphPos || "").repeat(Math.min(exp, maxSymbols));
            const showExponent = exp > maxSymbols ? String(exp) : "";
            if (glyphs) {
              suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
            }
          } else if (exp < 0) {
            const absExp = Math.abs(exp);
            const maxSymbols = Number(rule.maxSymbols ?? 1);
            const glyphs = String(rule.glyphNeg || "").repeat(Math.min(absExp, maxSymbols));
            const showExponent = absExp > maxSymbols ? String(absExp) : "";
            if (glyphs) {
              suffixParts.push({ text: glyphs, expLabel: showExponent, source: "rule" });
            }
          }
        });
      } else {
        if (rule.glyph) {
          suffixParts.push({ text: rule.glyph, expLabel: "", source: "rule" });
        }
      }
    }
  });
  if (suffixParts.length > 1) {
    const ordered = [];
    suffixParts.forEach((part) => {
      if (part.source === "rule") {
        ordered.push(part);
      }
    });
    suffixParts.forEach((part) => {
      if (part.source !== "rule") {
        ordered.push(part);
      }
    });
    return { baseText: nextBase, suffixParts: ordered };
  }
  return { baseText: nextBase, suffixParts };
}

function measureSuffixPartWidth(part, size, charGap, baseWeight) {
  if (!part || !part.text) {
    return 0;
  }
  const sizeScale = Number.isFinite(part.sizeScale) ? part.sizeScale : 1;
  const font = part.font || "HEJI2Text";
  const partCharGap = Number.isFinite(part.charGap) ? part.charGap : charGap;
  const weight = Number.isFinite(part.fontWeight)
    ? part.fontWeight
    : part.font
    ? baseWeight
    : 400;
  const chars = Array.from(part.text);
  return chars.reduce((sum, char, index) => {
    const baseSize = char === CENTS_CHAR ? getCentsCharSize(size) : size;
    const charSize = Math.max(6, Math.round(baseSize * sizeScale));
    const width = measureCharWidth(char, charSize, font, weight);
    return sum + width + (index > 0 ? partCharGap : 0);
  }, 0);
}

function getExponentOffset(size, baseline) {
  if (baseline === "middle") {
    return Math.round(size * 0.3);
  }
  return size + Math.round(size * 0.2);
}

function drawHejiInline({
  x,
  y,
  baseText,
  suffixParts,
  restText,
  size,
  font,
  align = "left",
  baseline = "top",
  hejiYOffset = 0.5,
  restGapScale = HEJI_REST_GAP,
  restHejiAccidentals = false,
  fontWeight = 400,
  color = themeColors.textSecondary,
}) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = baseline;
  ctx.font = `${fontWeight} ${size}px ${font}`;
  const baseWidth = ctx.measureText(baseText).width;
  const suffixSpacing = Math.round(size * 0.08);
  const partGap = Math.round(size * 0.1);
  const baseSuffixGap = Math.round(size * 0.1);
  const restGap = Math.round(size * restGapScale);
  const parts = Array.isArray(suffixParts) ? suffixParts : [];
  const suffixWidth = parts.reduce((sum, part, index) => {
    const partWidth = measureSuffixPartWidth(part, size, suffixSpacing, fontWeight);
    return sum + partWidth + (index > 0 ? partGap : 0);
  }, 0);
  const restWidth = restText ? ctx.measureText(restText).width : 0;
  const totalWidth =
    baseWidth +
    (parts.length ? baseSuffixGap + suffixWidth : 0) +
    (restText ? restGap + restWidth : 0);
  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }
  ctx.fillText(baseText, startX, y);
  let cursorX = startX + baseWidth;
  if (parts.length) {
    cursorX += baseSuffixGap;
    parts.forEach((part, partIndex) => {
      if (partIndex > 0) {
        cursorX += partGap;
      }
      const partCharGap = Number.isFinite(part.charGap) ? part.charGap : suffixSpacing;
      const partWidth = measureSuffixPartWidth(part, size, suffixSpacing, fontWeight);
      const partStartX = cursorX;
      ctx.save();
      const partFont = part.font || "HEJI2Text";
      const partWeight = Number.isFinite(part.fontWeight)
        ? part.fontWeight
        : part.font
        ? fontWeight
        : 400;
      const partYOffset =
        typeof part.yOffset === "number" ? part.yOffset : hejiYOffset;
      const sizeScale = Number.isFinite(part.sizeScale) ? part.sizeScale : 1;
      Array.from(part.text).forEach((char, index) => {
        if (index > 0) {
          cursorX += partCharGap;
        }
        const baseSize = char === CENTS_CHAR ? getCentsCharSize(size) : size;
        const charSize = Math.max(6, Math.round(baseSize * sizeScale));
        ctx.font = `${partWeight} ${charSize}px ${partFont}`;
        ctx.fillText(char, cursorX, y + partYOffset);
        cursorX += measureCharWidth(char, charSize, partFont, partWeight);
      });
      ctx.restore();
      if (part.expLabel) {
        const expSize = Math.max(8, Math.round(size * 0.55));
        const expY =
          y +
          (typeof part.yOffset === "number" ? part.yOffset : hejiYOffset) +
          getExponentOffset(size, baseline);
        ctx.save();
        ctx.font = `${fontWeight} ${expSize}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(part.expLabel, partStartX + partWidth / 2, expY);
        ctx.restore();
      }
    });
  }
  if (restText) {
    cursorX += restGap;
    const chars = Array.from(restText);
    const needsInline =
      restHejiAccidentals || restText.includes(CENTS_CHAR) || /[veV]/.test(restText);
    if (!needsInline) {
      ctx.font = `${fontWeight} ${size}px ${font}`;
      ctx.fillText(restText, cursorX, y);
    } else {
      chars.forEach((char) => {
        const useHeji = char === "v" || char === "e" || char === "V";
        const isCent = char === CENTS_CHAR;
        const charSize = isCent ? getCentsCharSize(size) : size;
        const charFont = useHeji ? "HEJI2Text" : font;
        const charWeight = useHeji ? 400 : fontWeight;
        ctx.font = `${charWeight} ${charSize}px ${charFont}`;
        ctx.fillText(char, cursorX, y + (useHeji ? hejiYOffset : 0));
        cursorX += measureCharWidth(char, charSize, charFont, charWeight);
      });
    }
  }
  ctx.restore();
}

function getDefaultNoteDetailOffset(radius, scale = 1) {
  return { x: (radius + 5) * scale, y: (radius - 20) * scale };
}

function getLayoutNoteOffset(node, radius, scale = 1) {
  const override = layoutLabelOffsets.get(node.id);
  if (override) {
    return {
      x: override.x * view.zoom * scale,
      y: override.y * view.zoom * scale,
    };
  }
  return getDefaultNoteDetailOffset(radius, 1);
}

function getLayoutNoteLabelPosition(node, pos, radius) {
  const offset = getLayoutNoteOffset(node, radius, pos.scale || 1);
  return { x: pos.x + offset.x, y: pos.y + offset.y };
}

function rectIntersectsRect(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function rectIntersectsCircle(rect, circle, padding = 0) {
  const left = rect.left - padding;
  const right = rect.right + padding;
  const top = rect.top - padding;
  const bottom = rect.bottom + padding;
  const closestX = Math.max(left, Math.min(circle.x, right));
  const closestY = Math.max(top, Math.min(circle.y, bottom));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < (circle.r + padding) * (circle.r + padding);
}

function rectIntersectsSegment(rect, segment, padding = 0) {
  const left = rect.left - padding;
  const right = rect.right + padding;
  const top = rect.top - padding;
  const bottom = rect.bottom + padding;
  const { x1, y1, x2, y2 } = segment;
  const inside =
    (x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) ||
    (x2 >= left && x2 <= right && y2 >= top && y2 <= bottom);
  if (inside) {
    return true;
  }
  const intersects = (ax, ay, bx, by, cx, cy, dx, dy) => {
    const r1x = bx - ax;
    const r1y = by - ay;
    const r2x = dx - cx;
    const r2y = dy - cy;
    const denom = r1x * r2y - r1y * r2x;
    if (Math.abs(denom) < 1e-6) {
      return false;
    }
    const t = ((cx - ax) * r2y - (cy - ay) * r2x) / denom;
    const u = ((cx - ax) * r1y - (cy - ay) * r1x) / denom;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  };
  return (
    intersects(x1, y1, x2, y2, left, top, right, top) ||
    intersects(x1, y1, x2, y2, right, top, right, bottom) ||
    intersects(x1, y1, x2, y2, right, bottom, left, bottom) ||
    intersects(x1, y1, x2, y2, left, bottom, left, top)
  );
}

function getDetailLabelPosition({
  center,
  baseOffset,
  width,
  height,
  circles,
  placedRects,
  segments,
  ignoreId = null,
}) {
  const baseAngle = Math.atan2(baseOffset.y, baseOffset.x);
  const baseDist = Math.hypot(baseOffset.x, baseOffset.y);
  const candidates = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, 1.4, -1.4, Math.PI];
  const getAnchoredRect = (anchorX, anchorY, dx, dy) => {
    const rightSide = dx >= 0;
    const bottomSide = dy >= 0;
    let left = anchorX;
    let top = anchorY;
    if (rightSide && bottomSide) {
      left = anchorX;
      top = anchorY;
    } else if (!rightSide && !bottomSide) {
      left = anchorX - width;
      top = anchorY - height;
    } else if (rightSide && !bottomSide) {
      left = anchorX;
      top = anchorY - height;
    } else {
      left = anchorX - width;
      top = anchorY;
    }
    return { left, top, right: left + width, bottom: top + height };
  };
  for (let i = 0; i < candidates.length; i += 1) {
    const angle = baseAngle + candidates[i];
    const dx = Math.cos(angle) * baseDist;
    const dy = Math.sin(angle) * baseDist;
    const anchorX = center.x + dx;
    const anchorY = center.y + dy;
    const rect = getAnchoredRect(anchorX, anchorY, dx, dy);
    let collision = false;
    for (let j = 0; j < circles.length; j += 1) {
      const circle = circles[j];
      if (ignoreId != null && circle.id === ignoreId) {
        continue;
      }
      if (rectIntersectsCircle(rect, circle, 2)) {
        collision = true;
        break;
      }
    }
    if (collision) {
      continue;
    }
    for (let k = 0; k < placedRects.length; k += 1) {
      if (rectIntersectsRect(rect, placedRects[k])) {
        collision = true;
        break;
      }
    }
    if (!collision && segments && segments.length) {
      for (let m = 0; m < segments.length; m += 1) {
        if (rectIntersectsSegment(rect, segments[m], 2)) {
          collision = true;
          break;
        }
      }
    }
    if (!collision) {
      placedRects.push(rect);
      return { x: rect.left, y: rect.top };
    }
  }
  const fallbackDx = baseOffset.x;
  const fallbackDy = baseOffset.y;
  const anchorX = center.x + fallbackDx;
  const anchorY = center.y + fallbackDy;
  const fallbackRect = getAnchoredRect(anchorX, anchorY, fallbackDx, fallbackDy);
  placedRects.push(fallbackRect);
  return { x: fallbackRect.left, y: fallbackRect.top };
}

function draw2DKeyMappingLabel({
  labelText,
  pos,
  radius,
  alpha,
  color,
  collision,
  ignoreId = null,
}) {
  if (!labelText || !collision) {
    return;
  }
  const fontSize = 11;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${fontSize}px "Lexend", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const width = Math.max(1, ctx.measureText(labelText).width);
  const height = fontSize;
  const distance = radius + 1;
  const labelPos = getDetailLabelPosition({
    center: pos,
    baseOffset: { x: -distance, y: -distance },
    width,
    height,
    circles: collision.circles,
    placedRects: collision.rects,
    segments: collision.segments,
    ignoreId,
  });
  ctx.fillStyle = color;
  ctx.fillText(labelText, labelPos.x, labelPos.y);
  ctx.restore();
}

function getLayoutKeyMappingOffset(node, radius, scale = 1) {
  const override = layoutKeyMappingOffsets.get(node.id);
  if (override) {
    return {
      x: override.x * view.zoom * scale,
      y: override.y * view.zoom * scale,
    };
  }
  const distance = radius + layoutKeyMappingOffset;
  return { x: -distance, y: -distance };
}

function getLayoutKeyMappingLabelPosition(node, pos, radius) {
  const offset = getLayoutKeyMappingOffset(node, radius, pos.scale || 1);
  return { x: pos.x + offset.x, y: pos.y + offset.y };
}

function getLayoutKeyMappingLabelHitbox(labelText, node, pos, radius) {
  const labelPos = getLayoutKeyMappingLabelPosition(node, pos, radius);
  const fontSize = Math.max(8, Math.round(layoutKeyMappingTextSize));
  ctx.save();
  ctx.font = `${layoutKeyMappingFontWeight} ${fontSize}px ${layoutKeyMappingFont}`;
  const textWidth = ctx.measureText(labelText).width;
  ctx.restore();
  const paddingX = layoutKeyMappingDark ? 6 : 0;
  const paddingY = layoutKeyMappingDark ? 3 : 0;
  const width = textWidth + paddingX * 2;
  const height = fontSize + paddingY * 2;
  return {
    left: labelPos.x - width,
    top: labelPos.y - height,
    width,
    height,
    labelPos,
  };
}

function getLayoutTitleY() {
  const { top } = getLayoutPageRect();
  const disableScale = shouldDisableLayoutScale();
  let maxY = Number.NEGATIVE_INFINITY;
  for (const [a, b] of edges) {
    if (!a.active || !b.active) {
      return;
    }
    const start = worldToScreen(getNodeDisplayCoordinate(a), disableScale);
    const end = worldToScreen(getNodeDisplayCoordinate(b), disableScale);
    const radiusA = getLayoutNodeRadius(start);
    const radiusB = getLayoutNodeRadius(end);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
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
    maxY = Math.max(maxY, edgeStart.y, edgeEnd.y);
  }
  if (!Number.isFinite(maxY)) {
    return top + layoutTitleMargin;
  }
  return Math.max(top + 10, maxY - layoutTitleMargin);
}

function getLayoutTitlePosition() {
  const { left, top, width } = getLayoutPageRect();
  if (
    layoutTitlePosition &&
    Number.isFinite(layoutTitlePosition.x) &&
    Number.isFinite(layoutTitlePosition.y)
  ) {
    return { x: left + layoutTitlePosition.x, y: top + layoutTitlePosition.y };
  }
  return { x: left + width / 2, y: top + 100 };
}

function getLayoutCreatorSize() {
  return Math.max(8, Math.round(layoutCreatorSize));
}

function getLayoutCreatorPosition() {
  const { left, top, width } = getLayoutPageRect();
  if (
    layoutCreatorPosition &&
    Number.isFinite(layoutCreatorPosition.x) &&
    Number.isFinite(layoutCreatorPosition.y)
  ) {
    return { x: left + layoutCreatorPosition.x, y: top + layoutCreatorPosition.y };
  }
  const creatorSize = getLayoutCreatorSize();
  const textWidth = layoutCreator
    ? measureTextWidthWithWeight(
        layoutCreator,
        creatorSize,
        layoutCreatorFont,
        layoutCreatorFontWeight
      )
    : 0;
  const x = left + width - 100 - textWidth / 2;
  return { x, y: top + 150 };
}

function getLayoutCustomLabelPosition(entry) {
  const { left, top } = getLayoutPageRect();
  if (!entry || !entry.position) {
    return { x: left, y: top };
  }
  return { x: left + entry.position.x, y: top + entry.position.y };
}

function drawLayoutCustomLabels() {
  if (!layoutCustomLabels.length) {
    return;
  }
  const size = Math.max(8, Math.round(layoutCustomLabelTextSize));
  ctx.save();
  ctx.fillStyle = themeColors.textSecondary;
  ctx.font = `${layoutCustomLabelFontWeight} ${size}px ${layoutCustomLabelFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  layoutCustomLabels.forEach((entry) => {
    if (!entry.text || !entry.position) {
      return;
    }
    const pos = getLayoutCustomLabelPosition(entry);
    ctx.fillText(entry.text, pos.x, pos.y);
  });
  ctx.restore();
}

function syncLayoutFontVars() {
  document.documentElement.style.setProperty("--font-title", layoutTitleFont);
  document.documentElement.style.setProperty("--font-ratio", layoutRatioFont);
  document.documentElement.style.setProperty("--font-note", layoutNoteFont);
  document.documentElement.style.setProperty("--font-triangle-label", layoutTriangleLabelFont);
  document.documentElement.style.setProperty("--font-custom-label", layoutCustomLabelFont);
  document.documentElement.style.setProperty("--font-key-mapping", layoutKeyMappingFont);
}

const AXIS_EDGE_COLORS = {
  x: "rgba(59, 130, 246, 0.3)",
  y: "rgba(239, 68, 68, 0.3)",
  z: "rgba(16, 185, 129, 0.3)",
};
const BASE_LIGHT_DIR = { x: -0.6, y: -0.8, z: 0 };

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

function floorDiv(value, divisor) {
  return Math.floor(value / divisor);
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
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
  if (!accidental) {
    return "";
  }
  if (accidental > 0) {
    if (accidental === 1) {
      return "#";
    }
    if (accidental === 2) {
      return "x";
    }
    return "#x";
  }
  if (accidental === -1) {
    return "b";
  }
  if (accidental === -2) {
    return "bb";
  }
  return "bbb";
}

function buildPitchClass(letterIndex, accidental) {
  const letter = LETTERS[mod(letterIndex, LETTERS.length)];
  const clamped = Math.max(-3, Math.min(3, accidental));
  return `${letter}${accidentalToString(clamped)}`;
}

function getAccidentalForTargetPc(letterIndex, targetPc) {
  const letter = LETTERS[mod(letterIndex, LETTERS.length)];
  const natural = LETTER_TO_SEMITONE[letter];
  let diff = targetPc - natural;
  if (diff > 6) {
    diff -= 12;
  } else if (diff < -6) {
    diff += 12;
  }
  if (Math.abs(diff) > 2) {
    return null;
  }
  return diff;
}

function getManualSpellingOptions(targetPc) {
  const basePitchClass = noteNames[mod(targetPc, 12)];
  const base = parsePitchClass(basePitchClass);
  const lowerAccidental = getAccidentalForTargetPc(base.letterIndex - 1, targetPc);
  const upperAccidental = getAccidentalForTargetPc(base.letterIndex + 1, targetPc);
  const options = [];
  if (lowerAccidental != null) {
    options.push({
      key: "lower",
      pitchClass: buildPitchClass(base.letterIndex - 1, lowerAccidental),
    });
  }
  options.push({ key: "base", pitchClass: basePitchClass });
  if (upperAccidental != null) {
    options.push({
      key: "upper",
      pitchClass: buildPitchClass(base.letterIndex + 1, upperAccidental),
    });
  }
  return options;
}

function isExcludedEnharmonicSpelling(pitchClass) {
  return /^(E#|Fb|B#|Cb)$/.test(pitchClass);
}

function getSimplestEnharmonicPitchClass(targetPc, fallbackPitchClass) {
  const options = getManualSpellingOptions(targetPc)
    .map((option) => {
      const parsed = parsePitchClass(option.pitchClass);
      return {
        ...option,
        accidental: parsed.accidental,
      };
    })
    .filter(
      (option) =>
        Math.abs(option.accidental) <= 1 &&
        !isExcludedEnharmonicSpelling(option.pitchClass)
    );
  if (!options.length) {
    return fallbackPitchClass;
  }
  options.sort((a, b) => {
    const absA = Math.abs(a.accidental);
    const absB = Math.abs(b.accidental);
    if (absA !== absB) {
      return absA - absB;
    }
    if (a.accidental === 0 && b.accidental !== 0) {
      return -1;
    }
    if (b.accidental === 0 && a.accidental !== 0) {
      return 1;
    }
    const rank = { base: 0, lower: 1, upper: 2 };
    return (rank[a.key] ?? 0) - (rank[b.key] ?? 0);
  });
  return options[0].pitchClass;
}

function getPreferredEnharmonicPitchClass(baseText, targetPc, fallbackPitchClass) {
  if (!baseText) {
    return getSimplestEnharmonicPitchClass(targetPc, fallbackPitchClass);
  }
  const parsed = parsePitchClass(baseText);
  if (!Number.isFinite(parsed.letterIndex)) {
    return fallbackPitchClass;
  }
  const baseAccidental = parsed.accidental || 0;
  const adjacents = [
    { dir: -1, letterIndex: parsed.letterIndex - 1 },
    { dir: 1, letterIndex: parsed.letterIndex + 1 },
  ];
  const options = [];
  adjacents.forEach(({ dir, letterIndex }) => {
    const accidental = getAccidentalForTargetPc(letterIndex, targetPc);
    if (accidental == null) {
      return;
    }
    if (Math.abs(accidental) > 1) {
      return;
    }
    const candidate = buildPitchClass(letterIndex, accidental);
    if (isExcludedEnharmonicSpelling(candidate)) {
      return;
    }
    options.push({ letterIndex, accidental, dir });
  });
  if (!options.length) {
    return getSimplestEnharmonicPitchClass(targetPc, fallbackPitchClass);
  }
  options.sort((a, b) => {
    const absA = Math.abs(a.accidental);
    const absB = Math.abs(b.accidental);
    if (absA !== absB) {
      return absA - absB;
    }
    if (baseAccidental !== 0) {
      const sign = Math.sign(baseAccidental);
      const aMatch = Math.sign(a.accidental) === sign ? 0 : 1;
      const bMatch = Math.sign(b.accidental) === sign ? 0 : 1;
      if (aMatch !== bMatch) {
        return aMatch - bMatch;
      }
      if (sign < 0) {
        return a.dir - b.dir;
      }
      return b.dir - a.dir;
    }
    return a.dir - b.dir;
  });
  const best = options[0];
  const bestPitchClass = buildPitchClass(best.letterIndex, best.accidental);
  if (isExcludedEnharmonicSpelling(bestPitchClass)) {
    return getSimplestEnharmonicPitchClass(targetPc, fallbackPitchClass);
  }
  return bestPitchClass;
}

function getManualSpellingForNode(node, targetPc) {
  const options = getManualSpellingOptions(targetPc);
  const override = nodeSpellingOverrides.get(node.id);
  const selected = options.find((option) => option.key === override);
  if (selected) {
    return selected.pitchClass;
  }
  const baseOption = options.find((option) => option.key === "base");
  return baseOption ? baseOption.pitchClass : noteNamesSharp[mod(targetPc, 12)];
}

function buildTrueSpellingFromAxisRatios({
  node,
  axisRatios,
  freq,
  nearest,
  nearestPitchClass,
  nearestName,
  nearestCents,
}) {
  if (!axisRatios || !axisRatios.length) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const beyondLimit = axisRatios.some((axis) => {
    if (!axis.exp) {
      return false;
    }
    const limit = getTrueSpellingLimit(axis.ratio);
    if (!Number.isFinite(limit)) {
      return false;
    }
    return Math.abs(axis.exp) > limit;
  });
  if (beyondLimit) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const hasUnknownInterval = axisRatios.some(
    (axis) => axis.exp && !TRUE_SPELLING_INTERVALS[axis.ratio]
  );
  if (hasUnknownInterval) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const hasHigherPrime = axisRatios.some(
    (axis) => axis.exp && Number(axis.ratio) >= 53
  );
  if (hasHigherPrime) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  let totalLetterShift = 0;
  let totalSemitoneShift = 0;
  let hasOffsetAxis = false;
  axisRatios.forEach((axis) => {
    if (!axis.exp) {
      return;
    }
    const spec = TRUE_SPELLING_INTERVALS[axis.ratio];
    if (!spec) {
      return;
    }
    hasOffsetAxis = true;
    totalLetterShift += axis.exp * spec.letter;
    totalSemitoneShift += axis.exp * spec.semitones;
  });
  if (!hasOffsetAxis) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
  if (!Number.isFinite(fundamentalMidi)) {
    const fallback = getNearestEtInfo(
      Number(fundamentalInput.value) || 220,
      Number(a4Input.value) || 440
    );
    fundamentalMidi = fallback.midi;
  }
  const basePitchClassText = getFundamentalNoteNames()[mod(fundamentalMidi, 12)];
  const base = parsePitchClass(basePitchClassText);
  const baseLetterIndex = Number.isFinite(base.letterIndex) ? base.letterIndex : 0;
  const baseAccidental = Number.isFinite(base.accidental) ? base.accidental : 0;
  const totalLetter = baseLetterIndex + totalLetterShift;
  const octaveShift = floorDiv(totalLetter, 7);
  const targetLetterIndex = mod(totalLetter, 7);
  const targetNatural =
    LETTER_TO_SEMITONE[LETTERS[targetLetterIndex]] + octaveShift * 12;
  const totalSemitone =
    baseAccidental + LETTER_TO_SEMITONE[LETTERS[baseLetterIndex]] + totalSemitoneShift;
  const accidental = totalSemitone - targetNatural;
  const pitchClass = buildPitchClass(targetLetterIndex, accidental);
  const targetPc = mod(
    LETTER_TO_SEMITONE[LETTERS[targetLetterIndex]] + accidental,
    12
  );
  const midiFloat = 69 + 12 * Math.log2(freq / (Number(a4Input.value) || 440));
  const midiBase = Math.round((midiFloat - targetPc) / 12);
  const midi = targetPc + 12 * midiBase;
  const etFreq =
    (Number(a4Input.value) || 440) * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / etFreq);
  if (spellingMode === "simple") {
    return {
      name: `${getManualSpellingForNode(node, targetPc)}${Math.floor(midi / 12) - 1}`,
      pitchClass: getManualSpellingForNode(node, targetPc),
      cents,
    };
  }
  const name = `${pitchClass}${Math.floor(midi / 12) - 1}`;
  return { name, pitchClass, cents };
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

function analyzeCustomRatio(numerator, denominator) {
  const normalized = normalizeRatioToOctave(numerator, denominator);
  if (!normalized) {
    return null;
  }
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

const trueSpellingLimitCache = new Map();

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
    const totalSemitone = base.accidental + LETTER_TO_SEMITONE[LETTERS[base.letterIndex]] + semitoneShift;
    const accidental = totalSemitone - targetNatural;
    if (Math.abs(accidental) > 3) {
      break;
    }
    maxSteps = step;
  }
  trueSpellingLimitCache.set(key, maxSteps);
  return maxSteps;
}

function getTrueSpellingPitchClass(node) {
  const a4 = Number(a4Input.value) || 440;
  const freq = Number(node.freq);
  const nearest = getNearestEtInfo(freq, a4);
  const nearestPitchClass = noteNames[nearest.midi % 12];
  const nearestName = `${nearestPitchClass}${Math.floor(nearest.midi / 12) - 1}`;
  const nearestCents = Number.isFinite(node.cents_from_et) ? node.cents_from_et : nearest.cents;
  const ratioX = Number(ratioXSelect.value);
  const ratioY = Number(ratioYSelect.value);
  const ratioZ = Number(ratioZSelect.value);
  const axisRatios = [
    { ratio: ratioX, exp: Number(node.exponentX) || 0 },
    { ratio: ratioY, exp: Number(node.exponentY) || 0 },
    { ratio: ratioZ, exp: Number(node.exponentZ) || 0 },
  ];
  return buildTrueSpellingFromAxisRatios({
    node,
    axisRatios,
    freq,
    nearest,
    nearestPitchClass,
    nearestName,
    nearestCents,
  });
}

function getLightDir2D() {
  const rotated = projectPointWithAngles(BASE_LIGHT_DIR, view.rotX, view.rotY, true);
  const length = Math.hypot(rotated.x, rotated.y) || 1;
  return { x: rotated.x / length, y: rotated.y / length };
}

function updateReducedEffects(event) {
  if (!is3DMode || (!view.dragging && !view.rotating) || view.reducedEffects) {
    return;
  }
  const now = performance.now();
  const dx = event.offsetX - view.interactionStart.x;
  const dy = event.offsetY - view.interactionStart.y;
  const distance = Math.hypot(dx, dy);
  if (distance >= 6 || now - view.interactionStart.time >= 120) {
    view.reducedEffects = true;
  }
}

function pointInTriangle(point, a, b, c) {
  const area =
    (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
  const area1 =
    (b.x - point.x) * (c.y - point.y) - (c.x - point.x) * (b.y - point.y);
  const area2 =
    (c.x - point.x) * (a.y - point.y) - (a.x - point.x) * (c.y - point.y);
  const area3 =
    (a.x - point.x) * (b.y - point.y) - (b.x - point.x) * (a.y - point.y);
  const hasNeg = area1 < 0 || area2 < 0 || area3 < 0;
  const hasPos = area1 > 0 || area2 > 0 || area3 > 0;
  if (area === 0) {
    return false;
  }
  return !(hasNeg && hasPos);
}

function distanceToSegment(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (!lenSq) {
    return Math.hypot(point.x - a.x, point.y - a.y);
  }
  let t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(point.x - projX, point.y - projY);
}

function getSegmentClosestT(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (!lenSq) {
    return 0.5;
  }
  let t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return t;
}

function getTriangleDiagonalHit(screenPoint, entry, gridMap, disableScale) {
  const { a, b, c, d } = getTriangleCellNodes(entry, gridMap);
  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;
  const check = (startNode, endNode, diag) => {
    if (!startNode || !endNode) {
      return;
    }
    const start = worldToScreen(getNodeDisplayCoordinate(startNode), disableScale);
    const end = worldToScreen(getNodeDisplayCoordinate(endNode), disableScale);
    const radiusA = layoutMode
      ? getLayoutNodeRadius(start)
      : getNodeRadius(startNode) * (start.scale || 1);
    const radiusB = layoutMode
      ? getLayoutNodeRadius(end)
      : getNodeRadius(endNode) * (end.scale || 1);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
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
    const hitDist = distanceToSegment(screenPoint, edgeStart, edgeEnd);
    if (hitDist < bestDist) {
      bestDist = hitDist;
      best = diag;
    }
  };
  check(a, d, "backslash");
  check(b, c, "slash");
  return bestDist <= TRIANGLE_DIAGONAL_HIT_DISTANCE ? best : null;
}

function triangleLabelKey(entry) {
  return `${entry.plane}:${entry.x},${entry.y},${entry.z}:${entry.tri}`;
}

function normalizeTriangleLabelEntry(entry) {
  return {
    plane: entry.plane,
    x: entry.x,
    y: entry.y,
    z: entry.z,
    tri: entry.tri,
    label: entry.label ? String(entry.label) : "",
  };
}

function openTriangleLabelDialog(value) {
  if (!triangleLabelDialog || !triangleLabelInput) {
    return;
  }
  triangleLabelInput.value = value || "";
  if (typeof triangleLabelDialog.showModal === "function") {
    triangleLabelDialog.showModal();
  }
  requestAnimationFrame(() => {
    triangleLabelInput.focus();
    triangleLabelInput.select();
  });
}

function openLayoutCustomLabelDialog(value = "") {
  if (!layoutCustomLabelDialog || !layoutCustomLabelInput) {
    return;
  }
  customTextHeld = false;
  xKeyHeld = false;
  layoutCustomLabelInput.value = value;
  if (typeof layoutCustomLabelDialog.showModal === "function") {
    layoutCustomLabelDialog.showModal();
  }
  requestAnimationFrame(() => {
    layoutCustomLabelInput.focus();
    layoutCustomLabelInput.select();
  });
}

function setNodeOctaveShift(node, shift) {
  if (!node) {
    return;
  }
  const normalized = Number.isFinite(shift) ? Math.trunc(shift) : 0;
  if (node.isCustom) {
    node.octaveShift = normalized;
    node.octaveShiftManual = true;
    return;
  }
  const key = getOctaveOffsetKey(node);
  if (normalized) {
    nodeOctaveOffsets.set(key, normalized);
  } else {
    nodeOctaveOffsets.delete(key);
  }
  node.octaveShift = normalized;
}

function openOctaveShiftDialog(node) {
  if (!octaveShiftDialog || !octaveShiftInput || !node) {
    return;
  }
  octaveShiftTargetId = node.id;
  const currentShift = getNodeOctaveShift(node);
  octaveShiftInput.value = currentShift ? String(currentShift) : "";
  if (typeof octaveShiftDialog.showModal === "function") {
    octaveShiftDialog.showModal();
  }
  requestAnimationFrame(() => {
    octaveShiftInput.focus();
    octaveShiftInput.select();
  });
}

function triangleKey(entry) {
  return `${entry.plane}:${entry.x},${entry.y},${entry.z}:${entry.diag}`;
}

function triangleCellKeys(entry) {
  const base = `${entry.plane}:${entry.x},${entry.y},${entry.z}:`;
  return {
    backslash: `${base}backslash`,
    slash: `${base}slash`,
  };
}

// EXPERIMENT: hidden keyboard mode "iso-tri" (isomorphic triangle mapping).
// The UI option is intentionally removed for now; implementation is retained
// for possible future revival or deletion in a cleanup pass.
function isTriangleKeyboardMode(mode = getKeyboardMode()) {
  return mode === "iso-tri";
}

function useAutoTrianglesOnly() {
  return isTriangleKeyboardMode();
}

function hasEffectiveTriangleDiagonal(key) {
  if (useAutoTrianglesOnly()) {
    return autoTriangleDiagonals.has(key);
  }
  return triangleDiagonals.has(key) || autoTriangleDiagonals.has(key);
}

function forEachEffectiveTriangleDiagonal(callback) {
  if (useAutoTrianglesOnly()) {
    autoTriangleDiagonals.forEach((entry, key) => {
      callback(entry, key);
    });
    return;
  }
  autoTriangleDiagonals.forEach((entry, key) => {
    if (!triangleDiagonals.has(key)) {
      callback(entry, key);
    }
  });
  triangleDiagonals.forEach((entry, key) => {
    callback(entry, key);
  });
}

function clearAutoTriangleDiagonals() {
  if (!autoTriangleDiagonals.size) {
    return;
  }
  autoTriangleDiagonals.clear();
}

function markAutoTrianglesDirty() {
  autoTrianglesDirty = true;
}

function getActiveGridNodeMap() {
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (node.active && !node.isCustom) {
      gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    }
  });
  return gridMap;
}

function rebuildAutoTriangleDiagonals() {
  autoTriangleDiagonals.clear();
  const mode = getKeyboardMode();
  if (!isTriangleKeyboardMode(mode)) {
    autoTrianglesDirty = false;
    return;
  }
  const gridMap = getActiveGridNodeMap();
  if (!gridMap.size) {
    autoTrianglesDirty = false;
    return;
  }
  const pickTopLeftToBottomRightDiagonal = (a, b, c, d, backslashEntry, slashEntry) => {
    const pa = worldToScreen(getNodeDisplayCoordinate(a));
    const pb = worldToScreen(getNodeDisplayCoordinate(b));
    const pc = worldToScreen(getNodeDisplayCoordinate(c));
    const pd = worldToScreen(getNodeDisplayCoordinate(d));
    const corners = [
      { key: "a", p: pa },
      { key: "b", p: pb },
      { key: "c", p: pc },
      { key: "d", p: pd },
    ];
    const score = (corner) => corner.p.x + corner.p.y;
    let topLeft = corners[0];
    let bottomRight = corners[0];
    for (let i = 1; i < corners.length; i += 1) {
      const corner = corners[i];
      const s = score(corner);
      const sTop = score(topLeft);
      const sBottom = score(bottomRight);
      if (s < sTop - 1e-6 || (Math.abs(s - sTop) < 1e-6 && corner.p.x < topLeft.p.x)) {
        topLeft = corner;
      }
      if (s > sBottom + 1e-6 || (Math.abs(s - sBottom) < 1e-6 && corner.p.x > bottomRight.p.x)) {
        bottomRight = corner;
      }
    }
    const endpoints = `${topLeft.key}${bottomRight.key}`;
    if (endpoints === "ad" || endpoints === "da") {
      return backslashEntry;
    }
    if (endpoints === "bc" || endpoints === "cb") {
      return slashEntry;
    }
    const backslashMid = {
      x: (pa.x + pd.x) / 2,
      y: (pa.y + pd.y) / 2,
    };
    const slashMid = {
      x: (pb.x + pc.x) / 2,
      y: (pb.y + pc.y) / 2,
    };
    const backslashScore = backslashMid.x + backslashMid.y;
    const slashScore = slashMid.x + slashMid.y;
    return backslashScore <= slashScore ? backslashEntry : slashEntry;
  };
  for (let z = 0; z < gridDepth; z += 1) {
    for (let y = 0; y < GRID_ROWS - 1; y += 1) {
      for (let x = 0; x < GRID_COLS - 1; x += 1) {
        const a = gridMap.get(`${x},${y},${z}`);
        const b = gridMap.get(`${x + 1},${y},${z}`);
        const c = gridMap.get(`${x},${y + 1},${z}`);
        const d = gridMap.get(`${x + 1},${y + 1},${z}`);
        if (!(a && b && c && d)) {
          continue;
        }
        const backslash = normalizeTriangleEntry({ plane: "xy", x, y, z, diag: "backslash", tri: "abd" });
        const slash = normalizeTriangleEntry({ plane: "xy", x, y, z, diag: "slash", tri: "abc" });
        const chosen = pickTopLeftToBottomRightDiagonal(a, b, c, d, backslash, slash);
        autoTriangleDiagonals.set(triangleKey(chosen), chosen);
      }
    }
  }
  if (gridDepth > 1) {
    for (let y = 0; y < GRID_ROWS; y += 1) {
      for (let z = 0; z < gridDepth - 1; z += 1) {
        for (let x = 0; x < GRID_COLS - 1; x += 1) {
          const a = gridMap.get(`${x},${y},${z}`);
          const b = gridMap.get(`${x + 1},${y},${z}`);
          const c = gridMap.get(`${x},${y},${z + 1}`);
          const d = gridMap.get(`${x + 1},${y},${z + 1}`);
          if (!(a && b && c && d)) {
            continue;
          }
          const backslash = normalizeTriangleEntry({ plane: "xz", x, y, z, diag: "backslash", tri: "abd" });
          const slash = normalizeTriangleEntry({ plane: "xz", x, y, z, diag: "slash", tri: "abc" });
          const chosen = pickTopLeftToBottomRightDiagonal(a, b, c, d, backslash, slash);
          autoTriangleDiagonals.set(triangleKey(chosen), chosen);
        }
      }
    }
    for (let x = 0; x < GRID_COLS; x += 1) {
      for (let z = 0; z < gridDepth - 1; z += 1) {
        for (let y = 0; y < GRID_ROWS - 1; y += 1) {
          const a = gridMap.get(`${x},${y},${z}`);
          const b = gridMap.get(`${x},${y + 1},${z}`);
          const c = gridMap.get(`${x},${y},${z + 1}`);
          const d = gridMap.get(`${x},${y + 1},${z + 1}`);
          if (!(a && b && c && d)) {
            continue;
          }
          const backslash = normalizeTriangleEntry({ plane: "yz", x, y, z, diag: "backslash", tri: "abd" });
          const slash = normalizeTriangleEntry({ plane: "yz", x, y, z, diag: "slash", tri: "abc" });
          const chosen = pickTopLeftToBottomRightDiagonal(a, b, c, d, backslash, slash);
          autoTriangleDiagonals.set(triangleKey(chosen), chosen);
        }
      }
    }
  }
  autoTrianglesDirty = false;
}

function ensureAutoTriangleDiagonals() {
  if (!isTriangleKeyboardMode()) {
    if (autoTriangleDiagonals.size) {
      autoTriangleDiagonals.clear();
    }
    autoTrianglesDirty = true;
    return;
  }
  if (autoTrianglesDirty) {
    rebuildAutoTriangleDiagonals();
  }
}

function normalizeTriangleEntry(entry) {
  return {
    plane: entry.plane,
    x: entry.x,
    y: entry.y,
    z: entry.z,
    diag: entry.diag,
    tri: entry.tri,
    label: entry.label ? String(entry.label) : "",
  };
}

function remapTrianglesForGridCenter(oldCenterZ, newCenterZ) {
  if (oldCenterZ === newCenterZ) {
    return;
  }
  const shift = newCenterZ - oldCenterZ;
  const maxZ = gridDepth - 1;
  if (triangleDiagonals.size) {
    const nextDiagonals = new Map();
    triangleDiagonals.forEach((entry) => {
      const z = entry.z + shift;
      if (!Number.isFinite(z) || z < 0 || z > maxZ) {
        return;
      }
      const next = { ...entry, z };
      nextDiagonals.set(triangleKey(next), next);
    });
    triangleDiagonals.clear();
    nextDiagonals.forEach((value, key) => {
      triangleDiagonals.set(key, value);
    });
  }
  if (triangleLabels.size) {
    const nextLabels = new Map();
    triangleLabels.forEach((entry) => {
      const z = entry.z + shift;
      if (!Number.isFinite(z) || z < 0 || z > maxZ) {
        return;
      }
      const next = { ...entry, z };
      nextLabels.set(triangleLabelKey(next), next);
    });
    triangleLabels.clear();
    nextLabels.forEach((value, key) => {
      triangleLabels.set(key, value);
    });
  }
}

function getTriangleDiagonalNodes(entry, gridMap) {
  if (entry.plane === "xy") {
    if (entry.diag === "backslash") {
      return {
        a: gridMap.get(`${entry.x},${entry.y},${entry.z}`),
        b: gridMap.get(`${entry.x + 1},${entry.y + 1},${entry.z}`),
      };
    }
    return {
      a: gridMap.get(`${entry.x + 1},${entry.y},${entry.z}`),
      b: gridMap.get(`${entry.x},${entry.y + 1},${entry.z}`),
    };
  }
  if (entry.plane === "xz") {
    const yFixed = entry.y;
    if (entry.diag === "backslash") {
      return {
        a: gridMap.get(`${entry.x},${yFixed},${entry.z}`),
        b: gridMap.get(`${entry.x + 1},${yFixed},${entry.z + 1}`),
      };
    }
    return {
      a: gridMap.get(`${entry.x + 1},${yFixed},${entry.z}`),
      b: gridMap.get(`${entry.x},${yFixed},${entry.z + 1}`),
    };
  }
  if (entry.plane === "yz") {
    const xFixed = entry.x;
    if (entry.diag === "backslash") {
      return {
        a: gridMap.get(`${xFixed},${entry.y},${entry.z}`),
        b: gridMap.get(`${xFixed},${entry.y + 1},${entry.z + 1}`),
      };
    }
    return {
      a: gridMap.get(`${xFixed},${entry.y + 1},${entry.z}`),
      b: gridMap.get(`${xFixed},${entry.y},${entry.z + 1}`),
    };
  }
  return { a: null, b: null };
}

function getTriangleCellNodes(entry, gridMap) {
  if (entry.plane === "xy") {
    return {
      a: gridMap.get(`${entry.x},${entry.y},${entry.z}`),
      b: gridMap.get(`${entry.x + 1},${entry.y},${entry.z}`),
      c: gridMap.get(`${entry.x},${entry.y + 1},${entry.z}`),
      d: gridMap.get(`${entry.x + 1},${entry.y + 1},${entry.z}`),
    };
  }
  if (entry.plane === "xz") {
    return {
      a: gridMap.get(`${entry.x},${entry.y},${entry.z}`),
      b: gridMap.get(`${entry.x + 1},${entry.y},${entry.z}`),
      c: gridMap.get(`${entry.x},${entry.y},${entry.z + 1}`),
      d: gridMap.get(`${entry.x + 1},${entry.y},${entry.z + 1}`),
    };
  }
  if (entry.plane === "yz") {
    return {
      a: gridMap.get(`${entry.x},${entry.y},${entry.z}`),
      b: gridMap.get(`${entry.x},${entry.y + 1},${entry.z}`),
      c: gridMap.get(`${entry.x},${entry.y},${entry.z + 1}`),
      d: gridMap.get(`${entry.x},${entry.y + 1},${entry.z + 1}`),
    };
  }
  return { a: null, b: null, c: null, d: null };
}

function getTriangleLabelPoints(tri, nodes) {
  if (!nodes) {
    return null;
  }
  const { a, b, c, d } = nodes;
  if (tri === "abd") {
    return a && b && d ? [a, b, d] : null;
  }
  if (tri === "acd") {
    return a && c && d ? [a, c, d] : null;
  }
  if (tri === "abc") {
    return a && b && c ? [a, b, c] : null;
  }
  if (tri === "bcd") {
    return b && c && d ? [b, c, d] : null;
  }
  return null;
}

function drawTriangleDiagonals(nodePosMap, disableScale = false) {
  ensureAutoTriangleDiagonals();
  if (!triangleDiagonals.size && !autoTriangleDiagonals.size) {
    return;
  }
  const gridMap = getActiveGridNodeMap();
  ctx.save();
  ctx.strokeStyle = themeColors.edge;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  forEachEffectiveTriangleDiagonal((entry) => {
    const { a, b } = getTriangleDiagonalNodes(entry, gridMap);
    if (!a || !b) {
      return;
    }
    const startEntry = nodePosMap && nodePosMap.get(a.id);
    const endEntry = nodePosMap && nodePosMap.get(b.id);
    const start = startEntry
      ? startEntry.pos
      : worldToScreen(getNodeDisplayCoordinate(a), disableScale);
    const end = endEntry
      ? endEntry.pos
      : worldToScreen(getNodeDisplayCoordinate(b), disableScale);
    const radiusA = startEntry
      ? startEntry.radius
      : layoutMode
        ? getLayoutNodeRadius(start)
        : getNodeRadius(a) * (start.scale || 1);
    const radiusB = endEntry
      ? endEntry.radius
      : layoutMode
        ? getLayoutNodeRadius(end)
        : getNodeRadius(b) * (end.scale || 1);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
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
  ctx.restore();
}

function drawTriangleLabels(nodePosMap, disableScale = false) {
  if (!triangleLabels.size) {
    return;
  }
  ensureAutoTriangleDiagonals();
  const gridMap = getActiveGridNodeMap();
  triangleLabels.forEach((entry) => {
    if (!entry.label) {
      return;
    }
    const diag = TRIANGLE_TRI_TO_DIAG[entry.tri];
    if (!diag || !hasEffectiveTriangleDiagonal(triangleKey({ ...entry, diag }))) {
      return;
    }
    const cellNodes = getTriangleCellNodes(entry, gridMap);
    const labelNodes = getTriangleLabelPoints(entry.tri, cellNodes);
    if (!labelNodes) {
      return;
    }
    const points = labelNodes.map((node) => {
      const projected = nodePosMap && nodePosMap.get(node.id)
        ? nodePosMap.get(node.id).pos
        : worldToScreen(getNodeDisplayCoordinate(node), disableScale);
      return projected;
    });
    const cx = (points[0].x + points[1].x + points[2].x) / 3;
    const cy = (points[0].y + points[1].y + points[2].y) / 3;
    const baseSize = layoutMode
      ? Math.max(12, Math.round(layoutTriangleLabelTextSize))
      : 18;
    const fontWeight = layoutMode ? layoutTriangleLabelFontWeight : 400;
    const layout = computeTriangleLabelLayout(
      entry.label,
      layoutTriangleLabelFont,
      baseSize,
      points,
      fontWeight
    );
    ctx.save();
    ctx.setLineDash([]);
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = `${fontWeight} ${layout.size}px ${layoutTriangleLabelFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(entry.label, cx, cy);
    ctx.restore();
  });
}

function drawTriangleHover(nodePosMap, disableScale = false) {
  if (!triangleHover || !tHeld) {
    return;
  }
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (!node.isCustom) {
      gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    }
  });
  const { a, b, c, d } = getTriangleCellNodes(triangleHover, gridMap);
  if (!a || !b || !c || !d) {
    return;
  }
  const projA =
    nodePosMap && nodePosMap.get(a.id)
      ? nodePosMap.get(a.id).pos
      : worldToScreen(getNodeDisplayCoordinate(a), disableScale);
  const projB =
    nodePosMap && nodePosMap.get(b.id)
      ? nodePosMap.get(b.id).pos
      : worldToScreen(getNodeDisplayCoordinate(b), disableScale);
  const projC =
    nodePosMap && nodePosMap.get(c.id)
      ? nodePosMap.get(c.id).pos
      : worldToScreen(getNodeDisplayCoordinate(c), disableScale);
  const projD =
    nodePosMap && nodePosMap.get(d.id)
      ? nodePosMap.get(d.id).pos
      : worldToScreen(getNodeDisplayCoordinate(d), disableScale);

  const keys = triangleCellKeys(triangleHover);
  const existingDiag = triangleDiagonals.has(keys.backslash)
    ? "backslash"
    : triangleDiagonals.has(keys.slash)
    ? "slash"
    : null;
  let triPoints = null;
  if (existingDiag === "backslash") {
    const inABD = pointInTriangle(triangleHover.screen || { x: 0, y: 0 }, projA, projB, projD);
    triPoints = inABD ? [projA, projB, projD] : [projA, projC, projD];
  } else if (existingDiag === "slash") {
    const inABC = pointInTriangle(triangleHover.screen || { x: 0, y: 0 }, projA, projB, projC);
    triPoints = inABC ? [projA, projB, projC] : [projB, projC, projD];
  } else if (triangleHover.tri === "abd") {
    triPoints = [projA, projB, projD];
  } else if (triangleHover.tri === "acd") {
    triPoints = [projA, projC, projD];
  } else if (triangleHover.tri === "abc") {
    triPoints = [projA, projB, projC];
  } else if (triangleHover.tri === "bcd") {
    triPoints = [projB, projC, projD];
  }
  if (!triPoints) {
    return;
  }
  ctx.save();
  ctx.fillStyle = "rgba(120, 120, 120, 0.15)";
  ctx.beginPath();
  ctx.moveTo(triPoints[0].x, triPoints[0].y);
  ctx.lineTo(triPoints[1].x, triPoints[1].y);
  ctx.lineTo(triPoints[2].x, triPoints[2].y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

}

function getNodeGuideAlpha(node, guideNodes, axisEntry) {
  let alpha = node.active || node.isCenter ? 1 : 0;
  if (node.isCustom && !node.active) {
    alpha = 0.25;
  }
  if (guideNodes && guideNodes.has(node.id)) {
    alpha = guideNodes.get(node.id);
  }
  const isOrphanGuide = connectOrphansEnabled && orphanGuideNodes.has(node.id);
  if (isOrphanGuide && !(guideNodes && guideNodes.has(node.id))) {
    alpha = 0.08;
  }
  if (axisEntry && !isNodeOnAxisEntry(node, axisEntry)) {
    alpha *= AXIS_DIM_FACTOR;
  }
  if (analysisLayers.microtonal && !commaNodeRings.has(node.id)) {
    alpha *= 0.18;
  }
  return alpha;
}

function drawOrphanGuideEdges(nodePosMap, guideNodes, axisEntry) {
  if (!connectOrphansEnabled || !orphanGuideEdges.size) {
    return;
  }
  const labelFont = layoutMode ? layoutLineLabelFont : "Noto Serif";
  const labelWeight = layoutMode ? layoutLineLabelFontWeight : 400;
  const labelSize = layoutMode ? getLayoutLineLabelSize() : EDGE_LABEL_SIZE_DEFAULT;
  ctx.save();
  ctx.lineWidth = 1.5;
  orphanGuideEdges.forEach((edgeKey) => {
    const parts = edgeKey.split("|");
    if (parts.length !== 2) {
      return;
    }
    const a = nodeById.get(Number(parts[0]));
    const b = nodeById.get(Number(parts[1]));
    if (!a || !b) {
      return;
    }
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const isOrphanA = connectOrphansEnabled && orphanGuideNodes.has(a.id);
    const isOrphanB = connectOrphansEnabled && orphanGuideNodes.has(b.id);
    if (!isOrphanA && !isOrphanB) {
      return;
    }
    const alphaA = isOrphanA ? 0.08 : getNodeGuideAlpha(a, guideNodes, axisEntry);
    const alphaB = isOrphanB ? 0.08 : getNodeGuideAlpha(b, guideNodes, axisEntry);
    const edgeAlpha = Math.min(alphaA, alphaB);
    if (edgeAlpha <= 0) {
      return;
    }
    ctx.strokeStyle = colorWithAlpha(themeColors.nodeStroke, edgeAlpha);
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    const labelText = getEdgeLabelText(a, b);
    const label = shouldShowEdgeLabel(a, b) ? labelText : null;
    const labelT = getLineLabelPositionOverride(a, b) ?? 0.5;
    drawCanvasEdgeSegment({
      start,
      end,
      startRadius,
      endRadius,
      color: themeColors.nodeStroke,
      label,
      labelFont,
      labelWeight,
      labelSize,
      alpha: edgeAlpha,
      labelAlpha: Math.min(1, (edgeAlpha + 1) * 0.3),
    });
  });
  ctx.restore();
}

function getGuideRevealInfo(nodePosMap, axisEntry = null) {
  const empty = { guideNodes: new Map(), guideAnchorId: null };
  if (layoutMode) {
    return empty;
  }
  if (!shiftHeld && !capsLockOn) {
    return empty;
  }
  const pointer = view.lastPointer;
  if (!pointer) {
    return empty;
  }
  return getClusterGuideInfo(pointer, nodePosMap, axisEntry);
}

function getClusterGuideInfo(pointer, nodePosMap, axisEntry = null) {
  const guideNodes = new Map();
  let anchor = null;
  let anchorDist = Infinity;
  const restrictToZeroExponentPlane = !is3DMode && isFlattened2D;
  const useDepthProjection = is3DMode || isFlattened2D;
  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
    if (axisEntry && !isNodeOnAxisEntry(node, axisEntry)) {
      return;
    }
    if (restrictToZeroExponentPlane && (Number(node.exponentZ) || 0) !== 0) {
      return;
    }
    const z = Number.isFinite(node.gridZ) ? node.gridZ : gridCenterZ;
    if (is3DMode && z !== gridCenterZ) {
      return;
    }
    const entry = nodePosMap.get(node.id);
    if (!entry) {
      return;
    }
    if (useDepthProjection) {
      const denom = entry.pos && Number.isFinite(entry.pos.denom) ? entry.pos.denom : 1;
      if (!entry.pos.visible || denom > GUIDE_DEPTH_DENOM_MAX) {
        return;
      }
    }
    const dx = entry.pos.x - pointer.x;
    const dy = entry.pos.y - pointer.y;
    const dist = dx * dx + dy * dy;
    if (dist < anchorDist) {
      anchorDist = dist;
      anchor = node;
    }
  });
  if (!anchor) {
    return { guideNodes, guideAnchorId: null };
  }

  const anchorZ = Number.isFinite(anchor.gridZ) ? anchor.gridZ : gridCenterZ;
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
    if (axisEntry && !isNodeOnAxisEntry(node, axisEntry)) {
      return;
    }
    if (restrictToZeroExponentPlane && (Number(node.exponentZ) || 0) !== 0) {
      return;
    }
    const z = Number.isFinite(node.gridZ) ? node.gridZ : gridCenterZ;
    if (z !== anchorZ) {
      return;
    }
    const entry = nodePosMap.get(node.id);
    if (useDepthProjection && entry) {
      const denom = entry.pos && Number.isFinite(entry.pos.denom) ? entry.pos.denom : 1;
      if (!entry.pos.visible || denom > GUIDE_DEPTH_DENOM_MAX) {
        return;
      }
    }
    gridMap.set(`${node.gridX},${node.gridY}`, node);
  });

  const maxCluster = 5;
  const cluster = [];
  const visited = new Set();
  const queue = [];
  const pushNode = (node) => {
    if (!node) {
      return;
    }
    const key = `${node.gridX},${node.gridY}`;
    if (visited.has(key)) {
      return;
    }
    visited.add(key);
    queue.push(node);
  };
  pushNode(anchor);
  while (queue.length && cluster.length < maxCluster) {
    const current = queue.shift();
    cluster.push(current);
    const neighbors = [
      gridMap.get(`${current.gridX - 1},${current.gridY}`),
      gridMap.get(`${current.gridX + 1},${current.gridY}`),
      gridMap.get(`${current.gridX},${current.gridY - 1}`),
      gridMap.get(`${current.gridX},${current.gridY + 1}`),
    ];
    neighbors.forEach(pushNode);
  }

  const inactiveEntries = cluster
    .filter((node) => !node.active)
    .map((node) => {
      const entry = nodePosMap.get(node.id);
      if (!entry) {
        return null;
      }
      const dx = entry.pos.x - pointer.x;
      const dy = entry.pos.y - pointer.y;
      return { node, distance: Math.hypot(dx, dy) };
    })
    .filter(Boolean);
  if (inactiveEntries.length) {
    const distances = inactiveEntries.map((entry) => entry.distance);
    const minDist = Math.min(...distances);
    const maxDist = Math.max(...distances);
    const span = Math.max(1e-6, maxDist - minDist);
    inactiveEntries.forEach((entry) => {
      const t = (entry.distance - minDist) / span;
      const opacity = 0.5 + (0 - 0.5) * t;
      guideNodes.set(entry.node.id, opacity);
    });
  }

  return { guideNodes, guideAnchorId: anchor.id };
}

function drawGuideEdges(nodePosMap, guideNodes) {
  if (!guideNodes || !guideNodes.size) {
    return;
  }
  const activeGrid = new Map();
  nodes.forEach((node) => {
    if (!node.active || node.isCustom) {
      return;
    }
    const z = Number.isFinite(node.gridZ) ? node.gridZ : gridCenterZ;
    activeGrid.set(`${node.gridX},${node.gridY},${z}`, node);
  });
  ctx.save();
  ctx.strokeStyle = themeColors.edge;
  ctx.lineWidth = 1.5;
  guideNodes.forEach((opacity, id) => {
    const guideNode = nodeById.get(id);
    if (!guideNode) {
      return;
    }
    const z = Number.isFinite(guideNode.gridZ) ? guideNode.gridZ : gridCenterZ;
    const neighbors = [
      activeGrid.get(`${guideNode.gridX - 1},${guideNode.gridY},${z}`),
      activeGrid.get(`${guideNode.gridX + 1},${guideNode.gridY},${z}`),
      activeGrid.get(`${guideNode.gridX},${guideNode.gridY - 1},${z}`),
      activeGrid.get(`${guideNode.gridX},${guideNode.gridY + 1},${z}`),
    ].filter(Boolean);
    if (!neighbors.length) {
      return;
    }
    const guideEntry = nodePosMap.get(guideNode.id);
    if (!guideEntry) {
      return;
    }
    neighbors.forEach((neighbor) => {
      const neighborEntry = nodePosMap.get(neighbor.id);
      if (!neighborEntry) {
        return;
      }
      ctx.globalAlpha = opacity;
      const start = neighborEntry.pos;
      const end = guideEntry.pos;
      const radiusA = neighborEntry.radius;
      const radiusB = guideEntry.radius;
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
  });
  ctx.restore();
}

function pruneTriangleDiagonals() {
  if (!triangleDiagonals.size) {
    return;
  }
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (node.active && !node.isCustom) {
      gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    }
  });
  triangleDiagonals.forEach((entry, key) => {
    const { a, b } = getTriangleDiagonalNodes(entry, gridMap);
    if (!a || !b) {
      triangleDiagonals.delete(key);
    }
  });
}

function findTriangleHit(screenPoint) {
  ensureAutoTriangleDiagonals();
  const activeMap = new Map();
  const allMap = new Map();
  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
    allMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    if (node.active) {
      activeMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    }
  });
  if (!activeMap.size) {
    return null;
  }
  const disableScale = shouldDisableLayoutScale();
  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;
  const updateBest = (entry, center) => {
    const dist = Math.hypot(screenPoint.x - center.x, screenPoint.y - center.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = entry;
    }
  };
  const evaluateCell = (entryBase, aAll, bAll, cAll, dAll, a, b, c, d) => {
    if (!aAll || !bAll || !cAll || !dAll) {
      return;
    }
    const keys = triangleCellKeys(entryBase);
    const hasBackslash = hasEffectiveTriangleDiagonal(keys.backslash);
    const hasSlash = hasEffectiveTriangleDiagonal(keys.slash);
    const activeDiag = hasBackslash ? "backslash" : hasSlash ? "slash" : null;
    const pA = worldToScreen(getNodeDisplayCoordinate(aAll), disableScale);
    const pB = worldToScreen(getNodeDisplayCoordinate(bAll), disableScale);
    const pC = worldToScreen(getNodeDisplayCoordinate(cAll), disableScale);
    const pD = worldToScreen(getNodeDisplayCoordinate(dAll), disableScale);
    const inABD = activeDiag === "slash"
      ? false
      : pointInTriangle(screenPoint, pA, pB, pD);
    const inACD = activeDiag === "slash"
      ? false
      : pointInTriangle(screenPoint, pA, pC, pD);
    const inABC = activeDiag === "backslash"
      ? false
      : pointInTriangle(screenPoint, pA, pB, pC);
    const inBCD = activeDiag === "backslash"
      ? false
      : pointInTriangle(screenPoint, pB, pC, pD);
    const inAny = inABD || inACD || inABC || inBCD;
    if (!inAny) {
      return;
    }
    const backslashOk = (a && b && d) || (a && c && d);
    const slashOk = (a && b && c) || (b && c && d);
    const both = backslashOk && slashOk;
    if (inABD && a && b && d) {
      updateBest(
        { ...entryBase, diag: "backslash", both, tri: "abd" },
        { x: (pA.x + pD.x) / 2, y: (pA.y + pD.y) / 2 }
      );
    }
    if (inACD && a && c && d) {
      updateBest(
        { ...entryBase, diag: "backslash", both, tri: "acd" },
        { x: (pA.x + pD.x) / 2, y: (pA.y + pD.y) / 2 }
      );
    }
    if (inABC && a && b && c) {
      updateBest(
        { ...entryBase, diag: "slash", both, tri: "abc" },
        { x: (pB.x + pC.x) / 2, y: (pB.y + pC.y) / 2 }
      );
    }
    if (inBCD && b && c && d) {
      updateBest(
        { ...entryBase, diag: "slash", both, tri: "bcd" },
        { x: (pB.x + pC.x) / 2, y: (pB.y + pC.y) / 2 }
      );
    }
  };
  for (let z = 0; z < gridDepth; z += 1) {
    for (let y = 0; y < GRID_ROWS - 1; y += 1) {
      for (let x = 0; x < GRID_COLS - 1; x += 1) {
        evaluateCell(
          { plane: "xy", x, y, z },
          allMap.get(`${x},${y},${z}`),
          allMap.get(`${x + 1},${y},${z}`),
          allMap.get(`${x},${y + 1},${z}`),
          allMap.get(`${x + 1},${y + 1},${z}`),
          activeMap.get(`${x},${y},${z}`),
          activeMap.get(`${x + 1},${y},${z}`),
          activeMap.get(`${x},${y + 1},${z}`),
          activeMap.get(`${x + 1},${y + 1},${z}`)
        );
      }
    }
  }
  if (gridDepth > 1) {
    for (let y = 0; y < GRID_ROWS; y += 1) {
      for (let z = 0; z < gridDepth - 1; z += 1) {
        for (let x = 0; x < GRID_COLS - 1; x += 1) {
          evaluateCell(
            { plane: "xz", x, y, z },
            allMap.get(`${x},${y},${z}`),
            allMap.get(`${x + 1},${y},${z}`),
            allMap.get(`${x},${y},${z + 1}`),
            allMap.get(`${x + 1},${y},${z + 1}`),
            activeMap.get(`${x},${y},${z}`),
            activeMap.get(`${x + 1},${y},${z}`),
            activeMap.get(`${x},${y},${z + 1}`),
            activeMap.get(`${x + 1},${y},${z + 1}`)
          );
        }
      }
    }
    for (let x = 0; x < GRID_COLS; x += 1) {
      for (let z = 0; z < gridDepth - 1; z += 1) {
        for (let y = 0; y < GRID_ROWS - 1; y += 1) {
          evaluateCell(
            { plane: "yz", x, y, z },
            allMap.get(`${x},${y},${z}`),
            allMap.get(`${x},${y + 1},${z}`),
            allMap.get(`${x},${y},${z + 1}`),
            allMap.get(`${x},${y + 1},${z + 1}`),
            activeMap.get(`${x},${y},${z}`),
            activeMap.get(`${x},${y + 1},${z}`),
            activeMap.get(`${x},${y},${z + 1}`),
            activeMap.get(`${x},${y + 1},${z + 1}`)
          );
        }
      }
    }
  }
  return best;
}

function formatAxisRatioLabel(ratioValue) {
  if (!Number.isFinite(ratioValue) || ratioValue === 0) {
    return null;
  }
  const reduced = reduceToOctave(Math.abs(ratioValue), 1);
  if (!Number.isFinite(reduced.numerator) || !Number.isFinite(reduced.denominator)) {
    return null;
  }
  return `${reduced.numerator}:${reduced.denominator}`;
}

function formatAxisRatioLabelDirectional(ratioValue, direction) {
  if (!Number.isFinite(ratioValue) || ratioValue === 0) {
    return null;
  }
  const reduced = reduceToOctave(Math.abs(ratioValue), 1);
  if (!Number.isFinite(reduced.numerator) || !Number.isFinite(reduced.denominator)) {
    return null;
  }
  if (direction < 0) {
    return `${reduced.denominator}:${reduced.numerator}`;
  }
  return `${reduced.numerator}:${reduced.denominator}`;
}

function getEdgeLabelText(a, b) {
  if (!a || !b) {
    return null;
  }
  const dx = (b.gridX ?? 0) - (a.gridX ?? 0);
  const dy = (b.gridY ?? 0) - (a.gridY ?? 0);
  const dz = (b.gridZ ?? 0) - (a.gridZ ?? 0);
  const dirFromExponent = (value, fallback) => {
    if (value > 0) {
      return 1;
    }
    if (value < 0) {
      return -1;
    }
    if (fallback > 0) {
      return 1;
    }
    if (fallback < 0) {
      return -1;
    }
    return 1;
  };
  const dirX = dirFromExponent(b.exponentX ?? 0, a.exponentX ?? 0);
  const dirY = dirFromExponent(b.exponentY ?? 0, a.exponentY ?? 0);
  const dirZ = dirFromExponent(b.exponentZ ?? 0, a.exponentZ ?? 0);
  const useDirectional = directionalRatioLabels;
  if (dx === 1 && dy === 0 && dz === 0) {
    return useDirectional
      ? formatAxisRatioLabelDirectional(Number(ratioXSelect.value), dirX)
      : formatAxisRatioLabel(Number(ratioXSelect.value));
  }
  if (dx === -1 && dy === 0 && dz === 0) {
    return useDirectional
      ? formatAxisRatioLabelDirectional(Number(ratioXSelect.value), dirX)
      : formatAxisRatioLabel(Number(ratioXSelect.value));
  }
  if (dy === 1 && dx === 0 && dz === 0) {
    return useDirectional
      ? formatAxisRatioLabelDirectional(Number(ratioYSelect.value), dirY)
      : formatAxisRatioLabel(Number(ratioYSelect.value));
  }
  if (dy === -1 && dx === 0 && dz === 0) {
    return useDirectional
      ? formatAxisRatioLabelDirectional(Number(ratioYSelect.value), dirY)
      : formatAxisRatioLabel(Number(ratioYSelect.value));
  }
  if (dz === 1 && dx === 0 && dy === 0) {
    return useDirectional
      ? formatAxisRatioLabelDirectional(Number(ratioZSelect.value), dirZ)
      : formatAxisRatioLabel(Number(ratioZSelect.value));
  }
  if (dz === -1 && dx === 0 && dy === 0) {
    return useDirectional
      ? formatAxisRatioLabelDirectional(Number(ratioZSelect.value), dirZ)
      : formatAxisRatioLabel(Number(ratioZSelect.value));
  }
  return null;
}

function getCustomConnectionLabelText(customNode) {
  if (!customNode) {
    return null;
  }
  const numerator = Number(customNode.factorNumerator);
  const denominator = Number(customNode.factorDenominator);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  return formatIntervalRatio(numerator, denominator);
}

function getEdgeKey(a, b) {
  if (!a || !b) {
    return "";
  }
  const aKey = `${a.exponentX},${a.exponentY},${a.exponentZ || 0}`;
  const bKey = `${b.exponentX},${b.exponentY},${b.exponentZ || 0}`;
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function getLineLabelOverride(a, b) {
  const key = getEdgeKey(a, b);
  if (!key) {
    return null;
  }
  return lineLabelOverrides.has(key) ? lineLabelOverrides.get(key) : null;
}

function getLineLabelPositionOverride(a, b) {
  const key = getEdgeKey(a, b);
  if (!key) {
    return null;
  }
  const value = lineLabelPositionOverrides.get(key);
  return Number.isFinite(value) ? value : null;
}

function setLineLabelPositionOverride(a, b, t) {
  const key = getEdgeKey(a, b);
  if (!key) {
    return;
  }
  const clamped = Math.max(0, Math.min(1, Number(t) || 0.5));
  lineLabelPositionOverrides.set(key, clamped);
}

function shouldShowEdgeLabel(a, b) {
  const override = getLineLabelOverride(a, b);
  return override == null ? showLineLabels : override;
}

function toggleEdgeLabelOverride(a, b) {
  const key = getEdgeKey(a, b);
  if (!key) {
    return;
  }
  const override = getLineLabelOverride(a, b);
  const currentVisible = override == null ? showLineLabels : override;
  const nextVisible = !currentVisible;
  if (nextVisible === showLineLabels) {
    lineLabelOverrides.delete(key);
  } else {
    lineLabelOverrides.set(key, nextVisible);
  }
}

function drawCanvasEdgeSegment({
  start,
  end,
  startRadius,
  endRadius,
  color,
  label,
  labelFont,
  labelWeight,
  labelSize,
  forceLabel = false,
  alpha = 1,
  dash = null,
  lineWidth = 1.5,
  labelT = 0.5,
  labelAvoidNodes = null,
  labelAlpha = null,
}) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  const ux = dx / dist;
  const uy = dy / dist;
  const lineStart = {
    x: start.x + ux * startRadius,
    y: start.y + uy * startRadius,
  };
  const lineEnd = {
    x: end.x - ux * endRadius,
    y: end.y - uy * endRadius,
  };
  const lineLen = Math.max(0, dist - startRadius - endRadius);
  const shouldLabel = Boolean(label);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (dash && dash.length) {
    ctx.setLineDash(dash);
  } else {
    ctx.setLineDash([]);
  }
  if (shouldLabel && lineLen > 0) {
    const labelLines = String(label).split("\n");
    ctx.font = `${labelWeight} ${labelSize}px ${labelFont}`;
    const baseWidth = labelLines.reduce(
      (maxWidth, line) => Math.max(maxWidth, ctx.measureText(line).width),
      0
    );
    const layout = computeEdgeLabelLayoutFromWidth({
      baseSize: labelSize,
      baseWidth,
      lineLen,
      minSize: 4,
    });
    const size = layout.size;
    const gap = layout.gap;
    if (size !== labelSize) {
      ctx.font = `${labelWeight} ${size}px ${labelFont}`;
    }
    const textWidth = labelLines.reduce(
      (maxWidth, line) => Math.max(maxWidth, ctx.measureText(line).width),
      0
    );
    const lineGap = Math.max(2, Math.round(size * 0.25));
    const textHeight = labelLines.length * size + (labelLines.length - 1) * lineGap;
    let clampedT = Math.min(1, Math.max(0, labelT));
    if (Array.isArray(labelAvoidNodes) && labelAvoidNodes.length) {
      const labelRadius = Math.hypot(textWidth / 2 + 6, textHeight / 2 + 4);
      const intersectsNodeAt = (t) => {
        const x = lineStart.x + (lineEnd.x - lineStart.x) * t;
        const y = lineStart.y + (lineEnd.y - lineStart.y) * t;
        for (let i = 0; i < labelAvoidNodes.length; i += 1) {
          const circle = labelAvoidNodes[i];
          const clearance = (Number(circle.r) || 0) + labelRadius;
          if (clearance <= 0) {
            continue;
          }
          if (Math.hypot(x - circle.x, y - circle.y) < clearance) {
            return true;
          }
        }
        return false;
      };
      if (intersectsNodeAt(clampedT)) {
        const step = 0.04;
        const maxSteps = 24;
        let bestT = clampedT;
        for (let i = 1; i <= maxSteps; i += 1) {
          const delta = i * step;
          const left = Math.max(0, clampedT - delta);
          const right = Math.min(1, clampedT + delta);
          if (!intersectsNodeAt(left)) {
            bestT = left;
            break;
          }
          if (!intersectsNodeAt(right)) {
            bestT = right;
            break;
          }
        }
        clampedT = bestT;
      }
    }
    const gapHalf = gap / 2;
    const midX = lineStart.x + (lineEnd.x - lineStart.x) * clampedT;
    const midY = lineStart.y + (lineEnd.y - lineStart.y) * clampedT;
    const gapStart = {
      x: midX - ux * gapHalf,
      y: midY - uy * gapHalf,
    };
    const gapEnd = {
      x: midX + ux * gapHalf,
      y: midY + uy * gapHalf,
    };
    ctx.beginPath();
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(gapStart.x, gapStart.y);
    ctx.moveTo(gapEnd.x, gapEnd.y);
    ctx.lineTo(lineEnd.x, lineEnd.y);
    ctx.stroke();
    let angle = 0;
    if (Math.abs(dx) > 1e-6 || Math.abs(dy) > 1e-6) {
      angle = Math.atan2(dy, dx);
      if (!shouldUseHorizontalText(angle)) {
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
          angle += Math.PI;
        }
      } else {
        angle = 0;
      }
    }
    ctx.save();
    const effectiveLabelAlpha = Number.isFinite(labelAlpha) ? labelAlpha : alpha;
    ctx.globalAlpha = effectiveLabelAlpha;
    const labelNudgeX = Math.max(0.5, size * 0.04);
    const labelNudgeY = Math.max(1, size * 0.14);
    ctx.translate(midX - labelNudgeX, midY - labelNudgeY);
    ctx.rotate(angle);
    ctx.fillStyle = themeColors.textSecondary;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const textStartY = -textHeight / 2;
    labelLines.forEach((line, index) => {
      const y = textStartY + index * (size + lineGap);
      ctx.fillText(line, 0, y);
    });
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(lineEnd.x, lineEnd.y);
    ctx.stroke();
  }
  ctx.restore();
}

function computeEdgeLabelLayoutFromWidth({ baseSize, baseWidth, lineLen, minSize = 4 }) {
  const maxGap = Math.max(0, lineLen - 6);
  let size = baseSize;
  let padding = Math.max(6, Math.round(size * 0.4));
  let textWidth = baseWidth;
  let total = textWidth + padding * 2;
  if (maxGap > 0 && total > maxGap) {
    const scale = Math.max(minSize / size, maxGap / total);
    size *= scale;
    padding = Math.max(2, Math.round(size * 0.4));
    textWidth = baseWidth * (size / baseSize);
    total = textWidth + padding * 2;
  }
  const gap = Math.min(total, maxGap);
  return { size, gap };
}

function getQuadraticPoint(p0, p1, p2, t) {
  const oneMinus = 1 - t;
  const a = oneMinus * oneMinus;
  const b = 2 * oneMinus * t;
  const c = t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x,
    y: a * p0.y + b * p1.y + c * p2.y,
  };
}

function getQuadraticTangent(p0, p1, p2, t) {
  return {
    x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
    y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y),
  };
}

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function splitQuadratic(p0, p1, p2, t) {
  const p01 = lerpPoint(p0, p1, t);
  const p12 = lerpPoint(p1, p2, t);
  const p012 = lerpPoint(p01, p12, t);
  return {
    left: { p0, p1: p01, p2: p012 },
    right: { p0: p012, p1: p12, p2 },
  };
}

function getQuadraticSubcurve(p0, p1, p2, t0, t1) {
  if (t0 <= 0 && t1 >= 1) {
    return { p0, p1, p2 };
  }
  const clampedT0 = Math.max(0, Math.min(1, t0));
  const clampedT1 = Math.max(0, Math.min(1, t1));
  if (clampedT1 <= clampedT0) {
    return null;
  }
  const splitEnd = splitQuadratic(p0, p1, p2, clampedT1);
  const leftCurve = splitEnd.left;
  if (clampedT0 <= 0) {
    return leftCurve;
  }
  const localT = clampedT0 / clampedT1;
  const splitStart = splitQuadratic(leftCurve.p0, leftCurve.p1, leftCurve.p2, localT);
  return splitStart.right;
}

function buildQuadraticCurveInfo(p0, p1, p2, steps = 40) {
  const samples = [];
  let total = 0;
  let prev = getQuadraticPoint(p0, p1, p2, 0);
  samples.push({ t: 0, len: 0, point: prev });
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const point = getQuadraticPoint(p0, p1, p2, t);
    total += Math.hypot(point.x - prev.x, point.y - prev.y);
    samples.push({ t, len: total, point });
    prev = point;
  }
  const tAtLength = (targetLen) => {
    if (!Number.isFinite(targetLen) || targetLen <= 0) {
      return 0;
    }
    if (targetLen >= total) {
      return 1;
    }
    for (let i = 1; i < samples.length; i += 1) {
      if (samples[i].len >= targetLen) {
        const prevSample = samples[i - 1];
        const nextSample = samples[i];
        const span = nextSample.len - prevSample.len || 1;
        const ratio = (targetLen - prevSample.len) / span;
        return prevSample.t + (nextSample.t - prevSample.t) * ratio;
      }
    }
    return 1;
  };
  return {
    total,
    samples,
    tAtRatio: (ratio) => tAtLength(Math.min(1, Math.max(0, ratio)) * total),
    tAtLength,
  };
}

function getNearestQuadraticT(p0, p1, p2, point) {
  const info = buildQuadraticCurveInfo(p0, p1, p2, 50);
  let bestT = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < info.samples.length; i += 1) {
    const sample = info.samples[i];
    const dx = sample.point.x - point.x;
    const dy = sample.point.y - point.y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      bestT = sample.t;
    }
  }
  return bestT;
}


function getAutoDistanceControl(lineStart, lineEnd, nodePosMap, a, b) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const dist = Math.hypot(dx, dy);
  if (!dist) {
    return { x: (lineStart.x + lineEnd.x) / 2, y: (lineStart.y + lineEnd.y) / 2 };
  }
  const ux = dx / dist;
  const uy = dy / dist;
  const perp = { x: -uy, y: ux };
  const padding = 8;
  let axisSteps = 0;
  let isSameAxis = false;
  if (a && b) {
    const sameX = (a.exponentX ?? 0) === (b.exponentX ?? 0);
    const sameY = (a.exponentY ?? 0) === (b.exponentY ?? 0);
    const sameZ = (a.exponentZ ?? 0) === (b.exponentZ ?? 0);
    if (sameY && sameZ) {
      axisSteps = Math.abs((a.exponentX ?? 0) - (b.exponentX ?? 0));
      isSameAxis = true;
    } else if (sameX && sameZ) {
      axisSteps = Math.abs((a.exponentY ?? 0) - (b.exponentY ?? 0));
      isSameAxis = true;
    } else if (sameX && sameY) {
      axisSteps = Math.abs((a.exponentZ ?? 0) - (b.exponentZ ?? 0));
      isSameAxis = true;
    }
  }
  if (axisSteps === 1) {
    return { x: (lineStart.x + lineEnd.x) / 2, y: (lineStart.y + lineEnd.y) / 2 };
  }
  let axisBoost = 1;
  if (axisSteps === 2) {
    axisBoost = 1.8;
  } else if (axisSteps === 3) {
    axisBoost = 2.6;
  } else if (axisSteps >= 4) {
    axisBoost = 3.4;
  }
  let best = null;
  nodePosMap.forEach((entry, nodeId) => {
    if (a && b && (nodeId === a.id || nodeId === b.id)) {
      return;
    }
    const node = nodeById.get(nodeId);
    if (!node || (!node.active && !node.isCenter && !node.isCustom)) {
      return;
    }
    const clearance = entry.radius + padding;
    const distance = distanceToSegment(entry.pos, lineStart, lineEnd);
    if (distance >= clearance) {
      return;
    }
    const severity = clearance - distance;
    if (!best || severity > best.severity) {
      best = { nodePos: entry.pos, severity, clearance };
    }
  });
  if (!best && !isSameAxis) {
    return { x: (lineStart.x + lineEnd.x) / 2, y: (lineStart.y + lineEnd.y) / 2 };
  }
  const bestSide = best
    ? Math.sign(dx * (best.nodePos.y - lineStart.y) - dy * (best.nodePos.x - lineStart.x)) || 1
    : 1;
  const paritySide = axisSteps % 2 === 0 ? 1 : -1;
  const side = isSameAxis && axisSteps > 1 ? paritySide : bestSide;
  const baseSeverity = best ? best.severity + padding : padding;
  const magnitude = Math.min(dist * 0.5, baseSeverity * axisBoost);
  return {
    x: (lineStart.x + lineEnd.x) / 2 + perp.x * magnitude * side,
    y: (lineStart.y + lineEnd.y) / 2 + perp.y * magnitude * side,
  };
}

function getShapeEdgeRadius(shape, ux, uy, radius) {
  if (shape === "none") {
    return radius;
  }
  if (shape === "circle") {
    return radius;
  }
  if (shape === "diamond") {
    const denom = Math.abs(ux) + Math.abs(uy);
    return denom > 0 ? radius / denom : radius;
  }
  if (shape === "square") {
    const denom = Math.max(Math.abs(ux), Math.abs(uy));
    return denom > 0 ? radius / denom : radius;
  }
  const vertices = [];
  if (shape === "square") {
    vertices.push([radius, radius], [-radius, radius], [-radius, -radius], [radius, -radius]);
  } else if (shape === "diamond") {
    vertices.push([0, -radius], [radius, 0], [0, radius], [-radius, 0]);
  } else if (shape === "triangle") {
    const height = radius * 1.2;
    vertices.push([0, -height], [radius, height * 0.6], [-radius, height * 0.6]);
  } else {
    return radius;
  }
  let best = Infinity;
  const count = vertices.length;
  for (let i = 0; i < count; i += 1) {
    const [x1, y1] = vertices[i];
    const [x2, y2] = vertices[(i + 1) % count];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const denom = ux * dy - uy * dx;
    if (Math.abs(denom) < 1e-9) {
      continue;
    }
    const t = (x1 * dy - y1 * dx) / denom;
    const s = (ux * y1 - uy * x1) / denom;
    if (t >= 0 && s >= 0 && s <= 1) {
      best = Math.min(best, t);
    }
  }
  return Number.isFinite(best) ? best : radius;
}

function getNodeEdgeRadius(node, ux, uy, radius) {
  if (!Number.isFinite(ux) || !Number.isFinite(uy)) {
    return radius;
  }
  const shape = layoutMode ? getLayoutNodeShape(node) : node.isCustom ? "diamond" : "circle";
  return getShapeEdgeRadius(shape, ux, uy, radius);
}

function hasSelectedDistanceEdgeBetweenNodes(a, b) {
  if (!a || !b || !distanceSelectedEdges.size) {
    return false;
  }
  const aKey = getDistanceNodeKey(a);
  const bKey = getDistanceNodeKey(b);
  if (!aKey || !bKey || aKey === bKey) {
    return false;
  }
  return distanceSelectedEdges.has(getDistanceEdgeKey(aKey, bKey));
}

function draw3DEdges(nodePosMap, axisEntry = null) {
  const labelFont = layoutRatioFont;
  const labelWeight = layoutRatioFontWeight;
  const labelSize = Math.max(10, Math.round(layoutRatioTextSize * 0.6));
  const axisActive = Boolean(axisEntry);
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(a, b)) {
      return;
    }
    const startEntry = nodePosMap && nodePosMap.get(a.id);
    const endEntry = nodePosMap && nodePosMap.get(b.id);
    const start = startEntry ? startEntry.pos : worldToScreen(a.coordinate);
    const end = endEntry ? endEntry.pos : worldToScreen(b.coordinate);
    const radiusA = startEntry
      ? startEntry.radius
      : getNodeRadius(a) * (start.scale || 1);
    const radiusB = endEntry
      ? endEntry.radius
      : getNodeRadius(b) * (end.scale || 1);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, radiusA);
    const endRadius = getNodeEdgeRadius(b, ux, uy, radiusB);
    let color = AXIS_EDGE_COLORS.x;
    if (a.gridY !== b.gridY) {
      color = AXIS_EDGE_COLORS.y;
    } else if (a.gridZ !== b.gridZ) {
      color = AXIS_EDGE_COLORS.z;
    }
    const labelText = getEdgeLabelText(a, b);
    const label = shouldShowEdgeLabel(a, b) ? labelText : null;
    const labelT = getLineLabelPositionOverride(a, b) ?? 0.5;
    const edgeAlpha =
      axisActive && !isEdgeOnAxisEntry(a, b, axisEntry) ? AXIS_DIM_FACTOR : 1;
    drawCanvasEdgeSegment({
      start,
      end,
      startRadius,
      endRadius,
      color,
      label,
      labelFont,
      labelWeight,
      labelSize,
      labelT,
      alpha: edgeAlpha,
    });
  });
}

function colorWithAlpha(color, alpha) {
  const clamped = Math.max(0, Math.min(1, alpha));
  if (!color || typeof color !== "string") {
    return `rgba(255, 255, 255, ${clamped})`;
  }
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    if (hex.length === 6) {
      const value = parseInt(hex, 16);
      const r = (value >> 16) & 255;
      const g = (value >> 8) & 255;
      const b = value & 255;
      return `rgba(${r}, ${g}, ${b}, ${clamped})`;
    }
  }
  const match = color.match(/rgba?\(([^)]+)\)/i);
  if (match) {
    const parts = match[1].split(",").map((part) => part.trim());
    const r = Number(parts[0]) || 0;
    const g = Number(parts[1]) || 0;
    const b = Number(parts[2]) || 0;
    return `rgba(${r}, ${g}, ${b}, ${clamped})`;
  }
  return color;
}

function getCubeFill(pos, radius, baseFill, shadowColor, highlightColor, lightDir) {
  const lx = lightDir.x;
  const ly = lightDir.y;
  const length = Math.hypot(lx, ly) || 1;
  const ux = lx / length;
  const uy = ly / length;
  const startX = pos.x + ux * radius;
  const startY = pos.y + uy * radius;
  const endX = pos.x - ux * radius;
  const endY = pos.y - uy * radius;
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, highlightColor);
  gradient.addColorStop(0.55, baseFill);
  gradient.addColorStop(1, shadowColor);
  return gradient;
}

function getSphereFill(pos, radius, baseFill, shadowColor, highlightColor, lightDir) {
  const lx = pos.x + lightDir.x * radius * 0.7;
  const ly = pos.y + lightDir.y * radius * 0.7;
  const gradient = ctx.createRadialGradient(lx, ly, radius * 0.2, pos.x, pos.y, radius);
  gradient.addColorStop(0, highlightColor);
  gradient.addColorStop(0.45, baseFill);
  gradient.addColorStop(1, shadowColor);
  return gradient;
}

function drawNodeShapePath(shape, x, y, radius) {
  if (shape === "square") {
    ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
    return;
  }
  if (shape === "triangle") {
    const height = radius * 1.2;
    ctx.moveTo(x, y - height);
    ctx.lineTo(x + radius, y + height * 0.6);
    ctx.lineTo(x - radius, y + height * 0.6);
    ctx.closePath();
    return;
  }
  if (shape === "diamond") {
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius, y);
    ctx.closePath();
    return;
  }
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

function drawAxisArrow(x1, y1, x2, y2) {
  const headLength = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}

function hasActiveAxis(axis) {
  const key =
    axis === "x" ? "exponentX" : axis === "y" ? "exponentY" : "exponentZ";
  return nodes.some((node) => node.active && Number(node[key]) !== 0);
}

function nodeHasHighPrime(node) {
  if (!node) {
    return false;
  }
  const axes = [
    { ratio: Number(ratioXSelect.value), exp: Number(node.exponentX) || 0 },
    { ratio: Number(ratioYSelect.value), exp: Number(node.exponentY) || 0 },
    { ratio: Number(ratioZSelect.value), exp: Number(node.exponentZ) || 0 },
  ];
  return axes.some((axis) => axis.exp && axis.ratio >= 53);
}

function getAxisLegendSettings() {
  const margin = 36;
  const fontSize = Math.max(10, Math.round(layoutAxisLegendTextSize));
  const xRatio = Number(ratioXSelect.value) || 3;
  const yRatio = Number(ratioYSelect.value) || 5;
  const zRatio = Number(ratioZSelect.value) || 7;
  const xReduced = reduceToOctave(xRatio, 1);
  const yReduced = reduceToOctave(yRatio, 1);
  const zReduced = reduceToOctave(zRatio, 1);
  const xLabel = `${xReduced.numerator}:${xReduced.denominator}`;
  const yLabel = `${yReduced.numerator}:${yReduced.denominator}`;
  const zLabel = `${zReduced.numerator}:${zReduced.denominator}`;
  const disableScale = shouldDisableLayoutScale();
  const origin = worldToScreen({ x: 0, y: 0, z: 0 }, disableScale);
  const xAxisPoint = worldToScreen({ x: GRID_SPACING, y: 0, z: 0 }, disableScale);
  const yAxisPoint = worldToScreen({ x: 0, y: GRID_SPACING, z: 0 }, disableScale);
  const zAxisPoint = worldToScreen({ x: 0, y: 0, z: GRID_SPACING }, disableScale);
  const xVec = { x: xAxisPoint.x - origin.x, y: xAxisPoint.y - origin.y };
  const yVec = { x: yAxisPoint.x - origin.x, y: yAxisPoint.y - origin.y };
  const zVec = { x: zAxisPoint.x - origin.x, y: zAxisPoint.y - origin.y };
  const xLen = Math.hypot(xVec.x, xVec.y) || 1;
  const yLen = Math.hypot(yVec.x, yVec.y) || 1;
  const zLen = Math.hypot(zVec.x, zVec.y) || 1;
  const xDir = { x: xVec.x / xLen, y: xVec.y / xLen };
  const yDir = { x: yVec.x / yLen, y: yVec.y / yLen };
  const zDir = { x: zVec.x / zLen, y: zVec.y / zLen };
  return {
    margin,
    fontSize,
    xLabel,
    yLabel,
    zLabel,
    xDir,
    yDir,
    zDir,
  };
}

function getLayoutLineLabelSize() {
  return Math.max(8, Math.round(layoutLineLabelTextSize));
}

const VERTICAL_TEXT_THRESHOLD = (15 * Math.PI) / 180;

function shouldUseHorizontalText(angle) {
  return Math.abs(Math.abs(angle) - Math.PI / 2) <= VERTICAL_TEXT_THRESHOLD;
}

function getAxisLegendAngle(dir, centerX = null, pageCenterX = null) {
  let angle = Math.atan2(dir.y, dir.x);
  if (shouldUseHorizontalText(angle)) {
    return 0;
  }
  if (angle > Math.PI / 2) {
    angle -= Math.PI;
  } else if (angle < -Math.PI / 2) {
    angle += Math.PI;
  }
  return angle;
}

function getAxisLegendInfo(axis, settings = getAxisLegendSettings()) {
  if (!layoutMode || !hasActiveAxis(axis) || layoutAxisHidden[axis]) {
    return null;
  }
  const { left, top, width, height } = getLayoutPageRect();
  const pageCenterX = left + width / 2;
  const offset = layoutAxisOffsets[axis] || { x: 0, y: 0 };
  let center = { x: left + width / 2, y: top + height - settings.margin };
  let label = settings.xLabel;
  let dir = settings.xDir;
  if (axis === "y") {
    center = { x: left + width - settings.margin, y: top + height / 2 };
    label = settings.yLabel;
    dir = settings.yDir;
  } else if (axis === "z") {
    center = { x: left + settings.margin, y: top + height / 2 };
    label = settings.zLabel;
    dir = settings.zDir;
  }
  center = { x: center.x + offset.x, y: center.y + offset.y };
  const overrideAngle = layoutAxisAngles[axis];
  if (Number.isFinite(overrideAngle)) {
    dir = { x: Math.cos(overrideAngle), y: Math.sin(overrideAngle) };
  }
  ctx.save();
  ctx.font = `${layoutAxisLegendFontWeight} ${settings.fontSize}px ${layoutAxisLegendFont}`;
  const labelWidth = ctx.measureText(label).width;
  ctx.restore();
  const gap = Math.max(28, labelWidth + 16);
  const segLen = 20;
  const gapVec = { x: dir.x * (gap / 2), y: dir.y * (gap / 2) };
  const segVec = { x: dir.x * segLen, y: dir.y * segLen };
  const textAngle = getAxisLegendAngle(dir, center.x, pageCenterX);
  return {
    axis,
    center,
    label,
    dir,
    gapVec,
    segVec,
    fontSize: settings.fontSize,
    textAngle,
    leftEnd: {
      x: center.x - gapVec.x - segVec.x,
      y: center.y - gapVec.y - segVec.y,
    },
    rightEnd: {
      x: center.x + gapVec.x + segVec.x,
      y: center.y + gapVec.y + segVec.y,
    },
  };
}

function drawLayoutAxisLegend(axis, { showHandles = false } = {}) {
  const info = getAxisLegendInfo(axis);
  if (!info) {
    return;
  }
  drawAxisArrow(
    info.center.x - info.gapVec.x,
    info.center.y - info.gapVec.y,
    info.leftEnd.x,
    info.leftEnd.y
  );
  drawAxisArrow(
    info.center.x + info.gapVec.x,
    info.center.y + info.gapVec.y,
    info.rightEnd.x,
    info.rightEnd.y
  );
  ctx.save();
  ctx.translate(info.center.x, info.center.y);
  ctx.rotate(info.textAngle);
  ctx.fillText(info.label, 0, 0);
  ctx.restore();
  if (showHandles) {
    const handleRadius = Math.max(8, Math.round(info.fontSize * 0.55));
    ctx.save();
    ctx.fillStyle = themeColors.textSecondary;
    ctx.beginPath();
    ctx.arc(info.leftEnd.x, info.leftEnd.y, handleRadius, 0, Math.PI * 2);
    ctx.arc(info.rightEnd.x, info.rightEnd.y, handleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawLayoutAxes() {
  const { fontSize } = getAxisLegendSettings();

  ctx.save();
  ctx.strokeStyle = themeColors.textSecondary;
  ctx.fillStyle = themeColors.textSecondary;
  ctx.lineWidth = 1.5;
  ctx.font = `${layoutAxisLegendFontWeight} ${fontSize}px ${layoutAxisLegendFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (hasActiveAxis("x")) {
    drawLayoutAxisLegend("x", { showHandles: layoutAxisEdit === "x" });
  }

  if (hasActiveAxis("y")) {
    drawLayoutAxisLegend("y", { showHandles: layoutAxisEdit === "y" });
  }

  if (hasActiveAxis("z")) {
    drawLayoutAxisLegend("z", { showHandles: layoutAxisEdit === "z" });
  }

  ctx.restore();
}

function drawLayoutPage({ drawAxes = true } = {}) {
  const { left, top, width, height } = getLayoutPageRect();
  ctx.save();
  ctx.shadowColor = themeColors.pageShadow;
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = themeColors.page;
  ctx.fillRect(left, top, width, height);
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.strokeStyle = themeColors.pageBorder;
  ctx.lineWidth = 1;
  ctx.strokeRect(left, top, width, height);

  if (layoutTitle) {
    const titleSize = Math.max(12, Math.round(layoutTitleSize));
    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = `${layoutTitleFontWeight} ${titleSize}px ${layoutTitleFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const titlePos = getLayoutTitlePosition();
    ctx.fillText(layoutTitle, titlePos.x, titlePos.y);
  }
  if (layoutCreator) {
    const creatorSize = getLayoutCreatorSize();
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = `${layoutCreatorFontWeight} ${creatorSize}px ${layoutCreatorFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const creatorPos = getLayoutCreatorPosition();
    ctx.fillText(layoutCreator, creatorPos.x, creatorPos.y);
  }

  if (drawAxes) {
    drawLayoutAxes();
  }

  drawLayoutCustomLabels();

  ctx.restore();
}

function scheduleDraw() {
  if (drawPending) {
    return;
  }
  drawPending = true;
  requestAnimationFrame(() => {
    drawPending = false;
    draw();
  });
}

function drawDistanceConnections(nodePosMap) {
  if (!distanceSelectedEdges.size) {
    distanceEdges.length = 0;
    distanceSelectedNodeKeys.clear();
    return;
  }
  distanceEdges.length = 0;
  const selectedEdges = [];
  const resolvedEdges = new Set();
  const resolvedNodeKeys = new Set();
  distanceSelectedEdges.forEach((edgeKey) => {
    if (!edgeKey) {
      return;
    }
    const parts = edgeKey.split("|");
    if (parts.length !== 2) {
      return;
    }
    const [aKey, bKey] = parts;
    const a = getNodeByDistanceKey(aKey);
    const b = getNodeByDistanceKey(bKey);
    if (!a || !b || !a.active || !b.active) {
      return;
    }
    resolvedEdges.add(edgeKey);
    resolvedNodeKeys.add(aKey);
    resolvedNodeKeys.add(bKey);
    selectedEdges.push({ a, b, aKey, bKey, edgeKey });
  });
  distanceSelectedNodeKeys.clear();
  resolvedNodeKeys.forEach((key) => distanceSelectedNodeKeys.add(key));
  if (!selectedEdges.length) {
    return;
  }
  const labelFont = layoutMode
    ? layoutLineLabelFont
    : is3DMode
    ? layoutRatioFont
    : "Noto Serif";
  const labelWeight = layoutMode
    ? layoutLineLabelFontWeight
    : is3DMode
    ? layoutRatioFontWeight
    : 400;
  const labelSize = layoutMode
    ? getLayoutLineLabelSize()
    : is3DMode
    ? Math.max(10, Math.round(layoutRatioTextSize * 0.6))
    : EDGE_LABEL_SIZE_DEFAULT;
  for (let i = 0; i < selectedEdges.length; i += 1) {
    const { a, b, aKey, bKey, edgeKey } = selectedEdges[i];
    const startEntry = nodePosMap.get(a.id);
    if (!startEntry) {
      continue;
    }
    const endEntry = nodePosMap.get(b.id);
    if (!endEntry) {
      continue;
    }
    const override = getDistanceEdgeOverride(edgeKey);
    if (override && override.hidden) {
      continue;
    }
    const dimOthers = false;
    const ratioInfo = getDistanceRatioLabel(a, b);
    if (!ratioInfo) {
      continue;
    }
    const showName = !override || override.showName !== false;
    const customText =
      override && typeof override.customText === "string" ? override.customText.trim() : "";
    const commaName = showName
      ? getDistanceCommaName(ratioInfo.numerator, ratioInfo.denominator)
      : "";
    const baseLabel = showName
      ? customText
        ? `${ratioInfo.label} ${customText}`
        : ratioInfo.label
      : customText;
    const label =
      baseLabel && commaName && showName ? `${baseLabel} (${commaName})` : baseLabel;
    if (!label) {
      continue;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      continue;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const straightStartRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const straightEndRadius = getNodeEdgeRadius(b, -ux, -uy, endEntry.radius);
    let lineStart = {
      x: start.x + ux * straightStartRadius,
      y: start.y + uy * straightStartRadius,
    };
    let lineEnd = {
      x: end.x - ux * straightEndRadius,
      y: end.y - uy * straightEndRadius,
    };
    const autoControl = getAutoDistanceControl(lineStart, lineEnd, nodePosMap, a, b);
    const defaultControl = autoControl;
    let controlOffset = override && override.controlOffset ? override.controlOffset : null;
    if (!controlOffset && override && override.control) {
      controlOffset = {
        x: override.control.x - defaultControl.x,
        y: override.control.y - defaultControl.y,
      };
    }
    const control = controlOffset
      ? { x: defaultControl.x + controlOffset.x, y: defaultControl.y + controlOffset.y }
      : defaultControl;
    const startVector = { x: control.x - start.x, y: control.y - start.y };
    const endVector = { x: control.x - end.x, y: control.y - end.y };
    const startLen = Math.hypot(startVector.x, startVector.y);
    const endLen = Math.hypot(endVector.x, endVector.y);
    const startUx = startLen > 0 ? startVector.x / startLen : ux;
    const startUy = startLen > 0 ? startVector.y / startLen : uy;
    const endUx = endLen > 0 ? endVector.x / endLen : -ux;
    const endUy = endLen > 0 ? endVector.y / endLen : -uy;
    const startRadius = getNodeEdgeRadius(a, startUx, startUy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, endUx, endUy, endEntry.radius);
    lineStart = {
      x: start.x + startUx * startRadius,
      y: start.y + startUy * startRadius,
    };
    lineEnd = {
      x: end.x + endUx * endRadius,
      y: end.y + endUy * endRadius,
    };
    const labelT = override && Number.isFinite(override.labelT) ? override.labelT : 0.5;
    const curveInfo = buildQuadraticCurveInfo(lineStart, control, lineEnd);
    const t = curveInfo.tAtRatio(labelT);
    const labelPos = getQuadraticPoint(lineStart, control, lineEnd, t);
    const tangent = getQuadraticTangent(lineStart, control, lineEnd, t);
    distanceEdges.push({
      a,
      b,
      key: edgeKey,
      lineStart,
      lineEnd,
      defaultControl,
      control,
      curveInfo,
      label,
      labelFont,
      labelWeight,
      labelSize,
      labelT,
      labelPos,
      tangent,
    });
    ctx.save();
    ctx.font = `${labelWeight} ${labelSize}px ${labelFont}`;
    const baseWidth = ctx.measureText(label).width;
    let angle = 0;
    let useHorizontal = false;
    if (Math.abs(tangent.x) > 1e-6 || Math.abs(tangent.y) > 1e-6) {
      angle = Math.atan2(tangent.y, tangent.x);
      useHorizontal = shouldUseHorizontalText(angle);
      if (!useHorizontal) {
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
          angle += Math.PI;
        }
      } else {
        angle = 0;
      }
    }
    const gapWidth = useHorizontal ? labelSize * 0.9 : baseWidth;
    const layout = computeEdgeLabelLayoutFromWidth({
      baseSize: labelSize,
      baseWidth: gapWidth,
      lineLen: curveInfo.total,
      minSize: 4,
    });
    const size = layout.size;
    const gap = layout.gap;
    ctx.restore();

    const gapHalf = gap / 2;
    const labelArcLen = curveInfo.total * Math.min(1, Math.max(0, labelT));
    const tLeft = curveInfo.tAtLength(labelArcLen - gapHalf);
    const tRight = curveInfo.tAtLength(labelArcLen + gapHalf);

    const leftSegment = getQuadraticSubcurve(lineStart, control, lineEnd, 0, tLeft);
    const rightSegment = getQuadraticSubcurve(lineStart, control, lineEnd, tRight, 1);
    ctx.save();
    ctx.strokeStyle = themeColors.edge;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 1;
    ctx.setLineDash([6, 6]);
    if (leftSegment) {
      ctx.beginPath();
      ctx.moveTo(leftSegment.p0.x, leftSegment.p0.y);
      ctx.quadraticCurveTo(leftSegment.p1.x, leftSegment.p1.y, leftSegment.p2.x, leftSegment.p2.y);
      ctx.stroke();
    }
    if (rightSegment) {
      ctx.beginPath();
      ctx.moveTo(rightSegment.p0.x, rightSegment.p0.y);
      ctx.quadraticCurveTo(
        rightSegment.p1.x,
        rightSegment.p1.y,
        rightSegment.p2.x,
        rightSegment.p2.y
      );
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.font = `${labelWeight} ${size}px ${labelFont}`;
    ctx.translate(labelPos.x, labelPos.y);
    ctx.rotate(angle);
    ctx.fillStyle = themeColors.textSecondary;
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }
}

function drawDistanceDragPreview(nodePosMap) {
  if (!distanceSelectMode || !analysisLayers.distances || !distanceSelectDrag) {
    return;
  }
  const startNode = nodeById.get(distanceSelectDrag.startNodeId);
  if (!startNode) {
    return;
  }
  const startEntry = nodePosMap.get(startNode.id);
  if (!startEntry) {
    return;
  }
  let endPoint = distanceSelectDrag.lastPoint;
  let endNode = null;
  let endEntry = null;
  if (distanceSelectDrag.hoverNodeId != null) {
    endNode = nodeById.get(distanceSelectDrag.hoverNodeId);
    if (endNode) {
      endEntry = nodePosMap.get(endNode.id);
      if (endEntry) {
        endPoint = endEntry.pos;
      }
    }
  }
  if (!endPoint) {
    return;
  }
  const start = startEntry.pos;
  const end = endPoint;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  if (!dist) {
    return;
  }
  const ux = dx / dist;
  const uy = dy / dist;
  const startRadius = getNodeEdgeRadius(startNode, ux, uy, startEntry.radius);
  const endRadius =
    endNode && endEntry ? getNodeEdgeRadius(endNode, -ux, -uy, endEntry.radius) : 0;
  const lineStart = { x: start.x + ux * startRadius, y: start.y + uy * startRadius };
  const lineEnd = { x: end.x - ux * endRadius, y: end.y - uy * endRadius };
  ctx.save();
  ctx.strokeStyle = DISTANCE_RING_COLOR;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 6]);
  ctx.beginPath();
  ctx.moveTo(lineStart.x, lineStart.y);
  ctx.lineTo(lineEnd.x, lineEnd.y);
  ctx.stroke();
  ctx.restore();
}

function buildCommaConnections(nodePosMap) {
  commaEdges.length = 0;
  commaNodeRings.clear();
  if (!commaEntries.length) {
    return;
  }
  const seenConnections = new Set();
  const activeNodes = nodes.filter((node) => node.active);
  for (let i = 0; i < activeNodes.length; i += 1) {
    const a = activeNodes[i];
    const aNum = Number(a.numerator);
    const aDen = Number(a.denominator);
    if (!Number.isFinite(aNum) || !Number.isFinite(aDen) || aDen === 0) {
      continue;
    }
    for (let j = i + 1; j < activeNodes.length; j += 1) {
      const b = activeNodes[j];
      const bNum = Number(b.numerator);
      const bDen = Number(b.denominator);
      if (!Number.isFinite(bNum) || !Number.isFinite(bDen) || bDen === 0) {
        continue;
      }
      const ratioInfo = getDistanceRatioLabel(a, b);
      if (!ratioInfo) {
        continue;
      }
      const normalized = normalizeCommaRatio(ratioInfo.numerator, ratioInfo.denominator);
      if (!normalized) {
        continue;
      }
      const key = `${normalized.numerator}:${normalized.denominator}`;
      const matches = commaRatioMap.get(key);
      if (!matches || !matches.length) {
        continue;
      }
      matches.forEach((entry) => {
        const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
        const nameKey = String(entry.name || "")
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();
        const connectionKey = `${pairKey}|${nameKey}`;
        if (seenConnections.has(connectionKey)) {
          return;
        }
        seenConnections.add(connectionKey);
        commaEdges.push({ a, b, entry });
        [a.id, b.id].forEach((nodeId) => {
          if (!commaNodeRings.has(nodeId)) {
            commaNodeRings.set(nodeId, []);
          }
          const list = commaNodeRings.get(nodeId);
          if (!list.find((ring) => ring.name === entry.name)) {
            list.push({ name: entry.name, color: entry.color });
          }
        });
      });
    }
  }
  commaNodeRings.forEach((rings) => {
    rings.sort((left, right) => left.name.localeCompare(right.name));
  });
}

function drawCommaConnections(nodePosMap) {
  buildCommaConnections(nodePosMap);
  if (!commaEdges.length) {
    return;
  }
  const aggregatedEdges = new Map();
  commaEdges.forEach(({ a, b, entry }) => {
    if (!a || !b || !entry) {
      return;
    }
    const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
    if (!aggregatedEdges.has(pairKey)) {
      aggregatedEdges.set(pairKey, {
        a,
        b,
        color: entry.color,
        labels: [],
      });
    }
    const aggregate = aggregatedEdges.get(pairKey);
    const name = String(entry.name || "").trim();
    if (name && !aggregate.labels.includes(name)) {
      aggregate.labels.push(name);
    }
  });
  const labelAvoidNodes = [];
  nodePosMap.forEach((entry, nodeId) => {
    if (!entry || !entry.pos || !entry.pos.visible) {
      return;
    }
    const node = nodeById.get(nodeId);
    if (!node || (!node.active && !node.isCenter && !node.isCustom)) {
      return;
    }
    labelAvoidNodes.push({
      x: entry.pos.x,
      y: entry.pos.y,
      r: entry.radius,
    });
  });
  const activeFocusNodeIds = new Set(microtonalSelectedNodeIds);
  if (Number.isFinite(hoverNodeId)) {
    activeFocusNodeIds.add(hoverNodeId);
  }
  const hasFocus = activeFocusNodeIds.size > 0;
  const preferredSourceId = activeFocusNodeIds.size === 1 ? Array.from(activeFocusNodeIds)[0] : null;
  const labelFont = layoutMode
    ? layoutLineLabelFont
    : is3DMode
    ? layoutRatioFont
    : "Noto Serif";
  const labelWeight = layoutMode
    ? layoutLineLabelFontWeight
    : is3DMode
    ? layoutRatioFontWeight
    : 400;
  const labelSize = layoutMode
    ? getLayoutLineLabelSize()
    : is3DMode
    ? Math.max(10, Math.round(layoutRatioTextSize * 0.6))
    : EDGE_LABEL_SIZE_DEFAULT;
  aggregatedEdges.forEach(({ a, b, color, labels }) => {
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
    const isFocused = hasFocus
      ? activeFocusNodeIds.has(a.id) || activeFocusNodeIds.has(b.id)
      : false;
    const alpha = hasFocus
      ? isFocused
        ? 1
        : 0.1
      : 0.1;
    drawCanvasEdgeSegment({
      start,
      end,
      startRadius,
      endRadius,
      color,
      label: isFocused ? labels.join("\n") : null,
      labelFont,
      labelWeight,
      labelSize,
      alpha: alpha * 0.4,
      lineWidth: 3,
      labelAlpha: 1,
      // In focused-node mode, place labels near the destination node.
      labelT:
        preferredSourceId != null
          ? a.id === preferredSourceId
            ? 0.75
            : b.id === preferredSourceId
            ? 0.25
            : 0.5
          : 0.5,
      labelAvoidNodes,
    });
  });
}

function drawCustomConnections(nodePosMap) {
  if (!customNodes.length) {
    return;
  }
  const edgeOutset = 1;
  const labelFont = layoutMode
    ? layoutLineLabelFont
    : is3DMode
    ? layoutRatioFont
    : "Noto Serif";
  const labelWeight = layoutMode
    ? layoutLineLabelFontWeight
    : is3DMode
    ? layoutRatioFontWeight
    : 400;
  const labelSize = layoutMode
    ? getLayoutLineLabelSize()
    : is3DMode
    ? Math.max(10, Math.round(layoutRatioTextSize * 0.6))
    : 14;
  const axisEntry = getActiveAxisEntry();
  const axisActive = Boolean(axisEntry);
  customNodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    const source = nodeById.get(node.sourceNodeId);
    if (!source) {
      return;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(source, node)) {
      return;
    }
    const startEntry = nodePosMap.get(source.id);
    const endEntry = nodePosMap.get(node.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = Math.max(
      0,
      getNodeEdgeRadius(source, ux, uy, startEntry.radius) + edgeOutset
    );
    const customEdgeInset = Math.max(0, Math.round(endEntry.radius * 0.03));
    const endRadius = Math.max(
      0,
      getNodeEdgeRadius(node, ux, uy, endEntry.radius) + edgeOutset - customEdgeInset
    );
    const connectionAlpha =
      (axisActive && !isEdgeOnAxisEntry(source, node, axisEntry) ? AXIS_DIM_FACTOR : 1) *
      (analysisLayers.microtonal ? 0.18 : 1);
    const labelText = getCustomConnectionLabelText(node);
    const label = shouldShowEdgeLabel(source, node) ? labelText : null;
    const labelT = getLineLabelPositionOverride(source, node) ?? 0.5;
    drawCanvasEdgeSegment({
      start,
      end,
      startRadius,
      endRadius,
      color: themeColors.edge,
      label,
      labelFont,
      labelWeight,
      labelSize,
      labelT,
      alpha: connectionAlpha,
    });
  });
}

function addCustomConnectionSegments(nodePosMap, segments) {
  if (!customNodes.length) {
    return;
  }
  const edgeOutset = 1;
  customNodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    const source = nodeById.get(node.sourceNodeId);
    if (!source) {
      return;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(source, node)) {
      return;
    }
    const startEntry = nodePosMap.get(source.id);
    const endEntry = nodePosMap.get(node.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = Math.max(
      0,
      getNodeEdgeRadius(source, ux, uy, startEntry.radius) + edgeOutset
    );
    const customEdgeInset = Math.max(0, Math.round(endEntry.radius * 0.03));
    const endRadius = Math.max(
      0,
      getNodeEdgeRadius(node, ux, uy, endEntry.radius) + edgeOutset - customEdgeInset
    );
    segments.push({
      x1: start.x + ux * startRadius,
      y1: start.y + uy * startRadius,
      x2: end.x - ux * endRadius,
      y2: end.y - uy * endRadius,
    });
  });
}

function addTriangleDiagonalSegments(nodePosMap, segments) {
  ensureAutoTriangleDiagonals();
  if (!triangleDiagonals.size && !autoTriangleDiagonals.size) {
    return;
  }
  const gridMap = getActiveGridNodeMap();
  forEachEffectiveTriangleDiagonal((entry) => {
    const { a, b } = getTriangleDiagonalNodes(entry, gridMap);
    if (!a || !b) {
      return;
    }
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    segments.push({
      x1: start.x + ux * startRadius,
      y1: start.y + uy * startRadius,
      x2: end.x - ux * endRadius,
      y2: end.y - uy * endRadius,
    });
  });
}

function addDistanceLineSegments(nodePosMap, segments) {
  if (!analysisLayers.distances || !distanceSelectedEdges.size) {
    return;
  }
  for (const edgeKey of distanceSelectedEdges) {
    if (!edgeKey) {
      continue;
    }
    const partsKey = edgeKey.split("|");
    if (partsKey.length !== 2) {
      continue;
    }
    const [aKey, bKey] = partsKey;
    const a = getNodeByDistanceKey(aKey);
    const b = getNodeByDistanceKey(bKey);
    if (!a || !b || !a.active || !b.active) {
      continue;
    }
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      continue;
    }
    const override = getDistanceEdgeOverride(edgeKey);
    if (override && override.hidden) {
      continue;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      continue;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const straightStartRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const straightEndRadius = getNodeEdgeRadius(b, -ux, -uy, endEntry.radius);
    let lineStart = {
      x: start.x + ux * straightStartRadius,
      y: start.y + uy * straightStartRadius,
    };
    let lineEnd = {
      x: end.x - ux * straightEndRadius,
      y: end.y - uy * straightEndRadius,
    };
    const autoControl = getAutoDistanceControl(lineStart, lineEnd, nodePosMap, a, b);
    const defaultControl = { x: autoControl.x, y: autoControl.y };
    let controlOffset = override && override.controlOffset ? override.controlOffset : null;
    if (!controlOffset && override && override.control) {
      controlOffset = {
        x: override.control.x - defaultControl.x,
        y: override.control.y - defaultControl.y,
      };
    }
    const control = controlOffset
      ? { x: defaultControl.x + controlOffset.x, y: defaultControl.y + controlOffset.y }
      : defaultControl;
    const startVector = { x: control.x - lineStart.x, y: control.y - lineStart.y };
    const endVector = { x: control.x - lineEnd.x, y: control.y - lineEnd.y };
    const startLen = Math.hypot(startVector.x, startVector.y);
    const endLen = Math.hypot(endVector.x, endVector.y);
    const startUx = startLen > 0 ? startVector.x / startLen : ux;
    const startUy = startLen > 0 ? startVector.y / startLen : uy;
    const endUx = endLen > 0 ? endVector.x / endLen : -ux;
    const endUy = endLen > 0 ? endVector.y / endLen : -uy;
    const startRadius = getNodeEdgeRadius(a, startUx, startUy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, endUx, endUy, endEntry.radius);
    lineStart = {
      x: start.x + startUx * startRadius,
      y: start.y + startUy * startRadius,
    };
    lineEnd = {
      x: end.x + endUx * endRadius,
      y: end.y + endUy * endRadius,
    };
    segments.push({ x1: lineStart.x, y1: lineStart.y, x2: control.x, y2: control.y });
    segments.push({ x1: control.x, y1: control.y, x2: lineEnd.x, y2: lineEnd.y });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  layoutRenderedNoteLabelHitboxes.clear();

  if (!themeColors) {
    refreshThemeColors();
  }
  const distanceFocusMode = distanceSelectMode && analysisLayers.distances;
  if (layoutMode) {
    drawLayoutPage({ drawAxes: !layoutAxisEdit });
  }

  const disableScale = shouldDisableLayoutScale();
  const nodeRenderList = nodes
    .map((node) => ({
      node,
      pos: worldToScreen(getNodeDisplayCoordinate(node), disableScale),
    }))
    .sort((a, b) => {
      if (a.node.isCustom && !b.node.isCustom) {
        return 1;
      }
      if (!a.node.isCustom && b.node.isCustom) {
        return -1;
      }
      return a.pos.depth - b.pos.depth;
    });
  const nodePosMap = new Map();
  nodeRenderList.forEach(({ node, pos }) => {
    const baseRadius = layoutMode ? layoutNodeSize : getNodeRadius(node);
    const radius = layoutMode ? getLayoutNodeRadius(pos) : baseRadius * (pos.scale || 1);
    nodePosMap.set(node.id, { pos, radius });
  });
  const detailLabelSegments = [];
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(a, b)) {
      return;
    }
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    detailLabelSegments.push({
      x1: start.x + ux * startRadius,
      y1: start.y + uy * startRadius,
      x2: end.x - ux * endRadius,
      y2: end.y - uy * endRadius,
    });
  });
  addCustomConnectionSegments(nodePosMap, detailLabelSegments);
  addTriangleDiagonalSegments(nodePosMap, detailLabelSegments);
  addDistanceLineSegments(nodePosMap, detailLabelSegments);
  const orphanResult = buildOrphanGuideSet();
  orphanGuideNodes = orphanResult.guides;
  orphanGuideEdges = orphanResult.edges;
  const detailLabelCollision = {
    circles: nodeRenderList
      .filter(({ node }) => node.isCenter || node.active || node.isCustom)
      .map(({ node, pos }) => ({
        id: node.id,
        x: pos.x,
        y: pos.y,
        r: layoutMode ? getLayoutNodeRadius(pos) : getNodeRadius(node) * (pos.scale || 1),
      })),
    segments: detailLabelSegments,
    rects: [],
  };
  const axisEntry = getActiveAxisEntry();
  const axisModeActive = Boolean(axisEntry);
  const shouldDrawAxisLine =
    (is3DMode && (showAxes || (axisModeActive && isAddMode))) || (!is3DMode && axisModeActive);

  if (is3DMode && showGrid) {
    drawGrid();
  }

  if (shouldDrawAxisLine) {
    drawAxes(axisEntry);
  }

  const { guideNodes } = getGuideRevealInfo(nodePosMap, axisEntry);
  if (distanceSelectMode) {
    guideNodes.clear();
  }
  const showDistances = analysisLayers.distances;
  const showMicrotonal = analysisLayers.microtonal;
  if (is3DMode && !showMicrotonal) {
    draw3DEdges(nodePosMap, axisEntry);
  } else if (!showMicrotonal) {
    const labelFont = layoutMode ? layoutLineLabelFont : "Noto Serif";
    const labelWeight = layoutMode ? layoutLineLabelFontWeight : 400;
    const labelSize = layoutMode ? getLayoutLineLabelSize() : EDGE_LABEL_SIZE_DEFAULT;
    edges.forEach(([a, b]) => {
      if (!a.active || !b.active) {
        return;
      }
      if (hasSelectedDistanceEdgeBetweenNodes(a, b)) {
        return;
      }
      const startEntry = nodePosMap.get(a.id);
      const endEntry = nodePosMap.get(b.id);
      const start = startEntry
        ? startEntry.pos
        : worldToScreen(getNodeDisplayCoordinate(a), disableScale);
      const end = endEntry
        ? endEntry.pos
        : worldToScreen(getNodeDisplayCoordinate(b), disableScale);
      const radiusA = startEntry
        ? startEntry.radius
        : layoutMode
          ? getLayoutNodeRadius(start)
          : getNodeRadius(a) * (start.scale || 1);
      const radiusB = endEntry
        ? endEntry.radius
        : layoutMode
          ? getLayoutNodeRadius(end)
          : getNodeRadius(b) * (end.scale || 1);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) {
        return;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const startRadius = getNodeEdgeRadius(a, ux, uy, radiusA);
      const endRadius = getNodeEdgeRadius(b, ux, uy, radiusB);
      const labelText = getEdgeLabelText(a, b);
      const label = shouldShowEdgeLabel(a, b) ? labelText : null;
      const labelT = getLineLabelPositionOverride(a, b) ?? 0.5;
      drawCanvasEdgeSegment({
        start,
        end,
        startRadius,
        endRadius,
        color: themeColors.edge,
        label,
        labelFont,
        labelWeight,
        labelSize,
        labelT,
      });
    });
  }

  if (showDistances) {
    drawDistanceConnections(nodePosMap);
  }
  if (distanceSelectMode && analysisLayers.distances) {
    drawDistanceDragPreview(nodePosMap);
  }
  if (showMicrotonal) {
    drawCommaConnections(nodePosMap);
  }

  drawCustomConnections(nodePosMap);
  drawOrphanGuideEdges(nodePosMap, guideNodes, axisEntry);
  drawGuideEdges(nodePosMap, guideNodes);
  if (!showMicrotonal) {
    drawTriangleDiagonals(nodePosMap, disableScale);
    drawTriangleLabels(nodePosMap, disableScale);
  }
  drawTriangleHover(nodePosMap, disableScale);

  const nowMs = performance.now();
  const nodeVolumeModeAlpha = getNodeVolumeModeAlpha(nowMs);
  const nodeVolumeModeVisible = nodeVolumeModeAlpha > 0.001;
  if (addIntervalSelectedRing && nowMs > addIntervalSelectedRing.until) {
    addIntervalSelectedRing = null;
  }
  const nowSec = audioCtx ? audioCtx.currentTime : nowMs / 1000;
  const nodeAmplitudes = getNodeAmplitudeMap(nowSec, nowMs);

  const keyboardMode = getKeyboardMode();
  const isPianoMode = keyboardMode === "piano";
  const isIsomorphicMode = keyboardMode === "iso" || keyboardMode === "iso-fuzzy";
  const isIsomorphicTriangleMode = keyboardMode === "iso-tri";
  const isCustomMapMode = keyboardMode === "piano-custom";
  const customPianoLabels =
    isCustomMapMode && (layoutMode || showKeyMappings) ? getCustomPianoLabelMap() : null;
  const showPianoKeyMappings = isPianoMode && showKeyMappings;
  const selectedCustomNodes =
    isCustomMapMode && isCustomPianoMapModeActive() && customPianoSelectedKey != null
      ? customPianoMap.get(customPianoSelectedKey)
      : null;
  if (isIsomorphicMode) {
    ensureIsomorphicMaps();
  }
  if (isIsomorphicTriangleMode) {
    ensureIsomorphicTriangleMaps();
  }
  const keyMap = isIsomorphicMode ? isomorphicKeyMap : null;
  const triangleKeyMap =
    isIsomorphicTriangleMode && showKeyMappings && !layoutMode ? isomorphicTriangleKeyMap : null;
  const triangleTargetById = new Map();
  if (triangleKeyMap && isomorphicTriangleLayout) {
    isomorphicTriangleLayout.forEach((target) => {
      if (target && target.id && !triangleTargetById.has(target.id)) {
        triangleTargetById.set(target.id, target);
      }
    });
  }
  if (triangleKeyMap && triangleTargetById.size) {
    triangleKeyMap.forEach((keyLabel, targetId) => {
      const target = triangleTargetById.get(targetId);
      if (!target) {
        return;
      }
      const pos = worldToScreen(target.coordinate);
      drawTriangleKeyBanner(pos, keyLabel, 1);
    });
  }
  const reducedEffects = is3DMode && view.reducedEffects;
  const lightDir = getLightDir2D();
  if (nodeVolumeModeVisible) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.08 * nodeVolumeModeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  nodeVolumeSliderHitboxes = [];
  nodeRenderList.forEach(({ node, pos }) => {
    const isHovered = node.id === hoverNodeId;
    const isGuide = guideNodes.has(node.id);
    const isOrphanGuide = connectOrphansEnabled && orphanGuideNodes.has(node.id);
    const isIntervalHover = addIntervalMode && node.active && isHovered;
    const isIntervalDim = addIntervalMode && node.active && !isHovered;
    const canShowInactive = !isOrphanGuide && isInactiveNodeAvailable(node);
    const canInteractInactive = !is3DMode || isAddMode || distanceSelectMode;
    const amplitude = nodeAmplitudes.get(node.id) || 0;
    const brightness = Math.min(1, amplitude);
    const isVisible =
      node.isCenter ||
      node.active ||
      node.isCustom ||
      brightness > 0.01 ||
      isGuide ||
      isOrphanGuide ||
      (isHovered && canShowInactive && canInteractInactive);
    let alpha = node.active || node.isCenter ? 1 : isHovered ? 0.3 : 0;
    if (node.isCenter && !node.active) {
      alpha = isHovered ? 0.3 : 0.15;
    }
    if (isGuide) {
      alpha = guideNodes.get(node.id);
    }
    if (isOrphanGuide && !isGuide) {
      alpha = 0.08;
    }
    if (node.isCustom && !node.active) {
      alpha = 0.25;
    }
    if (axisEntry && !isNodeOnAxisEntry(node, axisEntry)) {
      alpha *= AXIS_DIM_FACTOR;
    }
    if (showMicrotonal && !commaNodeRings.has(node.id)) {
      alpha *= 0.18;
    }
    if (isIntervalDim) {
      alpha *= 0.18;
    }
    if (distanceFocusMode) {
      alpha *= AXIS_DIM_FACTOR;
    }
    const textAlpha = alpha;
    const intervalTint = isIntervalDim ? "#9a9a9a" : null;
    const textColorPrimary = colorWithAlpha(
      intervalTint || themeColors.textPrimary,
      textAlpha
    );
    const textColorSecondary = colorWithAlpha(
      intervalTint || themeColors.textSecondary,
      textAlpha
    );

    if (!isVisible) {
      return;
    }

    const baseRadius = layoutMode ? layoutNodeSize : getNodeRadius(node);
    const radius = layoutMode ? getLayoutNodeRadius(pos) : baseRadius * (pos.scale || 1);
    const layoutShape = layoutMode
      ? getLayoutNodeShape(node)
      : node.isCustom
      ? "diamond"
      : "circle";
    const showNodeShape = !layoutMode || layoutShape !== "none";
    const isSquare = layoutShape === "square";

    ctx.save();
    ctx.globalAlpha = alpha;
    if (node.id === ratioWheelHoverNodeId) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 1.35, 0, Math.PI * 2);
      ctx.fillStyle = themeColors.hoverRingFill;
      ctx.strokeStyle = themeColors.hoverRingStroke;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
    if (showNodeShape && showCircles) {
      ctx.beginPath();
      ctx.strokeStyle = intervalTint || themeColors.nodeStroke;
      ctx.lineWidth = 2;
      if (isOrphanGuide) {
        ctx.setLineDash([6, 4]);
      }
      if (is3DMode) {
        const inactiveFill = node.isCustom
          ? colorWithAlpha(themeColors.nodeCustomInactive, 0.6)
          : themeColors.nodeInactive;
        const shadowColor = themeColors.nodeShadow;
        const fillAlpha = Math.min(1, brightness);
        const baseFill =
          fillAlpha > 0 ? colorWithAlpha(themeColors.playFill, fillAlpha) : inactiveFill;
        const highlightColor =
          fillAlpha > 0
            ? colorWithAlpha(themeColors.playFill, 0.35 + 0.65 * fillAlpha)
            : node.isCustom
            ? colorWithAlpha(themeColors.nodeCustomInactive, 0.9)
            : themeColors.nodeHighlight;
        if (reducedEffects || !show3DShading) {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = baseFill;
        } else {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = Math.max(6, radius * 0.6);
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = isSquare
            ? getCubeFill(pos, radius, baseFill, shadowColor, highlightColor, lightDir)
            : getSphereFill(pos, radius, baseFill, shadowColor, highlightColor, lightDir);
        }
      } else if (layoutMode) {
        ctx.fillStyle = "transparent";
      } else {
        if (node.isCustom && !node.active && brightness <= 0) {
          ctx.fillStyle = themeColors.nodeCustomInactive;
        } else {
          ctx.fillStyle = brightness > 0 ? themeColors.playFill : "transparent";
        }
      }
      drawNodeShapePath(layoutShape, pos.x, pos.y, radius);
      if (is3DMode) {
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      } else if (brightness > 0) {
        ctx.save();
        ctx.globalAlpha *= brightness;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fill();
      }
      ctx.stroke();
      if (isOrphanGuide) {
        ctx.setLineDash([]);
      }
    }

    if (selectedCustomNodes && selectedCustomNodes.has(node.id)) {
      ctx.save();
      ctx.globalAlpha = Math.max(0.35, alpha);
      ctx.strokeStyle = themeColors.nodeActive;
      ctx.lineWidth = Math.max(1.5, radius * 0.12);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }


    if (distanceSelectMode && distanceSelectDrag) {
      const isStart = node.id === distanceSelectDrag.startNodeId;
      const isHover = node.id === distanceSelectDrag.hoverNodeId;
      if (isStart || isHover) {
        ctx.save();
        ctx.globalAlpha = Math.max(0.4, alpha);
        ctx.strokeStyle = DISTANCE_RING_COLOR;
        ctx.lineWidth = Math.max(2, radius * 0.14);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    if (
      addIntervalSelectedRing &&
      addIntervalSelectedRing.nodeId === node.id &&
      nowMs <= addIntervalSelectedRing.until
    ) {
      ctx.save();
      ctx.globalAlpha = Math.max(0.5, alpha);
      ctx.strokeStyle = ADD_INTERVAL_RING_COLOR;
      ctx.lineWidth = Math.max(2, radius * 0.16);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (showMicrotonal) {
      const isSelectedMicrotonal = microtonalSelectedNodeIds.has(node.id);
      if (isSelectedMicrotonal || isHovered) {
        ctx.save();
        ctx.globalAlpha = Math.max(0.5, alpha);
        ctx.strokeStyle = isSelectedMicrotonal
          ? MICROTONAL_SELECTED_RING_COLOR
          : MICROTONAL_HOVER_RING_COLOR;
        ctx.lineWidth = Math.max(2, radius * 0.1);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = textColorPrimary;
    const innerTextScale = layoutMode ? getLayoutInnerTextScale(radius) : 1;
    const baseLabelSize = layoutMode ? layoutRatioTextSize * innerTextScale : 21;
    const labelSize = node.isCustom ? baseLabelSize * 0.85 : baseLabelSize;
    const labelFont = layoutMode ? layoutRatioFont : "Noto Serif";
    const labelWeight = layoutMode ? layoutRatioFontWeight : 400;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (featureMode === "note") {
      if (hejiEnabled && nodeHasHighPrime(node)) {
        const displayInfo = getCachedDisplayInfo(node);
        const base = getHejiBaseAndDefaults(displayInfo.pitchClass);
        const centsText = showCentsDeviation ? formatCents(displayInfo.cents) : "";
        const suffixParts = centsText
          ? [
              ...base.suffixParts,
              {
                text: centsText,
                source: "cents",
                font: labelFont,
                charGap: 0,
                sizeScale: 0.67,
              },
            ]
          : base.suffixParts;
        drawHejiInline({
          x: pos.x,
          y: pos.y,
          baseText: base.baseText,
          suffixParts,
          restText: "",
          size: labelSize,
          font: labelFont,
          fontWeight: labelWeight,
          align: "center",
          baseline: "middle",
          color: textColorPrimary,
        });
      } else {
        const annotation = getCachedHejiAnnotation(node, getNodePitchLabel(node));
        drawHejiInline({
          x: pos.x,
          y: pos.y,
          baseText: annotation.baseText,
          suffixParts: annotation.suffixParts,
          restText: "",
          size: labelSize,
          font: labelFont,
          fontWeight: labelWeight,
          align: "center",
          baseline: "middle",
          color: textColorPrimary,
        });
      }
    } else {
      const maxWidth = radius * 1.6;
      const maxHeight = radius * 1.6;
      const layout = computeRatioLabelLayout(
        node.numerator,
        node.denominator,
        labelFont,
        labelSize,
        maxWidth,
        labelWeight,
        maxHeight
      );
      ctx.font = `${labelWeight} ${layout.size}px ${labelFont}`;
      if (layout.lines.length === 1) {
        ctx.fillText(layout.lines[0], pos.x, pos.y);
      } else {
        const positions = computeStackedRatioPositionsFromLine(
          layout.lines,
          labelFont,
          layout.size,
          labelWeight,
          pos.y,
          layout.lineGap
        );
        ctx.save();
        ctx.textBaseline = "alphabetic";
        ctx.fillText(layout.lines[0], pos.x, positions.topBaseline);
        ctx.fillText(layout.lines[1], pos.x, positions.bottomBaseline);
        ctx.save();
        ctx.strokeStyle = textColorPrimary;
        ctx.lineWidth = Math.max(1, Math.round(layout.size * 0.06));
        ctx.beginPath();
        ctx.moveTo(pos.x - positions.lineWidth / 2, positions.lineY);
        ctx.lineTo(pos.x + positions.lineWidth / 2, positions.lineY);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      }
    }

    if (nodeVolumeModeVisible && node.active) {
      const sliderHeight = Math.max(56, radius * 2.5);
      const sliderWidth = 9;
      const sliderGap = Math.max(12, radius * 0.7);
      const badgeHeight = 16;
      let x = pos.x - radius - sliderGap;
      const top = pos.y - sliderHeight / 2;
      const bottom = top + sliderHeight;
      const localTop = top - 10;
      const localBottom = bottom + badgeHeight + 10;
      for (let i = 0; i < nodeVolumeSliderHitboxes.length; i += 1) {
        const other = nodeVolumeSliderHitboxes[i];
        const overlapY = localTop < other.top + other.height && localBottom > other.top;
        const closeX = Math.abs(x - other.centerX) < 20;
        if (overlapY && closeX) {
          x -= 16;
        }
      }
      const value = getNodeVolumeLimit(node);
      const handleY = top + (1 - value) * sliderHeight;
      const db = value <= 0.001 ? -60 : 20 * Math.log10(value);
      const dbLabel = `${Math.round(Math.max(-60, db))} dB`;
      ctx.save();
      ctx.globalAlpha = Math.max(0.82, alpha) * nodeVolumeModeAlpha;
      const trackTop = top;
      const trackBottom = bottom;
      const fillTop = handleY;
      const gradient = ctx.createLinearGradient(0, trackBottom, 0, trackTop);
      gradient.addColorStop(0, "#f6cc3a");
      gradient.addColorStop(1, "#f59e0b");
      ctx.strokeStyle = colorWithAlpha(themeColors.nodeStroke, 0.85);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(
        x - sliderWidth / 2,
        trackTop,
        sliderWidth,
        sliderHeight,
        sliderWidth / 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(
        x - sliderWidth / 2,
        fillTop,
        sliderWidth,
        Math.max(2, trackBottom - fillTop),
        sliderWidth / 2
      );
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#f6cc3a";
      ctx.shadowColor = "rgba(246, 204, 58, 0.55)";
      ctx.shadowBlur = 8;
      ctx.arc(x, handleY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = "transparent";
      ctx.font = `600 12px "Lexend", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = colorWithAlpha(themeColors.textPrimary, 0.95);
      ctx.fillText(dbLabel, x, bottom + 6);
      ctx.restore();

      nodeVolumeSliderHitboxes.push({
        nodeId: node.id,
        left: x - sliderWidth / 2 - 7,
        top: top - 8,
        width: sliderWidth + 14,
        height: sliderHeight + 16 + badgeHeight,
        bottom: top + sliderHeight,
        centerX: x,
      });
    }


    if (
      isOrphanGuide ||
      isGuide ||
      (!node.active && !node.isCustom && !node.isCenter)
    ) {
      ctx.restore();
      return;
    }
    const displayInfo = getCachedDisplayInfo(node);
    if (!showMicrotonal) {
      const detailSize = layoutMode ? layoutNoteTextSize : 14;
      const noteLabelFont = layoutMode ? layoutNoteFont : "Lexend, sans-serif";
      const noteLabelWeight = layoutMode ? layoutNoteFontWeight : 200;
      if (featureMode === "note") {
      ctx.font = `${noteLabelWeight} ${detailSize}px ${noteLabelFont}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = textColorSecondary;
      const octaveLabel = formatOctaveShiftLabel(getNodeOctaveShift(node));
      const ratioText = `${node.numerator}:${node.denominator}${octaveLabel}`;
      const centsLabel = getCachedCentsReadout(
        node,
        { wrap: enharmonicsEnabled },
        displayInfo
      );
      const ratioCentsLabel = showRatioCents ? formatRatioCentsLabel(node) : "";
      const defaultOffset = getDefaultNoteDetailOffset(radius, 1);
      const lineWidth = ctx.measureText(ratioText).width;
      const centsWidth = centsLabel ? ctx.measureText(centsLabel).width : 0;
      const ratioCentsWidth = ratioCentsLabel ? ctx.measureText(ratioCentsLabel).width : 0;
      const hzText = showHz ? formatHzReadout(node.freq) : "";
      const hzWidth = hzText ? ctx.measureText(hzText).width : 0;
      const labelWidth = Math.max(lineWidth, centsWidth, ratioCentsWidth, hzWidth);
      const lineCount =
        1 +
        (centsLabel ? 1 : 0) +
        (ratioCentsLabel ? 1 : 0) +
        (hzText ? 1 : 0);
      const labelHeight = lineCount * detailSize + (lineCount - 1) * 4;
      const rawLabelPos =
        layoutMode && layoutLabelOffsets.has(node.id)
          ? getLayoutNoteLabelPosition(node, pos, radius)
          : getDetailLabelPosition({
              center: pos,
              baseOffset: defaultOffset,
              width: labelWidth,
              height: labelHeight,
              circles: detailLabelCollision.circles,
              placedRects: detailLabelCollision.rects,
              segments: detailLabelCollision.segments,
              ignoreId: node.id,
            });
      if (layoutMode && layoutLabelOffsets.has(node.id)) {
        detailLabelCollision.rects.push({
          left: rawLabelPos.x,
          top: rawLabelPos.y,
          right: rawLabelPos.x + labelWidth,
          bottom: rawLabelPos.y + labelHeight,
        });
      }
      const ratioX = rawLabelPos.x;
      const ratioY = rawLabelPos.y;
      if (layoutMode) {
        const padding = Math.max(4, Math.round(detailSize * 0.25));
        layoutRenderedNoteLabelHitboxes.set(node.id, {
          left: ratioX - padding,
          top: ratioY - padding,
          width: labelWidth + padding * 2,
          height: labelHeight + padding * 2,
          labelPos: { x: ratioX, y: ratioY },
        });
      }
      let lineOffset = 0;
      ctx.fillText(ratioText, ratioX, ratioY + lineOffset);
      lineOffset += detailSize + 4;
      if (centsLabel) {
        drawTextWithSmallCent({
          text: centsLabel,
          x: ratioX,
          y: ratioY + lineOffset,
          font: noteLabelFont,
          size: detailSize,
          fontWeight: noteLabelWeight,
          align: "left",
          baseline: "top",
          hejiAccidentals: hejiEnabled,
          hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
          context: ctx,
          color: textColorSecondary,
        });
        lineOffset += detailSize + 4;
      }
      if (ratioCentsLabel) {
        ctx.fillText(ratioCentsLabel, ratioX, ratioY + lineOffset);
        lineOffset += detailSize + 4;
      }
      if (hzText) {
        ctx.fillText(hzText, ratioX, ratioY + lineOffset);
      }
      } else {
      ctx.fillStyle = textColorSecondary;
      const centsLabel = getCachedCentsReadout(
        node,
        {
          wrap: enharmonicsEnabled,
          requireHejiDetail: true,
          baseTextForHeji: displayInfo.pitchClass,
        },
        displayInfo
      );
      const hasParen = centsLabel && centsLabel.includes("(");
      const baseLabel = featureMode === "ratio" ? displayInfo.pitchClass : displayInfo.name;
      const annotation = getCachedHejiAnnotation(node, baseLabel || node.note_name);
      const octaveLabel = formatOctaveShiftLabel(getNodeOctaveShift(node));
      const defaultOffset = getDefaultNoteDetailOffset(radius, 1);
      const suffixText = annotation.suffixParts
        .map((part) => (part && part.text ? part.text : ""))
        .join("");
      const restText = hejiEnabled && centsLabel ? "" : centsLabel ? ` ${centsLabel}` : "";
      const line1 = `${annotation.baseText || ""}${suffixText}${restText}`;
      const ratioCentsLabel = showRatioCents ? formatRatioCentsLabel(node) : "";
      const lineWidth = line1 ? ctx.measureText(line1).width : 0;
      const centsWidth = hejiEnabled && centsLabel ? ctx.measureText(centsLabel).width : 0;
      const octaveWidth = octaveLabel ? ctx.measureText(octaveLabel).width : 0;
      const ratioCentsWidth = ratioCentsLabel ? ctx.measureText(ratioCentsLabel).width : 0;
      const hzText = showHz ? formatHzReadout(node.freq) : "";
      const hzWidth = hzText ? ctx.measureText(hzText).width : 0;
      const labelWidth = Math.max(lineWidth, centsWidth, octaveWidth, ratioCentsWidth, hzWidth);
      const lineCount =
        1 +
        (hejiEnabled && centsLabel ? 1 : 0) +
        (octaveLabel ? 1 : 0) +
        (ratioCentsLabel ? 1 : 0) +
        (hzText ? 1 : 0);
      const labelHeight = lineCount * detailSize + (lineCount - 1) * 4;
      const rawLabelPos =
        layoutMode && layoutLabelOffsets.has(node.id)
          ? getLayoutNoteLabelPosition(node, pos, radius)
          : getDetailLabelPosition({
              center: pos,
              baseOffset: defaultOffset,
              width: labelWidth,
              height: labelHeight,
              circles: detailLabelCollision.circles,
              placedRects: detailLabelCollision.rects,
              segments: detailLabelCollision.segments,
              ignoreId: node.id,
            });
      if (layoutMode && layoutLabelOffsets.has(node.id)) {
        detailLabelCollision.rects.push({
          left: rawLabelPos.x,
          top: rawLabelPos.y,
          right: rawLabelPos.x + labelWidth,
          bottom: rawLabelPos.y + labelHeight,
        });
      }
      const labelPos = { x: rawLabelPos.x, y: rawLabelPos.y };
      if (layoutMode) {
        const padding = Math.max(4, Math.round(detailSize * 0.25));
        layoutRenderedNoteLabelHitboxes.set(node.id, {
          left: labelPos.x - padding,
          top: labelPos.y - padding,
          width: labelWidth + padding * 2,
          height: labelHeight + padding * 2,
          labelPos: { x: labelPos.x, y: labelPos.y },
        });
      }
      const restGapScale = hejiEnabled && hasParen ? HEJI_REST_GAP : HEJI_REST_GAP_PLAIN;
      let lineOffset = 0;
      drawHejiInline({
        x: labelPos.x,
        y: labelPos.y,
        baseText: annotation.baseText,
        suffixParts: annotation.suffixParts,
        restText: hejiEnabled && centsLabel ? "" : centsLabel ? ` ${centsLabel}` : "",
        size: detailSize,
        font: noteLabelFont,
        align: "left",
        baseline: "top",
        hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
        restGapScale,
        restHejiAccidentals: hejiEnabled && hasParen,
        fontWeight: noteLabelWeight,
        color: textColorSecondary,
      });
      lineOffset += detailSize + 4;
      if (hejiEnabled && centsLabel) {
        drawTextWithSmallCent({
          text: centsLabel,
          x: labelPos.x,
          y: labelPos.y + lineOffset,
          font: noteLabelFont,
          size: detailSize,
          fontWeight: noteLabelWeight,
          align: "left",
          baseline: "top",
          hejiAccidentals: hejiEnabled,
          hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
          context: ctx,
          color: textColorSecondary,
        });
        lineOffset += detailSize + 4;
      }
      if (octaveLabel) {
        ctx.save();
        ctx.font = `${noteLabelWeight} ${detailSize}px ${noteLabelFont}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = textColorSecondary;
        ctx.fillText(octaveLabel, labelPos.x, labelPos.y + lineOffset);
        ctx.restore();
        lineOffset += detailSize + 4;
      }
      if (ratioCentsLabel) {
        ctx.save();
        ctx.font = `${noteLabelWeight} ${detailSize}px ${noteLabelFont}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = textColorSecondary;
        ctx.fillText(ratioCentsLabel, labelPos.x, labelPos.y + lineOffset);
        ctx.restore();
        lineOffset += detailSize + 4;
      }
      if (hzText) {
        ctx.save();
        ctx.font = `200 ${detailSize}px "Lexend", sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = textColorSecondary;
        const hzY = labelPos.y + lineOffset;
        ctx.fillText(hzText, labelPos.x, hzY);
        ctx.restore();
      }
      }

      if (layoutMode && layoutLabelHitboxVisible) {
        const hitbox = getLayoutNoteLabelHitbox(node, pos, radius);
        ctx.save();
        ctx.strokeStyle = "rgba(255, 80, 80, 0.8)";
        ctx.fillStyle = "rgba(255, 80, 80, 0.12)";
        ctx.lineWidth = 1;
        ctx.fillRect(hitbox.left, hitbox.top, hitbox.width, hitbox.height);
        ctx.strokeRect(hitbox.left, hitbox.top, hitbox.width, hitbox.height);
        ctx.restore();
      }
    }

    if (keyMap && node.active && !layoutMode && showKeyMappings) {
      const keyLabel = keyMap.get(node.id);
      if (keyLabel) {
        if (is3DMode) {
          drawKeyBanner(pos, radius, keyLabel, alpha);
        } else {
          draw2DKeyMappingLabel({
            labelText: keyLabel,
            pos,
            radius,
            alpha,
            color: themeColors.textSecondary,
            collision: detailLabelCollision,
            ignoreId: node.id,
          });
        }
      }
    }

    if (showPianoKeyMappings && !layoutMode) {
      const keyLabel = getPianoKeyLabel(displayInfo.pitchClass || node.pitch_class);
      if (keyLabel) {
        if (is3DMode) {
          drawKeyBanner(pos, radius, keyLabel, alpha);
        } else {
          draw2DKeyMappingLabel({
            labelText: keyLabel,
            pos,
            radius,
            alpha,
            color: themeColors.textSecondary,
            collision: detailLabelCollision,
            ignoreId: node.id,
          });
        }
      }
    }

    if (customPianoLabels) {
      const keyLabel = customPianoLabels.get(node.id);
      const pitchClass = displayInfo.pitchClass || node.pitch_class;
      const showLabel = layoutMode
        ? shouldShowLayoutKeyMappingLabel(keyLabel, pitchClass)
        : true;
      if (keyLabel && showLabel) {
        if (layoutMode) {
          const labelText = getLayoutKeyMappingLabelText(keyLabel);
          const labelPos = getLayoutKeyMappingLabelPosition(node, pos, radius);
          const fontSize = Math.max(8, Math.round(layoutKeyMappingTextSize));
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = `${layoutKeyMappingFontWeight} ${fontSize}px ${layoutKeyMappingFont}`;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          if (layoutKeyMappingDark) {
            const paddingX = 6;
            const paddingY = 3;
            const textWidth = ctx.measureText(labelText).width;
            const boxWidth = textWidth + paddingX * 2;
            const boxHeight = fontSize + paddingY * 2;
            const boxX = labelPos.x - boxWidth;
            const boxY = labelPos.y - boxHeight;
            ctx.fillStyle = "rgba(10, 15, 20, 0.7)";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#ffffff";
            ctx.fillText(labelText, labelPos.x - paddingX, labelPos.y - paddingY);
          } else {
            ctx.fillStyle = themeColors.textSecondary;
            ctx.fillText(labelText, labelPos.x, labelPos.y);
          }
          ctx.restore();
        } else if (is3DMode) {
          drawKeyBanner(pos, radius, keyLabel, alpha);
        } else {
          draw2DKeyMappingLabel({
            labelText: keyLabel,
            pos,
            radius,
            alpha,
            color: themeColors.textSecondary,
            collision: detailLabelCollision,
            ignoreId: node.id,
          });
        }
      }
    }

    ctx.restore();
  });

  if (layoutMode && layoutAxisEdit) {
    ctx.save();
    ctx.fillStyle = "rgba(128, 128, 128, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = themeColors.textSecondary;
    ctx.fillStyle = themeColors.textSecondary;
    ctx.lineWidth = 1.5;
  ctx.font = `${layoutAxisLegendFontWeight} ${getAxisLegendSettings().fontSize}px ${layoutAxisLegendFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    drawLayoutAxisLegend(layoutAxisEdit, { showHandles: true });
    ctx.restore();
  }
  drawAnalysisWatermark();
  syncNavViewSliders();

  updateBannerMessage();

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
  const node = nodeById.get(options.nodeId);
  const octaveShift = node ? getNodeOctaveShift(node) : 0;
  const baseOctave = Number(options.octave) || 0;
  const effectiveOctave = baseOctave + octaveShift;
  const baseFreq = Number(options.freq);
  const effectiveFreq = Number.isFinite(baseFreq)
    ? baseFreq * Math.pow(2, octaveShift)
    : options.freq;
  const velocity = Math.max(0, Math.min(1, Number(options.velocity ?? 1)));
  const nodeVolumeMax = options.source === "midi" ? 1 : getNodeVolumeLimit(node);
  const waveformType = getCurrentWaveformType();
  let oscillator = null;
  if (waveformType === KARPLUS_WAVEFORM) {
    ensureKarplusWorklet();
    if (karplusWorkletReady) {
      try {
        oscillator = new AudioWorkletNode(audioCtx, "karplus-strong", {
          numberOfOutputs: 1,
          outputChannelCount: [1],
          parameterData: {
            frequency: Number.isFinite(effectiveFreq) ? effectiveFreq : 220,
            damping: 0.985,
          },
        });
        if (oscillator.port) {
          oscillator.port.postMessage({ type: "trigger" });
        }
      } catch (error) {
        oscillator = audioCtx.createOscillator();
      }
    } else {
      oscillator = audioCtx.createOscillator();
    }
  } else if (waveformType === RESONANT_WAVEFORM) {
    ensureResonatorWorklet();
    if (resonatorWorkletReady) {
      try {
        oscillator = new AudioWorkletNode(audioCtx, "modal-resonator", {
          numberOfOutputs: 1,
          outputChannelCount: [1],
          parameterData: {
            frequency: Number.isFinite(effectiveFreq) ? effectiveFreq : 220,
          brightness: 0.45,
          },
        });
        if (oscillator.port) {
          oscillator.port.postMessage({ type: "trigger" });
        }
      } catch (error) {
        oscillator = audioCtx.createOscillator();
      }
    } else {
      oscillator = audioCtx.createOscillator();
    }
  } else if (waveformType === SOUNDFONT_WAVEFORM) {
  if (soundfontData && soundfontPreset) {
    const sfCtx = {
      currentTime: audioCtx.currentTime,
        destination: null,
        createGain: audioCtx.createGain.bind(audioCtx),
        createBuffer: audioCtx.createBuffer.bind(audioCtx),
        createBufferSource: audioCtx.createBufferSource.bind(audioCtx),
        createStereoPanner: audioCtx.createStereoPanner.bind(audioCtx),
      };
      oscillator = {
        type: "soundfont",
        start: () => {},
        stop: () => {},
        disconnect: () => {},
        port: null,
      };
      // Use envGain as the destination so ADSR/LFO apply downstream.
      sfCtx.destination = audioCtx.createGain();
      const sfDestination = sfCtx.destination;
      const midi = 69 + 12 * Math.log2((Number.isFinite(effectiveFreq) ? effectiveFreq : 220) / (Number(a4Input.value) || 440));
      const stopFn = startPresetNote(sfCtx, soundfontPreset, midi, audioCtx.currentTime);
      oscillator.sfStop = stopFn;
      oscillator.sfOutput = sfDestination;
    } else {
      oscillator = audioCtx.createOscillator();
    }
  } else if (CUSTOM_WAVEFORMS.has(waveformType)) {
    oscillator = customOscillators[waveformType](audioCtx);
  } else {
    oscillator = audioCtx.createOscillator();
  }
  const envGain = audioCtx.createGain();
  const lfoGain = audioCtx.createGain();
  const morphGain = audioCtx.createGain();

  if (
    waveformType !== KARPLUS_WAVEFORM &&
    waveformType !== RESONANT_WAVEFORM &&
    !CUSTOM_WAVEFORMS.has(waveformType) &&
    oscillator &&
    "type" in oscillator
  ) {
    oscillator.type = waveformType;
  }
  if (oscillator && "frequency" in oscillator && Number.isFinite(effectiveFreq)) {
    oscillator.frequency.value = effectiveFreq;
  }
  const forcedOneShot = options.forceOneShot === true;
  const isOneShot =
    (Boolean(oneShotCheckbox && oneShotCheckbox.checked) && !options.ignoreOneShot) ||
    forcedOneShot;
  envGain.gain.setValueAtTime(0.0001, now);
  const attack = getEnvelopeAttackSeconds() || 0.02;
  const decay = getEnvelopeDecaySeconds() || 0.2;
  const sustain = Number(sustainSlider.value) || 0.6;
  const release = getEnvelopeReleaseSeconds() || 0.6;
  const peakGain = Math.max(0.0001, 0.2 * velocity * nodeVolumeMax);
  envGain.gain.exponentialRampToValueAtTime(peakGain, now + attack);
  envGain.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, peakGain * sustain),
    now + attack + decay
  );

  const voice = {
    id: nextVoiceId++,
    nodeId: options.nodeId,
    velocity,
    octave: effectiveOctave,
    freq: effectiveFreq,
    ratioKey: node ? getNodeRatioKey(node) : null,
    oscillator,
    envGain,
    lfoGain,
    morphGain,
    lfoActive: Boolean(options.lfoActive),
    morphState: null,
    releasing: false,
    startTimeSec: now,
    envAttackSec: attack,
    envDecaySec: decay,
    envSustain: sustain,
    envReleaseSec: release,
    peakGain,
    releaseStartSec: null,
    releaseDurationSec: null,
    releaseStartLevel: null,
    lfoHalfPeriod: options.lfoHalfPeriod || 0,
    lfoStartMs: options.lfoStartMs || 0,
    lfoCurve: Number.isFinite(options.lfoCurve) ? options.lfoCurve : 1,
    source: options.source || "keyboard",
    loopOffRecorded: false,
    oneShot: isOneShot,
    usesWorklet: waveformType === KARPLUS_WAVEFORM || waveformType === RESONANT_WAVEFORM,
    usesSoundfont: waveformType === SOUNDFONT_WAVEFORM,
    sfStop: oscillator && oscillator.sfStop ? oscillator.sfStop : null,
    sfOutput: oscillator && oscillator.sfOutput ? oscillator.sfOutput : null,
  };

  if (isOneShot) {
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + release);
    voice.releaseStartSec = now + attack + decay;
    voice.releaseDurationSec = release;
    voice.releaseStartLevel = peakGain * sustain;
  }

  lfoGain.gain.value = voice.lfoActive ? getLfoGainValue(voice, performance.now()) : 1;
  morphGain.gain.value = Number.isFinite(options.initialMorphGain)
    ? Math.max(0, Math.min(1, options.initialMorphGain))
    : 1;
  if (voice.sfOutput) {
    voice.sfOutput.connect(envGain).connect(lfoGain).connect(morphGain).connect(masterGain);
  } else if (oscillator && typeof oscillator.connect === "function") {
    oscillator.connect(envGain).connect(lfoGain).connect(morphGain).connect(masterGain);
  }
  if (typeof oscillator.start === "function") {
    oscillator.start(now);
    oscillator.onended = () => {
      oscillator.disconnect();
      if (envGain) {
        envGain.disconnect();
      }
      if (lfoGain) {
        lfoGain.disconnect();
      }
      if (morphGain) {
        morphGain.disconnect();
      }
      removeVoiceById(voice.id);
    };
  }

  voices.push(voice);

  ensureLfoLoop();
  if (!layoutMode) {
    schedulePresetUrlUpdate();
  }

  if (isOneShot) {
    const stopAt = now + attack + decay + release + 0.05;
    oscillator.stop(stopAt);
  }

  sendMidiOutNoteOn(voice);

  if (shouldCaptureLooperInput(voice)) {
    const nowMs = performance.now();
    const wrap = looperState === "overdubbing";
    const t = getLooperEventTimestamp(nowMs);
    appendLooperEvent("on", voice.nodeId, t, voice.octave, {
      wrap,
      oneShot: isOneShot,
    });
    if (looperState === "recording") {
      looperLoopDurationMs = Math.max(looperLoopDurationMs, t);
    }
  }

  return voice;
}

function stopVoice(voice, immediate = false) {
  if (!voice || !voice.oscillator || !audioCtx) {
    return;
  }

  sendMidiOutNoteOff(voice);

  const osc = voice.oscillator;
  const hasStop = typeof osc.stop === "function" && !voice.usesWorklet;
  const envGain = voice.envGain;
  const lfoGain = voice.lfoGain;
  const morphGain = voice.morphGain;
  voice.oscillator = null;
  voice.releasing = true;
  voice.morphState = null;
  const nowMs = performance.now();
  const lfoLevel = voice.lfoActive ? getLfoGainValue(voice, nowMs) : 1;
  voice.lfoActive = false;

  const now = audioCtx.currentTime;
  const release = immediate ? 0.02 : getEnvelopeReleaseSeconds() || 0.6;
  const baseLevel = getVoiceBaseEnvelope(voice, now);
  voice.releaseStartSec = now;
  voice.releaseDurationSec = release;
  voice.releaseStartLevel = baseLevel;
  ensureLfoLoop();
  if (envGain) {
    envGain.gain.cancelScheduledValues(now);
    const currentEnv = Math.max(envGain.gain.value, 0.0001);
    envGain.gain.setValueAtTime(currentEnv * lfoLevel, now);
    if (lfoGain) {
      lfoGain.gain.cancelScheduledValues(now);
      lfoGain.gain.setValueAtTime(1, now);
    }
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + release);
    if (voice.usesSoundfont && voice.sfStop) {
      voice.sfStop(now);
      const timeoutMs = (release + 0.1) * 1000;
      setTimeout(() => {
        if (voice.sfOutput) {
          voice.sfOutput.disconnect();
        }
        if (envGain) {
          envGain.disconnect();
        }
        if (lfoGain) {
          lfoGain.disconnect();
        }
        if (morphGain) {
          morphGain.disconnect();
        }
        removeVoiceById(voice.id);
      }, timeoutMs);
    } else if (hasStop) {
      osc.stop(now + release + 0.05);
    } else {
      const timeoutMs = (release + 0.05) * 1000;
      setTimeout(() => {
        if (typeof osc.disconnect === "function") {
          osc.disconnect();
        }
        if (envGain) {
          envGain.disconnect();
        }
        if (lfoGain) {
          lfoGain.disconnect();
        }
        if (morphGain) {
          morphGain.disconnect();
        }
        removeVoiceById(voice.id);
      }, timeoutMs);
    }
  } else {
    if (voice.usesSoundfont && voice.sfStop) {
      voice.sfStop(now);
      setTimeout(() => {
        if (voice.sfOutput) {
          voice.sfOutput.disconnect();
        }
        if (morphGain) {
          morphGain.disconnect();
        }
        removeVoiceById(voice.id);
      }, 150);
    } else if (hasStop) {
      osc.stop(now + 0.1);
    } else {
      setTimeout(() => {
        if (typeof osc.disconnect === "function") {
          osc.disconnect();
        }
        if (morphGain) {
          morphGain.disconnect();
        }
        removeVoiceById(voice.id);
      }, 150);
    }
  }

  if (shouldCaptureLooperInput(voice) && !voice.loopOffRecorded && !voice.oneShot) {
    const nowMs = performance.now();
    const wrap = looperState === "overdubbing";
    const t = getLooperEventTimestamp(nowMs);
    appendLooperEvent("off", voice.nodeId, t, voice.octave, { wrap });
    if (looperState === "recording") {
      looperLoopDurationMs = Math.max(looperLoopDurationMs, t);
    }
    voice.loopOffRecorded = true;
  }
  if (!layoutMode) {
    schedulePresetUrlUpdate();
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

function stopAllVoicesSmooth() {
  const active = [...voices];
  active.forEach((voice) => stopVoice(voice, false));
}

function enableAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    updateVolume();
  }

  ensureKarplusWorklet();
  ensureResonatorWorklet();
  ensureSoundfontLoaded();
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  audioToggle.textContent = "Sound On";
  audioToggle.classList.add("button-on");
  maybeApplyPendingPlayState();
}

function disableAudio() {
  if (!audioCtx) {
    return;
  }

  stopAllVoices();
  audioCtx.suspend();
  audioToggle.textContent = "Sound Off";
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
  const keyboardMode = getKeyboardMode();
  const useCustomMap = keyboardMode === "piano-custom";
  if (useCustomMap && customPianoMapMode) {
    return;
  }
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
    if (useCustomMap) {
      const pc = ((data1 % 12) + 12) % 12;
      const targetFreq = midiToFrequency(data1, Number(a4Input.value) || 440);
      const nearest = findNearestPitchInstance(targetFreq);
      const octaveOffset = nearest
        ? nearest.octave
        : Math.floor((data1 - KEYBOARD_BASE_MIDI) / 12);
      const voices = startCustomPianoMappedVoices(pc, "midi", velocity, octaveOffset);
      if (voices.length) {
        midiActiveNotes.set(key, voices);
        draw();
      }
    } else {
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
    }
  } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
    const entry = midiActiveNotes.get(key);
    if (entry == null) {
      return;
    }
    midiActiveNotes.delete(key);
    if (Array.isArray(entry)) {
      stopCustomPianoMappedVoices(entry);
      return;
    }
    const voice = findVoiceById(entry);
    stopVoice(voice);
    draw();
  }
}

function populateMidiOutputs() {
  if (!midiOutPortSelect || !midiAccess) {
    return;
  }
  const current = midiOutPortSelect.value;
  midiOutPortSelect.innerHTML = "";
  const outputs = Array.from(midiAccess.outputs.values());
  if (!outputs.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No MIDI outputs";
    midiOutPortSelect.appendChild(option);
    return;
  }
  outputs.forEach((output) => {
    const option = document.createElement("option");
    option.value = output.id;
    option.textContent = output.name || `MIDI ${output.id}`;
    midiOutPortSelect.appendChild(option);
  });
  const nextValue = outputs.find((output) => output.id === current) ? current : outputs[0].id;
  midiOutPortSelect.value = nextValue;
  selectMidiOutput(nextValue);
}

function selectMidiOutput(outputId) {
  if (!midiAccess) {
    return;
  }
  const nextOutput = Array.from(midiAccess.outputs.values()).find(
    (output) => output.id === outputId
  );
  midiOutDevice = nextOutput || null;
  if (midiOutEnabled && midiOutDevice) {
    sendMidiOutPitchBendRange();
  }
}

function sendMidiOutRpn(channel, msb, lsb, dataMsb, dataLsb = 0) {
  if (!midiOutDevice) {
    return;
  }
  const status = 0xb0 | (channel - 1);
  midiOutDevice.send([status, 101, msb]);
  midiOutDevice.send([status, 100, lsb]);
  midiOutDevice.send([status, 6, dataMsb]);
  midiOutDevice.send([status, 38, dataLsb]);
  midiOutDevice.send([status, 101, 127]);
  midiOutDevice.send([status, 100, 127]);
}

function sendMidiOutPitchBendRange() {
  const range = Math.min(12, Math.max(0.1, Number(midiOutBendRange) || 2));
  midiOutBendRange = range;
  midiOutChannelPool.forEach((channel) => {
    sendMidiOutRpn(channel, 0, 0, Math.round(range), 0);
  });
}

function sendMidiOutPitchBend(channel, bendValue) {
  if (!midiOutDevice) {
    return;
  }
  const value = Math.max(0, Math.min(16383, Math.round(bendValue)));
  const lsb = value & 0x7f;
  const msb = (value >> 7) & 0x7f;
  midiOutDevice.send([0xe0 | (channel - 1), lsb, msb]);
}

function updateMidiOutVoicePitch(voice) {
  if (!midiOutEnabled || !midiOutDevice || !voice) {
    return;
  }
  const entry = midiOutActive.get(voice.id);
  if (!entry) {
    return;
  }
  const freq = Number(voice.freq);
  if (!Number.isFinite(freq) || freq <= 0) {
    return;
  }
  const a4 = Number(a4Input.value) || 440;
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const delta = midiFloat - entry.note;
  const bend = 8192 + (delta / midiOutBendRange) * 8192;
  sendMidiOutPitchBend(entry.channel, bend);
}

function allocateMidiOutChannel() {
  if (!midiOutChannelPool.length) {
    return null;
  }
  return midiOutChannelPool.shift();
}

function releaseMidiOutChannel(channel) {
  if (!channel || midiOutChannelPool.includes(channel)) {
    return;
  }
  midiOutChannelPool.push(channel);
}

function sendMidiOutNoteOn(voice) {
  if (!midiOutEnabled || !midiOutDevice || !voice) {
    return;
  }
  if (voice.source === "midi") {
    return;
  }
  const channel = allocateMidiOutChannel();
  if (!channel) {
    return;
  }
  const freq = Number(voice.freq);
  if (!Number.isFinite(freq) || freq <= 0) {
    releaseMidiOutChannel(channel);
    return;
  }
  const a4 = Number(a4Input.value) || 440;
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const baseMidi = Math.min(127, Math.max(0, Math.round(midiFloat)));
  const delta = midiFloat - baseMidi;
  const bend = 8192 + (delta / midiOutBendRange) * 8192;
  sendMidiOutPitchBend(channel, bend);
  const velocity = Math.min(127, Math.max(1, Math.round((voice.velocity ?? 1) * 127)));
  midiOutDevice.send([0x90 | (channel - 1), baseMidi, velocity]);
  midiOutActive.set(voice.id, { channel, note: baseMidi });
}

function sendMidiOutNoteOff(voice) {
  if (!midiOutDevice || !voice) {
    return;
  }
  const entry = midiOutActive.get(voice.id);
  if (!entry) {
    return;
  }
  midiOutDevice.send([0x80 | (entry.channel - 1), entry.note, 0]);
  midiOutActive.delete(voice.id);
  releaseMidiOutChannel(entry.channel);
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
      populateMidiOutputs();
    };
    populateMidiPorts();
    populateMidiChannels();
    populateMidiOutputs();
  } catch (error) {
    console.warn("MIDI access failed", error);
  }
}

function onPointerDown(event) {
  if (canvas && document.activeElement !== canvas) {
    canvas.focus();
  }
  closeTopMenus("ratio-wheel");
  closeBottomMenus();
  const screenPoint = { x: event.offsetX, y: event.offsetY };
  if (layoutMode && layoutLabelHitboxVisible && !hitTestNoteLabel(screenPoint)) {
    layoutLabelHitboxVisible = false;
    draw();
  }
  const hit = hitTestScreen(screenPoint);
  if (nodeVolumeAdjustMode) {
    const sliderHit = hitTestNodeVolumeSlider(screenPoint);
    if (sliderHit) {
      nodeVolumeSliderDrag = { nodeId: sliderHit.nodeId };
      updateNodeVolumeFromSlider(screenPoint, sliderHit);
      canvas.setPointerCapture(event.pointerId);
      draw();
      return;
    }
  }
  if (addIntervalMode) {
    return;
  }
  if (layoutMode && !layoutLockPosition) {
    const use3dNav = Boolean(layoutPrevState && layoutPrevState.is3DMode);
    if (use3dNav) {
      if (event.shiftKey) {
        view.dragging = true;
        view.dragStart = { x: event.offsetX, y: event.offsetY };
        view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
      } else {
        view.rotating = true;
        view.rotateStart = { x: event.offsetX, y: event.offsetY };
        view.rotateAnglesStart = { x: view.rotX, y: view.rotY };
      }
      view.reducedEffects = false;
      view.interactionStart = {
        x: event.offsetX,
        y: event.offsetY,
        time: performance.now(),
      };
      view.lastPointer = { x: event.offsetX, y: event.offsetY };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    view.dragging = true;
    view.dragStart = { x: event.offsetX, y: event.offsetY };
    view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
    view.lastPointer = { x: event.offsetX, y: event.offsetY };
    canvas.setPointerCapture(event.pointerId);
    return;
  }
  if (DEBUG_R_CLICK) {
    console.log("R-click debug: pointerdown", {
      rHeld,
      hitId: hit ? hit.id : null,
      hitCenter: hit ? Boolean(hit.isCenter) : null,
      hitRatio: hit ? `${hit.numerator}/${hit.denominator}` : null,
      isCustom: hit ? Boolean(hit.isCustom) : null,
      spellingMode,
      customPianoMapMode: isCustomPianoMapModeActive(),
      layoutMode,
      isAddMode,
    });
  }
  if (analysisLayers.distances && (distanceSelectMode || layoutMode)) {
    if (distanceSelectMode && event.altKey) {
      const labelHit = hitTestDistanceLabel(screenPoint);
      const lineHit = hitTestDistanceLine(screenPoint);
      const key = (labelHit && labelHit.key) || (lineHit && lineHit.key);
      if (key) {
        distanceSelectedEdges.delete(key);
        distanceEdgeOverrides.delete(key);
        scheduleDraw();
        schedulePresetUrlUpdate();
      }
      return;
    }
    const labelHit = hitTestDistanceLabel(screenPoint);
    if (labelHit) {
      distanceLabelDrag = {
        key: labelHit.key,
        lineStart: labelHit.lineStart,
        lineEnd: labelHit.lineEnd,
        control: labelHit.control || labelHit.defaultControl,
        startPoint: { x: event.offsetX, y: event.offsetY },
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const lineHit = hitTestDistanceLine(screenPoint);
    if (lineHit) {
      const startControl = lineHit.control || lineHit.defaultControl;
      distanceCurveDrag = {
        key: lineHit.key,
        startControlOffset: {
          x: startControl.x - lineHit.defaultControl.x,
          y: startControl.y - lineHit.defaultControl.y,
        },
        defaultControl: { ...lineHit.defaultControl },
        startPoint: { x: event.offsetX, y: event.offsetY },
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    if (layoutMode) {
      // allow normal layout dragging when no distance line/label is hit
    }
    if (distanceSelectMode && hit && hit.active) {
      distanceSelectDrag = {
        startNodeId: hit.id,
        startKey: getDistanceNodeKey(hit),
        startPoint: { x: event.offsetX, y: event.offsetY },
        hoverNodeId: null,
        lastPoint: { x: event.offsetX, y: event.offsetY },
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    if (distanceSelectMode && hit) {
      return;
    }
  }
  if (layoutMode && layoutAlignMode) {
    if (hit) {
      if (layoutAlignMode === "straighten") {
        if (!layoutStraightenAnchorId) {
          layoutStraightenAnchorId = hit.id;
        } else if (!layoutStraightenDir) {
          const anchor = nodeById.get(layoutStraightenAnchorId);
          if (anchor && anchor.id !== hit.id) {
            const anchorPos = ensureLayoutPosition(anchor);
            const targetPos = ensureLayoutPosition(hit);
            const dx = targetPos.x - anchorPos.x;
            const dy = targetPos.y - anchorPos.y;
            const len = Math.hypot(dx, dy);
            if (len > 0.0001) {
              layoutStraightenDir = { x: dx / len, y: dy / len };
            }
          }
        } else if (layoutStraightenAnchorId !== hit.id) {
          const anchor = nodeById.get(layoutStraightenAnchorId);
          if (anchor) {
            pushLayoutUndoState();
            applyLayoutStraightenToNode(hit, anchor, layoutStraightenDir);
            draw();
            schedulePresetUrlUpdate();
          }
        }
      } else {
        if (!layoutAlignAnchorId) {
          layoutAlignAnchorId = hit.id;
        } else if (layoutAlignAnchorId !== hit.id) {
          const anchor = nodeById.get(layoutAlignAnchorId);
          if (anchor) {
            pushLayoutUndoState();
            applyLayoutAlignToNode(hit, anchor, layoutAlignMode);
            draw();
            schedulePresetUrlUpdate();
          }
        }
      }
    }
    return;
  }
  const now = performance.now();
  if (isCustomPianoMapModeActive()) {
    if (hit) {
      customPianoMapClickActive = true;
      if (customPianoSelectedKey != null) {
        toggleCustomPianoMapping(customPianoSelectedKey, hit.id);
      }
      toggleCustomPianoPreviewVoice(hit);
      return;
    }
    if (tHeld || rHeld || (layoutMode && customTextHeld)) {
      return;
    }
    if (layoutMode) {
      view.dragging = true;
      pushLayoutUndoState();
      view.dragStart = { x: event.offsetX, y: event.offsetY };
      view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
      view.lastPointer = { x: event.offsetX, y: event.offsetY };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
  }

  if (oHeld && hit) {
    openOctaveShiftDialog(hit);
    return;
  }

  if (rHeld && hit) {
    const isOneToOne = hit.isCenter || (!hit.isCustom && hit.numerator === hit.denominator);
    if (isOneToOne && spellingMode !== "simple") {
      const a4 = Number(a4Input.value) || 440;
      const nearest = getNearestEtInfo(Number(hit.freq), a4);
      const targetPc = nearest.midi % 12;
      const options = getManualSpellingOptions(targetPc);
      const currentName = getFundamentalNoteNames()[targetPc];
      const allowed = options.filter(
        (option) =>
          option.pitchClass === noteNamesSharp[targetPc] ||
          option.pitchClass === noteNamesFlat[targetPc]
      );
      if (allowed.length) {
        let currentIndex = allowed.findIndex((option) => option.pitchClass === currentName);
        if (currentIndex < 0) {
          currentIndex = 0;
        }
        const nextOption = allowed[(currentIndex + 1) % allowed.length];
        fundamentalSpelling = nextOption.pitchClass.includes("b") ? "flat" : "sharp";
        updateFundamentalNotes();
        if (spellingMode === "simple") {
          nodeSpellingOverrides.clear();
        }
        invalidateLabelCache();
        draw();
        schedulePresetUrlUpdate();
      }
      suppressClickAfterRespell = true;
      return;
    }
    if (spellingMode === "simple") {
      const a4 = Number(a4Input.value) || 440;
      const nearest = getNearestEtInfo(Number(hit.freq), a4);
      let targetPc = nearest.midi % 12;
      if (hejiEnabled) {
        const ratioX = Number(ratioXSelect.value);
        const ratioY = Number(ratioYSelect.value);
        const ratioZ = Number(ratioZSelect.value);
        const axisRatios = [
          { ratio: ratioX, exp: Number(hit.exponentX) || 0 },
          { ratio: ratioY, exp: Number(hit.exponentY) || 0 },
          { ratio: ratioZ, exp: Number(hit.exponentZ) || 0 },
        ];
        let totalOffset = 0;
        let hasOffsetAxis = false;
        axisRatios.forEach((axis) => {
          if (!axis.exp) {
            return;
          }
          const step = HEJI_STEP_OFFSETS[axis.ratio];
          if (!Number.isFinite(step)) {
            return;
          }
          hasOffsetAxis = true;
          totalOffset += axis.exp * step;
        });
        if (hasOffsetAxis) {
          let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
          if (!Number.isFinite(fundamentalMidi)) {
            const fallback = getNearestEtInfo(Number(fundamentalInput.value) || 220, a4);
            fundamentalMidi = fallback.midi;
          }
          const basePc = ((fundamentalMidi % 12) + 12) % 12;
          targetPc = ((basePc + totalOffset) % 12 + 12) % 12;
        }
      }
      const options = getManualSpellingOptions(targetPc);
      const currentKey = nodeSpellingOverrides.get(hit.id);
      let currentIndex = options.findIndex((option) => option.key === currentKey);
      if (currentIndex < 0) {
        currentIndex = -1;
      }
      const nextIndex = (currentIndex + 1) % options.length;
      const nextKey = options[nextIndex].key;
      if (nextKey === "base") {
        nodeSpellingOverrides.delete(hit.id);
      } else {
        nodeSpellingOverrides.set(hit.id, nextKey);
      }
      invalidateLabelCache();
      suppressClickAfterRespell = true;
      draw();
      schedulePresetUrlUpdate();
      return;
    }
  }
  if (tHeld) {
    const triangle = findTriangleHit(screenPoint);
    if (triangle) {
      const keys = triangleCellKeys(triangle);
      const disableScale = shouldDisableLayoutScale();
      const gridMap = new Map();
      nodes.forEach((node) => {
        if (node.active && !node.isCustom) {
          gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
        }
      });
      const hasBackslash = triangleDiagonals.has(keys.backslash);
      const hasSlash = triangleDiagonals.has(keys.slash);
      const hasLine = hasBackslash || hasSlash;
      const activeDiag = hasBackslash ? "backslash" : hasSlash ? "slash" : null;
      const diagHit = activeDiag
        ? getTriangleDiagonalHit(screenPoint, triangle, gridMap, disableScale)
        : null;
      const lineHit = diagHit && diagHit === activeDiag;
      if (hasLine && lineHit) {
        if (triangle.both) {
          if (hasBackslash && !hasSlash) {
            triangleDiagonals.delete(keys.backslash);
            const nextEntry = normalizeTriangleEntry({ ...triangle, diag: "slash", tri: "abc" });
            triangleDiagonals.set(keys.slash, nextEntry);
            clearTriangleLabelsForCell(triangle);
          } else if (hasSlash && !hasBackslash) {
            triangleDiagonals.delete(keys.slash);
            clearTriangleLabelsForCell(triangle);
          }
        } else {
          const key = triangleKey(triangle);
          if (triangleDiagonals.has(key)) {
            triangleDiagonals.delete(key);
            clearTriangleLabelsForCell(triangle);
          }
        }
      } else if (!hasLine) {
        const nextEntry = normalizeTriangleEntry(triangle);
        triangleDiagonals.set(triangleKey(nextEntry), nextEntry);
      } else if (triangle.tri && triangleLabelDialog && triangleLabelInput) {
        const activeDiag = hasBackslash ? "backslash" : "slash";
        if (TRIANGLE_TRI_TO_DIAG[triangle.tri] !== activeDiag) {
          schedulePresetUrlUpdate();
          draw();
          return;
        }
        const targetEntry = {
          plane: triangle.plane,
          x: triangle.x,
          y: triangle.y,
          z: triangle.z,
          tri: triangle.tri,
        };
        const targetKey = triangleLabelKey(targetEntry);
        const entry = triangleLabels.get(targetKey);
        triangleLabelTargetKey = targetKey;
        triangleLabelTargetTri = triangle.tri;
        openTriangleLabelDialog(entry && entry.label ? entry.label : "");
      }
      schedulePresetUrlUpdate();
      draw();
    }
    return;
  }

  if (layoutMode) {
    if (event.altKey && !event.shiftKey) {
      const handleHit = hitTestAxisLegendHandle(screenPoint);
      if (handleHit && layoutAxisOffsets[handleHit.axis]) {
        pushLayoutUndoState();
        layoutAxisOffsets[handleHit.axis] = { x: 0, y: 0 };
        layoutAxisAngles[handleHit.axis] = null;
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const customLabelHit = hitTestLayoutCustomLabel(screenPoint);
      if (customLabelHit) {
        pushLayoutUndoState();
        const entry = layoutCustomLabels.find((label) => label.id === customLabelHit.entry.id);
        if (entry) {
          entry.position = null;
        }
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const titleHit = hitTestLayoutTitle(screenPoint);
      if (titleHit) {
        pushLayoutUndoState();
        layoutTitlePosition = null;
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const creatorHit = hitTestLayoutCreator(screenPoint);
      if (creatorHit) {
        pushLayoutUndoState();
        layoutCreatorPosition = null;
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const axisHit = hitTestAxisLegend(screenPoint);
      if (axisHit && layoutAxisOffsets[axisHit.axis]) {
        pushLayoutUndoState();
        layoutAxisOffsets[axisHit.axis] = { x: 0, y: 0 };
        layoutAxisAngles[axisHit.axis] = null;
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const keyMappingHit = hitTestLayoutKeyMappingLabel(screenPoint);
      if (keyMappingHit) {
        pushLayoutUndoState();
        layoutKeyMappingOffsets.delete(keyMappingHit.node.id);
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const labelHit = hitTestNoteLabel(screenPoint);
      if (labelHit) {
        pushLayoutUndoState();
        layoutLabelOffsets.delete(labelHit.node.id);
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      const edgeLabelHit = hitTestEdgeLabel(screenPoint);
      if (edgeLabelHit && edgeLabelHit.key) {
        pushLayoutUndoState();
        lineLabelPositionOverrides.delete(edgeLabelHit.key);
        schedulePresetUrlUpdate();
        draw();
        return;
      }
      if (hit) {
        pushLayoutUndoState();
        layoutPositions.delete(hit.id);
        if (!hit.isCustom) {
          const key = `${hit.exponentX},${hit.exponentY},${hit.exponentZ || 0}`;
          layoutPositionOffsets.delete(key);
        }
        schedulePresetUrlUpdate();
        draw();
        return;
      }
    }
    if (customTextHeld) {
      if (layoutCustomLabelDialog && !layoutCustomLabelDialog.open) {
        const { left, top } = getLayoutPageRect();
        layoutCustomLabelPending = {
          x: screenPoint.x - left,
          y: screenPoint.y - top,
        };
        openLayoutCustomLabelDialog();
      }
      return;
    }
    if (layoutAxisEdit) {
      const handleHit = hitTestAxisLegendHandle(screenPoint);
      if (handleHit) {
        pushLayoutUndoState();
        layoutAxisEditDrag = { axis: handleHit.axis };
        canvas.setPointerCapture(event.pointerId);
      }
      return;
    }
    const customLabelHit = hitTestLayoutCustomLabel(screenPoint);
    if (customLabelHit) {
      event.preventDefault();
      pushLayoutUndoState();
      const { left, top } = getLayoutPageRect();
      layoutCustomLabelDrag = {
        id: customLabelHit.entry.id,
        offsetX: customLabelHit.pos.x - screenPoint.x,
        offsetY: customLabelHit.pos.y - screenPoint.y,
        startPos: { x: customLabelHit.pos.x - left, y: customLabelHit.pos.y - top },
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const titleHit = hitTestLayoutTitle(screenPoint);
    if (titleHit) {
      event.preventDefault();
      pushLayoutUndoState();
      const { left, top } = getLayoutPageRect();
      layoutTitleDrag = {
        offsetX: titleHit.pos.x - screenPoint.x,
        offsetY: titleHit.pos.y - screenPoint.y,
        startPos: { x: titleHit.pos.x - left, y: titleHit.pos.y - top },
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const creatorHit = hitTestLayoutCreator(screenPoint);
    if (creatorHit) {
      event.preventDefault();
      pushLayoutUndoState();
      const { left, top } = getLayoutPageRect();
      layoutCreatorDrag = {
        offsetX: creatorHit.pos.x - screenPoint.x,
        offsetY: creatorHit.pos.y - screenPoint.y,
        startPos: { x: creatorHit.pos.x - left, y: creatorHit.pos.y - top },
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const axisHit = hitTestAxisLegend(screenPoint);
    if (axisHit) {
      pushLayoutUndoState();
      layoutAxisDrag = {
        axis: axisHit.axis,
        offsetX: axisHit.center.x - screenPoint.x,
        offsetY: axisHit.center.y - screenPoint.y,
        startOffset: { ...layoutAxisOffsets[axisHit.axis] },
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const keyMappingHit = hitTestLayoutKeyMappingLabel(screenPoint);
    if (keyMappingHit) {
      pushLayoutUndoState();
      layoutKeyMappingDrag = {
        nodeId: keyMappingHit.node.id,
        offsetX: keyMappingHit.labelPos.x - screenPoint.x,
        offsetY: keyMappingHit.labelPos.y - screenPoint.y,
        startLabelX: keyMappingHit.labelPos.x,
        startLabelY: keyMappingHit.labelPos.y,
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const labelHit = hitTestNoteLabel(screenPoint);
    if (labelHit) {
      pushLayoutUndoState();
      layoutLabelDrag = {
        nodeId: labelHit.node.id,
        offsetX: labelHit.labelPos.x - screenPoint.x,
        offsetY: labelHit.labelPos.y - screenPoint.y,
        startLabelX: labelHit.labelPos.x,
        startLabelY: labelHit.labelPos.y,
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    const edgeLabelHit = hitTestEdgeLabel(screenPoint);
    if (
      edgeLabelHit &&
      edgeLabelHit.a &&
      edgeLabelHit.b &&
      edgeLabelHit.key &&
      shouldShowEdgeLabel(edgeLabelHit.a, edgeLabelHit.b)
    ) {
      pushLayoutUndoState();
      lineLabelDrag = {
        key: edgeLabelHit.key,
        a: edgeLabelHit.a,
        b: edgeLabelHit.b,
        lineStart: edgeLabelHit.lineStart,
        lineEnd: edgeLabelHit.lineEnd,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    if (hit) {
      const worldPoint = screenToWorld(screenPoint);
      const coord = getNodeDisplayCoordinate(hit);
      pushLayoutUndoState();
      layoutDrag = {
        nodeId: hit.id,
        offsetX: coord.x - worldPoint.x,
        offsetY: coord.y - worldPoint.y,
        startCoord: { x: coord.x, y: coord.y },
        startScreen: { x: event.offsetX, y: event.offsetY },
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
        axisLock: null,
        axisLockOriginX: event.offsetX,
        axisLockOriginY: event.offsetY,
      };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    view.dragging = true;
    pushLayoutUndoState();
    view.dragStart = { x: event.offsetX, y: event.offsetY };
    view.dragOffsetStart = { x: view.offsetX, y: view.offsetY };
    view.lastPointer = { x: event.offsetX, y: event.offsetY };
    canvas.setPointerCapture(event.pointerId);
    return;
  }

  if (!layoutMode && lHeld && hit) {
    lfoArmingId = hit.id;
    lfoArmingStart = now;
    ensureLfoLoop();
    canvas.setPointerCapture(event.pointerId);
    draw();
    return;
  }

  if (
    !layoutMode &&
    !cHeld &&
    hit &&
    hit.isCustom &&
    !event.altKey &&
    !event.shiftKey
  ) {
    const worldPoint = screenToWorld(screenPoint);
    customNodeDrag = {
      nodeId: hit.id,
      startWorld: { x: worldPoint.x, y: worldPoint.y },
      startCoordinate: { x: hit.coordinate.x, y: hit.coordinate.y },
      startScreen: { x: event.offsetX, y: event.offsetY },
      moved: false,
    };
    canvas.setPointerCapture(event.pointerId);
    return;
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
    view.reducedEffects = false;
    view.interactionStart = {
      x: event.offsetX,
      y: event.offsetY,
      time: performance.now(),
    };
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

function onCanvasDoubleClick(event) {
  clearPendingDistanceLabelClick();
  if (layoutMode && layoutAlignMode) {
    setLayoutAlignMode("");
    return;
  }
  if (analysisLayers.microtonal) {
    setMicrotonalIntervalsMode(false);
    return;
  }
  if (!layoutMode && axisModeActive()) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    if (!hit) {
      clearAxisStack();
      updateAddModeFromShift();
      updateUiHint();
      updateBannerMessage();
      schedulePresetUrlUpdate();
      draw();
      return;
    }
  }
  if (distanceSelectMode) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const labelHit = hitTestDistanceLabel(screenPoint);
    if (labelHit) {
      openDistanceLabelDialog(labelHit.key);
      return;
    }
    if (!hitTestScreen(screenPoint)) {
      setDistanceSelectMode(false);
      return;
    }
  }
  if (!distanceSelectMode && analysisLayers.distances && !layoutMode) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const lineHit = hitTestDistanceLine(screenPoint);
    if (lineHit) {
      setDistanceSelectMode(true);
      return;
    }
  }
  if (layoutMode && analysisLayers.distances) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const labelHit = hitTestDistanceLabel(screenPoint);
    if (labelHit) {
      openDistanceLabelDialog(labelHit.key);
      return;
    }
  }
  if (isCustomPianoMapModeActive()) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    if (!hit) {
      setCustomPianoMapMode(false);
      return;
    }
  }
  const screenPoint = { x: event.offsetX, y: event.offsetY };
  const edgeHit = hitTestEdgeLabel(screenPoint);
  if (edgeHit) {
    toggleEdgeLabelOverride(edgeHit.a, edgeHit.b);
    schedulePresetUrlUpdate();
    draw();
    return;
  }
  if (!layoutMode) {
    const hit = hitTestScreen(screenPoint);
    if (hit && hit.isCustom) {
      openCustomRatioDialog({ type: "edit", nodeId: hit.id });
    }
    return;
  }
  const customLabelHit = hitTestLayoutCustomLabel(screenPoint);
  if (customLabelHit) {
    layoutCustomLabelEditId = customLabelHit.entry.id;
    openLayoutCustomLabelDialog(customLabelHit.entry.text || "");
    return;
  }
  const labelHit = hitTestNoteLabel(screenPoint);
  if (labelHit) {
    layoutLabelHitboxVisible = true;
    draw();
    return;
  }
  const axisHit = hitTestAxisLegend(screenPoint);
  if (layoutAxisEdit) {
    if (!axisHit) {
      layoutAxisEdit = null;
      layoutAxisEditDrag = null;
      updateUiHint();
      draw();
    } else if (axisHit.axis !== layoutAxisEdit) {
      layoutAxisEdit = axisHit.axis;
      layoutAxisEditDrag = null;
      updateUiHint();
      draw();
    }
    return;
  }
  if (axisHit) {
    layoutAxisEdit = axisHit.axis;
    layoutAxisEditDrag = null;
    updateUiHint();
    draw();
    return;
  }
  const hit = hitTestScreen(screenPoint);
  if (!hit) {
    return;
  }
  const shapes = ["circle", "square", "diamond", "none"];
  const current = getLayoutNodeShape(hit);
  const index = shapes.indexOf(current);
  const next = shapes[(index + 1) % shapes.length];
  const defaultShape = getDefaultLayoutNodeShape(hit);
  pushLayoutUndoState();
  if (next === defaultShape) {
    layoutNodeShapes.delete(hit.id);
  } else {
    layoutNodeShapes.set(hit.id, next);
  }
  draw();
  schedulePresetUrlUpdate();
}

function onPointerMove(event) {
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  updateMicrotonalHoverFocus(view.lastPointer);
  if (nodeVolumeSliderDrag) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const slider = nodeVolumeSliderHitboxes.find(
      (entry) => entry.nodeId === nodeVolumeSliderDrag.nodeId
    );
    if (slider && updateNodeVolumeFromSlider(screenPoint, slider)) {
      draw();
    }
    return;
  }
  if (distanceSelectDrag) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    const nextHoverId = hit && hit.active ? hit.id : null;
    if (nextHoverId !== distanceSelectDrag.hoverNodeId) {
      distanceSelectDrag.hoverNodeId = nextHoverId;
      scheduleDraw();
    }
    distanceSelectDrag.lastPoint = { x: event.offsetX, y: event.offsetY };
    return;
  }
  if (distanceLabelDrag) {
    const { lineStart, lineEnd, key, control } = distanceLabelDrag;
    const t = getNearestQuadraticT(lineStart, control, lineEnd, {
      x: event.offsetX,
      y: event.offsetY,
    });
    const override = getDistanceEdgeOverride(key) || {};
    distanceEdgeOverrides.set(key, {
      ...override,
      labelT: t,
    });
    scheduleDraw();
    return;
  }
  if (lineLabelDrag) {
    const t = getSegmentClosestT(
      { x: event.offsetX, y: event.offsetY },
      lineLabelDrag.lineStart,
      lineLabelDrag.lineEnd
    );
    setLineLabelPositionOverride(lineLabelDrag.a, lineLabelDrag.b, t);
    scheduleDraw();
    updatePresetUrl("line-label-drag-move");
    return;
  }
  if (distanceCurveDrag) {
    const { key, startControlOffset, startPoint, defaultControl } = distanceCurveDrag;
    const controlOffset = {
      x: startControlOffset.x + (event.offsetX - startPoint.x),
      y: startControlOffset.y + (event.offsetY - startPoint.y),
    };
    const override = getDistanceEdgeOverride(key) || {};
    distanceEdgeOverrides.set(key, {
      ...override,
      controlOffset,
    });
    scheduleDraw();
    return;
  }
  if (customNodeDrag) {
    const node = nodeById.get(customNodeDrag.nodeId);
    if (node) {
      const dx = event.offsetX - customNodeDrag.startScreen.x;
      const dy = event.offsetY - customNodeDrag.startScreen.y;
      if (!customNodeDrag.moved && Math.hypot(dx, dy) < 3) {
        return;
      }
      customNodeDrag.moved = true;
      const worldPoint = screenToWorld({ x: event.offsetX, y: event.offsetY });
      node.coordinate.x =
        customNodeDrag.startCoordinate.x + (worldPoint.x - customNodeDrag.startWorld.x);
      node.coordinate.y =
        customNodeDrag.startCoordinate.y + (worldPoint.y - customNodeDrag.startWorld.y);
      node.coordinate.z = 0;
      layoutPositions.set(node.id, { ...node.coordinate });
    }
    scheduleDraw();
    updatePresetUrl();
    return;
  }
  if (layoutMode && layoutAxisEditDrag) {
    const info = getAxisLegendInfo(layoutAxisEditDrag.axis);
    if (info) {
      layoutAxisAngles[layoutAxisEditDrag.axis] = Math.atan2(
        event.offsetY - info.center.y,
        event.offsetX - info.center.x
      );
      scheduleDraw();
      schedulePresetUrlUpdate();
    }
    return;
  }
  if (layoutMode && layoutTitleDrag) {
    const { left, top, width } = getLayoutPageRect();
    const lockAxis = updateDragLock(layoutTitleDrag, event);
    const nextPos = {
      x: event.offsetX + layoutTitleDrag.offsetX - left,
      y: event.offsetY + layoutTitleDrag.offsetY - top,
    };
    if (lockAxis === "x") {
      nextPos.y = layoutTitleDrag.startPos.y;
    } else if (lockAxis === "y") {
      nextPos.x = layoutTitleDrag.startPos.x;
    }
    if (!event.shiftKey) {
      layoutTitleDrag.startPos = { ...nextPos };
    }
    layoutTitlePosition = nextPos;
    scheduleDraw();
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutMode && layoutCreatorDrag) {
    const { left, top, width } = getLayoutPageRect();
    const lockAxis = updateDragLock(layoutCreatorDrag, event);
    const nextPos = {
      x: event.offsetX + layoutCreatorDrag.offsetX - left,
      y: event.offsetY + layoutCreatorDrag.offsetY - top,
    };
    if (lockAxis === "x") {
      nextPos.y = layoutCreatorDrag.startPos.y;
    } else if (lockAxis === "y") {
      nextPos.x = layoutCreatorDrag.startPos.x;
    }
    if (!event.shiftKey) {
      layoutCreatorDrag.startPos = { ...nextPos };
    }
    layoutCreatorPosition = nextPos;
    scheduleDraw();
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutMode && layoutCustomLabelDrag) {
    const { left, top } = getLayoutPageRect();
    const lockAxis = updateDragLock(layoutCustomLabelDrag, event);
    const nextPos = {
      x: event.offsetX + layoutCustomLabelDrag.offsetX - left,
      y: event.offsetY + layoutCustomLabelDrag.offsetY - top,
    };
    if (lockAxis === "x") {
      nextPos.y = layoutCustomLabelDrag.startPos.y;
    } else if (lockAxis === "y") {
      nextPos.x = layoutCustomLabelDrag.startPos.x;
    }
    if (!event.shiftKey) {
      layoutCustomLabelDrag.startPos = { ...nextPos };
    }
    const entry = layoutCustomLabels.find((label) => label.id === layoutCustomLabelDrag.id);
    if (entry) {
      entry.position = nextPos;
    }
    scheduleDraw();
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutMode && layoutAxisDrag) {
    const { left, top, width, height } = getLayoutPageRect();
    const { margin } = getAxisLegendSettings();
    let baseX = left + width / 2;
    let baseY = top + height - margin;
    if (layoutAxisDrag.axis === "y") {
      baseX = left + width - margin;
      baseY = top + height / 2;
    } else if (layoutAxisDrag.axis === "z") {
      baseX = left + margin;
      baseY = top + height / 2;
    }
    const lockAxis = updateDragLock(layoutAxisDrag, event);
    const nextOffset = {
      x: event.offsetX + layoutAxisDrag.offsetX - baseX,
      y: event.offsetY + layoutAxisDrag.offsetY - baseY,
    };
    if (lockAxis === "x") {
      nextOffset.y = layoutAxisDrag.startOffset.y;
    } else if (lockAxis === "y") {
      nextOffset.x = layoutAxisDrag.startOffset.x;
    }
    if (!event.shiftKey) {
      layoutAxisDrag.startOffset = { ...nextOffset };
    }
    layoutAxisOffsets[layoutAxisDrag.axis] = nextOffset;
    scheduleDraw();
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutMode && layoutKeyMappingDrag) {
    const node = nodeById.get(layoutKeyMappingDrag.nodeId);
    if (node) {
      const disableScale = shouldDisableLayoutScale();
      const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
      const lockAxis = updateDragLock(layoutKeyMappingDrag, event);
      let labelX = event.offsetX + layoutKeyMappingDrag.offsetX;
      let labelY = event.offsetY + layoutKeyMappingDrag.offsetY;
      if (lockAxis === "x") {
        labelY = layoutKeyMappingDrag.startLabelY;
      } else if (lockAxis === "y") {
        labelX = layoutKeyMappingDrag.startLabelX;
      }
      if (!event.shiftKey) {
        layoutKeyMappingDrag.startLabelX = labelX;
        layoutKeyMappingDrag.startLabelY = labelY;
      }
      const scale = pos.scale || 1;
      layoutKeyMappingOffsets.set(node.id, {
        x: (labelX - pos.x) / (view.zoom * scale),
        y: (labelY - pos.y) / (view.zoom * scale),
      });
      scheduleDraw();
      schedulePresetUrlUpdate();
    }
    return;
  }
  if (layoutMode && layoutLabelDrag) {
    const node = nodeById.get(layoutLabelDrag.nodeId);
    if (node) {
      const disableScale = shouldDisableLayoutScale();
      const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
      const lockAxis = updateDragLock(layoutLabelDrag, event);
      let labelX = event.offsetX + layoutLabelDrag.offsetX;
      let labelY = event.offsetY + layoutLabelDrag.offsetY;
      if (lockAxis === "x") {
        labelY = layoutLabelDrag.startLabelY;
      } else if (lockAxis === "y") {
        labelX = layoutLabelDrag.startLabelX;
      }
      if (!event.shiftKey) {
        layoutLabelDrag.startLabelX = labelX;
        layoutLabelDrag.startLabelY = labelY;
      }
      const scale = pos.scale || 1;
      layoutLabelOffsets.set(node.id, {
        x: (labelX - pos.x) / (view.zoom * scale),
        y: (labelY - pos.y) / (view.zoom * scale),
      });
      scheduleDraw();
      schedulePresetUrlUpdate();
    }
    return;
  }
  if (layoutMode && layoutDrag) {
    const node = nodeById.get(layoutDrag.nodeId);
    if (node) {
      const coord = getNodeDisplayCoordinate(node);
      const delta = {
        x: event.offsetX - layoutDrag.startScreen.x,
        y: event.offsetY - layoutDrag.startScreen.y,
      };
      const axisLock = updateProjectedAxisLock(layoutDrag, event);
      const useProjectedAxis = Boolean(axisLock);
      if (useProjectedAxis && layoutDrag.axisLockJustSet) {
        layoutDrag.startScreen = { x: event.offsetX, y: event.offsetY };
        layoutDrag.startCoord = { x: coord.x, y: coord.y, z: coord.z };
        layoutDrag.axisLockJustSet = false;
        return;
      }
      const useDelta = useProjectedAxis
        ? {
            x: axisLock.dir.x * (delta.x * axisLock.dir.x + delta.y * axisLock.dir.y),
            y: axisLock.dir.y * (delta.x * axisLock.dir.x + delta.y * axisLock.dir.y),
          }
        : delta;
      const lockAxis = useProjectedAxis ? null : updateDragLock(layoutDrag, event);
      const deltaWorld = screenDeltaToWorldDelta(
        useDelta,
        layoutDrag.startCoord,
        shouldDisableLayoutScale()
      );
      const nextCoord = {
        x: layoutDrag.startCoord.x + deltaWorld.x,
        y: layoutDrag.startCoord.y + deltaWorld.y,
        z: Number.isFinite(coord.z) ? coord.z : 0,
      };
      if (lockAxis === "x") {
        nextCoord.y = layoutDrag.startCoord.y;
      } else if (lockAxis === "y") {
        nextCoord.x = layoutDrag.startCoord.x;
      }
      if (!event.shiftKey || !event.altKey) {
        layoutDrag.startCoord = { x: nextCoord.x, y: nextCoord.y };
        layoutDrag.startScreen = { x: event.offsetX, y: event.offsetY };
      }
      layoutPositions.set(node.id, nextCoord);
      if (!node.isCustom) {
        const base = getLayoutBaseCoordinate(node);
        const offset = {
          x: nextCoord.x - base.x,
          y: nextCoord.y - base.y,
          z: nextCoord.z - base.z,
        };
        const key = `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
        if (
          Math.abs(offset.x) < 0.01 &&
          Math.abs(offset.y) < 0.01 &&
          Math.abs(offset.z) < 0.01
        ) {
          layoutPositionOffsets.delete(key);
        } else {
          layoutPositionOffsets.set(key, offset);
        }
      }
      scheduleDraw();
      updatePresetUrl(`layout-node-drag-move:${node.isCustom ? "custom" : "base"}:${node.id}`);
    }
    return;
  }
  if (view.rotating) {
    updateReducedEffects(event);
    const dx = event.offsetX - view.rotateStart.x;
    const dy = event.offsetY - view.rotateStart.y;
    view.rotY = view.rotateAnglesStart.y + dx * 0.005;
    view.rotX = view.rotateAnglesStart.x + dy * 0.005;
    view.rotX = Math.max(-1.2, Math.min(1.2, view.rotX));
    scheduleDraw();
    markIsomorphicDirty();
    schedulePresetUrlUpdate();
    return;
  }
  if (tHeld && !isCustomPianoMapModeActive() && !view.dragging && !view.rotating) {
    const screen = { x: event.offsetX, y: event.offsetY };
    const nextTriangle = findTriangleHit(screen);
    const nextKey = nextTriangle
      ? `${triangleKey(nextTriangle)}:${nextTriangle.tri || ""}`
      : "";
    const currentKey = triangleHover
      ? `${triangleKey(triangleHover)}:${triangleHover.tri || ""}`
      : "";
    if (nextKey !== currentKey) {
      triangleHover = nextTriangle ? { ...nextTriangle, screen } : null;
      scheduleDraw();
    }
    return;
  }
  if (!view.dragging) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    const nextHoverId = hit ? hit.id : null;
    if (nextHoverId !== hoverNodeId) {
      hoverNodeId = nextHoverId;
      scheduleDraw();
    } else if (shiftHeld || capsLockOn) {
      scheduleDraw();
    }
    return;
  }

  if (is3DMode && view.dragging) {
    updateReducedEffects(event);
  }

  const dx = (event.offsetX - view.dragStart.x) / view.zoom;
  const dy = (event.offsetY - view.dragStart.y) / view.zoom;
  view.offsetX = view.dragOffsetStart.x + dx;
  view.offsetY = view.dragOffsetStart.y + dy;
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  scheduleDraw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function onPointerUp(event) {
  if (nodeVolumeSliderDrag) {
    nodeVolumeSliderDrag = null;
    return;
  }
  if (suppressClickAfterRespell) {
    suppressClickAfterRespell = false;
    return;
  }
  if (distanceSelectDrag) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    if (hit && hit.active && hit.id !== distanceSelectDrag.startNodeId) {
      const startNode = nodeById.get(distanceSelectDrag.startNodeId);
      if (startNode) {
        const added = addDistanceEdgeBetweenNodes(startNode, hit);
        if (added) {
          draw();
        }
      }
    }
    distanceSelectDrag = null;
    return;
  }
  if (customPianoMapClickActive) {
    customPianoMapClickActive = false;
    return;
  }
  if (customNodeDrag) {
    const { moved } = customNodeDrag;
    customNodeDrag = null;
    if (moved) {
      updatePresetUrl("custom-node-drag-end");
      return;
    }
  }
  if (layoutLabelDrag) {
    layoutLabelDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutKeyMappingDrag) {
    layoutKeyMappingDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutTitleDrag) {
    layoutTitleDrag = null;
    updatePresetUrl("layout-title-drag-end");
    return;
  }
  if (layoutCreatorDrag) {
    layoutCreatorDrag = null;
    updatePresetUrl("layout-creator-drag-end");
    return;
  }
  if (layoutCustomLabelDrag) {
    layoutCustomLabelDrag = null;
    updatePresetUrl("layout-custom-label-drag-end");
    return;
  }
  if (layoutAxisEditDrag) {
    layoutAxisEditDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutAxisDrag) {
    layoutAxisDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutDrag) {
    const dragNode = nodeById.get(layoutDrag.nodeId);
    layoutDrag = null;
    updatePresetUrl(
      `layout-node-drag-end:${dragNode && dragNode.isCustom ? "custom" : "base"}:${
        dragNode ? dragNode.id : "na"
      }`
    );
    return;
  }
  if (distanceLabelDrag) {
    const dragInfo = distanceLabelDrag;
    distanceLabelDrag = null;
    const start = dragInfo.startPoint;
    const movedLabel =
      start ? Math.hypot(event.offsetX - start.x, event.offsetY - start.y) : 0;
    if (movedLabel < 4) {
      queueDistanceLabelSingleClick(dragInfo);
    } else {
      schedulePresetUrlUpdate();
    }
    return;
  }
  if (distanceCurveDrag) {
    distanceCurveDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (lineLabelDrag) {
    lineLabelDrag = null;
    updatePresetUrl("line-label-drag-end");
    return;
  }
  if (layoutMode) {
    const wasRotatingInLayout = view.rotating;
    if (view.dragging) {
      view.dragging = false;
    }
    if (view.rotating) {
      view.rotating = false;
    }
    if (wasRotatingInLayout) {
      markIsomorphicDirty();
    }
    view.reducedEffects = false;
    return;
  }
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
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  updateMicrotonalHoverFocus(view.lastPointer);
  view.reducedEffects = false;

  if (moved < 4) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    if (analysisLayers.distances) {
      const labelHit = hitTestDistanceLabel(screenPoint);
      if (labelHit) {
        queueDistanceLabelSingleClick(labelHit);
        return;
      }
    }
    const hit = hitTestScreen(screenPoint);
    if (nodeVolumeAdjustMode && !hit) {
      setNodeVolumeAdjustMode(false);
      return;
    }
    if (mHeld && hit) {
      const projected = projectPoint(hit.coordinate || { x: 0, y: 0, z: 0 });
      view.offsetX = -projected.x;
      view.offsetY = -projected.y;
      draw();
      return;
    }
    if (addIntervalMode) {
      if (hit && hit.active) {
        setAddIntervalMode(false);
        startAddIntervalFromNode(hit);
      }
      return;
    }
    if (distanceSelectMode && analysisLayers.distances) {
      return;
    }
    if (analysisLayers.microtonal) {
      const edgeHit = hitTestCommaEdge(screenPoint);
      if (edgeHit && !hit) {
        const edgeConnectedToSelection =
          microtonalSelectedNodeIds.size > 0 &&
          (microtonalSelectedNodeIds.has(edgeHit.a.id) ||
            microtonalSelectedNodeIds.has(edgeHit.b.id));
        if (edgeConnectedToSelection) {
          handleMicrotonalEdgePlayback(edgeHit.a, edgeHit.b);
          draw();
          return;
        }
      }
    }
    if (!layoutMode && fHeld && hit) {
      const freq = Number(hit.freq);
      if (Number.isFinite(freq)) {
        const displayInfo = getDisplayNoteInfo(hit);
        if (displayInfo && displayInfo.pitchClass) {
          fundamentalSpelling = getFundamentalSpellingFromPitchClass(displayInfo.pitchClass);
        }
        fundamentalInput.value = String(freq);
        fundamentalNoteSelect.value = FUNDAMENTAL_CUSTOM_VALUE;
        updateFundamentalNotes();
        if (spellingMode === "simple") {
          nodeSpellingOverrides.clear();
          invalidateLabelCache();
        }
        const rebased = rebaseLatticeFromNode(hit);
        if (!rebased) {
          updateNodeFrequencies();
        }
        hideFundamentalSpellingDialog();
      }
      return;
    }
    if (!layoutMode && iHeld && hit && hit.active) {
      startAddIntervalFromNode(hit);
      return;
    }
    if (
      !layoutMode &&
      !tHeld &&
      !hit &&
      !event.altKey &&
      !event.shiftKey &&
      !cHeld &&
      !oHeld &&
      !lHeld
    ) {
      const triangle = findTriangleHit(screenPoint);
      if (triangle && triangle.tri) {
        const key = triangleKey(triangle);
        if (hasEffectiveTriangleDiagonal(key)) {
          const gridMap = new Map();
          nodes.forEach((node) => {
            if (!node.isCustom) {
              gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
            }
          });
          const cellNodes = getTriangleCellNodes(triangle, gridMap);
          const triNodes = getTriangleLabelPoints(triangle.tri, cellNodes);
          if (triNodes && triNodes.length === 3) {
            let handled = false;
            const triNodeIds = new Set(triNodes.map((node) => node.id));
            const allSounding = triNodes.every((node) => {
              const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
              return Boolean(voice);
            });
            if (allSounding) {
              triNodes.forEach((node) => {
                const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
                if (voice) {
                  stopVoice(voice);
                }
                node.baseVoiceId = null;
              });
              draw();
              return;
            }
            const triHasPlaying = triNodes.some((node) => {
              const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
              return Boolean(voice);
            });
            if (triHasPlaying) {
              const clickedKey = `${triangleKey(triangle)}:${triangle.tri}`;
              const trianglesToStop = [];
              const triIdsForDiag = (diag) =>
                diag === "backslash" ? ["abd", "acd"] : ["abc", "bcd"];
              forEachEffectiveTriangleDiagonal((entry) => {
                const ids = triIdsForDiag(entry.diag);
                ids.forEach((triId) => {
                  const triKey = `${triangleKey(entry)}:${triId}`;
                  if (triKey === clickedKey) {
                    return;
                  }
                  const entryCell = getTriangleCellNodes(entry, gridMap);
                  const nodesForTri = getTriangleLabelPoints(triId, entryCell);
                  if (!nodesForTri || nodesForTri.length !== 3) {
                    return;
                  }
                  const sharesPlaying = nodesForTri.some((node) => {
                    if (!triNodeIds.has(node.id)) {
                      return false;
                    }
                    const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
                    return Boolean(voice);
                  });
                  if (sharesPlaying) {
                    trianglesToStop.push(nodesForTri);
                  }
                });
              });
                if (trianglesToStop.length) {
                trianglesToStop.forEach((nodesForTri) => {
                  nodesForTri.forEach((node) => {
                    const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
                    if (voice) {
                      stopVoice(voice);
                    }
                    node.baseVoiceId = null;
                  });
                });
                let activated = false;
                triNodes.forEach((node) => {
                  const key = `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
                  if (activateNodeByExponentKey(key)) {
                    activated = true;
                  }
                });
                const refreshedTriNodes = triNodes
                  .map(
                    (node) =>
                      getNodeByExponentKey(
                        `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`
                      ) || node
                  )
                  .filter(Boolean);
                refreshedTriNodes.forEach((node) => {
                  if (node.baseVoiceId && findVoiceById(node.baseVoiceId)) {
                    return;
                  }
                  const voice = startVoice({
                    nodeId: node.id,
                    octave: 0,
                    freq: node.freq,
                    source: "node",
                  });
                  if (voice) {
                    node.baseVoiceId = voice.id;
                  }
                });
                if (activated) {
                }
                handled = true;
              }
            }
            if (!handled) {
              {
                let activated = false;
                triNodes.forEach((node) => {
                  const key = `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
                  if (activateNodeByExponentKey(key)) {
                    activated = true;
                  }
                });
                const refreshedTriNodes = triNodes
                  .map(
                    (node) =>
                      getNodeByExponentKey(
                        `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`
                      ) || node
                  )
                  .filter(Boolean);
                refreshedTriNodes.forEach((node) => {
                  if (node.baseVoiceId && findVoiceById(node.baseVoiceId)) {
                    return;
                  }
                  const voice = startVoice({
                    nodeId: node.id,
                    octave: 0,
                    freq: node.freq,
                    source: "node",
                  });
                  if (voice) {
                    node.baseVoiceId = voice.id;
                  }
                });
                if (activated) {
                }
              }
            }
            draw();
            return;
          }
        }
      }
    }
    if (cHeld && hit && hit.active) {
      openCustomRatioDialog({ type: "create", sourceId: hit.id });
      return;
    }
    if (hit) {
      if (vHeld) {
        setNodeVolumeAdjustMode(true);
        return;
      }
      if (event.altKey) {
        if (hit.active) {
          hit.active = false;
          syncCustomNodesWithSource(hit.id, false);
          stopVoicesForNode(hit.id, false);
          pruneTriangleDiagonals();
          updatePitchInstances();
          refreshPatternFromActiveNodes();
          updateUiHint();
          markIsomorphicDirty();
          schedulePresetUrlUpdate();
          draw();
          return;
        }
        if (hit.isCustom) {
          if (removeCustomNode(hit.id)) {
            refreshCustomNodes();
            updatePitchInstances();
            refreshPatternFromActiveNodes();
            updateUiHint();
            markIsomorphicDirty();
            schedulePresetUrlUpdate();
            draw();
          }
        }
        return;
      }
      const requestedAxis = getRequestedAxisKey();
      if (requestedAxis) {
        if (requestedAxis === "z" && !is3DMode) {
          if (mode3dCheckbox) {
            setControlChecked(mode3dCheckbox, true);
          }
          set3DMode(true);
        }
        if (
          requestedAxis === "z" &&
          Math.abs(view.rotX) < 0.01 &&
          Math.abs(view.rotY) < 0.01
        ) {
          view.rotX = -0.35;
          view.rotY = 0.45;
        }
        if (activateAxisFromHit(requestedAxis, hit)) {
          return;
        }
      }
      if (hit.isCenter && !hit.active && !event.shiftKey) {
        return;
      }
      if (is3DMode && !isAddMode && !hit.active && !hit.isCenter && !hit.isCustom) {
        return;
      }
      const baseVoice = hit.baseVoiceId ? findVoiceById(hit.baseVoiceId) : null;
      if (baseVoice && baseVoice.lfoActive) {
        disableVoiceLfo(baseVoice);
        draw();
        return;
      }
      if (!hit.active) {
        if (hit.isCenter && !event.shiftKey) {
          return;
        }
        activateNode(hit);
        return;
      }
      if (analysisLayers.microtonal) {
        if (microtonalSelectedNodeIds.has(hit.id)) {
          microtonalSelectedNodeIds.delete(hit.id);
        } else {
          microtonalSelectedNodeIds.add(hit.id);
        }
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
  if (moved >= 4 || wasRotating) {
    scheduleDraw();
  }
}

function onPointerLeave() {
  customNodeDrag = null;
  hoverNodeId = null;
  lfoArmingId = null;
  layoutDrag = null;
  layoutLabelDrag = null;
  layoutAxisDrag = null;
  layoutAxisEditDrag = null;
  layoutTitleDrag = null;
  layoutCreatorDrag = null;
  layoutCustomLabelDrag = null;
  distanceLabelDrag = null;
  lineLabelDrag = null;
  distanceCurveDrag = null;
  triangleHover = null;
  nodeVolumeSliderDrag = null;
  view.rotating = false;
  view.lastPointer = null;
  microtonalHoverPairKey = "";
  if (view.dragging) {
    view.dragging = false;
  }
  view.reducedEffects = false;
  scheduleDraw();
}

function hitTestCommaEdge(screenPoint, options = {}) {
  if (!screenPoint || !commaEdges.length) {
    return null;
  }
  const hitThreshold = Math.max(1, Number(options.hitThreshold) || 6);
  let nodePosMap = options.nodePosMap instanceof Map ? options.nodePosMap : null;
  if (!nodePosMap) {
    const disableScale = shouldDisableLayoutScale();
    nodePosMap = new Map();
    nodes.forEach((node) => {
      if (!node.active) {
        return;
      }
      const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
      const baseRadius = layoutMode ? layoutNodeSize : getNodeRadius(node);
      const radius = layoutMode ? getLayoutNodeRadius(pos) : baseRadius * (pos.scale || 1);
      nodePosMap.set(node.id, { pos, radius });
    });
  }
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  commaEdges.forEach(({ a, b }) => {
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    const lineStart = {
      x: start.x + ux * startRadius,
      y: start.y + uy * startRadius,
    };
    const lineEnd = {
      x: end.x - ux * endRadius,
      y: end.y - uy * endRadius,
    };
    const distance = distanceToSegment(screenPoint, lineStart, lineEnd);
    if (distance <= hitThreshold && distance < bestDistance) {
      best = { a, b };
      bestDistance = distance;
    }
  });
  return best;
}

function toggleCommaEdgeVoices(a, b) {
  const nodesToToggle = [a, b].filter(Boolean);
  if (!nodesToToggle.length) {
    return;
  }
  const playing = nodesToToggle.every((node) => {
    const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
    return Boolean(voice);
  });
  if (playing) {
    nodesToToggle.forEach((node) => {
      const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
      if (voice) {
        stopVoice(voice);
      }
      node.baseVoiceId = null;
    });
    return;
  }
  nodesToToggle.forEach((node) => {
    const voice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
    if (voice) {
      return;
    }
    const nextVoice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
      source: "node",
    });
    if (nextVoice) {
      node.baseVoiceId = nextVoice.id;
    }
  });
}

function getNodeBaseVoice(node) {
  if (!node) {
    return null;
  }
  return node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
}

function startNodeBaseVoiceIfNeeded(node) {
  if (!node) {
    return;
  }
  if (getNodeBaseVoice(node)) {
    return;
  }
  const voice = startVoice({
    nodeId: node.id,
    octave: 0,
    freq: node.freq,
    source: "node",
  });
  if (voice) {
    node.baseVoiceId = voice.id;
  }
}

function stopNodeBaseVoice(node) {
  if (!node) {
    return;
  }
  const voice = getNodeBaseVoice(node);
  if (voice) {
    stopVoice(voice);
  }
  node.baseVoiceId = null;
}

function sourceHasOtherPlayingMicrotonalDestinations(sourceNode, destinationNode) {
  if (!sourceNode) {
    return false;
  }
  buildCommaConnections(new Map());
  for (let i = 0; i < commaEdges.length; i += 1) {
    const edge = commaEdges[i];
    if (!edge || !edge.a || !edge.b) {
      continue;
    }
    let other = null;
    if (edge.a.id === sourceNode.id) {
      other = edge.b;
    } else if (edge.b.id === sourceNode.id) {
      other = edge.a;
    }
    if (!other || (destinationNode && other.id === destinationNode.id)) {
      continue;
    }
    if (getNodeBaseVoice(other)) {
      return true;
    }
  }
  return false;
}

function handleMicrotonalEdgePlayback(a, b) {
  if (!a || !b) {
    return;
  }
  let sourceNode = null;
  let destinationNode = null;
  const aSelected = microtonalSelectedNodeIds.has(a.id);
  const bSelected = microtonalSelectedNodeIds.has(b.id);
  if (aSelected && !bSelected) {
    sourceNode = a;
    destinationNode = b;
  } else if (bSelected && !aSelected) {
    sourceNode = b;
    destinationNode = a;
  } else {
    // Fallback when both endpoints are selected.
    sourceNode = a;
    destinationNode = b;
  }

  const sourcePlaying = Boolean(getNodeBaseVoice(sourceNode));
  const destinationPlaying = Boolean(getNodeBaseVoice(destinationNode));

  if (sourcePlaying && destinationPlaying) {
    stopNodeBaseVoice(destinationNode);
    if (!sourceHasOtherPlayingMicrotonalDestinations(sourceNode, destinationNode)) {
      stopNodeBaseVoice(sourceNode);
    }
    return;
  }

  startNodeBaseVoiceIfNeeded(sourceNode);
  startNodeBaseVoiceIfNeeded(destinationNode);
}

function onWheel(event) {
  event.preventDefault();
  if (layoutMode) {
    pushLayoutUndoStateForWheel();
  }
  const zoomDelta = event.deltaY > 0 ? 0.92 : 1.08;
  if (is3DMode) {
    view.zoom = clampZoom(view.zoom * zoomDelta);
    scheduleDraw();
    markIsomorphicDirty();
    schedulePresetUrlUpdate();
    return;
  }
  const before = screenToWorld({ x: event.offsetX, y: event.offsetY });
  view.zoom = clampZoom(view.zoom * zoomDelta);
  const after = screenToWorld({ x: event.offsetX, y: event.offsetY });

  view.offsetX += before.x - after.x;
  view.offsetY += before.y - after.y;
  scheduleDraw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
  if (layoutMode) {
    syncLayoutScaleInput();
  }
}

function isInactiveNodeAvailable(node) {
  if (distanceSelectMode) {
    return true;
  }
  const onZeroPlane = (Number(node.exponentZ) || 0) === 0;
  if (!is3DMode) {
    const axisEntry = getActiveAxisEntry();
    if (axisEntry && (axisEntry.axis === "x" || axisEntry.axis === "y")) {
      return isNodeOnAxisEntry(node, axisEntry) && onZeroPlane;
    }
    return !distanceSelectMode && (shiftHeld || capsLockOn) && onZeroPlane;
  }
  const axisEntry = getActiveAxisEntry();
  if (axisEntry) {
    return isNodeOnAxisEntry(node, axisEntry);
  }
  const z = getGridCoord(node, "z");
  return z === gridCenterZ;
}

function hitTestScreen(screenPoint) {
  const baseRadius = layoutMode ? layoutNodeSize : null;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestDepth = Number.NEGATIVE_INFINITY;
  const axisEntry = getActiveAxisEntry();

  nodes.forEach((node) => {
    if (connectOrphansEnabled && orphanGuideNodes.has(node.id)) {
      if (!shiftHeld && !capsLockOn && !addIntervalMode) {
        return;
      }
    }
    if (layoutMode && !node.isCustom && !node.isCenter && !node.active) {
      return;
    }
    if (axisEntry && !isNodeOnAxisEntry(node, axisEntry)) {
      return;
    }
    if (
      !node.isCustom &&
      !node.active &&
      (!isInactiveNodeAvailable(node) || (is3DMode && !isAddMode && !addIntervalMode))
    ) {
      return;
    }
    const projected = worldToScreen(
      getNodeDisplayCoordinate(node),
      shouldDisableLayoutScale()
    );
    const dx = projected.x - screenPoint.x;
    const dy = projected.y - screenPoint.y;
    const distance = Math.hypot(dx, dy);
    const nodeRadius = baseRadius != null ? baseRadius : getNodeRadius(node);
    const adjustedRadius =
      baseRadius != null
        ? getLayoutNodeRadius(projected)
        : nodeRadius * (projected.scale || 1);
    let hitRadius = adjustedRadius;
    if (distance > 0) {
      const ux = dx / distance;
      const uy = dy / distance;
      hitRadius = getNodeEdgeRadius(node, ux, uy, adjustedRadius);
    }
    if (hitRadius > 0 && distance <= hitRadius) {
      const prefersCustom = node.isCustom && (!best || !best.isCustom);
      if (
        prefersCustom ||
        distance < bestDistance ||
        (!node.isCustom && projected.depth > bestDepth)
      ) {
        best = node;
        bestDistance = distance;
        bestDepth = projected.depth;
      }
    }
  });

  return best;
}

function hitTestEdgeLabel(screenPoint) {
  const disableScale = shouldDisableLayoutScale();
  const nodePosMap = new Map();
  nodes.forEach((node) => {
    const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
    const baseRadius = layoutMode ? layoutNodeSize : getNodeRadius(node);
    const radius = layoutMode ? getLayoutNodeRadius(pos) : baseRadius * (pos.scale || 1);
    nodePosMap.set(node.id, { pos, radius });
  });
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  const hitThreshold = 6;
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    const labelText = getEdgeLabelText(a, b);
    if (!labelText) {
      return;
    }
    const startEntry = nodePosMap.get(a.id);
    const endEntry = nodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    const lineStart = {
      x: start.x + ux * startRadius,
      y: start.y + uy * startRadius,
    };
    const lineEnd = {
      x: end.x - ux * endRadius,
      y: end.y - uy * endRadius,
    };
    const lineLen = Math.max(0, dist - startRadius - endRadius);
    if (lineLen <= 0) {
      return;
    }
    const distance = distanceToSegment(screenPoint, lineStart, lineEnd);
    if (distance <= hitThreshold && distance < bestDistance) {
      best = {
        a,
        b,
        key: getEdgeKey(a, b),
        lineStart,
        lineEnd,
      };
      bestDistance = distance;
    }
  });
  if (connectOrphansEnabled && orphanGuideEdges.size) {
    orphanGuideEdges.forEach((edgeKey) => {
      const parts = edgeKey.split("|");
      if (parts.length !== 2) {
        return;
      }
      const a = nodeById.get(Number(parts[0]));
      const b = nodeById.get(Number(parts[1]));
      if (!a || !b) {
        return;
      }
      const labelText = getEdgeLabelText(a, b);
      if (!labelText) {
        return;
      }
      const startEntry = nodePosMap.get(a.id);
      const endEntry = nodePosMap.get(b.id);
      if (!startEntry || !endEntry) {
        return;
      }
      const start = startEntry.pos;
      const end = endEntry.pos;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (!dist) {
        return;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
      const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
      const lineStart = {
        x: start.x + ux * startRadius,
        y: start.y + uy * startRadius,
      };
      const lineEnd = {
        x: end.x - ux * endRadius,
        y: end.y - uy * endRadius,
      };
      const lineLen = Math.max(0, dist - startRadius - endRadius);
      if (lineLen <= 0) {
        return;
      }
      const distance = distanceToSegment(screenPoint, lineStart, lineEnd);
      if (distance <= hitThreshold && distance < bestDistance) {
        best = {
          a,
          b,
          key: getEdgeKey(a, b),
          lineStart,
          lineEnd,
        };
        bestDistance = distance;
      }
    });
  }
  if (customNodes.length) {
    const edgeOutset = 1;
    customNodes.forEach((node) => {
      if (!node.active) {
        return;
      }
      const source = nodeById.get(node.sourceNodeId);
      if (!source) {
        return;
      }
      const labelText = getCustomConnectionLabelText(node);
      if (!labelText) {
        return;
      }
      const startEntry = nodePosMap.get(source.id);
      const endEntry = nodePosMap.get(node.id);
      if (!startEntry || !endEntry) {
        return;
      }
      const start = startEntry.pos;
      const end = endEntry.pos;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (!dist) {
        return;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const startRadius = Math.max(
        0,
        getNodeEdgeRadius(source, ux, uy, startEntry.radius) + edgeOutset
      );
      const customEdgeInset = Math.max(0, Math.round(endEntry.radius * 0.03));
      const endRadius = Math.max(
        0,
        getNodeEdgeRadius(node, ux, uy, endEntry.radius) + edgeOutset - customEdgeInset
      );
      const lineStart = {
        x: start.x + ux * startRadius,
        y: start.y + uy * startRadius,
      };
      const lineEnd = {
        x: end.x - ux * endRadius,
        y: end.y - uy * endRadius,
      };
      const lineLen = Math.max(0, dist - startRadius - endRadius);
      if (lineLen <= 0) {
        return;
      }
      const distance = distanceToSegment(screenPoint, lineStart, lineEnd);
      if (distance <= hitThreshold && distance < bestDistance) {
        best = {
          a: source,
          b: node,
          key: getEdgeKey(source, node),
          lineStart,
          lineEnd,
        };
        bestDistance = distance;
      }
    });
  }
  return best;
}

function hitTestNoteLabel(screenPoint) {
  if (!layoutMode) {
    return null;
  }
  const disableScale = shouldDisableLayoutScale();
  let hit = null;
  nodes.forEach((node) => {
    if (!(node.isCenter || node.active || node.isCustom)) {
      return;
    }
    const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
    const radius = getLayoutNodeRadius(pos);
    const hitbox = getLayoutNoteLabelHitbox(node, pos, radius);
    const left = hitbox.left;
    const right = hitbox.left + hitbox.width;
    const top = hitbox.top;
    const bottom = hitbox.top + hitbox.height;
    if (
      screenPoint.x >= left &&
      screenPoint.x <= right &&
      screenPoint.y >= top &&
      screenPoint.y <= bottom
    ) {
      hit = { node, labelPos: hitbox.labelPos };
    }
  });
  return hit;
}

function hitTestLayoutKeyMappingLabel(screenPoint) {
  if (!layoutMode || layoutKeyMappingMode === "hide") {
    return null;
  }
  const keyboardMode = getKeyboardMode();
  if (keyboardMode !== "piano-custom") {
    return null;
  }
  const customPianoLabels = getCustomPianoLabelMap();
  const disableScale = shouldDisableLayoutScale();
  let hit = null;
  nodes.forEach((node) => {
    if (!(node.isCenter || node.active || node.isCustom)) {
      return;
    }
    const keyLabel = customPianoLabels.get(node.id);
    if (!keyLabel) {
      return;
    }
    const labelText = getLayoutKeyMappingLabelText(keyLabel);
    const displayInfo = getCachedDisplayInfo(node);
    const pitchClass = displayInfo.pitchClass || node.pitch_class;
    if (!shouldShowLayoutKeyMappingLabel(keyLabel, pitchClass)) {
      return;
    }
    const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
    const radius = getLayoutNodeRadius(pos);
    const hitbox = getLayoutKeyMappingLabelHitbox(labelText, node, pos, radius);
    const left = hitbox.left;
    const right = hitbox.left + hitbox.width;
    const top = hitbox.top;
    const bottom = hitbox.top + hitbox.height;
    if (
      screenPoint.x >= left &&
      screenPoint.x <= right &&
      screenPoint.y >= top &&
      screenPoint.y <= bottom
    ) {
      hit = { node, labelPos: hitbox.labelPos };
    }
  });
  return hit;
}

function hitTestLayoutTitle(screenPoint) {
  if (!layoutMode || !layoutTitle) {
    return null;
  }
  const titleSize = Math.max(12, Math.round(layoutTitleSize));
  ctx.save();
  ctx.font = `${layoutTitleFontWeight} ${titleSize}px ${layoutTitleFont}`;
  const width = ctx.measureText(layoutTitle).width;
  ctx.restore();
  const pos = getLayoutTitlePosition();
  const height = titleSize;
  const left = pos.x - width / 2;
  const right = pos.x + width / 2;
  const top = pos.y;
  const bottom = pos.y + height;
  if (
    screenPoint.x >= left &&
    screenPoint.x <= right &&
    screenPoint.y >= top &&
    screenPoint.y <= bottom
  ) {
    return { pos };
  }
  return null;
}

function hitTestLayoutCreator(screenPoint) {
  if (!layoutMode || !layoutCreator) {
    return null;
  }
  const creatorSize = getLayoutCreatorSize();
  ctx.save();
  ctx.font = `${layoutCreatorFontWeight} ${creatorSize}px ${layoutCreatorFont}`;
  const width = ctx.measureText(layoutCreator).width;
  ctx.restore();
  const pos = getLayoutCreatorPosition();
  const height = creatorSize;
  const left = pos.x - width / 2;
  const right = pos.x + width / 2;
  const top = pos.y;
  const bottom = pos.y + height;
  if (
    screenPoint.x >= left &&
    screenPoint.x <= right &&
    screenPoint.y >= top &&
    screenPoint.y <= bottom
  ) {
    return { pos };
  }
  return null;
}

function hitTestLayoutCustomLabel(screenPoint) {
  if (!layoutMode || !layoutCustomLabels.length) {
    return null;
  }
  const size = Math.max(8, Math.round(layoutCustomLabelTextSize));
  ctx.save();
  ctx.font = `${layoutCustomLabelFontWeight} ${size}px ${layoutCustomLabelFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = layoutCustomLabels.length - 1; i >= 0; i -= 1) {
    const entry = layoutCustomLabels[i];
    if (!entry.text || !entry.position) {
      continue;
    }
    const width = ctx.measureText(entry.text).width;
    const pos = getLayoutCustomLabelPosition(entry);
    const left = pos.x - width / 2;
    const right = pos.x + width / 2;
    const top = pos.y;
    const bottom = pos.y + size;
    if (
      screenPoint.x >= left &&
      screenPoint.x <= right &&
      screenPoint.y >= top &&
      screenPoint.y <= bottom
    ) {
      ctx.restore();
      return { entry, index: i, pos };
    }
  }
  ctx.restore();
  return null;
}

function hitTestDistanceLabel(screenPoint) {
  if (!distanceEdges.length) {
    return null;
  }
  for (let i = distanceEdges.length - 1; i >= 0; i -= 1) {
    const edge = distanceEdges[i];
    const { label, labelFont, labelWeight, labelSize, labelPos } = edge;
    const centerX = labelPos ? labelPos.x : 0;
    const centerY = labelPos ? labelPos.y : 0;
    ctx.save();
    ctx.font = `${labelWeight} ${labelSize}px ${labelFont}`;
    const width = ctx.measureText(label).width;
    ctx.restore();
    const halfWidth = width / 2 + 6;
    const halfHeight = labelSize / 2 + 4;
    if (
      screenPoint.x >= centerX - halfWidth &&
      screenPoint.x <= centerX + halfWidth &&
      screenPoint.y >= centerY - halfHeight &&
      screenPoint.y <= centerY + halfHeight
    ) {
      return edge;
    }
  }
  return null;
}

function hitTestDistanceLine(screenPoint) {
  if (!distanceEdges.length) {
    return null;
  }
  const hitThreshold = 6;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  distanceEdges.forEach((edge) => {
    const samples = edge.curveInfo && edge.curveInfo.samples ? edge.curveInfo.samples : null;
    if (samples && samples.length > 1) {
      for (let i = 1; i < samples.length; i += 1) {
        const distance = distanceToSegment(
          screenPoint,
          samples[i - 1].point,
          samples[i].point
        );
        if (distance <= hitThreshold && distance < bestDistance) {
          best = edge;
          bestDistance = distance;
        }
      }
      return;
    }
    const distance = distanceToSegment(screenPoint, edge.lineStart, edge.lineEnd);
    if (distance <= hitThreshold && distance < bestDistance) {
      best = edge;
      bestDistance = distance;
    }
  });
  return best;
}

function clearPendingDistanceLabelClick() {
  if (pendingDistanceLabelClickTimer != null) {
    clearTimeout(pendingDistanceLabelClickTimer);
    pendingDistanceLabelClickTimer = null;
  }
  pendingDistanceLabelClickKey = "";
}

function updateMicrotonalHoverFocus(screenPoint) {
  if (!analysisLayers.microtonal || !screenPoint) {
    microtonalHoverPairKey = "";
    return;
  }
  const insideCanvas =
    screenPoint.x >= 0 &&
    screenPoint.y >= 0 &&
    screenPoint.x <= canvas.clientWidth &&
    screenPoint.y <= canvas.clientHeight;
  if (!insideCanvas) {
    microtonalHoverPairKey = "";
    return;
  }
  const edgeHoverHit = hitTestCommaEdge(screenPoint, { hitThreshold: 10 });
  if (!edgeHoverHit) {
    microtonalHoverPairKey = "";
    return;
  }
  microtonalHoverPairKey =
    edgeHoverHit.a.id < edgeHoverHit.b.id
      ? `${edgeHoverHit.a.id}|${edgeHoverHit.b.id}`
      : `${edgeHoverHit.b.id}|${edgeHoverHit.a.id}`;
}

function queueDistanceLabelSingleClick(edge) {
  if (!edge || !edge.key) {
    return;
  }
  clearPendingDistanceLabelClick();
  pendingDistanceLabelClickKey = edge.key;
  pendingDistanceLabelClickTimer = setTimeout(() => {
    pendingDistanceLabelClickTimer = null;
    const key = pendingDistanceLabelClickKey;
    pendingDistanceLabelClickKey = "";
    const activeEdge = distanceEdges.find((entry) => entry && entry.key === key);
    if (!activeEdge) {
      return;
    }
    toggleCommaEdgeVoices(activeEdge.a, activeEdge.b);
    draw();
  }, 260);
}

function hitTestAxisLegend(screenPoint) {
  if (!layoutMode) {
    return null;
  }
  const settings = getAxisLegendSettings();
  const axes = [
    getAxisLegendInfo("x", settings),
    getAxisLegendInfo("y", settings),
    getAxisLegendInfo("z", settings),
  ];
  ctx.save();
  ctx.font = `${layoutAxisLegendFontWeight} ${settings.fontSize}px ${layoutAxisLegendFont}`;
  for (const axis of axes) {
    if (!axis) {
      continue;
    }
    const labelWidth = ctx.measureText(axis.label).width;
    const halfW = labelWidth / 2 + 12;
    const halfH = settings.fontSize / 2 + 8;
    const angle = axis.textAngle;
    const dx = screenPoint.x - axis.center.x;
    const dy = screenPoint.y - axis.center.y;
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    if (Math.abs(rx) <= halfW && Math.abs(ry) <= halfH) {
      ctx.restore();
      return axis;
    }
  }
  ctx.restore();
  return null;
}

function hitTestAxisLegendHandle(screenPoint) {
  if (!layoutMode || !layoutAxisEdit) {
    return null;
  }
  const info = getAxisLegendInfo(layoutAxisEdit);
  if (!info) {
    return null;
  }
  const handleRadius = Math.max(8, Math.round(info.fontSize * 0.65));
  const distLeft = Math.hypot(
    screenPoint.x - info.leftEnd.x,
    screenPoint.y - info.leftEnd.y
  );
  if (distLeft <= handleRadius) {
    return { axis: info.axis };
  }
  const distRight = Math.hypot(
    screenPoint.x - info.rightEnd.x,
    screenPoint.y - info.rightEnd.y
  );
  if (distRight <= handleRadius) {
    return { axis: info.axis };
  }
  return null;
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

function ensureKarplusWorklet() {
  if (!audioCtx || karplusWorkletReady || karplusWorkletLoading) {
    return;
  }
  karplusWorkletLoading = audioCtx.audioWorklet
    .addModule(karplusWorkletUrl)
    .then(() => {
      karplusWorkletReady = true;
    })
    .catch(() => {
      karplusWorkletReady = false;
    })
    .finally(() => {
      karplusWorkletLoading = null;
    });
}

function ensureResonatorWorklet() {
  if (!audioCtx || resonatorWorkletReady || resonatorWorkletLoading) {
    return;
  }
  resonatorWorkletLoading = audioCtx.audioWorklet
    .addModule(resonatorWorkletUrl)
    .then(() => {
      resonatorWorkletReady = true;
    })
    .catch(() => {
      resonatorWorkletReady = false;
    })
    .finally(() => {
      resonatorWorkletLoading = null;
    });
}

async function ensureSoundfontLoaded() {
  if (soundfontData || soundfontLoading) {
    return soundfontLoading || Promise.resolve();
  }
  soundfontLoading = loadSoundfont(soundfontUrl)
    .then((sf2) => {
      soundfontData = sf2;
      if (sf2 && Array.isArray(sf2.presets) && sf2.presets.length) {
        soundfontPreset = sf2.presets[0];
      }
      populateSoundfontPresets();
    })
    .catch(() => {
      soundfontData = null;
      soundfontPreset = null;
    })
    .finally(() => {
      soundfontLoading = null;
    });
  return soundfontLoading;
}

function getEnvelopeSliderValue(slider) {
  if (!slider) {
    return ENVELOPE_MIN;
  }
  const raw = Number(slider.value);
  const t = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) / 100 : 0;
  const curved = Math.pow(t, ENVELOPE_CURVE);
  return ENVELOPE_MIN + (ENVELOPE_MAX - ENVELOPE_MIN) * curved;
}

function setEnvelopeSliderFromValue(slider, value) {
  if (!slider) {
    return;
  }
  const safe =
    Number.isFinite(value) && value > 0 ? Math.min(ENVELOPE_MAX, Math.max(ENVELOPE_MIN, value)) : ENVELOPE_MIN;
  const t = (safe - ENVELOPE_MIN) / (ENVELOPE_MAX - ENVELOPE_MIN);
  const clamped = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0));
  slider.value = String(Math.round(Math.pow(clamped, 1 / ENVELOPE_CURVE) * 100));
}

function initEnvelopeSliders() {
  if (attackSlider && attackSlider.dataset.default) {
    setEnvelopeSliderFromValue(attackSlider, Number(attackSlider.dataset.default));
  }
  if (decaySlider && decaySlider.dataset.default) {
    setEnvelopeSliderFromValue(decaySlider, Number(decaySlider.dataset.default));
  }
  if (releaseSlider && releaseSlider.dataset.default) {
    setEnvelopeSliderFromValue(releaseSlider, Number(releaseSlider.dataset.default));
  }
}

function updateEnvelopeReadouts() {
  const unit = envelopeTimeMode === "tempo" ? " beats" : "s";
  attackReadout.textContent = `${getEnvelopeSliderValue(attackSlider).toFixed(2)}${unit}`;
  decayReadout.textContent = `${getEnvelopeSliderValue(decaySlider).toFixed(2)}${unit}`;
  sustainReadout.textContent = `${Number(sustainSlider.value).toFixed(2)}`;
  releaseReadout.textContent = `${getEnvelopeSliderValue(releaseSlider).toFixed(2)}${unit}`;
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

function updateLfoRate() {
  if (!lfoRateSlider) {
    return;
  }
  const raw = Number(lfoRateSlider.value);
  const t = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) / 100 : 0.5;
  lfoRate = LFO_RATE_MIN * Math.pow(LFO_RATE_RANGE, t);
  if (lfoRateReadout) {
    lfoRateReadout.textContent = `${lfoRate.toFixed(1)}x`;
  }
}

function setLfoRateSlider(value) {
  if (!lfoRateSlider) {
    return;
  }
  const safe = Number.isFinite(value) && value > 0 ? value : 1;
  const t = Math.log(safe / LFO_RATE_MIN) / Math.log(LFO_RATE_RANGE);
  const clamped = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0.5));
  lfoRateSlider.value = String(Math.round(clamped * 100));
}

function drawAxes(axisEntry) {
  ctx.lineWidth = 1.5;

  if (axisEntry) {
    const anchor = axisEntry.anchor || null;
    const axis = axisEntry.axis;
    const points = [];
    if (axis === "x" && anchor) {
      for (let x = 0; x < GRID_COLS; x += 1) {
        points.push(gridCoordToWorld({ x, y: anchor.y, z: anchor.z }));
      }
    } else if (axis === "y" && anchor) {
      for (let y = 0; y < GRID_ROWS; y += 1) {
        points.push(gridCoordToWorld({ x: anchor.x, y, z: anchor.z }));
      }
    } else if (axis === "z" && anchor) {
      for (let z = 0; z < gridDepth; z += 1) {
        points.push(gridCoordToWorld({ x: anchor.x, y: anchor.y, z }));
      }
    }
    if (points.length > 1) {
      ctx.strokeStyle = AXIS_EDGE_COLORS[axis] || AXIS_EDGE_COLORS.z;
      let hasPath = false;
      let active = false;
      ctx.beginPath();
      points.forEach((point) => {
        const screen = worldToScreen(point);
        if (!screen.visible) {
          active = false;
          return;
        }
        if (!active) {
          ctx.moveTo(screen.x, screen.y);
          active = true;
          hasPath = true;
        } else {
          ctx.lineTo(screen.x, screen.y);
        }
      });
      if (hasPath) {
        ctx.stroke();
      }
      return;
    }
  }

  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const centerZ = gridCenterZ;
  const axes = [
    {
      axis: "x",
      points: Array.from({ length: GRID_COLS }, (_, x) =>
        gridCoordToWorld({ x, y: centerY, z: centerZ })
      ),
    },
    {
      axis: "y",
      points: Array.from({ length: GRID_ROWS }, (_, y) =>
        gridCoordToWorld({ x: centerX, y, z: centerZ })
      ),
    },
    {
      axis: "z",
      points: Array.from({ length: gridDepth }, (_, z) =>
        gridCoordToWorld({ x: centerX, y: centerY, z })
      ),
    },
  ];

  axes.forEach((axis) => {
    ctx.strokeStyle = AXIS_EDGE_COLORS[axis.axis] || AXIS_EDGE_COLORS.z;
    let hasPath = false;
    let active = false;
    ctx.beginPath();
    axis.points.forEach((point) => {
      const screen = worldToScreen(point);
      if (!screen.visible) {
        active = false;
        return;
      }
      if (!active) {
        ctx.moveTo(screen.x, screen.y);
        active = true;
        hasPath = true;
      } else {
        ctx.lineTo(screen.x, screen.y);
      }
    });
    if (hasPath) {
      ctx.stroke();
    }
  });
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = themeColors.edge;
  ctx.lineWidth = 1;

  const drawLine = (start, end, baseAlpha) => {
    if (!start.visible || !end.visible) {
      return;
    }
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

  const drawPlaneGrid = (planeAlpha) => {
    const coarseStep = 2;
    const centerZ = gridCenterZ;
    for (let x = 0; x < GRID_COLS; x += coarseStep) {
      let previous = null;
      for (let y = 0; y < GRID_ROWS; y += 1) {
        const screen = worldToScreen(gridCoordToWorld({ x, y, z: centerZ }));
        if (previous) {
          drawLine(previous, screen, planeAlpha);
        }
        previous = screen;
      }
    }
    for (let y = 0; y < GRID_ROWS; y += coarseStep) {
      let previous = null;
      for (let x = 0; x < GRID_COLS; x += 1) {
        const screen = worldToScreen(gridCoordToWorld({ x, y, z: centerZ }));
        if (previous) {
          drawLine(previous, screen, planeAlpha);
        }
        previous = screen;
      }
    }
  };

  drawPlaneGrid(0.35);
  ctx.restore();
}

function getLfoValue(voice, nowMs) {
  if (!voice.lfoActive || voice.lfoHalfPeriod <= 0) {
    return 1;
  }
  const elapsed = ((nowMs - voice.lfoStartMs) / 1000) * lfoRate;
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
  if (voice.source === "random-lfo" && nowMs < voice.lfoStartMs) {
    return 0;
  }
  const value = getLfoValue(voice, nowMs);
  return (1 - lfoDepth) + lfoDepth * value;
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

function findClosestNodeForRatio(numerator, denominator) {
  let bestNode = null;
  let bestScore = Infinity;
  nodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    if (node.numerator !== numerator || node.denominator !== denominator) {
      return;
    }
    const z = Number.isFinite(node.gridZ) ? node.gridZ : gridCenterZ;
    const score =
      Math.abs(node.gridX || 0) + Math.abs(node.gridY || 0) + Math.abs(z - gridCenterZ);
    if (score < bestScore) {
      bestScore = score;
      bestNode = node;
    }
  });
  return bestNode;
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
  return `${numerator / divisor}:${denominator / divisor}`;
}

function getDistanceRatioLabel(a, b) {
  if (!a || !b) {
    return null;
  }
  const aNum = Number(a.numerator);
  const aDen = Number(a.denominator);
  const bNum = Number(b.numerator);
  const bDen = Number(b.denominator);
  if (
    !Number.isFinite(aNum) ||
    !Number.isFinite(aDen) ||
    !Number.isFinite(bNum) ||
    !Number.isFinite(bDen) ||
    aDen === 0 ||
    bDen === 0
  ) {
    return null;
  }
  const aRatio = aNum / aDen;
  const bRatio = bNum / bDen;
  if (!Number.isFinite(aRatio) || !Number.isFinite(bRatio) || aRatio === 0 || bRatio === 0) {
    return null;
  }
  let numerator = aNum * bDen;
  let denominator = aDen * bNum;
  if (aRatio < bRatio) {
    numerator = bNum * aDen;
    denominator = bDen * aNum;
  }
  return {
    label: formatIntervalRatio(numerator, denominator),
    numerator,
    denominator,
  };
}

function getDistanceCommaName(numerator, denominator) {
  const normalized = normalizeCommaRatio(numerator, denominator);
  if (!normalized) {
    return "";
  }
  const key = `${normalized.numerator}:${normalized.denominator}`;
  const matches = commaRatioMap.get(key);
  if (!matches || !matches.length) {
    return "";
  }
  return matches[0].name || "";
}

function getDistanceEdgeNodes(edgeKey) {
  if (!edgeKey) {
    return null;
  }
  const parts = String(edgeKey).split("|");
  if (parts.length !== 2) {
    return null;
  }
  const [aKey, bKey] = parts;
  const a =
    aKey.startsWith("grid:") || aKey.startsWith("custom:")
      ? getNodeByDistanceKey(aKey)
      : nodeById.get(Number(aKey));
  const b =
    bKey.startsWith("grid:") || bKey.startsWith("custom:")
      ? getNodeByDistanceKey(bKey)
      : nodeById.get(Number(bKey));
  if (!a || !b) {
    return null;
  }
  return { a, b };
}

function getDistanceEdgeDefaultLabel(edgeKey) {
  const nodes = getDistanceEdgeNodes(edgeKey);
  if (!nodes) {
    return "";
  }
  const ratioInfo = getDistanceRatioLabel(nodes.a, nodes.b);
  if (!ratioInfo) {
    return "";
  }
  const commaName = getDistanceCommaName(ratioInfo.numerator, ratioInfo.denominator);
  return commaName ? `${ratioInfo.label} (${commaName})` : ratioInfo.label;
}

function openDistanceLabelDialog(edgeKey) {
  if (!distanceLabelDialog || !distanceLabelInput) {
    return;
  }
  pendingDistanceLabelEditKey = edgeKey || "";
  const baseLabel = getDistanceEdgeDefaultLabel(edgeKey);
  distanceLabelInput.value = baseLabel;
  if (typeof distanceLabelDialog.showModal === "function") {
    distanceLabelDialog.showModal();
  }
  requestAnimationFrame(() => {
    distanceLabelInput.focus();
    distanceLabelInput.select();
  });
}

function getDistanceEdgeKey(aKey, bKey) {
  if (!aKey || !bKey) {
    return "";
  }
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function getDistanceEdgeOverride(key) {
  if (!key) {
    return null;
  }
  return distanceEdgeOverrides.get(key) || null;
}

function reduceFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function parseRatioInput(value) {
  if (!value) {
    return null;
  }
  const cleaned = String(value).trim().replace(/\s+/g, "");
  if (!cleaned) {
    return null;
  }
  const divider = cleaned.includes(":") ? ":" : cleaned.includes("/") ? "/" : null;
  let numerator = null;
  let denominator = null;
  if (!divider) {
    numerator = Math.trunc(Number(cleaned));
    denominator = 1;
  } else {
    const parts = cleaned.split(divider);
    if (parts.length !== 2) {
      return null;
    }
    numerator = Math.trunc(Number(parts[0]));
    denominator = Math.trunc(Number(parts[1]));
  }
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return null;
  }
  if (numerator <= 0 || denominator <= 0) {
    return null;
  }
  return { numerator, denominator };
}

function normalizeRatio(numerator, denominator) {
  const reduced = reduceFraction(numerator, denominator);
  return reduceToOctave(reduced.numerator, reduced.denominator);
}

function factorizeInteger(value) {
  const factors = new Map();
  let remaining = Math.abs(Math.trunc(value));
  if (remaining <= 1) {
    return factors;
  }
  while (remaining % 2 === 0) {
    factors.set(2, (factors.get(2) || 0) + 1);
    remaining /= 2;
  }
  for (const prime of primes) {
    if (prime === 2) {
      continue;
    }
    if (prime * prime > remaining) {
      break;
    }
    while (remaining % prime === 0) {
      factors.set(prime, (factors.get(prime) || 0) + 1);
      remaining /= prime;
    }
  }
  if (remaining > 1) {
    factors.set(remaining, (factors.get(remaining) || 0) + 1);
  }
  return factors;
}

function factorizeRatio(numerator, denominator) {
  const map = new Map();
  const numFactors = factorizeInteger(numerator);
  const denFactors = factorizeInteger(denominator);
  numFactors.forEach((exp, prime) => {
    map.set(prime, (map.get(prime) || 0) + exp);
  });
  denFactors.forEach((exp, prime) => {
    map.set(prime, (map.get(prime) || 0) - exp);
  });
  return map;
}

function buildOrphanGuideSet() {
  const guides = new Set();
  const edgesSet = new Set();
  if (!connectOrphansEnabled) {
    return { guides, edges: edgesSet };
  }
  const expMap = new Map();
  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
    if (
      !Number.isFinite(node.exponentX) ||
      !Number.isFinite(node.exponentY) ||
      !Number.isFinite(node.exponentZ)
    ) {
      return;
    }
    expMap.set(`${node.exponentX},${node.exponentY},${node.exponentZ || 0}`, node);
  });
  const root = nodes.find((node) => node.isCenter);
  const adjacency = new Map();
  const addAdj = (a, b) => {
    if (!adjacency.has(a.id)) {
      adjacency.set(a.id, []);
    }
    adjacency.get(a.id).push(b.id);
  };
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    addAdj(a, b);
    addAdj(b, a);
  });
  customNodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    const source = nodeById.get(node.sourceNodeId);
    if (!source || !source.active) {
      return;
    }
    addAdj(node, source);
    addAdj(source, node);
  });
  const connected = new Set();
  if (root && root.active) {
    const queue = [root.id];
    connected.add(root.id);
    while (queue.length) {
      const current = queue.shift();
      const neighbors = adjacency.get(current) || [];
      neighbors.forEach((next) => {
        if (!connected.has(next)) {
          connected.add(next);
          queue.push(next);
        }
      });
    }
  }
  const neighborKeys = (key) => {
    const [x, y, z] = key.split(",").map(Number);
    return [
      `${x + 1},${y},${z}`,
      `${x - 1},${y},${z}`,
      `${x},${y + 1},${z}`,
      `${x},${y - 1},${z}`,
      `${x},${y},${z + 1}`,
      `${x},${y},${z - 1}`,
    ];
  };
  const findMinMissingPath = (startKey, endKey) => {
    const costMap = new Map();
    const stepMap = new Map();
    const prev = new Map();
    const open = [startKey];
    costMap.set(startKey, 0);
    stepMap.set(startKey, 0);
    while (open.length) {
      let bestIndex = 0;
      let bestKey = open[0];
      for (let i = 1; i < open.length; i += 1) {
        const key = open[i];
        const cost = costMap.get(key);
        const steps = stepMap.get(key);
        const bestCost = costMap.get(bestKey);
        const bestSteps = stepMap.get(bestKey);
        if (cost < bestCost || (cost === bestCost && steps < bestSteps)) {
          bestKey = key;
          bestIndex = i;
        }
      }
      open.splice(bestIndex, 1);
      if (bestKey === endKey) {
        break;
      }
      const neighbors = neighborKeys(bestKey);
      neighbors.forEach((nextKey) => {
        const nextNode = expMap.get(nextKey);
        if (!nextNode) {
          return;
        }
        const cost = nextNode.active ? 0 : 1;
        const nextCost = costMap.get(bestKey) + cost;
        const nextSteps = stepMap.get(bestKey) + 1;
        const existingCost = costMap.get(nextKey);
        const existingSteps = stepMap.get(nextKey);
        const shouldUpdate =
          existingCost == null ||
          nextCost < existingCost ||
          (nextCost === existingCost && nextSteps < existingSteps);
        if (shouldUpdate) {
          costMap.set(nextKey, nextCost);
          stepMap.set(nextKey, nextSteps);
          prev.set(nextKey, bestKey);
          if (!open.includes(nextKey)) {
            open.push(nextKey);
          }
        }
      });
    }
    if (!costMap.has(endKey)) {
      return null;
    }
    const path = [];
    let cursor = endKey;
    while (cursor) {
      path.push(cursor);
      cursor = prev.get(cursor);
    }
    path.reverse();
    return path;
  };
  nodes.forEach((node) => {
    if (!node.active) {
      return;
    }
    if (connected.has(node.id)) {
      return;
    }
    let exponents = null;
    if (node.isCustom) {
      if (Array.isArray(node.sourceExponents)) {
        exponents = {
          x: Number(node.sourceExponents[0]) || 0,
          y: Number(node.sourceExponents[1]) || 0,
          z: Number(node.sourceExponents[2]) || 0,
        };
      } else {
        const source = nodeById.get(node.sourceNodeId);
        if (source) {
          exponents = {
            x: Number(source.exponentX) || 0,
            y: Number(source.exponentY) || 0,
            z: Number(source.exponentZ) || 0,
          };
        }
      }
    } else {
      exponents = {
        x: Number(node.exponentX) || 0,
        y: Number(node.exponentY) || 0,
        z: Number(node.exponentZ) || 0,
      };
    }
    if (!exponents) {
      return;
    }
    const startKey = `${exponents.x},${exponents.y},${exponents.z}`;
    const endKey = "0,0,0";
    if (!expMap.has(startKey) || !expMap.has(endKey)) {
      return;
    }
    const path = findMinMissingPath(startKey, endKey);
    if (!path || path.length < 2) {
      return;
    }
    for (let i = 0; i < path.length; i += 1) {
      const key = path[i];
      const stepNode = expMap.get(key);
      if (stepNode && !stepNode.active) {
        guides.add(stepNode.id);
      }
      if (i > 0) {
        const prevKey = path[i - 1];
        const a = expMap.get(prevKey);
        const b = expMap.get(key);
        if (a && b) {
          const edgeKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
          edgesSet.add(edgeKey);
        }
      }
    }
  });
  return { guides, edges: edgesSet };
}

function getAxisPrimeValues() {
  const x = Number(ratioXSelect && ratioXSelect.value);
  const y = Number(ratioYSelect && ratioYSelect.value);
  const z = ratioZSelect && !ratioZSelect.hidden ? Number(ratioZSelect.value) : null;
  return { x, y, z };
}

function getAxisExponentRanges() {
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const centerZ = Math.floor(GRID_DEPTH / 2);
  const offsetX = Number(latticeExponentOffset.x) || 0;
  const offsetY = Number(latticeExponentOffset.y) || 0;
  const offsetZ = Number(latticeExponentOffset.z) || 0;
  return {
    xMin: -centerX - offsetX,
    xMax: GRID_COLS - 1 - centerX - offsetX,
    yMin: -centerY - offsetY,
    yMax: GRID_ROWS - 1 - centerY - offsetY,
    zMin: centerZ - (GRID_DEPTH - 1) - offsetZ,
    zMax: centerZ - offsetZ,
  };
}

function applyAxisExponentRanges(ranges) {
  const cols = ranges.xMax - ranges.xMin + 1;
  const rows = ranges.yMax - ranges.yMin + 1;
  const depth = ranges.zMax - ranges.zMin + 1;
  GRID_COLS = cols;
  GRID_ROWS = rows;
  GRID_DEPTH = depth;
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const centerZ = Math.floor(GRID_DEPTH / 2);
  latticeExponentOffset = {
    x: -centerX - ranges.xMin,
    y: centerY - ranges.yMax,
    z: centerZ - ranges.zMax,
  };
}

function maybeExpandAxisRangesForActivation(node) {
  if (
    !node ||
    !Number.isFinite(node.exponentX) ||
    !Number.isFinite(node.exponentY) ||
    !Number.isFinite(node.exponentZ)
  ) {
    return false;
  }
  const ranges = getAxisExponentRanges();
  let changed = false;
  if (node.exponentX <= ranges.xMin && ranges.xMin > AXIS_MIN_XY_LIMIT) {
    ranges.xMin -= 1;
    changed = true;
  }
  if (node.exponentX >= ranges.xMax && ranges.xMax < AXIS_MAX_XY_LIMIT) {
    ranges.xMax += 1;
    changed = true;
  }
  if (node.exponentY <= ranges.yMin && ranges.yMin > AXIS_MIN_XY_LIMIT) {
    ranges.yMin -= 1;
    changed = true;
  }
  if (node.exponentY >= ranges.yMax && ranges.yMax < AXIS_MAX_XY_LIMIT) {
    ranges.yMax += 1;
    changed = true;
  }
  if (node.exponentZ <= ranges.zMin && ranges.zMin > AXIS_MIN_Z_LIMIT) {
    ranges.zMin -= 1;
    changed = true;
  }
  if (node.exponentZ >= ranges.zMax && ranges.zMax < AXIS_MAX_Z_LIMIT) {
    ranges.zMax += 1;
    changed = true;
  }
  if (!changed) {
    return false;
  }
  applyAxisExponentRanges(ranges);
  const activeKeys = captureActiveNodeKeys();
  activeKeys.add(`${node.exponentX},${node.exponentY},${node.exponentZ || 0}`);
  rebuildLattice(activeKeys);
  schedulePresetUrlUpdate();
  return true;
}

function activateNode(node) {
  if (!node || node.active) {
    return;
  }
  if (maybeExpandAxisRangesForActivation(node)) {
    const key = `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
    node = nodes.find(
      (candidate) =>
        `${candidate.exponentX},${candidate.exponentY},${candidate.exponentZ || 0}` === key
    );
    if (!node || node.active) {
      return;
    }
  }
  node.active = true;
  syncCustomNodesWithSource(node.id, true);
  updatePitchInstances();
  refreshPatternFromActiveNodes();
  updateUiHint();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
  draw();
}

function getNodeByExponentKey(key) {
  if (!key) {
    return null;
  }
  return nodes.find(
    (node) => `${node.exponentX},${node.exponentY},${node.exponentZ || 0}` === key
  );
}

function activateNodeByExponentKey(key) {
  const node = getNodeByExponentKey(key);
  if (!node) {
    return false;
  }
  const wasActive = Boolean(node.active);
  if (!wasActive) {
    activateNode(node);
  }
  return !wasActive;
}

function findRatioTargetNode(target) {
  return nodes.find(
    (node) =>
      Number(node.numerator) === Number(target.numerator) &&
      Number(node.denominator) === Number(target.denominator)
  );
}

function tryActivateRatioLayer(desired) {
  if (is3DMode || isFlattened2D) {
    return false;
  }
  if (!Number.isFinite(desired.z) || desired.z === 0) {
    return false;
  }
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const offsetX = Number(latticeExponentOffset.x) || 0;
  const offsetY = Number(latticeExponentOffset.y) || 0;
  const minX = -centerX - offsetX;
  const maxX = GRID_COLS - 1 - centerX - offsetX;
  const minY = -centerY - offsetY;
  const maxY = GRID_ROWS - 1 - centerY - offsetY;
  if (desired.x < minX || desired.x > maxX || desired.y < minY || desired.y > maxY) {
    return false;
  }
  const activeKeys = captureActiveNodeKeys();
  latticeExponentOffset = {
    ...latticeExponentOffset,
    z: -desired.z,
  };
  rebuildLattice(activeKeys);
  return true;
}

function findOrCreateRatioTargetNode(target) {
  const existing = findRatioTargetNode(target);
  if (existing) {
    activateNode(existing);
    return existing;
  }
  const axisPrimes = getAxisPrimeValues();
  const factors = factorizeRatio(target.numerator, target.denominator);
  const desired = {
    x: axisPrimes.x ? factors.get(axisPrimes.x) || 0 : 0,
    y: axisPrimes.y ? factors.get(axisPrimes.y) || 0 : 0,
    z: axisPrimes.z ? factors.get(axisPrimes.z) || 0 : 0,
  };
  if (tryActivateRatioLayer(desired)) {
    const shifted = findRatioTargetNode(target);
    if (shifted) {
      activateNode(shifted);
      return shifted;
    }
  }
  const parent = findBestParentNode(desired);
  if (!parent) {
    return null;
  }
  const factorNumerator = target.numerator * parent.denominator;
  const factorDenominator = target.denominator * parent.numerator;
  const factorReduced = reduceFraction(factorNumerator, factorDenominator);
  const factorOctave = reduceToOctave(factorReduced.numerator, factorReduced.denominator);
  if (factorOctave.numerator === 1 && factorOctave.denominator === 1) {
    return null;
  }
  const slot = findNextCustomSlot(parent.id);
  if (slot == null) {
    return null;
  }
  const node = createCustomNodeFromSource(
    parent,
    slot,
    factorOctave.numerator,
    factorOctave.denominator
  );
  if (!node) {
    return null;
  }
  node.octaveReduce = true;
  node.octaveShift = 0;
  node.octaveShiftManual = false;
  node.active = true;
  addCustomNodeToScene(node);
  return node;
}

function findBestParentNode(desired) {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestHome = Number.POSITIVE_INFINITY;
  nodes.forEach((node) => {
    if (node.isCustom) {
      return;
    }
    if (
      !Number.isFinite(node.exponentX) ||
      !Number.isFinite(node.exponentY) ||
      !Number.isFinite(node.exponentZ)
    ) {
      return;
    }
    const dx = Math.abs(node.exponentX - desired.x);
    const dy = Math.abs(node.exponentY - desired.y);
    const dz = Math.abs((node.exponentZ || 0) - desired.z);
    const distance = dx + dy + dz;
    const home = Math.abs(node.exponentX) + Math.abs(node.exponentY) + Math.abs(node.exponentZ || 0);
    if (
      distance < bestDistance ||
      (distance === bestDistance && home < bestHome)
    ) {
      best = node;
      bestDistance = distance;
      bestHome = home;
    }
  });
  return best;
}

function findOrCreateRatio(value) {
  const parsed = parseRatioInput(value);
  if (!parsed) {
    alert("Please enter a ratio like 1485:1024 or 1485/1024.");
    return;
  }
  const target = normalizeRatio(parsed.numerator, parsed.denominator);
  const node = findOrCreateRatioTargetNode(target);
  if (!node) {
    alert("No parent node found in the current lattice range.");
  }
}

function findOrCreateRatiosFromInput(value) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) {
    alert("Please enter one or more ratios.");
    return;
  }
  const axisPrimes = getAxisPrimeValues();
  let requiresDepth = false;
  lines.forEach((line) => {
    const parsed = parseRatioInput(line);
    if (!parsed) {
      return;
    }
    const target = normalizeRatio(parsed.numerator, parsed.denominator);
    const factors = factorizeRatio(target.numerator, target.denominator);
    const desiredZ = axisPrimes.z ? factors.get(axisPrimes.z) || 0 : 0;
    if (desiredZ !== 0) {
      requiresDepth = true;
    }
  });
  const startedInPure2D = !is3DMode && !isFlattened2D;
  if (requiresDepth && startedInPure2D) {
    set3DMode(true);
  }
  let handled = 0;
  lines.forEach((line) => {
    const parsed = parseRatioInput(line);
    if (!parsed) {
      return;
    }
    handled += 1;
    const target = normalizeRatio(parsed.numerator, parsed.denominator);
    findOrCreateRatioTargetNode(target);
  });
  if (!handled) {
    alert("Please enter ratios like 1485:1024 or 1485/1024.");
  }
  if (requiresDepth && startedInPure2D) {
    applyBestView({ cycle: true });
    set3DMode(false, { preserveDepth: true });
  }
}

function parseRatioInputWithDivider(value) {
  const cleaned = String(value || "").trim().replace(/\s+/g, "");
  if (!cleaned) {
    return null;
  }
  const divider = cleaned.includes(":") ? ":" : cleaned.includes("/") ? "/" : null;
  if (!divider) {
    return null;
  }
  return parseRatioInput(cleaned);
}

function parseRatioListInput(value) {
  return String(value || "")
    .split(/[\s,;]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => parseRatioInput(entry))
    .filter(Boolean);
}

function getDefaultAxisPrimeRecommendation() {
  const axisPrimes = getAxisPrimeValues();
  const defaults = [];
  [axisPrimes.x, axisPrimes.y, axisPrimes.z].forEach((prime) => {
    if (Number.isFinite(prime) && prime > 1 && !defaults.includes(prime)) {
      defaults.push(prime);
    }
  });
  [3, 5, 7, 11, 13, 17].forEach((prime) => {
    if (defaults.length < 3 && !defaults.includes(prime)) {
      defaults.push(prime);
    }
  });
  while (defaults.length < 3) {
    defaults.push(3);
  }
  return defaults.slice(0, 3);
}

function getBestAxisPrimesForRatios(ratios) {
  const normalizedFactors = [];
  const usageByPrime = new Map();
  ratios.forEach((ratio) => {
    if (!ratio) {
      return;
    }
    const normalized = normalizeRatio(ratio.numerator, ratio.denominator);
    if (!normalized) {
      return;
    }
    const factors = factorizeRatio(normalized.numerator, normalized.denominator);
    const filtered = new Map();
    factors.forEach((exp, prime) => {
      const numericPrime = Number(prime);
      if (!Number.isFinite(numericPrime) || numericPrime <= 1 || numericPrime === 2) {
        return;
      }
      if (!exp) {
        return;
      }
      filtered.set(numericPrime, exp);
      usageByPrime.set(
        numericPrime,
        (usageByPrime.get(numericPrime) || 0) + Math.abs(exp)
      );
    });
    normalizedFactors.push(filtered);
  });

  const fallback = getDefaultAxisPrimeRecommendation();
  const candidatePrimes = Array.from(usageByPrime.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0] - b[0];
    })
    .map(([prime]) => prime);

  if (!candidatePrimes.length) {
    return fallback;
  }

  const pool = candidatePrimes.slice(0, 15);
  const poolWithFallback = [...pool];
  fallback.forEach((prime) => {
    if (!poolWithFallback.includes(prime)) {
      poolWithFallback.push(prime);
    }
  });
  const search = poolWithFallback.slice(0, 18);

  let best = null;
  for (let i = 0; i < search.length; i += 1) {
    for (let j = i + 1; j < search.length; j += 1) {
      for (let k = j + 1; k < search.length; k += 1) {
        const choice = [search[i], search[j], search[k]];
        const choiceSet = new Set(choice);
        let coveredCount = 0;
        let uncoveredPenalty = 0;
        let coveredWeight = 0;
        let capturedWeight = 0;
        normalizedFactors.forEach((map) => {
          let uncoveredInRatio = 0;
          let weightInRatio = 0;
          map.forEach((exp, prime) => {
            const absExp = Math.abs(exp);
            weightInRatio += absExp;
            if (choiceSet.has(prime)) {
              capturedWeight += absExp;
            } else {
              uncoveredInRatio += absExp;
            }
          });
          if (uncoveredInRatio === 0) {
            coveredCount += 1;
            coveredWeight += weightInRatio;
          } else {
            uncoveredPenalty += uncoveredInRatio;
          }
        });

        const score = {
          choice,
          coveredCount,
          uncoveredPenalty,
          coveredWeight,
          capturedWeight,
        };
        const better =
          !best ||
          score.coveredCount > best.coveredCount ||
          (score.coveredCount === best.coveredCount &&
            score.uncoveredPenalty < best.uncoveredPenalty) ||
          (score.coveredCount === best.coveredCount &&
            score.uncoveredPenalty === best.uncoveredPenalty &&
            score.coveredWeight > best.coveredWeight) ||
          (score.coveredCount === best.coveredCount &&
            score.uncoveredPenalty === best.uncoveredPenalty &&
            score.coveredWeight === best.coveredWeight &&
            score.capturedWeight > best.capturedWeight) ||
          (score.coveredCount === best.coveredCount &&
            score.uncoveredPenalty === best.uncoveredPenalty &&
            score.coveredWeight === best.coveredWeight &&
            score.capturedWeight === best.capturedWeight &&
            score.choice.join(",") < best.choice.join(","));
        if (better) {
          best = score;
        }
      }
    }
  }

  if (!best) {
    return candidatePrimes.slice(0, 3).concat(fallback).filter((value, index, arr) => arr.indexOf(value) === index).slice(0, 3);
  }
  return best.choice.slice().sort((a, b) => a - b);
}

function updateFindRatioAxisRecommendation(value) {
  if (!findRatioAxisRecommendation) {
    return;
  }
  const ratios = parseRatioListInput(value);
  const best = getBestAxisPrimesForRatios(ratios);
  findRatioAxisRecommendation.textContent = `Best primes for axes: ${best.join(", ")}`;
}

function getCurrentAxisPrimes() {
  return [
    Number(ratioXSelect && ratioXSelect.value) || 3,
    Number(ratioYSelect && ratioYSelect.value) || 5,
    Number(ratioZSelect && ratioZSelect.value) || 7,
  ];
}

function setAxisPrimes(primesToSet) {
  const [x, y, z] = primesToSet;
  if (ratioXSelect && Number.isFinite(x)) {
    ratioXSelect.value = String(x);
  }
  if (ratioYSelect && Number.isFinite(y)) {
    ratioYSelect.value = String(y);
  }
  if (ratioZSelect && Number.isFinite(z)) {
    ratioZSelect.value = String(z);
  }
  updateNodeRatios();
}

function maybeConfirmFindRatioAxes(value) {
  const ratios = parseRatioListInput(value);
  if (!ratios.length) {
    return Promise.resolve(false);
  }
  const recommended = getBestAxisPrimesForRatios(ratios).slice().sort((a, b) => a - b);
  const current = getCurrentAxisPrimes();
  const currentSet = new Set(current);
  const hasAllRecommended = recommended.every((prime) => currentSet.has(prime));
  if (hasAllRecommended) {
    return Promise.resolve(false);
  }
  const currentText = current.join(" ");
  const recommendedText = recommended.join(" ");
  if (findRatioAxisMessage) {
    findRatioAxisMessage.textContent = `Your three axes are (${currentText}). These ratios would be diagrammed best if they were (${recommendedText}). Set these axes?`;
  }
  if (!findRatioAxisDialog || typeof findRatioAxisDialog.showModal !== "function") {
    const confirmed = window.confirm(
      `Your three axes are (${currentText}). These ratios would be diagrammed best if they were (${recommendedText}). Set these axes?`
    );
    if (confirmed) {
      setAxisPrimes(recommended);
    }
    return Promise.resolve(confirmed);
  }
  return new Promise((resolve) => {
    const handleClose = () => {
      const confirmed = findRatioAxisDialog.returnValue === "yes";
      if (confirmed) {
        setAxisPrimes(recommended);
      }
      resolve(confirmed);
    };
    bindOptionalEvent(findRatioAxisDialog, "close", handleClose, { once: true });
    findRatioAxisDialog.showModal();
  });
}

function buildFromIntervalsInput(value) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) {
    alert("Please enter one or more ratios.");
    return;
  }
  const axisPrimes = getAxisPrimeValues();
  let requiresDepth = false;
  let previewNumerator = 1;
  let previewDenominator = 1;
  lines.forEach((line) => {
    const parsed = parseRatioInputWithDivider(line);
    if (!parsed) {
      return;
    }
    if (parsed.numerator === 1 && parsed.denominator === 1) {
      return;
    }
    previewNumerator *= parsed.numerator;
    previewDenominator *= parsed.denominator;
    const reduced = reduceFraction(previewNumerator, previewDenominator);
    previewNumerator = reduced.numerator;
    previewDenominator = reduced.denominator;
    const target = normalizeRatio(previewNumerator, previewDenominator);
    const factors = factorizeRatio(target.numerator, target.denominator);
    const desiredZ = axisPrimes.z ? factors.get(axisPrimes.z) || 0 : 0;
    if (desiredZ !== 0) {
      requiresDepth = true;
    }
  });
  const startedIn2D = !is3DMode;
  if (requiresDepth && startedIn2D) {
    set3DMode(true);
  }
  let currentNumerator = 1;
  let currentDenominator = 1;
  let handled = 0;
  lines.forEach((line) => {
    const parsed = parseRatioInputWithDivider(line);
    if (!parsed) {
      return;
    }
    if (parsed.numerator === 1 && parsed.denominator === 1) {
      return;
    }
    handled += 1;
    currentNumerator *= parsed.numerator;
    currentDenominator *= parsed.denominator;
    const reduced = reduceFraction(currentNumerator, currentDenominator);
    currentNumerator = reduced.numerator;
    currentDenominator = reduced.denominator;
    const ratioValue = currentNumerator / currentDenominator;
    const octaveShift = Math.floor(Math.log2(ratioValue));
    const target = normalizeRatio(currentNumerator, currentDenominator);
    const targetNode = findOrCreateRatioTargetNode(target);
    if (targetNode && octaveShift) {
      setNodeOctaveShift(targetNode, octaveShift);
    }
  });
  if (!handled) {
    alert("Please enter ratios like 5:3 or 9/8.");
  }
  if (requiresDepth && startedIn2D) {
    applyBestView({ cycle: true });
    set3DMode(false, { preserveDepth: true });
  }
}

function updateBuildIntervalsPreview() {
  if (!buildIntervalsTicks || !buildIntervalsPreview) {
    return;
  }
  buildIntervalsTicks.innerHTML = "";
  const lines = String(buildIntervalsInput ? buildIntervalsInput.value : "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  let currentNumerator = 1;
  let currentDenominator = 1;
  let overOctave = false;
  let underOctave = false;
  lines.forEach((line) => {
    const parsed = parseRatioInputWithDivider(line);
    if (!parsed) {
      return;
    }
    if (parsed.numerator === 1 && parsed.denominator === 1) {
      return;
    }
    currentNumerator *= parsed.numerator;
    currentDenominator *= parsed.denominator;
    const reduced = reduceFraction(currentNumerator, currentDenominator);
    currentNumerator = reduced.numerator;
    currentDenominator = reduced.denominator;
    const ratioValue = currentNumerator / currentDenominator;
    if (ratioValue > 2) {
      overOctave = true;
    }
    if (ratioValue < 1) {
      underOctave = true;
    }
    const tick = document.createElement("span");
    tick.className = "build-intervals-tick";
    const position = Math.min(1, Math.max(0, ratioValue - 1));
    tick.style.left = `${(position * 100).toFixed(2)}%`;
    buildIntervalsTicks.appendChild(tick);
  });
  const outOfRange = overOctave || underOctave;
  buildIntervalsPreview.classList.toggle("is-over", outOfRange);
  if (buildIntervalsWarning) {
    if (!outOfRange) {
      buildIntervalsWarning.hidden = true;
      buildIntervalsWarning.textContent = "";
    } else if (overOctave && underOctave) {
      buildIntervalsWarning.hidden = false;
      buildIntervalsWarning.textContent = "Intervals exceed an octave and drop below unison.";
    } else if (overOctave) {
      buildIntervalsWarning.hidden = false;
      buildIntervalsWarning.textContent = "Intervals exceed an octave.";
    } else {
      buildIntervalsWarning.hidden = false;
      buildIntervalsWarning.textContent = "Intervals drop below unison.";
    }
  }
}

function getSelectedIntervalRatio() {
  const selectValue = addIntervalSelect ? String(addIntervalSelect.value) : "custom";
  if (selectValue && selectValue !== "custom") {
    return parseRatioInput(selectValue);
  }
  if (!addIntervalInput) {
    return null;
  }
  return parseRatioInput(addIntervalInput.value);
}

function applyAddIntervalFromSource(
  sourceNode,
  intervalRatio,
  directionOverride = null,
  customText = ""
) {
  if (!sourceNode || !intervalRatio) {
    return null;
  }
  const directionValue =
    directionOverride || (addIntervalDirection ? addIntervalDirection.value : "above");
  const useAbove = directionValue !== "below";
  const stepNumerator = useAbove ? intervalRatio.numerator : intervalRatio.denominator;
  const stepDenominator = useAbove ? intervalRatio.denominator : intervalRatio.numerator;
  const productNumerator = sourceNode.numerator * stepNumerator;
  const productDenominator = sourceNode.denominator * stepDenominator;
  const target = normalizeRatio(productNumerator, productDenominator);
  const targetNode = findOrCreateRatioTargetNode(target);
  if (!targetNode) {
    return null;
  }
  if (
    !layoutMode &&
    !is3DMode &&
    !targetNode.isCustom &&
    Math.abs(Number(targetNode.exponentZ) || 0) > 0
  ) {
    if (mode3dCheckbox) {
      setControlChecked(mode3dCheckbox, true);
    }
    set3DMode(true);
  }
  if (addDistanceEdgeBetweenNodes(sourceNode, targetNode, { customText })) {
    if (!analysisLayers.distances) {
      analysisLayers.distances = true;
      syncAnalysisLayerToggles();
    }
    draw();
    schedulePresetUrlUpdate();
  }
  return targetNode;
}

function startAddIntervalFromNode(node) {
  if (!node) {
    return;
  }
  addIntervalSourceNodeId = node.id;
  addIntervalSelectedRing = {
    nodeId: node.id,
    until: performance.now() + 500,
  };
  updateBannerMessage();
  draw();
  setTimeout(() => {
    if (
      addIntervalSelectedRing &&
      addIntervalSelectedRing.nodeId === node.id &&
      performance.now() >= addIntervalSelectedRing.until
    ) {
      addIntervalSelectedRing = null;
      draw();
    }
  }, 520);
  openIntervalChart();
}

function normalizeCommaRatio(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  const reduced = reduceFraction(numerator, denominator);
  const octaveReduced = reduceToOctave(reduced.numerator, reduced.denominator);
  return reduceFraction(octaveReduced.numerator, octaveReduced.denominator);
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
  const { showLabels = false, showIntervals = false, hoverIndex = null } = options;
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

  const playingKeys = new Set();
  voices.forEach((voice) => {
    const node = nodeById.get(voice.nodeId);
    if (!node) {
      return;
    }
    const ratio = node.numerator / node.denominator;
    const cents = 1200 * Math.log2(ratio);
    playingKeys.add(cents.toFixed(3));
  });
  angles.forEach((entry, index) => {
    const isPlaying = playingKeys.has(entry.cents.toFixed(3));
    const isHover = hoverIndex === index;
    if (!isPlaying && !isHover) {
      return;
    }
    const next = angles[(index + 1) % angles.length];
    let endAngle = next.angle;
    if (endAngle <= entry.angle) {
      endAngle += Math.PI * 2;
    }
    const alpha = isHover ? 0.45 : 0.25;
    ctx2d.fillStyle = `rgba(255, 168, 200, ${alpha})`;
    ctx2d.beginPath();
    ctx2d.moveTo(cx, cy);
    ctx2d.arc(cx, cy, radius, entry.angle, endAngle);
    ctx2d.closePath();
    ctx2d.fill();
  });

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

  if (showLabels) {
    const fontSize = Math.max(9, Math.round(width * 0.03));
    ctx2d.fillStyle = themeColors.wheelText;
    ctx2d.font = `${fontSize}px Noto Serif`;
    ctx2d.textAlign = "center";
    ctx2d.textBaseline = "middle";

    const fundamental = Number(fundamentalInput.value) || 220;
    const a4 = Number(a4Input.value) || 440;

    angles.forEach((item) => {
      const noteInfo = getNearestEtInfo(fundamental * item.ratio, a4);
      const label = `${noteInfo.pitchClass} ${formatCents(noteInfo.cents)}`;
      const labelRadius = radius + fontSize * 1.2;
      const lx = cx + Math.cos(item.angle) * labelRadius;
      const ly = cy + Math.sin(item.angle) * labelRadius;
      drawTextWithSmallCent({
        text: label,
        x: lx,
        y: ly,
        font: "Noto Serif",
        size: fontSize,
        align: "center",
        baseline: "middle",
        hejiAccidentals: hejiEnabled,
        hejiYOffset: Math.round(fontSize * HEJI_SUFFIX_Y_OFFSET),
        context: ctx2d,
        color: themeColors.wheelText,
      });
    });
  }

  if (showIntervals) {
    const sliceFont = Math.max(10, Math.round(width * 0.03));
    ctx2d.font = `${sliceFont}px Noto Serif`;

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

function setRatioWheelHover(nextIndex, nextNodeId) {
  if (ratioWheelHoverIndex === nextIndex && ratioWheelHoverNodeId === nextNodeId) {
    return;
  }
  ratioWheelHoverIndex = nextIndex;
  ratioWheelHoverNodeId = nextNodeId;
  updateRatioWheels();
  draw();
}

function clearRatioWheelHover() {
  setRatioWheelHover(null, null);
}

function getRatioWheelHit(canvasEl, event) {
  if (!canvasEl || (ratioWheelPanel && ratioWheelPanel.hidden)) {
    return null;
  }
  const rect = canvasEl.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }
  const scaleX = canvasEl.width / rect.width;
  const scaleY = canvasEl.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const width = canvasEl.width;
  const height = canvasEl.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.4;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);
  if (dist > radius) {
    return null;
  }
  let angle = Math.atan2(dy, dx);
  if (angle < -Math.PI / 2) {
    angle += Math.PI * 2;
  }
  const angles = getActiveRatioAngles();
  if (!angles.length) {
    return null;
  }
  let hoverIndex = null;
  for (let i = 0; i < angles.length; i += 1) {
    const current = angles[i];
    const next = angles[(i + 1) % angles.length];
    let endAngle = next.angle;
    if (endAngle <= current.angle) {
      endAngle += Math.PI * 2;
    }
    if (angle >= current.angle && angle < endAngle) {
      hoverIndex = i;
      break;
    }
  }
  if (hoverIndex == null) {
    return null;
  }
  const entry = angles[hoverIndex];
  const node = findClosestNodeForRatio(entry.numerator, entry.denominator);
  return { index: hoverIndex, entry, node };
}

function handleRatioWheelHover(event) {
  const hit = getRatioWheelHit(ratioWheelLarge, event);
  if (!hit) {
    clearRatioWheelHover();
    return;
  }
  setRatioWheelHover(hit.index, hit.node ? hit.node.id : null);
}

function handleRatioWheelClick(event) {
  const hit = getRatioWheelHit(ratioWheelLarge, event);
  if (!hit || !hit.node) {
    return;
  }
  const node = hit.node;
  const baseVoice = node.baseVoiceId ? findVoiceById(node.baseVoiceId) : null;
  if (baseVoice) {
    stopVoice(baseVoice);
    node.baseVoiceId = null;
  } else {
    const voice = startVoice({
      nodeId: node.id,
      octave: 0,
      freq: node.freq,
      source: "node",
    });
    if (voice) {
      node.baseVoiceId = voice.id;
    }
  }
  setRatioWheelHover(hit.index, node.id);
  draw();
}

function updateRatioWheels() {
  if (
    view.dragging ||
    view.rotating ||
    layoutDrag ||
    layoutLabelDrag ||
    layoutTitleDrag ||
    layoutCreatorDrag ||
    layoutCustomLabelDrag ||
    layoutAxisDrag ||
    layoutAxisEditDrag
  ) {
    return;
  }
  if (ratioWheelPanel && !ratioWheelPanel.hidden) {
    drawRatioWheel(ratioWheelLarge, { hoverIndex: ratioWheelHoverIndex });
  }
  if (ratioWheelMini) {
    drawRatioWheel(ratioWheelMini, { showLabels: false, showIntervals: false });
  }
}

function getUiHintKey() {
  const interactionMode = getInteractionMode();
  if (interactionMode) {
    return `interaction:${interactionMode}`;
  }
  if (layoutMode) {
    if (layoutAxisEdit) {
      return "layout-axis-edit";
    }
    if (tHeld) {
      return "layout-triangle";
    }
    return "layout";
  }
  if (spellingHintActive) {
    return spellingMode === "true" ? "spelling-true" : "spelling-simple";
  }
  if (!is3DMode) {
    return "mode-2d";
  }
  return "mode-3d";
}

function getInteractionMode() {
  if (distanceSelectMode && analysisLayers.distances) {
    return "distance-edit";
  }
  if (axisModeActive()) {
    const activeAxis = getActiveAxisEntry();
    if (activeAxis && (activeAxis.axis === "x" || activeAxis.axis === "y" || activeAxis.axis === "z")) {
      return `axis-${activeAxis.axis}`;
    }
    return "axis-x";
  }
  if (layoutMode && layoutAlignMode) {
    if (layoutAlignMode === "y") {
      return "align-y";
    }
    if (layoutAlignMode === "straighten") {
      return "align-straighten";
    }
    return "align-x";
  }
  if (analysisLayers.microtonal) {
    return "microtonal-intervals";
  }
  return "";
}

function setUiHintVisibility(isVisible) {
  if (!uiHint) {
    return;
  }
  const hidden = !isVisible;
  uiHint.hidden = hidden;
  uiHint.style.display = hidden ? "none" : "";
}

function setUiHintContent(text, { exitAction = "" } = {}) {
  if (!uiHint) {
    return;
  }
  uiHint.innerHTML = "";
  String(text || "")
    .split("\n")
    .forEach((line, index) => {
      if (index > 0) {
        uiHint.appendChild(document.createElement("br"));
      }
      uiHint.appendChild(document.createTextNode(line));
    });
  if (!exitAction) {
    return;
  }
  uiHint.appendChild(document.createElement("br"));
  const exitButton = document.createElement("button");
  exitButton.type = "button";
  exitButton.className = "ui-hint-exit";
  exitButton.dataset.exitAction = exitAction;
  exitButton.textContent = "[exit]";
  uiHint.appendChild(exitButton);
}

function exitTemporaryInteraction(action) {
  switch (action) {
    case "distance-edit":
      setDistanceSelectMode(false);
      return true;
    case "microtonal-intervals":
      setMicrotonalIntervalsMode(false);
      return true;
    case "layout-align":
      setLayoutAlignMode("");
      return true;
    case "layout-axis-edit":
      layoutAxisEdit = null;
      layoutAxisEditDrag = null;
      updateUiHint();
      draw();
      return true;
    case "axis-mode":
      deactivateAxisMode();
      return true;
    default:
      return false;
  }
}

function updateUiHint() {
  if (!uiHint) {
    return;
  }
  if (performanceModeEnabled) {
    setUiHintVisibility(false);
    return;
  }
  const helpEnabled = showHelpToggle ? showHelpToggle.checked : showHelpEnabled;
  const nextKey = getUiHintKey();
  if (nextKey !== uiHintKey) {
    uiHintKey = nextKey;
    uiHintDismissed = false;
  }
  if (!helpEnabled || uiHintDismissed) {
    setUiHintVisibility(false);
    return;
  }
  setUiHintVisibility(true);
  const interactionMode = getInteractionMode();
  if (interactionMode === "distance-edit") {
    setUiHintContent(DISTANCE_MODE_HELP);
    return;
  }
  if (interactionMode === "microtonal-intervals") {
    setUiHintContent(MICROTONAL_MODE_HELP);
    return;
  }
  if (interactionMode === "align-x") {
    setUiHintContent("X-Align mode\nClick node to establish position.\nAny other nodes clicked will align.");
    return;
  }
  if (interactionMode === "align-y") {
    setUiHintContent("Y-Align mode\nClick node to establish position.\nAny other nodes clicked will align.");
    return;
  }
  if (interactionMode === "align-straighten") {
    setUiHintContent(
      "Straighten mode\nClick two nodes to set the line.\nAny other nodes clicked will align."
    );
    return;
  }
  if (interactionMode === "axis-x") {
    setUiHintContent("Editing along X axis. \nClick to create nodes, option-click to delete.");
    return;
  }
  if (interactionMode === "axis-y") {
    setUiHintContent("Editing along Y axis. \nClick to create nodes, option-click to delete.");
    return;
  }
  if (interactionMode === "axis-z") {
    setUiHintContent("Editing along Z axis. \nClick to create nodes, option-click to delete.");
    return;
  }
  if (layoutMode) {
    if (layoutAxisEdit) {
      setUiHintContent("Editing axis legend.\nPress Delete to remove. Reset Layout restores.");
      return;
    }
    if (tHeld) {
      setUiHintContent(
        "Creating triangles (T)\nClick to add a diagonal, click again to label.\nClick line to rotate or remove."
      );
      return;
    }
  }
  if (spellingHintActive) {
    setUiHintContent(
      spellingMode === "true"
        ? "Diatonic spellings up to 3 sharps / flats, after which nearest enharmonic equivalents are used. \nHold R and click 1:1 to re-spell the fundamental."
        : "Manual spelling: hold R and click on a node to cycle."
    );
    return;
  }
  if (layoutMode) {
    setUiHintContent(
      "Layout mode: Drag to adjust positions. \nOption-click to reset adjustments\nHold Shift to lock moves to 1 direction.\nHold X and click to add custom text.\nClick Space to adjust per-axis spacing.\nDouble-click a node to change its shape.\nDouble-click an axis legend to adjust angle.\nDouble-click a connection to show ratio"
    );
    return;
  }

  if (!is3DMode) {
    setUiHintContent(
      "2D Mode\nShift-click to add a node. \nOption-click to remove.\nZ-click a node to access its Z axis (also X or Y)\nC-click a node to add a custom ratio (4-7th dimension)\nHold I and click a node to add an interval.\nHold L and press & hold to start LFO.\nHold M and click a node to center it.\nHold T to label triangles\nHold O and click a node to change playback octave.\nHold F and click a node to make it the fundamental.\nHold V and click a node to set per-node max volume.\nSpace toggles pattern play/stop. Shift+Space releases all notes.\n\\ cycles looper record/play/overdub. ] clears loop.\nDrag to pan. Scroll to zoom."
    );
    return;
  }
  setUiHintContent(
    "3D Mode\nShift-click to add a node. \nOption-click to remove\nZ-click a node to access its Z axis (also X or Y)\nC-click a node to add a custom ratio (4-7th dimension)\nHold I and click a node to add an interval.\nHold L and press & hold to start LFO\nHold M and click a node to center it.\nHold T to label triangles\nHold O and click a node to change playback octave.\nHold F and click a node to make it the fundamental.\nHold V and click a node to set per-node max volume.\nSpace toggles pattern play/stop. Shift+Space releases all notes.\n\\ cycles looper record/play/overdub. ] clears loop.\nDrag to rotate\nArrow keys to pan\nScroll to zoom"
  );
}

function resetUiHintToDefault() {
  spellingHintActive = false;
}

function isPerformanceModeHotkey(event) {
  if (!event || event.defaultPrevented || event.repeat) {
    return false;
  }
  const key = String(event.key).toLowerCase();
  return (
    event.altKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    (event.code === "KeyF" || key === "f" || key === "ƒ")
  );
}

function hideBannerImmediately() {
  if (!bannerMessage) {
    return;
  }
  bannerMessage.hidden = true;
  bannerMessage.textContent = "";
  bannerMessage.classList.remove("banner-interactive");
  bannerMessage.classList.remove("is-fading");
}

function closePerformanceModeUi() {
  if (keyboardHelpTimer) {
    clearTimeout(keyboardHelpTimer);
    keyboardHelpTimer = null;
  }
  if (keyboardHelp) {
    keyboardHelp.classList.remove("is-visible");
  }
  if (tempBannerTimer) {
    clearTimeout(tempBannerTimer);
    tempBannerTimer = null;
  }
  if (tempBannerHideTimer) {
    clearTimeout(tempBannerHideTimer);
    tempBannerHideTimer = null;
  }
  tempBannerActive = false;
  hideBannerImmediately();
  setUiHintVisibility(false);
  document.querySelectorAll("dialog[open]").forEach((dialog) => {
    try {
      dialog.close("cancel");
    } catch (_error) {
      // noop
    }
  });
  closePresetOverlay();
  closeIntervalChart();
  closeLayoutFontPopover({ revert: false });
  if (layoutSpacePopover) {
    layoutSpacePopover.hidden = true;
  }
  if (layoutKeyMappingPopover) {
    layoutKeyMappingPopover.hidden = true;
  }
  if (looperQuantizeMenu) {
    looperQuantizeMenu.hidden = true;
  }
  if (fileSharePopover) {
    fileSharePopover.hidden = true;
  }
  if (optionsPanel) {
    optionsPanel.hidden = true;
    optionsPanel.classList.remove("panel-open");
  }
  if (calculatePanel) {
    calculatePanel.hidden = true;
    calculatePanel.classList.remove("panel-open");
  }
  if (filePanel) {
    filePanel.hidden = true;
    filePanel.classList.remove("panel-open");
  }
  if (envelopePanel) {
    envelopePanel.hidden = true;
    envelopePanel.classList.remove("panel-open");
  }
  if (animationPanel) {
    animationPanel.hidden = true;
    animationPanel.classList.remove("panel-open");
  }
  if (ratioWheelPanel) {
    ratioWheelPanel.hidden = true;
    ratioWheelPanel.classList.remove("panel-open");
  }
  if (midiMenuPanel) {
    midiMenuPanel.hidden = true;
    midiMenuPanel.classList.remove("panel-open");
  }
  if (optionsToggle) {
    optionsToggle.setAttribute("aria-expanded", "false");
  }
  if (calculateToggle) {
    calculateToggle.setAttribute("aria-expanded", "false");
  }
  if (fileToggle) {
    fileToggle.setAttribute("aria-expanded", "false");
  }
  if (envelopeToggle) {
    envelopeToggle.setAttribute("aria-expanded", "false");
  }
  if (animationToggle) {
    animationToggle.setAttribute("aria-expanded", "false");
  }
  if (ratioWheelToggle) {
    ratioWheelToggle.setAttribute("aria-expanded", "false");
  }
  if (midiMenuToggle) {
    midiMenuToggle.setAttribute("aria-expanded", "false");
  }
}

function setPerformanceMode(enabled) {
  performanceModeEnabled = Boolean(enabled);
  document.body.classList.toggle("performance-mode", performanceModeEnabled);
  if (performanceModeEnabled) {
    closePerformanceModeUi();
  }
  updateUiHint();
  updateBannerMessage();
}

function togglePerformanceMode() {
  setPerformanceMode(!performanceModeEnabled);
}

function handlePerformanceModeHotkey(event) {
  if (!isPerformanceModeHotkey(event)) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  togglePerformanceMode();
}

function isTextEntryTargetForHotkeys(target) {
  if (!target) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = String(target.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
}

function isModeSwitchHotkey(event) {
  if (!event || event.defaultPrevented || event.repeat) {
    return false;
  }
  if (isTextEntryTargetForHotkeys(event.target)) {
    return false;
  }
  return event.ctrlKey && !event.metaKey && !event.altKey;
}

function handleModeSwitchHotkey(event) {
  if (!isModeSwitchHotkey(event)) {
    return;
  }
  let targetMode = "";
  const key = String(event.key);
  const keyCode = Number(event.keyCode || event.which || 0);
  if (
    event.code === "Digit1" ||
    event.code === "Numpad1" ||
    key === "1" ||
    key === "!" ||
    keyCode === 49 ||
    keyCode === 97
  ) {
    targetMode = "2d";
  } else if (
    event.code === "Digit2" ||
    event.code === "Numpad2" ||
    key === "2" ||
    key === "@" ||
    keyCode === 50 ||
    keyCode === 98
  ) {
    targetMode = "3d";
  } else if (
    event.code === "Digit3" ||
    event.code === "Numpad3" ||
    key === "3" ||
    key === "#" ||
    keyCode === 51 ||
    keyCode === 99
  ) {
    targetMode = "layout";
  } else {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  if (targetMode === "layout") {
    setLayoutMode(true);
    return;
  }
  if (layoutMode) {
    setLayoutMode(false);
  }
  set3DMode(targetMode === "3d", { preserveDepth: true });
  schedulePresetUrlUpdate();
}

function isKeyboardModeToggleHotkey(event) {
  if (!event || event.defaultPrevented || event.repeat) {
    return false;
  }
  if (isTextEntryTargetForHotkeys(event.target)) {
    return false;
  }
  return event.ctrlKey && !event.metaKey && !event.altKey;
}

function applyKeyboardModeValue(modeValue) {
  if (!keyboardModeSelect || keyboardModeSelect.disabled) {
    return;
  }
  const nextMode = String(modeValue || "off");
  if (keyboardModeSelect.value === nextMode) {
    return;
  }
  keyboardModeSelect.value = nextMode;
  keyboardModeSelect.dispatchEvent(new Event("change"));
}

function handleKeyboardModeToggleHotkey(event) {
  if (!isKeyboardModeToggleHotkey(event)) {
    return;
  }
  const key = String(event.key || "").toLowerCase();
  if (!(event.code === "KeyK" || key === "k")) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!keyboardModeSelect || keyboardModeSelect.disabled) {
    return;
  }
  const currentMode = keyboardModeSelect.value || "off";
  if (currentMode !== "off") {
    keyboardModeToggleMemory = currentMode;
    applyKeyboardModeValue("off");
    return;
  }
  if (keyboardModeToggleMemory && keyboardModeToggleMemory !== "off") {
    applyKeyboardModeValue(keyboardModeToggleMemory);
  }
}

function isCustomPianoMode() {
  return getKeyboardMode() === "piano-custom";
}

function isCustomPianoMapModeActive() {
  return isCustomPianoMode() && customPianoMapMode;
}

function markCustomPianoMapDirty() {
  customPianoLabelDirty = true;
}

function getCustomPianoLabelMap() {
  if (!customPianoLabelDirty && customPianoLabelMap) {
    return customPianoLabelMap;
  }
  const map = new Map();
  customPianoMap.forEach((nodeIds, key) => {
    if (!nodeIds || !nodeIds.size) {
      return;
    }
    const pitchIndex = key % 12;
    const label = noteNamesSharp[pitchIndex] || noteNames[pitchIndex];
    nodeIds.forEach((nodeId) => {
      const node = nodeById.get(nodeId);
      let resolvedLabel = label;
      if (node) {
        const displayInfo = getCachedDisplayInfo(node);
        const nodePitchClass = displayInfo.pitchClass || node.pitch_class;
        const nodeIndex = PIANO_KEY_PITCH_CLASSES.get(nodePitchClass);
        if (nodePitchClass && nodeIndex === pitchIndex) {
          resolvedLabel = nodePitchClass;
        }
      }
      const list = map.get(nodeId) || [];
      list.push(resolvedLabel);
      map.set(nodeId, list);
    });
  });
  const flattened = new Map();
  map.forEach((labels, nodeId) => {
    flattened.set(nodeId, labels.join(", "));
  });
  customPianoLabelMap = flattened;
  customPianoLabelDirty = false;
  return customPianoLabelMap;
}

function setCustomPianoMapMode(enabled) {
  customPianoMapMode = enabled;
  document.body.classList.toggle("map-mode-active", enabled);
  if (keyboardMapToggle) {
    keyboardMapToggle.classList.toggle("is-active", enabled);
    keyboardMapToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
  }
  if (!enabled) {
    clearCustomPianoPreviewVoices();
    closeKeyboardMapPopover();
  }
  if (!enabled && keyboardMapPopover && keyboardMapPopover.hidden) {
    customPianoSelectedKey = null;
    updateCustomPianoKeyStyles();
  }
}

function updateCustomPianoKeyStyles() {
  keyboardMapKeys.forEach((button) => {
    const key = Number(button.dataset.key);
    const mapped = customPianoMap.get(key);
    const isSelected = key === customPianoSelectedKey;
    const isMapped = Boolean(mapped && mapped.size > 0);
    button.classList.toggle("is-selected", isSelected);
    button.classList.toggle("is-mapped", isMapped);
    button.classList.toggle("is-unmapped", !isMapped);
  });
}

function syncCustomPianoModeUi(modeValue) {
  const isCustomMode = modeValue === "piano-custom";
  if (keyboardMapToggle) {
    keyboardMapToggle.hidden = !isCustomMode;
  }
  if (keyboardMapClear) {
    keyboardMapClear.hidden = !isCustomMode;
  }
  if (isCustomMode) {
    updateCustomPianoKeyStyles();
    closeKeyboardMapPopover();
    return;
  }
  setCustomPianoMapMode(false);
  closeKeyboardMapPopover();
}

function openKeyboardMapPopover() {
  if (!keyboardMapPopover) {
    return;
  }
  keyboardMapPopover.hidden = false;
  updateKeyboardMapPopoverPosition();
  requestAnimationFrame(() => updateKeyboardMapPopoverPosition());
}

function closeKeyboardMapPopover() {
  if (!keyboardMapPopover || isCustomPianoMapModeActive()) {
    return;
  }
  keyboardMapPopover.hidden = true;
}

function updateKeyboardMapPopoverPosition() {
  if (!keyboardMapPopover || keyboardMapPopover.hidden || !keyboardMapToggle) {
    return;
  }
  const anchor = keyboardMapPopover.offsetParent || keyboardMapPopover.parentElement;
  if (!(anchor instanceof HTMLElement)) {
    return;
  }
  const anchorRect = anchor.getBoundingClientRect();
  const buttonRect = keyboardMapToggle.getBoundingClientRect();
  const popoverWidth = keyboardMapPopover.offsetWidth || 240;
  const desiredLeft =
    buttonRect.left + buttonRect.width / 2 - anchorRect.left - popoverWidth / 2;
  const maxLeft = Math.max(0, anchor.clientWidth - popoverWidth);
  const clampedLeft = Math.min(Math.max(0, desiredLeft), maxLeft);
  keyboardMapPopover.style.left = `${Math.round(clampedLeft)}px`;
}

function toggleCustomPianoMapping(key, nodeId) {
  const current = customPianoMap.get(key) || new Set();
  if (current.has(nodeId)) {
    current.delete(nodeId);
  } else {
    current.add(nodeId);
  }
  if (current.size) {
    customPianoMap.set(key, current);
  } else {
    customPianoMap.delete(key);
  }
  markCustomPianoMapDirty();
  updateCustomPianoKeyStyles();
  schedulePresetUrlUpdate();
  draw();
}

function clearCustomPianoPreviewVoices() {
  customPianoPreviewVoices.forEach((voiceId) => {
    const voice = findVoiceById(voiceId);
    if (voice) {
      stopVoice(voice);
    }
  });
  customPianoPreviewVoices.clear();
  draw();
}

function toggleCustomPianoPreviewVoice(node) {
  const existing = customPianoPreviewVoices.get(node.id);
  if (existing) {
    const voice = findVoiceById(existing);
    if (voice) {
      stopVoice(voice);
    }
    customPianoPreviewVoices.delete(node.id);
    draw();
    return;
  }
  const voice = startVoice({
    nodeId: node.id,
    octave: 0,
    freq: node.freq,
    source: "keyboard",
  });
  if (voice) {
    customPianoPreviewVoices.set(node.id, voice.id);
    draw();
  }
}

function startCustomPianoMappedVoices(key, source, velocity = 1, octaveOffset = 0) {
  const mapped = customPianoMap.get(key);
  if (!mapped || !mapped.size) {
    return [];
  }
  const octave = Number(octaveOffset) || 0;
  const voicesStarted = [];
  mapped.forEach((nodeId) => {
    const node = nodeById.get(nodeId);
    if (!node) {
      return;
    }
    const voice = startVoice({
      nodeId: node.id,
      octave,
      freq: node.freq * Math.pow(2, octave),
      source,
      velocity,
    });
    if (voice) {
      voicesStarted.push(voice.id);
    }
  });
  if (voicesStarted.length) {
    draw();
  }
  return voicesStarted;
}

function stopCustomPianoMappedVoices(voiceIds) {
  if (!voiceIds || !voiceIds.length) {
    return;
  }
  voiceIds.forEach((voiceId) => {
    const voice = findVoiceById(voiceId);
    if (voice) {
      stopVoice(voice);
    }
  });
  draw();
}

function serializeCustomPianoMap() {
  return Array.from(customPianoMap.entries()).map(([key, nodes]) => [
    key,
    Array.from(nodes).map((nodeId) => {
      const node = nodeById.get(nodeId);
      if (!node) {
        return nodeId;
      }
      if (!node.isCustom) {
        return {
          exponents: [node.exponentX, node.exponentY, node.exponentZ || 0],
        };
      }
      const source = nodeById.get(node.sourceNodeId);
      const sourceExponents = Array.isArray(node.sourceExponents)
        ? node.sourceExponents
        : source
        ? [source.exponentX, source.exponentY, source.exponentZ || 0]
        : null;
      return {
        sourceExponents,
        customSlot: node.customSlot,
        factorNumerator: node.factorNumerator,
        factorDenominator: node.factorDenominator,
      };
    }),
  ]);
}

function applyCustomPianoMap(serialized) {
  customPianoMap = new Map();
  if (Array.isArray(serialized)) {
    const baseByExponents = new Map();
    nodes.forEach((node) => {
      if (node && !node.isCustom) {
        baseByExponents.set(
          `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
          node
        );
      }
    });
    const customByKey = new Map();
    customNodes.forEach((node) => {
      if (!Array.isArray(node.sourceExponents)) {
        return;
      }
      const [expX, expY, expZ = 0] = node.sourceExponents;
      const slotKey = `${expX},${expY},${expZ}|${node.customSlot}`;
      customByKey.set(slotKey, node);
    });
    serialized.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return;
      }
      const key = Number(entry[0]);
      if (!Number.isFinite(key)) {
        return;
      }
      const nodes = Array.isArray(entry[1]) ? entry[1] : [];
      const set = new Set();
      nodes.forEach((nodeRef) => {
        if (Number.isFinite(nodeRef)) {
          // Legacy format fallback.
          set.add(nodeRef);
          return;
        }
        if (!nodeRef || typeof nodeRef !== "object") {
          return;
        }
        if (Array.isArray(nodeRef.exponents) && nodeRef.exponents.length >= 2) {
          const [expX, expY, expZ = 0] = nodeRef.exponents.map(Number);
          if (!Number.isFinite(expX) || !Number.isFinite(expY) || !Number.isFinite(expZ)) {
            return;
          }
          const resolvedBase = baseByExponents.get(`${expX},${expY},${expZ}`);
          if (resolvedBase) {
            set.add(resolvedBase.id);
          }
          return;
        }
        const slot = Number(nodeRef.customSlot);
        if (!Number.isFinite(slot)) {
          return;
        }
        const sourceExponents = Array.isArray(nodeRef.sourceExponents)
          ? nodeRef.sourceExponents
          : null;
        if (!sourceExponents || sourceExponents.length < 2) {
          return;
        }
        const [expX, expY, expZ = 0] = sourceExponents.map(Number);
        if (!Number.isFinite(expX) || !Number.isFinite(expY) || !Number.isFinite(expZ)) {
          return;
        }
        const resolved = customByKey.get(`${expX},${expY},${expZ}|${slot}`);
        if (resolved) {
          set.add(resolved.id);
        }
      });
      if (set.size) {
        customPianoMap.set(key, set);
      }
    });
  }
  markCustomPianoMapDirty();
  updateCustomPianoKeyStyles();
}

function showKeyboardModeHelp(message) {
  if (!keyboardHelp) {
    return;
  }
  if (performanceModeEnabled) {
    keyboardHelp.classList.remove("is-visible");
    return;
  }
  keyboardHelp.textContent = message;
  keyboardHelp.classList.add("is-visible");
  if (keyboardHelpTimer) {
    clearTimeout(keyboardHelpTimer);
  }
  keyboardHelpTimer = setTimeout(() => {
    keyboardHelp.classList.remove("is-visible");
    keyboardHelpTimer = null;
  }, 5000);
}

function updateBannerMessage() {
  if (!bannerMessage) {
    return;
  }
  if (performanceModeEnabled) {
    hideBannerImmediately();
    return;
  }
  if (tempBannerActive) {
    return;
  }
  const interactionMode = getInteractionMode();
  let nextKey = "";
  let nextText = "";
  let nextHtml = "";
  let nextInteractive = false;
  let nextHidden = false;
  const withExitLine = (label, action) =>
    `${label}<br><button type="button" data-layout-banner="${action}">[exit]</button>`;
  if (nodeVolumeAdjustMode) {
    nextKey = "node-volume-adjust";
    nextHtml = 'Adjust node volumes. <button type="button" data-layout-banner="reset-volumes">reset</button>';
    nextInteractive = true;
  } else if (!layoutMode && looperState === "recording") {
    nextKey = "looper-recording";
    nextText = "Looper recording. Press \\ to play, ] to clear.";
  } else if (!layoutMode && looperState === "overdubbing") {
    nextKey = "looper-overdub";
    nextText = "Looper overdubbing. Press \\ to return to play, ] to clear.";
  } else if (layoutMode && !layoutLockPosition && !interactionMode) {
    nextKey = "layout-freeze";
    nextHtml = 'Drag, scroll, and use arrow keys to adjust view. <button type="button" data-layout-banner="freeze">Freeze</button> this view to edit.';
    nextInteractive = true;
  } else if (layoutAxisEdit) {
    nextKey = "layout-axis-edit";
    nextHtml = withExitLine("Editing axis legend.", "exit-layout-axis-edit");
    nextInteractive = true;
  } else if (
    interactionMode === "align-x" ||
    interactionMode === "align-y" ||
    interactionMode === "align-straighten"
  ) {
    const label =
      interactionMode === "align-y"
        ? "Y-Align mode"
        : interactionMode === "align-straighten"
        ? "Straighten mode"
        : "X-Align mode";
    nextKey = `interaction:${interactionMode}`;
    nextHtml = withExitLine(label, "exit-align");
    nextInteractive = true;
  } else if (
    interactionMode === "distance-edit" ||
    interactionMode === "microtonal-intervals" ||
    interactionMode === "axis-x" ||
    interactionMode === "axis-y" ||
    interactionMode === "axis-z"
  ) {
    const action =
      interactionMode === "distance-edit"
        ? "exit-distance-edit"
        : interactionMode === "microtonal-intervals"
        ? "exit-microtonal"
        : "exit-axis-mode";
    nextKey = `interaction:${interactionMode}`;
    nextHtml = withExitLine(INTERACTION_MODE_LABELS[interactionMode] || interactionMode, action);
    nextInteractive = true;
  } else if (interactionMode) {
    nextKey = `interaction:${interactionMode}`;
    nextText = INTERACTION_MODE_LABELS[interactionMode] || interactionMode;
  } else {
    nextKey = "none";
    nextHidden = true;
  }
  currentBannerKey = nextKey;
  if (bannerDismissedKey && bannerDismissedKey === nextKey) {
    bannerMessage.hidden = true;
    bannerMessage.textContent = "";
    bannerMessage.classList.remove("banner-interactive");
    return;
  }
  bannerDismissedKey = "";
  if (nextHidden) {
    bannerMessage.hidden = true;
    bannerMessage.textContent = "";
    bannerMessage.classList.remove("banner-interactive");
    return;
  }
  if (nextHtml) {
    bannerMessage.innerHTML = nextHtml;
  } else {
    bannerMessage.textContent = nextText;
  }
  bannerMessage.classList.toggle("banner-interactive", nextInteractive);
  bannerMessage.hidden = false;
}

function showTemporaryBanner(text, durationMs = 2000) {
  if (!bannerMessage) {
    return;
  }
  if (performanceModeEnabled) {
    hideBannerImmediately();
    return;
  }
  tempBannerActive = true;
  if (tempBannerTimer) {
    clearTimeout(tempBannerTimer);
  }
  if (tempBannerHideTimer) {
    clearTimeout(tempBannerHideTimer);
  }
  bannerMessage.classList.remove("banner-interactive");
  bannerMessage.classList.remove("is-fading");
  bannerMessage.textContent = text;
  bannerMessage.hidden = false;
  const fadeDelay = Math.max(0, durationMs - 500);
  tempBannerTimer = setTimeout(() => {
    bannerMessage.classList.add("is-fading");
  }, fadeDelay);
  tempBannerHideTimer = setTimeout(() => {
    tempBannerActive = false;
    bannerMessage.classList.remove("is-fading");
    updateBannerMessage();
  }, durationMs);
}

function drawAnalysisWatermark() {
  if (!analysisLayers.microtonal) {
    return;
  }
  const text = "Analysis View";
  const padding = 14;
  const alpha = layoutMode ? 0.5 : 0.38;
  let x = canvas.width - padding;
  let y = padding;
  if (layoutMode) {
    const pageRect = getLayoutPageRect();
    x = pageRect.left + pageRect.width - padding;
    y = pageRect.top + padding;
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = themeColors.textSecondary;
  ctx.font = '600 13px "Lexend", sans-serif';
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function updateAddModeFromShift() {
  if (distanceSelectMode || addIntervalMode) {
    isAddMode = false;
  } else if (!is3DMode) {
    isAddMode = false;
  } else {
    isAddMode = shiftHeld || capsLockOn || axisModeActive();
  }
  if (navAddModeToggle) {
    setControlChecked(navAddModeToggle, isAddMode);
  }
  if (tHeld) {
    updateUiHint();
  }
}

function updateLayoutScaleReadout() {
  if (!layoutScaleReadout) {
    return;
  }
  const clamped = clampZoom(view.zoom);
  layoutScaleReadout.textContent = `${Math.round(clamped * 100)}%`;
}

function updateLayoutNodeSizeReadout() {
  if (!layoutNodeSizeReadout) {
    return;
  }
  layoutNodeSizeReadout.textContent = `${Math.round(layoutNodeSize)} px`;
}

function updateLayoutRatioTextReadout() {
  if (!layoutRatioTextReadout) {
    return;
  }
  layoutRatioTextReadout.textContent = `${Math.round(layoutRatioTextSize)} px`;
}

function updateLayoutNoteTextReadout() {
  if (!layoutNoteTextReadout) {
    return;
  }
  layoutNoteTextReadout.textContent = `${Math.round(layoutNoteTextSize)} px`;
}

function updateLayoutTriangleLabelReadout() {
  if (!layoutTriangleLabelReadout) {
    return;
  }
  layoutTriangleLabelReadout.textContent = `${Math.round(layoutTriangleLabelTextSize)} px`;
}

function updateLayoutTitleMarginReadout() {
  if (!layoutTitleMarginReadout) {
    return;
  }
  layoutTitleMarginReadout.textContent = `${Math.round(layoutTitleMargin)} px`;
}

function setLayoutTitleSize(next) {
  if (!Number.isFinite(next)) {
    return;
  }
  layoutTitleSize = Math.min(96, Math.max(10, Math.round(next)));
  setControlValue(layoutTitleSizeInput, layoutTitleSize);
}

function setLayoutCreatorSize(next) {
  if (!Number.isFinite(next)) {
    return;
  }
  layoutCreatorSize = Math.min(72, Math.max(8, Math.round(next)));
  setControlValue(layoutCreatorSizeInput, layoutCreatorSize);
}

function setLayoutCustomLabelSize(next) {
  if (!Number.isFinite(next)) {
    return;
  }
  layoutCustomLabelTextSize = Math.min(36, Math.max(8, Math.round(next)));
  setControlValue(layoutCustomLabelSizeInput, layoutCustomLabelTextSize);
}

function updateLayoutCustomLabelControls() {
  const hasCustom = layoutCustomLabels.length > 0;
  if (layoutCustomSizeGroup) {
    layoutCustomSizeGroup.hidden = !hasCustom;
  }
  if (layoutCustomFontGroup) {
    layoutCustomFontGroup.hidden = !hasCustom;
  }
}

function applyLayoutSpacing(nextSpacing) {
  const prevSpacing = { ...layoutSpacing };
  layoutSpacing = {
    x: Number(nextSpacing.x) || 1,
    y: Number(nextSpacing.y) || 1,
    z: Number(nextSpacing.z) || 1,
  };
  nodes.forEach((node) => {
    if (node.isCustom) {
      if (!layoutPositions.has(node.id)) {
        layoutPositions.set(node.id, getLayoutBaseCoordinate(node));
      }
      return;
    }
    const key = `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
    const storedOffset = layoutPositionOffsets.get(key);
    const offset = storedOffset
      ? { ...storedOffset }
      : (() => {
          const baseOld = getLayoutBaseCoordinate(node, prevSpacing);
          const current = layoutPositions.get(node.id) || baseOld;
          return {
            x: current.x - baseOld.x,
            y: current.y - baseOld.y,
            z: current.z - baseOld.z,
          };
        })();
    const baseNew = getLayoutBaseCoordinate(node, layoutSpacing);
    layoutPositions.set(node.id, {
      x: baseNew.x + offset.x,
      y: baseNew.y + offset.y,
      z: baseNew.z + offset.z,
    });
  });
}

function updateLayoutSpacingControls() {
  setControlValue(layoutSpaceXInput, layoutSpacing.x);
  setControlValue(layoutSpaceYInput, layoutSpacing.y);
  setControlValue(layoutSpaceZInput, layoutSpacing.z);
  if (layoutSpaceZRow) {
    layoutSpaceZRow.hidden = gridDepth <= 1;
  }
}

function syncLayoutScaleInput() {
  if (!layoutScaleInput) {
    return;
  }
  const clamped = clampZoom(view.zoom);
  layoutScaleInput.value = clamped.toFixed(2);
  updateLayoutScaleReadout();
}

function captureLayoutUndoState() {
  return {
    view: {
      zoom: view.zoom,
      offsetX: view.offsetX,
      offsetY: view.offsetY,
      rotX: view.rotX,
      rotY: view.rotY,
    },
    layoutView: { ...layoutView },
    layoutPositions: new Map(
      Array.from(layoutPositions.entries()).map(([id, coord]) => [id, { ...coord }])
    ),
    layoutLabelOffsets: new Map(
      Array.from(layoutLabelOffsets.entries()).map(([id, offset]) => [id, { ...offset }])
    ),
    layoutKeyMappingOffsets: new Map(
      Array.from(layoutKeyMappingOffsets.entries()).map(([id, offset]) => [
        id,
        { ...offset },
      ])
    ),
    layoutPositionOffsets: new Map(
      Array.from(layoutPositionOffsets.entries()).map(([key, offset]) => [
        key,
        { ...offset },
      ])
    ),
    layoutNodeShapes: new Map(layoutNodeShapes),
    layoutAxisOffsets: {
      x: { ...layoutAxisOffsets.x },
      y: { ...layoutAxisOffsets.y },
      z: { ...layoutAxisOffsets.z },
    },
    layoutAxisHidden: { ...layoutAxisHidden },
    layoutAxisAngles: { ...layoutAxisAngles },
    layoutTitlePosition: layoutTitlePosition ? { ...layoutTitlePosition } : null,
    layoutCreatorPosition: layoutCreatorPosition ? { ...layoutCreatorPosition } : null,
    layoutCustomLabels: layoutCustomLabels.map((entry) => ({
      ...entry,
      position: entry.position ? { ...entry.position } : null,
    })),
    layoutSpacing: { ...layoutSpacing },
    layoutNodeSize,
    layoutRatioTextSize,
    layoutNoteTextSize,
    layoutTriangleLabelTextSize,
    layoutCustomLabelTextSize,
    layoutKeyMappingTextSize,
    layoutAxisLegendTextSize,
    layoutLineLabelTextSize,
    layoutKeyMappingOffset,
    layoutKeyMappingDark,
    layoutKeyMappingPrefix,
    layoutKeyMappingSuffix,
    layoutKeyMappingMode,
    layoutNodeShape,
    layoutTitle,
    layoutCreator,
    layoutTitleSize,
    layoutCreatorSize,
    layoutTitleMargin,
    layoutTitleFont,
    layoutCreatorFont,
    layoutRatioFont,
    layoutNoteFont,
    layoutTriangleLabelFont,
    layoutCustomLabelFont,
    layoutKeyMappingFont,
    layoutAxisLegendFont,
    layoutLineLabelFont,
    layoutTitleFontWeight,
    layoutCreatorFontWeight,
    layoutRatioFontWeight,
    layoutNoteFontWeight,
    layoutTriangleLabelFontWeight,
    layoutCustomLabelFontWeight,
    layoutKeyMappingFontWeight,
    layoutAxisLegendFontWeight,
    layoutLineLabelFontWeight,
    layoutUnifyNodeSize,
    layoutPerspectiveTextSize,
    layoutPageSize,
    layoutOrientation,
    layoutLockPosition,
  };
}

function pushLayoutUndoState() {
  if (!layoutMode) {
    return;
  }
  layoutUndoStack.push(captureLayoutUndoState());
  layoutRedoStack.length = 0;
  if (layoutUndoStack.length > LAYOUT_UNDO_LIMIT) {
    layoutUndoStack.shift();
  }
}

function pushLayoutUndoStateForWheel() {
  if (!layoutMode || layoutWheelUndoTimer) {
    return;
  }
  pushLayoutUndoState();
  layoutWheelUndoTimer = setTimeout(() => {
    layoutWheelUndoTimer = null;
  }, 200);
}

function setControlValue(control, value) {
  if (control) {
    control.value = String(value);
  }
}

function setControlChecked(control, checked) {
  if (control) {
    control.checked = Boolean(checked);
  }
}

function setControlDisabled(control, disabled) {
  if (control) {
    control.disabled = Boolean(disabled);
  }
}

function updateLayoutReadouts() {
  updateLayoutNodeSizeReadout();
  updateLayoutRatioTextReadout();
  updateLayoutNoteTextReadout();
  updateLayoutTriangleLabelReadout();
  updateLayoutTitleMarginReadout();
}

function syncLayoutEditorControls({ includeFreezeToggle = false } = {}) {
  setControlValue(layoutTitleInput, layoutTitle);
  setControlValue(layoutCreatorInput, layoutCreator);
  setControlValue(layoutTitleSizeInput, layoutTitleSize);
  setControlValue(layoutCreatorSizeInput, layoutCreatorSize);
  updateLayoutSpacingControls();
  setControlValue(layoutTitleMarginInput, layoutTitleMargin);
  setControlValue(layoutNodeSizeInput, layoutNodeSize);
  setControlValue(layoutRatioTextSizeInput, layoutRatioTextSize);
  setControlValue(layoutNoteTextSizeInput, layoutNoteTextSize);
  setControlValue(layoutTriangleLabelSizeInput, layoutTriangleLabelTextSize);
  setControlValue(layoutCustomLabelSizeInput, layoutCustomLabelTextSize);
  setControlValue(layoutKeyMappingSizeInput, layoutKeyMappingTextSize);
  setControlValue(layoutKeyMappingOffsetInput, layoutKeyMappingOffset);
  setControlChecked(layoutKeyMappingDarkToggle, layoutKeyMappingDark);
  setControlValue(layoutAxisSizeInput, layoutAxisLegendTextSize);
  setControlValue(layoutLineLabelSizeInput, layoutLineLabelTextSize);
  setControlValue(layoutNodeShapeSelect, layoutNodeShape);
  setControlValue(layoutPageSizeSelect, layoutPageSize);
  setControlValue(layoutOrientationSelect, layoutOrientation);
  setControlValue(layoutKeyMappingPrefixInput, layoutKeyMappingPrefix);
  setControlValue(layoutKeyMappingSuffixInput, layoutKeyMappingSuffix);
  syncLayoutFontPopoverInputs();
  setControlChecked(layoutUnifySizeToggle, layoutUnifyNodeSize);
  syncLayoutPerspectiveTextToggleState();
  if (includeFreezeToggle) {
    setControlChecked(layoutFreezeFlattenToggle, layoutFreezeFlatten);
  }
  updateLayoutReadouts();
  syncLayoutKeyMappingControls();
  updateLayoutCustomLabelControls();
  updateLayoutLinkControls();
}

function applyLayoutUndoState(state) {
  if (!state) {
    return;
  }
  layoutPositions = new Map(
    Array.from(state.layoutPositions.entries()).map(([id, coord]) => [id, { ...coord }])
  );
  layoutLabelOffsets = new Map(
    Array.from(state.layoutLabelOffsets.entries()).map(([id, offset]) => [id, { ...offset }])
  );
  layoutKeyMappingOffsets = new Map(
    Array.from((state.layoutKeyMappingOffsets || new Map()).entries()).map(
      ([id, offset]) => [id, { ...offset }]
    )
  );
  layoutPositionOffsets = new Map(
    Array.from(state.layoutPositionOffsets.entries()).map(([key, offset]) => [
      key,
      { ...offset },
    ])
  );
  layoutNodeShapes = new Map(state.layoutNodeShapes);
  layoutAxisOffsets = {
    x: { ...state.layoutAxisOffsets.x },
    y: { ...state.layoutAxisOffsets.y },
    z: { ...state.layoutAxisOffsets.z },
  };
  layoutAxisHidden = state.layoutAxisHidden
    ? { ...state.layoutAxisHidden }
    : { ...LAYOUT_DEFAULTS.axisHidden };
  layoutAxisAngles = { ...state.layoutAxisAngles };
  layoutTitlePosition = state.layoutTitlePosition ? { ...state.layoutTitlePosition } : null;
  layoutCreatorPosition = state.layoutCreatorPosition ? { ...state.layoutCreatorPosition } : null;
  layoutCustomLabels = Array.isArray(state.layoutCustomLabels)
    ? state.layoutCustomLabels.map((entry) => ({
        ...entry,
        position: entry.position ? { ...entry.position } : null,
      }))
    : [];
  const maxCustomId = layoutCustomLabels.reduce(
    (max, entry) => (Number.isFinite(entry.id) ? Math.max(max, entry.id) : max),
    0
  );
  layoutCustomLabelId = maxCustomId + 1;
  layoutNodeSize = state.layoutNodeSize;
  layoutRatioTextSize = state.layoutRatioTextSize;
  layoutNoteTextSize = state.layoutNoteTextSize;
  layoutTriangleLabelTextSize = state.layoutTriangleLabelTextSize;
  layoutCustomLabelTextSize = state.layoutCustomLabelTextSize ?? layoutCustomLabelTextSize;
  layoutKeyMappingTextSize = state.layoutKeyMappingTextSize ?? layoutKeyMappingTextSize;
  layoutAxisLegendTextSize =
    state.layoutAxisLegendTextSize ?? layoutAxisLegendTextSize;
  layoutLineLabelTextSize =
    state.layoutLineLabelTextSize ?? layoutLineLabelTextSize;
  layoutKeyMappingOffset = state.layoutKeyMappingOffset ?? layoutKeyMappingOffset;
  layoutKeyMappingDark = state.layoutKeyMappingDark ?? layoutKeyMappingDark;
  layoutKeyMappingPrefix = state.layoutKeyMappingPrefix ?? layoutKeyMappingPrefix;
  layoutKeyMappingSuffix = state.layoutKeyMappingSuffix ?? layoutKeyMappingSuffix;
  layoutKeyMappingMode = state.layoutKeyMappingMode ?? layoutKeyMappingMode;
  layoutNodeShape = state.layoutNodeShape;
  layoutTitle = state.layoutTitle;
  layoutCreator = state.layoutCreator;
  layoutTitleSize = state.layoutTitleSize;
  layoutCreatorSize = state.layoutCreatorSize ?? layoutCreatorSize;
  layoutTitleMargin = state.layoutTitleMargin;
  layoutTitleFont = state.layoutTitleFont;
  layoutRatioFont = state.layoutRatioFont;
  layoutNoteFont = state.layoutNoteFont;
  layoutTriangleLabelFont = state.layoutTriangleLabelFont;
  layoutCustomLabelFont = state.layoutCustomLabelFont ?? layoutCustomLabelFont;
  layoutKeyMappingFont = state.layoutKeyMappingFont ?? layoutKeyMappingFont;
  layoutAxisLegendFont = state.layoutAxisLegendFont ?? layoutAxisLegendFont;
  layoutLineLabelFont = state.layoutLineLabelFont ?? layoutLineLabelFont;
  layoutCreatorFont = state.layoutCreatorFont ?? layoutCreatorFont;
  layoutTitleFontWeight = state.layoutTitleFontWeight ?? layoutTitleFontWeight;
  layoutRatioFontWeight = state.layoutRatioFontWeight ?? layoutRatioFontWeight;
  layoutNoteFontWeight = state.layoutNoteFontWeight ?? layoutNoteFontWeight;
  layoutTriangleLabelFontWeight =
    state.layoutTriangleLabelFontWeight ?? layoutTriangleLabelFontWeight;
  layoutCustomLabelFontWeight =
    state.layoutCustomLabelFontWeight ?? layoutCustomLabelFontWeight;
  layoutKeyMappingFontWeight =
    state.layoutKeyMappingFontWeight ?? layoutKeyMappingFontWeight;
  layoutAxisLegendFontWeight =
    state.layoutAxisLegendFontWeight ?? layoutAxisLegendFontWeight;
  layoutLineLabelFontWeight =
    state.layoutLineLabelFontWeight ?? layoutLineLabelFontWeight;
  layoutCreatorFontWeight =
    state.layoutCreatorFontWeight ?? layoutCreatorFontWeight;
  layoutSpacing = state.layoutSpacing
    ? {
        x: Number(state.layoutSpacing.x) || 1,
        y: Number(state.layoutSpacing.y) || 1,
        z: Number(state.layoutSpacing.z) || 1,
      }
    : { ...layoutSpacing };
  layoutUnifyNodeSize = state.layoutUnifyNodeSize;
  layoutPerspectiveTextSize = state.layoutPerspectiveTextSize ?? layoutPerspectiveTextSize;
  layoutPageSize = state.layoutPageSize;
  layoutOrientation = state.layoutOrientation;
  layoutLockPosition = state.layoutLockPosition;
  layoutView = layoutLockPosition ? { ...state.layoutView } : { ...state.view };
  view.zoom = state.view.zoom;
  view.offsetX = state.view.offsetX;
  view.offsetY = state.view.offsetY;
  view.rotX = state.view.rotX;
  view.rotY = state.view.rotY;
  syncLayoutEditorControls();
  syncLayoutFontVars();
  syncLayoutScaleInput();
  invalidateLabelCache({ clearTextWidths: true });
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function undoLayoutChange() {
  if (!layoutMode || !layoutUndoStack.length) {
    return;
  }
  layoutRedoStack.push(captureLayoutUndoState());
  if (layoutRedoStack.length > LAYOUT_UNDO_LIMIT) {
    layoutRedoStack.shift();
  }
  const state = layoutUndoStack.pop();
  applyLayoutUndoState(state);
}

function redoLayoutChange() {
  if (!layoutMode || !layoutRedoStack.length) {
    return;
  }
  layoutUndoStack.push(captureLayoutUndoState());
  if (layoutUndoStack.length > LAYOUT_UNDO_LIMIT) {
    layoutUndoStack.shift();
  }
  const state = layoutRedoStack.pop();
  applyLayoutUndoState(state);
}

function resetLayoutState({ resetSettings = true, resetView = true } = {}) {
  layoutPositions.clear();
  layoutLabelOffsets.clear();
  layoutKeyMappingOffsets.clear();
  layoutNodeShapes.clear();
  layoutPositionOffsets.clear();
  lineLabelPositionOverrides.clear();
  distanceEdgeOverrides.clear();
  layoutCustomLabels = [];
  layoutCustomLabelId = 1;
  pendingLayoutPositionOffsets = null;
  pendingLayoutSpacing = null;
  layoutRedoStack.length = 0;
  layoutTitlePosition = null;
  layoutCreatorPosition = null;
    layoutAxisOffsets = {
      x: { x: 0, y: 0 },
      y: { x: 0, y: 0 },
      z: { x: 0, y: 0 },
    };
    layoutAxisHidden = { ...LAYOUT_DEFAULTS.axisHidden };
    layoutAxisAngles = {
      x: null,
      y: null,
      z: null,
    };
  layoutAxisEdit = null;
  layoutAxisEditDrag = null;
  layoutKeyMappingDrag = null;
  if (resetSettings) {
    layoutNodeSize = LAYOUT_DEFAULTS.nodeSize;
    layoutRatioTextSize = LAYOUT_DEFAULTS.ratioTextSize;
    layoutNoteTextSize = LAYOUT_DEFAULTS.noteTextSize;
    layoutTriangleLabelTextSize = LAYOUT_DEFAULTS.triangleLabelTextSize;
    layoutCustomLabelTextSize = LAYOUT_DEFAULTS.customLabelTextSize;
    layoutKeyMappingTextSize = LAYOUT_DEFAULTS.keyMappingTextSize;
    layoutAxisLegendTextSize = LAYOUT_DEFAULTS.axisLegendTextSize;
    layoutLineLabelTextSize = LAYOUT_DEFAULTS.lineLabelTextSize;
    layoutKeyMappingOffset = LAYOUT_DEFAULTS.keyMappingOffset;
    layoutKeyMappingDark = LAYOUT_DEFAULTS.keyMappingDark;
    layoutKeyMappingPrefix = LAYOUT_DEFAULTS.keyMappingPrefix;
    layoutKeyMappingSuffix = LAYOUT_DEFAULTS.keyMappingSuffix;
    layoutSpacing = { ...LAYOUT_DEFAULTS.spacing };
    layoutNodeShape = LAYOUT_DEFAULTS.nodeShape;
    layoutTitle = LAYOUT_DEFAULTS.title;
    layoutCreator = LAYOUT_DEFAULTS.creator;
    layoutTitleSize = LAYOUT_DEFAULTS.titleSize;
    layoutCreatorSize = LAYOUT_DEFAULTS.creatorSize;
    layoutTitleMargin = LAYOUT_DEFAULTS.titleMargin;
    layoutKeyMappingMode = LAYOUT_DEFAULTS.keyMappingsMode;
    layoutUnifyNodeSize = LAYOUT_DEFAULTS.unifyNodeSize;
    layoutPerspectiveTextSize = LAYOUT_DEFAULTS.perspectiveTextSize;
    layoutFreezeFlatten = LAYOUT_DEFAULTS.freezeFlatten;
    layoutPageSize = LAYOUT_DEFAULTS.pageSize;
    layoutOrientation = LAYOUT_DEFAULTS.orientation;
    layoutLockPosition = LAYOUT_DEFAULTS.lockPosition;
    layoutView = { ...LAYOUT_DEFAULTS.view };
    layoutTitleFont = LAYOUT_DEFAULTS.titleFont;
    layoutRatioFont = LAYOUT_DEFAULTS.ratioFont;
    layoutNoteFont = LAYOUT_DEFAULTS.noteFont;
    layoutTriangleLabelFont = LAYOUT_DEFAULTS.triangleLabelFont;
    layoutCustomLabelFont = LAYOUT_DEFAULTS.customLabelFont;
    layoutKeyMappingFont = LAYOUT_DEFAULTS.keyMappingFont;
    layoutAxisLegendFont = LAYOUT_DEFAULTS.axisLegendFont;
    layoutLineLabelFont = LAYOUT_DEFAULTS.lineLabelFont;
    layoutCreatorFont = LAYOUT_DEFAULTS.creatorFont;
    layoutTitleFontWeight = LAYOUT_DEFAULTS.titleFontWeight;
    layoutRatioFontWeight = LAYOUT_DEFAULTS.ratioFontWeight;
    layoutNoteFontWeight = LAYOUT_DEFAULTS.noteFontWeight;
    layoutTriangleLabelFontWeight = LAYOUT_DEFAULTS.triangleLabelFontWeight;
    layoutCustomLabelFontWeight = LAYOUT_DEFAULTS.customLabelFontWeight;
    layoutKeyMappingFontWeight = LAYOUT_DEFAULTS.keyMappingFontWeight;
    layoutAxisLegendFontWeight = LAYOUT_DEFAULTS.axisLegendFontWeight;
    layoutLineLabelFontWeight = LAYOUT_DEFAULTS.lineLabelFontWeight;
    layoutCreatorFontWeight = LAYOUT_DEFAULTS.creatorFontWeight;
    syncLayoutEditorControls({ includeFreezeToggle: true });
    syncLayoutFontVars();
  }
  if (resetView) {
    view.zoom = LAYOUT_DEFAULTS.zoom;
    view.offsetX = 0;
    view.offsetY = 0;
    syncLayoutScaleInput();
  }
  if (resetView && layoutMode && layoutPrevState) {
    view.zoom = layoutPrevState.zoom;
    view.offsetX = layoutPrevState.offsetX;
    view.offsetY = layoutPrevState.offsetY;
    view.rotX = layoutPrevState.rotX;
    view.rotY = layoutPrevState.rotY;
    syncLayoutScaleInput();
    markIsomorphicDirty();
    syncLayoutViewFromCurrent();
  }
  draw();
}

function setLayoutMode(enabled, { force = false } = {}) {
  const wasLayoutMode = layoutMode;
  if (wasLayoutMode === enabled && !(force && enabled)) {
    return;
  }
  if (!enabled && layoutAlignMode) {
    layoutAlignMode = "";
    layoutAlignAnchorId = null;
    syncLayoutAlignButtons();
  }
  uiHintKey = "";
  uiHintDismissed = false;
  resetUiHintToDefault();
  if (enabled && !wasLayoutMode) {
    layoutPrevState = {
      is3DMode,
      showAxes,
      showGrid,
      zoom: view.zoom,
      offsetX: view.offsetX,
      offsetY: view.offsetY,
      rotX: view.rotX,
      rotY: view.rotY,
    };
  }
  layoutMode = enabled;
  refreshThemeColors();
  setControlChecked(layoutModeToggle, enabled);
  syncViewModeControls();
  if (layoutPanel) {
    layoutPanel.hidden = !enabled;
  }
  if (!enabled) {
    closeLayoutFontPopover();
  }
  if (synthPanel) {
    synthPanel.hidden = enabled;
  }
  updateNavPanelVisibility();
  if (enabled) {
    setCustomPianoMapMode(false);
    closeKeyboardMapPopover();
    showAxes = false;
    showGrid = false;
    setControlChecked(navAxesToggle, false);
    setControlChecked(navGridToggle, false);
    setControlChecked(mode3dCheckbox, false);
    const preserveDepth = is3DMode || isFlattened2D;
    set3DMode(false, { preserveDepth });
    if (layoutLockPosition) {
      view.zoom = layoutView.zoom;
      view.offsetX = layoutView.offsetX;
      view.offsetY = layoutView.offsetY;
      view.rotX = layoutView.rotX;
      view.rotY = layoutView.rotY;
      syncLayoutScaleInput();
    } else {
      layoutView = {
        zoom: view.zoom,
        offsetX: view.offsetX,
        offsetY: view.offsetY,
        rotX: view.rotX,
        rotY: view.rotY,
      };
    }
    layoutAxisEdit = null;
    layoutAxisEditDrag = null;
    nodes.forEach((node) => ensureLayoutPosition(node));
    updateLayoutReadouts();
    updateLayoutCustomLabelControls();
    updateLayoutSpacingControls();
    updateLayoutLinkControls();
    draw();
  } else if (layoutPrevState) {
    if (layoutSpacePopover) {
      layoutSpacePopover.hidden = true;
    }
    closeLayoutFontPopover();
    layoutAxisEdit = null;
    layoutAxisEditDrag = null;
    showAxes = layoutPrevState.showAxes;
    showGrid = layoutPrevState.showGrid;
    setControlChecked(navAxesToggle, showAxes);
    setControlChecked(navGridToggle, showGrid);
    if (layoutLockPosition) {
      syncLayoutViewFromCurrent();
      view.zoom = layoutPrevState.zoom;
      view.offsetX = layoutPrevState.offsetX;
      view.offsetY = layoutPrevState.offsetY;
      view.rotX = layoutPrevState.rotX;
      view.rotY = layoutPrevState.rotY;
    }
    setControlChecked(mode3dCheckbox, layoutPrevState.is3DMode);
    set3DMode(layoutPrevState.is3DMode);
    layoutPrevState = null;
    updateLayoutLinkControls();
  } else {
    draw();
  }
  updateBannerMessage();
  updateUiHint();
}

function set3DMode(enabled, { preserveDepth = false } = {}) {
  uiHintKey = "";
  uiHintDismissed = false;
  resetUiHintToDefault();
  const activeKeys = captureActiveNodeKeys();
  const had3DNodes = gridDepth > 1;
  is3DMode = enabled;
  isFlattened2D = !enabled && (preserveDepth || had3DNodes);
  markIsomorphicDirty();
  updateNavPanelVisibility();
  syncViewModeControls();
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
  if (!enabled) {
    clearAxisStack();
  }
  if (enabled && uiHint && showHelpEnabled && !uiHintDismissed) {
    setUiHintVisibility(true);
  }
  updateAddModeFromShift();
  updateUiHint();
  if (enabled && !had3DNodes) {
    rebuildLattice(activeKeys, { stopVoices: false });
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
    view.zoom = Math.min(ZOOM_MAX, view.zoom * 1.1);
  } else if (action === "zoom-out") {
    view.zoom = Math.max(ZOOM_MIN, view.zoom / 1.1);
  } else if (action === "reset-view") {
    view.offsetX = 0;
    view.offsetY = 0;
    view.zoom = 1;
    view.rotX = 0;
    view.rotY = 0;
  } else if (action === "fit-view") {
    if (is3DMode) {
      applyBestView({ cycle: true });
      schedulePresetUrlUpdate();
      return;
    }
    fitViewToActiveNodes2D();
    schedulePresetUrlUpdate();
    return;
  } else if (action === "best-view") {
    applyBestView({ cycle: true });
    schedulePresetUrlUpdate();
    return;
  }
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function getViewSafeInsets() {
  const topBar = document.querySelector(".top-bar");
  const leftNav = document.getElementById("nav-3d");
  const synthPanel = document.querySelector(".synth-panel");
  const topBarRect = topBar ? topBar.getBoundingClientRect() : null;
  const leftNavRect = leftNav && !leftNav.hidden ? leftNav.getBoundingClientRect() : null;
  const synthRect = synthPanel ? synthPanel.getBoundingClientRect() : null;
  return {
    safeTop: topBarRect ? topBarRect.height : 0,
    safeLeft: leftNavRect ? leftNavRect.width : 0,
    safeBottom: synthRect ? synthRect.height : 0,
    safeRight: 0,
  };
}

function fitViewToActiveNodes2D() {
  if (is3DMode) {
    return;
  }
  const activeNodes = nodes.filter((node) => node.active);
  if (!activeNodes.length) {
    return;
  }
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  activeNodes.forEach((node) => {
    const radius = getNodeRadius(node);
    minX = Math.min(minX, node.coordinate.x - radius);
    maxX = Math.max(maxX, node.coordinate.x + radius);
    minY = Math.min(minY, node.coordinate.y - radius);
    maxY = Math.max(maxY, node.coordinate.y + radius);
  });
  const { safeTop, safeLeft, safeBottom, safeRight } = getViewSafeInsets();
  const padding = 80;
  const labelBuffer = 140;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const availableWidth = Math.max(
    1,
    canvas.clientWidth - safeLeft - safeRight - padding - labelBuffer
  );
  const availableHeight = Math.max(1, canvas.clientHeight - safeTop - safeBottom - padding);
  const zoomX = availableWidth / width;
  const zoomY = availableHeight / height;
  view.zoom = clampZoom(Math.min(zoomX, zoomY));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const targetCenterX = safeLeft + (canvas.clientWidth - safeLeft - safeRight) / 2;
  const targetCenterY = safeTop + (canvas.clientHeight - safeTop - safeBottom) / 2;
  view.offsetX = (targetCenterX - canvas.clientWidth / 2) / view.zoom - centerX;
  view.offsetY = (targetCenterY - canvas.clientHeight / 2) / view.zoom - centerY;
  draw();
  markIsomorphicDirty();
}

function getActiveNodesSignature(activeNodes) {
  return activeNodes
    .map((node) => `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`)
    .sort()
    .join("|");
}

function computeBestViewCandidates(activeNodes) {
  const yawSteps = [];
  for (let yaw = -Math.PI; yaw < Math.PI; yaw += Math.PI / 6) {
    yawSteps.push(yaw);
  }
  const pitchSteps = [];
  for (let pitch = -0.9; pitch <= 0.9; pitch += Math.PI / 9) {
    pitchSteps.push(pitch);
  }
  const minAngleDelta = (3 * Math.PI) / 180;
  const maxViews = 6;
  const candidates = [];
  pitchSteps.forEach((rotX) => {
    yawSteps.forEach((rotY) => {
      let score = 0;
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < activeNodes.length; i += 1) {
        const nodeA = activeNodes[i];
        const projA = projectPointWithAngles(nodeA.coordinate, rotX, rotY);
        const radiusA = getNodeRadius(nodeA) * projA.scale;
        minX = Math.min(minX, projA.x - radiusA);
        maxX = Math.max(maxX, projA.x + radiusA);
        minY = Math.min(minY, projA.y - radiusA);
        maxY = Math.max(maxY, projA.y + radiusA);
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
      const spread = Math.max(1, maxX - minX) * Math.max(1, maxY - minY);
      const areaPenalty = spread * 0.0001;
      candidates.push({
        rotX,
        rotY,
        score: score + areaPenalty,
        bounds: { minX, maxX, minY, maxY },
      });
    });
  });
  candidates.sort((a, b) => a.score - b.score);
  const filtered = [];
  const angleDistance = (a, b) => {
    const diff = Math.atan2(Math.sin(a - b), Math.cos(a - b));
    return Math.abs(diff);
  };
  candidates.forEach((candidate) => {
    if (filtered.length >= maxViews) {
      return;
    }
    const tooClose = filtered.some(
      (existing) =>
        Math.abs(candidate.rotX - existing.rotX) < minAngleDelta &&
        angleDistance(candidate.rotY, existing.rotY) < minAngleDelta
    );
    if (!tooClose) {
      filtered.push(candidate);
    }
  });
  return filtered.length ? filtered : candidates.slice(0, maxViews);
}

function fitViewToProjectedBounds(bounds, { extraLeft = 0 } = {}) {
  const { safeTop, safeLeft, safeBottom, safeRight } = getViewSafeInsets();
  const padding = 80;
  const leftPadding = safeLeft + extraLeft;
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const availableWidth = Math.max(
    1,
    canvas.clientWidth - leftPadding - safeRight - padding
  );
  const availableHeight = Math.max(
    1,
    canvas.clientHeight - safeTop - safeBottom - padding
  );
  const zoomX = availableWidth / width;
  const zoomY = availableHeight / height;
  view.zoom = clampZoom(Math.min(zoomX, zoomY));
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const targetCenterX =
    leftPadding + (canvas.clientWidth - leftPadding - safeRight) / 2;
  const targetCenterY =
    safeTop + (canvas.clientHeight - safeTop - safeBottom) / 2;
  view.offsetX = (targetCenterX - canvas.clientWidth / 2) / view.zoom - centerX;
  view.offsetY = (targetCenterY - canvas.clientHeight / 2) / view.zoom - centerY;
}

function applyBestView({ cycle = false } = {}) {
  if (!is3DMode) {
    return;
  }
  const activeNodes = nodes.filter((node) => node.active);
  if (!activeNodes.length) {
    return;
  }
  const signature = getActiveNodesSignature(activeNodes);
  if (!cycle || signature !== bestViewSignature || !bestViewCandidates.length) {
    bestViewCandidates = computeBestViewCandidates(activeNodes);
    bestViewSignature = signature;
    bestViewIndex = 0;
  } else {
    bestViewIndex = (bestViewIndex + 1) % bestViewCandidates.length;
  }
  const choice = bestViewCandidates[bestViewIndex] || bestViewCandidates[0];
  if (!choice) {
    return;
  }
  view.rotX = choice.rotX;
  view.rotY = choice.rotY;
  fitViewToProjectedBounds(choice.bounds, { extraLeft: 40 });
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
    if (voice.morphState) {
      const elapsedMs = nowMs - voice.morphState.startMs;
      const progress = Math.max(0, Math.min(1, elapsedMs / Math.max(1, voice.morphState.durationMs)));
      const nextFreq =
        voice.morphState.fromFreq +
        (voice.morphState.toFreq - voice.morphState.fromFreq) * progress;
      const nextGain =
        voice.morphState.fromGain +
        (voice.morphState.toGain - voice.morphState.fromGain) * progress;
      setVoiceFrequencyAtTime(voice, nextFreq, nowSec, 0.01);
      if (voice.morphGain && voice.morphGain.gain) {
        voice.morphGain.gain.value = Math.max(0, Math.min(1, nextGain));
      }
      if (progress >= 1) {
        if (voice.morphState.stopAtEnd) {
          stopVoice(voice, true);
        } else {
          voice.morphState = null;
        }
      } else {
        voiceNeedsFrame = true;
      }
    }
    if (voice.lfoActive && voice.lfoGain) {
      voice.lfoGain.gain.value = getLfoGainValue(voice, nowMs);
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

function readThemeColorsFromStyles(styles, prefix = "canvas") {
  const key = (name) => `--${prefix}-${name}`;
  return {
    edge: styles.getPropertyValue(key("edge")).trim() || "rgba(0, 0, 0, 0.18)",
    nodeStroke: styles.getPropertyValue(key("node-stroke")).trim() || "rgba(0, 0, 0, 0.35)",
    nodeActive: styles.getPropertyValue(key("node-active")).trim() || "#c94b3d",
    nodeInactive: styles.getPropertyValue(key("node-inactive")).trim() || "rgba(255, 255, 255, 0.02)",
    nodeCustomInactive:
      styles.getPropertyValue(key("node-custom-inactive")).trim() || "rgba(210, 210, 210, 0.2)",
    nodeShadow: styles.getPropertyValue(key("node-shadow")).trim() || "rgba(0, 0, 0, 0.22)",
    nodeHighlight:
      styles.getPropertyValue(key("node-highlight")).trim() || "rgba(255, 255, 255, 0.35)",
    hoverRingFill:
      styles.getPropertyValue(key("hover-ring-fill")).trim() || "rgba(255, 168, 200, 0.25)",
    hoverRingStroke:
      styles.getPropertyValue(key("hover-ring-stroke")).trim() || "rgba(255, 168, 200, 0.6)",
    textPrimary: styles.getPropertyValue(key("text-primary")).trim() || "#1e1e1e",
    textSecondary: styles.getPropertyValue(key("text-secondary")).trim() || "#2a2a2a",
    page: styles.getPropertyValue("--layout-page").trim() || "#ffffff",
    pageBorder:
      styles.getPropertyValue("--layout-page-border").trim() || "rgba(16, 19, 22, 0.15)",
    pageShadow:
      styles.getPropertyValue("--layout-page-shadow").trim() || "rgba(16, 19, 22, 0.18)",
    lfo: styles.getPropertyValue(key("lfo")).trim() || "#3b82f6",
    playFill: styles.getPropertyValue(key("play-fill")).trim() || "#f3d64d",
    looperFill: styles.getPropertyValue(key("looper-fill")).trim() || "#f0bf3a",
    wheelLine: styles.getPropertyValue(key("wheel-line")).trim() || "rgba(16, 19, 22, 0.65)",
    wheelRing: styles.getPropertyValue(key("wheel-ring")).trim() || "rgba(16, 19, 22, 0.2)",
    wheelText: styles.getPropertyValue(key("wheel-text")).trim() || "#000000",
  };
}

const rootThemeStyles = getComputedStyle(document.documentElement);
const layoutThemeColors = readThemeColorsFromStyles(rootThemeStyles, "layout");

function refreshThemeColors() {
  if (layoutMode) {
    themeColors = { ...layoutThemeColors };
    return;
  }
  const styles = getComputedStyle(document.body);
  themeColors = readThemeColorsFromStyles(styles, "canvas");
}

function initLayoutFonts() {
  const styles = getComputedStyle(document.documentElement);
  layoutTitleFont = styles.getPropertyValue("--font-title").trim() || "Noto Serif";
  layoutRatioFont = styles.getPropertyValue("--font-ratio").trim() || "Noto Serif";
  layoutNoteFont = styles.getPropertyValue("--font-note").trim() || "Lexend";
  layoutTriangleLabelFont =
    styles.getPropertyValue("--font-triangle-label").trim() || "Noto Serif";
  layoutCustomLabelFont =
    styles.getPropertyValue("--font-custom-label").trim() || "Noto Serif";
  layoutKeyMappingFont =
    styles.getPropertyValue("--font-key-mapping").trim() || "Lexend";
  layoutAxisLegendFont = layoutRatioFont;
  layoutLineLabelFont = layoutAxisLegendFont;
  layoutAxisLegendFontWeight = layoutRatioFontWeight;
  layoutLineLabelFontWeight = layoutAxisLegendFontWeight;
  layoutCreatorFont = layoutTitleFont;
  layoutCreatorFontWeight = layoutTitleFontWeight;
  syncLayoutFontPopoverInputs();
  syncLayoutFontVars();
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeSelect) {
    themeSelect.value = theme;
  }
  refreshThemeColors();
  draw();
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("lattice-theme", nextTheme);
}

function onThemeSelectChange() {
  if (!themeSelect) {
    return;
  }
  const availableThemes = Array.from(themeSelect.options).map((option) => option.value);
  const selected = availableThemes.includes(themeSelect.value) ? themeSelect.value : "light";
  applyTheme(selected);
  localStorage.setItem("lattice-theme", selected);
}

function initTheme() {
  const saved = localStorage.getItem("lattice-theme");
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const availableThemes = themeSelect
    ? Array.from(themeSelect.options).map((option) => option.value)
    : ["light", "dark"];
  const fallbackTheme = prefersDark ? "dark" : "light";
  const theme = saved && availableThemes.includes(saved) ? saved : fallbackTheme;
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

function toggleCalculatePanel() {
  if (!calculateToggle || !calculatePanel) {
    return;
  }
  const isOpen = calculateToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeTopMenus("calculate");
  }
  calculateToggle.setAttribute("aria-expanded", String(!isOpen));
  calculatePanel.hidden = isOpen;
  calculatePanel.classList.toggle("panel-open", !isOpen);
  const parentPanel = calculateToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.toggle("panel-open", !isOpen);
  }
  syncTopMenuPanelState();
}

function openPresetOverlay() {
  if (!presetToggle || !presetOverlay) {
    return;
  }
  closeTopMenus("presets");
  presetToggle.setAttribute("aria-expanded", "true");
  presetOverlay.hidden = false;
  document.body.classList.add("preset-open");
  if (presetSortSelect) {
    presetSortSelect.value = presetSortMode;
  }
  syncTopMenuPanelState();
  requestAnimationFrame(() => {
    if (presetSearchInput) {
      presetSearchInput.focus();
      presetSearchInput.select();
    }
  });
}

function closePresetOverlay() {
  if (!presetToggle || !presetOverlay) {
    return;
  }
  presetToggle.setAttribute("aria-expanded", "false");
  presetOverlay.hidden = true;
  document.body.classList.remove("preset-open");
  syncTopMenuPanelState();
}

function togglePresetPanel() {
  if (!presetToggle || !presetOverlay) {
    return;
  }
  const isOpen = presetToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closePresetOverlay();
  } else {
    openPresetOverlay();
  }
}

function toggleFilePanel() {
  if (!fileToggle || !filePanel) {
    return;
  }
  const isOpen = fileToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeTopMenus("file");
  }
  fileToggle.setAttribute("aria-expanded", String(!isOpen));
  filePanel.hidden = isOpen;
  filePanel.classList.toggle("panel-open", !isOpen);
  const parentPanel = fileToggle.closest(".panel");
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
  clearRatioWheelHover();
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

function toggleMidiMenuPanel() {
  if (!midiMenuToggle || !midiMenuPanel) {
    return;
  }
  const isOpen = midiMenuToggle.getAttribute("aria-expanded") === "true";
  if (!isOpen) {
    closeTopMenus("midi");
  }
  midiMenuToggle.setAttribute("aria-expanded", String(!isOpen));
  midiMenuPanel.hidden = isOpen;
  midiMenuPanel.classList.toggle("panel-open", !isOpen);
  const parentPanel = midiMenuToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.toggle("panel-open", !isOpen);
  }
  syncTopMenuPanelState();
}

function closeMidiMenuPanel() {
  if (!midiMenuToggle || !midiMenuPanel) {
    return;
  }
  midiMenuToggle.setAttribute("aria-expanded", "false");
  midiMenuPanel.hidden = true;
  midiMenuPanel.classList.remove("panel-open");
}

function openFindRatioDialog() {
  if (!findRatioDialog || !findRatioInput) {
    return;
  }
  updateFindRatioAxisRecommendation(findRatioInput.value);
  if (typeof findRatioDialog.showModal === "function") {
    findRatioDialog.showModal();
  }
  requestAnimationFrame(() => {
    findRatioInput.focus();
    findRatioInput.select();
  });
}

function populateAddIntervalOptions() {
  if (!addIntervalSelect) {
    return;
  }
  addIntervalSelect.innerHTML = "";
  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Custom";
  addIntervalSelect.appendChild(customOption);
  const sorted = [...commaEntries].sort((a, b) => {
    const aValue = Number(a.numerator) / Number(a.denominator);
    const bValue = Number(b.numerator) / Number(b.denominator);
    if (aValue !== bValue) {
      return aValue - bValue;
    }
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  sorted.forEach((entry) => {
    const option = document.createElement("option");
    option.value = `${entry.numerator}:${entry.denominator}`;
    option.textContent = `${entry.numerator}:${entry.denominator}, ${entry.name}`;
    addIntervalSelect.appendChild(option);
  });
  addIntervalSelect.value = "custom";
}

function openAddIntervalDialog() {
  if (!addIntervalDialog) {
    return;
  }
  populateAddIntervalOptions();
  if (addIntervalInput) {
    addIntervalInput.disabled = false;
    addIntervalInput.value = "";
  }
  if (typeof addIntervalDialog.showModal === "function") {
    addIntervalDialog.showModal();
  }
  requestAnimationFrame(() => {
    if (addIntervalInput) {
      addIntervalInput.focus();
      addIntervalInput.select();
    }
  });
}

function openBuildIntervalsDialog() {
  if (!buildIntervalsDialog || !buildIntervalsInput) {
    return;
  }
  if (typeof buildIntervalsDialog.showModal === "function") {
    buildIntervalsDialog.showModal();
  }
  requestAnimationFrame(() => {
    buildIntervalsInput.focus();
    buildIntervalsInput.select();
  });
  updateBuildIntervalsPreview();
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
  closePresetOverlay();
}

function closeCalculatePanel() {
  if (!calculateToggle || !calculatePanel) {
    return;
  }
  calculateToggle.setAttribute("aria-expanded", "false");
  calculatePanel.hidden = true;
  calculatePanel.classList.remove("panel-open");
  const parentPanel = calculateToggle.closest(".panel");
  if (parentPanel) {
    parentPanel.classList.remove("panel-open");
  }
}

function closeFilePanel() {
  if (!fileToggle || !filePanel) {
    return;
  }
  fileToggle.setAttribute("aria-expanded", "false");
  filePanel.hidden = true;
  filePanel.classList.remove("panel-open");
  hideFileSharePopover();
  const parentPanel = fileToggle.closest(".panel");
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
  if (except !== "calculate") {
    closeCalculatePanel();
  }
  if (except !== "presets") {
    closePresetPanel();
  }
  if (except !== "file") {
    closeFilePanel();
  }
  if (except !== "ratio-wheel") {
    closeRatioWheelPanel();
  }
  if (except !== "midi") {
    closeMidiMenuPanel();
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
  const topMenusOpen =
    (optionsPanel && !optionsPanel.hidden) ||
    (calculatePanel && !calculatePanel.hidden) ||
    (presetOverlay && !presetOverlay.hidden) ||
    (filePanel && !filePanel.hidden) ||
    (ratioWheelPanel && !ratioWheelPanel.hidden) ||
    (midiMenuPanel && !midiMenuPanel.hidden);
  if (controlActionsPanel) {
    controlActionsPanel.classList.toggle("panel-open", topMenusOpen);
  }
  if (uiHint) {
    if (topMenusOpen) {
      setUiHintVisibility(false);
    } else {
      updateUiHint();
    }
  }
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

function syncAnalysisLayerToggles() {
  setControlChecked(analysisShowDistancesToggle, analysisLayers.distances);
  setControlChecked(analysisShowMicrotonalToggle, analysisLayers.microtonal);
  setControlChecked(layoutShowDistancesToggle, analysisLayers.distances);
  setControlChecked(layoutShowMicrotonalToggle, analysisLayers.microtonal);
  updateUiHint();
}

function clearMicrotonalModeState() {
  microtonalSelectedNodeIds.clear();
  microtonalHoverPairKey = "";
}

function setMicrotonalIntervalsMode(enabled) {
  const nextEnabled = Boolean(enabled);
  if (analysisLayers.microtonal === nextEnabled) {
    return;
  }
  if (nextEnabled && layoutAlignMode) {
    layoutAlignMode = "";
    layoutAlignAnchorId = null;
    syncLayoutAlignButtons();
  }
  analysisLayers.microtonal = nextEnabled;
  if (nextEnabled && distanceSelectMode) {
    setDistanceSelectMode(false);
  }
  if (!nextEnabled) {
    clearMicrotonalModeState();
  }
  syncAnalysisLayerToggles();
  updateBannerMessage();
  draw();
}

function setDistanceSelectMode(enabled) {
  const nextEnabled = Boolean(enabled);
  if (distanceSelectMode === nextEnabled) {
    return;
  }
  clearPendingDistanceLabelClick();
  if (nextEnabled && layoutAlignMode) {
    layoutAlignMode = "";
    layoutAlignAnchorId = null;
    syncLayoutAlignButtons();
  }
  if (nextEnabled && analysisLayers.microtonal) {
    analysisLayers.microtonal = false;
    clearMicrotonalModeState();
    syncAnalysisLayerToggles();
  }
  distanceSelectMode = nextEnabled;
  if (!distanceSelectMode) {
    distanceSelectDrag = null;
    distanceLabelDrag = null;
    lineLabelDrag = null;
    distanceCurveDrag = null;
  }
  updateUiHint();
  updateBannerMessage();
  draw();
}

function setAddIntervalMode(enabled) {
  const nextEnabled = Boolean(enabled);
  if (addIntervalMode === nextEnabled) {
    return;
  }
  addIntervalMode = nextEnabled;
  if (addIntervalMode) {
    addIntervalSourceNodeId = null;
    if (distanceSelectMode) {
      setDistanceSelectMode(false);
    }
  }
  updateBannerMessage();
  draw();
}

function syncLayoutAlignButtons() {
  if (layoutAlignXButton) {
    layoutAlignXButton.classList.toggle("is-active", layoutAlignMode === "x");
  }
  if (layoutAlignYButton) {
    layoutAlignYButton.classList.toggle("is-active", layoutAlignMode === "y");
  }
  if (layoutStraightenButton) {
    layoutStraightenButton.classList.toggle("is-active", layoutAlignMode === "straighten");
  }
}

function setLayoutAlignMode(mode, { silent = false } = {}) {
  const nextMode =
    mode === "y" ? "y" : mode === "x" ? "x" : mode === "straighten" ? "straighten" : "";
  if (layoutAlignMode === nextMode) {
    layoutAlignMode = "";
  } else {
    layoutAlignMode = nextMode;
  }
  if (layoutAlignMode) {
    layoutAlignAnchorId = null;
    layoutStraightenAnchorId = null;
    layoutStraightenDir = null;
    if (distanceSelectMode) {
      distanceSelectMode = false;
      distanceSelectDrag = null;
      distanceLabelDrag = null;
      lineLabelDrag = null;
      distanceCurveDrag = null;
    }
    if (analysisLayers.microtonal) {
      analysisLayers.microtonal = false;
      clearMicrotonalModeState();
      syncAnalysisLayerToggles();
    }
  } else {
    layoutAlignAnchorId = null;
    layoutStraightenAnchorId = null;
    layoutStraightenDir = null;
  }
  syncLayoutAlignButtons();
  if (silent) {
    return;
  }
  updateBannerMessage();
  updateUiHint();
  draw();
}

function applyLayoutAlignToNode(target, anchor, axis) {
  if (!target || !anchor || target.id === anchor.id) {
    return;
  }
  const anchorPos = ensureLayoutPosition(anchor);
  const targetPos = ensureLayoutPosition(target);
  const next = { ...targetPos };
  if (axis === "y") {
    next.y = anchorPos.y;
  } else {
    next.x = anchorPos.x;
  }
  layoutPositions.set(target.id, next);
  if (!target.isCustom) {
    const base = getLayoutBaseCoordinate(target);
    layoutPositionOffsets.set(
      `${target.exponentX},${target.exponentY},${target.exponentZ || 0}`,
      {
        x: next.x - base.x,
        y: next.y - base.y,
        z: next.z - base.z,
      }
    );
  }
}

function applyLayoutStraightenToNode(target, anchor, dir) {
  if (!target || !anchor || !dir || target.id === anchor.id) {
    return;
  }
  const anchorPos = ensureLayoutPosition(anchor);
  const targetPos = ensureLayoutPosition(target);
  const dx = targetPos.x - anchorPos.x;
  const dy = targetPos.y - anchorPos.y;
  const t = dx * dir.x + dy * dir.y;
  const next = {
    x: anchorPos.x + dir.x * t,
    y: anchorPos.y + dir.y * t,
    z: targetPos.z,
  };
  layoutPositions.set(target.id, next);
  if (!target.isCustom) {
    const base = getLayoutBaseCoordinate(target);
    layoutPositionOffsets.set(
      `${target.exponentX},${target.exponentY},${target.exponentZ || 0}`,
      {
        x: next.x - base.x,
        y: next.y - base.y,
        z: next.z - base.z,
      }
    );
  }
}

function getDistanceNodeKey(node) {
  if (!node) {
    return "";
  }
  if (node.isCustom) {
    return `custom:${node.id}`;
  }
  return `grid:${node.exponentX},${node.exponentY},${node.exponentZ || 0}`;
}

function getNodeByDistanceKey(key) {
  if (!key) {
    return null;
  }
  if (key.startsWith("custom:")) {
    const id = Number(key.slice(7));
    return nodeById.get(id) || null;
  }
  if (key.startsWith("grid:")) {
    const parts = key.slice(5).split(",");
    if (parts.length < 3) {
      return null;
    }
    const ex = Number(parts[0]);
    const ey = Number(parts[1]);
    const ez = Number(parts[2]);
    const node = nodes.find(
      (item) =>
        !item.isCustom &&
        item.exponentX === ex &&
        item.exponentY === ey &&
        (item.exponentZ || 0) === ez
    );
    return node || null;
  }
  return null;
}

function addDistanceEdgeBetweenNodes(a, b, options = {}) {
  const aKey = getDistanceNodeKey(a);
  const bKey = getDistanceNodeKey(b);
  if (!aKey || !bKey || aKey === bKey) {
    return false;
  }
  const edgeKey = getDistanceEdgeKey(aKey, bKey);
  distanceSelectedEdges.add(edgeKey);
  if (Object.prototype.hasOwnProperty.call(options, "customText")) {
    const customText = String(options.customText || "").trim();
    const existing = getDistanceEdgeOverride(edgeKey) || {};
    distanceEdgeOverrides.set(edgeKey, {
      ...existing,
      customText,
    });
  }
  schedulePresetUrlUpdate();
  return true;
}

let presetEntries = [];
let presetActiveTags = new Set();
let presetSortMode = "default";

function resetDistanceEdges() {
  distanceSelectedEdges.clear();
  distanceSelectedNodeKeys.clear();
  distanceEdgeOverrides.clear();
  schedulePresetUrlUpdate();
  draw();
}

function parsePresetName(name) {
  const nameString = String(name || "").trim();
  const match = nameString.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  return {
    title: match && match[1] ? match[1].trim() : nameString,
    creator: match && match[2] ? match[2].trim() : "",
  };
}

function normalizePresetEntry(entry) {
  if (Array.isArray(entry)) {
    const [name, uri] = entry;
    const parsed = parsePresetName(name);
    return {
      title: parsed.title,
      creator: parsed.creator,
      uri: String(uri || ""),
      tags: [],
    };
  }
  if (entry && typeof entry === "object") {
    const title = String(entry.title || "").trim();
    const creator = String(entry.creator || "").trim();
    const uri = String(entry.uri || "").trim();
    const tags = Array.isArray(entry.tags)
      ? entry.tags.map((tag) => String(tag || "").trim()).filter(Boolean)
      : [];
    if (!title && !creator && !uri) {
      return null;
    }
    return { title, creator, uri, tags };
  }
  return null;
}

function buildPresetHref(uriString) {
  const uriValue = String(uriString || "");
  if (uriValue.startsWith("http://") || uriValue.startsWith("https://")) {
    try {
      const parsed = new URL(uriValue);
      if (parsed.hash) {
        return `${window.location.origin}${window.location.pathname}${parsed.hash}`;
      }
      return `${window.location.origin}${parsed.pathname}${parsed.search}`;
    } catch (error) {
      return uriValue;
    }
  }
  if (uriValue.startsWith("#")) {
    return `${window.location.origin}${window.location.pathname}${uriValue}`;
  }
  if (uriValue.startsWith("/")) {
    return `${window.location.origin}${uriValue}`;
  }
  return `${window.location.origin}/${uriValue}`;
}

function renderPresetTags() {}

function renderPresetList() {
  if (!presetList) {
    return;
  }
  presetList.innerHTML = "";
  const searchTerm = presetSearchInput
    ? presetSearchInput.value.trim().toLowerCase()
    : "";
  const selectedTags = presetActiveTags.size ? Array.from(presetActiveTags) : null;
  const filtered = presetEntries.filter((entry) => {
    if (selectedTags && selectedTags.length) {
      const hasTag = entry.tags.some((tag) => selectedTags.includes(tag));
      if (!hasTag) {
        return false;
      }
    }
    if (!searchTerm) {
      return true;
    }
    return entry.searchText.includes(searchTerm);
  });
  if (presetSortMode === "default") {
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "preset-empty";
      empty.textContent = presetEntries.length ? "No presets match." : "No presets yet.";
      presetList.appendChild(empty);
      return;
    }
    filtered.forEach((entry) => {
      const link = document.createElement("a");
      link.className = "preset-card";
      link.href = buildPresetHref(entry.uri);
      link.target = "_self";
      link.rel = "noopener";
      bindOptionalClick(link, () => {
        closePresetOverlay();
      });
      const title = document.createElement("div");
      title.className = "preset-card-title";
      title.textContent = entry.title || "Untitled preset";
      link.appendChild(title);
      if (entry.creator) {
        const creator = document.createElement("div");
        creator.className = "preset-card-creator";
        creator.textContent = entry.creator;
        link.appendChild(creator);
      }
      if (entry.tags.length) {
        const tags = document.createElement("div");
        tags.className = "preset-card-tags";
        entry.tags.forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "preset-card-tag";
          chip.textContent = tag;
          tags.appendChild(chip);
        });
        link.appendChild(tags);
      }
      presetList.appendChild(link);
    });
    return;
  }
  const sorted = [...filtered].sort((a, b) => {
    if (presetSortMode === "creator") {
      const creatorA = (a.creator || "").toLowerCase();
      const creatorB = (b.creator || "").toLowerCase();
      if (creatorA !== creatorB) {
        return creatorA.localeCompare(creatorB);
      }
    }
    const titleA = (a.title || "").toLowerCase();
    const titleB = (b.title || "").toLowerCase();
    const titleCompare = titleA.localeCompare(titleB);
    if (titleCompare !== 0) {
      return titleCompare;
    }
    return (a.creator || "").toLowerCase().localeCompare((b.creator || "").toLowerCase());
  });
  if (!sorted.length) {
    const empty = document.createElement("div");
    empty.className = "preset-empty";
    empty.textContent = presetEntries.length ? "No presets match." : "No presets yet.";
    presetList.appendChild(empty);
    return;
  }
  sorted.forEach((entry) => {
    const link = document.createElement("a");
    link.className = "preset-card";
    link.href = buildPresetHref(entry.uri);
    link.target = "_self";
    link.rel = "noopener";
    bindOptionalClick(link, () => {
      closePresetOverlay();
    });
    const title = document.createElement("div");
    title.className = "preset-card-title";
    title.textContent = entry.title || "Untitled preset";
    link.appendChild(title);
    if (entry.creator) {
      const creator = document.createElement("div");
      creator.className = "preset-card-creator";
      creator.textContent = entry.creator;
      link.appendChild(creator);
    }
    if (entry.tags.length) {
      const tags = document.createElement("div");
      tags.className = "preset-card-tags";
      entry.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "preset-card-tag";
        chip.textContent = tag;
        tags.appendChild(chip);
      });
      link.appendChild(tags);
    }
    presetList.appendChild(link);
  });
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
    presetEntries = data
      .map((entry) => normalizePresetEntry(entry))
      .filter(Boolean)
      .map((entry) => ({
        ...entry,
        searchText: `${entry.title} ${entry.creator} ${entry.tags.join(" ")}`
          .toLowerCase()
          .trim(),
      }));
    renderPresetTags();
    renderPresetList();
  } catch (error) {
    const errorItem = document.createElement("div");
    errorItem.className = "preset-empty";
    errorItem.textContent = "Failed to load presets.";
    presetList.appendChild(errorItem);
    console.warn(error);
  }
}

async function loadCommas() {
  commaEntries = [];
  commaRatioMap.clear();
  const seenCommaEntries = new Set();
  try {
    const response = await fetch(new URL("./interval-names.json", import.meta.url));
    if (!response.ok) {
      throw new Error(`Comma fetch failed: ${response.status}`);
    }
    const data = await response.json();
    const entries = Array.isArray(data)
      ? data
      : Array.isArray(data && data.intervals)
      ? data.intervals
      : [];
    entries.forEach((entry) => {
      if (!entry) {
        return;
      }
      const name = String(entry.name || "").trim();
      const numerator = Number(entry.numerator);
      const denominator = Number(entry.denominator);
      if (!name || !Number.isFinite(numerator) || !Number.isFinite(denominator)) {
        return;
      }
      const normalizedRatio = normalizeCommaRatio(numerator, denominator);
      if (!normalizedRatio) {
        return;
      }
      const key = `${normalizedRatio.numerator}:${normalizedRatio.denominator}`;
      const normalized = {
        name,
        numerator: normalizedRatio.numerator,
        denominator: normalizedRatio.denominator,
        color: entry.color || themeColors?.edge || "#999999",
      };
      const normalizedNameKey = name.toLowerCase().replace(/\s+/g, " ").trim();
      const uniqueKey = `${key}|${normalizedNameKey}`;
      if (seenCommaEntries.has(uniqueKey)) {
        return;
      }
      seenCommaEntries.add(uniqueKey);
      commaEntries.push(normalized);
      if (!commaRatioMap.has(key)) {
        commaRatioMap.set(key, []);
      }
      commaRatioMap.get(key).push(normalized);
    });
  } catch (error) {
    console.warn("Failed to load commas", error);
  }
  populateAddIntervalOptions();
}

async function loadIntervalChartEntries() {
  if (intervalChartLoaded) {
    return;
  }
  intervalChartEntries = [];
  intervalChartTypes = [];
  intervalChartSelectedTypes = new Set();
  try {
    const entries = Array.isArray(intervalChartData) ? intervalChartData : [];
    entries.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      const numerator = Number(entry.numerator);
      const denominator = Number(entry.denominator);
      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || !denominator) {
        return;
      }
      intervalChartEntries.push({
        numerator,
        denominator,
        name: String(entry.name || "").trim(),
        type: String(entry.type || "unknown").trim() || "unknown",
        description: String(entry.description || "").trim(),
        source: String(entry.source || "").trim(),
      });
    });
    intervalChartEntries.sort(
      (a, b) => a.numerator / a.denominator - b.numerator / b.denominator
    );
    const typeSet = new Set(intervalChartEntries.map((entry) => entry.type));
    intervalChartTypes = Array.from(typeSet).sort((a, b) => a.localeCompare(b));
    intervalChartTypes.forEach((type) => intervalChartSelectedTypes.add(type));
    intervalChartLoaded = true;
  } catch (error) {
    console.warn("Failed to load interval chart entries", error);
  }
  renderIntervalChartTypes();
  renderIntervalChartTable();
}

function formatIntervalChartCents(numerator, denominator) {
  const ratio = numerator / denominator;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return "";
  }
  const cents = 1200 * Math.log2(ratio);
  if (!Number.isFinite(cents)) {
    return "";
  }
  return cents.toFixed(4);
}

function getIntervalChartDisplayRatio(entry) {
  if (!entry) {
    return { numerator: 0, denominator: 0, ratio: NaN };
  }
  if (intervalChartDirection === "below") {
    return {
      numerator: entry.denominator,
      denominator: entry.numerator,
      ratio: entry.denominator / entry.numerator,
    };
  }
  return {
    numerator: entry.numerator,
    denominator: entry.denominator,
    ratio: entry.numerator / entry.denominator,
  };
}

function formatIntervalChartDisplayCents(entry) {
  const display = getIntervalChartDisplayRatio(entry);
  if (!Number.isFinite(display.ratio) || display.ratio <= 0) {
    return "";
  }
  const cents = 1200 * Math.log2(display.ratio);
  if (!Number.isFinite(cents)) {
    return "";
  }
  return cents.toFixed(4);
}

function formatIntervalChartPrimeFactors(entry) {
  const display = getIntervalChartDisplayRatio(entry);
  if (!Number.isFinite(display.numerator) || !Number.isFinite(display.denominator)) {
    return { primes: "", factors: "" };
  }
  const map = factorizeRatio(display.numerator, display.denominator);
  const primes = Array.from(map.entries())
    .filter(([, exp]) => exp !== 0)
    .map(([prime]) => Number(prime))
    .sort((a, b) => a - b);
  const primeList = primes.join(", ");
  const factorList = primes
    .map((prime) => {
      const exp = map.get(prime) || 0;
      if (exp === 1) {
        return String(prime);
      }
      return `${prime}^${exp}`;
    })
    .join(" ");
  return { primes: primeList, factors: factorList };
}

function isSuperparticularRatio(entry) {
  if (!entry) {
    return false;
  }
  const num = Number(entry.numerator);
  const den = Number(entry.denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
    return false;
  }
  return Math.abs(num - den) === 1;
}

function intervalChartMatchesSearch(entry) {
  if (!intervalChartSearch) {
    return !intervalChartSuperparticularOnly || isSuperparticularRatio(entry);
  }
  if (intervalChartSuperparticularOnly && !isSuperparticularRatio(entry)) {
    return false;
  }
  const query = intervalChartSearch.toLowerCase();
  const display = getIntervalChartDisplayRatio(entry);
  const ratioText = `${display.numerator}:${display.denominator}`;
  const centsText = formatIntervalChartDisplayCents(entry);
  const factorsText = formatIntervalChartPrimeFactors(entry);
  const haystack = [
    ratioText,
    centsText,
    factorsText.primes,
    factorsText.factors,
    entry.name,
    entry.type,
    entry.description,
    entry.source,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function renderIntervalChartTypes() {
  if (!intervalChartTypeList) {
    return;
  }
  intervalChartTypeList.innerHTML = "";
  if (!intervalChartTypes.length) {
    return;
  }
  const priority = [
    "half-step",
    "semitone",
    "second",
    "whole tone",
    "third",
    "fourth",
    "tritone",
    "fifth",
    "sixth",
    "seventh",
  ];
  const available = new Set(intervalChartTypes);
  const primary = priority.filter((type) => available.has(type));
  const secondary = intervalChartTypes
    .filter((type) => !priority.includes(type))
    .sort((a, b) => a.localeCompare(b));
  const fragment = document.createDocumentFragment();
  const addTypeRow = (type, container) => {
    const id = `interval-chart-type-${type.replace(/\s+/g, "-")}`;
    const wrapper = document.createElement("label");
    wrapper.className = "interval-chart-type is-child";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.checked = intervalChartSelectedTypes.has(type);
    bindOptionalChange(input, () => {
      if (input.checked) {
        intervalChartSelectedTypes.add(type);
      } else {
        intervalChartSelectedTypes.delete(type);
      }
      renderIntervalChartTypes();
      renderIntervalChartTable();
    });
    const text = document.createElement("span");
    text.textContent = type;
    wrapper.appendChild(input);
    wrapper.appendChild(text);
    container.appendChild(wrapper);
  };
  const makeGroup = (title, types, sizeClass = "") => {
    const group = document.createElement("div");
    group.className = "interval-chart-type-group";
    const header = document.createElement("label");
    header.className = `interval-chart-type-group-title ${sizeClass}`.trim();
    const input = document.createElement("input");
    input.type = "checkbox";
    const selectedCount = types.filter((type) => intervalChartSelectedTypes.has(type))
      .length;
    input.checked = selectedCount === types.length && types.length > 0;
    input.indeterminate = selectedCount > 0 && selectedCount < types.length;
    bindOptionalChange(input, () => {
      if (input.checked) {
        types.forEach((type) => intervalChartSelectedTypes.add(type));
      } else {
        types.forEach((type) => intervalChartSelectedTypes.delete(type));
      }
      renderIntervalChartTypes();
      renderIntervalChartTable();
    });
    const text = document.createElement("span");
    text.textContent = title;
    header.appendChild(input);
    header.appendChild(text);
    group.appendChild(header);
    types.forEach((type) => addTypeRow(type, group));
    return group;
  };
  fragment.appendChild(makeGroup("Steps", primary));
  if (secondary.length) {
    fragment.appendChild(makeGroup("Other", secondary));
  }
  intervalChartTypeList.appendChild(fragment);
}

function renderIntervalChartTable() {
  if (!intervalChartTableBody) {
    return;
  }
  intervalChartTableBody.innerHTML = "";
  intervalChartRowMap.clear();
  if (!intervalChartEntries.length) {
    return;
  }
  const fragment = document.createDocumentFragment();
  intervalChartEntries.forEach((entry) => {
    if (!intervalChartSelectedTypes.has(entry.type)) {
      return;
    }
    if (!intervalChartMatchesSearch(entry)) {
      return;
    }
    const key = `${entry.numerator}:${entry.denominator}`;
    const tr = document.createElement("tr");
    tr.dataset.intervalKey = key;
    if (intervalChartSelectedKey === key) {
      tr.classList.add("interval-chart-row-selected");
    }
    bindOptionalClick(tr, () => {
      intervalChartSelectedKey = key;
      if (intervalChartListenEnabled) {
        const active = intervalChartActive.get(key);
        if (active && active.voices.length) {
          active.voices.forEach((voice) => stopVoice(voice));
        } else {
          intervalChartActive.forEach((entry) => {
            entry.voices.forEach((voice) => stopVoice(voice));
          });
          intervalChartActive.clear();
          const baseFreq = getIntervalChartBaseFrequency();
          const ratio = entry.numerator / entry.denominator;
          if (Number.isFinite(baseFreq) && Number.isFinite(ratio) && ratio > 0) {
            enableAudio();
            const fundamentalVoice = startVoice({
              freq: baseFreq,
              nodeId: null,
              octave: 0,
              source: "interval-chart",
            });
            const ratioVoice = startVoice({
              freq: baseFreq * ratio,
              nodeId: null,
              octave: 0,
              source: "interval-chart",
            });
            const voices = [fundamentalVoice, ratioVoice].filter(Boolean);
            if (voices.length) {
              intervalChartActive.set(key, { voices });
              ensureIntervalChartLoop();
            }
          }
        }
      }
      renderIntervalChartTable();
    });
    const display = getIntervalChartDisplayRatio(entry);
    const ratioCell = document.createElement("td");
    ratioCell.textContent = `${display.numerator}:${display.denominator}`;
    const centsCell = document.createElement("td");
    centsCell.textContent = formatIntervalChartDisplayCents(entry);
    const nameCell = document.createElement("td");
    nameCell.textContent = entry.name;
    const typeCell = document.createElement("td");
    typeCell.textContent = entry.type;
    const factorCell = document.createElement("td");
    const factorInfo = formatIntervalChartPrimeFactors(entry);
    const primeLine = document.createElement("div");
    primeLine.className = "interval-chart-factor-line";
    primeLine.textContent = factorInfo.primes || "";
    if (factorInfo.factors) {
      primeLine.title = factorInfo.factors;
    }
    factorCell.appendChild(primeLine);
    const descCell = document.createElement("td");
    descCell.textContent = entry.description;
    const sourceCell = document.createElement("td");
    sourceCell.textContent = entry.source;
    tr.appendChild(ratioCell);
    tr.appendChild(centsCell);
    tr.appendChild(nameCell);
    tr.appendChild(typeCell);
    tr.appendChild(factorCell);
    tr.appendChild(descCell);
    tr.appendChild(sourceCell);
    fragment.appendChild(tr);
    intervalChartRowMap.set(key, tr);
  });
  intervalChartTableBody.appendChild(fragment);
}

function openIntervalChart() {
  if (!intervalChartOverlay) {
    return;
  }
  closeCalculatePanel();
  intervalChartOverlay.hidden = false;
  document.body.classList.add("interval-chart-open");
  if (intervalChartSearchInput) {
    intervalChartSearchInput.value = intervalChartSearch;
  }
  if (intervalChartSuperparticularToggle) {
    setControlChecked(
      intervalChartSuperparticularToggle,
      intervalChartSuperparticularOnly
    );
  }
  syncIntervalChartCustomState();
  if (intervalChartDirectionSelect) {
    intervalChartDirectionSelect.value = intervalChartDirection || "above";
    intervalChartDirection = intervalChartDirectionSelect.value || "above";
  }
  if (intervalChartSourceRatio) {
    const sourceNode = addIntervalSourceNodeId
      ? nodeById.get(addIntervalSourceNodeId)
      : null;
    intervalChartSourceRatio.textContent = sourceNode
      ? `${sourceNode.numerator}:${sourceNode.denominator}`
      : "1:1";
  }
  if (intervalChartSearchInput) {
    intervalChartSearchInput.focus();
  } else if (intervalChartCloseButton) {
    intervalChartCloseButton.focus();
  }
  loadIntervalChartEntries();
}

function closeIntervalChart() {
  if (!intervalChartOverlay) {
    return;
  }
  stopIntervalChartVoices();
  if (intervalChartCustomInput) {
    intervalChartCustomInput.value = "";
  }
  if (intervalChartCustomTextInput) {
    intervalChartCustomTextInput.value = "";
  }
  syncIntervalChartCustomState();
  if (addIntervalMode) {
    addIntervalSourceNodeId = null;
    setAddIntervalMode(false);
  }
  intervalChartOverlay.hidden = true;
  document.body.classList.remove("interval-chart-open");
}

function updateIntervalChartIfOpen() {
  if (intervalChartOverlay && !intervalChartOverlay.hidden) {
    renderIntervalChartTable();
  }
}

function stopIntervalChartVoices() {
  if (intervalChartActive.size) {
    intervalChartActive.forEach((entry) => {
      entry.voices.forEach((voice) => stopVoice(voice));
    });
    intervalChartActive.clear();
  }
  voices.forEach((voice) => {
    if (voice.source === "interval-chart") {
      stopVoice(voice);
    }
  });
}

function isCustomRatioActive() {
  const value = intervalChartCustomInput ? intervalChartCustomInput.value.trim() : "";
  return value.length > 0;
}

function getIntervalChartBaseFrequency() {
  if (addIntervalSourceNodeId) {
    const sourceNode = nodeById.get(addIntervalSourceNodeId);
    const freq = sourceNode ? Number(sourceNode.freq) : NaN;
    if (Number.isFinite(freq)) {
      return freq;
    }
  }
  return Number(fundamentalInput.value) || 220;
}

function syncIntervalChartCustomState() {
  if (!intervalChartCustomActive || !intervalChartOverlay) {
    return;
  }
  const active = isCustomRatioActive();
  intervalChartCustomActive.hidden = !active;
  const table = intervalChartOverlay.querySelector(".interval-chart-table");
  if (table) {
    table.classList.toggle("is-disabled", active);
  }
  if (active) {
    intervalChartSelectedKey = null;
    renderIntervalChartTable();
  }
}

function getIntervalChartSelectedRatio() {
  if (!intervalChartSelectedKey) {
    return null;
  }
  const [num, den] = intervalChartSelectedKey.split(":").map(Number);
  if (!Number.isFinite(num) || !Number.isFinite(den)) {
    return null;
  }
  return { numerator: num, denominator: den };
}

function applyIntervalChartSelection() {
  let ratio = null;
  if (isCustomRatioActive()) {
    ratio = parseRatioInput(intervalChartCustomInput.value);
    if (!ratio) {
      alert("Please enter a ratio like 81:80 or 81/80.");
      return;
    }
  } else {
    ratio = getIntervalChartSelectedRatio();
    if (!ratio) {
      return;
    }
  }
  if (!addIntervalSourceNodeId) {
    alert("Select a starting node with I-click or Add Interval.");
    return;
  }
  const sourceNode = nodeById.get(addIntervalSourceNodeId);
  if (!sourceNode) {
    alert("Please select a starting node.");
    return;
  }
  const customText = intervalChartCustomTextInput
    ? intervalChartCustomTextInput.value.trim()
    : "";
  const directionValue = intervalChartDirectionSelect
    ? intervalChartDirectionSelect.value
    : "above";
  if (!applyAddIntervalFromSource(sourceNode, ratio, directionValue, customText)) {
    alert("Unable to place that interval on the current lattice.");
    return;
  }
  stopIntervalChartVoices();
  addIntervalSourceNodeId = null;
  setAddIntervalMode(false);
  closeIntervalChart();
}

function ensureIntervalChartLoop() {
  if (intervalChartAnimating) {
    return;
  }
  intervalChartAnimating = true;
  requestAnimationFrame(intervalChartPlaybackLoop);
}

function intervalChartPlaybackLoop() {
  if (!intervalChartActive.size) {
    intervalChartAnimating = false;
    return;
  }
  const nowMs = performance.now();
  const nowSec = audioCtx ? audioCtx.currentTime : nowMs / 1000;
  intervalChartActive.forEach((entry, key) => {
    let amplitude = 0;
    const remaining = [];
    entry.voices.forEach((voice) => {
      if (!voice) {
        return;
      }
      const amp = getVoiceAmplitude(voice, nowSec, nowMs);
      amplitude += amp;
      const releaseEnd =
        voice.releaseStartSec != null && voice.releaseDurationSec != null
          ? voice.releaseStartSec + voice.releaseDurationSec
          : null;
      if (releaseEnd == null || nowSec < releaseEnd || amp > 0.0001) {
        remaining.push(voice);
      }
    });
    entry.voices = remaining;
    const row = intervalChartRowMap.get(key);
    if (row) {
      if (amplitude > 0.0001) {
        row.style.backgroundColor = colorWithAlpha(
          themeColors?.playFill || "#ffe36b",
          Math.min(1, amplitude)
        );
      } else {
        row.style.backgroundColor = "";
      }
    }
    if (!entry.voices.length) {
      intervalChartActive.delete(key);
    }
  });
  requestAnimationFrame(intervalChartPlaybackLoop);
}

const PRESET_PARAM = "s";
let presetSyncEnabled = false;
let presetUpdateTimer = null;
let fileShareTimer = null;
let presetStateDefaults = null;
let ratioWheelHoverIndex = null;
let ratioWheelHoverNodeId = null;

function lzCompressToEncodedURIComponent(input) {
  if (input == null) {
    return "";
  }
  return lzCompress(input, 6, (a) =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".charAt(a)
  );
}

function lzDecompressFromEncodedURIComponent(input) {
  if (input == null || input === "") {
    return "";
  }
  return lzDecompress(input, 32, (index) =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".indexOf(input.charAt(index))
  );
}

function lzCompress(uncompressed, bitsPerChar, getCharFromInt) {
  if (uncompressed == null) {
    return "";
  }
  let i;
  let value;
  const contextDictionary = new Map();
  const contextDictionaryToCreate = new Set();
  let contextC = "";
  let contextW = "";
  let contextWC = "";
  let contextEnlargeIn = 2;
  let contextDictSize = 3;
  let contextNumBits = 2;
  let contextData = [];
  let contextDataVal = 0;
  let contextDataPosition = 0;

  const contextAppendBits = (numBits, dataVal) => {
    for (let j = 0; j < numBits; j += 1) {
      contextDataVal = (contextDataVal << 1) | (dataVal & 1);
      if (contextDataPosition === bitsPerChar - 1) {
        contextDataPosition = 0;
        contextData.push(getCharFromInt(contextDataVal));
        contextDataVal = 0;
      } else {
        contextDataPosition += 1;
      }
      dataVal >>= 1;
    }
  };

  for (i = 0; i < uncompressed.length; i += 1) {
    contextC = uncompressed.charAt(i);
    if (!contextDictionary.has(contextC)) {
      contextDictionary.set(contextC, contextDictSize++);
      contextDictionaryToCreate.add(contextC);
    }

    contextWC = contextW + contextC;
    if (contextDictionary.has(contextWC)) {
      contextW = contextWC;
    } else {
      if (contextDictionaryToCreate.has(contextW)) {
        if (contextW.charCodeAt(0) < 256) {
          contextAppendBits(contextNumBits, 0);
          contextAppendBits(8, contextW.charCodeAt(0));
        } else {
          contextAppendBits(contextNumBits, 1);
          contextAppendBits(16, contextW.charCodeAt(0));
        }
        contextEnlargeIn -= 1;
        if (contextEnlargeIn === 0) {
          contextEnlargeIn = 2 ** contextNumBits;
          contextNumBits += 1;
        }
        contextDictionaryToCreate.delete(contextW);
      } else {
        value = contextDictionary.get(contextW);
        contextAppendBits(contextNumBits, value);
      }
      contextEnlargeIn -= 1;
      if (contextEnlargeIn === 0) {
        contextEnlargeIn = 2 ** contextNumBits;
        contextNumBits += 1;
      }
      contextDictionary.set(contextWC, contextDictSize++);
      contextW = String(contextC);
    }
  }

  if (contextW !== "") {
    if (contextDictionaryToCreate.has(contextW)) {
      if (contextW.charCodeAt(0) < 256) {
        contextAppendBits(contextNumBits, 0);
        contextAppendBits(8, contextW.charCodeAt(0));
      } else {
        contextAppendBits(contextNumBits, 1);
        contextAppendBits(16, contextW.charCodeAt(0));
      }
      contextEnlargeIn -= 1;
      if (contextEnlargeIn === 0) {
        contextEnlargeIn = 2 ** contextNumBits;
        contextNumBits += 1;
      }
      contextDictionaryToCreate.delete(contextW);
    } else {
      value = contextDictionary.get(contextW);
      contextAppendBits(contextNumBits, value);
    }
    contextEnlargeIn -= 1;
    if (contextEnlargeIn === 0) {
      contextEnlargeIn = 2 ** contextNumBits;
      contextNumBits += 1;
    }
  }

  contextAppendBits(contextNumBits, 2);

  while (true) {
    contextDataVal <<= 1;
    if (contextDataPosition === bitsPerChar - 1) {
      contextData.push(getCharFromInt(contextDataVal));
      break;
    } else {
      contextDataPosition += 1;
    }
  }
  return contextData.join("");
}

function lzDecompress(compressed, bitsPerChar, getNextValue) {
  if (compressed == null) {
    return "";
  }
  if (compressed === "") {
    return null;
  }
  const dictionary = [];
  let enlargeIn = 4;
  let dictSize = 4;
  let numBits = 3;
  let entry = "";
  let result = [];
  let i;
  let w;
  let bits;
  let resb;
  let maxpower;
  let power;
  let c;

  const data = {
    value: getNextValue(0),
    position: bitsPerChar,
    index: 1,
  };

  const dataReadBits = (nBits) => {
    let bitsVal = 0;
    let maxPower = 2 ** nBits;
    let powerVal = 1;
    while (powerVal !== maxPower) {
      resb = data.value & data.position;
      data.position >>= 1;
      if (data.position === 0) {
        data.position = bitsPerChar;
        data.value = getNextValue(data.index++);
      }
      bitsVal |= (resb > 0 ? 1 : 0) * powerVal;
      powerVal <<= 1;
    }
    return bitsVal;
  };

  for (i = 0; i < 3; i += 1) {
    dictionary[i] = i;
  }

  bits = dataReadBits(2);
  switch (bits) {
    case 0:
      c = String.fromCharCode(dataReadBits(8));
      break;
    case 1:
      c = String.fromCharCode(dataReadBits(16));
      break;
    default:
      return "";
  }
  dictionary[3] = c;
  w = c;
  result.push(c);

  while (true) {
    if (data.index > compressed.length) {
      return "";
    }
    bits = dataReadBits(numBits);
    switch (bits) {
      case 0:
        c = String.fromCharCode(dataReadBits(8));
        dictionary[dictSize++] = c;
        bits = dictSize - 1;
        enlargeIn -= 1;
        break;
      case 1:
        c = String.fromCharCode(dataReadBits(16));
        dictionary[dictSize++] = c;
        bits = dictSize - 1;
        enlargeIn -= 1;
        break;
      case 2:
        return result.join("");
      default:
        break;
    }

    if (enlargeIn === 0) {
      enlargeIn = 2 ** numBits;
      numBits += 1;
    }

    if (dictionary[bits]) {
      entry = dictionary[bits];
    } else if (bits === dictSize) {
      entry = w + w.charAt(0);
    } else {
      return null;
    }
    result.push(entry);

    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn -= 1;
    w = entry;

    if (enlargeIn === 0) {
      enlargeIn = 2 ** numBits;
      numBits += 1;
    }
  }
}

// Preset Encode/Decode
function encodePresetState(state) {
  const json = JSON.stringify(state);
  const compressed = lzCompressToEncodedURIComponent(json);
  if (compressed) {
    return `lz:${compressed.replace(/\+/g, ".")}`;
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodePresetState(encoded) {
  if (typeof encoded !== "string") {
    return null;
  }
  if (encoded.startsWith("lz:")) {
    const payload = encoded.slice(3).replace(/ /g, "+").replace(/\./g, "+");
    const json = lzDecompressFromEncodedURIComponent(payload);
    if (!json) {
      return null;
    }
    return JSON.parse(json);
  }
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

function getJsonByteSize(value) {
  try {
    const text = JSON.stringify(value);
    return new TextEncoder().encode(text).length;
  } catch (error) {
    return 0;
  }
}

function logPresetSizeBreakdown(state, encodedLength) {
  try {
    if (!state || typeof state !== "object") {
      return;
    }
    const totalBytes = getJsonByteSize(state);
    const topLevel = Object.entries(state).map(([key, value]) => ({
      key,
      bytes: getJsonByteSize(value),
    }));
    topLevel.sort((a, b) => b.bytes - a.bytes);
    console.group("Preset size breakdown");
    console.log(
      `Encoded length: ${encodedLength} chars, JSON size: ${totalBytes} bytes`
    );
    console.table(topLevel);
    if (state.layout && typeof state.layout === "object") {
      const layoutEntries = Object.entries(state.layout).map(([key, value]) => ({
        key,
        bytes: getJsonByteSize(value),
      }));
      layoutEntries.sort((a, b) => b.bytes - a.bytes);
      console.table(layoutEntries);
    }
    console.groupEnd();
  } catch (error) {
    console.warn("Preset size breakdown failed", error);
  }
}

// Preset File I/O
async function downloadLatticeState() {
  const state = getPresetState();
  const json = JSON.stringify(state, null, 2);
  const title = layoutTitle ? String(layoutTitle).trim() : "";
  const creator = layoutCreator ? String(layoutCreator).trim() : "";
  const safeTitle = title || "Title";
  const safeCreator = creator || "Creator";
  const suggestedName = `${safeTitle} - ${safeCreator} [tuninglattice.com].json`;
  try {
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      closeFilePanel();
      return;
    }
  } catch (error) {
    console.warn("Save dialog failed", error);
  }
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  closeFilePanel();
}

// Preset Serialization
function serializePresetLineLabelState() {
  const lineLabelOverridesState = Array.from(lineLabelOverrides.entries()).map(
    ([key, value]) => [key, Boolean(value)]
  );
  const lineLabelPositionsState = Array.from(lineLabelPositionOverrides.entries())
    .filter(([, value]) => Number.isFinite(value))
    .map(([key, value]) => [key, Number(value)]);
  return { lineLabelOverridesState, lineLabelPositionsState };
}

// Preset Parsing Helpers
function forEachNormalizedPresetEntry(entries, normalizeEntry, onEntry) {
  if (!Array.isArray(entries)) {
    return;
  }
  entries.forEach((entry) => {
    const normalized = normalizeEntry(entry);
    if (normalized != null) {
      onEntry(normalized);
    }
  });
}

function parsePresetTupleEntry(entry, { minLength = 2, keyIndex = 0, valueIndex = 1 } = {}) {
  if (!Array.isArray(entry) || entry.length < minLength) {
    return null;
  }
  return {
    key: entry[keyIndex],
    value: entry[valueIndex],
  };
}

function normalizePresetLineLabelOverrideEntry(entry) {
  const tuple = parsePresetTupleEntry(entry);
  if (!tuple) {
    return null;
  }
  const key = String(tuple.key || "");
  if (!key) {
    return null;
  }
  return [key, Boolean(tuple.value)];
}

function normalizePresetLineLabelPositionEntry(entry) {
  const tuple = parsePresetTupleEntry(entry);
  if (!tuple) {
    return null;
  }
  const key = String(tuple.key || "");
  const value = Number(tuple.value);
  if (!key || !Number.isFinite(value)) {
    return null;
  }
  return [key, Math.max(0, Math.min(1, value))];
}

function normalizeDistanceEdgeOverrideEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const key = String(entry.key || "");
  if (!key) {
    return null;
  }
  const value = {};
  if (Number.isFinite(entry.labelT)) {
    value.labelT = entry.labelT;
  }
  if (entry.controlOffset && Number.isFinite(entry.controlOffset.x)) {
    value.controlOffset = {
      x: Number(entry.controlOffset.x) || 0,
      y: Number(entry.controlOffset.y) || 0,
    };
  }
  if (typeof entry.showName === "boolean") {
    value.showName = entry.showName;
  }
  if (typeof entry.customText === "string" && entry.customText.trim()) {
    value.customText = entry.customText.trim();
  }
  return { key, value };
}

function normalizePresetSpellingEntry(entry) {
  const tuple = parsePresetTupleEntry(entry);
  if (!tuple) {
    return null;
  }
  const nodeId = tuple.key;
  const spelling = tuple.value;
  if (spelling === "flat") {
    return [nodeId, "upper"];
  }
  if (spelling === "lower" || spelling === "upper") {
    return [nodeId, spelling];
  }
  return null;
}

function normalizePresetOctaveOffsetEntry(entry) {
  const tuple = parsePresetTupleEntry(entry);
  if (!tuple) {
    return null;
  }
  const key = String(tuple.key);
  const shift = Number(tuple.value);
  if (!Number.isFinite(shift) || shift === 0) {
    return null;
  }
  return [key, Math.trunc(shift)];
}

function normalizePresetNodeVolumeEntry(entry) {
  const tuple = parsePresetTupleEntry(entry);
  if (!tuple) {
    return null;
  }
  const key = String(tuple.key || "");
  if (!key) {
    return null;
  }
  const value = clampNodeVolume(Number(tuple.value));
  if (Math.abs(value - 1) < 1e-6) {
    return null;
  }
  return [key, value];
}

function normalizePresetTrianglePosition(entry, targetCenterZ, targetDepth) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const plane = entry.plane;
  if (plane !== "xy" && plane !== "xz" && plane !== "yz") {
    return null;
  }
  const x = Number(entry.x);
  const y = Number(entry.y);
  const expZ = Number(entry.expZ);
  const z = Number.isFinite(expZ)
    ? targetCenterZ - expZ
    : Number(entry.z);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null;
  }
  if (z < 0 || z >= targetDepth) {
    return null;
  }
  return { plane, x, y, z };
}

function applyPresetLineLabelState(overridesState, positionsState) {
  lineLabelOverrides.clear();
  lineLabelPositionOverrides.clear();
  forEachNormalizedPresetEntry(
    overridesState,
    normalizePresetLineLabelOverrideEntry,
    (normalized) => {
      lineLabelOverrides.set(normalized[0], normalized[1]);
    }
  );
  forEachNormalizedPresetEntry(
    positionsState,
    normalizePresetLineLabelPositionEntry,
    (normalized) => {
      lineLabelPositionOverrides.set(normalized[0], normalized[1]);
    }
  );
}

function serializePresetDistanceState() {
  const distanceEdgesState = Array.from(distanceSelectedEdges.values());
  const distanceOverridesState = Array.from(distanceEdgeOverrides.entries())
    .map(([key, value]) => {
      if (!value || typeof value !== "object") {
        return null;
      }
      const entry = { key };
      if (Number.isFinite(value.labelT)) {
        entry.labelT = value.labelT;
      }
      if (value.controlOffset && Number.isFinite(value.controlOffset.x)) {
        entry.controlOffset = {
          x: Number(value.controlOffset.x) || 0,
          y: Number(value.controlOffset.y) || 0,
        };
      }
      if (typeof value.showName === "boolean") {
        entry.showName = value.showName;
      }
      if (typeof value.customText === "string" && value.customText.trim()) {
        entry.customText = value.customText.trim();
      }
      return entry;
    })
    .filter(Boolean);
  return { distanceEdgesState, distanceOverridesState };
}

function getPresetLayoutViewState() {
  return layoutLockPosition && !layoutMode
    ? layoutView
    : {
        zoom: view.zoom,
        offsetX: view.offsetX,
        offsetY: view.offsetY,
        rotX: view.rotX,
        rotY: view.rotY,
      };
}

function getPresetLayoutSourceViewState() {
  return layoutSourceView &&
    Number.isFinite(layoutSourceView.zoom) &&
    Number.isFinite(layoutSourceView.offsetX) &&
    Number.isFinite(layoutSourceView.offsetY) &&
    Number.isFinite(layoutSourceView.rotX) &&
    Number.isFinite(layoutSourceView.rotY)
    ? {
        zoom: layoutSourceView.zoom,
        offsetX: layoutSourceView.offsetX,
        offsetY: layoutSourceView.offsetY,
        rotX: layoutSourceView.rotX,
        rotY: layoutSourceView.rotY,
      }
    : null;
}

const PRESET_LAYOUT_DEFAULT_VALUE_KEYS = [
  ["titleSize", () => LAYOUT_DEFAULTS.titleSize],
  ["creatorSize", () => LAYOUT_DEFAULTS.creatorSize],
  ["nodeSize", () => LAYOUT_DEFAULTS.nodeSize],
  ["ratioTextSize", () => LAYOUT_DEFAULTS.ratioTextSize],
  ["noteTextSize", () => LAYOUT_DEFAULTS.noteTextSize],
  ["triangleLabelTextSize", () => LAYOUT_DEFAULTS.triangleLabelTextSize],
  ["customLabelTextSize", () => LAYOUT_DEFAULTS.customLabelTextSize],
  ["keyMappingTextSize", () => LAYOUT_DEFAULTS.keyMappingTextSize],
  ["keyMappingOffset", () => LAYOUT_DEFAULTS.keyMappingOffset],
  ["keyMappingDark", () => LAYOUT_DEFAULTS.keyMappingDark],
  ["keyMappingPrefix", () => LAYOUT_DEFAULTS.keyMappingPrefix],
  ["keyMappingSuffix", () => LAYOUT_DEFAULTS.keyMappingSuffix],
  ["axisLegendTextSize", () => LAYOUT_DEFAULTS.axisLegendTextSize],
  ["lineLabelTextSize", () => LAYOUT_DEFAULTS.lineLabelTextSize],
  ["titleMargin", () => LAYOUT_DEFAULTS.titleMargin],
  ["titleFont", () => LAYOUT_DEFAULTS.titleFont],
  ["creatorFont", () => LAYOUT_DEFAULTS.creatorFont],
  ["ratioFont", () => LAYOUT_DEFAULTS.ratioFont],
  ["noteFont", () => LAYOUT_DEFAULTS.noteFont],
  ["triangleLabelFont", () => LAYOUT_DEFAULTS.triangleLabelFont],
  ["customLabelFont", () => LAYOUT_DEFAULTS.customLabelFont],
  ["keyMappingFont", () => LAYOUT_DEFAULTS.keyMappingFont],
  ["axisLegendFont", () => LAYOUT_DEFAULTS.axisLegendFont],
  ["lineLabelFont", () => LAYOUT_DEFAULTS.lineLabelFont],
  ["titleFontWeight", () => LAYOUT_DEFAULTS.titleFontWeight],
  ["creatorFontWeight", () => LAYOUT_DEFAULTS.creatorFontWeight],
  ["ratioFontWeight", () => LAYOUT_DEFAULTS.ratioFontWeight],
  ["noteFontWeight", () => LAYOUT_DEFAULTS.noteFontWeight],
  ["triangleLabelFontWeight", () => LAYOUT_DEFAULTS.triangleLabelFontWeight],
  ["customLabelFontWeight", () => LAYOUT_DEFAULTS.customLabelFontWeight],
  ["keyMappingFontWeight", () => LAYOUT_DEFAULTS.keyMappingFontWeight],
  ["axisLegendFontWeight", () => LAYOUT_DEFAULTS.axisLegendFontWeight],
  ["lineLabelFontWeight", () => LAYOUT_DEFAULTS.lineLabelFontWeight],
  ["nodeShape", () => LAYOUT_DEFAULTS.nodeShape],
  ["unifyNodeSize", () => LAYOUT_DEFAULTS.unifyNodeSize],
  ["keyMappingsMode", () => LAYOUT_DEFAULTS.keyMappingsMode],
  ["pageSize", () => LAYOUT_DEFAULTS.pageSize],
  ["orientation", () => LAYOUT_DEFAULTS.orientation],
  ["lockPosition", () => LAYOUT_DEFAULTS.lockPosition],
  ["zoom", () => LAYOUT_DEFAULTS.zoom],
];

const PRESET_LAYOUT_EMPTY_ARRAY_KEYS = [
  "customLabels",
  "positionOffsets",
  "customNodePositions",
  "nodeShapes",
  "labelOffsets",
  "keyMappingOffsets",
];

function isDefaultLayoutSpacing(value) {
  return Boolean(value) &&
    value.x === LAYOUT_DEFAULTS.spacing.x &&
    value.y === LAYOUT_DEFAULTS.spacing.y &&
    value.z === LAYOUT_DEFAULTS.spacing.z;
}

function prunePresetLayoutState(
  layoutState,
  { isEmptyArray, isDefaultLayoutView, isDefaultAxisOffsets, isDefaultAxisHidden, isDefaultAxisAngles }
) {
  if (!layoutState.mode) delete layoutState.mode;
  if (!layoutState.title) delete layoutState.title;
  if (!layoutState.creator) delete layoutState.creator;

  PRESET_LAYOUT_DEFAULT_VALUE_KEYS.forEach(([key, getDefaultValue]) => {
    if (layoutState[key] === getDefaultValue()) {
      delete layoutState[key];
    }
  });

  if (isDefaultLayoutSpacing(layoutState.spacing)) {
    delete layoutState.spacing;
  }
  if (isDefaultLayoutView(layoutState.view)) delete layoutState.view;
  if (!layoutState.sourceView) delete layoutState.sourceView;
  PRESET_LAYOUT_EMPTY_ARRAY_KEYS.forEach((key) => {
    if (isEmptyArray(layoutState[key])) {
      delete layoutState[key];
    }
  });
  if (isDefaultAxisOffsets(layoutState.axisOffsets)) delete layoutState.axisOffsets;
  if (isDefaultAxisHidden(layoutState.axisHidden)) delete layoutState.axisHidden;
  if (isDefaultAxisAngles(layoutState.axisAngles)) delete layoutState.axisAngles;
}

function buildPresetLayoutState(layoutViewState, layoutSourceViewState, includeDefaults = false) {
  const isEmptyArray = (value) => !Array.isArray(value) || value.length === 0;
  const isDefaultLayoutView = (value) =>
    value &&
    Number(value.zoom) === Number(LAYOUT_DEFAULTS.view.zoom) &&
    Number(value.offsetX) === Number(LAYOUT_DEFAULTS.view.offsetX) &&
    Number(value.offsetY) === Number(LAYOUT_DEFAULTS.view.offsetY) &&
    Number(value.rotX) === Number(LAYOUT_DEFAULTS.view.rotX) &&
    Number(value.rotY) === Number(LAYOUT_DEFAULTS.view.rotY);
  const isDefaultAxisOffsets = (value) =>
    value &&
    ["x", "y", "z"].every((axis) => {
      const entry = value[axis];
      return entry && Number(entry.x) === 0 && Number(entry.y) === 0;
    });
  const isDefaultAxisHidden = (value) =>
    value &&
    ["x", "y", "z"].every(
      (axis) => Boolean(value[axis]) === Boolean(LAYOUT_DEFAULTS.axisHidden[axis])
    );
  const isDefaultAxisAngles = (value) =>
    value && ["x", "y", "z"].every((axis) => value[axis] == null);
  const layoutState = {
    mode: layoutMode,
    title: layoutTitle,
    creator: layoutCreator,
    titleSize: layoutTitleSize,
    creatorSize: layoutCreatorSize,
    nodeSize: layoutNodeSize,
    ratioTextSize: layoutRatioTextSize,
    noteTextSize: layoutNoteTextSize,
    triangleLabelTextSize: layoutTriangleLabelTextSize,
    customLabelTextSize: layoutCustomLabelTextSize,
    keyMappingTextSize: layoutKeyMappingTextSize,
    keyMappingOffset: layoutKeyMappingOffset,
    keyMappingDark: layoutKeyMappingDark,
    keyMappingPrefix: layoutKeyMappingPrefix,
    keyMappingSuffix: layoutKeyMappingSuffix,
    axisLegendTextSize: layoutAxisLegendTextSize,
    lineLabelTextSize: layoutLineLabelTextSize,
    titleMargin: layoutTitleMargin,
    titlePosition: layoutTitlePosition,
    creatorPosition: layoutCreatorPosition,
    customLabels: layoutCustomLabels.map((entry) => ({
      id: entry.id,
      text: entry.text,
      position: entry.position ? { ...entry.position } : null,
    })),
    positionOffsets: serializeLayoutPositionOffsets(),
    customNodePositions: serializeLayoutCustomNodePositions(),
    nodeShapes: serializeLayoutNodeShapes(),
    labelOffsets: serializeLayoutLabelOffsets(),
    keyMappingOffsets: serializeLayoutKeyMappingOffsets(),
    axisOffsets: layoutAxisOffsets,
    axisHidden: layoutAxisHidden,
    axisAngles: layoutAxisAngles,
    lockPosition: layoutLockPosition,
    view: layoutViewState,
    sourceView: layoutSourceViewState,
    titleFont: layoutTitleFont,
    creatorFont: layoutCreatorFont,
    ratioFont: layoutRatioFont,
    noteFont: layoutNoteFont,
    triangleLabelFont: layoutTriangleLabelFont,
    customLabelFont: layoutCustomLabelFont,
    keyMappingFont: layoutKeyMappingFont,
    axisLegendFont: layoutAxisLegendFont,
    lineLabelFont: layoutLineLabelFont,
    titleFontWeight: layoutTitleFontWeight,
    creatorFontWeight: layoutCreatorFontWeight,
    ratioFontWeight: layoutRatioFontWeight,
    noteFontWeight: layoutNoteFontWeight,
    triangleLabelFontWeight: layoutTriangleLabelFontWeight,
    customLabelFontWeight: layoutCustomLabelFontWeight,
    keyMappingFontWeight: layoutKeyMappingFontWeight,
    axisLegendFontWeight: layoutAxisLegendFontWeight,
    lineLabelFontWeight: layoutLineLabelFontWeight,
    spacing: { ...layoutSpacing },
    nodeShape: layoutNodeShape,
    unifyNodeSize: layoutUnifyNodeSize,
    perspectiveTextSize: layoutPerspectiveTextSize,
    keyMappingsMode: layoutKeyMappingMode,
    pageSize: layoutPageSize,
    orientation: layoutOrientation,
    zoom: layoutViewState.zoom,
  };

  if (includeDefaults) {
    return layoutState;
  }

  prunePresetLayoutState(layoutState, {
    isEmptyArray,
    isDefaultLayoutView,
    isDefaultAxisOffsets,
    isDefaultAxisHidden,
    isDefaultAxisAngles,
  });

  return layoutState;
}

function serializePresetActiveNodes() {
  return nodes
    .filter((node) => node.active && !node.isCustom)
    .map((node) => [node.exponentX, node.exponentY, node.exponentZ || 0]);
}

function serializePresetCustomNodes() {
  return customNodes.map((node) => ({
    sourceExponents: Array.isArray(node.sourceExponents)
      ? node.sourceExponents
      : (() => {
          const source = nodeById.get(node.sourceNodeId);
          return source
            ? [source.exponentX, source.exponentY, source.exponentZ || 0]
            : null;
        })(),
    customSlot: node.customSlot,
    factorNumerator: node.factorNumerator,
    factorDenominator: node.factorDenominator,
    octaveReduce: node.octaveReduce !== false,
    octaveShift: Number.isFinite(node.octaveShift) ? node.octaveShift : 0,
    position: { x: node.coordinate.x, y: node.coordinate.y },
    active: Boolean(node.active),
    volumeMax: clampNodeVolume(node.volumeMax),
  }));
}

function serializePresetNodeVolumes() {
  const entries = [];
  nodeVolumeLimits.forEach((value, key) => {
    const normalized = clampNodeVolume(value);
    if (Math.abs(normalized - 1) >= 1e-6) {
      entries.push([`grid:${key}`, normalized]);
    }
  });
  customNodes.forEach((node) => {
    const key = getNodeVolumeKey(node);
    const value = clampNodeVolume(node.volumeMax);
    if (key && Math.abs(value - 1) >= 1e-6) {
      entries.push([key, value]);
    }
  });
  return entries;
}

function pruneEmptyPresetCollections(state) {
  const isEmptyArray = (value) => !Array.isArray(value) || value.length === 0;
  const collectionKeys = [
    "active",
    "customNodes",
    "lineLabelOverrides",
    "lineLabelPositions",
    "distanceEdges",
    "distanceEdgeOverrides",
    "noteSpellings",
    "octaveOffsets",
    "nodeVolumes",
    "triangles",
    "triangleLabels",
  ];
  collectionKeys.forEach((key) => {
    if (isEmptyArray(state[key])) {
      delete state[key];
    }
  });
}

function getPresetViewState() {
  return {
    zoom: view.zoom,
    offsetX: view.offsetX,
    offsetY: view.offsetY,
    rotX: view.rotX,
    rotY: view.rotY,
  };
}

function getPresetRatiosState() {
  return [
    Number(ratioXSelect.value) || 3,
    Number(ratioYSelect.value) || 5,
    Number(ratioZSelect.value) || 7,
  ];
}

function getPresetExponentOffsetState() {
  return {
    x: Number(latticeExponentOffset.x) || 0,
    y: Number(latticeExponentOffset.y) || 0,
    z: Number(latticeExponentOffset.z) || 0,
  };
}

function getPresetAxisRangesState() {
  const ranges = getAxisExponentRanges();
  return {
    xMin: ranges.xMin,
    xMax: ranges.xMax,
    yMin: ranges.yMin,
    yMax: ranges.yMax,
    zMin: ranges.zMin,
    zMax: ranges.zMax,
  };
}

function getPresetTrianglesState() {
  return Array.from(triangleDiagonals.values()).map((entry) => ({
    plane: entry.plane,
    x: entry.x,
    y: entry.y,
    z: entry.z,
    expZ: gridCenterZ - entry.z,
    diag: entry.diag,
    tri: entry.tri,
  }));
}

function getPresetTriangleLabelsState() {
  return Array.from(triangleLabels.values()).map((entry) => ({
    plane: entry.plane,
    x: entry.x,
    y: entry.y,
    z: entry.z,
    expZ: gridCenterZ - entry.z,
    tri: entry.tri,
    label: entry.label || "",
  }));
}

function getPresetSynthState() {
  return {
    volume: Number(volumeSlider.value),
    lfoDepth: Number(lfoDepthSlider.value),
    lfoRate,
    keyboardMode: keyboardModeSelect ? keyboardModeSelect.value : "off",
    customPianoMap: serializeCustomPianoMap(),
    mode: synthMode,
    waveform: waveformSelect ? waveformSelect.value : "sine",
    soundfontPreset: soundfontPresetIndex,
    physicalModel: physicalModelSelect ? physicalModelSelect.value : KARPLUS_WAVEFORM,
    attack: getEnvelopeSliderValue(attackSlider),
    decay: getEnvelopeSliderValue(decaySlider),
    sustain: Number(sustainSlider.value),
    release: getEnvelopeSliderValue(releaseSlider),
    oneShot: Boolean(oneShotCheckbox && oneShotCheckbox.checked),
    envelopeTimeMode,
  };
}

function buildPresetStateSkeleton(active, customState, lineLabelState, distanceState) {
  return {
    v: 1,
    active,
    customNodes: customState,
    mode3d: is3DMode,
    connectOrphans: connectOrphansEnabled,
    tiltDeg: latticeTiltDeg,
    distances: analysisLayers.distances,
    microtonal: analysisLayers.microtonal,
    view: getPresetViewState(),
    axes: showAxes,
    grid: showGrid,
    lineLabels: showLineLabels,
    lineLabelOverrides: lineLabelState.lineLabelOverridesState,
    lineLabelPositions: lineLabelState.lineLabelPositionsState,
    distanceEdges: distanceState.distanceEdgesState,
    distanceEdgeOverrides: distanceState.distanceOverridesState,
    circles: showCircles,
    shading3d: show3DShading,
    keyMappings: showKeyMappings,
    ratios: getPresetRatiosState(),
    axisRanges: getPresetAxisRangesState(),
    exponentOffset: getPresetExponentOffsetState(),
    noteSpellings: Array.from(nodeSpellingOverrides.entries()),
    octaveOffsets: Array.from(nodeOctaveOffsets.entries()),
    nodeVolumes: serializePresetNodeVolumes(),
    triangles: getPresetTrianglesState(),
    triangleLabels: getPresetTriangleLabelsState(),
    fundamental: Number(fundamentalInput.value) || 220,
    a4: Number(a4Input.value) || 440,
    fundamentalSpelling,
    featureMode,
    spellingMode,
    showHz,
    showRatioCents,
    showCentsDeviation,
    showCentsSign,
    directionalRatioLabels,
    hejiEnabled,
    enharmonicsEnabled,
    centsPrecision,
    hzPrecision,
    synth: getPresetSynthState(),
  };
}

function getPresetState(options = {}) {
  const includeDefaults = Boolean(options && options.includeDefaults);
  const isEmptyObject = (value) =>
    !value || typeof value !== "object" || Array.isArray(value) || !Object.keys(value).length;
  const active = serializePresetActiveNodes();
  const customState = serializePresetCustomNodes();
  const layoutViewState = getPresetLayoutViewState();
  const layoutSourceViewState = getPresetLayoutSourceViewState();
  const lineLabelState = serializePresetLineLabelState();
  const distanceState = serializePresetDistanceState();
  const layoutState = buildPresetLayoutState(
    layoutViewState,
    layoutSourceViewState,
    includeDefaults
  );

  const state = buildPresetStateSkeleton(active, customState, lineLabelState, distanceState);

  pruneEmptyPresetCollections(state);
  if (!includeDefaults && isEmptyObject(layoutState)) {
    delete state.layout;
  } else {
    state.layout = layoutState;
  }

  if (!layoutMode) {
    const playState = serializePlayState();
    if (playState) {
      state.play = playState;
    }
  }

  return state;
}

// Preset Normalize
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepClonePresetValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => deepClonePresetValue(item));
  }
  if (isPlainObject(value)) {
    const next = {};
    Object.entries(value).forEach(([key, child]) => {
      next[key] = deepClonePresetValue(child);
    });
    return next;
  }
  return value;
}

function deepMergePresetState(defaultValue, incomingValue) {
  if (incomingValue === undefined) {
    return deepClonePresetValue(defaultValue);
  }
  if (Array.isArray(incomingValue)) {
    return deepClonePresetValue(incomingValue);
  }
  if (isPlainObject(defaultValue) && isPlainObject(incomingValue)) {
    const merged = {};
    const keys = new Set([
      ...Object.keys(defaultValue || {}),
      ...Object.keys(incomingValue || {}),
    ]);
    keys.forEach((key) => {
      merged[key] = deepMergePresetState(defaultValue[key], incomingValue[key]);
    });
    return merged;
  }
  if (isPlainObject(incomingValue)) {
    return deepClonePresetValue(incomingValue);
  }
  return incomingValue;
}

function normalizePresetStateWithDefaults(state) {
  if (!presetStateDefaults || !isPlainObject(state)) {
    return state;
  }
  return deepMergePresetState(presetStateDefaults, state);
}

// Preset State Application Helpers
function applyPresetCustomNodes(entries) {
  customNodes = [];
  if (!Array.isArray(entries)) {
    return;
  }
  const sourceByExponent = new Map();
  nodes.forEach((node) => {
    if (node && !node.isCustom) {
      sourceByExponent.set(
        `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
        node
      );
    }
  });
  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    let source = null;
    const sourceExponents = Array.isArray(entry.sourceExponents)
      ? entry.sourceExponents
      : Array.isArray(entry.exponents)
      ? entry.exponents
      : null;
    if (sourceExponents && sourceExponents.length >= 2) {
      const [expX, expY, expZ = 0] = sourceExponents.map(Number);
      if (Number.isFinite(expX) && Number.isFinite(expY) && Number.isFinite(expZ)) {
        source = sourceByExponent.get(`${expX},${expY},${expZ}`) || null;
      }
    }
    if (!source && entry.sourceNodeId != null) {
      source = nodeById.get(entry.sourceNodeId);
    }
    if (!source) {
      return;
    }
    const numerator = Math.trunc(Number(entry.factorNumerator));
    const denominator = Math.trunc(Number(entry.factorDenominator));
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return;
    }
    let slot = Number.isFinite(entry.customSlot)
      ? Math.max(0, Math.trunc(entry.customSlot))
      : null;
    const usedSlots = new Set(getCustomNodesForSource(source.id).map((node) => node.customSlot));
    if (slot == null || usedSlots.has(slot)) {
      slot = findNextCustomSlot(source.id);
    }
    if (slot == null) {
      return;
    }
    const octaveReduce = entry.octaveReduce !== false;
    const octaveShift = Number.isFinite(entry.octaveShift) ? Number(entry.octaveShift) : 0;
    const node = createCustomNodeFromSource(source, slot, numerator, denominator, {
      octaveReduce,
      octaveShift: octaveReduce ? octaveShift : 0,
    });
    if (!node) {
      return;
    }
    if (
      entry.position &&
      Number.isFinite(entry.position.x) &&
      Number.isFinite(entry.position.y)
    ) {
      node.coordinate.x = entry.position.x;
      node.coordinate.y = entry.position.y;
    }
    node.active = entry.active !== false;
    node.volumeMax = clampNodeVolume(Number(entry.volumeMax));
    insertCustomNode(node);
  });
  refreshCustomNodes();
}

// Preset URL Sync + Read
function updatePresetUrl(trigger = "direct") {
  if (!presetSyncEnabled) {
    return;
  }
  const presetState = getPresetState();
  const encoded = encodePresetState(presetState);
  const nextHash = `${PRESET_PARAM}=${encoded}`;
  if (location.hash === `#${nextHash}`) {
    return;
  }
  history.replaceState(null, "", `${location.pathname}${location.search}#${nextHash}`);
}

function schedulePresetUrlUpdate(trigger = "scheduled") {
  if (!presetSyncEnabled) {
    return;
  }
  if (presetUpdateTimer) {
    clearTimeout(presetUpdateTimer);
  }
  presetUpdateTimer = setTimeout(() => updatePresetUrl(trigger), 250);
}

function getPresetShareUrl() {
  const encoded = encodePresetState(getPresetState());
  const hash = `${PRESET_PARAM}=${encoded}`;
  return `${location.origin}${location.pathname}${location.search}#${hash}`;
}

function hideFileSharePopover() {
  if (!fileSharePopover) {
    return;
  }
  fileSharePopover.hidden = true;
}

function showFileSharePopover(message) {
  if (!fileSharePopover) {
    return;
  }
  fileSharePopover.textContent = message;
  fileSharePopover.hidden = false;
  if (fileShareTimer) {
    clearTimeout(fileShareTimer);
  }
  fileShareTimer = setTimeout(() => {
    fileShareTimer = null;
    hideFileSharePopover();
  }, 2400);
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

// Snapshot Settings Apply
function syncSnapshotSettingsControls() {
  normalizeSnapshotMorphSettings();
  setControlChecked(snapshotDeferToggle, snapshotDeferToCycleEnd);
  setControlChecked(snapshotRestoreToggle, snapshotRestorePlayNodes);
  setControlChecked(snapshotRestoreViewToggle, snapshotRestoreView);
  setControlChecked(snapshotRestoreSequenceToggle, snapshotRestoreSequence);
  setControlChecked(snapshotRestoreSynthToggle, snapshotRestoreSynthSettings);
  setControlChecked(snapshotRestoreKeyboardModeToggle, snapshotRestoreKeyboardMode);
  setControlChecked(snapshotRestoreLfosToggle, snapshotRestoreLfos);
  setControlChecked(snapshotKeyboardModeToggle, snapshotKeyboardMode);
  setControlChecked(snapshotConnectToggle, snapshotConnectCommonTones);
  setControlChecked(snapshotMorphToggle, snapshotMorphEnabled);
  if (snapshotMorphTimeInput) {
    snapshotMorphTimeInput.value = String(snapshotMorphTimeMs);
  }
  setControlDisabled(snapshotConnectToggle, !snapshotRestorePlayNodes || snapshotMorphEnabled);
  setControlDisabled(snapshotMorphToggle, !snapshotRestorePlayNodes);
  setControlDisabled(snapshotMorphTimeInput, !snapshotMorphEnabled);
  setControlChecked(snapshotRestoreLfoPhaseToggle, snapshotRestoreLfoPhase);
  setControlDisabled(snapshotRestoreLfoPhaseToggle, !snapshotRestoreLfos);
  setControlChecked(snapshotKeyboardActiveToggle, snapshotKeyboardActive);
  setControlDisabled(snapshotKeyboardActiveToggle, !snapshotKeyboardMode);
}

function applyPresetSnapshotSettings(settings) {
  if (!settings || typeof settings !== "object") {
    return;
  }
  if (typeof settings.deferToCycleEnd === "boolean") {
    snapshotDeferToCycleEnd = settings.deferToCycleEnd;
  }
  if (typeof settings.restorePlayNodes === "boolean") {
    snapshotRestorePlayNodes = settings.restorePlayNodes;
  }
  if (typeof settings.connectCommonTones === "boolean") {
    snapshotConnectCommonTones = settings.connectCommonTones;
  }
  if (typeof settings.morphEnabled === "boolean") {
    snapshotMorphEnabled = settings.morphEnabled;
  }
  if (Number.isFinite(settings.morphTimeMs)) {
    snapshotMorphTimeMs = Math.max(1, Math.round(settings.morphTimeMs));
  }
  if (typeof settings.restoreView === "boolean") {
    snapshotRestoreView = settings.restoreView;
  }
  if (typeof settings.restoreSequence === "boolean") {
    snapshotRestoreSequence = settings.restoreSequence;
  }
  if (typeof settings.restoreSynthSettings === "boolean") {
    snapshotRestoreSynthSettings = settings.restoreSynthSettings;
  }
  if (typeof settings.restoreKeyboardMode === "boolean") {
    snapshotRestoreKeyboardMode = settings.restoreKeyboardMode;
  }
  if (typeof settings.restoreLfos === "boolean") {
    snapshotRestoreLfos = settings.restoreLfos;
  }
  if (typeof settings.restoreLfoPhase === "boolean") {
    snapshotRestoreLfoPhase = settings.restoreLfoPhase;
  }
  if (typeof settings.useLetterKeys === "boolean") {
    snapshotKeyboardMode = settings.useLetterKeys;
  }
  if (typeof settings.lettersActive === "boolean") {
    snapshotKeyboardActive = settings.lettersActive;
  }
  normalizeSnapshotMorphSettings();
  syncSnapshotSettingsControls();
  setKeyboardModeDisabled(snapshotKeyboardMode);
  updateSnapshotUi();
}

// Preset Apply Pipeline (Transient + Geometry + Rebuild)
function resetPresetAnalysisState() {
  analysisLayers.distances = false;
  analysisLayers.microtonal = false;
  microtonalSelectedNodeIds.clear();
  microtonalHoverPairKey = "";
  distanceSelectMode = false;
  distanceSelectedNodeKeys.clear();
  distanceSelectedEdges.clear();
  distanceEdgeOverrides.clear();
  syncAnalysisLayerToggles();
}

function getPendingPresetLineLabelState(state) {
  return {
    pendingLineLabelOverridesState: Array.isArray(state.lineLabelOverrides)
      ? state.lineLabelOverrides
      : null,
    pendingLineLabelPositionsState: Array.isArray(state.lineLabelPositions)
      ? state.lineLabelPositions
      : null,
  };
}

function applyPresetTransientState(state) {
  resetPresetAnalysisState();
  pendingLayoutSpacing = null;
  pendingLayoutCustomPositions = null;
  pendingLayoutNodeShapes = null;
  pendingCustomPianoMap = null;
  const { pendingLineLabelOverridesState, pendingLineLabelPositionsState } =
    getPendingPresetLineLabelState(state);
  lineLabelOverrides.clear();
  lineLabelPositionOverrides.clear();
  applyPresetDisplayToggleState(state);
  applyPresetDistanceState(state);
  return {
    pendingLineLabelOverridesState,
    pendingLineLabelPositionsState,
  };
}

function applyPresetGeometryState(state, layoutState) {
  const viewState = state.view && typeof state.view === "object" ? state.view : null;
  layoutSourceView = null;
  const { wants3D, targetDepth, targetCenterZ } = getPresetDepthContext(
    state,
    layoutState
  );
  gridDepth = targetDepth;
  gridCenterZ = targetCenterZ;
  const presetTriangles = Array.isArray(state.triangles) ? state.triangles : null;
  const presetTriangleLabels = Array.isArray(state.triangleLabels)
    ? state.triangleLabels
    : null;
  return {
    viewState,
    wants3D,
    targetDepth,
    targetCenterZ,
    presetTriangles,
    presetTriangleLabels,
  };
}

function applyPresetLayoutModeSelection(
  layoutState,
  presetWants3D,
  preserveViewMode,
  skipLayoutModeSwitch
) {
  const syncPreset3DModeSelection = () => {
    is3DMode = presetWants3D;
    if (mode3dCheckbox) {
      setControlChecked(mode3dCheckbox, presetWants3D);
    }
    updateNavPanelVisibility();
    syncViewModeControls();
  };
  const presetLayoutMode = Boolean(layoutState && layoutState.mode);
  if (!skipLayoutModeSwitch) {
    if (presetLayoutMode !== layoutMode) {
      setLayoutMode(presetLayoutMode, { force: true });
    }
    if (!presetLayoutMode && !preserveViewMode) {
      syncPreset3DModeSelection();
    }
    return;
  }
  if (!layoutMode && !preserveViewMode) {
    syncPreset3DModeSelection();
  }
}

function applyPresetBooleanCheckboxState(value, checkboxes, onApply) {
  if (typeof value !== "boolean") {
    return false;
  }
  onApply(value);
  checkboxes.forEach((checkbox) => setControlChecked(checkbox, value));
  return true;
}

function applyPresetBooleanField(state, key, checkboxes, applyValue, fallbackValue) {
  const applied = applyPresetBooleanCheckboxState(state[key], checkboxes, applyValue);
  if (!applied && fallbackValue !== undefined) {
    applyValue(fallbackValue);
    checkboxes.forEach((checkbox) => setControlChecked(checkbox, fallbackValue));
  }
  return applied;
}

function applyPresetDisplayToggleState(state) {
  applyPresetBooleanField(state, "axes", [navAxesToggle], (value) => {
    showAxes = value;
  });
  applyPresetBooleanField(state, "grid", [navGridToggle], (value) => {
    showGrid = value;
  });
  applyPresetBooleanField(
    state,
    "lineLabels",
    [lineLabelsToggle, layoutLineLabelsToggle],
    (value) => {
      showLineLabels = value;
    },
    false
  );
  applyPresetBooleanField(state, "circles", [navCirclesToggle, layoutCirclesToggle], (value) => {
    showCircles = value;
  });
  applyPresetBooleanField(
    state,
    "shading3d",
    [show3DShadingToggle],
    (value) => {
      show3DShading = value;
    },
    true
  );
  applyPresetBooleanField(
    state,
    "keyMappings",
    [navKeyMappingsToggle, layoutKeyMappingsToggle],
    (value) => {
      showKeyMappings = value;
    }
  );
  if (typeof state.distances === "boolean") {
    analysisLayers.distances = state.distances;
  }
  if (typeof state.microtonal === "boolean") {
    analysisLayers.microtonal = state.microtonal;
  }
  if (typeof state.distances === "boolean" || typeof state.microtonal === "boolean") {
    syncAnalysisLayerToggles();
  }
}

function applyPresetDistanceState(state) {
  if (Array.isArray(state.distanceEdges)) {
    state.distanceEdges.forEach((edgeKey) => {
      if (typeof edgeKey === "string" && edgeKey) {
        distanceSelectedEdges.add(edgeKey);
      }
    });
  }
  forEachNormalizedPresetEntry(
    state.distanceEdgeOverrides,
    normalizeDistanceEdgeOverrideEntry,
    (normalized) => {
      distanceEdgeOverrides.set(normalized.key, normalized.value);
    }
  );
}

function applyPresetSpellingAndOctaveState(state) {
  if (Array.isArray(state.noteSpellings)) {
    nodeSpellingOverrides = new Map();
    forEachNormalizedPresetEntry(state.noteSpellings, normalizePresetSpellingEntry, (normalized) => {
        nodeSpellingOverrides.set(normalized[0], normalized[1]);
    });
  }
  nodeOctaveOffsets = new Map();
  forEachNormalizedPresetEntry(
    state.octaveOffsets,
    normalizePresetOctaveOffsetEntry,
    (normalized) => {
      nodeOctaveOffsets.set(normalized[0], normalized[1]);
    }
  );
  nodeVolumeLimits.clear();
  forEachNormalizedPresetEntry(
    state.nodeVolumes,
    normalizePresetNodeVolumeEntry,
    (normalized) => {
      const key = normalized[0];
      const value = normalized[1];
      if (key.startsWith("grid:")) {
        nodeVolumeLimits.set(key.slice(5), value);
        return;
      }
      if (!key.startsWith("custom:")) {
        return;
      }
      const node = getNodeBySnapshotKey(key);
      if (node && node.isCustom) {
        node.volumeMax = value;
      }
    }
  );
}

function applyPresetReadoutAndTuningSettings(state) {
  if (typeof state.featureMode === "string") {
    featureMode = state.featureMode === "note" ? "note" : "ratio";
    syncFeatureModeControls();
  }
  if (typeof state.spellingMode === "string") {
    spellingMode = state.spellingMode === "true" ? "true" : "simple";
    syncSpellingModeControls();
  }
  applyPresetBooleanField(
    state,
    "showHz",
    [showHzToggle, layoutShowHzToggle],
    (value) => {
      showHz = value;
    }
  );
  applyPresetBooleanField(
    state,
    "showRatioCents",
    [showRatioCentsToggle, layoutShowRatioCentsToggle],
    (value) => {
      showRatioCents = value;
    }
  );
  if (typeof state.showCentsDeviation === "boolean") {
    showCentsDeviation = state.showCentsDeviation;
  } else {
    showCentsDeviation = true;
  }
  applyPresetBooleanField(state, "showCentsSign", [showCentsSignToggle], (value) => {
    showCentsSign = value;
  });
  applyPresetBooleanField(state, "connectOrphans", [connectOrphansToggle], (value) => {
    connectOrphansEnabled = value;
  });
  if (Number.isFinite(state.tiltDeg)) {
    setLatticeTilt(state.tiltDeg);
  } else {
    setLatticeTilt(0);
  }
  applyPresetBooleanField(
    state,
    "directionalRatioLabels",
    [directionalRatioLabelsToggle],
    (value) => {
      directionalRatioLabels = value;
    },
    false
  );
  applyPresetBooleanField(
    state,
    "hejiEnabled",
    [hejiEnabledToggle, layoutHejiEnabledToggle],
    (value) => {
      hejiEnabled = value;
    }
  );
  applyPresetBooleanField(
    state,
    "enharmonicsEnabled",
    [enharmonicsEnabledToggle, layoutEnharmonicsEnabledToggle],
    (value) => {
      enharmonicsEnabled = value;
    }
  );
  enharmonicsEnabledPreference = Boolean(enharmonicsEnabled);
  if (Number.isFinite(state.centsPrecision)) {
    centsPrecision = Math.min(2, Math.max(0, Math.round(state.centsPrecision)));
    syncCentsPrecisionControls();
  }
  if (Number.isFinite(state.hzPrecision)) {
    hzPrecision = Math.min(2, Math.max(0, Math.round(state.hzPrecision)));
    syncHzPrecisionControls();
  }
  enforceCentsDisplayMode();
  invalidateLabelCache();
  updateFundamentalNotes();
  syncFundamentalNoteSelect();
}

function collectPresetActiveKeys(state) {
  const activeKeys = new Set();
  if (!Array.isArray(state.active)) {
    return activeKeys;
  }
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
  return activeKeys;
}

function applyLayoutStringStateValue(layoutState, key, applyValue, inputElement) {
  if (typeof layoutState[key] !== "string") {
    return false;
  }
  const value = layoutState[key];
  applyValue(value);
  setControlValue(inputElement, value);
  return true;
}

function applyLayoutNumberStateValue(layoutState, key, applyValue, inputElement) {
  if (!Number.isFinite(layoutState[key])) {
    return false;
  }
  const value = layoutState[key];
  applyValue(value);
  setControlValue(inputElement, value);
  return true;
}

function applyLayoutBooleanStateValue(layoutState, key, applyValue, inputElement) {
  if (typeof layoutState[key] !== "boolean") {
    return false;
  }
  const value = layoutState[key];
  applyValue(value);
  setControlChecked(inputElement, value);
  return true;
}

function applyLayoutFiniteNumberStateValue(
  layoutState,
  key,
  { applyValue, inputElement, transform = null, onApplied = null } = {}
) {
  if (!Number.isFinite(layoutState[key])) {
    return false;
  }
  const raw = Number(layoutState[key]);
  const value = typeof transform === "function" ? transform(raw) : raw;
  applyValue(value);
  if (inputElement) {
    setControlValue(inputElement, value);
  }
  if (typeof onApplied === "function") {
    onApplied(value);
  }
  return true;
}

function applyPresetLayoutMetadataAndSizing(layoutState) {
  pendingLayoutLabelOffsets = Array.isArray(layoutState.labelOffsets)
    ? layoutState.labelOffsets
    : null;
  pendingLayoutKeyMappingOffsets = Array.isArray(layoutState.keyMappingOffsets)
    ? layoutState.keyMappingOffsets
    : null;
  pendingLayoutPositionOffsets = Array.isArray(layoutState.positionOffsets)
    ? layoutState.positionOffsets
    : null;
  pendingLayoutCustomPositions = Array.isArray(layoutState.customNodePositions)
    ? layoutState.customNodePositions
    : null;
  pendingLayoutNodeShapes = Array.isArray(layoutState.nodeShapes)
    ? layoutState.nodeShapes
    : null;
  applyLayoutStringStateValue(layoutState, "title", (value) => {
    layoutTitle = value;
  }, layoutTitleInput);
  applyLayoutStringStateValue(layoutState, "creator", (value) => {
    layoutCreator = value;
  }, layoutCreatorInput);
  applyLayoutNumberStateValue(layoutState, "titleSize", (value) => {
    layoutTitleSize = value;
  }, layoutTitleSizeInput);
  applyLayoutNumberStateValue(layoutState, "creatorSize", (value) => {
    layoutCreatorSize = value;
  }, layoutCreatorSizeInput);
  if (
    Number.isFinite(layoutState.textScale) &&
    !Number.isFinite(layoutState.ratioTextSize) &&
    !Number.isFinite(layoutState.noteTextSize)
  ) {
    layoutRatioTextSize = Math.max(10, Math.round(21 * layoutState.textScale));
    layoutNoteTextSize = Math.max(8, Math.round(11 * layoutState.textScale));
    layoutTriangleLabelTextSize = Math.max(
      10,
      Math.round(LAYOUT_DEFAULTS.triangleLabelTextSize * layoutState.textScale)
    );
    setControlValue(layoutRatioTextSizeInput, layoutRatioTextSize);
    setControlValue(layoutNoteTextSizeInput, layoutNoteTextSize);
    setControlValue(layoutTriangleLabelSizeInput, layoutTriangleLabelTextSize);
    updateLayoutRatioTextReadout();
    updateLayoutNoteTextReadout();
    updateLayoutTriangleLabelReadout();
  }
  applyLayoutFiniteNumberStateValue(layoutState, "nodeSize", {
    applyValue: (value) => {
      layoutNodeSize = value;
    },
    inputElement: layoutNodeSizeInput,
    onApplied: () => updateLayoutNodeSizeReadout(),
  });
  applyLayoutFiniteNumberStateValue(layoutState, "ratioTextSize", {
    applyValue: (value) => {
      layoutRatioTextSize = value;
    },
    inputElement: layoutRatioTextSizeInput,
    onApplied: () => updateLayoutRatioTextReadout(),
  });
  applyLayoutFiniteNumberStateValue(layoutState, "noteTextSize", {
    applyValue: (value) => {
      layoutNoteTextSize = value;
    },
    inputElement: layoutNoteTextSizeInput,
    onApplied: () => updateLayoutNoteTextReadout(),
  });
  const hasTriangleLabelTextSize = applyLayoutFiniteNumberStateValue(
    layoutState,
    "triangleLabelTextSize",
    {
      applyValue: (value) => {
        layoutTriangleLabelTextSize = value;
      },
      inputElement: layoutTriangleLabelSizeInput,
      onApplied: () => updateLayoutTriangleLabelReadout(),
    }
  );
  if (!hasTriangleLabelTextSize) {
    layoutTriangleLabelTextSize = Math.max(10, Math.round(layoutNoteTextSize + 6));
    setControlValue(layoutTriangleLabelSizeInput, layoutTriangleLabelTextSize);
    updateLayoutTriangleLabelReadout();
  }
  applyLayoutFiniteNumberStateValue(layoutState, "customLabelTextSize", {
    transform: (value) => Math.min(36, Math.max(8, Math.round(value))),
    applyValue: (value) => {
      layoutCustomLabelTextSize = value;
    },
    inputElement: layoutCustomLabelSizeInput,
  });
  applyLayoutFiniteNumberStateValue(layoutState, "keyMappingTextSize", {
    transform: (value) => Math.min(20, Math.max(8, Math.round(value))),
    applyValue: (value) => {
      layoutKeyMappingTextSize = value;
    },
    inputElement: layoutKeyMappingSizeInput,
  });
  applyLayoutFiniteNumberStateValue(layoutState, "keyMappingOffset", {
    transform: (value) => Math.min(40, Math.max(0, Math.round(value))),
    applyValue: (value) => {
      layoutKeyMappingOffset = value;
    },
    inputElement: layoutKeyMappingOffsetInput,
  });
  applyLayoutBooleanStateValue(layoutState, "keyMappingDark", (value) => {
    layoutKeyMappingDark = value;
  }, layoutKeyMappingDarkToggle);
  applyLayoutFiniteNumberStateValue(layoutState, "axisLegendTextSize", {
    transform: (value) => Math.min(36, Math.max(10, Math.round(value))),
    applyValue: (value) => {
      layoutAxisLegendTextSize = value;
    },
    inputElement: layoutAxisSizeInput,
  });
  const hasLineLabelTextSize = applyLayoutFiniteNumberStateValue(
    layoutState,
    "lineLabelTextSize",
    {
      transform: (value) => Math.min(28, Math.max(8, Math.round(value))),
      applyValue: (value) => {
        layoutLineLabelTextSize = value;
      },
      inputElement: layoutLineLabelSizeInput,
    }
  );
  if (!hasLineLabelTextSize) {
    layoutLineLabelTextSize = Math.max(8, Math.round(layoutRatioTextSize * 0.6));
    setControlValue(layoutLineLabelSizeInput, layoutLineLabelTextSize);
  }
  applyLayoutStringStateValue(layoutState, "keyMappingPrefix", (value) => {
    layoutKeyMappingPrefix = value;
  }, layoutKeyMappingPrefixInput);
  applyLayoutStringStateValue(layoutState, "keyMappingSuffix", (value) => {
    layoutKeyMappingSuffix = value;
  }, layoutKeyMappingSuffixInput);
}

function parsePresetLayoutVec2(value) {
  if (!value || !Number.isFinite(value.x) || !Number.isFinite(value.y)) {
    return null;
  }
  return { x: value.x, y: value.y };
}

function applyPresetLayoutPositioningState(layoutState) {
  if (layoutState.spacing && typeof layoutState.spacing === "object") {
    pendingLayoutSpacing = {
      x: Number(layoutState.spacing.x) || 1,
      y: Number(layoutState.spacing.y) || 1,
      z: Number(layoutState.spacing.z) || 1,
    };
  } else {
    pendingLayoutSpacing = { ...LAYOUT_DEFAULTS.spacing };
  }
  if (Number.isFinite(layoutState.titleMargin)) {
    layoutTitleMargin = layoutState.titleMargin;
    setControlValue(layoutTitleMarginInput, layoutTitleMargin);
    updateLayoutTitleMarginReadout();
  }
  layoutTitlePosition = parsePresetLayoutVec2(layoutState.titlePosition);
  layoutCreatorPosition = parsePresetLayoutVec2(layoutState.creatorPosition);
  if (layoutState.axisOffsets && typeof layoutState.axisOffsets === "object") {
    ["x", "y", "z"].forEach((axis) => {
      const offset = parsePresetLayoutVec2(layoutState.axisOffsets[axis]);
      if (offset) {
        layoutAxisOffsets[axis] = offset;
      }
    });
  }
  if (layoutState.axisHidden && typeof layoutState.axisHidden === "object") {
    ["x", "y", "z"].forEach((axis) => {
      layoutAxisHidden[axis] = Boolean(layoutState.axisHidden[axis]);
    });
  } else {
    layoutAxisHidden = { ...LAYOUT_DEFAULTS.axisHidden };
  }
  if (layoutState.axisAngles && typeof layoutState.axisAngles === "object") {
    ["x", "y", "z"].forEach((axis) => {
      const angle = layoutState.axisAngles[axis];
      layoutAxisAngles[axis] = Number.isFinite(angle) ? angle : null;
    });
  }
}

function applyPresetLayoutTypographyAndOptions(layoutState) {
  applyPresetLayoutFontFamilies(layoutState);
  applyPresetLayoutFontWeights(layoutState);
  applyPresetLayoutCustomLabels(layoutState);
  applyPresetLayoutMiscOptions(layoutState);
}

function applyPresetFontFamily(layoutState, key, applyValue, selectElement) {
  if (typeof layoutState[key] !== "string") {
    return false;
  }
  const value = layoutState[key];
  applyValue(value);
  setControlValue(selectElement, value);
  return true;
}

const PRESET_LAYOUT_FONT_FAMILY_SPECS = [
  { key: "titleFont", select: () => layoutTitleFontSelect, apply: (value) => (layoutTitleFont = value) },
  { key: "creatorFont", select: () => layoutCreatorFontSelect, apply: (value) => (layoutCreatorFont = value) },
  { key: "ratioFont", select: () => layoutRatioFontSelect, apply: (value) => (layoutRatioFont = value) },
  { key: "noteFont", select: () => layoutNoteFontSelect, apply: (value) => (layoutNoteFont = value) },
  {
    key: "triangleLabelFont",
    select: () => layoutTriangleLabelFontSelect,
    apply: (value) => (layoutTriangleLabelFont = value),
  },
  { key: "customLabelFont", select: () => layoutCustomFontSelect, apply: (value) => (layoutCustomLabelFont = value) },
  {
    key: "keyMappingFont",
    select: () => layoutKeyMappingFontSelect,
    apply: (value) => (layoutKeyMappingFont = value),
  },
  { key: "axisLegendFont", select: () => layoutAxisFontSelect, apply: (value) => (layoutAxisLegendFont = value) },
];

function applyPresetLayoutFontFamilies(layoutState) {
  PRESET_LAYOUT_FONT_FAMILY_SPECS.forEach((spec) => {
    applyPresetFontFamily(layoutState, spec.key, spec.apply, spec.select());
  });
  if (!applyPresetFontFamily(layoutState, "lineLabelFont", (value) => {
    layoutLineLabelFont = value;
  }, layoutLineLabelFontSelect)) {
    layoutLineLabelFont = layoutAxisLegendFont;
    setControlValue(layoutLineLabelFontSelect, layoutLineLabelFont);
  }
}

function applyPresetFontWeight(layoutState, key, applyValue, selectElement) {
  if (!Number.isFinite(layoutState[key])) {
    return false;
  }
  const value = layoutState[key];
  applyValue(value);
  setControlValue(selectElement, value);
  return true;
}

const PRESET_LAYOUT_FONT_WEIGHT_SPECS = [
  {
    key: "axisLegendFontWeight",
    select: () => layoutAxisWeightSelect,
    apply: (value) => (layoutAxisLegendFontWeight = value),
  },
  {
    key: "titleFontWeight",
    select: () => layoutTitleWeightSelect,
    apply: (value) => (layoutTitleFontWeight = value),
  },
  {
    key: "creatorFontWeight",
    select: () => layoutCreatorWeightSelect,
    apply: (value) => (layoutCreatorFontWeight = value),
  },
  {
    key: "ratioFontWeight",
    select: () => layoutRatioWeightSelect,
    apply: (value) => (layoutRatioFontWeight = value),
  },
  {
    key: "noteFontWeight",
    select: () => layoutNoteWeightSelect,
    apply: (value) => (layoutNoteFontWeight = value),
  },
  {
    key: "triangleLabelFontWeight",
    select: () => layoutTriangleLabelWeightSelect,
    apply: (value) => (layoutTriangleLabelFontWeight = value),
  },
  {
    key: "customLabelFontWeight",
    select: () => layoutCustomWeightSelect,
    apply: (value) => (layoutCustomLabelFontWeight = value),
  },
  {
    key: "keyMappingFontWeight",
    select: () => layoutKeyMappingWeightSelect,
    apply: (value) => (layoutKeyMappingFontWeight = value),
  },
];

function applyPresetLayoutFontWeights(layoutState) {
  applyPresetFontWeight(
    layoutState,
    "axisLegendFontWeight",
    (value) => {
      layoutAxisLegendFontWeight = value;
    },
    layoutAxisWeightSelect
  );
  if (!applyPresetFontWeight(layoutState, "lineLabelFontWeight", (value) => {
    layoutLineLabelFontWeight = value;
  }, layoutLineLabelWeightSelect)) {
    layoutLineLabelFontWeight = layoutAxisLegendFontWeight;
    setControlValue(layoutLineLabelWeightSelect, layoutLineLabelFontWeight);
  }
  PRESET_LAYOUT_FONT_WEIGHT_SPECS.forEach((spec) => {
    if (spec.key === "axisLegendFontWeight") {
      return;
    }
    applyPresetFontWeight(layoutState, spec.key, spec.apply, spec.select());
  });
}

function applyPresetLayoutCustomLabels(layoutState) {
  if (Array.isArray(layoutState.customLabels)) {
    layoutCustomLabels = layoutState.customLabels
      .map((entry) => ({
        id: Number(entry.id),
        text: entry.text ? String(entry.text) : "",
        position:
          entry.position &&
          Number.isFinite(entry.position.x) &&
          Number.isFinite(entry.position.y)
            ? { x: entry.position.x, y: entry.position.y }
            : null,
      }))
      .filter((entry) => entry.text && entry.position);
    const maxId = layoutCustomLabels.reduce(
      (max, entry) => (Number.isFinite(entry.id) ? Math.max(max, entry.id) : max),
      0
    );
    layoutCustomLabelId = maxId + 1;
  } else {
    layoutCustomLabels = [];
    layoutCustomLabelId = 1;
  }
  updateLayoutCustomLabelControls();
  syncLayoutFontVars();
}

function applyPresetLayoutMiscOptions(layoutState) {
  if (typeof layoutState.nodeShape === "string") {
    layoutNodeShape = layoutState.nodeShape;
    setControlValue(layoutNodeShapeSelect, layoutNodeShape);
  }
  if (typeof layoutState.keyMappingsMode === "string") {
    const allowed = new Set(["hide", "unique", "all"]);
    layoutKeyMappingMode = allowed.has(layoutState.keyMappingsMode)
      ? layoutState.keyMappingsMode
      : layoutKeyMappingMode;
    syncLayoutKeyMappingControls();
  }
  if (typeof layoutState.unifyNodeSize === "boolean") {
    layoutUnifyNodeSize = layoutState.unifyNodeSize;
    setControlChecked(layoutUnifySizeToggle, layoutUnifyNodeSize);
  }
  if (typeof layoutState.perspectiveTextSize === "boolean") {
    layoutPerspectiveTextSize = layoutState.perspectiveTextSize;
  } else {
    layoutPerspectiveTextSize = LAYOUT_DEFAULTS.perspectiveTextSize;
  }
  syncLayoutPerspectiveTextToggleState();
  if (typeof layoutState.pageSize === "string") {
    layoutPageSize = layoutState.pageSize;
    setControlValue(layoutPageSizeSelect, layoutPageSize);
  }
  if (typeof layoutState.orientation === "string") {
    layoutOrientation = layoutState.orientation;
    setControlValue(layoutOrientationSelect, layoutOrientation);
  }
  if (typeof layoutState.lockPosition === "boolean") {
    layoutLockPosition = layoutState.lockPosition;
  }
}

function parsePresetLayoutViewObject(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const zoom = Number(value.zoom);
  const offsetX = Number(value.offsetX);
  const offsetY = Number(value.offsetY);
  const rotX = Number(value.rotX);
  const rotY = Number(value.rotY);
  if (
    !Number.isFinite(zoom) ||
    !Number.isFinite(offsetX) ||
    !Number.isFinite(offsetY) ||
    !Number.isFinite(rotX) ||
    !Number.isFinite(rotY)
  ) {
    return null;
  }
  return { zoom, offsetX, offsetY, rotX, rotY };
}

function applyPresetLayoutViewAndModeState(layoutState) {
  const parsedLayoutView = parsePresetLayoutViewObject(layoutState.view);
  if (parsedLayoutView) {
    layoutView = {
      zoom: parsedLayoutView.zoom,
      offsetX: parsedLayoutView.offsetX,
      offsetY: parsedLayoutView.offsetY,
      rotX: parsedLayoutView.rotX,
      rotY: parsedLayoutView.rotY,
    };
    if (layoutState.mode && !layoutLockPosition) {
      view.zoom = layoutView.zoom;
      view.offsetX = layoutView.offsetX;
      view.offsetY = layoutView.offsetY;
      view.rotX = layoutView.rotX;
      view.rotY = layoutView.rotY;
    }
  } else if (Number.isFinite(layoutState.zoom)) {
    layoutView = {
      ...layoutView,
      zoom: clampZoom(layoutState.zoom),
    };
  }
  const parsedSourceView = parsePresetLayoutViewObject(layoutState.sourceView);
  if (parsedSourceView) {
    layoutSourceView = parsedSourceView;
  }
  if (Number.isFinite(layoutState.zoom)) {
    if (layoutMode && layoutLockPosition) {
      view.zoom = clampZoom(layoutState.zoom);
      syncLayoutScaleInput();
    }
  }
  if (typeof layoutState.mode === "boolean") {
    if (layoutMode) {
      layoutPrevState = {
        is3DMode,
        showAxes,
        showGrid,
        zoom: view.zoom,
        offsetX: view.offsetX,
        offsetY: view.offsetY,
        rotX: view.rotX,
        rotY: view.rotY,
      };
    }
    setLayoutMode(layoutState.mode, { force: layoutState.mode && layoutMode });
    if (layoutState.mode) {
      layoutLockPosition = true;
      if (layoutFreezeButton) {
        layoutFreezeButton.textContent = "Unfreeze";
      }
      if (layoutMode) {
        view.zoom = layoutView.zoom;
        view.offsetX = layoutView.offsetX;
        view.offsetY = layoutView.offsetY;
        view.rotX = layoutView.rotX;
        view.rotY = layoutView.rotY;
        syncLayoutScaleInput();
      }
    }
  }
}

function applyPresetLayoutState(layoutState) {
  if (!layoutState) {
    pendingLayoutSpacing = { ...LAYOUT_DEFAULTS.spacing };
    return;
  }
  applyPresetLayoutMetadataAndSizing(layoutState);
  applyPresetLayoutPositioningState(layoutState);
  applyPresetLayoutTypographyAndOptions(layoutState);
  applyPresetLayoutViewAndModeState(layoutState);
}

function applyPresetTrianglesState(presetTriangles, targetCenterZ, targetDepth) {
  if (!presetTriangles) {
    return;
  }
  presetTriangles.forEach((entry) => {
    const position = normalizePresetTrianglePosition(entry, targetCenterZ, targetDepth);
    if (!position) {
      return;
    }
    const { plane, x, y, z } = position;
    const diag = entry.diag;
    if (diag !== "backslash" && diag !== "slash") {
      return;
    }
    const tri = typeof entry.tri === "string" ? entry.tri : "";
    const label = typeof entry.label === "string" ? entry.label : "";
    const normalized = { plane, x, y, z, diag, tri };
    triangleDiagonals.set(triangleKey(normalized), normalized);
    if (label) {
      const labelTri = TRIANGLE_TRI_IDS.has(tri)
        ? tri
        : diag === "backslash"
        ? "abd"
        : "abc";
      const labelEntry = normalizeTriangleLabelEntry({
        plane,
        x,
        y,
        z,
        tri: labelTri,
        label,
      });
      triangleLabels.set(triangleLabelKey(labelEntry), labelEntry);
    }
  });
}

function applyPresetTriangleLabelsState(
  presetTriangleLabels,
  targetCenterZ,
  targetDepth
) {
  if (!presetTriangleLabels) {
    return;
  }
  presetTriangleLabels.forEach((entry) => {
    const position = normalizePresetTrianglePosition(entry, targetCenterZ, targetDepth);
    if (!position) {
      return;
    }
    const { plane, x, y, z } = position;
    const tri = typeof entry.tri === "string" ? entry.tri : "";
    if (!TRIANGLE_TRI_IDS.has(tri)) {
      return;
    }
    const label = typeof entry.label === "string" ? entry.label : "";
    if (!label) {
      return;
    }
    const normalized = normalizeTriangleLabelEntry({ plane, x, y, z, tri, label });
    triangleLabels.set(triangleLabelKey(normalized), normalized);
  });
}

function applyPendingPresetStateWithDraw(value, applyFn, clearFn = null) {
  if (!value) {
    return false;
  }
  applyFn(value);
  if (clearFn) {
    clearFn();
  }
  draw();
  return true;
}

function applyPendingPresetLayoutState() {
  applyPendingPresetStateWithDraw(
    pendingLayoutLabelOffsets,
    applyLayoutLabelOffsets,
    () => {
      pendingLayoutLabelOffsets = null;
    }
  );
  applyPendingPresetStateWithDraw(
    pendingLayoutKeyMappingOffsets,
    applyLayoutKeyMappingOffsets,
    () => {
      pendingLayoutKeyMappingOffsets = null;
    }
  );
  if (pendingLayoutSpacing) {
    layoutPositions.clear();
    applyLayoutSpacing(pendingLayoutSpacing);
    pendingLayoutSpacing = null;
    updateLayoutSpacingControls();
    draw();
  }
  applyPendingPresetStateWithDraw(
    pendingLayoutPositionOffsets,
    applyLayoutPositionOffsets,
    () => {
      pendingLayoutPositionOffsets = null;
    }
  );
  applyPendingPresetStateWithDraw(
    pendingLayoutCustomPositions,
    applyLayoutCustomNodePositions,
    () => {
      pendingLayoutCustomPositions = null;
    }
  );
  applyPendingPresetStateWithDraw(
    pendingLayoutNodeShapes,
    applyLayoutNodeShapes,
    () => {
      pendingLayoutNodeShapes = null;
    }
  );
}

function applyPresetSynthState(synthState, options = {}) {
  if (!synthState || typeof synthState !== "object") {
    return;
  }
  const applyFiniteSliderField = (key, slider, onApply) => {
    if (!Number.isFinite(synthState[key]) || !slider) {
      return false;
    }
    slider.value = String(synthState[key]);
    onApply();
    return true;
  };
  applyFiniteSliderField("volume", volumeSlider, () => updateVolume());
  applyFiniteSliderField("lfoDepth", lfoDepthSlider, () => updateLfoDepth());
  if (Number.isFinite(synthState.lfoRate) && lfoRateSlider) {
    setLfoRateSlider(synthState.lfoRate);
    updateLfoRate();
  }
  if (keyboardModeSelect && typeof synthState.keyboardMode === "string") {
    keyboardModeSelect.value = synthState.keyboardMode;
    syncCustomPianoModeUi(keyboardModeSelect.value);
    updateUiHint();
    updateKeyMappingToggleVisibility();
    if (isTriangleKeyboardMode(keyboardModeSelect.value)) {
      markAutoTrianglesDirty();
      ensureAutoTriangleDiagonals();
    } else {
      clearTriangleKeyboardActiveVoices();
      clearAutoTriangleDiagonals();
      markAutoTrianglesDirty();
    }
    markIsomorphicDirty();
  }
  if (Object.prototype.hasOwnProperty.call(synthState, "customPianoMap")) {
    pendingCustomPianoMap = Array.isArray(synthState.customPianoMap)
      ? synthState.customPianoMap
      : [];
  }
  if (typeof synthState.mode === "string") {
    synthMode = synthState.mode;
  }
  if (waveformSelect && typeof synthState.waveform === "string") {
    waveformSelect.value = synthState.waveform;
  }
  if (physicalModelSelect && typeof synthState.physicalModel === "string") {
    physicalModelSelect.value = synthState.physicalModel;
  }
  if (Number.isFinite(synthState.soundfontPreset)) {
    soundfontPresetIndex = Math.trunc(synthState.soundfontPreset);
  }
  syncSynthModeUI();
  handleSynthTypeChange({
    replaceActiveVoices: !options.preserveActiveVoicesOnSynthChange,
  });
  [
    ["attack", attackSlider],
    ["decay", decaySlider],
    ["release", releaseSlider],
  ].forEach(([key, slider]) => {
    if (Number.isFinite(synthState[key])) {
      setEnvelopeSliderFromValue(slider, Number(synthState[key]));
    }
  });
  if (Number.isFinite(synthState.sustain)) {
    sustainSlider.value = String(synthState.sustain);
  }
  if (oneShotCheckbox && typeof synthState.oneShot === "boolean") {
    setControlChecked(oneShotCheckbox, synthState.oneShot);
  }
  if (typeof synthState.envelopeTimeMode === "string") {
    envelopeTimeMode = synthState.envelopeTimeMode === "tempo" ? "tempo" : "absolute";
    envelopeTimeModeInputs.forEach((input) => {
      input.checked = input.value === envelopeTimeMode;
    });
  }
  updateEnvelopeReadouts();
  updatePatternLengthAvailability();
}

function applyPresetViewState(viewState) {
  if (!viewState) {
    return;
  }
  if (Number.isFinite(viewState.zoom)) {
    view.zoom = clampZoom(viewState.zoom);
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

function getPresetDepthContext(state, layoutState) {
  const activeHasZ = Array.isArray(state.active)
    ? state.active.some((entry) => Array.isArray(entry) && Number(entry[2]) !== 0)
    : false;
  const wants3D = Boolean(state.mode3d) || activeHasZ;
  const layoutHasTilt =
    Boolean(layoutState && layoutState.view && typeof layoutState.view === "object") &&
    (Math.abs(Number(layoutState.view.rotX) || 0) > 1e-6 ||
      Math.abs(Number(layoutState.view.rotY) || 0) > 1e-6);
  const layoutNeedsProjectedDepth =
    Boolean(layoutState && layoutState.mode) && layoutHasTilt;
  const targetDepth = wants3D || layoutNeedsProjectedDepth ? GRID_DEPTH : 1;
  const targetCenterZ = Math.floor(targetDepth / 2);
  return {
    wants3D,
    targetDepth,
    targetCenterZ,
  };
}

function applyPresetModeUiState(wants3D, preserveViewMode) {
  if (mode3dCheckbox) {
    if (!preserveViewMode) {
      setControlChecked(mode3dCheckbox, wants3D);
    }
  }
  if (!preserveViewMode) {
    is3DMode = wants3D;
  }
  isFlattened2D = preserveViewMode ? (!is3DMode && wants3D) : false;
  if (!preserveViewMode) {
    updateNavPanelVisibility();
    syncViewModeControls();
  }
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
  if (!wants3D) {
    clearAxisStack();
  }
  updateAddModeFromShift();
  updateUiHint();
}

function applyPresetSnapshotPayloadState(state) {
  snapshotBaseState = state.snapshotBase || null;
  if (Array.isArray(state.snapshots)) {
    applySnapshotsFromPreset(state.snapshots);
    snapshotActiveIndex = Number.isFinite(state.snapshotActive)
      ? Math.trunc(state.snapshotActive)
      : snapshotActiveIndex;
    updateSnapshotUi();
  }
  if (Array.isArray(state.snapshotsLetters)) {
    applyLetterSnapshotsFromPreset(state.snapshotsLetters);
    snapshotActiveLetterKey = typeof state.snapshotActiveLetter === "string"
      ? state.snapshotActiveLetter
      : snapshotActiveLetterKey;
    updateSnapshotUi();
  }
  applyPresetSnapshotSettings(state.snapshotSettings);
}

function resolvePresetLayoutState(state) {
  return state.layout && typeof state.layout === "object" ? state.layout : null;
}

function applyPresetModeAndGeometrySetup(state, layoutState, options = {}) {
  const preserveViewMode = Boolean(options.preserveViewMode);
  const presetWants3D = Boolean(state.mode3d);
  applyPresetLayoutModeSelection(
    layoutState,
    presetWants3D,
    preserveViewMode,
    Boolean(options.skipLayoutModeSwitch)
  );
  const { pendingLineLabelOverridesState, pendingLineLabelPositionsState } =
    applyPresetTransientState(state);
  const { viewState, wants3D, targetDepth, targetCenterZ, presetTriangles, presetTriangleLabels } =
    applyPresetGeometryState(state, layoutState);
  applyPresetModeUiState(wants3D, preserveViewMode);
  return {
    pendingLineLabelOverridesState,
    pendingLineLabelPositionsState,
    viewState,
    targetDepth,
    targetCenterZ,
    presetTriangles,
    presetTriangleLabels,
  };
}

function initializePresetApplyContext(state, options = {}) {
  applyPresetSnapshotPayloadState(state);
  const layoutState = resolvePresetLayoutState(state);
  const presetModeAndGeometry = applyPresetModeAndGeometrySetup(state, layoutState, options);
  return {
    layoutState,
    ...presetModeAndGeometry,
  };
}

function applyPresetCoreTuningState(state) {
  if (Number.isFinite(state.fundamental)) {
    fundamentalInput.value = String(state.fundamental);
  }
  if (Number.isFinite(state.a4)) {
    a4Input.value = String(state.a4);
  }
  if (typeof state.fundamentalSpelling === "string") {
    fundamentalSpelling = state.fundamentalSpelling === "flat" ? "flat" : "sharp";
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
  if (state.axisRanges && typeof state.axisRanges === "object") {
    const xMin = Math.trunc(Number(state.axisRanges.xMin));
    const xMax = Math.trunc(Number(state.axisRanges.xMax));
    const yMin = Math.trunc(Number(state.axisRanges.yMin));
    const yMax = Math.trunc(Number(state.axisRanges.yMax));
    const zMin = Math.trunc(Number(state.axisRanges.zMin));
    const zMax = Math.trunc(Number(state.axisRanges.zMax));
    const cols = xMax - xMin + 1;
    const rows = yMax - yMin + 1;
    const depth = zMax - zMin + 1;
    if (
      Number.isFinite(xMin) &&
      Number.isFinite(xMax) &&
      Number.isFinite(yMin) &&
      Number.isFinite(yMax) &&
      Number.isFinite(zMin) &&
      Number.isFinite(zMax) &&
      xMin <= xMax &&
      yMin <= yMax &&
      zMin <= zMax &&
      cols >= 1 &&
      rows >= 1 &&
      depth >= 1 &&
      cols <= AXIS_RANGE_MAX_COLS &&
      rows <= AXIS_RANGE_MAX_ROWS &&
      depth <= AXIS_RANGE_MAX_DEPTH
    ) {
      GRID_COLS = cols;
      GRID_ROWS = rows;
      GRID_DEPTH = depth;
    } else {
      GRID_COLS = DEFAULT_GRID_COLS;
      GRID_ROWS = DEFAULT_GRID_ROWS;
      GRID_DEPTH = DEFAULT_GRID_DEPTH;
    }
  } else {
    GRID_COLS = DEFAULT_GRID_COLS;
    GRID_ROWS = DEFAULT_GRID_ROWS;
    GRID_DEPTH = DEFAULT_GRID_DEPTH;
  }
  if (state.exponentOffset && typeof state.exponentOffset === "object") {
    latticeExponentOffset = {
      x: Number(state.exponentOffset.x) || 0,
      y: Number(state.exponentOffset.y) || 0,
      z: Number(state.exponentOffset.z) || 0,
    };
  } else {
    latticeExponentOffset = { x: 0, y: 0, z: 0 };
  }
}

function applyPresetPostRebuildState(
  state,
  presetContext
) {
  applyPresetCustomNodes(state.customNodes);
  if (pendingCustomPianoMap) {
    applyCustomPianoMap(pendingCustomPianoMap);
    pendingCustomPianoMap = null;
  }
  // Ensure layout key-mapping labels reflect restored keyboard/custom-map state immediately.
  updateKeyMappingToggleVisibility();
  syncLayoutKeyMappingControls();
  markCustomPianoMapDirty();
  refreshPatternFromActiveNodes();
  triangleDiagonals.clear();
  triangleLabels.clear();
  applyPresetLineLabelState(
    presetContext.pendingLineLabelOverridesState,
    presetContext.pendingLineLabelPositionsState
  );
  applyPresetTrianglesState(
    presetContext.presetTriangles,
    presetContext.targetCenterZ,
    presetContext.targetDepth
  );
  applyPresetTriangleLabelsState(
    presetContext.presetTriangleLabels,
    presetContext.targetCenterZ,
    presetContext.targetDepth
  );
  applyPendingPresetLayoutState();
  if (state.play && !layoutMode) {
    applyPlayState(state.play);
  }
  draw();
  queuePresetFontRecalc();
}

function applyPresetPreRebuildState(state, presetContext) {
  applyPresetLayoutState(presetContext.layoutState);
  updateLayoutLinkControls();
  applyPresetReadoutAndTuningSettings(state);
  return collectPresetActiveKeys(state);
}

function rebuildFromPresetActiveKeys(activeKeys, options) {
  customNodes = [];
  rebuildLattice(activeKeys, {
    remapTriangles: false,
    remapLayoutOffsets: false,
    stopVoices: !options.skipStopVoices,
  });
}

function applyPresetPreRebuildPipeline(state, presetContext, options) {
  applyPresetCoreTuningState(state);
  applyPresetSpellingAndOctaveState(state);
  applyPresetSynthState(state.synth, options);
  applyPresetViewState(presetContext.viewState);
  return applyPresetPreRebuildState(state, presetContext);
}

function applyPresetPostRebuildPipeline(state, presetContext) {
  applyPresetPostRebuildState(state, presetContext);
}

function runPresetApplyPipeline(state, options, presetContext) {
  const activeKeys = applyPresetPreRebuildPipeline(state, presetContext, options);
  rebuildFromPresetActiveKeys(activeKeys, options);
  applyPresetPostRebuildPipeline(state, presetContext);
}

function applyPresetState(state, options = {}) {
  if (!state || typeof state !== "object") {
    return;
  }
  const normalizedState = normalizePresetStateWithDefaults(state);
  const presetContext = initializePresetApplyContext(normalizedState, options);
  runPresetApplyPipeline(normalizedState, options, presetContext);
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

function collectActiveNodeRatiosForTuner() {
  const seen = new Set();
  return nodes
    .filter((node) => node && node.active)
    .map((node) => reduceFraction(node.numerator, node.denominator))
    .filter((item) => item && item.numerator > 0 && item.denominator > 0)
    .map((item) => ({
      numerator: item.numerator,
      denominator: item.denominator,
      ratio: item.numerator / item.denominator,
    }))
    .sort((a, b) => a.ratio - b.ratio)
    .filter((item) => {
      const key = `${item.numerator}/${item.denominator}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((item) => `${item.numerator}/${item.denominator}`);
}

function collectRatiosFromNodeList(nodeList) {
  const seen = new Set();
  return (Array.isArray(nodeList) ? nodeList : [])
    .filter((node) => node && node.active)
    .map((node) => reduceFraction(node.numerator, node.denominator))
    .filter((item) => item && item.numerator > 0 && item.denominator > 0)
    .map((item) => ({
      numerator: item.numerator,
      denominator: item.denominator,
      ratio: item.numerator / item.denominator,
    }))
    .sort((a, b) => a.ratio - b.ratio)
    .filter((item) => {
      const key = `${item.numerator}/${item.denominator}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((item) => `${item.numerator}/${item.denominator}`);
}

function collectPlayingNodeRatiosForOvertones() {
  const playingIds = new Set();
  voices.forEach((voice) => {
    if (!voice || voice.releasing || !Number.isFinite(voice.nodeId)) {
      return;
    }
    playingIds.add(voice.nodeId);
  });
  if (!playingIds.size) {
    return [];
  }
  const playingNodes = [];
  playingIds.forEach((id) => {
    const node = nodeById.get(id);
    if (node) {
      playingNodes.push(node);
    }
  });
  return collectRatiosFromNodeList(playingNodes);
}

function collectPreferredOvertonesRatios() {
  const playingRatios = collectPlayingNodeRatiosForOvertones();
  if (playingRatios.length) {
    return playingRatios;
  }
  const activeNodeIds = new Set();
  const activeNodes = [];
  const addActiveNode = (node) => {
    if (!node || !node.active) {
      return;
    }
    if (activeNodeIds.has(node.id)) {
      return;
    }
    activeNodeIds.add(node.id);
    activeNodes.push(node);
  };
  nodes.forEach(addActiveNode);
  customNodes.forEach(addActiveNode);
  return collectRatiosFromNodeList(activeNodes);
}

function encodeBase64UrlUtf8(value) {
  const json = JSON.stringify(value);
  const utf8 = encodeURIComponent(json).replace(
    /%([0-9A-F]{2})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16))
  );
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function openOvertonesFromMenu() {
  const ratios = collectPreferredOvertonesRatios();
  const notesText = ratios.join(" ");
  const overtonesStateDoc = {
    format: "overtones-chart-state",
    version: 2,
    savedAt: new Date().toISOString(),
    data: {
      notesText,
    },
  };
  const encoded = encodeBase64UrlUtf8(overtonesStateDoc);
  const target = `./overtones/#o=${encoded}`;
  window.open(target, "_blank", "noopener,noreferrer");
}

function openTunerFromFileMenu() {
  const params = new URLSearchParams();
  const fundamental = Number(fundamentalInput && fundamentalInput.value);
  const a4 = Number(a4Input && a4Input.value);
  if (Number.isFinite(fundamental) && fundamental > 0) {
    params.set("fundamental", String(fundamental));
  }
  if (Number.isFinite(a4) && a4 > 0) {
    params.set("a4", String(a4));
  }
  const ratios = collectActiveNodeRatiosForTuner();
  if (ratios.length) {
    params.set("ratios", ratios.join(","));
  }
  const query = params.toString();
  const target = `./tuner/${query ? `?${query}` : ""}`;
  window.open(target, "_blank", "noopener,noreferrer");
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

function escapeSvgText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildHejiSvgText({
  x,
  y,
  baseText,
  suffix,
  restText,
  font,
  size,
  anchor,
  baseline,
  color,
}) {
  const baseSpan = `<tspan>${escapeSvgText(baseText)}</tspan>`;
  const suffixSpan = suffix
    ? `<tspan font-family="HEJI2Text">${escapeSvgText(suffix)}</tspan>`
    : "";
  const restSpan = restText ? `<tspan>${escapeSvgText(restText)}</tspan>` : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="${baseline}" font-family="${escapeSvgText(
    font
  )}" font-size="${size}" ${svgColorAttr("fill", color)}>${baseSpan}${suffixSpan}${restSpan}</text>`;
}

async function buildHejiSvgInline({
  x,
  y,
  baseText,
  suffixParts,
  restText,
  font,
  size,
  align,
  baseline,
  hejiYOffset = 0.5,
  restGapScale = HEJI_REST_GAP,
  restHejiAccidentals = false,
  fontWeight = 400,
  color,
}) {
  const suffixSpacing = Math.round(size * 0.08);
  const partGap = Math.round(size * 0.1);
  const baseSuffixGap = Math.round(size * 0.1);
  const restGap = Math.round(size * restGapScale);
  const baseWidth = await measureSvgTextWidth(baseText, size, font, fontWeight);
  const parts = Array.isArray(suffixParts) ? suffixParts : [];
  const suffixWidths = await Promise.all(
    parts.map((part) => measureSvgSuffixPartWidth(part, size, suffixSpacing, fontWeight))
  );
  const suffixWidth = suffixWidths.reduce(
    (sum, partWidth, index) => sum + partWidth + (index > 0 ? partGap : 0),
    0
  );
  const restWidth = restText
    ? await measureSvgTextWidth(restText, size, font, fontWeight)
    : 0;
  const totalWidth =
    baseWidth +
    (parts.length ? baseSuffixGap + suffixWidth : 0) +
    (restText ? restGap + restWidth : 0);
  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }

  const nodes = [];
  nodes.push(
    await buildSvgTextElement({
      text: baseText,
      x: startX,
      y,
      font,
      size,
      fontWeight,
      anchor: "start",
      baseline,
      color,
    })
  );

  let cursorX = startX + baseWidth;
  if (parts.length) {
    cursorX += baseSuffixGap;
    for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
      const part = parts[partIndex];
      if (partIndex > 0) {
        cursorX += partGap;
      }
      const partCharGap = Number.isFinite(part.charGap) ? part.charGap : suffixSpacing;
      const partStartX = cursorX;
      const partWidth = suffixWidths[partIndex] ?? 0;
      const partFont = part.font || "HEJI2Text";
      const partWeight = Number.isFinite(part.fontWeight)
        ? part.fontWeight
        : part.font
        ? fontWeight
        : 400;
      const partYOffset =
        typeof part.yOffset === "number" ? part.yOffset : hejiYOffset;
      const sizeScale = Number.isFinite(part.sizeScale) ? part.sizeScale : 1;
      const partChars = Array.from(part.text);
      for (let index = 0; index < partChars.length; index += 1) {
        const char = partChars[index];
        if (index > 0) {
          cursorX += partCharGap;
        }
        const baseSize = char === CENTS_CHAR ? getCentsCharSize(size) : size;
        const charSize = Math.max(6, Math.round(baseSize * sizeScale));
        nodes.push(
          await buildSvgTextElement({
            text: char,
            x: cursorX,
            y: y + partYOffset,
            font: partFont,
            size: charSize,
            fontWeight: partWeight,
            anchor: "start",
            baseline,
            color,
          })
        );
        cursorX += await measureSvgCharWidth(char, charSize, partFont, partWeight);
      }
      if (part.expLabel) {
        const expSize = Math.max(8, Math.round(size * 0.55));
        const expY =
          y +
          (typeof part.yOffset === "number" ? part.yOffset : hejiYOffset) +
          getExponentOffset(size, baseline);
        nodes.push(
          await buildSvgTextElement({
            text: part.expLabel,
            x: partStartX + partWidth / 2,
            y: expY,
            font,
            size: expSize,
            fontWeight,
            anchor: "middle",
            baseline: "hanging",
            color,
          })
        );
      }
    }
  }

  if (restText) {
    cursorX += restGap;
    const chars = Array.from(restText);
    const needsInline =
      restHejiAccidentals || restText.includes(CENTS_CHAR) || /[veV]/.test(restText);
    if (!needsInline) {
      nodes.push(
        await buildSvgTextElement({
          text: restText,
          x: cursorX,
          y,
          font,
          size,
          fontWeight,
          anchor: "start",
          baseline,
          color,
        })
      );
    } else {
      for (let index = 0; index < chars.length; index += 1) {
        const char = chars[index];
        const useHeji = char === "v" || char === "e" || char === "V";
        const isCent = char === CENTS_CHAR;
        const charSize = isCent ? getCentsCharSize(size) : size;
        const charFont = useHeji ? "HEJI2Text" : font;
        const charWeight = useHeji ? "normal" : fontWeight;
        nodes.push(
          await buildSvgTextElement({
            text: char,
            x: cursorX,
            y: y + (useHeji ? hejiYOffset : 0),
            font: charFont,
            size: charSize,
            fontWeight: useHeji ? 400 : fontWeight,
            anchor: "start",
            baseline,
            color,
          })
        );
        cursorX += await measureSvgCharWidth(
          char,
          charSize,
          charFont,
          useHeji ? 400 : fontWeight
        );
      }
    }
  }

  return nodes.join("\n");
}

const LEXEND_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Inter:wght@100..900&family=IBM+Plex+Sans:wght@200..700&family=Lato:wght@300..900&family=PT+Sans:wght@400..700&family=PT+Serif:wght@400..700&family=Radley:ital,wght@0,400;1,400&family=Alice&family=Noto+Serif:wght@400..700&display=swap";

function getHejiFontUrl() {
  try {
    return new URL("./HEJI2Text.otf", import.meta.url).href;
  } catch (error) {
    return "./src/HEJI2Text.otf";
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function buildFontDataUrl(url, mimeType) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Font fetch failed");
    }
    const buffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    return null;
  }
}

function getFontMimeType(url) {
  const lower = String(url).toLowerCase();
  if (lower.endsWith(".woff2")) {
    return "font/woff2";
  }
  if (lower.endsWith(".woff")) {
    return "font/woff";
  }
  if (lower.endsWith(".ttf")) {
    return "font/ttf";
  }
  if (lower.endsWith(".otf")) {
    return "font/otf";
  }
  return "application/octet-stream";
}

async function inlineFontCssFromUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return "";
    }
    let css = await response.text();
    const urlMatches = Array.from(css.matchAll(/url\(([^)]+)\)/g));
    const replacements = new Map();
    for (const match of urlMatches) {
      const raw = match[1].trim().replace(/^['"]|['"]$/g, "");
      if (raw.startsWith("data:") || replacements.has(raw)) {
        continue;
      }
      try {
        const fontResponse = await fetch(raw);
        if (!fontResponse.ok) {
          continue;
        }
        const buffer = await fontResponse.arrayBuffer();
        const base64 = arrayBufferToBase64(buffer);
        const mimeType = getFontMimeType(raw);
        replacements.set(raw, `data:${mimeType};base64,${base64}`);
      } catch (error) {
        continue;
      }
    }
    replacements.forEach((dataUrl, raw) => {
      css = css.split(raw).join(dataUrl);
    });
    return css;
  } catch (error) {
    return "";
  }
}

async function getExportFontCss(hejiFontSrc = null) {
  const hejiFontUrl = hejiFontSrc || getHejiFontUrl();
  const inlineGoogleCss = await inlineFontCssFromUrl(LEXEND_FONT_URL);
  const googleCss = inlineGoogleCss || `@import url("${LEXEND_FONT_URL}");`;
  return `${googleCss}
@font-face { font-family: "HEJI2Text"; src: url("${hejiFontUrl}") format("opentype"); font-display: swap; }`;
}

function analyzeExportFontCss(css) {
  const content = String(css || "");
  const hasImport = content.includes("@import");
  const embeddedFonts = (content.match(/data:font\//g) || []).length;
  const hasHejiData = content.includes("HEJI2Text") && content.includes("data:font/");
  return { hasImport, embeddedFonts, hasHejiData };
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) {
    return "n/a";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  return `${(kb / 1024).toFixed(2)} MB`;
}

function getExportMetadataLabel() {
  const creator = layoutCreator ? layoutCreator.trim() : "";
  const title = layoutTitle ? layoutTitle.trim() : "";
  const safeCreator = creator || "Creator";
  const safeTitle = title || "Title";
  return `${safeCreator} - ${safeTitle} [tuninglattice.com]`;
}

function normalizeSvgColor(color) {
  if (!color) {
    return { color: "none", opacity: null };
  }
  const trimmed = String(color).trim();
  if (trimmed === "none" || trimmed === "transparent") {
    return { color: trimmed, opacity: null };
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
      const opacity = Number.isFinite(a) ? Math.max(0, Math.min(1, a)) : 1;
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
    const opacity = Math.max(0, Math.min(1, a / 255));
    return { color: rgb, opacity };
  }
  return { color: trimmed, opacity: null };
}

function svgColorAttr(name, color) {
  const normalized = normalizeSvgColor(color);
  const base = `${name}="${normalized.color}"`;
  if (normalized.opacity === null || normalized.color === "none") {
    return base;
  }
  const opacity = Number(normalized.opacity.toFixed(3));
  return `${base} ${name}-opacity="${opacity}"`;
}

const OUTLINE_SVG_TEXT = true;
const OUTLINE_FONT_FILES = {
  Lexend: {
    200: "fonts/Lexend-ExtraLight.ttf",
    300: "fonts/Lexend-Light.ttf",
    400: "fonts/Lexend-Regular.ttf",
    500: "fonts/Lexend-Medium.ttf",
    600: "fonts/Lexend-SemiBold.ttf",
    700: "fonts/Lexend-Bold.ttf",
  },
  Inter: {
    200: "fonts/Inter-ExtraLight.ttf",
    300: "fonts/Inter-Light.ttf",
    400: "fonts/Inter-Regular.ttf",
    500: "fonts/Inter-Medium.ttf",
    600: "fonts/Inter-SemiBold.ttf",
    700: "fonts/Inter-Bold.ttf",
  },
  "IBM Plex Sans": {
    200: "fonts/IBMPlexSans-ExtraLight.ttf",
    300: "fonts/IBMPlexSans-Light.ttf",
    400: "fonts/IBMPlexSans-Regular.ttf",
    500: "fonts/IBMPlexSans-Medium.ttf",
    600: "fonts/IBMPlexSans-SemiBold.ttf",
    700: "fonts/IBMPlexSans-Bold.ttf",
  },
  Lato: {
    300: "fonts/Lato-Light.ttf",
    400: "fonts/Lato-Regular.ttf",
    700: "fonts/Lato-Bold.ttf",
    900: "fonts/Lato-Black.ttf",
  },
  "PT Sans": {
    400: "fonts/PT_Sans-Web-Regular.ttf",
    700: "fonts/PT_Sans-Web-Bold.ttf",
  },
  "PT Serif": {
    400: "fonts/PT_Serif-Web-Regular.ttf",
    700: "fonts/PT_Serif-Web-Bold.ttf",
  },
  "Noto Serif": {
    400: "fonts/NotoSerif-Regular.ttf",
    500: "fonts/NotoSerif-Medium.ttf",
    600: "fonts/NotoSerif-SemiBold.ttf",
    700: "fonts/NotoSerif-Bold.ttf",
  },
  Radley: { 400: "fonts/Radley-Regular.ttf" },
  Alice: { 400: "fonts/Alice-Regular.ttf" },
  iAWriterDuoS: {
    400: "fonts/iAWriterDuoS-Regular.ttf",
    700: "fonts/iAWriterDuoS-Bold.ttf",
  },
  iAWriterMonoS: {
    400: "fonts/iAWriterMonoS-Regular.ttf",
    700: "fonts/iAWriterMonoS-Bold.ttf",
  },
  HEJI2Text: { 400: "HEJI2Text.otf" },
};
const outlineFontCache = new Map();

function resolveOutlineFontFile(fontFamily, fontWeight = 400) {
  const family = OUTLINE_FONT_FILES[fontFamily];
  if (!family) {
    return null;
  }
  const weight = Number(fontWeight) || 400;
  if (family[weight]) {
    return family[weight];
  }
  const available = Object.keys(family)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (!available.length) {
    return null;
  }
  let best = available[0];
  let bestDelta = Math.abs(weight - best);
  available.slice(1).forEach((candidate) => {
    const delta = Math.abs(weight - candidate);
    if (delta < bestDelta) {
      best = candidate;
      bestDelta = delta;
    }
  });
  return family[best];
}

async function loadOutlineFont(fontFamily, fontWeight) {
  const file = resolveOutlineFontFile(fontFamily, fontWeight);
  if (!file) {
    return null;
  }
  if (!outlineFontCache.has(file)) {
    const url = new URL(`./${file}`, import.meta.url).href;
    const promise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Font fetch failed");
        }
        return response.arrayBuffer();
      })
      .then((buffer) => opentype.parse(buffer))
      .catch(() => null);
    outlineFontCache.set(file, promise);
  }
  return outlineFontCache.get(file);
}

async function getOutlineFontOrFallback(fontFamily, fontWeight) {
  const primary = await loadOutlineFont(fontFamily, fontWeight);
  if (primary) {
    return primary;
  }
  if (fontFamily === "Noto Serif") {
    return null;
  }
  return loadOutlineFont("Noto Serif", fontWeight);
}

async function measureSvgTextWidth(text, size, font, fontWeight = 400) {
  if (!OUTLINE_SVG_TEXT) {
    return measureTextWidthWithWeight(text, size, font, fontWeight);
  }
  const fontObj = await getOutlineFontOrFallback(font, fontWeight);
  if (!fontObj) {
    return measureTextWidthWithWeight(text, size, font, fontWeight);
  }
  return fontObj.getAdvanceWidth(text, size);
}

async function measureSvgCharWidth(char, size, font, fontWeight = 400) {
  if (!OUTLINE_SVG_TEXT) {
    return measureCharWidth(char, size, font, fontWeight);
  }
  const fontObj = await getOutlineFontOrFallback(font, fontWeight);
  if (!fontObj) {
    return measureCharWidth(char, size, font, fontWeight);
  }
  return fontObj.getAdvanceWidth(char, size);
}

async function measureSvgSuffixPartWidth(part, size, charGap, baseWeight) {
  if (!part || !part.text) {
    return 0;
  }
  const sizeScale = Number.isFinite(part.sizeScale) ? part.sizeScale : 1;
  const font = part.font || "HEJI2Text";
  const partCharGap = Number.isFinite(part.charGap) ? part.charGap : charGap;
  const weight = Number.isFinite(part.fontWeight)
    ? part.fontWeight
    : part.font
    ? baseWeight
    : 400;
  const chars = Array.from(part.text);
  const widths = await Promise.all(
    chars.map((char) => {
      const baseSize = char === CENTS_CHAR ? getCentsCharSize(size) : size;
      const charSize = Math.max(6, Math.round(baseSize * sizeScale));
      return measureSvgCharWidth(char, charSize, font, weight);
    })
  );
  return widths.reduce((sum, width, index) => sum + width + (index > 0 ? partCharGap : 0), 0);
}

async function buildSvgTextElement({
  text,
  x,
  y,
  font,
  size,
  fontWeight = 400,
  anchor = "start",
  baseline = "alphabetic",
  color,
  transform = "",
}) {
  const safeText = text == null ? "" : String(text);
  if (!safeText) {
    return "";
  }
  if (!OUTLINE_SVG_TEXT) {
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="${baseline}" font-family="${escapeSvgText(
      font
    )}" font-size="${size}" font-weight="${fontWeight}" ${transform ? `transform="${transform}" ` : ""}${svgColorAttr(
      "fill",
      color
    )}>${escapeSvgText(safeText)}</text>`;
  }
  const fontObj = await getOutlineFontOrFallback(font, fontWeight);
  if (!fontObj) {
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="${baseline}" font-family="${escapeSvgText(
      font
    )}" font-size="${size}" font-weight="${fontWeight}" ${transform ? `transform="${transform}" ` : ""}${svgColorAttr(
      "fill",
      color
    )}>${escapeSvgText(safeText)}</text>`;
  }
  const ascent = (fontObj.ascender / fontObj.unitsPerEm) * size;
  const descent = (-fontObj.descender / fontObj.unitsPerEm) * size;
  let baselineY = y;
  if (baseline === "middle") {
    baselineY = y + (ascent - descent) / 2;
  } else if (baseline === "text-before-edge" || baseline === "hanging") {
    baselineY = y + ascent;
  }
  let anchorX = x;
  const advance = fontObj.getAdvanceWidth(safeText, size);
  if (anchor === "middle") {
    anchorX = x - advance / 2;
  } else if (anchor === "end") {
    anchorX = x - advance;
  }
  const pathData = fontObj.getPath(safeText, anchorX, baselineY, size).toPathData(2);
  return `<path d="${pathData}" ${transform ? `transform="${transform}" ` : ""}${svgColorAttr(
    "fill",
    color
  )} />`;
}

function measureFontMetrics(sample, size, font, fontWeight = 400) {
  ctx.save();
  ctx.font = `${fontWeight} ${size}px ${font}`;
  const metrics = ctx.measureText(sample);
  ctx.restore();
  return {
    ascent: Number(metrics.actualBoundingBoxAscent) || size * 0.8,
    descent: Number(metrics.actualBoundingBoxDescent) || size * 0.2,
  };
}

function getSvgTopBaselineOffset(size, font, fontWeight) {
  const metrics = measureFontMetrics("H", size, font, fontWeight);
  return Math.round(metrics.ascent);
}

async function ensureFontLoaded(font, size) {
  if (!document.fonts || !document.fonts.load) {
    return;
  }
  try {
    await document.fonts.load(`${Math.max(6, Math.round(size))}px "${font}"`);
  } catch (error) {
    // Ignore font loading errors; we will fall back to default metrics.
  }
}

function ensureUiFontReady(font, weight = 400, size = 16) {
  if (!document.fonts || !document.fonts.load) {
    return Promise.resolve();
  }
  const safeWeight = Number(weight) || 400;
  const safeSize = Math.max(6, Math.round(size));
  return document.fonts.load(`${safeWeight} ${safeSize}px "${font}"`).catch(() => {});
}

let presetFontRecalcTimer = null;

function queuePresetFontRecalc() {
  if (presetFontRecalcTimer) {
    clearTimeout(presetFontRecalcTimer);
  }
  presetFontRecalcTimer = setTimeout(() => {
    presetFontRecalcTimer = null;
    const tasks = [];
    const add = (font, weight, size) => {
      if (!font) {
        return;
      }
      tasks.push(ensureUiFontReady(font, weight, size));
    };
    add(layoutTitleFont, layoutTitleFontWeight, layoutTitleSize);
    add(layoutCreatorFont, layoutCreatorFontWeight, layoutCreatorSize);
    add(layoutRatioFont, layoutRatioFontWeight, layoutRatioTextSize);
    add(layoutNoteFont, layoutNoteFontWeight, layoutNoteTextSize);
    add(layoutTriangleLabelFont, layoutTriangleLabelFontWeight, layoutTriangleLabelTextSize);
    add(layoutCustomLabelFont, layoutCustomLabelFontWeight, layoutCustomLabelTextSize);
    add(layoutKeyMappingFont, layoutKeyMappingFontWeight, layoutKeyMappingTextSize);
    add(layoutAxisLegendFont, layoutAxisLegendFontWeight, layoutAxisLegendTextSize);
    add(layoutLineLabelFont, layoutLineLabelFontWeight, layoutLineLabelTextSize);
    add("HEJI2Text", 400, layoutNoteTextSize);
    Promise.all(tasks).finally(() => {
      invalidateLabelCache({ clearTextWidths: true });
      draw();
    });
  }, 0);
}

async function getSvgHejiYOffset(size, baseFont, baseWeight) {
  await Promise.all([
    ensureFontLoaded("HEJI2Text", size),
    ensureFontLoaded(baseFont, size),
  ]);
  const baseMetrics = measureFontMetrics("H", size, baseFont, baseWeight);
  const hejiMetrics = measureFontMetrics("v", size, "HEJI2Text", 400);
  const ascentDelta = baseMetrics.ascent - hejiMetrics.ascent;
  return Math.round(size * (HEJI_SUFFIX_Y_OFFSET + HEJI_SVG_EXTRA_Y_OFFSET) + ascentDelta);
}

async function buildLayoutSvgString(
  hejiFontSrc = null,
  detailHejiYOffset = null,
  fontCss = null,
  noteBaselineOffset = null,
  labelHejiYOffset = null
) {
  if (!layoutMode) {
    return null;
  }
  if (!themeColors) {
    refreshThemeColors();
  }
  const { widthIn, heightIn, widthPx, heightPx } = getLayoutPageDimensions();
  const { left, top } = getLayoutPageRect();
  const disableScale = shouldDisableLayoutScale();
  const labelSize = layoutRatioTextSize;
  const detailSize = layoutNoteTextSize;
  const titleSize = Math.max(12, Math.round(layoutTitleSize));
  const creatorSize = getLayoutCreatorSize();
  const exportLabel = getExportMetadataLabel();
  const svgDetailHejiYOffset = Number.isFinite(detailHejiYOffset)
    ? detailHejiYOffset
    : Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET);
  const svgLabelHejiYOffset = Number.isFinite(labelHejiYOffset)
    ? labelHejiYOffset
    : Math.round(labelSize * HEJI_SUFFIX_Y_OFFSET);
  const svgNoteBaselineOffset = Number.isFinite(noteBaselineOffset)
    ? noteBaselineOffset
    : 0;
  const svgFill = (color) => svgColorAttr("fill", color);
  const svgStroke = (color) => svgColorAttr("stroke", color);

  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${widthIn}in" height="${heightIn}in" viewBox="0 0 ${widthPx} ${heightPx}">`
  );
  parts.push(`<title>${escapeSvgText(exportLabel)}</title>`);
  parts.push(`<desc>${escapeSvgText(exportLabel)}</desc>`);
  const resolvedFontCss =
    typeof fontCss === "string" && fontCss.trim()
      ? fontCss
      : `@import url("${LEXEND_FONT_URL}");`;
  parts.push(`<defs><style><![CDATA[${resolvedFontCss}]]></style></defs>`);
  parts.push(`<rect width="100%" height="100%" ${svgFill(themeColors.page)}/>`);

  if (layoutTitle) {
    const titlePos = getLayoutTitlePosition();
    const titleX = layoutTitlePosition
      ? layoutTitlePosition.x
      : widthPx / 2;
    const titleY = layoutTitlePosition
      ? layoutTitlePosition.y
      : Math.max(12, titlePos.y - top);
    parts.push(
      await buildSvgTextElement({
        text: layoutTitle,
        x: titleX,
        y: titleY,
        font: layoutTitleFont,
        size: titleSize,
        fontWeight: layoutTitleFontWeight,
        anchor: "middle",
        baseline: "text-before-edge",
        color: themeColors.textPrimary,
      })
    );
  }
  if (layoutCreator) {
    const creatorPos = getLayoutCreatorPosition();
    const creatorX = creatorPos.x - left;
    const creatorY = Math.max(12, creatorPos.y - top);
    parts.push(
      await buildSvgTextElement({
        text: layoutCreator,
        x: creatorX,
        y: creatorY,
        font: layoutCreatorFont,
        size: creatorSize,
        fontWeight: layoutCreatorFontWeight,
        anchor: "middle",
        baseline: "text-before-edge",
        color: themeColors.textSecondary,
      })
    );
  }

  const axisSettings = getAxisLegendSettings();
  const axisColor = themeColors.textSecondary;
  const axisStroke = 1.5;
  const axisDefs = [
    getAxisLegendInfo("x", axisSettings),
    getAxisLegendInfo("y", axisSettings),
    getAxisLegendInfo("z", axisSettings),
  ];
  for (const info of axisDefs) {
    if (!info) {
      continue;
    }
    const centerX = info.center.x - left;
    const centerY = info.center.y - top;
    const leftStart = {
      x: centerX - info.gapVec.x,
      y: centerY - info.gapVec.y,
    };
    const leftEnd = {
      x: info.leftEnd.x - left,
      y: info.leftEnd.y - top,
    };
    const rightStart = {
      x: centerX + info.gapVec.x,
      y: centerY + info.gapVec.y,
    };
    const rightEnd = {
      x: info.rightEnd.x - left,
      y: info.rightEnd.y - top,
    };
    const buildArrow = (x1, y1, x2, y2) => {
      const headLength = 10;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const p1 = `${x2},${y2}`;
      const p2 = `${x2 - headLength * Math.cos(angle - Math.PI / 6)},${y2 -
        headLength * Math.sin(angle - Math.PI / 6)}`;
      const p3 = `${x2 - headLength * Math.cos(angle + Math.PI / 6)},${y2 -
        headLength * Math.sin(angle + Math.PI / 6)}`;
      parts.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${svgStroke(
          axisColor
        )} stroke-width="${axisStroke}" />`
      );
      parts.push(
        `<polygon points="${p1} ${p2} ${p3}" ${svgFill(axisColor)} />`
      );
    };
    buildArrow(leftStart.x, leftStart.y, leftEnd.x, leftEnd.y);
    buildArrow(rightStart.x, rightStart.y, rightEnd.x, rightEnd.y);
    const rotation = (info.textAngle * 180) / Math.PI;
    parts.push(
      await buildSvgTextElement({
        text: info.label,
        x: centerX,
        y: centerY,
        font: layoutAxisLegendFont,
        size: axisSettings.fontSize,
        fontWeight: layoutAxisLegendFontWeight,
        anchor: "middle",
        baseline: "middle",
        color: axisColor,
        transform: `rotate(${rotation} ${centerX} ${centerY})`,
      })
    );
  }

  if (layoutCustomLabels.length) {
    const customSize = Math.max(8, Math.round(layoutCustomLabelTextSize));
    for (const entry of layoutCustomLabels) {
      if (!entry.text || !entry.position) {
        continue;
      }
      const x = entry.position.x;
      const y = entry.position.y;
      parts.push(
        await buildSvgTextElement({
          text: entry.text,
          x,
          y,
          font: layoutCustomLabelFont,
          size: customSize,
          fontWeight: layoutCustomLabelFontWeight,
          anchor: "middle",
          baseline: "hanging",
          color: themeColors.textSecondary,
        })
      );
    }
  }

  const exportNodeRenderList = nodes
    .map((node) => ({
      node,
      pos: worldToScreen(getNodeDisplayCoordinate(node), disableScale),
    }))
    .sort((a, b) => {
      if (a.node.isCustom && !b.node.isCustom) {
        return 1;
      }
      if (!a.node.isCustom && b.node.isCustom) {
        return -1;
      }
      return a.pos.depth - b.pos.depth;
    });
  const exportNodePosMap = new Map();
  exportNodeRenderList.forEach(({ node, pos }) => {
    exportNodePosMap.set(node.id, { pos, radius: getLayoutNodeRadius(pos) });
  });
  const exportDetailLabelSegments = [];
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(a, b)) {
      return;
    }
    const startEntry = exportNodePosMap.get(a.id);
    const endEntry = exportNodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      return;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      return;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
    const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
    exportDetailLabelSegments.push({
      x1: start.x + ux * startRadius,
      y1: start.y + uy * startRadius,
      x2: end.x - ux * endRadius,
      y2: end.y - uy * endRadius,
    });
  });
  addCustomConnectionSegments(exportNodePosMap, exportDetailLabelSegments);
  addTriangleDiagonalSegments(exportNodePosMap, exportDetailLabelSegments);
  addDistanceLineSegments(exportNodePosMap, exportDetailLabelSegments);
  const exportDetailLabelCollision = {
    circles: exportNodeRenderList
      .filter(({ node }) => node.isCenter || node.active || node.isCustom)
      .map(({ node, pos }) => ({
        id: node.id,
        x: pos.x,
        y: pos.y,
        r: getLayoutNodeRadius(pos),
      })),
    segments: exportDetailLabelSegments,
    rects: [],
  };
  const getExportDetailLabelPosition = (node, pos, radius, width, height) => {
    if (layoutLabelOffsets.has(node.id)) {
      const rawLabelPos = getLayoutNoteLabelPosition(node, pos, radius);
      exportDetailLabelCollision.rects.push({
        left: rawLabelPos.x,
        top: rawLabelPos.y,
        right: rawLabelPos.x + width,
        bottom: rawLabelPos.y + height,
      });
      return rawLabelPos;
    }
    return getDetailLabelPosition({
      center: pos,
      baseOffset: getDefaultNoteDetailOffset(radius, 1),
      width,
      height,
      circles: exportDetailLabelCollision.circles,
      placedRects: exportDetailLabelCollision.rects,
      segments: exportDetailLabelCollision.segments,
      ignoreId: node.id,
    });
  };

  const edgeLabelSize = getLayoutLineLabelSize();
  const lineLabelFont = layoutLineLabelFont;
  const lineLabelWeight = layoutLineLabelFontWeight;
  for (const [a, b] of edges) {
    if (!a.active || !b.active) {
      continue;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(a, b)) {
      continue;
    }
    const startEntry = exportNodePosMap.get(a.id);
    const endEntry = exportNodePosMap.get(b.id);
    if (!startEntry || !endEntry) {
      continue;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const radiusA = startEntry.radius;
    const radiusB = endEntry.radius;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      continue;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = getNodeEdgeRadius(a, ux, uy, radiusA);
    const endRadius = getNodeEdgeRadius(b, ux, uy, radiusB);
    const edgeStart = {
      x: start.x + ux * startRadius - left,
      y: start.y + uy * startRadius - top,
    };
    const edgeEnd = {
      x: end.x - ux * endRadius - left,
      y: end.y - uy * endRadius - top,
    };
    const lineLen = Math.max(0, dist - startRadius - endRadius);
    const labelText = getEdgeLabelText(a, b);
    const label = shouldShowEdgeLabel(a, b) ? labelText : null;
    const pushLine = (from, to) => {
      parts.push(
        `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" ${svgStroke(
          themeColors.edge
        )} stroke-width="1.5" />`
      );
    };
    if (label && lineLen > 0) {
      const baseWidth = await measureSvgTextWidth(
        label,
        edgeLabelSize,
        lineLabelFont,
        lineLabelWeight
      );
      const layout = computeEdgeLabelLayoutFromWidth({
        baseSize: edgeLabelSize,
        baseWidth,
        lineLen,
        minSize: 4,
      });
      const size = layout.size;
      const gap = layout.gap;
      const labelT = getLineLabelPositionOverride(a, b) ?? 0.5;
      if (gap > 0) {
        const gapHalf = gap / 2;
        const midX = edgeStart.x + (edgeEnd.x - edgeStart.x) * labelT;
        const midY = edgeStart.y + (edgeEnd.y - edgeStart.y) * labelT;
        const gapStart = {
          x: midX - ux * gapHalf,
          y: midY - uy * gapHalf,
        };
        const gapEnd = {
          x: midX + ux * gapHalf,
          y: midY + uy * gapHalf,
        };
        pushLine(edgeStart, gapStart);
        pushLine(gapEnd, edgeEnd);
        let angle = 0;
        if (Math.abs(edgeEnd.x - edgeStart.x) > 1e-6 || Math.abs(edgeEnd.y - edgeStart.y) > 1e-6) {
          angle = Math.atan2(edgeEnd.y - edgeStart.y, edgeEnd.x - edgeStart.x);
          if (!shouldUseHorizontalText(angle)) {
            if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
              angle += Math.PI;
            }
          } else {
            angle = 0;
          }
        }
        const rotation = (angle * 180) / Math.PI;
        parts.push(
          await buildSvgTextElement({
            text: label,
            x: midX,
            y: midY,
            font: lineLabelFont,
            size,
            fontWeight: lineLabelWeight,
            anchor: "middle",
            baseline: "middle",
            color: themeColors.textSecondary,
            transform: `rotate(${rotation} ${midX} ${midY})`,
          })
        );
      } else {
        pushLine(edgeStart, edgeEnd);
      }
    } else {
      pushLine(edgeStart, edgeEnd);
    }
  }

  if (analysisLayers.distances && distanceSelectedEdges.size) {
    const distanceNodePosMap = new Map();
    nodes.forEach((node) => {
      const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
      distanceNodePosMap.set(node.id, { pos, radius: getLayoutNodeRadius(pos) });
    });
    const labelFont = layoutLineLabelFont;
    const labelWeight = layoutLineLabelFontWeight;
    const labelSize = getLayoutLineLabelSize();
    const drawCurveSegment = (segment) => {
      parts.push(
        `<path d="M ${segment.p0.x} ${segment.p0.y} Q ${segment.p1.x} ${segment.p1.y} ${segment.p2.x} ${segment.p2.y}" ${svgStroke(
          themeColors.edge
        )} stroke-width="1.5" stroke-dasharray="6 6" fill="none" />`
      );
    };
    for (const edgeKey of distanceSelectedEdges) {
      if (!edgeKey) {
        continue;
      }
      const partsKey = edgeKey.split("|");
      if (partsKey.length !== 2) {
        continue;
      }
      const [aKey, bKey] = partsKey;
      const a = getNodeByDistanceKey(aKey);
      const b = getNodeByDistanceKey(bKey);
      if (!a || !b || !a.active || !b.active) {
        continue;
      }
      const startEntry = distanceNodePosMap.get(a.id);
      const endEntry = distanceNodePosMap.get(b.id);
      if (!startEntry || !endEntry) {
        continue;
      }
      const override = getDistanceEdgeOverride(edgeKey);
      if (override && override.hidden) {
        continue;
      }
      const ratioInfo = getDistanceRatioLabel(a, b);
      if (!ratioInfo) {
        continue;
      }
      const showName = !override || override.showName !== false;
      const customText =
        override && typeof override.customText === "string" ? override.customText.trim() : "";
      const commaName = showName
        ? getDistanceCommaName(ratioInfo.numerator, ratioInfo.denominator)
        : "";
      const baseLabel = showName
        ? customText
          ? `${ratioInfo.label} ${customText}`
          : ratioInfo.label
        : customText;
      const label =
        baseLabel && commaName && showName ? `${baseLabel} (${commaName})` : baseLabel;
      if (!label) {
        continue;
      }
      const start = startEntry.pos;
      const end = endEntry.pos;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (!dist) {
        continue;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const straightStartRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
      const straightEndRadius = getNodeEdgeRadius(b, -ux, -uy, endEntry.radius);
      let lineStart = {
        x: start.x + ux * straightStartRadius - left,
        y: start.y + uy * straightStartRadius - top,
      };
      let lineEnd = {
        x: end.x - ux * straightEndRadius - left,
        y: end.y - uy * straightEndRadius - top,
      };
      const autoControl = getAutoDistanceControl(
        { x: lineStart.x + left, y: lineStart.y + top },
        { x: lineEnd.x + left, y: lineEnd.y + top },
        distanceNodePosMap,
        a,
        b
      );
      const defaultControl = { x: autoControl.x - left, y: autoControl.y - top };
      let controlOffset = override && override.controlOffset ? override.controlOffset : null;
      if (!controlOffset && override && override.control) {
        controlOffset = {
          x: override.control.x - defaultControl.x,
          y: override.control.y - defaultControl.y,
        };
      }
      const control = controlOffset
        ? { x: defaultControl.x + controlOffset.x, y: defaultControl.y + controlOffset.y }
        : defaultControl;
      const startVector = { x: control.x - lineStart.x, y: control.y - lineStart.y };
      const endVector = { x: control.x - lineEnd.x, y: control.y - lineEnd.y };
      const startLen = Math.hypot(startVector.x, startVector.y);
      const endLen = Math.hypot(endVector.x, endVector.y);
      const startUx = startLen > 0 ? startVector.x / startLen : ux;
      const startUy = startLen > 0 ? startVector.y / startLen : uy;
      const endUx = endLen > 0 ? endVector.x / endLen : -ux;
      const endUy = endLen > 0 ? endVector.y / endLen : -uy;
      const startRadius = getNodeEdgeRadius(a, startUx, startUy, startEntry.radius);
      const endRadius = getNodeEdgeRadius(b, endUx, endUy, endEntry.radius);
      lineStart = {
        x: start.x + startUx * startRadius - left,
        y: start.y + startUy * startRadius - top,
      };
      lineEnd = {
        x: end.x + endUx * endRadius - left,
        y: end.y + endUy * endRadius - top,
      };
      const labelT = override && Number.isFinite(override.labelT) ? override.labelT : 0.5;
      const curveInfo = buildQuadraticCurveInfo(lineStart, control, lineEnd);
      const t = curveInfo.tAtRatio(labelT);
      const labelPos = getQuadraticPoint(lineStart, control, lineEnd, t);
      const tangent = getQuadraticTangent(lineStart, control, lineEnd, t);
      const baseWidth = await measureSvgTextWidth(label, labelSize, labelFont, labelWeight);
      let angle = 0;
      let useHorizontal = false;
      if (Math.abs(tangent.x) > 1e-6 || Math.abs(tangent.y) > 1e-6) {
        angle = Math.atan2(tangent.y, tangent.x);
        useHorizontal = shouldUseHorizontalText(angle);
        if (!useHorizontal) {
          if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            angle += Math.PI;
          }
        } else {
          angle = 0;
        }
      }
      const gapWidth = useHorizontal ? labelSize * 0.9 : baseWidth;
      const layout = computeEdgeLabelLayoutFromWidth({
        baseSize: labelSize,
        baseWidth: gapWidth,
        lineLen: curveInfo.total,
        minSize: 4,
      });
      const size = layout.size;
      const gap = layout.gap;
      const gapHalf = gap / 2;
      const labelArcLen = curveInfo.total * Math.min(1, Math.max(0, labelT));
      const tLeft = curveInfo.tAtLength(labelArcLen - gapHalf);
      const tRight = curveInfo.tAtLength(labelArcLen + gapHalf);
      const leftSegment = getQuadraticSubcurve(lineStart, control, lineEnd, 0, tLeft);
      const rightSegment = getQuadraticSubcurve(lineStart, control, lineEnd, tRight, 1);
      if (leftSegment) {
        drawCurveSegment(leftSegment);
      }
      if (rightSegment) {
        drawCurveSegment(rightSegment);
      }
      const rotation = (angle * 180) / Math.PI;
      parts.push(
        await buildSvgTextElement({
          text: label,
          x: labelPos.x,
          y: labelPos.y,
          font: labelFont,
          size,
          fontWeight: labelWeight,
          anchor: "middle",
          baseline: "middle",
          color: themeColors.textSecondary,
          transform: `rotate(${rotation} ${labelPos.x} ${labelPos.y})`,
        })
      );
    }
  }

  const customEdgeOutset = 1;
  for (const customNode of customNodes) {
    const source = nodeById.get(customNode.sourceNodeId);
    if (!source) {
      continue;
    }
    if (hasSelectedDistanceEdgeBetweenNodes(source, customNode)) {
      continue;
    }
    const startEntry = exportNodePosMap.get(source.id);
    const endEntry = exportNodePosMap.get(customNode.id);
    if (!startEntry || !endEntry) {
      continue;
    }
    const start = startEntry.pos;
    const end = endEntry.pos;
    const radiusA = startEntry.radius;
    const radiusB = endEntry.radius;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      continue;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const startRadius = Math.max(0, getNodeEdgeRadius(source, ux, uy, radiusA) + customEdgeOutset);
    const customEdgeInset = Math.max(0, Math.round(radiusB * 0.03));
    const endRadius = Math.max(
      0,
      getNodeEdgeRadius(customNode, ux, uy, radiusB) + customEdgeOutset - customEdgeInset
    );
    const edgeStart = {
      x: start.x + ux * startRadius - left,
      y: start.y + uy * startRadius - top,
    };
    const edgeEnd = {
      x: end.x - ux * endRadius - left,
      y: end.y - uy * endRadius - top,
    };
    const lineLen = Math.max(0, dist - startRadius - endRadius);
    const label = formatIntervalRatio(customNode.factorNumerator, customNode.factorDenominator);
    const pushLine = (from, to) => {
      parts.push(
        `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" ${svgStroke(
          themeColors.edge
        )} stroke-width="1.5" />`
      );
    };
    if (lineLen > 0) {
      const baseWidth = await measureSvgTextWidth(label, edgeLabelSize, lineLabelFont, lineLabelWeight);
      const layout = computeEdgeLabelLayoutFromWidth({
        baseSize: edgeLabelSize,
        baseWidth,
        lineLen,
        minSize: 4,
      });
      const size = layout.size;
      const gap = layout.gap;
      const labelT = getLineLabelPositionOverride(source, customNode) ?? 0.5;
      if (gap > 0) {
        const gapHalf = gap / 2;
        const midX = edgeStart.x + (edgeEnd.x - edgeStart.x) * labelT;
        const midY = edgeStart.y + (edgeEnd.y - edgeStart.y) * labelT;
        const gapStart = {
          x: midX - ux * gapHalf,
          y: midY - uy * gapHalf,
        };
        const gapEnd = {
          x: midX + ux * gapHalf,
          y: midY + uy * gapHalf,
        };
        pushLine(edgeStart, gapStart);
        pushLine(gapEnd, edgeEnd);
        let angle = 0;
        if (Math.abs(edgeEnd.x - edgeStart.x) > 1e-6 || Math.abs(edgeEnd.y - edgeStart.y) > 1e-6) {
          angle = Math.atan2(edgeEnd.y - edgeStart.y, edgeEnd.x - edgeStart.x);
          if (!shouldUseHorizontalText(angle)) {
            if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
              angle += Math.PI;
            }
          } else {
            angle = 0;
          }
        }
        const rotation = (angle * 180) / Math.PI;
        parts.push(
          await buildSvgTextElement({
            text: label,
            x: midX,
            y: midY,
            font: lineLabelFont,
            size,
            fontWeight: lineLabelWeight,
            anchor: "middle",
            baseline: "middle",
            color: themeColors.textSecondary,
            transform: `rotate(${rotation} ${midX} ${midY})`,
          })
        );
      } else {
        pushLine(edgeStart, edgeEnd);
      }
    } else {
      pushLine(edgeStart, edgeEnd);
    }
  }

  const exportOrphanResult = connectOrphansEnabled ? buildOrphanGuideSet() : null;
  const exportOrphanGuides = exportOrphanResult ? exportOrphanResult.guides : null;
  if (exportOrphanResult) {
    exportOrphanResult.edges.forEach((edgeKey) => {
      const partsKey = edgeKey.split("|");
      if (partsKey.length !== 2) {
        return;
      }
      const a = nodeById.get(Number(partsKey[0]));
      const b = nodeById.get(Number(partsKey[1]));
      if (!a || !b) {
        return;
      }
      const isOrphanA = exportOrphanGuides && exportOrphanGuides.has(a.id);
      const isOrphanB = exportOrphanGuides && exportOrphanGuides.has(b.id);
      if (!isOrphanA && !isOrphanB) {
        return;
      }
      const startEntry = exportNodePosMap.get(a.id);
      const endEntry = exportNodePosMap.get(b.id);
      if (!startEntry || !endEntry) {
        return;
      }
      const start = startEntry.pos;
      const end = endEntry.pos;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (!dist) {
        return;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const startRadius = getNodeEdgeRadius(a, ux, uy, startEntry.radius);
      const endRadius = getNodeEdgeRadius(b, ux, uy, endEntry.radius);
      const edgeStart = {
        x: start.x + ux * startRadius - left,
        y: start.y + uy * startRadius - top,
      };
      const edgeEnd = {
        x: end.x - ux * endRadius - left,
        y: end.y - uy * endRadius - top,
      };
      const strokeColor = colorWithAlpha(themeColors.nodeStroke, 0.08);
      parts.push(
        `<line x1="${edgeStart.x}" y1="${edgeStart.y}" x2="${edgeEnd.x}" y2="${edgeEnd.y}" ${svgStroke(
          strokeColor
        )} stroke-width="1.5" />`
      );
    });
  }

  ensureAutoTriangleDiagonals();
  if (triangleDiagonals.size || autoTriangleDiagonals.size) {
    const gridMap = getActiveGridNodeMap();
    forEachEffectiveTriangleDiagonal((entry) => {
      const { a, b } = getTriangleDiagonalNodes(entry, gridMap);
      if (!a || !b) {
        return;
      }
      const start = worldToScreen(getNodeDisplayCoordinate(a), disableScale);
      const end = worldToScreen(getNodeDisplayCoordinate(b), disableScale);
      const radiusA = getLayoutNodeRadius(start);
      const radiusB = getLayoutNodeRadius(end);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (!dist) {
        return;
      }
      const ux = dx / dist;
      const uy = dy / dist;
      const edgeStart = {
        x: start.x + ux * radiusA - left,
        y: start.y + uy * radiusA - top,
      };
      const edgeEnd = {
        x: end.x - ux * radiusB - left,
        y: end.y - uy * radiusB - top,
      };
      parts.push(
        `<line x1="${edgeStart.x}" y1="${edgeStart.y}" x2="${edgeEnd.x}" y2="${edgeEnd.y}" ${svgStroke(
          themeColors.edge
        )} stroke-width="1.5" stroke-dasharray="6 4" />`
      );
    });
  }
  if (triangleLabels.size) {
    const gridMap = getActiveGridNodeMap();
    for (const entry of triangleLabels.values()) {
      if (!entry.label) {
        continue;
      }
      const diag = TRIANGLE_TRI_TO_DIAG[entry.tri];
      if (!diag || !hasEffectiveTriangleDiagonal(triangleKey({ ...entry, diag }))) {
        continue;
      }
      const cellNodes = getTriangleCellNodes(entry, gridMap);
      const labelNodes = getTriangleLabelPoints(entry.tri, cellNodes);
      if (!labelNodes) {
        continue;
      }
      const points = labelNodes.map((node) => {
        const proj = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
        return { x: proj.x - left, y: proj.y - top };
      });
      const cx = (points[0].x + points[1].x + points[2].x) / 3;
      const cy = (points[0].y + points[1].y + points[2].y) / 3;
      const baseSize = Math.max(12, Math.round(layoutTriangleLabelTextSize));
      const layout = computeTriangleLabelLayout(
        entry.label,
        layoutTriangleLabelFont,
        baseSize,
        points,
        layoutTriangleLabelFontWeight
      );
      parts.push(
        await buildSvgTextElement({
          text: entry.label,
          x: cx,
          y: cy,
          font: layoutTriangleLabelFont,
          size: layout.size,
          fontWeight: layoutTriangleLabelFontWeight,
          anchor: "middle",
          baseline: "middle",
          color: themeColors.textSecondary,
        })
      );
    }
  }

  for (const { node, pos } of exportNodeRenderList) {
    const isOrphanGuide = exportOrphanGuides && exportOrphanGuides.has(node.id);
    const isVisible = node.isCenter || node.active || node.isCustom || isOrphanGuide;
    if (!isVisible) {
      continue;
    }
    const entry = exportNodePosMap.get(node.id);
    if (!entry) {
      continue;
    }
    const x = pos.x - left;
    const y = pos.y - top;
    const radius = entry.radius;
    const innerTextScale =
      layoutPerspectiveTextSize && layoutMode
        ? Math.min(1.8, Math.max(0.65, radius / Math.max(1, Number(layoutNodeSize) || 1)))
        : 1;
    const nodeLabelSize = labelSize * innerTextScale;
    const shape = getLayoutNodeShape(node);
    const fill = "none";
    const stroke = isOrphanGuide && !node.active && !node.isCenter && !node.isCustom
      ? colorWithAlpha(themeColors.nodeStroke, 0.08)
      : themeColors.nodeStroke;
    if (showCircles) {
      if (shape === "circle") {
        parts.push(
          `<circle cx="${x}" cy="${y}" r="${radius}" ${svgFill(
            fill
          )} ${svgStroke(stroke)} stroke-width="2" />`
        );
      } else if (shape === "square") {
        parts.push(
          `<rect x="${x - radius}" y="${y - radius}" width="${radius * 2}" height="${
            radius * 2
          }" ${svgFill(fill)} ${svgStroke(stroke)} stroke-width="2" />`
        );
      } else if (shape === "triangle") {
        const height = radius * 1.2;
        const points = [
          `${x},${y - height}`,
          `${x + radius},${y + height * 0.6}`,
          `${x - radius},${y + height * 0.6}`,
        ].join(" ");
        parts.push(
          `<polygon points="${points}" ${svgFill(fill)} ${svgStroke(
            stroke
          )} stroke-width="2" />`
        );
      } else if (shape === "diamond") {
        const points = [
          `${x},${y - radius}`,
          `${x + radius},${y}`,
          `${x},${y + radius}`,
          `${x - radius},${y}`,
        ].join(" ");
        parts.push(
          `<polygon points="${points}" ${svgFill(fill)} ${svgStroke(
            stroke
          )} stroke-width="2" />`
        );
      }
    }
    const orphanTextAlpha =
      isOrphanGuide && !node.active && !node.isCenter && !node.isCustom ? 0.08 : 1;
    const textColorPrimary = colorWithAlpha(themeColors.textPrimary, orphanTextAlpha);
    const textColorSecondary = colorWithAlpha(themeColors.textSecondary, orphanTextAlpha);

    if (featureMode === "note") {
      if (hejiEnabled && nodeHasHighPrime(node)) {
        const displayInfo = getDisplayNoteInfo(node);
        const base = getHejiBaseAndDefaults(displayInfo.pitchClass);
        const centsText = showCentsDeviation ? formatCents(displayInfo.cents) : "";
        const suffixParts = centsText
          ? [
              ...base.suffixParts,
              {
                text: centsText,
                source: "cents",
                font: layoutRatioFont,
                charGap: 0,
                sizeScale: 0.67,
              },
            ]
          : base.suffixParts;
        parts.push(
          await buildHejiSvgInline({
            x,
            y,
            baseText: base.baseText,
            suffixParts,
            restText: "",
            font: layoutRatioFont,
            fontWeight: layoutRatioFontWeight,
            size: nodeLabelSize,
            align: "center",
            baseline: "middle",
            hejiYOffset: svgLabelHejiYOffset,
            color: textColorPrimary,
          })
        );
      } else {
        const annotation = getHejiAnnotation(node, getNodePitchLabel(node));
        parts.push(
          await buildHejiSvgInline({
            x,
            y,
            baseText: annotation.baseText,
            suffixParts: annotation.suffixParts,
            restText: "",
            font: layoutRatioFont,
            fontWeight: layoutRatioFontWeight,
            size: nodeLabelSize,
            align: "center",
            baseline: "middle",
            hejiYOffset: svgLabelHejiYOffset,
            color: textColorPrimary,
          })
        );
      }
      const centsLabel = buildCentsReadout(node, { wrap: enharmonicsEnabled });
      const ratioCentsLabel = showRatioCents ? formatRatioCentsLabel(node) : "";
      const octaveLabel = formatOctaveShiftLabel(getNodeOctaveShift(node));
      const ratioText = `${node.numerator}:${node.denominator}${octaveLabel}`;
      const hzText = showHz ? formatHzReadout(node.freq) : "";
      const ratioWidth = await measureSvgTextWidth(
        ratioText,
        detailSize,
        layoutNoteFont,
        layoutNoteFontWeight
      );
      const centsWidth = centsLabel
        ? await measureSvgTextWidth(centsLabel, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const ratioCentsWidth = ratioCentsLabel
        ? await measureSvgTextWidth(ratioCentsLabel, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const hzWidth = hzText
        ? await measureSvgTextWidth(hzText, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const labelWidth = Math.max(ratioWidth, centsWidth, ratioCentsWidth, hzWidth);
      const lineCount = 1 + (centsLabel ? 1 : 0) + (ratioCentsLabel ? 1 : 0) + (hzText ? 1 : 0);
      const labelHeight = lineCount * detailSize + (lineCount - 1) * 4;
      const rawLabelPos = getExportDetailLabelPosition(node, pos, radius, labelWidth, labelHeight);
      const ratioX = rawLabelPos.x - left;
      const ratioY = rawLabelPos.y - top;
      parts.push(
        await buildSvgTextElement({
          text: ratioText,
          x: ratioX,
          y: ratioY + svgNoteBaselineOffset,
          font: layoutNoteFont,
          size: detailSize,
          fontWeight: layoutNoteFontWeight,
          anchor: "start",
          baseline: "alphabetic",
          color: textColorSecondary,
        })
      );
      let detailLine = 1;
      if (centsLabel) {
        parts.push(
          await buildSvgTextWithSmallCent({
            text: centsLabel,
            x: ratioX,
            y: ratioY + detailSize + 4 + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            align: "left",
            baseline: "alphabetic",
            hejiAccidentals: hejiEnabled,
            hejiYOffset: svgDetailHejiYOffset,
            color: textColorSecondary,
          })
        );
        detailLine += 1;
      }
      if (ratioCentsLabel) {
        parts.push(
          await buildSvgTextElement({
            text: ratioCentsLabel,
            x: ratioX,
            y: ratioY + detailLine * (detailSize + 4) + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            anchor: "start",
            baseline: "alphabetic",
            color: textColorSecondary,
          })
        );
        detailLine += 1;
      }
      if (hzText) {
        parts.push(
          await buildSvgTextElement({
            text: hzText,
            x: ratioX,
            y: ratioY + detailLine * (detailSize + 4) + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            anchor: "start",
            baseline: "alphabetic",
            color: textColorSecondary,
          })
        );
      }
    } else {
      const maxWidth = radius * 1.6;
      const maxHeight = radius * 1.6;
      const layout = computeRatioLabelLayout(
        node.numerator,
        node.denominator,
        layoutRatioFont,
        nodeLabelSize,
        maxWidth,
        layoutRatioFontWeight,
        maxHeight
      );
      const ratioYOffset = Math.round(layout.size * -0.09);
      const ratioTextColor = textColorPrimary;
      if (layout.lines.length === 1) {
        parts.push(
          await buildSvgTextElement({
            text: layout.lines[0],
            x,
            y: y + ratioYOffset,
            font: layoutRatioFont,
            size: layout.size,
            fontWeight: layoutRatioFontWeight,
            anchor: "middle",
            baseline: "middle",
            color: ratioTextColor,
          })
        );
      } else {
        const positions = computeStackedRatioPositionsFromLine(
          layout.lines,
          layoutRatioFont,
          layout.size,
          layoutRatioFontWeight,
          y,
          layout.lineGap
        );
        parts.push(
          await buildSvgTextElement({
            text: layout.lines[0],
            x,
            y: positions.topBaseline,
            font: layoutRatioFont,
            size: layout.size,
            fontWeight: layoutRatioFontWeight,
            anchor: "middle",
            baseline: "alphabetic",
            color: ratioTextColor,
          })
        );
        parts.push(
          await buildSvgTextElement({
            text: layout.lines[1],
            x,
            y: positions.bottomBaseline,
            font: layoutRatioFont,
            size: layout.size,
            fontWeight: layoutRatioFontWeight,
            anchor: "middle",
            baseline: "alphabetic",
            color: ratioTextColor,
          })
        );
        parts.push(
          `<line x1="${x - positions.lineWidth / 2}" y1="${positions.lineY}" x2="${x + positions.lineWidth / 2}" y2="${positions.lineY}" ${svgStroke(
            ratioTextColor
          )} stroke-width="${Math.max(1, Math.round(layout.size * 0.06))}" />`
        );
      }

      const displayInfo = getDisplayNoteInfo(node);
      const centsLabel = buildCentsReadout(node, {
        wrap: enharmonicsEnabled,
        requireHejiDetail: true,
        baseTextForHeji: displayInfo.pitchClass,
      });
      const ratioCentsLabel = showRatioCents ? formatRatioCentsLabel(node) : "";
      const octaveLabel = formatOctaveShiftLabel(getNodeOctaveShift(node));
      const hzText = showHz ? formatHzReadout(node.freq) : "";
      const hasParen = centsLabel && centsLabel.includes("(");
      const restGapScale =
        hejiEnabled && hasParen ? HEJI_REST_GAP : HEJI_REST_GAP_PLAIN;
      const baseLabel = featureMode === "ratio" ? displayInfo.pitchClass : displayInfo.name;
      const annotation = getHejiAnnotation(node, baseLabel || node.note_name);
      const suffixText = annotation.suffixParts
        .map((part) => (part && part.text ? part.text : ""))
        .join("");
      const line1 = `${annotation.baseText || ""}${suffixText}${
        hejiEnabled && centsLabel ? "" : centsLabel ? ` ${centsLabel}` : ""
      }`;
      const lineWidth = line1
        ? await measureSvgTextWidth(line1, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const centsWidth =
        hejiEnabled && centsLabel
          ? await measureSvgTextWidth(centsLabel, detailSize, layoutNoteFont, layoutNoteFontWeight)
          : 0;
      const octaveWidth = octaveLabel
        ? await measureSvgTextWidth(octaveLabel, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const ratioCentsWidth = ratioCentsLabel
        ? await measureSvgTextWidth(ratioCentsLabel, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const hzWidth = hzText
        ? await measureSvgTextWidth(hzText, detailSize, layoutNoteFont, layoutNoteFontWeight)
        : 0;
      const labelWidth = Math.max(lineWidth, centsWidth, octaveWidth, ratioCentsWidth, hzWidth);
      const lineCount =
        1 +
        (hejiEnabled && centsLabel ? 1 : 0) +
        (octaveLabel ? 1 : 0) +
        (ratioCentsLabel ? 1 : 0) +
        (hzText ? 1 : 0);
      const labelHeight = lineCount * detailSize + (lineCount - 1) * 4;
      const rawLabelPos = getExportDetailLabelPosition(node, pos, radius, labelWidth, labelHeight);
      const labelX = rawLabelPos.x - left;
      const labelY = rawLabelPos.y - top;
      parts.push(
        await buildHejiSvgInline({
          x: labelX,
          y: labelY + svgNoteBaselineOffset,
          baseText: annotation.baseText,
          suffixParts: annotation.suffixParts,
          restText: hejiEnabled && centsLabel ? "" : centsLabel ? ` ${centsLabel}` : "",
          font: layoutNoteFont,
          size: detailSize,
          align: "left",
          baseline: "alphabetic",
          hejiYOffset: svgDetailHejiYOffset,
          restGapScale,
          restHejiAccidentals: hejiEnabled && hasParen,
          fontWeight: layoutNoteFontWeight,
          color: textColorSecondary,
        })
      );
      let detailLine = 1;
      if (hejiEnabled && centsLabel) {
        parts.push(
          await buildSvgTextWithSmallCent({
            text: centsLabel,
            x: labelX,
            y: labelY + detailSize + 4 + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            align: "left",
            baseline: "alphabetic",
            hejiAccidentals: hejiEnabled,
            hejiYOffset: svgDetailHejiYOffset,
            color: textColorSecondary,
          })
        );
        detailLine += 1;
      }
      if (octaveLabel) {
        parts.push(
          await buildSvgTextElement({
            text: octaveLabel,
            x: labelX,
            y: labelY + detailLine * (detailSize + 4) + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            anchor: "start",
            baseline: "alphabetic",
            color: textColorSecondary,
          })
        );
        detailLine += 1;
      }
      if (ratioCentsLabel) {
        parts.push(
          await buildSvgTextElement({
            text: ratioCentsLabel,
            x: labelX,
            y: labelY + detailLine * (detailSize + 4) + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            anchor: "start",
            baseline: "alphabetic",
            color: textColorSecondary,
          })
        );
        detailLine += 1;
      }
      if (hzText) {
        parts.push(
          await buildSvgTextElement({
            text: hzText,
            x: labelX,
            y: labelY + detailLine * (detailSize + 4) + svgNoteBaselineOffset,
            font: layoutNoteFont,
            size: detailSize,
            fontWeight: layoutNoteFontWeight,
            anchor: "start",
            baseline: "alphabetic",
            color: textColorSecondary,
          })
        );
      }
    }
  }

  parts.push("</svg>");

  return parts.join("\n");
}


async function exportLayoutSvg() {
  if (!layoutMode) {
    alert("Enable Page Layout mode to export SVG.");
    return;
  }
  const hejiFontUrl = getHejiFontUrl();
  const hejiFontDataUrl = await buildFontDataUrl(hejiFontUrl, "font/otf");
  const exportFontCss = await getExportFontCss(hejiFontDataUrl || hejiFontUrl);
  const svgDetailHejiYOffset = await getSvgHejiYOffset(
    layoutNoteTextSize,
    layoutNoteFont,
    layoutNoteFontWeight
  );
  const svgLabelHejiYOffset = await getSvgHejiYOffset(
    layoutRatioTextSize,
    layoutRatioFont,
    layoutRatioFontWeight
  );
  const svgNoteBaselineOffset = getSvgTopBaselineOffset(
    layoutNoteTextSize,
    layoutNoteFont,
    layoutNoteFontWeight
  );
  const svg = await buildLayoutSvgString(
    hejiFontDataUrl || hejiFontUrl,
    svgDetailHejiYOffset,
    exportFontCss,
    svgNoteBaselineOffset,
    svgLabelHejiYOffset
  );
  if (!svg) {
    alert("Enable Page Layout mode to export SVG.");
    return;
  }
  const exportLabel = getExportMetadataLabel();
  const blob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${exportLabel}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function exportLayoutPdf() {
  if (!layoutMode) {
    alert("Enable Page Layout mode to export PDF.");
    return;
  }
  const exportLabel = getExportMetadataLabel();
  const escapedExportLabel = escapeSvgText(exportLabel);
  const { widthPx, heightPx } = getLayoutPageDimensions();
  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Allow pop-ups to export PDF.");
    return;
  }
  const hejiFontUrl = getHejiFontUrl();
  const hejiFontDataUrl = await buildFontDataUrl(hejiFontUrl, "font/otf");
  const hejiFontSrc = hejiFontDataUrl || hejiFontUrl;
  const exportFontCss = await getExportFontCss(hejiFontSrc);
  const svgDetailHejiYOffset = await getSvgHejiYOffset(
    layoutNoteTextSize,
    layoutNoteFont,
    layoutNoteFontWeight
  );
  const svgLabelHejiYOffset = await getSvgHejiYOffset(
    layoutRatioTextSize,
    layoutRatioFont,
    layoutRatioFontWeight
  );
  const svgNoteBaselineOffset = getSvgTopBaselineOffset(
    layoutNoteTextSize,
    layoutNoteFont,
    layoutNoteFontWeight
  );
  const svg = await buildLayoutSvgString(
    hejiFontSrc,
    svgDetailHejiYOffset,
    exportFontCss,
    svgNoteBaselineOffset,
    svgLabelHejiYOffset
  );
  if (!svg) {
    alert("Enable Page Layout mode to export PDF.");
    win.close();
    return;
  }
  win.document.open();
  win.document.title = exportLabel;
  win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapedExportLabel}</title>
    <meta name="title" content="${escapedExportLabel}" />
    <meta name="author" content="${escapedExportLabel}" />
    <link rel="stylesheet" href="${LEXEND_FONT_URL}">
    <style>
      @page { size: ${Math.round(widthPx)}px ${Math.round(heightPx)}px; margin: 0; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
      body { display: flex; align-items: center; justify-content: center; }
      svg { width: ${Math.round(widthPx)}px; height: ${Math.round(heightPx)}px; display: block; }
      @font-face {
        font-family: "HEJI2Text";
        src: url("${hejiFontSrc}") format("opentype");
        font-display: swap;
      }
    </style>
  </head>
  <body>
    ${svg}
    <script>
      window.onload = () => {
        const waitForFonts = document.fonts
          ? Promise.all([
              document.fonts.load('16px "HEJI2Text"'),
              document.fonts.load('16px "Lexend"'),
              document.fonts.load('16px "Inter"'),
              document.fonts.load('16px "IBM Plex Sans"'),
              document.fonts.load('16px "Lato"'),
              document.fonts.load('16px "PT Sans"'),
              document.fonts.load('16px "PT Serif"'),
              document.fonts.load('16px "Radley"'),
              document.fonts.load('16px "Alice"'),
              document.fonts.load('16px "Noto Serif"'),
            ])
          : Promise.resolve();
        waitForFonts.finally(() => {
          setTimeout(() => window.print(), 200);
        });
      };
    </script>
  </body>
</html>`);
  win.document.close();
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

function rebuildLattice(
  activeKeys = null,
  { remapTriangles = true, remapLayoutOffsets = true, stopVoices = true } = {}
) {
  const previousNodeSnapshotKeys = new Map();
  nodes.forEach((node) => {
    const key = getSnapshotNodeKey(node);
    if (key) {
      previousNodeSnapshotKeys.set(node.id, key);
    }
  });
  if (stopVoices) {
    stopAllVoices();
  }
  const previousSourceKeys = new Map();
  const previousCustomIds = new Set(customNodes.map((node) => node.id));
  nodes.forEach((node) => {
    if (!node || node.isCustom) {
      return;
    }
    previousSourceKeys.set(
      node.id,
      `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`
    );
  });
  const labelOffsets = remapLayoutOffsets ? serializeLayoutLabelOffsets() : null;
  const keyMappingOffsets = remapLayoutOffsets ? serializeLayoutKeyMappingOffsets() : null;
  const nodeShapes = remapLayoutOffsets ? serializeLayoutNodeShapes() : null;
  const customPianoMapState = remapLayoutOffsets ? serializeCustomPianoMap() : null;
  const positionOffsets = remapLayoutOffsets ? serializeLayoutPositionOffsets() : null;
  const prevCenterZ = gridCenterZ;
  const latticeNodes = buildLattice();
  const nextSourceIds = new Map(
    latticeNodes.map((node) => [
      `${node.exponentX},${node.exponentY},${node.exponentZ || 0}`,
      node.id,
    ])
  );
  customNodes.forEach((customNode) => {
    if (previousCustomIds.has(customNode.sourceNodeId)) {
      return;
    }
    const sourceKey = previousSourceKeys.get(customNode.sourceNodeId);
    if (!sourceKey) {
      return;
    }
    const nextId = nextSourceIds.get(sourceKey);
    if (nextId != null) {
      customNode.sourceNodeId = nextId;
    }
  });
  nodes = [...latticeNodes, ...customNodes];
  if (remapTriangles) {
    remapTrianglesForGridCenter(prevCenterZ, gridCenterZ);
  }
  nodeById = new Map(nodes.map((node) => [node.id, node]));
  const nextNodeIdsBySnapshotKey = new Map();
  nodes.forEach((node) => {
    const key = getSnapshotNodeKey(node);
    if (key) {
      nextNodeIdsBySnapshotKey.set(key, node.id);
    }
  });
  const nodeIdRemap = new Map();
  previousNodeSnapshotKeys.forEach((key, previousId) => {
    const nextId = nextNodeIdsBySnapshotKey.get(key);
    if (Number.isFinite(nextId)) {
      nodeIdRemap.set(previousId, nextId);
    }
  });
  const remapNodeId = (nodeId) => {
    if (!Number.isFinite(nodeId)) {
      return null;
    }
    if (nodeIdRemap.has(nodeId)) {
      return nodeIdRemap.get(nodeId);
    }
    return nodeById.has(nodeId) ? nodeId : null;
  };
  voices.forEach((voice) => {
    if (!voice || !Number.isFinite(voice.nodeId)) {
      return;
    }
    const nextId = remapNodeId(voice.nodeId);
    if (Number.isFinite(nextId)) {
      voice.nodeId = nextId;
    }
  });
  if (Array.isArray(looperEvents) && looperEvents.length) {
    looperEvents = looperEvents.map((event) => {
      if (!event || !Number.isFinite(event.nodeId)) {
        return event;
      }
      const nextId = remapNodeId(event.nodeId);
      return Number.isFinite(nextId)
        ? {
            ...event,
            nodeId: nextId,
          }
        : event;
    });
  }
  if (Array.isArray(patternActiveNodes) && patternActiveNodes.length) {
    patternActiveNodes = patternActiveNodes
      .map((nodeId) => remapNodeId(nodeId))
      .filter((nodeId) => Number.isFinite(nodeId));
  }
  if (looperVoicesByNode && looperVoicesByNode.size) {
    const remappedLooperVoices = new Map();
    looperVoicesByNode.forEach((voiceList, nodeId) => {
      const nextId = remapNodeId(nodeId);
      if (!Number.isFinite(nextId)) {
        return;
      }
      const existing = remappedLooperVoices.get(nextId) || [];
      remappedLooperVoices.set(nextId, existing.concat(voiceList || []));
    });
    looperVoicesByNode = remappedLooperVoices;
  }
  nodes.forEach((node) => {
    node.baseVoiceId = null;
  });
  voices.forEach((voice) => {
    if (!voice || voice.releasing || !Number.isFinite(voice.nodeId)) {
      return;
    }
    const node = nodeById.get(voice.nodeId);
    if (node && !node.baseVoiceId) {
      node.baseVoiceId = voice.id;
    }
  });
  applyNodeOctaveOffsets();
  applyNodeVolumeLimits();
  if (layoutMode) {
    nodes.forEach((node) => ensureLayoutPosition(node));
  }
  bumpLabelDataVersion();
  applyActiveNodeKeys(activeKeys);
  if (remapTriangles) {
    pruneTriangleDiagonals();
  }
  edges = buildEdges(latticeNodes, GRID_COLS, GRID_ROWS, gridDepth);
  if (remapLayoutOffsets) {
    if (labelOffsets && labelOffsets.length) {
      applyLayoutLabelOffsets(labelOffsets);
    }
    if (keyMappingOffsets && keyMappingOffsets.length) {
      applyLayoutKeyMappingOffsets(keyMappingOffsets);
    }
    if (nodeShapes && nodeShapes.length) {
      applyLayoutNodeShapes(nodeShapes);
    }
    if (positionOffsets && positionOffsets.length) {
      applyLayoutPositionOffsets(positionOffsets);
    }
    if (customPianoMapState && customPianoMapState.length) {
      applyCustomPianoMap(customPianoMapState);
    }
  }
  updatePitchInstances();
  markIsomorphicDirty();
  refreshPatternFromActiveNodes();
  refreshCustomNodes();
  draw();
}

function resetLattice() {
  const preservedMidiEnabled = midiEnabled;
  const preservedMidiChecked = midiEnable ? midiEnable.checked : false;
  const preservedMidiPort = midiPortSelect ? midiPortSelect.value : null;
  stopAllVoices();
  activeKeys.clear();
  analysisLayers.distances = false;
  analysisLayers.microtonal = false;
  microtonalSelectedNodeIds.clear();
  microtonalHoverPairKey = "";
  distanceSelectMode = false;
  distanceSelectedNodeKeys.clear();
  distanceSelectedEdges.clear();
  distanceEdgeOverrides.clear();
  customPianoActiveKeys.clear();
  clearTriangleKeyboardActiveVoices();
  clearAutoTriangleDiagonals();
  markAutoTrianglesDirty();
  customPianoMap = new Map();
  customPianoSelectedKey = null;
  customNodes = [];
  nextCustomNodeId = 200000;
  pendingCustomAction = null;
  customNodeDrag = null;
  setCustomPianoMapMode(false);
  markCustomPianoMapDirty();
  updateCustomPianoKeyStyles();
  nodeSpellingOverrides.clear();
  nodeOctaveOffsets.clear();
  nodeVolumeLimits.clear();
  triangleDiagonals.clear();
  triangleLabels.clear();
  layoutUndoStack.length = 0;
  layoutRedoStack.length = 0;
  fundamentalNoteSelect.value = "60";
  onFundamentalNoteChange();
  resetLayoutState();
  setLayoutMode(false);
  view.zoom = 1;
  view.offsetX = 0;
  view.offsetY = 0;
  view.rotX = 0;
  view.rotY = 0;
  cameraDistance = 0;
  GRID_COLS = DEFAULT_GRID_COLS;
  GRID_ROWS = DEFAULT_GRID_ROWS;
  GRID_DEPTH = DEFAULT_GRID_DEPTH;
  latticeExponentOffset = { x: 0, y: 0, z: 0 };
  hoverNodeId = null;
  set3DMode(false, { preserveDepth: false });
  isFlattened2D = false;
  rebuildLattice();
  updateUiHint();
  schedulePresetUrlUpdate();
  if (midiEnable) {
    setControlChecked(midiEnable, preservedMidiChecked);
  }
  midiEnabled = preservedMidiEnabled;
  if (preservedMidiPort && midiPortSelect) {
    const applyPortSelection = () => {
      if (Array.from(midiPortSelect.options).some((option) => option.value === preservedMidiPort)) {
        midiPortSelect.value = preservedMidiPort;
        selectMidiInput(preservedMidiPort);
      }
    };
    if (midiEnabled && !midiAccess) {
      initMidi().then(applyPortSelection);
    } else {
      applyPortSelection();
    }
  }
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
if (navCirclesToggle) {
  showCircles = navCirclesToggle.checked;
}
if (lineLabelsToggle) {
  showLineLabels = lineLabelsToggle.checked;
}
setControlChecked(layoutLineLabelsToggle, showLineLabels);
if (mode3dCheckbox) {
  is3DMode = mode3dCheckbox.checked;
  updateNavPanelVisibility();
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
}
updateNavPanelVisibility();
updateAddModeFromShift();
updateUiHint();
fundamentalNoteSelect.value = "60";
onFundamentalNoteChange();
initLayoutFonts();
setLayoutPanelCollapsed(false);
setViewsCollapsed(false);
setLayoutShowCollapsed(true);
syncLayoutEditorControls();
syncLayoutAlignButtons();
setControlChecked(layoutModeToggle, layoutMode);
syncViewModeControls();
if (layoutPanel) {
  layoutPanel.hidden = !layoutMode;
}
syncFeatureModeControls();
syncSpellingModeControls();
setControlChecked(showHzToggle, showHz);
setControlChecked(layoutShowHzToggle, showHz);
setControlChecked(showRatioCentsToggle, showRatioCents);
setControlChecked(layoutShowRatioCentsToggle, showRatioCents);
setControlChecked(showCentsDeviationToggle, showCentsDeviation);
setControlChecked(layoutShowCentsDeviationToggle, showCentsDeviation);
enharmonicsEnabledPreference = Boolean(enharmonicsEnabled);
enforceCentsDisplayMode();
setControlChecked(showCentsSignToggle, showCentsSign);
setControlChecked(directionalRatioLabelsToggle, directionalRatioLabels);
setControlChecked(connectOrphansToggle, connectOrphansEnabled);
setControlChecked(show3DShadingToggle, show3DShading);
setLatticeTilt(latticeTiltDeg);
setControlChecked(hejiEnabledToggle, hejiEnabled);
setControlChecked(layoutHejiEnabledToggle, hejiEnabled);
setControlChecked(enharmonicsEnabledToggle, enharmonicsEnabled);
setControlChecked(layoutEnharmonicsEnabledToggle, enharmonicsEnabled);
setControlChecked(navCirclesToggle, showCircles);
setControlChecked(layoutCirclesToggle, showCircles);
syncAnalysisLayerToggles();
syncCentsPrecisionControls();
syncHzPrecisionControls();
syncLayoutKeyMappingControls();
syncLayoutScaleInput();
updateKeyMappingToggleVisibility();
initEnvelopeSliders();
presetStateDefaults = deepClonePresetValue(getPresetState({ includeDefaults: true }));
const presetState = readPresetFromUrl();
if (presetState) {
  applyPresetState(presetState);
} else {
  rebuildLattice();
}
presetSyncEnabled = true;
updatePresetUrl();

bindOptionalClick(audioToggle, toggleAudio);
bindOptionalClick(resetButton, resetLattice);
bindOptionalClick(saveLatticeButton, downloadLatticeState);
bindOptionalClick(loadLatticeButton, () => {
  if (!loadLatticeInput) {
    return;
  }
  loadLatticeInput.value = "";
  loadLatticeInput.click();
});
bindOptionalChange(loadLatticeInput, async () => {
  if (!loadLatticeInput) {
    return;
  }
  const file = loadLatticeInput.files && loadLatticeInput.files[0];
  if (!file) {
    return;
  }
  try {
    const text = await file.text();
    const state = JSON.parse(text);
    applyPresetState(state);
    schedulePresetUrlUpdate();
    closeFilePanel();
  } catch (error) {
    console.warn("Failed to load lattice file", error);
    alert("Could not load lattice file.");
  }
});
bindOptionalClick(sharePresetButton, async () => {
  const shareUrl = getPresetShareUrl();
  try {
    await copyTextToClipboard(shareUrl);
    showFileSharePopover("Preset URL copied. Paste it in a new tab to reopen this preset.");
  } catch (error) {
    showFileSharePopover("Couldn't copy the preset URL. Try again.");
  }
});
bindOptionalClick(openOvertonesButton, () => {
  openOvertonesFromMenu();
  closeFilePanel();
});
bindOptionalClick(openTunerButton, () => {
  openTunerFromFileMenu();
  closeFilePanel();
});
bindOptionalEvent(window, "hashchange", () => {
  const presetState = readPresetFromUrl();
  if (presetState) {
    applyPresetState(presetState);
  }
});
bindOptionalEvent(window, "beforeunload", () => {
  // Do not rewrite the URL hash during unload/refresh.
  // The latest interactive updates already sync the hash, and mutating
  // location during unload can overwrite a good URL with stale state.
});
if (!viewModeInputs.length && !viewModeButtons.length) {
  bindOptionalChange(mode3dCheckbox, () => {
    if (layoutMode) {
      setControlChecked(mode3dCheckbox, false);
      return;
    }
    set3DMode(mode3dCheckbox.checked);
    schedulePresetUrlUpdate();
  });
}
bindSingleBooleanDrawToggle(navAxesToggle, (checked) => {
  showAxes = checked;
});
bindSingleBooleanDrawToggle(navGridToggle, (checked) => {
  showGrid = checked;
});
bindMirroredDrawToggles(
  navCirclesToggle,
  layoutCirclesToggle,
  (checked) => {
    showCircles = checked;
  }
);
bindMirroredDrawToggles(
  lineLabelsToggle,
  layoutLineLabelsToggle,
  (checked) => {
    showLineLabels = checked;
  }
);
setControlChecked(navKeyMappingsToggle, showKeyMappings);
setControlChecked(layoutKeyMappingsToggle, showKeyMappings);
bindMirroredDrawToggles(
  navKeyMappingsToggle,
  layoutKeyMappingsToggle,
  (checked) => {
    showKeyMappings = checked;
  }
);
bindOptionalClick(viewPanelToggle, () => {
  const isCollapsed = viewsPanel && viewsPanel.classList.contains("is-collapsed");
  setViewsCollapsed(!isCollapsed);
});
bindOptionalClick(nav3dNavigationToggle, () => {
  const isCollapsed = nav3dNavigationToggle.classList.contains("is-collapsed");
  setNavigationCollapsed(!isCollapsed);
});
bindOptionalClick(layoutShowToggle, () => {
  const isCollapsed = layoutShowToggle.classList.contains("is-collapsed");
  setLayoutShowCollapsed(!isCollapsed);
});
if (nav3dButtons && nav3dButtons.length) {
  nav3dButtons.forEach((button) => {
    bindOptionalClick(button, () => {
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
bindOptionalInput(navZoomInput, () => {
  view.zoom = clampZoom(Number(navZoomInput.value) || 1);
  draw();
  schedulePresetUrlUpdate();
});
bindOptionalInput(navDistanceInput, () => {
  cameraDistance = clampCameraDistance(Number(navDistanceInput.value) || 0);
  draw();
});
bindOptionalInput(tiltInput, () => {
  setLatticeTilt(tiltInput.value, { syncControl: false });
  draw();
  schedulePresetUrlUpdate();
});
bindOptionalInput(tiltReadout, () => {
  setLatticeTilt(tiltReadout.value);
  draw();
  schedulePresetUrlUpdate();
});
bindOptionalClick(exportScaleButton, exportToScaleWorkshop);
bindOptionalChange(themeSelect, onThemeSelectChange);
bindOptionalClick(optionsToggle, toggleOptionsPanel);
bindOptionalClick(calculateToggle, toggleCalculatePanel);
bindOptionalClick(presetCloseButton, () => {
  closePresetOverlay();
});
bindOptionalClick(presetOverlay, (event) => {
  if (event.target === presetOverlay) {
    closePresetOverlay();
  }
});
bindOptionalInput(presetSearchInput, () => {
  renderPresetList();
});
bindOptionalChange(presetSortSelect, () => {
  const nextMode = presetSortSelect.value;
  presetSortMode = nextMode === "creator" ? "creator" : nextMode === "title" ? "title" : "default";
  renderPresetList();
});
snapshotKeyboardContainer = document.getElementById("snapshot-keyboard");
snapshotKeyboardKeys = document.getElementById("snapshot-keyboard-keys");
if (snapshotKeyboardContainer) {
  buildSnapshotKeyboard();
}
bindOptionalEvent(window, "keydown", (event) => {
  if (event.defaultPrevented) {
    return;
  }
  const targetTag = event.target ? event.target.tagName : "";
  if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") {
    return;
  }
  const keyboardModeEnabled = snapshotKeyboardModeToggle
    ? snapshotKeyboardModeToggle.checked
    : snapshotKeyboardMode;
  const keyboardMappingActive = snapshotKeyboardActiveToggle
    ? snapshotKeyboardActiveToggle.checked
    : snapshotKeyboardActive;
  if (snapshotDebugEnabled) {
    console.log("[snapshot-keydown]", {
      key: event.key,
      code: event.code,
      alt: event.altKey,
      shift: event.shiftKey,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
      mappingEnabled: keyboardModeEnabled,
      mappingActive: keyboardMappingActive,
      target: event.target && event.target.tagName,
    });
  }
  if (document.activeElement !== canvas && !(keyboardModeEnabled && keyboardMappingActive)) {
    return;
  }
  const letterIndex = keyboardModeEnabled ? getSnapshotLetterIndexFromEvent(event) : null;
  const numberIndex = getSnapshotIndexFromEvent(event);
  if (keyboardModeEnabled && keyboardMappingActive && snapshotDebugEnabled) {
    console.log("[snapshot-keyboard]", {
      code: event.code,
      key: event.key,
      alt: event.altKey,
      shift: event.shiftKey,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
      letterIndex,
      numberIndex,
    });
  }
  if (snapshotDebugEnabled && keyboardModeEnabled) {
    console.log("[snapshot-keyboard-state]", {
      enabled: keyboardModeEnabled,
      active: keyboardMappingActive,
      letterIndex,
      numberIndex,
    });
  }
  if (keyboardModeEnabled && keyboardMappingActive && letterIndex != null) {
    if (event.altKey && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      const letter = String(event.code || "").replace("Key", "").toLowerCase();
      saveSnapshotLetter(letter, letterIndex);
      return;
    }
    if (!event.altKey && !event.metaKey && !event.ctrlKey) {
      if (snapshotLetterSlots[letterIndex]) {
        event.preventDefault();
        const letter = String(event.code || "").replace("Key", "").toLowerCase();
        recallSnapshotLetter(letter, letterIndex);
        return;
      }
    }
  }
  if (numberIndex == null) {
    return;
  }
  if (keyboardModeEnabled && !keyboardMappingActive && document.activeElement !== canvas) {
    return;
  }
  const isSave = event.altKey && !event.metaKey && !event.ctrlKey;
  const isRecall = !event.altKey && !event.metaKey && !event.ctrlKey;
  if (!isSave && !isRecall) {
    return;
  }
  event.preventDefault();
  if (isSave) {
    saveSnapshot(numberIndex);
  } else {
    recallSnapshot(numberIndex);
  }
});
const snapshotResetButton = document.getElementById("snapshot-reset");
bindOptionalClick(snapshotResetButton, () => {
  clearSnapshots();
});
const snapshotButtons = document.querySelectorAll(".snapshot-slot");
snapshotButtons.forEach((button) => {
  bindOptionalClick(button, (event) => {
    const index = Number(button.dataset.slot);
    if (!Number.isFinite(index)) {
      return;
    }
    if (event.shiftKey) {
      saveSnapshot(index);
      return;
    }
    recallSnapshot(index);
  });
});
const snapshotDeferToggle = document.getElementById("snapshot-defer");
bindSingleBooleanToggle(snapshotDeferToggle, (checked) => {
  snapshotDeferToCycleEnd = checked;
});
const snapshotRestoreToggle = document.getElementById("snapshot-restore-play");
bindSingleBooleanToggle(snapshotRestoreToggle, (checked) => {
  snapshotRestorePlayNodes = checked;
  if (!checked) {
    snapshotMorphEnabled = false;
  }
  normalizeSnapshotMorphSettings();
  syncSnapshotSettingsControls();
});
const snapshotConnectToggle = document.getElementById("snapshot-connect-tones");
bindSingleBooleanToggle(snapshotConnectToggle, (checked) => {
  snapshotConnectCommonTones = checked;
  normalizeSnapshotMorphSettings();
  syncSnapshotSettingsControls();
});
const snapshotMorphToggle = document.getElementById("snapshot-morph");
const snapshotMorphTimeInput = document.getElementById("snapshot-morph-time");
bindSingleBooleanToggle(snapshotMorphToggle, (checked) => {
  snapshotMorphEnabled = checked;
  normalizeSnapshotMorphSettings();
  syncSnapshotSettingsControls();
});
bindOptionalChange(snapshotMorphTimeInput, () => {
  snapshotMorphTimeMs = Math.max(1, Math.round(Number(snapshotMorphTimeInput.value) || 100));
  syncSnapshotSettingsControls();
});
const snapshotRestoreViewToggle = document.getElementById("snapshot-restore-view");
bindSingleBooleanToggle(snapshotRestoreViewToggle, (checked) => {
  snapshotRestoreView = checked;
});
const snapshotRestoreSequenceToggle = document.getElementById("snapshot-restore-sequence");
bindSingleBooleanToggle(snapshotRestoreSequenceToggle, (checked) => {
  snapshotRestoreSequence = checked;
});
const snapshotRestoreSynthToggle = document.getElementById("snapshot-restore-synth");
bindSingleBooleanToggle(snapshotRestoreSynthToggle, (checked) => {
  snapshotRestoreSynthSettings = checked;
});
const snapshotRestoreKeyboardModeToggle = document.getElementById(
  "snapshot-restore-keyboard-mode"
);
bindSingleBooleanToggle(snapshotRestoreKeyboardModeToggle, (checked) => {
  snapshotRestoreKeyboardMode = checked;
});
const snapshotRestoreLfosToggle = document.getElementById("snapshot-restore-lfos");
const snapshotRestoreLfoPhaseToggle = document.getElementById("snapshot-restore-lfo-phase");
bindSingleBooleanToggle(snapshotRestoreLfosToggle, (checked) => {
  snapshotRestoreLfos = checked;
  setControlDisabled(snapshotRestoreLfoPhaseToggle, !snapshotRestoreLfos);
});
bindSingleBooleanToggle(snapshotRestoreLfoPhaseToggle, (checked) => {
  snapshotRestoreLfoPhase = checked;
});
setControlDisabled(snapshotRestoreLfoPhaseToggle, !snapshotRestoreLfos);
const snapshotKeyboardModeToggle = document.getElementById("snapshot-keyboard-mode");
const snapshotKeyboardActiveToggle = document.getElementById("snapshot-keyboard-active");
bindOptionalChange(snapshotKeyboardModeToggle, () => {
  snapshotKeyboardMode = snapshotKeyboardModeToggle.checked;
  if (snapshotKeyboardMode) {
    snapshotKeyboardActive = true;
    setControlChecked(snapshotKeyboardActiveToggle, true);
    setKeyboardModeDisabled(true);
  } else {
    snapshotKeyboardActive = false;
    setControlChecked(snapshotKeyboardActiveToggle, false);
    setKeyboardModeDisabled(false);
  }
  setControlDisabled(snapshotKeyboardActiveToggle, !snapshotKeyboardMode);
  updateSnapshotUi();
});
bindSingleBooleanToggle(snapshotKeyboardActiveToggle, (checked) => {
  snapshotKeyboardActive = checked;
  updateSnapshotUi();
});
setControlDisabled(snapshotKeyboardActiveToggle, !snapshotKeyboardMode);
const snapshotExportButton = document.getElementById("snapshot-export");
const snapshotImportButton = document.getElementById("snapshot-import");
const snapshotImportInput = document.getElementById("snapshot-import-input");
bindOptionalClick(snapshotExportButton, () => {
  exportSnapshotSetToFile();
});
if (snapshotImportButton && snapshotImportInput) {
  bindOptionalClick(snapshotImportButton, () => {
    snapshotImportInput.value = "";
    snapshotImportInput.click();
  });
  bindOptionalChange(snapshotImportInput, async () => {
    const file = snapshotImportInput.files && snapshotImportInput.files[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const applied = applySnapshotSetPayload(payload);
      if (!applied) {
        showFileSharePopover("Snapshot file not recognized.");
        return;
      }
      showFileSharePopover("Snapshots imported.");
    } catch (error) {
      showFileSharePopover("Couldn't import snapshot file.");
    }
  });
}
const snapshotOptionsToggle = document.getElementById("snapshot-options-toggle");
const snapshotOptionsMenu = document.getElementById("snapshot-options");
if (snapshotOptionsToggle && snapshotOptionsMenu) {
  bindOptionalClick(snapshotOptionsToggle, (event) => {
    event.stopPropagation();
    const shouldShow = snapshotOptionsMenu.hidden;
    snapshotOptionsMenu.hidden = !shouldShow;
    snapshotOptionsToggle.setAttribute("aria-expanded", shouldShow ? "true" : "false");
  });
  bindOptionalEvent(document, "click", (event) => {
    if (snapshotOptionsMenu.hidden) {
      return;
    }
    if (
      event.target === snapshotOptionsMenu ||
      snapshotOptionsMenu.contains(event.target) ||
      event.target === snapshotOptionsToggle
    ) {
      return;
    }
    snapshotOptionsMenu.hidden = true;
    snapshotOptionsToggle.setAttribute("aria-expanded", "false");
  });
}
updateSnapshotUi();
syncSnapshotSettingsControls();
bindOptionalClick(intervalChartButton, () => {
  openIntervalChart();
});
bindOptionalClick(intervalChartCloseButton, () => {
  closeIntervalChart();
});
if (intervalChartOverlay) {
  bindOptionalClick(intervalChartOverlay, (event) => {
    if (event.target === intervalChartOverlay) {
      closeIntervalChart();
    }
  });
  bindOptionalEvent(intervalChartOverlay, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyIntervalChartSelection();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeIntervalChart();
    }
  });
}
bindOptionalInput(intervalChartSearchInput, () => {
  intervalChartSearch = intervalChartSearchInput.value.trim();
  renderIntervalChartTable();
});
bindOptionalChange(intervalChartListenToggle, () => {
  intervalChartListenEnabled = intervalChartListenToggle.checked;
  if (!intervalChartListenEnabled) {
    intervalChartActive.forEach((entry) => {
      entry.voices.forEach((voice) => stopVoice(voice));
    });
  }
});
bindOptionalChange(intervalChartSuperparticularToggle, () => {
  intervalChartSuperparticularOnly = intervalChartSuperparticularToggle.checked;
  renderIntervalChartTable();
});
bindOptionalChange(intervalChartDirectionSelect, () => {
  intervalChartDirection = intervalChartDirectionSelect.value || "above";
  renderIntervalChartTable();
});
bindOptionalInput(intervalChartCustomInput, () => {
  syncIntervalChartCustomState();
});
bindOptionalEnterKey(intervalChartCustomInput, () => {
  applyIntervalChartSelection();
});
bindOptionalClick(intervalChartCalcButton, () => {
  applyIntervalChartSelection();
});
bindOptionalClick(intervalChartSelectAllButton, () => {
  intervalChartSelectedTypes = new Set(intervalChartTypes);
  renderIntervalChartTypes();
  renderIntervalChartTable();
});
bindOptionalClick(intervalChartSelectNoneButton, () => {
  intervalChartSelectedTypes.clear();
  renderIntervalChartTypes();
  renderIntervalChartTable();
});
bindOptionalClick(findRatioButton, () => {
  closeTopMenus("calculate");
  openFindRatioDialog();
});
bindOptionalClick(buildIntervalsButton, () => {
  closeTopMenus("calculate");
  openBuildIntervalsDialog();
});
bindOptionalInput(buildIntervalsInput, () => {
  updateBuildIntervalsPreview();
});
bindOptionalClick(addIntervalButton, () => {
  closeTopMenus();
  setAddIntervalMode(true);
});
if (distanceSelectTriggers.length) {
  distanceSelectTriggers.forEach((button) => {
    bindOptionalClick(button, (event) => {
      event.preventDefault();
      if (!analysisLayers.distances) {
        applyDistancesLayerToggle(true);
      }
      setDistanceSelectMode(true);
    });
  });
}
bindAnalysisLayerTogglePair(
  analysisShowDistancesToggle,
  layoutShowDistancesToggle,
  (checked) => applyDistancesLayerToggle(checked)
);
bindAnalysisLayerTogglePair(
  analysisShowMicrotonalToggle,
  layoutShowMicrotonalToggle,
  (checked) => setMicrotonalIntervalsMode(checked)
);
bindSingleBooleanDrawToggle(directionalRatioLabelsToggle, (checked) => {
  directionalRatioLabels = checked;
});
bindSingleBooleanDrawToggle(connectOrphansToggle, (checked) => {
  connectOrphansEnabled = checked;
});
bindSingleBooleanDrawToggle(show3DShadingToggle, (checked) => {
  show3DShading = checked;
});
bindOptionalClick(layoutFreezeButton, () => {
    if (!layoutLockPosition) {
      layoutLockPosition = true;
      refreshLayoutFromView({ flatten: layoutFreezeFlatten });
      updateLayoutLinkControls();
      updateBannerMessage();
    } else {
      if (
        !window.confirm(
          "Unfreeze and replace layout with the current 2D/3D view? This will discard layout edits."
        )
      ) {
        return;
      }
      layoutLockPosition = false;
      layoutSourceView = null;
      const sourceView = layoutPrevState;
      if (sourceView) {
        view.zoom = sourceView.zoom;
        view.offsetX = sourceView.offsetX;
        view.offsetY = sourceView.offsetY;
        view.rotX = sourceView.rotX;
        view.rotY = sourceView.rotY;
        layoutView = {
          zoom: sourceView.zoom,
          offsetX: sourceView.offsetX,
          offsetY: sourceView.offsetY,
          rotX: sourceView.rotX,
          rotY: sourceView.rotY,
        };
        syncLayoutScaleInput();
      }
      refreshLayoutFromView({ flatten: false });
      updateLayoutLinkControls();
      updateBannerMessage();
    }
});
if (!viewModeInputs.length && !viewModeButtons.length) {
  bindOptionalChange(layoutModeToggle, () => {
    setLayoutMode(layoutModeToggle.checked);
    schedulePresetUrlUpdate();
  });
}

function applyViewModeSelection(nextMode) {
  if (!nextMode) {
    return;
  }
  uiHintKey = "";
  uiHintDismissed = false;
  if (distanceSelectMode) {
    setDistanceSelectMode(false);
  }
  if (nextMode === "layout") {
    setLayoutMode(true);
  } else {
    if (layoutMode) {
      setLayoutMode(false);
    }
    set3DMode(nextMode === "3d");
  }
  schedulePresetUrlUpdate();
}

if (viewModeInputs.length) {
  viewModeInputs.forEach((input) => {
    bindOptionalChange(input, () => {
      if (!input.checked) {
        return;
      }
      applyViewModeSelection(input.value);
    });
  });
}
if (viewModeButtons.length) {
  viewModeButtons.forEach((button) => {
    bindOptionalClick(button, () => {
      applyViewModeSelection(button.dataset.viewMode);
    });
  });
}
if (featureModeButtons.length) {
  featureModeButtons.forEach((button) => {
    bindOptionalClick(button, () => {
      const nextMode = button.dataset.featureMode;
      if (!nextMode) {
        return;
      }
      featureMode = nextMode === "note" ? "note" : "ratio";
      syncFeatureModeControls();
      applyLabelDisplayToggleChange();
    });
  });
}
if (spellingModeButtons.length) {
  spellingModeButtons.forEach((button) => {
    bindOptionalClick(button, () => {
      const nextMode = button.dataset.spellingMode;
      if (!nextMode) {
        return;
      }
      spellingMode = nextMode === "true" ? "true" : "simple";
      spellingHintActive = true;
      syncSpellingModeControls();
      updateUiHint();
      hideFundamentalSpellingDialog();
      applyLabelDisplayToggleChange({ refreshCustom: true });
    });
  });
}
function applyFundamentalSpelling(nextSpelling) {
  if (spellingMode !== "true") {
    return;
  }
  fundamentalSpelling = nextSpelling === "flat" ? "flat" : "sharp";
  invalidateLabelCache();
  updateFundamentalNotes();
  draw();
  schedulePresetUrlUpdate();
  hideFundamentalSpellingDialog();
}

function applyLabelDisplayToggleChange({ refreshCustom = false } = {}) {
  if (refreshCustom) {
    refreshCustomNodes();
  }
  invalidateLabelCache();
  draw();
  schedulePresetUrlUpdate();
}

function bindMirroredBooleanToggles(primaryToggle, secondaryToggle, applyValue, options = {}) {
  const { refreshCustom = false } = options;
  const applyFromChecked = (checked) => {
    applyValue(Boolean(checked));
    setControlChecked(primaryToggle, checked);
    setControlChecked(secondaryToggle, checked);
    applyLabelDisplayToggleChange({ refreshCustom });
  };
  bindOptionalChange(primaryToggle, () => {
    applyFromChecked(primaryToggle.checked);
  });
  bindOptionalChange(secondaryToggle, () => {
    applyFromChecked(secondaryToggle.checked);
  });
}

function applyDistancesLayerToggle(checked) {
  analysisLayers.distances = Boolean(checked);
  if (!analysisLayers.distances) {
    setDistanceSelectMode(false);
  }
  syncAnalysisLayerToggles();
  updateBannerMessage();
  draw();
}

function bindAnalysisLayerTogglePair(primaryToggle, secondaryToggle, applyValue) {
  const applyFromChecked = (checked) => {
    applyValue(checked);
  };
  bindOptionalChange(primaryToggle, () => {
    applyFromChecked(primaryToggle.checked);
  });
  bindOptionalChange(secondaryToggle, () => {
    applyFromChecked(secondaryToggle.checked);
  });
}

function bindSingleBooleanToggle(toggle, applyValue) {
  bindOptionalChange(toggle, () => {
    applyValue(Boolean(toggle.checked));
  });
}

function bindSingleBooleanDrawToggle(toggle, applyValue) {
  bindSingleBooleanToggle(toggle, (checked) => {
    applyValue(checked);
    draw();
    schedulePresetUrlUpdate();
  });
}

function getCheckedRadioValue(groupName, fallbackValue = "") {
  const selected = document.querySelector(`input[name="${groupName}"]:checked`);
  return selected ? selected.value : fallbackValue;
}

function bindPresetInputHandler(inputElement, applyValue) {
  bindOptionalInput(inputElement, () => {
    applyValue();
    schedulePresetUrlUpdate();
  });
}

function bindOptionalEvent(element, eventName, handler, options) {
  if (!element) {
    return;
  }
  element.addEventListener(eventName, handler, options);
}

function bindOptionalClick(element, handler) {
  bindOptionalEvent(element, "click", handler);
}

function bindOptionalChange(element, handler) {
  bindOptionalEvent(element, "change", handler);
}

function bindOptionalInput(element, handler) {
  bindOptionalEvent(element, "input", handler);
}

function bindDialogBackdropClose(dialog, returnValue) {
  if (!dialog) {
    return;
  }
  bindOptionalEvent(dialog, "click", (event) => {
    if (event.target === dialog) {
      dialog.close(returnValue);
    }
  });
}

function preventDialogEnterExceptTextarea(dialog) {
  if (!dialog) {
    return;
  }
  bindOptionalEvent(dialog, "keydown", (event) => {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  });
}

function bindOptionalDialogClose(dialog, handler) {
  bindOptionalEvent(dialog, "close", handler);
}

function bindOptionalEnterKey(element, handler) {
  bindOptionalEvent(element, "keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    handler(event);
  });
}

function applyCentsModeToggle(kind, checked) {
  if (kind === "ratio") {
    showRatioCents = Boolean(checked);
    if (showRatioCents) {
      showCentsDeviation = false;
    }
  } else {
    showCentsDeviation = Boolean(checked);
    if (showCentsDeviation) {
      showRatioCents = false;
    }
  }
  enforceCentsDisplayMode();
  applyLabelDisplayToggleChange();
}

function bindCentsModeTogglePair(primaryToggle, secondaryToggle, kind) {
  bindOptionalChange(primaryToggle, () => {
    applyCentsModeToggle(kind, primaryToggle.checked);
  });
  bindOptionalChange(secondaryToggle, () => {
    applyCentsModeToggle(kind, secondaryToggle.checked);
  });
}

function bindMirroredDrawToggles(primaryToggle, secondaryToggle, applyValue) {
  const applyFromChecked = (checked) => {
    applyValue(Boolean(checked));
    setControlChecked(primaryToggle, checked);
    setControlChecked(secondaryToggle, checked);
    draw();
    schedulePresetUrlUpdate();
  };
  bindOptionalChange(primaryToggle, () => {
    applyFromChecked(primaryToggle.checked);
  });
  bindOptionalChange(secondaryToggle, () => {
    applyFromChecked(secondaryToggle.checked);
  });
}

bindMirroredBooleanToggles(
  showHzToggle,
  layoutShowHzToggle,
  (checked) => {
    showHz = checked;
  }
);
bindCentsModeTogglePair(showRatioCentsToggle, layoutShowRatioCentsToggle, "ratio");
bindCentsModeTogglePair(showCentsDeviationToggle, layoutShowCentsDeviationToggle, "deviation");
bindSingleBooleanToggle(showCentsSignToggle, (checked) => {
  showCentsSign = checked;
  applyLabelDisplayToggleChange();
});
bindMirroredBooleanToggles(
  hejiEnabledToggle,
  layoutHejiEnabledToggle,
  (checked) => {
    hejiEnabled = checked;
  },
  { refreshCustom: true }
);
bindMirroredBooleanToggles(
  enharmonicsEnabledToggle,
  layoutEnharmonicsEnabledToggle,
  (checked) => {
    const next = Boolean(checked);
    enharmonicsEnabledPreference = next;
    enharmonicsEnabled = showCentsDeviation ? next : false;
  },
  { refreshCustom: true }
);
if (showHelpToggle) {
  setControlChecked(showHelpToggle, showHelpEnabled);
  bindOptionalChange(showHelpToggle, () => {
    showHelpEnabled = showHelpToggle.checked;
    if (!showHelpEnabled) {
      if (uiHint) {
        setUiHintVisibility(false);
      }
      return;
    }
    uiHintDismissed = false;
    updateUiHint();
  });
}
if (centsPrecisionButtons.length) {
  centsPrecisionButtons.forEach((button) => {
    bindOptionalClick(button, () => {
      const next = Number(button.dataset.centsPrecision);
      if (!Number.isFinite(next)) {
        return;
      }
      centsPrecision = Math.min(2, Math.max(0, Math.round(next)));
      syncCentsPrecisionControls();
      invalidateLabelCache();
      updateIntervalChartIfOpen();
      draw();
      schedulePresetUrlUpdate();
    });
  });
}
if (hzPrecisionButtons.length) {
  hzPrecisionButtons.forEach((button) => {
    bindOptionalClick(button, () => {
      const next = Number(button.dataset.hzPrecision);
      if (!Number.isFinite(next)) {
        return;
      }
      hzPrecision = Math.min(2, Math.max(0, Math.round(next)));
      syncHzPrecisionControls();
      invalidateLabelCache();
      updateFundamentalNotes();
      draw();
      schedulePresetUrlUpdate();
    });
  });
}
if (layoutKeyMappingButtons.length) {
  layoutKeyMappingButtons.forEach((button) => {
    bindOptionalClick(button, () => {
      setLayoutKeyMappingMode(button.dataset.layoutKeyMapping);
    });
  });
}
bindOptionalClick(layoutShareLinkButton, async () => {
  const state = getPresetState();
  const encoded = encodePresetState(state);
  logPresetSizeBreakdown(state, encoded.length);
  console.log("Preset size summary", {
    encodedLength: encoded.length,
    jsonBytes: getJsonByteSize(state),
  });
  const hash = `${PRESET_PARAM}=${encoded}`;
  history.replaceState(null, "", `${location.pathname}${location.search}#${hash}`);
  const shareUrl = `${location.origin}${location.pathname}${location.search}#${hash}`;
  if (encoded.length > 3500) {
    showFileSharePopover("Preset URL copied (very long). Use File > Save / Load if it fails.");
  }
  try {
    await copyTextToClipboard(shareUrl);
    showFileSharePopover("Preset URL copied. Paste it in a new tab to reopen this preset.");
  } catch (error) {
    showFileSharePopover("Couldn't copy the preset URL. Try again.");
  }
});
bindOptionalClick(layoutExitButton, () => {
  setControlChecked(layoutModeToggle, false);
  setLayoutMode(false);
  schedulePresetUrlUpdate();
});
bindLayoutTextInput(layoutTitleInput, (value) => {
  layoutTitle = value;
});
bindLayoutTextInput(layoutCreatorInput, (value) => {
  layoutCreator = value;
});
bindLayoutNumericInput(layoutTitleSizeInput, {
  applyValue: (value) => {
    setLayoutTitleSize(value);
  },
});
bindLayoutNumericInput(layoutCreatorSizeInput, {
  applyValue: (value) => {
    setLayoutCreatorSize(value);
  },
});
bindLayoutSelectControl(layoutPageSizeSelect, (value) => {
  layoutPageSize = value || "letter";
});
bindLayoutSelectControl(layoutOrientationSelect, (value) => {
  layoutOrientation = value || "portrait";
});
bindOptionalInput(layoutScaleInput, () => {
  pushLayoutUndoState();
  view.zoom = Number(layoutScaleInput.value) || 1;
  if (layoutLockPosition && layoutMode) {
    layoutView = { ...layoutView, zoom: view.zoom };
  }
  updateLayoutScaleReadout();
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
});
if (layoutSpaceTrigger && layoutSpacePopover) {
  bindOptionalClick(layoutSpaceTrigger, (event) => {
    if (!layoutMode) {
      return;
    }
    event.preventDefault();
    updateLayoutSpacingControls();
    layoutSpacePopover.hidden = !layoutSpacePopover.hidden;
  });
}
bindLayoutNumericInput(layoutSpaceXInput, {
  applyValue: (value) => {
    applyLayoutSpacing({
      x: value || 1,
      y: layoutSpacing.y,
      z: layoutSpacing.z,
    });
  },
  afterChange: updateLayoutSpacingControls,
});
bindLayoutNumericInput(layoutSpaceYInput, {
  applyValue: (value) => {
    applyLayoutSpacing({
      x: layoutSpacing.x,
      y: value || 1,
      z: layoutSpacing.z,
    });
  },
  afterChange: updateLayoutSpacingControls,
});
bindLayoutNumericInput(layoutSpaceZInput, {
  applyValue: (value) => {
    applyLayoutSpacing({
      x: layoutSpacing.x,
      y: layoutSpacing.y,
      z: value || 1,
    });
  },
  afterChange: updateLayoutSpacingControls,
});
if (layoutKeyMappingTrigger && layoutKeyMappingPopover) {
  bindOptionalClick(layoutKeyMappingTrigger, (event) => {
    if (!layoutMode) {
      return;
    }
    event.preventDefault();
    const nextHidden = !layoutKeyMappingPopover.hidden;
    layoutKeyMappingPopover.hidden = nextHidden;
    layoutKeyMappingTrigger.setAttribute("aria-expanded", nextHidden ? "false" : "true");
  });
}
function bindLayoutNumericInput(inputElement, { applyValue, afterChange = null }) {
  bindOptionalInput(inputElement, () => {
    pushLayoutUndoState();
    applyValue(Number(inputElement.value));
    if (typeof afterChange === "function") {
      afterChange();
    }
    draw();
    schedulePresetUrlUpdate();
  });
}

function bindLayoutBooleanToggle(toggle, applyValue) {
  bindOptionalChange(toggle, () => {
    pushLayoutUndoState();
    applyValue(Boolean(toggle.checked));
    draw();
    schedulePresetUrlUpdate();
  });
}

function bindLayoutTextInput(inputElement, applyValue) {
  bindOptionalInput(inputElement, () => {
    pushLayoutUndoState();
    applyValue(String(inputElement.value || "").trim());
    draw();
    schedulePresetUrlUpdate();
  });
}

function bindLayoutSelectControl(selectElement, applyValue) {
  bindOptionalChange(selectElement, () => {
    pushLayoutUndoState();
    applyValue(selectElement.value);
    draw();
    schedulePresetUrlUpdate();
  });
}

bindLayoutNumericInput(layoutKeyMappingSizeInput, {
  applyValue: (value) => {
    layoutKeyMappingTextSize = value || layoutKeyMappingTextSize;
  },
});
bindLayoutNumericInput(layoutKeyMappingOffsetInput, {
  applyValue: (value) => {
    layoutKeyMappingOffset = value || layoutKeyMappingOffset;
  },
});
bindLayoutBooleanToggle(layoutKeyMappingDarkToggle, (checked) => {
  layoutKeyMappingDark = checked;
});
bindLayoutNumericInput(layoutNodeSizeInput, {
  applyValue: (value) => {
    layoutNodeSize = value || layoutNodeSize;
  },
  afterChange: updateLayoutNodeSizeReadout,
});
bindLayoutNumericInput(layoutRatioTextSizeInput, {
  applyValue: (value) => {
    layoutRatioTextSize = value || layoutRatioTextSize;
  },
  afterChange: updateLayoutRatioTextReadout,
});
bindLayoutNumericInput(layoutNoteTextSizeInput, {
  applyValue: (value) => {
    layoutNoteTextSize = value || layoutNoteTextSize;
  },
  afterChange: updateLayoutNoteTextReadout,
});
bindLayoutNumericInput(layoutTriangleLabelSizeInput, {
  applyValue: (value) => {
    layoutTriangleLabelTextSize = value || layoutTriangleLabelTextSize;
  },
  afterChange: updateLayoutTriangleLabelReadout,
});
bindLayoutNumericInput(layoutAxisSizeInput, {
  applyValue: (value) => {
    layoutAxisLegendTextSize = value || layoutAxisLegendTextSize;
  },
});
bindLayoutNumericInput(layoutCustomLabelSizeInput, {
  applyValue: (value) => {
    setLayoutCustomLabelSize(value);
  },
});
bindLayoutNumericInput(layoutTitleMarginInput, {
  applyValue: (value) => {
    layoutTitleMargin = value || layoutTitleMargin;
  },
  afterChange: updateLayoutTitleMarginReadout,
});
bindLayoutSelectControl(layoutNodeShapeSelect, (value) => {
  layoutNodeShape = value || "circle";
});
let layoutFontSnapshot = null;

function resolveLayoutFontChoice(selectElement, preferred, fallback) {
  if (!selectElement) {
    return fallback;
  }
  const normalize = (value) =>
    String(value || "")
      .trim()
      .replace(/^['"]+|['"]+$/g, "");
  const options = Array.from(selectElement.options || []).map((option) => option.value);
  const preferredValue = normalize(preferred);
  if (preferredValue && options.includes(preferredValue)) {
    return preferredValue;
  }
  const fallbackValue = normalize(fallback);
  if (fallbackValue && options.includes(fallbackValue)) {
    return fallbackValue;
  }
  return options[0] || "";
}

function syncLayoutFontSelect(selectElement, currentValue, fallbackValue, assign) {
  if (!selectElement) {
    return;
  }
  const resolved = resolveLayoutFontChoice(selectElement, currentValue, fallbackValue);
  if (resolved) {
    assign(resolved);
    setControlValue(selectElement, resolved);
  }
}

function syncLayoutFontWeightAndSizeControls({
  weightControl,
  weightValue,
  sizeControl,
  sizeValue,
}) {
  setControlValue(weightControl, weightValue);
  setControlValue(sizeControl, sizeValue);
}

function syncLayoutFontPopoverInputs() {
  syncLayoutFontSelect(
    layoutTitleFontSelect,
    layoutTitleFont,
    LAYOUT_DEFAULTS.titleFont,
    (value) => {
      layoutTitleFont = value;
    }
  );
  syncLayoutFontSelect(
    layoutCreatorFontSelect,
    layoutCreatorFont,
    LAYOUT_DEFAULTS.creatorFont,
    (value) => {
      layoutCreatorFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutTitleWeightSelect,
    weightValue: layoutTitleFontWeight,
    sizeControl: layoutTitleSizeInput,
    sizeValue: layoutTitleSize,
  });
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutCreatorWeightSelect,
    weightValue: layoutCreatorFontWeight,
    sizeControl: layoutCreatorSizeInput,
    sizeValue: layoutCreatorSize,
  });
  syncLayoutFontSelect(
    layoutRatioFontSelect,
    layoutRatioFont,
    LAYOUT_DEFAULTS.ratioFont,
    (value) => {
      layoutRatioFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutRatioWeightSelect,
    weightValue: layoutRatioFontWeight,
    sizeControl: layoutRatioTextSizeInput,
    sizeValue: layoutRatioTextSize,
  });
  syncLayoutFontSelect(
    layoutNoteFontSelect,
    layoutNoteFont,
    LAYOUT_DEFAULTS.noteFont,
    (value) => {
      layoutNoteFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutNoteWeightSelect,
    weightValue: layoutNoteFontWeight,
    sizeControl: layoutNoteTextSizeInput,
    sizeValue: layoutNoteTextSize,
  });
  syncLayoutFontSelect(
    layoutTriangleLabelFontSelect,
    layoutTriangleLabelFont,
    LAYOUT_DEFAULTS.triangleLabelFont,
    (value) => {
      layoutTriangleLabelFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutTriangleLabelWeightSelect,
    weightValue: layoutTriangleLabelFontWeight,
    sizeControl: layoutTriangleLabelSizeInput,
    sizeValue: layoutTriangleLabelTextSize,
  });
  syncLayoutFontSelect(
    layoutCustomFontSelect,
    layoutCustomLabelFont,
    LAYOUT_DEFAULTS.customLabelFont,
    (value) => {
      layoutCustomLabelFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutCustomWeightSelect,
    weightValue: layoutCustomLabelFontWeight,
    sizeControl: layoutCustomLabelSizeInput,
    sizeValue: layoutCustomLabelTextSize,
  });
  syncLayoutFontSelect(
    layoutAxisFontSelect,
    layoutAxisLegendFont,
    LAYOUT_DEFAULTS.axisLegendFont,
    (value) => {
      layoutAxisLegendFont = value;
    }
  );
  syncLayoutFontSelect(
    layoutLineLabelFontSelect,
    layoutLineLabelFont,
    LAYOUT_DEFAULTS.lineLabelFont,
    (value) => {
      layoutLineLabelFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutAxisWeightSelect,
    weightValue: layoutAxisLegendFontWeight,
    sizeControl: layoutAxisSizeInput,
    sizeValue: layoutAxisLegendTextSize,
  });
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutLineLabelWeightSelect,
    weightValue: layoutLineLabelFontWeight,
    sizeControl: layoutLineLabelSizeInput,
    sizeValue: layoutLineLabelTextSize,
  });
  syncLayoutFontSelect(
    layoutKeyMappingFontSelect,
    layoutKeyMappingFont,
    LAYOUT_DEFAULTS.keyMappingFont,
    (value) => {
      layoutKeyMappingFont = value;
    }
  );
  syncLayoutFontWeightAndSizeControls({
    weightControl: layoutKeyMappingWeightSelect,
    weightValue: layoutKeyMappingFontWeight,
    sizeControl: layoutKeyMappingSizeInput,
    sizeValue: layoutKeyMappingTextSize,
  });
}

function applyLayoutFontSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }
  layoutTitleFont = snapshot.title;
  layoutRatioFont = snapshot.ratio;
  layoutNoteFont = snapshot.note;
  layoutTriangleLabelFont = snapshot.triangleLabel;
  layoutCustomLabelFont = snapshot.customLabel;
  layoutKeyMappingFont = snapshot.keyMapping;
  layoutAxisLegendFont = snapshot.axisLegend;
  layoutLineLabelFont = snapshot.lineLabel ?? layoutLineLabelFont;
  layoutCreatorFont = snapshot.creator;
  layoutTitleFontWeight = snapshot.titleWeight;
  layoutRatioFontWeight = snapshot.ratioWeight;
  layoutNoteFontWeight = snapshot.noteWeight;
  layoutTriangleLabelFontWeight = snapshot.triangleLabelWeight;
  layoutCustomLabelFontWeight = snapshot.customLabelWeight;
  layoutKeyMappingFontWeight = snapshot.keyMappingWeight;
  layoutAxisLegendFontWeight = snapshot.axisLegendWeight;
  layoutLineLabelFontWeight = snapshot.lineLabelWeight ?? layoutLineLabelFontWeight;
  layoutCreatorFontWeight = snapshot.creatorWeight;
  setLayoutTitleSize(snapshot.titleSize);
  setLayoutCreatorSize(snapshot.creatorSize);
  layoutRatioTextSize = snapshot.ratioTextSize;
  layoutNoteTextSize = snapshot.noteTextSize;
  layoutTriangleLabelTextSize = snapshot.triangleLabelTextSize;
  setLayoutCustomLabelSize(snapshot.customLabelTextSize);
  layoutKeyMappingTextSize = snapshot.keyMappingTextSize;
  layoutAxisLegendTextSize = snapshot.axisLegendTextSize;
  layoutLineLabelTextSize = snapshot.lineLabelTextSize ?? layoutLineLabelTextSize;
  updateLayoutRatioTextReadout();
  updateLayoutNoteTextReadout();
  updateLayoutTriangleLabelReadout();
  syncLayoutFontVars();
  syncLayoutFontPopoverInputs();
  invalidateLabelCache({ clearTextWidths: true });
  draw();
  schedulePresetUrlUpdate();
}

function closeLayoutFontPopover({ revert = false } = {}) {
  if (!layoutFontPopover || !layoutFontsButton) {
    return;
  }
  if (revert && layoutFontSnapshot) {
    applyLayoutFontSnapshot(layoutFontSnapshot);
  }
  layoutFontPopover.hidden = true;
  layoutFontsButton.setAttribute("aria-expanded", "false");
  layoutFontSnapshot = null;
}

bindOptionalClick(layoutFontsButton, (event) => {
  if (!layoutFontPopover || !layoutMode) {
    return;
  }
  event.preventDefault();
  if (!layoutFontPopover.hidden) {
    closeLayoutFontPopover();
    return;
  }
  layoutFontSnapshot = {
    title: layoutTitleFont,
    ratio: layoutRatioFont,
    note: layoutNoteFont,
    triangleLabel: layoutTriangleLabelFont,
    customLabel: layoutCustomLabelFont,
    keyMapping: layoutKeyMappingFont,
    axisLegend: layoutAxisLegendFont,
    lineLabel: layoutLineLabelFont,
    creator: layoutCreatorFont,
    titleWeight: layoutTitleFontWeight,
    ratioWeight: layoutRatioFontWeight,
    noteWeight: layoutNoteFontWeight,
    triangleLabelWeight: layoutTriangleLabelFontWeight,
    customLabelWeight: layoutCustomLabelFontWeight,
    keyMappingWeight: layoutKeyMappingFontWeight,
    axisLegendWeight: layoutAxisLegendFontWeight,
    lineLabelWeight: layoutLineLabelFontWeight,
    creatorWeight: layoutCreatorFontWeight,
    titleSize: layoutTitleSize,
    creatorSize: layoutCreatorSize,
    ratioTextSize: layoutRatioTextSize,
    noteTextSize: layoutNoteTextSize,
    triangleLabelTextSize: layoutTriangleLabelTextSize,
    customLabelTextSize: layoutCustomLabelTextSize,
    keyMappingTextSize: layoutKeyMappingTextSize,
    axisLegendTextSize: layoutAxisLegendTextSize,
    lineLabelTextSize: layoutLineLabelTextSize,
  };
  updateLayoutCustomLabelControls();
  syncLayoutFontPopoverInputs();
  layoutFontPopover.hidden = false;
  layoutFontsButton.setAttribute("aria-expanded", "true");
});
bindOptionalClick(layoutAlignXButton, () => {
  if (!layoutMode) {
    return;
  }
  setLayoutAlignMode("x");
});
bindOptionalClick(layoutAlignYButton, () => {
  if (!layoutMode) {
    return;
  }
  setLayoutAlignMode("y");
});
bindOptionalClick(layoutStraightenButton, () => {
  if (!layoutMode) {
    return;
  }
  setLayoutAlignMode("straighten");
});
bindOptionalClick(layoutFontCancelButton, () => {
  closeLayoutFontPopover({ revert: true });
});
bindOptionalClick(layoutFontDoneButton, () => {
  closeLayoutFontPopover();
});
let layoutKeyMappingTextSnapshot = null;
if (layoutKeyMappingTextButton && layoutKeyMappingTextDialog) {
  bindOptionalClick(layoutKeyMappingTextButton, () => {
    if (typeof layoutKeyMappingTextDialog.showModal === "function") {
      layoutKeyMappingTextSnapshot = {
        prefix: layoutKeyMappingPrefix,
        suffix: layoutKeyMappingSuffix,
      };
      setControlValue(layoutKeyMappingPrefixInput, layoutKeyMappingPrefix);
      setControlValue(layoutKeyMappingSuffixInput, layoutKeyMappingSuffix);
      layoutKeyMappingTextDialog.showModal();
    }
  });
}
bindOptionalClick(layoutPanelToggle, () => {
  const isCollapsed = layoutPanel && layoutPanel.classList.contains("is-collapsed");
  setLayoutPanelCollapsed(!isCollapsed);
});
bindOptionalDialogClose(layoutKeyMappingTextDialog, () => {
    if (layoutKeyMappingTextDialog.returnValue === "cancel" && layoutKeyMappingTextSnapshot) {
      layoutKeyMappingPrefix = layoutKeyMappingTextSnapshot.prefix;
      layoutKeyMappingSuffix = layoutKeyMappingTextSnapshot.suffix;
    } else {
      layoutKeyMappingPrefix = layoutKeyMappingPrefixInput
        ? layoutKeyMappingPrefixInput.value
        : "";
      layoutKeyMappingSuffix = layoutKeyMappingSuffixInput
        ? layoutKeyMappingSuffixInput.value
        : "";
    }
    setControlValue(layoutKeyMappingPrefixInput, layoutKeyMappingPrefix);
    setControlValue(layoutKeyMappingSuffixInput, layoutKeyMappingSuffix);
    layoutKeyMappingTextSnapshot = null;
    draw();
    schedulePresetUrlUpdate();
});
document.querySelectorAll("dialog").forEach((dialog) => {
  setupDialogKeyDefaults(dialog);
});
if (creditsTrigger && creditsDialog) {
  bindOptionalClick(creditsTrigger, (event) => {
    event.preventDefault();
    if (!creditsDialog.open) {
      creditsDialog.showModal();
    }
  });
  bindOptionalClick(creditsDialog, () => {
    if (creditsDialog.open) {
      creditsDialog.close("dismiss");
    }
  });
}
function bindLayoutFontFamilyChange(
  selectElement,
  { getCurrent, setCurrent, getWeight, getSize, syncVars = false, invalidateCache = true }
) {
  bindOptionalChange(selectElement, () => {
    pushLayoutUndoState();
    const nextValue = selectElement.value || getCurrent();
    setCurrent(nextValue);
    if (syncVars) {
      syncLayoutFontVars();
    }
    if (invalidateCache) {
      invalidateLabelCache({ clearTextWidths: true });
    }
    ensureUiFontReady(nextValue, getWeight(), getSize()).then(draw);
    draw();
    schedulePresetUrlUpdate();
  });
}

function bindLayoutFontWeightChange(
  selectElement,
  {
    getCurrent,
    setCurrent,
    getFamily,
    getSize,
    invalidateCache = true,
    ensureReady = true,
  }
) {
  bindOptionalChange(selectElement, () => {
    pushLayoutUndoState();
    const nextValue = Number(selectElement.value) || getCurrent();
    setCurrent(nextValue);
    if (invalidateCache) {
      invalidateLabelCache({ clearTextWidths: true });
    }
    if (ensureReady) {
      ensureUiFontReady(getFamily(), nextValue, getSize()).then(draw);
    }
    draw();
    schedulePresetUrlUpdate();
  });
}

[
  {
    selectElement: layoutTitleFontSelect,
    getCurrent: () => layoutTitleFont,
    setCurrent: (value) => {
      layoutTitleFont = value;
    },
    getWeight: () => layoutTitleFontWeight,
    getSize: () => layoutTitleSize,
    syncVars: true,
  },
  {
    selectElement: layoutCreatorFontSelect,
    getCurrent: () => layoutCreatorFont,
    setCurrent: (value) => {
      layoutCreatorFont = value;
    },
    getWeight: () => layoutCreatorFontWeight,
    getSize: () => layoutCreatorSize,
  },
  {
    selectElement: layoutRatioFontSelect,
    getCurrent: () => layoutRatioFont,
    setCurrent: (value) => {
      layoutRatioFont = value;
    },
    getWeight: () => layoutRatioFontWeight,
    getSize: () => layoutRatioTextSize,
    syncVars: true,
  },
  {
    selectElement: layoutNoteFontSelect,
    getCurrent: () => layoutNoteFont,
    setCurrent: (value) => {
      layoutNoteFont = value;
    },
    getWeight: () => layoutNoteFontWeight,
    getSize: () => layoutNoteTextSize,
    syncVars: true,
  },
  {
    selectElement: layoutCustomFontSelect,
    getCurrent: () => layoutCustomLabelFont,
    setCurrent: (value) => {
      layoutCustomLabelFont = value;
    },
    getWeight: () => layoutCustomLabelFontWeight,
    getSize: () => layoutCustomLabelTextSize,
    syncVars: true,
  },
  {
    selectElement: layoutKeyMappingFontSelect,
    getCurrent: () => layoutKeyMappingFont,
    setCurrent: (value) => {
      layoutKeyMappingFont = value;
    },
    getWeight: () => layoutKeyMappingFontWeight,
    getSize: () => layoutKeyMappingTextSize,
    syncVars: true,
    invalidateCache: false,
  },
  {
    selectElement: layoutTriangleLabelFontSelect,
    getCurrent: () => layoutTriangleLabelFont,
    setCurrent: (value) => {
      layoutTriangleLabelFont = value;
    },
    getWeight: () => layoutTriangleLabelFontWeight,
    getSize: () => layoutTriangleLabelTextSize,
    syncVars: true,
  },
  {
    selectElement: layoutAxisFontSelect,
    getCurrent: () => layoutAxisLegendFont,
    setCurrent: (value) => {
      layoutAxisLegendFont = value;
    },
    getWeight: () => layoutAxisLegendFontWeight,
    getSize: () => layoutAxisLegendTextSize,
  },
  {
    selectElement: layoutLineLabelFontSelect,
    getCurrent: () => layoutLineLabelFont,
    setCurrent: (value) => {
      layoutLineLabelFont = value;
    },
    getWeight: () => layoutLineLabelFontWeight,
    getSize: () => layoutLineLabelTextSize,
  },
].forEach((config) => {
  const { selectElement, ...options } = config;
  bindLayoutFontFamilyChange(selectElement, options);
});

[
  {
    selectElement: layoutTitleWeightSelect,
    getCurrent: () => layoutTitleFontWeight,
    setCurrent: (value) => {
      layoutTitleFontWeight = value;
    },
    getFamily: () => layoutTitleFont,
    getSize: () => layoutTitleSize,
  },
  {
    selectElement: layoutCreatorWeightSelect,
    getCurrent: () => layoutCreatorFontWeight,
    setCurrent: (value) => {
      layoutCreatorFontWeight = value;
    },
    getFamily: () => layoutCreatorFont,
    getSize: () => layoutCreatorSize,
  },
  {
    selectElement: layoutRatioWeightSelect,
    getCurrent: () => layoutRatioFontWeight,
    setCurrent: (value) => {
      layoutRatioFontWeight = value;
    },
    getFamily: () => layoutRatioFont,
    getSize: () => layoutRatioTextSize,
  },
  {
    selectElement: layoutNoteWeightSelect,
    getCurrent: () => layoutNoteFontWeight,
    setCurrent: (value) => {
      layoutNoteFontWeight = value;
    },
    getFamily: () => layoutNoteFont,
    getSize: () => layoutNoteTextSize,
  },
  {
    selectElement: layoutCustomWeightSelect,
    getCurrent: () => layoutCustomLabelFontWeight,
    setCurrent: (value) => {
      layoutCustomLabelFontWeight = value;
    },
    getFamily: () => layoutCustomLabelFont,
    getSize: () => layoutCustomLabelTextSize,
  },
  {
    selectElement: layoutKeyMappingWeightSelect,
    getCurrent: () => layoutKeyMappingFontWeight,
    setCurrent: (value) => {
      layoutKeyMappingFontWeight = value;
    },
    getFamily: () => layoutKeyMappingFont,
    getSize: () => layoutKeyMappingTextSize,
    invalidateCache: false,
  },
  {
    selectElement: layoutTriangleLabelWeightSelect,
    getCurrent: () => layoutTriangleLabelFontWeight,
    setCurrent: (value) => {
      layoutTriangleLabelFontWeight = value;
    },
    getFamily: () => layoutTriangleLabelFont,
    getSize: () => layoutTriangleLabelTextSize,
  },
  {
    selectElement: layoutAxisWeightSelect,
    getCurrent: () => layoutAxisLegendFontWeight,
    setCurrent: (value) => {
      layoutAxisLegendFontWeight = value;
    },
    getFamily: () => layoutAxisLegendFont,
    getSize: () => layoutAxisLegendTextSize,
    ensureReady: false,
  },
  {
    selectElement: layoutLineLabelWeightSelect,
    getCurrent: () => layoutLineLabelFontWeight,
    setCurrent: (value) => {
      layoutLineLabelFontWeight = value;
    },
    getFamily: () => layoutLineLabelFont,
    getSize: () => layoutLineLabelTextSize,
    ensureReady: false,
  },
].forEach((config) => {
  const { selectElement, ...options } = config;
  bindLayoutFontWeightChange(selectElement, options);
});
bindLayoutNumericInput(layoutLineLabelSizeInput, {
  applyValue: (value) => {
    layoutLineLabelTextSize = value || layoutLineLabelTextSize;
  },
  afterChange: () => {
    invalidateLabelCache({ clearTextWidths: true });
  },
});
bindLayoutBooleanToggle(layoutUnifySizeToggle, (checked) => {
  layoutUnifyNodeSize = checked;
  syncLayoutPerspectiveTextToggleState();
  layoutAxisAngles = { x: null, y: null, z: null };
});
bindOptionalChange(layoutPerspectiveTextSizeToggle, () => {
    if (layoutUnifyNodeSize) {
      syncLayoutPerspectiveTextToggleState();
      return;
    }
    pushLayoutUndoState();
    layoutPerspectiveTextSize = layoutPerspectiveTextSizeToggle.checked;
    syncLayoutPerspectiveTextToggleState();
    draw();
    schedulePresetUrlUpdate();
});
bindOptionalClick(layoutResetButton, () => {
    pushLayoutUndoState();
    const preserveLockPosition = layoutLockPosition;
    const preservedLayoutView = preserveLockPosition ? { ...layoutView } : null;
    resetLayoutState({ resetView: false });
    if (preserveLockPosition) {
      layoutLockPosition = true;
      if (preservedLayoutView) {
        layoutView = { ...preservedLayoutView };
      }
      updateLayoutLinkControls();
    }
    draw();
    schedulePresetUrlUpdate();
});
bindOptionalClick(exportSvgButton, exportLayoutSvg);
bindOptionalClick(exportPdfButton, exportLayoutPdf);
bindOptionalChange(midiEnable, async () => {
  midiEnabled = midiEnable.checked;
  if (midiEnabled && !midiAccess) {
    await initMidi();
  }
});
bindOptionalChange(midiPortSelect, () => {
  selectMidiInput(midiPortSelect.value);
});
bindOptionalChange(midiOutEnable, async () => {
  midiOutEnabled = midiOutEnable.checked;
  if (midiOutEnabled && !midiAccess) {
    await initMidi();
  }
  if (midiOutEnabled && midiOutDevice) {
    sendMidiOutPitchBendRange();
  } else if (!midiOutEnabled) {
    const active = [...midiOutActive.entries()];
    active.forEach(([voiceId]) => {
      const voice = findVoiceById(voiceId);
      if (voice) {
        sendMidiOutNoteOff(voice);
      }
    });
  }
});
bindOptionalChange(midiOutPortSelect, () => {
  selectMidiOutput(midiOutPortSelect.value);
});
bindOptionalInput(midiOutBendInput, () => {
  const value = Number(midiOutBendInput.value);
  if (Number.isFinite(value) && value > 0) {
    midiOutBendRange = value;
    if (midiOutEnabled && midiOutDevice) {
      sendMidiOutPitchBendRange();
    }
  }
});
bindOptionalClick(envelopeToggle, toggleEnvelopePanel);
bindOptionalClick(animationToggle, toggleAnimationPanel);
bindOptionalClick(ratioWheelToggle, toggleRatioWheelPanel);
bindOptionalClick(midiMenuToggle, toggleMidiMenuPanel);
if (ratioWheelLarge) {
  bindOptionalEvent(ratioWheelLarge, "mousemove", handleRatioWheelHover);
}
bindOptionalClick(ratioWheelLarge, handleRatioWheelClick);
if (ratioWheelLarge) {
  bindOptionalEvent(ratioWheelLarge, "mouseleave", clearRatioWheelHover);
}
bindOptionalEnterKey(addIntervalInput, () => {
  if (addIntervalDialog) {
    addIntervalDialog.returnValue = "add";
    addIntervalDialog.close();
  }
});
if (addIntervalInput) {
  bindOptionalChange(addIntervalSelect, () => {
    const value = String(addIntervalSelect.value || "custom");
    if (value === "custom") {
      addIntervalInput.disabled = false;
      addIntervalInput.value = "";
      addIntervalInput.focus();
      return;
    }
    addIntervalInput.value = value;
    addIntervalInput.disabled = true;
  });
}
if (findRatioDialog) {
  preventDialogEnterExceptTextarea(findRatioDialog);
  bindOptionalDialogClose(findRatioDialog, async () => {
    resetHeldModifiers();
    if (findRatioDialog.returnValue === "find") {
      await maybeConfirmFindRatioAxes(findRatioInput ? findRatioInput.value : "");
      findOrCreateRatiosFromInput(findRatioInput ? findRatioInput.value : "");
    }
    if (findRatioInput) {
      findRatioInput.value = "";
      updateFindRatioAxisRecommendation("");
    }
  });
}
bindOptionalInput(findRatioInput, () => {
  updateFindRatioAxisRecommendation(findRatioInput.value);
});
if (buildIntervalsDialog) {
  preventDialogEnterExceptTextarea(buildIntervalsDialog);
  bindOptionalDialogClose(buildIntervalsDialog, () => {
    resetHeldModifiers();
    if (buildIntervalsDialog.returnValue === "build") {
      buildFromIntervalsInput(buildIntervalsInput ? buildIntervalsInput.value : "");
    }
    if (buildIntervalsInput) {
      buildIntervalsInput.value = "";
    }
    updateBuildIntervalsPreview();
  });
}
bindOptionalDialogClose(addIntervalDialog, () => {
    resetHeldModifiers();
    if (addIntervalDialog.returnValue === "add") {
      const sourceNode = addIntervalSourceNodeId
        ? nodeById.get(addIntervalSourceNodeId)
        : null;
      const intervalRatio = getSelectedIntervalRatio();
      if (!sourceNode) {
        alert("Please select a starting node.");
      } else if (!intervalRatio) {
        alert("Please enter a ratio like 81:80 or 81/80.");
      } else if (!applyAddIntervalFromSource(sourceNode, intervalRatio)) {
        alert("Unable to place that interval on the current lattice.");
      }
    }
    addIntervalSourceNodeId = null;
    if (addIntervalInput) {
      addIntervalInput.value = "";
      addIntervalInput.disabled = false;
    }
});
bindOptionalClick(presetToggle, togglePresetPanel);
bindOptionalClick(fileToggle, toggleFilePanel);
bindOptionalClick(uiHint, (event) => {
  uiHintDismissed = true;
  showHelpEnabled = false;
  if (showHelpToggle) {
    setControlChecked(showHelpToggle, false);
  }
  setUiHintVisibility(false);
});
bindOptionalClick(bannerMessage, (event) => {
  if (tempBannerActive) {
    return;
  }
  const target = event.target instanceof Element ? event.target : bannerMessage;
  const actionEl = target.closest("[data-layout-banner]");
  const layoutAction = actionEl ? actionEl.getAttribute("data-layout-banner") : null;
  if (layoutAction === "freeze") {
    layoutLockPosition = true;
    refreshLayoutFromView({ flatten: layoutFreezeFlatten });
    updateLayoutLinkControls();
    updateBannerMessage();
    return;
  }
  if (layoutAction === "exit-align") {
    setLayoutAlignMode("");
    return;
  }
  if (layoutAction === "exit-distance-edit") {
    exitTemporaryInteraction("distance-edit");
    return;
  }
  if (layoutAction === "exit-microtonal") {
    exitTemporaryInteraction("microtonal-intervals");
    return;
  }
  if (layoutAction === "exit-axis-mode") {
    exitTemporaryInteraction("axis-mode");
    return;
  }
  if (layoutAction === "exit-layout-axis-edit") {
    exitTemporaryInteraction("layout-axis-edit");
    return;
  }
  if (layoutAction === "reset-volumes") {
    nodeVolumeLimits.clear();
    customNodes.forEach((node) => {
      node.volumeMax = 1;
      applyNodeVolumeLimitToActiveVoices(node);
    });
    nodes.forEach((node) => {
      if (!node.isCustom) {
        node.volumeMax = 1;
        applyNodeVolumeLimitToActiveVoices(node);
      }
    });
    schedulePresetUrlUpdate();
    draw();
    return;
  }
  bannerDismissedKey = currentBannerKey;
  updateBannerMessage();
});
bindOptionalInput(fundamentalInput, () => {
  syncFundamentalNoteSelect();
  updateNodeFrequencies();
});
bindOptionalClick(fundamentalOctaveDown, () => {
  adjustFundamentalByFactor(0.5);
});
bindOptionalClick(fundamentalOctaveUp, () => {
  adjustFundamentalByFactor(2);
});
bindOptionalChange(ratioXSelect, updateNodeRatios);
bindOptionalChange(ratioYSelect, updateNodeRatios);
bindOptionalChange(ratioZSelect, updateNodeRatios);
bindOptionalInput(a4Input, () => {
  const a4 = Number(a4Input.value) || 440;
  if (fundamentalNoteSelect.value !== FUNDAMENTAL_CUSTOM_VALUE) {
    const selectedMidi = Number(fundamentalNoteSelect.value);
    if (Number.isFinite(selectedMidi)) {
      fundamentalInput.value = String(midiToFrequency(selectedMidi, a4));
    }
  }
  updateFundamentalNotes();
  syncFundamentalNoteSelect();
  updateNodeFrequencies();
});
bindOptionalChange(fundamentalNoteSelect, onFundamentalNoteChange);
bindOptionalClick(fundamentalSpellingSharpButton, (event) => {
  event.preventDefault();
  applyFundamentalSpelling("sharp");
});
bindOptionalClick(fundamentalSpellingFlatButton, (event) => {
  event.preventDefault();
  applyFundamentalSpelling("flat");
});
bindPresetInputHandler(volumeSlider, updateVolume);
bindPresetInputHandler(lfoDepthSlider, updateLfoDepth);
if (lfoRateSlider) {
  bindPresetInputHandler(lfoRateSlider, updateLfoRate);
  updateLfoRate();
}
bindOptionalChange(waveformSelect, () => {
  handleSynthTypeChange();
});
if (synthModeInputs.length) {
  const applySynthModeSelection = () => {
    synthMode = getCheckedRadioValue("synth-mode", "waveform");
    syncSynthModeUI();
    handleSynthTypeChange();
  };
  synthModeInputs.forEach((input) => {
    bindOptionalChange(input, applySynthModeSelection);
  });
}
bindOptionalChange(soundfontPresetSelect, () => {
  const nextIndex = Number(soundfontPresetSelect.value);
  if (Number.isFinite(nextIndex)) {
    soundfontPresetIndex = nextIndex;
    if (soundfontPresetList.length) {
      soundfontPreset =
        soundfontPresetList[soundfontPresetIndex] || soundfontPresetList[0] || null;
    }
  }
  handleSynthTypeChange();
});
bindOptionalChange(physicalModelSelect, () => {
  handleSynthTypeChange();
});
bindOptionalChange(keyboardModeSelect, () => {
  const nextMode = keyboardModeSelect.value;
  if (!isTriangleKeyboardMode(nextMode)) {
    clearTriangleKeyboardActiveVoices();
    clearAutoTriangleDiagonals();
    markAutoTrianglesDirty();
  } else {
    markAutoTrianglesDirty();
    ensureAutoTriangleDiagonals();
  }
  if (keyboardModeSelect.value === "off") {
    resetUiHintToDefault();
  }
  if (keyboardModeSelect.value === "piano") {
    showKeyboardModeHelp("2 octave layout with C mapped to Z and Y");
  }
  syncCustomPianoModeUi(keyboardModeSelect.value);
  updateKeyMappingToggleVisibility();
  updateUiHint();
  markIsomorphicDirty();
  draw();
  schedulePresetUrlUpdate();
});
bindOptionalClick(keyboardMapToggle, () => {
  if (!isCustomPianoMode() || layoutMode) {
    return;
  }
  const next = !customPianoMapMode;
  setCustomPianoMapMode(next);
  if (next) {
    openKeyboardMapPopover();
  } else {
    closeKeyboardMapPopover();
  }
  updateCustomPianoKeyStyles();
});
bindOptionalClick(keyboardMapClear, () => {
  customPianoMap = new Map();
  markCustomPianoMapDirty();
  updateCustomPianoKeyStyles();
  schedulePresetUrlUpdate();
  draw();
});
bindOptionalChange(oneShotCheckbox, () => {
  updatePatternLengthAvailability();
  schedulePresetUrlUpdate();
});
if (envelopeTimeModeInputs.length) {
  envelopeTimeModeInputs.forEach((input) => {
    bindOptionalChange(input, () => {
      envelopeTimeMode = getCheckedRadioValue("envelope-time", "absolute");
      updateEnvelopeReadouts();
      schedulePresetUrlUpdate();
    });
  });
}
bindOptionalClick(looperToggle, () => {
  if (looperState === "recording") {
    stopLooperRecordingAndStartPlayback();
    return;
  }
  if (looperState === "playing") {
    startLooperOverdub();
    return;
  }
  if (looperState === "overdubbing") {
    stopLooperOverdub();
    return;
  }
  if (looperState === "ready") {
    startLooperPlayback();
    return;
  }
  startLooperRecording();
});
bindSingleBooleanToggle(looperQuantizeEnabledToggle, (checked) => {
  looperQuantizeEnabled = checked;
  schedulePresetUrlUpdate();
  draw();
});
bindOptionalClick(looperQuantizeMenuToggle, (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!looperQuantizeMenu) {
    return;
  }
  looperQuantizeMenu.hidden = !looperQuantizeMenu.hidden;
});
bindOptionalChange(looperQuantizeGridSelect, () => {
  looperQuantizeGrid = looperQuantizeGridSelect.value || "16";
  schedulePresetUrlUpdate();
  draw();
});
bindOptionalInput(looperQuantizeStrengthSlider, () => {
  const value = Number(looperQuantizeStrengthSlider.value);
  looperQuantizeStrength = Number.isFinite(value) ? Math.max(0, Math.min(1, value / 100)) : 1;
  updateLooperQuantizeStrengthReadout();
  schedulePresetUrlUpdate();
  draw();
});
bindOptionalEvent(window, "pointerdown", (event) => {
  if (!looperQuantizeMenu || looperQuantizeMenu.hidden) {
    return;
  }
  if (looperQuantizeMenu.contains(event.target)) {
    return;
  }
  if (looperQuantizeMenuToggle && looperQuantizeMenuToggle.contains(event.target)) {
    return;
  }
  looperQuantizeMenu.hidden = true;
});
bindOptionalClick(scorePlayToggle, () => {
  if (patternPlayerState === "playing") {
    stopPatternPlayback();
  } else {
    startPatternPlayback();
  }
});
bindOptionalClick(patternBuildButton, () => {
  buildPatternStates(false);
  if (patternPlayerState === "playing") {
    stopPatternPlayback();
    startPatternPlayback();
  }
});
bindOptionalClick(lfoPlayToggle, () => {
  if (lfoPresetPlaying) {
    stopLfoPresets();
    return;
  }
  randomizeLfosForActiveNodes();
  lfoPresetPlaying = true;
  updateLfoPlayButton();
});
if (patternLengthModeInputs.length) {
  patternLengthModeInputs.forEach((input) => {
    bindOptionalChange(input, () => {
      patternLengthMode = getCheckedRadioValue("pattern-length-mode", "sustain");
      updatePatternLengthReadout();
    });
  });
}
if (keyboardMapKeys.length) {
  keyboardMapKeys.forEach((button) => {
    const key = Number(button.dataset.key);
    if (!Number.isFinite(key)) {
      return;
    }
    bindOptionalEvent(button, "pointerdown", (event) => {
      event.preventDefault();
      if (!isCustomPianoMode()) {
        return;
      }
      if (customPianoSelectedKey !== key) {
        clearCustomPianoPreviewVoices();
      }
      customPianoSelectedKey = key;
      updateCustomPianoKeyStyles();
      draw();
      if (isCustomPianoMapModeActive()) {
        return;
      }
      const voices = startCustomPianoMappedVoices(key, "keyboard");
      if (voices.length) {
        customPianoActiveKeys.set(`mouse:${key}`, voices);
      }
    });
    const stopMapped = () => {
      const voiceIds = customPianoActiveKeys.get(`mouse:${key}`);
      if (voiceIds) {
        customPianoActiveKeys.delete(`mouse:${key}`);
        stopCustomPianoMappedVoices(voiceIds);
      }
    };
    bindOptionalEvent(button, "pointerup", stopMapped);
    bindOptionalEvent(button, "pointerleave", stopMapped);
  });
}
bindPresetInputHandler(attackSlider, updateEnvelopeReadouts);
bindPresetInputHandler(decaySlider, updateEnvelopeReadouts);
bindPresetInputHandler(sustainSlider, updateEnvelopeReadouts);
bindPresetInputHandler(releaseSlider, updateEnvelopeReadouts);
bindOptionalClick(looperClear, () => {
  clearLooper();
});
bindOptionalClick(lfoStopButton, () => {
  scheduleLfoStopsAtCycleEnd();
});
bindOptionalClick(allNotesOffButton, () => {
  allNotesOff();
});
bindOptionalInput(tempoSlider, () => {
  updateTempoReadout();
});
bindOptionalInput(patternLengthSlider, () => {
  updatePatternLengthReadout();
});
if (looperQuantizeGridSelect) {
  looperQuantizeGrid = looperQuantizeGridSelect.value || "16";
}
if (looperQuantizeStrengthSlider) {
  const strengthValue = Number(looperQuantizeStrengthSlider.value);
  looperQuantizeStrength = Number.isFinite(strengthValue)
    ? Math.max(0, Math.min(1, strengthValue / 100))
    : 1;
}
if (looperQuantizeEnabledToggle) {
  looperQuantizeEnabled = Boolean(looperQuantizeEnabledToggle.checked);
}
updateLooperQuantizeStrengthReadout();
updateEnvelopeReadouts();
if (synthModeInputs.length) {
  synthMode = getCheckedRadioValue("synth-mode", synthMode);
}
syncSynthModeUI();
currentSynthWaveform = getCurrentWaveformType();
if (midiOutEnable) {
  midiOutEnabled = midiOutEnable.checked;
}
if (midiOutBendInput) {
  const value = Number(midiOutBendInput.value);
  if (Number.isFinite(value) && value > 0) {
    midiOutBendRange = value;
  }
}
updateLfoDepth();
updateTempoReadout();
updatePatternLengthReadout();
updatePatternLengthAvailability();
initTheme();
syncAnalysisLayerToggles();
updateLooperButton();
updateScoreButton();
updateLfoPlayButton();
buildPatternStates();
populateMidiChannels();
loadPresets();
loadCommas();
if (document.fonts && document.fonts.load) {
  document.fonts
    .load('16px "HEJI2Text"', "v")
    .then(() => {
      draw();
    })
    .catch(() => {});
}
if (layoutCustomLabelDialog && layoutCustomLabelInput) {
  bindDialogBackdropClose(layoutCustomLabelDialog, "confirm");
  bindOptionalDialogClose(layoutCustomLabelDialog, () => {
    resetHeldModifiers();
    if (layoutCustomLabelDialog.returnValue === "cancel") {
      layoutCustomLabelEditId = null;
      layoutCustomLabelPending = null;
      schedulePresetUrlUpdate();
      draw();
      return;
    }
    const text = layoutCustomLabelInput.value.trim();
    if (layoutCustomLabelEditId != null) {
      const index = layoutCustomLabels.findIndex((entry) => entry.id === layoutCustomLabelEditId);
      if (index !== -1) {
        pushLayoutUndoState();
        if (text) {
          layoutCustomLabels[index] = { ...layoutCustomLabels[index], text };
        } else {
          layoutCustomLabels.splice(index, 1);
        }
        updateLayoutCustomLabelControls();
      }
      layoutCustomLabelEditId = null;
      layoutCustomLabelPending = null;
      schedulePresetUrlUpdate();
      draw();
      return;
    }
    if (!layoutCustomLabelPending) {
      return;
    }
    if (layoutCustomLabelDialog.returnValue === "confirm" && text) {
      pushLayoutUndoState();
      layoutCustomLabels.push({
        id: layoutCustomLabelId++,
        text,
        position: { ...layoutCustomLabelPending },
      });
      updateLayoutCustomLabelControls();
    }
    layoutCustomLabelPending = null;
    schedulePresetUrlUpdate();
    draw();
  });
}
if (octaveShiftDialog && octaveShiftInput) {
  bindDialogBackdropClose(octaveShiftDialog, "clear");
  bindOptionalDialogClose(octaveShiftDialog, () => {
    resetHeldModifiers();
    if (octaveShiftTargetId == null) {
      return;
    }
    const targetNode = nodeById.get(octaveShiftTargetId);
    if (
      (octaveShiftDialog.returnValue === "confirm" ||
        octaveShiftDialog.returnValue === "clear") &&
      targetNode
    ) {
      const nextShift =
        octaveShiftDialog.returnValue === "clear"
          ? 0
          : Number(octaveShiftInput.value);
      const normalized = Number.isFinite(nextShift) ? Math.trunc(nextShift) : 0;
      const previousShift = getNodeOctaveShift(targetNode);
      setNodeOctaveShift(targetNode, normalized);
      const delta = normalized - previousShift;
      if (delta) {
        voices.forEach((voice) => {
          if (voice.nodeId === targetNode.id) {
            voice.octave += delta;
          }
        });
      }
      bumpLabelDataVersion();
      updateVoiceFrequencies();
      schedulePresetUrlUpdate();
      draw();
    }
    octaveShiftTargetId = null;
  });
}
if (triangleLabelDialog) {
  bindOptionalDialogClose(triangleLabelDialog, () => {
    if (!triangleLabelTargetKey || !triangleLabelTargetTri) {
      return;
    }
    const result = triangleLabelDialog.returnValue;
    if (result === "cancel") {
      triangleLabelTargetKey = null;
      triangleLabelTargetTri = null;
      return;
    }
    const entry = triangleLabels.get(triangleLabelTargetKey);
    const parts = triangleLabelTargetKey.split(":");
    const coords = parts[1] ? parts[1].split(",") : [];
    const baseEntry = {
      plane: parts[0],
      x: Number(coords[0]),
      y: Number(coords[1]),
      z: Number(coords[2]),
      tri: triangleLabelTargetTri,
      label: "",
    };
    if (result === "none") {
      if (entry) {
        triangleLabels.delete(triangleLabelTargetKey);
      }
    } else if (triangleLabelInput) {
      const nextEntry = entry ? { ...entry } : baseEntry;
      nextEntry.label = triangleLabelInput.value.trim();
      if (nextEntry.label) {
        triangleLabels.set(triangleLabelTargetKey, normalizeTriangleLabelEntry(nextEntry));
      } else if (entry) {
        triangleLabels.delete(triangleLabelTargetKey);
      }
    }
    triangleLabelTargetKey = null;
    triangleLabelTargetTri = null;
    schedulePresetUrlUpdate();
    draw();
  });
}
bindOptionalEvent(canvas, "pointerdown", onPointerDown);
bindOptionalEvent(canvas, "pointermove", onPointerMove);
bindOptionalEvent(canvas, "pointerup", onPointerUp);
bindOptionalEvent(canvas, "pointerleave", onPointerLeave);
bindOptionalEvent(canvas, "dblclick", onCanvasDoubleClick);
bindOptionalEvent(canvas, "wheel", onWheel, { passive: false });
bindOptionalEvent(window, "resize", resizeCanvas);
bindOptionalEvent(window, "resize", updateRatioWheelPosition);
bindOptionalEvent(window, "resize", updateKeyboardMapPopoverPosition);
bindOptionalEvent(window, "keydown", handlePerformanceModeHotkey, { capture: true });
bindOptionalEvent(window, "keydown", handleModeSwitchHotkey, { capture: true });
bindOptionalEvent(window, "keydown", handleKeyboardModeToggleHotkey, { capture: true });
bindOptionalEvent(window, "pointerdown", enableAudioFromGesture);
bindOptionalEvent(window, "keydown", enableAudioFromGesture);
bindOptionalEvent(window, "keydown", handleKeyDown);
bindOptionalEvent(window, "keyup", handleKeyUp);
window.snapshotDebug = {
  enable: () => {
    snapshotDebugEnabled = true;
  },
  disable: () => {
    snapshotDebugEnabled = false;
  },
};
bindOptionalEvent(window, "keydown", (event) => {
  syncCapsLockState(event);
  const keyboardModeEnabled = snapshotKeyboardModeToggle
    ? snapshotKeyboardModeToggle.checked
    : snapshotKeyboardMode;
  const keyboardMappingActive = snapshotKeyboardActiveToggle
    ? snapshotKeyboardActiveToggle.checked
    : snapshotKeyboardActive;
  const snapshotLetterIndex =
    keyboardModeEnabled && keyboardMappingActive ? getSnapshotLetterIndexFromEvent(event) : null;
  const snapshotLetterHasSlot =
    snapshotLetterIndex != null && Boolean(snapshotLetterSlots[snapshotLetterIndex]);
  const snapshotLetterShortcutActive =
    keyboardModeEnabled &&
    keyboardMappingActive &&
    snapshotLetterIndex != null &&
    ((event.altKey && !event.metaKey && !event.ctrlKey) || snapshotLetterHasSlot);
  if (snapshotLetterShortcutActive) {
    return;
  }
  if (
    layoutCustomLabelDialog &&
    layoutCustomLabelDialog.open &&
    event.key !== "Escape"
  ) {
    return;
  }
  const tag = event.target && event.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return;
  }
  if (event.metaKey || event.ctrlKey) {
    return;
  }
  if (isCustomPianoMapModeActive()) {
    const heldKey = event.key.toLowerCase();
    if (heldKey === "t" || heldKey === "r" || heldKey === "l" || heldKey === "f") {
      return;
    }
  }
  if (event.key === "Shift") {
    shiftHeld = true;
    updateAddModeFromShift();
    draw();
  }
  if (event.key.toLowerCase() === "t") {
    tHeld = true;
    updateUiHint();
  }
  if (event.key.toLowerCase() === "l") {
    lHeld = true;
  }
  if (event.key.toLowerCase() === "v") {
    vHeld = true;
  }
  if (event.key.toLowerCase() === "f") {
    fHeld = true;
  }
  if (event.key.toLowerCase() === "o") {
    oHeld = true;
  }
  if (event.key.toLowerCase() === "i") {
    iHeld = true;
  }
  if (event.key.toLowerCase() === "m") {
    mHeld = true;
  }
  if (event.key.toLowerCase() === "r") {
    rHeld = true;
    if (DEBUG_R_CLICK) {
      console.log("R-click debug: keydown", {
        target: event.target && event.target.tagName ? event.target.tagName : null,
        customPianoMapMode: isCustomPianoMapModeActive(),
        layoutMode,
        spellingMode,
      });
    }
  }
  if (event.key.toLowerCase() === "z") {
    zKeyHeld = true;
  }
  if (event.key.toLowerCase() === "x") {
    xKeyHeld = true;
    if (layoutMode) {
      customTextHeld = true;
    }
  }
  if (event.key.toLowerCase() === "y") {
    yKeyHeld = true;
  }
  if (event.key.toLowerCase() === "c") {
    cHeld = true;
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
    if (presetOverlay && !presetOverlay.hidden) {
      closePresetOverlay();
      return;
    }
    if (layoutFontPopover && !layoutFontPopover.hidden) {
      closeLayoutFontPopover();
      return;
    }
    if (layoutAlignMode) {
      setLayoutAlignMode("");
      return;
    }
    if (distanceSelectMode && analysisLayers.distances) {
      setDistanceSelectMode(false);
      return;
    }
    if (layoutAxisEdit) {
      layoutAxisEdit = null;
      layoutAxisEditDrag = null;
      updateUiHint();
      draw();
      return;
    }
    if (axisModeActive()) {
      deactivateAxisMode();
      return;
    }
    return;
  }
});
bindOptionalEvent(window, "pointerdown", (event) => {
  if (!layoutSpacePopover || layoutSpacePopover.hidden) {
    return;
  }
  if (layoutSpacePopover.contains(event.target)) {
    return;
  }
  if (layoutSpaceTrigger && layoutSpaceTrigger.contains(event.target)) {
    return;
  }
  layoutSpacePopover.hidden = true;
});
bindOptionalEvent(window, "pointerdown", (event) => {
  if (!layoutKeyMappingPopover || layoutKeyMappingPopover.hidden) {
    return;
  }
  if (layoutKeyMappingPopover.contains(event.target)) {
    return;
  }
  if (layoutKeyMappingTrigger && layoutKeyMappingTrigger.contains(event.target)) {
    return;
  }
  layoutKeyMappingPopover.hidden = true;
  if (layoutKeyMappingTrigger) {
    layoutKeyMappingTrigger.setAttribute("aria-expanded", "false");
  }
});
bindOptionalEvent(window, "pointerdown", (event) => {
  if (!layoutFontPopover || layoutFontPopover.hidden) {
    return;
  }
  if (layoutFontPopover.contains(event.target)) {
    return;
  }
  if (layoutFontsButton && layoutFontsButton.contains(event.target)) {
    return;
  }
  closeLayoutFontPopover();
});
bindOptionalEvent(window, "pointerdown", (event) => {
  if (!keyboardMapPopover || keyboardMapPopover.hidden) {
    return;
  }
  if (keyboardMapPopover.contains(event.target)) {
    return;
  }
  if (keyboardModeSelect && keyboardModeSelect.contains(event.target)) {
    return;
  }
  if (isCustomPianoMapModeActive()) {
    return;
  }
  keyboardMapPopover.hidden = true;
});
bindOptionalEvent(window, "keyup", (event) => {
  syncCapsLockState(event);
  if (event.key === "Shift") {
    shiftHeld = false;
    updateAddModeFromShift();
    draw();
  }
  if (event.key.toLowerCase() === "r") {
    rHeld = false;
    if (DEBUG_R_CLICK) {
      console.log("R-click debug: keyup", {
        target: event.target && event.target.tagName ? event.target.tagName : null,
        customPianoMapMode: isCustomPianoMapModeActive(),
        layoutMode,
        spellingMode,
      });
    }
  }
  if (event.key.toLowerCase() === "t") {
    tHeld = false;
    triangleHover = null;
    updateUiHint();
    scheduleDraw();
  }
  if (event.key.toLowerCase() === "l") {
    lHeld = false;
  }
  if (event.key.toLowerCase() === "v") {
    vHeld = false;
  }
  if (event.key.toLowerCase() === "f") {
    fHeld = false;
  }
  if (event.key.toLowerCase() === "o") {
    oHeld = false;
  }
  if (event.key.toLowerCase() === "i") {
    iHeld = false;
  }
  if (event.key.toLowerCase() === "m") {
    mHeld = false;
  }
  if (event.key.toLowerCase() === "z") {
    zKeyHeld = false;
  }
  if (event.key.toLowerCase() === "x") {
    xKeyHeld = false;
    customTextHeld = false;
  }
  if (event.key.toLowerCase() === "y") {
    yKeyHeld = false;
  }
  if (event.key.toLowerCase() === "c") {
    cHeld = false;
  }
});

bindOptionalDialogClose(customRatioDialog, handleCustomRatioDialogClose);
bindOptionalDialogClose(distanceLabelDialog, () => {
    resetHeldModifiers();
    const edgeKey = pendingDistanceLabelEditKey;
    pendingDistanceLabelEditKey = "";
    if (!edgeKey) {
      return;
    }
    if (
      distanceLabelDialog.returnValue !== "confirm" &&
      distanceLabelDialog.returnValue !== "none"
    ) {
      return;
    }
    const text = distanceLabelInput ? distanceLabelInput.value.trim() : "";
    const existing = getDistanceEdgeOverride(edgeKey);
    if (distanceLabelDialog.returnValue === "none") {
      distanceEdgeOverrides.set(edgeKey, {
        ...(existing || {}),
        showName: false,
      });
      schedulePresetUrlUpdate();
      draw();
      return;
    }
    if (!text) {
      if (existing) {
        const next = { ...existing };
        delete next.customText;
        if (next.showName === false) {
          delete next.showName;
        }
        if (!Object.keys(next).length) {
          distanceEdgeOverrides.delete(edgeKey);
        } else {
          distanceEdgeOverrides.set(edgeKey, next);
        }
        schedulePresetUrlUpdate();
        draw();
      }
      return;
    }
    distanceEdgeOverrides.set(edgeKey, {
      ...(existing || {}),
      customText: text,
      showName: false,
    });
    schedulePresetUrlUpdate();
    draw();
  });

resizeCanvas();
updateRatioWheelPosition();
function setViewsCollapsed(collapsed) {
  if (!viewsPanel || !viewPanelToggle) {
    return;
  }
  viewsPanel.classList.toggle("is-collapsed", collapsed);
  viewPanelToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  viewPanelToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand view panel" : "Collapse view panel"
  );
}

function setNavigationCollapsed(collapsed) {
  if (!nav3dNavigationToggle || !nav3dNavigationBody) {
    return;
  }
  nav3dNavigationToggle.classList.toggle("is-collapsed", collapsed);
  nav3dNavigationToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  nav3dNavigationBody.hidden = collapsed;
}

function setLayoutShowCollapsed(collapsed) {
  if (!layoutShowToggle || !layoutShowBody) {
    return;
  }
  layoutShowToggle.classList.toggle("is-collapsed", collapsed);
  layoutShowToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  layoutShowBody.hidden = collapsed;
}

function setLayoutPanelCollapsed(collapsed) {
  if (!layoutPanel || !layoutPanelToggle) {
    return;
  }
  layoutPanel.classList.toggle("is-collapsed", collapsed);
  layoutPanelToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  layoutPanelToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand page layout panel" : "Collapse page layout panel"
  );
}
