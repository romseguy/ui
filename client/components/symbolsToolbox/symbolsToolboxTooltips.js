import React from 'react'
import { Tooltip } from 'redux-tooltip'

import symbolTypes from 'lib/maps/symbolTypes'
import { getSymbolsTooboxTooltipName } from 'helpers/tooltips'

import Icon from 'components/icon'


function SymbolsToolboxTooltips({t}) {
  return (
    <div>
      {Object.keys(symbolTypes).map(type => {
        const tooltipLabel = t(`canvas:toolboxes.symbols.${type.toLowerCase()}.tooltip`)
        const tooltipName = getSymbolsTooboxTooltipName({type})

        return (
          <Tooltip
            key={tooltipName}
            name={tooltipName}
          >
            <div style={{
              padding: '5px'
            }}>
              <Icon
                name="mouseDrag"
                width={29}
                height={16}
              />
              {' '}
              {tooltipLabel}
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default SymbolsToolboxTooltips
