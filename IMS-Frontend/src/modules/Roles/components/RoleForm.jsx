import { RotateCcw, Save, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { getNameError } from '../../../utils/helpers'
import { normalizePermissions, PERMISSION_OPTIONS } from '../../../utils/permissions'
import PermissionMatrix from './PermissionMatrix'

const emptyForm = {
  name: '',
  permissions: normalizePermissions(),
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    name: initialValues.name,
    permissions: normalizePermissions(initialValues.permissions),
  }
}

export default function RoleForm({
  initialValues,
  canSubmit,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const hasAnyPermission = PERMISSION_OPTIONS.some(
    (item) => formData.permissions[item.key]?.length,
  )
  const errors = {
    name: getNameError(formData.name, 'Role name'),
    permissions: hasAnyPermission ? '' : 'Select at least one permission.',
  }
  const isFormValid = Object.values(errors).every((value) => !value)

  function handleNameChange(event) {
    const { value } = event.target
    setFormData((currentValue) => ({ ...currentValue, name: value }))
  }

  function handleNameBlur() {
    setTouched((currentValue) => ({ ...currentValue, name: true }))
  }

  function handlePermissionToggle(moduleKey, action) {
    setTouched((currentValue) => ({ ...currentValue, permissions: true }))
    setFormData((currentValue) => {
      const modulePermissions = currentValue.permissions[moduleKey] ?? []
      const hasAction = modulePermissions.includes(action)

      return {
        ...currentValue,
        permissions: {
          ...currentValue.permissions,
          [moduleKey]: hasAction
            ? modulePermissions.filter((item) => item !== action)
            : [...modulePermissions, action],
        },
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({
      name: true,
      permissions: true,
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
      <h2 className="section-title">{initialValues ? 'Edit Role' : 'Add Role'}</h2>
      <form
        className="form-grid form-grid--single"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="field">
          <label htmlFor="role-name">Role Name</label>
          <div className="input-with-icon">
            <ShieldCheck size={16} />
            <input
              id="role-name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              autoComplete="off"
            />
          </div>
          {touched.name && errors.name ? (
            <span className="field-error">{errors.name}</span>
          ) : null}
        </div>

        <PermissionMatrix
          permissions={formData.permissions}
          onToggle={handlePermissionToggle}
        />
        {touched.permissions && errors.permissions ? (
          <span className="field-error">{errors.permissions}</span>
        ) : null}

        <div className="button-row">
          <button
            type="submit"
            className="button button-primary"
            disabled={!canSubmit || !isFormValid}
          >
            <Save size={16} />
            Save Role
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
