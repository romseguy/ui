import { compose } from 'ramda'
import React from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import { withHandlers } from 'recompose'
import { merge } from 'ramda'

import geo from 'utils/api/geo'
import { getGeocodedLocation, getGeocodedDepartment, getGeocodedProperty } from 'utils/geo'

import { client } from 'core/apollo'
import { roleTypes } from 'core/constants'
import { canvasActions, getCanvasNodes } from 'core/canvas'
import { getTitle, getUserLocation } from 'core/settings'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { getMeCentre } from 'core/me'

import { getSuggestedDepartment } from 'views/utils/geosuggest'
import { placeToNode } from 'views/utils/nodes'

import PlaceForm, { PlaceFormHeader, PlaceFormLayout } from 'views/components/placeForm'

import placeQuery from '../place.query.graphql'
import placeFormQuery from './place.form.query.graphql'
import createPlaceMutation from './createPlace.mutation.graphql'
import createUserPlaceMutation from './createUserPlace.mutation.graphql'


async function getPlace(formValues) {
  // required form fields
  let place = {
    city: formValues.city,
    title: formValues.title,
  }

  let geocodingResult = null

  // optional form fields
  if (formValues.marker) {
    const [latitude, longitude] = formValues.marker

    place = {
      ...place,
      latitude,
      longitude
    }
  } else {
    geocodingResult = await geo.geocodeCity(formValues.city)

    const {lat, lng} = getGeocodedLocation(geocodingResult)

    place = {
      ...place,
      department: getGeocodedDepartment(geocodingResult),
      latitude: lat,
      longitude: lng
    }
  }

  // marker was selected but API roundtrip was too long for department to be geocoded
  if (!formValues.department) {
    if (!geocodingResult) {
      geocodingResult = await geo.geocodeCity(formValues.city)
    }

    place = {
      ...place,
      department: getGeocodedDepartment(geocodingResult)
    }
  }

  return place
}


const handlers = {
  onMapClick: props => ({event, latLng, pixel}) => {
    const [lat, lng] = latLng
    geo.getReverseGeocoding(lat, lng).then(res => {
      const city = getGeocodedProperty(res, 'city')
      const department = getGeocodedDepartment(res)
      props.change('PlaceForm', 'city', city)
      props.change('PlaceForm', 'department', department)
    })
  },

  onSubmit: props => async formValues => {
    const {
      doCreatePlace,
      doCreateUserPlace,
      doUpdatePlace,
      routes,
      routeType,
      setNodes
    } = props

    const {
      mePlaceEditRoute,
      meRoute
    } = routes

    let {nodes} = props
    const selectedNode = nodes.find(node => node.selected)

    if (formValues.action === 'create') {
      let place = await getPlace(formValues)

      const {data} = await doCreatePlace({place})
      const {id, title} = data.createPlace

      if (selectedNode) {
        place = {
          ...place,
          id,
          x: selectedNode.x,
          y: selectedNode.y
        }
        nodes = nodes.map(node => {
          if (node.id === selectedNode.id) {
            return placeToNode(nodes.length, place, true)
          }
          return node
        })
      } else {
        nodes = nodes.concat([placeToNode(nodes.length, place, true)])
      }

      setNodes(nodes)
      mePlaceEditRoute(title)
    }
    else if (formValues.action === 'select') {
      let {data: {place}} = await client.query({
        query: placeQuery,
        variables: {title: formValues.selectedPlaceTitle},
      })

      let userPlace = {
        placeId: Number(place.id),
        roleId: roleTypes.FOLLOWER,
      }

      if (selectedNode) {
        place = {
          ...place,
          x: selectedNode.x,
          y: selectedNode.y
        }
        userPlace = {
          ...userPlace,
          x: selectedNode.x,
          y: selectedNode.y
        }
        nodes = nodes.map(node => {
          if (node.id === selectedNode.id) {
            return placeToNode(nodes.length, place, false)
          }
          return node
        })
      } else {
        nodes = nodes.concat([placeToNode(nodes.length, place, false)])
      }

      setNodes(nodes)

      await doCreateUserPlace({userPlace})
      meRoute()
    }
    else {
      if (routeType === routerActions.ME_PLACE_EDIT) {
        const place = await getPlace(formValues)

        // todo
        const {data} = await doUpdatePlace({place})
        mePlaceEditRoute(data.title)
      }
    }
  },

  onSuggestSelect: props => suggest => {
    const department = getSuggestedDepartment(suggest)
    props.change('PlaceForm', 'department', department)
    props.change('PlaceForm', 'marker', null)
  }
}
function PlaceFormContainer(props) {
  const {
    // state
    centre,
    formValues,
    initialValues,
    userLocation,
    disconnectedPlaces,
    routeType,
    t,
    title,
    // options
    isLoading,
    mustCreate,
    // handlers
    onMapClick,
    onSubmit,
    onSuggestSelect
  } = props

  return (
    <PlaceFormLayout fluid>
      <PlaceFormHeader
        routeType={routeType}
        routeTypes={routerActions}
        t={t}
        title={title}
      />
      <PlaceForm
        formValues={formValues}
        initialValues={initialValues}
        isLoading={isLoading}
        userLocation={userLocation}
        mustCreate={mustCreate}
        disconnectedPlaces={disconnectedPlaces}
        routeType={routeType}
        routeTypes={routerActions}
        t={t}
        onMapClick={onMapClick}
        onSubmit={onSubmit}
        onSuggestSelect={onSuggestSelect}
      />
    </PlaceFormLayout>
  )
}


const mapStateToProps = state => {
  const {name: placeName} = getPayload(state)
  const centre = getMeCentre(state)
  const nodes = getCanvasNodes(state)
  const routeType = getRouteType(state)
  const title = getTitle(state)
  const userLocation = getUserLocation(state)

  return {
    centre,
    formValues: state.form.PlaceForm ? state.form.PlaceForm.values : {},
    userLocation,
    placeName,
    nodes,
    routeType,
    title
  }
}

const mapDispatchToProps = {
  change,
  setNodes: canvasActions.setNodes
}

const placeFormQueryConfig = {
  options: (props) => {
    return {
      variables: {
        title: props.placeName || ''
      }
    }
  },
  props({data}) {
    const {myPlaces, place, places, loading} = data

    let initialValues = {}

    if (place) {
      initialValues = merge(initialValues, {
        city: place.city,
        department: place.department,
        marker: [place.latitude, place.longitude],
        title: place.title
      })
    }

    let props = {
      initialValues,
      isLoading: loading,
      mustCreate: !places || !places.length,
    }

    if (places) {
      props = merge(props, {
        // filters out places already belonging to myPlaces
        disconnectedPlaces: myPlaces ? places.filter(place => {
          return !myPlaces.find(userPlace => userPlace.place.id === place.id)
        }) : places
      })
    }

    return props
  }
}

const createPlaceMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreatePlace({place}){
        return mutate({
          variables: {
            place
          }
        })
      }
    }
  }
}

const createUserPlaceMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreateUserPlace({userPlace}){
        return mutate({
          variables: {
            userPlace
          },
          /*          refetchQueries: [{
           query: meQuery
           }]*/
        })
      }
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(placeFormQuery, placeFormQueryConfig),
  graphql(createPlaceMutation, createPlaceMutationConfig),
  graphql(createUserPlaceMutation, createUserPlaceMutationConfig),
  withHandlers(handlers),
  translate()
)(PlaceFormContainer)
