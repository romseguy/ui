import React from 'react'
import styled from 'styled-components'
import { Header, Icon } from 'views/components/layout'


const Content = styled(Header.Content)`
padding: 1rem;
`

function PlaceFormHeader({routeType, routeTypes, t, title}) {
  let iconName = 'linkify'
  let label = ''

  if (
    routeType === routeTypes.PLACE_EDIT ||
    routeType === routeTypes.ME_PLACE_EDIT
  ) {
    label = title === null ? t('loading') : `Modifier ${title}`
  }
  else if (
    routeType === routeTypes.ME_PLACES_ADD
  ) {
    label = `Connecter un Lieu à Mon Présent`
  }

  return (
    <Header
      as="h2"
      dividing
    >
      <Icon name={iconName} />
      <Content>
        {label}
      </Content>
    </Header>
  )
}

export default PlaceFormHeader
