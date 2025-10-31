# AI-Powered Recruitment Platform - Frontend

This is the frontend for an AI-powered recruitment platform that allows administrators to create job postings and candidates to apply for positions. The system uses advanced artificial intelligence to screen resumes and rank candidates based on their match scores.

## Features

### For Administrators:
- Create and manage job postings with detailed requirements
- View all job applications for any position
- See candidates ranked by AI match scores in descending order
- Review detailed candidate matching analysis

### For Candidates:
- Browse available job listings
- Apply for positions by submitting resumes
- Get AI-powered matching scores for their applications

## New Components

### JobListings (`/jobs`)
Allows candidates to browse available positions and apply for jobs:
- View all job postings with detailed requirements
- Apply to jobs by submitting resume and personal information
- See AI-powered matching scores after application

### JobApplications (`/admin/applications`)
Allows administrators to view AI-screened applications for any job:
- Enter a Job ID to view all applications
- See candidates ranked by match score in descending order
- View detailed matching analysis including semantic similarity, experience match, and keyword overlap
- See hiring recommendations based on match scores

### Updated AdminJobManagement (`/admin/jobs`)
Enhanced job management with real backend integration:
- Create jobs with detailed requirements (title, description, qualifications, skills, etc.)
- Edit existing job postings
- Delete jobs
- View applications for specific jobs

## How to Use

1. **For Administrators:**
   - Navigate to Job Management to create job postings
   - Use the Applications page to view ranked candidates for any position
   - Review candidate matching scores and recommendations

2. **For Candidates:**
   - Browse job listings on the Job Listings page
   - Apply to positions by clicking "Apply Now" and submitting your resume
   - View your application status and matching scores

## Scoring Methodology

The AI-powered matching system calculates scores using the following weighted approach:
- 70% Semantic similarity between job description and resume
- 20% Experience match
- 10% Keyword overlap

Scores are interpreted as:
- 80-100%: Highly Recommended
- 60-79%: Recommended
- 40-59%: Consider
- 0-39%: Not Recommended

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:
- Job creation and management
- Candidate profile creation
- Resume screening and matching
- Application tracking and ranking

## Styling

The platform features a modern, professional design with CBE branding colors:
- Primary color: #4B0082 (CBE Purple)
- AI accent color: #A67C00 (Gold accent)
- Secondary color: #F8F4FF (Light purple tint)
- Admin color: #dc2626 (red)
- User color: #059669 (green)

The styling includes:
- Job cards with hover effects
- Color-coded recommendations based on match scores
- Progress bars for visual score representation
- Responsive grid layouts
- Modern navigation with gradient backgrounds
- Consistent AI-themed design elements throughout