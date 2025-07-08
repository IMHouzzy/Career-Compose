from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import get_current_user
from utils.hashing import hash_password, verify_password
from schemas import UserUpdateRequest  # Reikia sukurti
from models import User, Payment, Plan

router = APIRouter()

@router.get("/get_User/{token}", summary="Verify token via URL with detailed information")
def Get_User_data(token: str, db: Session = Depends(get_db)):
    results= {
        "id_User": None,
        "name": None,
        "last_name": None,
        "email": None,
        "fk_Subscription": None
    }

    user = get_current_user(db, token)
    
    results["id_User"]=user.id_User
    results["name"]=user.name
    results["last_name"]=user.last_name
    results["email"]=user.email
    results["fk_Subscription"]=user.fk_Subscription
    
    return results

@router.put("/user_update", summary="Update user profile and password")
def update_user_profile(request: UserUpdateRequest, db: Session = Depends(get_db)):
    user = get_current_user(db, request.token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    # Tikrinam ar reikia keisti slaptažodį
    if request.new_password or request.repeat_password or request.current_password:
        if not request.current_password:
            raise HTTPException(status_code=400, detail="Reikia įvesti dabartinį slaptažodį")
        
        if not verify_password(request.current_password, user.password):
            raise HTTPException(status_code=400, detail="Neteisingas dabartinis slaptažodis")

        if request.new_password != request.repeat_password:
            raise HTTPException(status_code=400, detail="Nauji slaptažodžiai nesutampa")

        if verify_password(request.new_password, user.password):
            raise HTTPException(status_code=400, detail="Naujas slaptažodis negali sutapti su senuoju")

        user.password = hash_password(request.new_password)

    # Atnaujinam kitą informaciją
    user.name = request.name
    user.last_name = request.last_name
    user.email = request.email

    db.commit()
    db.refresh(user)

    return {"message": "Paskyra atnaujinta sėkmingai"}

@router.get("/get_user_token/{token}", summary="Verify token via URL with detailed information")
def Get_User_data(token: str, db: Session = Depends(get_db)):
    results= {
        "id_User": None,
        "name": None,
        "last_name": None,
        "email": None,
        "fk_Subscription": None
    }

    user = get_current_user(db, token)
    
    results["id_User"]=user.id_User
    results["name"]=user.name
    results["last_name"]=user.last_name
    results["email"]=user.email
    results["fk_Subscription"]=user.fk_Subscription
    
    return results

@router.get("/payment-history/{token}")
def get_payment_history(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)

    payments = (
        db.query(Payment)
        .filter(Payment.user_id == user.id_User)
        .order_by(Payment.payment_date.desc())
        .all()
    )

    return [
        {
            "plan_name": p.plan.plan_name if p.plan else "Unknown Plan",
            "amount": float(p.amount),
            "currency": p.currency,
            "date": p.payment_date.isoformat() if p.payment_date else None
        }
        for p in payments
    ]