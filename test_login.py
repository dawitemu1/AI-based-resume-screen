import requests
import json

# Test the login endpoint directly
response = requests.post(
    "http://localhost:8000/auth/login",
    json={"email": "admin@example.com", "password": "admin123"},
    headers={"Content-Type": "application/json"}
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")