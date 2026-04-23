import {
  UserPlus,
  LockKeyhole,
  Mail,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const res = await register(formData)

      if (!res.success) {
        setError(res.message || 'Registration failed')
        return
      }

      navigate('/login')
    } catch {
      setError('Something went wrong')
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
          <span>Secure account setup</span>
        </div>

        <h1>Create your account in seconds.</h1>

        <p>
          Start managing your inventory with a secure and scalable system.
        </p>

        <div className="features">
          <div>✔ Quick onboarding</div>
          <div>✔ Secure authentication</div>
          <div>✔ Role-based access</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">SIGN UP</span>

          <h2>Create your account</h2>
          <p className="sub">Get started with StockPilot IMS</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="input-box">
              <User size={16} />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="input-box">
              <Mail size={16} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
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
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="input-box">
              <LockKeyhole size={16} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="links">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}