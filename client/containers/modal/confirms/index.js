import React from 'react'
import { modalConstants } from 'core/modal'
import { Confirm } from 'components/layout'


export default {
  [modalConstants.CONFIRM]: function ConfirmModal({modalProps}) {
    return (
      <Confirm {...modalProps}/>
    )
  },
}
