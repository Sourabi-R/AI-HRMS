import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <aside
        style={{
          width: "260px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#38bdf8" }}>
          AI HRMS 🚀
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/dashboard">🏠 Dashboard</Link>
          <Link href="/employees">👨‍💼 Employees</Link>
          <Link href="/attendance">📅 Attendance</Link>
          <Link href="/payroll">💰 Payroll</Link>
          <Link href="/performance">📈 Performance</Link>
          <Link href="/jobs">💼 Jobs</Link>
          <Link href="/candidates">👥 Candidates</Link>
          <Link href="/resume-screening">🧠 AI Resume</Link>
          <Link href="/candidate-ranking">🏆 AI Ranking</Link>
        </nav>
      </aside>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          background: "#f1f5f9",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>

    </div>
  );
}