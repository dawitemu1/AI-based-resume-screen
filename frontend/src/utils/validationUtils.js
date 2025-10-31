/**
 * Validates an email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' }
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  // Check for at least one digit
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  
  return { isValid: true, message: 'Password is strong' }
}

/**
 * Validates a username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' }
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' }
  }
  
  if (username.length > 20) {
    return { isValid: false, message: 'Username must be less than 20 characters' }
  }
  
  // Check for valid characters (alphanumeric and underscore only)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' }
  }
  
  return { isValid: true, message: 'Username is valid' }
}