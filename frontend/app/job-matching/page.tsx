"use client";

import { useState } from "react";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function JobMatchingPage() {
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState("");

  const fetchMatches = async () => {
    if (!jobId) {
      alert("Enter Job ID");
      return;
    }

    setLoading(true);

    try {
      const res = await authFetch(`${BASE_URL}/job-matching/${jobId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || "Failed to fetch matches. Are you authorized?");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setJobTitle(data.job_title || "");
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      alert("Error fetching matching results");
    }

    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        🤖 AI Resume ↔ Job Matching
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="number"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "220px",
          }}
        />

        <button
          onClick={fetchMatches}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Matching..." : "Match Candidates"}
        </button>
      </div>

      {jobTitle && (
        <h2
          style={{
            marginBottom: "15px",
            color: "#1e293b",
          }}
        >
          Job: {jobTitle}
        </h2>
      )}

      {results.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Recommendation</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              {results.map((candidate, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td>{index + 1}</td>

                  <td>{candidate.name}</td>

                  <td>{candidate.email}</td>

                  <td>
                    <span
                      style={{
                        background: getScoreColor(
                          candidate.match_score
                        ),
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {candidate.match_score}%
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background:
                          candidate.recommendation === "Hire"
                            ? "#dcfce7"
                            : candidate.recommendation === "Consider"
                            ? "#fef3c7"
                            : "#fee2e2",
                      }}
                    >
                      {candidate.recommendation}
                    </span>
                  </td>

                  <td>{candidate.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}