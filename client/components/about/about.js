import React from 'react'
import Icon from 'components/icon'
import { Accordion, List, Segment } from 'components/layout'
import AboutEn from './aboutEn'


function About(props) {
  const {currentLang, height} = props

  if (currentLang === 'en') {
    return (
      <AboutEn {...props}/>
    )
  }

  return (
    <Segment padded="very" style={{minHeight: height - 40, margin: '20px'}}>
      <h1>À quoi sert Pairroquet ?</h1>

      <p>Pairroquet vous permet de contribuer facilement à l'économie du don, en envoyant propositions et demandes de
        service <strong>par l'intermédiaire des lieux auxquels vous êtes connecté</strong>.</p>

      <h1>Comment ?</h1>

      <p>En créant un compte Pairroquet, vous pouvez contribuer :</p>

      <List celled>
        <List.Item>
          <p>
            <Icon name="pointing right"/>
            <strong>Par une demande de connexion à un lieu ajouté par une autre personne.</strong>
          </p>
          Une fois votre demande acceptée par le créateur du lieu ou l'un de ses gardiens, vous disposez du
          perroquet de ce lieu pour envoyer un message (toutes les 24 heures) aux personnes :

          <List bulleted>
            <List.Item>connectées à ce même lieu ;</List.Item>
            <List.Item>connectées aux lieux appartenant aux villes de votre choix.</List.Item>
          </List>
        </List.Item>

        <List.Item>
          <p>
            <Icon name="pointing right"/>
            <strong>Par une demande d'ajout d'un lieu dont vous êtes propriétaire ou gardien.</strong>
          </p>
          Une fois votre demande acceptée par Pairroquet, vous pouvez :

          <List bulleted>
            <List.Item>
              Utiliser le perroquet du lieu ;
            </List.Item>
            <List.Item>
              Attribuer des rôles aux gens connectés au lieu. En particulier, les personnes pouvant voter : <strong>l'unanimité
              est requise</strong> pour qu'un perroquet puisse délivrer son message ;
            </List.Item>
            <List.Item>
              Accepter ou refuser les nouvelles demandes de connexion.
            </List.Item>
          </List>
        </List.Item>
      </List>

      <h1>Quoi de plus ?</h1>

      <p>Un perroquet délivre un message sans proposer au destinataire de répondre. Bien que ce soit une bonne façon de
        ne pas être dérangé, vous pouvez décider d'avoir besoin d'une réponse en envoyant un pigeon à la place d'un
        perroquet!</p>

      <p>Et bien plus à venir...</p>

      {/*
       <List>
       <List.Item>
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

       <List.Item>
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
