#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const MAIN_PATH = "src/main.js";
const CHECKLIST_PATH = "docs/regression-checklist.md";

function fail(message) {
  console.error(`\n[regression] FAIL: ${message}\n`);
  process.exit(1);
}

function runBuild() {
  console.log("[regression] Running build...");
  const result = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    fail("Build failed.");
  }
}

function runSourceGuards() {
  console.log("[regression] Running source guards...");
  const source = readFileSync(MAIN_PATH, "utf8");
  const requiredSnippets = [
    {
      name: "3D edge label position guard",
      snippet: "const labelT = getLineLabelPositionOverride(a, b) ?? 0.5;",
    },
    {
      name: "Layout reset exits layout mode",
      snippet: "setLayoutMode(false);",
    },
    {
      name: "Layout reset restores 2D mode",
      snippet: "set3DMode(false, { preserveDepth: false });",
    },
    {
      name: "Keyboard map blocked in layout mode",
      snippet: "if (!isCustomPianoMode() || layoutMode) {",
    },
  ];

  const missing = requiredSnippets.filter((entry) => !source.includes(entry.snippet));
  if (missing.length) {
    const names = missing.map((entry) => entry.name).join(", ");
    fail(`Missing required source guards: ${names}`);
  }
}

runBuild();
runSourceGuards();

console.log("\n[regression] PASS: automated smoke checks passed.");
console.log(`[regression] Next: run manual checklist in ${CHECKLIST_PATH}\n`);
