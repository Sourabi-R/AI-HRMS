from typing import Optional
from pydantic import BaseModel

class JobCreate(BaseModel):
    title: str
    department: str
    description: str
    required_skills: str
    salary: Optional[int] = None