import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import bindActionCreators from 'helpers/bindActionCreators'

import { routerActions, getPayload, getRouteType } from 'core/router'
import routes from 'core/routes'

import MainPanelContainer from 'containers/mainPanel'
import MeContainer from 'containers/me'
import PlaceContainer from 'containers/place'
import PlaceFormContainer from 'containers/placeForm'
import PlacesContainer from 'containers/places'
import SymbolForm from 'containers/symbolForm'
import UserContainer from 'containers/user'
import UserForm from 'containers/userForm'

import About from 'components/about'
import Tutorial from 'components/tutorial'
import { CanvasManager } from 'components/canvas'
import { Loader } from 'components/layout'
import { MapManager } from 'components/map'
import SidePanel from 'components/sidePanel'


function Route404({t}) {
  return <div>{t('not_found')}</div>
}

class RouterContainer extends Component {
  render() {
    const {
      currentRoute = {},
      currentUser,
      routeType,
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

    let selectedRouteType = modalRouteType ? modalRouteType : routeType

    if (selectedRouteType === routerActions.ABOUT) {
      return <About {...this.props}/>
    }
    else if (selectedRouteType === routerActions.TUTORIAL) {
      return (
        <Tutorial
          {...this.props}
          routes={routerActions}
        />
      )
    }

    let sidePanelEl = null

    if ([routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(selectedRouteType)) {
      sidePanelEl = <PlaceFormContainer {...this.props} routeType={selectedRouteType}/>
    }
    if ([routerActions.ME_SYMBOLS_ADD, routerActions.ME_SYMBOL_EDIT].includes(selectedRouteType)) {
      sidePanelEl = <SymbolForm {...this.props}/>
    }
    else if ([routerActions.ME_USERS_ADD, routerActions.ME_USER_EDIT].includes(selectedRouteType)) {
      sidePanelEl = <UserForm {...this.props}/>
    }

    let container = null
    let control = null

    if (
      [
        routerActions.ROOT,
        routerActions.PLACES_ADD,
        routerActions.PLACE_EDIT
      ].includes(selectedRouteType)
    ) {
      container = PlacesContainer
      control = MapManager
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
      container = MeContainer
      control = CanvasManager
    }
    else if (
      [
        routerActions.PLACE_VIEW,
        routerActions.ME_PLACE_VIEW
      ].includes(selectedRouteType)
    ) {
      container = PlaceContainer
      control = CanvasManager
    }
    else if (
      [
        routerActions.USER_VIEW
      ].includes(selectedRouteType)
    ) {
      container = UserContainer
      control = CanvasManager
    }

    return (
      <div>
        <MainPanelContainer
          {...this.props}
          container={container}
          control={control}
          routeType={selectedRouteType}
        />
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
  connect(mapStateToProps, mapDispatchToProps),
  pure
)(RouterContainer)
