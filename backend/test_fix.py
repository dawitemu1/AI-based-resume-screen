"""
Test script to verify that the main.py file has no syntax errors
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

def test_import():
    try:
        import main
        print("Successfully imported main.py - no syntax errors!")
        return True
    except Exception as e:
        print(f"Error importing main.py: {e}")
        return False

if __name__ == "__main__":
    success = test_import()
    if success:
        print("All tests passed!")
    else:
        print("There are issues with the code.")