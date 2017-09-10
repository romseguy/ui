import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { Loader } from 'views/components/layout'
import { placeToNode } from 'views/utils/transformers'

import placesQuery from './places.query.graphql'


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
  props({ownProps, data: {loading, currentUser, myPlaces, places = []}}) {
    let {
      userLocation
    } = ownProps

    let nodes = []

    if (currentUser) {
      nodes = places.map((place, i) => {
        const mine = !!myPlaces.find(myPlace => myPlace.place.id === place.id)
        return placeToNode(i, place, {mine})
      })
    } else {
      nodes = places.map((place, i) => placeToNode(i, place))
    }

    return {
      isLoading: loading || userLocation.lat === null || userLocation.lng === null,
      nodes
    }
  }
}


export default compose(
  graphql(placesQuery, placesQueryConfig)
)(Places)
