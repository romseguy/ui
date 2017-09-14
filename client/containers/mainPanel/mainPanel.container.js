import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { actions as tooltipActions } from 'redux-tooltip'

import bindActionCreators from 'helpers/bindActionCreators'
import { getCanvasNodeAnchorTooltipName } from 'helpers/tooltips'
import { createModes, createToolboxes } from 'lib/factories'
import modeTypes from 'lib/maps/modeTypes'
import sizeTypes from 'lib/maps/sizeTypes'

import { canvasActions, getCanvasNodes, getCanvasNodesLoading, getSelectedNodeIds } from 'core/canvas'
import { mapActions, getMapCenter, getMapNodes, getMapNodesLoading } from 'core/map'
import { routerActions } from 'core/router'
import { getUserLocation } from 'core/settings'

import { Loader } from 'components/layout'


class MainPanelContainer extends Component {
  constructor(props) {
    super(props)
    const {routeType, t} = props
    let currentMode = modeTypes.DISCOVERY

    if ([routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(routeType)) {
      currentMode = modeTypes.EDIT
    }

    this.state = {
      currentMode,
      modes: createModes(t),
      toolboxes: createToolboxes(currentMode, this.setToolboxIsOpen, t)
    }
  }

  componentDidMount() {
    this.setDimensions()
    window.addEventListener('resize', this.setDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setDimensions);
  }

  setCurrentMode = modeKey => {
    this.setState(p => ({
      currentMode: modeKey
    }))
  }

  setDimensions = () => {
    const {innerHeight, innerWidth} = window
    let mapHeight = innerHeight - 60
    let canvasHeight = innerHeight - 125
    let canvasWidth = innerWidth - 30

    if (innerWidth < sizeTypes.tablet) {
      mapHeight = innerHeight - 139
      canvasHeight = innerHeight - 260
      canvasWidth = innerWidth
    }

    this.setState(p => ({
      canvasWidth,
      canvasHeight,
      mapHeight,
      mapWidth: innerWidth
    }))
  }

  setToolboxDisabled = (key, disabled) => {
    this.setState(p => ({
      toolboxes: p.toolboxes.map(toolbox => {
        if (toolbox.key === key) {
          return {
            ...toolbox,
            props: {
              ...toolbox.props,
              isOpen: false
            },
            buttonProps: {
              ...toolbox.buttonProps,
              disabled
            }
          }
        }
        return toolbox
      })
    }))
  }

  setToolboxIsOpen = (key, isOpen) => {
    this.setState(p => ({
      toolboxes: p.toolboxes.map(toolbox => {
        if (toolbox.key === key) {
          const active = isOpen === undefined ? !toolbox.props.isOpen : isOpen
          return {
            ...toolbox,
            props: {
              ...toolbox.props,
              isOpen: active
            },
            buttonProps: {
              ...toolbox.buttonProps,
              active
            }
          }
        }

        return {
          ...toolbox,
          props: {
            ...toolbox.props,
            isOpen: false
          },
          buttonProps: {
            ...toolbox.buttonProps,
            active: false
          }
        }
      })
    }))
  }

  toggleNodeAnchorTooltip = node => {
    const {hideTooltip, showTooltip} = this.props
    const {currentMode} = this.state

    hideTooltip({name: getCanvasNodeAnchorTooltipName(currentMode, node)})
    showTooltip({
      name: getCanvasNodeAnchorTooltipName(currentMode, {...node, selected: !node.selected}),
      origin: `canvas-node__anchor-img-${node.id}`
    })
  }

  handleCanvasClick = () => {
    const {canvasActions} = this.props
    const {selectAllNodes} = canvasActions
    selectAllNodes(false)
    this.setToolboxIsOpen('*', false)
  }

  handleDeleteSelectedNode = node => {
    const {canvasActions} = this.props
    const {removeNode} = canvasActions
    removeNode(node)
  }

  handleMapClick = args => {
    console.log('NIY: MainPanel.handleMapClick', args)
  }

  handleModeChange = modeKey => {
    const {canvasActions} = this.props
    const {selectAllNodes} = canvasActions
    selectAllNodes(false)

    this.setCurrentMode(modeKey)

    if (modeKey === modeTypes.DISCOVERY) {
      this.setToolboxDisabled('entities', true)
      this.setToolboxDisabled('symbols', true)
    } else if (modeKey === modeTypes.EDIT) {
      this.setToolboxDisabled('entities', false)
      this.setToolboxDisabled('symbols', false)
    } else if (modeKey === modeTypes.NOTIFICATION) {
      this.setToolboxDisabled('entities', true)
      this.setToolboxDisabled('symbols', true)
    }
  }

  handleNodeAnchorClick = node => {
    // NIY
  }

  handleNodeAnchorMouseOver = node => {
    const {canvasActions} = this.props
    const {hoverNode} = canvasActions
    hoverNode(true, node)
  }

  handleNodeAnchorMouseOut = node => {
    const {canvasActions} = this.props
    const {hoverNode} = canvasActions
    hoverNode(false, node)
  }

  handleNodeDragEnd = (node, x, y) => {
    let {canvasActions, nodes} = this.props
    const {setNodes} = canvasActions

    if (!nodes.length) {
      nodes = [node]
    }

    setNodes(nodes.map(n => {
      if (node.id === n.id) {
        return {
          ...n,
          x,
          y
        }
      }

      return n
    }))
  }

  handleNodeHeaderClick = node => {
    // NIY
  }

  handleToolboxItemDrop = node => {
    const {canvasActions} = this.props
    const {addNode} = canvasActions
    addNode(node)
  }

  render() {
    const {
      container,
      isLoading,
      ...props
    } = this.props

    const {
      ...state
    } = this.state

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    if (this.props.routeType === routerActions.ROOT) {
      return React.createElement(container, {
        ...props,
        mapHeight: state.mapHeight,
        mapWidth: state.mapWidth,
        toggleNodeAnchorTooltip: this.toggleNodeAnchorTooltip,
        onMapClick: this.handleMapClick,
        onNodeAnchorClick: this.handleNodeAnchorClick,
        onNodeHeaderClick: this.handleNodeHeaderClick,
      })
    }

    return React.createElement(container, {
      ...props,
      ...state,
      toggleNodeAnchorTooltip: this.toggleNodeAnchorTooltip,
      onCanvasClick: this.handleCanvasClick,
      onDeleteSelectedNode: this.handleDeleteSelectedNode,
      onModeChange: this.handleModeChange,
      onNodeAnchorClick: this.handleNodeAnchorClick,
      onNodeAnchorMouseOver: this.handleNodeAnchorMouseOver,
      onNodeAnchorMouseOut: this.handleNodeAnchorMouseOut,
      onNodeDragEnd: this.handleNodeDragEnd,
      onNodeHeaderClick: this.handleNodeHeaderClick,
      onToolboxItemDrop: this.handleToolboxItemDrop,
    })
  }
}

const mapStateToProps = (state, {routeType}) => {
  const userLocation = getUserLocation(state)

  const props = {
    isLoading: userLocation.lat === null || userLocation.lng === null
  }

  // control is a map
  if ([routerActions.ROOT].includes(routeType)) {
    const center = getMapCenter(state)
    const nodes = getMapNodes(state)
    const isLoading =

    props.isLoading = props.isLoading || getMapNodesLoading(state) || center === null

    if (!isLoading) {
      props.center = center
      props.nodes = nodes
    }
  }
  // control is a canvas
  else {
    const nodes = getCanvasNodes(state)
    const isLoading = getCanvasNodesLoading(state)
    const selectedNodeIds = getSelectedNodeIds(state)

    props.isLoading = props.isLoading || isLoading

    if (!isLoading) {
      props.nodes = nodes
    }

    if (selectedNodeIds.length > 0) {
      props.selectedNodeIds = selectedNodeIds

      if (selectedNodeIds.length === 1) {
        props.selectedNode = nodes.find(node => node.id === selectedNodeIds[0])
      }
    }
  }

  return props
}

const mapDispatchToProps = (dispatch, {routeType}) => {
  const actions = {
    hideTooltip: bindActionCreators(tooltipActions.hide, dispatch),
    showTooltip: bindActionCreators(tooltipActions.show, dispatch)
  }

  // control is a map
  if ([routerActions.ROOT].includes(routeType)) {
    actions.mapActions = bindActionCreators(mapActions, dispatch)
  }
  // control is a canvas
  else {
    actions.canvasActions = bindActionCreators(canvasActions, dispatch)
  }

  return actions
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  pure
)(MainPanelContainer)
