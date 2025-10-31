import React, { useState, useEffect } from 'react'
import api from '../services/api'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'
import Modal from '../components/Modal'
import './JobListings.css'

const PublicJobListings = () => {
  const { alert, showAlert, dismissAlert } = useAlert()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [applyingJob, setApplyingJob] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [birthCertFile, setBirthCertFile] = useState(null)
  const [grade8CertFile, setGrade8CertFile] = useState(null)
  const [educationCertFile, setEducationCertFile] = useState(null)
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    date_of_birth: '',
    experience_years: '',
    education: '',
    grade_8_certificate: '',
    education_certificate: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Fetch all jobs (public endpoint)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs')
        setJobs(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        showAlert('error', 'Failed to load job listings')
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleApplyClick = (job) => {
    setApplyingJob(job)
  }

  const closeApplyModal = () => {
    setApplyingJob(null)
    setResumeFile(null)
    setBirthCertFile(null)
    setGrade8CertFile(null)
    setEducationCertFile(null)
    setApplicationForm({
      name: '',
      email: '',
      date_of_birth: '',
      experience_years: '',
      education: '',
      grade_8_certificate: '',
      education_certificate: ''
    })
  }

  const validateFile = (file, fileType) => {
    if (!file) return true
    
    // Check file type
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      showAlert('error', `Please upload a PDF, TXT, JPG, or PNG file for ${fileType}`)
      return false
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showAlert('error', `File size must be less than 10MB for ${fileType}`)
      return false
    }
    
    return true
  }

  const handleResumeFileChange = (e) => {
    const file = e.target.files[0]
    if (validateFile(file, 'resume')) {
      setResumeFile(file)
    }
  }

  const handleBirthCertFileChange = (e) => {
    const file = e.target.files[0]
    if (validateFile(file, 'birth certificate')) {
      setBirthCertFile(file)
    }
  }

  const handleGrade8CertFileChange = (e) => {
    const file = e.target.files[0]
    if (validateFile(file, 'grade 8 certificate')) {
      setGrade8CertFile(file)
    }
  }

  const handleEducationCertFileChange = (e) => {
    const file = e.target.files[0]
    if (validateFile(file, 'education certificate')) {
      setEducationCertFile(file)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    
    if (!resumeFile) {
      showAlert('error', 'Please upload your resume')
      return
    }

    if (!applicationForm.name || !applicationForm.email || !applicationForm.date_of_birth || 
        !applicationForm.experience_years || !applicationForm.education || 
        !applicationForm.grade_8_certificate || !applicationForm.education_certificate) {
      showAlert('error', 'Please fill in all required fields')
      return
    }

    // Validate required documents
    if (!educationCertFile) {
      showAlert('error', 'Education certificate document is required')
      return
    }

    // Validate that at least one identity document is provided
    if (!birthCertFile && !grade8CertFile) {
      showAlert('error', 'Please upload either birth certificate or grade 8 certificate')
      return
    }

    setSubmitting(true)

    try {
      console.log('Starting application submission...')
      console.log('Form data:', applicationForm)
      console.log('Resume file:', resumeFile ? resumeFile.name : 'No file')
      
      // First, create candidate profile
      const formData = new FormData()
      formData.append('name', applicationForm.name)
      formData.append('email', applicationForm.email)
      formData.append('date_of_birth', applicationForm.date_of_birth)
      formData.append('experience_years', applicationForm.experience_years)
      formData.append('education', applicationForm.education)
      formData.append('grade_8_certificate', applicationForm.grade_8_certificate)
      formData.append('education_certificate', applicationForm.education_certificate)
      formData.append('resume_file', resumeFile)
      
      // Add certificate files if provided
      if (birthCertFile) {
        formData.append('birth_certificate_file', birthCertFile)
      }
      if (grade8CertFile) {
        formData.append('grade_8_certificate_file', grade8CertFile)
      }
      if (educationCertFile) {
        formData.append('education_certificate_file', educationCertFile)
      }

      console.log('Creating candidate profile...')
      const candidateResponse = await api.post('/candidates/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Candidate response:', candidateResponse.status, candidateResponse.data)
      const candidateId = candidateResponse.data.candidate_id
      console.log('Candidate created with ID:', candidateId)

      // Then, screen the resume against the job
      console.log('Screening resume for job:', applyingJob.job_id)
      const screenData = new URLSearchParams()
      screenData.append('candidate_id', candidateId)

      console.log('Sending screening request...')
      const screenResponse = await api.post(`/screen-resume/${applyingJob.job_id}`, screenData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log('Screening response:', screenResponse.status, screenResponse.data)

      const matchPercentage = screenResponse.data.match_percentage
      const recommendation = screenResponse.data.recommendation

      showAlert('success', 
        `🎉 Application submitted successfully! 
        
        🤖 AI ANALYSIS RESULTS:
        📊 Overall Match Score: ${matchPercentage}%
        💡 AI Recommendation: ${recommendation}
        🔍 Skill Match: ${Math.round((screenResponse.data.semantic_similarity || 0) * 100)}%
        💼 Experience Match: ${Math.round((screenResponse.data.experience_match || 0) * 100)}%
        🔗 Keyword Overlap: ${Math.round((screenResponse.data.keyword_overlap || 0) * 100)}%
        
        🆔 Application ID: ${screenResponse.data.application_id}
        
        Your application has been analyzed by our AI system. Thank you for applying!`
      )
      
      closeApplyModal()
      
    } catch (error) {
      console.error('Error submitting application:', error)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      let errorMessage = 'Unknown error occurred'
      
      if (error.response?.status === 404) {
        errorMessage = 'Job or candidate not found. Please try again.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again in a few moments.'
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showAlert('error', `Failed to submit application: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading available positions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>Career Opportunities</h1>
        <p>Join our team! Browse available positions and apply with your resume</p>
        
        <div className="job-id-info">
          <p className="job-id-note">
            💡 <strong>Need a Job ID?</strong> Each job has a unique ID shown below the job title. 
            You can use this ID to reference the position when contacting us.
          </p>
        </div>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      {jobs.length === 0 ? (
        <div className="card text-center">
          <h3>No Open Positions</h3>
          <p>We don't have any open positions at the moment, but we're always looking for talented individuals. Please check back later or send us your resume for future opportunities.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.job_id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h2>{job.title}</h2>
                  <div className="job-id-public">
                    Job ID: {job.job_id}
                  </div>
                </div>
                <span className="job-location">{job.location}</span>
              </div>
              
              <div className="job-details">
                <p className="job-description">{job.description}</p>
                
                <div className="job-requirements">
                  <h3>What We Offer:</h3>
                  <div className="requirement-items">
                    <div className="requirement-item">
                      <strong>💰 Salary:</strong> {job.salary_range}
                    </div>
                    <div className="requirement-item">
                      <strong>📍 Location:</strong> {job.location}
                    </div>
                    <div className="requirement-item">
                      <strong>⏰ Experience Level:</strong> {job.experience_required}
                    </div>
                  </div>
                
                  <h4>Required Skills:</h4>
                  <div className="skills-list">
                    {job.required_skills && job.required_skills.length > 0 ? (
                      job.required_skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag">No specific skills required</span>
                    )}
                  </div>
                
                  <h4>Qualifications:</h4>
                  <div className="qualification-items">
                    {job.qualifications && job.qualifications.length > 0 ? (
                      job.qualifications.map((qualification, index) => (
                        <div key={index} className="requirement-item">
                          ✓ {qualification}
                        </div>
                      ))
                    ) : (
                      <div className="requirement-item">✓ No specific qualifications required</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="job-actions">
                <button 
                  className="btn-primary"
                  onClick={() => handleApplyClick(job)}
                >
                  🚀 Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Application Modal */}
      <Modal 
        isOpen={!!applyingJob} 
        onClose={closeApplyModal}
        title={`Apply for ${applyingJob?.title}`}
      >
        <form onSubmit={handleApplicationSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={applicationForm.name}
                onChange={handleFormChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={applicationForm.email}
                onChange={handleFormChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth *</label>
            <input
              id="date_of_birth"
              type="date"
              name="date_of_birth"
              value={applicationForm.date_of_birth}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience_years">Years of Experience *</label>
              <input
                id="experience_years"
                type="number"
                name="experience_years"
                value={applicationForm.experience_years}
                onChange={handleFormChange}
                min="0"
                max="50"
                placeholder="e.g., 5"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="education">Education Background *</label>
              <input
                id="education"
                type="text"
                name="education"
                value={applicationForm.education}
                onChange={handleFormChange}
                placeholder="e.g., Bachelor's in Computer Science"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="grade_8_certificate">Grade 8 Certificate Status *</label>
            <select
              id="grade_8_certificate"
              name="grade_8_certificate"
              value={applicationForm.grade_8_certificate}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Grade 8 Certificate Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="education_certificate">Education Certificate *</label>
            <select
              id="education_certificate"
              name="education_certificate"
              value={applicationForm.education_certificate}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Education Certificate</option>
              <option value="high_school">High School Diploma</option>
              <option value="associate">Associate Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD/Doctorate</option>
              <option value="professional">Professional Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="resume">Upload Resume *</label>
            <div className="file-upload-area">
              <input
                id="resume"
                type="file"
                accept=".txt,.pdf"
                onChange={handleResumeFileChange}
                required
              />
              <label htmlFor="resume" className="file-upload-label">
                <span className="upload-icon">📄</span>
                <span className="upload-text">
                  {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                </span>
                <span className="upload-subtext">
                  Supported formats: TXT, PDF (Max 10MB)
                </span>
              </label>
            </div>
          </div>

          <div className="certificates-section">
            <h4>📋 Required Documents</h4>
            <p className="certificates-note">Please upload the following documents to complete your application</p>
            
            <div className="form-group">
              <label htmlFor="education_certificate_file">Education Certificate *</label>
              <div className="file-upload-area">
                <input
                  id="education_certificate_file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleEducationCertFileChange}
                  required
                />
                <label htmlFor="education_certificate_file" className="file-upload-label">
                  <span className="upload-icon">🏆</span>
                  <span className="upload-text">
                    {educationCertFile ? educationCertFile.name : 'Upload education certificate (Required)'}
                  </span>
                  <span className="upload-subtext">
                    PDF, JPG, PNG (Max 10MB) - Required
                  </span>
                </label>
              </div>
            </div>

            <div className="identity-documents">
              <h5>Identity Verification (Choose One) *</h5>
              <p className="identity-note">Upload either your birth certificate OR grade 8 certificate</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birth_certificate">
                    Birth Certificate 
                    {birthCertFile && <span className="selected-badge">✓ Selected</span>}
                  </label>
                  <div className="file-upload-area">
                    <input
                      id="birth_certificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleBirthCertFileChange}
                    />
                    <label htmlFor="birth_certificate" className="file-upload-label">
                      <span className="upload-icon">🆔</span>
                      <span className="upload-text">
                        {birthCertFile ? birthCertFile.name : 'Upload birth certificate'}
                      </span>
                      <span className="upload-subtext">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="or-divider">
                  <span>OR</span>
                </div>

                <div className="form-group">
                  <label htmlFor="grade_8_certificate_file">
                    Grade 8 Certificate
                    {grade8CertFile && <span className="selected-badge">✓ Selected</span>}
                  </label>
                  <div className="file-upload-area">
                    <input
                      id="grade_8_certificate_file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleGrade8CertFileChange}
                    />
                    <label htmlFor="grade_8_certificate_file" className="file-upload-label">
                      <span className="upload-icon">🎓</span>
                      <span className="upload-text">
                        {grade8CertFile ? grade8CertFile.name : 'Upload grade 8 certificate'}
                      </span>
                      <span className="upload-subtext">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <button type="button" className="btn btn-secondary" onClick={closeApplyModal}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PublicJobListings