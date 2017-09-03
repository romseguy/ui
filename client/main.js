import 'views/assets/scss/main.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer as HotReloadable } from 'react-hot-loader'
import { configureStore } from './redux/store'

import Root from './views/root'


if (process.env.NODE_ENV === 'development') {
  window.perf = require('react-addons-perf')
  window.store = store
  window.s = () => store.getState()
  window.ss = window.$$LogSagas
  window.log = false
  //const {whyDidYouUpdate} = require('why-did-you-update')
  //whyDidYouUpdate(React, {include: /.*map.*/i})
  //whyDidYouUpdate(React)
}

const store = configureStore()
render(Root)

function render(Component) {
  if (module.hot) {
    ReactDOM.render(
      <HotReloadable>
        <Component store={store}/>
      </HotReloadable>,
      document.getElementById('root')
    )
  } else {
    ReactDOM.render(<Component store={store}/>, document.getElementById('root'))
  }
}

if (module.hot) {
  module.hot.accept('./views/root', () => {
    render(Root)
  })
}
