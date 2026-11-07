// Canvas painter for the display list (see display-list.js).

/**
 * Paint `list` onto `ctx`, offsetting page coordinates by (originX, originY).
 * `filter(primitive)` returning false skips a primitive.
 */
export function paintDisplayList(ctx, list, { originX = 0, originY = 0, filter = null } = {}) {
  for (const item of list) {
    if (filter && !filter(item)) {
      continue;
    }
    const paint = PAINTERS[item.kind];
    if (paint) {
      ctx.save();
      paint(ctx, item, originX, originY);
      ctx.restore();
    }
  }
}

const PAINTERS = {
  text(ctx, item, ox, oy) {
    ctx.fillStyle = item.color;
    ctx.font = `${item.weight} ${item.size}px ${item.font}`;
    ctx.textAlign = item.align || "left";
    ctx.textBaseline = item.baseline || "alphabetic";
    if (item.rotation != null) {
      ctx.translate(item.x + ox, item.y + oy);
      ctx.rotate(item.rotation);
      ctx.fillText(item.text, 0, 0);
      return;
    }
    if (item.lines) {
      item.lines.forEach((lineText, index) => {
        ctx.fillText(lineText, item.x + ox, item.y + oy + index * item.lineHeight);
      });
      return;
    }
    ctx.fillText(item.text, item.x + ox, item.y + oy);
  },
  line(ctx, item, ox, oy) {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.width;
    ctx.beginPath();
    ctx.moveTo(item.x1 + ox, item.y1 + oy);
    ctx.lineTo(item.x2 + ox, item.y2 + oy);
    ctx.stroke();
  },
  polygon(ctx, item, ox, oy) {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    item.points.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x + ox, y + oy);
      } else {
        ctx.lineTo(x + ox, y + oy);
      }
    });
    ctx.closePath();
    ctx.fill();
  },
};
