/**
 * Utility functions for role-based access control
 */

/**
 * Check if user has admin role
 * @param {Object} user - User object
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  return user && user.role === 'admin'
}

/**
 * Check if user has regular user role
 * @param {Object} user - User object
 * @returns {boolean} - True if user is regular user
 */
export const isUser = (user) => {
  return user && user.role === 'user'
}

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of allowed roles
 * @returns {boolean} - True if user has any of the specified roles
 */
export const hasRole = (user, roles) => {
  return user && roles.includes(user.role)
}

/**
 * Check if user is authenticated
 * @param {Object} user - User object
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = (user) => {
  return !!user
}

export default {
  isAdmin,
  isUser,
  hasRole,
  isAuthenticated
}