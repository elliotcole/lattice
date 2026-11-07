// One keyboard pipeline for the editor (audit Phase 4.4).
//
// main.js used to wire eight separate window keydown listeners, and what a key
// did depended on the order those listeners happened to be registered in.
// Now each (event type, phase) pair has exactly one native listener, which
// runs an ordered table of bindings. The order of the table *is* the
// precedence: read it top to bottom to see what a key does.
//
// A binding is { id, type, phase, description, handle(event) }:
//   type   "keydown" | "keyup"
//   phase  "capture" (runs before element-level handlers such as dialogs and
//          inputs) | "bubble" (runs after them; element handlers that call
//          preventDefault() are visible through event.defaultPrevented)
//   handle returns true to consume the key: later bindings in the same table
//          are skipped. Anything else lets the key continue down the table.
//
// Bindings never stop each other implicitly. Where the old listeners called
// event.stopImmediatePropagation(), the binding still does (so element and
// bubble-phase handlers stay blocked) *and* returns true.

const TYPES = ["keydown", "keyup"];
const PHASES = ["capture", "bubble"];

export function createKeyDispatcher() {
  const tables = new Map();
  for (const type of TYPES) {
    for (const phase of PHASES) {
      tables.set(`${type}:${phase}`, []);
    }
  }
  const ids = new Set();

  function bind(binding) {
    const { id, type, phase = "bubble", handle } = binding || {};
    if (!id || ids.has(id)) {
      throw new Error(`key binding needs a unique id (got ${JSON.stringify(id)})`);
    }
    const table = tables.get(`${type}:${phase}`);
    if (!table) {
      throw new Error(`key binding ${id}: unknown type/phase ${type}/${phase}`);
    }
    if (typeof handle !== "function") {
      throw new Error(`key binding ${id}: handle must be a function`);
    }
    ids.add(id);
    table.push({ ...binding, phase });
  }

  /** Run one table; returns the id of the binding that consumed the key, or null. */
  function dispatch(type, phase, event) {
    const table = tables.get(`${type}:${phase}`) || [];
    for (const binding of table) {
      if (binding.handle(event) === true) {
        return binding.id;
      }
    }
    return null;
  }

  /** Install the four native listeners on `target` (window). */
  function attach(target) {
    for (const type of TYPES) {
      for (const phase of PHASES) {
        target.addEventListener(type, (event) => dispatch(type, phase, event), {
          capture: phase === "capture",
        });
      }
    }
  }

  /** The tables in precedence order (for help text / a command palette). */
  function list() {
    const out = [];
    for (const [key, table] of tables) {
      const [type, phase] = key.split(":");
      for (const { id, description = "" } of table) {
        out.push({ id, type, phase, description });
      }
    }
    return out;
  }

  return { bind, dispatch, attach, list };
}

// Letters that act as quasimodes while held: hold the key, then click a node.
// Pointer handlers ask `heldKeys.has(letter)`.
export const HELD_KEYS = Object.freeze({
  c: "click a node: add a custom ratio from it",
  f: "click a node: make it the fundamental",
  i: "click a node: add an interval from it",
  l: "click and hold a node: arm an LFO",
  m: "click a node: mute or unmute it",
  n: "click a node: centre the view on it",
  o: "click a node: shift its octave",
  r: "click a node: respell it",
  t: "show triangles under the pointer; click to edit them",
  v: "click a node: adjust its volume",
  x: "axis mode: x axis",
  y: "axis mode: y axis",
  z: "axis mode: z axis",
});

/** The set of held quasimode letters, tracked from keydown/keyup. */
export function createHeldKeys(letters = Object.keys(HELD_KEYS)) {
  const known = new Set(letters);
  const held = new Set();
  const letterOf = (event) => String((event && event.key) || "").toLowerCase();
  return {
    /** Record a keydown; returns the letter if it is a held key, else null. */
    press(event) {
      const letter = letterOf(event);
      if (!known.has(letter)) {
        return null;
      }
      held.add(letter);
      return letter;
    },
    /** Record a keyup; returns the letter if it is a held key, else null. */
    release(event) {
      const letter = letterOf(event);
      if (!known.has(letter)) {
        return null;
      }
      held.delete(letter);
      return letter;
    },
    has(letter) {
      return held.has(letter);
    },
    delete(letter) {
      held.delete(letter);
    },
    clear() {
      held.clear();
    },
  };
}
