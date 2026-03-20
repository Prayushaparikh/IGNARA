import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

export default function CareerDetail() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [career, setCareer] = useState(null);

  useEffect(() => { api.get(`/careers/${id}`).then(r => setCareer(r.data)); }, [id]);

  if (!career) return <div style={{ padding: 40, color: "var(--muted)" }}>Loading…</div>;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 800 }}>
      <button className="btn btn-ghost" onClick={() => nav("/careers")} style={{ marginBottom: 24 }}>← Back</button>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{career.icon}</div>
      <h1 style={{ fontSize: 40, letterSpacing: "-0.02em", marginBottom: 12 }}>{career.title}</h1>
      <p style={{ color: "var(--text-soft)", fontSize: 16, marginBottom: 28 }}>{career.description}</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <span className="badge badge-teal">💰 {career.avg_salary}</span>
        <span className="badge badge-amber">📈 {career.growth_rate} growth</span>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Required Skills</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {career.required_skills?.map(s => <span key={s} className="badge badge-violet">{s}</span>)}
        </div>
      </div>
      {career.userProgress > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Your Progress</h3>
          <div style={{ background: "var(--ink-3)", borderRadius: 100, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${career.userProgress}%`, height: "100%", background: "var(--teal)", borderRadius: 100, transition: "width 1s ease" }} />
          </div>
          <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 8 }}>{career.userProgress}% of required skills earned</p>
        </div>
      )}
      <button className="btn btn-primary" onClick={() => nav("/challenges")}>
        Start challenges for this career →
      </button>
    </div>
  );
}
