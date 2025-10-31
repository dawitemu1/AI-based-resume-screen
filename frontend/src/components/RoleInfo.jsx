import React from 'react'
import usePermissions from '../hooks/usePermissions'

const RoleInfo = () => {
  const { user, isAdmin, isUser } = usePermissions()

  if (!user) {
    return null
  }

  return (
    <div className="role-info">
      <div className="role-card">
        <p>
          You are logged in as <strong>{user.name}</strong> with{' '}
          <span className={`role-badge role-${user.role}`}>
            {user.role}
          </span> privileges.
        </p>
        <p>
          {isAdmin() 
            ? "You have full access to all system features." 
            : "You have limited access to interview tools."}
        </p>
      </div>
    </div>
  )
}

export default RoleInfo