"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // 🚀 REDIRECT LOGGED-IN USERS TO DASHBOARD
      if (role) {
        router.push("/dashboard");
        return;
      }
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div style={styles.loading}>
        Loading AI HRMS...
      </div>
    );
  }

  // =========================
  // GUEST LANDING PAGE
  // =========================
  return (
    <div style={styles.container}>
      {/* TITLE */}
      <h1 style={styles.title}>
        AI Human Resource Platform 🚀
      </h1>

      <p style={styles.subtitle}>
        Manage Employees • Attendance • Payroll • AI Recruitment
      </p>

      {/* LOGIN BOX */}
      <div style={styles.card}>
        <h3 style={{ marginBottom: "10px" }}>Welcome 👋</h3>

        <p style={styles.text}>
          Please login or register to continue
        </p>

        <button
          style={styles.loginBtn}
          onClick={() => router.push("/login")}
        >
          🔐 Login
        </button>

        <button
          style={styles.registerBtn}
          onClick={() => router.push("/register")}
        >
          📝 Register
        </button>
      </div>
    </div>
  );
}

// =========================
// STYLES (CLEAN UI)
// =========================
const styles: any = {
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    background: "#0f172a",
    color: "white",
  },

  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    textAlign: "center",
    padding: "20px",
  },

  title: {
    fontSize: "34px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#cbd5e1",
    marginBottom: "30px",
    fontSize: "14px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "340px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },

  text: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "15px",
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  registerBtn: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};