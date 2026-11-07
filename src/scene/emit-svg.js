// SVG emitter for the display list (see display-list.js).
//
// Output is byte-compatible with the pre-Phase-3 `buildLayoutSvgString`, which
// the golden captures check. Text goes through the caller's `textElement`
// (main.js's `buildSvgTextElement`, which outlines glyphs with opentype.js).

const SVG_ANCHOR = { left: "start", center: "middle", right: "end" };
const SVG_BASELINE = { top: "hanging", middle: "middle" };

/**
 * Emit `list` as SVG element strings. Async because text outlining loads
 * fonts. `textElement(options)` returns a Promise<string>.
 */
export async function emitDisplayListSvg(list, { textElement }) {
  const parts = [];
  for (const item of list) {
    switch (item.kind) {
      case "text": {
        const transform =
          item.rotation != null
            ? `rotate(${(item.rotation * 180) / Math.PI} ${item.x} ${item.y})`
            : "";
        parts.push(
          await textElement({
            text: item.lines ? item.lines.join("\n") : item.text,
            x: item.x,
            y: item.y,
            font: item.font,
            size: item.size,
            fontWeight: item.weight,
            anchor: SVG_ANCHOR[item.align] || "start",
            baseline: SVG_BASELINE[item.baseline] || "alphabetic",
            color: item.color,
            transform,
          }),
        );
        break;
      }
      case "line":
        parts.push(
          `<line x1="${item.x1}" y1="${item.y1}" x2="${item.x2}" y2="${item.y2}" ${svgColorAttr(
            "stroke",
            item.color,
          )} stroke-width="${item.width}" />`,
        );
        break;
      case "polygon":
        parts.push(
          `<polygon points="${item.points.map(([x, y]) => `${x},${y}`).join(" ")}" ${svgColorAttr(
            "fill",
            item.color,
          )} />`,
        );
        break;
      default:
        break;
    }
  }
  return parts;
}

/** `fill="rgb(...)" fill-opacity="0.5"` from any CSS colour string. */
export function svgColorAttr(name, color) {
  const normalized = normalizeSvgColor(color);
  const base = `${name}="${normalized.color}"`;
  if (normalized.opacity === null || normalized.color === "none") {
    return base;
  }
  const opacity = Number(normalized.opacity.toFixed(3));
  return `${base} ${name}-opacity="${opacity}"`;
}

/** Split rgba()/#rgba/#rrggbbaa into an opaque colour plus opacity. */
export function normalizeSvgColor(color) {
  if (!color) {
    return { color: "none", opacity: null };
  }
  const trimmed = String(color).trim();
  if (trimmed === "none" || trimmed === "transparent") {
    return { color: trimmed, opacity: null };
  }
  const rgbaMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbaMatch) {
    const parts = rgbaMatch[1]
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const a = parts.length > 3 ? Number(parts[3]) : 1;
    if ([r, g, b].every((value) => Number.isFinite(value))) {
      const rgb = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      const opacity = Number.isFinite(a) ? Math.max(0, Math.min(1, a)) : 1;
      return { color: rgb, opacity };
    }
  }
  const hexMatch = trimmed.match(/^#([0-9a-f]{4}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const values =
      hex.length === 4
        ? hex.split("").map((char) => parseInt(char + char, 16))
        : [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            parseInt(hex.slice(6, 8), 16),
          ];
    const [r, g, b, a = 255] = values;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const opacity = Math.max(0, Math.min(1, a / 255));
    return { color: rgb, opacity };
  }
  return { color: trimmed, opacity: null };
}
