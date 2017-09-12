import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { actions as tooltipActions } from 'redux-tooltip'

import bindActionCreators from 'helpers/bindActionCreators'
import { getCanvasNodeAnchorTooltipName } from 'helpers/tooltips'
import modeTypes from 'lib/maps/modeTypes'
import sizeTypes from 'lib/maps/sizeTypes'

import { canvasActions, getCanvasNodes, getSelectedNodeIds } from 'core/canvas'
import { routerActions } from 'core/router'
import { getUserLocation } from 'core/settings'

import { EntitiesToolbox, SymbolsToolbox } from 'containers/toolbox'

import { ToolboxButton } from 'components/toolbox'


class MainPanelContainer extends Component {

  constructor(props) {
    super(props)

    const {routeType, t} = props

    const editModeRouteTypes = [
      routerActions.ME_PLACES_ADD,
      routerActions.ME_PLACE_EDIT
    ]

    const currentMode = editModeRouteTypes.includes(routeType) ? modeTypes.EDIT : modeTypes.DISCOVERY

    this.state = {
      currentMode,
      modes: [{
        key: modeTypes.DISCOVERY,
        labels: {
          active: t('canvas:modes.discovery.labels.active'),
          disabled: t('canvas:modes.discovery.labels.disabled'),
          inactive: t('canvas:modes.discovery.labels.inactive')
        },
        disabled: false,
        iconId: 'search'
      }, {
        key: modeTypes.EDIT,
        labels: {
          active: t('canvas:modes.edit.labels.active'),
          disabled: t('canvas:modes.edit.labels.disabled'),
          inactive: t('canvas:modes.edit.labels.inactive')
        },
        disabled: false,
        iconId: 'edit'
      }, {
        key: modeTypes.NOTIFICATION,
        labels: {
          active: t('canvas:modes.notification.labels.active'),
          disabled: t('canvas:modes.notification.labels.disabled'),
          inactive: t('canvas:modes.notification.labels.inactive')
        },
        disabled: false,
        iconId: 'volume'
      }],
      toolboxes: [{
        key: 'entities',
        button: ToolboxButton,
        buttonProps: {
          active: false,
          disabled: currentMode !== modeTypes.EDIT,
          iconName: 'eye',
          label: t('canvas:entities.label') + 's',
          title: t('canvas:entities.add'),
          toggle: true,
          onClick: () => this.setToolboxIsOpen('entities')
        },
        component: EntitiesToolbox,
        props: {
          isOpen: false,
          key: 'canvas-entities-toolbox',
          onClose: () => this.setToolboxIsOpen('entities', false)
        }
      }, {
        key: 'symbols',
        button: ToolboxButton,
        buttonProps: {
          active: false,
          disabled: currentMode !== modeTypes.EDIT,
          iconName: 'bullseye',
          label: t('canvas:symbols.label') + 's',
          title: t('canvas:symbols.add'),
          toggle: true,
          onClick: () => this.setToolboxIsOpen('symbols')
        },
        component: SymbolsToolbox,
        props: {
          isOpen: false,
          key: 'canvas-symbols-toolbox',
          onClose: () => this.setToolboxIsOpen('entities', false)
        }
      }]
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
      dataContainer,
      ...props
    } = this.props

    const {
      ...state
    } = this.state

    if (this.props.routeType === routerActions.ROOT) {
      return React.createElement(container || dataContainer, {
        ...props,
        mapHeight: state.mapHeight,
        mapWidth: state.mapWidth,
        toggleNodeAnchorTooltip: this.toggleNodeAnchorTooltip,
        onMapClick: this.handleMapClick,
        onNodeAnchorClick: this.handleNodeAnchorClick,
        onNodeHeaderClick: this.handleNodeHeaderClick,
      })
    }

    return React.createElement(container || dataContainer, {
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
  const nodes = getCanvasNodes(state)
  const selectedNodeIds = getSelectedNodeIds(state)
  const props = {
    userLocation: getUserLocation(state)
  }

  if (nodes.length > 0 && ![
      routerActions.ROOT,
      routerActions.ABOUT,
      routerActions.TUTORIAL
    ].includes(routeType)) {
    props.nodes = nodes
  }

  if (selectedNodeIds.length > 0) {
    props.selectedNodeIds = selectedNodeIds

    if (selectedNodeIds.length === 1) {
      props.selectedNode = nodes.find(node => node.id === selectedNodeIds[0])
    }
  }

  return props
}

const mapDispatchToProps = (dispatch, {routeType}) => {
  const actions = {
    canvasActions: bindActionCreators(canvasActions, dispatch),
    hideTooltip: bindActionCreators(tooltipActions.hide, dispatch),
    showTooltip: bindActionCreators(tooltipActions.show, dispatch)
  }

  return actions
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(MainPanelContainer)
