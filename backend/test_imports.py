"""
Test script to check if all imports work correctly
"""

def test_imports():
    try:
        import hashlib
        from datetime import datetime, timedelta
        from typing import Optional
        import jwt
        from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
        from fastapi.security import OAuth2PasswordBearer
        from fastapi.middleware.cors import CORSMiddleware
        import torch
        from transformers import AutoTokenizer, AutoModel
        import numpy as np
        import re
        import json
        import uuid
        from pydantic import BaseModel
        from typing import List, Dict
        print("All imports successful!")
        return True
    except ImportError as e:
        print(f"Import error: {e}")
        return False
    except Exception as e:
        print(f"Other error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("All import tests passed!")
    else:
        print("There are import issues.")