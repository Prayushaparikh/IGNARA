import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import styles from "./Projects.module.css";

const UNIT_PROJECTS = {
  B1: { name: "Simple Calculator", summary: "CLI calculator with + - * / and divide-by-zero handling." },
  B2: { name: "Number Guessing Game", summary: "Interactive guessing game with loop feedback." },
  B3: { name: "Password Strength Checker", summary: "Function-based password scoring with helper methods." },
  B4: { name: "To-Do List Program", summary: "CLI task manager using list/dict operations." },
  I1: { name: "Chat Message Parser", summary: "Parse chat logs and compute user/message statistics." },
  I2: { name: "Leaderboard System", summary: "Score leaderboard with sort/search and rank changes." },
  I3: { name: "Maze Solver", summary: "Recursive DFS maze pathfinder with backtracking." },
  I4: { name: "Shopping Cart Engine", summary: "OOP cart/inventory/discount flow with edge-case handling." },
  A1: { name: "Social Network Graph", summary: "Graph model with shortest path and friend suggestions." },
  A2: { name: "Mini REST API", summary: "Student gradebook API with validation, pagination, and limits." },
  A3: { name: "Mock Interview Session", summary: "Timed interview simulation with scoring and reflection." },
  A4: { name: "Personal Portfolio App", summary: "Deploy portfolio website showcasing all unit projects." },
};

export default function Projects() {
  const nav = useNavigate();
  const location = useLocation();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    api.get("/lessons/me").then((r) => setUnits(r.data.units || [])).finally(() => setLoading(false));
  }, []);

  const focusedUnit = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("unit");
  }, [location.search]);

  if (loading) return <div className={styles.state}>Loading projects...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">Projects</span>
        <h1>Build after practice</h1>
        <p>Flow: Quiz → Lessons → Challenges → Projects</p>
      </div>

      <div className={styles.grid}>
        {units.map((u) => {
          const p = UNIT_PROJECTS[u.unitCode] || { name: "Unit Project", summary: "Project details coming soon." };
          const highlighted = focusedUnit === u.unitCode;
          const canBuild = u.passedChallenges >= 5;
          return (
            <div key={u.unitCode} className={`${styles.card} ${highlighted ? styles.highlight : ""}`}>
              <div className={styles.top}>
                <strong>{u.unitCode} - {p.name}</strong>
                <span className={`badge ${canBuild ? "badge-teal" : "badge-violet"}`}>
                  {canBuild ? "Unlocked" : "Locked"}
                </span>
              </div>
              <p>{p.summary}</p>
              <p className={styles.portfolio}>Portfolio line: {p.name} completed and documented.</p>
              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={() => nav("/lessons")}>Back to lessons</button>
                <button
                  className="btn btn-primary"
                  disabled={!canBuild || submitting === u.unitCode}
                  onClick={async () => {
                    setSubmitting(u.unitCode);
                    try {
                      await api.post("/lessons/project-complete", { unitCode: u.unitCode });
                      const refreshed = await api.get("/lessons/me");
                      setUnits(refreshed.data.units || []);
                    } finally {
                      setSubmitting(null);
                    }
                  }}
                  title={canBuild ? "Mark project complete" : "Complete unit challenges first"}
                >
                  {canBuild ? (submitting === u.unitCode ? "Saving..." : "Submit project") : "Finish challenges first"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
