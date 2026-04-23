import { LockKeyhole, Mail, RotateCcw, Save, ShieldCheck, User } from 'lucide-react'
import { useState } from 'react'
import {
  getEmailError,
  getNameError,
  getPasswordError,
  getRequiredError,
} from '../../../utils/helpers'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: '',
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return emptyForm
  }

  return {
    name: initialValues.name ?? '',
    email: initialValues.email ?? '',
    password: '',
    role: initialValues.role ?? '',
  }
}

export default function UserForm({
  roles,
  initialValues,
  canSubmit,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const errors = {
    name: getNameError(formData.name),
    email: getEmailError(formData.email),
    password: getPasswordError(formData.password, {
      required: !initialValues,
    }),
    role: getRequiredError(formData.role, 'Role'),
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
      email: true,
      password: true,
      role: true,
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
      <h2 className="section-title">{initialValues ? 'Edit User' : 'Add User'}</h2>
      <form
        className="form-grid form-grid--single"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="field">
          <label htmlFor="user-name">Name</label>
          <div className="input-with-icon">
            <User size={16} />
            <input
              id="user-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.name && errors.name ? (
            <span className="field-error">{errors.name}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="user-email">Email</label>
          <div className="input-with-icon">
            <Mail size={16} />
            <input
              id="user-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>
          {touched.email && errors.email ? (
            <span className="field-error">{errors.email}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="user-password">
            Password {initialValues ? '(Leave blank to keep current password)' : ''}
          </label>
          <div className="input-with-icon">
            <LockKeyhole size={16} />
            <input
              id="user-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
          </div>
          {touched.password && errors.password ? (
            <span className="field-error">{errors.password}</span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="user-role">Role</label>
          <div className="input-with-icon">
            <ShieldCheck size={16} />
            <select
              id="user-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          {touched.role && errors.role ? (
            <span className="field-error">{errors.role}</span>
          ) : null}
        </div>

        <div className="button-row">
          <button
            type="submit"
            className="button button-primary"
            disabled={!canSubmit || !isFormValid}
          >
            <Save size={16} />
            Save User
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
