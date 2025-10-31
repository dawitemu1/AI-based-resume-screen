/**
 * Utility functions for user data manipulation
 */

/**
 * Format user name for display
 * @param {Object} user - User object
 * @returns {string} - Formatted user name
 */
export const formatUserName = (user) => {
  if (!user) return 'Unknown User'
  
  // If we have a name property, use it
  if (user.name) {
    return user.name
  }
  
  // If we have firstName and lastName, combine them
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  
  // If we only have firstName or lastName
  if (user.firstName) {
    return user.firstName
  }
  
  if (user.lastName) {
    return user.lastName
  }
  
  // Fallback to email
  if (user.email) {
    return user.email.split('@')[0]
  }
  
  // Final fallback
  return 'User'
}

/**
 * Get user initials for avatar
 * @param {Object} user - User object
 * @returns {string} - User initials
 */
export const getUserInitials = (user) => {
  const name = formatUserName(user)
  const parts = name.split(' ')
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Check if user is active
 * @param {Object} user - User object
 * @returns {boolean} - True if user is active
 */
export const isUserActive = (user) => {
  return user && user.status === 'active'
}

export default {
  formatUserName,
  getUserInitials,
  isUserActive
}