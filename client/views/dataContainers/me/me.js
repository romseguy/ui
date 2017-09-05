import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { roleTypes } from 'core/constants'
import { routerActions } from 'core/router'

import { Loader } from 'views/components/layout'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { placeToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'

import meQuery from './me.query.graphql'
import deleteUserPlaceMutation from './deleteUserPlace.mutation.graphql'
import updateUserPlacesMutation from './updateUserPlaces.mutation.graphql'


class Me extends Component {

  componentWillReceiveProps(nextProps) {
    const {canvasActions, isLoading, nodes} = nextProps

    if (!isLoading && isLoading !== this.props.isLoading) {
      canvasActions.setNodes(nodes)
    }
  }

  setEditRoute = node => {
    const {routes} = this.props
    const {mePlaceEditRoute, meSymbolEditRoute, meUserEditRoute} = routes

    if (node.type === atomTypes.LOCATION) {
      mePlaceEditRoute(node.name)
    }
    else if (node.type === atomTypes.PERSON) {
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
      meRoute({noReset: true})
    }

    typeof onCanvasClick === 'function' && onCanvasClick()
  }

  handleToolboxItemDrop = node => {
    const {onToolboxItemDrop, routes} = this.props
    const {mePlacesAddRoute, meSymbolsAddRoute, meUsersAddRoute} = routes
    const {type} = node

    if (type === atomTypes.LOCATION) {
      mePlacesAddRoute()
    }
    else if (type === atomTypes.PERSON) {
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
    this.setEditRoute(node)
  }

  handleModeClick = key => {
    const {doUpdateUserPlaces, nodes, routes, onModeClick} = this.props
    const {meRoute} = routes

    Promise.all([
      doUpdateUserPlaces({nodes}),
      // todo: doUpdateUserUsers({nodes})
    ]).then(() => {
      meRoute({noReset: true})
    })

    typeof onModeClick === 'function' && onModeClick(key)
  }

  handleNodeAnchorClick = node => {
    const {canvasActions, currentMode, hideTooltip, routes, showTooltip, toggleNodeAnchorTooltip, onNodeAnchorClick} = this.props
    const {selectNode} = canvasActions
    const {mePlaceViewRoute, placeViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === atomTypes.LOCATION) {
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
    const {canvasActions, nodes} = this.props
    const {currentMode} = this.state
    const {selectNode} = canvasActions

    if (!node.mine) {
      return
    }

    switch (currentMode) {
      case modeTypes.EDIT:
        selectNode(true, node)
        this.setEditRoute(node)
        break
    }
  }

  render() {
    const {
      canvasActions,
      children,
      currentMode,
      isLoading,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.cloneElement(children, {
      ...props,
      currentMode,
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


const meQueryConfig = {
  props({ownProps, data: {loading, myPlaces, /*refetch*/}}) {
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
        /*
         FIXME:
         myPlaces.forEach(myPlace => {
         let node = nodes.find(node => node.idServer === myPlace.place.id)

         if (!node) {
         node = placeToNode(nodes.length, myPlace.place)
         console.log('??', 'FOUND A MYPLACE WITHOUT CORRESPONDING NODE => CREATING IT', myPlace, node)
         nodes.push(node)
         }
         })
         */

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

const deleteUserPlaceMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doDeleteUserPlace({placeId}){
        return mutate({
          variables: {
            placeId: Number(placeId)
          },
          refetchQueries: [{
            query: meQuery
          }]
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
          .filter(node => node.type === atomTypes.LOCATION)
          .map(({idServer, x, y}) => ({
            placeId: Number(idServer),
            x: parseFloat(x),
            y: parseFloat(y)
          }))

        return mutate({
          variables: {
            userPlaces
          },
          refetchQueries: [{
            query: meQuery
          }]
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
 .filter(node => node.type === atomTypes.PERSON)
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
