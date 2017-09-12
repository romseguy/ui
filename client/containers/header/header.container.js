import PropTypes from 'prop-types'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { graphql } from 'react-apollo'
import { getContext } from 'recompose'
import { change } from 'redux-form'
import { connect } from 'react-redux'

import geo from 'lib/api/geo'
import { getGeocodedLocation, getGeocodedDepartment } from 'lib/api/geo'
import sizeTypes from 'lib/maps/sizeTypes'

import { mapActions } from 'core/map'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { settingsActions, getCity, getDepartment, getTitle, getUserLocation } from 'core/settings'

import placeQuery from 'graphql/queries/place.query.graphql'
import currentUserQuery from 'graphql/queries/currentUser.query.graphql'
import logoutMutation from 'graphql/mutations/logout.mutation.graphql'

import Icon from 'components/icon'
import { Col } from 'components/layout'
import { HeaderGrid, HeaderIcon, HeaderLink, HeaderTitle } from 'components/header'


class HeaderContainer extends Component {
  static isStacked() {
    return window.innerWidth < sizeTypes.tablet
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

  handleConnectIconClick = event => {
    // todo: route /me/place/:name/connect
    // todo: check wheter user is connected to the place already and display unlinkify icon -> confirm modal -> delete userplace
  }

  handleLocationIconClick = event => {
    const {
      client,
      rootRoute,
      routePayload,
      routeType,
      setCenter,
      userLocation,
      onLocationIconClick
    } = this.props

    if ([routerActions.ROOT].includes(routeType)) {
      setCenter([userLocation.lat, userLocation.lng])
      typeof onLocationIconClick === 'function' && onLocationIconClick()
    }
    else if ([
        routerActions.ME_PLACE_VIEW,
        routerActions.PLACE_VIEW
      ].includes(routeType) && routePayload.name) {
      const {name: placeName} = routePayload
      const {place} = client.readQuery({
        query: placeQuery,
        variables: {title: placeName},
      })

      setCenter([place.latitude, place.longitude])
      rootRoute()
    }
    else {
      setCenter([userLocation.lat, userLocation.lng])
      rootRoute()
    }
  }

  handleLogout = event => {
    const {doLogout, rootRoute} = this.props

    doLogout({
      refetchQueries: [{
        query: currentUserQuery
      }]
    }).then(() => {
      rootRoute()
    })
  }

  handleTitleClick = event => {
    const {
      change,
      routeType,
      setCity,
      setDepartment,
      setLocation,
      setCenter,
      setModal,
      t,
      userLocation
    } = this.props

    if ([routerActions.ROOT].includes(routeType)) {
      setModal(modalConstants.SET_LOCATION, {
        isOpen: true,
        center: [userLocation.lat, userLocation.lng],
        modalProps: {
          size: 'small',
          closeIcon: null
        },

        onSubmit: async function handleSetLocationFormSubmit(values, onClose) {
          let {city, department, marker} = values
          let geocodingResult = null

          if (!marker) {
            geocodingResult = await geo.geocodeCity(city)

            const {lat, lng} = getGeocodedLocation(geocodingResult)
            marker = [lat, lng]
          }

          if (!department) {
            if (!geocodingResult) {
              geocodingResult = await geo.geocodeCity(city)
            }

            department = getGeocodedDepartment(geocodingResult)
          }

          setCity(city)
          setDepartment(department)
          setLocation(marker[0], marker[1])
          setCenter(marker)

          typeof onClose === 'function' && onClose()
        },

        onSuggestSelect: async function handleSuggestSelect(suggest) {
          const {lat, lng} = suggest.location
          change('SetLocationForm', 'marker', [lat, lng])

          const res = await geo.getReverseGeocoding(lat, lng)
          const department = getGeocodedDepartment(res)
          change('SetLocationForm', 'department', department)
        },
        title: t('form:setLocation.header')
      })
    }
  }

  render() {
    const {
      city,
      currentUser,
      department,
      routeType,
      routePayload,
      t
    } = this.props

    const {
      isStacked
    } = this.state

    const monadIcon = <Icon name="monad" height={16} width={16}/>
    const placeIcon = <Icon name="place" height={16} width={16}/>

    let connectIcon = null
    let connectIconTitle = t('header:connect.title.place')
    let entityIcon = null
    let entityIconTitle = ''
    let locationIcon = <HeaderIcon bordered name="location arrow"/>
    let locationIconTitle = t('header:location.title.default')
    let {title} = this.props
    let subtitle = ''

    let onLocationIconClick = this.handleLocationIconClick
    let onTitleClick = this.handleTitleClick
    let onConnectIconClick = this.handleConnectIconClick

    if ([
        routerActions.ME,
        routerActions.ME_PLACE_EDIT,
        routerActions.ME_PLACES_ADD,
        routerActions.ME_USERS_ADD,
        routerActions.ME_USER_EDIT
      ].includes(routeType)) {
      title = ''
      entityIconTitle = t('header:my_profile')

      entityIcon = monadIcon
      onTitleClick = null
    } else if ([
        routerActions.USER_VIEW
      ].includes(routeType)) {
      entityIcon = placeIcon
      entityIconTitle = t('header:entityIcon.title.person') + ` ${routePayload.name}`
      onTitleClick = null
    } else if ([
        routerActions.PLACE_VIEW
      ].includes(routeType)) {
      connectIcon = <Icon bordered name="linkify"/>
      entityIcon = placeIcon
      entityIconTitle = t('header:entityIcon.title.place') + ` ${routePayload.name}`
      locationIconTitle = t('header:location.title.place')
      onTitleClick = null
    } else {
      entityIcon = null

      if (city === null) {
        title = t('loading')
      }
      else if (city === false) {
        title = t('header:title')
      }
      else {
        title = city
        subtitle = t('header:title')
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
          {t('app_title')}

          {' '}

          <HeaderLink to={routerActions.rootRoute()}>
            {t('header:map')}
          </HeaderLink>

          <HeaderLink to={routerActions.tutorialRoute()}>
            {t('header:tutorial')}
          </HeaderLink>
        </Col>

        <Col
          computer={10}
          textAlign={isStacked ? 'left' : 'center'}
        >
          <HeaderTitle
            connectIcon={connectIcon}
            connectIconTitle={connectIconTitle}
            entityIcon={entityIcon}
            entityIconTitle={entityIconTitle}
            locationIcon={locationIcon}
            locationIconTitle={locationIconTitle}
            title={subtitle}
            onLocationIconClick={onLocationIconClick}
            onClick={onTitleClick}
            onConnectIconClick={onConnectIconClick}
          >
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
                {t('header:logout')}
              </HeaderLink>
            </div>
          ) : (
            <div>
              <HeaderLink to={routerActions.authRoute()}>{t('header:login')}</HeaderLink>
            </div>
          )}
        </Col>
      </HeaderGrid>
    )
  }
}

const mapStateToProps = state => {
  const city = getCity(state)
  const department = getDepartment(state)
  const routeType = getRouteType(state)
  const title = getTitle(state)

  return {
    city,
    department,
    routePayload: getPayload(state),
    routeType,
    title,
    userLocation: getUserLocation(state)
  }
}

const mapDispatchToProps = {
  change,
  rootRoute: routerActions.rootRoute,
  setCity: settingsActions.setCity,
  setDepartment: settingsActions.setDepartment,
  setLocation: settingsActions.setLocation,
  setCenter: mapActions.setCenter,
  setModal: modalActions.setModal
}

const logoutMutationConfig = {name: 'doLogout'}

export default compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  graphql(logoutMutation, logoutMutationConfig),
  getContext({client: PropTypes.object})
)(HeaderContainer)
