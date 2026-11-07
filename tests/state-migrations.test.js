import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { STATE_VERSION, getStateVersion, migrateState } from "../src/state-migrations.js";
import { getDistanceEdgeKey, parseDistanceEdgeKey } from "../src/node-keys.js";

const pythagoreanComma = JSON.parse(
  readFileSync(
    new URL(
      "../fixtures/creator-exports/32 Pythagorean Comma - Creator [tuninglattice.com].json",
      import.meta.url,
    ),
    "utf8",
  ),
);

describe("getStateVersion", () => {
  it("reads v, treating absent or malformed as 1", () => {
    expect(getStateVersion({ v: 2 })).toBe(2);
    expect(getStateVersion({})).toBe(1);
    expect(getStateVersion({ v: "x" })).toBe(1);
    expect(getStateVersion({ v: 0 })).toBe(1);
  });
});

describe("migrateState", () => {
  it("rewrites a real pre-September file's custom-node distance keys", () => {
    const { state, fromVersion } = migrateState(pythagoreanComma);
    expect(fromVersion).toBe(1);
    expect(state.v).toBe(STATE_VERSION);
    expect(state.distanceEdges).toContain("custom:0,0,0|0|grid:12,0,0");
    expect(state.distanceEdges.some((key) => /custom:2\d{5}/.test(key))).toBe(false);
    expect(state.distanceEdgeOverrides.some((entry) => /custom:2\d{5}/.test(entry.key))).toBe(
      false,
    );
    // Grid keys pass through untouched, in order.
    expect(state.distanceEdges.slice(0, 5)).toEqual(pythagoreanComma.distanceEdges.slice(0, 5));
  });

  it("does not mutate its input", () => {
    const before = JSON.stringify(pythagoreanComma);
    migrateState(pythagoreanComma);
    expect(JSON.stringify(pythagoreanComma)).toBe(before);
  });

  it("is a no-op on a current state", () => {
    const current = { v: STATE_VERSION, distanceEdges: ["custom:200000|grid:0,0,0"] };
    expect(migrateState(current).state).toBe(current);
  });

  it("derives a missing slot from file order and drops keys it can't resolve", () => {
    const { state } = migrateState({
      customNodes: [{ sourceExponents: [1, 0, 0] }, { sourceExponents: [1, 0, 0] }],
      distanceEdges: [
        "custom:200001|grid:0,0,0",
        "custom:200009|grid:0,0,0",
        "grid:0,0,0|grid:1,0,0",
      ],
      distanceEdgeOverrides: [
        { key: "custom:200001|grid:0,0,0", labelT: 0.3 },
        { key: "custom:200009|grid:0,0,0" },
      ],
    });
    expect(state.distanceEdges).toEqual(["custom:1,0,0|1|grid:0,0,0", "grid:0,0,0|grid:1,0,0"]);
    expect(state.distanceEdgeOverrides).toEqual([
      { key: "custom:1,0,0|1|grid:0,0,0", labelT: 0.3 },
    ]);
  });

  it("flags a state from a newer app and leaves it alone", () => {
    const future = { v: STATE_VERSION + 1, distanceEdges: ["custom:200000|grid:0,0,0"] };
    const result = migrateState(future);
    expect(result.newerThanApp).toBe(true);
    expect(result.state).toBe(future);
  });

  it("passes non-objects through", () => {
    expect(migrateState(null).state).toBe(null);
  });
});

describe("node keys", () => {
  it("orders edge keys and splits custom keys at the right bar", () => {
    const key = getDistanceEdgeKey("grid:0,0,0", "custom:1,0,0|2");
    expect(key).toBe("custom:1,0,0|2|grid:0,0,0");
    expect(parseDistanceEdgeKey(key)).toEqual(["custom:1,0,0|2", "grid:0,0,0"]);
    expect(parseDistanceEdgeKey("12|34")).toEqual(["12", "34"]);
    expect(parseDistanceEdgeKey("grid:0,0,0")).toBe(null);
  });
});
