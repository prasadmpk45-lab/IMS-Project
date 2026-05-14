import { LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Auth.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  // ✅ get email from previous screen
  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!otp || !password || !confirmPassword) {
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

      // ✅ RESET PASSWORD API CALL
      const res = await fetch(
        'https://trimestral-flusteredly-patrice.ngrok-free.dev/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword: password,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to reset password')
        return
      }

      // ✅ SUCCESS
      navigate('/login')

    } catch (err) {
      setError('Something went wrong')
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
          <span>Password Reset</span>
        </div>

        <h1>Create a new password.</h1>

        <p>Enter OTP and new password to regain access.</p>

        <div className="features">
          <div>Quick reset</div>
          <div>Secure access</div>
          <div>OTP verification</div>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="login-card">
          <span className="tag">RESET</span>

          <h2>Reset Password</h2>
          <p className="sub">Enter OTP and new password</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* OTP */}
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

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