import React from 'react'
import usePermissions from '../hooks/usePermissions'

const QuickStats = () => {
  const { isAdmin, isUser } = usePermissions()

  if (isAdmin()) {
    return (
      <div className="quick-stats">
        <h3>System Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p className="stat-value">124</p>
          </div>
          <div className="stat-card">
            <h4>Active Sessions</h4>
            <p className="stat-value">12</p>
          </div>
          <div className="stat-card">
            <h4>Processed Interviews</h4>
            <p className="stat-value">87</p>
          </div>
          <div className="stat-card">
            <h4>System Uptime</h4>
            <p className="stat-value">99.9%</p>
          </div>
        </div>
      </div>
    )
  }

  if (isUser()) {
    return (
      <div className="quick-stats">
        <h3>Your Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Interviews Completed</h4>
            <p className="stat-value">4</p>
          </div>
          <div className="stat-card">
            <h4>Average Score</h4>
            <p className="stat-value">82%</p>
          </div>
          <div className="stat-card">
            <h4>Practice Sessions</h4>
            <p className="stat-value">12</p>
          </div>
          <div className="stat-card">
            <h4>Hours Practiced</h4>
            <p className="stat-value">8.5</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default QuickStats