from sqlalchemy.orm import Session
from models import User, Subscription
from utils.hashing import verify_password
from utils.hashing import decode_jwt


def get_user_by_email(db: Session, email: str):
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate user with email and password."""
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password):
        return None
    return user

def get_current_user(db: Session, token: str):
    """Get the current user from JWT token."""
    payload = decode_jwt(token)
    if not payload:
        return None

    email = payload.get("sub")
    return get_user_by_email(db, email)

def get_user_points(db: Session, token:str):
    user=get_current_user(db, token)
    return db.query(Subscription).filter(Subscription.id_Subscription == user.fk_Subscription).first().points

def use_points(db: Session, token: str, amount: int) -> bool:
    user = get_current_user(db, token)
    subscription = db.query(Subscription).filter(Subscription.id_Subscription == user.fk_Subscription).first()

    if not subscription or subscription.points < amount:
        return False

    subscription.points -= amount
    db.commit()
    return True