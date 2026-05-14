import { Plus, Warehouse } from 'lucide-react'

export default function WarehousesHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <Warehouse size={20} />
        </div>
        <div>
          <h1>Warehouses</h1>
          <p className="page-subtitle">
            Create and maintain warehouse locations.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Warehouse
          </button>
        </div>
      )}
    </div>
  )
}