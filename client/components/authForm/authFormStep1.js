import React, { Component } from 'react'

import { Field } from 'redux-form'
import { AuthFormBreakpoints as breakpoints } from 'lib/maps/breakpoints'
import { confirmation, email, length, required } from 'helpers/form/validators'

import InputField from 'components/inputField'
import {
  Button,
  Form as UIForm,
  Grid,
  Icon,
  Message,
  Row,
  NoPadCol as Col
} from 'components/layout'


const actions = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  FORGOTTEN: 'FORGOTTEN'
}


class AuthFormStep1 extends Component {
  state = {currentAction: actions.LOGIN}

  componentDidMount() {
    this.focusEmptyInput()
  }

  focusEmptyInput() {
    const isRegister = this.state.currentAction === actions.REGISTER
    const isForgotten = this.state.currentAction === actions.FORGOTTEN
    const emailInput = this.emailInput.getRenderedComponent()
    const usernameInput = isRegister && this.usernameInput.getRenderedComponent()
    const passwordInput = !isForgotten && this.passwordInput.getRenderedComponent()
    const password2Input = isRegister && this.password2Input.getRenderedComponent()

    if (!emailInput.input.value.length) {
      emailInput.focusInput()
    }
    else if (isRegister && !usernameInput.input.value.length) {
      usernameInput.focusInput()
    }
    else if (!isForgotten && passwordInput && !passwordInput.input.value.length) {
      passwordInput.focusInput()
    }
    else if (isRegister && !password2Input.input.value.length) {
      password2Input.focusInput()
    }
  }

  handleForgottenClick = event => {
    const isForgotten = this.state.currentAction === actions.FORGOTTEN

    if (!isForgotten) {
      this.setState({currentAction: actions.FORGOTTEN}, this.focusEmptyInput)
    } else {
      const {
        onSubmit,
        handleSubmit
      } = this.props

      handleSubmit(event, values => onSubmit(values))
    }
  }

  handleRegisterClick = event => {
    const isRegister = this.state.currentAction === actions.REGISTER

    if (!isRegister) {
      event.preventDefault()
      this.setState({currentAction: actions.REGISTER}, this.focusEmptyInput)
    } else {
      const {
        onSubmit,
        handleSubmit
      } = this.props

      handleSubmit(event, values => onSubmit(values))
    }
  }

  handleLoginClick = event => {
    const isLogin = this.state.currentAction === actions.LOGIN

    if (!isLogin) {
      event.preventDefault()
      this.setState({currentAction: actions.LOGIN}, this.focusEmptyInput)
    } else {

    }
  }

  renderButton(type, positive = false) {
    const {
      submitting,
      t
    } = this.props

    let onClick = this.handleRegisterClick

    if (type === 'login') {
      onClick = this.handleLoginClick
    }
    else if (type === 'forgotten') {
      onClick = this.handleForgottenClick
    }

    return (
      <Button
        disabled={submitting}
        inverted
        onClick={onClick}
        positive={positive}
      >
        {t(`form:auth.${type}`)}
      </Button>
    )
  }

  render() {
    const {
      clientErrors,
      hasClientErrors,
      hasServerErrors,
      serverErrors,
      submitting,
      t
    } = this.props

    const isRegister = this.state.currentAction === actions.REGISTER
    const isForgotten = this.state.currentAction === actions.FORGOTTEN

    return (
      <Grid columns={2} verticalAlign="middle">

        <Field
          name="email"
          component={InputField}
          type="text"
          breakpoints={breakpoints}
          label={t('form:auth.email')}
          ref={node => this.emailInput = node}
          withRef
          validate={[
            required({msg: t('errors:required')}),
            email({msg: t('errors:auth.email_invalid')})
          ]}
        />

        {isRegister && (
          <Field
            name="username"
            component={InputField}
            type="text"
            breakpoints={breakpoints}
            label={t('form:auth.username')}
            ref={node => this.usernameInput = node}
            withRef
            validate={[
              required({msg: t('errors:required')}),
              length({max: 40, msg: t('errors:register.username_too_long')})
            ]}
          />
        )}

        {!isForgotten && (
          <Field
            name="password"
            component={InputField}
            type="password"
            breakpoints={breakpoints}
            label={t('form:auth.password')}
            ref={node => this.passwordInput = node}
            withRef
            validate={[
              required({msg: t('errors:required')}),
              length({min: 6, msg: t('errors:auth.password_too_short')})
            ]}
          />
        )}

        {isRegister && (
          <Field
            name="password2"
            component={InputField}
            type="password"
            breakpoints={breakpoints}
            label={t('form:auth.password2')}
            ref={node => this.password2Input = node}
            withRef
            validate={[
              confirmation({field: 'password', msg: t('errors:register.passwordsNotMatch')}),
              required({msg: t('errors:required')})
            ]}
          />
        )}

        {hasServerErrors && (
          <Row>
            <Col width={15}>
              <Message
                size="tiny"
                error
              >
                <Message.Header>{t('errors:auth.fixForm')}</Message.Header>
                <Message.List>
                  {serverErrors.map(({message}, i) => (
                    <Message.Item key={`serverError-${i}`}>
                      {message}
                    </Message.Item>
                  ))}
                </Message.List>
              </Message>
            </Col>
          </Row>
        )}

        <Row>
          <Button.Group>
            {isRegister
              ? this.renderButton('register', true)
              : (
                isForgotten
                  ? this.renderButton('forgotten_confirm', true)
                  : this.renderButton('login', true)
              )
            }
          </Button.Group>
        </Row>

        <Row>
          {isRegister
            ? (
              <Button.Group>
                {this.renderButton('login')}
                <Button.Or text={t('or')}/>
                {this.renderButton('forgotten')}
              </Button.Group>
            )
            : (
              isForgotten
                ? (
                <Button.Group>
                  {this.renderButton('login')}
                  <Button.Or text={t('or')}/>
                  {this.renderButton('register')}
                </Button.Group>
              )
                : (
                <Button.Group>
                  {this.renderButton('register')}
                  <Button.Or text={t('or')}/>
                  {this.renderButton('forgotten')}
                </Button.Group>
              )
            )
          }
        </Row>
      </Grid>
    )
  }
}

export default AuthFormStep1
