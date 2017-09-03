import React from 'react'
import { DragSource } from 'react-dnd'

import CanvasItemTypes from '../canvas/canvasItemTypes'


class DraggableToolboxItem extends React.Component {
  render() {
    const {
      dropEffect,
      connectDragSource,
      children
    } = this.props

    const content = (
      <li style={{cursor: 'move'}}>
        {children}
      </li>
    )

    return connectDragSource(content, {dropEffect})
  }
}

DraggableToolboxItem.defaultProps = {
  itemAttributes: {},
  dropEffect: 'move'
}

//=====================================
//  DND
//-------------------------------------

const toolboxItemSource = {
  beginDrag (props) {
    return {
      itemAttributes: props.itemAttributes,
      children: props.children
    }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default DragSource(CanvasItemTypes.TOOLBOX_ITEM, toolboxItemSource, collect)(DraggableToolboxItem)