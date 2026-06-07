"use client";

import RoleGuard from "../components/RoleGuard";

export default function PerformancePage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager", "employee"]}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>
          Performance
        </h1>
        <p style={{ marginBottom: "12px", color: "#334155" }}>
          Track performance ratings, review goals, and monitor progress.
        </p>
        <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 12px 30px rgba(15,23,42,0.08)" }}>
          <p><strong>Current rating:</strong> 4.3 / 5</p>
          <p><strong>Goals completed:</strong> 8 / 10</p>
          <p><strong>Feedback:</strong> Strong contributor with focus areas for improvement.</p>
        </div>
      </div>
    </RoleGuard>
  );
}
