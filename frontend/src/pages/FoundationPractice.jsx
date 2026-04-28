import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "./Foundation.module.css";
import { B1_CHALLENGES, FOUNDATION_LESSONS, STARTER_TEMPLATES } from "../data/foundationCurriculum.js";
import { canOpenChallenge } from "../utils/foundationProgress.js";
import { useProgressStore } from "../store/progressStore.js";
import { useSubmitAttempt } from "../hooks/useSubmitAttempt.js";
import VisualGuide from "../components/foundation/VisualGuide.jsx";
import ProgressiveHints from "../components/foundation/ProgressiveHints.jsx";
import { COPY } from "../copy/foundationCopy.js";
import { getB1LessonPartForSectionId } from "../data/b1LessonData.js";

const LANGS = ["Python", "C++", "Java"];

export default function FoundationPractice() {
  const nav = useNavigate();
  const { unitId = "b1", challengeId = "1" } = useParams();
  const challengeNum = Number(challengeId);
  const challenge    = B1_CHALLENGES.find((c) => c.id === challengeNum);

  // ── Progress (API-backed Zustand store) ──────────────────────────────────
  const { units, sync } = useProgressStore();
  const unitProgress    = units?.[unitId];

  useEffect(() => {
    if (!units) sync();
  }, [units, sync]);

  // ── Editor state ──────────────────────────────────────────────────────────
  const editorPanelRef  = useRef(null);
  const [language,      setLanguage]      = useState("Python");
  const [code,          setCode]          = useState(() => STARTER_TEMPLATES.Python[challengeNum] || "");
  const [output,        setOutput]        = useState(COPY.practice.outputIdle);
  const [focusMode,     setFocusMode]     = useState(false);
  const [showQuickRef,  setShowQuickRef]  = useState(false);
  const [mobilePanel,   setMobilePanel]   = useState("challenge");

  // ── Derived progress values ───────────────────────────────────────────────
  const completedMap  = unitProgress?.challenges || {};
  const passedCurrent = Boolean(completedMap[String(challengeNum)]);
  const nextUnlocked  = passedCurrent;
  const quickReference = FOUNDATION_LESSONS[unitId]?.quickReference || [];

  // ── Real submission hook ──────────────────────────────────────────────────
  const { submit, submitting, result, error: submitError } = useSubmitAttempt(unitId, challengeNum);

  // Reset code + output when challenge or language changes
  useEffect(() => {
    setCode(STARTER_TEMPLATES[language]?.[challengeNum] || "");
    setOutput(COPY.practice.outputIdle);
  }, [challengeNum, language]);

  // Update the output panel when a submission result arrives
  useEffect(() => {
    if (!result) return;
    if (result.passed) {
      setOutput(COPY.practice.outputPassed(result.results?.length ?? 0));
    } else {
      const lines = (result.results || []).map((t) => {
        const label  = t.input !== "[hidden]" ? `Input: ${t.input}` : "hidden test";
        const detail = !t.passed && t.stderr ? ` — ${t.stderr}` : "";
        return `${t.passed ? "✓" : "✗"} ${label}${detail}`;
      });
      setOutput(lines.join("\n") || "Some tests failed. Check your logic and try again.");
    }
  }, [result]);

  // Show network / server errors in the output panel
  useEffect(() => {
    if (submitError) setOutput(`⚠ ${submitError}`);
  }, [submitError]);

  // ── Guards (wait for progress to load before redirecting) ─────────────────
  if (!challenge) return <Navigate to="/foundation" replace />;
  if (units && !unitProgress?.unlocked) return <Navigate to="/foundation" replace />;
  if (units && unitProgress && !canOpenChallenge(unitProgress, challengeNum)) {
    const lessonBase = unitId === "b1" ? `/foundation/${unitId}/lesson/1` : `/foundation/${unitId}/lesson`;
    return <Navigate to={lessonBase} replace />;
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const switchLang = (nextLang) => {
    if (nextLang === language) return;
    if (!window.confirm(COPY.practice.langSwitchConfirm)) return;
    setLanguage(nextLang);
    setOutput(COPY.practice.outputIdle);
  };

  // TODO: wire to POST /api/compiler/run for free-form execution
  const runCode = () => setOutput(COPY.practice.outputRunning);

  const submitCode = () => {
    setOutput("Submitting…");
    submit(code, language);
  };

  const languageMonaco = useMemo(() => {
    if (language === "C++")  return "cpp";
    if (language === "Java") return "java";
    return "python";
  }, [language]);

  const toggleFocus = async () => {
    if (!document.fullscreenElement && editorPanelRef.current) {
      await editorPanelRef.current.requestFullscreen();
      setFocusMode(true);
    } else {
      await document.exitFullscreen();
      setFocusMode(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">{COPY.practice.breadcrumb(unitId, challengeNum)}</span>
        <h1>{challenge.title}</h1>
        <p>{challenge.instructions}</p>
      </div>

      <div className={styles.mobileTabs}>
        <button
          className={`btn btn-ghost ${mobilePanel === "challenge" ? styles.mobileActive : ""}`}
          onClick={() => setMobilePanel("challenge")}
        >
          {COPY.practice.mobileChallenge}
        </button>
        <button
          className={`btn btn-ghost ${mobilePanel === "editor" ? styles.mobileActive : ""}`}
          onClick={() => setMobilePanel("editor")}
        >
          {COPY.practice.mobileEditor}
        </button>
      </div>

      <div className={styles.practiceLayout}>
        {/* ── Left panel: challenge description ── */}
        <section className={`${styles.box} ${mobilePanel === "editor" ? styles.mobileHide : ""}`}>
          <h3>{COPY.practice.instructionsTitle}</h3>
          <p>{challenge.instructions}</p>
          {challenge.testsIt && (
            <p className={styles.metaLine}>
              <strong>{COPY.practice.testsItLabel}</strong> {challenge.testsIt}
            </p>
          )}
          {challenge.needsYouToKnow && (
            <p className={styles.metaLine}>
              <strong>{COPY.practice.needsLabel}</strong> {challenge.needsYouToKnow}
            </p>
          )}
          <VisualGuide guide={challenge.visualGuide} />
          {challenge.commonMistakes?.length > 0 && (
            <div className={styles.commonMistakes}>
              <h4>{COPY.practice.commonMistakesTitle}</h4>
              {challenge.commonMistakes.map((m, i) => (
                <div key={i} className={styles.mistakeMini}>
                  <strong>{m.symptom}</strong>
                  <p>{COPY.practice.whyPrefix} {m.why}</p>
                  <p>{COPY.practice.fixPrefix} {m.fix}</p>
                </div>
              ))}
            </div>
          )}
          <h4 style={{ marginTop: 10 }}>{COPY.practice.testCasesTitle}</h4>
          {challenge.testCases.map((tc, idx) => (
            <div key={idx} className={styles.testCase}>
              Input: {tc.input} | Expected: {tc.expected}
            </div>
          ))}

          <ProgressiveHints key={challengeNum} hints={challenge.progressiveHints} />

          {/* ── Misconception sensor ── */}
          <h4 style={{ marginTop: 12 }}>{COPY.helper.title}</h4>
          {!result || result.passed ? (
            <div className={styles.sensorIdle}>{COPY.helper.idleLine}</div>
          ) : (
            <div className={styles.sensorActive}>
              <strong>{COPY.helper.subtitle}</strong>
              {result.tutor?.hint ? (
                <p className={styles.hintText}>{result.tutor.hint}</p>
              ) : (
                <p className={styles.hintText}>
                  {COPY.feedbackByChallenge?.[challengeNum]?.clue || "Review the lesson for a refresher."}
                </p>
              )}
              {result.tutor?.title && (
                <span className={styles.tag}>{result.tutor.title}</span>
              )}
              <Link
                className={styles.reviewLink}
                to={`/foundation/${unitId}/lesson/1`}
              >
                {COPY.helper.reviewLink}
              </Link>
            </div>
          )}

          {/* ── Mastered card ── */}
          {passedCurrent && (
            <div className={styles.masteredCard}>
              <strong>{COPY.mastered.title}</strong>
              {challenge.mastered?.body ? (
                <p className={styles.masteredLead}>{challenge.mastered.body}</p>
              ) : challenge.mastered ? (
                <>
                  <p className={styles.masteredLead}>{challenge.mastered.learned}</p>
                  <p>
                    <strong>{COPY.helper.whyLabel}</strong> {challenge.mastered.whyItMatters}
                  </p>
                  {challenge.mastered.funFact && (
                    <p className={styles.funFact}>
                      <strong>Fun fact:</strong> {challenge.mastered.funFact}
                    </p>
                  )}
                </>
              ) : (
                <p>{COPY.mastered.fallback}</p>
              )}
            </div>
          )}
        </section>

        {/* ── Right panel: editor ── */}
        <section
          ref={editorPanelRef}
          className={`${styles.box} ${mobilePanel === "challenge" ? styles.mobileHide : ""}`}
        >
          <div className={styles.editorHeader}>
            <button className="btn btn-ghost" onClick={toggleFocus}>
              {focusMode ? COPY.practice.focusOff : COPY.practice.focusOn}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowQuickRef((v) => !v)}>
              {showQuickRef ? COPY.practice.quickRefHide : COPY.practice.quickRefShow}
            </button>
          </div>
          {showQuickRef && (
            <aside className={styles.quickRef}>
              <h4>{COPY.practice.quickRefTitle}</h4>
              <ul className={styles.inlineList}>
                {quickReference.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </aside>
          )}
          <div className={styles.editorWrap}>
            <div className={styles.tabs}>
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  className={`${styles.tab} ${lang === language ? styles.tabActive : ""}`}
                  onClick={() => switchLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Editor
              height="320px"
              language={languageMonaco}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{ fontSize: 14, lineNumbers: "on", minimap: { enabled: false } }}
            />
          </div>
          <div className={styles.actions}>
            <button className="btn btn-ghost" onClick={runCode} disabled={submitting}>
              ▶ {COPY.practice.runCode}
            </button>
            <button
              className="btn btn-primary"
              onClick={submitCode}
              disabled={!code.trim() || submitting}
            >
              {submitting ? "⏳ Checking…" : `✓ ${COPY.practice.checkWork}`}
            </button>
          </div>
          <div className={styles.output}>{output}</div>
        </section>
      </div>

      <div className={styles.nav}>
        {challengeNum > 1 ? (
          <Link className="btn btn-ghost" to={`/foundation/${unitId}/practice/${challengeNum - 1}`}>
            {COPY.practice.prevChallenge}
          </Link>
        ) : (
          <Link
            className="btn btn-ghost"
            to={unitId === "b1" ? `/foundation/${unitId}/lesson/1` : `/foundation/${unitId}/lesson`}
          >
            {COPY.practice.toLesson}
          </Link>
        )}

        {challengeNum < 5 ? (
          <button
            className="btn btn-primary"
            disabled={!nextUnlocked}
            onClick={() => nav(`/foundation/${unitId}/practice/${challengeNum + 1}`)}
          >
            {COPY.practice.nextChallenge}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={!nextUnlocked}
            onClick={() => nav(`/foundation/${unitId}/project`)}
          >
            {COPY.practice.toProject}
          </button>
        )}
      </div>
    </div>
  );
}
