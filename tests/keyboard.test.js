import { describe, expect, it } from "vitest";
import { createHeldKeys, createKeyDispatcher, HELD_KEYS } from "../src/input/keyboard.js";

const key = (k, extra = {}) => ({ key: k, ...extra });

describe("key dispatcher", () => {
  it("runs bindings in the order they were bound", () => {
    const seen = [];
    const keys = createKeyDispatcher();
    keys.bind({ id: "a", type: "keydown", handle: () => seen.push("a") });
    keys.bind({ id: "b", type: "keydown", handle: () => seen.push("b") });
    expect(keys.dispatch("keydown", "bubble", key("x"))).toBe(null);
    expect(seen).toEqual(["a", "b"]);
  });

  it("stops at a binding that returns true", () => {
    const seen = [];
    const keys = createKeyDispatcher();
    keys.bind({ id: "a", type: "keydown", phase: "capture", handle: () => true });
    keys.bind({ id: "b", type: "keydown", phase: "capture", handle: () => seen.push("b") });
    expect(keys.dispatch("keydown", "capture", key("x"))).toBe("a");
    expect(seen).toEqual([]);
  });

  it("keeps phases and event types in separate tables", () => {
    const seen = [];
    const keys = createKeyDispatcher();
    keys.bind({ id: "down", type: "keydown", handle: () => seen.push("down") });
    keys.bind({ id: "up", type: "keyup", handle: () => seen.push("up") });
    keys.bind({ id: "cap", type: "keydown", phase: "capture", handle: () => seen.push("cap") });
    keys.dispatch("keyup", "bubble", key("x"));
    expect(seen).toEqual(["up"]);
    expect(keys.list().map((b) => `${b.type}:${b.phase}:${b.id}`)).toEqual([
      "keydown:capture:cap",
      "keydown:bubble:down",
      "keyup:bubble:up",
    ]);
  });

  it("rejects duplicate ids and unknown phases", () => {
    const keys = createKeyDispatcher();
    keys.bind({ id: "a", type: "keydown", handle: () => {} });
    expect(() => keys.bind({ id: "a", type: "keydown", handle: () => {} })).toThrow();
    expect(() => keys.bind({ id: "b", type: "keypress", handle: () => {} })).toThrow();
    expect(() => keys.bind({ id: "c", type: "keydown" })).toThrow();
  });

  it("attaches one listener per type and phase", () => {
    const added = [];
    const keys = createKeyDispatcher();
    keys.attach({ addEventListener: (type, _fn, opts) => added.push(`${type}:${opts.capture}`) });
    expect(added.sort()).toEqual(["keydown:false", "keydown:true", "keyup:false", "keyup:true"]);
  });
});

describe("held keys", () => {
  it("tracks the quasimode letters case-insensitively", () => {
    const held = createHeldKeys();
    expect(held.press(key("T"))).toBe("t");
    expect(held.has("t")).toBe(true);
    expect(held.press(key("q"))).toBe(null);
    expect(held.has("q")).toBe(false);
    expect(held.release(key("t"))).toBe("t");
    expect(held.has("t")).toBe(false);
  });

  it("clears everything at once", () => {
    const held = createHeldKeys();
    held.press(key("r"));
    held.press(key("z"));
    held.clear();
    expect(held.has("r") || held.has("z")).toBe(false);
  });

  it("covers the thirteen letters the editor reads", () => {
    expect(Object.keys(HELD_KEYS).sort().join("")).toBe("cfilmnortvxyz");
  });
});
