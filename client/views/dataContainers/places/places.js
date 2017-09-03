import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { Loader } from 'views/components/layout'
import { placeToNode } from 'views/utils/nodes'

import placesQuery from './places.query.graphql'


class Places extends Component {
  getCenter() {
    const {
      routePayload,
      userLocation
    } = this.props

    return routePayload.center || [userLocation.lat, userLocation.lng]
  }

  handleNodeAnchorClick = (clickedNodeId) => {
    const {nodes, routes} = this.props
    const clickedNode = nodes[clickedNodeId]
    const {mePlaceViewRoute, placeViewRoute} = routes

    if (false /*clickedNode.mine*/) {
      mePlaceViewRoute(clickedNode.name)
    } else {
      placeViewRoute(clickedNode.name)
    }
  }

  render() {
    const {
      children,
      isLoading,
      ...props
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    const center = this.getCenter()

    return React.cloneElement(children, {
      ...props,
      center,
      onNodeAnchorClick: this.handleNodeAnchorClick,
    })
  }
}


const placesQueryConfig = {
  props({ownProps, data: {loading, currentUser, myPlaces, places = []}}) {
    let {
      nodes = [],
      userLocation
    } = ownProps

    if (currentUser) {
      nodes = places.map((place, i) => {
        const mine = !!myPlaces.find(myPlace => myPlace.place.id === place.id)
        return placeToNode(i, place, mine)
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
