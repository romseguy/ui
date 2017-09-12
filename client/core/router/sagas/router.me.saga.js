import { call, getContext, put, select, take } from 'redux-saga/effects'

import { canvasActions, getCanvasNodesSaga } from 'core/canvas'

import setCentreSaga from 'sagas/setCentre.saga'
import setTitleSaga from 'sagas/setTitle.saga'


export function* meSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)
}

export function* mePlaceEditSaga(payload, settings) {
  const {centre} = settings
  const {name: placeName} = payload
  const i18n = yield getContext('i18n')

  yield call(setCentreSaga, centre)

  const nodes = yield call(getCanvasNodesSaga)
  const selectedNode = nodes.find(node => node.name === placeName)

  // todo: 404 place
  yield call(setTitleSaga, `${i18n.t('header:place_profile')} ${placeName}`, {i18n: true})

  if (selectedNode) {
    yield put(canvasActions.selectNode(true, selectedNode))
  }
}

export function* mePlacesAddSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)
}

// NIY
export function* mePlaceViewSaga(payload, settings) {
  const {name: placeName} = payload
  const {centre} = settings
  const i18n = yield getContext('i18n')

  yield call(setCentreSaga, centre)
  yield call(setTitleSaga, `${i18n.t('header:place_profile')} ${placeName}`, {i18n: true})
}

// NIY
export function* meUsersAddSaga(payload, settings) {
  const {centre} = settings
  const {} = payload

  yield call(setCentreSaga, centre)
}
