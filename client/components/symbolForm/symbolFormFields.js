import React, { Component } from 'react'
import { Field } from 'redux-form'

import { required } from 'helpers/form/validators'
import { SymbolFormBreakpoints as breakpoints } from 'lib/maps/breakpoints'

import InputField from 'components/inputField'
import TextareaField from 'components/textareaField'

import { Button, NoPadCol as Col, Grid, Message, Row } from 'components/layout'


class SymbolFormFields extends Component {
  render() {
    const {
      formValues,
      hasServerErrors,
      isScriptLoading,
      prefix,
      readOnly,
      serverErrors,
      submitting,
      valid,
      onSaveClick
    } = this.props

    const t = (path, options) => {
      if (prefix) {
        return this.props.t(prefix + path, options)
      }

      return this.props.t('loading')
    }

    return (
      <Grid verticalAlign="middle">
        <Col width={16}>
          {t('description')}
        </Col>

        <Field
          name="title"
          component={InputField}
          type="text"
          breakpoints={breakpoints}
          label={t('fields.title')}
          ref={node => this.titleInput = node}
          withRef
          validate={[required({msg: t('errors:required')})]}
        />

        <Field
          name="body"
          component={TextareaField}
          breakpoints={breakpoints}
          label={t('fields.body')}
          ref={node => this.textareaInput = node}
          withRef
          validate={[required({msg: t('errors:required')})]}
        />

        {hasServerErrors && (
          <Row>
            <Col width={16}>
              <Message
                size="tiny"
                error
              >
                <Message.Header>{t('errors:symbol.fixForm')}</Message.Header>
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
          <Col>
            <Button
              disabled={submitting || !valid}
              positive
              onClick={onSaveClick}
            >{
              t('form:symbol.save')}
            </Button>
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default SymbolFormFields
