import { Plus, Truck } from 'lucide-react'

export default function SuppliersHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <Truck size={20} />
        </div>
        <div>
          <h1>Suppliers</h1>
          <p className="page-subtitle">
            Create and maintain supplier records.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Supplier
          </button>
        </div>
      )}
    </div>
  )
}