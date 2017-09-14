import { filter, not, isNil } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { getFormSyncErrors } from 'redux-form'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import { modalActions, modalConstants } from 'core/modal'
import { routerActions } from 'core/router'

import currentUserQuery from 'graphql/queries/currentUser.query.graphql'
import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'
import loginMutation from 'graphql/mutations/login.mutation.graphql'
import registerMutation from 'graphql/mutations/register.mutation.graphql'

import AuthForm from 'components/authForm'


const steps = {
  FIRST: 'FIRST',
  REGISTER_OK: 'REGISTER_OK'
}


class AuthFormContainer extends Component {
  state = {
    currentStep: steps.FIRST,
    serverErrors: null
  }

  handleError(error) {
    error = JSON.parse(JSON.stringify(error))

    const serverErrors = error.graphQLErrors.map(({message}) => {
      return {
        message // todo format error message
      }
    })

    this.setState(p => ({serverErrors}))
  }

  handleSubmit = (formValues, /*dispatch, props*/) => {
    const {doLogin, doRegister, rootRoute, setModal} = this.props

    switch (this.state.currentStep) {
      case steps.FIRST:
        if (formValues.username) {
          doRegister(formValues)
            .then(result => {
              if (!result.stack) {
                setModal(modalConstants.AUTH, {isOpen: false})
                rootRoute()
                // todo: this.setState(p => ({currentStep: steps.REGISTER_OK}))
              }
            })
            .catch(error => this.handleError(error))
        }
        else {
          doLogin(formValues)
            .then(() => {
              setModal(modalConstants.AUTH, {isOpen: false})
              rootRoute()
            })
            .catch(error => this.handleError(error))
        }
        break

      case steps.REGISTER_OK:
        // todo
        break
    }
  }

  render() {
    const {
      clientErrors,
      t
    } = this.props
    const {
      currentStep,
      serverErrors
    } = this.state

    return (
      <AuthForm
        clientErrors={clientErrors}
        currentStep={currentStep}
        serverErrors={serverErrors}
        steps={steps}
        t={t}
        onSubmit={this.handleSubmit}
      />
    )
  }
}


const mapStateToProps = state => {
  return {
    clientErrors: getFormSyncErrors('AuthForm')(state)
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
  pure
)(AuthFormContainer)
