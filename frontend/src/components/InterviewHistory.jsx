import React, { useState, useEffect } from 'react'
import ProgressBar from './ProgressBar'

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate fetching interview history
  useEffect(() => {
    const fetchInterviews = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setInterviews([
        {
          id: 1,
          date: '2023-06-15',
          duration: '45 min',
          score: 85,
          status: 'completed'
        },
        {
          id: 2,
          date: '2023-06-20',
          duration: '30 min',
          score: 72,
          status: 'in-progress'
        },
        {
          id: 3,
          date: '2023-06-25',
          duration: '60 min',
          score: 90,
          status: 'scheduled'
        }
      ])
      
      setLoading(false)
    }

    fetchInterviews()
  }, [])

  if (loading) {
    return <div className="interview-history">Loading interview history...</div>
  }

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in-progress': return 'text-yellow-600'
      case 'scheduled': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getScoreVariant = (score) => {
    if (score >= 90) return 'success'
    if (score >= 70) return 'primary'
    if (score >= 50) return 'warning'
    return 'danger'
  }

  return (
    <div className="interview-history">
      <h3>Interview History</h3>
      <div className="interview-list">
        {interviews.map(interview => (
          <div key={interview.id} className="interview-item">
            <div className="interview-header">
              <div className="interview-date">{interview.date}</div>
              <div className="interview-duration">{interview.duration}</div>
            </div>
            <div className="interview-score">Score: {interview.score}%</div>
            <ProgressBar 
              value={interview.score} 
              max={100} 
              variant={getScoreVariant(interview.score)} 
            />
            <div className={`interview-status ${getStatusColorClass(interview.status)}`}>
              {interview.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InterviewHistory