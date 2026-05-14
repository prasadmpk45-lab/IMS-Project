import { ReceiptText, Plus } from 'lucide-react'

export default function PurchasesHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <ReceiptText size={20} />
        </div>
        <div>
          <h1>Purchases</h1>
          <p className="page-subtitle">
            Create purchase entries and update stock for received goods.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Purchase
          </button>
        </div>
      )}
    </div>
  )
}