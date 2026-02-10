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
    this.baseFreq = 220;
    this.modes = [];
    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === "trigger") {
        this.active = true;
      } else if (data.type === "stop") {
        this.active = false;
      }
    };
    this.initModes(this.baseFreq);
  }

  initModes(freq) {
    const safeFreq = Math.max(20, Number(freq) || 220);
    this.baseFreq = safeFreq;
    const multipliers = [1, 2, 3, 4.5, 6, 8.5];
    const gains = [1, 0.65, 0.45, 0.28, 0.18, 0.12];
    this.modes = multipliers.map((mult, index) => {
      const modeFreq = Math.min(20000, safeFreq * mult);
      const omega = (2 * Math.PI * modeFreq) / sampleRate;
      const r = Math.exp(-3 / sampleRate);
      return {
        freq: modeFreq,
        a1: 2 * r * Math.cos(omega),
        a2: -r * r,
        b0: (1 - r) * gains[index],
        y1: 0,
        y2: 0,
        gain: gains[index],
      };
    });
  }

  updateModeCoefficients(freq, brightness) {
    if (!this.modes.length) {
      this.initModes(freq);
      return;
    }
    const safeFreq = Math.max(20, Number(freq) || 220);
    if (Math.abs(safeFreq - this.baseFreq) > 0.5) {
      this.initModes(safeFreq);
    }
    const bright = Math.max(0, Math.min(1, Number(brightness) || 0));
    const baseDamp = 2 + (1 - bright) * 6;
    this.modes.forEach((mode, index) => {
      const modeFreq = Math.min(20000, safeFreq * (index === 0 ? 1 : mode.freq / this.baseFreq));
      mode.freq = modeFreq;
      const omega = (2 * Math.PI * modeFreq) / sampleRate;
      const r = Math.exp(-baseDamp / sampleRate);
      mode.a1 = 2 * r * Math.cos(omega);
      mode.a2 = -r * r;
      mode.b0 = (1 - r) * mode.gain;
    });
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0] && outputs[0][0];
    if (!output) {
      return true;
    }
    if (!this.active) {
      output.fill(0);
      return true;
    }
    const freqParam = parameters.frequency;
    const brightnessParam = parameters.brightness;
    const freq = freqParam.length ? freqParam[0] : this.baseFreq;
    const brightness = brightnessParam.length ? brightnessParam[0] : 0.7;
    this.updateModeCoefficients(freq, brightness);

    for (let i = 0; i < output.length; i += 1) {
      const noise = (Math.random() * 2 - 1) * 0.6;
      let sample = 0;
      for (let m = 0; m < this.modes.length; m += 1) {
        const mode = this.modes[m];
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
