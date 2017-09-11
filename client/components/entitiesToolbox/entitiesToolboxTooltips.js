import React from 'react'
import { Tooltip } from 'redux-tooltip'

import { entityTypes } from 'utils/types/entities'
import { getEntitiesTooboxTooltipName } from 'utils/tooltips'


function EntitiesToolboxTooltips({t}) {
  return (
    <div>
      {Object.keys(entityTypes).map(type => {
        const tooltipLabel = t(`canvas:toolboxes.entities.${type.toLowerCase()}.tooltip`)
        const tooltipName = getEntitiesTooboxTooltipName({type})

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

export default EntitiesToolboxTooltips
