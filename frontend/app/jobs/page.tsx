"use client";

import { useEffect, useState } from "react";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [editingJob, setEditingJob] = useState<any | null>(null);

  // form states for edit
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [salary, setSalary] = useState("");

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/jobs/`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Jobs API returned non-array response:", data);
        setJobs([]);
        return;
      }

      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= DELETE JOB =================
  const deleteJob = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`${BASE_URL}/jobs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Failed to delete job");
        return;
      }

      fetchJobs();
    } catch (error) {
      console.error("Delete job failed:", error);
      alert("Failed to delete job");
    }
  };

  // ================= OPEN EDIT =================
  const openEdit = (job: any) => {
    setEditingJob(job);
    setTitle(job.title);
    setDepartment(job.department);
    setDescription(job.description);
    setRequiredSkills(job.required_skills);
    setSalary(job.salary ? job.salary.toString() : "");
  };

  // ================= UPDATE JOB =================
  const updateJob = async () => {
    if (!editingJob) return;

    try {
      const res = await authFetch(`${BASE_URL}/jobs/${editingJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          department,
          description,
          required_skills: requiredSkills,
          salary: salary ? parseInt(salary) : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Failed to update job");
        return;
      }

      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Update job failed:", error);
      alert("Failed to update job");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        💼 Job Management (CRUD)
      </h1>

      {/* ================= JOB LIST ================= */}
      <div style={{ display: "grid", gap: "15px" }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>
              <b>Department:</b> {job.department}
            </p>
            <p>
              <b>Skills:</b> {job.required_skills}
            </p>
            {job.salary && (
              <p>
                <b>Salary:</b> ₹{job.salary.toLocaleString("en-IN")}
              </p>
            )}

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => openEdit(job)}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteJob(job.id)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3>Edit Job</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              style={inputStyle}
            />

            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              style={inputStyle}
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={inputStyle}
            />

            <input
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="Skills"
              style={inputStyle}
            />

            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Salary (in Rupees)"
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={updateJob}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                💾 Save
              </button>

              <button
                onClick={() => setEditingJob(null)}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  marginBottom: "8px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};