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
import { NodeTooltips, ToolboxTooltips } from 'views/components/tooltips'

import Canvas from './canvas'
import CanvasItemTypes from './canvasItemTypes'
import CanvasLayout from './canvasLayout'
import CustomDragLayer from './customDragLayer'


const canvasDropItemTypes = [CanvasItemTypes.CANVAS_NODE, CanvasItemTypes.TOOLBOX_ITEM]

class CanvasManager extends Component {
  constructor(props) {
    super(props)
    const {
      maxZoom = 1,
      minZoom = parseFloat('.5'),
      zoomIncrement = parseFloat('.25'),
      zoomLevel = 1,
      zoomInDisabled = true,
      zoomOutDisabled = false
    } = props
    this.state = {maxZoom, minZoom, zoomIncrement, zoomInDisabled, zoomLevel, zoomOutDisabled}
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
        zoomInDisabled: false,
        zoomOutDisabled: level === minZoom
      })
    }
  }

  // CANVAS
  handleClick = e => {
    const {nodes, onCanvasClick, onNodesChange} = this.props

    if (e.target === this.svg) {
      deselectAllNodes(nodes, onNodesChange)()
      onCanvasClick && onCanvasClick(e)
    }
  }
  handleItemDrop = (item, x, y) => {
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
  handleNodeAnchorClick = (id) => {
    const {onNodeAnchorClick} = this.props
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
  handleToolbarDeleteClick = (event, selectedNode) => {
    const {nodes, t, onDeleteSelectedNode, onNodesChange} = this.props
    // todo: proper modal
    const confirmed = window.confirm(t('map:atoms.delete_confirm') + ' ' + selectedNode.name)
    if (confirmed) {
      const deletedNode = deleteSelectedNode(nodes, onNodesChange)()
      onDeleteSelectedNode && onDeleteSelectedNode(deletedNode)
    }
  }
  handleToolbarEditClick = (event, selectedNode) => {
    const {onEditSelectedNode} = this.props
    onEditSelectedNode && onEditSelectedNode(selectedNode)
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
      toolboxes
    } = this.props

    const {
      zoomLevel,
      zoomOutDisabled,
      zoomInDisabled
    } = this.state

    let selectedNode = null

    if (selectedNodeIds.length === 1) {
      selectedNode = nodes.find(node => node.id === selectedNodeIds[0])
    }

    return (
      <CanvasLayout>
        <NodeTooltips/>
        <ToolboxTooltips/>

        <Toolbar
          deleteDisabled={selectedNodeIds.length !== 1 || readOnly}
          editDisabled={selectedNodeIds.length !== 1 || readOnly}
          modes={modes}
          selectedNode={selectedNode}
          t={t}
          toolboxes={toolboxes}
          zoomInDisabled={zoomInDisabled}
          zoomOutDisabled={zoomOutDisabled}
          onDeleteClick={this.handleToolbarDeleteClick}
          onEditClick={this.handleToolbarEditClick}
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
          onCanvasItemDrop={this.handleItemDrop}
          onClick={this.handleClick}
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
