"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import RoleGuard from "../components/RoleGuard";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // SAFE FETCH FUNCTION (🔥 FIX)
  const safeFetch = async (url: string, setter: Function) => {
    try {
      const res = await authFetch(url);

      if (!res.ok) {
        console.error("API ERROR:", url, res.status);
        setter([]);
        return;
      }

      const data = await res.json();
      setter(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH FAILED:", url, err);
      setter([]);
    }
  };

  useEffect(() => {
    safeFetch(`${BASE_URL}/employees/`, setEmployees);
    safeFetch(`${BASE_URL}/jobs/`, setJobs);
    safeFetch(`${BASE_URL}/candidates/`, setCandidates);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role || null);
        setUserName(payload.name || payload.email || null);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const pieData = [
    {
      name: "Strong",
      value: candidates.filter((c) => c.status === "strong").length,
    },
    {
      name: "Good",
      value: candidates.filter((c) => c.status === "good").length,
    },
    {
      name: "Weak",
      value: candidates.filter((c) => c.status === "weak").length,
    },
  ];

  const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

  if (role === "employee") {
    return (
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          Welcome back, {userName || "Team Member"}
        </h1>

        <div style={{ display: "grid", gap: "20px", maxWidth: "700px" }}>
          <section style={{ background: "white", padding: "20px", borderRadius: "18px" }}>
            <h2>Your employee dashboard</h2>
            <p>Access your attendance, payroll, and performance information through the sidebar.</p>
          </section>

          <section style={{ background: "white", padding: "20px", borderRadius: "18px" }}>
            <h3>My summary</h3>
            <ul style={{ marginTop: "12px", lineHeight: 1.7 }}>
              <li>📅 Attendance: View your attendance log.</li>
              <li>💰 Payroll: See your salary details.</li>
              <li>📈 Performance: Track your performance reviews.</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager", "employee"]}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          AI HRMS Dashboard 🚀
        </h1>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        <Card title="Employees" value={employees.length} color="#2563eb" />
        <Card title="Jobs" value={jobs.length} color="#16a34a" />
        <Card title="Candidates" value={candidates.length} color="#f59e0b" />
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* BAR */}
        <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "15px", borderRadius: "12px" }}>
          <h3>Hiring Overview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobs}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="id" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div style={{ width: "350px", background: "white", padding: "15px", borderRadius: "12px" }}>
          <h3>Candidate Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
    </RoleGuard>
  );
}

/* CARD */
function Card({ title, value, color }: any) {
  return (
    <div style={{
      flex: 1,
      background: "white",
      padding: "15px",
      borderRadius: "12px",
      borderLeft: `6px solid ${color}`
    }}>
      <h4>{title}</h4>
      <h2 style={{ fontSize: "24px" }}>{value}</h2>
    </div>
  );
}