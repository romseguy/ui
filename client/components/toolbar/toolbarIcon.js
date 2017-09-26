import React from 'react'
import Icon from 'components/icon'
import ToolbarIconLink from './toolbarIconLink'


const noop = () => {}

function ToolbarIcon(props) {
  const {
    active,
    disabled,
    height,
    id,
    margin,
    name,
    style,
    text,
    title,
    width,
    onClick
  } = props

  return (
    <ToolbarIconLink
      active={active}
      disabled={disabled}
      onClick={disabled ? noop : onClick}
      style={{
        fontSize: text ? '1.5rem' : '1rem',
        ...style
      }}
      title={title}
    >
      {text ? text : (
        <Icon
          height={height}
          id={id}
          name={name}
          margin={margin}
          width={width}
        />
      )}
    </ToolbarIconLink>
  )
}

export default ToolbarIcon

