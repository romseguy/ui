import { compose } from 'ramda'
import React from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import { withHandlers } from 'recompose'
import { merge } from 'ramda'

import { roles } from 'core/constants'
import { getCanvasNodes } from 'core/mainPanel'
import { getTitle, getUserLocation } from 'core/settings'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { getMeCentre } from 'core/me'

import { meQuery } from 'views/containers/me'
import { Container } from 'views/components/layout'
import PlaceForm, { PlaceFormHeader } from 'views/components/placeForm'

import placeFormQuery from './place.form.query.graphql'
import createPlaceMutation from './createPlace.mutation.graphql'
import createUserPlaceMutation from './createUserPlace.mutation.graphql'


const handlers = {
  onSubmit: props => formValues => {
    const {
      action, placeId,
      city, department, marker, title
    } = formValues

    const {nodes} = props
    const selectedNode = nodes.find(node => node.selected) || {}
    const {x = 0, y = 0} = selectedNode

    switch (action) {
      case 'select':
        const userPlace = {
          placeId: Number(placeId),
          roleId: roles.GUARDIAN,
          x,
          y
        }
        props.doCreateUserPlace({userPlace}).then(data => {
          props.meRoute()
        })
        break

      case 'create':
        const [latitude, longitude] = marker
        const place = {
          city,
          department,
          latitude,
          longitude,
          title,
          x,
          y
        }
        props.doCreatePlace({place})
        break
    }
  },
  onSuggestSelect: props => suggest => {
    const {short_name: city} = suggest.gmaps.address_components.find(address_component => {
      return address_component.types.includes('locality')
    })

    const {short_name: department} = suggest.gmaps.address_components.find(address_component => {
      return address_component.types.includes('administrative_area_level_2')
    })

    props.change('PlaceForm', 'city', city)
    props.change('PlaceForm', 'department', department)
  }
}
function PlaceFormContainer(props) {
  const {
    // state
    centre,
    formValues,
    initialValues,
    userLocation,
    disconnectedPlaces,
    routeType,
    title,
    // options
    isLoading,
    mustCreate,
    // actions
    t,
    onSubmit,
    onSuggestSelect
  } = props

  return (
    <Container fluid>
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
        onSubmit={onSubmit}
        onSuggestSelect={onSuggestSelect}
      />
    </Container>
  )
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => {
  const {name} = getPayload(state)
  const centre = getMeCentre(state)
  const nodes = getCanvasNodes(state)
  const routeType = getRouteType(state)
  const title = getTitle(state)
  const userLocation = getUserLocation(state)

  return {
    centre,
    formValues: state.form.PlaceForm ? state.form.PlaceForm.values : {},
    userLocation,
    name,
    nodes,
    routeType,
    title
  }
}

const mapDispatchToProps = {
  change,
  meRoute: routerActions.meRoute
}

//=====================================
//  GRAPHQL
//-------------------------------------
const placeFormQueryConfig = {
  options: (props) => {
    return {
      variables: {
        title: props.name || ''
      }
    }
  },
  props({data}) {
    const {myPlaces, place, places, loading} = data

    let initialValues = {}

    if (place) {
      initialValues = merge(initialValues, {
        city: place.city,
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

const createUserPlaceMutationConfig = {
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
