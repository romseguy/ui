import { getSymbolsTooboxTooltipName } from 'helpers/tooltips'

import symbolTypes from 'lib/maps/symbolTypes'


const abstractToolboxSymbol = {
  height: 50,
  isNew: true,
  mine: true,
  titleYOffset: 50,
  width: 50
}

export const toolboxSymbols = {
  [symbolTypes.NOTIFICATION]: ({t}) => ({
    ...abstractToolboxSymbol,
    iconName: 'notification',
    iconNameSelected: 'notification',
    label: t('canvas:toolboxes.symbols.notification.label'),
    name: t('canvas:symbols.notification.new'),
    tooltipName: getSymbolsTooboxTooltipName({type: symbolTypes.NOTIFICATION}),
    type: symbolTypes.NOTIFICATION,
  })
}
