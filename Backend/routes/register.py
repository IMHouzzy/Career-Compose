from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, UserResponse
from services.user_service import get_user_by_email, create_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, summary="Register a new user")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email is already registered"
        )

    created_user = create_user(db=db, user=user)
    return created_user