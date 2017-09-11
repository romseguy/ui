import React from 'react'

import { EntitiesToolboxTooltips } from 'components/entitiesToolbox'
import { SymbolsToolboxTooltips } from 'components/symbolsToolbox'


export default function ToolboxTooltips({t}) {
  return (
    <div>
      <EntitiesToolboxTooltips t={t}/>
      <SymbolsToolboxTooltips t={t}/>
    </div>
  )
}
