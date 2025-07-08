from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Course, CVAnalysis
from schemas import CourseResponse
import json
from utils.course_matcher import find_relevant_courses
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/recommended_courses/{token}", response_model=list[CourseResponse])
def get_recommended_courses(token: str, db: Session = Depends(get_db)):
    
    user=get_current_user(db, token)
    # 1) fetch everything
    courses  = db.query(Course).all()
    analysis = db.query(CVAnalysis).filter(CVAnalysis.user_id==user.id_User).first()

    # 2) parse & dedupe missing_skills
    job_recs = analysis.job_recommendations
    if isinstance(job_recs, str):
        job_recs = json.loads(job_recs)
    all_missing = []
    for rec in job_recs:
        all_missing += rec.get("missing_skills", [])
    unique_missing = list({s.strip() for s in all_missing})

    # 3) score courses
    # convert SQLAlchemy models to dicts if necessary:
    course_dicts = [
      {**c.__dict__, "Skills": c.Skills}  # adjust according to your attribute names
      for c in courses
    ]
    recommended = find_relevant_courses(unique_missing, course_dicts, top_n=12)

    return recommended

@router.get("/get_all_courses", response_model=list[CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.get("/get_course/{course_id}", response_model=CourseResponse)
def get_course_by_id(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id_Courses == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
