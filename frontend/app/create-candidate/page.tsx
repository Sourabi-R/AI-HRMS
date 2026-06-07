"use client";

import { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

export default function CreateCandidatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumePath, setResumePath] = useState("");
  const [status, setStatus] = useState("Applied");

  const createCandidate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/candidates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          resume_path: resumePath,
          status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      alert("Candidate Created Successfully ✅");

      setName("");
      setEmail("");
      setResumePath("");
      setStatus("Applied");
    } catch (err) {
      console.error(err);
      alert("Error creating candidate");
    }
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
        👥 Create Candidate
      </h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "700px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Candidate Name"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="candidate@gmail.com"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Resume Path</label>

          <input
            value={resumePath}
            onChange={(e) => setResumePath(e.target.value)}
            placeholder="/resumes/candidate.pdf"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <option>Applied</option>
            <option>Screening</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>
        </div>

        <button
          onClick={createCandidate}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Create Candidate
        </button>
      </div>
    </div>
  );
}
