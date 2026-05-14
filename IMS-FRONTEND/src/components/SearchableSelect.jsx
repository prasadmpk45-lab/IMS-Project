import { Check, ChevronDown, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getSelectedOption, normalizeSelectOptions } from './searchableSelectUtils'
import './SearchableSelect.css'

export default function SearchableSelect(props) {
  const {
    id,
    name,
    label,
    icon: Icon,
    value,
    onChange,
    onBlur,
    options,
    placeholder = 'Select option',
    error,
    showError,
    searchPlaceholder = 'Search...',
    hideLabel = false,
  } = props

  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const normalizedOptions = useMemo(
    () => normalizeSelectOptions(options),
    [options],
  )
  const selectedOption = getSelectedOption(normalizedOptions, value)
  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  )

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) {
        return
      }

      setIsOpen(false)
      setSearchTerm('')
      onBlur?.({ target: { name, value } })
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen, name, onBlur, value])

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus()
    }
  }, [isOpen])

  function handleToggle() {
    setIsOpen((currentValue) => !currentValue)

    if (isOpen) {
      setSearchTerm('')
      onBlur?.({ target: { name, value } })
    }
  }

  function handleSelect(nextValue) {
    onChange({ target: { name, value: nextValue } })
    onBlur?.({ target: { name, value: nextValue } })
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div
      className={`${hideLabel ? 'searchable-select' : 'field searchable-select'}`}
      ref={rootRef}
    >
      {hideLabel ? null : <label htmlFor={id}>{label}</label>}

      <button
        id={id}
        type="button"
        className={`searchable-select__trigger ${isOpen ? 'is-open' : ''}`}
        onClick={handleToggle}
      >
        <span className="searchable-select__value">
          {Icon ? <Icon size={16} /> : null}
          <span className={selectedOption ? '' : 'searchable-select__placeholder'}>
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen ? (
        <div className="searchable-select__menu">
          <div className="searchable-select__search">
            <Search size={16} />
            <input
              ref={searchRef}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              autoComplete="off"
            />
          </div>

          <div className="searchable-select__options">
            <button
              type="button"
              className={`searchable-select__option ${!selectedOption ? 'is-selected' : ''}`}
              onClick={() => handleSelect('')}
            >
              <span>{placeholder}</span>
            </button>

            {filteredOptions.length === 0 ? (
              <div className="searchable-select__empty">No matches found.</div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value || `${option.label}-${index}`}
                  type="button"
                  className={`searchable-select__option ${
                    String(option.value) === String(value) ? 'is-selected' : ''
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {String(option.value) === String(value) ? <Check size={14} /> : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}

      {showError && error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
