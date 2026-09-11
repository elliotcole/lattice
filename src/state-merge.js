// Pure helpers for combining preset/snapshot state documents. No DOM, no app
// globals; extracted from main.js so the semantics can be unit-tested.
//
// Two distinct operations live here and they must not be confused:
//
//   deepMergePresetState(defaults, incoming)  "absent means default"
//     Used when loading a preset: every key the file omits is filled from
//     the boot defaults.
//
//   diffSnapshotState(base, next) / mergeSnapshotState(base, diff)
//     "absent means unchanged" — a snapshot-set export stores each slot as
//     a diff against a base. A key that is present in base and absent in
//     next therefore cannot be expressed; callers must pass states that
//     spell out empty collections as [] rather than omitting them.

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function deepClonePresetValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => deepClonePresetValue(item));
  }
  if (isPlainObject(value)) {
    const next = {};
    Object.entries(value).forEach(([key, child]) => {
      next[key] = deepClonePresetValue(child);
    });
    return next;
  }
  return value;
}

export function deepMergePresetState(defaultValue, incomingValue) {
  if (incomingValue === undefined) {
    return deepClonePresetValue(defaultValue);
  }
  if (Array.isArray(incomingValue)) {
    return deepClonePresetValue(incomingValue);
  }
  if (isPlainObject(defaultValue) && isPlainObject(incomingValue)) {
    const merged = {};
    const keys = new Set([...Object.keys(defaultValue || {}), ...Object.keys(incomingValue || {})]);
    keys.forEach((key) => {
      merged[key] = deepMergePresetState(defaultValue[key], incomingValue[key]);
    });
    return merged;
  }
  if (isPlainObject(incomingValue)) {
    return deepClonePresetValue(incomingValue);
  }
  return incomingValue;
}

export function deepEqualSnapshotValue(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a == null || b == null) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqualSnapshotValue(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        return false;
      }
      if (!deepEqualSnapshotValue(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function diffSnapshotState(base, next) {
  if (!base || !next || typeof base !== "object" || typeof next !== "object") {
    return next;
  }
  const diff = {};
  Object.keys(next).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(next, key)) {
      return;
    }
    const nextValue = next[key];
    const baseValue = base[key];
    if (deepEqualSnapshotValue(baseValue, nextValue)) {
      return;
    }
    if (
      nextValue &&
      baseValue &&
      typeof nextValue === "object" &&
      typeof baseValue === "object" &&
      !Array.isArray(nextValue) &&
      !Array.isArray(baseValue)
    ) {
      const childDiff = diffSnapshotState(baseValue, nextValue);
      if (childDiff && Object.keys(childDiff).length) {
        diff[key] = childDiff;
      }
      return;
    }
    diff[key] = nextValue;
  });
  return diff;
}

export function mergeSnapshotState(base, diff) {
  if (!diff || typeof diff !== "object") {
    return base ? JSON.parse(JSON.stringify(base)) : diff;
  }
  if (!base || typeof base !== "object") {
    return JSON.parse(JSON.stringify(diff));
  }
  const result = JSON.parse(JSON.stringify(base));
  Object.keys(diff).forEach((key) => {
    const value = diff[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base &&
      typeof base[key] === "object" &&
      base[key] &&
      !Array.isArray(base[key])
    ) {
      result[key] = mergeSnapshotState(base[key], value);
    } else {
      result[key] = JSON.parse(JSON.stringify(value));
    }
  });
  return result;
}
