import {
  Mail,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Tag,
  Trash2,
  Truck,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import {
  getEmailError,
  getNameError,
  getRequiredError,
} from '../../utils/helpers'
import './Suppliers.css'

const emptyForm = {
  name: '',
  contact: '',
  email: '',
  phone: '',
  category: '',
}

const fieldConfig = {
  name: {
    label: 'Supplier Name',
    icon: Truck,
    type: 'text',
  },
  contact: {
    label: 'Contact Person',
    icon: User,
    type: 'text',
  },
  email: {
    label: 'Email',
    icon: Mail,
    type: 'email',
  },
  phone: {
    label: 'Phone',
    icon: Phone,
    type: 'text',
  },
  category: {
    label: 'Category',
    icon: Tag,
    type: 'text',
  },
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    name: initialValues.name ?? '',
    contact: initialValues.contact ?? '',
    email: initialValues.email ?? '',
    phone: initialValues.phone ?? '',
    category: initialValues.category ?? '',
  }
}

function SupplierForm({ initialValues, canSubmit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const errors = {
    name: getNameError(formData.name, 'Supplier name'),
    contact: getNameError(formData.contact, 'Contact person'),
    email: getEmailError(formData.email),
    phone: getRequiredError(formData.phone, 'Phone'),
    category: getRequiredError(formData.category, 'Category'),
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
      contact: true,
      email: true,
      phone: true,
      category: true,
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
      <h2 className="section-title">{initialValues ? 'Edit Supplier' : 'Add Supplier'}</h2>
      <form
        className="form-grid form-grid--single"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {Object.keys(emptyForm).map((fieldName) => {
          const config = fieldConfig[fieldName]
          const Icon = config.icon

          return (
          <div className="field" key={fieldName}>
            <label htmlFor={`supplier-${fieldName}`}>{config.label}</label>
            <div className="input-with-icon">
              <Icon size={16} />
              <input
                id={`supplier-${fieldName}`}
                name={fieldName}
                type={config.type}
                value={formData[fieldName]}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
            </div>
            {touched[fieldName] && errors[fieldName] ? (
              <span className="field-error">{errors[fieldName]}</span>
            ) : null}
          </div>
          )
        })}

        <div className="button-row">
          <button
            type="submit"
            className="button button-primary"
            disabled={!canSubmit || !isFormValid}
          >
            <Save size={16} />
            Save Supplier
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

export default function Suppliers({ suppliers, onSaveSupplier, onDeleteSupplier }) {
  const { hasPermission } = useAuth()
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('suppliers', 'create')
  const canEdit = hasPermission('suppliers', 'edit')
  const canDelete = hasPermission('suppliers', 'delete')
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

  function handleSave(values) {
    onSaveSupplier(values, editingSupplier?.id ?? null)
    setMessage({
      success: true,
      message: editingSupplier
        ? 'Supplier updated successfully.'
        : 'Supplier added successfully.',
    })
    handleCloseForm()
  }

  function handleDelete(supplierId) {
    const result = onDeleteSupplier(supplierId)
    setMessage(
      result?.success === false
        ? result
        : { success: true, message: 'Supplier deleted successfully.' },
    )

    if (editingSupplier?.id === supplierId && result?.success !== false) {
      handleCloseForm()
    }
  }

  return (
    <div className="page suppliers-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <Truck size={20} />
          </div>
          <div>
            <h1>Suppliers</h1>
            <p className="page-subtitle">Create and maintain supplier records.</p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenCreate}>
              <Plus size={16} />
              Add Supplier
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
          <h2 className="section-title">Supplier List</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Category</th>
                  {canEdit || canDelete ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canEdit || canDelete ? 6 : 5}
                      className="table-empty"
                    >
                      <p className="empty-message">No suppliers available.</p>
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.contact}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.phone}</td>
                      <td>{supplier.category}</td>
                      {canEdit || canDelete ? (
                        <td>
                          <div className="table-actions">
                            {canEdit ? (
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleEdit(supplier)}
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            ) : null}
                            {canDelete ? (
                              <button
                                type="button"
                                className="button button-danger"
                                onClick={() => handleDelete(supplier.id)}
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            ) : null}
                          </div>
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

      {showForm ? (
        <FormModal onClose={handleCloseForm}>
          <SupplierForm
            key={editingSupplier?.id ?? 'new-supplier'}
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
