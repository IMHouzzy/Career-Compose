from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from fastapi.responses import JSONResponse
import os
from utils.text_extraction import extract_text_from_pdf, extract_text_from_docx
from utils.gemini_api import analyze_text_with_gemini, cv_analyze_for_job_text_with_gemini
from sqlalchemy.orm import Session
from database import get_db
from services.user_service import save_or_update_analysis, save_or_update_cv_text, save_or_update_cv_recommendations
from services.auth_service import get_current_user
from models import CVAnalysis,CVTips, CV
import json

router = APIRouter()

@router.post("/analyze-cv/{language}")
async def analyze_cv(
    language: str,  
    token: str = Form(...),  
    file: UploadFile = File(...),
    selected_jobs: str = Form(...),
    db: Session = Depends(get_db)
):
    if language not in ["lt", "en"]:
        raise HTTPException(status_code=400, detail="Unsupported language. Use 'lt' or 'en'.")

    file_location = f"temp/{file.filename}"
    os.makedirs("temp", exist_ok=True)

    try:
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())

        if file.filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_location)
        elif file.filename.endswith(".docx"):
            text = extract_text_from_docx(file_location)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)

    user = get_current_user(db, token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user.id_User

    save_or_update_cv_text(db, user_id=user_id, text=text)

    ai_result = analyze_text_with_gemini(text, language, selected_jobs)
    saved_analysis = save_or_update_analysis(db, user_id=user_id, analysis=ai_result)

    return JSONResponse(
        content={"message": "Analysis saved", "data": saved_analysis},
        headers={"Content-Type": "application/json; charset=utf-8"}
    )


@router.get("/analysis/{token}")
def get_analysis(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user.id_User
    analysis = db.query(CVAnalysis).filter(CVAnalysis.user_id == user_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found.")
    
    try:
        job_recommendations = json.loads(analysis.job_recommendations) if analysis.job_recommendations else []
        skills = json.loads(analysis.skills) if analysis.skills else []
        career_paths = json.loads(analysis.career_paths) if analysis.career_paths else []
        soft_skills = json.loads(analysis.soft_skills) if analysis.soft_skills else []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON for user_id {user_id}: {str(e)}")
        job_recommendations = []
        skills = []
        career_paths = []
        soft_skills = []
    
    response = {
        "skills": skills,
        "is_IT": analysis.is_IT,
        "job_recommendations": job_recommendations,
        "soft_skills": soft_skills,
        "career_paths": career_paths,
    }
    
    return JSONResponse(content=response, headers={"Content-Type": "application/json; charset=utf-8"})

@router.get("/check-cv/{token}")
def check_cv_exists(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user.id_User
    existing_cv = db.query(CV).filter(CV.fk_User == user_id).first()

    return JSONResponse(content={"exists": bool(existing_cv)})


@router.post("/cv-recommendation/{language}")
async def cv_recommendation(
    language: str,
    token: str = Form(...),
    jobDescription: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    if language not in ["lt", "en"]:
        raise HTTPException(status_code=400, detail="Unsupported language. Use 'lt' or 'en'.")

    user = get_current_user(db, token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user.id_User
    text = None

    # If a new file is uploaded, extract text and update DB
    if file:
        file_location = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)

        try:
            with open(file_location, "wb") as buffer:
                buffer.write(await file.read())

            if file.filename.endswith(".pdf"):
                text = extract_text_from_pdf(file_location)
            elif file.filename.endswith(".docx"):
                text = extract_text_from_docx(file_location)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")
        finally:
            if os.path.exists(file_location):
                os.remove(file_location)

        # Save/update CV in DB
        save_or_update_cv_text(db, user_id=user_id, text=text)

    else:
        # No file uploaded, check if user has existing CV
        existing_cv = db.query(CV).filter(CV.fk_User == user_id).first()
        if existing_cv:
            text = existing_cv.cv_text
        else:
            raise HTTPException(status_code=400, detail="No CV found. Please upload a PDF or DOCX.")

    # Analyze and save AI results
    ai_result = cv_analyze_for_job_text_with_gemini(text, jobDescription, language)
    saved_analysis = save_or_update_cv_recommendations(db, user_id=user_id, analysis=ai_result)

    return JSONResponse(
        content={"message": "Analysis saved", "data": saved_analysis},
        headers={"Content-Type": "application/json; charset=utf-8"}
    )


@router.get("/get-cv-recommendation/{token}")
def get_cv_recommendation(token: str, db: Session = Depends(get_db)):
    user = get_current_user(db, token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user.id_User
    analysis = db.query(CVTips).filter(CVTips.user_id == user_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found.")

    try:
        cv_tips = json.loads(analysis.cv_tips) if analysis.cv_tips else []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON for user_id {user_id}: {str(e)}")
        cv_tips = []
    
    response = {
        "cv_tips": cv_tips,
        "match_level": analysis.match_level,
        "summary_analysis": analysis.summary_analysis,
        }

    return JSONResponse(content=response, headers={"Content-Type": "application/json; charset=utf-8"})