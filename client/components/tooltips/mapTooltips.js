import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'redux-tooltip'

import Icon from 'components/icon'
import { Grid, Row as UIRow, Col as UICol } from 'components/layout'

import { entityTypes } from 'utils/types/entities'
import { getMapNodeAnchorTooltipName, getMapNodeHeaderTooltipName } from 'utils/tooltips'


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
