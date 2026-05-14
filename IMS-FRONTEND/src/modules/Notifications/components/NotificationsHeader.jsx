import { Bell, Plus } from 'lucide-react'

export default function NotificationsHeader({ canCreate, onAdd, extraActions }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <Bell size={20} />
        </div>
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">
            Monitor alerts and system notifications.
          </p>
        </div>
      </div>

      {canCreate || extraActions ? (
        <div className="page-header__actions">
          {extraActions}
          {canCreate ? (
            <button className="button button-primary" onClick={onAdd}>
              <Plus size={16} />
              Add Alert
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
