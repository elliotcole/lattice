import { describe, it, expect } from "vitest";
import {
  deepMergePresetState,
  diffSnapshotState,
  mergeSnapshotState,
  deepEqualSnapshotValue,
} from "../src/state-merge.js";

describe("snapshot diff/merge round-trip", () => {
  const base = {
    fundamental: 220,
    active: [[0, 0, 0]],
    muted: [[1, 0, 0]],
    customNodes: [{ sourceExponents: [0, 0, 0], customSlot: 0 }],
    view: { zoom: 1, offsetX: 0 },
  };

  it("restores a slot that changed a scalar and a nested value", () => {
    const next = { ...base, fundamental: 261.6, view: { zoom: 2, offsetX: 0 } };
    const diff = diffSnapshotState(base, next);
    expect(diff).toEqual({ fundamental: 261.6, view: { zoom: 2 } });
    expect(mergeSnapshotState(base, diff)).toEqual(next);
  });

  it("restores a slot that emptied a collection, when the slot spells it out as []", () => {
    // The app's snapshot states must keep empty collections as [] (not
    // prune them) for exactly this reason: a pruned key is invisible to
    // the diff and the deleted node would come back on import.
    const next = { ...base, muted: [], customNodes: [] };
    const merged = mergeSnapshotState(base, diffSnapshotState(base, next));
    expect(merged.muted).toEqual([]);
    expect(merged.customNodes).toEqual([]);
  });

  it("documents the limitation: a key omitted from the slot is inherited from base", () => {
    const next = { ...base };
    delete next.muted;
    const merged = mergeSnapshotState(base, diffSnapshotState(base, next));
    expect(merged.muted).toEqual(base.muted);
  });

  it("does not alias arrays or objects from base or diff", () => {
    const next = { ...base, active: [[1, 0, 0]] };
    const merged = mergeSnapshotState(base, diffSnapshotState(base, next));
    merged.active[0][0] = 99;
    merged.view.zoom = 99;
    expect(next.active[0][0]).toBe(1);
    expect(base.view.zoom).toBe(1);
  });
});

describe("deepMergePresetState", () => {
  const defaults = { view: { zoom: 1, offsetX: 0 }, synth: { volume: -12 }, fundamental: 220 };

  it("fills absent keys from defaults and keeps incoming values", () => {
    const merged = deepMergePresetState(defaults, { fundamental: 440, view: { zoom: 2 } });
    expect(merged).toEqual({
      view: { zoom: 2, offsetX: 0 },
      synth: { volume: -12 },
      fundamental: 440,
    });
  });

  it("means 'absent = default', so callers wanting 'absent = keep current' must fill first", () => {
    // This is the mechanism behind snapshot recall with a restore toggle
    // off: deleting `view` gets the boot view back, not the current one.
    const merged = deepMergePresetState(defaults, {});
    expect(merged.view).toEqual(defaults.view);
    const current = { zoom: 0.6, offsetX: 40 };
    expect(deepMergePresetState(defaults, { view: current }).view).toEqual(current);
  });

  it("replaces arrays wholesale rather than merging them", () => {
    expect(deepMergePresetState({ active: [[0, 0, 0]] }, { active: [] }).active).toEqual([]);
  });
});

describe("deepEqualSnapshotValue", () => {
  it("compares nested structures by value", () => {
    expect(deepEqualSnapshotValue({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqualSnapshotValue({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] })).toBe(false);
    expect(deepEqualSnapshotValue([], {})).toBe(false);
    expect(deepEqualSnapshotValue(null, undefined)).toBe(false);
  });
});
