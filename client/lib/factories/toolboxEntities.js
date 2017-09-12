import { getEntitiesTooboxTooltipName } from 'helpers/tooltips'

import entityTypes from 'lib/maps/entityTypes'


const abstractToolboxEntity = {
  height: 50,
  isNew: true,
  mine: true,
  titleYOffset: 50,
  width: 50
}

export const toolboxEntities = {
  [entityTypes.CITY]: ({t}) => ({
    ...abstractToolboxEntity,
    iconName: 'city',
    iconNameSelected: 'city',
    label: t('canvas:toolboxes.entities.city.label'),
    name: t('canvas:entities.city.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.CITY}),
    type: entityTypes.CITY,
  }),
  [entityTypes.DEPARTMENT]: ({t}) => ({
  ...abstractToolboxEntity,
    iconName: 'city',
    iconNameSelected: 'city',
    label: t('canvas:toolboxes.entities.department.label'),
    name: t('canvas:entities.place.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.DEPARTMENT}),
    type: entityTypes.DEPARTMENT
  }),
  [entityTypes.PLACE]: ({t}) => ({
  ...abstractToolboxEntity,
    iconName: 'place',
    iconNameSelected: 'place',
    label: t('canvas:toolboxes.entities.place.label'),
    name: t('canvas:entities.place.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.PLACE}),
    type: entityTypes.PLACE
  }),
  [entityTypes.PERSON]: ({t}) => ({
  ...abstractToolboxEntity,
    iconName: 'monad',
    iconNameSelected: 'monad',
    label: t('canvas:toolboxes.entities.person.label'),
    name: t('canvas:entities.person.new'),
    tooltipName: getEntitiesTooboxTooltipName({type: entityTypes.PERSON}),
    type: entityTypes.PERSON
  })
}
