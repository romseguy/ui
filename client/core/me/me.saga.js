import { call, fork, put, select, take, takeEvery } from 'redux-saga/effects'
import { centreTypes } from 'core/constants'
import { meActions } from './me.actions'

export function* meSaga() {

  //====================================
  //  ACTIONS -> TASKS
  //------------------------------------

  yield takeEvery(meActions.SET_CENTRE,
    function* setCentreSaga({payload}) {
      const {centre, params} = payload

      if (centre === centreTypes.PERSON) {
      }
      else if (centre === centreTypes.DEPARTMENT) {
      }
      else if (centre === centreTypes.LOCATION) {
      }
    }
  )

  //====================================
  //  SAGA EVENTS -> TASKS
  //------------------------------------

  //====================================
  //  UI EVENTS -> TASKS
  //------------------------------------


}
