import { Plus, Users as UsersIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import UserForm from './components/UserForm'
import UserTable from './components/UserTable'
import './Users.css'

export default function Users({ users, roles, onSaveUser, onDeleteUser }) {
  const { hasPermission } = useAuth()
  const [editingUser, setEditingUser] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('users', 'create')
  const canEdit = hasPermission('users', 'edit')
  const canDelete = hasPermission('users', 'delete')
  const showForm = isFormOpen || Boolean(editingUser)

  function handleOpenCreate() {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  function handleEdit(user) {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingUser(null)
    setIsFormOpen(false)
  }

  function handleSave(values) {
    const result = onSaveUser(values, editingUser?.id ?? null)
    setMessage(result)

    if (result.success) {
      handleCloseForm()
    }
  }

  function handleDelete(userId) {
    const result = onDeleteUser(userId)
    setMessage(
      result.success
        ? { success: true, message: 'User deleted successfully.' }
        : result,
    )

    if (result.success && editingUser?.id === userId) {
      handleCloseForm()
    }
  }

  return (
    <div className="page users-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <UsersIcon size={20} />
          </div>
          <div>
            <h1>Users</h1>
            <p className="page-subtitle">
              Create users and assign roles for frontend-only access control.
            </p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button type="button" className="button button-primary" onClick={handleOpenCreate}>
              <Plus size={16} />
              Add User
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
        <UserTable
          users={users}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm ? (
        <FormModal onClose={handleCloseForm}>
          <UserForm
            key={editingUser?.id ?? 'new-user'}
            roles={roles}
            initialValues={editingUser}
            canSubmit={editingUser ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
