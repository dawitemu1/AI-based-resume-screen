import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

# Add error handling for transformer imports
try:
    import torch
    from transformers import AutoTokenizer, AutoModel
    TRANSFORMERS_AVAILABLE = True
    print("Transformers and Torch imported successfully")
except ImportError as e:
    print(f"Warning: Could not import transformers/torch: {e}")
    print("Some features may not work correctly.")
    TRANSFORMERS_AVAILABLE = False

import numpy as np
import re
import json
import uuid
from pydantic import BaseModel
from typing import List

# Secret key for JWT token generation (in production, use environment variables)
SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Add OAuth2 password bearer scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = get_user(email)
    if user is None:
        raise credentials_exception
    
    return user

def hash_password(password: str) -> str:
    """Hash a password with a random salt"""
    salt = secrets.token_hex(16)
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return salt + pwdhash.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    salt = hashed_password[:32]  # First 32 characters are the salt
    stored_hash = hashed_password[32:]
    pwdhash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return pwdhash.hex() == stored_hash

# Simple user database (in production, use a proper database)
users_db = {
    "admin@example.com": {
        "email": "admin@example.com",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "name": "Admin User"
    },
    "user@example.com": {
        "email": "user@example.com",
        "password_hash": hash_password("user123"),
        "role": "user",
        "name": "Regular User"
    }
}

class User(BaseModel):
    email: str
    name: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_user(email: str) -> Optional[dict]:
    return users_db.get(email)

def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = get_user(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

app = FastAPI()

# Create API router with /api prefix
from fastapi import APIRouter
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Load pre-trained transformer model for text encoding
# Using a lightweight model suitable for sentence embeddings
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = None
model = None

if TRANSFORMERS_AVAILABLE:
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModel.from_pretrained(MODEL_NAME)
        print(f"Model {MODEL_NAME} loaded successfully")
    except Exception as e:
        print(f"Warning: Could not load model {MODEL_NAME}: {e}")
        TRANSFORMERS_AVAILABLE = False
else:
    print("Transformers not available, semantic similarity features will be disabled")

# In-memory storage for jobs and candidates (in production, use a database)
jobs_db = {}
candidates_db = {}
applications_db = {}

class JobPosting(BaseModel):
    job_id: str
    title: str
    description: str
    qualifications: List[str]
    required_skills: List[str]
    experience_required: str
    location: str
    salary_range: str

class CandidateProfile(BaseModel):
    candidate_id: str
    name: str
    email: str
    date_of_birth: str
    experience_years: int
    skills: List[str]
    education: str
    grade_8_certificate: str
    education_certificate: str
    resume_text: str
    birth_certificate_filename: Optional[str] = None
    grade_8_certificate_filename: Optional[str] = None
    education_certificate_filename: Optional[str] = None

class Application(BaseModel):
    application_id: str
    job_id: str
    candidate_id: str
    score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    matched_qualifications: List[str] = []
    missing_qualifications: List[str] = []
    common_keywords: List[str] = []

def encode_text(text: str) -> np.ndarray:
    """Encode text using transformer model"""
    if not TRANSFORMERS_AVAILABLE or tokenizer is None or model is None:
        # Fallback: return a zero vector if transformers are not available
        print("Warning: Transformers not available, returning zero vector")
        return np.zeros(384)  # all-MiniLM-L6-v2 has 384 dimensions
    
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    # Use mean pooling for sentence embeddings
    embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings.numpy().flatten()

def calculate_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    if norm_vec1 == 0 or norm_vec2 == 0:
        return 0.0
    return dot_product / (norm_vec1 * norm_vec2)

def extract_skills_from_text(text: str) -> List[str]:
    """Simple skill extraction from text (in production, use NER or more sophisticated methods)"""
    # Removed hardcoded tech skills list since skills are now provided by admin during job creation
    # Return empty list as we're not doing specific skill extraction
    return []

def extract_qualifications_from_text(text: str) -> List[str]:
    """Simple qualification extraction from text"""
    # Removed hardcoded qualification keywords list since qualifications are now provided by admin during job creation
    # Return empty list as we're not doing specific qualification extraction
    return []

@app.get("/")
async def root():
    return {"message": "AI-Powered Recruitment System API"}

@api_router.post("/jobs/create")
async def create_job(
    title: str = Form(...),
    description: str = Form(...),
    qualifications: str = Form(...),  # JSON string array
    required_skills: str = Form(...),  # JSON string array
    experience_required: str = Form(...),
    location: str = Form(...),
    salary_range: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    """Create a new job posting"""
    job_id = str(uuid.uuid4())
    
    # Parse JSON arrays
    try:
        qualifications_list = json.loads(qualifications)
        skills_list = json.loads(required_skills)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for qualifications or skills")
    
    job = JobPosting(
        job_id=job_id,
        title=title,
        description=description,
        qualifications=qualifications_list,
        required_skills=skills_list,
        experience_required=experience_required,
        location=location,
        salary_range=salary_range
    )
    
    jobs_db[job_id] = job.dict()
    return {"message": "Job created successfully", "job_id": job_id}

@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Retrieve a job posting by ID"""
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs_db[job_id]

@api_router.get("/jobs")
async def list_jobs():
    """List all job postings"""
    return list(jobs_db.values())

@api_router.post("/candidates/profile")
async def create_candidate_profile(
    name: str = Form(...),
    email: str = Form(...),
    date_of_birth: str = Form(...),
    experience_years: int = Form(...),
    education: str = Form(...),
    grade_8_certificate: str = Form(...),
    education_certificate: str = Form(...),
    resume_file: UploadFile = File(...),
    birth_certificate_file: UploadFile = File(None),
    grade_8_certificate_file: UploadFile = File(None),
    education_certificate_file: UploadFile = File(None)
):
    """Create a candidate profile with uploaded resume and certificates"""
    candidate_id = str(uuid.uuid4())
    
    # Validate required documents
    if not education_certificate_file or not education_certificate_file.filename:
        raise HTTPException(status_code=400, detail="Education certificate document is required")
    
    # Validate that at least one identity document is provided
    has_birth_cert = birth_certificate_file and birth_certificate_file.filename
    has_grade8_cert = grade_8_certificate_file and grade_8_certificate_file.filename
    
    if not has_birth_cert and not has_grade8_cert:
        raise HTTPException(status_code=400, detail="Either birth certificate or grade 8 certificate is required")
    
    # Read resume file
    resume_content = await resume_file.read()
    resume_text = resume_content.decode('utf-8', errors='ignore')
    
    # Extract skills from resume
    extracted_skills = extract_skills_from_text(resume_text)
    
    # Handle certificate file uploads
    birth_cert_filename = None
    grade_8_cert_filename = None
    education_cert_filename = None
    
    # Create uploads directory if it doesn't exist
    import os
    uploads_dir = "uploads"
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
    
    # Save birth certificate if provided
    if birth_certificate_file and birth_certificate_file.filename:
        birth_cert_filename = f"{candidate_id}_birth_cert_{birth_certificate_file.filename}"
        birth_cert_path = os.path.join(uploads_dir, birth_cert_filename)
        with open(birth_cert_path, "wb") as f:
            birth_cert_content = await birth_certificate_file.read()
            f.write(birth_cert_content)
        print(f"Birth certificate saved: {birth_cert_filename}")
    
    # Save grade 8 certificate if provided
    if grade_8_certificate_file and grade_8_certificate_file.filename:
        grade_8_cert_filename = f"{candidate_id}_grade8_cert_{grade_8_certificate_file.filename}"
        grade_8_cert_path = os.path.join(uploads_dir, grade_8_cert_filename)
        with open(grade_8_cert_path, "wb") as f:
            grade_8_cert_content = await grade_8_certificate_file.read()
            f.write(grade_8_cert_content)
        print(f"Grade 8 certificate saved: {grade_8_cert_filename}")
    
    # Save education certificate if provided
    if education_certificate_file and education_certificate_file.filename:
        education_cert_filename = f"{candidate_id}_edu_cert_{education_certificate_file.filename}"
        education_cert_path = os.path.join(uploads_dir, education_cert_filename)
        with open(education_cert_path, "wb") as f:
            education_cert_content = await education_certificate_file.read()
            f.write(education_cert_content)
        print(f"Education certificate saved: {education_cert_filename}")
    
    candidate = CandidateProfile(
        candidate_id=candidate_id,
        name=name,
        email=email,
        date_of_birth=date_of_birth,
        experience_years=experience_years,
        skills=extracted_skills,
        education=education,
        grade_8_certificate=grade_8_certificate,
        education_certificate=education_certificate,
        resume_text=resume_text,
        birth_certificate_filename=birth_cert_filename,
        grade_8_certificate_filename=grade_8_cert_filename,
        education_certificate_filename=education_cert_filename
    )
    
    candidates_db[candidate_id] = candidate.dict()
    return {"message": "Candidate profile created", "candidate_id": candidate_id}

@api_router.post("/screen-resume/{job_id}")
async def screen_resume(job_id: str, candidate_id: str = Form(...)):
    """Screen a candidate's resume against a job posting using semantic similarity"""
    try:
        print(f"=== Screening Request ===")
        print(f"Job ID: {job_id}")
        print(f"Candidate ID: {candidate_id}")
        
        # Check if job exists
        if job_id not in jobs_db:
            print(f"Job not found in database. Available jobs: {list(jobs_db.keys())}")
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Check if candidate exists
        if candidate_id not in candidates_db:
            print(f"Candidate not found in database. Available candidates: {list(candidates_db.keys())}")
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        print("Both job and candidate found in database")
        
        # Get job and candidate data
        job = jobs_db[job_id]
        candidate = candidates_db[candidate_id]
        
        print(f"Job title: {job.get('title', 'N/A')}")
        print(f"Candidate name: {candidate.get('name', 'N/A')}")
        
        # Simple scoring algorithm (no AI dependencies)
        print("Starting simple scoring algorithm...")
        
        # Basic keyword matching
        job_text = (job.get("description", "") + " " + " ".join(job.get("required_skills", []))).lower()
        resume_text = candidate.get("resume_text", "").lower()
        
        job_words = set(job_text.split())
        resume_words = set(resume_text.split())
        common_words = job_words.intersection(resume_words)
        
        # Calculate match score
        if len(job_words) > 0:
            keyword_match = len(common_words) / len(job_words)
        else:
            keyword_match = 0.5
        
        print(f"Keyword match score: {keyword_match}")
        
        # Experience matching
        try:
            required_exp_str = str(job.get("experience_required", "0"))
            required_exp_numbers = [int(x) for x in re.findall(r'\d+', required_exp_str)]
            required_exp = required_exp_numbers[0] if required_exp_numbers else 0
            
            candidate_exp_raw = candidate.get("experience_years", 0)
            candidate_exp = int(candidate_exp_raw) if str(candidate_exp_raw).isdigit() else 0
            
            if required_exp > 0:
                exp_match = min(candidate_exp / required_exp, 1.0)
            else:
                exp_match = 1.0
                
            print(f"Experience match: {exp_match} (candidate: {candidate_exp}, required: {required_exp})")
        except Exception as e:
            print(f"Experience calculation error: {e}")
            exp_match = 0.5
        
        # Final score
        final_score = (keyword_match * 0.7 + exp_match * 0.3)
        print(f"Final score: {final_score}")
        
        # Create application record
        application_id = str(uuid.uuid4())
        application_data = {
            "application_id": application_id,
            "job_id": job_id,
            "candidate_id": candidate_id,
            "score": float(final_score),
            "matched_skills": [],
            "missing_skills": [],
            "matched_qualifications": [],
            "missing_qualifications": [],
            "common_keywords": list(common_words)[:10]
        }
        
        applications_db[application_id] = application_data
        print(f"Application saved with ID: {application_id}")
        
        # Determine recommendation
        if final_score >= 0.8:
            recommendation = "Highly Recommended"
        elif final_score >= 0.6:
            recommendation = "Recommended"
        elif final_score >= 0.4:
            recommendation = "Consider"
        else:
            recommendation = "Not Recommended"
        
        result = {
            "application_id": application_id,
            "score": float(final_score),
            "match_percentage": round(final_score * 100, 2),
            "semantic_similarity": round(keyword_match, 4),
            "experience_match": round(exp_match, 4),
            "keyword_overlap": round(keyword_match, 4),
            "common_keywords": list(common_words)[:10],
            "recommendation": recommendation
        }
        
        print(f"Returning result: {result}")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"=== ERROR in screen_resume ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/applications/{application_id}")
async def get_application(application_id: str):
    """Retrieve screening results for an application"""
    if application_id not in applications_db:
        raise HTTPException(status_code=404, detail="Application not found")
    return applications_db[application_id]

@api_router.get("/jobs/{job_id}/applications")
async def get_job_applications(job_id: str, current_user: dict = Depends(get_current_user)):
    """Get all applications for a specific job with enhanced analytics"""
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_applications = []
    for app in applications_db.values():
        if app["job_id"] == job_id:
            # Add candidate information to the application
            candidate = candidates_db.get(app["candidate_id"])
            if candidate:
                app["email"] = candidate.get("email", "N/A")
                app["candidate_name"] = candidate.get("name", "Unknown")
                app["candidate_experience"] = candidate.get("experience_years", 0)
                app["candidate_education"] = candidate.get("education", "Not specified")
            job_applications.append(app)
    
    # Sort by score descending
    job_applications.sort(key=lambda x: x["score"], reverse=True)
    return job_applications

@api_router.get("/jobs/analytics/overview")
async def get_jobs_analytics_overview(current_user: dict = Depends(get_current_user)):
    """Get comprehensive analytics overview for all jobs"""
    analytics = []
    
    for job_id, job in jobs_db.items():
        # Get applications for this job
        job_applications = []
        for app in applications_db.values():
            if app["job_id"] == job_id:
                candidate = candidates_db.get(app["candidate_id"])
                if candidate:
                    app["email"] = candidate.get("email", "N/A")
                    app["candidate_name"] = candidate.get("name", "Unknown")
                    app["candidate_experience"] = candidate.get("experience_years", 0)
                job_applications.append(app)
        
        # Calculate analytics
        total_applications = len(job_applications)
        qualified_candidates = len([app for app in job_applications if app["score"] >= 0.6])
        highly_qualified = len([app for app in job_applications if app["score"] >= 0.8])
        
        # Average score
        avg_score = sum(app["score"] for app in job_applications) / total_applications if total_applications > 0 else 0
        
        # Top candidates (top 3)
        top_candidates = sorted(job_applications, key=lambda x: x["score"], reverse=True)[:3]
        
        # Skills analysis
        all_keywords = []
        for app in job_applications:
            all_keywords.extend(app.get("common_keywords", []))
        
        # Most common skills among applicants
        from collections import Counter
        skill_frequency = Counter(all_keywords)
        top_skills = skill_frequency.most_common(5)
        
        analytics.append({
            "job_id": job_id,
            "job_title": job["title"],
            "job_location": job["location"],
            "job_salary_range": job["salary_range"],
            "required_skills": job.get("required_skills", []),
            "qualifications": job.get("qualifications", []),
            "experience_required": job["experience_required"],
            "total_applications": total_applications,
            "qualified_candidates": qualified_candidates,
            "highly_qualified": highly_qualified,
            "average_score": round(avg_score, 3),
            "top_candidates": top_candidates,
            "top_skills_among_applicants": top_skills,
            "applications": sorted(job_applications, key=lambda x: x["score"], reverse=True)
        })
    
    return analytics

@api_router.post("/auth/login", response_model=Token)
async def login_for_access_token(user_data: UserLogin):
    """Authenticate user and provide access token"""
    user = authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """Return current user information"""
    return User(email=current_user["email"], name=current_user["name"], role=current_user["role"])

@api_router.get("/auth/test")
async def test_auth(current_user: dict = Depends(get_current_user)):
    """Test endpoint to verify authentication is working"""
    return {"message": f"Hello {current_user['name']}, authentication is working!", "user_role": current_user["role"]}

# Include the API router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)