import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setAuthError(null)
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      // Make API call to backend for authentication
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.access_token) {
        // Get user information using the token in the Authorization header
        const userResponse = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`
          }
        })
        
        const userData = userResponse.data
        const token = response.data.access_token
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        
        return { success: true, user: userData }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed'
      setAuthError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setAuthError(null)
  }

  const updateUser = (updatedUserData) => {
    try {
      const updatedUser = { ...user, ...updatedUserData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, message: 'Failed to update user data' }
    }
  }

  const value = {
    user,
    login,
    logout,
    loading,
    authError,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner message="Loading..." /> : children}
    </AuthContext.Provider>
  )
}