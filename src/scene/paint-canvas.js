// Canvas painter for the display list (see display-list.js).

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
