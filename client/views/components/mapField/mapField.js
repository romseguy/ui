import React, { Component } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import { providers } from 'views/utils/map'

class MapField extends Component {
  handleMapClick = click => {
    const {event, latLng, pixel} = click

    if (!this.props.readOnly) {
      this.props.onMapClick(click)
      this.props.input.onChange(latLng)
    }
  }

  render() {
    const {
      center,
      input,
      zoom
    } = this.props

    const latLng = input.value
    let marker = null

    if (Array.isArray(latLng)) {
      marker = <Marker anchor={latLng}/>
    }

    return (
      <ContainerDimensions>
        {
          ({width}) => (
            <Map
              center={center}
              zoom={zoom}
              provider={providers['outdoors']}
              height={200}
              width={width - 30}
              onBoundsChanged={this.handleBoundsChange}
              onClick={this.handleMapClick}
            >
              {marker}
            </Map>
          )
        }
      </ContainerDimensions>
    )
  }
}

export default MapField
