import { canvasReducer } from './canvas'
import { mapReducer } from './map'
import { meReducer } from './me'
import { modalReducer } from './modal'
import { settingsReducer } from './settings'
import { reducer as formReducer } from 'redux-form'
import { reducer as tooltipReducer } from 'redux-tooltip'


export default {
  form: formReducer,
  canvas: canvasReducer,
  map: mapReducer,
  me: meReducer,
  modal: modalReducer,
  settings: settingsReducer,
  tooltip: tooltipReducer
}
