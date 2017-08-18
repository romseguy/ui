import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import { mainPanelActions } from 'core/mainPanel'
import { getUserLocation } from 'core/settings'

import { MapManager } from 'views/components/map'
import { Loader } from 'views/components/layout'
import { placeToNode } from 'views/utils/nodes'

import placesQuery from './places.query.graphql'


class Places extends Component {

  handleMapNodeAnchorClick = (clickedNodeId) => {
    const {nodes, mePlaceViewRoute, placeViewRoute} = this.props
    const clickedNode = nodes[clickedNodeId]

    if (clickedNode.mine) {
      mePlaceViewRoute(clickedNode.name)
    } else {
      placeViewRoute(clickedNode.name)
    }
  }

  render() {
    const {
      isLoading,
      mapHeight,
      mapWidth,
      nodes,
      onMapClick,
      onMapNodeHeaderClick,
      onNodesChange,
      userLocation
    } = this.props

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return (
      <MapManager
        actions={mainPanelActions}
        mapHeight={mapHeight}
        mapWidth={mapWidth}
        nodes={nodes}
        userLocation={userLocation}
        onMapClick={onMapClick}
        onNodeAnchorClick={this.handleMapNodeAnchorClick}
        onNodeHeaderClick={onMapNodeHeaderClick}
        onNodesChange={onNodesChange}
      />
    )
  }
}

//=====================================
//  GRAPHQL
//-------------------------------------

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

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => ({
  userLocation: getUserLocation(state)
})

const mapDispatchToProps = {}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(placesQuery, placesQueryConfig)
)(Places)
