import { compose } from 'ramda'
import React from 'react'
import { graphql } from 'react-apollo'

import { routerActions } from 'core/router'

import PlaceForm from 'components/placeForm'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'


function PlaceFormContainer(props) {
  const {
    centre,
    disconnectedPlaces,
    formValues,
    initialValues,
    isLoading,
    places,
    routeType,
    t,
    title,
    userLocation,
    onMapClick,
    onSubmit,
    onSuggestSelect,
    onViewClick
  } = props

  return (
    <PlaceForm
      formValues={formValues}
      initialValues={initialValues}
      isLoading={isLoading}
      userLocation={userLocation}
      mustCreate={!places || !places.length}
      disconnectedPlaces={disconnectedPlaces}
      routeType={routeType}
      routeTypes={routerActions}
      t={t}
      title={title}
      onMapClick={onMapClick}
      onSubmit={onSubmit}
      onSuggestSelect={onSuggestSelect}
      onViewClick={onViewClick}
    />
  )
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
      isLoading = true,
      nodes,
      routes,
      routeType
    } = ownProps

    const props = {
      isLoading: isLoading && loading,
    }

    const selectedNode = nodes.find(node => node.selected)

    if (place) {
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

      props.placeId = placeId
    } else if (
      !loading && [routerActions.ME_PLACE_EDIT].includes(routeType)
      && !selectedNode.isNew
    ) {
      routes.meRoute()
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
      isLoading = true
    } = ownProps

    const props = {
      isLoading: isLoading && loading,
      mustCreate: !places || !places.length,
      places
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
      isLoading = true,
      placeId,
      places
    } = ownProps

    const props = {
      disconnectedPlaces: [],
      isLoading: isLoading && loading,
      mine: false
    }

    if (placeId) {
      props.mine = myPlaces.find(myPlace => myPlace.id === placeId)
    }

    if (myPlaces && places) {
      // filters out places already belonging to myPlaces
      props.disconnectedPlaces = places.filter(place => {
        return !myPlaces.find(userPlace => userPlace.place.id === place.id)
      })
    }

    return props
  }
}

export default compose(
  graphql(placeQuery, placeQueryConfig),
  graphql(placesQuery, placesQueryConfig),
  graphql(myPlacesQuery, myPlacesQueryConfig),
)(PlaceFormContainer)
