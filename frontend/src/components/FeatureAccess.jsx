import React from 'react'
import usePermissions from '../hooks/usePermissions'

const FeatureAccess = ({ feature, children }) => {
  const { canAccess } = usePermissions()

  // If user can access the feature, render children
  // Otherwise, render nothing or a message
  if (canAccess(feature)) {
    return children
  }

  return null
}

export default FeatureAccess