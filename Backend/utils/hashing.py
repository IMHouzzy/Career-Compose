from passlib.context import CryptContext
from auth import pwd_context
from datetime import datetime, timedelta
from jose import jwt, JWTError
import os

# Login part -----------------------------------------------
def verify_password(plain_password, hashed_password):
    """Verifies if the entered password matches the hashed password"""
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """Hashes a plain text password."""
    return pwd_context.hash(password)


# access token part ---------------------
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Creates a JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token: str):
    """Decodes a JWT token and returns the payload."""
    try:
        
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
