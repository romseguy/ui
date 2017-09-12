import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { routerActions } from 'core/router'

import PlaceForm from 'components/placeForm'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'


class PlaceFormDataContainer extends Component {
  componentWillReceiveProps(nextProps) {
    const {
      routes,
      routeType
    } = this.props

    if (routeType === routerActions.ME_PLACE_EDIT && !nextProps.isLoading && !nextProps.place) {
      routes.meRoute()
    }
  }

  render() {
    const {
      disconnectedPlaces,
      places,
      ...props
    } = this.props

    return (
      <PlaceForm
        {...props}
        disconnectedPlaces={disconnectedPlaces}
        mustCreate={!places || !places.length || disconnectedPlaces.length === 0}
        routeTypes={routerActions}
      />
    )
  }
}


const placeQueryConfig = {
  options: (props) => {
    return {
      variables: {
        title: props.routePayload.name || ''
      }
    }
  },
  props({data, ownProps}) {
    const {
      place,
      loading
    } = data

    const {
      isLoading = false,
    } = ownProps

    const props = {
      initialValues: {},
      isLoading: isLoading || loading,
      place: null
    }

    if (!loading && place) {
      const {
        id: placeId,
        city,
        department,
        latitude,
        longitude,
        title
      } = place

      props.initialValues = {
        city,
        department,
        marker: [latitude, longitude],
        title
      }

      props.place = place
    }

    return props
  }
}

const placesQueryConfig = {
  props({data, ownProps}) {
    const {
      loading,
      places
    } = data

    const {
      isLoading = false
    } = ownProps

    const props = {
      isLoading: isLoading || loading,
      mustCreate: false,
      places: []
    }

    if (!loading && places) {
      props.mustCreate = places.length === 0
      props.places = places
    }

    return props
  }
}

const myPlacesQueryConfig = {
  props({data, ownProps}) {
    const {
      loading,
      myPlaces
    } = data

    const {
      isLoading = false,
      place,
      places
    } = ownProps

    const props = {
      disconnectedPlaces: [],
      isLoading: isLoading || loading,
      mine: false
    }

    if (!loading && myPlaces) {
      // filters out places already belonging to myPlaces
      props.disconnectedPlaces = places.filter(place => {
        return !myPlaces.find(userPlace => userPlace.place.id === place.id)
      })

      if (place) {
        props.mine = myPlaces.find(myPlace => myPlace.id === place.id)
      }
    }

    return props
  }
}

export default compose(
  graphql(placeQuery, placeQueryConfig),
  graphql(placesQuery, placesQueryConfig),
  graphql(myPlacesQuery, myPlacesQueryConfig),
)(PlaceFormDataContainer)
