import { useState } from 'react'

/**
 * Custom hook for managing alert state
 */
const useAlert = () => {
  const [alert, setAlert] = useState(null)

  /**
   * Show an alert message
   * @param {string} type - Alert type (success, error, warning, info)
   * @param {string} message - Alert message
   */
  const showAlert = (type, message) => {
    setAlert({ type, message })
  }

  /**
   * Show a success alert
   * @param {string} message - Success message
   */
  const showSuccess = (message) => {
    showAlert('success', message)
  }

  /**
   * Show an error alert
   * @param {string} message - Error message
   */
  const showError = (message) => {
    showAlert('error', message)
  }

  /**
   * Show a warning alert
   * @param {string} message - Warning message
   */
  const showWarning = (message) => {
    showAlert('warning', message)
  }

  /**
   * Show an info alert
   * @param {string} message - Info message
   */
  const showInfo = (message) => {
    showAlert('info', message)
  }

  /**
   * Dismiss the current alert
   */
  const dismissAlert = () => {
    setAlert(null)
  }

  /**
   * Clear the current alert after a delay
   * @param {number} delay - Delay in milliseconds (default: 5000)
   */
  const autoDismiss = (delay = 5000) => {
    setTimeout(() => {
      dismissAlert()
    }, delay)
  }

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissAlert,
    autoDismiss
  }
}

export default useAlert