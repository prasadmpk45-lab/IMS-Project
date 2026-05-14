import { FileText, Plus } from 'lucide-react'

export default function AccountingHeader({ canCreate, onToggleForm }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <div className="page-title__icon">
          <FileText size={20} />
        </div>
        <div>
          <h1>Accounting</h1>
          <p className="page-subtitle">
            Create sales and purchase invoices with a single finance workflow.
          </p>
        </div>
      </div>

      {canCreate ? (
        <div className="page-header__actions">
          <button type="button" className="button button-primary" onClick={onToggleForm}>
            <Plus size={16} />
            Add Invoice
          </button>
        </div>
      ) : null}
    </div>
  )
}
