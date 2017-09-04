import { compose } from 'ramda'
import React, { Component } from 'react'
import { withHandlers } from 'recompose'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { actions as tooltipActions } from 'redux-tooltip'

import { canvasActions, getCanvasNodes, getSelectedNodeIds } from 'core/canvas'
import { routerActions } from 'core/router'
import { getUserLocation } from 'core/settings'


const handlers = {
  onCanvasClick: props => () => {
    props.unselectAllNodes()
  },

  onDeleteSelectedNode: props => deletedNode => {
    props.unselectAllNodes()
  },

  onModeClick: props => () => {
    const {routes, unselectAllNodes} = props
    const {meRoute} = routes

    unselectAllNodes()
    meRoute({noReset: true})
  }
}

class MainPanelContainer extends Component {

  static getDimensions() {
    const {innerHeight, innerWidth} = window
    let mapHeight = innerHeight - 47
    let canvasHeight = innerHeight - 112
    let canvasWidth = innerWidth - 30

    if (innerWidth < 767) {
      mapHeight = innerHeight - 109
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

  state = {
    ...MainPanelContainer.getDimensions(),
  }

  componentDidMount() {
    window.addEventListener('resize', event => {
      this.setState(MainPanelContainer.getDimensions())
    })
  }

  render() {
    const {
      children,
      ...props
    } = this.props

    const {
      ...state
    } = this.state

    return React.cloneElement(children, {
      ...state,
      ...props
    })
  }
}


const mapStateToProps = (state, {routeType}) => {
  const props = {
    nodes: getCanvasNodes(state),
    selectedNodeIds: getSelectedNodeIds(state)
  }

  if (routeType === routerActions.ROOT) {
    props.userLocation = getUserLocation(state)
  }

  return props
}

const mapDispatchToProps = {
  hideTooltip: tooltipActions.hide,
  setNodes: canvasActions.setNodes,
  selectNode: canvasActions.selectNode,
  showTooltip: tooltipActions.show,
  unselectAllNodes: canvasActions.unselectAllNodes,
  unselectNode: canvasActions.unselectNode
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers(handlers)
)(MainPanelContainer)
