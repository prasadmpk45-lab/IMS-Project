import {
  Building2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import {
  getEmailError,
  getNameError,
  getRequiredError,
} from '../../utils/helpers'
import './Customers.css'

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  city: '',
}

const fieldConfig = {
  name: {
    label: 'Customer Name',
    icon: User,
    type: 'text',
  },
  company: {
    label: 'Company',
    icon: Building2,
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
  city: {
    label: 'City',
    icon: MapPin,
    type: 'text',
  },
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    name: initialValues.name ?? '',
    company: initialValues.company ?? '',
    email: initialValues.email ?? '',
    phone: initialValues.phone ?? '',
    city: initialValues.city ?? '',
  }
}

function CustomerForm({ initialValues, canSubmit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const errors = {
    name: getNameError(formData.name, 'Customer name'),
    company: getRequiredError(formData.company, 'Company'),
    email: getEmailError(formData.email),
    phone: getRequiredError(formData.phone, 'Phone'),
    city: getRequiredError(formData.city, 'City'),
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
      company: true,
      email: true,
      phone: true,
      city: true,
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
      <h2 className="section-title">{initialValues ? 'Edit Customer' : 'Add Customer'}</h2>
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
            <label htmlFor={`customer-${fieldName}`}>{config.label}</label>
            <div className="input-with-icon">
              <Icon size={16} />
              <input
                id={`customer-${fieldName}`}
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
            Save Customer
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

export default function Customers({ customers, onSaveCustomer, onDeleteCustomer }) {
  const { hasPermission } = useAuth()
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('customers', 'create')
  const canEdit = hasPermission('customers', 'edit')
  const canDelete = hasPermission('customers', 'delete')
  const showForm = isFormOpen || Boolean(editingCustomer)

  function handleOpenCreate() {
    setEditingCustomer(null)
    setIsFormOpen(true)
  }

  function handleEdit(customer) {
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingCustomer(null)
    setIsFormOpen(false)
  }

  function handleSave(values) {
    onSaveCustomer(values, editingCustomer?.id ?? null)
    setMessage({
      success: true,
      message: editingCustomer
        ? 'Customer updated successfully.'
        : 'Customer added successfully.',
    })
    handleCloseForm()
  }

  function handleDelete(customerId) {
    const result = onDeleteCustomer(customerId)
    setMessage(
      result?.success === false
        ? result
        : { success: true, message: 'Customer deleted successfully.' },
    )

    if (editingCustomer?.id === customerId && result?.success !== false) {
      handleCloseForm()
    }
  }

  return (
    <div className="page customers-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <Users size={20} />
          </div>
          <div>
            <h1>Customers</h1>
            <p className="page-subtitle">Create and maintain customer records.</p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenCreate}>
              <Plus size={16} />
              Add Customer
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
          <h2 className="section-title">Customer List</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  {canEdit || canDelete ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canEdit || canDelete ? 6 : 5}
                      className="table-empty"
                    >
                      <p className="empty-message">No customers available.</p>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.company}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.city}</td>
                      {canEdit || canDelete ? (
                        <td>
                          <div className="table-actions">
                            {canEdit ? (
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleEdit(customer)}
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            ) : null}
                            {canDelete ? (
                              <button
                                type="button"
                                className="button button-danger"
                                onClick={() => handleDelete(customer.id)}
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
          <CustomerForm
            key={editingCustomer?.id ?? 'new-customer'}
            initialValues={editingCustomer}
            canSubmit={editingCustomer ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
