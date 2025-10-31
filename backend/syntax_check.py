import ast
import sys

try:
    with open('main.py', 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Try to parse the file
    ast.parse(content)
    print("SUCCESS: No syntax errors found in main.py")
    sys.exit(0)
except SyntaxError as e:
    print(f"SYNTAX ERROR in main.py at line {e.lineno}: {e.text}")
    print(f"Error message: {e.msg}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)