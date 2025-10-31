import requests
import json

# Simple test for application submission

print("Testing application submission...")

# Get available jobs
jobs_response = requests.get("http://localhost:8000/api/jobs")
if jobs_response.status_code != 200:
    print("❌ Failed to get jobs")
    exit(1)

jobs = jobs_response.json()
if not jobs:
    print("❌ No jobs available")
    exit(1)

job = jobs[0]
job_id = job["job_id"]
print(f"✓ Using job: {job['title']}")

# Create candidate
candidate_data = {
    "name": "Test User",
    "email": "test@example.com",
    "experience_years": "3",  # String format as sent by frontend
    "education": "Bachelor's degree"
}

resume_content = "Test resume with Python, JavaScript, and web development experience."
files = {
    "resume_file": ("resume.txt", resume_content, "text/plain")
}

print("Creating candidate profile...")
candidate_response = requests.post(
    "http://localhost:8000/api/candidates/profile",
    data=candidate_data,
    files=files
)

if candidate_response.status_code != 200:
    print(f"❌ Candidate creation failed: {candidate_response.text}")
    exit(1)

candidate_id = candidate_response.json()["candidate_id"]
print(f"✓ Candidate created: {candidate_id}")

# Screen resume
print("Screening resume...")
screen_data = {"candidate_id": candidate_id}
screen_response = requests.post(
    f"http://localhost:8000/api/screen-resume/{job_id}",
    data=screen_data
)

if screen_response.status_code != 200:
    print(f"❌ Screening failed: {screen_response.text}")
    exit(1)

result = screen_response.json()
print(f"✅ Application successful!")
print(f"   Match Score: {result['match_percentage']}%")
print(f"   Recommendation: {result['recommendation']}")
print(f"   Application ID: {result['application_id']}")