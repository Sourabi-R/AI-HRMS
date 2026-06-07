# 🚀 AI-HRMS

### AI-Powered Human Resource Management System

![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)
![JWT](https://img.shields.io/badge/JWT-Authentication-red)

An intelligent Human Resource Management System that automates recruitment, employee management, attendance tracking, payroll processing, performance evaluation, resume screening, candidate ranking, and job matching using Artificial Intelligence.

---

# 📌 Overview

AI-HRMS is a complete AI-powered HR platform designed to simplify and automate modern HR operations.

The platform helps organizations:

* Manage employees efficiently
* Automate recruitment workflows
* Screen resumes using AI
* Rank candidates intelligently
* Match candidates with jobs
* Track attendance and payroll
* Evaluate employee performance
* Manage HR activities through role-based access

---

# ✨ Features

## 🔐 Authentication & Authorization

* Secure Login & Registration
* JWT Token Authentication
* Role-Based Access Control (RBAC)
* Protected Routes
* Session Management

---

## 👨‍💼 Employee Management

* Add Employees
* View Employee Details
* Update Employee Information
* Delete Employees
* Search Employees

---

## 📅 Attendance Management

* Mark Attendance
* View Attendance Records
* Attendance History
* Employee Attendance Tracking

---

## 💰 Payroll Management

* Salary Management
* Payroll Records
* Salary Tracking
* Employee Payment History

---

## ⭐ Performance Management

* Performance Evaluation
* Employee Ratings
* Review Records
* Performance Analytics

---

## 💼 Job Management

* Create Job Openings
* Update Job Listings
* Delete Job Posts
* Manage Recruitment Pipeline

---

## 👥 Candidate Management

* Add Candidates
* Candidate Tracking
* Candidate Profiles
* Recruitment Workflow Management

---

## 🤖 AI Resume Screening

Upload candidate resumes and receive:

* Skill Extraction
* Resume Analysis
* Candidate Suitability Score
* AI Recommendations
* Recruitment Insights

---

## 🧠 AI Candidate Ranking

Automatically ranks candidates based on:

* Skills Match
* Experience
* Resume Quality
* Job Requirements
* AI Evaluation Score

---

## 🎯 AI Job Matching

Intelligent matching between:

* Candidate Skills
* Job Requirements
* Experience Level
* Recruitment Criteria

Provides:

* Match Percentage
* Best Candidate Suggestions
* Hiring Recommendations

---

## 📊 Dashboard Analytics

Real-time analytics showing:

* Total Employees
* Total Candidates
* Active Jobs
* Attendance Statistics
* Payroll Information
* Performance Metrics
* Recruitment Insights

---

# 🏗️ System Architecture

```text
                    ┌────────────────────┐
                    │     Next.js UI     │
                    │    Frontend App    │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    FastAPI API     │
                    │   Backend Server   │
                    └─────────┬──────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼

┌──────────────┐     ┌──────────────┐      ┌──────────────┐
│ Authentication│     │ HR Modules  │      │ AI Services │
│ JWT Security │     │ Employees    │      │ Resume AI   │
│ Role Control │     │ Attendance   │      │ Ranking AI  │
└──────────────┘     │ Payroll      │      │ Job Match AI│
                     │ Performance  │      └──────────────┘
                     └───────┬──────┘
                             ▼
                    ┌───────────────────┐
                    │    SQLite DB      │
                    │ Employee Records  │
                    │ Candidate Data    │
                    │ Payroll Data      │
                    └───────────────────┘
```

---

# 🛠️ Technology Stack

## Backend

| Technology | Purpose            |
| ---------- | ------------------ |
| FastAPI    | REST API Framework |
| SQLAlchemy | ORM                |
| SQLite     | Database           |
| JWT        | Authentication     |
| Passlib    | Password Hashing   |
| Pydantic   | Data Validation    |
| Uvicorn    | ASGI Server        |

---

## Frontend

| Technology   | Purpose             |
| ------------ | ------------------- |
| Next.js 15   | Frontend Framework  |
| React.js     | UI Components       |
| TypeScript   | Type Safety         |
| Tailwind CSS | Styling             |
| Recharts     | Dashboard Analytics |

---

## AI Services

| Technology         | Purpose           |
| ------------------ | ----------------- |
| Google Gemini AI   | Resume Analysis   |
| AI Ranking Engine  | Candidate Ranking |
| AI Matching Engine | Job Matching      |

---

## Development Tools

| Technology | Purpose            |
| ---------- | ------------------ |
| Git        | Version Control    |
| GitHub     | Repository Hosting |
| VS Code    | Development IDE    |
| Postman    | API Testing        |

---

# 🔄 HR Workflow

```text
Employee Registration
          │
          ▼
 Authentication
          │
          ▼
 Candidate Application
          │
          ▼
 Resume Upload
          │
          ▼
 AI Resume Screening
          │
          ▼
 AI Candidate Ranking
          │
          ▼
 AI Job Matching
          │
          ▼
 Candidate Selection
          │
          ▼
 Employee Onboarding
          │
          ▼
 Attendance Management
          │
          ▼
 Payroll Processing
          │
          ▼
 Performance Evaluation
```

---

# 🔒 Role-Based Access Matrix

| Feature                | Admin | HR Manager | Recruiter | Employee  |
| ---------------------- | ----- | ---------- | --------- | --------- |
| Dashboard Analytics    | ✅     | ✅          | ✅         | ❌         |
| Employee Management    | ✅     | ✅          | ❌         | ❌         |
| Attendance Management  | ✅     | ✅          | ❌         | View Only |
| Payroll Management     | ✅     | ✅          | ❌         | View Only |
| Performance Management | ✅     | ✅          | ❌         | View Only |
| Job Management         | ✅     | ✅          | ✅         | ❌         |
| Candidate Management   | ✅     | ✅          | ✅         | ❌         |
| Resume Screening       | ✅     | ✅          | ✅         | ❌         |
| Candidate Ranking      | ✅     | ✅          | ✅         | ❌         |
| Job Matching           | ✅     | ✅          | ✅         | ❌         |
| Profile Access         | ✅     | ✅          | ✅         | ✅         |

---

# 📂 Project Structure

```text
AI-HRMS/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── security/
│   │   └── database/
│   │
│   ├── requirements.txt
│   └── main.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── README.md
└── requirements.txt
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Sourabi-R/AI-HRMS.git

cd AI-HRMS
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 📡 API Modules

| Module            | Endpoint           |
| ----------------- | ------------------ |
| Authentication    | /auth              |
| Employees         | /employees         |
| Attendance        | /attendance        |
| Payroll           | /payroll           |
| Performance       | /performance       |
| Jobs              | /jobs              |
| Candidates        | /candidates        |
| Dashboard         | /dashboard         |
| Resume Screening  | /resume-screening  |
| Candidate Ranking | /candidate-ranking |
| Job Matching      | /job-matching      |

---

# 🔮 Future Enhancements

* Leave Management
* Employee Self-Service Portal
* Email Notifications
* AI Interview Assistant
* Video Interview Analysis
* Predictive HR Analytics
* Cloud Deployment
* Multi-Organization Support

---

# 👩‍💻 Author

### Sourabi R

**AI & Data Science Student**

AI-HRMS — AI Powered Human Resource Management System 🚀
