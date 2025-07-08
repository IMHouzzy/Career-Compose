from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from database import get_db
from schemas import Token, UserLogin
from services.auth_service import authenticate_user, get_current_user
from utils.hashing import create_access_token, decode_jwt, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

@router.post("/login", response_model=Token, summary="Login with JSON data")
def login_for_access_token(user_data: UserLogin, db: Session = Depends(get_db)):
    """Endpoint for user login and JWT token retrieval using JSON data."""
    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id_User}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify-token/{token}", summary="Verify token via URL with detailed information")
def verify_token(token: str, db: Session = Depends(get_db)):
    """Verify token via URL with detailed information."""
    
    response = {
        "token_valid": False,
        "token_info": {},
        "user_info": None,
        "error": None
    }
    
    # Attempt to decode the JWT token
    payload = decode_jwt(token)
    if not payload:
        response["error"] = "Invalid token format"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=response["error"]
        )

    email = payload.get("sub")
    user_id = payload.get("user_id")
    exp_timestamp = payload.get("exp")

    now = datetime.utcnow()
    expiration = datetime.fromtimestamp(exp_timestamp) if exp_timestamp else None
    is_expired = expiration < now if expiration else True
    time_left = (expiration - now).total_seconds() if expiration and not is_expired else 0

    response["token_info"] = {
        "email": email,
        "user_id": user_id,
        "expiration_time": expiration.isoformat() if expiration else None,
        "is_expired": is_expired,
        "time_left_seconds": time_left,
        "time_left_minutes": round(time_left / 60, 2) if time_left > 0 else 0
    }

    if not is_expired and email:
        user = get_current_user(db, token)
        if user:
            response["token_valid"] = True
            response["user_info"] = {
                "id_User": user.id_User,
                "name": user.name,
                "last_name": user.last_name,
                "email": user.email,
                "fk_Subscription": user.fk_Subscription
            }
        else:
            response["error"] = "User not found in database"
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=response["error"]
            )
    else:
        response["error"] = "Token is expired" if is_expired else "Invalid token payload"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=response["error"]
        )

    return response

