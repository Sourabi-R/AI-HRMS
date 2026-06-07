"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // store token
      localStorage.setItem("token", data.access_token);

      router.push("/");
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
        <h1 style={styles.title}>🔐 Login</h1>

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

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footer}>
          New user? <a href="/register">Register</a>
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
    width: "360px",
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
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
  footer: {
    marginTop: "12px",
    fontSize: "14px",
  },
};