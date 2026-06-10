import js from "@eslint/js";

// Lint covers extracted modules, tests, and scripts only. src/main.js and the
// satellite monoliths join as they're broken up (audit Phases 2-4) — linting
// them now would drown signal in thousands of legacy findings.
export default [
  {
    files: ["src/serialization.js", "tests/**/*.js", "scripts/**/*.mjs"],
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
];
