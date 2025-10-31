import React from 'react'
import { Link } from 'react-router-dom'
import usePermissions from '../hooks/usePermissions'
import QuickStats from './QuickStats'

const DashboardOverview = () => {
  const { isAdmin, isUser } = usePermissions()

  if (isAdmin()) {
    return (
      <div className="dashboard-overview">
        <h2>Admin Dashboard Overview</h2>
        <QuickStats />
        <div className="overview-grid">
          <div className="overview-card">
            <h3>User Management</h3>
            <p>Manage users, roles, and permissions</p>
            <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
          </div>
          <div className="overview-card">
            <h3>System Settings</h3>
            <p>Configure system-wide settings</p>
            <Link to="/admin/settings" className="btn btn-primary">Configure</Link>
          </div>
          <div className="overview-card">
            <h3>Reports</h3>
            <p>Generate and view system reports</p>
            <Link to="/admin/reports" className="btn btn-primary">View Reports</Link>
          </div>
        </div>
      </div>
    )
  }

  if (isUser()) {
    return (
      <div className="dashboard-overview">
        <h2>User Dashboard Overview</h2>
        <QuickStats />
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Start Interview</h3>
            <p>Begin a new interview session</p>
            <button className="btn btn-primary">Start Now</button>
          </div>
          <div className="overview-card">
            <h3>Interview History</h3>
            <p>Review past interviews</p>
            <button className="btn btn-primary">View History</button>
          </div>
          <div className="overview-card">
            <h3>Practice Mode</h3>
            <p>Improve your interview skills</p>
            <button className="btn btn-primary">Practice</button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default DashboardOverview