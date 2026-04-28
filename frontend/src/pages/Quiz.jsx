import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Quiz.module.css";

const STEPS = [
  {
    q: "Have you ever written code before?",
    sub: "Any language, any amount — even a single line counts.",
    opts: [
      { icon: "🚫", text: "Never — I'm brand new",            next: "result-foundation" },
      { icon: "🌱", text: "A little — tutorials or school",   next: 1 },
      { icon: "💻", text: "Yes — I've built small projects",  next: 2 },
      { icon: "🚀", text: "Comfortable — I code regularly",   next: 3 },
    ],
  },
  {
    q: "Can you explain what a variable does?",
    sub: "Think about it — could you explain it to a friend?",
    opts: [
      { icon: "😕", text: "Not really sure",                  next: "result-foundation" },
      { icon: "🤔", text: "I think so, but I'd struggle",     next: "result-foundation-b2" },
      { icon: "✅", text: "Yes — it stores a value",           next: 2 },
    ],
  },
  {
    q: "Could you write a function that takes a list and returns only the even numbers?",
    sub: "Don't need to write it — just think about whether you could.",
    opts: [
      { icon: "😬", text: "I'd need to look that up",         next: "result-intermediate" },
      { icon: "🤷", text: "Maybe, with some help",            next: "result-intermediate" },
      { icon: "👍", text: "Yes, I can picture the code",      next: 3 },
    ],
  },
  {
    q: "Have you worked with APIs, databases, or Git before?",
    sub: "We're checking if you're ready for real-world engineering tasks.",
    opts: [
      { icon: "🆕", text: "I know what they are but haven't used them", next: "result-intermediate-plus" },
      { icon: "🔧", text: "I've used one or two of these",              next: "result-advanced" },
      { icon: "⚡", text: "I'm comfortable with all three",             next: "result-sim-ready" },
    ],
  },
];

const RESULTS = {
  "result-foundation": {
    emoji: "🎯",
    color: "amber",
    title: "Foundation track — Unit B1",
    desc: "Perfect starting point. You'll learn variables, types, and write your first program. Foundation is permanently free.",
    cta: "Start Foundation B1",
    href: "/register",
  },
  "result-foundation-b2": {
    emoji: "🎯",
    color: "amber",
    title: "Foundation track — Unit B2",
    desc: "You've got the basics. We'll skip the intro and start you on conditionals and logic. Still free.",
    cta: "Start Foundation B2",
    href: "/register",
  },
  "result-intermediate": {
    emoji: "🎯",
    color: "amber",
    title: "Intermediate track — Unit B5",
    desc: "You know the fundamentals. Time to level up with lists, loops, and data structures.",
    cta: "Start Intermediate",
    href: "/register",
  },
  "result-intermediate-plus": {
    emoji: "🎯",
    color: "amber",
    title: "Intermediate+ — Unit B8",
    desc: "Solid coding skills. You'll start with modules, file I/O, and working with external data.",
    cta: "Start Intermediate+",
    href: "/register",
  },
  "result-advanced": {
    emoji: "🚀",
    color: "purple",
    title: "Advanced track + Simulations",
    desc: "You're ready for real engineering work. Start the advanced curriculum or jump into a job simulation.",
    cta: "Browse simulations",
    href: "/register",
  },
  "result-sim-ready": {
    emoji: "🚀",
    color: "purple",
    title: "You're simulation-ready",
    desc: "Skip the curriculum — go straight to job simulations. Build a real portfolio with GitHub commits, a certificate, and a LinkedIn post.",
    cta: "Browse simulations",
    href: "/register",
  },
};

export default function Quiz() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx]   = useState(0);
  const [history, setHistory]   = useState([]);
  const [result, setResult]     = useState(null);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const step = STEPS[stepIdx];
  const progress = result
    ? 100
    : ((stepIdx) / STEPS.length) * 100;

  function choose(opt) {
    if (animating) return;
    setSelected(opt);
    setAnimating(true);
    setTimeout(() => {
      if (typeof opt.next === "string") {
        setResult(RESULTS[opt.next]);
      } else {
        setHistory(h => [...h, stepIdx]);
        setStepIdx(opt.next);
      }
      setSelected(null);
      setAnimating(false);
    }, 280);
  }

  function goBack() {
    if (result) {
      setResult(null);
      return;
    }
    if (history.length > 0) {
      const prev = [...history];
      const last = prev.pop();
      setHistory(prev);
      setStepIdx(last);
    }
  }

  function retake() {
    setResult(null);
    setHistory([]);
    setStepIdx(0);
    setSelected(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.orb} />

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.container}>

        {/* Back nav */}
        <div style={{ minHeight: 28 }}>
          {(history.length > 0 || result) && !animating && (
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={goBack}>
              ← Back
            </button>
          )}
        </div>

        {result ? (
          /* ── Result screen ── */
          <div className={styles.resultWrap}>
            <div className={styles.resultEmoji}>{result.emoji}</div>
            <h2 className={styles.questionText}>{result.title}</h2>
            <p className={styles.resultDesc}>{result.desc}</p>
            <Link
              to={result.href}
              className={`btn btn-primary ${styles.nextBtn}`}
              style={{ marginTop: 8 }}
            >
              {result.cta} →
            </Link>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 12, fontSize: 13 }}
              onClick={retake}
            >
              ← Retake quiz
            </button>
          </div>
        ) : (
          /* ── Question screen ── */
          <>
            {/* Progress dots */}
            <div className={styles.dotRow}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${i < stepIdx ? styles.dotDone : i === stepIdx ? styles.dotActive : ""}`}
                />
              ))}
            </div>

            {/* Question number */}
            <div className={styles.questionMeta}>
              <span className={styles.questionNum}>{String(stepIdx + 1).padStart(2, "0")}</span>
              <span className={styles.questionTotal}>/ {String(STEPS.length).padStart(2, "0")}</span>
            </div>

            {/* Question */}
            <div className={styles.questionCard}>
              <h2 className={styles.questionText}>{step.q}</h2>
              <p className={styles.partDesc}>{step.sub}</p>
            </div>

            {/* Options */}
            <div className={styles.options}>
              {step.opts.map((opt, i) => (
                <button
                  key={i}
                  className={`${styles.option} ${selected === opt ? styles.optionSelected : ""}`}
                  onClick={() => choose(opt)}
                >
                  <span className={styles.optionIcon}>{opt.icon}</span>
                  <span className={styles.optionLabel}>{opt.text}</span>
                </button>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
