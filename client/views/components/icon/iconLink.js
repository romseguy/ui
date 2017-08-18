import styled from 'styled-components'


const color = ({active, disabled}) => disabled ? '#bbb' : (
  active === undefined ? 'red' : (
    active === true ? 'green' : 'red'
  )
)

const hoverColor = ({active, disabled}) => disabled ? '#bbb' : (
  active ? 'green' : 'blue'
)

const cursor = ({disabled}) => disabled ? 'not-allowed' : 'pointer'

const IconLink = styled.a`
color: ${color};
cursor: ${cursor};
height: 1.2rem;
width: 1.2rem;

:hover {
  color: ${hoverColor};
}
`

export default IconLink
