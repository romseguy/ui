import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose, pure, withState } from 'recompose'
import { NOT_FOUND } from 'redux-first-router'

import debug from 'helpers/debug'

import { routerActions, getPayload, getPrevRouteType, getRouteType, routes } from 'core/router'

import MainPanelContainer from 'containers/mainPanel'
import PlaceFormContainer from 'containers/placeForm'
import SymbolFormContainer from 'containers/symbolForm'
import UserFormContainer from 'containers/userForm'

import About from 'components/about'
import Tutorial from 'components/tutorial'
import { Loader } from 'components/layout'
import SidePanel from 'components/sidePanel'


class RouterContainer extends React.Component {
  state = {
    isLoading: false
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    this.setIsLoading(false)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routeType !== nextProps.routeType) {
      this.setIsLoading(true)
    }
  }

  setIsLoading(isLoading) {
    if (this.state.isLoading !== isLoading) {
      this.setState(p => ({isLoading}))
    }
  }

  render() {
    const {
      currentRoute = {},
      currentUser,
      prevRouteType,
      prevRoute = {},
      routeType,
      t
    } = this.props

    const props = {...this.props, ...this.state}

    if (routeType === NOT_FOUND) {
      return (
        <MainPanelContainer
          {...props}
          error={t('not_found')}
        />
      )
    }

    if (routeType !== routerActions.AUTH && !currentUser && currentRoute.requiresAuth !== false) {
      return <Loader indeterminate/>
    }

    if (routeType === routerActions.AUTH) {
      return (
        <MainPanelContainer
          {...props}
          routeType={prevRoute.requiresAuth === false ? prevRouteType : routerActions.ROOT}
        />
      )
    }
    else if (routeType === routerActions.LOGOUT) {
      return null
    }

    let control = null

    if (routeType === routerActions.ABOUT) {
      control = About
    }
    else if (routeType === routerActions.TUTORIAL) {
      control = <Tutorial {...props} routes={routerActions}/>
    }

    let sidePanelEl = null

    if ([routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(routeType)) {
      sidePanelEl = <PlaceFormContainer {...props} routeType={routeType}/>
    }
    else if ([
        routerActions.ME_SYMBOLS_ADD,
        routerActions.ME_SYMBOL_EDIT,
        routerActions.PLACE_SYMBOLS_ADD
      ].includes(routeType)) {
      sidePanelEl = <SymbolFormContainer {...props}/>
    }
    else if ([routerActions.ME_USERS_ADD, routerActions.ME_USER_EDIT].includes(routeType)) {
      sidePanelEl = <UserFormContainer {...props}/>
    }

    return (
      <div>
        <MainPanelContainer
          {...props}
          control={control}
          routeType={routeType}
        />
        {sidePanelEl && <SidePanel>{sidePanelEl}</SidePanel>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const prevRouteType = getPrevRouteType(state)
  const prevRoute = routes[prevRouteType]
  const routeType = getRouteType(state)
  const routePayload = getPayload(state)
  const currentRoute = routes[routeType]

  return {
    currentRoute,
    prevRoute,
    prevRouteType,
    routePayload,
    routeType
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
  pure
)(RouterContainer)
