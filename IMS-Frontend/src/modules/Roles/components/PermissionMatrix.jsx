import { PERMISSION_OPTIONS } from '../../../utils/permissions'

export default function PermissionMatrix({ permissions, onToggle }) {
  return (
    <div className="roles-matrix">
      <h3 className="section-title">Permission Matrix</h3>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PERMISSION_OPTIONS.map((moduleItem) => (
              <tr key={moduleItem.key}>
                <td>
                  <div className="roles-matrix__module">
                    <moduleItem.icon size={16} />
                    <span>{moduleItem.label}</span>
                  </div>
                </td>
                <td>
                  <div className="roles-matrix__actions">
                    {moduleItem.actions.map((action) => (
                      <label key={action} className="roles-matrix__checkbox">
                        <input
                          type="checkbox"
                          checked={permissions[moduleItem.key]?.includes(action) ?? false}
                          onChange={() => onToggle(moduleItem.key, action)}
                        />
                        <span>{action}</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
