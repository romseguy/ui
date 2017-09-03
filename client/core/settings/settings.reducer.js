import { settingsActions } from './settings.actions'
import { set, setIn, getIn, updateIn } from 'zaphod/compat'


export const SettingsState = {
  canvas: {
    backgroundColor: 'grey'
  },
  i18n: {
    initialized: false
  },
  title: null,
  user: {
    location: {
      city: null,
      department: null,
      lng: null,
      lat: null
    }
  },
}


export function settingsReducer(state = SettingsState, {payload, type}) {
  switch (type) {
    case settingsActions.I18N_INITIALIZED:
      return setIn(state, ['i18n', 'initialized'], true)

    case settingsActions.SET_DEPARTMENT:
      return setIn(state, ['user', 'location', 'department'], payload.department)

    case settingsActions.SET_CITY:
      return setIn(state, ['user', 'location', 'city'], payload.city)

    case settingsActions.SET_LOCATION:
      const location = getIn(state, ['user', 'location'])
      return updateIn(state, ['user', 'location'], location => ({...location, ...payload.location}))

    case settingsActions.SET_TITLE:
      return set(state, 'title', payload.title)

    default:
      return state
  }
}
