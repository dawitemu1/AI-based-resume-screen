"""
Test script to verify that the skill extraction removal works correctly
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from main import extract_skills_from_text, extract_qualifications_from_text

def test_skill_extraction():
    print("Testing skill extraction removal...")
    
    # Test with various texts
    test_texts = [
        "I have experience with Python, Java, and React",
        "Skills: JavaScript, Node.js, SQL, MongoDB",
        "Qualifications: Bachelor's degree in Computer Science, 5 years experience",
        "This is a regular text with no specific skills or qualifications"
    ]
    
    for text in test_texts:
        skills = extract_skills_from_text(text)
        qualifications = extract_qualifications_from_text(text)
        
        print(f"Text: {text}")
        print(f"Extracted skills: {skills}")
        print(f"Extracted qualifications: {qualifications}")
        print("---")
    
    # Verify that both functions return empty lists
    assert extract_skills_from_text("Python Java React") == []
    assert extract_qualifications_from_text("Bachelor's degree") == []
    
    print("All tests passed! Skill extraction functions correctly return empty lists.")

if __name__ == "__main__":
    test_skill_extraction()