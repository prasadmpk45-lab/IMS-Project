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
import SelectWithAdd from '../../../components/SelectWithAdd'
import {
  getStockQuantity,
  getToday,
} from '../../../utils/helpers'

const initialForm = {
  warehouseId: '',
  productId: '',
  actualQty: '',
  date: getToday(),
  notes: '',
}

export default function InventoryAuditForm({
  stock,
  products,
  warehouses,
  onSubmit,
  onCancel,
  onQuickAddProduct,
  onQuickAddWarehouse,
}) {
  const [formData, setFormData] = useState(initialForm)

  const systemQty = getStockQuantity(
    stock,
    formData.productId,
    formData.warehouseId
  )

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="card">
      <h2 className="section-title">New Audit Entry</h2>

      <form className="form-grid" onSubmit={handleSubmit}>

        {/* Warehouse */}
        <SelectWithAdd
          name="warehouseId"
          label="Warehouse"
          icon={Warehouse}
          value={formData.warehouseId}
          onChange={handleChange}
          options={warehouses}
          onAddOption={onQuickAddWarehouse}
        />

        {/* Product */}
        <SelectWithAdd
          name="productId"
          label="Product"
          icon={Package}
          value={formData.productId}
          onChange={handleChange}
          options={products}
          onAddOption={onQuickAddProduct}
        />

        {/* System Qty */}
        <div className="field">
          <label>System Stock</label>
          <div className="input-with-icon input-with-icon--readonly">
            <Boxes size={16} />
            <input value={systemQty} readOnly />
          </div>
        </div>

        {/* Actual Qty */}
        <div className="field">
          <label>Actual Stock</label>
          <div className="input-with-icon">
            <Boxes size={16} />
            <input
              name="actualQty"
              type="number"
              value={formData.actualQty}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Date */}
        <div className="field">
          <label>Date</label>
          <div className="input-with-icon">
            <CalendarDays size={16} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="field">
          <label>Notes</label>
          <div className="input-with-icon input-with-icon--textarea">
            <FileText size={16} />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="button-row">
          <button type="submit" className="button button-primary">
            <Save size={16} /> Save
          </button>

          <button type="button" className="button" onClick={onCancel}>
            <RotateCcw size={16} /> Cancel
          </button>
        </div>
      </form>
    </div>
  )
}