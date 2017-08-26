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
      maxZoom: props.maxZoom || 1,
      minZoom: props.minZoom || parseFloat('.5'),
      zoomIncrement: props.zoomIncrement || parseFloat('.25'),
      zoomLevel: props.zoomLevel || 1,
      zoomInDisabled: props.zoomInDisabled || true,
      zoomOutDisabled: props.zoomOutDisabled || false
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
  handleCanvasItemDrop = (item, x, y) => {
    const {nodes, onNodesChange, onCanvasItemDrop} = this.props

    const node = {
      ...item.itemAttributes,
      height: item.itemAttributes.height + 50,
      id: nodes.length,
      selected: true,
      x: x,
      y: y
    }

    addNode(deselectAllNodes(nodes)(), onNodesChange)(node)
    onCanvasItemDrop && onCanvasItemDrop(item, x, y)
  }
  handleCanvasClick = e => {
    const {nodes, onCanvasClick, onNodesChange} = this.props

    if (e.target === this.svg) {
      deselectAllNodes(nodes, onNodesChange)()
      onCanvasClick && onCanvasClick(e)
    }
  }
  handleNodeAnchorClick = (id) => {
    const {currentMode, nodes, onNodeAnchorClick} = this.props
    onNodeAnchorClick && onNodeAnchorClick(id)
  }
  handleNodeAnchorMouseOver = (id) => {
    const {nodes, onNodesChange} = this.props
    hoverNode(nodes, onNodesChange)(id, true)
  }
  handleNodeAnchorMouseOut = (id) => {
    const {nodes, onNodesChange} = this.props
    hoverNode(nodes, onNodesChange)(id, false)
  }
  handleNodeDragEnd = (id, x, y) => {
    const {nodes, onNodesChange} = this.props
    moveNode(nodes, onNodesChange)(id, x, y)
  }
  handleNodeHeaderClick = (id) => {
    const {onNodeHeaderClick} = this.props
    onNodeHeaderClick && onNodeHeaderClick(id)
  }
  handleWheel = ({deltaX, deltaY}) => {
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
      selectedNodeIds,
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

    let selectedNodeType = null

    if (selectedNodeIds.length === 1) {
      const selectedNode = nodes.find(node => node.id === selectedNodeIds[0])

      if (selectedNode) {
        selectedNodeType = selectedNode.type
      }
    }

    return (
      <CanvasLayout>
        <CanvasTooltips/>

        <Toolbar
          currentMode={currentMode}
          deleteDisabled={selectedNodeIds.length !== 1 || readOnly}
          editDisabled={selectedNodeIds.length !== 1 || readOnly}
          modes={modes}
          selectedNodeType={selectedNodeType}
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
          onCanvasItemDrop={this.handleCanvasItemDrop}
          onNodeAnchorClick={this.handleNodeAnchorClick}
          onNodeAnchorMouseOver={this.handleNodeAnchorMouseOver}
          onNodeAnchorMouseOut={this.handleNodeAnchorMouseOut}
          onNodeDragEnd={this.handleNodeDragEnd}
          onNodeHeaderClick={this.handleNodeHeaderClick}
          onWheel={this.handleWheel}
        />

      </CanvasLayout>
    )
  }

}

export default withDragDropContext(CanvasManager)
