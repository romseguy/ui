import { entities } from 'assets/img'

import { getEntitiesTooboxTooltipName } from 'utils/tooltips'


export const entityTypes = {
  CITY: 'CITY',
  DEPARTMENT: 'DEPARTMENT',
  PLACE: 'PLACE',
  PERSON: 'PERSON'
}

const abstractToolboxEntity = {
  backgroundColor: 'transparent',
  height: 50,
  isNew: true,
  mine: true,
  titleYOffset: 50,
  width: 50
}

export const toolboxEntities = {
  [entityTypes.CITY]: ({t}) => ({
    ...abstractToolboxEntity,
    image: entities.city,
    imageSelected: entities.city_selected,
    label: t('canvas:toolboxes.entities.city.label'),
    name: t('canvas:entities.city.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.CITY}),
    type: entityTypes.CITY,
  }),
  [entityTypes.DEPARTMENT]: ({t}) => ({
  ...abstractToolboxEntity,
    image: entities.place,
    imageSelected: entities.place_selected,
    label: t('canvas:toolboxes.entities.department.label'),
    name: t('canvas:entities.place.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.DEPARTMENT}),
    type: entityTypes.DEPARTMENT
  }),
  [entityTypes.PLACE]: ({t}) => ({
  ...abstractToolboxEntity,
    image: entities.place,
    imageSelected: entities.place_selected,
    label: t('canvas:toolboxes.entities.place.label'),
    name: t('canvas:entities.place.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.PLACE}),
    type: entityTypes.PLACE
  }),
  [entityTypes.PERSON]: ({t}) => ({
  ...abstractToolboxEntity,
    image: entities.monad,
    imageSelected: entities.monad_selected,
    label: t('canvas:toolboxes.entities.person.label'),
    name: t('canvas:entities.person.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.PERSON}),
    type: entityTypes.PERSON
  })
}
