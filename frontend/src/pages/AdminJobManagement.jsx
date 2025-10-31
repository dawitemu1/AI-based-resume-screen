import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'
import './AdminJobManagement.css'

const AdminJobManagement = () => {
  const { alert, showAlert, dismissAlert } = useAlert()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    fetchJobsAndApplications()
  }, [])

  const fetchJobsAndApplications = async () => {
    try {
      setLoading(true)
      
      // Fetch comprehensive analytics overview
      const analyticsResponse = await api.get('/jobs/analytics/overview')
      const analyticsData = analyticsResponse.data
      
      // Transform analytics data for our component
      const jobsData = analyticsData.map(analytics => ({
        job_id: analytics.job_id,
        title: analytics.job_title,
        location: analytics.job_location,
        salary_range: analytics.job_salary_range,
        required_skills: analytics.required_skills,
        qualifications: analytics.qualifications,
        experience_required: analytics.experience_required,
        description: `${analytics.total_applications} applications received. Average match score: ${Math.round(analytics.average_score * 100)}%`
      }))
      
      const applicationsData = {}
      analyticsData.forEach(analytics => {
        applicationsData[analytics.job_id] = analytics.applications
      })
      
      setJobs(jobsData)
      setApplications(applicationsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching jobs and applications:', error)
      showAlert('error', 'Failed to load jobs and applications')
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50' // Green
    if (score >= 60) return '#FF9800' // Orange
    if (score >= 40) return '#FFC107' // Yellow
    return '#F44336' // Red
  }

  const getRecommendationBadge = (score) => {
    if (score >= 80) return { text: 'Highly Recommended', class: 'badge-success' }
    if (score >= 60) return { text: 'Recommended', class: 'badge-warning' }
    if (score >= 40) return { text: 'Consider', class: 'badge-info' }
    return { text: 'Not Recommended', class: 'badge-danger' }
  }

  const handleViewApplications = (job) => {
    setSelectedJob(job)
  }

  const closeApplicationsView = () => {
    setSelectedJob(null)
  }

  if (loading) {
    return (
      <div className="admin-job-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs and AI analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-job-management">
      <header className="page-header">
        <h1>Job Management & AI Analysis</h1>
        <p>Manage jobs and view AI-powered candidate analysis</p>
        <Link to="/admin/jobs/create" className="btn-primary">
          + Create New Job
        </Link>
      </header>

      <Alert alert={alert} onDismiss={dismissAlert} />

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No Jobs Created Yet</h3>
          <p>Create your first job posting to start receiving applications</p>
          <Link to="/admin/jobs/create" className="btn-primary">
            Create First Job
          </Link>
        </div>
      ) : (
        <div className="jobs-overview">
          <h2>Jobs Overview ({jobs.length} total)</h2>
          
          <div className="jobs-grid">
            {jobs.map(job => {
              const jobApplications = applications[job.job_id] || []
              const topCandidates = jobApplications
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
              
              return (
                <div key={job.job_id} className="job-overview-card">
                  <div className="job-header">
                    <div className="job-title-section">
                      <h3>{job.title}</h3>
                      <div className="job-id-badge">
                        ID: {job.job_id.substring(0, 8)}...
                      </div>
                    </div>
                    <span className="job-location">{job.location}</span>
                  </div>
                  
                  <div className="job-stats">
                    <div className="stat">
                      <span className="stat-number">{jobApplications.length}</span>
                      <span className="stat-label">Applications</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">
                        {jobApplications.filter(app => app.score >= 0.6).length}
                      </span>
                      <span className="stat-label">Qualified</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">
                        {jobApplications.filter(app => app.score >= 0.8).length}
                      </span>
                      <span className="stat-label">Highly Qualified</span>
                    </div>
                  </div>

                  <div className="job-requirements-summary">
                    <h4>Requirements:</h4>
                    <div className="requirements-tags">
                      <span className="req-tag">Exp: {job.experience_required}</span>
                      <span className="req-tag">Skills: {job.required_skills?.length || 0}</span>
                      <span className="req-tag">Quals: {job.qualifications?.length || 0}</span>
                    </div>
                  </div>

                  {topCandidates.length > 0 && (
                    <div className="top-candidates">
                      <h4>Top Candidates:</h4>
                      {topCandidates.map((candidate, index) => (
                        <div key={candidate.application_id} className="candidate-preview">
                          <div className="candidate-info">
                            <span className="candidate-name">
                              {candidate.candidate_name || `Candidate ${index + 1}`}
                            </span>
                            <span className="candidate-email">{candidate.email}</span>
                          </div>
                          <div className="candidate-score">
                            <div 
                              className="score-circle"
                              style={{ backgroundColor: getScoreColor(candidate.score * 100) }}
                            >
                              {Math.round(candidate.score * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="job-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => handleViewApplications(job)}
                      disabled={jobApplications.length === 0}
                    >
                      View All Applications ({jobApplications.length})
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Detailed Applications Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeApplicationsView}>
          <div className="applications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>Applications for {selectedJob.title}</h2>
                <div className="modal-job-id">
                  Job ID: {selectedJob.job_id}
                  <button 
                    className="copy-id-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedJob.job_id)
                      showAlert('success', 'Job ID copied to clipboard!')
                    }}
                    title="Copy Job ID"
                  >
                    📋
                  </button>
                </div>
              </div>
              <button className="modal-close" onClick={closeApplicationsView}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="job-details-summary">
                <div className="job-info">
                  <h3>Job Requirements Analysis</h3>
                  <div className="requirements-grid">
                    <div className="req-section">
                      <h4>Required Skills ({selectedJob.required_skills?.length || 0})</h4>
                      <div className="skills-list">
                        {selectedJob.required_skills?.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        )) || <span>No specific skills</span>}
                      </div>
                    </div>
                    
                    <div className="req-section">
                      <h4>Qualifications ({selectedJob.qualifications?.length || 0})</h4>
                      <div className="qualifications-list">
                        {selectedJob.qualifications?.map((qual, index) => (
                          <div key={index} className="qualification-item">• {qual}</div>
                        )) || <div>No specific qualifications</div>}
                      </div>
                    </div>
                    
                    <div className="req-section">
                      <h4>Experience & Details</h4>
                      <div className="details-list">
                        <div className="detail-item">Experience: {selectedJob.experience_required}</div>
                        <div className="detail-item">Location: {selectedJob.location}</div>
                        <div className="detail-item">Salary: {selectedJob.salary_range}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="applications-analysis">
                <h3>AI-Powered Candidate Analysis</h3>
                {applications[selectedJob.job_id]?.length > 0 ? (
                  <div className="candidates-table">
                    <div className="table-header">
                      <div className="col-rank">Rank</div>
                      <div className="col-candidate">Candidate</div>
                      <div className="col-score">AI Score</div>
                      <div className="col-skills">Skill Match</div>
                      <div className="col-experience">Experience</div>
                      <div className="col-recommendation">Recommendation</div>
                    </div>
                    
                    {applications[selectedJob.job_id]
                      .sort((a, b) => b.score - a.score)
                      .map((application, index) => {
                        const badge = getRecommendationBadge(application.score * 100)
                        return (
                          <div key={application.application_id} className="candidate-row">
                            <div className="col-rank">
                              <span className={`rank-badge ${index < 3 ? 'top-rank' : ''}`}>
                                #{index + 1}
                              </span>
                            </div>
                            
                            <div className="col-candidate">
                              <div className="candidate-details">
                                <div className="name">{application.candidate_name || 'Anonymous'}</div>
                                <div className="email">{application.email || 'No email'}</div>
                                <div className="candidate-meta">
                                  <span className="meta-item">Exp: {application.candidate_experience || 0} years</span>
                                  <span className="meta-item">Edu: {application.candidate_education || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-score">
                              <div className="score-container">
                                <div 
                                  className="score-bar"
                                  style={{ 
                                    width: `${application.score * 100}%`,
                                    backgroundColor: getScoreColor(application.score * 100)
                                  }}
                                ></div>
                                <span className="score-text">
                                  {Math.round(application.score * 100)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="col-skills">
                              <div className="skills-match">
                                {application.common_keywords?.slice(0, 2).map((keyword, idx) => (
                                  <span key={idx} className="matched-skill">{keyword}</span>
                                ))}
                                {application.common_keywords?.length > 2 && (
                                  <span className="more-skills">
                                    +{application.common_keywords.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="col-experience">
                              <div className="experience-match">
                                {Math.round((application.experience_match || 0) * 100)}%
                              </div>
                            </div>
                            
                            <div className="col-recommendation">
                              <span className={`recommendation-badge ${badge.class}`}>
                                {badge.text}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="no-applications">
                    <p>No applications received yet for this position.</p>
                    <p>Share the job posting to start receiving AI-analyzed applications.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminJobManagement