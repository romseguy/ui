import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { getFormSyncErrors } from 'redux-form'
import { connect } from 'react-redux'
import { compose, pure, withHandlers, withState } from 'recompose'

import { formatErrorMessage } from 'helpers/apollo'
import { authStepsTypes, authTypes } from 'lib/maps/auth'

import { getAuthFormValues } from 'core/form'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions } from 'core/router'

import currentUserQuery from 'graphql/queries/currentUser.query.graphql'
import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import loginMutation from 'graphql/mutations/login.mutation.graphql'
import registerMutation from 'graphql/mutations/register.mutation.graphql'

import AuthForm from 'components/authForm'


function getServerErrors(error) {
  error = JSON.parse(JSON.stringify(error))
  return error.graphQLErrors.map(error => {
    const {field_name, message, value} = error

    return {
      message: formatErrorMessage(message),
      value,
    }
  })
}

const handlers = {
  onSubmit: props => async (formValues, /*dispatch*/) => {
    const {currentAction, currentStep, doLogin, doRegister, rootRoute, setCurrentStep, setServerErrors, setModal} = props
    const isRegister = currentAction === authTypes.REGISTER
    const isForgotten = currentAction === authTypes.FORGOTTEN

    switch (currentStep) {
      case authStepsTypes.FIRST:
        if (isRegister) {
          try {
            const result = await doRegister(formValues)

            if (!result.stack) {
              setModal(modalConstants.AUTH, {isOpen: false})
              rootRoute()
              // todo: setCurrentStep(authStepsTypes.REGISTER_OK)
            }
          } catch (error) {
            setServerErrors(getServerErrors(error))
          }
        }
        else if (isForgotten) {
          // todo
        }
        else {
          try {
            await doLogin(formValues)
            setModal(modalConstants.AUTH, {isOpen: false})
            rootRoute()
          } catch (error) {
            setServerErrors(getServerErrors(error))
          }
        }
        break

      case authStepsTypes.REGISTER_OK:
        // todo
        break
    }
  }
}

function AuthFormContainer(props) {
  return (
    <AuthForm
      {...props}
    />
  )
}

const mapStateToProps = state => {
  return {
    clientErrors: getFormSyncErrors('AuthForm')(state),
    formValues: getAuthFormValues(state)
  }
}

const mapDispatchToProps = {
  setModal: modalActions.setModal,
  rootRoute: routerActions.rootRoute
}

const loginMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doLogin(variables){
        return mutate({
          variables,
          refetchQueries: [{
            query: currentUserQuery
          }, {
            query: myPlacesQuery
          }],
        })
      }
    }
  }
}

const registerMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doRegister(variables){
        return mutate({
          variables,
          refetchQueries: [{
            query: currentUserQuery
          }, {
            query: myPlacesQuery
          }],
        })
      }
    }
  }
}

export default compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  graphql(loginMutation, loginMutationConfig),
  graphql(registerMutation, registerMutationConfig),
  withState('serverErrors', 'setServerErrors', []),
  withState('currentStep', 'setCurrentStep', authStepsTypes.FIRST),
  withState('currentAction', 'setCurrentAction', authTypes.LOGIN),
  withHandlers(handlers),
  pure
)(AuthFormContainer)
