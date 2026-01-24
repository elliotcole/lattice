import { customOscillatorTypes, customOscillators } from "web-audio-oscillators";
const canvas = document.getElementById("lattice");
const ctx = canvas.getContext("2d");
const audioToggle = document.getElementById("audio-toggle");
const resetButton = document.getElementById("reset-lattice");
const exportScaleButton = document.getElementById("export-scale");
const themeSelect = document.getElementById("theme-select");
const optionsToggle = document.getElementById("options-toggle");
const optionsPanel = document.getElementById("options-panel");
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
const layoutLockPositionToggle = document.getElementById("layout-lock-position");
const layoutNodeSizeInput = document.getElementById("layout-node-size");
const layoutNodeSizeReadout = document.getElementById("layout-node-size-readout");
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
const layoutFontDialog = document.getElementById("layout-font-dialog");
const layoutTitleFontSelect = document.getElementById("layout-title-font");
const layoutRatioFontSelect = document.getElementById("layout-ratio-font");
const layoutNoteFontSelect = document.getElementById("layout-note-font");
const layoutTriangleLabelFontSelect = document.getElementById("layout-triangle-label-font");
const layoutCustomFontSelect = document.getElementById("layout-custom-font");
const layoutCustomFontGroup = document.getElementById("layout-custom-font-group");
const layoutUnifySizeToggle = document.getElementById("layout-unify-size");
const layoutResetButton = document.getElementById("layout-reset");
const exportSvgButton = document.getElementById("export-svg");
const exportPdfButton = document.getElementById("export-pdf");
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
const showHelpToggle = document.getElementById("show-help");
const keyboardHelp = document.getElementById("keyboard-help");
const fundamentalInput = document.getElementById("fundamental");
const fundamentalNoteSelect = document.getElementById("fundamental-note");
const a4Input = document.getElementById("a4");
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
const showCentsSignToggle = document.getElementById("show-cents-sign");
const hejiEnabledToggle = document.getElementById("heji-enabled");
const enharmonicsEnabledToggle = document.getElementById("enharmonics-enabled");
const centsPrecisionButtons = document.querySelectorAll("[data-cents-precision]");
const sequencePatternSelect = document.getElementById("sequence-pattern");
const rhythmPatternSelect = document.getElementById("rhythm-pattern");
const octavePatternSelect = document.getElementById("octave-pattern");
const patternBuildButton = document.getElementById("pattern-build");
const scorePlayToggle = document.getElementById("score-play-toggle");
const lfoPresetSelect = document.getElementById("lfo-preset");
const lfoPlayToggle = document.getElementById("lfo-play-toggle");
const lfoStopButton = document.getElementById("lfo-stop");
const allNotesOffButton = document.getElementById("all-notes-off");
const addCustomRatioButton = document.getElementById("add-custom-ratio");
const customRatioDialog = document.getElementById("custom-ratio-dialog");
const triangleLabelDialog = document.getElementById("triangle-label-dialog");
const triangleLabelInput = document.getElementById("triangle-label-input");
const layoutCustomLabelDialog = document.getElementById("layout-custom-label-dialog");
const layoutCustomLabelInput = document.getElementById("layout-custom-label-input");
const customRatioNumerator = document.getElementById("custom-ratio-numerator");
const customRatioDenominator = document.getElementById("custom-ratio-denominator");
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
let bestViewCandidates = [];
let bestViewIndex = 0;
let bestViewSignature = "";

let audioCtx = null;
let masterGain = null;
let hoverNodeId = null;
let themeColors = null;
let lfoDepth = 1;
let lfoArmingId = null;
let lfoArmingStart = 0;
let lfoAnimating = false;
let lfoStopTimers = [];
let lfoPresetPlaying = false;
let midiAccess = null;
let midiInput = null;
let midiEnabled = false;
let rHeld = false;
let tHeld = false;
let lHeld = false;
let suppressClickAfterRespell = false;
const midiActiveNotes = new Map();
let lastLfoTapTime = 0;
let lastLfoTapId = null;
const activeKeys = new Map();
const triangleDiagonals = new Map();
let triangleHover = null;
let triangleLabelTargetKey = null;
let triangleLabelTargetTri = null;
const TRIANGLE_DIAGONAL_HIT_DISTANCE = 10;
const TRIANGLE_TRI_IDS = new Set(["abd", "acd", "abc", "bcd"]);
const triangleLabels = new Map();
const TRIANGLE_TRI_TO_DIAG = {
  abd: "backslash",
  acd: "backslash",
  abc: "slash",
  bcd: "slash",
};
let layoutLabelHitboxVisible = false;

function clearTriangleLabelsForCell(entry) {
  TRIANGLE_TRI_IDS.forEach((tri) => {
    triangleLabels.delete(triangleLabelKey({ ...entry, tri }));
  });
}

function computeTriangleLabelLayout(text, font, baseSize, points) {
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
  const maxWidth = Math.max(8, Math.min(boxWidth, boxHeight) * 0.75);
  let size = baseSize;
  const minSize = Math.max(2, Math.round(baseSize * 0.25));
  let width = measureTextWidth(text, size, font);
  while (width > maxWidth && size > minSize) {
    size -= 4;
    width = measureTextWidth(text, size, font);
  }
  return { size };
}

function getLayoutNoteLabelHitbox(node, pos, radius) {
  const rawLabelPos = getLayoutNoteLabelPosition(node, pos, radius);
  const labelOffsetX = rawLabelPos.x - pos.x;
  const labelPos = {
    x: pos.x + labelOffsetX * 0.7,
    y: rawLabelPos.y,
  };
  let width = 0;
  let height = layoutNoteTextSize;
  if (featureMode === "ratio") {
    ctx.save();
    ctx.font = `${layoutNoteTextSize}px ${layoutNoteFont}`;
    const metrics = ctx.measureText(getNodeNoteLabel(node));
    ctx.restore();
    width = metrics.width;
  } else {
    const ratioText = `${node.numerator}:${node.denominator}`;
    const displayInfo = getCachedDisplayInfo(node);
    const centsLabel = getCachedCentsReadout(
      node,
      { wrap: enharmonicsEnabled },
      displayInfo
    );
    width = Math.max(
      measureTextWidthWithWeight(ratioText, layoutNoteTextSize, "Lexend, sans-serif", 200),
      measureTextWidthWithWeight(centsLabel, layoutNoteTextSize, "Lexend, sans-serif", 200)
    );
    height = layoutNoteTextSize * 2 + 4;
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
        const customIndex = customNodes.findIndex((item) => item.id === id);
        if (customIndex < 0) {
          return null;
        }
        return { customIndex, x: offset.x, y: offset.y };
      }
      return {
        exponents: [node.exponentX, node.exponentY, node.exponentZ || 0],
        x: offset.x,
        y: offset.y,
      };
    })
    .filter(Boolean);
}

function applyLayoutLabelOffsets(entries) {
  layoutLabelOffsets.clear();
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
    if (!entry || typeof entry !== "object") {
      return;
    }
    const x = Number(entry.x);
    const y = Number(entry.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }
    if (Number.isFinite(entry.customIndex)) {
      const customNode = customNodes[entry.customIndex];
      if (customNode) {
        layoutLabelOffsets.set(customNode.id, { x, y });
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

function updateDragLock(drag, event) {
  if (!event.shiftKey) {
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

function syncLayoutViewFromCurrent() {
  layoutView = {
    zoom: view.zoom,
    offsetX: view.offsetX,
    offsetY: view.offsetY,
    rotX: view.rotX,
    rotY: view.rotY,
  };
}

const noteNamesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteNamesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const noteNames = noteNamesSharp;
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
const HEJI_SUFFIX_Y_OFFSET = -0.52;
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
let wasZModeActive = false;
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
let envelopeTimeMode = "absolute";
let customNodes = [];
let nextCustomNodeId = 100000;
let customDrag = null;
let customDragJustPlaced = false;
let layoutMode = false;
let layoutDrag = null;
let layoutLabelDrag = null;
let layoutPositions = new Map();
let layoutLabelOffsets = new Map();
let pendingLayoutLabelOffsets = null;
let layoutNodeShapes = new Map();
let nodeSpellingOverrides = new Map();
let layoutNodeSize = 35;
let layoutRatioTextSize = 21;
let layoutNoteTextSize = 14;
let layoutTriangleLabelTextSize = 20;
let layoutCustomLabelTextSize = 18;
let layoutNodeShape = "circle";
let layoutTitle = "";
let layoutCreator = "";
let layoutTitleSize = 28;
let layoutCreatorSize = 18;
let layoutTitleMargin = 32;
let layoutTitlePosition = null;
let layoutCreatorPosition = null;
let layoutUnifyNodeSize = true;
let layoutPageSize = "letter";
let layoutOrientation = "landscape";
let layoutLockPosition = true;
let layoutView = { zoom: 1, offsetX: 0, offsetY: 0, rotX: 0, rotY: 0 };
let layoutPrevState = null;
let layoutTitleFont = "Lexend";
let layoutRatioFont = "Georgia";
let layoutNoteFont = "Georgia";
let layoutTriangleLabelFont = "Georgia";
let layoutCustomLabelFont = "Georgia";
let layoutCustomLabels = [];
let layoutCustomLabelPending = null;
let layoutCustomLabelId = 1;
let layoutCustomLabelEditId = null;
let layoutAxisOffsets = {
  x: { x: 0, y: 0 },
  y: { x: 0, y: 0 },
  z: { x: 0, y: 0 },
};
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
const layoutUndoStack = [];
const LAYOUT_UNDO_LIMIT = 50;
let layoutWheelUndoTimer = null;
let spellingMode = "simple";
let spellingHintActive = false;
let fundamentalSpelling = "sharp";
let featureMode = "ratio";
let showHz = false;
let showCentsSign = false;
let hejiEnabled = true;
let enharmonicsEnabled = true;
let centsPrecision = 0;
let showCircles = true;
let showHelpEnabled = true;
let uiHintDismissed = false;
let uiHintKey = "";
let keyboardHelpTimer = null;
const labelCache = new Map();
let labelCacheKey = "";
let labelCacheDataVersion = 0;
const textWidthCache = new Map();
let drawPending = false;

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
  nodeShape: "circle",
  title: "",
  creator: "",
  titleSize: 28,
  creatorSize: 18,
  titleMargin: 32,
  unifyNodeSize: true,
  pageSize: "letter",
  orientation: "landscape",
  zoom: 1,
  lockPosition: true,
  view: { zoom: 1, offsetX: 0, offsetY: 0, rotX: 0, rotY: 0 },
  titleFont: "Lexend",
  ratioFont: "Georgia",
  noteFont: "Georgia",
  triangleLabelFont: "Georgia",
  customLabelFont: "Georgia",
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
  return envelopeToSeconds(attackSlider.value);
}

function getEnvelopeDecaySeconds() {
  return envelopeToSeconds(decaySlider.value);
}

function getEnvelopeReleaseSeconds() {
  return envelopeToSeconds(releaseSlider.value);
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

function createCustomNode(numerator, denominator, position, isActive = true) {
  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
    return null;
  }
  const ratio = num / den;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return null;
  }
  const fundamental = Number(fundamentalInput.value) || 220;
  const a4 = Number(a4Input.value) || 440;
  const freq = fundamental * ratio;
  const etInfo = getNearestEtInfo(freq, a4);
  return {
    id: nextCustomNodeId++,
    numerator: num,
    denominator: den,
    exponentX: null,
    exponentY: null,
    exponentZ: 0,
    gridX: null,
    gridY: null,
    gridZ: gridCenterZ,
    coordinate: { x: position.x, y: position.y, z: 0 },
    freq,
    cents_from_et: etInfo.cents,
    note_name: etInfo.name,
    pitch_class: etInfo.pitchClass,
    active: isActive,
    isCenter: false,
    baseVoiceId: null,
    isCustom: true,
  };
}

function addCustomRatioNode(numerator, denominator) {
  const center = screenToWorld({
    x: view.lastPointer ? view.lastPointer.x : canvas.clientWidth / 2,
    y: view.lastPointer ? view.lastPointer.y : canvas.clientHeight / 2,
  });
  const node = createCustomNode(numerator, denominator, center, true);
  if (!node) {
    return;
  }
  customNodes.push(node);
  nodes.push(node);
  nodeById.set(node.id, node);
  customDrag = {
    nodeId: node.id,
    offsetX: 0,
    offsetY: 0,
    placing: true,
  };
  updatePitchInstances();
  refreshPatternFromActiveNodes();
  markIsomorphicDirty();
  draw();
  schedulePresetUrlUpdate();
}

function openCustomRatioDialog() {
  if (!customRatioDialog || typeof customRatioDialog.showModal !== "function") {
    const numerator = window.prompt("Numerator");
    if (numerator == null) {
      return;
    }
    const denominator = window.prompt("Denominator");
    if (denominator == null) {
      return;
    }
    addCustomRatioNode(numerator, denominator);
    return;
  }
  if (customRatioNumerator) {
    customRatioNumerator.value = "";
  }
  if (customRatioDenominator) {
    customRatioDenominator.value = "";
  }
  customRatioDialog.showModal();
  if (customRatioNumerator) {
    customRatioNumerator.focus();
  }
}

function handleCustomRatioDialogClose() {
  if (!customRatioDialog || customRatioDialog.returnValue !== "confirm") {
    return;
  }
  const numerator = customRatioNumerator ? customRatioNumerator.value : "";
  const denominator = customRatioDenominator ? customRatioDenominator.value : "";
  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
    alert("Please enter a valid numerator and denominator.");
    return;
  }
  addCustomRatioNode(num, den);
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
}

function allNotesOff() {
  stopPatternPlayback();
  stopLooperPlayback();
  clearLfoStopTimers();
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

  bumpLabelDataVersion();
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
  const tag = event.target.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
    return;
  }
  if (layoutMode) {
    return;
  }

  const key = event.key.toLowerCase();
  if (layoutMode && (event.metaKey || event.ctrlKey) && key === "z") {
    event.preventDefault();
    undoLayoutChange();
    return;
  }

  const mode = getKeyboardMode();
  if (mode === "off") {
    return;
  }
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
  if (layoutMode) {
    return;
  }
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
  if (node.isCustom) {
    return 35;
  }
  return node.active ? 35 : 32;
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
  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    const option = document.createElement("option");
    option.value = String(midi);
    option.textContent = midiToFundamentalNoteName(midi);
    fundamentalNoteSelect.appendChild(option);
  }
}

function updateFundamentalNotes() {
  const a4 = Number(a4Input.value) || 440;
  const selectedMidi = Number(fundamentalNoteSelect.value || 0);
  Array.from(fundamentalNoteSelect.options).forEach((option) => {
    const midi = Number(option.value);
    const freq = midiToFrequency(midi, a4);
    option.textContent = `${midiToFundamentalNoteName(midi)} (${freq.toFixed(2)} Hz)`;
  });
  fundamentalNoteSelect.value = String(selectedMidi);
}

function syncFundamentalNoteSelect() {
  const freq = Number(fundamentalInput.value);
  if (!Number.isFinite(freq) || freq <= 0) {
    return;
  }
  const a4 = Number(a4Input.value) || 440;
  const { midi } = getNearestEtInfo(freq, a4);
  fundamentalNoteSelect.value = String(midi);
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
  if (spellingMode === "true") {
    showFundamentalSpellingDialog(midi);
  } else {
    hideFundamentalSpellingDialog();
  }
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

function ensureLayoutPosition(node) {
  if (!layoutMode) {
    return node.coordinate;
  }
  const existing = layoutPositions.get(node.id);
  if (existing) {
    return existing;
  }
  const next = {
    x: node.coordinate.x,
    y: node.coordinate.y,
    z: Number.isFinite(node.coordinate.z) ? node.coordinate.z : 0,
  };
  layoutPositions.set(node.id, next);
  return next;
}

function getNodeDisplayCoordinate(node) {
  return layoutMode ? ensureLayoutPosition(node) : node.coordinate;
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

function getLayoutNodeShape(node) {
  return layoutNodeShapes.get(node.id) || layoutNodeShape;
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
  const text = precision > 0 ? rounded.toFixed(precision) : String(Math.round(rounded));
  const sign = rounded >= 0 ? "+" : "";
  const centsSuffix = showCentsSign ? CENTS_CHAR : "";
  return `${sign}${text}${centsSuffix}`;
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

function buildSvgTextWithSmallCent({
  text,
  x,
  y,
  font,
  size,
  fontWeight = 400,
  align = "left",
  baseline = "hanging",
  hejiAccidentals = false,
  hejiYOffset = 0,
  color,
}) {
  const chars = Array.from(text || "");
  if (!chars.length) {
    return "";
  }
  const widths = chars.map((char) => {
    const isCent = char === CENTS_CHAR;
    const isHeji = hejiAccidentals && (char === "v" || char === "e" || char === "V");
    const charSize = isCent ? getCentsCharSize(size) : size;
    const charFont = isHeji ? "HEJI2Text" : font;
    const charWeight = isHeji ? 400 : fontWeight;
    return measureCharWidth(char, charSize, charFont, charWeight);
  });
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  let startX = x;
  if (align === "center") {
    startX = x - totalWidth / 2;
  } else if (align === "right") {
    startX = x - totalWidth;
  }
  let cursorX = startX;
  const nodes = [];
  chars.forEach((char, index) => {
    const isCent = char === CENTS_CHAR;
    const isHeji = hejiAccidentals && (char === "v" || char === "e" || char === "V");
    const charSize = isCent ? getCentsCharSize(size) : size;
    const charFont = isHeji ? "HEJI2Text" : font;
    const charWeight = isHeji ? 400 : fontWeight;
    const charY = y + (isHeji ? hejiYOffset : 0);
    nodes.push(
      `<text x="${cursorX}" y="${charY}" text-anchor="start" dominant-baseline="${baseline}" font-family="${escapeSvgText(
        charFont
      )}" font-size="${charSize}" font-weight="${charWeight}" fill="${color}">${escapeSvgText(
        char
      )}</text>`
    );
    cursorX += widths[index];
  });
  return nodes.join("\n");
}

function computeRatioLabelLayout(numerator, denominator, font, baseSize, maxWidth) {
  const singleLine = `${numerator}:${denominator}`;
  let size = baseSize;
  let lines = [singleLine];
  let lineGap = 0;
  let width = measureTextWidth(singleLine, size, font);
  if (width <= maxWidth) {
    return { lines, size, lineGap };
  }
  lines = [String(numerator), String(denominator)];
  lineGap = Math.round(size * 0.15);
  const minSize = Math.max(10, Math.round(baseSize * 0.6));
  const measureTwoLine = () =>
    Math.max(
      measureTextWidth(lines[0], size, font),
      measureTextWidth(lines[1], size, font)
    );
  width = measureTwoLine();
  while (width > maxWidth && size > minSize) {
    size -= 1;
    lineGap = Math.round(size * 0.15);
    width = measureTwoLine();
  }
  return { lines, size, lineGap };
}

function getLabelCacheKey() {
  return [
    featureMode,
    hejiEnabled ? "heji" : "no-heji",
    enharmonicsEnabled ? "enharmonics" : "no-enharmonics",
    spellingMode,
    centsPrecision,
    showCentsSign ? "cents" : "no-cents",
    showHz ? "hz" : "no-hz",
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
  return `${wrap}|${detail}|${baseText}`;
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
    const fallbackBase = `${preferredFallback}${formatCents(nearest.cents)}`;
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
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
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
  const axisStates = [
    { axis: "x", ratio: Number(ratioXSelect.value), exponent: Number(node.exponentX) },
    { axis: "y", ratio: Number(ratioYSelect.value), exponent: Number(node.exponentY) },
    { axis: "z", ratio: Number(ratioZSelect.value), exponent: Number(node.exponentZ) },
  ];
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

function getLayoutNoteOffset(node, radius, scale = 1) {
  const override = layoutLabelOffsets.get(node.id);
  if (override) {
    return {
      x: override.x * view.zoom * scale,
      y: override.y * view.zoom * scale,
    };
  }
  return { x: radius + 6, y: radius - 10 };
}

function getLayoutNoteLabelPosition(node, pos, radius) {
  const offset = getLayoutNoteOffset(node, radius, pos.scale || 1);
  return { x: pos.x + offset.x, y: pos.y + offset.y };
}

function getLayoutTitleY() {
  const { top } = getLayoutPageRect();
  const disableScale = layoutUnifyNodeSize;
  let maxY = Number.NEGATIVE_INFINITY;
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    const start = worldToScreen(getNodeDisplayCoordinate(a), disableScale);
    const end = worldToScreen(getNodeDisplayCoordinate(b), disableScale);
    const radiusA = layoutNodeSize * (start.scale || 1);
    const radiusB = layoutNodeSize * (end.scale || 1);
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
  });
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
    ? measureTextWidth(layoutCreator, creatorSize, layoutTitleFont)
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
  ctx.font = `${size}px ${layoutCustomLabelFont}`;
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
}

const AXIS_EDGE_COLORS = {
  x: "rgba(59, 130, 246, 0.5)",
  y: "rgba(239, 68, 68, 0.5)",
  z: "rgba(16, 185, 129, 0.5)",
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
  const basePitchClass = noteNamesSharp[mod(targetPc, 12)];
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
  axisRatios.forEach((axis) => {
    if (!axis.exp) {
      return;
    }
    const spec = TRUE_SPELLING_INTERVALS[axis.ratio];
    if (!spec) {
      return;
    }
    totalLetterShift += axis.exp * spec.letter;
    totalSemitoneShift += axis.exp * spec.semitones;
  });
  let fundamentalMidi = Number(fundamentalNoteSelect && fundamentalNoteSelect.value);
  if (!Number.isFinite(fundamentalMidi)) {
    const fallback = getNearestEtInfo(Number(fundamentalInput.value) || 220, a4);
    fundamentalMidi = fallback.midi;
  }
  const basePitchClass = getFundamentalNoteNames()[mod(fundamentalMidi, 12)];
  const base = parsePitchClass(basePitchClass);
  const baseNatural = LETTER_TO_SEMITONE[LETTERS[base.letterIndex]] || 0;
  const baseSemitone = baseNatural + base.accidental;
  const totalLetter = base.letterIndex + totalLetterShift;
  const octaveShift = floorDiv(totalLetter, 7);
  const targetLetterIndex = mod(totalLetter, 7);
  const targetNatural =
    LETTER_TO_SEMITONE[LETTERS[targetLetterIndex]] + octaveShift * 12;
  const targetSemitone = baseSemitone + totalSemitoneShift;
  let accidental = targetSemitone - targetNatural;
  if (Math.abs(accidental) > 3) {
    return {
      name: nearestName,
      pitchClass: nearestPitchClass,
      cents: nearestCents,
    };
  }
  const pitchClass = buildPitchClass(targetLetterIndex, accidental);
  const targetPc = mod(LETTER_TO_SEMITONE[LETTERS[targetLetterIndex]] + accidental, 12);
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midiBase = Math.round((midiFloat - targetPc) / 12);
  const midi = targetPc + 12 * midiBase;
  const name = `${pitchClass}${Math.floor(midi / 12) - 1}`;
  const etFreq = a4 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / etFreq);
  return { name, pitchClass, cents };
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
    const radiusA = (layoutMode ? layoutNodeSize : getNodeRadius(startNode)) * (start.scale || 1);
    const radiusB = (layoutMode ? layoutNodeSize : getNodeRadius(endNode)) * (end.scale || 1);
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
  layoutCustomLabelInput.value = value;
  if (typeof layoutCustomLabelDialog.showModal === "function") {
    layoutCustomLabelDialog.showModal();
  }
  requestAnimationFrame(() => {
    layoutCustomLabelInput.focus();
    layoutCustomLabelInput.select();
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
  if (!triangleDiagonals.size) {
    return;
  }
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (node.active && !node.isCustom) {
      gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    }
  });
  ctx.save();
  ctx.strokeStyle = themeColors.edge;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  triangleDiagonals.forEach((entry) => {
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
      : (layoutMode ? layoutNodeSize : getNodeRadius(a)) * (start.scale || 1);
    const radiusB = endEntry
      ? endEntry.radius
      : (layoutMode ? layoutNodeSize : getNodeRadius(b)) * (end.scale || 1);
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
  const gridMap = new Map();
  nodes.forEach((node) => {
    if (node.active && !node.isCustom) {
      gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
    }
  });
  triangleLabels.forEach((entry) => {
    if (!entry.label) {
      return;
    }
    const diag = TRIANGLE_TRI_TO_DIAG[entry.tri];
    if (!diag || !triangleDiagonals.has(triangleKey({ ...entry, diag }))) {
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
    const layout = computeTriangleLabelLayout(entry.label, layoutTriangleLabelFont, baseSize, points);
    ctx.save();
    ctx.setLineDash([]);
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = `400 ${layout.size}px ${layoutTriangleLabelFont}`;
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
  const disableScale = layoutMode && layoutUnifyNodeSize;
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
    const hasBackslash = triangleDiagonals.has(keys.backslash);
    const hasSlash = triangleDiagonals.has(keys.slash);
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
  if (zModeActive && zModeAnchor) {
    const fixedY = zModeAnchor.y;
    const fixedX = zModeAnchor.x;
    for (let z = 0; z < gridDepth - 1; z += 1) {
      for (let x = 0; x < GRID_COLS - 1; x += 1) {
        evaluateCell(
          { plane: "xz", x, y: fixedY, z },
          allMap.get(`${x},${fixedY},${z}`),
          allMap.get(`${x + 1},${fixedY},${z}`),
          allMap.get(`${x},${fixedY},${z + 1}`),
          allMap.get(`${x + 1},${fixedY},${z + 1}`),
          activeMap.get(`${x},${fixedY},${z}`),
          activeMap.get(`${x + 1},${fixedY},${z}`),
          activeMap.get(`${x},${fixedY},${z + 1}`),
          activeMap.get(`${x + 1},${fixedY},${z + 1}`)
        );
      }
    }
    for (let z = 0; z < gridDepth - 1; z += 1) {
      for (let y = 0; y < GRID_ROWS - 1; y += 1) {
        evaluateCell(
          { plane: "yz", x: fixedX, y, z },
          allMap.get(`${fixedX},${y},${z}`),
          allMap.get(`${fixedX},${y + 1},${z}`),
          allMap.get(`${fixedX},${y},${z + 1}`),
          allMap.get(`${fixedX},${y + 1},${z + 1}`),
          activeMap.get(`${fixedX},${y},${z}`),
          activeMap.get(`${fixedX},${y + 1},${z}`),
          activeMap.get(`${fixedX},${y},${z + 1}`),
          activeMap.get(`${fixedX},${y + 1},${z + 1}`)
        );
      }
    }
  }
  return best;
}

function draw3DEdges(nodePosMap) {
  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
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
  const fontSize = Math.max(12, Math.round(layoutRatioTextSize * 0.9));
  const xRatio = Number(ratioXSelect.value) || 3;
  const yRatio = Number(ratioYSelect.value) || 5;
  const zRatio = Number(ratioZSelect.value) || 7;
  const xReduced = reduceToOctave(xRatio, 1);
  const yReduced = reduceToOctave(yRatio, 1);
  const zReduced = reduceToOctave(zRatio, 1);
  const xLabel = `${xReduced.numerator}:${xReduced.denominator}`;
  const yLabel = `${yReduced.numerator}:${yReduced.denominator}`;
  const zLabel = `${zReduced.numerator}:${zReduced.denominator}`;
  const disableScale = layoutUnifyNodeSize;
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

function getAxisLegendAngle(dir) {
  let angle = Math.atan2(dir.y, dir.x);
  if (angle > Math.PI / 2) {
    angle -= Math.PI;
  } else if (angle < -Math.PI / 2) {
    angle += Math.PI;
  }
  return angle;
}

function getAxisLegendInfo(axis, settings = getAxisLegendSettings()) {
  if (!layoutMode || !hasActiveAxis(axis)) {
    return null;
  }
  const { left, top, width, height } = getLayoutPageRect();
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
  ctx.font = `${settings.fontSize}px ${layoutRatioFont}`;
  const labelWidth = ctx.measureText(label).width;
  ctx.restore();
  const gap = Math.max(28, labelWidth + 16);
  const segLen = 20;
  const gapVec = { x: dir.x * (gap / 2), y: dir.y * (gap / 2) };
  const segVec = { x: dir.x * segLen, y: dir.y * segLen };
  return {
    axis,
    center,
    label,
    dir,
    gapVec,
    segVec,
    fontSize: settings.fontSize,
    textAngle: getAxisLegendAngle(dir),
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
  ctx.font = `${fontSize}px ${layoutRatioFont}`;
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
    ctx.font = `${titleSize}px ${layoutTitleFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const titlePos = getLayoutTitlePosition();
    ctx.fillText(layoutTitle, titlePos.x, titlePos.y);
  }
  if (layoutCreator) {
    const creatorSize = getLayoutCreatorSize();
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = `${creatorSize}px ${layoutTitleFont}`;
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!themeColors) {
    refreshThemeColors();
  }

  if (layoutMode) {
    drawLayoutPage({ drawAxes: !layoutAxisEdit });
  }

  const disableScale = layoutMode && layoutUnifyNodeSize;
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
    nodePosMap.set(node.id, { pos, radius: baseRadius * (pos.scale || 1) });
  });

  if (is3DMode && showGrid) {
    drawGrid();
  }

  if (is3DMode && (showAxes || (zModeActive && isAddMode))) {
    drawAxes();
  }

  if (is3DMode) {
    draw3DEdges(nodePosMap);
  } else {
    ctx.strokeStyle = themeColors.edge;
    ctx.lineWidth = 1.5;
    edges.forEach(([a, b]) => {
      if (!a.active || !b.active) {
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
        : (layoutMode ? layoutNodeSize : getNodeRadius(a)) * (start.scale || 1);
      const radiusB = endEntry
        ? endEntry.radius
        : (layoutMode ? layoutNodeSize : getNodeRadius(b)) * (end.scale || 1);
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
  drawTriangleDiagonals(nodePosMap, disableScale);
  drawTriangleLabels(nodePosMap, disableScale);
  drawTriangleHover(nodePosMap, disableScale);

  const nowMs = performance.now();
  const nowSec = audioCtx ? audioCtx.currentTime : nowMs / 1000;
  const nodeAmplitudes = getNodeAmplitudeMap(nowSec, nowMs);

  const keyboardMode = getKeyboardMode();
  const isIsomorphicMode = keyboardMode === "iso" || keyboardMode === "iso-fuzzy";
  if (isIsomorphicMode) {
    ensureIsomorphicMaps();
  }
  const keyMap = isIsomorphicMode ? isomorphicKeyMap : null;
  const reducedEffects = is3DMode && view.reducedEffects;
  const lightDir = getLightDir2D();
  nodeRenderList.forEach(({ node, pos }) => {
    const isHovered = node.id === hoverNodeId;
    const canShowInactive = isInactiveNodeAvailable(node);
    const canInteractInactive = !is3DMode || isAddMode;
    const amplitude = nodeAmplitudes.get(node.id) || 0;
    const brightness = Math.min(1, amplitude);
    const isVisible =
      node.isCenter ||
      node.active ||
      node.isCustom ||
      brightness > 0.01 ||
      (isHovered && canShowInactive && canInteractInactive);
    let alpha = node.active || node.isCenter ? 1 : isHovered ? 0.3 : 0;
    if (node.isCustom && !node.active) {
      alpha = 0.25;
    }
    if (zModeActive && zModeAnchor) {
      const inZLine = node.gridX === zModeAnchor.x && node.gridY === zModeAnchor.y;
      if (!inZLine) {
        alpha *= 0.3;
      }
    }

    if (!isVisible) {
      return;
    }

    const baseRadius = layoutMode ? layoutNodeSize : getNodeRadius(node);
    const radius = baseRadius * (pos.scale || 1);
    const layoutShape = layoutMode
      ? getLayoutNodeShape(node)
      : node.isCustom
      ? "square"
      : "circle";
    const showNodeShape = !layoutMode || layoutShape !== "none";
    const isSquare = layoutShape === "square";

    ctx.save();
    ctx.globalAlpha = alpha;
    if (showNodeShape && showCircles) {
      ctx.beginPath();
      ctx.strokeStyle = themeColors.nodeStroke;
      ctx.lineWidth = 2;
      if (is3DMode) {
        const inactiveFill = node.isCustom
          ? "rgba(210, 210, 210, 0.12)"
          : "rgba(255, 255, 255, 0.02)";
        const shadowColor = "rgba(0, 0, 0, 0.22)";
        const fillAlpha = Math.min(1, brightness);
        const baseFill =
          fillAlpha > 0 ? colorWithAlpha(themeColors.playFill, fillAlpha) : inactiveFill;
        const highlightColor =
          fillAlpha > 0
            ? colorWithAlpha(themeColors.playFill, 0.35 + 0.65 * fillAlpha)
            : node.isCustom
            ? "rgba(220, 220, 220, 0.25)"
            : "rgba(255, 255, 255, 0.35)";
        if (reducedEffects) {
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
          ctx.fillStyle = "rgba(210, 210, 210, 0.2)";
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
    }

    ctx.fillStyle = themeColors.textPrimary;
    const labelSize = layoutMode ? layoutRatioTextSize : 21;
    const labelFont = layoutMode ? layoutRatioFont : "Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (featureMode === "note") {
      if (hejiEnabled && nodeHasHighPrime(node)) {
        const displayInfo = getCachedDisplayInfo(node);
        const base = getHejiBaseAndDefaults(displayInfo.pitchClass);
        const centsText = formatCents(displayInfo.cents);
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
          align: "center",
          baseline: "middle",
          color: themeColors.textPrimary,
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
          align: "center",
          baseline: "middle",
          color: themeColors.textPrimary,
        });
      }
    } else {
      const maxWidth = radius * 1.6;
      const layout = computeRatioLabelLayout(
        node.numerator,
        node.denominator,
        labelFont,
        labelSize,
        maxWidth
      );
      const ratioYOffset = Math.round(layout.size * -0.09);
      ctx.font = `${layout.size}px ${labelFont}`;
      if (layout.lines.length === 1) {
        ctx.fillText(layout.lines[0], pos.x, pos.y + ratioYOffset);
      } else {
        const lineOffset = layout.size / 2 + layout.lineGap / 2;
        const baseY = pos.y + ratioYOffset;
        const lineWidth = Math.max(
          measureTextWidth(layout.lines[0], layout.size, labelFont),
          measureTextWidth(layout.lines[1], layout.size, labelFont)
        );
        const lineY = baseY + layout.size * 0.1;
        ctx.fillText(layout.lines[0], pos.x, baseY - lineOffset);
        ctx.fillText(layout.lines[1], pos.x, baseY + lineOffset);
        ctx.save();
        ctx.strokeStyle = themeColors.textPrimary;
        ctx.lineWidth = Math.max(1, Math.round(layout.size * 0.06));
        ctx.beginPath();
        ctx.moveTo(pos.x - lineWidth / 2, lineY);
        ctx.lineTo(pos.x + lineWidth / 2, lineY);
        ctx.stroke();
        ctx.restore();
      }
    }

    const detailSize = layoutMode ? layoutNoteTextSize : 14;
    const displayInfo = getCachedDisplayInfo(node);
    if (featureMode === "note") {
      ctx.font = `200 ${detailSize}px "Lexend", sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = themeColors.textSecondary;
      const ratioText = `${node.numerator}:${node.denominator}`;
      const centsLabel = getCachedCentsReadout(
        node,
        { wrap: enharmonicsEnabled },
        displayInfo
      );
      const rawLabelPos = layoutMode
        ? getLayoutNoteLabelPosition(node, pos, radius)
        : { x: pos.x + radius + 6, y: pos.y + radius - 10 };
      const labelOffsetX = rawLabelPos.x - pos.x;
      const ratioX = pos.x + labelOffsetX * 0.7;
      const ratioY = rawLabelPos.y;
      let lineOffset = 0;
      ctx.fillText(ratioText, ratioX, ratioY + lineOffset);
      lineOffset += detailSize + 4;
      drawTextWithSmallCent({
        text: centsLabel,
        x: ratioX,
        y: ratioY + lineOffset,
        font: "Lexend, sans-serif",
        size: detailSize,
        fontWeight: 200,
        align: "left",
        baseline: "top",
        hejiAccidentals: hejiEnabled,
        hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
        context: ctx,
        color: themeColors.textSecondary,
      });
      lineOffset += detailSize + 4;
      if (showHz && Number.isFinite(node.freq)) {
        ctx.fillText(`${node.freq.toFixed(2)} Hz`, ratioX, ratioY + lineOffset);
      }
    } else {
      ctx.fillStyle = themeColors.textSecondary;
      const rawLabelPos = layoutMode
        ? getLayoutNoteLabelPosition(node, pos, radius)
        : { x: pos.x + radius + 6, y: pos.y + radius - 10 };
      const labelOffsetX = rawLabelPos.x - pos.x;
      const labelPos = {
        x: pos.x + labelOffsetX * 0.7,
        y: rawLabelPos.y,
      };
      const centsLabel = getCachedCentsReadout(
        node,
        {
          wrap: enharmonicsEnabled,
          requireHejiDetail: true,
          baseTextForHeji: displayInfo.pitchClass,
        },
        displayInfo
      );
      const hasParen = centsLabel.includes("(");
      const restGapScale =
        hejiEnabled && hasParen ? HEJI_REST_GAP : HEJI_REST_GAP_PLAIN;
      const baseLabel = featureMode === "ratio" ? displayInfo.pitchClass : displayInfo.name;
      const annotation = getCachedHejiAnnotation(node, baseLabel || node.note_name);
      drawHejiInline({
        x: labelPos.x,
        y: labelPos.y,
        baseText: annotation.baseText,
        suffixParts: annotation.suffixParts,
        restText: ` ${centsLabel}`,
        size: detailSize,
        font: "Lexend, sans-serif",
        align: "left",
        baseline: "top",
        hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
        restGapScale,
        restHejiAccidentals: hejiEnabled && hasParen,
        fontWeight: 200,
        color: themeColors.textSecondary,
      });
      if (showHz && Number.isFinite(node.freq)) {
        ctx.save();
        ctx.font = `200 ${detailSize}px "Lexend", sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = themeColors.textSecondary;
        const hzY = labelPos.y + detailSize + 4;
        ctx.fillText(`${node.freq.toFixed(2)} Hz`, labelPos.x, hzY);
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

    if (keyMap && node.active && !layoutMode) {
      const keyLabel = keyMap.get(node.id);
      if (keyLabel) {
        if (is3DMode) {
          drawKeyBanner(pos, radius, keyLabel, alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = '11px "Lexend", sans-serif';
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

  if (layoutMode && layoutAxisEdit) {
    ctx.save();
    ctx.fillStyle = "rgba(128, 128, 128, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = themeColors.textSecondary;
    ctx.fillStyle = themeColors.textSecondary;
    ctx.lineWidth = 1.5;
    ctx.font = `${getAxisLegendSettings().fontSize}px ${layoutRatioFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    drawLayoutAxisLegend(layoutAxisEdit, { showHandles: true });
    ctx.restore();
  }

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
  const attack = getEnvelopeAttackSeconds() || 0.02;
  const decay = getEnvelopeDecaySeconds() || 0.2;
  const sustain = Number(sustainSlider.value) || 0.6;
  const release = getEnvelopeReleaseSeconds() || 0.6;
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
  };

  if (isOneShot) {
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
    const stopAt = now + attack + decay + release + 0.05;
    oscillator.stop(stopAt);
  }

  if (looperState === "recording" && voice.source !== "looper") {
    const t = performance.now() - looperStartMs;
    looperEvents.push({ type: "on", nodeId: voice.nodeId, t, octave: voice.octave });
    looperLoopDurationMs = Math.max(looperLoopDurationMs, t);
    if (isOneShot) {
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
  const release = immediate ? 0.02 : getEnvelopeReleaseSeconds() || 0.6;
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
  if (layoutMode && layoutLabelHitboxVisible && !hitTestNoteLabel(screenPoint)) {
    layoutLabelHitboxVisible = false;
    draw();
  }
  const hit = hitTestScreen(screenPoint);
  const now = performance.now();

  if (rHeld && hit && spellingMode === "simple") {
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
      currentIndex = options.findIndex((option) => option.key === "base");
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
  if (tHeld) {
    const triangle = findTriangleHit(screenPoint);
    if (triangle) {
      const keys = triangleCellKeys(triangle);
      const disableScale = layoutMode && layoutUnifyNodeSize;
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
    if (lHeld) {
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
    if (hit) {
      const worldPoint = screenToWorld(screenPoint);
      const coord = getNodeDisplayCoordinate(hit);
      pushLayoutUndoState();
      layoutDrag = {
        nodeId: hit.id,
        offsetX: coord.x - worldPoint.x,
        offsetY: coord.y - worldPoint.y,
        startCoord: { x: coord.x, y: coord.y },
        lockAxis: null,
        lockOriginX: event.offsetX,
        lockOriginY: event.offsetY,
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

  if (customDrag && customDrag.placing) {
    const node = nodeById.get(customDrag.nodeId);
    if (node) {
      const worldPoint = screenToWorld(screenPoint);
      node.coordinate.x = worldPoint.x + customDrag.offsetX;
      node.coordinate.y = worldPoint.y + customDrag.offsetY;
      node.coordinate.z = 0;
      draw();
    }
    customDrag = null;
    customDragJustPlaced = true;
    if (uiHint) {
      if (showHelpEnabled && !uiHintDismissed) {
        uiHint.hidden = false;
        uiHintKey = "custom-node";
        uiHint.textContent =
          "Custom node: Command-drag to move. Option-click to deactivate. Option-click again to delete. Click to activate.\n(click to hide)";
      }
    }
    return;
  }

  if (hit && hit.isCustom && (event.metaKey || event.ctrlKey)) {
    const worldPoint = screenToWorld(screenPoint);
    customDrag = {
      nodeId: hit.id,
      offsetX: hit.coordinate.x - worldPoint.x,
      offsetY: hit.coordinate.y - worldPoint.y,
    };
    canvas.setPointerCapture(event.pointerId);
    return;
  }

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
  if (!layoutMode) {
    return;
  }
  const screenPoint = { x: event.offsetX, y: event.offsetY };
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
  pushLayoutUndoState();
  if (next === layoutNodeShape) {
    layoutNodeShapes.delete(hit.id);
  } else {
    layoutNodeShapes.set(hit.id, next);
  }
  draw();
  schedulePresetUrlUpdate();
}

function onPointerMove(event) {
  view.lastPointer = { x: event.offsetX, y: event.offsetY };
  if (layoutMode && layoutAxisEditDrag) {
    const info = getAxisLegendInfo(layoutAxisEditDrag.axis);
    if (info) {
      layoutAxisAngles[layoutAxisEditDrag.axis] = Math.atan2(
        event.offsetY - info.center.y,
        event.offsetX - info.center.x
      );
      scheduleDraw();
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
    return;
  }
  if (layoutMode && layoutLabelDrag) {
    const node = nodeById.get(layoutLabelDrag.nodeId);
    if (node) {
      const disableScale = layoutUnifyNodeSize;
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
    }
    return;
  }
  if (layoutMode && layoutDrag) {
    const node = nodeById.get(layoutDrag.nodeId);
    if (node) {
      const worldPoint = screenToWorld({ x: event.offsetX, y: event.offsetY });
      const coord = getNodeDisplayCoordinate(node);
      const lockAxis = updateDragLock(layoutDrag, event);
      const nextCoord = {
        x: worldPoint.x + layoutDrag.offsetX,
        y: worldPoint.y + layoutDrag.offsetY,
        z: Number.isFinite(coord.z) ? coord.z : 0,
      };
      if (lockAxis === "x") {
        nextCoord.y = layoutDrag.startCoord.y;
      } else if (lockAxis === "y") {
        nextCoord.x = layoutDrag.startCoord.x;
      }
      if (!event.shiftKey) {
        layoutDrag.startCoord = { x: nextCoord.x, y: nextCoord.y };
      }
      layoutPositions.set(node.id, nextCoord);
      scheduleDraw();
    }
    return;
  }
  if (customDrag) {
    const node = nodeById.get(customDrag.nodeId);
    if (node) {
      const worldPoint = screenToWorld({ x: event.offsetX, y: event.offsetY });
      node.coordinate.x = worldPoint.x + customDrag.offsetX;
      node.coordinate.y = worldPoint.y + customDrag.offsetY;
      node.coordinate.z = 0;
      scheduleDraw();
      schedulePresetUrlUpdate();
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
  if (tHeld && !view.dragging && !view.rotating) {
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
  if (suppressClickAfterRespell) {
    suppressClickAfterRespell = false;
    return;
  }
  if (customDragJustPlaced) {
    customDragJustPlaced = false;
    return;
  }
  if (layoutLabelDrag) {
    layoutLabelDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutTitleDrag) {
    layoutTitleDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutCreatorDrag) {
    layoutCreatorDrag = null;
    schedulePresetUrlUpdate();
    return;
  }
  if (layoutCustomLabelDrag) {
    layoutCustomLabelDrag = null;
    schedulePresetUrlUpdate();
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
    layoutDrag = null;
    return;
  }
  if (layoutMode) {
    if (view.dragging) {
      view.dragging = false;
    }
    view.reducedEffects = false;
    return;
  }
  if (customDrag) {
    customDrag = null;
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
  view.reducedEffects = false;

  if (moved < 4) {
    const screenPoint = { x: event.offsetX, y: event.offsetY };
    const hit = hitTestScreen(screenPoint);
    if (hit) {
      if (event.altKey && !hit.isCenter) {
        if (hit.isCustom) {
          if (hit.active) {
            hit.active = false;
            stopVoicesForNode(hit.id, false);
            pruneTriangleDiagonals();
          } else {
            stopVoicesForNode(hit.id, false);
            customNodes = customNodes.filter((node) => node.id !== hit.id);
            nodes = nodes.filter((node) => node.id !== hit.id);
            nodeById.delete(hit.id);
            pruneTriangleDiagonals();
          }
        } else if (hit.active) {
          hit.active = false;
          stopVoicesForNode(hit.id, false);
          pruneTriangleDiagonals();
        } else {
          return;
        }
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
  if (moved >= 4 || wasRotating) {
    scheduleDraw();
  }
}

function onPointerLeave() {
  hoverNodeId = null;
  lfoArmingId = null;
  customDrag = null;
  layoutDrag = null;
  layoutLabelDrag = null;
  layoutAxisDrag = null;
  layoutAxisEditDrag = null;
  layoutTitleDrag = null;
  layoutCreatorDrag = null;
  layoutCustomLabelDrag = null;
  triangleHover = null;
  view.rotating = false;
  if (view.dragging) {
    view.dragging = false;
  }
  view.reducedEffects = false;
  scheduleDraw();
}

function onWheel(event) {
  event.preventDefault();
  if (layoutMode) {
    pushLayoutUndoStateForWheel();
  }
  const zoomDelta = event.deltaY > 0 ? 0.92 : 1.08;
  if (is3DMode) {
    view.zoom = Math.min(2.2, Math.max(0.5, view.zoom * zoomDelta));
    scheduleDraw();
    markIsomorphicDirty();
    schedulePresetUrlUpdate();
    return;
  }
  const before = screenToWorld({ x: event.offsetX, y: event.offsetY });
  view.zoom = Math.min(2.2, Math.max(0.5, view.zoom * zoomDelta));
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
  const radius = layoutMode ? layoutNodeSize : 36 / view.zoom;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestDepth = Number.NEGATIVE_INFINITY;

  nodes.forEach((node) => {
    if (layoutMode && !node.isCustom && !node.isCenter && !node.active) {
      return;
    }
    if (
      !node.isCustom &&
      !node.active &&
      (!isInactiveNodeAvailable(node) || (is3DMode && !isAddMode))
    ) {
      return;
    }
    const projected = worldToScreen(
      getNodeDisplayCoordinate(node),
      layoutMode && layoutUnifyNodeSize
    );
    const dx = projected.x - screenPoint.x;
    const dy = projected.y - screenPoint.y;
    const distance = Math.hypot(dx, dy);
    const adjustedRadius = radius * (projected.scale || 1);
    if (distance <= adjustedRadius) {
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

function hitTestNoteLabel(screenPoint) {
  if (!layoutMode) {
    return null;
  }
  const disableScale = layoutUnifyNodeSize;
  let hit = null;
  nodes.forEach((node) => {
    if (!(node.isCenter || node.active || node.isCustom)) {
      return;
    }
    const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
    const radius = layoutNodeSize * (pos.scale || 1);
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

function hitTestLayoutTitle(screenPoint) {
  if (!layoutMode || !layoutTitle) {
    return null;
  }
  const titleSize = Math.max(12, Math.round(layoutTitleSize));
  ctx.save();
  ctx.font = `${titleSize}px ${layoutTitleFont}`;
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
  ctx.font = `${creatorSize}px ${layoutTitleFont}`;
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
  ctx.font = `${size}px ${layoutCustomLabelFont}`;
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
  ctx.font = `${settings.fontSize}px ${layoutRatioFont}`;
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

function updateEnvelopeReadouts() {
  const unit = envelopeTimeMode === "tempo" ? " beats" : "s";
  attackReadout.textContent = `${Number(attackSlider.value).toFixed(2)}${unit}`;
  decayReadout.textContent = `${Number(decaySlider.value).toFixed(2)}${unit}`;
  sustainReadout.textContent = `${Number(sustainSlider.value).toFixed(2)}`;
  releaseReadout.textContent = `${Number(releaseSlider.value).toFixed(2)}${unit}`;
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
    const fontSize = Math.max(9, Math.round(width * 0.03));
    ctx2d.fillStyle = themeColors.wheelText;
    ctx2d.font = `${fontSize}px Georgia`;
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
        font: "Georgia",
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
  if (
    view.dragging ||
    view.rotating ||
    layoutDrag ||
    layoutLabelDrag ||
    layoutTitleDrag ||
    layoutCreatorDrag ||
    layoutCustomLabelDrag ||
    layoutAxisDrag ||
    layoutAxisEditDrag ||
    customDrag
  ) {
    return;
  }
  if (ratioWheelPanel && !ratioWheelPanel.hidden) {
    drawRatioWheel(ratioWheelLarge);
  }
  if (ratioWheelMini) {
    drawRatioWheel(ratioWheelMini, { showLabels: false, showIntervals: false });
  }
}

function getUiHintKey() {
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

function updateUiHint() {
  if (!uiHint) {
    return;
  }
  const nextKey = getUiHintKey();
  if (nextKey !== uiHintKey) {
    uiHintKey = nextKey;
    uiHintDismissed = false;
  }
  if (!showHelpEnabled || uiHintDismissed || (zModeActive && zModeAnchor)) {
    uiHint.hidden = true;
    return;
  }
  uiHint.hidden = false;
  if (layoutMode) {
    if (layoutAxisEdit) {
      uiHint.textContent = "Editing axis legend. Press ESC to exit.\n(click to hide)";
      return;
    }
    if (tHeld) {
      uiHint.textContent =
        "Creating triangles (T)\nClick to add a diagonal, click again to label.\nClick line to rotate or remove.\n(click to hide)";
      return;
    }
  }
  if (spellingHintActive) {
    uiHint.textContent =
      spellingMode === "true"
        ? "Diatonic spellings up to 3 sharps / flats, after which nearest enharmonic equivalents are used.\n(click to hide)"
        : "Manual spelling: hold R and click on a node to cycle.\n(click to hide)";
    return;
  }
  if (layoutMode) {
    uiHint.textContent =
      "Layout mode: Drag to adjust positions. \nHold Shift to lock moves to 1 direction.\nHold L and click to add custom text.\nDouble-click a node to change its shape.\nDouble-click an axis legend to adjust angle.\n(click to hide)";
    return;
  }

  if (!is3DMode) {
    uiHint.textContent =
      "Click to play. Shift double-click & hold to start LFO.\n Shift-click to add. Option-click to remove. Hold R and click to respell.\nDrag to pan. Scroll to zoom.\nHold T to label triangles.\n(click to hide)";
    return;
  }
  uiHint.textContent =
    "3D Mode:\nShift-click to add\nOption-click to remove\nZ-click a node to access Z axis for that node\nClick-drag to rotate\nShift double-click & hold for LFO\nHold R and click to respell\nHold T to label triangles\nArrow keys to pan\nScroll to zoom\n(click to hide)";
}

function resetUiHintToDefault() {
  spellingHintActive = false;
}

function showKeyboardModeHelp(message) {
  if (!keyboardHelp) {
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

function updateZModeMessage() {
  if (!zModeMessage) {
    return;
  }
  if (!zModeActive || !zModeAnchor) {
    if (wasZModeActive) {
      resetUiHintToDefault();
      wasZModeActive = false;
      updateUiHint();
    }
    zModeMessage.hidden = true;
    zModeMessage.textContent = "";
    if (uiHint) {
      if (showHelpEnabled) {
        updateUiHint();
      } else {
        uiHint.hidden = true;
      }
    }
    return;
  }
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  const coordX = zModeAnchor.x - centerX;
  const coordY = centerY - zModeAnchor.y;
  zModeMessage.textContent = `Editing Z axis for node [${coordX},${coordY}]: press Escape to return`;
  zModeMessage.hidden = false;
  if (uiHint) {
    uiHint.hidden = true;
  }
  wasZModeActive = true;
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
  if (tHeld) {
    updateUiHint();
  }
}

function updateLayoutScaleReadout() {
  if (!layoutScaleReadout) {
    return;
  }
  const clamped = Math.min(2, Math.max(0.5, view.zoom));
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
  if (layoutTitleSizeInput) {
    layoutTitleSizeInput.value = String(layoutTitleSize);
  }
}

function setLayoutCreatorSize(next) {
  if (!Number.isFinite(next)) {
    return;
  }
  layoutCreatorSize = Math.min(72, Math.max(8, Math.round(next)));
  if (layoutCreatorSizeInput) {
    layoutCreatorSizeInput.value = String(layoutCreatorSize);
  }
}

function setLayoutCustomLabelSize(next) {
  if (!Number.isFinite(next)) {
    return;
  }
  layoutCustomLabelTextSize = Math.min(36, Math.max(8, Math.round(next)));
  if (layoutCustomLabelSizeInput) {
    layoutCustomLabelSizeInput.value = String(layoutCustomLabelTextSize);
  }
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

function syncLayoutScaleInput() {
  if (!layoutScaleInput) {
    return;
  }
  const clamped = Math.min(2, Math.max(0.5, view.zoom));
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
    layoutNodeShapes: new Map(layoutNodeShapes),
    layoutAxisOffsets: {
      x: { ...layoutAxisOffsets.x },
      y: { ...layoutAxisOffsets.y },
      z: { ...layoutAxisOffsets.z },
    },
    layoutAxisAngles: { ...layoutAxisAngles },
    layoutTitlePosition: layoutTitlePosition ? { ...layoutTitlePosition } : null,
    layoutCreatorPosition: layoutCreatorPosition ? { ...layoutCreatorPosition } : null,
    layoutCustomLabels: layoutCustomLabels.map((entry) => ({
      ...entry,
      position: entry.position ? { ...entry.position } : null,
    })),
    layoutNodeSize,
    layoutRatioTextSize,
    layoutNoteTextSize,
    layoutTriangleLabelTextSize,
    layoutCustomLabelTextSize,
    layoutNodeShape,
    layoutTitle,
    layoutCreator,
    layoutTitleSize,
    layoutCreatorSize,
    layoutTitleMargin,
    layoutTitleFont,
    layoutRatioFont,
    layoutNoteFont,
    layoutTriangleLabelFont,
    layoutCustomLabelFont,
    layoutUnifyNodeSize,
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
  layoutNodeShapes = new Map(state.layoutNodeShapes);
  layoutAxisOffsets = {
    x: { ...state.layoutAxisOffsets.x },
    y: { ...state.layoutAxisOffsets.y },
    z: { ...state.layoutAxisOffsets.z },
  };
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
  layoutUnifyNodeSize = state.layoutUnifyNodeSize;
  layoutPageSize = state.layoutPageSize;
  layoutOrientation = state.layoutOrientation;
  layoutLockPosition = state.layoutLockPosition;
  if (layoutLockPositionToggle) {
    layoutLockPositionToggle.checked = layoutLockPosition;
  }
  layoutView = layoutLockPosition ? { ...state.view } : { ...state.layoutView };
  view.zoom = state.view.zoom;
  view.offsetX = state.view.offsetX;
  view.offsetY = state.view.offsetY;
  view.rotX = state.view.rotX;
  view.rotY = state.view.rotY;
  if (layoutTitleInput) {
    layoutTitleInput.value = layoutTitle;
  }
  if (layoutCreatorInput) {
    layoutCreatorInput.value = layoutCreator;
  }
  if (layoutTitleSizeInput) {
    layoutTitleSizeInput.value = String(layoutTitleSize);
  }
  if (layoutCreatorSizeInput) {
    layoutCreatorSizeInput.value = String(layoutCreatorSize);
  }
  if (layoutTitleMarginInput) {
    layoutTitleMarginInput.value = String(layoutTitleMargin);
  }
  if (layoutNodeSizeInput) {
    layoutNodeSizeInput.value = String(layoutNodeSize);
  }
  if (layoutRatioTextSizeInput) {
    layoutRatioTextSizeInput.value = String(layoutRatioTextSize);
  }
  if (layoutNoteTextSizeInput) {
    layoutNoteTextSizeInput.value = String(layoutNoteTextSize);
  }
  if (layoutTriangleLabelSizeInput) {
    layoutTriangleLabelSizeInput.value = String(layoutTriangleLabelTextSize);
  }
  if (layoutCustomLabelSizeInput) {
    layoutCustomLabelSizeInput.value = String(layoutCustomLabelTextSize);
  }
  if (layoutNodeShapeSelect) {
    layoutNodeShapeSelect.value = layoutNodeShape;
  }
  if (layoutPageSizeSelect) {
    layoutPageSizeSelect.value = layoutPageSize;
  }
  if (layoutOrientationSelect) {
    layoutOrientationSelect.value = layoutOrientation;
  }
  if (layoutTitleFontSelect) {
    layoutTitleFontSelect.value = layoutTitleFont;
  }
  if (layoutRatioFontSelect) {
    layoutRatioFontSelect.value = layoutRatioFont;
  }
  if (layoutNoteFontSelect) {
    layoutNoteFontSelect.value = layoutNoteFont;
  }
  if (layoutTriangleLabelFontSelect) {
    layoutTriangleLabelFontSelect.value = layoutTriangleLabelFont;
  }
  if (layoutCustomFontSelect) {
    layoutCustomFontSelect.value = layoutCustomLabelFont;
  }
  if (layoutUnifySizeToggle) {
    layoutUnifySizeToggle.checked = layoutUnifyNodeSize;
  }
  updateLayoutCustomLabelControls();
  syncLayoutFontVars();
  syncLayoutScaleInput();
  updateLayoutNodeSizeReadout();
  updateLayoutRatioTextReadout();
  updateLayoutNoteTextReadout();
  updateLayoutTriangleLabelReadout();
  updateLayoutTitleMarginReadout();
  invalidateLabelCache({ clearTextWidths: true });
  draw();
  markIsomorphicDirty();
  schedulePresetUrlUpdate();
}

function undoLayoutChange() {
  if (!layoutMode || !layoutUndoStack.length) {
    return;
  }
  const state = layoutUndoStack.pop();
  applyLayoutUndoState(state);
}

function resetLayoutState({ resetSettings = true, resetView = true } = {}) {
  layoutPositions.clear();
  layoutLabelOffsets.clear();
  layoutNodeShapes.clear();
  layoutCustomLabels = [];
  layoutCustomLabelId = 1;
  layoutTitlePosition = null;
  layoutCreatorPosition = null;
  layoutAxisOffsets = {
    x: { x: 0, y: 0 },
    y: { x: 0, y: 0 },
    z: { x: 0, y: 0 },
  };
  layoutAxisAngles = {
    x: null,
    y: null,
    z: null,
  };
  layoutAxisEdit = null;
  layoutAxisEditDrag = null;
  if (resetSettings) {
    layoutNodeSize = LAYOUT_DEFAULTS.nodeSize;
    layoutRatioTextSize = LAYOUT_DEFAULTS.ratioTextSize;
    layoutNoteTextSize = LAYOUT_DEFAULTS.noteTextSize;
    layoutTriangleLabelTextSize = LAYOUT_DEFAULTS.triangleLabelTextSize;
    layoutCustomLabelTextSize = LAYOUT_DEFAULTS.customLabelTextSize;
    layoutNodeShape = LAYOUT_DEFAULTS.nodeShape;
    layoutTitle = LAYOUT_DEFAULTS.title;
    layoutCreator = LAYOUT_DEFAULTS.creator;
    layoutTitleSize = LAYOUT_DEFAULTS.titleSize;
    layoutCreatorSize = LAYOUT_DEFAULTS.creatorSize;
    layoutTitleMargin = LAYOUT_DEFAULTS.titleMargin;
    layoutUnifyNodeSize = LAYOUT_DEFAULTS.unifyNodeSize;
    layoutPageSize = LAYOUT_DEFAULTS.pageSize;
    layoutOrientation = LAYOUT_DEFAULTS.orientation;
    layoutLockPosition = LAYOUT_DEFAULTS.lockPosition;
    layoutView = { ...LAYOUT_DEFAULTS.view };
    layoutTitleFont = LAYOUT_DEFAULTS.titleFont;
    layoutRatioFont = LAYOUT_DEFAULTS.ratioFont;
    layoutNoteFont = LAYOUT_DEFAULTS.noteFont;
    layoutTriangleLabelFont = LAYOUT_DEFAULTS.triangleLabelFont;
    layoutCustomLabelFont = LAYOUT_DEFAULTS.customLabelFont;
    if (layoutTitleInput) {
      layoutTitleInput.value = layoutTitle;
    }
    if (layoutCreatorInput) {
      layoutCreatorInput.value = layoutCreator;
    }
    if (layoutTitleSizeInput) {
      layoutTitleSizeInput.value = String(layoutTitleSize);
    }
    if (layoutCreatorSizeInput) {
      layoutCreatorSizeInput.value = String(layoutCreatorSize);
    }
    if (layoutTitleMarginInput) {
      layoutTitleMarginInput.value = String(layoutTitleMargin);
    }
    if (layoutPageSizeSelect) {
      layoutPageSizeSelect.value = layoutPageSize;
    }
    if (layoutOrientationSelect) {
      layoutOrientationSelect.value = layoutOrientation;
    }
    if (layoutLockPositionToggle) {
      layoutLockPositionToggle.checked = layoutLockPosition;
    }
    if (layoutNodeSizeInput) {
      layoutNodeSizeInput.value = String(layoutNodeSize);
    }
    if (layoutRatioTextSizeInput) {
      layoutRatioTextSizeInput.value = String(layoutRatioTextSize);
    }
    if (layoutNoteTextSizeInput) {
      layoutNoteTextSizeInput.value = String(layoutNoteTextSize);
    }
    if (layoutTriangleLabelSizeInput) {
      layoutTriangleLabelSizeInput.value = String(layoutTriangleLabelTextSize);
    }
    if (layoutCustomLabelSizeInput) {
      layoutCustomLabelSizeInput.value = String(layoutCustomLabelTextSize);
    }
    if (layoutTitleFontSelect) {
      layoutTitleFontSelect.value = layoutTitleFont;
    }
    if (layoutRatioFontSelect) {
      layoutRatioFontSelect.value = layoutRatioFont;
    }
    if (layoutNoteFontSelect) {
      layoutNoteFontSelect.value = layoutNoteFont;
    }
    if (layoutTriangleLabelFontSelect) {
      layoutTriangleLabelFontSelect.value = layoutTriangleLabelFont;
    }
    if (layoutCustomFontSelect) {
      layoutCustomFontSelect.value = layoutCustomLabelFont;
    }
    if (layoutNodeShapeSelect) {
      layoutNodeShapeSelect.value = layoutNodeShape;
    }
    if (layoutUnifySizeToggle) {
      layoutUnifySizeToggle.checked = layoutUnifyNodeSize;
    }
    updateLayoutNodeSizeReadout();
    updateLayoutRatioTextReadout();
    updateLayoutNoteTextReadout();
    updateLayoutTriangleLabelReadout();
    updateLayoutTitleMarginReadout();
    syncLayoutFontVars();
    updateLayoutCustomLabelControls();
  }
  if (resetView) {
    view.zoom = LAYOUT_DEFAULTS.zoom;
    view.offsetX = 0;
    view.offsetY = 0;
    syncLayoutScaleInput();
  }
  draw();
}

function setLayoutMode(enabled) {
  if (layoutMode === enabled) {
    return;
  }
  uiHintKey = "";
  uiHintDismissed = false;
  resetUiHintToDefault();
  if (enabled) {
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
  if (layoutModeToggle) {
    layoutModeToggle.checked = enabled;
  }
  syncViewModeControls();
  if (layoutPanel) {
    layoutPanel.hidden = !enabled;
  }
  if (synthPanel) {
    synthPanel.hidden = enabled;
  }
  updateNavPanelVisibility();
  if (enabled) {
    if (mode3dCheckbox) {
      mode3dCheckbox.checked = false;
    }
    set3DMode(false);
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
    updateLayoutNodeSizeReadout();
    updateLayoutRatioTextReadout();
    updateLayoutNoteTextReadout();
    updateLayoutTriangleLabelReadout();
    updateLayoutTitleMarginReadout();
    updateLayoutCustomLabelControls();
    draw();
  } else if (layoutPrevState) {
    layoutAxisEdit = null;
    layoutAxisEditDrag = null;
    showAxes = layoutPrevState.showAxes;
    showGrid = layoutPrevState.showGrid;
    if (navAxesToggle) {
      navAxesToggle.checked = showAxes;
    }
    if (navGridToggle) {
      navGridToggle.checked = showGrid;
    }
    if (layoutLockPosition) {
      syncLayoutViewFromCurrent();
      view.zoom = layoutPrevState.zoom;
      view.offsetX = layoutPrevState.offsetX;
      view.offsetY = layoutPrevState.offsetY;
      view.rotX = layoutPrevState.rotX;
      view.rotY = layoutPrevState.rotY;
    }
    if (mode3dCheckbox) {
      mode3dCheckbox.checked = layoutPrevState.is3DMode;
    }
    set3DMode(layoutPrevState.is3DMode);
    layoutPrevState = null;
  } else {
    draw();
  }
  updateUiHint();
}

function set3DMode(enabled) {
  uiHintKey = "";
  uiHintDismissed = false;
  resetUiHintToDefault();
  const activeKeys = captureActiveNodeKeys();
  const had3DNodes = gridDepth > 1;
  is3DMode = enabled;
  isFlattened2D = !enabled && had3DNodes;
  markIsomorphicDirty();
  updateNavPanelVisibility();
  syncViewModeControls();
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
  if (!enabled) {
    zModeActive = false;
    zModeAnchor = null;
  }
  if (enabled && uiHint && showHelpEnabled && !uiHintDismissed) {
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
  } else if (action === "reset-view") {
    view.offsetX = 0;
    view.offsetY = 0;
    view.zoom = 1;
    if (is3DMode) {
      view.rotX = 0;
      view.rotY = 0;
    }
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
  view.zoom = Math.min(2.2, Math.max(0.5, Math.min(zoomX, zoomY)));
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
  view.zoom = Math.min(2.2, Math.max(0.5, Math.min(zoomX, zoomY)));
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

function refreshThemeColors() {
  const styles = getComputedStyle(document.body);
  themeColors = {
    edge: styles.getPropertyValue("--edge").trim() || "rgba(0, 0, 0, 0.18)",
    nodeStroke: styles.getPropertyValue("--node-stroke").trim() || "rgba(0, 0, 0, 0.35)",
    nodeActive: styles.getPropertyValue("--node-active").trim() || "#c94b3d",
    textPrimary: styles.getPropertyValue("--text-primary").trim() || "#1e1e1e",
    textSecondary: styles.getPropertyValue("--text-secondary").trim() || "#2a2a2a",
    page: styles.getPropertyValue("--page").trim() || "#ffffff",
    pageBorder:
      styles.getPropertyValue("--page-border").trim() || "rgba(16, 19, 22, 0.15)",
    pageShadow:
      styles.getPropertyValue("--page-shadow").trim() || "rgba(16, 19, 22, 0.18)",
    lfo: styles.getPropertyValue("--lfo").trim() || "#3b82f6",
    playFill: styles.getPropertyValue("--play-fill").trim() || "#f3d64d",
    looperFill: styles.getPropertyValue("--looper-fill").trim() || "#f1c94a",
    wheelLine: styles.getPropertyValue("--wheel-line").trim() || "rgba(16, 19, 22, 0.65)",
    wheelRing: styles.getPropertyValue("--wheel-ring").trim() || "rgba(16, 19, 22, 0.2)",
    wheelText: styles.getPropertyValue("--wheel-text").trim() || "#000000",
  };
}

function initLayoutFonts() {
  const styles = getComputedStyle(document.documentElement);
  layoutTitleFont = styles.getPropertyValue("--font-title").trim() || "Georgia";
  layoutRatioFont = styles.getPropertyValue("--font-ratio").trim() || "Georgia";
  layoutNoteFont = styles.getPropertyValue("--font-note").trim() || "Georgia";
  layoutTriangleLabelFont =
    styles.getPropertyValue("--font-triangle-label").trim() || "Georgia";
  layoutCustomLabelFont =
    styles.getPropertyValue("--font-custom-label").trim() || "Georgia";
  if (layoutTitleFontSelect) {
    layoutTitleFontSelect.value = layoutTitleFont;
  }
  if (layoutRatioFontSelect) {
    layoutRatioFontSelect.value = layoutRatioFont;
  }
  if (layoutNoteFontSelect) {
    layoutNoteFontSelect.value = layoutNoteFont;
  }
  if (layoutTriangleLabelFontSelect) {
    layoutTriangleLabelFontSelect.value = layoutTriangleLabelFont;
  }
  if (layoutCustomFontSelect) {
    layoutCustomFontSelect.value = layoutCustomLabelFont;
  }
  syncLayoutFontVars();
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
    .filter((node) => node.active && !node.isCustom)
    .map((node) => [node.exponentX, node.exponentY, node.exponentZ || 0]);
  const custom = customNodes.map((node) => ({
    numerator: node.numerator,
    denominator: node.denominator,
    x: node.coordinate.x,
    y: node.coordinate.y,
    active: Boolean(node.active),
  }));
  const layoutViewState =
    layoutLockPosition && !layoutMode
      ? layoutView
      : {
          zoom: view.zoom,
          offsetX: view.offsetX,
          offsetY: view.offsetY,
          rotX: view.rotX,
          rotY: view.rotY,
        };
  return {
    v: 1,
    active,
    customNodes: custom,
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
    circles: showCircles,
    ratios: [
      Number(ratioXSelect.value) || 3,
      Number(ratioYSelect.value) || 5,
      Number(ratioZSelect.value) || 7,
    ],
    noteSpellings: Array.from(nodeSpellingOverrides.entries()),
    triangles: Array.from(triangleDiagonals.values()).map((entry) => ({
      plane: entry.plane,
      x: entry.x,
      y: entry.y,
      z: entry.z,
      expZ: gridCenterZ - entry.z,
      diag: entry.diag,
      tri: entry.tri,
    })),
    triangleLabels: Array.from(triangleLabels.values()).map((entry) => ({
      plane: entry.plane,
      x: entry.x,
      y: entry.y,
      z: entry.z,
      expZ: gridCenterZ - entry.z,
      tri: entry.tri,
      label: entry.label || "",
    })),
    fundamental: Number(fundamentalInput.value) || 220,
    a4: Number(a4Input.value) || 440,
    fundamentalSpelling,
    layout: {
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
      titleMargin: layoutTitleMargin,
      titlePosition: layoutTitlePosition,
      creatorPosition: layoutCreatorPosition,
      customLabels: layoutCustomLabels.map((entry) => ({
        id: entry.id,
        text: entry.text,
        position: entry.position ? { ...entry.position } : null,
      })),
      labelOffsets: serializeLayoutLabelOffsets(),
      axisOffsets: layoutAxisOffsets,
      axisAngles: layoutAxisAngles,
      lockPosition: layoutLockPosition,
      view: layoutViewState,
      titleFont: layoutTitleFont,
      ratioFont: layoutRatioFont,
      noteFont: layoutNoteFont,
      triangleLabelFont: layoutTriangleLabelFont,
      customLabelFont: layoutCustomLabelFont,
      nodeShape: layoutNodeShape,
      unifyNodeSize: layoutUnifyNodeSize,
      pageSize: layoutPageSize,
      orientation: layoutOrientation,
      zoom: layoutViewState.zoom,
    },
    featureMode,
    spellingMode,
    showHz,
    showCentsSign,
    hejiEnabled,
    enharmonicsEnabled,
    centsPrecision,
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
      envelopeTimeMode,
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
  if (typeof state.circles === "boolean") {
    showCircles = state.circles;
    if (navCirclesToggle) {
      navCirclesToggle.checked = showCircles;
    }
  }
  const viewState = state.view && typeof state.view === "object" ? state.view : null;
  const activeHasZ = Array.isArray(state.active)
    ? state.active.some((entry) => Array.isArray(entry) && Number(entry[2]) !== 0)
    : false;
  const wants3D = Boolean(state.mode3d) || activeHasZ;
  const targetDepth = wants3D ? GRID_DEPTH : 1;
  const targetCenterZ = Math.floor(targetDepth / 2);
  if (mode3dCheckbox) {
    mode3dCheckbox.checked = wants3D;
  }
  is3DMode = wants3D;
  isFlattened2D = false;
  updateNavPanelVisibility();
  syncViewModeControls();
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
  if (Array.isArray(state.noteSpellings)) {
    nodeSpellingOverrides = new Map();
    state.noteSpellings.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return;
      }
      const [nodeId, spelling] = entry;
    if (spelling === "flat") {
      nodeSpellingOverrides.set(nodeId, "upper");
    } else if (spelling === "lower" || spelling === "upper") {
      nodeSpellingOverrides.set(nodeId, spelling);
    }
    });
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
    if (typeof state.synth.envelopeTimeMode === "string") {
      envelopeTimeMode = state.synth.envelopeTimeMode === "tempo" ? "tempo" : "absolute";
      envelopeTimeModeInputs.forEach((input) => {
        input.checked = input.value === envelopeTimeMode;
      });
    }
    updateEnvelopeReadouts();
    updatePatternLengthAvailability();
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

  const layoutState = state.layout && typeof state.layout === "object" ? state.layout : null;
  if (layoutState) {
    pendingLayoutLabelOffsets = Array.isArray(layoutState.labelOffsets)
      ? layoutState.labelOffsets
      : null;
    if (typeof layoutState.title === "string") {
      layoutTitle = layoutState.title;
      if (layoutTitleInput) {
        layoutTitleInput.value = layoutTitle;
      }
    }
    if (typeof layoutState.creator === "string") {
      layoutCreator = layoutState.creator;
      if (layoutCreatorInput) {
        layoutCreatorInput.value = layoutCreator;
      }
    }
    if (Number.isFinite(layoutState.titleSize)) {
      layoutTitleSize = layoutState.titleSize;
      if (layoutTitleSizeInput) {
        layoutTitleSizeInput.value = String(layoutTitleSize);
      }
    }
    if (Number.isFinite(layoutState.creatorSize)) {
      layoutCreatorSize = layoutState.creatorSize;
      if (layoutCreatorSizeInput) {
        layoutCreatorSizeInput.value = String(layoutCreatorSize);
      }
    }
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
      if (layoutRatioTextSizeInput) {
        layoutRatioTextSizeInput.value = String(layoutRatioTextSize);
      }
      if (layoutNoteTextSizeInput) {
        layoutNoteTextSizeInput.value = String(layoutNoteTextSize);
      }
      if (layoutTriangleLabelSizeInput) {
        layoutTriangleLabelSizeInput.value = String(layoutTriangleLabelTextSize);
      }
      updateLayoutRatioTextReadout();
      updateLayoutNoteTextReadout();
      updateLayoutTriangleLabelReadout();
    }
    if (Number.isFinite(layoutState.nodeSize)) {
      layoutNodeSize = layoutState.nodeSize;
      if (layoutNodeSizeInput) {
        layoutNodeSizeInput.value = String(layoutNodeSize);
      }
      updateLayoutNodeSizeReadout();
    }
    if (Number.isFinite(layoutState.ratioTextSize)) {
      layoutRatioTextSize = layoutState.ratioTextSize;
      if (layoutRatioTextSizeInput) {
        layoutRatioTextSizeInput.value = String(layoutRatioTextSize);
      }
      updateLayoutRatioTextReadout();
    }
    if (Number.isFinite(layoutState.noteTextSize)) {
      layoutNoteTextSize = layoutState.noteTextSize;
      if (layoutNoteTextSizeInput) {
        layoutNoteTextSizeInput.value = String(layoutNoteTextSize);
      }
      updateLayoutNoteTextReadout();
    }
    if (Number.isFinite(layoutState.triangleLabelTextSize)) {
      layoutTriangleLabelTextSize = layoutState.triangleLabelTextSize;
      if (layoutTriangleLabelSizeInput) {
        layoutTriangleLabelSizeInput.value = String(layoutTriangleLabelTextSize);
      }
      updateLayoutTriangleLabelReadout();
    } else {
      layoutTriangleLabelTextSize = Math.max(10, Math.round(layoutNoteTextSize + 6));
      if (layoutTriangleLabelSizeInput) {
        layoutTriangleLabelSizeInput.value = String(layoutTriangleLabelTextSize);
      }
      updateLayoutTriangleLabelReadout();
    }
    if (Number.isFinite(layoutState.customLabelTextSize)) {
      layoutCustomLabelTextSize = Math.min(
        36,
        Math.max(8, Math.round(layoutState.customLabelTextSize))
      );
      if (layoutCustomLabelSizeInput) {
        layoutCustomLabelSizeInput.value = String(layoutCustomLabelTextSize);
      }
    }
    if (Number.isFinite(layoutState.titleMargin)) {
      layoutTitleMargin = layoutState.titleMargin;
      if (layoutTitleMarginInput) {
        layoutTitleMarginInput.value = String(layoutTitleMargin);
      }
      updateLayoutTitleMarginReadout();
    }
    if (
      layoutState.titlePosition &&
      Number.isFinite(layoutState.titlePosition.x) &&
      Number.isFinite(layoutState.titlePosition.y)
    ) {
      layoutTitlePosition = {
        x: layoutState.titlePosition.x,
        y: layoutState.titlePosition.y,
      };
    } else {
      layoutTitlePosition = null;
    }
    if (
      layoutState.creatorPosition &&
      Number.isFinite(layoutState.creatorPosition.x) &&
      Number.isFinite(layoutState.creatorPosition.y)
    ) {
      layoutCreatorPosition = {
        x: layoutState.creatorPosition.x,
        y: layoutState.creatorPosition.y,
      };
    } else {
      layoutCreatorPosition = null;
    }
    if (layoutState.axisOffsets && typeof layoutState.axisOffsets === "object") {
      ["x", "y", "z"].forEach((axis) => {
        const offset = layoutState.axisOffsets[axis];
        if (offset && Number.isFinite(offset.x) && Number.isFinite(offset.y)) {
          layoutAxisOffsets[axis] = { x: offset.x, y: offset.y };
        }
      });
    }
    if (layoutState.axisAngles && typeof layoutState.axisAngles === "object") {
      ["x", "y", "z"].forEach((axis) => {
        const angle = layoutState.axisAngles[axis];
        layoutAxisAngles[axis] = Number.isFinite(angle) ? angle : null;
      });
    }
    if (typeof layoutState.titleFont === "string") {
      layoutTitleFont = layoutState.titleFont;
      if (layoutTitleFontSelect) {
        layoutTitleFontSelect.value = layoutTitleFont;
      }
    }
    if (typeof layoutState.ratioFont === "string") {
      layoutRatioFont = layoutState.ratioFont;
      if (layoutRatioFontSelect) {
        layoutRatioFontSelect.value = layoutRatioFont;
      }
    }
    if (typeof layoutState.noteFont === "string") {
      layoutNoteFont = layoutState.noteFont;
      if (layoutNoteFontSelect) {
        layoutNoteFontSelect.value = layoutNoteFont;
      }
    }
    if (typeof layoutState.triangleLabelFont === "string") {
      layoutTriangleLabelFont = layoutState.triangleLabelFont;
      if (layoutTriangleLabelFontSelect) {
        layoutTriangleLabelFontSelect.value = layoutTriangleLabelFont;
      }
    }
    if (typeof layoutState.customLabelFont === "string") {
      layoutCustomLabelFont = layoutState.customLabelFont;
      if (layoutCustomFontSelect) {
        layoutCustomFontSelect.value = layoutCustomLabelFont;
      }
    }
    if (Array.isArray(layoutState.customLabels)) {
      layoutCustomLabels = layoutState.customLabels
        .map((entry) => ({
          id: Number(entry.id),
          text: entry.text ? String(entry.text) : "",
          position: entry.position && Number.isFinite(entry.position.x) && Number.isFinite(entry.position.y)
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
    if (typeof layoutState.nodeShape === "string") {
      layoutNodeShape = layoutState.nodeShape;
      if (layoutNodeShapeSelect) {
        layoutNodeShapeSelect.value = layoutNodeShape;
      }
    }
    if (typeof layoutState.unifyNodeSize === "boolean") {
      layoutUnifyNodeSize = layoutState.unifyNodeSize;
      if (layoutUnifySizeToggle) {
        layoutUnifySizeToggle.checked = layoutUnifyNodeSize;
      }
    }
    if (typeof layoutState.pageSize === "string") {
      layoutPageSize = layoutState.pageSize;
      if (layoutPageSizeSelect) {
        layoutPageSizeSelect.value = layoutPageSize;
      }
    }
    if (typeof layoutState.orientation === "string") {
      layoutOrientation = layoutState.orientation;
      if (layoutOrientationSelect) {
        layoutOrientationSelect.value = layoutOrientation;
      }
    }
    if (typeof layoutState.lockPosition === "boolean") {
      layoutLockPosition = layoutState.lockPosition;
      if (layoutLockPositionToggle) {
        layoutLockPositionToggle.checked = layoutLockPosition;
      }
    }
    if (layoutState.view && typeof layoutState.view === "object") {
      const nextZoom = Number(layoutState.view.zoom);
      const nextOffsetX = Number(layoutState.view.offsetX);
      const nextOffsetY = Number(layoutState.view.offsetY);
      const nextRotX = Number(layoutState.view.rotX);
      const nextRotY = Number(layoutState.view.rotY);
      layoutView = {
        zoom: Number.isFinite(nextZoom) ? nextZoom : layoutView.zoom,
        offsetX: Number.isFinite(nextOffsetX) ? nextOffsetX : layoutView.offsetX,
        offsetY: Number.isFinite(nextOffsetY) ? nextOffsetY : layoutView.offsetY,
        rotX: Number.isFinite(nextRotX) ? nextRotX : layoutView.rotX,
        rotY: Number.isFinite(nextRotY) ? nextRotY : layoutView.rotY,
      };
    } else if (Number.isFinite(layoutState.zoom)) {
      layoutView = {
        ...layoutView,
        zoom: Math.min(2.2, Math.max(0.5, layoutState.zoom)),
      };
    }
    if (Number.isFinite(layoutState.zoom)) {
      if (layoutMode && layoutLockPosition) {
        view.zoom = Math.min(2.2, Math.max(0.5, layoutState.zoom));
        syncLayoutScaleInput();
      }
    }
    if (typeof layoutState.mode === "boolean") {
      setLayoutMode(layoutState.mode);
    }
  }

  if (typeof state.featureMode === "string") {
    featureMode = state.featureMode === "note" ? "note" : "ratio";
    syncFeatureModeControls();
  }
  if (typeof state.spellingMode === "string") {
    spellingMode = state.spellingMode === "true" ? "true" : "simple";
    syncSpellingModeControls();
  }
  if (typeof state.showHz === "boolean") {
    showHz = state.showHz;
    if (showHzToggle) {
      showHzToggle.checked = showHz;
    }
  }
  if (typeof state.showCentsSign === "boolean") {
    showCentsSign = state.showCentsSign;
    if (showCentsSignToggle) {
      showCentsSignToggle.checked = showCentsSign;
    }
  }
  if (typeof state.hejiEnabled === "boolean") {
    hejiEnabled = state.hejiEnabled;
    if (hejiEnabledToggle) {
      hejiEnabledToggle.checked = hejiEnabled;
    }
  }
  if (typeof state.enharmonicsEnabled === "boolean") {
    enharmonicsEnabled = state.enharmonicsEnabled;
    if (enharmonicsEnabledToggle) {
      enharmonicsEnabledToggle.checked = enharmonicsEnabled;
    }
  }
  if (Number.isFinite(state.centsPrecision)) {
    centsPrecision = Math.min(2, Math.max(0, Math.round(state.centsPrecision)));
    syncCentsPrecisionControls();
  }
  triangleDiagonals.clear();
  triangleLabels.clear();
  if (Array.isArray(state.triangles)) {
    state.triangles.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      const plane = entry.plane;
      const diag = entry.diag;
      if (plane !== "xy" && plane !== "xz" && plane !== "yz") {
        return;
      }
      if (diag !== "backslash" && diag !== "slash") {
        return;
      }
      const x = Number(entry.x);
      const y = Number(entry.y);
      const expZ = Number(entry.expZ);
      const z = Number.isFinite(expZ)
        ? targetCenterZ - expZ
        : Number(entry.z);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
        return;
      }
      if (z < 0 || z >= targetDepth) {
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
  if (Array.isArray(state.triangleLabels)) {
    state.triangleLabels.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      const plane = entry.plane;
      if (plane !== "xy" && plane !== "xz" && plane !== "yz") {
        return;
      }
      const tri = typeof entry.tri === "string" ? entry.tri : "";
      if (!TRIANGLE_TRI_IDS.has(tri)) {
        return;
      }
      const x = Number(entry.x);
      const y = Number(entry.y);
      const expZ = Number(entry.expZ);
      const z = Number.isFinite(expZ)
        ? targetCenterZ - expZ
        : Number(entry.z);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
        return;
      }
      if (z < 0 || z >= targetDepth) {
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

  invalidateLabelCache();
  updateFundamentalNotes();
  syncFundamentalNoteSelect();

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
  if (Array.isArray(state.customNodes)) {
    customNodes = state.customNodes
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }
        const x = Number(entry.x);
        const y = Number(entry.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return null;
        }
        const node = createCustomNode(entry.numerator, entry.denominator, { x, y }, entry.active);
        return node;
      })
      .filter(Boolean);
  } else {
    customNodes = [];
  }
  rebuildLattice(activeKeys, { remapTriangles: false });
  if (pendingLayoutLabelOffsets) {
    applyLayoutLabelOffsets(pendingLayoutLabelOffsets);
    pendingLayoutLabelOffsets = null;
    draw();
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
  )}" font-size="${size}" fill="${color}">${baseSpan}${suffixSpan}${restSpan}</text>`;
}

function buildHejiSvgInline({
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
  const baseWidth = measureTextWidthWithWeight(baseText, size, font, fontWeight);
  const parts = Array.isArray(suffixParts) ? suffixParts : [];
  const suffixWidth = parts.reduce((sum, part, index) => {
    const partWidth = measureSuffixPartWidth(part, size, suffixSpacing, fontWeight);
    return sum + partWidth + (index > 0 ? partGap : 0);
  }, 0);
  const restWidth = restText
    ? measureTextWidthWithWeight(restText, size, font, fontWeight)
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
    `<text x="${startX}" y="${y}" text-anchor="start" dominant-baseline="${baseline}" font-family="${escapeSvgText(
      font
    )}" font-size="${size}" font-weight="${fontWeight}" fill="${color}">${escapeSvgText(
      baseText
    )}</text>`
  );

  let cursorX = startX + baseWidth;
  if (parts.length) {
    cursorX += baseSuffixGap;
    parts.forEach((part, partIndex) => {
      if (partIndex > 0) {
        cursorX += partGap;
      }
      const partCharGap = Number.isFinite(part.charGap) ? part.charGap : suffixSpacing;
      const partStartX = cursorX;
      const partWidth = measureSuffixPartWidth(part, size, suffixSpacing, fontWeight);
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
        nodes.push(
          `<text x="${cursorX}" y="${y + partYOffset}" text-anchor="start" dominant-baseline="${baseline}" font-family="${escapeSvgText(
            partFont
          )}" font-size="${charSize}" font-weight="${partWeight}" fill="${color}">${escapeSvgText(
            char
          )}</text>`
        );
        cursorX += measureCharWidth(char, charSize, partFont, partWeight);
      });
      if (part.expLabel) {
        const expSize = Math.max(8, Math.round(size * 0.55));
        const expY =
          y +
          (typeof part.yOffset === "number" ? part.yOffset : hejiYOffset) +
          getExponentOffset(size, baseline);
        nodes.push(
          `<text x="${partStartX + partWidth / 2}" y="${expY}" text-anchor="middle" dominant-baseline="hanging" font-family="${escapeSvgText(
            font
          )}" font-size="${expSize}" font-weight="${fontWeight}" fill="${color}">${escapeSvgText(
            part.expLabel
          )}</text>`
        );
      }
    });
  }

  if (restText) {
    cursorX += restGap;
    const chars = Array.from(restText);
    const needsInline =
      restHejiAccidentals || restText.includes(CENTS_CHAR) || /[veV]/.test(restText);
    if (!needsInline) {
      nodes.push(
        `<text x="${cursorX}" y="${y}" text-anchor="start" dominant-baseline="${baseline}" font-family="${escapeSvgText(
          font
        )}" font-size="${size}" font-weight="${fontWeight}" fill="${color}">${escapeSvgText(
          restText
        )}</text>`
      );
    } else {
      chars.forEach((char) => {
        const useHeji = char === "v" || char === "e" || char === "V";
        const isCent = char === CENTS_CHAR;
        const charSize = isCent ? getCentsCharSize(size) : size;
        const charFont = useHeji ? "HEJI2Text" : font;
        const charWeight = useHeji ? "normal" : fontWeight;
        nodes.push(
          `<text x="${cursorX}" y="${y + (useHeji ? hejiYOffset : 0)}" text-anchor="start" dominant-baseline="${baseline}" font-family="${escapeSvgText(
            charFont
          )}" font-size="${charSize}" font-weight="${charWeight}" fill="${color}">${escapeSvgText(
            char
          )}</text>`
        );
        cursorX += measureCharWidth(char, charSize, charFont, useHeji ? 400 : fontWeight);
      });
    }
  }

  return nodes.join("\n");
}

const LEXEND_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap";

function getHejiFontUrl() {
  try {
    return new URL("./src/HEJI2Text.otf", window.location.href).href;
  } catch (error) {
    return "./src/HEJI2Text.otf";
  }
}

function getExportFontCss() {
  const hejiFontUrl = getHejiFontUrl();
  return `@import url("${LEXEND_FONT_URL}");
@font-face { font-family: "HEJI2Text"; src: url("${hejiFontUrl}") format("opentype"); font-display: swap; }`;
}

function buildLayoutSvgString() {
  if (!layoutMode) {
    return null;
  }
  if (!themeColors) {
    refreshThemeColors();
  }
  const { widthIn, heightIn, widthPx, heightPx } = getLayoutPageDimensions();
  const { left, top } = getLayoutPageRect();
  const disableScale = layoutUnifyNodeSize;
  const labelSize = layoutRatioTextSize;
  const detailSize = layoutNoteTextSize;
  const titleSize = Math.max(12, Math.round(layoutTitleSize));
  const creatorSize = getLayoutCreatorSize();

  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${widthIn}in" height="${heightIn}in" viewBox="0 0 ${widthPx} ${heightPx}">`
  );
  parts.push(`<defs><style><![CDATA[${getExportFontCss()}]]></style></defs>`);
  parts.push(`<rect width="100%" height="100%" fill="${themeColors.page}"/>`);

  if (layoutTitle) {
    const titlePos = getLayoutTitlePosition();
    const titleX = layoutTitlePosition
      ? layoutTitlePosition.x
      : widthPx / 2;
    const titleY = layoutTitlePosition
      ? layoutTitlePosition.y
      : Math.max(12, titlePos.y - top);
    parts.push(
      `<text x="${titleX}" y="${titleY}" text-anchor="middle" font-family="${escapeSvgText(
        layoutTitleFont
      )}" font-size="${titleSize}" fill="${themeColors.textPrimary}">${escapeSvgText(
        layoutTitle
      )}</text>`
    );
  }
  if (layoutCreator) {
    const creatorPos = getLayoutCreatorPosition();
    const creatorX = layoutCreatorPosition
      ? layoutCreatorPosition.x
      : widthPx / 2;
    const creatorY = layoutCreatorPosition
      ? layoutCreatorPosition.y
      : Math.max(12, creatorPos.y - top);
    parts.push(
      `<text x="${creatorX}" y="${creatorY}" text-anchor="middle" font-family="${escapeSvgText(
        layoutTitleFont
      )}" font-size="${creatorSize}" fill="${themeColors.textSecondary}">${escapeSvgText(
        layoutCreator
      )}</text>`
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
  axisDefs.forEach((info) => {
    if (!info) {
      return;
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
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${axisColor}" stroke-width="${axisStroke}" />`
      );
      parts.push(
        `<polygon points="${p1} ${p2} ${p3}" fill="${axisColor}" />`
      );
    };
    buildArrow(leftStart.x, leftStart.y, leftEnd.x, leftEnd.y);
    buildArrow(rightStart.x, rightStart.y, rightEnd.x, rightEnd.y);
    const rotation = (info.textAngle * 180) / Math.PI;
    parts.push(
      `<text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="middle" font-family="${escapeSvgText(
        layoutRatioFont
      )}" font-size="${axisSettings.fontSize}" fill="${axisColor}" transform="rotate(${rotation} ${centerX} ${centerY})">${escapeSvgText(
        info.label
      )}</text>`
    );
  });

  if (layoutCustomLabels.length) {
    const customSize = Math.max(8, Math.round(layoutCustomLabelTextSize));
    layoutCustomLabels.forEach((entry) => {
      if (!entry.text || !entry.position) {
        return;
      }
      const x = entry.position.x;
      const y = entry.position.y;
      parts.push(
        `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="hanging" font-family="${escapeSvgText(
          layoutCustomLabelFont
        )}" font-size="${customSize}" fill="${themeColors.textSecondary}">${escapeSvgText(
          entry.text
        )}</text>`
      );
    });
  }

  edges.forEach(([a, b]) => {
    if (!a.active || !b.active) {
      return;
    }
    const start = worldToScreen(getNodeDisplayCoordinate(a), disableScale);
    const end = worldToScreen(getNodeDisplayCoordinate(b), disableScale);
    const radiusA = layoutNodeSize * (start.scale || 1);
    const radiusB = layoutNodeSize * (end.scale || 1);
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
      `<line x1="${edgeStart.x}" y1="${edgeStart.y}" x2="${edgeEnd.x}" y2="${edgeEnd.y}" stroke="${themeColors.edge}" stroke-width="1.5" />`
    );
  });

  if (triangleDiagonals.size) {
    const gridMap = new Map();
    nodes.forEach((node) => {
      if (node.active && !node.isCustom) {
        gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
      }
    });
    triangleDiagonals.forEach((entry) => {
      const { a, b } = getTriangleDiagonalNodes(entry, gridMap);
      if (!a || !b) {
        return;
      }
      const start = worldToScreen(getNodeDisplayCoordinate(a), disableScale);
      const end = worldToScreen(getNodeDisplayCoordinate(b), disableScale);
      const radiusA = layoutNodeSize * (start.scale || 1);
      const radiusB = layoutNodeSize * (end.scale || 1);
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
        `<line x1="${edgeStart.x}" y1="${edgeStart.y}" x2="${edgeEnd.x}" y2="${edgeEnd.y}" stroke="${themeColors.edge}" stroke-width="1.5" stroke-dasharray="6 4" />`
      );
    });
  }
  if (triangleLabels.size) {
    const gridMap = new Map();
    nodes.forEach((node) => {
      if (node.active && !node.isCustom) {
        gridMap.set(`${node.gridX},${node.gridY},${node.gridZ}`, node);
      }
    });
    triangleLabels.forEach((entry) => {
      if (!entry.label) {
        return;
      }
      const diag = TRIANGLE_TRI_TO_DIAG[entry.tri];
      if (!diag || !triangleDiagonals.has(triangleKey({ ...entry, diag }))) {
        return;
      }
      const cellNodes = getTriangleCellNodes(entry, gridMap);
      const labelNodes = getTriangleLabelPoints(entry.tri, cellNodes);
      if (!labelNodes) {
        return;
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
        points
      );
      parts.push(
        `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" font-family="${escapeSvgText(
          layoutTriangleLabelFont
        )}" font-size="${layout.size}" fill="${themeColors.textSecondary}">${escapeSvgText(
          entry.label
        )}</text>`
      );
    });
  }

  nodes.forEach((node) => {
    const isVisible = node.isCenter || node.active || node.isCustom;
    if (!isVisible) {
      return;
    }
    const pos = worldToScreen(getNodeDisplayCoordinate(node), disableScale);
    const x = pos.x - left;
    const y = pos.y - top;
    const radius = layoutNodeSize * (pos.scale || 1);
    const shape = getLayoutNodeShape(node);
    const fill = "none";
    const stroke = themeColors.nodeStroke;
    if (showCircles) {
      if (shape === "circle") {
        parts.push(
          `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2" />`
        );
      } else if (shape === "square") {
        parts.push(
          `<rect x="${x - radius}" y="${y - radius}" width="${radius * 2}" height="${
            radius * 2
          }" fill="${fill}" stroke="${stroke}" stroke-width="2" />`
        );
      } else if (shape === "triangle") {
        const height = radius * 1.2;
        const points = [
          `${x},${y - height}`,
          `${x + radius},${y + height * 0.6}`,
          `${x - radius},${y + height * 0.6}`,
        ].join(" ");
        parts.push(
          `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="2" />`
        );
      } else if (shape === "diamond") {
        const points = [
          `${x},${y - radius}`,
          `${x + radius},${y}`,
          `${x},${y + radius}`,
          `${x - radius},${y}`,
        ].join(" ");
        parts.push(
          `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="2" />`
        );
      }
    }

    if (featureMode === "note") {
      if (hejiEnabled && nodeHasHighPrime(node)) {
        const displayInfo = getDisplayNoteInfo(node);
        const base = getHejiBaseAndDefaults(displayInfo.pitchClass);
        const centsText = formatCents(displayInfo.cents);
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
          buildHejiSvgInline({
            x,
            y,
            baseText: base.baseText,
            suffixParts,
            restText: "",
            font: layoutRatioFont,
            size: labelSize,
            align: "center",
            baseline: "middle",
            color: themeColors.textPrimary,
          })
        );
      } else {
        const annotation = getHejiAnnotation(node, getNodePitchLabel(node));
        parts.push(
          buildHejiSvgInline({
            x,
            y,
            baseText: annotation.baseText,
            suffixParts: annotation.suffixParts,
            restText: "",
            font: layoutRatioFont,
            size: labelSize,
            align: "center",
            baseline: "middle",
            color: themeColors.textPrimary,
          })
        );
      }
      const centsLabel = buildCentsReadout(node, { wrap: enharmonicsEnabled });
      const rawLabelPos = getLayoutNoteLabelPosition(node, pos, radius);
      const labelOffsetX = rawLabelPos.x - pos.x;
      const ratioX = pos.x + labelOffsetX * 0.7 - left;
      const ratioY = rawLabelPos.y - top;
      parts.push(
        `<text x="${ratioX}" y="${ratioY}" text-anchor="start" dominant-baseline="hanging" font-family="Lexend, sans-serif" font-weight="200" font-size="${detailSize}" fill="${themeColors.textSecondary}">${escapeSvgText(
          `${node.numerator}:${node.denominator}`
        )}</text>`
      );
      parts.push(
        buildSvgTextWithSmallCent({
          text: centsLabel,
          x: ratioX,
          y: ratioY + detailSize + 4,
          font: "Lexend, sans-serif",
          size: detailSize,
          fontWeight: 200,
          align: "left",
          baseline: "hanging",
          hejiAccidentals: hejiEnabled,
          hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
          color: themeColors.textSecondary,
        })
      );
    } else {
      const maxWidth = radius * 1.6;
      const layout = computeRatioLabelLayout(
        node.numerator,
        node.denominator,
        layoutRatioFont,
        labelSize,
        maxWidth
      );
      const ratioYOffset = Math.round(layout.size * -0.09);
      if (layout.lines.length === 1) {
        parts.push(
          `<text x="${x}" y="${y + ratioYOffset}" text-anchor="middle" dominant-baseline="middle" font-family="${escapeSvgText(
            layoutRatioFont
          )}" font-size="${layout.size}" fill="${themeColors.textPrimary}">${escapeSvgText(
            layout.lines[0]
          )}</text>`
        );
      } else {
        const lineOffset = layout.size / 2 + layout.lineGap / 2;
        const lineY1 = y + ratioYOffset - lineOffset;
        const lineY2 = y + ratioYOffset + lineOffset;
        const lineWidth = Math.max(
          measureTextWidth(layout.lines[0], layout.size, layoutRatioFont),
          measureTextWidth(layout.lines[1], layout.size, layoutRatioFont)
        );
        const lineY = y + ratioYOffset + layout.size * 0.1;
        parts.push(
          `<text x="${x}" y="${lineY1}" text-anchor="middle" dominant-baseline="middle" font-family="${escapeSvgText(
            layoutRatioFont
          )}" font-size="${layout.size}" fill="${themeColors.textPrimary}">${escapeSvgText(
            layout.lines[0]
          )}</text>`
        );
        parts.push(
          `<text x="${x}" y="${lineY2}" text-anchor="middle" dominant-baseline="middle" font-family="${escapeSvgText(
            layoutRatioFont
          )}" font-size="${layout.size}" fill="${themeColors.textPrimary}">${escapeSvgText(
            layout.lines[1]
          )}</text>`
        );
        parts.push(
          `<line x1="${x - lineWidth / 2}" y1="${lineY}" x2="${x + lineWidth / 2}" y2="${lineY}" stroke="${themeColors.textPrimary}" stroke-width="${Math.max(
            1,
            Math.round(layout.size * 0.06)
          )}" />`
        );
      }

      const rawLabelPos = getLayoutNoteLabelPosition(node, pos, radius);
      const labelOffsetX = rawLabelPos.x - pos.x;
      const labelX = pos.x + labelOffsetX * 0.7 - left;
      const labelY = rawLabelPos.y - top;
      const displayInfo = getDisplayNoteInfo(node);
      const centsLabel = buildCentsReadout(node, {
        wrap: enharmonicsEnabled,
        requireHejiDetail: true,
        baseTextForHeji: displayInfo.pitchClass,
      });
      const hasParen = centsLabel.includes("(");
      const restGapScale =
        hejiEnabled && hasParen ? HEJI_REST_GAP : HEJI_REST_GAP_PLAIN;
      const baseLabel = featureMode === "ratio" ? displayInfo.pitchClass : displayInfo.name;
      const annotation = getHejiAnnotation(node, baseLabel || node.note_name);
      parts.push(
        buildHejiSvgInline({
          x: labelX,
          y: labelY,
          baseText: annotation.baseText,
          suffixParts: annotation.suffixParts,
          restText: ` ${centsLabel}`,
          font: "Lexend, sans-serif",
          size: detailSize,
          align: "left",
          baseline: "hanging",
          hejiYOffset: Math.round(detailSize * HEJI_SUFFIX_Y_OFFSET),
          restGapScale,
          restHejiAccidentals: hejiEnabled && hasParen,
          fontWeight: 200,
          color: themeColors.textSecondary,
        })
      );
    }
  });

  parts.push("</svg>");

  return parts.join("\n");
}

function exportLayoutSvg() {
  const svg = buildLayoutSvgString();
  if (!svg) {
    alert("Enable Page Layout mode to export SVG.");
    return;
  }
  const blob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lattice-layout.svg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportLayoutPdf() {
  const svg = buildLayoutSvgString();
  if (!svg) {
    alert("Enable Page Layout mode to export PDF.");
    return;
  }
  const { widthPx, heightPx } = getLayoutPageDimensions();
  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Allow pop-ups to export PDF.");
    return;
  }
  const hejiFontUrl = getHejiFontUrl();
  win.document.open();
  win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Layout PDF</title>
    <link rel="stylesheet" href="${LEXEND_FONT_URL}">
    <style>
      @page { size: ${Math.round(widthPx)}px ${Math.round(heightPx)}px; margin: 0; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
      body { display: flex; align-items: center; justify-content: center; }
      svg { width: ${Math.round(widthPx)}px; height: ${Math.round(heightPx)}px; display: block; }
      @font-face {
        font-family: "HEJI2Text";
        src: url("${hejiFontUrl}") format("opentype");
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
              document.fonts.load('16px "Lexend"')
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

function rebuildLattice(activeKeys = null, { remapTriangles = true } = {}) {
  stopAllVoices();
  const prevCenterZ = gridCenterZ;
  const latticeNodes = buildLattice();
  customNodes.forEach((node) => {
    node.gridZ = gridCenterZ;
    node.exponentZ = 0;
    node.coordinate.z = 0;
  });
  nodes = [...latticeNodes, ...customNodes];
  if (remapTriangles) {
    remapTrianglesForGridCenter(prevCenterZ, gridCenterZ);
  }
  nodeById = new Map(nodes.map((node) => [node.id, node]));
  if (layoutMode) {
    nodes.forEach((node) => ensureLayoutPosition(node));
  }
  bumpLabelDataVersion();
  applyActiveNodeKeys(activeKeys);
  pruneTriangleDiagonals();
  edges = buildEdges(latticeNodes, GRID_COLS, GRID_ROWS, gridDepth);
  updatePitchInstances();
  markIsomorphicDirty();
  refreshPatternFromActiveNodes();
  draw();
}

function resetLattice() {
  stopAllVoices();
  activeKeys.clear();
  nodeSpellingOverrides.clear();
  triangleDiagonals.clear();
  triangleLabels.clear();
  layoutUndoStack.length = 0;
  customNodes = [];
  fundamentalNoteSelect.value = "60";
  onFundamentalNoteChange();
  resetLayoutState();
  view.zoom = 1;
  view.offsetX = 0;
  view.offsetY = 0;
  view.rotX = 0;
  view.rotY = 0;
  hoverNodeId = null;
  rebuildLattice();
  updateUiHint();
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
if (navCirclesToggle) {
  showCircles = navCirclesToggle.checked;
}
if (mode3dCheckbox) {
  is3DMode = mode3dCheckbox.checked;
  updateNavPanelVisibility();
  if (ratioZSelect) {
    ratioZSelect.hidden = false;
  }
}
updateAddModeFromShift();
updateUiHint();
fundamentalNoteSelect.value = "60";
onFundamentalNoteChange();
initLayoutFonts();
setLayoutPanelCollapsed(false);
setViewsCollapsed(false);
if (layoutNodeSizeInput) {
  layoutNodeSizeInput.value = String(layoutNodeSize);
  updateLayoutNodeSizeReadout();
}
if (layoutRatioTextSizeInput) {
  layoutRatioTextSizeInput.value = String(layoutRatioTextSize);
  updateLayoutRatioTextReadout();
}
if (layoutNoteTextSizeInput) {
  layoutNoteTextSizeInput.value = String(layoutNoteTextSize);
  updateLayoutNoteTextReadout();
}
if (layoutTriangleLabelSizeInput) {
  layoutTriangleLabelSizeInput.value = String(layoutTriangleLabelTextSize);
  updateLayoutTriangleLabelReadout();
}
if (layoutCustomLabelSizeInput) {
  layoutCustomLabelSizeInput.value = String(layoutCustomLabelTextSize);
}
if (layoutLockPositionToggle) {
  layoutLockPositionToggle.checked = layoutLockPosition;
}
if (layoutNodeShapeSelect) {
  layoutNodeShapeSelect.value = layoutNodeShape;
}
if (layoutPageSizeSelect) {
  layoutPageSizeSelect.value = layoutPageSize;
}
if (layoutOrientationSelect) {
  layoutOrientationSelect.value = layoutOrientation;
}
if (layoutTitleInput) {
  layoutTitleInput.value = layoutTitle;
}
if (layoutCreatorInput) {
  layoutCreatorInput.value = layoutCreator;
}
if (layoutTitleSizeInput) {
  layoutTitleSizeInput.value = String(layoutTitleSize);
}
if (layoutCreatorSizeInput) {
  layoutCreatorSizeInput.value = String(layoutCreatorSize);
}
updateLayoutCustomLabelControls();
if (layoutTitleMarginInput) {
  layoutTitleMarginInput.value = String(layoutTitleMargin);
  updateLayoutTitleMarginReadout();
}
if (layoutTitleFontSelect) {
  layoutTitleFontSelect.value = layoutTitleFont;
}
if (layoutRatioFontSelect) {
  layoutRatioFontSelect.value = layoutRatioFont;
}
if (layoutNoteFontSelect) {
  layoutNoteFontSelect.value = layoutNoteFont;
}
if (layoutTriangleLabelFontSelect) {
  layoutTriangleLabelFontSelect.value = layoutTriangleLabelFont;
}
if (layoutUnifySizeToggle) {
  layoutUnifySizeToggle.checked = layoutUnifyNodeSize;
}
if (layoutModeToggle) {
  layoutModeToggle.checked = layoutMode;
}
syncViewModeControls();
if (layoutPanel) {
  layoutPanel.hidden = !layoutMode;
}
syncFeatureModeControls();
syncSpellingModeControls();
if (showHzToggle) {
  showHzToggle.checked = showHz;
}
if (showCentsSignToggle) {
  showCentsSignToggle.checked = showCentsSign;
}
if (hejiEnabledToggle) {
  hejiEnabledToggle.checked = hejiEnabled;
}
if (enharmonicsEnabledToggle) {
  enharmonicsEnabledToggle.checked = enharmonicsEnabled;
}
if (navCirclesToggle) {
  navCirclesToggle.checked = showCircles;
}
syncCentsPrecisionControls();
syncLayoutScaleInput();
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
if (mode3dCheckbox && !viewModeInputs.length && !viewModeButtons.length) {
  mode3dCheckbox.addEventListener("change", () => {
    if (layoutMode) {
      mode3dCheckbox.checked = false;
      return;
    }
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
if (navCirclesToggle) {
  navCirclesToggle.addEventListener("change", () => {
    showCircles = navCirclesToggle.checked;
    draw();
    schedulePresetUrlUpdate();
  });
}
if (viewPanelToggle) {
  viewPanelToggle.addEventListener("click", () => {
    const isCollapsed = viewsPanel && viewsPanel.classList.contains("is-collapsed");
    setViewsCollapsed(!isCollapsed);
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
if (layoutModeToggle && !viewModeInputs.length && !viewModeButtons.length) {
  layoutModeToggle.addEventListener("change", () => {
    setLayoutMode(layoutModeToggle.checked);
    schedulePresetUrlUpdate();
  });
}
if (viewModeInputs.length) {
  viewModeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) {
        return;
      }
      const nextMode = input.value;
      uiHintKey = "";
      uiHintDismissed = false;
      if (nextMode === "layout") {
        setLayoutMode(true);
      } else {
        if (layoutMode) {
          setLayoutMode(false);
        }
        set3DMode(nextMode === "3d");
      }
      schedulePresetUrlUpdate();
    });
  });
}
if (viewModeButtons.length) {
  viewModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.viewMode;
      if (!nextMode) {
        return;
      }
      uiHintKey = "";
      uiHintDismissed = false;
      if (nextMode === "layout") {
        setLayoutMode(true);
      } else {
        if (layoutMode) {
          setLayoutMode(false);
        }
        set3DMode(nextMode === "3d");
      }
      schedulePresetUrlUpdate();
    });
  });
}
if (featureModeButtons.length) {
  featureModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.featureMode;
      if (!nextMode) {
        return;
      }
      featureMode = nextMode === "note" ? "note" : "ratio";
      syncFeatureModeControls();
      invalidateLabelCache();
      draw();
      schedulePresetUrlUpdate();
    });
  });
}
if (spellingModeButtons.length) {
  spellingModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.spellingMode;
      if (!nextMode) {
        return;
      }
      spellingMode = nextMode === "true" ? "true" : "simple";
      spellingHintActive = true;
      syncSpellingModeControls();
      updateUiHint();
      if (spellingMode !== "true") {
        hideFundamentalSpellingDialog();
      } else if (fundamentalNoteSelect) {
        showFundamentalSpellingDialog(Number(fundamentalNoteSelect.value));
      }
      invalidateLabelCache();
      draw();
      schedulePresetUrlUpdate();
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
if (showHzToggle) {
  showHzToggle.addEventListener("change", () => {
    showHz = showHzToggle.checked;
    invalidateLabelCache();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (showCentsSignToggle) {
  showCentsSignToggle.addEventListener("change", () => {
    showCentsSign = showCentsSignToggle.checked;
    invalidateLabelCache();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (hejiEnabledToggle) {
  hejiEnabledToggle.addEventListener("change", () => {
    hejiEnabled = hejiEnabledToggle.checked;
    invalidateLabelCache();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (enharmonicsEnabledToggle) {
  enharmonicsEnabledToggle.addEventListener("change", () => {
    enharmonicsEnabled = enharmonicsEnabledToggle.checked;
    invalidateLabelCache();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (showHelpToggle) {
  showHelpToggle.checked = showHelpEnabled;
  showHelpToggle.addEventListener("change", () => {
    showHelpEnabled = showHelpToggle.checked;
    if (!showHelpEnabled) {
      if (uiHint) {
        uiHint.hidden = true;
      }
      return;
    }
    uiHintDismissed = false;
    updateUiHint();
  });
}
if (centsPrecisionButtons.length) {
  centsPrecisionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = Number(button.dataset.centsPrecision);
      if (!Number.isFinite(next)) {
        return;
      }
      centsPrecision = Math.min(2, Math.max(0, Math.round(next)));
      syncCentsPrecisionControls();
      invalidateLabelCache();
      draw();
      schedulePresetUrlUpdate();
    });
  });
}
if (layoutExitButton) {
  layoutExitButton.addEventListener("click", () => {
    if (layoutModeToggle) {
      layoutModeToggle.checked = false;
    }
    setLayoutMode(false);
    schedulePresetUrlUpdate();
  });
}
if (layoutTitleInput) {
  layoutTitleInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutTitle = layoutTitleInput.value.trim();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutCreatorInput) {
  layoutCreatorInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutCreator = layoutCreatorInput.value.trim();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutTitleSizeInput) {
  layoutTitleSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    setLayoutTitleSize(Number(layoutTitleSizeInput.value));
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutCreatorSizeInput) {
  layoutCreatorSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    setLayoutCreatorSize(Number(layoutCreatorSizeInput.value));
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutPageSizeSelect) {
  layoutPageSizeSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutPageSize = layoutPageSizeSelect.value || "letter";
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutOrientationSelect) {
  layoutOrientationSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutOrientation = layoutOrientationSelect.value || "portrait";
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutScaleInput) {
  layoutScaleInput.addEventListener("input", () => {
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
}
if (layoutLockPositionToggle) {
  layoutLockPositionToggle.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutLockPosition = layoutLockPositionToggle.checked;
    if (layoutLockPosition) {
      syncLayoutViewFromCurrent();
    } else {
      if (layoutMode && layoutPrevState) {
        view.zoom = layoutPrevState.zoom;
        view.offsetX = layoutPrevState.offsetX;
        view.offsetY = layoutPrevState.offsetY;
        view.rotX = layoutPrevState.rotX;
        view.rotY = layoutPrevState.rotY;
        syncLayoutScaleInput();
        markIsomorphicDirty();
        draw();
      }
      layoutView = {
        zoom: view.zoom,
        offsetX: view.offsetX,
        offsetY: view.offsetY,
        rotX: view.rotX,
        rotY: view.rotY,
      };
    }
    schedulePresetUrlUpdate();
  });
}
if (layoutNodeSizeInput) {
  layoutNodeSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutNodeSize = Number(layoutNodeSizeInput.value) || layoutNodeSize;
    updateLayoutNodeSizeReadout();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutRatioTextSizeInput) {
  layoutRatioTextSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutRatioTextSize = Number(layoutRatioTextSizeInput.value) || layoutRatioTextSize;
    updateLayoutRatioTextReadout();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutNoteTextSizeInput) {
  layoutNoteTextSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutNoteTextSize = Number(layoutNoteTextSizeInput.value) || layoutNoteTextSize;
    updateLayoutNoteTextReadout();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutTriangleLabelSizeInput) {
  layoutTriangleLabelSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutTriangleLabelTextSize =
      Number(layoutTriangleLabelSizeInput.value) || layoutTriangleLabelTextSize;
    updateLayoutTriangleLabelReadout();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutCustomLabelSizeInput) {
  layoutCustomLabelSizeInput.addEventListener("input", () => {
    pushLayoutUndoState();
    setLayoutCustomLabelSize(Number(layoutCustomLabelSizeInput.value));
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutTitleMarginInput) {
  layoutTitleMarginInput.addEventListener("input", () => {
    pushLayoutUndoState();
    layoutTitleMargin = Number(layoutTitleMarginInput.value) || layoutTitleMargin;
    updateLayoutTitleMarginReadout();
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutNodeShapeSelect) {
  layoutNodeShapeSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    const nextShape = layoutNodeShapeSelect.value;
    layoutNodeShape = nextShape || "circle";
    draw();
    schedulePresetUrlUpdate();
  });
}
let layoutFontSnapshot = null;
if (layoutFontsButton && layoutFontDialog) {
  layoutFontsButton.addEventListener("click", () => {
    if (typeof layoutFontDialog.showModal === "function") {
      layoutFontSnapshot = {
        title: layoutTitleFont,
        ratio: layoutRatioFont,
        note: layoutNoteFont,
        triangleLabel: layoutTriangleLabelFont,
        customLabel: layoutCustomLabelFont,
      };
      layoutFontDialog.showModal();
    }
  });
}
if (layoutPanelToggle) {
  layoutPanelToggle.addEventListener("click", () => {
    const isCollapsed = layoutPanel && layoutPanel.classList.contains("is-collapsed");
    setLayoutPanelCollapsed(!isCollapsed);
  });
}
  if (layoutFontDialog) {
  layoutFontDialog.addEventListener("close", () => {
    if (layoutFontDialog.returnValue === "cancel" && layoutFontSnapshot) {
      layoutTitleFont = layoutFontSnapshot.title;
      layoutRatioFont = layoutFontSnapshot.ratio;
      layoutNoteFont = layoutFontSnapshot.note;
      layoutTriangleLabelFont = layoutFontSnapshot.triangleLabel;
      layoutCustomLabelFont = layoutFontSnapshot.customLabel;
      if (layoutTitleFontSelect) {
        layoutTitleFontSelect.value = layoutTitleFont;
      }
      if (layoutRatioFontSelect) {
        layoutRatioFontSelect.value = layoutRatioFont;
      }
      if (layoutNoteFontSelect) {
        layoutNoteFontSelect.value = layoutNoteFont;
      }
      if (layoutTriangleLabelFontSelect) {
        layoutTriangleLabelFontSelect.value = layoutTriangleLabelFont;
      }
      if (layoutCustomFontSelect) {
        layoutCustomFontSelect.value = layoutCustomLabelFont;
      }
    }
    layoutFontSnapshot = null;
    syncLayoutFontVars();
    invalidateLabelCache({ clearTextWidths: true });
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutTitleFontSelect) {
  layoutTitleFontSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutTitleFont = layoutTitleFontSelect.value || layoutTitleFont;
    syncLayoutFontVars();
    invalidateLabelCache({ clearTextWidths: true });
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutRatioFontSelect) {
  layoutRatioFontSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutRatioFont = layoutRatioFontSelect.value || layoutRatioFont;
    syncLayoutFontVars();
    invalidateLabelCache({ clearTextWidths: true });
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutNoteFontSelect) {
  layoutNoteFontSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutNoteFont = layoutNoteFontSelect.value || layoutNoteFont;
    syncLayoutFontVars();
    invalidateLabelCache({ clearTextWidths: true });
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutCustomFontSelect) {
  layoutCustomFontSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutCustomLabelFont = layoutCustomFontSelect.value || layoutCustomLabelFont;
    syncLayoutFontVars();
    invalidateLabelCache({ clearTextWidths: true });
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutTriangleLabelFontSelect) {
  layoutTriangleLabelFontSelect.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutTriangleLabelFont = layoutTriangleLabelFontSelect.value || layoutTriangleLabelFont;
    syncLayoutFontVars();
    invalidateLabelCache({ clearTextWidths: true });
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutUnifySizeToggle) {
  layoutUnifySizeToggle.addEventListener("change", () => {
    pushLayoutUndoState();
    layoutUnifyNodeSize = layoutUnifySizeToggle.checked;
    layoutAxisAngles = { x: null, y: null, z: null };
    draw();
    schedulePresetUrlUpdate();
  });
}
if (layoutResetButton) {
  layoutResetButton.addEventListener("click", () => {
    pushLayoutUndoState();
    resetLayoutState();
    schedulePresetUrlUpdate();
  });
}
if (exportSvgButton) {
  exportSvgButton.addEventListener("click", exportLayoutSvg);
}
if (exportPdfButton) {
  exportPdfButton.addEventListener("click", exportLayoutPdf);
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
    uiHintDismissed = true;
    uiHint.hidden = true;
  });
}
fundamentalInput.addEventListener("input", () => {
  syncFundamentalNoteSelect();
  updateNodeFrequencies();
});
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
keyboardModeSelect.addEventListener("change", () => {
  if (keyboardModeSelect.value === "off") {
    resetUiHintToDefault();
  }
  if (keyboardModeSelect.value === "piano") {
    showKeyboardModeHelp("2 octave layout with C mapped to Z and Y");
  }
  updateUiHint();
});
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
  oneShotCheckbox.addEventListener("change", () => {
    updatePatternLengthAvailability();
    schedulePresetUrlUpdate();
  });
}
if (envelopeTimeModeInputs.length) {
  envelopeTimeModeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const selected = document.querySelector('input[name="envelope-time"]:checked');
      envelopeTimeMode = selected ? selected.value : "absolute";
      updateEnvelopeReadouts();
      schedulePresetUrlUpdate();
    });
  });
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
    randomizeLfosForActiveNodes();
    lfoPresetPlaying = true;
    updateLfoPlayButton();
  });
}
if (lfoStopButton) {
  lfoStopButton.addEventListener("click", () => {
    scheduleLfoStopsAtCycleEnd();
  });
}
if (addCustomRatioButton) {
  addCustomRatioButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openCustomRatioDialog();
  });
}
if (customRatioDialog) {
  customRatioDialog.addEventListener("close", handleCustomRatioDialogClose);
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
updateEnvelopeReadouts();
updateLfoDepth();
updateTempoReadout();
updatePatternLengthReadout();
updatePatternLengthAvailability();
initTheme();
updateLooperButton();
updateScoreButton();
updateLfoPlayButton();
buildPatternStates();
populateMidiChannels();
loadPresets();
if (document.fonts && document.fonts.load) {
  document.fonts
    .load('16px "HEJI2Text"', "v")
    .then(() => {
      draw();
    })
    .catch(() => {});
}
if (triangleLabelDialog && triangleLabelInput) {
  triangleLabelInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    const value = triangleLabelInput.value.trim();
    triangleLabelDialog.close(value ? "ok" : "none");
  });
}
if (layoutCustomLabelDialog && layoutCustomLabelInput) {
  layoutCustomLabelInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    layoutCustomLabelDialog.close("confirm");
  });
  layoutCustomLabelDialog.addEventListener("click", (event) => {
    if (event.target === layoutCustomLabelDialog) {
      layoutCustomLabelDialog.close("confirm");
    }
  });
  layoutCustomLabelDialog.addEventListener("close", () => {
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
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointerleave", onPointerLeave);
canvas.addEventListener("dblclick", onCanvasDoubleClick);
canvas.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", resizeCanvas);
window.addEventListener("resize", updateRatioWheelPosition);
window.addEventListener("pointerdown", enableAudioFromGesture);
window.addEventListener("keydown", enableAudioFromGesture);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey) {
    return;
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
  if (triangleLabelDialog) {
    triangleLabelDialog.addEventListener("close", () => {
      if (!triangleLabelTargetKey || !triangleLabelTargetTri) {
        return;
      }
      const result = triangleLabelDialog.returnValue;
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
  if (event.key.toLowerCase() === "r") {
    rHeld = true;
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
    if (layoutAxisEdit) {
      layoutAxisEdit = null;
      layoutAxisEditDrag = null;
      updateUiHint();
      draw();
      return;
    }
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
  if (event.key.toLowerCase() === "r") {
    rHeld = false;
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
  if (event.key.toLowerCase() === "z") {
    zKeyHeld = false;
  }
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
