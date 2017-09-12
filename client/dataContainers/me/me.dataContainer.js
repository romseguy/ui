import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import modeTypes from 'lib/maps/modeTypes'

import { Loader } from 'components/layout'

import meQuery from 'graphql/queries/me.query.graphql'


class MeDataContainer extends Component {
  componentDidMount() {
    this.props.canvasActions.setNodes([])
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
      readOnly: currentMode !== modeTypes.EDIT
    })
  }
}

const meQueryConfig = {
  props({data, ownProps}) {
    const {loading} = data
    const {isLoading = false} = ownProps
    const props = {
      isLoading: isLoading || loading,
    }

    return props
  }
}

export default compose(
  graphql(meQuery, meQueryConfig)
)(MeDataContainer)
