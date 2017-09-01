import React from 'react'
import { Tooltip } from 'redux-tooltip'
import { atomTypes, atomTypeToName } from 'views/utils/atoms'
import { symbolTypes, symbolTypeToName } from 'views/utils/symbols'


export function ToolboxTooltip({tooltipName, width, label}) {
  return (
    <Tooltip
      name={tooltipName}
      key={tooltipName}
    >
      <div style={{
        //width: `${width}px`,
        padding: '5px'
      }}>
        Glissez-déposez le badge sur le canevas pour ajouter {label}
      </div>
    </Tooltip>
  )
}

export function AtomsToolboxTooltips() {
  return (
    <div>
      {Object.keys(atomTypes).map(type => {
        const label = atomTypeToName[type]({prefix: true})
        const tooltipName = `toolbox__atom-${type}`

        return (
          <ToolboxTooltip
            key={tooltipName}
            tooltipName={tooltipName}
            label={label}
          />
        )
      })}
    </div>
  )
}

export function SymbolsToolboxTooltips() {
  return (
    <div>
      {Object.keys(symbolTypes).map(type => {
        const label = symbolTypeToName[type]({prefix: true})
        const tooltipName = `toolbox__symbol-${type}`

        return (
          <ToolboxTooltip
            key={tooltipName}
            tooltipName={tooltipName}
            label={label}
          />
        )
      })}
    </div>
  )
}

export default function ToolboxTooltips() {
  return (
    <div>
      <AtomsToolboxTooltips/>
      <SymbolsToolboxTooltips/>
    </div>
  )
}
