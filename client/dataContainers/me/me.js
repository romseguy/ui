import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { roleTypes } from 'core/constants'
import { routerActions } from 'core/router'

import { entityTypes } from 'utils/types/entities'
import { modeTypes } from 'utils/canvas'
import { symbolTypes } from 'utils/types/symbols'

import { Loader } from 'components/layout'

import meQuery from './me.query.graphql'
import deleteUserPlaceMutation from './deleteUserPlace.mutation.graphql'
import updateUserPlacesMutation from './updateUserPlaces.mutation.graphql'


class Me extends Component {

  componentDidMount() {
    this.props.canvasActions.setNodes([])
  }

  setCreateRoute = node => {
    const {routes} = this.props
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
  }

  setEditRoute = node => {
    const {routes} = this.props
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
  }

  handleCanvasClick = () => {
    const {routes, routeType, onCanvasClick} = this.props
    const {meRoute} = routes

    if (routeType !== routerActions.ME) {
      meRoute()
    }

    typeof onCanvasClick === 'function' && onCanvasClick()
  }

  handleToolboxItemDrop = node => {
    const {onToolboxItemDrop, routes} = this.props
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

  handleDeleteSelectedNode = node => {
    const {doDeleteUserPlace, onDeleteSelectedNode} = this.props

    if (node.idServer) {
      doDeleteUserPlace({placeId: node.idServer})
    }

    typeof onDeleteSelectedNode === 'function' && onDeleteSelectedNode(node)
  }

  handleEditSelectedNode = node => {
    if (node.isNew) {
      this.setCreateRoute(node)
    } else {
      this.setEditRoute(node)
    }
  }

  handleModeChange = async key => {
    const {doUpdateUserPlaces, nodes, routes, onModeChange} = this.props
    const { meRoute } = routes

    meRoute()

    await Promise.all([
      doUpdateUserPlaces({nodes}),
      // todo: doUpdateUserUsers({nodes})
    ])

    typeof onModeChange === 'function' && onModeChange(key)
  }

  handleNodeAnchorClick = node => {
    const {canvasActions, currentMode, hideTooltip, routes, showTooltip, toggleNodeAnchorTooltip, onNodeAnchorClick} = this.props
    const {selectNode} = canvasActions
    const {mePlaceViewRoute, placeViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === entityTypes.PLACE) {
          if (false /*node.mine*/) {
            mePlaceViewRoute(node.name)
          } else {
            placeViewRoute(node.name)
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

      case modeTypes.NOTIFICATION:
        // todo
        break
    }

    typeof onNodeAnchorClick === 'function' && onNodeAnchorClick(node)
  }

  handleNodeHeaderClick = node => {
    const {canvasActions, currentMode} = this.props
    const {selectNode} = canvasActions

    if (!node.mine) {
      return
    }

    switch (currentMode) {
      case modeTypes.EDIT:
        selectNode(true, node)

        if (node.isNew) {
          this.setCreateRoute(node)
        } else {
          this.setEditRoute(node)
        }
        break
    }
  }

  render() {
    const {
      control,
      currentMode,
      isLoading,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.createElement(control, {
      ...props,
      currentMode,
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


const meQueryConfig = {
  props({ownProps, data: {loading, myPlaces, /*refetch*/}}) {
    return {
      isLoading: loading,
      myPlaces
    }
  }
}

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
 .filter(node => node.type === entityTypes.PERSON)
 .map(({idServer, x, y}) => ({
 userId: Number(idServer),
 x: parseFloat(x),
 y: parseFloat(y)
 }))

 return mutate({
 variables: {
 userUsers
 },
 refetchQueries: [{
 query: meQuery
 }]
 })
 }
 }
 }
 }
 */

export default compose(
  graphql(deleteUserPlaceMutation, deleteUserPlaceMutationConfig),
  graphql(meQuery, meQueryConfig),
  graphql(updateUserPlacesMutation, updateUserPlacesMutationConfig)
  // todo: graphql(updateUserUsersMutation, updateUserUsersMutationConfig)
)(Me)
