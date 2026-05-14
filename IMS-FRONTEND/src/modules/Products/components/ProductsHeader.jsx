import { Package, Plus } from 'lucide-react'

export default function ProductsHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <Package size={20} />
        </div>
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">
            Manage product master records and opening stock quantities.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button
            type="button"
            className="button button-primary"
            onClick={onAdd}
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      )}
    </div>
  )
}