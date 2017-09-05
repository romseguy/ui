import { apolloReducer } from './apollo'
import { canvasReducer } from './canvas'
import { meReducer } from './me'
import { modalReducer } from './modal'
import { placesReducer } from './places'
import { settingsReducer } from './settings'
import { reducer as formReducer } from 'redux-form'
import { reducer as tooltipReducer } from 'redux-tooltip'


export default {
  apollo: apolloReducer,
  form: formReducer,
  canvas: canvasReducer,
  me: meReducer,
  modal: modalReducer,
  places: placesReducer,
  settings: settingsReducer,
  tooltip: tooltipReducer
}
