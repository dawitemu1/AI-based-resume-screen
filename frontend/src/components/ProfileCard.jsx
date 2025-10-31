import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import UserAvatar from './UserAvatar'

const ProfileCard = () => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <UserAvatar size="lg" />
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p className="profile-email">{user.email}</p>
          <span className={`role-badge role-${user.role}`}>
            {user.role}
          </span>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <span className="detail-label">User ID:</span>
          <span className="detail-value">{user.id}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Status:</span>
          <span className="detail-value">
            <span className="status-active">Active</span>
          </span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Member since:</span>
          <span className="detail-value">June 2023</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard