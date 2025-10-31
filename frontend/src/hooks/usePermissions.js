import { useAuth } from '../contexts/AuthContext'

/**
 * Custom hook for checking user permissions
 */
const usePermissions = () => {
  const { user } = useAuth()

  /**
   * Check if user can access a specific feature
   * @param {string} feature - Feature name to check access for
   * @returns {boolean} - True if user can access the feature
   */
  const canAccess = (feature) => {
    if (!user) return false

    // Define feature permissions by role
    const permissions = {
      admin: {
        'user-management': true,
        'system-settings': true,
        'reports': true,
        'interview-tools': true,
        'practice-mode': true
      },
      user: {
        'user-management': false,
        'system-settings': false,
        'reports': false,
        'interview-tools': true,
        'practice-mode': true
      }
    }

    return permissions[user.role]?.[feature] || false
  }

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} - True if user has the specified role
   */
  const hasRole = (role) => {
    return user?.role === role
  }

  /**
   * Check if user is an admin
   * @returns {boolean} - True if user is an admin
   */
  const isAdmin = () => {
    return hasRole('admin')
  }

  /**
   * Check if user is a regular user
   * @returns {boolean} - True if user is a regular user
   */
  const isUser = () => {
    return hasRole('user')
  }

  return {
    user,
    canAccess,
    hasRole,
    isAdmin,
    isUser
  }
}

export default usePermissions