import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose, pure, withHandlers } from 'recompose'
import debug from 'lib/helpers/debug'
import modeTypes from 'lib/constants/modeTypes'
import userQuery from 'lib/graphql/queries/user.query.graphql'


class UserDataContainer extends Component {
  componentWillReceiveProps(nextProps) {
    const {
      isLoading,
      user,
      routes
    } = nextProps

    if (!isLoading) {
      if (!user) {
        debug('user 404')
        routes.notFoundRoute()
      }
    }
  }

  render() {
    const {
      control,
      currentMode,
      modes,
      routePayload,
      t,
      ...props
    } = this.props

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
      t
    })
  }
}


const userQueryConfig = {
  options: (props) => {
    return {
      variables: {
        username: props.routePayload.username
      }
    }
  },
  props({data, ownProps}) {
    const {
      loading,
      user
    } = data

    const {
      isLoading = false,
    } = ownProps

    const props = {
      isLoading: isLoading || loading
    }

    if (!loading && user) {
      props.user = user
    }

    return props
  }
}

export default compose(
  graphql(userQuery, userQueryConfig),
  pure
)(UserDataContainer)
