import { describe, expect, it } from "vitest";
import { arrow, text } from "../src/scene/display-list.js";
import { emitDisplayListSvg, svgColorAttr } from "../src/scene/emit-svg.js";
import { paintDisplayList } from "../src/scene/paint-canvas.js";

const echoText = async (options) => JSON.stringify(options);

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
      { textElement: echoText },
    );
    expect(parts).toHaveLength(2);
    expect(parts[0]).toBe(
      '<line x1="0" y1="0" x2="10" y2="0" stroke="#000000" stroke-width="1.5" />',
    );
    expect(parts[1]).toMatch(
      /^<polygon points="10,0 [\d.-]+,[\d.-]+ [\d.-]+,[\d.-]+" fill="#000000" \/>$/,
    );
  });

  it("maps text alignment, baseline, rotation (including 0) and lines", async () => {
    const [rotated, block] = await emitDisplayListSvg(
      [
        text({
          text: "x",
          x: 5,
          y: 6,
          font: "Lexend",
          size: 12,
          weight: 400,
          color: "#000",
          align: "center",
          baseline: "middle",
          rotation: 0,
        }),
        text({
          lines: ["a", "b"],
          lineHeight: 14,
          x: 1,
          y: 2,
          font: "Lexend",
          size: 12,
          weight: 400,
          color: "#000",
          align: "right",
          baseline: "top",
        }),
      ],
      { textElement: echoText },
    );
    expect(JSON.parse(rotated)).toMatchObject({
      anchor: "middle",
      baseline: "middle",
      transform: "rotate(0 5 6)",
    });
    expect(JSON.parse(block)).toMatchObject({
      text: "a\nb",
      anchor: "end",
      baseline: "hanging",
      transform: "",
    });
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
