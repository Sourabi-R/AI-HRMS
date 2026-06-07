from sqlalchemy import Column, Integer, Float, String

from app.database.models import Base


class Payroll(Base):
    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer)

    employee_name = Column(String)

    basic_salary = Column(Float)

    bonus = Column(Float, default=0)

    tax = Column(Float, default=0)

    net_salary = Column(Float)