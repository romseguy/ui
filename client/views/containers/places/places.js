import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import { getUserLocation } from 'core/settings'

import { Loader } from 'views/components/layout'
import { placeToNode } from 'views/utils/nodes'

import placesQuery from './places.query.graphql'


class Places extends Component {
  handleNodeAnchorClick = (clickedNodeId) => {
    const {nodes, routes} = this.props
    const clickedNode = nodes[clickedNodeId]
    const {mePlaceViewRoute, placeViewRoute} = routes

    if (clickedNode.mine) {
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

    return React.cloneElement(children, {
      ...props,
      onNodeAnchorClick: this.handleNodeAnchorClick,
    })
  }
}


const mapStateToProps = state => ({
  userLocation: getUserLocation(state)
})

const mapDispatchToProps = {}

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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(placesQuery, placesQueryConfig)
)(Places)
