import requests
import json

# First login to get a token
login_response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "admin@example.com", "password": "admin123"},
    headers={"Content-Type": "application/json"}
)

print(f"Login Status: {login_response.status_code}")
if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"Token received: {token[:20]}...")
    
    # Test job creation
    job_data = {
        "title": "Test Software Engineer",
        "description": "This is a test job description for a software engineer position.",
        "qualifications": json.dumps(["Bachelor's degree in Computer Science", "3+ years experience"]),
        "required_skills": json.dumps(["Python", "JavaScript", "SQL"]),
        "experience_required": "3+ years",
        "location": "Remote",
        "salary_range": "$70,000 - $90,000"
    }
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    job_response = requests.post(
        "http://localhost:8000/api/jobs/create",
        data=job_data,
        headers=headers
    )
    
    print(f"Job Creation Status: {job_response.status_code}")
    print(f"Job Creation Response: {job_response.text}")
else:
    print(f"Login failed: {login_response.text}")