// Stable node and edge addresses used by every persisted per-node map.
//
// A node key is "grid:x,y,z" (a lattice point, by prime exponents) or
// "custom:x,y,z|slot" (the slot-th custom node attached to that point). An
// edge key joins two node keys with "|", smaller key first.

/** Edge key for two node keys, order-independent; "" if either is missing. */
export function getDistanceEdgeKey(aKey, bKey) {
  if (!aKey || !bKey) {
    return "";
  }
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

/**
 * Split an edge key into its two node keys, or null. A custom node key itself
 * contains a "|" (custom:x,y,z|slot), so split only at a "|" that starts the
 * next node key. Legacy keys made of two bare numeric ids ("123|456") still
 * split.
 */
export function parseDistanceEdgeKey(edgeKey) {
  if (!edgeKey || typeof edgeKey !== "string") {
    return null;
  }
  let parts = edgeKey.split(/\|(?=grid:|custom:)/);
  if (parts.length !== 2) {
    parts = edgeKey.split("|");
    if (parts.length !== 2 || parts.some((part) => /^(grid|custom):/.test(part))) {
      return null;
    }
  }
  return parts[0] && parts[1] ? parts : null;
}
