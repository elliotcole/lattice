// A Map whose contents live in the document store (Phase 4.1).
//
// Several per-node collections (note spellings, octave offsets) were plain
// Maps keyed by node key and saved as `Array.from(map.entries())`. A doc map
// keeps that exact array in `store.doc[key]` and offers the Map interface, so
// existing call sites keep working while every change goes through
// `store.set` — replacing the array, never mutating it — and so is undoable
// and triggers the document reactions. Reads use a Map rebuilt only when the
// document's array changes.

/**
 * @param {{ doc: Record<string, unknown>, set: (patch: object) => boolean }} store
 * @param {string} key  document key holding an array of [key, value] entries
 */
export function createDocMap(store, key) {
  let source;
  let cache = new Map();
  const view = () => {
    const current = store.doc[key];
    if (current !== source) {
      source = current;
      cache = new Map(Array.isArray(current) ? current : []);
    }
    return cache;
  };
  const commit = (next) => {
    store.set({ [key]: Array.from(next.entries()) });
  };

  const docMap = {
    get size() {
      return view().size;
    },
    get(entryKey) {
      return view().get(entryKey);
    },
    has(entryKey) {
      return view().has(entryKey);
    },
    set(entryKey, value) {
      const current = view();
      if (current.has(entryKey) && Object.is(current.get(entryKey), value)) {
        return docMap;
      }
      const next = new Map(current);
      next.set(entryKey, value);
      commit(next);
      return docMap;
    },
    delete(entryKey) {
      const current = view();
      if (!current.has(entryKey)) {
        return false;
      }
      const next = new Map(current);
      next.delete(entryKey);
      commit(next);
      return true;
    },
    clear() {
      if (view().size) {
        commit(new Map());
      }
    },
    /** Replace every entry at once (one document change). */
    replaceAll(entries) {
      commit(new Map(entries));
    },
    forEach(callback, thisArg) {
      view().forEach((value, entryKey) => callback.call(thisArg, value, entryKey, docMap));
    },
    keys() {
      return view().keys();
    },
    values() {
      return view().values();
    },
    entries() {
      return view().entries();
    },
    [Symbol.iterator]() {
      return view().entries();
    },
  };
  return docMap;
}
