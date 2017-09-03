import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { roleTypes } from 'core/constants'

import { AtomsToolbox, SymbolsToolbox } from 'views/containers/toolbox'

import { Loader } from 'views/components/layout'
import { ToolboxButton } from 'views/components/toolbox'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { deselectAllNodes, personToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'

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
        disabled: false,
        iconId: 'search',
        labels: {
          active: t('canvas:modes.discovery.labels.active'),
          disabled: t('canvas:modes.discovery.labels.disabled'),
          inactive: t('canvas:modes.discovery.labels.inactive')
        },
        onClick: () => {
          this.setModeActive(modeTypes.DISCOVERY)
          this.setToolboxDisabled('atoms', true)
          this.setToolboxDisabled('symbols', true)
        }
      }, {
        key: modeTypes.EDIT,
        active: currentMode === modeTypes.EDIT,
        disabled: false,
        iconId: 'edit',
        labels: {
          active: t('canvas:modes.edit.labels.active'),
          disabled: t('canvas:modes.edit.labels.disabled'),
          inactive: t('canvas:modes.edit.labels.inactive')
        },
        onClick: () => {
          if (this.props.mine) {
            this.setModeActive(modeTypes.EDIT)
            this.setToolboxDisabled('atoms', false)
            this.setToolboxDisabled('symbols', false)
          }
        }
      }, {
        key: modeTypes.NOTIFICATION,
        active: currentMode === modeTypes.NOTIFICATION,
        disabled: false,
        iconId: 'volume',
        labels: {
          active: t('canvas:modes.notification.labels.active'),
          disabled: t('canvas:modes.notification.labels.disabled'),
          inactive: t('canvas:modes.notification.labels.inactive')
        },
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
    const {isLoading, mine, nodes, setNodes} = nextProps

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
    const {nodes, setNodes} = this.props
    deselectAllNodes(nodes, setNodes)()

    this.setState(p => ({
      currentMode: key,
      modes: p.modes.map(mode => {
        if (mode.key === key) {
          return {...mode, active: true}
        }
        return {...mode, active: false}
      })
    }))
  }

  setToolboxDisabled = (key, disabled) => {
    this.setState(p => ({
      toolboxes: p.toolboxes.map(toolbox => {
        if (key === '*' || toolbox.key === key) {
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
        if (key === '*' || toolbox.key === key) {
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
    const {mePlaceViewRoute, placeViewRoute, userViewRoute} = routes

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
        else if (clickedNode.type === atomTypes.PERSON) {
          userViewRoute(clickedNode.name)
        }
        break

      case modeTypes.EDIT:
        hideTooltip({name: getCanvasNodeAnchorTooltipName(currentMode, isNodeSelected)})
        showTooltip({name: getCanvasNodeAnchorTooltipName(currentMode, !isNodeSelected), origin: `canvas-node__anchor-img-${clickedNodeId}`})

        if (isNodeSelected) {
          unselectNode(clickedNodeId)
        } else {
          selectNode(clickedNodeId)
        }
        break
    }
  }

  handleNodeDelete = deletedNode => {
    // todo: delete place_place relation if deletedNode.type === LOCATION
  }

  handleNodeEdit = () => {
    const {nodes} = this.props
    const selectedNode = nodes.find(node => node.selected)
    //this.setEditRoute(selectedNode)
  }

  handleNodeHeaderClick = clickedNodeId => {
  }

  render() {
    const {
      children,
      isLoading,
      mine,
      setNodes,
      ...props
    } = this.props

    const {
      currentMode,
      modes,
      ...state
    } = this.state

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.cloneElement(children, {
      ...props,
      ...state,
      currentMode,
      modes: modes.map(mode => {
        if (mode.key === modeTypes.EDIT) {
          return {...mode, disabled: !mine}
        }
        return mode
      }),
      readOnly: currentMode !== modeTypes.EDIT,
      onCanvasClick: this.handleCanvasClick,
      onDeleteSelectedNode: this.handleNodeDelete,
      onEditSelectedNode: this.handleNodeEdit,
      onNodeAnchorClick: this.handleNodeAnchorClick,
      onNodeHeaderClick: this.handleNodeHeaderClick,
      onNodesChange: setNodes,
      onCanvasItemDrop: this.handleCanvasItemDrop
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
