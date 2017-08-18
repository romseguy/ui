import { all, call, cancel, fork, put, race, select, take, takeEvery, } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { change } from 'redux-form'

import { getLocationDataSaga } from 'core/settings/shared'

import { placesActions } from './places.actions'


function* startupSaga() {
}

export function* placesSaga() {
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
