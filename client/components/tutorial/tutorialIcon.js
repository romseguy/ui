import React from 'react'
import Icon from 'components/icon'


function TutorialIcon(props) {
  let height = undefined
  let width = undefined

  if (props.name === 'mouseDrag') {
    height = 14
    width = 29
  } else if (props.name) {
    height = 14
    width = 14
  }

  return (
    <Icon
      height={height}
      width={width}
      {...props}
    />
  )
}

export default TutorialIcon
