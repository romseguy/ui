import 'views/assets/scss/geosuggest.scss'

import React, { Component } from 'react'
import Geosuggest from 'react-geosuggest'

import { getSuggestedCity } from 'views/utils/geosuggest'
import { createLatLngObject } from 'views/utils/google'

class GeosuggestField extends Component {
  componentWillReceiveProps(nextProps) {
    // https://github.com/ubilabs/react-geosuggest/issues/275
    if (this.props.input.value !== nextProps.input.value) {
      this._geoSuggest.update(nextProps.input.value)
    }
  }

  handleSuggestSelect = suggest => {
    this.props.input.onChange(getSuggestedCity(suggest))
    this.props.onSuggestSelect(suggest)
  }

  render() {
    const {
      disabled,
      id,
      input,
      center,
      meta,
      skipSuggest,
      t,
    } = this.props

    return (
      <Geosuggest
        ref={el => this._geoSuggest = el}
        id={id}
        initialValue={input.value}
        location={createLatLngObject(center[0], center[1])}
        disabled={disabled}
        placeholder={t('geosuggest_placeholder')}
        radius="20"
        skipSuggest={skipSuggest}
        onChange={input.onChange}
        onSuggestSelect={this.handleSuggestSelect}
      />
    )
  }
}

export default GeosuggestField
