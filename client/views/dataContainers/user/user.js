import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { roleTypes } from 'core/constants'

import { Loader } from 'views/components/layout'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { placeToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'

import userQuery from './user.query.graphql'


class User extends Component {

  componentWillReceiveProps(nextProps) {
    const {canvasActions, isLoading, nodes} = nextProps

    if (!isLoading && isLoading !== this.props.isLoading) {
      canvasActions.setNodes(nodes)
    }
  }

  setEditRoute = node => {
    // NIY
  }

  handleCanvasClick = () => {
    // NIY
    const {onCanvasClick} = this.props

    typeof onCanvasClick === 'function' && onCanvasClick()
  }
  
  handleToolboxItemDrop = node => {
    // NIY
    const {onToolboxItemDrop} = this.props

    typeof onToolboxItemDrop === 'function' && onToolboxItemDrop(node)
  }

  handleDeleteSelectedNode = node => {
    // NIY
  }

  handleEditSelectedNode = node => {
    this.setEditRoute(node)
  }

  handleModeClick = key => {
    // NIY
    const {onModeClick} = this.props
    typeof onModeClick === 'function' && onModeClick(key)
  }

  handleNodeAnchorClick = node => {
    const {currentMode, routes} = this.props
    const {placeViewRoute, userViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === atomTypes.LOCATION) {
          placeViewRoute(node.name)
        }
        else if (node.type === atomTypes.PERSON) {
          userViewRoute(node.name)
        }
        break
    }
  }

  handleNodeDelete = deletedNode => {
    // NIY
  }

  handleNodeHeaderClick = node => {
    // NIY
  }

  render() {
    const {
      children,
      currentMode,
      isLoading,
      modes,
      setNodes,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.cloneElement(children, {
      ...props,
      currentMode,
      modes: modes.map(mode => {
        if (mode.key === modeTypes.EDIT) {
          return {...mode, disabled: true}
        }
        return mode
      }),
      readOnly: currentMode !== modeTypes.EDIT,
      onCanvasClick: this.handleCanvasClick,
      onDeleteSelectedNode: this.handleDeleteSelectedNode,
      onEditSelectedNode: this.handleEditSelectedNode,
      onModeClick: this.handleModeClick,
      onNodeAnchorClick: this.handleNodeAnchorClick,
      onNodeHeaderClick: this.handleNodeHeaderClick,
      onNodesChange: setNodes,
      onToolboxItemDrop: this.handleToolboxItemDrop
    })
  }
}


const userQueryConfig = {
  options: (props) => {
    const {name: username} = props.routePayload

    return {
      variables: {
        username
      }
    }
  },
  props({ownProps, data: {loading, myPlaces, user}}) {
    let {
      nodes = []
    } = ownProps

    if (myPlaces) {
      if (!nodes.length) {
        nodes = myPlaces.map((myPlace, id) => {
          const {place, role, x, y} = myPlace
          const mine = Number(role.id) === roleTypes.GUARDIAN

          return placeToNode(
            id,
            {...place, x, y},
            mine
          )
        })
      } else {
        nodes = nodes.map((node, i) => {
          const myPlace = myPlaces.find(({place}) => node.type === atomTypes.LOCATION && place.id === node.idServer)

          if (myPlace) {
            return {
              ...placeToNode(i, myPlace),
              ...node
            }
          }

          return node
        })
      }
    }

    return {
      isLoading: loading,
      nodes
    }
  }
}

export default compose(
  graphql(userQuery, userQueryConfig)
)(User)
