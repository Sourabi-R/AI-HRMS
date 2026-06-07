from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.database import get_db
from app.models.attendance import Attendance
from app.schemas.attendance_schema import AttendanceCreate

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post("/checkin")
def check_in(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):
    record = Attendance(
        employee_id=attendance.employee_id,
        employee_name=attendance.employee_name,
        check_in=datetime.utcnow(),
        status="Present"
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "message": "Check In Successful",
        "attendance_id": record.id
    }


@router.put("/checkout/{attendance_id}")
def check_out(
    attendance_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Attendance Record Not Found"
        )

    record.check_out = datetime.utcnow()

    db.commit()

    return {
        "message": "Check Out Successful"
    }


@router.get("/")
def get_attendance(
    db: Session = Depends(get_db)
):
    return db.query(Attendance).all()