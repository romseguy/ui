import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'

import { routerActions } from 'core/router'
import { authActions } from './auth.actions'


function* startupSaga() {
}

export function* authSaga() {
  yield all([

    //====================================
    //  STARTUP
    //------------------------------------

    call(startupSaga),

    //====================================
    //  ACTIONS -> TASKS
    //------------------------------------

    //====================================
    //  SAGA EVENTS -> TASKS
    //------------------------------------

    //====================================
    //  UI EVENTS -> TASKS
    //------------------------------------

  ])
}
