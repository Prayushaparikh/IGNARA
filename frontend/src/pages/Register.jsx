// pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import styles from "./Auth.module.css";

export default function Register() {
  const nav = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  const handle = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.role);
      nav(form.role === "teacher" ? "/teacher" : "/quiz");
    } catch {}
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoMark}>◈</div>
        <h1 className={styles.title}>Start your path</h1>
        <p className={styles.sub}>Ignara means ignition. Every dream begins with a dreamer.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handle} className={styles.form}>
          <div className={styles.field}>
            <label>Full name</label>
            <input className="input" placeholder="Alex Chen"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input className="input" type="email" placeholder="you@school.edu"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input className="input" type="password" placeholder="8+ characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className={styles.roleToggle}>
            {["student", "teacher"].map(r => (
              <button key={r} type="button"
                className={`${styles.roleBtn} ${form.role === r ? styles.roleActive : ""}`}
                onClick={() => setForm({ ...form, role: r })}>
                {r === "student" ? "🎓 Student" : "👩‍🏫 Teacher"}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>
        <p className={styles.switch}>Have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
