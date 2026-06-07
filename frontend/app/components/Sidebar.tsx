"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);

  // =========================
  // GET ROLE FROM JWT
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRole(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch (err) {
      console.error("Invalid token");
      setRole(null);
    }
  }, []);

  // =========================
  // LOGOUT FUNCTION
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    router.push("/login");
  };

  // =========================
  // ACTIVE LINK STYLE
  // =========================
  const linkStyle = (path: string) => ({
    padding: "12px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    color: pathname === path ? "#0f172a" : "#cbd5e1",
    background: pathname === path ? "#ffffff" : "transparent",
    fontWeight: pathname === path ? "600" : "400",
    transition: "all 0.2s ease",
    display: "block",
  });

  return (
    <aside
      style={{
        width: "270px",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* ================= LOGO ================= */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "5px" }}>
          AI HRMS 🚀
        </h2>
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          Human Resource Platform
        </p>
      </div>

      {/* ================= AUTH ================= */}
      {!role && (
        <>
          <p style={{ fontSize: "12px", opacity: 0.6, marginBottom: "10px" }}>
            AUTHENTICATION
          </p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/login" style={linkStyle("/login")}>
              🔐 Login
            </Link>

            <Link href="/register" style={linkStyle("/register")}>
              📝 Register
            </Link>
          </nav>
        </>
      )}

      {/* ================= CORE HR ================= */}
      {(role === "admin" || role === "hr" || role === "senior-manager") && (
        <>
          <p style={{ fontSize: "12px", opacity: 0.6, margin: "15px 0 10px" }}>
            CORE HR
          </p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/" style={linkStyle("/")}>🏠 Dashboard</Link>
            <Link href="/attendance" style={linkStyle("/attendance")}>📅 Attendance</Link>
            <Link href="/payroll" style={linkStyle("/payroll")}>💰 Payroll</Link>
            <Link href="/performance" style={linkStyle("/performance")}>📈 Performance</Link>
          </nav>
        </>
      )}

      {/* ================= RECRUITMENT ================= */}
      {(role === "admin" || role === "hr" || role === "senior-manager") && (
        <>
          <p style={{ fontSize: "12px", opacity: 0.6, margin: "15px 0 10px" }}>
            RECRUITMENT
          </p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/jobs" style={linkStyle("/jobs")}>💼 Jobs</Link>
            <Link href="/jobs/create" style={linkStyle("/jobs/create")}>➕ Create Job</Link>
            <Link href="/candidates" style={linkStyle("/candidates")}>👥 Candidates</Link>
            <Link href="/candidates/create" style={linkStyle("/candidates/create")}>
              ➕ Create Candidate
            </Link>
          </nav>
        </>
      )}

      {/* ================= AI MODULES ================= */}
      {(role === "admin" || role === "hr" || role === "senior-manager") && (
        <>
          <p style={{ fontSize: "12px", opacity: 0.6, margin: "15px 0 10px" }}>
            AI MODULES
          </p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/resume-screening" style={linkStyle("/resume-screening")}>
              🧠 Resume AI
            </Link>

            <Link href="/candidate-ranking" style={linkStyle("/candidate-ranking")}>
              🏆 Candidate Ranking
            </Link>

            <Link href="/job-matching" style={linkStyle("/job-matching")}>
              🎯 Job Matching AI
            </Link>
          </nav>
        </>
      )}

      {/* ================= EMPLOYEE ================= */}
      {role === "employee" && (
        <>
          <p style={{ fontSize: "12px", opacity: 0.6, margin: "15px 0 10px" }}>
            MY SPACE
          </p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/attendance" style={linkStyle("/attendance")}>
              📅 My Attendance
            </Link>

            <Link href="/payroll" style={linkStyle("/payroll")}>
              💰 My Salary
            </Link>

            <Link href="/performance" style={linkStyle("/performance")}>
              📈 My Performance
            </Link>

            <Link href="/employees" style={linkStyle("/employees")}>
              👥 Applicants
            </Link>
          </nav>
        </>
      )}

      {/* ================= LOGOUT ================= */}
      {role && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: "auto",
          background: "#1e293b",
          padding: "12px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "#38bdf8",
            margin: "0 auto 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#0f172a",
          }}
        >
          {role ? role.toUpperCase().slice(0, 2) : "HR"}
        </div>

        <div style={{ fontWeight: "600" }}>
          {role ? role.toUpperCase() : "Guest"}
        </div>

        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          AI HRMS System
        </div>
      </div>
    </aside>
  );
}