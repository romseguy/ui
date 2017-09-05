import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { centreTypes, roleTypes } from 'core/constants'


import { Loader } from 'views/components/layout'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { personToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'

import placeQuery from './place.query.graphql'


class Place extends Component {

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
    // todo: delete place_place relation if deletedNode.type === LOCATION
  }

  handleEditSelectedNode = node => {
    this.setEditRoute(node)
  }

  handleModeClick = key => {
    const {centre, nodes, routePayload, routes, onModeClick} = this.props
    const {mePlaceViewRoute, placeViewRoute} = routes

    Promise.all([
      // todo: doUpdatePlacePlaces({nodes})
      // todo: doUpdatePlaceUsers({nodes})
    ]).then(() => {
      const payload = {...routePayload, noReset: true}
      if (centre === centreTypes.PERSON) {
        mePlaceViewRoute(payload)
      } else {
        placeViewRoute(payload)
      }
    })

    typeof onModeClick === 'function' && onModeClick(key)
  }

  handleNodeAnchorClick = node => {
    const {canvasActions, currentMode, currentUser, routes, toggleNodeAnchorTooltip, onNodeAnchorClick} = this.props
    const {selectNode} = canvasActions
    const {meRoute, mePlaceViewRoute, placeViewRoute, userViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === atomTypes.LOCATION) {
          if (false /*node.mine*/) {
            mePlaceViewRoute(node.name)
          } else {
            placeViewRoute(node.name)
          }
        }
        else if (node.type === atomTypes.PERSON) {
          if (node.name === currentUser.username) {
            meRoute()
          } else {
            userViewRoute(node.name)
          }
        }
        break

      case modeTypes.EDIT:
        toggleNodeAnchorTooltip(node)

        if (node.selected) {
          selectNode(false, node)
        } else {
          selectNode(true, node)
        }
        break
    }

    typeof onNodeAnchorClick === 'function' && onNodeAnchorClick(node)
  }

  handleNodeHeaderClick = node => {
    // NIY
  }

  render() {
    const {
      canvasActions,
      currentMode,
      children,
      isLoading,
      mine,
      modes,
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
          return {...mode, disabled: !mine}
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
      onNodesChange: canvasActions.setNodes,
      onToolboxItemDrop: this.handleToolboxItemDrop
    })
  }
}


const placeQueryConfig = {
  options: (props) => {
    const {name: placeName} = props.routePayload

    return {
      variables: {
        title: placeName
      }
    }
  },
  props({ownProps, data: {loading, myPlaces, place}}) {
    let {
      nodes = []
    } = ownProps

    let mine = null

    if (!loading) {
      const userPlace = myPlaces.find(myPlace => myPlace.place.id === place.id)
      mine = userPlace && userPlace.role.id === roleTypes.GUARDIAN

      if (!nodes.length) {
        nodes = place.users.map((person, i) => personToNode(i, person))
      } else {
        nodes = nodes.map((node, i) => {
          const user = place.users.find(person => node.type === atomTypes.PERSON && person.id === node.idServer)

          if (user) {
            return {
              ...personToNode(i, user),
              ...node
            }
          }

          return node
        })
      }
    }

    return {
      isLoading: loading,
      mine,
      nodes
    }
  }
}

export default compose(
  graphql(placeQuery, placeQueryConfig)
)(Place)
