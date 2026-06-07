from sqlalchemy import Column, Integer, String

from app.database.models import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String, unique=True)

    name = Column(String)

    email = Column(String, unique=True)

    department = Column(String)

    designation = Column(String)

    salary = Column(Integer)