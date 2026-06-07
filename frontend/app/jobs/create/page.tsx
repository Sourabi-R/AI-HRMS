"use client";

import { useState } from "react";
import { authFetch } from "../../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const createJob = async () => {
    if (
      !title ||
      !department ||
      !description ||
      !requiredSkills
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await authFetch(`${BASE_URL}/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          department,
          description,
          required_skills: requiredSkills,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Job Created Successfully ✅");

        setTitle("");
        setDepartment("");
        setDescription("");
        setRequiredSkills("");
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create job");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        💼 Create New Job
      </h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "700px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="AI Engineer"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Artificial Intelligence"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Job Description"
            rows={5}
            style={textareaStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Required Skills</label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) =>
              setRequiredSkills(e.target.value)
            }
            placeholder="Python, FastAPI, Machine Learning"
            style={inputStyle}
          />
        </div>

        <button
          onClick={createJob}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};