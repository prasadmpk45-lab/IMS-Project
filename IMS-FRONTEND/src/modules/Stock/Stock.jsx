import { useMemo, useState } from 'react'
import { AlertTriangle, Boxes, PackageMinus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import ModalComponent from '../../components/modals/ModalComponent'
import StockHeader from './components/StockHeader'
import StockMessage from './components/StockMessage'
import StockForm from './components/StockForm'
import StockStepper from './components/StockStepper'
import CurrentStock from './components/CurrentStock'
import RecentMovements from './components/RecentMovements'
import { getNumberError, getRequiredError, getToday } from '../../utils/helpers'
import './Stock.css'

const defaultCategories = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'grocery', label: 'Grocery' },
  { id: 'clothing', label: 'Clothing' },
]

const initialForm = {
  productId: '',
  warehouseId: '',
  category: '',
  type: 'in',
  quantity: '',
  date: getToday(),
  notes: '',
}

function SummaryCard({ icon: Icon, label, value, helper, tone }) {
  return (
    <div className={`card stock-page__summary-card stock-page__summary-card--${tone}`}>
      <div className="stock-page__summary-icon">
        <Icon size={18} />
      </div>
      <div>
        <p className="stock-page__summary-label">{label}</p>
        <strong className="stock-page__summary-value">{value}</strong>
        <p className="stock-page__summary-helper">{helper}</p>
      </div>
    </div>
  )
}

export default function Stock(props) {
  const {
    stock,
    products,
    warehouses,
    stockMovements,
    onSaveStockMovement,
    onQuickAddProduct,
    onQuickAddWarehouse,
  } = props

  const { hasPermission } = useAuth()

  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [categories, setCategories] = useState(defaultCategories)
  const [formMode, setFormMode] = useState('movement')

  const steps = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
  ]

  const canCreate = hasPermission('stock', 'create')

  const summary = useMemo(() => {
    const totalStock = stock.reduce(
      (total, item) => total + Number(item.availableQty || 0),
      0,
    )
    const lowStock = stock.filter(
      (item) =>
        Number(item.availableQty || 0) > 0 &&
        Number(item.availableQty || 0) <= Number(item.reorderLevel || 0),
    ).length
    const outOfStock = stock.filter((item) => Number(item.availableQty || 0) === 0).length

    return {
      totalStock,
      lowStock,
      outOfStock,
    }
  }, [stock])

  const errors = {
    productId: getRequiredError(formData.productId, 'Product'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    category: getRequiredError(formData.category, 'Category'),
    quantity: getNumberError(formData.quantity, 'Quantity', { allowZero: false }),
    date: getRequiredError(formData.date, 'Date'),
  }

  const isFormValid = Object.values(errors).every((value) => !value)

  function openMovementForm(type = 'in', mode = 'movement') {
    setFormData((currentValue) => ({
      ...initialForm,
      type,
      notes: mode === 'adjustment' ? 'Manual stock adjustment' : currentValue.notes,
    }))
    setTouched({})
    setFormMode(mode)
    setIsFormOpen(true)
  }

  function handleSubmit() {
    const result = onSaveStockMovement(formData)
    setMessage(result)
    showToast({
      type: result.success ? 'success' : 'error',
      title: 'Stock',
      message: result.message,
    })

    if (result.success) {
      handleCloseForm()
    }
  }

  function handleQuickAddCategory(values) {
    const label = String(values.name ?? '').trim()

    if (!label) {
      return null
    }

    const nextCategory = {
      id: `category-${Date.now()}`,
      label,
    }

    setCategories((currentValue) => [nextCategory, ...currentValue])
    return nextCategory
  }

  function handleCloseForm() {
    setFormData(initialForm)
    setTouched({})
    setIsFormOpen(false)
    setFormMode('movement')
  }

  return (
    <div className="page stock-page">
      <StockHeader canCreate={canCreate} onAdd={() => openMovementForm('in')} />

      <StockMessage message={message} />

      <div className="stock-page__summary-grid">
        <SummaryCard
          icon={Boxes}
          label="Total Stock"
          value={summary.totalStock}
          helper="Combined available units across all warehouses."
          tone="primary"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Low Stock"
          value={summary.lowStock}
          helper="Items close to or below reorder level."
          tone="warning"
        />
        <SummaryCard
          icon={PackageMinus}
          label="Out of Stock"
          value={summary.outOfStock}
          helper="Products needing immediate replenishment."
          tone="danger"
        />
      </div>

      <div className="card stock-stepper-card">
        <StockStepper
          steps={steps}
          activeStep={activeStep}
          onSelectStep={setActiveStep}
        />

        <div className="step-panel__container">
          {activeStep === 0 ? (
            <CurrentStock
              stock={stock}
              products={products}
              canCreate={canCreate}
              onStockIn={() => openMovementForm('in')}
              onStockOut={() => openMovementForm('out')}
              onStockAdjustment={() => openMovementForm('in', 'adjustment')}
            />
          ) : (
            <RecentMovements
              movements={stockMovements}
              products={products}
              title="Movement History"
              subtitle="Filter inventory movement history by product and date."
            />
          )}
        </div>
      </div>

      {canCreate && isFormOpen ? (
        <ModalComponent
          title={formMode === 'adjustment' ? 'Stock Adjustment' : 'Stock Movement'}
          subtitle={
            formMode === 'adjustment'
              ? 'Use this modal to reconcile stock differences without leaving the stock screen.'
              : 'Record incoming and outgoing stock with reusable movement controls.'
          }
          onClose={handleCloseForm}
        >
          <StockForm
            formData={formData}
            setFormData={setFormData}
            touched={touched}
            setTouched={setTouched}
            errors={errors}
            isFormValid={isFormValid}
            products={products}
            warehouses={warehouses}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            onQuickAddProduct={onQuickAddProduct}
            onQuickAddWarehouse={onQuickAddWarehouse}
            onQuickAddCategory={handleQuickAddCategory}
            setMessage={setMessage}
            submitLabel={formMode === 'adjustment' ? 'Apply Adjustment' : 'Save Movement'}
          />
        </ModalComponent>
      ) : null}
    </div>
  )
}
