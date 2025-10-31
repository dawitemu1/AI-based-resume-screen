import React, { useState, useEffect } from 'react'
import api from '../services/api'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'
import ProgressBar from '../components/ProgressBar'

const JobApplications = () => {
  const { alert, showAlert, dismissAlert } = useAlert()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState('')

  // Fetch job applications when jobId changes
  useEffect(() => {
    if (!jobId) return

    const fetchJobAndApplications = async () => {
      try {
        setLoading(true)
        
        // Fetch job details
        const jobResponse = await api.get(`/jobs/${jobId}`)
        setJob(jobResponse.data)
        
        // Fetch applications for this job
        const appsResponse = await api.get(`/jobs/${jobId}/applications`)
        setApplications(appsResponse.data)
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching job applications:', error)
        showAlert('error', 'Failed to load job applications')
        setLoading(false)
      }
    }

    fetchJobAndApplications()
  }, [jobId])

  const handleJobIdChange = (e) => {
    setJobId(e.target.value)
  }

  const handleLoadApplications = () => {
    if (jobId) {
      // Trigger the useEffect by updating state
    }
  }

  const getRecommendationColor = (score) => {
    if (score >= 0.8) return 'high'
    if (score >= 0.6) return 'good'
    if (score >= 0.4) return 'fair'
    return 'poor'
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <p>Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>AI-Screened Candidate Applications</h1>
        <p>View candidates ranked by matching score in descending order</p>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      <div className="card">
        <div className="form-group">
          <label htmlFor="job-id">Enter Job ID to view applications:</label>
          <div className="input-group">
            <input
              id="job-id"
              type="text"
              value={jobId}
              onChange={handleJobIdChange}
              placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
            />
            <button 
              className="btn"
              onClick={handleLoadApplications}
            >
              Load Applications
            </button>
          </div>
        </div>
      </div>
      
      {job && (
        <div className="card">
          <h2>{job.title}</h2>
          <p><strong>Location:</strong> {job.location}</p>
          <div className="job-requirements">
            <h3>Job Requirements</h3>
            <div className="requirements-grid">
              <div className="requirement-section">
                <h4>Required Skills</h4>
                <div className="skills-container">
                  {job.required_skills && job.required_skills.length > 0 ? (
                    job.required_skills.map((skill, index) => (
                      <div key={index} className="requirement-item">{skill}</div>
                    ))
                  ) : (
                    <div className="requirement-item">No specific skills required</div>
                  )}
                </div>
              </div>
              <div className="requirement-section">
                <h4>Qualifications</h4>
                <div className="qualifications-container">
                  {job.qualifications && job.qualifications.length > 0 ? (
                    job.qualifications.map((qual, index) => (
                      <div key={index} className="requirement-item">{qual}</div>
                    ))
                  ) : (
                    <div className="requirement-item">No specific qualifications required</div>
                  )}
                </div>
              </div>
              <div className="requirement-section">
                <h4>Experience Required</h4>
                <div className="experience-container">
                  <div className="requirement-item">{job.experience_required || 'Not specified'}</div>
                </div>
              </div>
            </div>
            <div className="job-description">
              <h4>Job Description</h4>
              <p>{job.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {applications.length > 0 ? (
        <div className="card">
          <h3>Candidates Ranked by Match Score</h3>
          <div className="table">
            <div className="table-header">
              <div className="rank-col">#</div>
              <div className="candidate-col">Candidate</div>
              <div className="score-col">Match Score</div>
              <div className="skills-col">Key Skills</div>
              <div className="qualifications-col">Experience</div>
              <div className="recommendation-col">Recommendation</div>
            </div>
            
            {applications.map((application, index) => (
              <div key={application.application_id} className="application-row">
                <div className="rank-col">{index + 1}</div>
                <div className="candidate-col">
                  <div className="candidate-name">{application.candidate_name || application.candidate_id}</div>
                  <div className="candidate-email">Email: {application.email || 'N/A'}</div>
                </div>
                <div className="score-col">
                  <div className="score-value">{Math.round(application.score * 100)}%</div>
                  <ProgressBar percentage={application.score * 100} />
                </div>
                <div className="skills-col">
                  {application.common_keywords && application.common_keywords.slice(0, 3).map((keyword, idx) => (
                    <span key={idx} className="skill-tag">{keyword}</span>
                  ))}
                  {application.common_keywords && application.common_keywords.length > 3 && (
                    <span className="more-skills">+{application.common_keywords.length - 3} more</span>
                  )}
                </div>
                <div className="qualifications-col">
                  <span className="qualification-tag">Exp: {application.experience_match ? Math.round(application.experience_match * 100) : 0}%</span>
                </div>
                <div className="recommendation-col">
                  <span className={`recommendation ${getRecommendationColor(application.score)}`}>
                    {application.score >= 0.8 ? 'Highly Recommended' : 
                     application.score >= 0.6 ? 'Recommended' : 
                     application.score >= 0.4 ? 'Consider' : 'Not Recommended'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : jobId && !loading ? (
        <div className="card text-center">
          <p>No applications found for this job. Candidates may not have applied yet.</p>
        </div>
      ) : (
        <div className="card text-center">
          <p>Enter a Job ID above to view AI-screened candidate applications ranked by match score.</p>
        </div>
      )}
    </div>
  )
}

export default JobApplications