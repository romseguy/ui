import React from 'react'
import { Origin } from 'redux-tooltip'
import cx from 'classnames'
import { pure } from 'recompose'

import { modeTypes } from 'utils/canvas'
import { getCanvasNodeAnchorTooltipName, getCanvasNodeHeaderTooltipName } from 'utils/tooltips'

import CanvasNodeImage from './canvasNodeImage'


const SVGOrigin = Origin.wrapBy('g')

function CanvasNode(props) {
  const {
    node,
    currentMode,
    defaultImageHeight = 50,
    defaultImageWidth = 50,
    foreignObjectSupport,
    readOnly,
    onAnchorClick,
    onAnchorMouseOver,
    onAnchorMouseOut,
    onHeaderClick
  } = props
  const nodeHeight = node.height
  const nodeWidth = node.width

  let anchor = null
  let text = null

  // anchor
  // image
  if (node.image) {
    const imageHeight = node.imageHeight || defaultImageHeight
    const imageWidth = node.imageWidth || defaultImageWidth
    let tooltipName = getCanvasNodeAnchorTooltipName(currentMode, node.selected)

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
          x={(nodeWidth - imageWidth) / 2}
          xlinkHref={node.selected ? node.imageSelected : node.image}
          y="0"
        />
      </SVGOrigin>
    )
  }
  // icon
  else if (node.icon && foreignObjectSupport) {
    const iconWidth = node.iconWidth
    const fontSize = node.fontSize || '76px'

    anchor = (
      <foreignObject
        x={(nodeWidth - iconWidth) / 2}
        y={(nodeHeight / 2) - 54}
        height={fontSize}
        width={iconWidth}
        key="node-icon-class"
      >
        <i
          className={node.icon}
          style={{fontSize: node.fontSize || '76px'}}
        />
      </foreignObject>
    )
  }
  // fontContent
  else if (node.fontFamily && node.fontContent) {
    const className = cx({
      'canvas-node__anchor-icon': true
    })

    anchor = (
      <text
        className={className}
        style={{fontFamily: node.fontFamily}}
        x={0}
        y={0}
        key="node-icon-fontcontent"
      >
        {node.fontContent}
      </text>
    )
  }

  // text
  if (node.name) {
    if (foreignObjectSupport) {
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

      text = (
        <SVGOrigin name={tooltipName}>
          <foreignObject
            className={cx('canvas-node__header')}
            width={nodeWidth}
            height={nodeHeight / 2}
            x={0}
            y={nodeHeight / 2}
            key="title-text-wrap"
          >
            <label
              id={`canvas-node__header-${node.id}`}
              style={{
                color: node.textColor,
                cursor,
                width: nodeWidth
              }}
            >
              {node.name} {node.distance ? `${node.distance}km` : ''}
            </label>
          </foreignObject>
        </SVGOrigin>
      )
    }
    else {
      const className = cx({
        'canvas-node__header': true,
        'node-rect': !node.selected
      })

      text = (
        <text
          className={className}
          x={nodeWidth / 2}
          y={nodeHeight - 24}
          textAnchor="middle"
          alignmentBaseline="middle"
          key="title-no-wrap"
        >
          {node.name}
        </text>
      )
    }
  }

  return (
    <g className="canvas-node">
      <g onClick={e => onAnchorClick(node)}>
        {anchor}
      </g>
      <g onClick={e => onHeaderClick(node)}>
        {text}
      </g>
    </g>
  )
}

export default pure(CanvasNode)
