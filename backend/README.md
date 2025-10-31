# AI-Powered Recruitment System - Backend

This is the backend service for an AI-powered recruitment platform that screens resumes based on job descriptions.

## Features

- Create and manage job postings
- Process candidate resumes
- AI-powered resume screening using transformer models
- Semantic similarity analysis between job descriptions and resumes
- Experience requirement evaluation
- Detailed scoring and recommendations
- User authentication and authorization

## Prerequisites

- Python 3.8+
- pip (Python package installer)

## Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

## Starting the Server

Run the FastAPI server using uvicorn:

```
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - Root endpoint

### Authentication
- `POST /auth/login` - Authenticate user and get access token
- `POST /auth/me` - Get current user information

### Job Management
- `POST /jobs/create` - Create a new job posting
- `GET /jobs/{job_id}` - Retrieve a job posting by ID
- `GET /jobs` - List all job postings

### Candidate Management
- `POST /candidates/profile` - Create a candidate profile with resume

### Resume Screening
- `POST /screen-resume/{job_id}` - Screen a candidate's resume against a job
- `GET /applications/{application_id}` - Get screening results for an application
- `GET /jobs/{job_id}/applications` - Get all applications for a job, sorted by match score in descending order

## Usage Examples

### 1. User Authentication

```bash
# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Get user info (use the token from login response)
curl -X POST "http://localhost:8000/auth/me" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=YOUR_ACCESS_TOKEN_HERE"
```

### 2. Create a Job Posting

```bash
curl -X POST "http://localhost:8000/jobs/create" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Senior Python Developer" \
  -d "description=We are looking for an experienced Python developer" \
  -d 'qualifications=["Bachelor's degree in Computer Science", "5+ years experience"]' \
  -d 'required_skills=["python", "django", "postgresql", "docker"]' \
  -d "experience_required=5+ years" \
  -d "location=Remote" \
  -d "salary_range=$90,000 - $120,000"
```

### 3. Create a Candidate Profile

```bash
curl -X POST "http://localhost:8000/candidates/profile" \
  -H "Content-Type: multipart/form-data" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "experience_years=7" \
  -F "education=Masters in Computer Science" \
  -F "resume_file=@path/to/resume.txt"
```

### 4. Screen a Resume Against a Job

```bash
curl -X POST "http://localhost:8000/screen-resume/JOB_ID_HERE" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "candidate_id=CANDIDATE_ID_HERE"
```

## How It Works

The system uses transformer-based natural language processing to analyze both job requirements and candidate resumes:

1. **Text Encoding**: Uses sentence-transformers to convert text into numerical embeddings
2. **Semantic Similarity**: Computes cosine similarity between job descriptions and candidate resumes
3. **Experience Evaluation**: Checks candidate experience against job requirements
4. **Keyword Analysis**: Identifies common keywords between job descriptions and resumes
5. **Scoring Algorithm**: Combines multiple factors for a comprehensive match score

## Applicant Ranking Methodology

For each job position (identified by JOB_ID), the system:
1. Compares all applicant CVs against that specific job description
2. Ranks applicants in descending order based on how well their CVs match the job description
3. Uses the job description as provided by the admin as the primary criteria for ranking candidates
4. Each job position is treated independently with its own ranking

## Scoring Methodology

The final score is calculated using a weighted approach:
- 70% Semantic similarity between job description and resume
- 20% Experience match
- 10% Keyword overlap

Scores are interpreted as:
- 80-100%: Highly Recommended
- 60-79%: Recommended
- 40-59%: Consider
- 0-39%: Not Recommended

## Technology Stack

- **FastAPI**: High performance Python web framework
- **Transformers**: Hugging Face library for state-of-the-art NLP
- **PyTorch**: Machine learning framework
- **Sentence Transformers**: For creating sentence embeddings
- **Uvicorn**: ASGI server for FastAPI
- **PyJWT**: For JSON Web Token authentication

## Model Information

The system uses `sentence-transformers/all-MiniLM-L6-v2`, a lightweight but effective model for sentence embeddings that provides a good balance between speed and accuracy.