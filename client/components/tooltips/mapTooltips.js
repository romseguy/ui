import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'redux-tooltip'

import Icon from 'components/icon'
import { Grid, Row as UIRow, Col as UICol } from 'components/layout'

import entityTypes from 'lib/maps/entityTypes'
import { getMapNodeAnchorTooltipName, getMapNodeHeaderTooltipName } from 'helpers/tooltips'


const Col = styled(UICol)`
padding: 0.5rem 0 0.5rem 1rem !important;
margin: 0 !important;
`

const Row = styled(UIRow)`
padding: 0 !important;
margin: 0 !important;
`

function MapPlaceNodeAnchorTooltip({t}) {
  const tooltipName = getMapNodeAnchorTooltipName({type: entityTypes.PLACE})

  return (
    <Tooltip name={tooltipName}>
      <Grid style={{width: '410px'}}>
        <Row>
          <Col width={2}>
            <Icon name="mouseLeftClick" width={16} height={16}/>
          </Col>
          <Col width={14}>
            {t('map:tooltips.place_node_anchor')}
          </Col>
        </Row>
      </Grid>
    </Tooltip>
  )
}

function MapPlaceNodeHeaderTooltips({t}) {
  const tooltipName = getMapNodeHeaderTooltipName({type: entityTypes.PLACE})

  return (
    <Tooltip name={tooltipName}>
      <Grid style={{width: '240px'}}>
        <Row>
          <Col width={3}>
            <Icon name="mouseLeftClick" width={16} height={16}/>
          </Col>
          <Col width={13}>
            {t('map:tooltips.place_node_header')}
          </Col>
        </Row>
      </Grid>
    </Tooltip>
  )
}

export default function MapTooltips({t}) {
  // <MapPlaceNodeHeaderTooltips t={t}/>
  return (
    <div>
      <MapPlaceNodeAnchorTooltip t={t}/>
    </div>
  )
}
