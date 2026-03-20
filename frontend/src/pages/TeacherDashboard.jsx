// pages/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import api from "../services/api.js";
import styles from "./TeacherDashboard.module.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TeacherDashboard() {
  const [classes, setClasses]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [newName, setNewName]     = useState("");
  const [creating, setCreating]   = useState(false);

  useEffect(() => {
    api.get("/teacher/classes").then(r => { setClasses(r.data); if (r.data[0]) setSelected(r.data[0]); });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/teacher/classes/${selected.id}/analytics`).then(r => setAnalytics(r.data));
  }, [selected]);

  const createClass = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post("/teacher/classes", { name: newName.trim() });
      setClasses(c => [{ ...data, student_count: 0 }, ...c]);
      setSelected({ ...data, student_count: 0 });
      setNewName("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create class");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <h2>My Classes</h2>
        <div className={styles.newClass}>
          <input className="input" placeholder="Class name…" value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createClass()}
            style={{ fontSize: 13 }} />
          <button className="btn btn-primary" onClick={createClass} disabled={creating} style={{ padding: "10px 14px" }}>+</button>
        </div>
        <div className={styles.classList}>
          {classes.map(c => (
            <div key={c.id} className={`${styles.classItem} ${selected?.id === c.id ? styles.classActive : ""}`} onClick={() => setSelected(c)}>
              <span className={styles.className}>{c.name}</span>
              <span className={styles.classCount}>{c.student_count} students</span>
              <span className="badge badge-teal" style={{ fontSize: 11 }}>#{c.join_code}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.main}>
        {!analytics ? (
          <div className={styles.empty}>Select a class to view analytics</div>
        ) : (
          <>
            <div className={styles.header}>
              <h1>{selected?.name}</h1>
              <p className="text-muted">Join code: <span className="text-teal font-mono">{selected?.join_code}</span></p>
            </div>

            <div className={styles.stats}>
              {[
                { label: "Students",          value: analytics.summary.totalStudents },
                { label: "Avg completed",     value: analytics.summary.avgCompleted },
                { label: "Struggling",        value: analytics.summary.strugglingCount, warn: true },
              ].map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statVal} style={{ color: s.warn ? "var(--coral)" : "var(--teal)" }}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {analytics.activity?.length > 0 && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontFamily: "var(--font-display)" }}>Daily Submissions (last 30d)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={analytics.activity}>
                    <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Bar dataKey="passed" fill="var(--teal)" radius={[3,3,0,0]} />
                    <Bar dataKey="count"  fill="var(--surface)" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="card">
              <h3 style={{ marginBottom: 16, fontFamily: "var(--font-display)" }}>Students</h3>
              <table className={styles.table}>
                <thead>
                  <tr><th>Name</th><th>Career Path</th><th>Completed</th><th>Last Active</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {analytics.students.map(s => {
                    const struggling = analytics.struggling?.find(x => x.id === s.id);
                    return (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td className="text-muted">{s.primary_career || "—"}</td>
                        <td className="text-teal">{s.challenges_completed}</td>
                        <td className="text-muted" style={{ fontSize: 12 }}>{s.last_active ? new Date(s.last_active).toLocaleDateString() : "Never"}</td>
                        <td>{struggling ? <span className="badge badge-coral">⚠ Struggling</span> : <span className="badge badge-teal">✓ On track</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
