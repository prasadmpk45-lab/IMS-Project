import { CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import InputField from './InputField'

function formatDisplayDate(value) {
  const match = String(value ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return String(value ?? '')
  }

  return `${match[3]}/${match[2]}/${match[1]}`
}

function parseDisplayDate(value) {
  const trimmedValue = String(value ?? '').trim()
  const isoMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (isoMatch) {
    return trimmedValue
  }

  const displayMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (!displayMatch) {
    return ''
  }

  const [, day, month, year] = displayMatch
  const isoValue = `${year}-${month}-${day}`
  const parsedDate = new Date(`${isoValue}T00:00:00`)

  return Number.isNaN(parsedDate.getTime()) ? '' : isoValue
}

export default function DatePicker(props) {
  const {
    value,
    onChange,
    onBlur,
    name,
    placeholder = 'DD/MM/YYYY',
    ...restProps
  } = props
  const [displayValue, setDisplayValue] = useState(() => formatDisplayDate(value))

  useEffect(() => {
    setDisplayValue(formatDisplayDate(value))
  }, [value])

  function handleChange(event) {
    const nextDisplayValue = event.target.value
    const parsedValue = parseDisplayDate(nextDisplayValue)
    setDisplayValue(nextDisplayValue)

    onChange?.({
      target: {
        name,
        value: parsedValue || nextDisplayValue,
      },
    })
  }

  function handleBlur() {
    const parsedValue = parseDisplayDate(displayValue)

    if (parsedValue) {
      setDisplayValue(formatDisplayDate(parsedValue))
      onChange?.({
        target: {
          name,
          value: parsedValue,
        },
      })
    }

    onBlur?.({
      target: {
        name,
        value: parsedValue || displayValue,
      },
    })
  }

  return (
    <InputField
      icon={CalendarDays}
      type="text"
      name={name}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      {...restProps}
    />
  )
}
