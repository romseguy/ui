import React from 'react'

import Header from 'views/containers/header'
import Modals from 'views/containers/modal'
import Router from 'views/containers/router'

import AppHelmet from './helmet'


const appTitle = "Bolo'Bolo"

function App() {
  return (
    <div>
      <AppHelmet appTitle={appTitle}/>

      <Header appTitle={appTitle}/>

      <Router/>

      <Modals/>
    </div>
  )
}

export default App
