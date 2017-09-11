import { compose, withHandlers } from 'recompose'
import React from 'react'
import { Origin } from 'redux-tooltip'

import { getMapNodeAnchorTooltipName, getMapNodeHeaderTooltipName } from 'utils/tooltips'


const imageOffset = {
  left: 15,
  top: 15
}


const handlers = {
  onAnchorClick: props => () => {
    props.onAnchorClick && props.onAnchorClick(props.node)
  },

  onHeaderClick: props => () => {
    props.onHeaderClick && props.onHeaderClick(props.node)
  },

  onAnchorMouseOver: props => () => {
    typeof props.onAnchorMouseOver === 'function' && props.onAnchorMouseOver(props.node)
  },

  onAnchorMouseOut: props => () => {
    typeof props.onAnchorMouseOut === 'function' && props.onAnchorMouseOut(props.node)
  }
}

function MapNode(props) {
  const {
    left,
    node,
    top,
    zoom,
    onAnchorClick,
    onAnchorMouseOver,
    onAnchorMouseOut,
    onHeaderClick
  } = props

  const {
    hovered,
    id,
    image,
    imageSelected,
    name,
    selected,
    textColor,
    type
  } = node

  const imageHeight = 30
  const imageWidth = 30
  const anchorTooltipName = getMapNodeAnchorTooltipName({type})
  const headerTooltipName = getMapNodeHeaderTooltipName({type})

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
      }}
    >
      <Origin
        name={anchorTooltipName}
        onHover={onAnchorMouseOver}
        onLeave={onAnchorMouseOut}
      >
        <img
          id={`${anchorTooltipName}-${id}`}
          alt=""
          src={hovered || selected ? imageSelected : image}
          style={{cursor: 'zoom-in'}}
          width={imageWidth}
          height={imageHeight}
          onClick={onAnchorClick}
        />
      </Origin>
      <Origin
        name={headerTooltipName}
      >
        <p
          id={`${headerTooltipName}-${id}`}
          onClick={onHeaderClick}
          style={{
            color: textColor
          }}
        >
          {name}
        </p>
      </Origin>
    </div>
  )
}

export default compose(
  withHandlers(handlers)
)(MapNode)
