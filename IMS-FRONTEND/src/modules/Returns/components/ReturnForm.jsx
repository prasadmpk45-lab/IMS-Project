import {
  Boxes,
  CalendarDays,
  FileText,
  Package,
  RotateCcw,
  Save,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'
import SearchableSelect from '../../../components/SearchableSelect'
import SelectWithAdd from '../../../components/SelectWithAdd'
import {
  getNumberError,
  getRequiredError,
  getToday,
} from '../../../utils/helpers'

const initialForm = {
  entryType: 'Return',
  productId: '',
  warehouseId: '',
  quantity: '',
  date: getToday(),
  reason: '',
}

export default function ReturnForm({
  products,
  warehouses,
  onSubmit,
  onCancel,
  onQuickAddProduct,
  onQuickAddWarehouse,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})

  const errors = {
    productId: getRequiredError(formData.productId, 'Product'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    quantity: getNumberError(formData.quantity, 'Quantity'),
    date: getRequiredError(formData.date, 'Date'),
    reason: getRequiredError(formData.reason, 'Reason'),
  }

  const isFormValid = Object.values(errors).every((v) => !v)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isFormValid) return
    onSubmit(formData)
  }

  return (
    <div className="return-form">
      <form onSubmit={handleSubmit} className="form-grid">
        <SearchableSelect
          name="entryType"
          label="Entry Type"
          icon={RotateCcw}
          value={formData.entryType}
          onChange={handleChange}
          options={['Return', 'Damage']}
        />

        <SelectWithAdd
          name="productId"
          label="Product"
          icon={Package}
          value={formData.productId}
          onChange={handleChange}
          options={products}
          onAddOption={onQuickAddProduct}
        />

        <SelectWithAdd
          name="warehouseId"
          label="Warehouse"
          icon={Warehouse}
          value={formData.warehouseId}
          onChange={handleChange}
          options={warehouses}
          onAddOption={onQuickAddWarehouse}
        />

        <input name="quantity" onChange={handleChange} />
        <input type="date" name="date" onChange={handleChange} />
        <textarea name="reason" onChange={handleChange} />

        <div className="button-row">
          <button disabled={!isFormValid}>
            <Save size={16} /> Save
          </button>
          <button type="button" onClick={onCancel}>
            <RotateCcw size={16} /> Cancel
          </button>
        </div>
      </form>
    </div>
  )
}