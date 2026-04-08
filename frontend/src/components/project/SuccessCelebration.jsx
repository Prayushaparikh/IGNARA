import { Link } from "react-router-dom";
import styles from "./ProjectGitHubFlow.module.css";
import { COPY } from "../../copy/foundationCopy.js";

export default function SuccessCelebration({
  httpsRepoUrl,
  displayName,
  firstName,
  onViewLive,
  onShare,
  continueHref,
  continueLabel,
}) {
  const tagline = COPY.project.successTagline(firstName || displayName || "You");

  return (
    <div className={styles.successWrap}>
      <div className={styles.successEmoji} aria-hidden>
        🎉
      </div>
      <h4 className={styles.successTitle}>{COPY.project.successTitle}</h4>
      {httpsRepoUrl ? (
        <a
          className={styles.successUrl}
          href={httpsRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {httpsRepoUrl.replace(/^https:\/\//, "")}
        </a>
      ) : null}
      <p className={styles.successTagline}>{tagline}</p>
      <div className={styles.successActions}>
        <button type="button" className="btn btn-primary" onClick={onViewLive}>
          {COPY.project.viewLive}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onShare}>
          {COPY.project.shareWithFriends}
        </button>
        <Link className="btn btn-ghost" to={continueHref}>
          {continueLabel}
        </Link>
      </div>
    </div>
  );
}
