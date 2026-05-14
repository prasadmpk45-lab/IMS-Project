import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import InventoryAuditHeader from './components/InventoryAuditHeader'
import InventoryAuditTable from './components/InventoryAuditTable'
import InventoryAuditForm from './components/InventoryAuditForm'
import './InventoryAudit.css'

export default function InventoryAudit(props) {
  const {
    audits,
    stock,
    products,
    warehouses,
    onSaveInventoryAudit,
    onQuickAddProduct,
    onQuickAddWarehouse,
  } = props

  const { hasPermission } = useAuth()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filterWarehouseId, setFilterWarehouseId] = useState('all')
  const [message, setMessage] = useState(null)

  const canCreate = hasPermission('inventoryAudit', 'create')

  function handleSave(data) {
    const result = onSaveInventoryAudit(data)
    setMessage(result)
    if (result.success) setIsFormOpen(false)
  }

  return (
    <div className="page inventory-audit-page">

      <InventoryAuditHeader
        canCreate={canCreate}
        onAdd={() => setIsFormOpen(true)}
      />

      {message && <div className="message-box">{message.message}</div>}

      {isFormOpen && (
        <InventoryAuditForm
          stock={stock}
          products={products}
          warehouses={warehouses}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
          onQuickAddProduct={onQuickAddProduct}
          onQuickAddWarehouse={onQuickAddWarehouse}
        />
      )}

      <InventoryAuditTable
        audits={audits}
        warehouses={warehouses}
        filterWarehouseId={filterWarehouseId}
        setFilterWarehouseId={setFilterWarehouseId}
      />
    </div>
  )
}