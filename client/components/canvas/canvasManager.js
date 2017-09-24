import React, { Component } from 'react'

import withDragDropContext from 'lib/decorators/withDragDropContext'
import canvasItemTypes from 'lib/maps/canvasItemTypes'

import Toolbar from 'components/toolbar'
import { CanvasTooltips, ToolboxTooltips } from 'components/tooltips'

import Canvas from './canvas'
import CanvasLayout from './canvasLayout'
import CustomDragLayer from './customDragLayer'


const canvasDropItemTypes = [canvasItemTypes.CANVAS_NODE, canvasItemTypes.TOOLBOX_ITEM]

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
    this.setState(p => {
      const level = (p.zoomLevel * 10 + p.zoomIncrement * 10) / 10

      return {
        zoomLevel: level,
        zoomInDisabled: level === p.maxZoom,
        zoomOutDisabled: false
      }
    })
  }
  zoomOut = () => {
    this.setState(p => {
      const level = (p.zoomLevel * 10 - p.zoomIncrement * 10) / 10

      return {
        zoomLevel: level,
        zoomInDisabled: false,
        zoomOutDisabled: level === p.minZoom
      }
    })
  }

  // CANVAS
  handleClick = e => {
    const {onCanvasClick} = this.props

    if (e.target === this.svg) {
      typeof onCanvasClick === 'function' && onCanvasClick(e)
    }
  }
  handleNodeAnchorClick = node => {
    // NIY
    const {onNodeAnchorClick} = this.props

    typeof onNodeAnchorClick === 'function' && onNodeAnchorClick(node)
  }
  handleNodeAnchorMouseOut = node => {
    // NIY
    const {onNodeAnchorMouseOut} = this.props

    typeof onNodeAnchorMouseOut === 'function' && onNodeAnchorMouseOut(node)
  }
  handleNodeAnchorMouseOver = node => {
    // NIY
    const {onNodeAnchorMouseOver} = this.props

    typeof onNodeAnchorMouseOver === 'function' && onNodeAnchorMouseOver(node)
  }
  handleNodeDragEnd = (node, x, y) => {
    // NIY
    const {onNodeDragEnd} = this.props

    typeof onNodeDragEnd === 'function' && onNodeDragEnd(node, x, y)
  }
  handleNodeHeaderClick = node => {
    // NIY
    const {onNodeHeaderClick} = this.props

    typeof onNodeHeaderClick === 'function' && onNodeHeaderClick(node)
  }
  handleToolboxItemDrop = (item, x, y) => {
    const {nodes, onToolboxItemDrop} = this.props

    const node = {
      ...item.itemAttributes,
      height: item.itemAttributes.height + 50,
      id: nodes.length,
      selected: true,
      x,
      y
    }

    typeof onToolboxItemDrop === 'function' && onToolboxItemDrop(node)
  }
  handleWheel = ({deltaX, deltaY}) => {
    const {maxZoom, minZoom, zoomLevel} = this.state

    if (deltaY > 0 && zoomLevel > minZoom) {
      this.zoomOut()
    } else if (zoomLevel < maxZoom) {
      this.zoomIn()
    }
  }

  // TOOLBAR
  handleModeClick = key => {
    const {currentMode, onModeChange} = this.props

    if (currentMode !== key) {
      typeof onModeChange === 'function' && onModeChange(key)
    }
  }

  handleToolbarDeleteClick = node => {
    const {t, onDeleteSelectedNode} = this.props
    /*
     todo:
     in parent data container, display UI confirm depending on user role:
     - GUARDIAN: choose whether delete the place, just user_place, or both
     - FOLLOWER: confirm user_place deletion
     */
    //const confirmed = window.confirm(t('canvas:entities.delete_confirm') + ' ' + node.name)

    typeof onDeleteSelectedNode === 'function' && onDeleteSelectedNode(node)
  }
  handleToolbarEditClick = node => {
    // NIY
    const {onEditSelectedNode} = this.props

    typeof onEditSelectedNode === 'function' && onEditSelectedNode(node)
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
      selectedNode,
      selectedNodeIds = [],
      nodes,
      t,
      toolboxes
    } = this.props

    const {
      zoomLevel,
      zoomOutDisabled,
      zoomInDisabled
    } = this.state

    return (
      <CanvasLayout>
        <CanvasTooltips t={t}/>
        <ToolboxTooltips t={t}/>

        <Toolbar
          currentMode={currentMode}
          deleteDisabled={selectedNodeIds.length !== 1 || readOnly}
          editDisabled={!selectedNode || !selectedNode.mine || readOnly}
          modes={modes}
          selectedNode={selectedNode}
          t={t}
          toolboxes={toolboxes}
          zoomInDisabled={zoomInDisabled}
          zoomOutDisabled={zoomOutDisabled}
          onDeleteClick={this.handleToolbarDeleteClick}
          onEditClick={this.handleToolbarEditClick}
          onModeClick={this.handleModeClick}
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
          onToolboxItemDrop={this.handleToolboxItemDrop}
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
