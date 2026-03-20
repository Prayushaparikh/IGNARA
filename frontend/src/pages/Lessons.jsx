import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import styles from "./Lessons.module.css";

export default function Lessons() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/lessons/me")
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error || "Could not load lessons"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data?.currentLesson || !data?.transition) return;
    api.post("/lessons/transition-event", {
      eventType: "viewed",
      transitionType: data.transition.type,
      unitCode: data.currentLesson.unitCode,
      recommendedItemId: data.transition.recommendedChallenge?.id || null,
      recommendedItemType: data.transition.nextLesson ? "lesson" : "challenge",
      metadata: { source: "lessons-page" },
    }).catch(() => {});
  }, [data]);

  const handleTransitionClick = (challengeId) => {
    if (!data?.currentLesson || !data?.transition || !challengeId) {
      return;
    }
    api.post("/lessons/transition-event", {
      eventType: "clicked",
      transitionType: data.transition.type,
      unitCode: data.currentLesson.unitCode,
      recommendedItemId: challengeId,
      recommendedItemType: "challenge",
      metadata: { source: "lessons-page-primary-cta" },
    }).catch(() => {});
    nav(`/challenges/${challengeId}`);
  };

  if (loading) return <div className={styles.state}>Loading your lesson plan...</div>;
  if (error) return <div className={styles.state}>{error}</div>;

  const { currentLesson, transition, lessonTips, units } = data;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">Personalized Lesson Flow</span>
        <h1>{currentLesson.title}</h1>
        <p>{currentLesson.summary}</p>
      </div>

      <div className={styles.grid}>
        <section className="card">
          <h3>Current lesson goals</h3>
          <ul className={styles.list}>
            {currentLesson.goals?.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
          <div className={styles.progress}>
            <span>
              Progress: {currentLesson.passedChallenges}/{currentLesson.totalChallenges} challenges
            </span>
            <span>{currentLesson.passRate}% complete</span>
          </div>
        </section>

        <section className="card">
          <h3>Personalized transition</h3>
          <p className={styles.reason}>{transition.reason}</p>
          {transition.recommendedChallenge && (
            <button
              className="btn btn-primary"
              onClick={() => handleTransitionClick(transition.recommendedChallenge.id)}
            >
              Start: {transition.recommendedChallenge.title}
            </button>
          )}
          {!transition.recommendedChallenge && transition.nextLesson && (
            <div className={styles.nextLesson}>
              <strong>Next lesson:</strong> {transition.nextLesson.title}
              <p>{transition.nextLesson.summary}</p>
            </div>
          )}
          {transition.remediation?.length > 1 && (
            <div className={styles.remediation}>
              <p>Also recommended:</p>
              {transition.remediation.slice(1).map((c) => (
                <button key={c.id} className="btn btn-ghost" onClick={() => handleTransitionClick(c.id)}>
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <h3>Lesson tips from your Code DNA</h3>
        {lessonTips.length ? (
          <ul className={styles.list}>
            {lessonTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p>No misconception trends yet. Keep coding and this will personalize quickly.</p>
        )}
      </section>

      <section className="card">
        <h3>Unit roadmap</h3>
        <div className={styles.units}>
          {units.map((u) => (
            <div key={u.unitCode} className={styles.unit}>
              <div>
                <strong>
                  {u.unitCode} - {u.title}
                </strong>
                <p>{u.summary}</p>
              </div>
              <span className={`badge ${u.completed ? "badge-teal" : "badge-violet"}`}>
                {u.passedChallenges}/{u.totalChallenges}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
