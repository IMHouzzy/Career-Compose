#PVP/Backend/routes/jobs.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Jobs, CVAnalysis 
from schemas import JobResponse
from utils.job_matcher import find_relevant_jobs
from services.auth_service import get_current_user
import json
router = APIRouter()


@router.post("/match_jobs_from_token/{token}")
def match_jobs_from_token(token: str, db: Session = Depends(get_db)):
    # Get CV analysis
    user = get_current_user(db, token)
    analysis = db.query(CVAnalysis).filter(CVAnalysis.user_id == user.id_User).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="CV analysis not found")
    
    # Parse job_recommendations from JSON string
    try:
        job_recommendations = json.loads(analysis.job_recommendations) if analysis.job_recommendations else []
    except json.JSONDecodeError:
        job_recommendations = []
    
    # Call job matcher
    relevant_jobs = find_relevant_jobs(job_recommendations)
    
    return {"matches": relevant_jobs}


@router.get("/all_jobs", response_model=list[JobResponse])
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(Jobs).all()

@router.get("/get_job/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Jobs).filter(Jobs.id_Jobs == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
