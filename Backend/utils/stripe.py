# utils/stripe
import stripe
import os
from database import get_db
from sqlalchemy.orm import Session
from services.plan_service import get_all_plans
from decimal import Decimal, ROUND_HALF_UP
from fastapi import  Depends
from models import Plan


stripe.api_key =  os.getenv("STRIPE_SECRET_KEY") 

def create_checkout(plan_name: str, email: str, db: Session):
    # Fetch the plan from the database
    plan = db.query(Plan).filter(Plan.plan_name == plan_name).first()
    if not plan:
        raise ValueError("Invalid plan")

    # Calculate the amount in cents (Stripe requires cents)
    amount = Decimal(plan.price - plan.discount).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    amount_cents = int(amount * 100)
    duration = plan.duration_days

    # Create Stripe checkout session
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "eur",
                "product_data": {"name": f"{plan_name} Plan ({duration} days)"},
                "unit_amount": amount_cents,
            },
            "quantity": 1,
        }],
        mode="payment",
        metadata={
            "plan": plan_name,
            "email": email,
        },
        success_url="http://localhost:3000/PaymentSuccess",
        cancel_url="http://localhost:3000/PaymentCancel",
    )

    return session