// Shared geometry for the SVG architecture diagrams. Boxes are { x, y, w, h } in viewBox units.

// Connect the facing sides of two boxes with a smooth S-curve, horizontally or vertically
export function edgePath(a, b) {
  const acx = a.x + a.w / 2
  const acy = a.y + a.h / 2
  const bcx = b.x + b.w / 2
  const bcy = b.y + b.h / 2
  const dx = bcx - acx
  const dy = bcy - acy

  if (Math.abs(dx) >= Math.abs(dy)) {
    const sx = dx >= 0 ? a.x + a.w : a.x
    const ex = dx >= 0 ? b.x : b.x + b.w
    const mx = (sx + ex) / 2
    return `M${sx} ${acy} C${mx} ${acy} ${mx} ${bcy} ${ex} ${bcy}`
  }

  const sy = dy >= 0 ? a.y + a.h : a.y
  const ey = dy >= 0 ? b.y : b.y + b.h
  const my = (sy + ey) / 2
  return `M${acx} ${sy} C${acx} ${my} ${bcx} ${my} ${bcx} ${ey}`
}

// Box of node `id` in a layout shaped { node: { w, h }, nodes: { [id]: [x, y] } }
export function boxFor(layout, id) {
  const [x, y] = layout.nodes[id]
  return { x, y, w: layout.node.w, h: layout.node.h }
}
