// Shared geometry for the SVG architecture diagrams. Boxes are { x, y, w, h } in viewBox units.

// Connect the facing sides of two boxes with a smooth S-curve. Edges follow the layout's
// direction ("horizontal" left-to-right, "vertical" top-to-bottom) and only turn when
// both boxes sit in the same column or row, so diagonal links never squeeze between boxes
export function edgePath(a, b, direction = "horizontal") {
  const acx = a.x + a.w / 2
  const acy = a.y + a.h / 2
  const bcx = b.x + b.w / 2
  const bcy = b.y + b.h / 2
  const dx = bcx - acx
  const dy = bcy - acy
  const sameColumn = Math.abs(dx) < a.w
  const sameRow = Math.abs(dy) < a.h
  const horizontal = direction === "horizontal" ? !sameColumn : sameRow

  if (horizontal) {
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
