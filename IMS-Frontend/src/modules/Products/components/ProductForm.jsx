import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Hash,
  Package,
  RotateCcw,
  Ruler,
  Save,
  Tag,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'
import { getNumberError, getRequiredError } from '../../../utils/helpers'

const emptyForm = {
  name: '',
  sku: '',
  category: '',
  supplierId: '',
  cost: '',
  price: '',
  stock: '',
  unit: '',
  reorderLevel: '',
  warehouseId: '',
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    name: initialValues.name ?? '',
    sku: initialValues.sku ?? '',
    category: initialValues.category ?? '',
    supplierId: initialValues.supplierId ?? '',
    cost: initialValues.cost ?? '',
    price: initialValues.price ?? '',
    stock: initialValues.stock ?? '',
    unit: initialValues.unit ?? '',
    reorderLevel: initialValues.reorderLevel ?? '',
    warehouseId: initialValues.warehouseId ?? '',
  }
}

export default function ProductForm({
  suppliers,
  warehouses,
  initialValues,
  canSubmit,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const errors = {
    name: getRequiredError(formData.name, 'Product name'),
    sku: getRequiredError(formData.sku, 'SKU'),
    category: getRequiredError(formData.category, 'Category'),
    supplierId: getRequiredError(formData.supplierId, 'Supplier'),
    cost: getNumberError(formData.cost, 'Cost', { allowZero: false }),
    price: getNumberError(formData.price, 'Price', { allowZero: false }),
    stock: getNumberError(formData.stock, 'Stock', { min: 0 }),
    unit: getRequiredError(formData.unit, 'Unit'),
    reorderLevel: getNumberError(formData.reorderLevel, 'Reorder level', {
      min: 0,
    }),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
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
      name: true,
      sku: true,
      category: true,
      supplierId: true,
      cost: true,
      price: true,
      stock: true,
      unit: true,
      reorderLevel: true,
      warehouseId: true,
    })

    if (!isFormValid) {
      return
    }

    onSubmit(formData)
  }

  function handleCancel() {
    setFormData(emptyForm)
    setTouched({})
    onCancel()
  }

  return (
    <div className="card">
      <h2 className="section-title">{initialValues ? 'Edit Product' : 'Add Product'}</h2>
      <form className="form-grid" onSubmit={handleSubmit} autoComplete="off">
        <div className="field">
          <label htmlFor="name">Product Name</label>
          <div className="input-with-icon">
            <Package size={16} />
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.name && errors.name ? (
            <span className="field-error">{errors.name}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="sku">SKU</label>
          <div className="input-with-icon">
            <Hash size={16} />
            <input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.sku && errors.sku ? (
            <span className="field-error">{errors.sku}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <div className="input-with-icon">
            <Tag size={16} />
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.category && errors.category ? (
            <span className="field-error">{errors.category}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="supplierId">Supplier</label>
          <div className="input-with-icon">
            <Truck size={16} />
            <select
              id="supplierId"
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
          <label htmlFor="cost">Cost</label>
          <div className="input-with-icon">
            <DollarSign size={16} />
            <input
              id="cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.cost && errors.cost ? (
            <span className="field-error">{errors.cost}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="price">Price</label>
          <div className="input-with-icon">
            <DollarSign size={16} />
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.price && errors.price ? (
            <span className="field-error">{errors.price}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="stock">Stock</label>
          <div className="input-with-icon">
            <Boxes size={16} />
            <input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.stock && errors.stock ? (
            <span className="field-error">{errors.stock}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="unit">Unit</label>
          <div className="input-with-icon">
            <Ruler size={16} />
            <input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.unit && errors.unit ? (
            <span className="field-error">{errors.unit}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="reorderLevel">Reorder Level</label>
          <div className="input-with-icon">
            <AlertTriangle size={16} />
            <input
              id="reorderLevel"
              name="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.reorderLevel && errors.reorderLevel ? (
            <span className="field-error">{errors.reorderLevel}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="warehouseId">Warehouse</label>
          <div className="input-with-icon">
            <Warehouse size={16} />
            <select
              id="warehouseId"
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

        <div className="button-row">
          <button
            type="submit"
            className="button button-primary"
            disabled={!canSubmit || !isFormValid}
          >
            <Save size={16} />
            Save Product
          </button>
          <button type="button" className="button" onClick={handleCancel}>
            <RotateCcw size={16} />
            {initialValues ? 'Cancel' : 'Clear'}
          </button>
        </div>
      </form>
    </div>
  )
}
