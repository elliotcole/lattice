// Display list: the shared scene both renderers consume (Phase 3).
//
// A scene is a flat array of primitives in PAGE coordinates (origin at the
// page's top-left, CSS px). The canvas painter offsets them by the page's
// on-screen origin; the SVG emitter writes them as-is. Builders live in
// main.js for now (they read its globals, strangler-style); painters and
// emitters here are pure.
//
// Primitive shapes (all colours are CSS colour strings):
//   { kind: "text", text, x, y, font, size, weight, color,
//     align: "left" | "center" | "right", baseline: "top" | "middle",
//     lines?: string[], lineHeight?: number, rotation?: radians }
//     `lines` (with `lineHeight`) replaces `text` for multi-line blocks.
//     `rotation` turns the text about (x, y).
//   { kind: "line", x1, y1, x2, y2, color, width }
//   { kind: "polygon", points: [[x, y], ...], color }  (filled)
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
