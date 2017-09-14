import { put, select } from 'redux-saga/effects'
import { modalActions, modalConstants, getModals } from 'core/modal'


export default function* setErrorModalSaga(props) {
  const modals = yield select(getModals)

  if (modals[modalConstants.ERROR] && modals[modalConstants.ERROR].isOpen) {
    return
  }

  yield put(modalActions.setModal(modalConstants.ERROR, {
    isOpen: true,
    modalProps: {
      basic: true,
      size: 'small'
    },
    ...props
  }))
}

