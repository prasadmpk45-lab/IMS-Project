import {
  ArrowLeftRight,
  Boxes,
  CalendarDays,
  FileText,
  Package,
  Plus,
  RotateCcw,
  Save,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import { getNumberError, getRequiredError, getToday } from '../../utils/helpers'
import './Stock.css'

const initialForm = {
  productId: '',
  warehouseId: '',
  type: 'in',
  quantity: '',
  date: getToday(),
  notes: '',
}

export default function Stock({
  stock,
  products,
  warehouses,
  stockMovements,
  onSaveStockMovement,
}) {
  const { hasPermission } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('stock', 'create')

  const errors = {
    productId: getRequiredError(formData.productId, 'Product'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    quantity: getNumberError(formData.quantity, 'Quantity', { allowZero: false }),
    date: getRequiredError(formData.date, 'Date'),
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({ ...currentValue, [name]: value }))
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((currentValue) => ({ ...currentValue, [name]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({
      productId: true,
      warehouseId: true,
      quantity: true,
      date: true,
    })

    if (!isFormValid) {
      return
    }

    const result = onSaveStockMovement(formData)
    setMessage(result)

    if (result.success) {
      handleCloseForm()
    }
  }

  function handleOpenForm() {
    setFormData(initialForm)
    setTouched({})
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setFormData(initialForm)
    setTouched({})
    setIsFormOpen(false)
  }

  return (
    <div className="page stock-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <Boxes size={20} />
          </div>
          <div>
            <h1>Stock</h1>
            <p className="page-subtitle">Record stock in and stock out transactions.</p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenForm}>
              <Plus size={16} />
              Add Movement
            </button>
          </div>
        ) : null}
      </div>

      {message ? (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      ) : null}

      <div className="content-grid content-grid--single">
        <div className="card">
          <h2 className="section-title">Current Stock</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Warehouse</th>
                  <th>Available Qty</th>
                  <th>Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {stock.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      <p className="empty-message">No stock records available.</p>
                    </td>
                  </tr>
                ) : (
                  stock.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.sku}</td>
                      <td>{item.warehouseName}</td>
                      <td>{item.availableQty}</td>
                      <td>{item.reorderLevel}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h2 className="section-title stock-page__history">Recent Movements</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {stockMovements.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-empty">
                      <p className="empty-message">No stock movements available.</p>
                    </td>
                  </tr>
                ) : (
                  stockMovements.map((movement) => (
                    <tr key={movement.id}>
                      <td>{movement.productName}</td>
                      <td>{movement.warehouseName}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            movement.type === 'in' ? 'status-in' : 'status-out'
                          }`}
                        >
                          {movement.type.toUpperCase()}
                        </span>
                      </td>
                      <td>{movement.quantity}</td>
                      <td>{movement.date}</td>
                      <td>{movement.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {canCreate && isFormOpen ? (
        <FormModal onClose={handleCloseForm}>
          <div className="card">
            <h2 className="section-title">Stock Movement</h2>
            <form
              className="form-grid form-grid--single"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="field">
                <label htmlFor="stock-product">Product</label>
                <div className="input-with-icon">
                  <Package size={16} />
                  <select
                    id="stock-product"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                {touched.productId && errors.productId ? (
                  <span className="field-error">{errors.productId}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="stock-warehouse">Warehouse</label>
                <div className="input-with-icon">
                  <Warehouse size={16} />
                  <select
                    id="stock-warehouse"
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  >
                    <option value="">Select warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
                {touched.warehouseId && errors.warehouseId ? (
                  <span className="field-error">{errors.warehouseId}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="stock-type">Type</label>
                <div className="input-with-icon">
                  <ArrowLeftRight size={16} />
                  <select
                    id="stock-type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    autoComplete="off"
                  >
                    <option value="in">Stock In</option>
                    <option value="out">Stock Out</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="stock-quantity">Quantity</label>
                <div className="input-with-icon">
                  <Boxes size={16} />
                  <input
                    id="stock-quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </div>
                {touched.quantity && errors.quantity ? (
                  <span className="field-error">{errors.quantity}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="stock-date">Date</label>
                <div className="input-with-icon">
                  <CalendarDays size={16} />
                  <input
                    id="stock-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </div>
                {touched.date && errors.date ? (
                  <span className="field-error">{errors.date}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="stock-notes">Notes</label>
                <div className="input-with-icon input-with-icon--textarea">
                  <FileText size={16} />
                  <textarea
                    id="stock-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="button-row">
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={!isFormValid}
                >
                  <Save size={16} />
                  Save Movement
                </button>
                <button type="button" className="button" onClick={handleCloseForm}>
                  <RotateCcw size={16} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </FormModal>
      ) : null}
    </div>
  )
}
