import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { QUIZ_QUESTIONS } from "../data/quizSchema.js";
import styles from "./Quiz.module.css";

const TOTAL = QUIZ_QUESTIONS.length;

export default function Quiz() {
  const nav = useNavigate();
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const q = QUIZ_QUESTIONS[step];
  const isKnowledge = q?.part === "knowledge";
  const progress    = ((step) / TOTAL) * 100;
  const partLabel   = isKnowledge ? "Part 2 of 2 — Coding Level" : "Part 1 of 2 — Your Interests";
  const partDesc    = isKnowledge
    ? "Experience + short knowledge checks decide your track. “I'm not sure” is fine — it helps us place you safely."
    : "These 5 questions help us suggest careers. No wrong answers.";

  const handleSelect = (idx) => setSelected(idx);

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (step < TOTAL - 1) {
      setStep(step + 1);
    } else {
      // Submit
      setLoading(true);
      try {
        const payload = QUIZ_QUESTIONS.map(qq => ({
          questionId: qq.id,
          selectedIndex: newAnswers[qq.id] ?? 0,
          part: qq.part,
        }));
        await api.post("/quiz/submit", { answers: payload });
        nav("/quiz/results");
      } catch (e) {
        setError(e.response?.data?.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    }
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Building your personalized path...</p>
    </div>
  );

  if (error) return (
    <div className={styles.error}>
      <span>⚠️ {error}</span>
      <button className="btn btn-ghost" onClick={() => setError(null)}>Try again</button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.orb} />

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.container}>

        {/* Part label */}
        <div className={styles.partBadge}>
          <span className={`badge ${isKnowledge ? "badge-violet" : "badge-ember"}`}>
            {partLabel}
          </span>
          <span className={styles.partDesc}>{partDesc}</span>
        </div>
        <div className={styles.partBadge} style={{ marginTop: 6 }}>
          <span className="badge badge-teal">Journey step 2 of 4</span>
          <span className={styles.partDesc}>Sign up → Quiz → Results → First Foundation lesson</span>
        </div>

        {/* Question number */}
        <div className={styles.questionMeta}>
          <span className={styles.questionNum}>{String(step + 1).padStart(2, "0")}</span>
          <span className={styles.questionTotal}>/ {String(TOTAL).padStart(2, "0")}</span>
        </div>

        {/* Question */}
        <div className={styles.questionCard}>
          <span className={styles.questionEmoji}>{q.emoji}</span>
          <h2 className={styles.questionText}>{q.question}</h2>

          {/* Code block */}
          {q.code && (
            <pre className={styles.codeBlock}>
              {q.question.split("\n\n").slice(1).join("\n\n")}
            </pre>
          )}
        </div>

        {/* Options */}
        <div className={styles.options}>
          {q.options.map((opt, i) => (
            <button key={i}
              className={`${styles.option} ${selected === i ? styles.optionSelected : ""}`}
              onClick={() => handleSelect(i)}>
              <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.optionLabel}>{opt.label}</span>
              {selected === i && <span className={styles.optionCheck}>✓</span>}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => { setStep(step - 1); setSelected(answers[QUIZ_QUESTIONS[step - 1].id] ?? null); }}>
              ← Back
            </button>
          )}
          <button
            className={`btn btn-primary ${styles.nextBtn}`}
            onClick={handleNext}
            disabled={selected === null}>
            {step === TOTAL - 1 ? "See my results →" : "Next →"}
          </button>
        </div>

      </div>
    </div>
  );
}
