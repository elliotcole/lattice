// Canvas painter for the display list (see display-list.js).

import { DIAMOND_RADIUS_SCALE } from "./display-list.js";

/** Paint `list` onto `ctx`. `filter(primitive)` returning false skips one. */
export function paintDisplayList(ctx, list, { filter = null } = {}) {
  for (const item of list) {
    if (filter && !filter(item)) {
      continue;
    }
    const paint = PAINTERS[item.kind];
    if (paint) {
      ctx.save();
      if (item.alpha != null) {
        ctx.globalAlpha = item.alpha;
      }
      paint(ctx, item);
      ctx.restore();
    }
  }
}

const PAINTERS = {
  text(ctx, item) {
    ctx.fillStyle = item.color;
    ctx.font = `${item.weight} ${item.size}px ${item.font}`;
    ctx.textAlign = item.align || "left";
    ctx.textBaseline = item.baseline || "alphabetic";
    const lines = item.lines || [item.text];
    const step = item.lineHeight || 0;
    if (item.rotation != null) {
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      const startY = item.offsetY || 0;
      lines.forEach((lineText, index) => ctx.fillText(lineText, 0, startY + index * step));
      return;
    }
    lines.forEach((lineText, index) => ctx.fillText(lineText, item.x, item.y + index * step));
  },
  line(ctx, item) {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.width;
    ctx.setLineDash(item.dash && item.dash.length ? item.dash : []);
    ctx.beginPath();
    ctx.moveTo(item.x1, item.y1);
    ctx.lineTo(item.x2, item.y2);
    ctx.stroke();
  },
  stroke(ctx, item) {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.width;
    ctx.setLineDash(item.dash && item.dash.length ? item.dash : []);
    ctx.beginPath();
    for (const points of item.subpaths) {
      points.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
    }
    ctx.stroke();
  },
  rect(ctx, item) {
    ctx.fillStyle = item.fill;
    ctx.beginPath();
    ctx.roundRect(item.x, item.y, item.width, item.height, item.radius || 0);
    ctx.fill();
    if (item.stroke) {
      ctx.strokeStyle = item.stroke;
      ctx.lineWidth = item.strokeWidth ?? 1;
      ctx.stroke();
    }
  },
  curve(ctx, item) {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.width;
    ctx.setLineDash(item.dash && item.dash.length ? item.dash : []);
    ctx.beginPath();
    ctx.moveTo(item.p0.x, item.p0.y);
    ctx.quadraticCurveTo(item.p1.x, item.p1.y, item.p2.x, item.p2.y);
    ctx.stroke();
  },
  nodeShape(ctx, item) {
    ctx.beginPath();
    ctx.strokeStyle = item.stroke;
    ctx.lineWidth = item.width;
    if (item.dash && item.dash.length) {
      ctx.setLineDash(item.dash);
    }
    ctx.fillStyle = item.fill;
    traceNodeShape(ctx, item.shape, item.x, item.y, item.radius);
    if (item.fillAlpha != null) {
      ctx.save();
      ctx.globalAlpha *= item.fillAlpha;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fill();
    }
    ctx.stroke();
  },
  polygon(ctx, item) {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    item.points.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
  },
};

/** Add a node shape's outline to the current path (no beginPath). */
export function traceNodeShape(ctx, shape, x, y, radius) {
  if (shape === "square") {
    ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
    return;
  }
  if (shape === "triangle") {
    const height = radius * 1.2;
    ctx.moveTo(x, y - height);
    ctx.lineTo(x + radius, y + height * 0.6);
    ctx.lineTo(x - radius, y + height * 0.6);
    ctx.closePath();
    return;
  }
  if (shape === "diamond") {
    const r = radius * DIAMOND_RADIUS_SCALE;
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    return;
  }
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}
