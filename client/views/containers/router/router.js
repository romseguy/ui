import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { bindActionCreators } from 'utils/redux'

import { getIsAuthed } from 'core/auth'
import { routerActions, getPayload, getRouteType } from 'core/router'
import routes from 'core/routes'

import MainPanel from 'views/containers/mainPanel'
import Me from 'views/dataContainers/me'
import Place, { PlaceForm } from 'views/dataContainers/place'
import Places from 'views/dataContainers/places'
import SidePanel from 'views/components/sidePanel'
import { SymbolForm } from 'views/containers/symbol'
import User, { UserForm } from 'views/dataContainers/user'

import { CanvasManager } from 'views/components/canvas'
import { Loader } from 'views/components/layout'
import { MapManager } from 'views/components/map'


function Route404({t}) {
  return <span>{t('not_found')}</span>
}

class RouterContainer extends Component {
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
        <MainPanel {...this.props} routeType={selectedRouteType}>
          <Places>
            <MapManager/>
          </Places>
        </MainPanel>
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
        <MainPanel {...this.props} routeType={selectedRouteType}>
          <Me>
            <CanvasManager/>
          </Me>
        </MainPanel>
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
        <MainPanel {...this.props} routeType={selectedRouteType}>
          <Place>
            <CanvasManager/>
          </Place>
        </MainPanel>
      )
    }
    else if (
      [
        routerActions.USER_VIEW
      ].includes(routeType)
    ) {
      routeEl = (
        <MainPanel {...this.props} routeType={selectedRouteType}>
          <User>
            <CanvasManager/>
          </User>
        </MainPanel>
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


const mapStateToProps = (state, {currentUser}) => {
  const routeType = getRouteType(state)
  const routePayload = getPayload(state)
  const currentRoute = routes[routeType]
  const isAuthed = currentUser !== null

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
  )
)(RouterContainer)
