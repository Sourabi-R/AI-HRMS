"use client";

import { useState } from "react";
import RoleGuard from "../../components/RoleGuard";
import { authFetch } from "../../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function CreateCandidatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Applied");
  const [role, setRole] = useState("Applicant");
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submitCandidate = async () => {
    if (!name || !email || !resume) {
      alert("Please fill all fields + upload resume");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("status", status);
    formData.append("role", role);
    formData.append("resume", resume);

    try {
      const res = await authFetch(`${BASE_URL}/candidates/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Candidate Created Successfully ✅");

        setName("");
        setEmail("");
        setStatus("Applied");
        setResume(null);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create candidate");
    }

    setLoading(false);
  };

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager"]}>
      <div>
        <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
          👥 Create Candidate
        </h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "600px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* NAME */}
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Candidate Name"
          style={inputStyle}
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="candidate@gmail.com"
          style={inputStyle}
        />

        {/* STATUS */}
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* ROLE */}
        <label>Candidate Role</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Software Engineer"
          style={inputStyle}
        />

        {/* RESUME UPLOAD */}
        <label>Resume (PDF/DOC)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setResume(e.target.files ? e.target.files[0] : null)
          }
          style={inputStyle}
        />

        <button
          onClick={submitCandidate}
          style={{
            marginTop: "15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Uploading..." : "Create Candidate"}
        </button>
      </div>
    </div>
    </RoleGuard>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};