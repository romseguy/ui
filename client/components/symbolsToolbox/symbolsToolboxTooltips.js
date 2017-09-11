import React from 'react'
import { Tooltip } from 'redux-tooltip'

import { symbolTypes } from 'utils/types/symbols'
import { getSymbolsTooboxTooltipName } from 'utils/tooltips'


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
              {tooltipLabel}
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default SymbolsToolboxTooltips
