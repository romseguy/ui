import { filter, not, isNil, compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { getFormSyncErrors } from 'redux-form'
import { connect } from 'react-redux'

import { authActions } from 'core/auth'
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

const setToken = token => localStorage.setItem('token', token)

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
    switch (this.state.currentStep) {
      case steps.FIRST:
        if (values.username) {
          const {doRegister} = this.props

          doRegister(values)
            .then(result => {
              if (!result.stack) {
                this.setState(p => ({currentStep: steps.REGISTER_OK}))
              }
            })
            .catch(error => this.handleError(error))
        }
        else {
          const {doLogin, setModal, setIsAuthed} = this.props

          doLogin(values)
            .then(() => {
              setModal(modalConstants.AUTH, {isOpen: false})
              setIsAuthed(true)
            })
            .catch(error => this.handleError(error))
        }
        break

      case steps.REGISTER_OK:
        console.log('??', 'todo')
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
  setIsAuthed: authActions.setIsAuthed,
  setModal: modalActions.setModal
}


const loginMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doLogin(variables){
        return mutate({
          variables,
          update: (store, {data: {login: {token}}}) => {
            setToken(token)
          },
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
          update: (store, {data: {register: {token}}}) => {
            setToken(token)
          },
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
