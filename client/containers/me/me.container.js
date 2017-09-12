import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'

import { routerActions } from 'core/router'

import entityTypes from 'lib/maps/entityTypes'
import modeTypes from 'lib/maps/modeTypes'
import symbolTypes from 'lib/maps/symbolTypes'

import MeDataContainer from 'dataContainers/me'

import deleteUserPlaceMutation from 'graphql/mutations/deleteUserPlace.mutation.graphql'
import updateUserPlacesMutation from 'graphql/mutations/updateUserPlaces.mutation.graphql'
// todo: import updateUserUsersMutation from 'graphql/mutations/updateUserUsersMutation.graphql'


const handlers = {
  setCreateRoute: props => node => {
    const {routes} = props
    const {mePlacesAddRoute, meSymbolsAddRoute, meUsersAddRoute} = routes

    if (node.type === entityTypes.PLACE) {
      mePlacesAddRoute()
    }
    else if (node.type === entityTypes.PERSON) {
      meUsersAddRoute()
    }
    else if (symbolTypes[node.type]) {
      meSymbolsAddRoute()
    }
  },

  setEditRoute: props => node => {
    const {routes} = props
    const {mePlaceEditRoute, meSymbolEditRoute, meUserEditRoute} = routes

    if (node.type === entityTypes.PLACE) {
      mePlaceEditRoute(node.name)
    }
    else if (node.type === entityTypes.PERSON) {
      meUserEditRoute(node.name)
    }
    else if (symbolTypes[node.type]) {
      meSymbolEditRoute(node.name)
    }
  },

  onCanvasClick: props => () => {
    const {routes, routeType, onCanvasClick} = props
    const {meRoute} = routes

    if (routeType !== routerActions.ME) {
      meRoute()
    }

    typeof onCanvasClick === 'function' && onCanvasClick()
  },

  onDeleteSelectedNode: props => node => {
    const {doDeleteUserPlace, onDeleteSelectedNode} = props

    if (node.idServer) {
      doDeleteUserPlace({placeId: node.idServer})
    }

    typeof onDeleteSelectedNode === 'function' && onDeleteSelectedNode(node)
  },

  onEditSelectedNode: props => node => {
    if (node.isNew) {
      handlers.setCreateRoute(props)(node)
    } else {
      handlers.setEditRoute(props)(node)
    }
  },

  onModeChange: props => async key => {
    const {doUpdateUserPlaces, nodes, routes, onModeChange} = props
    const {meRoute} = routes

    meRoute()

    await Promise.all([
      doUpdateUserPlaces({nodes}),
      // todo: doUpdateUserUsers({nodes})
    ])

    typeof onModeChange === 'function' && onModeChange(key)
  },

  onNodeAnchorClick: props => node => {
    const {canvasActions, currentMode, hideTooltip, routes, showTooltip, toggleNodeAnchorTooltip, onNodeAnchorClick} = props
    const {selectNode} = canvasActions
    const {placeViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === entityTypes.PLACE) {
          placeViewRoute(node.name)
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

      case modeTypes.NOTIFICATION:
        // todo
        break
    }

    typeof onNodeAnchorClick === 'function' && onNodeAnchorClick(node)
  },

  onNodeHeaderClick: props => node => {
    const {canvasActions, currentMode} = props
    const {selectNode} = canvasActions

    if (!node.mine) {
      return
    }

    switch (currentMode) {
      case modeTypes.EDIT:
        selectNode(true, node)

        if (node.isNew) {
          handlers.setCreateRoute(props)(node)
        } else {
          handlers.setEditRoute(props)(node)
        }
        break
    }
  },

  onToolboxItemDrop: props => node => {
    const {onToolboxItemDrop, routes} = props
    const {mePlacesAddRoute, meSymbolsAddRoute, meUsersAddRoute} = routes
    const {type} = node

    if (type === entityTypes.PLACE) {
      mePlacesAddRoute()
    }
    else if (type === entityTypes.PERSON) {
      meUsersAddRoute()
    }
    else if (symbolTypes[type]) {
      meSymbolsAddRoute(type)
    }

    typeof onToolboxItemDrop === 'function' && onToolboxItemDrop(node)
  }
}

class MeContainer extends Component {
  render() {
    return (
      <MeDataContainer {...this.props}/>
    )
  }
}


const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {}

const deleteUserPlaceMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doDeleteUserPlace({placeId}){
        return mutate({
          variables: {
            placeId: Number(placeId)
          }
        })
      }
    }
  }
}

const updateUserPlacesMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doUpdateUserPlaces({nodes}){
        const userPlaces = nodes
          .filter(node => node.type === entityTypes.PLACE && !node.isNew)
          .map(({idServer, x, y}) => ({
            placeId: Number(idServer),
            x: parseFloat(x),
            y: parseFloat(y)
          }))

        return mutate({
          variables: {
            userPlaces
          }
        })
      }
    }
  }
}

/* todo:
 const updateUserUsersMutationConfig = {
 props({ownProps, mutate}) {
 return {
 doUpdateUserUsers({nodes}){
 const userUsers = nodes
 .filter(node => node.type === entityTypes.PERSON && !node.isNew)
 .map(({idServer, x, y}) => ({
 userId: Number(idServer),
 x: parseFloat(x),
 y: parseFloat(y)
 }))

 return mutate({
 variables: {
 userUsers
 },
 })
 }
 }
 }
 }
 */

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(deleteUserPlaceMutation, deleteUserPlaceMutationConfig),
  graphql(updateUserPlacesMutation, updateUserPlacesMutationConfig),
  // todo: graphql(updateUserUsersMutation, updateUserUsersMutationConfig)
  withHandlers(handlers)
)(MeContainer)
