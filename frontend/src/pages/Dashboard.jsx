// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import api from "../services/api.js";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user }    = useAuthStore();
  const nav         = useNavigate();
  const [data, setData]   = useState(null);
  const [next, setNext]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/progress/me"),
      api.get("/challenges/next"),
    ]).then(([prog, nxt]) => {
      setData(prog.data);
      setNext(nxt.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>;

  const track = data?.currentUnit?.startsWith("A") ? "Advanced" : data?.currentUnit?.startsWith("I") ? "Intermediate" : "Beginner";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Hey, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted">You are on {data?.currentUnit || "B1"} • {track} track.</p>
        </div>
        {!data?.primaryCareer && (
          <button className="btn btn-primary" onClick={() => nav("/quiz")}>
            Take Career Quiz →
          </button>
        )}
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsRow}>
        {[
          { label: "Challenges done",   value: data?.completedCount || 0,      color: "teal" },
          { label: "Day streak",        value: 1,                                color: "amber" },
          { label: "Units completed",   value: data?.unitProgress?.filter((u) => u.projectPassed).length || 0, color: "violet" },
          { label: "Skills earned",     value: data?.skills?.length || 0,        color: "coral" },
        ].map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue} style={{ color: `var(--${s.color})` }}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={`card ${styles.nextCard}`}>
          <span className="badge badge-teal">Current unit</span>
          <h3 className={styles.cardTitle}>{data?.currentUnit || "B1"}</h3>
          <p className={styles.nextReason}>Continue your lesson and complete 5 ordered challenges before the unit project.</p>
          <button className="btn btn-primary" style={{ marginTop: 20, width: "100%", justifyContent: "center" }} onClick={() => nav("/foundation")}>
            Continue where you left off →
          </button>
        </div>

        {/* ── Next Challenge ── */}
        {next?.recommended && (
          <div className={`card ${styles.nextCard}`}>
            <div className={styles.nextBadge}><span className="badge badge-amber">Career insight</span></div>
            <h3 className={styles.cardTitle}>Suggested role: {data?.primaryCareer || "Explore careers"}</h3>
            <p className={styles.nextTitle}>{next.recommended.title}</p>
            <p className={styles.nextReason}>Not a requirement. Explore and choose your own path.</p>
            <div className={styles.nextMeta}>
              <span className={`badge ${next.recommended.difficulty === "easy" ? "badge-teal" : next.recommended.difficulty === "hard" ? "badge-coral" : "badge-amber"}`}>
                {next.recommended.difficulty}
              </span>
              {next.recommended.career_tags?.slice(0,2).map(t => (
                <span key={t} className="badge badge-violet">{t}</span>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
              onClick={() => nav(`/careers`)}>
              Explore careers →
            </button>
          </div>
        )}

        {/* ── Recent Activity ── */}
        <div className={`card ${styles.activityCard}`}>
          <h3 className={styles.cardTitle}>Recent Submissions</h3>
          {data?.recentSubmissions?.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 14 }}>No submissions yet. Start a challenge!</p>
          ) : (
            <div className={styles.activityList}>
              {data?.recentSubmissions?.slice(0, 8).map(s => (
                <div key={s.challenge_id + s.submitted_at} className={styles.activityItem}>
                  <span className={s.passed ? styles.passIcon : styles.failIcon}>{s.passed ? "✓" : "✗"}</span>
                  <span className={styles.activityTitle}>{s.title}</span>
                  <span className={`badge ${s.difficulty === "easy" ? "badge-teal" : s.difficulty === "hard" ? "badge-coral" : "badge-amber"}`}>{s.difficulty}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
