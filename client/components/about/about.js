import React from 'react'
import { TextIcon } from 'components/icon'
import { Accordion, List, Segment } from 'components/layout'


function About() {

  return (
    <Segment padded="very" style={{margin: '1rem'}}>
      <h1>À quoi sert Pairroquet ?</h1>

      <p>Pairroquet vous donne accès à un réseau de personnes souhaitant contribuer à l'économie du don et du troc.</p>

      <p>Pairroquet vous permet d'envoyer et de recevoir des offres et des demandes de service, <strong>par l'intermédiaire des
        lieux auxquels vous contribuez</strong>.</p>

      <h1>Comment ?</h1>

      <p>Avec votre compte Pairroquet, vous pouvez :</p>

      <List as="ol">
        <List.Item as="li">
          Envoyer une demande de connexion aux lieux que vous connaissez et qui ont été ajouté à Pairroquet. Si votre demande de connexion est acceptée par le propriétaire du lieu, vous aurez accès :

          <List bulleted>
            <List.Item>
              au perroquet du lieu, qui vous permettra d'envoyer offres et demandes de service aux lieux situés à proximité ;
            </List.Item>
            <List.Item>
              à l'historique des offres et demandes de service envoyées à ce lieu ;
            </List.Item>
            <List.Item>
              aux notifications correspondantes aux nouvelles demandes et offres de services envoyées au lieu.
            </List.Item>
          </List>
        </List.Item>

        <List.Item as="li">
          Ajouter votre lieu ou un lieu que vous connaissez à Pairroquet. Si le lieu est accepté par Pairroquet, vous aurez accès :

          <List bulleted>
            <List.Item>
              au perroquet du lieu, qui vous permettra d'envoyer offres et demandes de service aux lieux situés à proximité ;
            </List.Item>
            <List.Item>
              aux fonctionnalités d'administration vous permettant d'accepter les demandes de connexion des personnes travaillant avec vous. </List.Item>
          </List>
        </List.Item>

      </List>
    </Segment>
  )
}

export default About
