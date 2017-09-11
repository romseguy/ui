import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { Loader } from 'components/layout'
import { placeToNode } from 'utils/transformers'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'


class Places extends Component {

  handleBoundsChange = data => {
    const {center, zoom, bounds, initial} = data
    const {setMeCenter} = this.props

    setMeCenter(center)
  }

  handleNodeAnchorClick = node => {
    const {routes} = this.props
    const {mePlaceViewRoute, placeViewRoute} = routes

    if (false /*node.mine*/) {
      mePlaceViewRoute(node.name)
    } else {
      placeViewRoute(node.name)
    }
  }

  render() {
    const {
      control,
      isLoading,
      routePayload,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return React.createElement(control, {
      ...props,
      routePayload,
      onBoundsChange: this.handleBoundsChange,
      onNodeAnchorClick: this.handleNodeAnchorClick
    })
  }
}


const placesQueryConfig = {
  props({data, ownProps}) {
    const {
      loading,
      places = []
    } = data

    const {
      isLoading = true,
      userLocation
    } = ownProps

    const props = {
      isLoading: isLoading && loading
    }

    let nodes = []

    return {
      isLoading: loading || userLocation.lat === null || userLocation.lng === null,
      nodes,
      places
    }
  }
}

const myPlacesQueryConfig = {
  props({data, ownProps}) {
    const {
      loading,
      myPlaces,
      places
    } = data

    const {
      currentUser,
      isLoading = true
    } = ownProps

    const props = {
      isLoading: isLoading && loading,
      nodes: []
    }

    if (currentUser) {
      props.nodes = places.map((place, i) => {
        const mine = !!myPlaces.find(myPlace => myPlace.place.id === place.id)
        return placeToNode(i, place, {mine})
      })
    } else {
      props.nodes = places.map((place, i) => placeToNode(i, place))
    }

    return props
  }
}

export default compose(
  graphql(placesQuery, placesQueryConfig),
  graphql(myPlacesQuery, myPlacesQueryConfig)
)(Places)
