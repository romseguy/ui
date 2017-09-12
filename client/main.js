import 'assets/scss/main.scss'

import React from 'react'

import configureClient from 'setup/apollo'
import configureI18n, { initializeI18n } from 'setup/i18n'
import configureStore from 'setup/redux'
import configureRender from 'setup/react'
import Root from 'setup/react/root'

import reducers from 'core/reducers'
import routes from 'core/routes'
import rootSaga from 'core/saga'


const client = configureClient()
const i18n = configureI18n()
const store = configureStore(reducers, routes, rootSaga, client, i18n)
const render = configureRender(client, i18n, store)

initializeI18n(i18n, store)
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
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React, {
    include: /.*MainPanel.*/,
    includeFunctions: true,
    groupByComponent: true,
    collapseComponentGroups: false,
    mergeDiffs: true,
    onlyFunctions: true
  })
}
