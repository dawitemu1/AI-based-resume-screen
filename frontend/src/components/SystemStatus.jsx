import React, { useState, useEffect } from 'react'

const SystemStatus = () => {
  const [status, setStatus] = useState('loading')
  const [lastChecked, setLastChecked] = useState(null)

  // Simulate checking system status
  useEffect(() => {
    const checkStatus = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Randomly determine status for demo purposes
        const statuses = ['operational', 'degraded', 'maintenance']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        setStatus(randomStatus)
        setLastChecked(new Date())
      }, 1000)
    }

    checkStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'operational': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'maintenance': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'operational': return 'Operational'
      case 'degraded': return 'Degraded'
      case 'maintenance': return 'Maintenance'
      default: return 'Checking...'
    }
  }

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString() : 'Never'
  }

  return (
    <div className="system-status">
      <div className="status-indicator">
        <span className={`status-dot ${status}`}></span>
        <span className={getStatusColor()}>{getStatusText()}</span>
      </div>
      <div className="status-info">
        Last checked: {formatTime(lastChecked)}
      </div>
    </div>
  )
}

export default SystemStatus