import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminUserManagement from './pages/AdminUserManagement'
import AdminSettings from './pages/AdminSettings'
import AdminReports from './pages/AdminReports'
import AdminJobManagement from './pages/AdminJobManagement'
import AdminJobCreation from './pages/AdminJobCreation'
import UserDashboard from './pages/UserDashboard'
import JobListings from './pages/JobListings'
import JobApplications from './pages/JobApplications'
import Gallery from './pages/Gallery'
import PublicJobListings from './pages/PublicJobListings'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/careers" element={<PublicJobListings />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUserManagement /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
              <Route path="/admin/jobs" element={<ProtectedRoute requiredRole="admin"><AdminJobManagement /></ProtectedRoute>} />
              <Route path="/admin/jobs/create" element={<ProtectedRoute requiredRole="admin"><AdminJobCreation /></ProtectedRoute>} />
              <Route path="/admin/applications" element={<ProtectedRoute requiredRole="admin"><JobApplications /></ProtectedRoute>} />
              <Route path="/user" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute requiredRole="user"><JobListings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App