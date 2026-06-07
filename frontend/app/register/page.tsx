"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role, // ✅ IMPORTANT
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      alert("Account created successfully 🚀");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📝 Create Account</h1>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* ROLE SELECTOR */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="employee">Employee</option>
          <option value="hr">HR</option>
          <option value="senior-manager">Senior Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister} style={styles.button}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p style={styles.footer}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    overflow: "hidden",
  },
  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "14px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: { marginBottom: "20px", fontSize: "22px" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  footer: {
    marginTop: "12px",
    fontSize: "14px",
  },
};