from pydantic import BaseModel
from typing import Optional

class CandidateCreate(BaseModel):
    name: str
    email: str
    resume_path: str
    role: str = "Applicant"
    status: str = "Applied"

    # Optional extracted fields
    phone: Optional[str] = None
    skills: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    certifications: Optional[str] = None
    projects: Optional[str] = None
    location: Optional[str] = None

    resume_score: Optional[int] = None
    job_fit: Optional[int] = None
    recommendation: Optional[str] = None
    ai_analysis: Optional[str] = None
