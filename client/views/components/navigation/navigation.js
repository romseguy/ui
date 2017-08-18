import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-styled-flexboxgrid'

const Menu = styled.ul`
list-style-type: none;
`

const MenuItem = styled.li`
padding: 0 0em 0 0;
cursor: pointer;
a{
text-decoration: none;
}
`

const SubMenuItem = styled.span`
display: inline;
padding: 0 0 0 0em;
cursor: pointer;
a{
text-decoration: none;
}
`

function Navigation({isAuthed, signIn, signOut, style, location}) {

  const mapRoutesToMenu = [{
    reqAuth: true,
    path: '/',
    title: 'Accueil'
  }, {
    reqAuth: true,
    path: '/me',
    title: 'Votre profil'
  }, {
    reqAuth: true,
    path: '/places',
    title: 'Carte de l\'uni-vert',
    children: [{
      path: '/add',
      title: 'Ajouter un lieu',
    }]
  }, /*{
   title: 'Connexion',
   action: signIn
   },*/ {
    reqAuth: true,
    title: 'Déconnexion',
    action: signOut
  }]

  const menu = mapRoutesToMenu.map(({reqAuth, path, title, action, children = []}, i) => {
    if (reqAuth && !isAuthed) return null

    return (
      <MenuItem key={`menu-item-${i}`}>
        {{
          /*<Link href={path} onClick={action}>
           {title}
           </Link>*/
        }}

        {children.map(({path: subPath, title}, j) => {
          return (
            <SubMenuItem key={`sub-menu-item-${j}`}>
              {' | '}
              {/*<Link href={`${path}${subPath}`}>{title}</Link>*/}
            </SubMenuItem>
          )
        })}

      </MenuItem>
    )
  })

  return (
    <Row style={{
      backgroundColor: 'white',
      ...style
    }}>
      <Col>
        <Menu>
          {menu}
        </Menu>
      </Col>
    </Row>
  )
}

export default Navigation
