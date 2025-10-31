import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'
import { handleApiError } from '../utils/errorUtils'
import { validateEmail } from '../utils/validationUtils'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { alert, showAlert, dismissAlert } = useAlert()
  
  const { login, authError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    dismissAlert()

    // Client-side validation
    if (!validateEmail(email)) {
      showAlert('error', 'Please enter a valid email address')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      showAlert('error', 'Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/user')
        }
      } else {
        showAlert('error', result.message)
      }
    } catch (error) {
      handleApiError(error, (message) => {
        showAlert('error', message)
      })
    } finally {
      setLoading(false)
    }
  }

  // Show auth error if present
  if (authError) {
    showAlert('error', authError)
  }

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>Login</h2>
          <p>Welcome to AI Recruitment Platform</p>
        </div>
        <Alert alert={alert} onDismiss={dismissAlert} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
              className="ai-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
              className="ai-input"
            />
          </div>
          <button type="submit" disabled={loading} className="ai-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="ai-demo-box">
          <h3>Demo Credentials:</h3>
          <p><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>User:</strong> user@example.com / user123</p>
        </div>
        
        <div className="links">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage