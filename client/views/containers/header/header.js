import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { gql, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import { client } from 'core/apollo'
import { authActions } from 'core/auth'
import { getMeCentre } from 'core/me'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { getTitle, getUserLocation } from 'core/settings'

import placeQuery from 'views/dataContainers/place/place.query.graphql'

import Atom from 'views/components/atom'
import { Col } from 'views/components/layout'
import { HeaderGrid, HeaderLink, HeaderTitle } from 'views/components/header'

import currentUserQuery from 'views/dataContainers/app/currentUser.query.graphql'


class HeaderContainer extends Component {
  static isStacked() {
    return window.innerWidth < 767
  }

  state = {
    isStacked: HeaderContainer.isStacked()
  }

  componentDidMount() {
    window.addEventListener('resize', event => {
      const isStacked = HeaderContainer.isStacked()

      if (isStacked !== this.state.isStacked) {
        this.setState(p => ({isStacked}))
      }
    })
  }

  handleHeaderTitleClick = event => {
    event.preventDefault()
    const {rootRoute, routePayload, routeType, setModal, t, userLocation} = this.props
    const placeRouteTypes = [
      routerActions.ME_PLACE_VIEW,
      routerActions.PLACE_VIEW
    ]

    if (routeType === routerActions.ROOT) {
      setModal(modalConstants.SET_LOCATION, {
        isOpen: true,
        center: [userLocation.lat, userLocation.lng],
        modalProps: {
          size: 'small',
          closeIcon: null
        },
        title: t('form:setLocation.header')
      })
    }
    else if (placeRouteTypes.includes(routeType) && routePayload.name) {
      const {name: placeName} = routePayload
      const {place: {latitude, longitude}} = client.readQuery({
        query: placeQuery,
        variables: {title: placeName},
      })

      rootRoute({center: [latitude, longitude]})
    }
  }

  handleLogout = event => {
    const {doLogout, rootRoute, setIsAuthed} = this.props

    doLogout().then(() => {
      setIsAuthed(false)
      rootRoute()
    })
  }

  render() {
    const {
      centre,
      currentUser,
      routeType,
      t
    } = this.props

    const {
      isStacked
    } = this.state

    let titleIcon = <Atom type={centre} height={16} width={16}/>

    if (routeType === routerActions.ROOT) {
      titleIcon = null
    }

    let {title} = this.props
    let truncateTitle = false
    let isLoading = title === null

    if (currentUser && [
        routerActions.ME,
        routerActions.ME_PLACE_EDIT,
        routerActions.ME_PLACES_ADD
      ].includes(routeType)) {
      isLoading = false
      title = `${t('header:my_profile')}`
    }
    else if (!isLoading) {
      const titleMaxLength = 40

      if (title.length > titleMaxLength) {
        truncateTitle = true
        title = `${title.substring(0, titleMaxLength)}...`
      }

      if (routeType === routerActions.ROOT) {
        title = `${t('header:current_position')} ${title}`
      }
    }

    return (
      <HeaderGrid
        className="app-header"
        columns={3}
        stackable
        verticalAlign="middle"
      >
        <Col computer={3}>
          <HeaderLink
            to={routerActions.rootRoute()}
          >
            {t('header:map')}
          </HeaderLink>
        </Col>

        <Col
          computer={10}
          textAlign={isStacked ? 'left' : 'center'}
        >
          <HeaderTitle
            isLoading={isLoading}
            title={truncateTitle ? title : ""}
            onClick={this.handleHeaderTitleClick}
          >
            {titleIcon}
            {title}
          </HeaderTitle>
        </Col>

        <Col
          computer={3}
          textAlign={isStacked ? 'left' : 'right'}
        >
          {currentUser ? (
            <div>
              <HeaderLink to={routerActions.meRoute()}>
                {currentUser.username}
              </HeaderLink>

              <HeaderLink
                to={routerActions.logoutRoute()}
                shouldDispatch={false}
                onClick={this.handleLogout}
              >
                {t('accounts:logout')}
              </HeaderLink>
            </div>
          ) : (
            <div>
              <HeaderLink to={routerActions.authRoute()}>Connexion</HeaderLink>
            </div>
          )}
        </Col>
      </HeaderGrid>
    )
  }
}

const mapStateToProps = state => ({
  centre: getMeCentre(state),
  routePayload: getPayload(state),
  routeType: getRouteType(state),
  title: getTitle(state),
  userLocation: getUserLocation(state)
})

const mapDispatchToProps = {
  setIsAuthed: authActions.setIsAuthed,
  authRoute: routerActions.authRoute,
  meRoute: routerActions.meRoute,
  rootRoute: routerActions.rootRoute,
  setModal: modalActions.setModal
}

const logoutMutationConfig = {
  props({ownProps: {rootRoute, setIsAuthed}, mutate}) {
    return {
      doLogout(){
        return mutate({
          update: store => store.writeQuery({query: currentUserQuery, data: {currentUser: null}})
        })
      }
    }
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(gql`mutation logout {logout{currentUser{id}}}`, logoutMutationConfig),
  translate()
)(HeaderContainer)
