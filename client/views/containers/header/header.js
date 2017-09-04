import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { gql, graphql } from 'react-apollo'
import { change } from 'redux-form'
import { connect } from 'react-redux'

import geo from 'utils/api/geo'
import { getGeocodedLocation, getGeocodedDepartment } from 'utils/geo'

import { client } from 'core/apollo'
import { authActions } from 'core/auth'
import { getMeCentre } from 'core/me'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { settingsActions, getTitle, getUserLocation } from 'core/settings'

import Atom from 'views/components/atom'
import Icon from 'views/components/icon'
import { Col } from 'views/components/layout'
import { HeaderGrid, HeaderLink, HeaderTitle } from 'views/components/header'

import placeQuery from 'views/dataContainers/place/place.query.graphql'
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

  handleTitleClick = event => {
    event.preventDefault()
    const {
      change,
      rootRoute,
      routePayload,
      routeType,
      setCity,
      setDepartment,
      setLocation,
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

        onSubmit: function handleSetLocationFormSubmit(values, onClose) {
         let {city, department, marker} = values

          if (marker) {
            navigate(city, department, marker)
          }
          else {
            geo.geocodeCity(city).then(res => {
              const {lat, lng} = getGeocodedLocation(res)
              marker = [lat, lng]
              department = getGeocodedDepartment(res)
              navigate(city, department, marker)
            })
          }

          function navigate(city, department, marker) {
            setCity(city)
            setDepartment(department)
            setLocation(marker[0], marker[1])
            rootRoute({center: marker})
            typeof onClose === 'function' && onClose()
          }
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
    else if (placeRouteTypes.includes(routeType) && routePayload.name) {
      const {name: placeName} = routePayload
      const {place: {latitude, longitude}} = client.readQuery({
        query: placeQuery,
        variables: {title: placeName},
      })

      rootRoute({center: [latitude, longitude]})
    }
  }

  handleTitleIconClick = event => {
    const {
      rootRoute,
      userLocation,
      onTitleIconClick
    } = this.props

    const {lat, lng} = userLocation
    const center = [lat, lng]
    rootRoute({center})
    typeof onTitleIconClick === 'function' && onTitleIconClick(event)
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
      titleIcon = <Icon name="location arrow"/>
    }

    let {title} = this.props
    let isLoading = title === null

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
    else if ([routerActions.ROOT].includes(routeType) && title) {
      title = `${title}`
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

const mapStateToProps = state => ({
  centre: getMeCentre(state),
  routePayload: getPayload(state),
  routeType: getRouteType(state),
  title: getTitle(state),
  userLocation: getUserLocation(state)
})

const mapDispatchToProps = {
  authRoute: routerActions.authRoute,
  change,
  meRoute: routerActions.meRoute,
  rootRoute: routerActions.rootRoute,
  setIsAuthed: authActions.setIsAuthed,
  setCity: settingsActions.setCity,
  setDepartment: settingsActions.setDepartment,
  setLocation: settingsActions.setLocation,
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
