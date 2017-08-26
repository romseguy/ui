import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { actions as tooltipActions } from 'redux-tooltip'

import { roleTypes } from 'core/constants'
import { canvasActions, getCanvasNodes, getSelectedNodeIds } from 'core/canvas'

import { AtomsToolbox, SymbolsToolbox } from 'views/containers/toolbox'

import { Loader } from 'views/components/layout'
import { ToolboxButton } from 'views/components/toolbox'

import { atomTypes } from 'views/utils/atoms'
import { modeTypes } from 'views/utils/canvas'
import { deselectAllNodes, placeToNode } from 'views/utils/nodes'
import { symbolTypes } from 'views/utils/symbols'
import { getCanvasNodeAnchorTooltipName } from 'views/utils/tooltips'

import userQuery from './user.query.graphql'


class User extends Component {

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
          active: t('map:modes.discovery.labels.active'),
          disabled: t('map:modes.discovery.labels.disabled'),
          inactive: t('map:modes.discovery.labels.inactive')
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
          active: t('map:modes.edit.labels.active'),
          disabled: t('map:modes.edit.labels.disabled'),
          inactive: t('map:modes.edit.labels.inactive')
        },
        onClick: () => {
          this.setModeActive(modeTypes.EDIT)
          this.setToolboxDisabled('atoms', false)
          this.setToolboxDisabled('symbols', false)
        }
      }, {
        key: modeTypes.NOTIFICATION,
        active: currentMode === modeTypes.NOTIFICATION,
        disabled: false,
        iconId: 'volume',
        labels: {
          active: t('map:modes.notification.labels.active'),
          disabled: t('map:modes.notification.labels.disabled'),
          inactive: t('map:modes.notification.labels.inactive')
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
    const {meUserEditRoute, meSymbolEditRoute} = routes

    if (node.type === atomTypes.LOCATION) {
      meUserEditRoute(node.name)
    }
    else if (node.type === atomTypes.PERSON) {
      meUserEditRoute(node.name)
    }
    else if (symbolTypes[node.type]) {
      meSymbolEditRoute(node.name)
    }
  }

  setModeActive = key => {
    const {/*doUpdateUserUsers,*/ nodes, setNodes} = this.props
    deselectAllNodes(nodes, setNodes)()
    //doUpdateUserUsers({nodes})

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

  handleNodeAnchorClick = clickedNodeId => {
    const {hideTooltip, nodes, routes, selectNode, showTooltip, unselectNode} = this.props
    const {currentMode} = this.state
    const {placeViewRoute, userViewRoute} = routes

    const clickedNode = nodes[clickedNodeId]
    const isNodeSelected = clickedNode.selected

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (clickedNode.type === atomTypes.LOCATION) {
          placeViewRoute(clickedNode.name)
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

  handleNodeHeaderClick = clickedNodeId => {
    /*    const {
     nodes,
     meUserEditRoute,
     meUserViewRoute,
     meUsersAddRoute,
     userViewRoute,
     selectNode
     } = this.props

     const {
     currentMode
     } = this.state

     const clickedNode = nodes[clickedNodeId]

     if (editMode) {
     selectNode(clickedNodeId)

     if (clickedNode.mine) {
     if (clickedNode.idServer) {
     meUserEditRoute(clickedNode.name)
     } else {
     meUsersAddRoute()
     }
     }
     } else if (currentMode === modeTypes.DISCOVERY) {
     if (clickedNode.mine) {
     meUserViewRoute(clickedNode.name)
     } else {
     userViewRoute(clickedNode.name)
     }
     }*/
  }

  handleCanvasNodeDelete = deletedNode => {
    // todo: delete user_user relation if deletedNode.type === LOCATION
  }

  handleCanvasNodeEdit = () => {
    const {nodes} = this.props
    const selectedNode = nodes.find(node => node.selected)
    //this.setEditRoute(selectedNode)
  }

  handleCanvasItemDrop = (item, x, y) => {
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


const userQueryConfig = {
  options: (props) => {
    const {name: username} = props.routePayload

    return {
      variables: {
        username
      }
    }
  },
  props({ownProps, data: {loading, myPlaces, user}}) {
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


const mapStateToProps = state => {
  return {
    nodes: getCanvasNodes(state),
    selectedNodeIds: getSelectedNodeIds(state),
  }
}

const mapDispatchToProps = {
  hideTooltip: tooltipActions.hide,
  setNodes: canvasActions.setNodes,
  selectNode: canvasActions.selectNode,
  showTooltip: tooltipActions.show
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(userQuery, userQueryConfig)
)(User)
