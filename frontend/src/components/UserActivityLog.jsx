import React, { useState, useEffect } from 'react'

const UserActivityLog = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate fetching user activities
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchActivities = () => {
      // Simulated activity data
      const activityData = [
        { id: 1, user: 'John Doe', action: 'Logged in', timestamp: '2023-06-15 09:30:22' },
        { id: 2, user: 'Jane Smith', action: 'Started interview', timestamp: '2023-06-15 10:15:45' },
        { id: 3, user: 'Admin User', action: 'Created new user', timestamp: '2023-06-15 11:22:10' },
        { id: 4, user: 'John Doe', action: 'Completed interview', timestamp: '2023-06-15 12:45:33' },
        { id: 5, user: 'Jane Smith', action: 'Logged out', timestamp: '2023-06-15 14:20:18' },
      ]
      
      setActivities(activityData)
      setLoading(false)
    }

    fetchActivities()
  }, [])

  if (loading) {
    return <div className="activity-log">Loading activities...</div>
  }

  return (
    <div className="activity-log">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-user">{activity.user}</div>
            <div className="activity-action">{activity.action}</div>
            <div className="activity-time">{activity.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserActivityLog