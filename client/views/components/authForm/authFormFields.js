import React, { Component } from 'react'

import {
  Form,
  Grid,
  Icon,
  NoPadCol as Col,
  Row,
} from 'views/components/layout'

export class Input extends Component {
  focusInput() {
    this.input.focus()
  }

  render() {
    const {
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
        {/*Field label*/}
        <Col mobile={16} tablet={4} computer={4} largeScreen={4} widescreen={4}>
          <label htmlFor={input.name}>
            {label}
          </label>
        </Col>

        {/*Field input*/}
        <Col mobile={15} tablet={11} computer={11} largeScreen={11} widescreen={11}>
          <Form.Field error={touched && error !== undefined}>
            <input {...input} ref={node => this.input = node} title={error} type={type}/>
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
