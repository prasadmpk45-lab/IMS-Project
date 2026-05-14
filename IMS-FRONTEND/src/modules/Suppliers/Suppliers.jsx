import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import { CreditCard, MapPin, Truck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import FormModal from '../../layouts/FormModal'
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  updateSupplier,
} from '../../api/suppliersApi'
import SuppliersHeader from './components/SuppliersHeader'
import SuppliersTable from './components/SuppliersTable'
import SupplierForm from './components/SupplierForm'
import './Suppliers.css'

function SummaryCard({ icon, label, value, helper }) {
  return (
    <div className="card suppliers-page__summary-card">
      <div className="suppliers-page__summary-icon">
        {createElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="suppliers-page__summary-label">{label}</p>
        <strong className="suppliers-page__summary-value">{value}</strong>
        <p className="suppliers-page__summary-helper">{helper}</p>
      </div>
    </div>
  )
}

function getPayloadData(response) {
  const data = response?.data
  return data?.data ?? data?.items ?? data ?? null
}

export default function Suppliers({
  suppliers: initialSuppliers = [],
  purchases = [],
}) {
  const { hasPermission } = useAuth()

  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const canCreate = hasPermission('suppliers', 'create')
  const canEdit = hasPermission('suppliers', 'edit')
  const canDelete = hasPermission('suppliers', 'delete')

  const notify = useCallback((result) => {
    showToast({
      type: result.success ? 'success' : 'error',
      title: 'Suppliers',
      message: result.message,
    })
  }, [])

  const loadSuppliers = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getAllSuppliers()
      const data = getPayloadData(response)

      if (!response.success) {
        throw new Error(response.error || 'Failed to load suppliers')
      }

      setSuppliers(Array.isArray(data) ? data : [])
      setMessage(null)
    } catch (error) {
      const nextMessage = {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load suppliers',
      }
      setMessage(nextMessage)
      notify(nextMessage)
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  useEffect(() => {
    queueMicrotask(loadSuppliers)
  }, [loadSuppliers])

  const summary = useMemo(
    () => ({
      total: suppliers.length,
      activeLocations: suppliers.filter((supplier) => supplier.city || supplier.state).length,
      paymentTerms: suppliers.filter((supplier) => supplier.paymentTerms).length,
      linkedPOs: purchases.length,
    }),
    [purchases.length, suppliers],
  )

  const showForm = isFormOpen || Boolean(editingSupplier)


  function handleOpenCreate() {
    setEditingSupplier(null)
    setIsFormOpen(true)
  }

  function handleEdit(supplier) {
    setEditingSupplier(supplier)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingSupplier(null)
    setIsFormOpen(false)
  }

  async function handleSave(values) {
    const response = editingSupplier?.id
      ? await updateSupplier(editingSupplier.id, values)
      : await createSupplier(values)

    const result = response.success
      ? {
          success: true,
          message: editingSupplier
            ? 'Supplier updated successfully.'
            : 'Supplier added successfully.',
        }
      : { success: false, message: response.error || 'Supplier save failed.' }

    setMessage(result)
    notify(result)

    if (response.success) {
      await loadSuppliers()
      handleCloseForm()
    }
  }

  async function handleDelete(id) {
    const response = await deleteSupplier(id)
    const nextMessage = response.success
      ? { success: true, message: 'Supplier deleted successfully.' }
      : { success: false, message: response.error || 'Supplier delete failed.' }

    setMessage(nextMessage)
    notify(nextMessage)

    if (response.success) {
      await loadSuppliers()
      if (editingSupplier?.id === id) {
        handleCloseForm()
      }
    }
  }

  return (
    <div className="page suppliers-page">
      <SuppliersHeader canCreate={canCreate} onAdd={handleOpenCreate} />

      {message ? (
        <div
          className={`message-box ${message.success ? 'message-box--success' : 'message-box--error'}`}
        >
          {message.message}
        </div>
      ) : null}

      <div className="suppliers-page__summary-grid">
        <SummaryCard
          icon={Truck}
          label="Suppliers"
          value={summary.total}
          helper="Active supplier records maintained in IMS."
        />
        <SummaryCard
          icon={MapPin}
          label="Address Profiles"
          value={summary.activeLocations}
          helper="Suppliers with address details configured."
        />
        <SummaryCard
          icon={CreditCard}
          label="Payment Terms"
          value={summary.paymentTerms}
          helper={`${summary.linkedPOs} purchase entries linked to supplier accounts.`}
        />
      </div>

      <div className="content-grid content-grid--single">
        <SuppliersTable
          suppliers={suppliers}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={isLoading ? 'Loading suppliers...' : 'No suppliers available.'}
        />
      </div>

      {showForm ? (
        <FormModal
          title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
          onClose={handleCloseForm}
        >
          <SupplierForm
            key={editingSupplier?.id ?? 'new'}
            initialValues={editingSupplier}
            canSubmit={editingSupplier ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      ) : null}
    </div>
  )
}



