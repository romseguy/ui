import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer as HotReloadable } from 'react-hot-loader'


export default function configureRender(client, i18n, store) {
  return App => {
    ReactDOM.render(
      <HotReloadable>
        <App client={client} i18n={i18n} store={store}/>
      </HotReloadable>,
      document.getElementById('app')
    )
  }
}
