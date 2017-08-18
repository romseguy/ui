import React from 'react'
import { Form } from 'views/components/layout'

function Select(props) {
  const {input, meta, options} = props

  return (
    <Form.Field
      control="select"
      onChange={input.onChange}
    >
      <option/>
      {options.map(({key, text, value}) => (
        <option
          key={key}
          value={value}
        >
          {text}
        </option>
      ))}
    </Form.Field>
  )
}

export default Select
