import {
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  User,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import { getNameError, getRequiredError } from '../../utils/helpers'
import './Warehouses.css'

const emptyForm = {
  name: '',
  location: '',
  manager: '',
}

const fieldConfig = {
  name: {
    label: 'Warehouse Name',
    icon: Warehouse,
  },
  location: {
    label: 'Location',
    icon: MapPin,
  },
  manager: {
    label: 'Manager',
    icon: User,
  },
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    name: initialValues.name ?? '',
    location: initialValues.location ?? '',
    manager: initialValues.manager ?? '',
  }
}

function WarehouseForm({ initialValues, canSubmit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const errors = {
    name: getNameError(formData.name, 'Warehouse name'),
    location: getRequiredError(formData.location, 'Location'),
    manager: getNameError(formData.manager, 'Manager'),
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
      location: true,
      manager: true,
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
      <h2 className="section-title">{initialValues ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
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
            <label htmlFor={`warehouse-${fieldName}`}>{config.label}</label>
            <div className="input-with-icon">
              <Icon size={16} />
              <input
                id={`warehouse-${fieldName}`}
                name={fieldName}
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
            Save Warehouse
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

export default function Warehouses({
  warehouses,
  onSaveWarehouse,
  onDeleteWarehouse,
}) {
  const { hasPermission } = useAuth()
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('warehouses', 'create')
  const canEdit = hasPermission('warehouses', 'edit')
  const canDelete = hasPermission('warehouses', 'delete')
  const showForm = isFormOpen || Boolean(editingWarehouse)

  function handleOpenCreate() {
    setEditingWarehouse(null)
    setIsFormOpen(true)
  }

  function handleEdit(warehouse) {
    setEditingWarehouse(warehouse)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingWarehouse(null)
    setIsFormOpen(false)
  }

  function handleSave(values) {
    onSaveWarehouse(values, editingWarehouse?.id ?? null)
    setMessage({
      success: true,
      message: editingWarehouse
        ? 'Warehouse updated successfully.'
        : 'Warehouse added successfully.',
    })
    handleCloseForm()
  }

  function handleDelete(warehouseId) {
    const result = onDeleteWarehouse(warehouseId)
    setMessage(
      result?.success === false
        ? result
        : { success: true, message: 'Warehouse deleted successfully.' },
    )

    if (editingWarehouse?.id === warehouseId && result?.success !== false) {
      handleCloseForm()
    }
  }

  return (
    <div className="page warehouses-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <Warehouse size={20} />
          </div>
          <div>
            <h1>Warehouses</h1>
            <p className="page-subtitle">Create and maintain warehouse locations.</p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenCreate}>
              <Plus size={16} />
              Add Warehouse
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
          <h2 className="section-title">Warehouse List</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  {canEdit || canDelete ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {warehouses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canEdit || canDelete ? 4 : 3}
                      className="table-empty"
                    >
                      <p className="empty-message">No warehouses available.</p>
                    </td>
                  </tr>
                ) : (
                  warehouses.map((warehouse) => (
                    <tr key={warehouse.id}>
                      <td>{warehouse.name}</td>
                      <td>{warehouse.location}</td>
                      <td>{warehouse.manager}</td>
                      {canEdit || canDelete ? (
                        <td>
                          <div className="table-actions">
                            {canEdit ? (
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleEdit(warehouse)}
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            ) : null}
                            {canDelete ? (
                              <button
                                type="button"
                                className="button button-danger"
                                onClick={() => handleDelete(warehouse.id)}
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
          <WarehouseForm
            key={editingWarehouse?.id ?? 'new-warehouse'}
            initialValues={editingWarehouse}
            canSubmit={editingWarehouse ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
