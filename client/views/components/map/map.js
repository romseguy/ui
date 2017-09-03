import React from 'react'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"

const Map = withGoogleMap(props => {
  const {
    defaultCenter,
    onMapLoad,
    onClick,
    onMarkerClick,
    onMarkerRightClick,
    defaultZoom,
    markers,
    markerContent,
    selectedMarker,
    value
  } = props

  return (
    <GoogleMap
      ref={onMapLoad}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      onClick={onClick}
    >
      {markers && markers.map((marker, i) => {
        let content = null

        if (selectedMarker && marker.position.lat === selectedMarker.position.lat && marker.position.lng === selectedMarker.position.lng) {
          content = (
            <InfoWindow>
              <span>{markerContent}</span>
            </InfoWindow>
          )
        }

        return (
          <Marker
            {...marker}
            key={`m${i}`}
            onClick={() => typeof onMarkerClick === 'function' && onMarkerClick(marker)}
            onRightClick={() => onMarkerRightClick(marker)}
          >
            {content}
          </Marker>
        )
      })}
    </GoogleMap>
  )
})

export default Map
