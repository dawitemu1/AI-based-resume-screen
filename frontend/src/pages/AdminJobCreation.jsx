import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'
import api from '../services/api'
import './AdminJobCreation.css'

const AdminJobCreation = () => {
  const navigate = useNavigate()
  const { alert, showAlert, dismissAlert } = useAlert()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualifications: '',
    required_skills: '',
    experience_required: '',
    location: '',
    salary_range: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    dismissAlert()
    
    try {
      console.log('Submitting job creation form...', formData)
      
      // Validate required fields
      if (!formData.title || !formData.description || !formData.qualifications || 
          !formData.required_skills || !formData.experience_required || 
          !formData.location || !formData.salary_range) {
        showAlert('error', 'Please fill in all required fields')
        setLoading(false)
        return
      }
      
      // Prepare form data for submission
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      
      // Process qualifications and skills
      const qualificationsList = formData.qualifications.split(';').map(q => q.trim()).filter(q => q)
      const skillsList = formData.required_skills.split(',').map(s => s.trim()).filter(s => s)
      
      submitData.append('qualifications', JSON.stringify(qualificationsList))
      submitData.append('required_skills', JSON.stringify(skillsList))
      submitData.append('experience_required', formData.experience_required)
      submitData.append('location', formData.location)
      submitData.append('salary_range', formData.salary_range)
      
      console.log('Sending data to API...')
      const response = await api.post('/jobs/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('Job creation response:', response.data)
      const jobId = response.data.job_id
      showAlert('success', 
        `🎉 Job created successfully! 
        
        📋 Job Title: ${formData.title}
        🆔 Job ID: ${jobId}
        
        Copy this Job ID to share with candidates or for reference.`
      )
      
      // Show job ID in a more prominent way
      setJobId(jobId)
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        qualifications: '',
        required_skills: '',
        experience_required: '',
        location: '',
        salary_range: ''
      })
      
      // Navigate to job management page after a longer delay to show job ID
      setTimeout(() => {
        navigate('/admin/jobs')
      }, 5000)
    } catch (error) {
      console.error('Error creating job:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error occurred'
      showAlert('error', `Failed to create job: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-job-creation">
      <header>
        <h1>Create New Job</h1>
        <p>Auto-generated Job ID will be assigned upon creation</p>
      </header>
      
      <Alert alert={alert} onDismiss={dismissAlert} />
      
      {jobId && (
        <div className="job-id-display">
          <h3>✅ Job Created Successfully!</h3>
          <div className="job-id-container">
            <label>Job ID (Copy this for reference):</label>
            <div className="job-id-value">
              <input 
                type="text" 
                value={jobId} 
                readOnly 
                className="job-id-input"
                onClick={(e) => e.target.select()}
              />
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(jobId)
                  showAlert('success', 'Job ID copied to clipboard!')
                }}
              >
                📋 Copy
              </button>
            </div>
            <p className="job-id-note">
              Share this Job ID with candidates or use it to view applications.
            </p>
          </div>
        </div>
      )}
      
      <div className="job-creation-form-container">
        <form onSubmit={handleSubmit} className="job-creation-form">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Detailed job description including responsibilities, duties, and expectations..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="qualifications">Qualifications *</label>
            <input
              id="qualifications"
              name="qualifications"
              type="text"
              value={formData.qualifications}
              onChange={handleChange}
              required
              placeholder="Separate qualifications with semicolons (e.g., Bachelor's degree in Computer Science; 5+ years experience)"
            />
            <small className="form-help-text">Separate multiple qualifications with semicolons (;)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="required_skills">Required Skills *</label>
            <input
              id="required_skills"
              name="required_skills"
              type="text"
              value={formData.required_skills}
              onChange={handleChange}
              required
              placeholder="e.g., Python, React, SQL, Docker"
            />
            <small className="form-help-text">Separate multiple skills with commas (,)</small>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience_required">Experience Required *</label>
              <input
                id="experience_required"
                name="experience_required"
                type="text"
                value={formData.experience_required}
                onChange={handleChange}
                required
                placeholder="e.g., 5+ years"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., New York, NY"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="salary_range">Salary Range *</label>
            <input
              id="salary_range"
              name="salary_range"
              type="text"
              value={formData.salary_range}
              onChange={handleChange}
              required
              placeholder="e.g., $90,000 - $120,000"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/jobs')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating Job...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="back-link">
        <Link to="/admin/jobs">&larr; Back to Job Management</Link>
      </div>
    </div>
  )
}

export default AdminJobCreation