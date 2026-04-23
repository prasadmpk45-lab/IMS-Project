import {
  Boxes,
  CalendarDays,
  DollarSign,
  FileText,
  Flag,
  Package,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Trash2,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import {
  formatCurrency,
  getNumberError,
  getRequiredError,
  getToday,
} from '../../utils/helpers'
import './Purchases.css'

const initialForm = {
  supplierId: '',
  productId: '',
  warehouseId: '',
  quantity: '',
  unitCost: '',
  date: getToday(),
  status: 'Received',
  notes: '',
}

export default function Purchases({
  purchases,
  products,
  suppliers,
  warehouses,
  onSavePurchase,
  onDeletePurchase,
}) {
  const { hasPermission } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('purchases', 'create')
  const canDelete = hasPermission('purchases', 'delete')

  const errors = {
    supplierId: getRequiredError(formData.supplierId, 'Supplier'),
    productId: getRequiredError(formData.productId, 'Product'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    quantity: getNumberError(formData.quantity, 'Quantity', { allowZero: false }),
    unitCost: getNumberError(formData.unitCost, 'Unit cost', { allowZero: false }),
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
      supplierId: true,
      productId: true,
      warehouseId: true,
      quantity: true,
      unitCost: true,
      date: true,
    })

    if (!isFormValid) {
      return
    }

    const result = onSavePurchase(formData)
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

  function handleDelete(purchaseId) {
    const result = onDeletePurchase(purchaseId)
    setMessage(
      result?.success === false
        ? result
        : { success: true, message: 'Purchase deleted successfully.' },
    )
  }

  return (
    <div className="page purchases-page">
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

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenForm}>
              <Plus size={16} />
              Add Purchase
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
          <h2 className="section-title">Purchase List</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  {canDelete ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canDelete ? 8 : 7}
                      className="table-empty"
                    >
                      <p className="empty-message">No purchases available.</p>
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>{purchase.supplierName}</td>
                      <td>{purchase.productName}</td>
                      <td>{purchase.warehouseName}</td>
                      <td>{purchase.quantity}</td>
                      <td>{formatCurrency(purchase.total)}</td>
                      <td>{purchase.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            purchase.status === 'Received'
                              ? 'status-received'
                              : 'status-ordered'
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      {canDelete ? (
                        <td>
                          <button
                            type="button"
                            className="button button-danger"
                            onClick={() => handleDelete(purchase.id)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      ) : null}
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
            <h2 className="section-title">Purchase Form</h2>
            <form
              className="form-grid form-grid--single"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="field">
                <label htmlFor="purchase-supplier">Supplier</label>
                <div className="input-with-icon">
                  <Truck size={16} />
                  <select
                    id="purchase-supplier"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                {touched.supplierId && errors.supplierId ? (
                  <span className="field-error">{errors.supplierId}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="purchase-product">Product</label>
                <div className="input-with-icon">
                  <Package size={16} />
                  <select
                    id="purchase-product"
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
                <label htmlFor="purchase-warehouse">Warehouse</label>
                <div className="input-with-icon">
                  <Warehouse size={16} />
                  <select
                    id="purchase-warehouse"
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
                <label htmlFor="purchase-quantity">Quantity</label>
                <div className="input-with-icon">
                  <Boxes size={16} />
                  <input
                    id="purchase-quantity"
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
                <label htmlFor="purchase-cost">Unit Cost</label>
                <div className="input-with-icon">
                  <DollarSign size={16} />
                  <input
                    id="purchase-cost"
                    name="unitCost"
                    type="number"
                    value={formData.unitCost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </div>
                {touched.unitCost && errors.unitCost ? (
                  <span className="field-error">{errors.unitCost}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="purchase-date">Date</label>
                <div className="input-with-icon">
                  <CalendarDays size={16} />
                  <input
                    id="purchase-date"
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
                <label htmlFor="purchase-status">Status</label>
                <div className="input-with-icon">
                  <Flag size={16} />
                  <select
                    id="purchase-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    autoComplete="off"
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="purchase-notes">Notes</label>
                <div className="input-with-icon input-with-icon--textarea">
                  <FileText size={16} />
                  <textarea
                    id="purchase-notes"
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
                  Save Purchase
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
