import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer as HotReloadable } from 'react-hot-loader'


function configureRender(client, store) {
  return App => {
    ReactDOM.render(
      <HotReloadable>
        <App client={client} store={store}/>
      </HotReloadable>,
      document.getElementById('app')
    )
  }
}

export default configureRender
