import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Origin } from 'redux-tooltip'

import { centreTypes } from 'core/constants'
import { getMeCentre } from 'core/me'

import { atoms as atomImages } from 'views/assets/img'

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
          const name = `toolbox__atom-${atom.type}`

          return (
            <Origin
              name={name}
              key={name}
            >
              <DraggableToolboxItem
                id={name}
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
    name: t('map:places.new'),
    type: atomTypes.LOCATION,
    image: atomImages.green,
    imageSelected: atomImages.green_selected,
    backgroundColor: 'transparent',
    selected: false,
    titleYOffset: 50,
    width: 50,
    height: 50
  }, {
    name: t('map:persons.new'),
    type: atomTypes.PERSON,
    image: atomImages.yellow,
    imageSelected: atomImages.yellow_selected,
    backgroundColor: 'transparent',
    selected: false,
    titleYOffset: 50,
    width: 50,
    height: 50
  }]

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
