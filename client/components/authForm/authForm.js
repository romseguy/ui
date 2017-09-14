import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { compose, pure } from 'recompose'

import { Form as UIForm } from 'components/layout'

import AuthFormStep1 from './authFormStep1'


class AuthForm extends Component {
  render() {
    const {
      currentStep,
      clientErrors,
      handleSubmit,
      onSubmit,
      serverErrors,
      steps,
      submitting,
      t
    } = this.props

    const hasClientErrors = Array.isArray(clientErrors) && clientErrors.length > 0
    const hasServerErrors = Array.isArray(serverErrors) && serverErrors.length > 0

    return (
      <UIForm
        error={hasClientErrors || hasServerErrors}
        loading={false}
        onSubmit={handleSubmit(onSubmit)}
      >
        {currentStep === steps.FIRST && (
          <AuthFormStep1
            clientErrors={clientErrors}
            handleSubmit={handleSubmit}
            hasClientErrors={hasClientErrors}
            hasServerErrors={hasServerErrors}
            onSubmit={onSubmit}
            serverErrors={serverErrors}
            submitting={submitting}
            t={t}
          />
        )}

        {currentStep === steps.REGISTER_OK && (
          <h1>{t('form:auth.department_confirm')}</h1>
        )}
      </UIForm>
    )
  }
}

export default compose(
  reduxForm({
    form: 'AuthForm'
  }),
  pure
)(AuthForm)
