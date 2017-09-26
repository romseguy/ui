import React from 'react'
import { Origin } from 'redux-tooltip'

import DraggableToolboxItem from 'components/draggableToolboxItem'
import Icon from 'components/icon'
import { Label } from 'components/layout'
import Toolbox, { ToolboxMenu } from 'components/toolbox'


function SymbolsToolbox({isOpen, symbols, t, onClose}) {
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
        {!symbols || !symbols.length && (
          <span>{t('canvas:toolboxes.symbols.empty')}</span>
        )}
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
                  <Icon
                    height={symbol.height}
                    name={symbol.iconName}
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
