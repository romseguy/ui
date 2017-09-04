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

import { roleTypes } from 'core/constants'
import { canvasActions, getCanvasNodes } from 'core/canvas'
import { getTitle, getUserLocation } from 'core/settings'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { getMeCentre } from 'core/me'

import { getSuggestedDepartment } from 'views/utils/geosuggest'
import { placeToNode } from 'views/utils/nodes'

import { meQuery } from 'views/dataContainers/me'
import PlaceForm, { PlaceFormHeader, PlaceFormLayout } from 'views/components/placeForm'

import placeFormQuery from './place.form.query.graphql'
import createPlaceMutation from './createPlace.mutation.graphql'
import createUserPlaceMutation from './createUserPlace.mutation.graphql'


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
      nodes,
      routes,
      routeType,
      setNodes
    } = props

    const {
      mePlaceEditRoute,
      meRoute
    } = routes

    switch (formValues.action) {
      case 'create':
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

        if (!formValues.department) {
          if (!geocodingResult) {
            geocodingResult = await geo.geocodeCity(formValues.city)
          }

          place = {
            ...place,
            department: getGeocodedDepartment(geocodingResult)
          }
        }

        doCreatePlace({place}).then(({data}) => {
          const {id, title} = data.createPlace

          place = {
            ...place,
            id
          }

          let nodeWasCreated = false
          let newNodes = nodes.map(node => {
            if (node.selected) {
              nodeWasCreated = true
              return placeToNode(node.id, place, true)
            }

            return node
          })

          if (nodeWasCreated) {
            setNodes(newNodes)
          } else {
            setNodes(nodes.concat([placeToNode(nodes.length, place, true)]))
          }

          mePlaceEditRoute(title)
        })

        break

      case 'select':
        const selectedNode = nodes.find(node => node.selected) || {}
        const {x, y} = selectedNode
        const userPlace = {
          placeId: Number(formValues.placeId),
          roleId: roleTypes.FOLLOWER,
          x,
          y
        }

        doCreateUserPlace({userPlace}).then(({data}) => {
          meRoute()
        })
        break

      default:
        if (routeType === routerActions.ME_PLACE_EDIT) {
          doUpdatePlace({place}).then(({data}) => {
            mePlaceEditRoute(data.title)
          })
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
          },
          refetchQueries: [{
            query: meQuery
          }]
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
          refetchQueries: [{
            query: meQuery
          }]
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
