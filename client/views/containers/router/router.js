import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { bindActionCreators } from 'utils/redux'

import { routerActions, getPayload, getRouteType } from 'core/router'
import routes from 'core/routes'

import MainPanel from 'views/containers/mainPanel'
import Me from 'views/dataContainers/me'
import Place, { PlaceForm } from 'views/dataContainers/place'
import Places from 'views/dataContainers/places'
import SidePanel from 'views/components/sidePanel'
import { SymbolForm } from 'views/containers/symbol'
import User, { UserForm } from 'views/dataContainers/user'

import About from 'views/components/about'
import { CanvasManager } from 'views/components/canvas'
import { Loader } from 'views/components/layout'
import { MapManager } from 'views/components/map'


function Route404({t}) {
  return <div>{t('not_found')}</div>
}

class RouterContainer extends Component {
  render() {
    const {
      currentRoute = {},
      currentUser,
      routeType,
      routePayload,
      t
    } = this.props


    if (routeType === routerActions.NOT_FOUND) {
      return <Route404 t={t}/>
    }

    const {
      modalRouteType,
      requiresAuth
    } = currentRoute

    if (requiresAuth && routeType !== routerActions.AUTH && !currentUser) {
      return <Loader indeterminate/>
    }

    let routeEl = null
    let sidePanelEl = null
    let selectedRouteType = routeType

    if (modalRouteType) {
      selectedRouteType = modalRouteType
    }

    if (selectedRouteType === routerActions.ABOUT) {
      routeEl = (
        <About {...this.props}/>
      )
    }
    else if (
      [
        routerActions.ROOT,
        routerActions.PLACES_ADD,
        routerActions.PLACE_EDIT
      ].includes(selectedRouteType)
    ) {
      routeEl = (
        <MainPanel
          {...this.props}
          dataContainer={Places}
          control={MapManager}
          routeType={selectedRouteType}
        />
      )
    }
    else if (
      [
        routerActions.ME,
        routerActions.ME_PLACES_ADD,
        routerActions.ME_PLACE_EDIT,
        routerActions.ME_SYMBOLS_ADD,
        routerActions.ME_SYMBOL_EDIT,
        routerActions.ME_USERS_ADD,
        routerActions.ME_USER_EDIT
      ].includes(selectedRouteType)
    ) {
      routeEl = (
        <MainPanel
          {...this.props}
          dataContainer={Me}
          control={CanvasManager}
          routeType={selectedRouteType}
        />
      )

      if ([routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(selectedRouteType)) {
        sidePanelEl = <PlaceForm {...this.props} routeType={selectedRouteType}/>
      }
      if ([routerActions.ME_SYMBOLS_ADD, routerActions.ME_SYMBOL_EDIT].includes(selectedRouteType)) {
        sidePanelEl = <SymbolForm {...this.props}/>
      }
      else if ([routerActions.ME_USERS_ADD, routerActions.ME_USER_EDIT].includes(selectedRouteType)) {
        sidePanelEl = <UserForm {...this.props}/>
      }
    }
    else if (
      [
        routerActions.PLACE_VIEW,
        routerActions.ME_PLACE_VIEW
      ].includes(selectedRouteType)
    ) {
      routeEl = (
        <MainPanel
          {...this.props}
          dataContainer={Place}
          control={CanvasManager}
          routeType={selectedRouteType}
        />
      )
    }
    else if (
      [
        routerActions.USER_VIEW
      ].includes(selectedRouteType)
    ) {
      routeEl = (
        <MainPanel
          {...this.props}
          dataContainer={User}
          control={CanvasManager}
          routeType={selectedRouteType}
        />
      )
    }
    else {
      return <Route404 t={t}/>
    }

    return (
      <div>
        {routeEl}
        {sidePanelEl && <SidePanel>{sidePanelEl}</SidePanel>}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const routeType = getRouteType(state)
  const routePayload = getPayload(state)
  const currentRoute = routes[routeType]

  return {
    currentRoute,
    routePayload,
    routeType
  }
}

const mapDispatchToProps = dispatch => {
  return {
    routes: bindActionCreators(routerActions, dispatch)
  }
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RouterContainer)
