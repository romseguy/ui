import 'assets/scss/main.scss'

import React from 'react'

import configureClient from 'setup/apollo'
import configureStore from 'setup/redux'
import configureRender from 'setup/react'
import Root from 'setup/react/root'

import reducers from 'core/reducers'
import routes from 'core/routes'
import rootSaga from 'core/saga'


const client = configureClient()
const store = configureStore(reducers, routes, rootSaga, client)
const render = configureRender(client, store)

render(Root)

if (module.hot) {
  module.hot.accept('setup/react/root', () => {
    render(Root)
  })
}

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
