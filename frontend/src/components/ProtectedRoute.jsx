import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />
  }

  // If specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute