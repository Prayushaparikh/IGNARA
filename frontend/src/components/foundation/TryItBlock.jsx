import { useState } from "react";
import styles from "./TryItBlock.module.css";
import { COPY } from "../../copy/foundationCopy.js";

export default function TryItBlock({ tryIt }) {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);

  if (!tryIt) return null;

  if (tryIt.type === "quiz" || tryIt.type === "predict") {
    const done = picked !== null;
    const correct = done && picked === tryIt.correctIndex;
    return (
      <div className={styles.wrap}>
        <div className={styles.badge}>{COPY.tryIt.badge}</div>
        <p className={styles.prompt}>{tryIt.prompt}</p>
        <div className={styles.choices}>
          {tryIt.choices.map((c, i) => (
            <button
              key={c}
              type="button"
              className={`${styles.choice} ${picked === i ? styles.choiceOn : ""} ${done && i === tryIt.correctIndex ? styles.choiceOk : ""} ${done && picked === i && i !== tryIt.correctIndex ? styles.choiceBad : ""}`}
              disabled={done}
              onClick={() => setPicked(i)}
            >
              {c}
            </button>
          ))}
        </div>
        {done && (
          <p className={correct ? styles.ok : styles.bad}>
            {correct ? tryIt.success || COPY.tryIt.quizRightDefault : COPY.tryIt.quizWrong}
          </p>
        )}
      </div>
    );
  }

  if (tryIt.type === "fix") {
    return (
      <div className={styles.wrap}>
        <div className={styles.badge}>{COPY.tryIt.fixBadge}</div>
        <p className={styles.prompt}>{tryIt.prompt}</p>
        <pre className={styles.code}>{tryIt.wrong}</pre>
        {!revealed ? (
          <button type="button" className="btn btn-ghost" onClick={() => setRevealed(true)}>
            {COPY.tryIt.showHint}
          </button>
        ) : (
          <>
            <p className={styles.hint}>{tryIt.hint}</p>
            <pre className={styles.codeOk}>{tryIt.reveal}</pre>
          </>
        )}
      </div>
    );
  }

  return null;
}
