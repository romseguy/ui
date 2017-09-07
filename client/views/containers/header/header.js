import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { gql, graphql } from 'react-apollo'
import { change } from 'redux-form'
import { connect } from 'react-redux'

import geo from 'utils/api/geo'
import { getGeocodedLocation, getGeocodedDepartment } from 'utils/geo'

import { client } from 'core/apollo'
import { meActions, getMeCentre } from 'core/me'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { settingsActions, getCity, getDepartment, getTitle, getUserLocation } from 'core/settings'

import placeQuery from 'views/dataContainers/place/place.query.graphql'
import currentUserQuery from 'views/dataContainers/app/currentUser.query.graphql'
import logoutMutation from 'views/containers/auth/form/logout.mutation.graphql'

import Atom from 'views/components/atom'
import Icon from 'views/components/icon'
import { Col } from 'views/components/layout'
import { HeaderGrid, HeaderLink, HeaderTitle } from 'views/components/header'


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

  handleTitleClick = event => {
    const {
      change,
      rootRoute,
      routePayload,
      routeType,
      setCity,
      setDepartment,
      setLocation,
      setMeCenter,
      setModal,
      t,
      userLocation
    } = this.props

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

        onSubmit: async function handleSetLocationFormSubmit(values, onClose) {
          let {city, department, marker} = values

          if (!marker) {
            const res = await geo.geocodeCity(city)
            const {lat, lng} = getGeocodedLocation(res)
            marker = [lat, lng]
            department = getGeocodedDepartment(res)
          } else if (!department) {
            const res = await geo.geocodeCity(city)
            department = getGeocodedDepartment(res)
          }

          setCity(city)
          setDepartment(department)
          setLocation(marker[0], marker[1])
          setMeCenter(marker)

          typeof onClose === 'function' && onClose()
        },

        onSuggestSelect: function handleSuggestSelect(suggest) {
          const {lat, lng} = suggest.location
          change('SetLocationForm', 'marker', [lat, lng])

          geo.getReverseGeocoding(lat, lng).then(res => {
            const department = getGeocodedDepartment(res)
            change('SetLocationForm', 'department', department)
          })
        },
        title: t('form:setLocation.header')
      })
    }
    // move map to place location
    else if (placeRouteTypes.includes(routeType) && routePayload.name) {
      const {name: placeName} = routePayload
      const {place: {latitude, longitude}} = client.readQuery({
        query: placeQuery,
        variables: {title: placeName},
      })

      setMeCenter([latitude, longitude])
      rootRoute()
    }
  }

  handleTitleIconClick = event => {
    const {
      setMeCenter,
      userLocation,
      onTitleIconClick
    } = this.props

    const {lat, lng} = userLocation
    const center = [lat, lng]
    setMeCenter(center)

    typeof onTitleIconClick === 'function' && onTitleIconClick(event)
  }

  handleLogout = event => {
    const {doLogout, rootRoute} = this.props

    doLogout().then(() => {
      rootRoute()
    })
  }

  render() {
    const {
      centre,
      city,
      currentUser,
      department,
      routeType,
      t
    } = this.props

    const {
      isStacked
    } = this.state

    let titleIcon = <Atom type={centre} height={16} width={16}/>

    if (routeType === routerActions.ROOT) {
      titleIcon = <Icon name="location arrow"/>
    }
    else if (routeType === routerActions.ABOUT) {
      titleIcon = null
    }

    let {title} = this.props

    if ([
        routerActions.ME,
        routerActions.ME_PLACE_EDIT,
        routerActions.ME_PLACES_ADD,
        routerActions.ME_USERS_ADD,
        routerActions.ME_USER_EDIT
      ].includes(routeType)) {
      isLoading = false
      title = `${t('header:my_profile')}`
    }
    else if ([routerActions.ROOT].includes(routeType)) {
      if (city === null) {
        title = t('loading')
      }
      else if (city === false) {
        title = t('header:title')
      }
      else {
        title = city
      }
    }

    let isLoading = title === null

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
            iconTitle={t('header:icon_title')}
            title={t('header:title')}
            titleIcon={titleIcon}
            onClick={this.handleTitleClick}
            onIconClick={this.handleTitleIconClick}
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
    centre: getMeCentre(state),
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
  setMeCenter: meActions.setCenter,
  setModal: modalActions.setModal
}

const logoutMutationConfig = {
  props({mutate}) {
    return {
      doLogout(){
        return mutate({
          refetchQueries: [{
            query: currentUserQuery
          }]
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
  graphql(logoutMutation, logoutMutationConfig),
  translate()
)(HeaderContainer)
