// pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import styles from "./Auth.module.css";

export default function Login() {
  const nav   = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      nav("/dashboard");
    } catch {}
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoMark}>◈</div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to continue your path</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handle} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input className="input" type="email" placeholder="you@school.edu"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
        <p className={styles.switch}>New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
