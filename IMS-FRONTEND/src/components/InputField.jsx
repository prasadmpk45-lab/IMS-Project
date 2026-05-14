export default function InputField({
  id,
  label,
  icon: Icon,
  prefix,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  textarea,
  rows = 4,
  className = '',
  ...props
}) {
  const isTextarea = Boolean(textarea)

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <div
        className={`input-with-icon ${isTextarea ? 'input-with-icon--textarea' : ''} ${
          error ? 'field--error' : ''
        }`.trim()}
      >
        {Icon ? <Icon size={18} /> : null}
        {prefix ? <span className="input-prefix">{prefix}</span> : null}
        {textarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            rows={rows}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="off"
            {...props}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="off"
            {...props}
          />
        )}
      </div>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
