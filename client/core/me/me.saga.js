import { call, fork, put, select, take, takeEvery } from 'redux-saga/effects'
import { set } from 'zaphod/compat'
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
        //yield call(setPersonCentreSaga, params)
      }
      else if (centre === centreTypes.DEPARTMENT) {
        //yield call(setDepartmentCentreSaga)
      }
      else if (centre === centreTypes.LOCATION) {
        //yield call(setLocationCentreSaga)
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
