import React from 'react'
import { Origin } from 'redux-tooltip'

import DraggableToolboxItem from 'components/draggableToolboxItem'
import Entity from 'components/entity'
import { Label } from 'components/layout'
import Toolbox, { ToolboxMenu } from 'components/toolbox'


function EntitiesToolbox({entities, isOpen, onClose}) {
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
        {entities.map(entity => {
          return (
            <Origin
              key={entity.tooltipName}
              name={entity.tooltipName}
            >
              <DraggableToolboxItem
                id={entity.tooltipName}
                itemAttributes={entity}
                style={{cursor: 'move', padding: '0.5rem 0'}}
              >
                <Label basic image>
                  <Entity
                    height={entity.height}
                    image={entity.image}
                    type={entity.type}
                    width={entity.width}
                  />
                  {entity.label}
                </Label>
              </DraggableToolboxItem>
            </Origin>
          )
        })}
      </ToolboxMenu>
    </Toolbox>
  )
}

export default EntitiesToolbox