import Map from 'pigeon-maps'
import React, { Component } from 'react'
import { compose, pure } from 'recompose'
import { createSelector } from 'reselect'

import { MapTooltips } from 'components/tooltips'
import { providers } from 'helpers/map'

import MapNode from './mapNode'


const getAnchor = createSelector(
  r => r.latitude,
  r => r.longitude,
  (latitude, longitude) => [latitude, longitude]
)

const getMapCenter = createSelector(
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

  setZoom(zoom) {
    if (zoom !== this.state.zoom) {
      this.setState(p => ({
        zoom
      }))
    }
  }

  handleBoundsChange = data => {
    const {onBoundsChange} = this.props
    const {center, zoom, bounds, initial} = data

    this.setZoom(zoom)

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
          center={getMapCenter({center, userLocation})}
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

export default compose(pure)(MapManager)
