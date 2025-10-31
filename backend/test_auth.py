"""
Test script for the authentication endpoints
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_auth():
    print("Testing Authentication Endpoints")
    print("=" * 40)
    
    # Test login with admin credentials
    print("\n1. Testing admin login...")
    login_data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            login_result = response.json()
            access_token = login_result["access_token"]
            print(f"Login successful. Token: {access_token[:20]}...")
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"Error during login: {e}")
        return
    
    # Test getting user info
    print("\n2. Testing user info retrieval...")
    try:
        # Send token as form data
        form_data = {"token": access_token}
        response = requests.post(f"{BASE_URL}/auth/me", data=form_data)
        if response.status_code == 200:
            user_info = response.json()
            print("User info retrieved successfully:")
            print(json.dumps(user_info, indent=2))
        else:
            print(f"Failed to get user info: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error retrieving user info: {e}")
    
    # Test login with invalid credentials
    print("\n3. Testing invalid login...")
    invalid_login_data = {
        "email": "wrong@example.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=invalid_login_data)
        if response.status_code == 401:
            print("Correctly rejected invalid credentials")
        else:
            print(f"Unexpected response for invalid login: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error during invalid login test: {e}")
    
    print("\nAuthentication tests completed!")

if __name__ == "__main__":
    test_auth()