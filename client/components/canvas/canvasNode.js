import React from 'react'
import { Origin } from 'redux-tooltip'
import cx from 'classnames'
import { pure } from 'recompose'

import icons from 'assets/icons'
import modeTypes from 'lib/maps/modeTypes'
import { getCanvasNodeAnchorTooltipName, getCanvasNodeHeaderTooltipName } from 'helpers/tooltips'

import CanvasNodeImage from './canvasNodeImage'


const SVGOrigin = Origin.wrapBy('g')


function CanvasNode(props) {
  const {
    node,
    foreignObjectSupport,
    currentMode,
    defaultImageHeight = 50,
    defaultImageWidth = 50,
    readOnly,
    onAnchorClick,
    onAnchorMouseOver,
    onAnchorMouseOut,
    onHeaderClick
  } = props

  let anchor = null

  if (node.iconName) {
    const imageHeight = node.imageHeight || defaultImageHeight
    const imageWidth = node.imageWidth || defaultImageWidth
    const src = node.hovered || node.selected ? icons[node.iconNameSelected] : icons[node.iconName]
    let tooltipName = getCanvasNodeAnchorTooltipName(currentMode, node)

    if (currentMode === modeTypes.DISCOVERY && node.isNew) {
      tooltipName = null
    }

    anchor = (
      <SVGOrigin
        name={tooltipName}
        onHover={e => onAnchorMouseOver(node)}
        onLeave={e => onAnchorMouseOut(node)}
      >
        <CanvasNodeImage
          id={`canvas-node__anchor-img-${node.id}`}
          currentMode={currentMode}
          height={imageHeight}
          node={node}
          width={imageWidth}
          x={(node.width - imageWidth) / 2}
          xlinkHref={src}
          y="0"
        />
      </SVGOrigin>
    )
  }

  let header = null

  if (node.name) {
    let tooltipName = getCanvasNodeHeaderTooltipName(node)
    let cursor = 'pointer'

    if (currentMode === modeTypes.DISCOVERY) {
      tooltipName = null
      cursor = 'default'
    } else {
      if (!node.mine) {
        cursor = 'move'
      }
    }

    let text = null

    if (foreignObjectSupport) {
      const multiplier = 2
      
      text = (
        <foreignObject
          height={node.height / multiplier}
          x={-(node.width / multiplier)}
          y={node.height / multiplier}
          width={node.width * multiplier}
        >
          <div
            id={`canvas-node__header-${node.id}`}
            style={{
              textAlign: 'center',
              width: node.width * multiplier
            }}
          >
            <label
              style={{
                cursor,
                width: node.width * multiplier
              }}
            >
              {node.name} {node.distance ? `${node.distance}km` : ''}
            </label>
          </div>
        </foreignObject>
      )
    } else {
      text = (
        <text
          alignmentBaseline="middle"
          key="header-no-wrap"
          textAnchor="middle"
          x={node.width / 2}
          y={node.height - (node.height / 3)}
          style={{
            cursor
          }}
        >
          {node.name}
        </text>
      )
    }

    header = (
      <SVGOrigin name={tooltipName}>
        {text}
      </SVGOrigin>
    )
  }

  return (
    <g>
      <g onClick={e => onAnchorClick(node)}>
        {anchor}
      </g>
      <g onClick={e => onHeaderClick(node)}>
        {header}
      </g>
    </g>
  )
}

export default pure(CanvasNode)
