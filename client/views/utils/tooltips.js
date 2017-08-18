export function getCanvasNodeAnchorTooltipName(currentModeKey, selected) {
  return `canvas-${currentModeKey}-node__anchor-img--${selected ? 'selected' : 'unselected'}`
}
