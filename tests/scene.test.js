import { describe, expect, it } from "vitest";
import { arrow, hitArea, line, offsetDisplayList, text } from "../src/scene/display-list.js";
import { hitAreaContains, hitTestDisplayList } from "../src/scene/hit-test.js";
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

function recordingContext() {
  const calls = [];
  const state = {};
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key in state
          ? state[key]
          : (...args) => {
              calls.push([key, ...args]);
            },
      set: (_, key, value) => {
        state[key] = value;
        calls.push([`set ${String(key)}`, value]);
        return true;
      },
    },
  );
  return { ctx, calls };
}

describe("paintDisplayList", () => {
  it("draws text lines and honours the filter", () => {
    const { ctx, calls } = recordingContext();
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
      { filter: ({ ref }) => ref.type === "keep" },
    );
    expect(calls.filter(([key]) => key === "fillText")).toEqual([
      ["fillText", "a", 1, 2],
      ["fillText", "b", 1, 12],
    ]);
  });

  it("stacks rotated lines from offsetY in the rotated frame, with alpha and dash", () => {
    const { ctx, calls } = recordingContext();
    paintDisplayList(ctx, [
      line({ x1: 0, y1: 0, x2: 5, y2: 0, color: "#000", width: 1, alpha: 0.4, dash: [6, 4] }),
      text({
        lines: ["a", "b"],
        lineHeight: 10,
        x: 50,
        y: 60,
        rotation: 0.5,
        offsetY: -10,
        font: "F",
        size: 9,
        weight: 400,
        color: "#000",
      }),
    ]);
    expect(calls).toContainEqual(["set globalAlpha", 0.4]);
    expect(calls).toContainEqual(["setLineDash", [6, 4]]);
    expect(calls).toContainEqual(["translate", 50, 60]);
    expect(calls).toContainEqual(["rotate", 0.5]);
    expect(calls.filter(([key]) => key === "fillText")).toEqual([
      ["fillText", "a", 0, -10],
      ["fillText", "b", 0, 0],
    ]);
  });
});

describe("offsetDisplayList", () => {
  it("translates every primitive kind without mutating the input", () => {
    const scene = [
      text({ text: "t", x: 10, y: 20 }),
      line({ x1: 1, y1: 2, x2: 3, y2: 4 }),
      ...arrow({ x1: 0, y1: 0, x2: 10, y2: 0, color: "#000", width: 1 }),
    ];
    const moved = offsetDisplayList(scene, -100, -200);
    expect(moved[0]).toMatchObject({ x: -90, y: -180 });
    expect(moved[1]).toMatchObject({ x1: -99, y1: -198, x2: -97, y2: -196 });
    expect(moved[3].points[0]).toEqual([-90, -200]);
    expect(scene[0].x).toBe(10);
  });
});

describe("hit areas", () => {
  const box = hitArea({ left: 10, top: 20, width: 30, height: 10, ref: { type: "title" } });

  it("are invisible to the painter and the SVG emitter", async () => {
    const calls = [];
    const ctx = new Proxy(
      {},
      { get: (_, key) => (key === "save" || key === "restore" ? () => {} : () => calls.push(key)) },
    );
    paintDisplayList(ctx, [box]);
    expect(calls).toEqual([]);
    expect(await emitDisplayListSvg([box], fakeText)).toEqual([]);
  });

  it("contain points inside the box, edges inclusive", () => {
    expect(hitAreaContains(box, { x: 10, y: 20 })).toBe(true);
    expect(hitAreaContains(box, { x: 40, y: 30 })).toBe(true);
    expect(hitAreaContains(box, { x: 41, y: 25 })).toBe(false);
  });

  it("rotate about their pivot", () => {
    // 40x10 box centred on (100, 100), turned a quarter: now tall and thin.
    const turned = hitArea({
      left: 80,
      top: 95,
      width: 40,
      height: 10,
      rotation: Math.PI / 2,
      pivot: { x: 100, y: 100 },
    });
    expect(hitAreaContains(turned, { x: 100, y: 118 })).toBe(true);
    expect(hitAreaContains(turned, { x: 118, y: 100 })).toBe(false);
  });

  it("hit-test finds the topmost area of the asked-for type", () => {
    const under = hitArea({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      ref: { type: "noteLabel", id: 1 },
    });
    const over = hitArea({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      ref: { type: "noteLabel", id: 2 },
    });
    const other = hitArea({ left: 0, top: 0, width: 100, height: 100, ref: { type: "title" } });
    const list = [
      under,
      over,
      other,
      line({ x1: 0, y1: 0, x2: 9, y2: 9, ref: { type: "noteLabel" } }),
    ];
    expect(hitTestDisplayList(list, { x: 5, y: 5 }, ["noteLabel"]).ref.id).toBe(2);
    expect(hitTestDisplayList(list, { x: 5, y: 5 }).ref.type).toBe("title");
    expect(hitTestDisplayList(list, { x: 500, y: 5 })).toBe(null);
  });

  it("move with offsetDisplayList", () => {
    const turned = hitArea({
      left: 0,
      top: 0,
      width: 4,
      height: 4,
      rotation: 1,
      pivot: { x: 2, y: 2 },
    });
    const [moved] = offsetDisplayList([turned], 10, 20);
    expect(moved).toMatchObject({ left: 10, top: 20, pivot: { x: 12, y: 22 } });
  });
});
