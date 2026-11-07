// SVG emitter for the display list (see display-list.js).
//
// The canvas is the reference rendering: SVG text is outlined glyphs placed
// with the canvas's own metrics, so an export matches what's on screen.
// Callers inject both halves of that:
//   measure({ text, font, size, weight, baseline }) -> { width, alphabeticBaseline }
//     canvas TextMetrics (width; distance from `baseline` to the alphabetic
//     baseline, negative when the alphabetic baseline is below it)
//   outline({ text, font, size, weight, x, y }) -> Promise<pathData | null>
//     glyph outlines with the alphabetic baseline at y; null if the font
//     can't be loaded (a live <text> element is emitted instead)

const SVG_ANCHOR = { left: "start", center: "middle", right: "end" };
const SVG_BASELINE = { top: "text-before-edge", middle: "middle" };

/** Emit `list` as SVG element strings. */
export async function emitDisplayListSvg(list, { measure, outline }) {
  const parts = [];
  for (const item of list) {
    switch (item.kind) {
      case "text":
        parts.push(...(await emitText(item, { measure, outline })));
        break;
      case "line":
        parts.push(
          `<line x1="${item.x1}" y1="${item.y1}" x2="${item.x2}" y2="${item.y2}" ${svgColorAttr(
            "stroke",
            item.color,
          )} stroke-width="${item.width}"${
            item.dash && item.dash.length ? ` stroke-dasharray="${item.dash.join(" ")}"` : ""
          }${opacityAttr(item)} />`,
        );
        break;
      case "stroke":
        parts.push(
          `<path d="${item.subpaths
            .map((points) =>
              points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(""),
            )
            .join(
              "",
            )}" fill="none" ${svgColorAttr("stroke", item.color)} stroke-width="${item.width}"${
            item.dash && item.dash.length ? ` stroke-dasharray="${item.dash.join(" ")}"` : ""
          }${opacityAttr(item)} />`,
        );
        break;
      case "polygon":
        parts.push(
          `<polygon points="${item.points.map(([x, y]) => `${x},${y}`).join(" ")}" ${svgColorAttr(
            "fill",
            item.color,
          )}${opacityAttr(item)} />`,
        );
        break;
      default:
        break;
    }
  }
  return parts;
}

/**
 * Outlined glyph runs for a text primitive, one per line, positioned exactly
 * as the canvas painter's fillText would draw them.
 */
export async function emitText(item, { measure, outline }) {
  const lines = item.lines || [item.text];
  const baseline = item.baseline || "alphabetic";
  const transform =
    item.rotation != null
      ? ` transform="rotate(${(item.rotation * 180) / Math.PI} ${item.x} ${item.y})"`
      : "";
  const fill = `${svgColorAttr("fill", item.color)}${opacityAttr(item)}`;
  // Rotated text is laid out in a frame pivoting on (x, y), starting offsetY
  // down; the rotate() transform turns the whole run about the same pivot.
  const startY = item.rotation != null ? item.y + (item.offsetY || 0) : item.y;
  const out = [];
  for (let index = 0; index < lines.length; index += 1) {
    const lineText = lines[index] == null ? "" : String(lines[index]);
    if (!lineText) {
      continue;
    }
    const y = startY + index * (item.lineHeight || 0);
    const { width, alphabeticBaseline } = measure({
      text: lineText,
      font: item.font,
      size: item.size,
      weight: item.weight,
      baseline,
    });
    const shift = item.align === "center" ? width / 2 : item.align === "right" ? width : 0;
    const pathData = await outline({
      text: lineText,
      font: item.font,
      size: item.size,
      weight: item.weight,
      x: item.x - shift,
      y: y - alphabeticBaseline,
    });
    if (pathData != null) {
      out.push(`<path d="${pathData}"${transform} ${fill} />`);
    } else {
      out.push(
        `<text x="${item.x}" y="${y}" text-anchor="${SVG_ANCHOR[item.align] || "start"}" dominant-baseline="${
          SVG_BASELINE[baseline] || "alphabetic"
        }" font-family="${escapeXml(item.font)}" font-size="${item.size}" font-weight="${
          item.weight
        }" xml:space="preserve"${transform} ${fill}>${escapeXml(lineText)}</text>`,
      );
    }
  }
  return out;
}

function opacityAttr(item) {
  return item.alpha != null && item.alpha !== 1 ? ` opacity="${item.alpha}"` : "";
}

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
