from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    HR = "hr"
    EMPLOYEE = "employee"