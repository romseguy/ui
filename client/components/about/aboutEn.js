import React from 'react'
import Icon from 'components/icon'
import { Accordion, List, Segment } from 'components/layout'

function AboutEn(props) {
  const {height} = props

  return (
    <Segment padded="very" style={{minHeight: height - 40, margin: '20px'}}>
      <h1>What's the point of Pearrot?</h1>

      <p>Pearrot allows you to contribute easily to the gift economy by sending service offers and demands <strong>through
        the places you are connected with</strong>.</p>

      <h1>How?</h1>

      <p>By creating a Pearrot account, you can contribute:</p>

      <List celled>
        <List.Item>
          <p>
            <Icon name="pointing right"/>
            <strong>With a request for connecting to a place added by someone else.</strong>
          </p>
          Once your request is approved by the place's creator or one of its guardians, you can use the place's parrot
          to send a message (every 24 hours) to the people:

          <List bulleted>
            <List.Item>connected to that place ;</List.Item>
            <List.Item>connected to the places belonging to the cities of your choice.</List.Item>
          </List>
        </List.Item>

        <List.Item>
          <p>
            <Icon name="pointing right"/>
            <strong>With a request for adding either your own place or a place you are a guardian of.</strong>
          </p>
          Once your request is approved by Pearrot, you can:

          <List bulleted>
            <List.Item>
              Use the place's parrot ;
            </List.Item>
            <List.Item>
              Assign roles to people connected to the place. Specifically, those who can vote: <strong>unanimity is
              required</strong> for a parrot to deliver its message ;
            </List.Item>
            <List.Item>
              Accept or reject new connection requests.
            </List.Item>
          </List>
        </List.Item>
      </List>

      <h1>What else?</h1>

      <p>A parrot delivers a message without allowing the recipient to write back. While this is a nice way not to be
        disturbed, you can decide you need an answer by sending a pigeon instead of a parrot!</p>

      <p>Stay tuned for more...</p>

    </Segment>
  )
}

export default AboutEn
