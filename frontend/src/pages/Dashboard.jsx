// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import api from "../services/api.js";
import styles from "./Dashboard.module.css";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

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

  const profile = data?.studentProfile;
  const radarData = profile ? Object.entries(profile).map(([k, v]) => ({
    trait: k.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase()),
    value: Math.round(v * 100),
  })) : [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Hey, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted">Here's where you stand today.</p>
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
          { label: "Skills earned",     value: data?.skills?.length || 0,       color: "amber" },
          { label: "Career match",      value: data?.primaryCareer ? "Active"  : "Not set", color: "violet" },
          { label: "Submissions",       value: data?.recentSubmissions?.length || 0, color: "coral" },
        ].map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue} style={{ color: `var(--${s.color})` }}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* ── Radar ── */}
        {radarData.length > 0 && (
          <div className={`card ${styles.radarCard}`}>
            <h3 className={styles.cardTitle}>Your Trait Profile</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "var(--text-soft)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <Radar dataKey="value" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Next Challenge ── */}
        {next?.recommended && (
          <div className={`card ${styles.nextCard}`}>
            <div className={styles.nextBadge}><span className="badge badge-amber">AI Recommended</span></div>
            <h3 className={styles.cardTitle}>Next Challenge</h3>
            <p className={styles.nextTitle}>{next.recommended.title}</p>
            <p className={styles.nextReason}>{next.reasoning}</p>
            <div className={styles.nextMeta}>
              <span className={`badge ${next.recommended.difficulty === "easy" ? "badge-teal" : next.recommended.difficulty === "hard" ? "badge-coral" : "badge-amber"}`}>
                {next.recommended.difficulty}
              </span>
              {next.recommended.career_tags?.slice(0,2).map(t => (
                <span key={t} className="badge badge-violet">{t}</span>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
              onClick={() => nav(`/challenges/${next.recommended.id}`)}>
              Start challenge →
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
