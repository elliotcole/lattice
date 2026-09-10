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
    // Set by a "stop" message; process() then returns false so the processor
    // is retired instead of rendering silence forever.
    this.released = false;
    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === "trigger") {
        this.active = true;
        this.pluck(this.lastFreq);
      } else if (data.type === "stop") {
        this.active = false;
        this.released = true;
      }
    };
    this.pluck(this.lastFreq);
  }

  bufferSizeFor(freq) {
    const safeFreq = Math.max(20, Number(freq) || 220);
    return { safeFreq, size: Math.max(2, Math.round(sampleRate / safeFreq)) };
  }

  // Fresh excitation: only on trigger.
  pluck(freq) {
    const { safeFreq, size } = this.bufferSizeFor(freq);
    if (!this.buffer || this.buffer.length !== size) {
      this.buffer = new Float32Array(size);
    } else {
      this.buffer.fill(0);
    }
    this.buffer[0] = 1;
    this.index = 0;
    this.lastFreq = safeFreq;
  }

  // Pitch change while ringing: resample the delay line to the new length so
  // the string glides instead of being re-struck.
  retune(freq) {
    const { safeFreq, size } = this.bufferSizeFor(freq);
    this.lastFreq = safeFreq;
    const old = this.buffer;
    const oldSize = old.length;
    if (size === oldSize) {
      return;
    }
    const next = new Float32Array(size);
    const step = oldSize / size;
    for (let i = 0; i < size; i += 1) {
      const pos = (this.index + i * step) % oldSize;
      const lo = Math.floor(pos);
      const hi = (lo + 1) % oldSize;
      const frac = pos - lo;
      next[i] = old[lo] * (1 - frac) + old[hi] * frac;
    }
    this.buffer = next;
    this.index = 0;
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
    const dampingParam = parameters.damping;
    const freq = freqParam.length ? freqParam[0] : this.lastFreq;
    if (Math.abs(freq - this.lastFreq) > 0.5) {
      this.retune(freq);
    }
    const damping = dampingParam.length ? dampingParam[0] : 0.985;
    const buffer = this.buffer;
    const size = buffer.length;
    let idx = this.index;
    for (let i = 0; i < output.length; i += 1) {
      const y = buffer[idx];
      let next = (y + buffer[(idx + 1) % size]) * 0.5 * damping;
      // Flush denormals once the tail is inaudible.
      if (next < 1e-20 && next > -1e-20) {
        next = 0;
      }
      buffer[idx] = next;
      output[i] = y;
      idx = (idx + 1) % size;
    }
    this.index = idx;
    return true;
  }
}

registerProcessor("karplus-strong", KarplusStrongProcessor);
