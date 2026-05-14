import { useMemo, useState } from 'react'
import { Boxes, ClipboardList, PackageCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import FormModal from '../../layouts/FormModal'
import PurchasesHeader from './components/PurchasesHeader'
import PurchasesTable from './components/PurchasesTable'
import PurchaseForm from './components/PurchaseForm'
import './Purchases.css'
 
function SummaryCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="card purchases-page__summary-card">
      <div className="purchases-page__summary-icon">
        <Icon size={18} />
      </div>
      <div>
        <p className="purchases-page__summary-label">{label}</p>
        <strong className="purchases-page__summary-value">{value}</strong>
        <p className="purchases-page__summary-helper">{helper}</p>
      </div>
    </div>
  )
}
 
export default function Purchases(props) {
  const {
    purchases,
    products,
    suppliers,
    warehouses,
    onSavePurchase,
    onDeletePurchase,
    onQuickAddSupplier,
    onQuickAddProduct,
    onQuickAddWarehouse,
  } = props
 
  const { hasPermission } = useAuth()
 
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
 
  const canCreate = hasPermission('purchases', 'create')
  const canDelete = hasPermission('purchases', 'delete')
 
  const summary = useMemo(
    () => ({
      total: purchases.length,
      ordered: purchases.filter((purchase) => purchase.status === 'Ordered').length,
      partial: purchases.filter((purchase) => purchase.status === 'Partial').length,
      received: purchases.filter((purchase) => purchase.status === 'Received').length,
    }),
    [purchases],
  )
 
  function handleSave(data) {
    const results = []
 
    for (const lineItem of data.lineItems) {
      const result = onSavePurchase({
        supplierId: data.supplierId,
        productId: lineItem.productId,
        warehouseId: data.warehouseId,
        quantity: lineItem.quantity,
        receivedQty:
          data.status === 'Received'
            ? lineItem.quantity
            : lineItem.receivedQty || '0',
        unitCost: lineItem.unitCost,
        date: data.date,
        status: data.status,
        notes: `${data.notes.trim()}${data.notes.trim() ? ' | ' : ''}PO Ref ${data.poReference}`.trim(),
      })
 
      results.push(result)
 
      if (!result.success) {
        break
      }
    }
 
    const hasError = results.some((result) => result.success === false)
    const nextMessage = hasError
      ? results.find((result) => result.success === false)
      : {
          success: true,
          message: `${data.lineItems.length} purchase line item${
            data.lineItems.length === 1 ? '' : 's'
          } saved successfully.`,
        }
 
    setMessage(nextMessage)
    showToast({
      type: nextMessage.success ? 'success' : 'error',
      title: 'Purchases',
      message: nextMessage.message,
    })
 
    if (nextMessage.success) {
      setIsFormOpen(false)
    }
  }
 
  function handleDelete(id) {
    const result = onDeletePurchase(id)
    setMessage(result)
    showToast({
      type: result.success ? 'success' : 'error',
      title: 'Purchases',
      message: result.message,
    })
  }
 
  return (
    <div className="page purchases-page">
      <PurchasesHeader canCreate={canCreate} onAdd={() => setIsFormOpen(true)} />
 
      {message ? (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      ) : null}
 
      <div className="purchases-page__summary-grid">
        <SummaryCard
          icon={ClipboardList}
          label="POs Logged"
          value={summary.total}
          helper="Total purchase entries recorded."
        />
        <SummaryCard
          icon={Boxes}
          label="Ordered"
          value={summary.ordered + summary.partial}
          helper="Purchase orders still in progress."
        />
        <SummaryCard
          icon={PackageCheck}
          label="Received"
          value={summary.received}
          helper="Entries completed through GRN and receipt."
        />
      </div>
 
      <div className="content-grid content-grid--single">
        {/* <div className="card purchases-page__flow-card">
          <h2 className="section-title">Purchase Flow</h2>
          <div className="purchases-page__flow-steps">
            {['PO', 'GRN', 'Completed'].map((step, index) => (
              <div className="purchases-page__flow-step" key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div> */}
 
        <PurchasesTable
          purchases={purchases}
          canDelete={canDelete}
          onDelete={handleDelete}
        />
      </div>
 
      {isFormOpen ? (
        <FormModal title="Purchase Order" onClose={() => setIsFormOpen(false)}>
          <PurchaseForm
            suppliers={suppliers}
            products={products}
            warehouses={warehouses}
            onSubmit={handleSave}
            onCancel={() => setIsFormOpen(false)}
            onQuickAddSupplier={onQuickAddSupplier}
            onQuickAddProduct={onQuickAddProduct}
            onQuickAddWarehouse={onQuickAddWarehouse}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
 
 