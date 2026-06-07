from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
import os

from pypdf import PdfReader
from app.database.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate
from app.security.security import require_role

import google.generativeai as genai
from app.config.settings import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter(
    prefix="/job-matching",
    tags=["AI Job Matching"]
)

STATIC_RESUME_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "static", "resumes")
)


def clean_json(text: str):
    return text.replace("```json", "").replace("```", "").strip()


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


@router.get("/{job_id}")
def match_candidates(job_id: int, db: Session = Depends(get_db), user=Depends(require_role("hr"))):
    job = db.query(Job).filter(Job.id == job_id).first()
    candidates = db.query(Candidate).all()

    if not job:
        return {"error": "Job not found"}

    results = []

    for c in candidates:
        resume_text = extract_resume_text(c.resume_path)

        prompt = f"""
        You are an AI HR assistant.

        Compare JOB and CANDIDATE.

        RETURN ONLY VALID JSON (no text, no markdown):

        {{
          "name": "{c.name}",
          "email": "{c.email}",
          "match_score": 0,
          "matched_skills": [],
          "missing_skills": [],
          "recommendation": "Hire / Consider / Reject",
          "reason": "short explanation"
        }}

        JOB:
        Title: {job.title}
        Description: {job.description}
        Required Skills: {job.required_skills}

        CANDIDATE:
        Name: {c.name}
        Email: {c.email}
        Resume: {resume_text}
        """

        response = model.generate_content(prompt)

        try:
            parsed = json.loads(clean_json(response.text))
        except Exception:
            parsed = {
                "name": c.name,
                "email": c.email,
                "match_score": 0,
                "matched_skills": [],
                "missing_skills": [],
                "recommendation": "Consider",
                "reason": "AI parsing error"
            }

        results.append(parsed)

    results = sorted(results, key=lambda x: x.get("match_score", 0), reverse=True)

    return {
        "job_title": job.title,
        "total_candidates": len(results),
        "results": results
    }
