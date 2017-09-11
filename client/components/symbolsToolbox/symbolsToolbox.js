import React from 'react'
import { Origin } from 'redux-tooltip'

import DraggableToolboxItem from 'components/draggableToolboxItem'
import { Label } from 'components/layout'
import Symbol from 'components/symbol'
import Toolbox, { ToolboxMenu } from 'components/toolbox'


function SymbolsToolbox({symbols, isOpen, onClose}) {
  if (!isOpen) {
    return null
  }

  return (
    <Toolbox
      className={`canvas-toolbox`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ToolboxMenu>
        {symbols.map(symbol => {
          return (
            <Origin
              name={symbol.tooltipName}
              key={symbol.tooltipName}
            >
              <DraggableToolboxItem
                id={symbol.tooltipName}
                itemAttributes={symbol}
                style={{cursor: 'move', padding: '0.5rem 0'}}
              >
                <Label basic image>
                  <Symbol
                    height={symbol.height}
                    image={symbol.image}
                    type={symbol.type}
                    width={symbol.width}
                  />
                  {symbol.label}
                </Label>
              </DraggableToolboxItem>
            </Origin>
          )
        })}
      </ToolboxMenu>
    </Toolbox>
  )
}

export default SymbolsToolbox
