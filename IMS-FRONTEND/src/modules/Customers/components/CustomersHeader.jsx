import { Users, Plus } from 'lucide-react'

export default function CustomersHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <Users size={20} />
        </div>
        <div>
          <h1>Customers</h1>
          <p className="page-subtitle">
            Create and maintain customer records.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      )}
    </div>
  )
}