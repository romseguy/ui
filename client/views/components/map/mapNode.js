import { compose, withHandlers } from 'recompose'
import React from 'react'
import { Origin } from 'redux-tooltip'


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

  const imageHeight = 30
  const imageWidth = 30

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
      }}
    >
      <Origin
        name={`map-node__anchor-img`}
        onHover={onAnchorMouseOver}
        onLeave={onAnchorMouseOut}
      >
        <img
          id={`map-node__anchor-img-${node.id}`}
          alt=""
          src={node.hovered || node.selected ? node.imageSelected : node.image}
          style={{cursor: 'zoom-in'}}
          width={imageWidth}
          height={imageHeight}
          onClick={onAnchorClick}
        />
      </Origin>
      <Origin
        name={`map-node__header-${node.type}`}
      >
        <p
          id={`map-node__header-${node.id}`}
          onClick={onHeaderClick}
          style={{
            color: node.textColor
          }}
        >
          {node.name}
        </p>
      </Origin>
    </div>
  )
}

export default compose(
  withHandlers(handlers)
)(MapNode)
