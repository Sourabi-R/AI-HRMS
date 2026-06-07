"use client";

import { useEffect, useState } from "react";
import RoleGuard from "../components/RoleGuard";
import { authFetch } from "../lib/api";

export default function Employees() {
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    authFetch("http://127.0.0.1:8000/candidates/")
      .then((res) => res.json())
      .then((data) => setCandidates(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load candidates", err);
        setCandidates([]);
      });
  }, []);

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager", "employee"]}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Applicants</h1>

        <div className="space-y-3">
          {candidates.map((candidate, i) => (
            <div key={i} className="bg-white p-4 rounded shadow">
              <p><b>Name:</b> {candidate.name}</p>
              <p><b>Email:</b> {candidate.email}</p>
              <p><b>Role:</b> {candidate.role}</p>
              <p><b>Status:</b> {candidate.status}</p>
              {candidate.resume_path ? (
                <a
                  href={`http://127.0.0.1:8000${candidate.resume_path}`}
                  download
                  className="text-blue-600 underline"
                  style={{ cursor: "pointer" }}
                >
                  Download Resume
                </a>
              ) : (
                <p style={{ color: "#999", fontSize: "14px" }}>No resume</p>
              )}
            </div>
          ))}
          {candidates.length === 0 && (
            <div className="bg-white p-4 rounded shadow text-gray-500">
              No applicants found.
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
