import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose, getContext, pure, withHandlers, withState } from 'recompose'
import { change } from 'redux-form'

import getSuggestedDepartment from 'helpers/getSuggestedDepartment'

import { formatErrorMessage, query } from 'helpers/apollo'
import geo from 'lib/api/geo'
import { getGeocodedDepartment, getGeocodedProperty } from 'lib/api/geo'
import { formValuesToPlace, placeToNode } from 'lib/factories'
import roleTypes from 'lib/maps/roleTypes'

import { canvasActions, getCanvasNodes, getCanvasNodesLoading } from 'core/canvas'
import { getPlaceFormValues } from 'core/form'
import { routerActions } from 'core/router'
import { getTitle, getUserLocation } from 'core/settings'

import createPlaceMutation from 'graphql/mutations/createPlace.mutation.graphql'
import createUserPlaceMutation from 'graphql/mutations/createUserPlace.mutation.graphql'
import updatePlaceMutation from 'graphql/mutations/updatePlace.mutation.graphql'
import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'
import PlaceFormDataContainer from './placeForm.dataContainer'


function getServerErrors(error, props) {
  error = JSON.parse(JSON.stringify(error))
  return error.graphQLErrors.map(error => {
    const {field_name, message, value} = error
    props.change('PlaceForm', field_name, '')

    return {
      message: formatErrorMessage(message),
      value,
    }
  })
}

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
      setNodes,
      setServerErrors
    } = props

    const {
      mePlaceEditRoute,
      meRoute
    } = routes

    setServerErrors([])

    let {nodes} = props
    const selectedNode = nodes.find(node => node.selected)

    if (!formValues.action || formValues.action === 'create') {
      let place = await formValuesToPlace(formValues)
      let data = null

      try {
        const res = await doCreatePlace({place})
        data = res.data
      } catch (error) {
        setServerErrors(getServerErrors(error, props))
        return
      }

      const {id, title} = data.createPlace

      if (selectedNode) {
        nodes = nodes.map(node => {
          if (node.id === selectedNode.id) {
            return placeToNode(selectedNode.id, data.createPlace, {
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
      let {place} = await query({
        client,
        query: placeQuery,
        variables: {title: formValues.selectedPlaceTitle},
      }, {
        cache: true,
        from: 'placeForm.container.onSubmit.select'
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
  return (
    <PlaceFormDataContainer {...props}/>
  )
}


const mapStateToProps = state => {
  const formValues = getPlaceFormValues(state)
  const nodes = getCanvasNodes(state)
  const nodesLoading = getCanvasNodesLoading(state)
  const title = getTitle(state)
  const userLocation = getUserLocation(state)

  return {
    formValues,
    isLoading: nodesLoading,
    nodes,
    title,
    userLocation
  }
}

const mapDispatchToProps = {
  change,
  setNodes: canvasActions.setNodes
}

const createPlaceMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreatePlace({place}) {
        return mutate({
          variables: {
            place
          },
          refetchQueries: [{
            query: placesQuery
          }]
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
          },
          refetchQueries: [{
            query: myPlacesQuery
          }]
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
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  graphql(createPlaceMutation, createPlaceMutationConfig),
  graphql(createUserPlaceMutation, createUserPlaceMutationConfig),
  graphql(updatePlaceMutation, updatePlaceMutationConfig),
  getContext({client: PropTypes.object}),
  withState('serverErrors', 'setServerErrors', []),
  withHandlers(handlers),
  pure
)(PlaceFormContainer)
