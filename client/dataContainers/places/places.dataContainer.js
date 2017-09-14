import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import { mapActions, getMapNodes, getMapNodesLoading } from 'core/map'

import { Loader } from 'components/layout'


class PlacesDataContainer extends Component {
  componentDidMount() {
    this.props.dispatch({type: mapActions.REFETCH_PLACES})
  }

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

const mapStateToProps = (state, {userLocation}) => {
  return {
    isLoading: getMapNodesLoading(state) || userLocation.lat === null || userLocation.lng === null,
    nodes: getMapNodes(state)
  }
}

export default compose(
  connect(mapStateToProps),
  pure
)(PlacesDataContainer)
