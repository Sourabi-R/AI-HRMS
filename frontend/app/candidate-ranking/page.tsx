"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import RoleGuard from "../components/RoleGuard";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

type Candidate = {
  name: string;
  email: string;
  score: number;
  reason: string;
};

export default function CandidateRankingPage() {
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const fetchRanking = async () => {
    if (!jobId.trim()) {
      alert("Please enter a job ID first.");
      return;
    }

    setLoading(true);

    try {
      const res = await authFetch(`${BASE_URL}/ranking/${jobId.trim()}`);
      const data = await res.json();
      let parsed: Candidate[] = [];

      try {
        if (data && typeof data.ranking === "string") {
          const cleaned = data.ranking.replace(/```json/g, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleaned);
        } else if (data && Array.isArray(data.ranking)) {
          parsed = data.ranking;
        } else if (Array.isArray(data)) {
          parsed = data as Candidate[];
        }
      } catch (e) {
        console.error("Failed to parse ranking JSON", e, data);
        parsed = [];
      }

      setCandidates(parsed || []);
    } catch (err) {
      alert("AI response error");
      console.error(err);
      setCandidates([]);
    }

    setLoading(false);
  };

  const getBadgeColor = (score: number) => {
    if (score >= 85) return "#16a34a";
    if (score >= 70) return "#f59e0b";
    return "#dc2626";
  };

  const getLabel = (score: number) => {
    if (score >= 85) return "Strong";
    if (score >= 70) return "Good";
    return "Weak";
  };

  // chart data
  const chartData = candidates.map((c) => ({
    name: c.name,
    score: c.score
  }));

  const pieData = [
    {
      name: "Strong",
      value: candidates.filter(c => c.score >= 85).length
    },
    {
      name: "Good",
      value: candidates.filter(c => c.score >= 70 && c.score < 85).length
    },
    {
      name: "Weak",
      value: candidates.filter(c => c.score < 70).length
    }
  ];

  const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager"]}>
      <div style={{ padding: "20px", background: "#f9fafb", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px" }}>
          AI Candidate Ranking System
        </h1>

      {/* INPUT */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          placeholder="Enter Job ID"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px"
          }}
        />

        <button
          onClick={fetchRanking}
          style={{
            padding: "10px 15px",
            background: "#2563eb",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Ranking..." : "Rank Candidates"}
        </button>
      </div>

      {/* CHARTS */}
      {candidates.length > 0 && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          
          <div style={{ width: "50%", height: 300, background: "white", padding: 10, borderRadius: 12 }}>
            <h3>Score Chart</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: "50%", height: 300, background: "white", padding: 10, borderRadius: 12 }}>
            <h3>Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
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
      )}

      {/* TABLE */}
      <div style={{
        background: "white",
        padding: "15px",
        borderRadius: "12px"
      }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td>{i + 1}</td>
                <td style={{ fontWeight: "bold" }}>{c.name}</td>
                <td>{c.email}</td>

                <td>
                  <span style={{
                    background: getBadgeColor(c.score),
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "20px"
                  }}>
                    {c.score}
                  </span>
                </td>

                <td>
                  <span style={{
                    background: "#e5e7eb",
                    padding: "5px 10px",
                    borderRadius: "20px"
                  }}>
                    {getLabel(c.score)}
                  </span>
                </td>

                <td style={{ fontSize: "13px", color: "#555" }}>
                  {c.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </RoleGuard>
  );
}