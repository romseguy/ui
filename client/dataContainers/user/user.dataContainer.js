import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import roleTypes from 'lib/maps/roleTypes'

import { Loader } from 'components/layout'

import entityTypes from 'lib/maps/entityTypes'
import modeTypes from 'lib/maps/modeTypes'
import symbolTypes from 'lib/maps/symbolTypes'

import userQuery from './user.query.graphql'


class UserDataContainer extends Component {

  componentDidMount() {
    this.props.canvasActions.setNodes([])
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
      readOnly: currentMode !== modeTypes.EDIT
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
)(UserDataContainer)
