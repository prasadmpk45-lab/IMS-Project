export default function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase()
  const isGood = normalized === 'good' || normalized === 'completed'
  const isHigh = normalized === 'high outstanding' || normalized === 'pending'

  const badgeClass = isGood
    ? 'status-badge status-badge--success'
    : isHigh
    ? 'status-badge status-badge--danger'
    : 'status-badge status-badge--neutral'

  return <span className={badgeClass}>{status}</span>
}
