import requests
import json

# Debug application submission issue

print("=== Debugging Application Submission ===")

# Step 1: Check if we can get jobs (public endpoint)
print("\n1. Testing job listings (public)...")
jobs_response = requests.get("http://localhost:8000/api/jobs")
print(f"Status: {jobs_response.status_code}")

if jobs_response.status_code == 200:
    jobs = jobs_response.json()
    print(f"Found {len(jobs)} jobs")
    
    if jobs:
        test_job = jobs[0]
        job_id = test_job["job_id"]
        print(f"Using job: {test_job['title']} (ID: {job_id})")
        
        # Step 2: Test candidate profile creation (public)
        print("\n2. Testing candidate profile creation...")
        
        resume_content = "John Doe - Software Developer with 3 years Python experience"
        
        candidate_data = {
            "name": "Test Candidate",
            "email": "test@example.com",
            "experience_years": "3",
            "education": "Bachelor's in CS"
        }
        
        files = {
            "resume_file": ("resume.txt", resume_content, "text/plain")
        }
        
        try:
            candidate_response = requests.post(
                "http://localhost:8000/api/candidates/profile",
                data=candidate_data,
                files=files,
                timeout=30
            )
            
            print(f"Candidate creation status: {candidate_response.status_code}")
            print(f"Response: {candidate_response.text}")
            
            if candidate_response.status_code == 200:
                candidate_id = candidate_response.json()["candidate_id"]
                print(f"✓ Candidate created: {candidate_id}")
                
                # Step 3: Test resume screening (public)
                print("\n3. Testing resume screening...")
                
                screen_data = {
                    "candidate_id": candidate_id
                }
                
                try:
                    screen_response = requests.post(
                        f"http://localhost:8000/api/screen-resume/{job_id}",
                        data=screen_data,
                        timeout=30
                    )
                    
                    print(f"Screening status: {screen_response.status_code}")
                    print(f"Response: {screen_response.text}")
                    
                    if screen_response.status_code == 200:
                        result = screen_response.json()
                        print(f"✓ Application successful!")
                        print(f"  Match Score: {result['match_percentage']}%")
                        print(f"  Recommendation: {result['recommendation']}")
                    else:
                        print(f"❌ Screening failed")
                        
                except requests.exceptions.Timeout:
                    print("❌ Screening request timed out")
                except Exception as e:
                    print(f"❌ Screening error: {e}")
                    
            else:
                print(f"❌ Candidate creation failed")
                
        except requests.exceptions.Timeout:
            print("❌ Candidate creation request timed out")
        except Exception as e:
            print(f"❌ Candidate creation error: {e}")
            
    else:
        print("❌ No jobs available")
else:
    print(f"❌ Failed to get jobs: {jobs_response.text}")

print("\n=== Debug Complete ===")