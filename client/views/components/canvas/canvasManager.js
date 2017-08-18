import React, { Component } from 'react'

import {
  addNode,
  deleteSelectedNode,
  deselectAllNodes,
  deselectNode,
  hoverNode,
  moveNode,
  selectNode,
  toggleNode
} from 'views/utils/nodes'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'
import withDragDropContext from 'views/utils/withDragDropContext'

import Toolbar from 'views/components/toolbar'
import { CanvasTooltips } from 'views/components/tooltips'

import Canvas from './canvas'
import CanvasItemTypes from './canvasItemTypes'
import CanvasLayout from './canvasLayout'
import CustomDragLayer from './customDragLayer'


const canvasDropItemTypes = [CanvasItemTypes.CANVAS_NODE, CanvasItemTypes.TOOLBOX_ITEM]

class CanvasManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      atomsToolboxOpen: props.atomsToolboxOpen,
      maxZoom: props.maxZoom,
      minZoom: props.minZoom,
      zoomIncrement: props.zoomIncrement,
      zoomLevel: props.zoomLevel,
      zoomInDisabled: props.zoomInDisabled,
      zoomOutDisabled: props.zoomOutDisabled
    }
  }

  setSvgReference = ref => {
    if (ref) {
      this.svg = ref
    }
  }

  // STATE TRANSITIONS
  zoomIn = () => {
    const {zoomLevel, zoomIncrement, maxZoom} = this.state

    if (zoomLevel < maxZoom) {
      const level = (zoomLevel * 10 + zoomIncrement * 10) / 10
      this.setState({
        zoomLevel: level,
        zoomInDisabled: level === maxZoom,
        zoomOutDisabled: false
      })
    }
  }
  zoomOut = () => {
    const {zoomLevel, zoomIncrement, minZoom} = this.state

    if (zoomLevel > minZoom) {
      const level = (zoomLevel * 10 - zoomIncrement * 10) / 10
      this.setState({
        zoomLevel: level,
        zoomOutDisabled: level === minZoom,
        zoomInDisabled: false
      })
    }
  }

  // CANVAS
  handleToolboxItemDrop = (item, x, y) => {
    const {nodes, onNodesChange, onToolboxItemDrop} = this.props

    const node = {
      ...item.itemAttributes,
      height: item.itemAttributes.height + 50,
      id: nodes.length,
      mine: true,
      selected: true,
      textColor: 'blue',
      x: x,
      y: y
    }

    addNode(nodes, onNodesChange)(node)
    onToolboxItemDrop && onToolboxItemDrop(item, x, y)
  }
  handleCanvasClick = e => {
    const {nodes, onCanvasClick, onNodesChange} = this.props

    if (e.target === this.svg) {
      deselectAllNodes(nodes, onNodesChange)()
      onCanvasClick && onCanvasClick(e)
    }
  }
  handleCanvasNodeAnchorClick = (id) => {
    const {currentMode, hideTooltip, nodes, onNodeAnchorClick} = this.props
    const clickedNode = nodes[id]

    hideTooltip({name: getCanvasNodeAnchorTooltipName(currentMode, clickedNode.selected)})
    onNodeAnchorClick && onNodeAnchorClick(id)
  }
  handleCanvasNodeAnchorMouseOver = (id) => {
    const {nodes, onNodesChange} = this.props
    hoverNode(nodes, onNodesChange)(id, true)
  }
  handleCanvasNodeAnchorMouseOut = (id) => {
    const {nodes, onNodesChange} = this.props
    hoverNode(nodes, onNodesChange)(id, false)
  }
  handleCanvasNodeDragEnd = (id, x, y) => {
    const {nodes, onNodesChange} = this.props
    moveNode(nodes, onNodesChange)(id, x, y)
  }
  handleCanvasNodeHeaderClick = (id) => {
    const {onNodeHeaderClick} = this.props
    onNodeHeaderClick && onNodeHeaderClick(id)
  }
  handleCanvasWheel = ({deltaX, deltaY}) => {
    if (deltaY > 0) {
      this.zoomOut()
    } else {
      this.zoomIn()
    }
  }

  // TOOLBAR
  handleToolbarDeleteClick = () => {
    const {nodes, onDeleteSelectedNode, onNodesChange} = this.props
    const deletedNode = deleteSelectedNode(nodes, onNodesChange)()
    onDeleteSelectedNode && onDeleteSelectedNode(deletedNode)
  }
  handleToolbarZoomInClick = () => {
    this.zoomIn()
  }
  handleToolbarZoomOutClick = () => {
    this.zoomOut()
  }

  render() {
    const {
      canvasHeight,
      canvasWidth,
      currentMode,
      modes,
      readOnly,
      selectedNodeId,
      nodes,
      t,
      toolboxes,
      onEditSelectedNode
    } = this.props

    const {
      zoomLevel,
      zoomOutDisabled,
      zoomInDisabled
    } = this.state

    const hasSelectedNode = selectedNodeId !== null

    return (
      <CanvasLayout>
        <CanvasTooltips/>

        <Toolbar
          currentMode={currentMode}
          deleteDisabled={!hasSelectedNode || readOnly}
          editDisabled={!hasSelectedNode || readOnly}
          modes={modes}
          t={t}
          toolboxes={toolboxes}
          zoomInDisabled={zoomInDisabled}
          zoomOutDisabled={zoomOutDisabled}
          onDeleteClick={this.handleToolbarDeleteClick}
          onEditClick={onEditSelectedNode}
          onZoomInClick={this.handleToolbarZoomInClick}
          onZoomOutClick={this.handleToolbarZoomOutClick}
        />

        <CustomDragLayer />

        <Canvas
          canvasDropItemTypes={canvasDropItemTypes}
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          currentMode={currentMode}
          nodes={nodes}
          readOnly={readOnly}
          setSvgReference={this.setSvgReference}
          toolboxes={toolboxes}
          zoomLevel={zoomLevel}
          onClick={this.handleCanvasClick}
          onToolboxItemDrop={this.handleToolboxItemDrop}
          onNodeAnchorClick={this.handleCanvasNodeAnchorClick}
          onNodeAnchorMouseOver={this.handleCanvasNodeAnchorMouseOver}
          onNodeAnchorMouseOut={this.handleCanvasNodeAnchorMouseOut}
          onNodeDragEnd={this.handleCanvasNodeDragEnd}
          onNodeHeaderClick={this.handleCanvasNodeHeaderClick}
          onWheel={this.handleCanvasWheel}
        />

      </CanvasLayout>
    )
  }

}

export default withDragDropContext(CanvasManager)
