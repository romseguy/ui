import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { compose } from 'ramda'
import CanvasNode from './canvasNode'
import CanvasItemTypes from './canvasItemTypes'

function DraggableCanvasNode(props) {
  const {
    node,
    connectDragSource,
    currentMode,
    foreignObjectSupport,
    isDragging,
    readOnly,
    onAnchorClick,
    onAnchorMouseOver,
    onAnchorMouseOut,
    onHeaderClick
  } = props

  if (isDragging) {
    return null
  }

  let content = (
    <g transform={`translate(${node.x}, ${node.y})`}>
      <CanvasNode
        node={node}
        currentMode={currentMode}
        foreignObjectSupport={foreignObjectSupport}
        readOnly={readOnly}
        onAnchorClick={onAnchorClick}
        onAnchorMouseOver={onAnchorMouseOver}
        onAnchorMouseOut={onAnchorMouseOut}
        onHeaderClick={onHeaderClick}
      />
    </g>
  )
  content = connectDragSource(content, {dropEffect: 'move'})

  return content
}

//=====================================
//  DND SOURCE
//-------------------------------------

const dragItemSpec = {
  beginDrag (props) {
    return {
      node: props.node,
      foreignObjectSupport: props.foreignObjectSupport,
      zoomLevel: props.zoomLevel
    }
  },

  canDrag(props){
    return !props.readOnly
  }
}

const sourceCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

//=====================================
//  DND TARGET
//-------------------------------------

const dropItemSpec = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
  }
}

const targetCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
})


const dropItemTypes = (props) => {
  return props.node.containerNodeDropItemTypes || []
}

export default compose(
  DragSource(CanvasItemTypes.CANVAS_NODE, dragItemSpec, sourceCollect),
  DropTarget(dropItemTypes, dropItemSpec, targetCollect)
)(DraggableCanvasNode)
