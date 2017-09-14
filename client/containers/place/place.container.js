import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'

import entityTypes from 'lib/maps/entityTypes'
import modeTypes from 'lib/maps/modeTypes'


const handlers = {
  setCreateRoute: props => node => {
    // NIY
  },

  setEditRoute: props => node => {
    // NIY
  },

  onCanvasClick: props => () => {
    // NIY
    const {onCanvasClick} = props

    typeof onCanvasClick === 'function' && onCanvasClick()
  },

  onToolboxItemDrop: props => node => {
    // NIY
    const {onToolboxItemDrop} = props

    typeof onToolboxItemDrop === 'function' && onToolboxItemDrop(node)
  },

  onDeleteSelectedNode: props => node => {
    // NIY
    // todo: delete place_place relation if deletedNode.type === LOCATION
  },

  onEditSelectedNode: props => node => {
    handlers.setEditRoute(props)(node)
  },

  onModeChange: props => key => {
    const {nodes, routePayload, routes, onModeChange} = props
    const {placeViewRoute} = routes

    Promise.all([
      // todo: doUpdatePlacePlaces({nodes})
      // todo: doUpdatePlaceUsers({nodes})
    ]).then(() => {
      placeViewRoute(routePayload)
    })

    typeof onModeChange === 'function' && onModeChange(key)
  },

  onNodeAnchorClick: props => node => {
    const {canvasActions, currentMode, currentUser, routes, toggleNodeAnchorTooltip, onNodeAnchorClick} = props
    const {selectNode} = canvasActions
    const {meRoute, placeViewRoute, userViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === entityTypes.PLACE) {
          placeViewRoute(node.name)
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
  },

  onNodeHeaderClick: props => node => {
    // NIY
  }
}

class PlaceContainer extends Component {
  render() {
    const {
      control,
      currentMode,
      mine,
      modes,
      ...props
    } = this.props

    return React.createElement(control, {
      ...props,
      currentMode,
      modes: modes.map(mode => {
        if (mode.key === modeTypes.EDIT) {
          return {...mode, disabled: !mine}
        }
        return mode
      }),
      readOnly: currentMode !== modeTypes.EDIT
    })
  }
}

const mapStateToProps = state => {
  return {
    mine: false
  }
}

const mapDispatchToProps = {}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(handlers)
)(PlaceContainer)
