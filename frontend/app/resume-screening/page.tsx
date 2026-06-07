"use client";

import { useState } from "react";
import RoleGuard from "../components/RoleGuard";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function ResumeScreeningPage() {
  const [jobId, setJobId] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile) {
      alert("Please upload a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    if (jobId.trim()) {
      formData.append("job_id", jobId.trim());
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await authFetch(`${BASE_URL}/resume-screening/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // If backend returned raw analysis but missing parsed fields, try to extract JSON from analysis
      let final = data || {};

      if ((!(final.name || final.score) || final.name === "Unknown Candidate") && final.analysis) {
        try {
          const text = final.analysis;
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            final = { ...final, ...parsed };
          }
        } catch (e) {
          console.warn("Could not extract JSON from analysis", e);
        }
      }

      setResult(final);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume.");
    }

    setLoading(false);
  };

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager"]}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
          AI Resume Screening
        </h1>

        <div style={{ maxWidth: "700px", background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
            Optional Job ID
          </label>
          <input
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Enter job ID to compare against"
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "16px" }}
          />

          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
            Resume File
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db" }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "20px", padding: "12px 18px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
          >
            {loading ? "Analyzing..." : "Screen Resume"}
          </button>
        </div>

        {result && (
          <div style={{ marginTop: "24px", maxWidth: "900px", background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", display: "flex", gap: "20px" }}>
            <div style={{ flex: "0 0 220px", textAlign: "center" }}>
              {/* Circular score gauge */}
              <svg width="180" height="180">
                <defs>
                  <linearGradient id="g1" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="70" stroke="#eef2ff" strokeWidth="16" fill="none" />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="url(#g1)"
                  strokeWidth="16"
                  strokeDasharray={`${Math.PI * 2 * 70}`}
                  strokeDashoffset={`${Math.PI * 2 * 70 * (1 - ((result.score ?? 0) / 100))}`}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 90 90)"
                />
                <text x="90" y="95" textAnchor="middle" fontSize="22" fill="#0f172a">{result.score ?? 0}</text>
                <text x="90" y="120" textAnchor="middle" fontSize="12" fill="#64748b">Resume Score</text>
              </svg>

              <div style={{ marginTop: "12px" }}>
                <div style={{ fontWeight: 700 }}>{result.recommendation || "N/A"}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Job Fit: {result.job_fit ?? "N/A"}%</div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: "8px" }}>{result.name || "Unknown Candidate"}</h2>
              <div style={{ color: "#475569", marginBottom: "6px" }}>{result.email || ""} {result.phone ? `• ${result.phone}` : ""}</div>

              {/* Skill match progress */}
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600 }}>Skills</div>
                  <div style={{ color: "#64748b" }}>{Array.isArray(result.matched_skills) ? result.matched_skills.length : 0} matched</div>
                </div>
                <div style={{ height: "12px", background: "#eef2ff", borderRadius: "8px", overflow: "hidden", marginTop: "8px" }}>
                  <div style={{ width: `${result.job_fit ?? 0}%`, height: "100%", background: "linear-gradient(90deg,#10b981,#3b82f6)" }} />
                </div>
                <div style={{ marginTop: "8px", color: "#475569" }}>{Array.isArray(result.skills) ? result.skills.join(", ") : "N/A"}</div>
              </div>

              {/* Experience / Education */}
              <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Experience</div>
                  <div style={{ color: "#475569" }}>{result.experience_years ?? "N/A"} years</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Education</div>
                  <div style={{ color: "#475569" }}>{result.education || "N/A"}</div>
                </div>
              </div>

              {/* Strengths / Weaknesses / Summary */}
              <div style={{ marginTop: "14px" }}>
                <div style={{ fontWeight: 700 }}>Strengths</div>
                <div style={{ color: "#475569", marginTop: "6px" }}>{(result.matched_skills && result.matched_skills.length) ? result.matched_skills.join(", ") : "Not detected"}</div>

                <div style={{ fontWeight: 700, marginTop: "10px" }}>Weaknesses / Missing Skills</div>
                <div style={{ color: "#475569", marginTop: "6px" }}>{(result.job_skills && result.job_skills.length) ? result.job_skills.filter((s: any) => !(result.matched_skills || []).map((m: any) => m.toLowerCase()).includes(s.toLowerCase())).join(", ") : "—"}</div>

                <div style={{ fontWeight: 700, marginTop: "10px" }}>AI Assessment</div>
                <div style={{ color: "#475569", marginTop: "6px" }}>{result.analysis ? (result.analysis.substring(0, 800) + (result.analysis.length > 800 ? '...' : '')) : 'Fallback analysis generated.'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
