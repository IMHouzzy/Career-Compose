# main
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cv_analysis, login, register, profile, jobs, courses,checkout,stripe, subscriptions
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes

app.include_router(cv_analysis.router, prefix="/cv", tags=["CV Analysis"])
app.include_router(login.router, prefix="/user", tags=["Login"])
app.include_router(register.router, prefix="/user", tags=["Register"])
app.include_router(profile.router, prefix="/user", tags=["Get user"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(courses.router, prefix="/courses", tags=["Recommended courses"])
app.include_router(checkout.router, prefix="/payment", tags=["Payment"] )
app.include_router(stripe.router, tags=["Stripe"] )
app.include_router(subscriptions.router, prefix="/subscription", tags=["Subscription"] )

