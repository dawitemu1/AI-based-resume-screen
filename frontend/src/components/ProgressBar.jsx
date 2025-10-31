import React from 'react'

const ProgressBar = ({ value, max = 100, label = '', variant = 'primary' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const variantClasses = {
    primary: 'progress-fill-primary',
    success: 'progress-fill-success',
    warning: 'progress-fill-warning',
    danger: 'progress-fill-danger'
  }

  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-track">
        <div 
          className={`progress-fill ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar