import requests
import json

# Test the enhanced application form with new fields

print("=== Testing Enhanced Application Form ===")

# Get available jobs
jobs_response = requests.get("http://localhost:8000/api/jobs")
if jobs_response.status_code == 200:
    jobs = jobs_response.json()
    if jobs:
        job = jobs[0]
        job_id = job["job_id"]
        print(f"✓ Using job: {job['title']} (ID: {job_id})")
        
        # Create enhanced candidate profile
        candidate_data = {
            "name": "Enhanced Test Candidate",
            "email": "enhanced@test.com",
            "date_of_birth": "1995-06-15",
            "experience_years": "5",
            "education": "Bachelor's in Computer Science",
            "grade_8_certificate": "completed",
            "education_certificate": "bachelor"
        }
        
        resume_content = """
Enhanced Test Candidate
Software Engineer

Personal Information:
- Date of Birth: June 15, 1995
- Education: Bachelor's degree in Computer Science
- Grade 8 Certificate: Completed

Experience:
- 5 years of software development experience
- Proficient in Python, JavaScript, and web development
- Experience with databases and API development
- Strong problem-solving and analytical skills

Education Certificates:
- Bachelor's degree in Computer Science (2018)
- Various professional development certificates
- Continuous learning and skill development

Skills:
- Programming: Python, JavaScript, Java, C++
- Web Development: React, Node.js, HTML, CSS
- Databases: MySQL, PostgreSQL, MongoDB
- Tools: Git, Docker, AWS, Linux
        """
        
        files = {"resume_file": ("enhanced_resume.txt", resume_content, "text/plain")}
        
        print("Creating enhanced candidate profile...")
        candidate_response = requests.post(
            "http://localhost:8000/api/candidates/profile",
            data=candidate_data,
            files=files
        )
        
        print(f"Candidate creation status: {candidate_response.status_code}")
        if candidate_response.status_code == 200:
            candidate_id = candidate_response.json()["candidate_id"]
            print(f"✓ Enhanced candidate created: {candidate_id}")
            
            # Screen the enhanced application
            print("Screening enhanced application...")
            screen_data = {"candidate_id": candidate_id}
            screen_response = requests.post(
                f"http://localhost:8000/api/screen-resume/{job_id}",
                data=screen_data
            )
            
            if screen_response.status_code == 200:
                result = screen_response.json()
                print(f"\n🎉 Enhanced Application Results:")
                print(f"📊 Overall Match Score: {result['match_percentage']}%")
                print(f"💡 AI Recommendation: {result['recommendation']}")
                print(f"🔍 Skill Match: {round(result.get('semantic_similarity', 0) * 100)}%")
                print(f"💼 Experience Match: {round(result.get('experience_match', 0) * 100)}%")
                print(f"🔗 Keyword Overlap: {round(result.get('keyword_overlap', 0) * 100)}%")
                print(f"🆔 Application ID: {result['application_id']}")
                print(f"🏷️ Common Keywords: {', '.join(result.get('common_keywords', [])[:5])}")
            else:
                print(f"❌ Screening failed: {screen_response.text}")
        else:
            print(f"❌ Enhanced candidate creation failed: {candidate_response.text}")
    else:
        print("❌ No jobs available")
else:
    print(f"❌ Failed to get jobs: {jobs_response.text}")

print("\n=== Enhanced Test Complete ===")