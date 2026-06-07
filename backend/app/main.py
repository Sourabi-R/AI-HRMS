import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.database.database import engine
from app.database.models import Base
from app.database.database import SessionLocal
from app.services.jwt_service import hash_password

# models
from app.models.user import User
from app.models.employee import Employee
from app.models.attendance import Attendance, AttendanceRequest
from app.models.payroll import Payroll
from app.models.performance import Performance
from app.models.job import Job
from app.models.candidate import Candidate

# routes
from app.routes.auth import router as auth_router
from app.routes.employees import router as employee_router
from app.routes.attendance import router as attendance_router
from app.routes.attendance_requests import router as attendance_requests_router
from app.routes.payroll import router as payroll_router
from app.routes.performance import router as performance_router
from app.routes.jobs import router as jobs_router
from app.routes.candidates import router as candidates_router
from app.routes.dashboard import router as dashboard_router
from app.routes.resume_screening import router as resume_screening_router

app = FastAPI(title="AI HRMS", version="1.0.0")

# Static files for resume download
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")),
    name="static"
)

# CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables
Base.metadata.create_all(bind=engine)

# Ensure candidate table supports role field for applicant tracking
with engine.connect() as conn:
    pragma_info = conn.execute(text("PRAGMA table_info(candidates)"))
    columns = [row[1] for row in pragma_info]
    if "role" not in columns:
        conn.execute(text('ALTER TABLE candidates ADD COLUMN role TEXT DEFAULT "Applicant"'))

# Seed basic sample data so dashboard has content on fresh DB
def seed_sample_data():
    db = SessionLocal()
    try:
        # Users
        ucount = db.query(User).count()
        if ucount == 0:
            admin = User(name="Admin User", email="admin@gmail.com", password=hash_password("Admin@123"), role="admin")
            hr = User(name="Ramesh HR", email="ramesh@gmail.com", password=hash_password("Ramesh@123"), role="hr")
            emp = User(name="Sourabi", email="sourabi@gmail.com", password=hash_password("Sourabi@123"), role="employee")
            db.add_all([admin, hr, emp])
            db.commit()

        # Employees
        ecount = db.query(Employee).count()
        if ecount == 0:
            emp1 = Employee(employee_id="EMP001", name="John Doe", email="john@gmail.com", department="IT", designation="Software Engineer", salary=50000)
            emp2 = Employee(employee_id="EMP002", name="Jane Smith", email="jane@gmail.com", department="HR", designation="HR Manager", salary=60000)
            db.add_all([emp1, emp2])
            db.commit()

        # Jobs
        jcount = db.query(Job).count()
        if jcount == 0:
            job1 = Job(title="Backend Engineer", department="Engineering", description="Build APIs with FastAPI", required_skills="Python,FastAPI,SQL", salary=70000)
            job2 = Job(title="ML Engineer", department="AI", description="Work on ML models", required_skills="Python,ML,TensorFlow", salary=90000)
            db.add_all([job1, job2])
            db.commit()

        # Candidates
        ccount = db.query(Candidate).count()
        if ccount == 0:
            cand1 = Candidate(name="Sourabi R", email="sourabi@gmail.com", resume_path="", role="Applicant", status="Applied")
            cand2 = Candidate(name="Kiddoo", email="kiddoo@gmail.com", resume_path="", role="Applicant", status="Applied")
            db.add_all([cand1, cand2])
            db.commit()
    finally:
        db.close()

seed_sample_data()

# include routers
app.include_router(auth_router)
app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(attendance_requests_router)
app.include_router(payroll_router)
app.include_router(performance_router)
app.include_router(jobs_router)
app.include_router(candidates_router)
app.include_router(dashboard_router)
app.include_router(resume_screening_router)

@app.get("/")
def home():
    return {
        "message": "AI HRMS Backend Running 🚀"
    }