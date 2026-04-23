import {
  Boxes,
  CalendarDays,
  DollarSign,
  FileText,
  Flag,
  Package,
  Plus,
  RotateCcw,
  Save,
  ShoppingCart,
  Trash2,
  User,
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
import './Sales.css'

const initialForm = {
  customerId: '',
  productId: '',
  warehouseId: '',
  quantity: '',
  unitPrice: '',
  date: getToday(),
  status: 'Completed',
  notes: '',
}

export default function Sales({
  sales,
  products,
  customers,
  warehouses,
  onSaveSale,
  onDeleteSale,
}) {
  const { hasPermission } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('sales', 'create')
  const canDelete = hasPermission('sales', 'delete')

  const errors = {
    customerId: getRequiredError(formData.customerId, 'Customer'),
    productId: getRequiredError(formData.productId, 'Product'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    quantity: getNumberError(formData.quantity, 'Quantity', { allowZero: false }),
    unitPrice: getNumberError(formData.unitPrice, 'Unit price', {
      allowZero: false,
    }),
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
      customerId: true,
      productId: true,
      warehouseId: true,
      quantity: true,
      unitPrice: true,
      date: true,
    })

    if (!isFormValid) {
      return
    }

    const result = onSaveSale(formData)
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

  function handleDelete(saleId) {
    onDeleteSale(saleId)
    setMessage({ success: true, message: 'Sale deleted successfully.' })
  }

  return (
    <div className="page sales-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1>Sales</h1>
            <p className="page-subtitle">
              Create sales entries and reduce stock for completed sales.
            </p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenForm}>
              <Plus size={16} />
              Add Sale
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
          <h2 className="section-title">Sales List</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
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
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={canDelete ? 8 : 7} className="table-empty">
                      <p className="empty-message">No sales available.</p>
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.customerName}</td>
                      <td>{sale.productName}</td>
                      <td>{sale.warehouseName}</td>
                      <td>{sale.quantity}</td>
                      <td>{formatCurrency(sale.total)}</td>
                      <td>{sale.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            sale.status === 'Completed'
                              ? 'status-completed'
                              : 'status-pending'
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      {canDelete ? (
                        <td>
                          <button
                            type="button"
                            className="button button-danger"
                            onClick={() => handleDelete(sale.id)}
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
            <h2 className="section-title">Sales Form</h2>
            <form
              className="form-grid form-grid--single"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="field">
                <label htmlFor="sale-customer">Customer</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <select
                    id="sale-customer"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                {touched.customerId && errors.customerId ? (
                  <span className="field-error">{errors.customerId}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="sale-product">Product</label>
                <div className="input-with-icon">
                  <Package size={16} />
                  <select
                    id="sale-product"
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
                <label htmlFor="sale-warehouse">Warehouse</label>
                <div className="input-with-icon">
                  <Warehouse size={16} />
                  <select
                    id="sale-warehouse"
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
                <label htmlFor="sale-quantity">Quantity</label>
                <div className="input-with-icon">
                  <Boxes size={16} />
                  <input
                    id="sale-quantity"
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
                <label htmlFor="sale-price">Unit Price</label>
                <div className="input-with-icon">
                  <DollarSign size={16} />
                  <input
                    id="sale-price"
                    name="unitPrice"
                    type="number"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </div>
                {touched.unitPrice && errors.unitPrice ? (
                  <span className="field-error">{errors.unitPrice}</span>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="sale-date">Date</label>
                <div className="input-with-icon">
                  <CalendarDays size={16} />
                  <input
                    id="sale-date"
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
                <label htmlFor="sale-status">Status</label>
                <div className="input-with-icon">
                  <Flag size={16} />
                  <select
                    id="sale-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    autoComplete="off"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="sale-notes">Notes</label>
                <div className="input-with-icon input-with-icon--textarea">
                  <FileText size={16} />
                  <textarea
                    id="sale-notes"
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
                  Save Sale
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
