"use client";

import { useEffect, useState } from "react";
import RoleGuard from "../components/RoleGuard";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    authFetch(`${BASE_URL}/candidates/`)
      .then((res) => res.json())
      .then((data) => setCandidates(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load candidates", err);
        setCandidates([]);
      });
  }, []);

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager"]}>
      <div style={{ padding: "20px" }}>
        <h1>Candidates</h1>

      {candidates.map((c: any) => (
        <div key={c.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{c.name}</h3>
          <p>{c.email}</p>
          <p>Role: {c.role}</p>
          <p>Status: {c.status}</p>
          {c.resume_path ? (
            <a
              href={`http://127.0.0.1:8000${c.resume_path}`}
              download
              style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
            >
              Download resume
            </a>
          ) : (
            <p style={{ color: "#999", fontStyle: "italic" }}>No resume uploaded</p>
          )}
        </div>
      ))}
      </div>
    </RoleGuard>
  );
}