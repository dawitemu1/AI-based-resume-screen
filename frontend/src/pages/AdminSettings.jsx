import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'

const AdminSettings = () => {
  const { alert, showAlert, dismissAlert } = useAlert()
  
  const [settings, setSettings] = useState({
    siteName: 'AI Recruitment Platform',
    maxInterviewsPerDay: 10,
    autoDeleteInterviewsAfter: 30,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    defaultUserRole: 'user',
    maintenanceMode: false
  })

  const handleSaveSettings = () => {
    // In a real app, this would be an API call
    console.log('Saving settings:', settings)
    showAlert('success', 'Settings saved successfully')
  }

  const handleResetSettings = () => {
    // Reset to default settings
    setSettings({
      siteName: 'AI Recruitment Platform',
      maxInterviewsPerDay: 10,
      autoDeleteInterviewsAfter: 30,
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      defaultUserRole: 'user',
      maintenanceMode: false
    })
    showAlert('info', 'Settings reset to default values')
  }

  return (
    <div className="admin-settings">
      <header>
        <h1>System Settings</h1>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="siteName">Site Name:</label>
          <input
            id="siteName"
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({...settings, siteName: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxInterviewsPerDay">Max Interviews Per Day:</label>
          <input
            id="maxInterviewsPerDay"
            type="number"
            min="1"
            max="100"
            value={settings.maxInterviewsPerDay}
            onChange={(e) => setSettings({...settings, maxInterviewsPerDay: parseInt(e.target.value)})}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="autoDeleteInterviewsAfter">Auto-Delete Interviews After (days):</label>
          <input
            id="autoDeleteInterviewsAfter"
            type="number"
            min="1"
            max="365"
            value={settings.autoDeleteInterviewsAfter}
            onChange={(e) => setSettings({...settings, autoDeleteInterviewsAfter: parseInt(e.target.value)})}
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={settings.enableEmailNotifications}
              onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
            />
            Enable Email Notifications
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={settings.enableSMSNotifications}
              onChange={(e) => setSettings({...settings, enableSMSNotifications: e.target.checked})}
            />
            Enable SMS Notifications
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="defaultUserRole">Default User Role:</label>
          <select
            id="defaultUserRole"
            value={settings.defaultUserRole}
            onChange={(e) => setSettings({...settings, defaultUserRole: e.target.value})}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
            />
            Maintenance Mode
          </label>
        </div>
        
        <div className="settings-actions">
          <button className="btn-primary" onClick={handleSaveSettings}>
            Save Settings
          </button>
          <button className="btn-secondary" onClick={handleResetSettings}>
            Reset to Defaults
          </button>
        </div>
      </div>
      
      <div className="back-link">
        <Link to="/admin">&larr; Back to Admin Dashboard</Link>
      </div>
    </div>
  )
}

export default AdminSettings