import { Boxes, Plus } from 'lucide-react'

export default function StockHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <Boxes size={20} />
        <div>
          <h1>Stock</h1>
          <p className="page-subtitle">
            Record stock in and stock out transactions.
          </p>
        </div>
      </div>

      {canCreate && (
        <button className="button button-primary" onClick={onAdd}>
          <Plus size={16} />
          Add Movement
        </button>
      )}
    </div>
  )
}
