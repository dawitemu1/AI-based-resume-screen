import requests
import json

# Detailed debugging of the application submission

print("=== Detailed Debug ===")

# Step 1: Get jobs
print("1. Getting jobs...")
jobs_response = requests.get("http://localhost:8000/api/jobs")
print(f"Jobs status: {jobs_response.status_code}")

if jobs_response.status_code == 200:
    jobs = jobs_response.json()
    if jobs:
        job = jobs[0]
        job_id = job["job_id"]
        print(f"Using job: {job['title']} (ID: {job_id})")
        print(f"Job details: {json.dumps(job, indent=2)}")
        
        # Step 2: Create candidate
        print("\n2. Creating candidate...")
        candidate_data = {
            "name": "Debug User",
            "email": "debug@test.com",
            "experience_years": "2",
            "education": "Bachelor's"
        }
        
        resume_text = "Python developer with 2 years experience in web development and data analysis."
        files = {"resume_file": ("resume.txt", resume_text, "text/plain")}
        
        candidate_response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Candidate status: {candidate_response.status_code}")
        print(f"Candidate response: {candidate_response.text}")
        
        if candidate_response.status_code == 200:
            candidate_id = candidate_response.json()["candidate_id"]
            print(f"Candidate ID: {candidate_id}")
            
            # Step 3: Test screening with detailed error info
            print("\n3. Testing screening...")
            screen_data = {"candidate_id": candidate_id}
            
            try:
                screen_response = requests.post(
                    f"http://localhost:8000/api/screen-resume/{job_id}",
                    data=screen_data
                )
                
                print(f"Screening status: {screen_response.status_code}")
                print(f"Screening headers: {dict(screen_response.headers)}")
                print(f"Screening response: {screen_response.text}")
                
                if screen_response.status_code == 200:
                    result = screen_response.json()
                    print(f"SUCCESS: {json.dumps(result, indent=2)}")
                else:
                    print(f"FAILED with status {screen_response.status_code}")
                    
            except Exception as e:
                print(f"Exception during screening: {e}")
        else:
            print("Candidate creation failed")
    else:
        print("No jobs found")
else:
    print(f"Failed to get jobs: {jobs_response.text}")

print("\n=== Debug Complete ===")