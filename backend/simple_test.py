import sys
try:
    import main
    print("SUCCESS: main.py imported without errors")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)