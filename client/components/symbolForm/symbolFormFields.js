import React, { Component } from 'react'
import { Field } from 'redux-form'

import {
  Button,
  Col,
  Grid,
  Row
} from 'components/layout'


class SymbolFormFields extends Component {
  render() {
    const {formValues, readOnly, t} = this.props

    return (
      <Grid>
        {/* todo: create name with presets for commonly used symbols and symbols create by monads on the platform */}
        <Row>
          <Col mobile={16} tablet={16} computer={5}>
            <label htmlFor="name">{t('form:symbol.name')}</label>
          </Col>

          <Col mobile={16} tablet={16} computer={11}>
            <Field name="title" component="input" type="text" id="name" disabled={readOnly}/>
          </Col>
        </Row>

        {/* todo:
          - either choose the node_background from a list of presets
          - or from upload form
          */}

        {/* todo:
          - create selector for custom fields (add a map, add text, attach file
          */}

        <Row>
          <Col>
            <Button type="submit">{t('form:symbol.save')}</Button>
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default SymbolFormFields
