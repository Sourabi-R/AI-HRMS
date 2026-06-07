"use client";

import RoleGuard from "../components/RoleGuard";

export default function PayrollPage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr", "senior-manager", "employee"]}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>
          Payroll
        </h1>
        <p style={{ marginBottom: "12px", color: "#334155" }}>
          See salary, tax, and payment details for the current period.
        </p>
        <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 12px 30px rgba(15,23,42,0.08)" }}>
          <p><strong>Base salary:</strong> $5,000</p>
          <p><strong>Bonuses:</strong> $500</p>
          <p><strong>Net pay:</strong> $4,200</p>
        </div>
      </div>
    </RoleGuard>
  );
}
