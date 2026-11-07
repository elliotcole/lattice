import { describe, expect, it } from "vitest";
import { createStore } from "../src/state/store.js";
import { createDocMap } from "../src/state/doc-map.js";

function setup(entries = []) {
  const queue = [];
  const store = createStore({ spellings: entries }, { schedule: (fn) => queue.push(fn) });
  const tick = () => queue.splice(0).forEach((fn) => fn());
  return { store, map: createDocMap(store, "spellings"), tick };
}

describe("doc map", () => {
  it("reads and writes like a Map, keeping the document as entry arrays", () => {
    const { store, map } = setup([["grid:0,0,0", "C"]]);
    expect(map.get("grid:0,0,0")).toBe("C");
    map.set("grid:1,0,0", "G");
    map.set("grid:0,0,0", "B#");
    expect(store.doc.spellings).toEqual([
      ["grid:0,0,0", "B#"],
      ["grid:1,0,0", "G"],
    ]);
    expect(map.size).toBe(2);
    expect([...map.keys()]).toEqual(["grid:0,0,0", "grid:1,0,0"]);
    expect(map.delete("grid:9,9,9")).toBe(false);
    expect(map.delete("grid:1,0,0")).toBe(true);
    expect(Array.from(map.entries())).toEqual([["grid:0,0,0", "B#"]]);
  });

  it("replaces the array instead of mutating it, so undo restores it", () => {
    const { store, map, tick } = setup([["a", 1]]);
    const before = store.doc.spellings;
    map.set("b", 2);
    tick();
    expect(before).toEqual([["a", 1]]);
    store.undo();
    expect(store.doc.spellings).toBe(before);
    expect(map.has("b")).toBe(false);
  });

  it("skips no-op writes", () => {
    const { store, map } = setup([["a", 1]]);
    let notified = 0;
    store.subscribe(() => {
      notified += 1;
    });
    map.set("a", 1);
    map.clear();
    map.clear();
    expect(notified).toBe(1);
  });

  it("replaceAll swaps every entry in one change; forEach passes the doc map", () => {
    const { store, map } = setup([["a", 1]]);
    map.replaceAll(new Map([["x", 9]]));
    expect(store.doc.spellings).toEqual([["x", 9]]);
    const seen = [];
    map.forEach((value, key, owner) => seen.push([key, value, owner === map]));
    expect(seen).toEqual([["x", 9, true]]);
  });
});
