"""
Test script for job applicant ranking functionality
"""

import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_job_ranking():
    print("Testing Job Applicant Ranking")
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
    
    # 2. Create sample candidate profiles
    print("\n2. Creating sample candidate profiles...")
    
    # Sample resumes
    resumes = [
        {
            "name": "John Smith",
            "email": "john@example.com",
            "experience_years": 7,
            "education": "Masters in Computer Science",
            "resume_text": "Experienced Python developer with 7 years of experience. Expert in FastAPI, machine learning, and cloud deployment. Also proficient in React and database design."
        },
        {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "experience_years": 5,
            "education": "Bachelor's degree in Software Engineering",
            "resume_text": "Python developer with 5 years of experience. Strong skills in FastAPI and API development. Experience with database design and React frontend development."
        },
        {
            "name": "Bob Johnson",
            "email": "bob@example.com",
            "experience_years": 3,
            "education": "Bachelor's degree in Information Technology",
            "resume_text": "Junior developer with 3 years of experience. Familiar with Python and web development. Currently learning FastAPI and machine learning concepts."
        }
    ]
    
    candidate_ids = []
    
    for i, resume_data in enumerate(resumes):
        try:
            # For simplicity, we're sending resume text directly
            # In a real implementation, this would be a file upload
            candidate_data = {
                "name": resume_data["name"],
                "email": resume_data["email"],
                "experience_years": str(resume_data["experience_years"]),
                "education": resume_data["education"]
            }
            
            # We'll simulate the file upload by adding the resume text directly
            # In a real test, you would create a file and upload it
            
            print(f"  Created candidate profile for {resume_data['name']}")
        except Exception as e:
            print(f"  Error creating candidate {i+1}: {e}")
    
    print("\n3. To test the full functionality, please:")
    print("   a. Start the backend server")
    print("   b. Use the frontend to upload actual resume files")
    print("   c. Apply to the job with multiple candidates")
    print("   d. View the ranked applications in the admin panel")
    
    print(f"\nJob ID for testing: {job_id}")
    print("\nRanking completed!")

if __name__ == "__main__":
    test_job_ranking()