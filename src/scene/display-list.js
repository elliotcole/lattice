// Display list: the shared scene both renderers consume (Phase 3).
//
// A scene is a flat array of primitives in SCREEN coordinates (CSS px on the
// lattice canvas), painted in order. The canvas painter draws them as-is; the
// SVG export shifts them by the page's on-screen origin (offsetDisplayList).
// The canvas is the reference rendering: SVG output is made to match it.
// Builders live in main.js for now (they read its globals, strangler-style);
// painters and emitters here are pure.
//
// Primitive shapes (colours are CSS colour strings; `alpha` defaults to 1):
//   { kind: "text", text, x, y, font, size, weight, color, alpha?,
//     align: "left" | "center" | "right", baseline: "top" | "middle",
//     lines?: string[], lineHeight?: number,
//     rotation?: radians, offsetY?: number }
//     `lines` (with `lineHeight`) replaces `text` for multi-line blocks.
//     With `rotation`, the frame is rotated about (x, y) and lines start at
//     local y = offsetY.
//   { kind: "line", x1, y1, x2, y2, color, width, alpha?, dash?: number[] }
//   { kind: "stroke", subpaths: [[[x, y], ...], ...], color, width, alpha?, dash? }
//     one stroked path of open polylines (a broken edge is one path with two
//     subpaths, which antialiases differently from two separate lines)
//   { kind: "polygon", points: [[x, y], ...], color, alpha? }  (filled)
//
// Every primitive may carry `ref: { type, ... }` naming the scene element it
// came from, so the interactive canvas pass can filter (e.g. hide a label
// while its editor is open) and hit-testing can later read the scene.

export function text(props) {
  return { kind: "text", ...props };
}

export function line(props) {
  return { kind: "line", ...props };
}

export function stroke(props) {
  return { kind: "stroke", ...props };
}

export function polygon(props) {
  return { kind: "polygon", ...props };
}

/**
 * Line from (x1, y1) to (x2, y2) with a filled arrowhead at (x2, y2): the
 * axis-legend arrow. Head geometry matches the pre-Phase-3 renderers.
 */
export function arrow({ x1, y1, x2, y2, color, width, headLength = 10, ref }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  return [
    line({ x1, y1, x2, y2, color, width, ref }),
    polygon({
      points: [
        [x2, y2],
        [
          x2 - headLength * Math.cos(angle - Math.PI / 6),
          y2 - headLength * Math.sin(angle - Math.PI / 6),
        ],
        [
          x2 - headLength * Math.cos(angle + Math.PI / 6),
          y2 - headLength * Math.sin(angle + Math.PI / 6),
        ],
      ],
      color,
      ref,
    }),
  ];
}

/** Copy of `list` translated by (dx, dy). Rotations pivot on (x, y), so they follow. */
export function offsetDisplayList(list, dx, dy) {
  return list.map((item) => {
    switch (item.kind) {
      case "text":
        return { ...item, x: item.x + dx, y: item.y + dy };
      case "line":
        return { ...item, x1: item.x1 + dx, y1: item.y1 + dy, x2: item.x2 + dx, y2: item.y2 + dy };
      case "polygon":
        return { ...item, points: item.points.map(([x, y]) => [x + dx, y + dy]) };
      case "stroke":
        return {
          ...item,
          subpaths: item.subpaths.map((points) => points.map(([x, y]) => [x + dx, y + dy])),
        };
      default:
        return item;
    }
  });
}
