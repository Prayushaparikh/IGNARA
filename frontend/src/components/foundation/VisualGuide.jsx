import { useState } from "react";
import styles from "./VisualGuide.module.css";
import { COPY } from "../../copy/foundationCopy.js";

export default function VisualGuide({ guide }) {
  const [open, setOpen] = useState(true);
  if (!guide?.title) return null;

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        <span className={styles.icon}>{open ? "▼" : "▶"}</span>
        {COPY.practice.visualGuidePrefix} {guide.title}
      </button>
      {open && (
        <div className={styles.body}>
          {guide.formula && <p className={styles.formula}>{guide.formula}</p>}
          {guide.steps?.length > 0 && (
            <ol className={styles.steps}>
              {guide.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          {guide.asciiFlow && (
            <pre className={styles.flow}>{guide.asciiFlow}</pre>
          )}
        </div>
      )}
    </div>
  );
}
