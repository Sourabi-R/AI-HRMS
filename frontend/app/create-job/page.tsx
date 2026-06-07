"use client";

import { useState } from "react";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const createJob = async () => {
    if (!title || !department || !description || !skills) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await authFetch(`${BASE_URL}/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          department,
          description,
          required_skills: skills,
          salary: salary ? parseInt(salary) : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create job");
      }

      alert("Job created successfully ✅");

      // reset form
      setTitle("");
      setDepartment("");
      setDescription("");
      setSkills("");
      setSalary("");
    } catch (err) {
      console.error(err);
      alert("Error creating job");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        💼 Create New Job
      </h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "700px",
        }}
      >
        {/* TITLE */}
        <div style={{ marginBottom: "15px" }}>
          <label>Job Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="AI Engineer"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* DEPARTMENT */}
        <div style={{ marginBottom: "15px" }}>
          <label>Department</label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Artificial Intelligence"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Job Description"
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* SKILLS */}
        <div style={{ marginBottom: "20px" }}>
          <label>Required Skills</label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Python, FastAPI, Machine Learning"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* SALARY */}
        <div style={{ marginBottom: "20px" }}>
          <label>Salary (in Rupees)</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="50000"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={createJob}
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </div>
    </div>
  );
}