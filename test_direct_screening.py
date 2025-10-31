import requests
import json

# Test direct screening with minimal data

print("=== Direct Screening Test ===")

# First, let's check what's in the databases by creating a simple candidate and job
print("1. Creating a simple test...")

# Create candidate
candidate_data = {
    "name": "Test User",
    "email": "test@example.com", 
    "experience_years": "3",
    "education": "Bachelor's"
}

resume_text = "I am a Python developer with 3 years of experience."
files = {"resume_file": ("resume.txt", resume_text, "text/plain")}

print("Creating candidate...")
candidate_response = requests.post(
    "http://localhost:8000/api/candidates/profile",
    data=candidate_data,
    files=files
)

if candidate_response.status_code == 200:
    candidate_id = candidate_response.json()["candidate_id"]
    print(f"✓ Candidate created: {candidate_id}")
    
    # Get a job
    jobs_response = requests.get("http://localhost:8000/api/jobs")
    if jobs_response.status_code == 200:
        jobs = jobs_response.json()
        if jobs:
            job_id = jobs[0]["job_id"]
            print(f"✓ Using job: {job_id}")
            
            # Try screening with verbose output
            print("Attempting screening...")
            screen_data = {"candidate_id": candidate_id}
            
            # Make the request and capture any error details
            try:
                import requests
                screen_response = requests.post(
                    f"http://localhost:8000/api/screen-resume/{job_id}",
                    data=screen_data,
                    timeout=10
                )
                
                print(f"Response status: {screen_response.status_code}")
                print(f"Response headers: {screen_response.headers}")
                print(f"Response text: {screen_response.text}")
                
                if screen_response.status_code == 200:
                    result = screen_response.json()
                    print(f"✅ SUCCESS!")
                    print(f"Match: {result.get('match_percentage', 'N/A')}%")
                    print(f"Recommendation: {result.get('recommendation', 'N/A')}")
                else:
                    print(f"❌ Failed with {screen_response.status_code}")
                    
            except requests.exceptions.Timeout:
                print("❌ Request timed out")
            except Exception as e:
                print(f"❌ Exception: {e}")
        else:
            print("❌ No jobs found")
    else:
        print("❌ Failed to get jobs")
else:
    print(f"❌ Failed to create candidate: {candidate_response.text}")

print("=== Test Complete ===")