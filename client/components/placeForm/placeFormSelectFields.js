import React from 'react'
import { Field } from 'redux-form'

import { PlaceFormBreakpoints as breakpoints } from 'lib/maps/breakpoints'
import { required } from 'helpers/form/validators'

import {
  Button,
  NoPadCol as Col,
  Grid,
  Row
} from 'components/layout'
import SelectField from 'components/selectField'


function PlaceFormSelectFields(props) {
  const {
    disconnectedPlaces,
    formValues,
    submitting,
    t,
    onSaveClick,
    onViewClick
  } = props

  return (
    <Grid verticalAlign="middle">
      <Field
        name="selectedPlaceTitle"
        component={SelectField}
        breakpoints={breakpoints}
        label={t('form:place.name')}
        placeholder={t('form:place.select')}
        options={Array.isArray(disconnectedPlaces) ? disconnectedPlaces.map(place => {
          const option = {
            key: place.id,
            value: place.title,
            text: place.title
          }

          return option
        }) : []}
        validate={[required({msg: t('errors:required')})]}
      />

      <Row>
        <Col mobile={8}>
          <Button
            disabled={submitting}
            positive
            onClick={onSaveClick}
          >{t('form:place.select_save')}
          </Button>
        </Col>
        <Col mobile={8}>
          {formValues.selectedPlaceTitle && (
            <Button
              disabled={submitting}
              onClick={onViewClick}
            >
              {t('form:place.select_view')}
            </Button>
          )}
        </Col>
      </Row>
    </Grid>
  )
}

export default PlaceFormSelectFields
