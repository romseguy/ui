import React from 'react'
import styled from 'styled-components'

import { Button, Col as UICol, Grid, Segment } from '../layout'
import Icon from '../icon'

import ToolbarIcon from './toolbarIcon'

const Col = styled(UICol)`
width: auto !important;
`

const ToolbarButton = styled(Button)`
`

const handleActionClick = (event, func, disabled) => {
  event.preventDefault()
  if (!disabled && func) {
    func(event)
  }
}

function Toolbar(props) {
  const {
    editDisabled = false, deleteDisabled = false,
    modes,
    t,
    toolboxes,
    zoomOutDisabled = true, zoomInDisabled = false,
    onDeleteClick, onDiscoveryClick, onDuplicateClick,
    onEditClick,
    onZoomOutClick, onZoomInClick
  } = props

  return (
    <Grid
      className="app-toolbar"
      stackable
    >
      <Col style={{
        paddingLeft: 0
      }}>
        <Segment compact style={{
          border: 0,
          padding: '0.25rem 0.25rem 0 0.5rem'
        }}>
          {modes.map(({active, disabled, iconId, key, label, onClick}) => {
            const title = `${label} ${
              disabled
                ? 'non autorisé'
                : (active
                  ? 'activé'
                  : 'désactivé'
              )
              }`

            return (
              <ToolbarIcon
                active={active}
                disabled={disabled}
                id={iconId}
                key={key}
                margin='0.4rem 0.4rem 0 0'
                title={title}
                onClick={onClick}
              />
            )
          })}
        </Segment>
      </Col>

      {toolboxes.map(toolbox => {
        return (
          <Col
            key={`toolbox-button-${toolbox.key}`}
            style={{paddingLeft: 0, paddingRight: 0}}
          >
            {React.createElement(toolbox.button, toolbox.buttonProps)}
          </Col>
        )
      })}

      <Col>
        <Segment
          compact style={{
          border: 0,
          padding: '0.25rem 0.25rem 0 0'
        }}
        >
          <ToolbarIcon
            disabled={deleteDisabled}
            id="trash"
            margin="0.4rem 0 0 0.4rem"
            title={t('map:symbols.delete_selected')}
            onClick={(e) => handleActionClick(e, onDeleteClick, deleteDisabled)}
          />

          <ToolbarIcon
            disabled={editDisabled}
            id="compose"
            margin="0.4rem 0 0 0.4rem"
            title={t('map:symbols.edit_selected')}
            onClick={(e) => handleActionClick(e, onEditClick, editDisabled)}
          />
        </Segment>
      </Col>

      <Col floated="right" style={{
        paddingRight: 0
      }}>
        <Segment
          compact style={{
          border: 0,
          padding: '0.25rem 0.25rem 0 0.25rem'
        }}
        >
          <ToolbarIcon
            disabled={zoomOutDisabled}
            id="minus"
            margin="0.4rem 0.4rem 0 0"
            onClick={(e) => handleActionClick(e, onZoomOutClick, zoomOutDisabled)}
          />

          <ToolbarIcon
            disabled={zoomInDisabled}
            id="plus"
            onClick={(e) => handleActionClick(e, onZoomInClick, zoomInDisabled)}
          />
        </Segment>
      </Col>
    </Grid>
  )
}

export default Toolbar
