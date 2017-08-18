import React from 'react'
import { Field } from 'redux-form'
import {
  Col,
  Form as UIForm,
  Grid,
  Radio,
  Row
} from 'views/components/layout'
import Select from 'views/components/select'

function RadioGroup(props) {
  const {
    input,
    t
  } = props
  const onChange = value => () => input.onChange(value)

  return (
    <div>
      <UIForm.Field>
        <Radio
          checked={input.value === 'create'}
          label={t('map:place.create')}
          name={input.name}
          onChange={onChange('create')}
        />
      </UIForm.Field>
      <UIForm.Field>
        <Radio
          checked={input.value === 'select'}
          label={t('map:place.select')}
          name={input.name}
          onChange={onChange('select')}
        />
      </UIForm.Field>
    </div>
  )
}

function PlaceFormSelector(props) {
  const {disconnectedPlaces, formValues, t} = props
  const {action} = formValues

  return (
    <Grid>
      <Row>
        <Col mobile={16} tablet={16} computer={11}>
          <Field
            name="action"
            component={RadioGroup}
            t={t}
          />
        </Col>
      </Row>

      {action === 'select' && (
        <Row>
          <Col mobile={16} tablet={16} computer={5}>
            <label>Nom du lieu :</label>
          </Col>
          <Col mobile={16} tablet={16} computer={11}>
            <Field
              name="placeId"
              component={Select}
              placeholder="Choisissez un lieu"
              options={Array.isArray(disconnectedPlaces) ? disconnectedPlaces.map(place => {
                const option = {
                  key: place.id,
                  value: place.id,
                  text: place.title
                }

                return option
              }) : []}
            />
          </Col>
        </Row>
      )}
    </Grid>
  )
}

export default PlaceFormSelector
