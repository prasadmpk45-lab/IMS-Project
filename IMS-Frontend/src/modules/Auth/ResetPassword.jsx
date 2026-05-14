import { KeyRound, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Auth.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ get email from previous page
  const email = location.state?.email || 'user@example.com'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      // ✅ simulate success (no backend)
      setTimeout(() => {
        navigate('/login')
      }, 500)

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
          <span>Password Reset</span>
        </div>

        <h1>Create a new password.</h1>

        <p>
          Enter a new password to regain access to your account.
        </p>

        <div className="features">
          <div>✔ Quick reset</div>
          <div>✔ Secure access</div>
          <div>✔ Demo mode enabled</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">RESET</span>

          <h2>Reset Password</h2>
          <p className="sub">Enter your new password</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* New Password */}
            <div className="input-box">
              <LockKeyhole size={16} />
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="input-box">
              <LockKeyhole size={16} />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="links">
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}