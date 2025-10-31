import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import UserProfile from '../components/UserProfile'
import DashboardOverview from '../components/DashboardOverview'
import SystemStatus from '../components/SystemStatus'
import InterviewHistory from '../components/InterviewHistory'
import usePermissions from '../hooks/usePermissions'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const { canAccess } = usePermissions()
  const navigate = useNavigate()
  const { alert, showAlert, dismissAlert } = useAlert()
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSubmitFeedback = () => {
    // In a real app, this would be an API call
    console.log('Submitting feedback:', feedback)
    setShowFeedbackModal(false)
    setFeedback('')
    showAlert('success', 'Thank you for your feedback!')
  }

  return (
    <div className="user-dashboard">
      <header>
        <h1>User Dashboard</h1>
        <div className="user-controls">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      <main>
        <SystemStatus />
        
        <UserProfile />
        
        <DashboardOverview />
        
        <InterviewHistory />
        
        <section className="user-features">
          <h2>Interview Tools</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Start Interview</h3>
              <p>Begin a new interview session.</p>
              <button>Start Now</button>
            </div>
            <div className="feature-card">
              <h3>View History</h3>
              <p>Review your past interviews and feedback.</p>
              <button>View History</button>
            </div>
            {canAccess('practice-mode') && (
              <div className="feature-card">
                <h3>Practice Mode</h3>
                <p>Improve your interview skills with practice sessions.</p>
                <button>Practice</button>
              </div>
            )}
            <div className="feature-card">
              <h3>Provide Feedback</h3>
              <p>Share your thoughts about the platform.</p>
              <button onClick={() => setShowFeedbackModal(true)}>Give Feedback</button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Feedback Modal */}
      <Modal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)}
        title="Provide Feedback"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSubmitFeedback()
        }}>
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="5"
              placeholder="Please share your thoughts, suggestions, or any issues you've encountered..."
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowFeedbackModal(false)}>
              Cancel
            </button>
            <button type="submit">
              Submit Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default UserDashboard