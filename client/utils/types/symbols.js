import { symbols } from 'assets/img'

import { getSymbolsTooboxTooltipName } from 'utils/tooltips'


export const symbolTypes = {
  // todo: CUSTOM: 'CUSTOM',
  SERVICE: 'SERVICE'
}

const abstractToolboxSymbol = {
  backgroundColor: 'transparent',
  height: 50,
  isNew: true,
  mine: true,
  titleYOffset: 50,
  width: 50
}

export const toolboxSymbols = {
  [symbolTypes.SERVICE]: ({t}) => ({
    ...abstractToolboxSymbol,
    image: symbols.service,
    imageSelected: symbols.service_selected,
    label: t('canvas:toolboxes.symbols.service.label'),
    name: t('canvas:symbols.service.new'),
    tooltipName: getSymbolsTooboxTooltipName({type: symbolTypes.SERVICE}),
    type: symbolTypes.SERVICE,
  })
}
