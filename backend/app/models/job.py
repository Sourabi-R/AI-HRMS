from sqlalchemy import Column, Integer, String

from app.database.models import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    department = Column(String)

    description = Column(String)

    required_skills = Column(String)

    salary = Column(Integer, nullable=True)