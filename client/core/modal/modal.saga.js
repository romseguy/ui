import { call, put, take, takeEvery, select } from 'redux-saga/effects'
import modalTypes from 'lib/maps/modalTypes'
import { routerActions, getPrevRouteType } from 'core/router'
import routes from 'lib/maps/routes'
import { modalActions } from './modal.actions'


export function* modalSaga() {
  yield takeEvery(modalActions.SET_MODAL,
    function* setModalSaga({payload: {modalType, modalProps}}) {

      switch (modalType) {
        case modalTypes.AUTH:
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

        case modalTypes.ERROR:
          break
      }

    }
  )
}
