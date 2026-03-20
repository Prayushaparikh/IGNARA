import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import styles from "./QuizResults.module.css";

const TRACK_INFO = {
  "Foundations": {
    color: "#10B981", badge: "badge-green",
    headline: "You're starting from the right place.",
    desc: "Every great engineer started exactly here. Your 8-week path begins with the fundamentals — and we'll make sure every concept clicks before moving on.",
    unit: "Unit B1 — Foundations",
    firstChallenge: "Add Two Numbers",
    icon: "🌱",
  },
  "Intermediate": {
    color: "#F59E0B", badge: "badge-ember",
    headline: "You know the basics. Let's level you up.",
    desc: "You've got the foundation. Now we sharpen your skills with data structures, algorithms, and real problem solving. This is where it gets interesting.",
    unit: "Unit I1 — Data Structures",
    firstChallenge: "Two Sum",
    icon: "⚡",
  },
  "Advanced": {
    color: "#8B5CF6", badge: "badge-violet",
    headline: "You're ready for the deep end.",
    desc: "Strong fundamentals. Time to tackle advanced data structures, system design, and interview-level problems. Your first tech internship is in reach.",
    unit: "Unit A1 — Advanced DSA",
    firstChallenge: "Tree Traversal",
    icon: "🚀",
  },
};

const CAREER_SUGGESTIONS = {
  PROBLEM_SOLVING: { id: "software-engineer",     icon: "💻", title: "Software Engineer"     },
  DATA_AFFINITY:   { id: "data-scientist",         icon: "📊", title: "Data Scientist"        },
  CREATIVITY:      { id: "ux-engineer",            icon: "🎨", title: "UX Engineer"           },
  SYSTEMS_THINKING:{ id: "devops-engineer",        icon: "⚙️",  title: "DevOps Engineer"       },
  CURIOSITY:       { id: "cybersecurity-analyst",  icon: "🔒", title: "Cybersecurity Analyst" },
};

export default function QuizResults() {
  const nav = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/quiz/latest")
      .then(r => setResult(r.data))
      .catch(() => nav("/quiz"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Calculating your placement...</p>
    </div>
  );

  if (!result) return null;

  const level     = result.placement?.level || "Foundations";
  const track     = TRACK_INFO[level] || TRACK_INFO["Foundations"];
  const profile   = result.student_profile || {};
  const topTrait  = Object.entries(profile).sort((a,b) => b[1]-a[1])[0]?.[0];
  const careerSug = CAREER_SUGGESTIONS[topTrait];

  return (
    <div className={styles.page}>
      <div className={styles.orb} />

      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={`badge ${track.badge}`}>
          {track.icon} {level} Level — {result.placement?.label || "High School Track"}
        </span>
        <h1 className={styles.headline}>{track.headline}</h1>
        <p className={styles.desc}>{track.desc}</p>
      </div>

      <div className={styles.content}>

        {/* ── Track placement card ── */}
        <div className={styles.trackCard} style={{ borderColor: track.color, boxShadow: `0 0 40px ${track.color}18` }}>
          <div className={styles.trackTop}>
            <div>
              <span className={styles.trackLabel} style={{ color: track.color }}>Your starting point</span>
              <h2 className={styles.trackUnit}>{track.unit}</h2>
              <p className={styles.trackFirst}>First challenge: <span style={{ color: track.color }}>{track.firstChallenge}</span></p>
            </div>
            <div className={styles.trackIcon}>{track.icon}</div>
          </div>

          <div className={styles.trackPath}>
            {["Foundations", "Intermediate", "Advanced", "Internship Ready"].map((stage, i) => {
              const levels = ["Foundations", "Intermediate", "Advanced"];
              const active = stage === level;
              const done   = levels.indexOf(stage) < levels.indexOf(level);
              return (
                <div key={stage} className={styles.pathStep}>
                  <div className={`${styles.pathDot} ${active ? styles.pathDotActive : ""} ${done ? styles.pathDotDone : ""}`}
                    style={active ? { background: track.color, boxShadow: `0 0 12px ${track.color}` } : {}} />
                  <span className={`${styles.pathLabel} ${active ? styles.pathLabelActive : ""}`}
                    style={active ? { color: track.color } : {}}>{stage}</span>
                  {i < 3 && <div className={`${styles.pathLine} ${done ? styles.pathLineDone : ""}`} />}
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary"
            style={{ background: track.color, boxShadow: `0 0 20px ${track.color}40`, marginTop: 8 }}
            onClick={() => nav("/challenges")}>
            Start your first challenge →
          </button>
        </div>

        {/* ── Career sidebar — informational only ── */}
        {careerSug && (
          <div className={styles.careerSidebar}>
            <div className={styles.careerSidebarHeader}>
              <span className="badge badge-ember">✦ Career insight</span>
              <p className={styles.careerSidebarNote}>Based on your interests — not a requirement. Just something to explore.</p>
            </div>
            <div className={styles.careerCard}>
              <span className={styles.careerIcon}>{careerSug.icon}</span>
              <div>
                <h4 className={styles.careerTitle}>{careerSug.title}</h4>
                <p className={styles.careerNote}>Students with your interest profile often enjoy this career path.</p>
                <Link to="/careers" className={styles.careerLink}>Learn what they do →</Link>
              </div>
            </div>
            <p className={styles.careerDisclaimer}>
              Your learning path is not tied to any career. Explore careers anytime from the sidebar.
            </p>
          </div>
        )}

        {/* ── What happens next ── */}
        <div className={styles.nextSteps}>
          <h3 className={styles.nextTitle}>What happens next</h3>
          <div className={styles.nextGrid}>
            {[
              { icon: "📖", title: "Short lesson",     desc: "Every unit starts with a 5-minute concept walkthrough. No jargon." },
              { icon: "⚡", title: "Micro-challenges",  desc: "3–5 small focused problems. Each one builds on the last." },
              { icon: "🤖", title: "AI Tutor",          desc: "When you're stuck, the AI explains what went wrong in plain English." },
              { icon: "🏗️", title: "Unit project",      desc: "One real build at the end of each unit. Goes straight in your portfolio." },
            ].map((s, i) => (
              <div key={i} className="card">
                <span className={styles.stepIcon}>{s.icon}</span>
                <h4 className={styles.stepTitle}>{s.title}</h4>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
