import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'

import { mapActions, getMapCenter } from 'core/map'

import PlacesDataContainer from 'dataContainers/places'


const handlers = {
  onBoundsChange: props => data => {
    const {center, zoom, bounds, initial} = data
    const {setCenter} = props

    setCenter(center)
  },

  onNodeAnchorClick: props => node => {
    const {routes} = props
    const {placeViewRoute} = routes

    placeViewRoute(node.name)
  }
}

class PlacesContainer extends Component {
  render() {
    return (
      <PlacesDataContainer {...this.props}/>
    )
  }
}


const mapStateToProps = state => {
  return {
    center: getMapCenter(state)
  }
}

const mapDispatchToProps = {
  setCenter: mapActions.setCenter
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(handlers)
)(PlacesContainer)
