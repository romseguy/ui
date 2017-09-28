import React from 'react'
import { TextIcon } from 'components/icon'
import { Accordion, List, Segment } from 'components/layout'


function About({height}) {
  return (
    <Segment padded="very" style={{minHeight: height - 40, margin: '20px'}}>
      <h1>À quoi sert Pairroquet ?</h1>

      <p>Pairroquet vous permet de contribuer facilement à l'économie du don et du troc, en envoyant propositions et
        demandes de service <strong>par l'intermédiaire des lieux auxquels vous contribuez</strong>.</p>

      <h1>Comment ?</h1>

      <p>Avec votre compte Pairroquet, vous pouvez :</p>

      <List as="ol">
        <List.Item as="li">
          Vous connecter à un lieu que vous connaissez et qui a été ajouté à Pairroquet. Vous aurez alors accès :

          <List bulleted>
            <List.Item>
              au perroquet du lieu, vous permettant d'envoyer propositions et demandes de service :
              <List>
                <List.Item>aux lieux situés dans un rayon de Xkm autour du lieu ;</List.Item>
                <List.Item>aux lieux appartenant aux villes de votre choix.</List.Item>
              </List>
            </List.Item>
          </List>
        </List.Item>

        <List.Item as="li">
          Ajouter votre lieu ou un lieu que vous connaissez à Pairroquet. En plus d'avoir accès au perroquet du lieu, vous aurez accès :

          <List bulleted>
            <List.Item>
              aux fonctionnalités d'administration du lieu :
              <List>
                <List.Item>
                  contrôle des demandes de connexion  ;
                </List.Item>
                <List.Item>
                  contrôle des perroquets.
                </List.Item>
              </List>
            </List.Item>
          </List>
        </List.Item>
      </List>

      {/*
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
       */}
    </Segment>
  )
}

export default About
