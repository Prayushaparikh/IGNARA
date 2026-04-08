import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "./Foundation.module.css";
import { B1_CHALLENGES, FOUNDATION_LESSONS, STARTER_TEMPLATES } from "../data/foundationCurriculum.js";
import { canOpenChallenge, getFoundationProgress, markChallengePassed } from "../utils/foundationProgress.js";
import VisualGuide from "../components/foundation/VisualGuide.jsx";
import ProgressiveHints from "../components/foundation/ProgressiveHints.jsx";
import { COPY } from "../copy/foundationCopy.js";
import { getB1LessonPartForSectionId } from "../data/b1LessonData.js";

const LANGS = ["Python", "C++", "Java"];

export default function FoundationPractice() {
  const nav = useNavigate();
  const { unitId = "b1", challengeId = "1" } = useParams();
  const challengeNum = Number(challengeId);
  const challenge = B1_CHALLENGES.find((c) => c.id === challengeNum);
  const progress = getFoundationProgress();
  const unitProgress = progress.units[unitId];
  const editorPanelRef = useRef(null);
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(() => STARTER_TEMPLATES.Python[challengeNum] || "");
  const [output, setOutput] = useState(COPY.practice.outputIdle);
  const [result, setResult] = useState(null);
  const [completedMap, setCompletedMap] = useState(unitProgress?.challenges || {});
  const [focusMode, setFocusMode] = useState(false);
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [mobilePanel, setMobilePanel] = useState("challenge");

  const passedCurrent = Boolean(completedMap?.[String(challengeNum)]);
  const nextUnlocked = passedCurrent;
  const quickReference = FOUNDATION_LESSONS[unitId]?.quickReference || [];

  useEffect(() => {
    setCode(STARTER_TEMPLATES[language]?.[challengeNum] || "");
    setResult(null);
    setOutput(COPY.practice.outputIdle);
  }, [challengeNum, language]);

  if (!challenge || !unitProgress?.unlocked) return <Navigate to="/foundation" replace />;
  if (!canOpenChallenge(unitProgress, challengeNum)) {
    const lessonBase = unitId === "b1" ? `/foundation/${unitId}/lesson/1` : `/foundation/${unitId}/lesson`;
    return <Navigate to={lessonBase} replace />;
  }

  const switchLang = (nextLang) => {
    if (nextLang === language) return;
    const shouldReset = window.confirm(COPY.practice.langSwitchConfirm);
    if (!shouldReset) return;
    setLanguage(nextLang);
    setOutput(COPY.practice.outputIdle);
  };

  const runCode = () => {
    setOutput(COPY.practice.outputRunning);
    setResult(null);
  };

  const submitCode = () => {
    const evaluation = evaluateSubmission(challengeNum, code);
    setResult(evaluation);

    if (evaluation.passed) {
      markChallengePassed(unitId, challengeNum);
      setCompletedMap((prev) => ({ ...prev, [String(challengeNum)]: true }));
      setOutput(COPY.practice.outputPassed(evaluation.testResults.length));
      return;
    }
    setOutput(
      evaluation.testResults
        .map((t) => `${t.passed ? "✓" : "✗"} ${t.name}${t.detail ? ` — ${t.detail}` : ""}`)
        .join("\n")
    );
  };

  const languageMonaco = useMemo(() => {
    if (language === "C++") return "cpp";
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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-teal">{COPY.practice.breadcrumb(unitId, challengeNum)}</span>
        <h1>{challenge.title}</h1>
        <p>{challenge.instructions}</p>
      </div>

      <div className={styles.mobileTabs}>
        <button className={`btn btn-ghost ${mobilePanel === "challenge" ? styles.mobileActive : ""}`} onClick={() => setMobilePanel("challenge")}>{COPY.practice.mobileChallenge}</button>
        <button className={`btn btn-ghost ${mobilePanel === "editor" ? styles.mobileActive : ""}`} onClick={() => setMobilePanel("editor")}>{COPY.practice.mobileEditor}</button>
      </div>

      <div className={styles.practiceLayout}>
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
                  <p>
                    {COPY.practice.whyPrefix} {m.why}
                  </p>
                  <p>
                    {COPY.practice.fixPrefix} {m.fix}
                  </p>
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

          <h4 style={{ marginTop: 12 }}>{COPY.helper.title}</h4>
          {!result || result.passed ? (
            <div className={styles.sensorIdle}>{COPY.helper.idleLine}</div>
          ) : (
            <div className={styles.sensorActive}>
              <strong>{COPY.helper.subtitle}</strong>
              <p className={styles.hintText}>{result.aiHint}</p>
              <p>
                <strong>{COPY.helper.whyLabel}</strong> {result.whyItMatters}
              </p>
              <span className={styles.tag}>{result.misconceptionTag}</span>
              <Link
                className={styles.reviewLink}
                to={`/foundation/${unitId}/lesson/${
                  unitId === "b1"
                    ? FOUNDATION_LESSONS.b1?.lessonFormat === "minimal"
                      ? 1
                      : getB1LessonPartForSectionId(result.reviewSection)
                    : 1
                }#${result.reviewSection}`}
              >
                {COPY.helper.reviewLink}
              </Link>
            </div>
          )}

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

        <section ref={editorPanelRef} className={`${styles.box} ${mobilePanel === "challenge" ? styles.mobileHide : ""}`}>
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
            <button className="btn btn-ghost" onClick={runCode}>
              ▶ {COPY.practice.runCode}
            </button>
            <button className="btn btn-primary" onClick={submitCode} disabled={!code.trim()}>
              ✓ {COPY.practice.checkWork}
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

function evaluateSubmission(challengeId, code) {
  const text = (code || "").toLowerCase();

  const checksByChallenge = {
    1: [
      { name: "Reads input", passed: text.includes("input") || text.includes("cin") || text.includes("scanner") },
      { name: "Adds values", passed: text.includes("+") },
      { name: "Converts numeric input", passed: text.includes("int(") || text.includes("integer.parseint") || text.includes("stoi") },
    ],
    2: [
      { name: "Uses formula terms", passed: text.includes("9") && text.includes("5") && text.includes("32") },
      { name: "Uses multiplication/division", passed: text.includes("*") && text.includes("/") },
    ],
    3: [
      { name: "Uses modulo", passed: text.includes("%") },
      { name: "Checks even condition", passed: text.includes("== 0") || text.includes("==0") },
    ],
    4: [
      { name: "Computes average", passed: text.includes("/") },
      { name: "Formats decimal output", passed: text.includes(".1") || text.includes("round") || text.includes("format") },
    ],
    5: [
      { name: "Reads two values", passed: text.includes("input") || text.includes("cin") || text.includes("scanner") },
      { name: "Swaps values", passed: text.includes(",") || text.includes("temp") },
    ],
  };

  const testResults = checksByChallenge[challengeId] || [];
  const passed = testResults.every((t) => t.passed);

  const tagByChallenge = {
    1: "type-conversion-missing",
    2: "operator-precedence-error",
    3: "modulo-confusion",
    4: "integer-division-confusion",
    5: "variable-assignment-confusion",
  };
  const hintByChallenge = {
    1: "input() returns text. Convert values to integers before adding.",
    2: "Use F = C*9/5 + 32 exactly, and check operator order.",
    3: "Use n % 2 == 0 for even.",
    4: "Use float division and print with one decimal place.",
    5: "Swap values with tuple swap or temporary variable.",
  };
  const whyByChallenge = {
    1: "Without int(), Python treats numbers like text, so math operations behave incorrectly.",
    2: "Small formula mistakes change output dramatically in real applications.",
    3: "Modulo is the standard and most reliable way to check parity.",
    4: "Integer-only thinking can hide precision and produce wrong averages.",
    5: "Incorrect assignment order overwrites data before swap completes.",
  };

  const warm = COPY.feedbackByChallenge[challengeId] || {};

  return {
    passed,
    testResults,
    misconceptionTag: tagByChallenge[challengeId],
    aiHint: warm.clue || hintByChallenge[challengeId],
    whyItMatters: warm.why || whyByChallenge[challengeId],
    reviewSection: "section-2",
  };
}
