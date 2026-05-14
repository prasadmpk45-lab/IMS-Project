export default function StatCard({ title, value, icon: Icon, caption }) {
  return (
    <div className="card stat-card">
      <div className="stat-card__top">
        <h3>{title}</h3>
        <div className="stat-card__icon">
          <Icon size={18} />
        </div>
      </div>

      <strong>{value}</strong>
      <p className="stat-card__caption">{caption}</p>
    </div>
  )
}
