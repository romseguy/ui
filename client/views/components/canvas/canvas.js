import './canvas.scss'
import React from 'react'
import { DropTarget } from 'react-dnd'
import cx from 'classnames'

import { invert } from 'utils/number'

import { getClientPosition } from 'views/utils/navigator'

import CanvasItemTypes from './canvasItemTypes'
import DraggableCanvasNode from './draggableCanvasNode'
import { pan, zoom } from './canvasUtils'


class Canvas extends React.Component {
  constructor(props) {
    super(props)
    const {zoomLevel} = props
    this.state = {
      dragging: false,
      foreignObjectSupport: document.implementation.hasFeature('www.http://w3.org/TR/SVG11/feature#Extensibility', '1.1'),
      matrix: [zoomLevel, 0, 0, zoomLevel, 0, 0],
      zoomLevel
    }
  }

  setSvgReference = ref => {
    if (ref) {
      this.props.setSvgReference(ref)
      this.svg = ref
    }
  }

  componentWillReceiveProps({zoomLevel}) {
    if (zoomLevel !== this.state.zoomLevel) {
      this.setState({
        matrix: zoom(this.state.matrix, zoomLevel),
        zoomLevel
      })
    }
  }

  onDragStart = e => {
    e.preventDefault()

    if (e.target !== this.svg) {
      return
    }

    const {clientX, clientY} = getClientPosition(e)

    this.setState({
      dragging: true,
      startX: clientX,
      startY: clientY
    })
  }

  onDragMove = e => {
    e.preventDefault()

    // First check if the state is dragging, if not we can just return
    // so we do not move unless the user wants to move
    if (!this.state.dragging) {
      return
    }

    const {clientX, clientY} = getClientPosition(e)

    // Take the delta where we are minus where we came from
    const dx = clientX - this.state.startX
    const dy = clientY - this.state.startY

    // Update the new startX and startY position
    // because a drag is likely a continuous movement
    this.setState({
      matrix: pan(this.state.matrix, dx, dy),
      startX: clientX,
      startY: clientY,
    })
  }

  onDragEnd = e => {
    this.setState({
      dragging: false
    })
  }

  render() {
    const {
      canvasClass = 'canvas',
      readOnly = false,
      canvasHeight = 756,
      canvasWidth = 1396,
      zoomLevel,
      nodes,
      connectDropTarget,
      currentMode,
      toolboxes,
      onClick,
      onNodeAnchorClick,
      onNodeAnchorMouseOver,
      onNodeAnchorMouseOut,
      onNodeHeaderClick,
      onWheel
    } = this.props

    const svgClasses = cx(canvasClass, {
      [`${canvasClass}--dragging`]: this.state.dragging,
      'read-only': readOnly
    })

    const svg = (
      <svg
        ref={(ref) => this.setSvgReference(ref)}
        className={svgClasses}
        height={canvasHeight}
        width={canvasWidth}
        xlinkHref=''
        onClick={onClick}
        onMouseDown={this.onDragStart}
        onTouchStart={this.onDragStart}
        onMouseMove={this.onDragMove}
        onTouchMove={this.onDragMove}
        onMouseUp={this.onDragEnd}
        onTouchEnd={this.onDragEnd}
        onWheel={onWheel}
      >

        <g transform={`matrix(${this.state.matrix.join(' ')})`}>

          {nodes.map(node => {
            return (
              <DraggableCanvasNode
                node={node}
                currentMode={currentMode}
                foreignObjectSupport={this.state.foreignObjectSupport}
                readOnly={readOnly}
                zoomLevel={zoomLevel}
                onAnchorClick={onNodeAnchorClick}
                onAnchorMouseOver={onNodeAnchorMouseOver}
                onAnchorMouseOut={onNodeAnchorMouseOut}
                onHeaderClick={onNodeHeaderClick}
                key={`canvas-node-${node.id}`}
              />
            )
          })}

        </g>
      </svg>
    )

    return (
      <div className='canvas-toolbox-container'>
        {toolboxes.map(toolbox => React.createElement(toolbox.component, toolbox.props))}
        <div>
          {connectDropTarget(svg)}
        </div>
      </div>
    )
  }
}

//=====================================
//  DND
//-------------------------------------

const dropItemTypes = (props) => {
  return props.canvasDropItemTypes || []
}

const dropCanvasSpec = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const itemType = monitor.getItemType()
    const delta = monitor.getDifferenceFromInitialOffset()
    const initial = monitor.getInitialClientOffset()
    const {matrix, zoomLevel} = component.state
    const {onToolboxItemDrop, onNodeDragEnd} = component.props

    if (itemType === CanvasItemTypes.CANVAS_NODE) {
      const x = Math.round(item.node.x + (delta.x / zoomLevel))
      const y = Math.round(item.node.y + (delta.y / zoomLevel))
      onNodeDragEnd(item.node, x, y)
    }
    else if (itemType === CanvasItemTypes.TOOLBOX_ITEM) {
      const canvasPosition = component.svg.getBoundingClientRect()
      const matrixDeltaX = matrix[4] < 0 ? Math.abs(matrix[4]) : -matrix[4]
      const matrixDeltaY = matrix[5] < 0 ? Math.abs(matrix[5]) : -matrix[5]
      let x = (invert(matrix[4]) + delta.x + initial.x - canvasPosition.left - item.itemAttributes.width/1.8) / zoomLevel
      let y = (invert(matrix[5]) + delta.y + initial.y - canvasPosition.top - item.itemAttributes.height/1.8) / zoomLevel
      onToolboxItemDrop(item, x, y)
    }
  },

  canDrop(props, monitor) {
    const {x, y} = monitor.getClientOffset()
    // todo: check if x, y isn't within another node bounding rect
    return true
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
})

export default DropTarget(dropItemTypes, dropCanvasSpec, collect)(Canvas)
