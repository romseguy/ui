import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import { Tooltip } from 'redux-tooltip'
import styled from 'styled-components'

import { modeTypes } from 'views/utils/canvas'
import Icon from 'views/components/icon'
import { getCanvasNodeAnchorTooltipName, getCanvasNodeHeaderTooltipName } from 'views/utils/tooltips'

import { Grid, Row as UIRow, Col as UICol } from 'views/components/layout'


const Col = styled(UICol)`
padding: 0.5rem 0 0.5rem 1rem !important;
margin: 0 !important;
`

const Row = styled(UIRow)`
padding: 0 !important;
margin: 0 !important;
`


export function NodeAnchorTooltips() {
  const modes = []

  Object
    .values(modeTypes)
    .forEach(modeKey => {
      modes.push({modeKey, selected: true})
      modes.push({modeKey, selected: false})
    })

  return (
    <div>
      {modes.map(({modeKey, selected}) => {
        const discoveryMode = modeKey === modeTypes.DISCOVERY
        const tooltipName = getCanvasNodeAnchorTooltipName(modeKey, selected)
        let width = 150

        if (discoveryMode) {
          width = 120
        } else if (selected) {
          width = 170
        }

        return (
          <Tooltip
            key={tooltipName}
            name={tooltipName}
          >
            <Grid style={{width: `${width}px`}}>
              {!discoveryMode && (
                <Row>
                  <Col width={5}>
                    <Icon
                      name="mouseDrag"
                      width={29}
                      height={16}
                    />
                  </Col>
                  <Col>
                    déplacer
                  </Col>
                </Row>
              )}
              <Row>
                <Col width={5}>
                  <Icon
                    name="mouseLeftClick"
                    width={16}
                    height={16}
                  />
                </Col>
                <Col>
                  {discoveryMode ? 'explorer' : (selected ? 'déselectionner' : 'sélectionner')}
                </Col>
              </Row>
            </Grid>
          </Tooltip>
        )
      })}
    </div>
  )
}

export function NodeHeaderTooltips({t}) {
  return (
    <div>
      <Tooltip name={getCanvasNodeHeaderTooltipName(true)}>
        <Grid style={{width: '105px'}}>
          <Row>
            <Col width={5}>
              <Icon
                name="mouseLeftClick"
                width={16}
                height={16}
              />
            </Col>
            <Col width={11}>
              {`modifier`}
            </Col>
          </Row>
        </Grid>
      </Tooltip>

      <Tooltip name={getCanvasNodeHeaderTooltipName(false)}>
        <div style={{padding: '10px'}}>
          {t('canvas:tooltips.place_edit_disabled')}
        </div>
      </Tooltip>
    </div>
  )
}

function NodeTooltips({t}) {
  return (
    <div>
      <NodeAnchorTooltips/>
      <NodeHeaderTooltips t={t}/>
    </div>
  )
}

export default compose(
  translate()
)(NodeTooltips)
