import React from 'react'
import { graphql } from 'react-apollo'
import { compose, pure, withHandlers } from 'recompose'
import modeTypes from 'lib/maps/modeTypes'
import roleTypes from 'lib/maps/roleTypes'
import myPlaceQuery from 'graphql/queries/myPlace.query.graphql'


function PlaceDataContainer(props) {
  const {
    control,
    currentMode,
    mine,
    modes,
    ...rest
  } = props

  return React.createElement(control, {
    ...rest,
    currentMode,
    modes: modes.map(mode => {
      if (mode.key === modeTypes.EDIT) {
        return {...mode, disabled: !mine}
      }
      return mode
    }),
    readOnly: currentMode !== modeTypes.EDIT
  })
}

const myPlaceQueryConfig = {
  options: (props) => {
    return {
      variables: {
        title: props.routePayload.placeTitle
      }
    }
  },
  props({data, ownProps}) {
    const {
      myPlace,
      loading
    } = data

    const {
      isLoading = false,
    } = ownProps

    const props = {
      isLoading: isLoading || loading
    }

    if (!loading && myPlace) {
      props.mine = myPlace.role.id === roleTypes.GUARDIAN
    }

    return props
  }
}

export default compose(
  graphql(myPlaceQuery, myPlaceQueryConfig),
  pure
)(PlaceDataContainer)
