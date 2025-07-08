from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Subscription, Plan
from database import get_db
from schemas import  WatchedAdRequest
from services.auth_service import get_current_user
from services.plan_service import get_all_plans
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/full/{subscription_id}")
def get_full_subscription(subscription_id: int, db: Session = Depends(get_db)):
    subscription = db.query(Subscription).filter(Subscription.id_Subscription == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail=f"Subscription not found. ID: {subscription_id}")

    # ⏱ Reset ads if 24 hours have passed
    now = datetime.now()
    if (
        subscription.last_ads_reset is None or
        now - subscription.last_ads_reset >= timedelta(hours=24)
    ):
        subscription.ads_amount_per_day = 4
        subscription.last_ads_reset = now
        db.commit()  # ✅ Save the update to the database

    plan = db.query(Plan).filter(Plan.id_Plan == subscription.fk_Plan).first()

    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan not found. ID: {subscription.fk_Plan}")

    return {
        "subscription": {
            "id_Subscription": subscription.id_Subscription,
            "date_from": subscription.date_from,
            "date_to": subscription.date_to,
            "user_credit_amount": subscription.user_credit_amount,
            "ads_amount_per_day": subscription.ads_amount_per_day,
            "last_ads_reset": subscription.last_ads_reset,
            "fk_Plan": subscription.fk_Plan,
        },
        "plan": {
            "id_Plan": plan.id_Plan,
            "plan_name": plan.plan_name,
            "credit_amount": plan.credit_amount,
        }
    }


@router.post("/deduct-one-credit/{token}")
def deduct_one_credit(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    subscription = db.query(Subscription).filter(user.fk_Subscription == Subscription.id_Subscription).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found for user")

    # Only deduct if user is on the free plan
    if subscription.fk_Plan == 1:
        if subscription.user_credit_amount is None:
            return {"message": "Unlimited credits. No deduction."}
        if subscription.user_credit_amount < 1:
            raise HTTPException(status_code=400, detail="Not enough credits")
        subscription.user_credit_amount -= 1
        db.commit()
        return {
            "message": "Deducted 1 credit",
            "remaining_credits": subscription.user_credit_amount
        }

    return {"message": "Paid plan. No deduction."}

@router.get("/has-credits/{token}")
def has_credits(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    subscription = (
        db.query(Subscription)
        .filter(user.fk_Subscription == Subscription.id_Subscription)
        .first()
    )
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found for user")

    # FREE PLAN
    if subscription.fk_Plan == 1:
        if subscription.user_credit_amount is None:
            return {"has_credits": True, "message": "Unlimited credits",
                "plan_id": subscription.fk_Plan}
        if subscription.user_credit_amount > 0:
            return {"has_credits": True, "remaining_credits": subscription.user_credit_amount}
        return {"has_credits": False, "message": "Not enough credits" ,
                "plan_id": subscription.fk_Plan}

    # PAID PLAN (unlimited)
    return {"has_credits": True, "message": "Unlimited plan",
                "plan_id": subscription.fk_Plan}


@router.post("/watched-ad/{token}")
def watched_ad(token: str, payload: WatchedAdRequest, db: Session = Depends(get_db)):
    watched_ads = payload.watched_ads

    user = get_current_user(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    subscription = db.query(Subscription).filter(Subscription.id_Subscription == user.fk_Subscription).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")



    if watched_ads > subscription.ads_amount_per_day:
        raise HTTPException(status_code=400, detail="Daily ad limit exceeded")

    # ✅ Calculate credits (2 ads = 1 credit)
    credits_earned = watched_ads // 2
    if credits_earned == 0:
        raise HTTPException(status_code=400, detail="Need to watch at least 2 ads to earn 1 credit")

    subscription.user_credit_amount += credits_earned
    subscription.ads_amount_per_day -= watched_ads
    db.commit()

    return {
        "message": f"Earned {credits_earned} credits for watching {watched_ads} ads",
        "new_credit_amount": subscription.user_credit_amount,
        "remaining_daily_ads": subscription.ads_amount_per_day
    }

@router.get("/plans")
def getplans(db: Session = Depends(get_db)):
    return get_all_plans(db)

@router.get("/get-plan/{token}", summary="Get user plan")
def get_user_plan(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    subscription_id = user.fk_Subscription
    subscription = db.query(Subscription).filter(Subscription.id_Subscription == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail=f"Subscription not found. ID: {subscription_id}")

    plan = db.query(Plan).filter(Plan.id_Plan == subscription.fk_Plan).first()
    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan not found. ID: {subscription.fk_Plan}")
    
    return {
        "id_Plan": plan.id_Plan,
        "plan_name": plan.plan_name,
        "credit_amount": plan.credit_amount,
    }