import { merge, set, setIn, updateIn, unset, push } from 'zaphod/compat'

import { modalActions } from './modal.actions'

export const ModalState = {
  modals: {
/*    [modalConstants.AUTH]: {
      isOpen: false
    }*/
  }
}


export function modalReducer(state = ModalState, {payload, type}) {
  switch (type) {
    case modalActions.SET_MODAL:
      return {
        modals: merge(state.modals, {
          [payload.modalType]: payload.modalProps
        })
      }

    default:
      return state
  }
}
