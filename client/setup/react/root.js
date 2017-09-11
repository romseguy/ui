import React from 'react'
import { ApolloProvider as Provider } from 'react-apollo'
import { I18nextProvider } from 'react-i18next'

import { i18n } from 'core/settings'

import App from 'dataContainers/app'


function Root({client, store}) {
  return (
    <Provider client={client} store={store}>
      <I18nextProvider i18n={i18n}>
        <App/>
      </I18nextProvider>
    </Provider>
  )
}

export default Root