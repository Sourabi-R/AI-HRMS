from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.performance import Performance
from app.schemas.performance_schema import PerformanceCreate

router = APIRouter(
    prefix="/performance",
    tags=["Performance"]
)


@router.post("/")
def create_performance(
    performance: PerformanceCreate,
    db: Session = Depends(get_db)
):
    record = Performance(
        employee_id=performance.employee_id,
        employee_name=performance.employee_name,
        goal=performance.goal,
        kpi_score=performance.kpi_score,
        manager_feedback=performance.manager_feedback,
        promotion_ready=performance.promotion_ready
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/")
def get_performance_records(
    db: Session = Depends(get_db)
):
    return db.query(Performance).all()


@router.get("/{employee_id}")
def get_performance_record(
    employee_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Performance).filter(
        Performance.employee_id == employee_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Performance record not found"
        )

    return record


@router.put("/{employee_id}")
def update_performance(
    employee_id: int,
    performance_data: PerformanceCreate,
    db: Session = Depends(get_db)
):
    record = db.query(Performance).filter(
        Performance.employee_id == employee_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Performance record not found"
        )

    record.employee_name = performance_data.employee_name
    record.goal = performance_data.goal
    record.kpi_score = performance_data.kpi_score
    record.manager_feedback = performance_data.manager_feedback
    record.promotion_ready = performance_data.promotion_ready

    db.commit()
    db.refresh(record)

    return record


@router.delete("/{employee_id}")
def delete_performance(
    employee_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Performance).filter(
        Performance.employee_id == employee_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Performance record not found"
        )

    db.delete(record)
    db.commit()

    return {
        "message": "Performance record deleted successfully"
    }