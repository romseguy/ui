import { compose } from 'ramda'
import React from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import { withHandlers } from 'recompose'
import { merge } from 'ramda'

import { roleTypes } from 'core/constants'
import { getTitle, getUserLocation } from 'core/settings'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { getMeCentre } from 'core/me'

import { meQuery } from 'views/containers/me'

import { Container } from 'views/components/layout'
import UserForm, { UserFormHeader } from 'views/components/userForm'

import userFormQuery from './user.form.query.graphql'
import createUserMutation from './createUser.mutation.graphql'
import createUserUserMutation from './createUserUser.mutation.graphql'


const handlers = {
  onSubmit: props => formValues => {
    const {
      action, selected,
      city, department, marker, title
    } = formValues

    if (action === 'select') {
      props.doCreateUserUser({userId: selected, roleId: roleTypes.GUARDIAN}).then(data => {
        props.meRoute()
      })
    } else {
      const [latitude, longitude] = marker
      const user = {
        city,
        department,
        latitude,
        longitude,
        title
      }
      props.doCreateUser({user})
    }
  }
}

function UserFormContainer(props) {
  const {
    // state
    centre,
    formValues,
    initialValues,
    userLocation,
    disconnectedUsers,
    routeType,
    title,
    // options
    isLoading,
    mustCreate,
    // actions
    t,
    onSubmit
  } = props

  return (
    <Container fluid>
      <UserFormHeader
        routeType={routeType}
        routeTypes={routerActions}
        t={t}
        title={title}
      />
      <UserForm
        formValues={formValues}
        initialValues={initialValues}
        isLoading={isLoading}
        userLocation={userLocation}
        mustCreate={mustCreate}
        disconnectedUsers={disconnectedUsers}
        routeType={routeType}
        routeTypes={routerActions}
        t={t}
        onSubmit={onSubmit}
      />
    </Container>
  )
}


const mapStateToProps = state => {
  const routeType = getRouteType(state)
  const {name} = getPayload(state)
  const centre = getMeCentre(state)
  const userLocation = getUserLocation(state)
  const title = getTitle(state)

  return {
    centre,
    formValues: state.form.UserForm ? state.form.UserForm.values : {},
    userLocation,
    name,
    routeType,
    title
  }
}

const mapDispatchToProps = {
  change,
  meRoute: routerActions.meRoute
}

const userFormQueryConfig = {
  options: (props) => {
    return {
      variables: {
        username: props.name || ''
      }
    }
  },
  props({data}) {
    const {myUsers, user, users, loading} = data

    let initialValues = {}

    if (user) {
      initialValues = merge(initialValues, {
        city: user.city,
        marker: [user.latitude, user.longitude],
        title: user.title
      })
    }

    let props = {
      initialValues,
      isLoading: loading,
      mustCreate: !users || !users.length,
    }

    if (users) {
      props = merge(props, {
        disconnectedUsers: myUsers ? users.filter(user => {
          return !myUsers.find(userUser => userUser.user.id === user.id)
        }) : users
      })
    }

    return props
  }
}

const createUserMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreateUser({user}){
        return mutate({
          variables: {
            user
          },
          refetchQueries: [{
            query: meQuery
          }]
        })
      }
    }
  }
}

const createUserUserMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreateUserUser({userId, roleId}){
        return mutate({
          variables: {
            userId: Number(userId),
            roleId: Number(roleId)
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
  graphql(userFormQuery, userFormQueryConfig),
  graphql(createUserMutation, createUserMutationConfig),
  graphql(createUserUserMutation, createUserUserMutationConfig),
  withHandlers(handlers),
  translate()
)(UserFormContainer)
