from sqlalchemy import Column, Integer, String, Float

from app.database.models import Base


class Performance(Base):
    __tablename__ = "performance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer)

    employee_name = Column(String)

    goal = Column(String)

    kpi_score = Column(Float)

    manager_feedback = Column(String)

    promotion_ready = Column(String)