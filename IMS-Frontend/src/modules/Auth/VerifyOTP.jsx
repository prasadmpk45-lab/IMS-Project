import { ShieldCheck, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Auth.css'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const email = location.state?.email || 'user@example.com'

  // ❌ No session
  if (!email) {
    return (
      <div className="auth-wrapper">
        <div className="auth-right-panel" style={{ width: '100%' }}>
          <div className="login-card">
            <h2>Session Expired</h2>
            <p className="sub">Please request a new verification code</p>

            <div className="error-box">
              No active OTP session found.
            </div>

            <div className="links">
              <Link to="/forgot-password">Request Code</Link>
              <Link to="/login">Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // ✅ only check 6 digits
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit code')
      return
    }

    try {
      setLoading(true)

      // ✅ directly go to next page (no verification)
      setTimeout(() => {
        navigate('/reset-password')
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
          <span>Verification</span>
        </div>

        <h1>Enter verification code</h1>
        <p>Enter any 6-digit code to continue.</p>

        <div className="features">
          <div>✔ Quick verification</div>
          <div>✔ Easy access</div>
          <div>✔ Demo mode enabled</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">VERIFY</span>

          <h2>Verification Code</h2>
          <p className="sub">Enter 6-digit code</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            
            {/* Email */}
            <div className="input-box">
              <Mail size={16} />
              <input value={email} readOnly />
            </div>

            {/* OTP */}
            <div className="input-box">
              <ShieldCheck size={16} />
              <input
                type="text"
                name="otp-code-unique"
                placeholder="Enter 6-digit code"
                value={otp}
                autoComplete="off"
                inputMode="numeric"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setOtp(value)
                }}
                maxLength={6}
              />
            </div>

            <button disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="links">
            <Link to="/forgot-password">Back</Link>
          </div>
        </div>
      </div>
    </div>
  )
}