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
  [symbolTypes.PARROT]: ({t}) => ({
    ...abstractToolboxSymbol,
    iconName: 'parrot',
    iconNameSelected: 'parrot',
    label: t('canvas:toolboxes.symbols.parrot.label'),
    name: t('canvas:symbols.parrot.new'),
    tooltipName: getSymbolsTooboxTooltipName({type: symbolTypes.PARROT}),
    type: symbolTypes.PARROT,
  })
}
