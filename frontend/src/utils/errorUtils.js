/**
 * Utility functions for error handling
 */

/**
 * Format API error message
 * @param {Object} error - Error object
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  if (!error) {
    return 'An unknown error occurred'
  }
  
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error
  }
  
  // Handle axios error responses
  if (error.response) {
    // Server responded with error status
    if (error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    
    if (error.response.data && error.response.data.error) {
      return error.response.data.error
    }
    
    return `Server error: ${error.response.status}`
  }
  
  // Handle network errors
  if (error.request) {
    return 'Network error - please check your connection'
  }
  
  // Handle other errors
  if (error.message) {
    return error.message
  }
  
  return 'An error occurred'
}

/**
 * Handle API error with user-friendly message
 * @param {Object} error - Error object
 * @param {Function} setError - Function to set error state
 * @param {Function} setAlert - Function to set alert state (optional)
 */
export const handleApiError = (error, setError, setAlert = null) => {
  const message = formatApiError(error)
  setError(message)
  
  if (setAlert) {
    setAlert({
      type: 'error',
      message: message
    })
  }
  
  // Log error for debugging
  console.error('API Error:', error)
}

export default {
  formatApiError,
  handleApiError
}