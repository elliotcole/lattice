import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { encodePresetState, decodePresetState } from "../src/serialization.js";

const ROOT = join(import.meta.dirname, "..");

function jsonFixtures(dir) {
  return readdirSync(join(ROOT, dir))
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({ name, state: JSON.parse(readFileSync(join(ROOT, dir, name), "utf8")) }));
}

// The compatibility contract: every saved file, deck diagram, and preset URI
// must survive encode → decode without loss, forever. A failure here means a
// serialization change broke old saved work.

describe("Creator export fixtures round-trip", () => {
  for (const { name, state } of jsonFixtures("fixtures/creator-exports")) {
    it(name, () => {
      const encoded = encodePresetState(state);
      expect(typeof encoded).toBe("string");
      expect(encoded.length).toBeGreaterThan(0);
      const decoded = decodePresetState(encoded);
      expect(decoded).toEqual(state);
      // second pass: re-encoding the decoded state is stable
      expect(decodePresetState(encodePresetState(decoded))).toEqual(state);
    });
  }
});

describe("Tuning the Ear deck diagrams round-trip", () => {
  for (const { name, state } of jsonFixtures("src/tuning-the-ear/diagrams")) {
    it(name, () => {
      const decoded = decodePresetState(encodePresetState(state));
      expect(decoded).toEqual(state);
    });
  }
});

describe("Snapshot-set fixtures round-trip", () => {
  for (const { name, state } of jsonFixtures("fixtures/snapshot-sets")) {
    it(name, () => {
      const decoded = decodePresetState(encodePresetState(state));
      expect(decoded).toEqual(state);
    });
  }
});

describe("Preset library URIs decode and round-trip", () => {
  const presets = JSON.parse(readFileSync(join(ROOT, "src/presets.json"), "utf8"));
  it("library is non-empty", () => {
    expect(presets.length).toBeGreaterThan(0);
  });
  for (const preset of presets) {
    it(preset.title, () => {
      expect(preset.uri.startsWith("#s=")).toBe(true);
      const encoded = preset.uri.slice("#s=".length);
      const state = decodePresetState(encoded);
      expect(state).toBeTruthy();
      expect(typeof state).toBe("object");
      // the canonical URIs must keep decoding to the same state after re-encode
      expect(decodePresetState(encodePresetState(state))).toEqual(state);
    });
  }
});

describe("codec edge cases", () => {
  it("decode(null/garbage) returns null rather than throwing", () => {
    expect(decodePresetState(null)).toBeNull();
    expect(decodePresetState(undefined)).toBeNull();
    expect(decodePresetState("lz:")).toBeNull();
  });
  it("unicode survives (HEJI accidentals, note names)", () => {
    const state = { label: "C♯ ↑ 𝄪 ♭ — π≈3.14159", nested: { arr: ["é", "𝅘𝅥𝅮"] } };
    expect(decodePresetState(encodePresetState(state))).toEqual(state);
  });
  it("URL-unsafe characters never appear in encoded output", () => {
    const fixtures = jsonFixtures("fixtures/creator-exports");
    for (const { state: s } of fixtures) {
      const encoded = encodePresetState(s);
      expect(encoded).toMatch(/^lz:[A-Za-z0-9.$-]+$|^[A-Za-z0-9_-]+$/);
    }
  });
  it("legacy base64 format still decodes", () => {
    const state = { v: 1, hello: "world" };
    const json = JSON.stringify(state);
    const b64 = Buffer.from(json, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
    expect(decodePresetState(b64)).toEqual(state);
  });
});
