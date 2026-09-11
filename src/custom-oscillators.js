// The heavy half of the custom-oscillator pair: pulls in the
// `web-audio-oscillators` wavetables (~900 kB minified). Import this module
// lazily (`import("./custom-oscillators.js")`) from the moment a custom
// waveform is selected, never statically — see ./custom-oscillator-types.js
// for the name list and the two local waveforms that can load up front.
import {
  customOscillators as baseOscillators,
  customOscillatorTypes as baseTypes,
} from "web-audio-oscillators";
import { localOscillators } from "./custom-oscillator-types.js";

const EXCLUDED_TYPES = new Set([
  "brass",
  "brass2",
  "aah",
  "ooh",
  "eeh",
  "buzz",
  "buzz2",
  "dissonance",
]);

const baseList = (baseTypes || []).filter((type) => !EXCLUDED_TYPES.has(type));
const warmIndex = baseList.indexOf("sine");
const warmInsertAt = warmIndex >= 0 ? warmIndex + 1 : 0;
const customOrder = ["semisine", "warm"];
const orderedList = [
  ...baseList.slice(0, warmInsertAt),
  ...customOrder,
  ...baseList.slice(warmInsertAt).filter((type) => !customOrder.includes(type)),
];
const uniqueTypes = Array.from(new Set(orderedList));

export const customOscillatorTypes = uniqueTypes;

export const customOscillators = {
  ...(baseOscillators || {}),
  ...localOscillators,
};
