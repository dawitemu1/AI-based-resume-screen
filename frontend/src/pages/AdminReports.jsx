import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

const AdminReports = () => {
  const [reportData, setReportData] = useState({
    totalUsers: 124,
    activeUsers: 89,
    totalInterviews: 245,
    avgInterviewScore: 78,
    interviewsByMonth: [
      { month: 'Jan', count: 15 },
      { month: 'Feb', count: 18 },
      { month: 'Mar', count: 22 },
      { month: 'Apr', count: 25 },
      { month: 'May', count: 30 },
      { month: 'Jun', count: 35 }
    ],
    userRoles: [
      { role: 'Admin', count: 3 },
      { role: 'User', count: 121 }
    ],
    interviewScores: [
      { range: '90-100%', count: 25 },
      { range: '80-89%', count: 45 },
      { range: '70-79%', count: 60 },
      { range: '60-69%', count: 40 },
      { range: 'Below 60%', count: 20 }
    ]
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const generateReport = () => {
    // In a real app, this would generate a downloadable report
    alert('Report generation started. This would download a PDF in a real application.')
  }

  if (loading) {
    return <div className="admin-reports">Loading report data...</div>
  }

  return (
    <div className="admin-reports">
      <header>
        <h1>System Reports</h1>
        <button className="btn-primary" onClick={generateReport}>
          Generate Report
        </button>
      </header>
      
      <div className="report-section">
        <h2>User Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{reportData.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{reportData.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>User Activation Rate</h3>
            <p>{Math.round((reportData.activeUsers / reportData.totalUsers) * 100)}%</p>
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2>Interview Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Interviews</h3>
            <p>{reportData.totalInterviews}</p>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <p>{reportData.avgInterviewScore}%</p>
          </div>
          <div className="stat-card">
            <h3>Completion Rate</h3>
            <p>92%</p>
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2>Interviews by Month</h2>
        <div className="chart-container">
          {reportData.interviewsByMonth.map((item, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ height: `${(item.count / 40) * 100}%` }}
              ></div>
              <div className="bar-label">{item.month}</div>
              <div className="bar-value">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="report-section">
        <h2>User Roles Distribution</h2>
        <div className="distribution-chart">
          {reportData.userRoles.map((item, index) => (
            <div key={index} className="distribution-item">
              <div className="distribution-label">{item.role}</div>
              <div className="distribution-bar">
                <ProgressBar 
                  value={item.count} 
                  max={reportData.totalUsers} 
                  label={`${item.count} users`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="report-section">
        <h2>Interview Score Distribution</h2>
        <div className="distribution-chart">
          {reportData.interviewScores.map((item, index) => (
            <div key={index} className="distribution-item">
              <div className="distribution-label">{item.range}</div>
              <div className="distribution-bar">
                <ProgressBar 
                  value={item.count} 
                  max={reportData.totalInterviews} 
                  label={`${item.count} interviews`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="back-link">
        <Link to="/admin">&larr; Back to Admin Dashboard</Link>
      </div>
    </div>
  )
}

export default AdminReports