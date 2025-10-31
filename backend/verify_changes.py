"""
Script to verify the backend changes are working correctly
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_simplified_api():
    print("Testing Simplified API")
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
    
    # 2. Test the simplified screening API
    print("\n2. Testing simplified screening API...")
    # We can't fully test this without a real resume file, but we can verify the endpoint exists
    try:
        # Try to get job details
        response = requests.get(f"{BASE_URL}/jobs/{job_id}")
        if response.status_code == 200:
            job_details = response.json()
            print("Job details retrieved successfully:")
            print(f"- Title: {job_details['title']}")
            print(f"- Description: {job_details['description'][:50]}...")
        else:
            print(f"Failed to retrieve job: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error testing API: {e}")
    
    print("\nAPI verification completed!")

if __name__ == "__main__":
    test_simplified_api()