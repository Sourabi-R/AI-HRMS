from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.job import Job
from app.schemas.job_schema import JobCreate

# 🔐 IMPORT SECURITY
from app.security.security import verify_token, require_role

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

# =========================
# CREATE JOB (HR + ADMIN ONLY)
# =========================
@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("hr"))
):
    new_job = Job(
        title=job.title,
        department=job.department,
        description=job.description,
        required_skills=job.required_skills,
        salary=job.salary
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# =========================
# GET ALL JOBS (LOGIN REQUIRED)
# =========================
@router.get("/")
def get_jobs(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    return db.query(Job).all()


# =========================
# GET SINGLE JOB (LOGIN REQUIRED)
# =========================
@router.get("/{job_id}")
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


# =========================
# UPDATE JOB (HR + ADMIN ONLY)
# =========================
@router.put("/{job_id}")
def update_job(
    job_id: int,
    job_data: JobCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("hr"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.title = job_data.title
    job.department = job_data.department
    job.description = job_data.description
    job.required_skills = job_data.required_skills
    job.salary = job_data.salary

    db.commit()
    db.refresh(job)

    return job


# =========================
# DELETE JOB (ADMIN ONLY)
# =========================
@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}