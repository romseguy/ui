import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { roleTypes } from 'core/constants'

import { Loader } from 'components/layout'

import { entityTypes } from 'utils/types/entities'
import { modeTypes } from 'utils/canvas'
import { symbolTypes } from 'utils/types/symbols'

import userQuery from './user.query.graphql'


class User extends Component {

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
  }

  handleEditSelectedNode = node => {
    this.setEditRoute(node)
  }

  handleModechange = key => {
    // NIY
    const {onModechange} = this.props
    typeof onModechange === 'function' && onModechange(key)
  }

  handleNodeAnchorClick = node => {
    const {currentMode, routes} = this.props
    const {placeViewRoute, userViewRoute} = routes

    switch (currentMode) {
      case modeTypes.DISCOVERY:
        if (node.type === entityTypes.PLACE) {
          placeViewRoute(node.name)
        }
        else if (node.type === entityTypes.PERSON) {
          userViewRoute(node.name)
        }
        break
    }
  }

  handleNodeDelete = deletedNode => {
    // NIY
  }

  handleNodeHeaderClick = node => {
    // NIY
  }

  render() {
    const {
      control,
      currentMode,
      isLoading,
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
          return {...mode, disabled: true}
        }
        return mode
      }),
      readOnly: currentMode !== modeTypes.EDIT,
      onCanvasClick: this.handleCanvasClick,
      onDeleteSelectedNode: this.handleDeleteSelectedNode,
      onEditSelectedNode: this.handleEditSelectedNode,
      onModechange: this.handleModechange,
      onNodeAnchorClick: this.handleNodeAnchorClick,
      onNodeHeaderClick: this.handleNodeHeaderClick,
      onToolboxItemDrop: this.handleToolboxItemDrop
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
    return {
      isLoading: loading,
      myPlaces,
      user
    }
  }
}

export default compose(
  graphql(userQuery, userQueryConfig)
)(User)
