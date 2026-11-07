// Voice backends (audit Phase 4.4): how one note's sound source is made.
//
// startVoice in main.js used to be a conditional ladder over four synthesis
// paths. Each path is now a backend; startVoice asks for a source and wires
// the shared envelope / LFO / morph gain chain after it. A backend returns
// { source, kind }, where `kind` says how the source must be ended — it is
// the kind of source actually made, so a fallback is ended like what it is:
//
//   "oscillator"  OscillatorNode (native or wavetable): stop() + onended
//   "worklet"     AudioWorkletNode (physical models): no stop(); told to
//                 retire through its port, then disconnected
//   "soundfont"   sample voice: a stand-in object carrying sfStop(when) and
//                 sfOutput (a GainNode the samples play into)
//
// Every backend falls back to a plain sine oscillator when its resources
// aren't ready (worklet module still loading, wavetables or soundfont not
// fetched yet).

const FALLBACK_FREQUENCY = 220;

/**
 * @param {object} env
 * @param {() => AudioContext} env.audioContext
 * @param {Record<string, {processor: string, ensure: () => void, ready: () => boolean,
 *   parameters: object}>} env.worklets  physical models by waveform name
 * @param {string} env.soundfontWaveform
 * @param {() => ({data: unknown, preset: unknown})} env.soundfont
 * @param {(ctx: object, preset: unknown, midi: number, when: number) => (when: number) => void}
 *   env.startPresetNote
 * @param {() => number} env.referenceA4
 * @param {(type: string) => boolean} env.isWavetable
 * @param {() => (Record<string, (ctx: AudioContext) => OscillatorNode> | null)} env.wavetables
 * @param {() => void} env.ensureWavetables
 * @param {(type: string) => void} env.warnFallback  called when a worklet or wavetable isn't ready
 */
export function createVoiceBackends(env) {
  const sine = (ctx) => ({ source: ctx.createOscillator(), kind: "oscillator" });
  const safeFrequency = (freq) => (Number.isFinite(freq) ? freq : FALLBACK_FREQUENCY);

  const backends = [
    {
      id: "worklet",
      matches: (type) => Object.prototype.hasOwnProperty.call(env.worklets, type),
      create(ctx, type, freq) {
        const model = env.worklets[type];
        model.ensure();
        if (!model.ready()) {
          env.warnFallback(type);
          return sine(ctx);
        }
        try {
          const source = new AudioWorkletNode(ctx, model.processor, {
            numberOfOutputs: 1,
            outputChannelCount: [1],
            parameterData: { frequency: safeFrequency(freq), ...model.parameters },
          });
          if (source.port) {
            source.port.postMessage({ type: "trigger" });
          }
          return { source, kind: "worklet" };
        } catch {
          return sine(ctx);
        }
      },
    },
    {
      id: "soundfont",
      matches: (type) => type === env.soundfontWaveform,
      create(ctx, _type, freq) {
        const { data, preset } = env.soundfont();
        if (!data || !preset) {
          return sine(ctx);
        }
        // The samples play into sfOutput, which startVoice feeds through the
        // envelope chain so ADSR/LFO apply downstream.
        const sfOutput = ctx.createGain();
        const sfCtx = {
          currentTime: ctx.currentTime,
          destination: sfOutput,
          createGain: ctx.createGain.bind(ctx),
          createBuffer: ctx.createBuffer.bind(ctx),
          createBufferSource: ctx.createBufferSource.bind(ctx),
          createStereoPanner: ctx.createStereoPanner.bind(ctx),
        };
        const midi = 69 + 12 * Math.log2(safeFrequency(freq) / env.referenceA4());
        const sfStop = env.startPresetNote(sfCtx, preset, midi, ctx.currentTime);
        const source = {
          type: "soundfont",
          start: () => {},
          stop: () => {},
          disconnect: () => {},
          port: null,
          sfStop,
          sfOutput,
        };
        return { source, kind: "soundfont" };
      },
    },
    {
      id: "wavetable",
      matches: (type) => env.isWavetable(type),
      create(ctx, type) {
        const tables = env.wavetables();
        if (tables && typeof tables[type] === "function") {
          return { source: tables[type](ctx), kind: "oscillator" };
        }
        env.ensureWavetables();
        env.warnFallback(type);
        return sine(ctx);
      },
    },
    {
      id: "native",
      matches: () => true,
      create(ctx, type) {
        const source = ctx.createOscillator();
        source.type = type;
        return { source, kind: "oscillator" };
      },
    },
  ];

  return {
    /** Make the sound source for one note of `type` at `freq` Hz. */
    createSource(type, freq) {
      const backend = backends.find((candidate) => candidate.matches(type));
      return backend.create(env.audioContext(), type, freq);
    },
    /** Which backend handles `type` (for tests and diagnostics). */
    backendFor(type) {
      return backends.find((candidate) => candidate.matches(type)).id;
    },
  };
}
