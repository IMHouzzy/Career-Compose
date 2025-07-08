from sqlalchemy.orm import Session
from datetime import datetime
from models import User, Subscription, CVAnalysis, Plan,CV,CVTips
from schemas import UserCreate
from utils.hashing import hash_password
import json
from fastapi import HTTPException
def get_user_by_email(db: Session, email: str):
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()


def create_subscription(db: Session):
    """Create a new free subscription."""
    
    # Gauti "free" planą (fk_Plan = 1 arba pagal plan_name = "free", priklauso kaip nori filtruoti)
    free_plan = db.query(Plan).filter(Plan.id_Plan == 1).first()
    if not free_plan:
        raise Exception("Free plan not found in the database.")

    db_subscription = Subscription(
        date_from=datetime.today().date(),  # tik data
        date_to=None,
        user_credit_amount=free_plan.credit_amount,
        ads_amount_per_day=4,
        last_ads_reset=datetime.now(),  # data + laikas
        fk_Plan=free_plan.id_Plan
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def create_user(db: Session, user: UserCreate):
    """Create a new user with a free subscription."""
    db_subscription = create_subscription(db)
    hashed_password = hash_password(user.password)

    db_user = User(
        name=user.name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        fk_Subscription=db_subscription.id_Subscription  
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def save_or_update_cv_text(db: Session, user_id: int, text: str):
    existing_cv = db.query(CV).filter(CV.fk_User == user_id).first()
    
    if existing_cv:
        existing_cv.cv_text = text
    else:
        new_cv = CV(fk_User=user_id, cv_text=text)
        db.add(new_cv)

    db.commit()

def save_or_update_analysis(db: Session, user_id: int, analysis: dict):
    existing = db.query(CVAnalysis).filter(CVAnalysis.user_id == user_id).first()

    serialized_analysis = {
        "skills": json.dumps(analysis["skills"], ensure_ascii=False),
        "is_IT": analysis["is_IT"],
        "job_recommendations": json.dumps(analysis["job_recommendations"], ensure_ascii=False),
        "career_paths": json.dumps(analysis["career_paths"], ensure_ascii=False),
        "soft_skills": json.dumps(analysis["soft_skills"], ensure_ascii=False),
    }

    if existing:
        existing.skills = serialized_analysis["skills"]
        existing.is_IT = serialized_analysis["is_IT"]
        existing.job_recommendations = serialized_analysis["job_recommendations"]
        existing.career_paths = serialized_analysis["career_paths"]
        existing.soft_skills = serialized_analysis["soft_skills"]
    else:
        existing = CVAnalysis(
            user_id=user_id,
            skills=serialized_analysis["skills"],
            is_IT=serialized_analysis["is_IT"],
            job_recommendations=serialized_analysis["job_recommendations"],
            career_paths=serialized_analysis["career_paths"],
            soft_skills=serialized_analysis["soft_skills"],
        )
        db.add(existing)
    
    db.commit()
    db.refresh(existing)
    
    return {
        "user_id": existing.user_id,
        "skills": json.loads(existing.skills),
        "is_IT": existing.is_IT,
        "job_recommendations": json.loads(existing.job_recommendations),
        "career_paths": json.loads(existing.career_paths),
        "soft_skills": json.loads(existing.soft_skills),
    }

def save_or_update_cv_recommendations(db: Session, user_id: int, analysis: dict):
   
    existing = db.query(CVTips).filter(CVTips.user_id == user_id).first()

    serialized_analysis = {
        "cv_tips": json.dumps(analysis["cv_tips"], ensure_ascii=False),
        "match_level": analysis["match_level"],
        "summary_analysis": analysis["summary_analysis"],
    }

    if existing:
        existing.cv_tips = serialized_analysis["cv_tips"]
        existing.match_level = serialized_analysis["match_level"]
        existing.summary_analysis = serialized_analysis["summary_analysis"]
    else:
        existing = CVTips(
            user_id=user_id,
            cv_tips=serialized_analysis["cv_tips"],
            match_level=serialized_analysis["match_level"],
            summary_analysis=serialized_analysis["summary_analysis"],
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)

    return {
        "user_id": existing.user_id,
        "cv_tips": json.loads(existing.cv_tips),
        "match_level": existing.match_level,
        "summary_analysis": existing.summary_analysis
    }