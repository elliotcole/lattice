// The document store (audit Phase 4.1).
//
// The document is everything a saved file or lattice link contains — and
// nothing else (hover, drags, held keys, dialogs and voices stay local to the
// code that owns them). main.js reads it freely through `store.doc` and
// changes it only through `store.set(patch)`.
//
// Rules for values in the document:
//   - Replace, never mutate in place. `set({ noteSpellings: {...old, [k]: v} })`,
//     not `doc.noteSpellings[k] = v`: undo keeps the previous value by
//     reference, so an in-place mutation would rewrite history.
//   - Values are plain data (numbers, strings, booleans, arrays, objects), so a
//     document serializes as-is.
//
// Every set() runs the subscribers synchronously, with the set of keys that
// changed, so derived data (label caches, mirrored controls) is never stale.
// Redrawing and URL updates are the subscribers' business; they can batch.
//
// Undo history: every set() call made in the same task (one click, one key,
// one file load) becomes one undo step. A set() with `{ coalesce: "drag" }`
// joins the previous step if that step had the same coalesce tag, so a drag
// or a run of wheel ticks undoes as one step. `{ history: false }` changes the
// document without recording a step (used when undo/redo themselves apply).
// A coalesced step stays open while updates keep arriving: a gap longer than
// `coalesceMs` starts a new step. Give each gesture its own tag
// (`drag:${id}`) when two gestures could follow each other quickly.

/**
 * @template {Record<string, unknown>} D
 * @param {D} initial
 * @param {{ historyLimit?: number, schedule?: (fn: () => void) => void }} [options]
 */
export function createStore(
  initial,
  { historyLimit = 200, coalesceMs = 750, schedule = queueMicrotask, now = Date.now } = {},
) {
  /** @type {D} */
  const doc = { ...initial };
  const subscribers = new Set();
  /** @type {{ before: Map<string, unknown>, after: Map<string, unknown>, tag: string | null }[]} */
  const undoStack = [];
  /** @type {typeof undoStack} */
  const redoStack = [];
  let openStep = null;
  let lastCoalescedAt = -Infinity;
  let historyPaused = 0;

  function notify(changed, previous) {
    for (const subscriber of subscribers) {
      subscriber(changed, previous);
    }
  }

  function record(before, after, tag) {
    if (openStep && openStep.tag === tag) {
      for (const [key, value] of before) {
        if (!openStep.before.has(key)) {
          openStep.before.set(key, value);
        }
      }
      for (const [key, value] of after) {
        openStep.after.set(key, value);
      }
      return;
    }
    const last = undoStack[undoStack.length - 1];
    const time = now();
    const recent = time - lastCoalescedAt <= coalesceMs;
    if (tag) {
      lastCoalescedAt = time;
    }
    if (!openStep && tag && recent && last && last.tag === tag && !redoStack.length) {
      openStep = last;
      record(before, after, tag);
      closeAtEndOfTask(last);
      return;
    }
    openStep = { before: new Map(before), after: new Map(after), tag };
    if (tag) {
      lastCoalescedAt = time;
    }
    undoStack.push(openStep);
    if (undoStack.length > historyLimit) {
      undoStack.shift();
    }
    redoStack.length = 0;
    closeAtEndOfTask(openStep);
  }

  // A step stays open for the rest of the task that opened it, then closes.
  function closeAtEndOfTask(step) {
    schedule(() => {
      if (openStep === step) {
        closeOpenStep();
      }
    });
  }

  // A step ends at the document the user saw: history-free writes made while
  // it was open (view-mode side effects) can overwrite keys it recorded.
  function closeOpenStep() {
    if (openStep) {
      for (const key of openStep.after.keys()) {
        openStep.after.set(key, doc[key]);
      }
    }
    openStep = null;
  }

  /**
   * Apply `patch` (only keys whose values differ count as changes).
   * @param {Partial<D>} patch
   * @param {{ history?: boolean, coalesce?: string }} [options]
   * @returns {boolean} whether anything changed
   */
  function set(patch, { history = true, coalesce = null } = {}) {
    const before = new Map();
    const after = new Map();
    for (const key of Object.keys(patch)) {
      if (!Object.is(doc[key], patch[key])) {
        before.set(key, doc[key]);
        after.set(key, patch[key]);
      }
    }
    if (!after.size) {
      return false;
    }
    for (const [key, value] of after) {
      doc[key] = value;
    }
    if (history && !historyPaused) {
      record(before, after, coalesce);
    }
    notify(new Set(after.keys()), Object.fromEntries(before));
    return true;
  }

  function applyStep(values) {
    return set(Object.fromEntries(values), { history: false });
  }

  return {
    doc,
    set,
    /** @param {(changed: Set<string>, previous: Partial<D>) => void} fn */
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    undo() {
      closeOpenStep();
      const step = undoStack.pop();
      if (!step) {
        return false;
      }
      redoStack.push(step);
      applyStep(step.before);
      return true;
    },
    redo() {
      closeOpenStep();
      const step = redoStack.pop();
      if (!step) {
        return false;
      }
      undoStack.push(step);
      applyStep(step.after);
      return true;
    },
    /** Run `fn` with history recording off (applying undo, view-mode side effects). */
    withoutHistory(fn) {
      historyPaused += 1;
      try {
        return fn();
      } finally {
        historyPaused -= 1;
      }
    },
    /** The recorded steps as { before, after } plain objects (tests, debugging). */
    inspectHistory() {
      const plain = (step) => ({
        before: Object.fromEntries(step.before),
        after: Object.fromEntries(step.after),
        tag: step.tag,
      });
      return { undo: undoStack.map(plain), redo: redoStack.map(plain) };
    },
    canUndo: () => undoStack.length > 0,
    canRedo: () => redoStack.length > 0,
    /** Forget all history (a new document was loaded and shouldn't undo into the old one). */
    clearHistory() {
      closeOpenStep();
      undoStack.length = 0;
      redoStack.length = 0;
    },
  };
}
