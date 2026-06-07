from pydantic import BaseModel


class PayrollCreate(BaseModel):
    employee_id: int
    employee_name: str
    basic_salary: float
    bonus: float = 0
    tax: float = 0