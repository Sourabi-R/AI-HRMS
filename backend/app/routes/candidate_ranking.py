from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
import os

from pypdf import PdfReader
from app.database.database import get_db
from app.models.candidate import Candidate
from app.models.job import Job
from app.security.security import require_role

import google.generativeai as genai
from app.config.settings import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter(
    prefix="/ranking",
    tags=["AI Candidate Ranking"]
)

STATIC_RESUME_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "static", "resumes")
)


def extract_resume_text(resume_path: str) -> str:
    filename = os.path.basename(resume_path)
    absolute_path = os.path.join(STATIC_RESUME_DIR, filename)

    if not os.path.exists(absolute_path):
        return resume_path

    try:
        reader = PdfReader(absolute_path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception:
        return resume_path


def rank_with_ai(job_text, candidates):
    prompt = f"""
    You are an AI HR assistant.

    Job Description:
    {job_text}

    Candidates:
    {candidates}

    TASK:
    - Score each candidate out of 100
    - Rank them from best to worst
    - Return ONLY JSON format like:

    [
      {{
        "name": "Candidate Name",
        "email": "email",
        "score": 95,
        "reason": "why they match"
      }}
    ]
    """

    response = model.generate_content(prompt)
    return response.text


@router.get("/{job_id}")
def rank_candidates(job_id: int, db: Session = Depends(get_db), user=Depends(require_role("hr"))):
    job = db.query(Job).filter(Job.id == job_id).first()
    candidates = db.query(Candidate).all()

    if not job:
        return {"error": "Job not found"}

    candidate_list = []
    for c in candidates:
        candidate_list.append({
            "name": c.name,
            "email": c.email,
            "status": c.status,
            "resume": extract_resume_text(c.resume_path)
        })

    result = rank_with_ai(job.description, candidate_list)

    return {
        "job": job.title,
        "ranking": result
    }
