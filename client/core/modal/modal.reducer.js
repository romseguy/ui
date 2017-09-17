import { merge, set, setIn, updateIn, unset, push } from 'zaphod/compat'

import { modalActions } from './modal.actions'

export const modalState = {
  modals: {
/*    [modalConstants.AUTH]: {
      isOpen: false
    }*/
  }
}


export function modalReducer(state = modalState, {payload, type}) {
  switch (type) {
    case modalActions.SET_MODAL:
      return {
        modals: merge(state.modals, {
          [payload.modalType]: {
            ...payload.modalComponentProps,
            modalProps: {
              ...payload.modalProps
            }
          }
        })
      }

    default:
      return state
  }
}
