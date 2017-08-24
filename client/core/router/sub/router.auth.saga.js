import { call, put } from 'redux-saga/effects'
import { modalActions, modalConstants } from 'core/modal'

import { routerActions } from '../'
import { setDepartmentTitle } from './router.sub.saga'


export function* authSaga(payload, settings) {
  const {isAuthed} = settings

  if (isAuthed === false) {
    yield put(modalActions.setModal(modalConstants.AUTH, {
      isOpen: true,
      modalProps: {
        size: 'small',
        basic: true,
        closeOnRootNodeClick: false
      }
    }))
  } else {
    yield put(routerActions.rootRoute())
  }

  yield call(setDepartmentTitle)
}
