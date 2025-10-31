"""
Script to check for syntax errors in main.py
"""

import ast
import sys

def check_syntax(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            source = file.read()
        
        # Parse the source code
        ast.parse(source)
        print("No syntax errors found!")
        return True
    except SyntaxError as e:
        print(f"Syntax error in {file_path}:")
        print(f"Line {e.lineno}: {e.text}")
        print(f"Error: {e.msg}")
        return False
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False

if __name__ == "__main__":
    file_path = "main.py"
    success = check_syntax(file_path)
    sys.exit(0 if success else 1)