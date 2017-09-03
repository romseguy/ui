import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { roleTypes } from 'core/constants'
import { routerActions } from 'core/router'

import { AtomsToolbox, SymbolsToolbox } from 'views/containers/toolbox'

import { Loader } from 'views/components/layout'
import { ToolboxButton } from 'views/components/toolbox'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { deselectAllNodes, placeToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'

import meQuery from './me.query.graphql'
import deleteUserPlaceMutation from './deleteUserPlace.mutation.graphql'
import updateUserPlacesMutation from './updateUserPlaces.mutation.graphql'


class Me extends Component {

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
        active: currentMode === modeTypes.DISCOVERY,
        labels: {
          active: t('canvas:modes.discovery.labels.active'),
          disabled: t('canvas:modes.discovery.labels.disabled'),
          inactive: t('canvas:modes.discovery.labels.inactive')
        },
        disabled: false,
        iconId: 'search',
        onClick: () => {
          this.setModeActive(modeTypes.DISCOVERY)
          this.setToolboxDisabled('atoms', true)
          this.setToolboxDisabled('symbols', true)
        }
      }, {
        key: modeTypes.EDIT,
        active: currentMode === modeTypes.EDIT,
        labels: {
          active: t('canvas:modes.edit.labels.active'),
          disabled: t('canvas:modes.edit.labels.disabled'),
          inactive: t('canvas:modes.edit.labels.inactive')
        },
        disabled: false,
        iconId: 'edit',
        onClick: () => {
          this.setModeActive(modeTypes.EDIT)
          this.setToolboxDisabled('atoms', false)
          this.setToolboxDisabled('symbols', false)
        }
      }, {
        key: modeTypes.NOTIFICATION,
        active: currentMode === modeTypes.NOTIFICATION,
        labels: {
          active: t('canvas:modes.notification.labels.active'),
          disabled: t('canvas:modes.notification.labels.disabled'),
          inactive: t('canvas:modes.notification.labels.inactive')
        },
        disabled: false,
        iconId: 'volume',
        onClick: () => {
          this.setModeActive(modeTypes.NOTIFICATION)
          this.setToolboxDisabled('atoms', true)
          this.setToolboxDisabled('symbols', true)
        }
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

  componentWillReceiveProps(nextProps) {
    const {isLoading, setNodes, nodes} = nextProps

    if (!isLoading && isLoading !== this.props.isLoading) {
      setNodes(nodes)
    }
  }

  setEditRoute = (node) => {
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

  setModeActive = key => {
    const {doUpdateUserPlaces, nodes, setNodes} = this.props
    deselectAllNodes(nodes, setNodes)()
    doUpdateUserPlaces({nodes})

    this.setState(p => ({
      currentMode: key,
      modes: p.modes.map(mode => {
        if (mode.key === key) {
          return {
            ...mode,
            active: true
          }
        }

        return {
          ...mode,
          active: false
        }
      })
    }))
  }

  setToolboxDisabled = (key, disabled) => {
    this.setState(p => ({
      toolboxes: p.toolboxes.map(toolbox => {
        if (toolbox.key === key) {
          return {
            ...toolbox,
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

  handleCanvasClick = () => {
    const {routes, routeType} = this.props
    const {meRoute} = routes

    if (routeType !== routerActions.ME) {
      meRoute({noReset: true})
    }
    this.setToolboxIsOpen('*', false)
  }

  handleCanvasItemDrop = (item, x, y) => {
    const {routes} = this.props
    const {mePlacesAddRoute, meSymbolsAddRoute, meUsersAddRoute} = routes
    const {type} = item.itemAttributes

    if (type === atomTypes.LOCATION) {
      mePlacesAddRoute()
    }
    else if (type === atomTypes.PERSON) {
      meUsersAddRoute()
    }
    else if (symbolTypes[type]) {
      meSymbolsAddRoute()
    }
  }

  handleNodeAnchorClick = clickedNodeId => {
    const {hideTooltip, nodes, routes, selectNode, showTooltip, unselectNode} = this.props
    const {currentMode} = this.state
    const {mePlaceViewRoute, placeViewRoute} = routes

    const clickedNode = nodes[clickedNodeId]
    const isNodeSelected = clickedNode.selected

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (clickedNode.type === atomTypes.LOCATION) {
          if (false /*clickedNode.mine*/) {
            mePlaceViewRoute(clickedNode.name)
          } else {
            placeViewRoute(clickedNode.name)
          }
        }
        break

      case modeTypes.EDIT:
        hideTooltip({name: getCanvasNodeAnchorTooltipName(currentMode, isNodeSelected)})
        showTooltip({
          name: getCanvasNodeAnchorTooltipName(currentMode, !isNodeSelected),
          origin: `canvas-node__anchor-img-${clickedNodeId}`
        })

        if (isNodeSelected) {
          unselectNode(clickedNodeId)
        } else {
          selectNode(clickedNodeId)
        }
        break

      case modeTypes.NOTIFICATION:
        // todo
        break
    }
  }

  handleCanvasNodeDelete = deletedNode => {
    const {doDeleteUserPlace, onDeleteSelectedNode} = this.props
    doDeleteUserPlace({placeId: deletedNode.idServer})

    typeof onDeleteSelectedNode === 'function' && onDeleteSelectedNode(deletedNode)
  }

  handleCanvasNodeEdit = (selectedNode) => {
    this.setEditRoute(selectedNode)
  }

  handleNodeHeaderClick = clickedNodeId => {
    const {nodes, selectNode} = this.props
    const {currentMode} = this.state
    const clickedNode = nodes[clickedNodeId]

    if (!clickedNode.mine) {
      return
    }

    switch (currentMode) {
      case modeTypes.EDIT:
        selectNode(clickedNodeId)
        this.setEditRoute(clickedNode)
        break
    }
  }

  render() {
    const {
      children,
      isLoading,
      setNodes,
      ...props
    } = this.props

    const {
      currentMode,
      ...state
    } = this.state

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.cloneElement(children, {
      ...props,
      ...state,
      currentMode,
      readOnly: currentMode !== modeTypes.EDIT,
      onCanvasClick: this.handleCanvasClick,
      onDeleteSelectedNode: this.handleCanvasNodeDelete,
      onEditSelectedNode: this.handleCanvasNodeEdit,
      onNodeAnchorClick: this.handleNodeAnchorClick,
      onNodeHeaderClick: this.handleNodeHeaderClick,
      onNodesChange: setNodes,
      onCanvasItemDrop: this.handleCanvasItemDrop
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
        return mutate({
          variables: {
            userPlaces: nodes.map(({idServer, x, y}) => ({
              placeId: Number(idServer),
              x: parseFloat(x),
              y: parseFloat(y)
            }))
          },
          refetchQueries: [{
            query: meQuery
          }]
        })
      }
    }
  }
}

export default compose(
  graphql(deleteUserPlaceMutation, deleteUserPlaceMutationConfig),
  graphql(meQuery, meQueryConfig),
  graphql(updateUserPlacesMutation, updateUserPlacesMutationConfig)
)(Me)
