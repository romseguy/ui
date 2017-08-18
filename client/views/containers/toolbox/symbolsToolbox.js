import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Origin } from 'redux-tooltip'

import { atoms as atomImages } from 'views/assets/img'

import DraggableToolboxItem from 'views/components/draggableToolboxItem'
import { Label } from 'views/components/layout'
import symbol from 'views/components/symbol'
import Toolbox, { ToolboxMenu } from 'views/components/toolbox'

import { symbolTypes, symbolTypeToName } from 'views/utils/symbols'


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
          const name = `toolbox__symbol-${symbol.type}`

          return (
            <Origin
              name={name}
              key={name}
            >
              <DraggableToolboxItem
                id={name}
                itemAttributes={symbol}
              >
                <Label basic image>
                  <symbol type={symbol.type}/>
                  {symbolTypeToName[symbol.type]()}
                </Label>
              </DraggableToolboxItem>
            </Origin>
          )
        })}
      </ToolboxMenu>
    </Toolbox>
  )
}


const mapStateToProps = (state, props) => {
  const { t } = props

  const symbols = [{
    name: t('new_symbol'),
    type: symbolTypes.SERVICE,
    image: atomImages.red,
    imageSelected: atomImages.red_selected,
    backgroundColor: 'transparent',
    selected: false,
    titleYOffset: 50,
    width: 50,
    height: 50
  }]

  return {
    symbols
  }
}

const mapDispatchToProps = {}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SymbolsToolbox)
