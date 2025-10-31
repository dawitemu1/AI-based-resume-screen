import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'
import Modal from '../components/Modal'
import './JobListings.css'

const JobListings = () => {
  const { user } = useAuth()
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

  // Fetch all jobs
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

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setApplicationForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

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
      name: user?.name || '',
      email: user?.email || '',
      date_of_birth: '',
      experience_years: '',
      education: '',
      grade_8_certificate: '',
      education_certificate: ''
    })
  }

  const validateFile = (file, fileType) => {
    if (!file) return true
    
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      showAlert('error', `Please upload a PDF, TXT, JPG, or PNG file for ${fileType}`)
      return false
    }
    
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

    if (!educationCertFile) {
      showAlert('error', 'Education certificate document is required')
      return
    }

    if (!birthCertFile && !grade8CertFile) {
      showAlert('error', 'Please upload either birth certificate or grade 8 certificate')
      return
    }

    try {
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
      
      // Add certificate files
      if (birthCertFile) {
        formData.append('birth_certificate_file', birthCertFile)
      }
      if (grade8CertFile) {
        formData.append('grade_8_certificate_file', grade8CertFile)
      }
      if (educationCertFile) {
        formData.append('education_certificate_file', educationCertFile)
      }

      const candidateResponse = await api.post('/candidates/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const candidateId = candidateResponse.data.candidate_id

      // Then, screen the resume against the job
      const screenResponse = await api.post(`/screen-resume/${applyingJob.job_id}`, 
        new URLSearchParams({ candidate_id: candidateId }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      showAlert('success', 
        `🎉 Application submitted successfully! 
        
        🤖 AI ANALYSIS:
        📊 Match Score: ${screenResponse.data.match_percentage}%
        💡 Recommendation: ${screenResponse.data.recommendation}
        🔍 Detailed Analysis Available in Admin Panel
        
        Application ID: ${screenResponse.data.application_id}`
      )
      closeApplyModal()
      
      // Refresh jobs to show updated application status
      const response = await api.get('/jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Error submitting application:', error)
      showAlert('error', 'Failed to submit application. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <p>Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>Available Positions</h1>
        <p>Browse and apply for jobs that match your skills and experience</p>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      {jobs.length === 0 ? (
        <div className="card text-center">
          <p>No jobs available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.job_id} className="job-card">
              <div className="job-header">
                <h2>{job.title}</h2>
                <span className="job-location">{job.location}</span>
              </div>
              
              <div className="job-details">
                <p className="job-description">{job.description}</p>
                
                <div className="job-requirements">
                  <h3>Requirements:</h3>
                  <div className="requirement-items">
                    <div className="requirement-item"><strong>Experience:</strong> {job.experience_required}</div>
                    <div className="requirement-item"><strong>Salary Range:</strong> {job.salary_range}</div>
                  </div>
                
                  <h4>Required Skills:</h4>
                  <div className="skills-list">
                    {job.required_skills && job.required_skills.length > 0 ? (
                      job.required_skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span>No specific skills required</span>
                    )}
                  </div>
                
                  <h4>Qualifications:</h4>
                  <div className="qualification-items">
                    {job.qualifications && job.qualifications.length > 0 ? (
                      job.qualifications.map((qualification, index) => (
                        <div key={index} className="requirement-item">{qualification}</div>
                      ))
                    ) : (
                      <div className="requirement-item">No specific qualifications required</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="job-actions">
                <button 
                  className="btn-primary"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
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
              <label htmlFor="name">Full Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={applicationForm.name}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={applicationForm.email}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth:</label>
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
              <label htmlFor="experience_years">Years of Experience:</label>
              <input
                id="experience_years"
                type="number"
                name="experience_years"
                value={applicationForm.experience_years}
                onChange={handleFormChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="education">Education:</label>
              <input
                id="education"
                type="text"
                name="education"
                value={applicationForm.education}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="grade_8_certificate">Grade 8 Certificate:</label>
            <select
              id="grade_8_certificate"
              name="grade_8_certificate"
              value={applicationForm.grade_8_certificate}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="education_certificate">Education Certificate:</label>
            <select
              id="education_certificate"
              name="education_certificate"
              value={applicationForm.education_certificate}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Certificate</option>
              <option value="high_school">High School</option>
              <option value="associate">Associate Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD/Doctorate</option>
              <option value="professional">Professional Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="resume">Upload Resume (TXT or PDF):</label>
            <input
              id="resume"
              type="file"
              accept=".txt,.pdf"
              onChange={handleResumeFileChange}
              required
            />
          </div>

          <div className="certificates-section">
            <h4>📋 Required Documents</h4>
            
            <div className="form-group">
              <label htmlFor="education_certificate_file">Education Certificate:</label>
              <input
                id="education_certificate_file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleEducationCertFileChange}
                required
              />
              <small>Required - Upload your education certificate</small>
            </div>

            <div className="identity-documents">
              <h5>Identity Verification (Choose One):</h5>
              <p>Upload either birth certificate OR grade 8 certificate</p>
              
              <div className="form-group">
                <label htmlFor="birth_certificate">Birth Certificate:</label>
                <input
                  id="birth_certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleBirthCertFileChange}
                />
                {birthCertFile && <small style={{color: 'green'}}>✓ Birth certificate selected</small>}
              </div>

              <div className="form-group">
                <label htmlFor="grade_8_certificate_file">Grade 8 Certificate:</label>
                <input
                  id="grade_8_certificate_file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleGrade8CertFileChange}
                />
                {grade8CertFile && <small style={{color: 'green'}}>✓ Grade 8 certificate selected</small>}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <button type="button" className="btn btn-secondary" onClick={closeApplyModal}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default JobListings