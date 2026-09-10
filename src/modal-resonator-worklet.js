class ModalResonatorProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "frequency",
        defaultValue: 220,
        minValue: 20,
        maxValue: 20000,
        automationRate: "k-rate",
      },
      {
        name: "brightness",
        defaultValue: 0.7,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }

  constructor() {
    super();
    this.active = true;
    // Set by a "stop" message; process() then returns false so the processor
    // is retired instead of running six filters forever.
    this.released = false;
    // Each mode keeps its fixed ratio to the base frequency; coefficients are
    // recomputed from (base, ratio) so glides never accumulate rounding.
    const ratios = [1, 2, 3, 4.5, 6, 8.5];
    const gains = [1, 0.65, 0.45, 0.28, 0.18, 0.12];
    this.modes = ratios.map((ratio, index) => ({
      ratio,
      gain: gains[index],
      a1: 0,
      a2: 0,
      b0: 0,
      y1: 0,
      y2: 0,
    }));
    this.lastFreq = -1;
    this.lastBrightness = -1;
    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === "trigger") {
        this.active = true;
      } else if (data.type === "stop") {
        this.active = false;
        this.released = true;
      }
    };
    this.updateModeCoefficients(220, 0.7);
  }

  updateModeCoefficients(freq, brightness) {
    const safeFreq = Math.max(20, Number(freq) || 220);
    const bright = Math.max(0, Math.min(1, Number(brightness) || 0));
    if (safeFreq === this.lastFreq && bright === this.lastBrightness) {
      return;
    }
    this.lastFreq = safeFreq;
    this.lastBrightness = bright;
    const baseDamp = 2 + (1 - bright) * 6;
    const r = Math.exp(-baseDamp / sampleRate);
    const a2 = -r * r;
    for (let m = 0; m < this.modes.length; m += 1) {
      const mode = this.modes[m];
      const modeFreq = Math.min(20000, safeFreq * mode.ratio);
      const omega = (2 * Math.PI * modeFreq) / sampleRate;
      mode.a1 = 2 * r * Math.cos(omega);
      mode.a2 = a2;
      mode.b0 = (1 - r) * mode.gain;
    }
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0] && outputs[0][0];
    if (this.released) {
      if (output) {
        output.fill(0);
      }
      return false;
    }
    if (!output) {
      return true;
    }
    if (!this.active) {
      output.fill(0);
      return true;
    }
    const freqParam = parameters.frequency;
    const brightnessParam = parameters.brightness;
    const freq = freqParam.length ? freqParam[0] : this.lastFreq;
    const brightness = brightnessParam.length ? brightnessParam[0] : 0.7;
    this.updateModeCoefficients(freq, brightness);

    const modes = this.modes;
    for (let i = 0; i < output.length; i += 1) {
      const noise = (Math.random() * 2 - 1) * 0.6;
      let sample = 0;
      for (let m = 0; m < modes.length; m += 1) {
        const mode = modes[m];
        const y = mode.b0 * noise + mode.a1 * mode.y1 + mode.a2 * mode.y2;
        mode.y2 = mode.y1;
        mode.y1 = y;
        sample += y;
      }
      output[i] = sample * 2.6;
    }
    return true;
  }
}

registerProcessor("modal-resonator", ModalResonatorProcessor);
