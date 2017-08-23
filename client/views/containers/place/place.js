import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import { roleTypes } from 'core/constants'
import { mainPanelActions, getCanvasNodes, getSelectedNodeId } from 'core/mainPanel'

import { AtomsToolbox, SymbolsToolbox } from 'views/containers/toolbox'

import { Loader } from 'views/components/layout'
import { ToolboxButton } from 'views/components/toolbox'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { personToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'

import placeQuery from './place.query.graphql'


class Place extends Component {

  constructor(props) {
    super(props)
    const {t} = props
    const currentMode = modeTypes.DISCOVERY

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
    const {/*doUpdatePlacePlaces,*/ nodes} = this.props
    //doUpdatePlacePlaces({nodes})

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
    this.setToolboxIsOpen('*', false)
  }

  handleCanvasNodeAnchorClick = clickedNodeId => {
    const {
      mePlaceViewRoute,
      nodes,
      placeViewRoute,
      setSelectedNodeId
    } = this.props

    const {currentMode} = this.state
    const clickedNode = nodes[clickedNodeId]

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (clickedNode.type === atomTypes.LOCATION) {
          if (clickedNode.mine) {
            mePlaceViewRoute(clickedNode.name)
          } else {
            placeViewRoute(clickedNode.name)
          }
        }
        else if (clickedNode.type === atomTypes.PERSON) {
          // todo: route to USER_VIEW
        }
        break
      case modeTypes.EDIT:
        const isNodeSelected = !clickedNode.selected
        setSelectedNodeId(isNodeSelected ? clickedNodeId : null)
        break
    }
  }

  handleCanvasNodeHeaderClick = clickedNodeId => {
    /*    const {
     nodes,
     mePlaceEditRoute,
     mePlaceViewRoute,
     mePlacesAddRoute,
     placeViewRoute,
     setSelectedNodeId
     } = this.props

     const {
     currentMode
     } = this.state

     const clickedNode = nodes[clickedNodeId]

     if (editMode) {
     setSelectedNodeId(clickedNodeId)

     if (clickedNode.mine) {
     if (clickedNode.idServer) {
     mePlaceEditRoute(clickedNode.name)
     } else {
     mePlacesAddRoute()
     }
     }
     } else if (currentMode === modeTypes.DISCOVERY) {
     if (clickedNode.mine) {
     mePlaceViewRoute(clickedNode.name)
     } else {
     placeViewRoute(clickedNode.name)
     }
     }*/
  }

  handleCanvasNodeDelete = deletedNode => {
    // todo: delete place_place relation if deletedNode.type === LOCATION
  }

  handleCanvasNodeEdit = () => {
    const {nodes} = this.props
    const selectedNode = nodes.find(node => node.selected)
    //this.setEditRoute(selectedNode)
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

    let mine = false

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


const mapStateToProps = state => {
  return {
    nodes: getCanvasNodes(state),
    selectedNodeId: getSelectedNodeId(state),
  }
}

const mapDispatchToProps = {
  setNodes: mainPanelActions.setNodes,
  setSelectedNodeId: mainPanelActions.setSelectedNodeId
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(placeQuery, placeQueryConfig)
)(Place)
