from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import uuid

from app.database.database import get_db
from app.models.candidate import Candidate
from app.security.security import require_role, require_roles

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)

RESUME_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "resumes")
os.makedirs(RESUME_DIR, exist_ok=True)


# =========================
# CREATE CANDIDATE (HR + ADMIN ONLY)
# =========================
@router.post("/")
async def create_candidate(
    name: str = Form(...),
    email: str = Form(...),
    status: str = Form("Applied"),
    role: str = Form("Applicant"),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(require_role("hr"))
):
    filename = f"{uuid.uuid4().hex}_{resume.filename}"
    save_path = os.path.join(RESUME_DIR, filename)

    with open(save_path, "wb") as f:
        f.write(await resume.read())

    resume_url = f"/static/resumes/{filename}"

    new_candidate = Candidate(
        name=name,
        email=email,
        resume_path=resume_url,
        role=role,
        status=status,
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return new_candidate


# =========================
# GET ALL CANDIDATES (HR + ADMIN ONLY)
# =========================
@router.get("/")
def get_candidates(
    db: Session = Depends(get_db),
    user=Depends(require_roles("hr", "employee"))
):
    return db.query(Candidate).all()


# =========================
# GET SINGLE CANDIDATE (HR + EMPLOYEE + ADMIN)
# =========================
@router.get("/{candidate_id}")
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("hr", "employee"))
):
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate


# =========================
# DELETE CANDIDATE (ADMIN ONLY)
# =========================
@router.delete("/{candidate_id}")
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    db.delete(candidate)
    db.commit()

    return {"message": "Candidate deleted successfully"}
