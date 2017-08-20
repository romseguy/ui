import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'redux-tooltip'

import Icon from 'views/components/icon'
import { Grid, Row as UIRow, Col as UICol } from 'views/components/layout'
import { atomTypes } from 'views/utils/atoms'


const Col = styled(UICol)`
padding: 0.5rem 0 0.5rem 1rem !important;
margin: 0 !important;
`

const Row = styled(UIRow)`
padding: 0 !important;
margin: 0 !important;
`

function MapNodeAnchorTooltips() {
  const tooltipName = `map-node__anchor-img`

  const tooltip = (
    <Tooltip
      name={tooltipName}
    >
      <Grid style={{width: '130px'}}>
        <Row>
          <Col width={5}>
            <Icon name="mouseLeftClick" width={16} height={16}/>
          </Col>
          <Col width={11}>
            explorer
          </Col>
        </Row>
      </Grid>
    </Tooltip>
  )

  return tooltip
}

function MapNodeHeaderTooltips({name, type}) {
  const atomTypeToName = {
    [atomTypes.LOCATION]: {label: 'du lieu', width: 240},
    [atomTypes.PERSON]: {label: 'de la personne', width: 210}
  }
  const {label, width} = atomTypeToName[type]

  return (
    <div>
      {[true].map(bool => {
        const name = `map-node__`
        return [
          {discoveryMode: true, mine: true},
          {discoveryMode: false, mine: false}
        ]
      })}
      <Tooltip name={name}>
        <Grid style={{width: `${width}px`}}>
          <Row>
            <Col width={3}>
              <Icon name="mouseLeftClick" width={16} height={16}/>
            </Col>
            <Col width={13}>
              {`afficher les détails ${label}`}
            </Col>
          </Row>
        </Grid>
      </Tooltip>
    </div>
  )
}

export default function MapTooltips() {
  return (
    <div>
      <MapNodeAnchorTooltips/>
    </div>
  )
}
