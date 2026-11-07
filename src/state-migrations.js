// Versioned preset-state format: one migration per version step, kept forever.
//
// Every state the app loads (lattice links, files, presets, deck diagrams,
// snapshot slots) passes through migrateState() before it is applied, so the
// apply code only ever sees the current shape. The writer stamps
// STATE_VERSION into `v`.
//
// To change a persisted field: bump STATE_VERSION, add MIGRATIONS[old] that
// rewrites a version-`old` state into the new shape (pure; never mutate the
// input), and add a test with a real file of the old version.
//
// Versions:
//   1  everything written before November 2026 (`v: 1` was written but never
//      read; states without `v` are treated as 1).
//   2  distance edges always use stable node keys. Before September 2026,
//      custom nodes in `distanceEdges` / `distanceEdgeOverrides` were keyed
//      "custom:<200000 + index into this file's customNodes>".
//
// Two older forms can't be rewritten without building the lattice, so main.js
// still resolves them at load time: spelling overrides keyed by positional
// node id (resolvePendingLegacySpellingOverrides) and layout positions of
// custom nodes keyed by `sourceNodeId` (applyLayoutCustomNodePositions).

import { getDistanceEdgeKey, parseDistanceEdgeKey } from "./node-keys.js";

export const STATE_VERSION = 2;

/** The format version a state claims (1 when absent or malformed). */
export function getStateVersion(state) {
  const version = Number(state && state.v);
  return Number.isInteger(version) && version >= 1 ? version : 1;
}

/**
 * Bring `state` up to STATE_VERSION. Returns { state, fromVersion,
 * newerThanApp }; a state from a newer app is returned unchanged with
 * newerThanApp set (the caller loads what it can and says so).
 */
export function migrateState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return { state, fromVersion: null, newerThanApp: false };
  }
  const fromVersion = getStateVersion(state);
  if (fromVersion > STATE_VERSION) {
    return { state, fromVersion, newerThanApp: true };
  }
  let next = state;
  for (let version = fromVersion; version < STATE_VERSION; version += 1) {
    next = { ...MIGRATIONS[version](next), v: version + 1 };
  }
  return { state: next, fromVersion, newerThanApp: false };
}

const MIGRATIONS = {
  1: migrateV1DistanceKeys,
};

// v1 -> v2: rewrite legacy custom-node distance keys to stable addresses.
// Keys that can't be resolved are dropped (the edge pointed at a custom node
// the file no longer has). Everything else is left for the loader to judge.
function migrateV1DistanceKeys(state) {
  const customEntries = Array.isArray(state.customNodes) ? state.customNodes : [];
  const next = { ...state };
  if (Array.isArray(state.distanceEdges)) {
    next.distanceEdges = state.distanceEdges
      .map((edgeKey) =>
        typeof edgeKey === "string" ? migrateLegacyEdgeKey(edgeKey, customEntries) : edgeKey,
      )
      .filter((edgeKey) => edgeKey !== null);
  }
  if (Array.isArray(state.distanceEdgeOverrides)) {
    next.distanceEdgeOverrides = state.distanceEdgeOverrides
      .map((entry) => {
        if (!entry || typeof entry !== "object" || typeof entry.key !== "string") {
          return entry;
        }
        const key = migrateLegacyEdgeKey(entry.key, customEntries);
        return key === null ? null : { ...entry, key };
      })
      .filter((entry) => entry !== null);
  }
  return next;
}

function migrateLegacyEdgeKey(edgeKey, customEntries) {
  const parts = parseDistanceEdgeKey(edgeKey);
  if (!parts) {
    return edgeKey;
  }
  const a = migrateLegacyNodeKey(parts[0], customEntries);
  const b = migrateLegacyNodeKey(parts[1], customEntries);
  return a && b ? getDistanceEdgeKey(a, b) : null;
}

function migrateLegacyNodeKey(nodeKey, customEntries) {
  if (!nodeKey.startsWith("custom:") || nodeKey.includes("|")) {
    return nodeKey;
  }
  const index = Number(nodeKey.slice(7)) - 200000;
  const entry = Number.isInteger(index) && index >= 0 ? customEntries[index] : null;
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const source = Array.isArray(entry.sourceExponents)
    ? entry.sourceExponents
    : Array.isArray(entry.exponents)
      ? entry.exponents
      : null;
  if (!source || source.length < 2) {
    return null;
  }
  const [x, y, z = 0] = source.map(Number);
  if (![x, y, z].every(Number.isFinite)) {
    return null;
  }
  let slot = Number.isFinite(Number(entry.customSlot))
    ? Math.trunc(Number(entry.customSlot))
    : null;
  if (slot == null) {
    // Slots were assigned in file order per source node.
    slot = customEntries.slice(0, index).filter((other) => {
      const otherSource = other && (other.sourceExponents || other.exponents);
      return (
        Array.isArray(otherSource) &&
        Number(otherSource[0]) === x &&
        Number(otherSource[1]) === y &&
        Number(otherSource[2] || 0) === z
      );
    }).length;
  }
  return `custom:${x},${y},${z}|${slot}`;
}
