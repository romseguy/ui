import React from 'react'
import { Accordion, List, Segment } from 'components/layout'

function AboutEn(props) {
  const {height} = props

  return (
    <Segment padded="very" style={{minHeight: height - 40, margin: '20px'}}>
      <h1>What's the point of Pearrot?</h1>

      <p>Pearrot allows you to contribute easily to the gift economy by sending service offers and demands through the
        places you are connected with.</p>

      <h1>How?</h1>

      <p>With your Pearrot account, you can:</p>

      <List as="ol">
        <List.Item as="li">
          Connect to a place you know which has previously been added to Pearrot. You will be granted access to:

          <List bulleted>
            <List.Item>
              the place's parrot, through which you may send service offers and demands:
              <List>
                <List.Item>to the places within a radius around the place ;</List.Item>
                <List.Item>to the places belonging to the cities of your choice.</List.Item>
              </List>
            </List.Item>
          </List>
        </List.Item>

        <List.Item as="li">
          Add your own place or a place you know to Pearrot. In addition to the access to the place's parrot, you will
          be granted access to the place's management features so you can:

          <List bulleted>
            <List.Item>
              accept new connection requests ;
            </List.Item>
            <List.Item>
              manage the roles (e.g guardian) of people connected to the place ;
            </List.Item>
            <List.Item>
              add your vote to the other guardians' votes so new parrots can be sent if every guardian agreed.
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
