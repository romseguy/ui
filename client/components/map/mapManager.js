import Map from 'pigeon-maps'
import React, { Component } from 'react'
import { createSelector } from 'reselect'

import { MapTooltips } from 'components/tooltips'
import { providers } from 'utils/map'

import MapNode from './mapNode'


const getAnchor = createSelector(
  r => r.latitude,
  r => r.longitude,
  (latitude, longitude) => [latitude, longitude]
)

const getCenter = createSelector(
  r => r.center,
  r => r.userLocation,
  (center, userLocation) => center.length ? center : [userLocation.lat, userLocation.lng]
)


class MapManager extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zoom: 14,
      provider: 'outdoors'
    }
  }

  handleBoundsChange = data => {
    const {onBoundsChange} = this.props
    const {center, zoom, bounds, initial} = data

    this.setState(p => ({zoom}))

    typeof onBoundsChange === 'function' && onBoundsChange(data)
  }

  render() {
    const {
      center,
      mapHeight,
      mapWidth,
      nodes,
      t,
      userLocation,
      onNodeAnchorClick,
      onNodeAnchorMouseOver,
      onNodeAnchorMouseOut,
      onNodeHeaderClick,
      onMapClick
    } = this.props

    const {
      provider,
      zoom
    } = this.state

    return (
      <div>
        <MapTooltips t={t}/>

        <Map
          center={getCenter({center, userLocation})}
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
