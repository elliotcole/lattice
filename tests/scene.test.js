import { describe, expect, it } from "vitest";
import { arrow, text } from "../src/scene/display-list.js";
import { emitDisplayListSvg, svgColorAttr } from "../src/scene/emit-svg.js";
import { paintDisplayList } from "../src/scene/paint-canvas.js";

// Fake canvas metrics: every glyph 10px wide; "top" puts the alphabetic
// baseline 8px down, "middle" 3px down.
const fakeText = {
  measure: ({ text, baseline }) => ({
    width: text.length * 10,
    alphabeticBaseline: baseline === "top" ? -8 : baseline === "middle" ? -3 : 0,
  }),
  outline: async ({ text, x, y }) => `${text}@${x},${y}`,
};

describe("svgColorAttr", () => {
  it("splits alpha into an opacity attribute", () => {
    expect(svgColorAttr("fill", "rgba(10, 20, 30, 0.5)")).toBe(
      'fill="rgb(10, 20, 30)" fill-opacity="0.5"',
    );
    expect(svgColorAttr("stroke", "#11223380")).toBe(
      'stroke="rgb(17, 34, 51)" stroke-opacity="0.502"',
    );
    expect(svgColorAttr("fill", "#000000")).toBe('fill="#000000"');
    expect(svgColorAttr("fill", null)).toBe('fill="none"');
  });
});

describe("emitDisplayListSvg", () => {
  it("emits an arrow as a line plus a filled head", async () => {
    const parts = await emitDisplayListSvg(
      arrow({ x1: 0, y1: 0, x2: 10, y2: 0, color: "#000000", width: 1.5 }),
      fakeText,
    );
    expect(parts).toHaveLength(2);
    expect(parts[0]).toBe(
      '<line x1="0" y1="0" x2="10" y2="0" stroke="#000000" stroke-width="1.5" />',
    );
    expect(parts[1]).toMatch(
      /^<polygon points="10,0 [\d.-]+,[\d.-]+ [\d.-]+,[\d.-]+" fill="#000000" \/>$/,
    );
  });

  it("places glyph runs where the canvas would draw them", async () => {
    const parts = await emitDisplayListSvg(
      [
        text({
          text: "ab",
          x: 50,
          y: 20,
          font: "F",
          size: 12,
          weight: 400,
          color: "#000000",
          align: "center",
          baseline: "middle",
          rotation: 0,
        }),
        text({
          lines: ["abc", "", "d"],
          lineHeight: 14,
          x: 100,
          y: 0,
          font: "F",
          size: 12,
          weight: 400,
          color: "#000000",
          align: "right",
          baseline: "top",
        }),
      ],
      fakeText,
    );
    expect(parts).toEqual([
      '<path d="ab@40,23" transform="rotate(0 50 20)" fill="#000000" />',
      '<path d="abc@70,8" fill="#000000" />',
      '<path d="d@90,36" fill="#000000" />',
    ]);
  });

  it("falls back to a live text element when the font cannot be outlined", async () => {
    const [part] = await emitDisplayListSvg(
      [
        text({
          text: "a<b",
          x: 1,
          y: 2,
          font: "F",
          size: 12,
          weight: 400,
          color: "#000000",
          align: "left",
          baseline: "top",
        }),
      ],
      { ...fakeText, outline: async () => null },
    );
    expect(part).toBe(
      '<text x="1" y="2" text-anchor="start" dominant-baseline="text-before-edge" font-family="F" font-size="12" font-weight="400" xml:space="preserve" fill="#000000">a&lt;b</text>',
    );
  });
});

describe("paintDisplayList", () => {
  it("offsets by the page origin and honours the filter", () => {
    const calls = [];
    const ctx = new Proxy(
      {},
      {
        get: (_, key) =>
          key in ctx_state ? ctx_state[key] : (...args) => calls.push([key, ...args]),
        set: (_, key, value) => {
          ctx_state[key] = value;
          return true;
        },
      },
    );
    const ctx_state = {};
    paintDisplayList(
      ctx,
      [
        text({
          lines: ["a", "b"],
          lineHeight: 10,
          x: 1,
          y: 2,
          font: "F",
          size: 9,
          weight: 400,
          color: "#000",
          ref: { type: "keep" },
        }),
        text({
          text: "skip",
          x: 0,
          y: 0,
          font: "F",
          size: 9,
          weight: 400,
          color: "#000",
          ref: { type: "drop" },
        }),
      ],
      { originX: 100, originY: 200, filter: ({ ref }) => ref.type === "keep" },
    );
    const fills = calls.filter(([key]) => key === "fillText");
    expect(fills).toEqual([
      ["fillText", "a", 101, 202],
      ["fillText", "b", 101, 212],
    ]);
  });
});
