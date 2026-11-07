import { describe, expect, it } from "vitest";
import { createStore } from "../src/state/store.js";

// Tasks are closed explicitly in tests: `tick()` stands in for "the click
// handler returned".
function setup(initial = { a: 1, b: "x", list: [] }, options = {}) {
  const queue = [];
  let clock = 0;
  const store = createStore(initial, {
    schedule: (fn) => queue.push(fn),
    now: () => clock,
    ...options,
  });
  const tick = (ms = 0) => {
    clock += ms;
    queue.splice(0).forEach((fn) => fn());
  };
  return { store, tick };
}

describe("document store", () => {
  it("applies patches and reports only real changes", () => {
    const { store } = setup();
    const calls = [];
    store.subscribe((changed, previous) => calls.push([[...changed], previous]));
    expect(store.set({ a: 1 })).toBe(false);
    expect(store.set({ a: 2, b: "x" })).toBe(true);
    expect(store.doc.a).toBe(2);
    expect(calls).toEqual([[["a"], { a: 1 }]]);
  });

  it("does not let the initial object alias the document", () => {
    const initial = { a: 1 };
    const { store } = setup(initial);
    store.set({ a: 5 });
    expect(initial.a).toBe(1);
  });

  it("makes one undo step per task", () => {
    const { store, tick } = setup();
    store.set({ a: 2 });
    store.set({ b: "y" });
    tick();
    store.set({ a: 3 });
    tick();
    expect(store.undo()).toBe(true);
    expect(store.doc).toMatchObject({ a: 2, b: "y" });
    expect(store.undo()).toBe(true);
    expect(store.doc).toMatchObject({ a: 1, b: "x" });
    expect(store.undo()).toBe(false);
    store.redo();
    store.redo();
    expect(store.doc).toMatchObject({ a: 3, b: "y" });
    expect(store.redo()).toBe(false);
  });

  it("restores the value from before the step even if a key changed twice", () => {
    const { store, tick } = setup();
    store.set({ a: 2 });
    store.set({ a: 3 });
    tick();
    store.undo();
    expect(store.doc.a).toBe(1);
  });

  it("coalesces a gesture into one step while updates keep coming", () => {
    const { store, tick } = setup();
    for (let i = 2; i <= 6; i += 1) {
      store.set({ a: i }, { coalesce: "drag" });
      tick(100);
    }
    tick(2000);
    store.set({ a: 7 }, { coalesce: "drag" });
    tick();
    store.undo();
    expect(store.doc.a).toBe(6);
    store.undo();
    expect(store.doc.a).toBe(1);
  });

  it("a new edit after undo drops the redo branch", () => {
    const { store, tick } = setup();
    store.set({ a: 2 });
    tick();
    store.undo();
    store.set({ b: "z" });
    tick();
    expect(store.canRedo()).toBe(false);
    store.undo();
    expect(store.doc).toMatchObject({ a: 1, b: "x" });
  });

  it("undo and redo notify subscribers but record no history of their own", () => {
    const { store, tick } = setup();
    const seen = [];
    store.subscribe((changed) => seen.push([...changed].join()));
    store.set({ a: 2 });
    tick();
    store.undo();
    expect(seen).toEqual(["a", "a"]);
    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(true);
  });

  it("history: false changes without a step; clearHistory forgets everything", () => {
    const { store, tick } = setup();
    store.set({ a: 2 }, { history: false });
    tick();
    expect(store.canUndo()).toBe(false);
    store.set({ a: 3 });
    tick();
    store.clearHistory();
    expect(store.undo()).toBe(false);
    expect(store.doc.a).toBe(3);
  });

  it("keeps replaced values by reference so undo returns the same object", () => {
    const { store, tick } = setup();
    const original = store.doc.list;
    store.set({ list: [...original, 1] });
    tick();
    store.undo();
    expect(store.doc.list).toBe(original);
  });

  it("caps the history", () => {
    const { store, tick } = setup({ a: 0 }, { historyLimit: 3 });
    for (let i = 1; i <= 5; i += 1) {
      store.set({ a: i });
      tick();
    }
    while (store.undo()) {
      // unwind
    }
    expect(store.doc.a).toBe(2);
  });
});
