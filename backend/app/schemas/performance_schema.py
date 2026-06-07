from pydantic import BaseModel


class PerformanceCreate(BaseModel):
    employee_id: int
    employee_name: str
    goal: str
    kpi_score: float
    manager_feedback: str
    promotion_ready: str