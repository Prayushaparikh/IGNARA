import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import styles from "./Lessons.module.css";

const FOUNDATION_FALLBACK = {
  title: "B1 Foundations: Variables, Input, and Basic Program Flow",
  summary:
    "Based on the Python Programming text: start with your first Python script, variables, and simple user input.",
  hookCode: `name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint(f"Hi {name}, next year you will be {age + 1}.")`,
  hookPrompt: "Predict: what breaks if age is not converted to int?",
  concept:
    "A Python program executes top to bottom. Variables store values, and input() returns text by default. Convert types explicitly when doing math, and keep naming simple and clear.",
  commonMistakes: [
    "Forgetting that input() returns a string.",
    "Using unclear variable names instead of descriptive names.",
    "Mixing print-only logic where return values are expected.",
  ],
  realWorld:
    "These foundations power forms, calculators, data cleaning scripts, and every backend endpoint you will write later.",
  goals: [
    "Write and run a basic Python script.",
    "Create and update variables safely.",
    "Use input() with type conversion.",
    "Print readable output with f-strings.",
  ],
};

export default function Lessons() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingRead, setMarkingRead] = useState(false);

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
  if (error) return <FoundationLessonFallback reason={error} nav={nav} />;

  const { currentLesson, transition, lessonTips, units, lessonContent, unlock } = data;

  const markLessonRead = async () => {
    setMarkingRead(true);
    try {
      await api.post("/lessons/mark-read", { unitCode: currentLesson.unitCode });
      const refreshed = await api.get("/lessons/me");
      setData(refreshed.data);
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">Personalized Lesson Flow</span>
        <h1>{currentLesson.title}</h1>
        <p>{currentLesson.summary}</p>
      </div>

      <section className="card">
        <h3>Hook (2 min)</h3>
        <p>Run this and predict what happens:</p>
        <pre className={styles.code}>{lessonContent.hookCode}</pre>
        <p><strong>{lessonContent.hookPrompt}</strong></p>
        <h3 style={{ marginTop: 14 }}>Lesson (5 min)</h3>
        <p>{lessonContent.concept}</p>
        <h4>Common mistakes</h4>
        <ul className={styles.list}>
          {lessonContent.commonMistakes?.map((m) => <li key={m}>{m}</li>)}
        </ul>
        <p className={styles.realWorld}><strong>Real world:</strong> {lessonContent.realWorld}</p>
        <button className="btn btn-primary" onClick={markLessonRead} disabled={markingRead || unlock.lessonRead}>
          {unlock.lessonRead ? "Lesson read ✓" : markingRead ? "Saving…" : "I've read this lesson"}
        </button>
      </section>

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
        <h3>Personalized lesson tips</h3>
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
              <span className={`badge ${u.unlocked ? "badge-teal" : "badge-violet"}`}>
                {u.unlocked ? `${u.passedChallenges}/5` : "Locked"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Learning flow</h3>
        <p className={styles.flowText}>Quiz → Lessons (learn) → Challenges (practice) → Projects (build)</p>
        <ul className={styles.list}>
          <li>5-minute video/text lesson on one concept.</li>
          <li>3-5 targeted micro-challenges for that concept.</li>
          <li>AI tutor feedback with personalized hints.</li>
          <li>1 portfolio-ready unit project.</li>
        </ul>
        <div className={styles.flowActions}>
          <button className="btn btn-primary" onClick={() => nav("/challenges")}>
            Continue to challenges →
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => nav(`/projects?unit=${encodeURIComponent(currentLesson.unitCode)}`)}
          >
            View this unit project
          </button>
        </div>
      </section>
    </div>
  );
}

function FoundationLessonFallback({ reason, nav }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-ember">Foundation fallback mode</span>
        <h1>{FOUNDATION_FALLBACK.title}</h1>
        <p>{FOUNDATION_FALLBACK.summary}</p>
      </div>

      <section className="card">
        <h3>Hook (2 min)</h3>
        <p>Run this and predict what happens:</p>
        <pre className={styles.code}>{FOUNDATION_FALLBACK.hookCode}</pre>
        <p><strong>{FOUNDATION_FALLBACK.hookPrompt}</strong></p>
        <h3 style={{ marginTop: 14 }}>Lesson (5 min)</h3>
        <p>{FOUNDATION_FALLBACK.concept}</p>
        <h4>Common mistakes</h4>
        <ul className={styles.list}>
          {FOUNDATION_FALLBACK.commonMistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className={styles.realWorld}>
          <strong>Real world:</strong> {FOUNDATION_FALLBACK.realWorld}
        </p>
      </section>

      <section className="card">
        <h3>Current lesson goals</h3>
        <ul className={styles.list}>
          {FOUNDATION_FALLBACK.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
        <div className={styles.flowActions}>
          <button className="btn btn-primary" onClick={() => nav("/challenges")}>
            Continue to B1 challenges →
          </button>
          <button className="btn btn-ghost" onClick={() => nav("/quiz")}>
            Retake quiz
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Flow status</h3>
        <p className={styles.flowText}>Sign up → Quiz → Results → Lessons</p>
        <p className={styles.flowText}>
          Showing fallback lesson content while lesson API data is unavailable.
        </p>
        <p className={styles.flowText}>Reason: {reason}</p>
      </section>
    </div>
  );
}
