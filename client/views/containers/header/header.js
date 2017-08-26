import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { gql, graphql } from 'react-apollo'
import Link from 'redux-first-router-link'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { authActions } from 'core/auth'
import { getMeCentre } from 'core/me'
import { routerActions, getRouteType } from 'core/router'
import { getTitle } from 'core/settings'

import Atom from 'views/components/atom'
import { Grid, Col, Segment } from 'views/components/layout'
import { media } from 'views/utils/responsive'

import currentUserQuery from './currentUser.query.graphql'

const HeaderContainer = styled(Grid)`
${media.desktop`box-shadow: 0px -1px 10px black;`}
${media.tablet`
box-shadow: none;
`}
`

const HeaderAppTitle = styled.h1`
${media.desktop`padding-left: 1rem;`}
${media.tablet`padding-left: 0;`}
`

const HeaderTitle = styled(Segment)`
padding: 0 !important;
margin: 0 !important;

::after {
  margin-top: -0.85em !important;
  width: 1.5em !important;
  height: 1.5em !important;
}
`

const HeaderLink = styled(Link)`
text-decoration: underline;
cursor: pointer;
color: blue;
margin-right: 5px;
`
const HeaderRawLink = styled.a`
text-decoration: underline;
cursor: pointer;
color: blue;
margin-right: 5px;
`

class Header extends Component {
  static isStacked() {
    return window.innerWidth < 767
  }

  state = {
    isStacked: Header.isStacked()
  }

  componentDidMount() {
    window.addEventListener('resize', event => {
      const isStacked = Header.isStacked()

      if (isStacked !== this.state.isStacked) {
        this.setState(p => ({isStacked}))
      }
    })
  }

  handleLogout = event => {
    const { doLogout, rootRoute, setIsAuthed } = this.props

    doLogout().then(() => {
      setIsAuthed(false)
      rootRoute()
    })
  }

  render() {
    const {
      authRoute,
      appTitle,
      centre,
      currentUserQuery: {currentUser},
      meRoute,
      routeType,
      t
    } = this.props

    const {
      isStacked
    } = this.state

    let {title} = this.props

    if (currentUser && [
        routerActions.ME,
        routerActions.ME_PLACE_EDIT,
        routerActions.ME_PLACES_ADD
      ].includes(routeType)) {
      title = currentUser.username
    }

    const isLoading = title === null
    const titleIcon = <Atom type={centre} height={16} width={16}/>
    const titleMaxLength = 40
    const truncateTitle = title && title.length > titleMaxLength

    return (
      <HeaderContainer
        className="app-header"
        columns={3}
        stackable
        verticalAlign='middle'
      >
        <Col computer={3}>
          <HeaderAppTitle>
            <Link href={routerActions.rootRoute()}>{appTitle}</Link>
          </HeaderAppTitle>
        </Col>

        <Col
          computer={10}
          textAlign={isStacked ? 'left' : 'center'}
        >
          <HeaderTitle
            basic
            loading={isLoading}
            title={truncateTitle ? title : ""}
          >
            {!isLoading && titleIcon}
            {!isLoading && truncateTitle ? `${title.substring(0, titleMaxLength)}...` : title}
          </HeaderTitle>
        </Col>

        <Col
          computer={3}
          textAlign={isStacked ? 'left' : 'right'}
        >
          {currentUser ? (
            <div>
              <HeaderRawLink onClick={() => meRoute()}>{currentUser.username}</HeaderRawLink>
              <HeaderRawLink onClick={this.handleLogout}>{t('accounts:logout')}</HeaderRawLink>
            </div>
          ) : (
            <div>
              <HeaderRawLink onClick={() => authRoute()}>Connexion</HeaderRawLink>
            </div>
          )}
        </Col>
      </HeaderContainer>
    )
  }
}

const mapStateToProps = state => ({
  centre: getMeCentre(state),
  routeType: getRouteType(state),
  title: getTitle(state)
})

const mapDispatchToProps = {
  setIsAuthed: authActions.setIsAuthed,
  authRoute: routerActions.authRoute,
  meRoute: routerActions.meRoute,
  rootRoute: routerActions.rootRoute
}


const currentUserQueryConfig = {
  name: 'currentUserQuery',
  fetchPolicy: 'network-only'
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
  graphql(currentUserQuery, currentUserQueryConfig),
  graphql(gql`mutation logout {logout{currentUser{id}}}`, logoutMutationConfig),
  translate()
)(Header)
