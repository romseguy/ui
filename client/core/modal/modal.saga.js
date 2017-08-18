import { call, put, take, takeEvery, select } from 'redux-saga/effects'

import { routerActions, getPrevRouteType } from 'core/router'
import routes from 'core/routes'

import { modalActions } from './modal.actions'
import { modalConstants } from './modal.constants'

export function* modalSaga() {
  yield takeEvery(modalActions.SET_MODAL,
    function* setModalSaga({payload: {modalType, modalProps}}) {

      switch (modalType) {
        case modalConstants.AUTH:
          if (modalProps.isOpen === false) {
            const prevRouteType = yield select(getPrevRouteType)
            const prevRoute = routes[prevRouteType]

            if(prevRouteType === '' || prevRouteType === routerActions.NOT_FOUND || prevRoute.requiresAuth) {
              yield put(routerActions.rootRoute())
              return
            }

            yield put({type: prevRouteType})
          }

          break

        case modalConstants.ERROR:
          break
      }

    }
  )
}
