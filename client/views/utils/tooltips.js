export function getCanvasNodeAnchorTooltipName(modeKey, selected) {
  return `canvas-${modeKey}-node__anchor-img--${selected ? 'selected' : 'unselected'}`
}

export function getCanvasNodeHeaderTooltipName({isNew, mine}) {
  return `canvas-node__header${mine && '--mine'}${isNew && '--isNew'}`
}
