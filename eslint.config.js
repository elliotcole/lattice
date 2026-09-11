import js from "@eslint/js";
import globals from "globals";

// Two tiers: extracted modules, tests, and scripts are held to the full
// recommended set as errors; the three app monoliths get an advisory tier
// (second block) until they are broken up in audit Phases 3-4.
export default [
  {
    files: [
      "src/serialization.js",
      "src/state-merge.js",
      "src/custom-oscillator-types.js",
      "src/custom-oscillators.js",
      "src/lib/**/*.js",
      "tests/**/*.js",
      "scripts/**/*.mjs",
    ],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        btoa: "readonly",
        atob: "readonly",
        Buffer: "readonly",
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // The three app monoliths, advisory tier: undefined names and other hard
  // errors fail the build (this caught a missing import the day it went in);
  // dead code is reported as warnings (`npm run lint:warn`), which `npm run
  // lint` hides so CI output stays readable. Tighten as the monoliths shrink.
  {
    files: ["src/main.js", "tuner/**/*.js", "overtones/**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2021, AudioWorkletProcessor: "readonly" },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrors: "none" }],
      "no-empty": "off",
      "no-useless-assignment": "off",
    },
  },
];
