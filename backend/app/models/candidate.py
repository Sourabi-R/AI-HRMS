from sqlalchemy import Column, Integer, String, Text

from app.database.models import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    email = Column(String)

    resume_path = Column(String)
    role = Column(String, default="Applicant")

    status = Column(String, default="Applied")

    # Extracted fields
    phone = Column(String, nullable=True)
    skills = Column(Text, nullable=True)  # JSON/text list
    education = Column(Text, nullable=True)
    experience_years = Column(Integer, nullable=True)
    certifications = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    location = Column(String, nullable=True)

    # AI analysis / scoring
    resume_score = Column(Integer, nullable=True)
    job_fit = Column(Integer, nullable=True)
    recommendation = Column(String, nullable=True)
    ai_analysis = Column(Text, nullable=True)