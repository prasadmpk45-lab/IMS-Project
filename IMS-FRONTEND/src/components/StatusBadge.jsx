export default function StatusBadge({
  children,
  label,
  type = 'info',
  icon: Icon,
  className = '',
}) {
  const content = children ?? label

  return (
    <span className={`status-badge status-${type} ${className}`.trim()}>
      {Icon ? <Icon size={14} /> : null}
      {content}
    </span>
  )
}
