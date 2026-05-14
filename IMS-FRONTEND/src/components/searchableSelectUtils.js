export function normalizeSelectOptions(options = []) {
  return options.map((option) => {
    if (typeof option === 'string') {
      return {
        value: option,
        label: option,
      }
    }

    return {
      value: option.value ?? option.id ?? option.name ?? '',
      label: option.label ?? option.name ?? option.value ?? '',
    }
  })
}

export function getSelectedOption(options, value) {
  return options.find((option) => String(option.value) === String(value)) ?? null
}
