import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Origin } from 'redux-tooltip'

import { centreTypes } from 'core/constants'
import { getMeCentre } from 'core/me'

import { atoms as atomImages, entities } from 'views/assets/img'

import Atom from 'views/components/atom'
import DraggableToolboxItem from 'views/components/draggableToolboxItem'
import { Label } from 'views/components/layout'
import Toolbox, { ToolboxMenu } from 'views/components/toolbox'

import { atomTypeToName, atomTypes } from 'views/utils/atoms'


function AtomsToolbox({atoms, isOpen, onClose}) {
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
        {atoms.map(atom => {
          const tooltipName = `toolbox__atom-${atom.type}`

          return (
            <Origin
              name={tooltipName}
              key={tooltipName}
            >
              <DraggableToolboxItem
                id={tooltipName}
                itemAttributes={atom}
              >
                <Label basic image>
                  <Atom
                    height={atom.height}
                    image={atom.image}
                    type={atom.type}
                    width={atom.width}
                  />
                  {atomTypeToName[atom.type]()}
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

  const atoms = [{
    backgroundColor: 'transparent',
    height: 50,
    image: entities.place,
    isNew: true,
    mine: true,
    name: t('canvas:places.new'),
    selected: false,
    titleYOffset: 50,
    type: atomTypes.LOCATION,
    width: 50
  }]

  if (centre === centreTypes.PERSON) {
    atoms.push({
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
    atoms
  }
}

const mapDispatchToProps = {}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AtomsToolbox)
