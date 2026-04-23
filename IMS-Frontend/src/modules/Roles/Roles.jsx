import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import { PERMISSION_OPTIONS } from '../../utils/permissions'
import RoleForm from './components/RoleForm'
import './Roles.css'

export default function Roles({ roles, onSaveRole, onDeleteRole }) {
  const { hasPermission } = useAuth()
  const [editingRole, setEditingRole] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('roles', 'create')
  const canEdit = hasPermission('roles', 'edit')
  const canDelete = hasPermission('roles', 'delete')
  const showForm = isFormOpen || Boolean(editingRole)

  function handleOpenCreate() {
    setEditingRole(null)
    setIsFormOpen(true)
  }

  function handleEdit(role) {
    setEditingRole(role)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingRole(null)
    setIsFormOpen(false)
  }

  function handleSave(values) {
    const result = onSaveRole(values, editingRole?.id ?? null)
    setMessage(result)

    if (result.success) {
      handleCloseForm()
    }
  }

  function handleDelete(roleId) {
    const result = onDeleteRole(roleId)
    setMessage(
      result.success
        ? { success: true, message: 'Role deleted successfully.' }
        : result,
    )

    if (result.success && editingRole?.id === roleId) {
      handleCloseForm()
    }
  }

  return (
    <div className="page roles-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1>Roles</h1>
            <p className="page-subtitle">
              Create roles and manage permissions with a checkbox matrix.
            </p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenCreate}>
              <Plus size={16} />
              Add Role
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
          <h2 className="section-title">Role List</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Visible Modules</th>
                  {canEdit || canDelete ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={canEdit || canDelete ? 3 : 2} className="table-empty">
                      <p className="empty-message">No roles available.</p>
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>
                        <div className="summary-list">
                          {Object.entries(role.permissions)
                            .filter(([, actions]) => actions.length > 0)
                            .map(([moduleKey]) => {
                              const matchedItem = PERMISSION_OPTIONS.find(
                                (item) => item.key === moduleKey,
                              )

                              if (!matchedItem) {
                                return null
                              }

                              const Icon = matchedItem.icon

                              return (
                                <span key={moduleKey} className="summary-chip">
                                  <Icon size={14} />
                                  {matchedItem.label}
                                </span>
                              )
                            })}
                        </div>
                      </td>
                      {canEdit || canDelete ? (
                        <td>
                          <div className="table-actions">
                            {canEdit ? (
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleEdit(role)}
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            ) : null}
                            {canDelete ? (
                              <button
                                type="button"
                                className="button button-danger"
                                onClick={() => handleDelete(role.id)}
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
          <RoleForm
            key={editingRole?.id ?? 'new-role'}
            initialValues={editingRole}
            canSubmit={editingRole ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
