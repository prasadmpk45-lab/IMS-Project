import { Mail, MailQuestion } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Auth.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { requestPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    try {
      setLoading(true)

      const res = await requestPasswordReset(email)

      if (!res.success) {
        setError(res.message || 'Failed to process request')
        return
      }

      setSuccess('Verification code sent successfully.')

      setTimeout(() => {
        navigate('/verify-otp', {
          state: { email },
        })
      }, 1200)

    } catch {
      setError('Something went wrong. Try again.')
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

        <h1>Reset your password securely.</h1>

        <p>
          Enter your registered email and we’ll help you recover your account.
        </p>

        <div className="features">
          <div>✔ Secure verification process</div>
          <div>✔ Quick account recovery</div>
          <div>✔ Protected user access</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">RESET</span>

          <h2>Forgot Password</h2>
          <p className="sub">Enter your email to receive a code</p>

          {error && <div className="error-box">{error}</div>}
          {success && <div className="success-box">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <Mail size={16} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'}
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