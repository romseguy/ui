import Map from 'pigeon-maps'
import React, { Component } from 'react'
import { withHandlers } from 'recompose'
import { createSelector } from 'reselect'

import { MapTooltips } from 'views/components/tooltips'
import { providers } from 'views/utils/map'

import MapNode from './mapNode'


const getAnchor = createSelector(
  r => r.latitude,
  r => r.longitude,
  (latitude, longitude) => [latitude, longitude]
)

class MapManager extends Component {
  constructor(props) {
    super(props)

    this.state = {
      center: props.center,
      zoom: 14,
      provider: 'outdoors'
    }
  }

  componentWillReceiveProps(nextProps) {
    const [lat, lng] = this.state.center

    if (nextProps.center) {
      const [lat2, lng2] = nextProps.center

      if (lat !== lat2 || lng !== lng2) {
        this.setState(p => ({center: nextProps.center}))
      }
    }
  }

  handleBoundsChange = ({center, zoom, bounds, initial}) => {
    if (initial) {
      //console.log('Got initial bounds: ', bounds)
    }
    this.setState(p => ({center, zoom}))
  }

  render() {
    const {
      mapHeight,
      mapWidth,
      onNodeAnchorClick,
      onNodeAnchorMouseOver,
      onNodeAnchorMouseOut,
      onNodeHeaderClick,
      onMapClick,
      nodes
    } = this.props

    const {
      center,
      provider,
      zoom
    } = this.state

    return (
      <div>
        <MapTooltips/>
        <Map
          center={center}
          zoom={zoom}
          provider={providers[provider]}
          onBoundsChanged={this.handleBoundsChange}
          onClick={onMapClick}
          width={mapWidth}
          height={mapHeight}
        >
          {nodes.map(node => {
            return (
              <MapNode
                anchor={getAnchor({latitude: node.latitude, longitude: node.longitude})}
                node={node}
                text={node.title}
                zoom={zoom}
                onAnchorClick={onNodeAnchorClick}
                onAnchorMouseOver={onNodeAnchorMouseOver}
                onAnchorMouseOut={onNodeAnchorMouseOut}
                onHeaderClick={onNodeHeaderClick}
                key={`map-node-${node.id}`}
              />
            )
          })}
        </Map>
      </div>
    )
  }
}

export default MapManager
