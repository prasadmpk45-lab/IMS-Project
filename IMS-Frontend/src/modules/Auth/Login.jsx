import { LockKeyhole, Mail, LogIn } from 'lucide-react'
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const res = await login(formData)

      if (!res.success) {
        setError(res.message || 'Invalid credentials')
        return
      }

      navigate('/')
    } catch {
      setError('Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      {/* LEFT PANEL */}
      <div className="auth-left-panel">
        <div className="brand">
          <div className="logo">📦</div>
          <h2>StockPilot IMS</h2>
          <span>Inventory Management System</span>
        </div>

        <h1>Manage your inventory with confidence.</h1>

        <p>
          Track stock, monitor movements, and streamline operations with a
          powerful and easy-to-use inventory platform.
        </p>

        <div className="features">
          <div>✔ Real-time stock tracking</div>
          <div>✔ Secure user access</div>
          <div>✔ Smart inventory insights</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">SIGN IN</span>

          <h2>Access your inventory workspace</h2>
          <p className="sub">
            Use your account credentials to continue
          </p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
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

            {/* Password */}
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

            <button disabled={loading}>
              {loading ? 'Signing in...' : 'Login to IMS'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}