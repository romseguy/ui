import { apolloReducer } from './apollo'
import { authReducer } from './auth'
import { mainPanelReducer } from './mainPanel'
import { meReducer } from './me'
import { modalReducer } from './modal'
import { placesReducer } from './places'
import { settingsReducer } from './settings'
import { reducer as formReducer } from 'redux-form'
import { reducer as tooltipReducer } from 'redux-tooltip'


export default {
  apollo: apolloReducer,
  auth: authReducer,
  form: formReducer,
  mainPanel: mainPanelReducer,
  me: meReducer,
  modal: modalReducer,
  places: placesReducer,
  settings: settingsReducer,
  tooltip: tooltipReducer
}
