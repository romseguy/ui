import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import modeTypes from 'lib/maps/modeTypes'

import placeQuery from 'graphql/queries/place.query.graphql'

import { Loader } from 'components/layout'


class PlaceDataContainer extends Component {
  componentDidMount() {
    this.props.canvasActions.setNodes([])
  }

  componentWillReceiveProps(nextProps) {
    const {
      routes
    } = this.props

    if (!nextProps.isLoading && !nextProps.place) {
      routes.rootRoute()
    }
  }

  render() {
    const {
      control,
      currentMode,
      isLoading,
      mine,
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
          return {...mode, disabled: !mine}
        }
        return mode
      }),
      readOnly: currentMode !== modeTypes.EDIT
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
  props({data, ownProps}) {
    const {
      loading,
      place
    } = data

    const {
      isLoading = false
    } = ownProps

    const props = {
      isLoading: isLoading || loading,
      place: null
    }

    if (!loading && place) {
      props.place = place
    }

    return props
  }
}

export default compose(
  graphql(placeQuery, placeQueryConfig)
)(PlaceDataContainer)
