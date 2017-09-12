import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose, pure } from 'recompose'
import { createSelector } from 'reselect'

import { Loader } from 'components/layout'
import { placeToNode } from 'lib/factories'

import placesQuery from 'graphql/queries/places.query.graphql'


class PlacesDataContainer extends Component {
  render() {
    const {
      control,
      isLoading,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.createElement(control, {
      ...props
    })
  }
}

const getNodes = createSelector(
  r => r.places,
  places => places.map((place, i) => placeToNode(i, place))
)

const placesQueryConfig = {
  props({data, ownProps}) {
    const {
      loading,
      places = []
    } = data

    const {
      isLoading = false,
      userLocation
    } = ownProps

    const props = {
      isLoading: isLoading || loading || userLocation.lat === null || userLocation.lng === null
    }

    if (!props.isLoading) {
      props.nodes = getNodes({places})
    }

    return props
  }
}

export default compose(
  graphql(placesQuery, placesQueryConfig),
  pure
)(PlacesDataContainer)
