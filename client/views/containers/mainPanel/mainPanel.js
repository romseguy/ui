import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { actions as tooltipActions } from 'redux-tooltip'

import { bindActionCreators } from 'utils/redux'

import { canvasActions, getCanvasNodes, getSelectedNodeIds } from 'core/canvas'
import { meActions, getMeCenter, getMeCentre } from 'core/me'
import { routerActions } from 'core/router'
import { getUserLocation } from 'core/settings'

import { modeTypes } from 'views/utils/canvas'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'

import { AtomsToolbox, SymbolsToolbox } from 'views/containers/toolbox'

import { ToolboxButton } from 'views/components/toolbox'


class MainPanelContainer extends Component {

  static getDimensions() {
    const {innerHeight, innerWidth} = window
    let mapHeight = innerHeight - 42
    let canvasHeight = innerHeight - 106
    let canvasWidth = innerWidth - 30

    if (innerWidth < 767) {
      mapHeight = innerHeight - 139
      canvasHeight = innerHeight - 260
      canvasWidth = innerWidth
    }

    return {
      canvasWidth,
      canvasHeight,
      mapHeight,
      mapWidth: innerWidth
    }
  }

  constructor(props) {
    super(props)

    const {routeType, t} = props

    const editModeRouteTypes = [
      routerActions.ME_PLACES_ADD,
      routerActions.ME_PLACE_EDIT
    ]

    const currentMode = editModeRouteTypes.includes(routeType) ? modeTypes.EDIT : modeTypes.DISCOVERY

    this.state = {
      ...MainPanelContainer.getDimensions(),
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
        key: 'atoms',
        button: ToolboxButton,
        buttonProps: {
          active: false,
          disabled: currentMode !== modeTypes.EDIT,
          label: t('canvas:atoms.label') + 's',
          title: t('canvas:atoms.add'),
          toggle: true,
          onClick: () => this.setToolboxIsOpen('atoms')
        },
        component: AtomsToolbox,
        props: {
          isOpen: false,
          key: 'canvas-atoms-toolbox',
          onClose: () => this.setToolboxIsOpen('atoms', false)
        }
      }, {
        key: 'symbols',
        button: ToolboxButton,
        buttonProps: {
          active: false,
          disabled: currentMode !== modeTypes.EDIT,
          label: t('canvas:symbols.label') + 's',
          title: t('canvas:symbols.add'),
          toggle: true,
          onClick: () => this.setToolboxIsOpen('symbols')
        },
        component: SymbolsToolbox,
        props: {
          isOpen: false,
          key: 'canvas-symbols-toolbox',
          onClose: () => this.setToolboxIsOpen('atoms', false)
        }
      }]
    }
  }

  componentDidMount() {
    window.addEventListener('resize', event => {
      this.setState(p => MainPanelContainer.getDimensions())
    })
  }

  setCurrentMode = modeKey => {
    this.setState(p => ({
      currentMode: modeKey
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

    hideTooltip({name: getCanvasNodeAnchorTooltipName(currentMode, node.selected)})
    showTooltip({
      name: getCanvasNodeAnchorTooltipName(currentMode, !node.selected),
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
      this.setToolboxDisabled('atoms', true)
      this.setToolboxDisabled('symbols', true)
    } else if (modeKey === modeTypes.EDIT) {
      this.setToolboxDisabled('atoms', false)
      this.setToolboxDisabled('symbols', false)
    } else if (modeKey === modeTypes.NOTIFICATION) {
      this.setToolboxDisabled('atoms', true)
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
      dataContainer,
      ...props
    } = this.props

    const {
      ...state
    } = this.state

    if (this.props.routeType === routerActions.ROOT) {
      return React.createElement(dataContainer, {
        ...props,
        mapHeight: state.mapHeight,
        mapWidth: state.mapWidth,
        toggleNodeAnchorTooltip: this.toggleNodeAnchorTooltip,
        onMapClick: this.handleMapClick,
        onNodeAnchorClick: this.handleNodeAnchorClick,
        onNodeHeaderClick: this.handleNodeHeaderClick,
      })
    }

    return React.createElement(dataContainer, {
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
  const props = {
    centre: getMeCentre(state),
    nodes: getCanvasNodes(state),
    selectedNodeIds: getSelectedNodeIds(state)
  }

  if (routeType === routerActions.ROOT) {
    props.center = getMeCenter(state)
    props.userLocation = getUserLocation(state)
  }

  return props
}

const mapDispatchToProps = (dispatch, {routeType}) => {
  const actions = {
    hideTooltip: bindActionCreators(tooltipActions.hide, dispatch),
    showTooltip: bindActionCreators(tooltipActions.show, dispatch)
  }

  if (routeType === routerActions.ROOT) {
    actions.setMeCenter = bindActionCreators(meActions.setCenter, dispatch)
  } else {
    actions.canvasActions = bindActionCreators(canvasActions, dispatch)
  }

  return actions
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MainPanelContainer)
