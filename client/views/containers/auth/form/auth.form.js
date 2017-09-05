import { filter, not, isNil, compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { getFormSyncErrors } from 'redux-form'
import { connect } from 'react-redux'

import { modalActions, modalConstants } from 'core/modal'

import { meQuery } from 'views/dataContainers/me'
import { placesQuery } from 'views/dataContainers/places'

import AuthForm from 'views/components/authForm'

import loginMutation from './login.mutation.graphql'
import registerMutation from './register.mutation.graphql'


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

  handleSubmit = (values, /*dispatch, props*/) => {
    const {doLogin, doRegister, setModal} = this.props

    switch (this.state.currentStep) {
      case steps.FIRST:
        if (values.username) {
          doRegister(values)
            .then(result => {
              if (!result.stack) {
                setModal(modalConstants.AUTH, {isOpen: false})
                // todo: this.setState(p => ({currentStep: steps.REGISTER_OK}))
              }
            })
            .catch(error => this.handleError(error))
        }
        else {
          doLogin(values)
            .then(() => {
              setModal(modalConstants.AUTH, {isOpen: false})
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
      clientErrors
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
  setModal: modalActions.setModal
}


const loginMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doLogin(variables){
        return mutate({
          variables,
          refetchQueries: [{
            query: meQuery
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
            query: meQuery
          }],
        })
      }
    }
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(loginMutation, loginMutationConfig),
  graphql(registerMutation, registerMutationConfig)
)(AuthFormContainer)
