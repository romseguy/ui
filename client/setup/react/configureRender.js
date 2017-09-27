import React from 'react'
import ReactDOM from 'react-dom'


export default function configureRender(client, i18n, store) {
  const HotReloadable = process.env.NODE_ENV === 'development'
    ? require('react-hot-loader').AppContainer
    : ({children}) => (children)

  return App => {
    ReactDOM.render(
      <HotReloadable>
        <App client={client} i18n={i18n} store={store}/>
      </HotReloadable>,
      document.getElementById('app')
    )
  }
}
