import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const UserAvatar = ({ size = 'md', showName = false }) => {
  const { user } = useAuth()
  
  if (!user) return null

  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg'
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const names = name.split(' ')
    const initials = names[0].charAt(0)
    if (names.length > 1) {
      return initials + names[names.length - 1].charAt(0)
    }
    return initials
  }

  return (
    <div className="user-avatar">
      <div className={`avatar ${sizeClasses[size]} ${user.role === 'admin' ? 'admin-avatar' : 'user-avatar-bg'}`}>
        {getInitials(user.name)}
      </div>
      {showName && (
        <span className="user-name">
          {user.name}
        </span>
      )}
    </div>
  )
}

export default UserAvatar