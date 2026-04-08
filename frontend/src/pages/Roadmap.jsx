import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import styles from "./Roadmap.module.css";

export default function Roadmap() {
  const nav = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    api.get("/roadmap/me")
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || "Could not generate roadmap"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Building your personalized roadmap…</p>
      <span className={styles.loadingSub}>Using your current unit and progress</span>
    </div>
  );

  if (error) return (
    <div className={styles.error}>
      <span>⚠️</span>
      <p>{error}</p>
      <p className={styles.errorHint}>Please try again in a moment.</p>
      <button className="btn btn-ghost" onClick={() => nav("/dashboard")}>← Back to dashboard</button>
    </div>
  );

  const { roadmap, meta } = data;
  const currentWeek = roadmap?.weeks?.[activeWeek - 1];

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className="badge badge-teal">Personalized for you</span>
          <h1>{roadmap.headline}</h1>
          <p className={styles.summary}>{roadmap.summary}</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: "var(--teal)" }}>{meta.skillsEarned}</span>
            <span className={styles.statLabel}>Skills earned</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: "var(--amber)" }}>{meta.passRate}%</span>
            <span className={styles.statLabel}>Pass rate</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: "var(--violet)" }}>8</span>
            <span className={styles.statLabel}>Week plan</span>
          </div>
        </div>
      </div>

      {/* ── Week Timeline ── */}
      <div className={styles.timeline}>
        {roadmap.weeks?.map(w => (
          <button key={w.week}
            className={`${styles.weekDot} ${activeWeek === w.week ? styles.weekActive : ""}`}
            onClick={() => setActiveWeek(w.week)}>
            <span className={styles.weekNum}>W{w.week}</span>
            <span className={styles.weekTheme}>{w.theme}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>

        {/* ── Week Detail ── */}
        {currentWeek && (
          <div className={styles.weekDetail}>
            <div className={styles.weekHeader}>
              <div>
                <span className="badge badge-amber">Week {currentWeek.week}</span>
                <h2 className={styles.weekTitle}>{currentWeek.theme}</h2>
                <p className={styles.weekGoal}>{currentWeek.goal}</p>
              </div>
            </div>

            <div className={styles.weekGrid}>
              {/* Topics */}
              <div className="card">
                <h4 className={styles.cardLabel}>📚 Topics this week</h4>
                <ul className={styles.topicList}>
                  {currentWeek.topics?.map(t => (
                    <li key={t} className={styles.topicItem}>
                      <span className={styles.topicDot}>▸</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenge Types */}
              <div className="card">
                <h4 className={styles.cardLabel}>⚡ Challenges to focus on</h4>
                <div className={styles.challengeTags}>
                  {currentWeek.challengeTypes?.map(c => (
                    <span key={c} className="badge badge-violet">{c}</span>
                  ))}
                </div>
                <button className="btn btn-primary"
                  style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
                  onClick={() => nav("/challenges")}>
                  Go to challenges →
                </button>
              </div>

              {/* AI Tip */}
              <div className={`card ${styles.tipCard}`}>
                <h4 className={styles.cardLabel}>Tip for this week</h4>
                <p className={styles.tipText}>{currentWeek.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Milestones ── */}
        <div className={styles.milestones}>
          <h3 className={styles.sectionTitle}>🏆 Career Milestones</h3>
          <div className={styles.milestoneList}>
            {roadmap.careerMilestones?.map((m, i) => (
              <div key={i} className={styles.milestone}>
                <div className={styles.milestoneWeek}>Week {m.week}</div>
                <div className={styles.milestoneLine} />
                <div className={styles.milestoneText}>{m.milestone}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Motivational Note ── */}
        <div className={styles.noteCard}>
          <span className={styles.noteIcon}>✦</span>
          <p>{roadmap.motivationalNote}</p>
          <span className={styles.noteCareer}>— Your path to {meta.career}</span>
        </div>

      </div>
    </div>
  );
}
