import { Pencil, Trash2 } from 'lucide-react'

export default function UserTable({ users, canEdit, canDelete, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2 className="section-title">User List</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {canEdit || canDelete ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={canEdit || canDelete ? 4 : 3} className="table-empty">
                  <p className="empty-message">No users available.</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  {canEdit || canDelete ? (
                    <td>
                      <div className="table-actions">
                        {canEdit ? (
                          <button
                            type="button"
                            className="button"
                            onClick={() => onEdit(user)}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                        ) : null}
                        {canDelete ? (
                          <button
                            type="button"
                            className="button button-danger"
                            onClick={() => onDelete(user.id)}
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
  )
}
