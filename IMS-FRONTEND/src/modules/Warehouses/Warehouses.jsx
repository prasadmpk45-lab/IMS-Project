import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Boxes, MoveRight, Warehouse as WarehouseIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import ModalComponent from '../../components/modals/ModalComponent'
import DatePicker from '../../components/DatePicker'
import InputField from '../../components/InputField'
import SearchableSelect from '../../components/SearchableSelect'
import FormModal from '../../layouts/FormModal'
import { getToday } from '../../utils/helpers'
import {
  createWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  updateWarehouse,
} from '../../api/warehousesApi'
import WarehousesHeader from './components/WarehousesHeader'
import WarehousesTable from './components/WarehousesTable'
import WarehouseForm from './components/WarehouseForm'
import './Warehouses.css'

function SummaryCard({ icon, label, value, helper }) {
  return (
    <div className="card warehouses-page__summary-card">
      <div className="warehouses-page__summary-icon">
        {createElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="warehouses-page__summary-label">{label}</p>
        <strong className="warehouses-page__summary-value">{value}</strong>
        <p className="warehouses-page__summary-helper">{helper}</p>
      </div>
    </div>
  )
}

const initialTransferForm = {
  productId: '',
  fromWarehouseId: '',
  toWarehouseId: '',
  quantity: '',
  date: getToday(),
}

function getPayloadData(response) {
  const data = response?.data
  return data?.data ?? data?.items ?? data ?? null
}

export default function Warehouses({
  warehouses: initialWarehouses = [],
  products = [],
  stock = [],
  onSaveStockMovement,
}) {
  const { hasPermission } = useAuth()

  const [warehouses, setWarehouses] = useState(initialWarehouses)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [transferForm, setTransferForm] = useState(initialTransferForm)

  const canCreate = hasPermission('warehouses', 'create')
  const canEdit = hasPermission('warehouses', 'edit')
  const canDelete = hasPermission('warehouses', 'delete')

  const notify = useCallback((result) => {
    showToast({
      type: result.success ? 'success' : 'error',
      title: 'Warehouses',
      message: result.message,
    })
  }, [])

  const loadWarehouses = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getAllWarehouses()
      const data = getPayloadData(response)

      if (!response.success) {
        throw new Error(response.error || 'Failed to load warehouses')
      }

      setWarehouses(Array.isArray(data) ? data : [])
      setMessage(null)
    } catch (error) {
      const nextMessage = {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load warehouses',
      }
      setMessage(nextMessage)
      notify(nextMessage)
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  useEffect(() => {
    queueMicrotask(loadWarehouses)
  }, [loadWarehouses])

  const summary = useMemo(
    () => ({
      warehouses: warehouses.length,
      stockUnits: stock.reduce((total, item) => total + Number(item.availableQty || 0), 0),
      racks: warehouses.reduce((total, warehouse) => total + Number(warehouse.rackCount || 0), 0),
      bins: warehouses.reduce((total, warehouse) => total + Number(warehouse.binCount || 0), 0),
    }),
    [stock, warehouses],
  )

  const warehouseInventory = useMemo(
    () =>
      warehouses.map((warehouse) => ({
        ...warehouse,
        items: stock
          .filter((item) => item.warehouseId === warehouse.id)
          .map((item) => ({
            ...item,
            product: products.find((product) => product.id === item.productId) ?? null,
          })),
      })),
    [products, stock, warehouses],
  )


  function handleOpenCreate() {
    setEditingWarehouse(null)
    setIsFormOpen(true)
  }

  function handleEdit(item) {
    setEditingWarehouse(item)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingWarehouse(null)
    setIsFormOpen(false)
  }

  async function handleSave(values) {
    const response = editingWarehouse?.id
      ? await updateWarehouse(editingWarehouse.id, values)
      : await createWarehouse(values)

    const result = response.success
      ? {
          success: true,
          message: editingWarehouse
            ? 'Warehouse updated successfully.'
            : 'Warehouse added successfully.',
        }
      : { success: false, message: response.error || 'Warehouse save failed.' }

    setMessage(result)
    notify(result)

    if (response.success) {
      await loadWarehouses()
      handleCloseForm()
    }
  }

  async function handleDelete(id) {
    const response = await deleteWarehouse(id)
    const nextMessage = response.success
      ? { success: true, message: 'Warehouse deleted successfully.' }
      : { success: false, message: response.error || 'Warehouse delete failed.' }

    setMessage(nextMessage)
    notify(nextMessage)

    if (response.success) {
      await loadWarehouses()
      if (editingWarehouse?.id === id) {
        handleCloseForm()
      }
    }
  }

  function handleTransferChange(event) {
    const { name, value } = event.target
    setTransferForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleTransferSubmit(event) {
    event.preventDefault()

    if (
      !transferForm.productId ||
      !transferForm.fromWarehouseId ||
      !transferForm.toWarehouseId ||
      !transferForm.quantity ||
      !transferForm.date
    ) {
      const result = {
        success: false,
        message: 'Choose the product, source, destination, quantity, and date to transfer stock.',
      }
      setMessage(result)
      notify(result)
      return
    }

    const outgoingResult = onSaveStockMovement({
      productId: transferForm.productId,
      warehouseId: transferForm.fromWarehouseId,
      type: 'out',
      quantity: transferForm.quantity,
      date: transferForm.date,
      notes: `Transfer to ${transferForm.toWarehouseId}`,
    })

    if (!outgoingResult.success) {
      setMessage(outgoingResult)
      notify(outgoingResult)
      return
    }

    const incomingResult = onSaveStockMovement({
      productId: transferForm.productId,
      warehouseId: transferForm.toWarehouseId,
      type: 'in',
      quantity: transferForm.quantity,
      date: transferForm.date,
      notes: `Transfer from ${transferForm.fromWarehouseId}`,
    })

    setMessage(incomingResult)
    notify(incomingResult)

    if (incomingResult.success) {
      setTransferForm(initialTransferForm)
      setIsTransferOpen(false)
    }
  }

  return (
    <div className="page warehouses-page">
      <WarehousesHeader canCreate={canCreate} onAdd={handleOpenCreate} />

      {message ? (
        <div className={`message-box ${message.success ? 'message-box--success' : 'message-box--error'}`}>
          {message.message}
        </div>
      ) : null}

      <div className="warehouses-page__summary-grid">
        <SummaryCard
          icon={WarehouseIcon}
          label="Warehouses"
          value={summary.warehouses}
          helper="Configured warehouse locations in IMS."
        />
        <SummaryCard
          icon={Boxes}
          label="Stock Units"
          value={summary.stockUnits}
          helper="Available quantity distributed across warehouses."
        />
        <SummaryCard
          icon={MoveRight}
          label="Rack / Bin"
          value={`${summary.racks} / ${summary.bins}`}
          helper="Rack and bin slots configured for storage planning."
        />
      </div>

      <div className="warehouses-page__actions">
        <button type="button" className="button button-secondary" onClick={() => setIsTransferOpen(true)}>
          <MoveRight size={16} />
          Transfer Stock
        </button>
      </div>

      <div className="content-grid content-grid--single">
        <WarehousesTable
          warehouses={warehouses}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={isLoading ? 'Loading warehouses...' : 'No warehouses available.'}
        />
      </div>

      <div className="warehouses-page__inventory-grid">
        {warehouseInventory.map((warehouse) => (
          <div className="card warehouses-page__inventory-card" key={warehouse.id}>
            <div className="warehouses-page__inventory-header">
              <div>
                <h2 className="section-title">{warehouse.name}</h2>
                <p className="helper-text">
                  {warehouse.location} - {warehouse.status || 'Active'} - Rack {warehouse.rackCount || 0} / Bin {warehouse.binCount || 0}
                </p>
              </div>
            </div>

            {warehouse.items.length === 0 ? (
              <div className="warehouses-page__empty">No stock assigned to this warehouse.</div>
            ) : (
              <div className="warehouses-page__inventory-list">
                {warehouse.items.map((item) => (
                  <div className="warehouses-page__inventory-item" key={item.id}>
                    <div>
                      <strong>{item.productName}</strong>
                      <span>{item.product?.category || 'General'}</span>
                    </div>
                    <strong>{item.availableQty}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isFormOpen || editingWarehouse ? (
        <FormModal
          title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
          onClose={handleCloseForm}
        >
          <WarehouseForm
            key={editingWarehouse?.id ?? 'new'}
            initialValues={editingWarehouse}
            canSubmit={editingWarehouse ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      ) : null}

      {isTransferOpen ? (
        <ModalComponent
          title="Transfer Stock"
          subtitle="Move stock from one warehouse to another without leaving the warehouse module."
          onClose={() => setIsTransferOpen(false)}
        >
          <div className="card">
            <form className="form-grid form-grid--single" onSubmit={handleTransferSubmit}>
              <SearchableSelect
                id="transfer-product"
                name="productId"
                label="Product"
                icon={Boxes}
                value={transferForm.productId}
                onChange={handleTransferChange}
                options={products}
                placeholder="Select product"
              />

              <SearchableSelect
                id="transfer-from"
                name="fromWarehouseId"
                label="From Warehouse"
                icon={WarehouseIcon}
                value={transferForm.fromWarehouseId}
                onChange={handleTransferChange}
                options={warehouses}
                placeholder="Select source warehouse"
              />

              <SearchableSelect
                id="transfer-to"
                name="toWarehouseId"
                label="To Warehouse"
                icon={WarehouseIcon}
                value={transferForm.toWarehouseId}
                onChange={handleTransferChange}
                options={warehouses.filter((warehouse) => warehouse.id !== transferForm.fromWarehouseId)}
                placeholder="Select destination warehouse"
              />

              <InputField
                id="transfer-quantity"
                name="quantity"
                label="Quantity"
                icon={Boxes}
                type="number"
                value={transferForm.quantity}
                onChange={handleTransferChange}
              />

              <DatePicker
                id="transfer-date"
                name="date"
                label="Transfer Date"
                value={transferForm.date}
                onChange={handleTransferChange}
              />

              <div className="button-row">
                <button className="button button-primary">
                  <MoveRight size={16} />
                  Transfer
                </button>
                <button type="button" className="button" onClick={() => setIsTransferOpen(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </ModalComponent>
      ) : null}
    </div>
  )
}




