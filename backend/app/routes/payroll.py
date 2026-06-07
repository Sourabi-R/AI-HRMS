from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.payroll import Payroll
from app.schemas.payroll_schema import PayrollCreate

router = APIRouter(
    prefix="/payroll",
    tags=["Payroll"]
)


@router.post("/")
def create_payroll(
    payroll: PayrollCreate,
    db: Session = Depends(get_db)
):
    net_salary = (
        payroll.basic_salary
        + payroll.bonus
        - payroll.tax
    )

    payroll_record = Payroll(
        employee_id=payroll.employee_id,
        employee_name=payroll.employee_name,
        basic_salary=payroll.basic_salary,
        bonus=payroll.bonus,
        tax=payroll.tax,
        net_salary=net_salary
    )

    db.add(payroll_record)
    db.commit()
    db.refresh(payroll_record)

    return payroll_record


@router.get("/")
def get_payrolls(
    db: Session = Depends(get_db)
):
    return db.query(Payroll).all()


@router.get("/{employee_id}")
def get_payroll(
    employee_id: int,
    db: Session = Depends(get_db)
):
    payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee_id
    ).first()

    if not payroll:
        raise HTTPException(
            status_code=404,
            detail="Payroll record not found"
        )

    return payroll


@router.put("/{employee_id}")
def update_payroll(
    employee_id: int,
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db)
):
    payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee_id
    ).first()

    if not payroll:
        raise HTTPException(
            status_code=404,
            detail="Payroll record not found"
        )

    payroll.employee_name = payroll_data.employee_name
    payroll.basic_salary = payroll_data.basic_salary
    payroll.bonus = payroll_data.bonus
    payroll.tax = payroll_data.tax
    payroll.net_salary = (
        payroll_data.basic_salary
        + payroll_data.bonus
        - payroll_data.tax
    )

    db.commit()
    db.refresh(payroll)

    return payroll


@router.delete("/{employee_id}")
def delete_payroll(
    employee_id: int,
    db: Session = Depends(get_db)
):
    payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee_id
    ).first()

    if not payroll:
        raise HTTPException(
            status_code=404,
            detail="Payroll record not found"
        )

    db.delete(payroll)
    db.commit()

    return {
        "message": "Payroll deleted successfully"
    }