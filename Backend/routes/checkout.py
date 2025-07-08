# routes/checkout.py
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from utils.stripe import create_checkout
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        plan = body.get("plan")
        email = body.get("email")

        if not plan or not email:
            return JSONResponse({"error": "Plan or email not provided"}, status_code=400)
        print(plan)
        session = create_checkout(plan, email, db)
        print('hi')
        return JSONResponse({"id": session.id})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)