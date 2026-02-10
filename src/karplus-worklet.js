class KarplusStrongProcessor extends AudioWorkletProcessor {
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
        name: "damping",
        defaultValue: 0.985,
        minValue: 0,
        maxValue: 0.999,
        automationRate: "k-rate",
      },
    ];
  }

  constructor() {
    super();
    this.buffer = new Float32Array(2);
    this.index = 0;
    this.lastFreq = 220;
    this.active = false;
    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === "trigger") {
        this.active = true;
        this.initBuffer(this.lastFreq);
      } else if (data.type === "stop") {
        this.active = false;
      }
    };
    this.initBuffer(this.lastFreq);
  }

  initBuffer(freq) {
    const safeFreq = Math.max(20, Number(freq) || 220);
    const size = Math.max(2, Math.round(sampleRate / safeFreq));
    if (!this.buffer || this.buffer.length !== size) {
      this.buffer = new Float32Array(size);
    } else {
      this.buffer.fill(0);
    }
    this.buffer[0] = 1;
    this.index = 0;
    this.lastFreq = safeFreq;
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
    const dampingParam = parameters.damping;
    const freq = freqParam.length ? freqParam[0] : this.lastFreq;
    if (Math.abs(freq - this.lastFreq) > 0.5) {
      this.initBuffer(freq);
    }
    const damping = dampingParam.length ? dampingParam[0] : 0.985;
    const buffer = this.buffer;
    const size = buffer.length;
    let idx = this.index;
    for (let i = 0; i < output.length; i += 1) {
      const y = buffer[idx];
      const next = (y + buffer[(idx + 1) % size]) * 0.5 * damping;
      buffer[idx] = next;
      output[i] = y;
      idx = (idx + 1) % size;
    }
    this.index = idx;
    return true;
  }
}

registerProcessor("karplus-strong", KarplusStrongProcessor);
