import { useMemo } from "react";
import { parseGithubRepoUrl, repoSlugMatchesExpected } from "./RepoValidator.js";
import RepoValidator from "./RepoValidator.jsx";
import SuccessCelebration from "./SuccessCelebration.jsx";
import styles from "./ProjectGitHubFlow.module.css";
import { COPY } from "../../copy/foundationCopy.js";

function slugNamePart(name) {
  const first = (name || "").trim().split(/\s+/)[0] || "";
  return first
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function GitHubDragDropStepper({
  studentName,
  step,
  setStep,
  repoUrl,
  setRepoUrl,
  dropped,
  setDropped,
  successHttps,
  setSuccessHttps,
  copyCodeOk,
  onCopyCode,
  onRequestHelper,
  nextUnitId,
}) {
  const namePart = useMemo(() => slugNamePart(studentName), [studentName]);
  const expectedRepoSlug = namePart ? `ignara-calculator-b2-${namePart}` : "ignara-calculator-b2";
  const newRepoHref = useMemo(
    () => `https://github.com/new?name=${encodeURIComponent(expectedRepoSlug)}`,
    [expectedRepoSlug]
  );

  const parsed = parseGithubRepoUrl(repoUrl);
  const urlValid = repoSlugMatchesExpected(parsed, expectedRepoSlug);

  const gitAdvancedBlock = useMemo(() => {
    const file = "calculator.py";
    const msg = COPY.project.advancedCommitMsg;
    return `git init
git add ${file}
git commit -m "${msg}"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/${expectedRepoSlug}.git
git push -u origin main`;
  }, [expectedRepoSlug]);

  const firstName = studentName?.trim().split(/\s+/)[0] || "";

  const finishWithUrl = () => {
    if (!urlValid || !parsed.ok) return;
    setSuccessHttps(parsed.httpsUrl);
    setStep(4);
  };

  if (step >= 4 && successHttps) {
    return (
      <>
        <p className={styles.stepLead}>{COPY.project.doneShareLead}</p>
        <SuccessCelebration
          httpsRepoUrl={successHttps}
          displayName={studentName}
          firstName={firstName}
          onViewLive={() => window.open(successHttps, "_blank", "noopener,noreferrer")}
          onShare={() => void navigator.clipboard.writeText(successHttps)}
          continueHref="/foundation"
          continueLabel={COPY.project.continueNextUnit(nextUnitId)}
        />
        <button type="button" className={`btn btn-ghost ${styles.stuckBtn}`} onClick={onRequestHelper}>
          {COPY.project.stuckGithub}
        </button>
      </>
    );
  }

  return (
    <div className={styles.flowWrap}>
      <p className={styles.stepLead}>{COPY.project.githubTwoMinute}</p>

      {/* Step 1 — copy */}
      <div className={styles.stepBlock}>
        {copyCodeOk ? (
          <div className={styles.checkRow}>
            <span aria-hidden>✅</span>
            <span>{COPY.project.codeCopied}</span>
          </div>
        ) : (
          <>
            <p className={styles.stepLead}>{COPY.project.saveAsCalculator}</p>
            <button type="button" className="btn btn-primary" onClick={onCopyCode}>
              {COPY.project.copyForGithub}
            </button>
          </>
        )}
        {copyCodeOk && step === 1 && (
          <div className={styles.flowNav}>
            <span />
            <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
              {COPY.project.nextStep}
            </button>
          </div>
        )}
      </div>

      {/* Step 2 — open GitHub + drag */}
      {step >= 2 && (
        <div className={styles.stepBlock}>
          <a
            className="btn btn-primary"
            href={newRepoHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            {COPY.project.openGithubRocket}
          </a>
          <p className={styles.commitHint}>
            {COPY.project.commitMessageHint} <code>{COPY.project.suggestedCommit}</code>
          </p>
          <p className={styles.dropHint} style={{ marginTop: 14 }}>
            {COPY.project.dragHere}
          </p>
          <div
            className={`${styles.dropZone} ${dropped ? styles.dropZoneActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDropped(true);
            }}
            role="region"
            aria-label="Drop zone for calculator file"
          >
            <p className={styles.dropHint}>{COPY.project.dropZoneHint}</p>
            <span className={styles.dropFile}>calculator.py</span>
            <div className={styles.dropShot}>{COPY.project.dropScreenshotPlaceholder}</div>
          </div>
          {dropped && (
            <p className={styles.repoOk} style={{ marginTop: 10 }}>
              {COPY.project.dropNice}
            </p>
          )}
          <div className={styles.flowNav}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              {COPY.project.stepBackShort}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
              {COPY.project.nextStep}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — paste URL */}
      {step >= 3 && (
        <div className={styles.stepBlock}>
          <RepoValidator
            value={repoUrl}
            onChange={setRepoUrl}
            expectedRepoSlug={expectedRepoSlug}
            copyPerfect={COPY.project.repoPerfect}
            copyTryAgain={COPY.project.repoTryAgain}
            copyCreateNew={COPY.project.repoCreateNew}
          />
          <div className={styles.flowNav}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
              {COPY.project.stepBackShort}
            </button>
            <button type="button" className="btn btn-primary" disabled={!urlValid} onClick={finishWithUrl}>
              {COPY.project.readyContinue}
            </button>
          </div>
        </div>
      )}

      <details className={styles.advanced}>
        <summary>{COPY.project.showGitAdvanced}</summary>
        <pre>{gitAdvancedBlock}</pre>
      </details>

      <button type="button" className={`btn btn-ghost ${styles.stuckBtn}`} onClick={onRequestHelper}>
        {COPY.project.stuckGithub}
      </button>
    </div>
  );
}
