import requests
import json

# Test multiple candidates applying to the same job

# Step 1: Login as admin and create a job
print("Step 1: Creating a test job...")
login_response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "admin@example.com", "password": "admin123"},
    headers={"Content-Type": "application/json"}
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    
    # Create a test job
    job_data = {
        "title": "Senior Python Developer",
        "description": "We are looking for an experienced Python developer with expertise in web development, API design, and database management.",
        "qualifications": json.dumps(["Bachelor's degree in Computer Science", "5+ years Python experience", "Experience with web frameworks"]),
        "required_skills": json.dumps(["Python", "Django", "Flask", "PostgreSQL", "REST APIs", "Git"]),
        "experience_required": "5+ years",
        "location": "San Francisco, CA",
        "salary_range": "$120,000 - $150,000"
    }
    
    job_response = requests.post(
        "http://localhost:8000/api/jobs/create",
        data=job_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if job_response.status_code == 200:
        job_id = job_response.json()["job_id"]
        print(f"Job created successfully: {job_id}")
        
        # Step 2: Create multiple candidates with different skill levels
        candidates = [
            {
                "name": "Alice Johnson",
                "email": "alice.johnson@email.com",
                "experience_years": "7",
                "education": "Master's in Computer Science",
                "resume": """
Alice Johnson
Senior Software Engineer

Experience:
- 7 years of Python development
- Expert in Django and Flask frameworks
- Extensive experience with PostgreSQL and MongoDB
- Built and maintained REST APIs for high-traffic applications
- Team lead for 3 years, managed 5 developers
- Experience with Docker, Kubernetes, AWS

Education:
- Master's degree in Computer Science from Stanford University
- Bachelor's degree in Software Engineering

Skills:
- Python, Django, Flask, FastAPI
- PostgreSQL, MongoDB, Redis
- REST APIs, GraphQL
- Docker, Kubernetes, AWS
- Git, CI/CD, Agile methodologies
- Team leadership and mentoring
                """
            },
            {
                "name": "Bob Smith",
                "email": "bob.smith@email.com",
                "experience_years": "3",
                "education": "Bachelor's in Computer Science",
                "resume": """
Bob Smith
Python Developer

Experience:
- 3 years of Python development
- Experience with Django web framework
- Basic knowledge of PostgreSQL
- Built simple REST APIs
- Worked on small to medium projects

Education:
- Bachelor's degree in Computer Science

Skills:
- Python, Django
- PostgreSQL, SQLite
- Basic REST API development
- Git version control
- HTML, CSS, JavaScript
                """
            },
            {
                "name": "Carol Davis",
                "email": "carol.davis@email.com",
                "experience_years": "10",
                "education": "PhD in Computer Science",
                "resume": """
Carol Davis
Principal Software Architect

Experience:
- 10+ years of Python development
- Expert in Django, Flask, and FastAPI
- Advanced database design and optimization
- Microservices architecture design
- Machine learning and data science projects
- Published research papers on distributed systems

Education:
- PhD in Computer Science from MIT
- Master's in Software Engineering

Skills:
- Python, Django, Flask, FastAPI
- PostgreSQL, MySQL, MongoDB, Redis
- REST APIs, GraphQL, gRPC
- Docker, Kubernetes, AWS, GCP
- Machine Learning, TensorFlow, PyTorch
- System architecture and design
- Research and development
                """
            },
            {
                "name": "David Wilson",
                "email": "david.wilson@email.com",
                "experience_years": "1",
                "education": "Bachelor's in Information Technology",
                "resume": """
David Wilson
Junior Developer

Experience:
- 1 year of Python programming
- Basic web development with Flask
- Student projects and internships
- Eager to learn and grow

Education:
- Bachelor's degree in Information Technology
- Completed Python programming bootcamp

Skills:
- Python basics
- Flask framework (beginner)
- HTML, CSS, JavaScript
- Git (basic usage)
- Enthusiastic learner
                """
            }
        ]
        
        print(f"\nStep 2: Creating {len(candidates)} candidates and applying to job...")
        
        for i, candidate in enumerate(candidates, 1):
            print(f"\nCandidate {i}: {candidate['name']}")
            
            # Create candidate profile
            candidate_data = {
                "name": candidate["name"],
                "email": candidate["email"],
                "experience_years": candidate["experience_years"],
                "education": candidate["education"]
            }
            
            files = {
                "resume_file": (f"{candidate['name']}_resume.txt", candidate["resume"], "text/plain")
            }
            
            candidate_response = requests.post(
                "http://localhost:8000/api/candidates/profile",
                data=candidate_data,
                files=files
            )
            
            if candidate_response.status_code == 200:
                candidate_id = candidate_response.json()["candidate_id"]
                print(f"  ✓ Candidate profile created: {candidate_id}")
                
                # Screen resume against job
                screen_data = {"candidate_id": candidate_id}
                screen_response = requests.post(
                    f"http://localhost:8000/api/screen-resume/{job_id}",
                    data=screen_data
                )
                
                if screen_response.status_code == 200:
                    result = screen_response.json()
                    print(f"  ✓ Application processed:")
                    print(f"    Match Score: {result['match_percentage']}%")
                    print(f"    Recommendation: {result['recommendation']}")
                    print(f"    Application ID: {result['application_id']}")
                else:
                    print(f"  ❌ Application failed: {screen_response.text}")
            else:
                print(f"  ❌ Candidate creation failed: {candidate_response.text}")
        
        # Step 3: Get analytics overview
        print(f"\nStep 3: Getting analytics overview...")
        analytics_response = requests.get(
            "http://localhost:8000/api/jobs/analytics/overview",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if analytics_response.status_code == 200:
            analytics = analytics_response.json()
            for job_analytics in analytics:
                if job_analytics["job_id"] == job_id:
                    print(f"\n📊 Job Analytics for '{job_analytics['job_title']}':")
                    print(f"  Total Applications: {job_analytics['total_applications']}")
                    print(f"  Qualified Candidates (60%+): {job_analytics['qualified_candidates']}")
                    print(f"  Highly Qualified (80%+): {job_analytics['highly_qualified']}")
                    print(f"  Average Score: {job_analytics['average_score'] * 100:.1f}%")
                    
                    print(f"\n🏆 Top Candidates:")
                    for i, candidate in enumerate(job_analytics['top_candidates'], 1):
                        print(f"  {i}. {candidate['candidate_name']} - {candidate['score'] * 100:.1f}%")
                    
                    print(f"\n🔧 Most Common Skills Among Applicants:")
                    for skill, count in job_analytics['top_skills_among_applicants']:
                        print(f"  {skill}: {count} candidates")
                    break
        else:
            print(f"❌ Analytics failed: {analytics_response.text}")
            
    else:
        print(f"❌ Job creation failed: {job_response.text}")
else:
    print(f"❌ Login failed: {login_response.text}")