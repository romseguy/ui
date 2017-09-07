import React from 'react'
import { Tooltip } from 'redux-tooltip'
import { atomTypes, atomTypeToName } from 'views/utils/atoms'
import { symbolTypes, symbolTypeToName } from 'views/utils/symbols'


export function ToolboxTooltip({label, t, tooltipName, width}) {
  return (
    <Tooltip
      name={tooltipName}
      key={tooltipName}
    >
      <div style={{
        //width: `${width}px`,
        padding: '5px'
      }}>
        {`${t('canvas:tooltips.toolbox_item')} ${label}`}
      </div>
    </Tooltip>
  )
}

export function AtomsToolboxTooltips({t}) {
  return (
    <div>
      {Object.keys(atomTypes).map(type => {
        const label = atomTypeToName[type]({prefix: true})
        const tooltipName = `toolbox__atom-${type}`

        return (
          <ToolboxTooltip
            key={tooltipName}
            label={label}
            t={t}
            tooltipName={tooltipName}
          />
        )
      })}
    </div>
  )
}

export function SymbolsToolboxTooltips({t}) {
  return (
    <div>
      {Object.keys(symbolTypes).map(type => {
        const label = symbolTypeToName[type]({prefix: true})
        const tooltipName = `toolbox__symbol-${type}`

        return (
          <ToolboxTooltip
            key={tooltipName}
            label={label}
            t={t}
            tooltipName={tooltipName}
          />
        )
      })}
    </div>
  )
}

export default function ToolboxTooltips({t}) {
  return (
    <div>
      <AtomsToolboxTooltips t={t}/>
      <SymbolsToolboxTooltips t={t}/>
    </div>
  )
}
