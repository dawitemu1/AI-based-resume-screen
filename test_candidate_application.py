import requests
import json

# Test the complete candidate application flow

# Step 1: Get available jobs (public endpoint)
print("Step 1: Fetching available jobs...")
jobs_response = requests.get("http://localhost:8000/api/jobs")
print(f"Jobs fetch status: {jobs_response.status_code}")

if jobs_response.status_code == 200:
    jobs = jobs_response.json()
    print(f"Found {len(jobs)} jobs")
    
    if jobs:
        # Use the first job for testing
        test_job = jobs[0]
        job_id = test_job["job_id"]
        print(f"Testing with job: {test_job['title']} (ID: {job_id})")
        
        # Step 2: Create candidate profile
        print("\nStep 2: Creating candidate profile...")
        
        # Create a simple resume content
        resume_content = """
John Doe
Software Engineer

Experience:
- 5 years of Python development
- 3 years of React development
- Experience with SQL databases
- Docker containerization

Education:
- Bachelor's degree in Computer Science

Skills:
- Python, JavaScript, React, SQL, Docker
- Problem solving and teamwork
        """
        
        candidate_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "experience_years": "5",
            "education": "Bachelor's degree in Computer Science"
        }
        
        files = {
            "resume_file": ("resume.txt", resume_content, "text/plain")
        }
        
        candidate_response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Candidate creation status: {candidate_response.status_code}")
        print(f"Candidate creation response: {candidate_response.text}")
        
        if candidate_response.status_code == 200:
            candidate_data = candidate_response.json()
            candidate_id = candidate_data["candidate_id"]
            print(f"Candidate created with ID: {candidate_id}")
            
            # Step 3: Screen resume against job
            print("\nStep 3: Screening resume against job...")
            
            screen_data = {
                "candidate_id": candidate_id
            }
            
            screen_response = requests.post(
                f"http://localhost:8000/api/screen-resume/{job_id}",
                data=screen_data
            )
            
            print(f"Screening status: {screen_response.status_code}")
            print(f"Screening response: {screen_response.text}")
            
            if screen_response.status_code == 200:
                screening_result = screen_response.json()
                print(f"\n🎉 Application successful!")
                print(f"Match Score: {screening_result['match_percentage']}%")
                print(f"Recommendation: {screening_result['recommendation']}")
                print(f"Application ID: {screening_result['application_id']}")
            else:
                print("❌ Resume screening failed")
        else:
            print("❌ Candidate profile creation failed")
    else:
        print("❌ No jobs available for testing")
else:
    print("❌ Failed to fetch jobs")