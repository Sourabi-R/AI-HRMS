from sqlalchemy import Column, Integer, String, DateTime, Date
from datetime import datetime, date

from app.database.models import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer)

    employee_name = Column(String)

    check_in = Column(DateTime, default=datetime.utcnow)

    check_out = Column(DateTime, nullable=True)

    status = Column(String, default="Present")


class AttendanceRequest(Base):
    __tablename__ = "attendance_requests"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer)

    employee_name = Column(String)

    attendance_date = Column(Date)

    request_type = Column(String)  # "present" or "leave"

    reason = Column(String, nullable=True)

    status = Column(String, default="Pending")  # Pending, Approved, Rejected

    created_at = Column(DateTime, default=datetime.utcnow)

    approved_by = Column(String, nullable=True)

    approval_date = Column(DateTime, nullable=True)