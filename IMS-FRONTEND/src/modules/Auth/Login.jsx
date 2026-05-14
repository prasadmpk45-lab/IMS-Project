import { LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Enter valid email')
      return
    }

    try {
      setLoading(true)
      const result = await login(formData)

      if (!result?.success) {
        setError(result?.message || 'Login failed')
        return
      }

      navigate('/dashboard', { replace: true })
    } catch {
      setError('Server error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left-panel">
        <div className="brand">
          <div className="logo">IMS</div>
          <h2>StockPilot IMS</h2>
          <span>Inventory Management System</span>
        </div>

        <h1>Manage your inventory with confidence.</h1>
        <p>Track stock, monitor movements, and streamline operations.</p>

        <div className="features">
          <div>Real-time tracking</div>
          <div>Secure access</div>
          <div>Smart insights</div>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">SIGN IN</span>
          <h2>Access your workspace</h2>
          <p className="sub">Login to continue</p>

          {error ? <div className="error-box">{error}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <Mail size={16} />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <LockKeyhole size={16} />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="links">
              <Link to="/forgot-password">Forgot password?</Link>
              <Link to="/register">Create account</Link>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login to IMS'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
