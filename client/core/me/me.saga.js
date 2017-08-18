import { call, fork, put, select, take, takeEvery } from 'redux-saga/effects'
import { set } from 'zaphod/compat'
import { centres } from 'core/constants'
import { meActions } from './me.actions'

export function* meSaga() {

  //====================================
  //  ACTIONS -> TASKS
  //------------------------------------

  yield takeEvery(meActions.SET_CENTRE,
    function* setCentreSaga({payload}) {
      const {centre, params} = payload

      if (centre === centres.MONAD) {
        //yield call(setMonadCentreSaga, params)
      }
      else if (centre === centres.DEPARTMENT) {
        //yield call(setDepartmentCentreSaga)
      }
      else if (centre === centres.LOCATION) {
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
