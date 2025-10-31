import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import UserProfile from '../components/UserProfile'
import usePermissions from '../hooks/usePermissions'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { canAccess } = usePermissions()
  const navigate = useNavigate()
  const { alert, showAlert, dismissAlert } = useAlert()
  
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showSystemMaintenanceDialog, setShowSystemMaintenanceDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user'
  })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleAddUser = () => {
    // In a real app, this would be an API call
    console.log('Adding user:', newUser)
    setShowAddUserModal(false)
    setNewUser({ name: '', email: '', role: 'user' })
    showAlert('success', 'User added successfully')
  }

  const handleSystemMaintenance = () => {
    // In a real app, this would trigger system maintenance
    console.log('Performing system maintenance')
    setShowSystemMaintenanceDialog(false)
    showAlert('success', 'System maintenance initiated')
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      <div className="card">
        <div className="card-header">
          <h2>Quick Navigation</h2>
        </div>
        <div className="grid">
          {canAccess('user-management') && (
            <Link to="/admin/users" className="btn">User Management</Link>
          )}
          <Link to="/admin/jobs" className="btn">Job Management</Link>
          {canAccess('reports') && (
            <Link to="/admin/reports" className="btn">Reports</Link>
          )}
          {canAccess('system-settings') && (
            <Link to="/admin/settings" className="btn">Settings</Link>
          )}
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2>System Overview</h2>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Total Users</h3>
            <p className="text-center" style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>124</p>
          </div>
          <div className="card">
            <h3>Active Sessions</h3>
            <p className="text-center" style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>12</p>
          </div>
          <div className="card">
            <h3>Processed Applications</h3>
            <p className="text-center" style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>87</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="grid">
          {canAccess('user-management') && (
            <button className="btn" onClick={() => setShowAddUserModal(true)}>
              Add New User
            </button>
          )}
          <button className="btn" onClick={() => navigate('/admin/jobs')}>
            Manage Jobs
          </button>
          {canAccess('reports') && (
            <button className="btn">
              Generate Report
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => setShowSystemMaintenanceDialog(true)}>
            System Maintenance
          </button>
        </div>
      </div>
      
      {/* Add User Modal */}
      <Modal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleAddUser()
        }}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Add User
            </button>
          </div>
        </form>
      </Modal>
      
      {/* System Maintenance Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSystemMaintenanceDialog}
        onClose={() => setShowSystemMaintenanceDialog(false)}
        onConfirm={handleSystemMaintenance}
        title="System Maintenance"
        message="Are you sure you want to initiate system maintenance? This may temporarily affect system performance."
        confirmText="Proceed"
        cancelText="Cancel"
      />
    </div>
  )
}

export default AdminDashboard