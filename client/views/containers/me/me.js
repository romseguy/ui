import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import { roleTypes } from 'core/constants'
import { mainPanelActions, getCanvasNodes, getSelectedNodeId } from 'core/mainPanel'
import { routerActions } from 'core/router'

import { AtomsToolbox, SymbolsToolbox } from 'views/containers/toolbox'

import { Loader } from 'views/components/layout'
import { ToolboxButton } from 'views/components/toolbox'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { deselectAllNodes, placeToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'

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
        label: t('map:modes.discovery'),
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
        label: t('map:modes.edit'),
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
        label: t('map:modes.notification'),
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
          label: t('map:atoms.label') + 's',
          title: t('map:atoms.add'),
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
          label: t('map:symbols.label') + 's',
          title: t('map:symbols.add'),
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

  handleCanvasNodeAnchorClick = clickedNodeId => {
    const {nodes, routes, setSelectedNodeId} = this.props
    const {currentMode} = this.state
    const {mePlaceViewRoute} = routes
    const clickedNode = nodes[clickedNodeId]

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (clickedNode.type === atomTypes.LOCATION) {
          mePlaceViewRoute(clickedNode.name)
        }
        break

      case modeTypes.EDIT:
        setSelectedNodeId(clickedNode.selected ? null : clickedNodeId)
        break

      case modeTypes.NOTIFICATION:
        // todo
        break
    }
  }

  handleCanvasNodeDelete = deletedNode => {
    const {doDeleteUserPlace} = this.props
    doDeleteUserPlace({placeId: deletedNode.idServer})
  }

  handleCanvasNodeEdit = () => {
    const {nodes} = this.props
    const selectedNode = nodes.find(node => node.selected)
    this.setEditRoute(selectedNode)
  }

  handleCanvasNodeHeaderClick = clickedNodeId => {
    const {nodes, setSelectedNodeId} = this.props
    const {currentMode} = this.state
    const clickedNode = nodes[clickedNodeId]

    if (!clickedNode.mine) {
      return
    }

    switch (currentMode) {
      case modeTypes.EDIT:
        setSelectedNodeId(clickedNodeId)
        this.setEditRoute(clickedNode)
        break
    }
  }

  handleToolboxItemDrop = (item, x, y) => {
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

  render() {
    const {
      children,
      isLoading,
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
      onNodeAnchorClick: this.handleCanvasNodeAnchorClick,
      onNodeHeaderClick: this.handleCanvasNodeHeaderClick,
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

          return placeToNode(
            id,
            {...place, x, y},
            Number(role.id) === roleTypes.GUARDIAN
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


const mapStateToProps = state => ({
  nodes: getCanvasNodes(state),
  selectedNodeId: getSelectedNodeId(state),
})

const mapDispatchToProps = {
  setNodes: mainPanelActions.setNodes,
  setSelectedNodeId: mainPanelActions.setSelectedNodeId
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(deleteUserPlaceMutation, deleteUserPlaceMutationConfig),
  graphql(meQuery, meQueryConfig),
  graphql(updateUserPlacesMutation, updateUserPlacesMutationConfig)
)(Me)
