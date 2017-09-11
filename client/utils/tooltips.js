export function getCanvasNodeAnchorTooltipName(modeKey, selected) {
  return `canvas-${modeKey}-node__anchor-img--${selected ? 'selected' : 'unselected'}`
}

export function getCanvasNodeHeaderTooltipName({isNew, mine}) {
  return `canvas-node__header${mine && '--mine'}${isNew && '--isNew'}`
}

export function getMapNodeAnchorTooltipName({type}) {
  return `map-${type}-node__anchor-img`
}

export function getMapNodeHeaderTooltipName({type}) {
  return `map-${type}-node__header`
}

export function getEntitiesTooboxTooltipName({type}) {
  return `toolbox__entity-${type}`
}

export function getSymbolsTooboxTooltipName({type}) {
  return `toolbox__symbol-${type}`
}
