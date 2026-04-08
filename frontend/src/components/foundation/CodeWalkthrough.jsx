import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./CodeWalkthrough.module.css";
import { COPY } from "../../copy/foundationCopy.js";

/**
 * Step-through “running” code: highlight line, show vars + output, plain caption.
 * No video — CSS only, lightweight for mobile.
 */
export default function CodeWalkthrough({ title, subtitle, code, steps }) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  const max = steps.length - 1;
  const current = steps[step];
  const activeLine = current?.lineIndex ?? 0;

  const next = useCallback(() => setStep((s) => Math.min(s + 1, max)), [max]);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const replay = useCallback(() => setStep(0), []);

  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(() => {
      setStep((s) => (s >= max ? 0 : s + 1));
    }, 2200);
    return () => clearInterval(t);
  }, [auto, max]);

  return (
    <section className={styles.wrap} aria-labelledby="code-walk-title">
      <div className={styles.head}>
        <h4 id="code-walk-title">{title}</h4>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>

      <div className={styles.body}>
        <div className={styles.codeCol}>
          {lines.map((text, i) => (
            <div key={i} className={`${styles.line} ${i === activeLine ? styles.lineActive : ""}`}>
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineCode}>{text}</span>
            </div>
          ))}
        </div>

        <div className={styles.side}>
          <p className={styles.caption}>{current?.caption}</p>
          {current?.variables?.length > 0 && (
            <div>
              <div className={styles.outLabel}>{COPY.walkthrough.varsLabel}</div>
              <div className={styles.vars}>
                {current.variables.map((v) => (
                  <span key={v.name} className={styles.varChip}>
                    {v.name} = {v.value}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className={styles.outLabel}>{COPY.walkthrough.outputLabel}</div>
            <pre className={styles.terminal}>
              {current?.output ? current.output : COPY.walkthrough.noOutputYet}
            </pre>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className="btn btn-ghost" onClick={prev} disabled={step <= 0}>
          {COPY.walkthrough.back}
        </button>
        <button type="button" className="btn btn-primary" onClick={next} disabled={step >= max}>
          {COPY.walkthrough.next}
        </button>
        <button type="button" className="btn btn-ghost" onClick={replay}>
          {COPY.walkthrough.replay}
        </button>
        <label className={styles.autoLabel}>
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          {COPY.walkthrough.autoPlay}
        </label>
        <span className={styles.stepMeta}>
          {COPY.walkthrough.stepOf(step + 1, steps.length)}
        </span>
      </div>
    </section>
  );
}
