import { CalendarDays, ClipboardList, Package, Plus, RotateCcw, Save, Truck, Warehouse, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import DatePicker from '../../../components/DatePicker'
import InputField from '../../../components/InputField'
import SearchableSelect from '../../../components/SearchableSelect'
import SelectWithAdd from '../../../components/SelectWithAdd'
import { createId, formatCurrency, getNumberError, getRequiredError, getToday } from '../../../utils/helpers'

const statusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Ordered', label: 'Ordered' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Received', label: 'Received' },
]

function createLineItem() {
  return {
    id: createId('POL'),
    productId: '',
    quantity: '',
    unitCost: '',
    receivedQty: '',
  }
}

const initialForm = {
  supplierId: '',
  warehouseId: '',
  date: getToday(),
  status: 'Draft',
  notes: '',
  poReference: createId('PO'),
  lineItems: [createLineItem()],
}

function FlowStep({ label, active, complete }) {
  return (
    <div
      className={`purchase-form__flow-step ${
        active ? 'is-active' : complete ? 'is-complete' : ''
      }`}
    >
      <span>{label}</span>
    </div>
  )
}

export default function PurchaseForm({
  suppliers,
  products,
  warehouses,
  onSubmit,
  onCancel,
  onQuickAddSupplier,
  onQuickAddProduct,
  onQuickAddWarehouse,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})

  const errors = {
    supplierId: getRequiredError(formData.supplierId, 'Supplier'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    date: getRequiredError(formData.date, 'Date'),
    lineItems: formData.lineItems.map((lineItem) => ({
      productId: getRequiredError(lineItem.productId, 'Product'),
      quantity: getNumberError(lineItem.quantity, 'Quantity', { allowZero: false }),
      unitCost: getNumberError(lineItem.unitCost, 'Unit cost', { allowZero: false }),
      receivedQty:
        formData.status === 'Partial' || formData.status === 'Received'
          ? getNumberError(
              lineItem.receivedQty || (formData.status === 'Received' ? lineItem.quantity : ''),
              'Received quantity',
              { min: 0 },
            )
          : '',
    })),
  }

  const isFormValid =
    !errors.supplierId &&
    !errors.warehouseId &&
    !errors.date &&
    errors.lineItems.every(
      (lineItem) =>
        !lineItem.productId && !lineItem.quantity && !lineItem.unitCost && !lineItem.receivedQty,
    )

  const summary = useMemo(() => {
    const totalValue = formData.lineItems.reduce(
      (total, lineItem) =>
        total +
        Number(lineItem.quantity || 0) * Number(lineItem.unitCost || 0),
      0,
    )

    const receivedValue = formData.lineItems.reduce(
      (total, lineItem) =>
        total +
        Number(
          (formData.status === 'Received' ? lineItem.quantity : lineItem.receivedQty) || 0,
        ) *
          Number(lineItem.unitCost || 0),
      0,
    )

    return {
      totalValue,
      receivedValue,
    }
  }, [formData.lineItems, formData.status])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleLineChange(lineId, fieldName, nextValue) {
    setFormData((currentValue) => ({
      ...currentValue,
      lineItems: currentValue.lineItems.map((lineItem) =>
        lineItem.id === lineId
          ? {
              ...lineItem,
              [fieldName]: nextValue,
            }
          : lineItem,
      ),
    }))
  }

  function handleBlur(event) {
    setTouched((currentValue) => ({
      ...currentValue,
      [event.target.name]: true,
    }))
  }

  function handleLineBlur(lineId, fieldName) {
    setTouched((currentValue) => ({
      ...currentValue,
      [`${lineId}-${fieldName}`]: true,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setTouched({
      supplierId: true,
      warehouseId: true,
      date: true,
      ...formData.lineItems.reduce(
        (result, lineItem) => ({
          ...result,
          [`${lineItem.id}-productId`]: true,
          [`${lineItem.id}-quantity`]: true,
          [`${lineItem.id}-unitCost`]: true,
          [`${lineItem.id}-receivedQty`]: true,
        }),
        {},
      ),
    })

    if (!isFormValid) {
      return
    }

    onSubmit({
      ...formData,
      lineItems: formData.lineItems.map((lineItem) => ({
        ...lineItem,
        receivedQty:
          formData.status === 'Received'
            ? lineItem.quantity
            : lineItem.receivedQty || '0',
      })),
    })
  }

  function addLineItem() {
    setFormData((currentValue) => ({
      ...currentValue,
      lineItems: [...currentValue.lineItems, createLineItem()],
    }))
  }

  function removeLineItem(lineId) {
    setFormData((currentValue) => ({
      ...currentValue,
      lineItems:
        currentValue.lineItems.length === 1
          ? currentValue.lineItems
          : currentValue.lineItems.filter((lineItem) => lineItem.id !== lineId),
    }))
  }

  return (
    <div className="purchase-form">
      <div className="purchase-form__flow">
        <FlowStep label="PO" active complete />
        <FlowStep
          label="GRN"
          active={formData.status === 'Partial' || formData.status === 'Received'}
          complete={formData.status === 'Received'}
        />
        <FlowStep label="Completed" active={formData.status === 'Received'} />
      </div>

      <form className="form-grid purchase-form__grid" onSubmit={handleSubmit} autoComplete="off">
        <SelectWithAdd
          name="supplierId"
          label="Supplier"
          icon={Truck}
          value={formData.supplierId}
          onChange={handleChange}
          onBlur={handleBlur}
          options={suppliers}
          onAddOption={onQuickAddSupplier}
          error={errors.supplierId}
          showError={touched.supplierId}
        />

        <SelectWithAdd
          name="warehouseId"
          label="Warehouse"
          icon={Warehouse}
          value={formData.warehouseId}
          onChange={handleChange}
          onBlur={handleBlur}
          options={warehouses}
          onAddOption={onQuickAddWarehouse}
          error={errors.warehouseId}
          showError={touched.warehouseId}
        />

        <DatePicker
          id="purchase-date"
          name="date"
          label="PO Date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.date ? errors.date : ''}
        />

        <SearchableSelect
          id="purchase-status"
          name="status"
          label="PO Status"
          icon={ClipboardList}
          value={formData.status}
          onChange={handleChange}
          onBlur={handleBlur}
          options={statusOptions}
          placeholder="Select status"
        />

        <InputField
          id="po-reference"
          name="poReference"
          label="PO Reference"
          icon={ClipboardList}
          value={formData.poReference}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          id="purchase-notes"
          name="notes"
          label="Notes"
          icon={ClipboardList}
          textarea
          rows={3}
          className="field--full"
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Add vendor notes, receiving notes, or GRN context"
        />

        <div className="purchase-form__line-items field--full">
          <div className="purchase-form__line-header">
            <div>
              <h3>Products</h3>
              <p>Build a multi-product purchase order with optional GRN received quantities.</p>
            </div>
            <button type="button" className="button button-secondary" onClick={addLineItem}>
              <Plus size={16} />
              Add Line
            </button>
          </div>

          <div className="purchase-form__lines">
            {formData.lineItems.map((lineItem, index) => (
              <div className="purchase-form__line-card" key={lineItem.id}>
                <div className="purchase-form__line-top">
                  <strong>Line {index + 1}</strong>
                  {formData.lineItems.length > 1 ? (
                    <button
                      type="button"
                      className="button"
                      onClick={() => removeLineItem(lineItem.id)}
                    >
                      <X size={14} />
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="purchase-form__line-grid">
                  <SelectWithAdd
                    name={`product-${lineItem.id}`}
                    label="Product"
                    icon={Package}
                    value={lineItem.productId}
                    onChange={(event) =>
                      handleLineChange(lineItem.id, 'productId', event.target.value)
                    }
                    onBlur={() => handleLineBlur(lineItem.id, 'productId')}
                    options={products}
                    onAddOption={onQuickAddProduct}
                    error={errors.lineItems[index].productId}
                    showError={touched[`${lineItem.id}-productId`]}
                  />

                  <InputField
                    id={`quantity-${lineItem.id}`}
                    name={`quantity-${lineItem.id}`}
                    label="Ordered Qty"
                    icon={Package}
                    type="number"
                    value={lineItem.quantity}
                    onChange={(event) =>
                      handleLineChange(lineItem.id, 'quantity', event.target.value)
                    }
                    onBlur={() => handleLineBlur(lineItem.id, 'quantity')}
                    error={touched[`${lineItem.id}-quantity`] ? errors.lineItems[index].quantity : ''}
                  />

                  <InputField
                    id={`unit-cost-${lineItem.id}`}
                    name={`unit-cost-${lineItem.id}`}
                    label="Unit Cost"
                    icon={ClipboardList}
                    type="number"
                    value={lineItem.unitCost}
                    onChange={(event) =>
                      handleLineChange(lineItem.id, 'unitCost', event.target.value)
                    }
                    onBlur={() => handleLineBlur(lineItem.id, 'unitCost')}
                    error={touched[`${lineItem.id}-unitCost`] ? errors.lineItems[index].unitCost : ''}
                  />

                  <InputField
                    id={`received-qty-${lineItem.id}`}
                    name={`received-qty-${lineItem.id}`}
                    label="Received Qty"
                    icon={CalendarDays}
                    type="number"
                    value={
                      formData.status === 'Received'
                        ? lineItem.quantity
                        : lineItem.receivedQty
                    }
                    onChange={(event) =>
                      handleLineChange(lineItem.id, 'receivedQty', event.target.value)
                    }
                    onBlur={() => handleLineBlur(lineItem.id, 'receivedQty')}
                    disabled={formData.status === 'Draft' || formData.status === 'Ordered'}
                    error={
                      touched[`${lineItem.id}-receivedQty`]
                        ? errors.lineItems[index].receivedQty
                        : ''
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="purchase-form__summary-card">
          <h3>PO Summary</h3>
          <div className="purchase-form__summary-row">
            <span>Total Value</span>
            <strong>{formatCurrency(summary.totalValue)}</strong>
          </div>
          <div className="purchase-form__summary-row">
            <span>GRN Value</span>
            <strong>{formatCurrency(summary.receivedValue)}</strong>
          </div>
          <div className="purchase-form__summary-row">
            <span>Status</span>
            <strong>{formData.status}</strong>
          </div>
        </div>

        <div className="button-row field--full">
          <button className="button button-primary" disabled={!isFormValid}>
            <Save size={16} />
            Save Purchase Order
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
