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
  const [unitCode, setUnitCode]     = useState(null);
  const [unlockedUntil, setUnlockedUntil] = useState(1);
  const [practice, setPractice] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/challenges?mode=main${filter !== "all" ? `&difficulty=${filter}` : ""}`),
      api.get("/challenges?mode=practice"),
      api.get("/challenges/next").catch(() => null),
    ])
      .then(([challengeRes, practiceRes, nextRes]) => {
        setChallenges(challengeRes.data?.challenges || []);
        setPractice(practiceRes.data?.challenges || []);
        setUnitCode(challengeRes.data?.unitCode || null);
        setUnlockedUntil(Number(challengeRes.data?.unlockedUntil || 1));
        setNextRec(nextRes?.data || null);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Challenges</h1>
          <p className="text-muted">Main path challenges for {unitCode || "your current unit"} unlock in order.</p>
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
        <>
          <div className={styles.grid}>
            {challenges.map(c => (
              <div
                key={c.id}
                className={`${styles.card} ${c.locked ? styles.lockedCard : ""}`}
                onClick={() => !c.locked && nav(`/challenges/${c.id}`)}
              >
                <div className={styles.cardTop}>
                  <span className={`badge ${c.difficulty === "easy" ? "badge-teal" : c.difficulty === "hard" ? "badge-coral" : "badge-amber"}`}>
                    {c.difficulty}
                  </span>
                  <div className={styles.langs}>
                    {c.language?.map(l => <span key={l} className="badge badge-violet">{l}</span>)}
                  </div>
                </div>
                <div className={styles.lockMeta}>
                  <span className="badge badge-violet">
                    {c.unit_order_index <= unlockedUntil ? `Step ${c.unit_order_index}` : `Locked: complete step ${c.unit_order_index - 1}`}
                  </span>
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

          <div className={styles.practiceLane}>
            <h3>Practice lane (optional, ungraded)</h3>
            <p>Use these extra drills if you want more reps. They do not affect unlocking.</p>
            <div className={styles.practiceList}>
              {practice.slice(0, 4).map((c) => (
                <button key={c.id} className="btn btn-ghost" onClick={() => nav(`/challenges/${c.id}`)}>
                  {c.title}
                </button>
              ))}
              <button className="btn btn-ghost" onClick={() => nav("/compiler")}>Open free sandbox</button>
            </div>
          </div>

          <div className={styles.projectNudge}>
            <div>
              <strong>After challenge practice, build your unit project.</strong>
              <p>Projects are where students turn lesson concepts into portfolio-ready builds.</p>
            </div>
            <button className="btn btn-primary" onClick={() => nav("/projects")}>
              Go to projects →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
