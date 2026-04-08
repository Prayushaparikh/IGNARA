import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Foundation.module.css";
import { FOUNDATION_UNITS } from "../data/foundationCurriculum.js";
import { getFoundationProgress, getUnitCompletion } from "../utils/foundationProgress.js";
import { skipsFoundationTrack } from "../utils/placement.js";
import api from "../services/api.js";

export default function FoundationOverview() {
  const nav = useNavigate();
  const progress = getFoundationProgress();
  const [placementLevel, setPlacementLevel] = useState(null);
  const [placementLoading, setPlacementLoading] = useState(true);

  useEffect(() => {
    api
      .get("/progress/me")
      .then((res) => {
        const level = res.data?.studentProfile?.placement?.level ?? null;
        setPlacementLevel(level);
      })
      .catch(() => setPlacementLevel(null))
      .finally(() => setPlacementLoading(false));
  }, []);

  const optionalReview = skipsFoundationTrack(placementLevel);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">Foundation track</span>
        <h1>B1-B4 Learning Journey</h1>
        <p>Complete lesson, 5 challenges, then project for each unit.</p>
      </div>

      {!placementLoading && !placementLevel && (
        <div className={styles.placementHint}>
          <p>
            <strong>Tip:</strong> Take the placement quiz from your dashboard so we can align your main path (Foundation vs
            intermediate/advanced units).
          </p>
          <button type="button" className="btn btn-ghost" onClick={() => nav("/quiz")}>
            Go to quiz →
          </button>
        </div>
      )}

      {optionalReview && (
        <div className={styles.placementBanner}>
          <span className="badge badge-amber">Optional review</span>
          <p>
            Your quiz placed you on <strong>{placementLevel}</strong> — your main path lives under{" "}
            <strong>Challenges</strong>. These four units stay unlocked if you want to revisit basics.
          </p>
        </div>
      )}

      <div className={styles.unitGrid}>
        {FOUNDATION_UNITS.map((unit) => {
          const unitProgress = progress.units[unit.id];
          const completion = getUnitCompletion(unitProgress);
          const unlocked = optionalReview || unitProgress.unlocked;
          const statusLabel = optionalReview ? "Open (review)" : unlocked ? "Unlocked" : "Locked";

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
                <span>{statusLabel}</span>
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
