import { parseGithubRepoUrl, repoSlugMatchesExpected } from "./RepoValidator.js";
import styles from "./ProjectGitHubFlow.module.css";
import { COPY } from "../../copy/foundationCopy.js";

/**
 * Controlled input + validation UI for pasted repo URL.
 */
export default function RepoValidator({
  value,
  onChange,
  expectedRepoSlug,
  copyPerfect,
  copyTryAgain,
  copyCreateNew,
}) {
  const parsed = parseGithubRepoUrl(value);
  const valid = repoSlugMatchesExpected(parsed, expectedRepoSlug);

  let status = "idle";
  if (value.trim()) {
    status = valid ? "ok" : "bad";
  }

  return (
    <div className={styles.repoValidator}>
      <label className={styles.repoLabel} htmlFor="gh-repo-url">
        Paste repo URL here ↓
      </label>
      <input
        id="gh-repo-url"
        className={styles.repoInput}
        type="text"
        autoComplete="off"
        placeholder={`github.com/you/${expectedRepoSlug || "ignara-calculator-b2"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {status === "ok" && (
        <p className={styles.repoOk} role="status">
          ✅ {copyPerfect} <strong>{expectedRepoSlug}</strong>
          <br />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{COPY.project.repoReadyLine}</span>
        </p>
      )}
      {status === "bad" && (
        <p className={styles.repoBad} role="alert">
          ❌ {copyTryAgain}{" "}
          <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
            {copyCreateNew}
          </a>
        </p>
      )}
    </div>
  );
}
