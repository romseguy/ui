import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { Origin } from 'redux-tooltip'

import { centreTypes } from 'core/constants'
import { getMeCentre } from 'core/me'

import { atoms as atomImages, entities } from 'views/assets/img'

import Atom from 'views/components/atom'
import DraggableToolboxItem from 'views/components/draggableToolboxItem'
import { Label } from 'views/components/layout'
import Toolbox, { ToolboxMenu } from 'views/components/toolbox'

import { atomTypeToName, atomTypes } from 'views/utils/atoms'


function AtomsToolbox({toolboxAtoms, isOpen, onClose}) {
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
        {toolboxAtoms.map(toolboxAtom => {
          const tooltipName = `toolbox__atom-${toolboxAtom.type}`

          return (
            <Origin
              name={tooltipName}
              key={tooltipName}
            >
              <DraggableToolboxItem
                id={tooltipName}
                itemAttributes={toolboxAtom}
              >
                <Label basic image>
                  <Atom
                    height={toolboxAtom.height}
                    image={toolboxAtom.image}
                    type={toolboxAtom.type}
                    width={toolboxAtom.width}
                  />
                  {atomTypeToName[toolboxAtom.type]()}
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
  const {t} = props
  const centre = getMeCentre(state)

  const toolboxAtoms = [{
    backgroundColor: 'transparent',
    height: 50,
    image: entities.place,
    imageSelected: entities.place_selected,
    isNew: true,
    mine: true,
    name: t('canvas:places.new'),
    selected: false,
    titleYOffset: 50,
    type: atomTypes.LOCATION,
    width: 50
  }]

  if (centre === centreTypes.PERSON) {
    toolboxAtoms.push({
      backgroundColor: 'transparent',
      height: 50,
      image: atomImages.yellow,
      isNew: true,
      mine: true,
      name: t('canvas:persons.new'),
      selected: false,
      titleYOffset: 50,
      type: atomTypes.PERSON,
      width: 50
    })
  }

  return {
    toolboxAtoms
  }
}

const mapDispatchToProps = {}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AtomsToolbox)
