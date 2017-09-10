import PropTypes from 'prop-types'
import { compose } from 'ramda'
import React from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { getContext } from 'recompose'
import { change } from 'redux-form'
import { withHandlers } from 'recompose'
import { merge } from 'ramda'

import geo from 'utils/api/geo'
import { getGeocodedDepartment, getGeocodedProperty } from 'utils/geo'

import { roleTypes } from 'core/constants'
import { canvasActions, getCanvasNodes } from 'core/canvas'
import { getPlaceFormValues } from 'core/form'
import { routerActions } from 'core/router'
import { getTitle, getUserLocation } from 'core/settings'
import { getMeCentre } from 'core/me'

import { formValuesToPlace, placeToNode } from 'views/utils/transformers'
import { getSuggestedDepartment } from 'views/utils/geosuggest'

import PlaceForm, { PlaceFormHeader, PlaceFormLayout } from 'views/components/placeForm'

import placeQuery from '../place.query.graphql'
import placeFormQuery from './place.form.query.graphql'
import createPlaceMutation from './createPlace.mutation.graphql'
import createUserPlaceMutation from './createUserPlace.mutation.graphql'
import updatePlaceMutation from './updatePlace.mutation.graphql'


export const handlers = {
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
      client,
      doCreatePlace,
      doCreateUserPlace,
      doUpdatePlace,
      mine,
      placeId,
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
      let place = await formValuesToPlace(formValues)

      const {data} = await doCreatePlace({place})
      const {id, title} = data.createPlace

      if (selectedNode) {
        nodes = nodes.map(node => {
          if (node.id === selectedNode.id) {
            return placeToNode(selectedNode.id, date.createPlace.place, {
              mine: true,
              x: selectedNode.x,
              y: selectedNode.y
            })
          }
          return node
        })
      } else {
        place = {
          ...place,
          id
        }
        nodes = nodes.concat([placeToNode(nodes.length, place, {mine: true})])
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
        userPlace = {
          ...userPlace,
          x: selectedNode.x,
          y: selectedNode.y
        }
        nodes = nodes.map(node => {
          if (node.id === selectedNode.id) {
            return placeToNode(selectedNode.id, place, {
              mine: false,
              x: selectedNode.x,
              y: selectedNode.y
            })
          }
          return node
        })
      } else {
        nodes = nodes.concat([placeToNode(nodes.length, place, {mine: false})])
      }

      setNodes(nodes)

      await doCreateUserPlace({userPlace})
      meRoute()
    }
    else {
      if (routeType === routerActions.ME_PLACE_EDIT) {
        const place = await formValuesToPlace(formValues)

        const {data: {updatePlace: updatedPlace}} = await doUpdatePlace({placeId, place})

        if (selectedNode) {
          nodes = nodes.map(node => {
            if (node.id === selectedNode.id) {
              return placeToNode(selectedNode.id, updatedPlace, {
                mine,
                x: selectedNode.x,
                y: selectedNode.y
              })
            }
            return node
          })

          setNodes(nodes)
        }
        mePlaceEditRoute(updatedPlace.title)
      }
    }
  },

  onSuggestSelect: props => suggest => {
    const department = getSuggestedDepartment(suggest)
    props.change('PlaceForm', 'department', department)
    props.change('PlaceForm', 'marker', null)
  },

  onViewClick: props => formValues => {
    props.routes.placeViewRoute(formValues.selectedPlaceTitle)
  }
}
function PlaceFormContainer(props) {
  const {
    centre,
    disconnectedPlaces,
    formValues,
    initialValues,
    isLoading,
    mustCreate,
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
        onViewClick={onViewClick}
      />
    </PlaceFormLayout>
  )
}


const mapStateToProps = state => {
  const centre = getMeCentre(state)
  const formValues = getPlaceFormValues(state)
  const nodes = getCanvasNodes(state)
  const title = getTitle(state)
  const userLocation = getUserLocation(state)

  return {
    centre,
    formValues,
    userLocation,
    nodes,
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
        title: props.routePayload.name || ''
      }
    }
  },
  props({data, ownProps}) {
    const {myPlaces, place, places, loading} = data
    const {nodes, routes, routeType} = ownProps
    const selectedNode = nodes.find(node => node.selected)

    let props = {
      isLoading: loading,
      mustCreate: !places || !places.length
    }

    if (place) {
      const {
        id: placeId,
        city,
        department,
        latitude,
        longitude,
        title
      } = place
      const mine = myPlaces.find(myPlace => myPlace.id === placeId)

      props = merge(props, {
        initialValues: {
          city,
          department,
          marker: [latitude, longitude],
          title
        },
        mine,
        placeId
      })
    } else if (
      !loading && [routerActions.ME_PLACE_EDIT].includes(routeType)
      && !selectedNode.isNew
    ) {
      routes.meRoute()
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
      doCreatePlace({place}) {
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
      doCreateUserPlace({userPlace}) {
        return mutate({
          variables: {
            userPlace
          }
        })
      }
    }
  }
}

const updatePlaceMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doUpdatePlace({placeId, place}) {
        return mutate({
          variables: {
            placeId,
            place
          }
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
  graphql(updatePlaceMutation, updatePlaceMutationConfig),
  getContext({client: PropTypes.object}),
  withHandlers(handlers),
  translate(),
)(PlaceFormContainer)
