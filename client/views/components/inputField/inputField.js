import React, { Component } from 'react'

import {
  Form,
  Icon,
  NoPadCol as Col,
  Row
} from 'views/components/layout'


class Input extends Component {
  focusInput() {
    this.input.focus()
  }

  render() {
    const {
      breakpoints,
      input,
      label,
      type,
      meta,
    } = this.props

    const {
      touched,
      error
    } = meta

    const isError = touched && error

    return (
      <Row>
        <Col {...breakpoints.label}>
          <label htmlFor={input.name}>
            {label}
          </label>
        </Col>

        <Col {...breakpoints.input}>
          <Form.Field error={isError}>
            <input
              {...input}
              id={input.name}
              ref={node => this.input = node}
              title={error}
              type={type}
            />
          </Form.Field>
        </Col>

        {isError && (
          <Col width={1} textAlign="right">
            <Icon name="warning sign" title={error}/>
          </Col>
        )}
      </Row>
    )
  }
}

export default Input
