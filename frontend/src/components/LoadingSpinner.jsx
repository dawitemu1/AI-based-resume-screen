import React from 'react'

const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  }
  
  const spinnerClasses = `spinner ${sizeClasses[size]}`

  return (
    <div className="loading-spinner">
      <div className={spinnerClasses}></div>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}

export default LoadingSpinner