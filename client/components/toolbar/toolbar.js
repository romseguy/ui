import React from 'react'
import { compose, pure, withHandlers } from 'recompose'
import styled from 'styled-components'

import media from 'helpers/media'
import entityTypes from 'lib/maps/entityTypes'

import { Col as UICol, Grid, Segment } from 'components/layout'

import ToolbarIcon from './toolbarIcon'

const Col = styled(UICol)`
width: auto !important;

${media.MOBILE`
padding: 0 !important;
`}
`


const handlers = {
  onActionClick: props => (event, callback, disabled = false) => {
    event.preventDefault()

    if (!disabled && typeof callback === 'function') {
      callback(props.selectedNode)
    }
  },

  onModeClick: props => (event, modeKey, disabled = false) => {
    if (!disabled && typeof props.onModeClick === 'function') {
      props.onModeClick(modeKey)
    }
  }
}

function Toolbar(props) {
  const {
    currentMode,
    editDisabled = false, deleteDisabled = false,
    modes,
    selectedNode,
    t,
    toolboxes,
    zoomOutDisabled = true, zoomInDisabled = false,
    onActionClick,
    onDeleteClick, onEditClick,
    onModeClick,
    onZoomOutClick, onZoomInClick
  } = props

  const selectedNodeType = selectedNode && selectedNode.type

  return (
    <Grid>
      <Col style={{
        paddingLeft: 0
      }}>
        <Segment compact style={{
          border: 0,
          padding: '0.35rem 0.35rem 0.35rem 0.35rem'
        }}>
          {modes.map(mode => {
            const {
              disabled,
              height,
              iconId,
              iconName,
              key,
              margin,
              labels,
              text,
              width
            } = mode

            const active = currentMode === key

            const title = disabled
              ? labels.disabled
              : (active ? labels.active : labels.inactive)

            return (
              <ToolbarIcon
                active={active}
                disabled={disabled}
                height={height}
                id={iconId}
                key={key}
                margin={margin}
                name={iconName}
                text={text}
                title={title}
                width={width}
                onClick={e => onModeClick(e, key, disabled)}
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
          padding: '0.35rem 0.55rem 0.35rem 0',
        }}
        >
          <ToolbarIcon
            disabled={deleteDisabled}
            id="trash"
            margin="0.4rem 0 0 0.4rem"
            title={t(`canvas:buttons.${Object.keys(entityTypes).includes(selectedNodeType) ? 'delete_selected_entity' : 'delete_selected_symbol'}`)}
            onClick={e => onActionClick(e, onDeleteClick, deleteDisabled)}
          />

          <ToolbarIcon
            disabled={editDisabled}
            id="compose"
            margin="0.4rem 0 0 0.4rem"
            title={t(`canvas:buttons.${Object.keys(entityTypes).includes(selectedNodeType) ? 'edit_selected_entity' : 'edit_selected_symbol'}`)}
            onClick={e => onActionClick(e, onEditClick, editDisabled)}
          />
        </Segment>
      </Col>

      <Col floated="right" style={{
        paddingRight: 0
      }}>
        <Segment
          compact style={{
          border: 0,
          padding: '0.35rem 0.55rem 0.35rem 0.55rem',
        }}
        >
          <ToolbarIcon
            disabled={zoomOutDisabled}
            id="minus"
            margin="0.4rem 0.4rem 0 0"
            title={t('canvas:buttons.zoom_out')}
            onClick={e => onActionClick(e, onZoomOutClick, zoomOutDisabled)}
          />

          <ToolbarIcon
            disabled={zoomInDisabled}
            id="plus"
            title={t('canvas:buttons.zoom_in')}
            onClick={e => onActionClick(e, onZoomInClick, zoomInDisabled)}
          />
        </Segment>

      </Col>
    </Grid>
  )
}

export default compose(
  withHandlers(handlers),
  pure
)(Toolbar)
