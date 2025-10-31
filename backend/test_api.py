"""
Test script for the AI-Powered Recruitment System API
This script demonstrates how to interact with the backend API
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing AI-Powered Recruitment System API")
    print("=" * 50)
    
    # 1. Create a job posting
    print("\n1. Creating a job posting...")
    job_data = {
        "title": "Senior Python Developer",
        "description": "We are looking for an experienced Python developer with expertise in FastAPI and machine learning. The candidate should have experience with API development, database design, and cloud deployment. Knowledge of React is a plus.",
        "qualifications": '["Bachelor\'s degree in Computer Science or related field"]',
        "required_skills": '["python", "fastapi"]',
        "experience_required": "5+ years",
        "location": "Remote",
        "salary_range": "$90,000 - $120,000"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/jobs/create", data=job_data)
        if response.status_code == 200:
            job_result = response.json()
            job_id = job_result["job_id"]
            print(f"Job created successfully with ID: {job_id}")
        else:
            print(f"Failed to create job: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"Error creating job: {e}")
        return
    
    # 2. Retrieve the job posting
    print("\n2. Retrieving job posting...")
    try:
        response = requests.get(f"{BASE_URL}/jobs/{job_id}")
        if response.status_code == 200:
            job_details = response.json()
            print("Job details retrieved successfully:")
            print(json.dumps(job_details, indent=2))
        else:
            print(f"Failed to retrieve job: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error retrieving job: {e}")
    
    # 3. List all jobs
    print("\n3. Listing all jobs...")
    try:
        response = requests.get(f"{BASE_URL}/jobs")
        if response.status_code == 200:
            jobs = response.json()
            print(f"Found {len(jobs)} job(s)")
        else:
            print(f"Failed to list jobs: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error listing jobs: {e}")
    
    print("\nAPI test completed!")

if __name__ == "__main__":
    test_api()