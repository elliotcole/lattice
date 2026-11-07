// Hit-testing against the display list (see display-list.js): the regions a
// click can land on are the `hitArea` primitives the scene builders emit
// alongside the ink, so what you can click is exactly what was drawn.

/** True if `point` ({ x, y }) lies inside the hit area (edges inclusive). */
export function hitAreaContains(area, point) {
  let { x, y } = point;
  if (area.rotation) {
    const pivot = area.pivot || { x: 0, y: 0 };
    const dx = x - pivot.x;
    const dy = y - pivot.y;
    const cos = Math.cos(-area.rotation);
    const sin = Math.sin(-area.rotation);
    x = pivot.x + dx * cos - dy * sin;
    y = pivot.y + dx * sin + dy * cos;
  }
  return (
    x >= area.left && x <= area.left + area.width && y >= area.top && y <= area.top + area.height
  );
}

/**
 * Topmost hit area under `point` whose `ref.type` is one of `types` (all
 * types when omitted), or null. Later items paint over earlier ones, so the
 * list is searched back to front.
 */
export function hitTestDisplayList(list, point, types = null) {
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const item = list[index];
    if (item.kind !== "hitArea" || !item.ref) {
      continue;
    }
    if (types && !types.includes(item.ref.type)) {
      continue;
    }
    if (hitAreaContains(item, point)) {
      return item;
    }
  }
  return null;
}
