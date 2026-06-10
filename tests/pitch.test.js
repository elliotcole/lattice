import { describe, it, expect } from "vitest";
import {
  noteNames,
  noteNamesSharp,
  noteNamesFlat,
  mod,
  floorDiv,
  gcd,
  reduceFraction,
  parseRatioInput,
  normalizeRatioToOctave,
  midiToFrequency,
  getNearestEtInfo,
  parsePitchClass,
  buildPitchClass,
  accidentalToString,
  getPitchClassSemitoneValue,
  analyzeRatioForTrueSpelling,
  getTrueSpellingLimit,
  getAccidentalType,
  getHejiAnnotationForAxisRatios,
} from "../src/lib/pitch.js";

describe("ratio math", () => {
  it("gcd on positive integers", () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(81, 80)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(0, 0)).toBe(1);
  });

  it("reduceFraction reduces exactly", () => {
    expect(reduceFraction(6, 4)).toEqual({ numerator: 3, denominator: 2 });
    expect(reduceFraction(81, 80)).toEqual({ numerator: 81, denominator: 80 });
    expect(reduceFraction(10, 5)).toEqual({ numerator: 2, denominator: 1 });
  });

  it("reduceFraction drift decision: defensive semantics are canonical", () => {
    // zero and negative handling per the overtones lineage (superset of the
    // tuner/src variants, identical for the positive integers apps pass)
    expect(reduceFraction(0, 7)).toEqual({ numerator: 0, denominator: 1 });
    expect(reduceFraction(3, 0)).toEqual({ numerator: 0, denominator: 1 });
    expect(reduceFraction(3, -2)).toEqual({ numerator: -3, denominator: 2 });
    expect(reduceFraction(-3, 2)).toEqual({ numerator: -3, denominator: 2 });
  });

  it("reduceFraction is a fixpoint (property)", () => {
    for (let n = 1; n < 60; n++) {
      for (let d = 1; d < 60; d++) {
        const r = reduceFraction(n, d);
        expect(reduceFraction(r.numerator, r.denominator)).toEqual(r);
        expect(gcd(r.numerator, r.denominator)).toBe(1);
        // value preserved
        expect(r.numerator / r.denominator).toBeCloseTo(n / d, 12);
      }
    }
  });

  it("normalizeRatioToOctave lands in [1, 2] and tracks the shift", () => {
    expect(normalizeRatioToOctave(3, 1)).toEqual({ numerator: 3, denominator: 2, shift: 1 });
    expect(normalizeRatioToOctave(1, 3)).toEqual({ numerator: 4, denominator: 3, shift: -2 });
    expect(normalizeRatioToOctave(1, 0)).toBeNull();
    for (let n = 1; n < 50; n++) {
      for (let d = 1; d < 50; d++) {
        const r = normalizeRatioToOctave(n, d);
        const v = r.numerator / r.denominator;
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(2);
        expect(v * Math.pow(2, r.shift)).toBeCloseTo(n / d, 9);
      }
    }
  });

  it("parseRatioInput accepts slash, colon, integer; rejects garbage", () => {
    expect(parseRatioInput("3/2")).toEqual({ numerator: 3, denominator: 2 });
    expect(parseRatioInput("5:4")).toEqual({ numerator: 5, denominator: 4 });
    expect(parseRatioInput(" 7 / 4 ")).toEqual({ numerator: 7, denominator: 4 });
    expect(parseRatioInput("16")).toEqual({ numerator: 16, denominator: 1 });
    expect(parseRatioInput("0/5")).toBeNull();
    expect(parseRatioInput("-3/2")).toBeNull();
    expect(parseRatioInput("x")).toBeNull();
    expect(parseRatioInput("")).toBeNull();
  });
});

describe("ET mapping", () => {
  it("midiToFrequency at reference points", () => {
    expect(midiToFrequency(69, 440)).toBe(440);
    expect(midiToFrequency(60, 440)).toBeCloseTo(261.6256, 3);
  });

  it("getNearestEtInfo drift decision: spelling table is a parameter", () => {
    // 466.16 Hz is A#4/Bb4
    const sharp = getNearestEtInfo(466.16, 440);
    expect(sharp.pitchClass).toBe("A#"); // default = sharp table (tuner/overtones)
    const mixed = getNearestEtInfo(466.16, 440, noteNames);
    expect(mixed.pitchClass).toBe("Bb"); // main editor's mixed default
    const flat = getNearestEtInfo(466.16, 440, noteNamesFlat);
    expect(flat.pitchClass).toBe("Bb");
    expect(sharp.midi).toBe(70);
    expect(sharp.name).toBe("A#4");
    expect(Math.abs(sharp.cents)).toBeLessThan(2);
  });

  it("getNearestEtInfo guards invalid input with null", () => {
    expect(getNearestEtInfo(0, 440)).toBeNull();
    expect(getNearestEtInfo(-5, 440)).toBeNull();
    expect(getNearestEtInfo(440, 0)).toBeNull();
    expect(getNearestEtInfo(NaN, 440)).toBeNull();
  });
});

describe("pitch-class spelling", () => {
  it("parse/build round-trip", () => {
    for (const pc of ["C", "C#", "Db", "Fx", "G#", "Ab", "Bbb", "E"]) {
      const parsed = parsePitchClass(pc);
      expect(buildPitchClass(parsed.letterIndex, parsed.accidental)).toBe(pc);
    }
  });

  it("accidentalToString", () => {
    expect(accidentalToString(0)).toBe("");
    expect(accidentalToString(1)).toBe("#");
    expect(accidentalToString(2)).toBe("x");
    expect(accidentalToString(-1)).toBe("b");
    expect(accidentalToString(-2)).toBe("bb");
  });

  it("semitone values", () => {
    expect(getPitchClassSemitoneValue("C")).toBe(0);
    expect(getPitchClassSemitoneValue("C#")).toBe(1);
    expect(getPitchClassSemitoneValue("Bb")).toBe(10);
    expect(getPitchClassSemitoneValue("Fx")).toBe(7);
  });
});

describe("true spelling analysis", () => {
  it("factors classic JI ratios onto prime axes (ratio = ∏ primes^exp × 2^octaveShift)", () => {
    expect(analyzeRatioForTrueSpelling(3, 2)).toEqual({
      axisRatios: [{ ratio: 3, exp: 1 }],
      octaveShift: -1, // 3/2 = 3 × 2⁻¹
    });
    expect(analyzeRatioForTrueSpelling(5, 4)).toEqual({
      axisRatios: [{ ratio: 5, exp: 1 }],
      octaveShift: -2, // 5/4 = 5 × 2⁻²
    });
    expect(analyzeRatioForTrueSpelling(81, 80)).toEqual({
      axisRatios: [
        { ratio: 3, exp: 4 },
        { ratio: 5, exp: -1 },
      ],
      octaveShift: -4, // 81/80 = 3⁴ × 5⁻¹ × 2⁻⁴
    });
    expect(analyzeRatioForTrueSpelling(7, 4)).toEqual({
      axisRatios: [{ ratio: 7, exp: 1 }],
      octaveShift: -2, // 7/4 = 7 × 2⁻²
    });
  });

  it("returns null for non-analyzable ratios (primes beyond the table, unity)", () => {
    expect(analyzeRatioForTrueSpelling(53, 32)).toBeNull();
    expect(analyzeRatioForTrueSpelling(1, 1)).toBeNull();
    expect(analyzeRatioForTrueSpelling(2, 1)).toBeNull();
  });

  it("getTrueSpellingLimit honors explicit maxSteps and computes others", () => {
    expect(getTrueSpellingLimit(17)).toBe(2); // explicit in table
    expect(getTrueSpellingLimit(31)).toBe(4); // explicit in table
    expect(getTrueSpellingLimit(3)).toBeGreaterThan(0); // computed
    expect(getTrueSpellingLimit(2)).toBeNull(); // not a spelling axis
  });
});

describe("HEJI annotation", () => {
  it("5-limit comma marks from natural base", () => {
    const arfs = analyzeRatioForTrueSpelling(5, 4);
    const out = getHejiAnnotationForAxisRatios(arfs.axisRatios, "E");
    expect(out.baseText).toBe("E");
    expect(out.suffixParts).toEqual([{ text: "m", expLabel: "", source: "rule" }]);
  });

  it("syntonic comma (81/80) yields a single down-comma context", () => {
    const arfs = analyzeRatioForTrueSpelling(81, 80);
    const out = getHejiAnnotationForAxisRatios(arfs.axisRatios, "C");
    expect(out.suffixParts).toEqual([{ text: "o", expLabel: "", source: "rule" }]);
  });

  it("septimal marks", () => {
    const arfs = analyzeRatioForTrueSpelling(7, 4);
    const out = getHejiAnnotationForAxisRatios(arfs.axisRatios, "Bb");
    expect(out.baseText).toBe("B");
    expect(out.suffixParts.some((p) => p.text === "<")).toBe(true);
  });

  it("replaceAccidental swaps accidental glyphs into HEJI forms", () => {
    const arfs = analyzeRatioForTrueSpelling(5, 4);
    const out = getHejiAnnotationForAxisRatios(arfs.axisRatios, "C#");
    // sharp accidental absorbed into the 5-limit glyph ("u" = sharp-up)
    expect(out.suffixParts).toEqual([{ text: "u", expLabel: "", source: "rule" }]);
  });

  it("drift decision: preservation logic keeps marks beyond double accidentals", () => {
    // tuner/src semantics are canonical; overtones' blanket removal superseded.
    const arfs = analyzeRatioForTrueSpelling(1, 5);
    const out = getHejiAnnotationForAxisRatios(arfs.axisRatios, "Fx#");
    // the sharp beyond the double-sharp survives as a default "v" mark
    expect(out.suffixParts).toEqual([
      { text: "W", expLabel: "", source: "rule" },
      { text: "v", expLabel: "", source: "default" },
    ]);
  });

  it("rule parts order before default parts", () => {
    const arfs = analyzeRatioForTrueSpelling(7, 5);
    const out = getHejiAnnotationForAxisRatios(arfs.axisRatios, "C#");
    const sources = out.suffixParts.map((p) => p.source);
    expect(sources.indexOf("rule")).toBeLessThan(
      sources.includes("default") ? sources.indexOf("default") : sources.length,
    );
  });

  it("getAccidentalType", () => {
    expect(getAccidentalType("C#")).toBe("sharp");
    expect(getAccidentalType("Fx")).toBe("sharp");
    expect(getAccidentalType("Bb")).toBe("flat");
    expect(getAccidentalType("C")).toBe("none");
  });
});

describe("helpers", () => {
  it("mod and floorDiv handle negatives the mathematical way", () => {
    expect(mod(-1, 7)).toBe(6);
    expect(mod(8, 7)).toBe(1);
    expect(floorDiv(-1, 7)).toBe(-1);
    expect(floorDiv(8, 7)).toBe(1);
  });

  it("note tables agree at unambiguous pitch classes", () => {
    for (const i of [0, 2, 4, 5, 7, 9, 11]) {
      expect(noteNamesSharp[i]).toBe(noteNamesFlat[i]);
      expect(noteNames[i]).toBe(noteNamesSharp[i]);
    }
  });
});
