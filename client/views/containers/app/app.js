import React from 'react'

import Header from 'views/containers/header'
import Modals from 'views/containers/modal'
import Portals from 'views/containers/portal'
import Router from 'views/containers/router'

import AppHelmet from './helmet'


const appTitle = 'Le Présent'

function App() {
  return (
    <div>
      <AppHelmet appTitle={appTitle}/>

      <Header appTitle={appTitle}/>

      <Router/>

      <Portals/>

      <Modals/>
    </div>
  )
}

export default App
