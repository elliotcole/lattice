import { describe, it, expect } from "vitest";
import { CUSTOM_OSCILLATOR_TYPES, LOCAL_WAVEFORMS } from "../src/custom-oscillator-types.js";
import { customOscillatorTypes, customOscillators } from "../src/custom-oscillators.js";

// The light module hand-copies the type list so menus can populate without
// loading the ~900 kB wavetable package. Keep the copy honest.
describe("custom oscillator split", () => {
  it("the startup type list matches what the heavy module derives", () => {
    expect(CUSTOM_OSCILLATOR_TYPES).toEqual(customOscillatorTypes);
  });

  it("every listed type has a factory once the heavy module is loaded", () => {
    for (const type of CUSTOM_OSCILLATOR_TYPES) {
      expect(typeof customOscillators[type]).toBe("function");
    }
  });

  it("local wavetables are well-formed", () => {
    for (const { real, imag } of Object.values(LOCAL_WAVEFORMS)) {
      expect(real.length).toBeGreaterThan(1);
      expect(imag.length).toBeGreaterThan(1);
      expect(real.every(Number.isFinite)).toBe(true);
      expect(imag.every(Number.isFinite)).toBe(true);
    }
  });
});
