import requests
import json

# Test the complete authentication flow
print("Testing Authentication Flow")
print("=" * 40)

# 1. Test login endpoint directly
print("\n1. Testing login endpoint...")
try:
    login_response = requests.post(
        "http://localhost:8000/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Login Status Code: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_data = login_response.json()
        print("Login successful!")
        print(f"Access Token: {login_data['access_token'][:30]}...")
        
        # 2. Test user info endpoint with token
        print("\n2. Testing user info endpoint...")
        user_response = requests.post(
            "http://localhost:8000/auth/me",
            headers={"Authorization": f"Bearer {login_data['access_token']}"}
        )
        
        print(f"User Info Status Code: {user_response.status_code}")
        if user_response.status_code == 200:
            user_data = user_response.json()
            print("User info retrieved successfully:")
            print(json.dumps(user_data, indent=2))
            print("\n✅ Authentication flow is working correctly!")
        else:
            print(f"❌ Failed to get user info: {user_response.status_code}")
            print(f"Response: {user_response.text}")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        
except Exception as e:
    print(f"❌ Error during testing: {e}")

print("\n" + "=" * 40)