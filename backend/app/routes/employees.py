from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.employee import Employee
from app.schemas.employee_schema import EmployeeCreate

# 🔐 JWT PROTECTION IMPORT
from app.services.dependencies import get_current_user

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


# =========================
# CREATE EMPLOYEE (PROTECTED)
# =========================
@router.post("/")
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)   # 🔐 AUTH ADDED
):
    new_employee = Employee(
        employee_id=employee.employee_id,
        name=employee.name,
        email=employee.email,
        department=employee.department,
        designation=employee.designation,
        salary=employee.salary
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return {
        "message": "Employee Created Successfully",
        "employee_id": new_employee.id
    }


# =========================
# GET ALL EMPLOYEES (PROTECTED)
# =========================
@router.get("/")
def get_employees(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)   # 🔐 AUTH ADDED
):
    employees = db.query(Employee).all()
    return employees


# =========================
# GET EMPLOYEE BY ID (PROTECTED)
# =========================
@router.get("/{employee_id}")
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)   # 🔐 AUTH ADDED
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee Not Found"
        )

    return employee


# =========================
# UPDATE EMPLOYEE (PROTECTED)
# =========================
@router.put("/{employee_id}")
def update_employee(
    employee_id: int,
    updated_employee: EmployeeCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)   # 🔐 AUTH ADDED
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee Not Found"
        )

    employee.employee_id = updated_employee.employee_id
    employee.name = updated_employee.name
    employee.email = updated_employee.email
    employee.department = updated_employee.department
    employee.designation = updated_employee.designation
    employee.salary = updated_employee.salary

    db.commit()

    return {
        "message": "Employee Updated Successfully"
    }


# =========================
# DELETE EMPLOYEE (PROTECTED)
# =========================
@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)   # 🔐 AUTH ADDED
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee Not Found"
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee Deleted Successfully"
    }