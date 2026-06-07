from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.employee import Employee
from app.models.job import Job
from app.models.candidate import Candidate

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# =========================
# DASHBOARD STATS API
# =========================
@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):

    employees_count = db.query(Employee).count()
    jobs_count = db.query(Job).count()
    candidates_count = db.query(Candidate).count()

    # AI status breakdown
    hire_count = db.query(Candidate).filter(Candidate.status == "Hire").count()
    reject_count = db.query(Candidate).filter(Candidate.status == "Reject").count()
    consider_count = db.query(Candidate).filter(Candidate.status == "Consider").count()
    applied_count = db.query(Candidate).filter(Candidate.status == "Applied").count()

    return {
        "employees": employees_count,
        "jobs": jobs_count,
        "candidates": candidates_count,
        "ai_breakdown": {
            "hire": hire_count,
            "reject": reject_count,
            "consider": consider_count,
            "applied": applied_count
        }
    }