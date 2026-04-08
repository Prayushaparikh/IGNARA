import { useState } from "react";
import styles from "./ProgressiveHints.module.css";
import { COPY } from "../../copy/foundationCopy.js";

export default function ProgressiveHints({ hints }) {
  const [level, setLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  if (!hints?.length) return null;

  const max = hints.length - 1;
  const current = hints[level];
  const atEnd = level >= max;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <strong>{COPY.hints.sectionTitle}</strong>
        <span className={styles.progress}>{COPY.hints.hintProgress(level + 1, hints.length)}</span>
      </div>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${((level + 1) / hints.length) * 100}%` }} />
      </div>
      <p className={styles.hintText}>{current.text}</p>
      {current.solution && (
        <div className={styles.solBlock}>
          {!showSolution ? (
            <button type="button" className="btn btn-ghost" onClick={() => setShowSolution(true)}>
              {COPY.hints.showSolution}
            </button>
          ) : (
            <>
              <p className={styles.warn}>{COPY.hints.solutionWarn}</p>
              <pre className={styles.code}>{current.solution}</pre>
            </>
          )}
        </div>
      )}
      <div className={styles.actions}>
        {!atEnd ? (
          <button type="button" className="btn btn-primary" onClick={() => setLevel((l) => Math.min(l + 1, max))}>
            {COPY.hints.nextHint}
          </button>
        ) : (
          <span className={styles.done}>{COPY.hints.atEnd}</span>
        )}
        {level > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => { setLevel(0); setShowSolution(false); }}>
            {COPY.hints.reset}
          </button>
        )}
      </div>
    </div>
  );
}
