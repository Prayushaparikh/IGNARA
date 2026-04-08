import { useCallback, useEffect, useState } from "react";
import styles from "./ProjectOutputTerminal.module.css";
import { COPY } from "../../copy/foundationCopy.js";

const DEMO_LINES = [
  "$ python calculator.py",
  "Enter first number: 15",
  "Enter operator: +",
  "Enter second number: 7",
  "",
  "15 + 7 = 22",
  "",
  "$ python calculator.py",
  "Enter first number: 20",
  "Enter operator: /",
  "Enter second number: 4",
  "",
  "20 / 4 = 5.0",
  "",
  "Enter first number: 10",
  "Enter operator: %",
  "Enter second number: 3",
  "",
  "10 % 3 = 1",
  "",
  "🎉 Your calculator works perfectly!",
];

const DEMO_SHARE_TEXT = DEMO_LINES.join("\n");

export default function ProjectOutputTerminal({ onRunLive, introText }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [col, setCol] = useState(0);
  const [done, setDone] = useState(false);

  const restart = useCallback(() => {
    setLineIndex(0);
    setCol(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (done) return undefined;
    if (lineIndex >= DEMO_LINES.length) {
      setDone(true);
      return undefined;
    }
    const line = DEMO_LINES[lineIndex];
    if (col < line.length) {
      const t = window.setTimeout(() => setCol((c) => c + 1), 18);
      return () => window.clearTimeout(t);
    }
    const pause = line === "" ? 120 : 280;
    const t2 = window.setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCol(0);
    }, pause);
    return () => window.clearTimeout(t2);
  }, [lineIndex, col, done]);

  const visibleComplete = DEMO_LINES.slice(0, lineIndex);
  const currentLine = lineIndex < DEMO_LINES.length ? DEMO_LINES[lineIndex] : "";
  const partial = currentLine.slice(0, col);

  const shareDemo = () => {
    void navigator.clipboard.writeText(DEMO_SHARE_TEXT);
  };

  return (
    <div>
      <p className={styles.intro}>{introText || COPY.project.terminalIntro}</p>
      <div className={styles.wrap}>
        <div className={styles.head}>Your Calculator Demo</div>
        <div className={styles.body} aria-live="polite">
          {visibleComplete.map((ln, i) => (
            <div key={`d-${i}`} className={styles.line}>
              {ln || "\u00a0"}
            </div>
          ))}
          {!done && lineIndex < DEMO_LINES.length && (
            <div className={styles.line}>
              {partial}
              <span className={styles.cursor} aria-hidden />
            </div>
          )}
        </div>
        {done && (
          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onRunLive}>
              ← {COPY.project.runItLive}
            </button>
            <button type="button" className="btn btn-primary" onClick={shareDemo}>
              {COPY.project.shareDemo} ↓
            </button>
            <button type="button" className="btn btn-ghost" onClick={restart}>
              {COPY.project.replayDemo}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
