import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVoiceBackends } from "../src/audio/voice-backends.js";

function fakeContext() {
  return {
    currentTime: 1.5,
    createOscillator: () => ({ node: "oscillator", type: "sine", frequency: { value: 0 } }),
    createGain: () => ({ node: "gain" }),
    createBuffer() {},
    createBufferSource() {},
    createStereoPanner() {},
  };
}

function setup(overrides = {}) {
  const ctx = fakeContext();
  const state = { ready: true, tables: null, sf: { data: null, preset: null } };
  const warnings = [];
  const ensured = [];
  const backends = createVoiceBackends({
    audioContext: () => ctx,
    worklets: {
      plucked: {
        processor: "karplus-strong",
        ensure: () => ensured.push("plucked"),
        ready: () => state.ready,
        parameters: { damping: 0.985 },
      },
    },
    soundfontWaveform: "soundfont",
    soundfont: () => state.sf,
    startPresetNote: vi.fn(() => "stop-fn"),
    referenceA4: () => 440,
    isWavetable: (type) => type === "organ",
    wavetables: () => state.tables,
    ensureWavetables: () => ensured.push("wavetables"),
    warnFallback: (type) => warnings.push(type),
    ...overrides,
  });
  return { backends, ctx, state, warnings, ensured };
}

describe("voice backends", () => {
  let created;
  beforeEach(() => {
    created = [];
    globalThis.AudioWorkletNode = class {
      constructor(ctx, name, options) {
        this.name = name;
        this.options = options;
        this.port = { postMessage: (message) => created.push(message) };
      }
    };
  });
  afterEach(() => {
    delete globalThis.AudioWorkletNode;
  });

  it("routes each waveform to its backend", () => {
    const { backends } = setup();
    expect(backends.backendFor("plucked")).toBe("worklet");
    expect(backends.backendFor("soundfont")).toBe("soundfont");
    expect(backends.backendFor("organ")).toBe("wavetable");
    expect(backends.backendFor("sawtooth")).toBe("native");
  });

  it("native oscillators take the waveform as their type", () => {
    const { backends } = setup();
    const { source, kind } = backends.createSource("sawtooth", 330);
    expect(kind).toBe("oscillator");
    expect(source.type).toBe("sawtooth");
  });

  it("builds and triggers a worklet with the model's parameters", () => {
    const { backends, ensured } = setup();
    const { source, kind } = backends.createSource("plucked", Number.NaN);
    expect(kind).toBe("worklet");
    expect(source.name).toBe("karplus-strong");
    expect(source.options.parameterData).toEqual({ frequency: 220, damping: 0.985 });
    expect(created).toEqual([{ type: "trigger" }]);
    expect(ensured).toEqual(["plucked"]);
  });

  it("falls back to a sine oscillator (ended as one) while a worklet loads", () => {
    const { backends, state, warnings } = setup();
    state.ready = false;
    const { source, kind } = backends.createSource("plucked", 220);
    expect(kind).toBe("oscillator");
    expect(source.type).toBe("sine");
    expect(warnings).toEqual(["plucked"]);
  });

  it("falls back to sine and asks for the wavetables when they are missing", () => {
    const { backends, state, warnings, ensured } = setup();
    expect(backends.createSource("organ", 220).kind).toBe("oscillator");
    expect(ensured).toEqual(["wavetables"]);
    expect(warnings).toEqual(["organ"]);
    state.tables = { organ: () => ({ node: "wavetable" }) };
    expect(backends.createSource("organ", 220).source).toEqual({ node: "wavetable" });
  });

  it("plays soundfont notes at the MIDI pitch for the reference A4", () => {
    const startPresetNote = vi.fn(() => "stop-fn");
    const { backends, state } = setup({ startPresetNote });
    expect(backends.createSource("soundfont", 440).kind).toBe("oscillator");
    state.sf = { data: {}, preset: { name: "strings" } };
    const { source, kind } = backends.createSource("soundfont", 880);
    expect(kind).toBe("soundfont");
    expect(source.sfStop).toBe("stop-fn");
    expect(source.sfOutput).toEqual({ node: "gain" });
    const [sfCtx, preset, midi, when] = startPresetNote.mock.calls[0];
    expect(sfCtx.destination).toBe(source.sfOutput);
    expect(preset).toEqual({ name: "strings" });
    expect(midi).toBe(81);
    expect(when).toBe(1.5);
  });
});
