import requests

# Test if we can create a minimal working endpoint

print("Testing minimal endpoint...")

# First create a candidate
candidate_data = {
    "name": "Minimal Test",
    "email": "minimal@test.com",
    "experience_years": "1",
    "education": "Test Education"
}

files = {"resume_file": ("test.txt", "Test resume content", "text/plain")}

candidate_response = requests.post(
    "http://localhost:8000/api/candidates/profile",
    data=candidate_data,
    files=files
)

print(f"Candidate creation: {candidate_response.status_code}")

if candidate_response.status_code == 200:
    candidate_id = candidate_response.json()["candidate_id"]
    
    # Get jobs
    jobs_response = requests.get("http://localhost:8000/api/jobs")
    if jobs_response.status_code == 200 and jobs_response.json():
        job_id = jobs_response.json()[0]["job_id"]
        
        # Test the problematic endpoint
        print(f"Testing screening with job_id={job_id}, candidate_id={candidate_id}")
        
        screen_response = requests.post(
            f"http://localhost:8000/api/screen-resume/{job_id}",
            data={"candidate_id": candidate_id}
        )
        
        print(f"Screening result: {screen_response.status_code}")
        print(f"Response: {screen_response.text}")
        
        if screen_response.status_code != 200:
            print("❌ Screening failed")
            
            # Let's also test if we can access the data directly
            print("\nTesting data access...")
            
            # Check if candidate exists in database
            print("Checking candidate in database...")
            
            # Check if job exists in database  
            print("Checking job in database...")
            
    else:
        print("No jobs available for testing")
else:
    print(f"Failed to create candidate: {candidate_response.text}")