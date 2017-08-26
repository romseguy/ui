import React from 'react'
import styled from 'styled-components'

import { atomTypes } from 'views/utils/atoms'

import { Button, Col as UICol, Grid, Segment } from 'views/components/layout'

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
    selectedNodeType,
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
          {modes.map(({active, disabled, iconId, key, labels, onClick}) => {
            const title = disabled
              ? labels.disabled
              : (active ? labels.active : labels.inactive)

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
            title={t(`map:buttons.${Object.keys(atomTypes).includes(selectedNodeType) ? 'delete_selected_entity' : 'delete_selected_symbol'}`)}
            onClick={(e) => handleActionClick(e, onDeleteClick, deleteDisabled)}
          />

          <ToolbarIcon
            disabled={editDisabled}
            id="compose"
            margin="0.4rem 0 0 0.4rem"
            title={t(`map:buttons.${Object.keys(atomTypes).includes(selectedNodeType) ? 'edit_selected_entity' : 'edit_selected_symbol'}`)}
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
