"use client";

import { useEffect, useState } from "react";
import RoleGuard from "../components/RoleGuard";
import { authFetch } from "../lib/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function AttendancePage() {
  const [role, setRole] = useState<string>("");
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Extract role from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role || "");
    }
    
    if (role === "employee") {
      fetchMyRequests();
    } else if (role === "hr") {
      fetchPendingRequests();
    }
  }, [role]);

  const fetchMyRequests = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/attendance-requests/my-requests`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/attendance-requests/pending`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch pending requests:", err);
    }
  };

  const submitPresentRequest = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${BASE_URL}/attendance-requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendance_date: selectedDate,
          request_type: "present",
        }),
      });

      if (res.ok) {
        alert("Present request submitted for approval ✅");
        fetchMyRequests();
        setSelectedDate(new Date().toISOString().split("T")[0]);
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    }
    setLoading(false);
  };

  const submitLeaveRequest = async () => {
    if (!leaveReason.trim()) {
      alert("Please provide a reason for leave");
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch(`${BASE_URL}/attendance-requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendance_date: selectedDate,
          request_type: "leave",
          reason: leaveReason,
        }),
      });

      if (res.ok) {
        alert("Leave request submitted for approval ✅");
        fetchMyRequests();
        setSelectedDate(new Date().toISOString().split("T")[0]);
        setLeaveReason("");
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to submit leave request");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting leave request");
    }
    setLoading(false);
  };

  const approveRequest = async (requestId: number) => {
    try {
      const res = await authFetch(`${BASE_URL}/attendance-requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (res.ok) {
        alert("Request approved ✅");
        fetchPendingRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      const res = await authFetch(`${BASE_URL}/attendance-requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });

      if (res.ok) {
        alert("Request rejected ✅");
        fetchPendingRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager", "employee"]}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>
          📋 Attendance Management
        </h1>

        {role === "employee" && (
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>📅 Mark Attendance or Apply Leave</h2>

            <div style={{ marginBottom: "15px" }}>
              <label>Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ marginLeft: "10px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                onClick={submitPresentRequest}
                disabled={loading}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ✅ Mark Present
              </button>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Leave Reason (optional):</label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Medical leave / Personal reasons / etc."
                rows={3}
                style={{
                  width: "100%",
                  marginTop: "5px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <button
              onClick={submitLeaveRequest}
              disabled={loading}
              style={{
                background: "#f59e0b",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🏥 Apply Leave
            </button>
          </div>
        )}

        {role === "hr" && (
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>⏳ Pending Approval Requests</h2>
            
            {requests.length === 0 ? (
              <p style={{ color: "#666" }}>No pending requests</p>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {requests.map((req: any) => (
                  <div
                    key={req.id}
                    style={{
                      background: "#f9fafb",
                      padding: "15px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #3b82f6",
                    }}
                  >
                    <p><b>Employee:</b> {req.employee_name}</p>
                    <p><b>Type:</b> {req.request_type === "present" ? "✅ Present" : "🏥 Leave"}</p>
                    <p><b>Date:</b> {req.attendance_date}</p>
                    {req.reason && <p><b>Reason:</b> {req.reason}</p>}
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => approveRequest(req.id)}
                        style={{
                          background: "#22c55e",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(req.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>📊 Your Request History</h2>
          
          {requests.length === 0 ? (
            <p style={{ color: "#666" }}>No requests yet</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "10px" }}>Type</th>
                    <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                    <th style={{ textAlign: "left", padding: "10px" }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req: any) => (
                    <tr key={req.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "10px" }}>{req.attendance_date}</td>
                      <td style={{ padding: "10px" }}>{req.request_type === "present" ? "✅ Present" : "🏥 Leave"}</td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            background:
                              req.status === "Approved"
                                ? "#dcfce7"
                                : req.status === "Rejected"
                                ? "#fee2e2"
                                : "#fef3c7",
                            color:
                              req.status === "Approved"
                                ? "#166534"
                                : req.status === "Rejected"
                                ? "#991b1b"
                                : "#92400e",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px", fontSize: "12px", color: "#666" }}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
