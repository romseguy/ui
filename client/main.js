import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { configureStore } from './redux/store'

import './views/assets/scss/main.scss'
import Root from './views/root'


if (process.env.NODE_ENV === 'development') {
  window.perf = require('react-addons-perf')
  window.store = store
  window.s = () => store.getState()
  window.ss = window.$$LogSagas
  window.log = true
  //const {whyDidYouUpdate} = require('why-did-you-update')
  //whyDidYouUpdate(React, {include: /.*map.*/i})
  //whyDidYouUpdate(React)
}

const store = configureStore()
render(Root)

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Component store={store}/>
    </AppContainer>,
    document.getElementById('root')
  )
}

if (module.hot) {
  module.hot.accept('./views/root', () => {
    render(Root)
  })
}
