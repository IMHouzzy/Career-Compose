# routes/stripe.py
from fastapi import APIRouter, Request, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
import stripe
import os
import datetime
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db  # adjust to your actual DB import
from models import User, Subscription, Plan, Payment
from dateutil.relativedelta import relativedelta


router = APIRouter()

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")  

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db), stripe_signature: str = Header(None)):
    payload = await request.body()
    print("Webhook received")

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, endpoint_secret
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session["metadata"]["email"]
        plan_name = session["metadata"]["plan"]
        

        if not customer_email or not plan_name:
            return JSONResponse(status_code=400, content={"error": "Missing email or plan info"})

        user = db.query(User).filter(User.email == customer_email).first()
        plan = db.query(Plan).filter(Plan.plan_name==plan_name).first()
        if user:
            subscription=db.query(Subscription).filter(Subscription.id_Subscription==user.fk_Subscription).first()
            
            if subscription:
                subscription.fk_Plan = plan.id_Plan
                subscription.user_credit_amount =plan.credit_amount
                subscription.date_from = datetime.date.today()
                subscription.date_to =datetime.date.today()+relativedelta(days=plan.duration_days)
                print("Webhook received1")
                new_payment = Payment(
                    user_id=user.id_User,
                    stripe_session_id=session["id"],
                    plan_id=plan.id_Plan,
                    amount=(plan.price - plan.discount),
                    payment_status=session.get("payment_status", "paid"),
                    payment_date=datetime.datetime.utcnow()
                )
                db.add(new_payment)   
                db.commit()
    print("Webhook received2")


    return JSONResponse(status_code=200, content={"status": "success"})
