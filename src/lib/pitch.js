// Shared pitch core — ratio math, ET mapping, true-spelling, HEJI annotation.
// Pure functions and data tables, no DOM, no app state. Imported by the main
// editor, the tuner, and the overtones explorer (Phase 2 of the staged
// rebuild — this module ends the copy-paste drift in the foundational math).
//
// Drift resolutions (June 2026), made explicit here so they stay decisions:
// 1. gcd/reduceFraction: the defensive variant (overtones lineage) is
//    canonical — inputs rounded to integers, zero → 0/1, sign normalized onto
//    the numerator. For the positive-integer inputs all three apps actually
//    pass, every historical variant produced identical results.
// 2. getNearestEtInfo: spelling table is a parameter (default sharp). The
//    main editor passes its mixed default table; tuner/overtones use sharps.
//    The invalid-input guard (overtones lineage) returns null instead of NaN.
// 3. getHejiAnnotationForAxisRatios: the tuner/src semantics are canonical —
//    replaceAccidental preserves sharps alongside double-sharps and flats
//    beyond a double-flat (keepSharps/keepFlats). Overtones' blanket-removal
//    copy was stale and is superseded.

export const noteNamesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const noteNamesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
export const noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
export const LETTER_TO_SEMITONE = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const TRUE_SPELLING_INTERVALS = {
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

export const HEJI_RULES = [
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

// ---- Ratio math ----

export function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

export function floorDiv(value, divisor) {
  return Math.floor(value / divisor);
}

export function gcd(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

export function reduceFraction(numerator, denominator) {
  const num = Math.round(Number(numerator) || 0);
  const den = Math.round(Number(denominator) || 0);
  if (den === 0) {
    return { numerator: 0, denominator: 1 };
  }
  if (num === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const sign = den < 0 ? -1 : 1;
  const g = gcd(num, den);
  return {
    numerator: (num / g) * sign,
    denominator: Math.abs(den / g),
  };
}

export function parseRatioInput(value) {
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

export function normalizeRatioToOctave(numerator, denominator) {
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

// ---- ET mapping ----

export function midiToFrequency(midi, a4) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

export function getNearestEtInfo(freq, a4, names = noteNamesSharp) {
  if (!(freq > 0) || !(a4 > 0)) {
    return null;
  }
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midi = Math.min(127, Math.max(0, Math.round(midiFloat)));
  const etFreq = a4 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / etFreq);
  const pitchClass = names[mod(midi, 12)];
  const name = `${pitchClass}${Math.floor(midi / 12) - 1}`;
  return { midi, etFreq, cents, name, pitchClass };
}

// ---- Pitch-class spelling ----

export function parsePitchClass(pitchClass) {
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

export function accidentalToString(accidental) {
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

export function buildPitchClass(letterIndex, accidental) {
  const letter = LETTERS[mod(letterIndex, LETTERS.length)];
  const clamped = Math.max(-3, Math.min(3, accidental));
  return `${letter}${accidentalToString(clamped)}`;
}

export function getPitchClassSemitoneValue(pitchClass) {
  const parsed = parsePitchClass(pitchClass);
  const letterIndex = Number.isFinite(parsed.letterIndex) ? mod(parsed.letterIndex, 7) : 0;
  const accidental = Number.isFinite(parsed.accidental) ? parsed.accidental : 0;
  const natural = LETTER_TO_SEMITONE[LETTERS[letterIndex]];
  return natural + accidental;
}

// ---- True spelling ----

export function analyzeRatioForTrueSpelling(numerator, denominator) {
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

const trueSpellingLimitCache = new Map();

export function getTrueSpellingLimit(ratio) {
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

// ---- HEJI annotation ----

export function hasAccidental(noteName) {
  return /[#b]/.test(noteName);
}

export function getAccidentalType(noteName) {
  if (/[#x]/.test(noteName)) return "sharp";
  if (/b/.test(noteName)) return "flat";
  return "none";
}

export function axisMatches(rule, axisState) {
  if (rule.axis !== "any" && rule.axis !== axisState.axis) return false;
  if (!Number.isFinite(axisState.exponent)) return false;
  if (Number.isFinite(rule.ratio) && axisState.ratio !== rule.ratio) return false;
  if (
    rule.mode === "repeat" ||
    rule.mode === "repeatBase" ||
    rule.mode === "repeatBaseAccidental"
  ) {
    return axisState.exponent !== 0;
  }
  if (rule.exponent === "anyNonZero" && axisState.exponent === 0) return false;
  if (Number.isFinite(rule.exponent) && axisState.exponent !== rule.exponent) return false;
  return true;
}

export function getHejiAnnotationForAxisRatios(axisRatios, baseText) {
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
        const pairGlyph =
          exp > 0 ? rule.posPair?.[accidentalKey] || "" : rule.negPair?.[accidentalKey] || "";
        const singleGlyph =
          exp > 0 ? rule.posSingle?.[accidentalKey] || "" : rule.negSingle?.[accidentalKey] || "";
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
