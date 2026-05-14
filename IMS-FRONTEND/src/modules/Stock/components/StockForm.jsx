import { ArrowLeftRight, Boxes, FileText, Package, RotateCcw, Save, Tag, Warehouse } from 'lucide-react'
import DatePicker from '../../../components/DatePicker'
import SearchableSelect from '../../../components/SearchableSelect'
import SelectWithAdd from '../../../components/SelectWithAdd'
import InputField from '../../../components/InputField'

export default function StockForm({
  formData,
  setFormData,
  touched,
  setTouched,
  errors,
  isFormValid,
  products,
  warehouses,
  categories,
  onSubmit,
  onCancel,
  onQuickAddProduct,
  onQuickAddWarehouse,
  onQuickAddCategory,
  setMessage,
  submitLabel = 'Save',
}) {
  function handleChange(event) {
    setFormData((currentValue) => ({
      ...currentValue,
      [event.target.name]: event.target.value,
    }))
  }

  function handleBlur(event) {
    setTouched((currentValue) => ({
      ...currentValue,
      [event.target.name]: true,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({
      productId: true,
      warehouseId: true,
      category: true,
      quantity: true,
      date: true,
    })

    if (!isFormValid) {
      return
    }

    onSubmit()
  }

  function handleQuickAddProductLocal(values) {
    const result = onQuickAddProduct(values)
    setMessage(result)
    return result.success ? result.item : null
  }

  function handleQuickAddWarehouseLocal(values) {
    const result = onQuickAddWarehouse(values)
    setMessage(result)
    return result.success ? result.item : null
  }

  return (
    <div className="stock-form">
      <form className="form-grid form-grid--single" onSubmit={handleSubmit}>
        <SelectWithAdd
          name="productId"
          label="Product"
          icon={Package}
          value={formData.productId}
          onChange={handleChange}
          onBlur={handleBlur}
          options={products}
          error={errors.productId}
          showError={touched.productId}
          onAddOption={handleQuickAddProductLocal}
        />

        <SelectWithAdd
          name="warehouseId"
          label="Warehouse"
          icon={Warehouse}
          value={formData.warehouseId}
          onChange={handleChange}
          onBlur={handleBlur}
          options={warehouses}
          error={errors.warehouseId}
          showError={touched.warehouseId}
          onAddOption={handleQuickAddWarehouseLocal}
        />

        <SelectWithAdd
          name="category"
          label="Category"
          icon={Tag}
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          options={categories}
          error={errors.category}
          showError={touched.category}
          placeholder="Select category"
          addLabel="+ Add"
          addTitle="Add Category"
          addFields={[
            { name: 'name', label: 'Category Name', type: 'text', placeholder: 'Category Name' },
          ]}
          onAddOption={onQuickAddCategory}
        />

        <SearchableSelect
          name="type"
          label="Type"
          icon={ArrowLeftRight}
          value={formData.type}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'in', label: 'Stock In' },
            { value: 'out', label: 'Stock Out' },
          ]}
        />

        <InputField
          id="stock-quantity"
          name="quantity"
          label="Quantity"
          icon={Boxes}
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter movement quantity"
          error={touched.quantity ? errors.quantity : ''}
        />

        <DatePicker
          id="stock-date"
          name="date"
          label="Date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.date ? errors.date : ''}
        />

        <InputField
          id="stock-notes"
          name="notes"
          label="Notes"
          icon={FileText}
          textarea
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Add movement notes or reconciliation details"
        />

        <div className="button-row">
          <button className="button button-primary" disabled={!isFormValid}>
            <Save size={16} />
            {submitLabel}
          </button>

          <button type="button" className="button" onClick={onCancel}>
            <RotateCcw size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
