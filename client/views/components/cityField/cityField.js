import React, { Component } from 'react'
import 'views/assets/scss/geosuggest.scss'
import Geosuggest from 'react-geosuggest'

import { createLatLngObject } from 'views/utils/google'

class CityField extends Component {
  render() {
    const {disabled, id, input, center, meta, t, onSuggestSelect} = this.props

    return (
      <Geosuggest
        ref={el => this._geoSuggest = el}
        id={id}
        initialValue={input.value}
        location={createLatLngObject(center[0], center[1])}
        disabled={disabled}
        placeholder={t('geosuggest_placeholder')}
        radius="20"
        skipSuggest={suggest => {
          // keep cities only
          return !suggest.types.includes('locality')
        }}
        onChange={input.onChange}
        onSuggestSelect={onSuggestSelect}
      />
    )
  }
}

export default CityField
