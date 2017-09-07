import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'

import { Segment } from 'views/components/layout'


function About({t}) {
  // todo: serve this from a .md file
  return (
    <Segment padded="very">
      <p>Pairroquet a pour intention de fournir un outil de communication pour les personnes ayant décidé de contribuer ensemble pour la Terre et la paix en eux-mêmes.</p>

      <p>Paix et roquette pour tous !</p>

      <p>-- L'équipe de Pairroquet</p>
    </Segment>
  )
}

export default compose(translate())(About)
