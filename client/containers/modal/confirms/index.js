import React from 'react'
import modalTypes from 'lib/maps/modalTypes'
import { Confirm } from 'components/layout'


export default {
  [modalTypes.CONFIRM]: function ConfirmModal({modalProps}) {
    return (
      <Confirm {...modalProps}/>
    )
  },
}
