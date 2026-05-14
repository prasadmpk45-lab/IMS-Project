import { ShoppingCart, Plus } from 'lucide-react'

export default function SalesHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <ShoppingCart size={20} />
        </div>
        <div>
          <h1>Sales</h1>
          <p className="page-subtitle">
            Create sales entries and reduce stock for completed sales.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Sale
          </button>
        </div>
      )}
    </div>
  )
}