import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UserAvatar from './UserAvatar'
import usePermissions from '../hooks/usePermissions'

const Navigation = () => {
  const { user, logout } = useAuth()
  const { canAccess } = usePermissions()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">AI Recruitment</Link>
      </div>
      
      <ul className="nav-links">
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
        <li>
          <Link to="/careers">Careers</Link>
        </li>
        {user ? (
          <>
            <li>
              <UserAvatar size="sm" showName={true} />
            </li>
            <li>
              <Link to={user.role === 'admin' ? '/admin' : '/user'}>
                Dashboard
              </Link>
            </li>
            {user.role === 'admin' && (
              <>
                <li>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
                <li>
                  <Link to="/admin/applications">Applications</Link>
                </li>
                {canAccess('user-management') && (
                  <li>
                    <Link to="/admin/users">Users</Link>
                  </li>
                )}
                {canAccess('reports') && (
                  <li>
                    <Link to="/admin/reports">Reports</Link>
                  </li>
                )}
                {canAccess('system-settings') && (
                  <li>
                    <Link to="/admin/settings">Settings</Link>
                  </li>
                )}
              </>
            )}
            {user.role === 'user' && (
              <>
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                  <Link to="/user/profile">Profile</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navigation