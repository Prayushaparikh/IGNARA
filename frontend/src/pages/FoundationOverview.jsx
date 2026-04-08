import { Link } from "react-router-dom";
import styles from "./Foundation.module.css";
import { FOUNDATION_UNITS } from "../data/foundationCurriculum.js";
import { getFoundationProgress, getUnitCompletion } from "../utils/foundationProgress.js";

export default function FoundationOverview() {
  const progress = getFoundationProgress();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">Foundation track</span>
        <h1>B1-B4 Learning Journey</h1>
        <p>Complete lesson, 5 challenges, then project for each unit.</p>
      </div>

      <div className={styles.unitGrid}>
        {FOUNDATION_UNITS.map((unit) => {
          const unitProgress = progress.units[unit.id];
          const completion = getUnitCompletion(unitProgress);
          const unlocked = unitProgress.unlocked;

          return (
            <div key={unit.id} className={styles.unitCard}>
              <div className={styles.unitTop}>
                <span className={`badge ${unlocked ? "badge-ember" : "badge-violet"}`}>{unit.code}</span>
                <span className="text-mono text-muted">{unit.estimated}</span>
              </div>
              <h3 className={styles.unitTitle}>{unit.title}</h3>
              <p className={styles.unitSub}>{unit.subtitle}</p>
              <div className={styles.meta}>
                <span>{completion}% complete</span>
                <span>{unlocked ? "Unlocked" : "Locked"}</span>
              </div>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${completion}%` }} />
              </div>
              {unlocked ? (
                <Link className="btn btn-primary" to={`/foundation/${unit.id}/lesson`}>
                  {completion > 0 ? "Continue unit →" : "Start unit →"}
                </Link>
              ) : (
                <button className="btn btn-ghost" disabled>Locked</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
