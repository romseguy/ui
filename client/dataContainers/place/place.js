import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { centreTypes, roleTypes } from 'core/constants'

import { Loader } from 'components/layout'

import { entityTypes } from 'utils/types/entities'
import { modeTypes } from 'utils/canvas'
import { symbolTypes } from 'utils/types/symbols'

import placeQuery from 'graphql/queries/place.query.graphql'


class Place extends Component {

  componentDidMount() {
    this.props.canvasActions.setNodes([])
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

  handleModeChange = key => {
    const {centre, nodes, routePayload, routes, onModeChange} = this.props
    const {mePlaceViewRoute, placeViewRoute} = routes

    Promise.all([
      // todo: doUpdatePlacePlaces({nodes})
      // todo: doUpdatePlaceUsers({nodes})
    ]).then(() => {
      if (centre === centreTypes.PERSON) {
        mePlaceViewRoute(routePayload)
      } else {
        placeViewRoute(routePayload)
      }
    })

    typeof onModeChange === 'function' && onModeChange(key)
  }

  handleNodeAnchorClick = node => {
    const {canvasActions, currentMode, currentUser, routes, toggleNodeAnchorTooltip, onNodeAnchorClick} = this.props
    const {selectNode} = canvasActions
    const {meRoute, mePlaceViewRoute, placeViewRoute, userViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === entityTypes.PLACE) {
          if (false /*node.mine*/) {
            mePlaceViewRoute(node.name)
          } else {
            placeViewRoute(node.name)
          }
        }
        else if (node.type === entityTypes.PERSON) {
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
      control,
      currentMode,
      isLoading,
      mine,
      modes,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.createElement(control, {
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
      onModeChange: this.handleModeChange,
      onNodeAnchorClick: this.handleNodeAnchorClick,
      onNodeHeaderClick: this.handleNodeHeaderClick,
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
    return {
      isLoading: loading,
      mine: false, // todo
      myPlaces,
      place
    }
  }
}

export default compose(
  graphql(placeQuery, placeQueryConfig)
)(Place)
