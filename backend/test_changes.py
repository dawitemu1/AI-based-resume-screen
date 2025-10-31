"""
Test script to verify that the hardcoded lists have been removed
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from main import extract_skills_from_text, extract_qualifications_from_text

def test_removal():
    print("Testing that hardcoded lists have been removed...")
    
    # Test skill extraction
    skills = extract_skills_from_text("Python, Java, React, AWS")
    print(f"Skills extracted: {skills}")
    assert skills == [], "Skill extraction should return empty list"
    
    # Test qualification extraction
    qualifications = extract_qualifications_from_text("Bachelor's degree, 5 years experience")
    print(f"Qualifications extracted: {qualifications}")
    assert qualifications == [], "Qualification extraction should return empty list"
    
    print("All tests passed! Hardcoded lists have been successfully removed.")

if __name__ == "__main__":
    test_removal()