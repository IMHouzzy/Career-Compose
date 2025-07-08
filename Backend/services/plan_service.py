# services/plan_service.py

from sqlalchemy.orm import Session
from models import Plan
from fastapi import HTTPException

def get_all_plans(db: Session):
    plans = db.query(Plan).all()
    if not plans:
        raise HTTPException(status_code=404, detail="No plans found")

    return [
        {
            "id_Plan": plan.id_Plan,
            "plan_name": plan.plan_name,
            "credit_amount": plan.credit_amount,
            "duration_days": plan.duration_days,
            "price": float(plan.price),
            "discount": float(plan.discount),
            "all_courses_access": plan.all_courses_access,
            "courses_recommendations_access": plan.courses_recommendations_access,
            "all_job_access": plan.all_job_access,
            "job_recommendations_access": plan.job_recommendations_access,
            "different_file_format_access": plan.different_file_format_access
        }
        for plan in plans
    ]
