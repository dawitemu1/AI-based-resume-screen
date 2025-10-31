import requests
import json

# Test document upload functionality

print("=== Testing Document Upload Requirements ===")

# Get available jobs
jobs_response = requests.get("http://localhost:8000/api/jobs")
if jobs_response.status_code == 200:
    jobs = jobs_response.json()
    if jobs:
        job = jobs[0]
        job_id = job["job_id"]
        print(f"✓ Using job: {job['title']} (ID: {job_id})")
        
        # Test 1: Try without required documents (should fail)
        print("\n1. Testing without required documents (should fail)...")
        candidate_data = {
            "name": "Test User",
            "email": "test@example.com",
            "date_of_birth": "1995-01-01",
            "experience_years": "3",
            "education": "Bachelor's degree",
            "grade_8_certificate": "completed",
            "education_certificate": "bachelor"
        }
        
        files = {"resume_file": ("resume.txt", "Test resume content", "text/plain")}
        
        response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Test 2: Try with education certificate but no identity document (should fail)
        print("\n2. Testing with education cert but no identity document (should fail)...")
        
        files = {
            "resume_file": ("resume.txt", "Test resume content", "text/plain"),
            "education_certificate_file": ("edu_cert.pdf", b"fake education certificate content", "application/pdf")
        }
        
        response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Test 3: Try with all required documents (should succeed)
        print("\n3. Testing with all required documents (should succeed)...")
        
        files = {
            "resume_file": ("resume.txt", "Test resume content", "text/plain"),
            "education_certificate_file": ("edu_cert.pdf", b"fake education certificate content", "application/pdf"),
            "birth_certificate_file": ("birth_cert.pdf", b"fake birth certificate content", "application/pdf")
        }
        
        response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            candidate_id = response.json()["candidate_id"]
            print(f"✓ Candidate created with documents: {candidate_id}")
            
            # Test screening
            screen_data = {"candidate_id": candidate_id}
            screen_response = requests.post(
                f"http://localhost:8000/api/screen-resume/{job_id}",
                data=screen_data
            )
            
            if screen_response.status_code == 200:
                result = screen_response.json()
                print(f"✓ Application screened successfully!")
                print(f"  Match Score: {result['match_percentage']}%")
                print(f"  Recommendation: {result['recommendation']}")
            else:
                print(f"❌ Screening failed: {screen_response.text}")
        
        # Test 4: Try with grade 8 certificate instead of birth certificate
        print("\n4. Testing with grade 8 certificate instead of birth certificate...")
        
        candidate_data["email"] = "test2@example.com"  # Different email
        files = {
            "resume_file": ("resume.txt", "Test resume content", "text/plain"),
            "education_certificate_file": ("edu_cert.pdf", b"fake education certificate content", "application/pdf"),
            "grade_8_certificate_file": ("grade8_cert.pdf", b"fake grade 8 certificate content", "application/pdf")
        }
        
        response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✓ Grade 8 certificate accepted as identity document")
        
    else:
        print("❌ No jobs available")
else:
    print(f"❌ Failed to get jobs: {jobs_response.text}")

print("\n=== Document Upload Test Complete ===")