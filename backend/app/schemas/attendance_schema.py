from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    employee_id: int
    employee_name: str