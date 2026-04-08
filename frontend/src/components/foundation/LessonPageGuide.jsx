import { COPY } from "../../copy/foundationCopy.js";
import styles from "./LessonPageGuide.module.css";

/** Soft roadmap so students know what each part of the lesson page is for */
export default function LessonPageGuide() {
  const g = COPY.lesson.pageGuide;
  return (
    <aside className={styles.wrap} aria-labelledby="lesson-page-guide-title">
      <div className={styles.badge}>{g.badge}</div>
      <h4 id="lesson-page-guide-title" className={styles.title}>
        {g.title}
      </h4>
      <p className={styles.intro}>{g.intro}</p>
      <ol className={styles.steps}>
        {g.steps.map((s) => (
          <li key={s.title}>
            <span className={styles.stepTitle}>{s.title}</span>
            <span className={styles.stepDetail}>{s.detail}</span>
          </li>
        ))}
      </ol>
      <pre className={styles.flow} aria-hidden="true">
        {g.flowAscii}
      </pre>
      <p className={styles.footer}>{g.footer}</p>
    </aside>
  );
}
