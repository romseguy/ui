import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose, pure } from 'recompose'

import debug from 'helpers/debug'

import { routerActions } from 'core/router'

import PlaceForm from 'components/placeForm'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'


class PlaceFormDataContainer extends Component {
  state = {
    isScriptLoading: false
  }

  componentWillReceiveProps(nextProps) {
    const {
      isLoading,
      place,
      routes,
      routeType
    } = nextProps

    if (!isLoading) {
      if ([routerActions.ME_PLACE_EDIT].includes(routeType)) {
        if (!place) {
          debug('place 404')
          routes.notFoundRoute()
        }
      }
    }
  }

  setIsScriptLoading = (isScriptLoading) => {
    this.setState(p => ({isScriptLoading}))
  }

  render() {
    const {
      disconnectedPlaces,
      formValues,
      isLoading,
      routeType,
      serverErrors,
      ...props
    } = this.props

    const {
      isScriptLoading,
      ...state
    } = this.state

    const hasServerErrors = Array.isArray(serverErrors) && serverErrors.length > 0
    let showFields = false
    const showSelectFields = !isLoading && formValues.action === 'select'
    let showSelector = false

    if (formValues.action === 'create') {
      showFields = true
      showSelector = true
    }
    else if (formValues.action === 'select') {
      showFields = false
      showSelector = true
    }
    else {
      if (routeType === routerActions.ME_PLACE_EDIT) {
        showSelector = false
        showFields = true
      } else if (routeType === routerActions.ME_PLACES_ADD) {
        if (isLoading) {
          showSelector = true
        } else if (isScriptLoading) {
          showFields = true
        }
        else {
          if (disconnectedPlaces) {
            showSelector = true
          } else {
            showFields = true
          }
        }
      }
    }

    return (
      <PlaceForm
        {...props}
        {...state}
        disconnectedPlaces={disconnectedPlaces}
        formValues={formValues}
        hasServerErrors={hasServerErrors}
        isLoading={isLoading}
        isScriptLoading={isScriptLoading}
        serverErrors={serverErrors}
        setIsScriptLoading={this.setIsScriptLoading}
        showFields={showFields}
        showSelectFields={showSelectFields}
        showSelector={showSelector}
      />
    )
  }
}


const placeQueryConfig = {
  skip: props => {
    if (!props.routePayload.placeTitle) {
      return true
    }

    return false
  },
  options: (props) => {
    return {
      variables: {
        title: props.routePayload.placeTitle
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
      places: []
    }

    if (!loading && places) {
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
      initialValues,
      place,
      places
    } = ownProps

    const props = {
      initialValues,
      isLoading: isLoading || loading,
      mine: false
    }

    if (!loading && myPlaces) {
      // filters out places already belonging to myPlaces
      const disconnectedPlaces = places.filter(place => {
        return !myPlaces.find(userPlace => userPlace.place.id === place.id)
      })

      if (disconnectedPlaces.length > 0) {
        props.disconnectedPlaces = disconnectedPlaces
      }

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
  pure
)(PlaceFormDataContainer)
