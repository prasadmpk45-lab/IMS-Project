import { RotateCcw, Plus } from 'lucide-react'

export default function ReturnsHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <RotateCcw size={20} />
        </div>
        <div>
          <h1>Returns & Damage</h1>
          <p className="page-subtitle">
            Track product returns and damaged quantities by warehouse.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Entry
          </button>
        </div>
      )}
    </div>
  )
}