import { canvasReducer } from './canvas'
import { meReducer } from './me'
import { modalReducer } from './modal'
import { settingsReducer } from './settings'
import { reducer as formReducer } from 'redux-form'
import { reducer as tooltipReducer } from 'redux-tooltip'


export default {
  form: formReducer,
  canvas: canvasReducer,
  me: meReducer,
  modal: modalReducer,
  settings: settingsReducer,
  tooltip: tooltipReducer
}
