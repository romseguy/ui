import React, { Children } from 'react'
import { Origin } from 'redux-tooltip'
import cx from 'classnames'
import { pure } from 'recompose'

import { modeTypes } from 'views/utils/canvas'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'


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
    const className = cx({
      'canvas-node__anchor-img': true
    })
    const imageHeight = node.imageHeight || defaultImageHeight
    const imageWidth = node.imageWidth || defaultImageWidth

    anchor = (
      <SVGOrigin
        name={getCanvasNodeAnchorTooltipName(currentMode, node.selected)}
        onHover={e => onAnchorMouseOver(node.id)}
        onLeave={e => onAnchorMouseOut(node.id)}
      >
        <image
          id={`canvas-node__anchor-img-${node.id}`}
          alt=""
          className={className}
          height={imageHeight}
          href={node.selected || node.hovered ? node.imageSelected : node.image}
          style={{cursor: currentMode === modeTypes.DISCOVERY ? 'zoom-in' : 'move'}}
          width={imageWidth}
          x={(nodeWidth - imageWidth) / 2}
          xlinkHref={node.image}
          y="0"
        />
      </SVGOrigin>
    )
  }
  // icon
  else if (node.icon && foreignObjectSupport) {
    const className = cx({
      'canvas-node__anchor-img-icon': true
    })
    const iconWidth = node.iconWidth
    const fontSize = node.fontSize || '76px'

    anchor = (
      <foreignObject
        className={className}
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
      let tooltipName = 'canvas-node__header'
      let cursor = 'pointer'

      if (currentMode === modeTypes.DISCOVERY) {
        tooltipName = null
        cursor = 'default'
      } else {
        if (!node.mine) {
          tooltipName = null
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
      <g onClick={e => onAnchorClick(node.id)}>
        {anchor}
      </g>
      <g onClick={e => onHeaderClick(node.id)}>
        {text}
      </g>
    </g>
  )
}

export default pure(CanvasNode)
