import { ClipboardList, Plus } from 'lucide-react'

export default function InventoryAuditHeader({ canCreate, onAdd }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <ClipboardList size={20} />
        </div>
        <div>
          <h1>Inventory Audit</h1>
          <p className="page-subtitle">
            Compare system stock with actual warehouse counts.
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="page-header__actions">
          <button className="button button-primary" onClick={onAdd}>
            <Plus size={16} />
            Add Audit
          </button>
        </div>
      )}
    </div>
  )
}