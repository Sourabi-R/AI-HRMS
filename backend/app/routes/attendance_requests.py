from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date
from pydantic import BaseModel

from app.database.database import get_db
from app.models.attendance import AttendanceRequest, Attendance
from app.models.employee import Employee
from app.models.user import User
from app.security.security import require_role, verify_token

router = APIRouter(
    prefix="/attendance-requests",
    tags=["Attendance Requests"]
)


class AttendanceRequestCreate(BaseModel):
    attendance_date: date
    request_type: str  # "present" or "leave"
    reason: Optional[str] = None


class AttendanceRequestUpdate(BaseModel):
    status: str  # "Approved" or "Rejected"


# =========================
# EMPLOYEE: CREATE ATTENDANCE REQUEST
# =========================
@router.post("/")
async def create_attendance_request(
    request: AttendanceRequestCreate,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Employee creates attendance or leave request"""
    employee_id = token.get("user_id")
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    employee_name = None

    if employee:
        employee_name = employee.name
    else:
        user = db.query(User).filter(User.id == employee_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Employee not found")
        employee_name = user.name or user.email

    # Check if request already exists for this date
    existing = db.query(AttendanceRequest).filter(
        AttendanceRequest.employee_id == employee_id,
        AttendanceRequest.attendance_date == request.attendance_date
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Request already exists for this date")

    new_request = AttendanceRequest(
        employee_id=employee_id,
        employee_name=employee_name,
        attendance_date=request.attendance_date,
        request_type=request.request_type,
        reason=request.reason,
        status="Pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "id": new_request.id,
        "message": f"{request.request_type.capitalize()} request submitted for approval",
        "request": new_request
    }


# =========================
# EMPLOYEE: GET OWN REQUESTS
# =========================
@router.get("/my-requests")
async def get_my_requests(
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Get current employee's requests"""
    employee_id = token.get("user_id")
    
    requests = db.query(AttendanceRequest).filter(
        AttendanceRequest.employee_id == employee_id
    ).order_by(AttendanceRequest.created_at.desc()).all()

    return requests


# =========================
# HR: GET ALL PENDING REQUESTS
# =========================
@router.get("/pending")
async def get_pending_requests(
    db: Session = Depends(get_db),
    user=Depends(require_role("hr"))
):
    """HR views all pending requests"""
    requests = db.query(AttendanceRequest).filter(
        AttendanceRequest.status == "Pending"
    ).order_by(AttendanceRequest.created_at.asc()).all()

    return requests


# =========================
# HR: GET ALL REQUESTS (FOR HISTORY)
# =========================
@router.get("/")
async def get_all_requests(
    db: Session = Depends(get_db),
    user=Depends(require_role("hr"))
):
    """HR views all requests with status"""
    requests = db.query(AttendanceRequest).order_by(
        AttendanceRequest.created_at.desc()
    ).all()

    return requests


# =========================
# HR: APPROVE/REJECT REQUEST
# =========================
@router.put("/{request_id}")
async def update_request(
    request_id: int,
    update: AttendanceRequestUpdate,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token),
    user=Depends(require_role("hr"))
):
    """HR approves or rejects attendance/leave request"""
    
    attendance_request = db.query(AttendanceRequest).filter(
        AttendanceRequest.id == request_id
    ).first()
    
    if not attendance_request:
        raise HTTPException(status_code=404, detail="Request not found")

    attendance_request.status = update.status
    attendance_request.approved_by = token.get("email")
    attendance_request.approval_date = datetime.utcnow()

    # If approved and request_type is "present", create attendance record
    if update.status == "Approved" and attendance_request.request_type == "present":
        new_attendance = Attendance(
            employee_id=attendance_request.employee_id,
            employee_name=attendance_request.employee_name,
            status="Present"
        )
        db.add(new_attendance)

        # Credit salary to employee (in payroll system)
        # This would be implemented in the payroll module

    db.commit()
    db.refresh(attendance_request)

    return {
        "message": f"Request {update.status.lower()}",
        "request": attendance_request
    }
