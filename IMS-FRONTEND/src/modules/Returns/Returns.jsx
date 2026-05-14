import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import ReturnsHeader from './components/ReturnsHeader'
import ReturnsTable from './components/ReturnsTable'
import ReturnForm from './components/ReturnForm'
import './Returns.css'

export default function Returns({
  returns,
  products,
  warehouses,
  onSaveReturn,
  onQuickAddProduct,
  onQuickAddWarehouse,
}) {
  const { hasPermission } = useAuth()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)

  const canCreate = hasPermission('returns', 'create')

  function handleSave(data) {
    const result = onSaveReturn(data)
    setMessage(result)
    if (result.success) setIsFormOpen(false)
  }

  return (
    <div className="page returns-page">

      <ReturnsHeader
        canCreate={canCreate}
        onAdd={() => setIsFormOpen(true)}
      />

      {message && (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      )}

      {isFormOpen && (
        <FormModal title="Return / Damage Entry" onClose={() => setIsFormOpen(false)}>
          <ReturnForm
            products={products}
            warehouses={warehouses}
            onSubmit={handleSave}
            onCancel={() => setIsFormOpen(false)}
            onQuickAddProduct={onQuickAddProduct}
            onQuickAddWarehouse={onQuickAddWarehouse}
          />
        </FormModal>
      )}

      <ReturnsTable returns={returns} />
    </div>
  )
}