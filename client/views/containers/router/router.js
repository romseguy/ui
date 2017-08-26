import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { bindActionCreators } from 'utils/redux'

import { getIsAuthed } from 'core/auth'
import { routerActions, getPayload, getRouteType } from 'core/router'
import routes from 'core/routes'

import MainPanel from 'views/containers/mainPanel'
import Me from 'views/containers/me'
import Place, { PlaceForm } from 'views/containers/place'
import Places from 'views/containers/places'
import SidePanel from 'views/components/sidePanel'
import { SymbolForm } from 'views/containers/symbol'
import User, { UserForm } from 'views/containers/user'

import { CanvasManager } from 'views/components/canvas'
import { Loader } from 'views/components/layout'
import { MapManager } from 'views/components/map'


function Route404({t}) {
  return <span>{t('not_found')}</span>
}

class Router extends Component {
  render() {
    const {currentRoute = {}, isAuthed, routeType, t} = this.props

    if (routeType === routerActions.NOT_FOUND) {
      return <Route404 t={t}/>
    }

    const {
      modalRouteType,
      requiresAuth
    } = currentRoute

    if (requiresAuth && routeType !== routerActions.AUTH && !isAuthed) {
      return <Loader indeterminate/>
    }

    let routeEl = null
    let sidePanelEl = null
    let selectedRouteType = routeType

    if (modalRouteType) {
      selectedRouteType = modalRouteType
    }

    if (
      [
        routerActions.ROOT,
        routerActions.PLACES_ADD,
        routerActions.PLACE_EDIT
      ].includes(routeType)
    ) {
      routeEl = (
        <Places
          {...this.props}
          routeType={selectedRouteType}
        >
          <MainPanel>
            <MapManager/>
          </MainPanel>
        </Places>
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
      ].includes(routeType)
    ) {
      routeEl = (
        <Me
          {...this.props}
          routeType={selectedRouteType}
        >
          <MainPanel>
            <CanvasManager/>
          </MainPanel>
        </Me>
      )

      if ([routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(routeType)) {
        sidePanelEl = <PlaceForm/>
      }
      if ([routerActions.ME_SYMBOLS_ADD, routerActions.ME_SYMBOL_EDIT].includes(routeType)) {
        sidePanelEl = <SymbolForm/>
      }
      else if ([routerActions.ME_USERS_ADD, routerActions.ME_USER_EDIT].includes(routeType)) {
        sidePanelEl = <UserForm/>
      }
    }
    else if (
      [
        routerActions.PLACE_VIEW,
        routerActions.ME_PLACE_VIEW
      ].includes(routeType)
    ) {
      routeEl = (
        <Place
          {...this.props}
          routeType={selectedRouteType}
        >
          <MainPanel>
            <CanvasManager/>
          </MainPanel>
        </Place>
      )
    }
    else if (
      [
        routerActions.USER_VIEW
      ].includes(routeType)
    ) {
      routeEl = (
        <User
          {...this.props}
          routeType={selectedRouteType}
        >
          <MainPanel>
            <CanvasManager/>
          </MainPanel>
        </User>
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


const mapStateToProps = state => {
  const routeType = getRouteType(state)
  const routePayload = getPayload(state)
  const currentRoute = routes[routeType]
  const isAuthed = getIsAuthed(state)

  return {
    currentRoute,
    isAuthed,
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
  ),
)(Router)
