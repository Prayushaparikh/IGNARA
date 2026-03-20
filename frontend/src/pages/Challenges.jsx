// pages/Challenges.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import styles from "./Challenges.module.css";

const DIFFS = ["all", "easy", "medium", "hard"];

export default function Challenges() {
  const nav = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter]         = useState("all");
  const [loading, setLoading]       = useState(true);
  const [nextRec, setNextRec]       = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/challenges${filter !== "all" ? `?difficulty=${filter}` : ""}`),
      api.get("/challenges/next").catch(() => null),
    ])
      .then(([challengeRes, nextRes]) => {
        setChallenges(challengeRes.data);
        setNextRec(nextRes?.data || null);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Challenges</h1>
          <p className="text-muted">Practice the skills your career demands.</p>
        </div>
        <div className={styles.filters}>
          {DIFFS.map(d => (
            <button key={d} className={`${styles.filterBtn} ${filter === d ? styles.active : ""}`} onClick={() => setFilter(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {nextRec?.recommended && (
        <div className={styles.personalized}>
          <div>
            <span className="badge badge-teal">Personalized next step</span>
            <h2>{nextRec.recommended.title}</h2>
            <p className={styles.reasoning}>{nextRec.reasoning || "Recommended from your recent coding patterns."}</p>
            {!!nextRec.topMisconceptions?.length && (
              <div className={styles.misList}>
                {nextRec.topMisconceptions.slice(0, 3).map((m) => (
                  <span key={m.tag} className="badge badge-violet">{m.tag}</span>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => nav(`/challenges/${nextRec.recommended.id}`)}>
            Start recommended challenge →
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}><span className={styles.spinner} /></div>
      ) : (
        <div className={styles.grid}>
          {challenges.map(c => (
            <div key={c.id} className={styles.card} onClick={() => nav(`/challenges/${c.id}`)}>
              <div className={styles.cardTop}>
                <span className={`badge ${c.difficulty === "easy" ? "badge-teal" : c.difficulty === "hard" ? "badge-coral" : "badge-amber"}`}>
                  {c.difficulty}
                </span>
                <div className={styles.langs}>
                  {c.language?.map(l => <span key={l} className="badge badge-violet">{l}</span>)}
                </div>
              </div>
              <h3>{c.title}</h3>
              <p>{c.description?.slice(0, 100)}…</p>
              <div className={styles.tags}>
                {c.career_tags?.slice(0,3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          ))}
          {challenges.length === 0 && (
            <p className="text-muted" style={{ gridColumn: "1/-1", padding: 24 }}>No challenges found.</p>
          )}
        </div>
      )}
    </div>
  );
}
