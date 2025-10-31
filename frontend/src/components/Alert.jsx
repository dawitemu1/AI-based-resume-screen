import React from 'react'
import './Alert.css'

const Alert = ({ alert, onDismiss }) => {
  if (!alert) {
    return null
  }

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  }

  return (
    <div className={`alert ${alertClasses[alert.type] || alertClasses.info}`}>
      <div className="flex items-center">
        <div className="flex-1">
          {alert.message}
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="alert-close"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert