import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link, Navigate, useParams } from "react-router-dom";
import styles from "./Foundation.module.css";
import { PROJECT_CALCULATOR_STARTERS } from "../data/foundationCurriculum.js";
import { getFoundationProgress, markProjectDone } from "../utils/foundationProgress.js";
import { COPY } from "../copy/foundationCopy.js";
import { useAuthStore } from "../store/authStore.js";
import ProjectOutputTerminal from "../components/project/ProjectOutputTerminal.jsx";
import GitHubDragDropStepper from "../components/project/GitHubDragDropStepper.jsx";

const LANGS = ["Python", "C++", "Java"];
const GH_STORAGE = (unitId) => `foundation_github_flow_${unitId}`;

function loadGhState(unitId) {
  try {
    const raw = localStorage.getItem(GH_STORAGE(unitId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function evaluateCalculatorProject(code, language) {
  const t = (code || "").toLowerCase();
  const checks = [
    { name: "Reads user input", ok: /input|cin|scanner|nextdouble|nextint/.test(t) },
    { name: "Uses +, −, ×, or ÷", ok: /[\+\-\*\/]/.test(code || "") },
    { name: "Handles choices (if / else / switch)", ok: /\bif\b|\belse\b|\bswitch\b/.test(t) },
    {
      name: "Thinks about divide-by-zero",
      ok: /\b0\b/.test(t) && (/\bif\b/.test(t) || /!=|==|<>/.test(t) || /zero/.test(t)),
    },
  ];
  const passed = checks.filter((c) => c.ok).length >= 3;
  return { checks, passed };
}

export default function FoundationProject() {
  const { unitId = "b1" } = useParams();
  const user = useAuthStore((s) => s.user);
  const studentName = user?.name || "";

  const progress = getFoundationProgress();
  const unitProgress = progress.units[unitId];
  const allChallengesDone = [1, 2, 3, 4, 5].every((n) => unitProgress?.challenges?.[String(n)]);
  const savedGh = loadGhState(unitId);

  const editorPanelRef = useRef(null);
  const monacoRef = useRef(null);
  const gitHelperRef = useRef(null);
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(() => PROJECT_CALCULATOR_STARTERS.Python);
  const [githubFlowActive, setGithubFlowActive] = useState(Boolean(savedGh?.githubFlowActive));
  const [ghDragStep, setGhDragStep] = useState(savedGh?.ghDragStep || 1);
  const [ghRepoUrl, setGhRepoUrl] = useState(savedGh?.ghRepoUrl || "");
  const [ghDropped, setGhDropped] = useState(Boolean(savedGh?.ghDropped));
  const [ghSuccessHttps, setGhSuccessHttps] = useState(savedGh?.ghSuccessHttps || "");
  const [codeCopiedForGithub, setCodeCopiedForGithub] = useState(Boolean(savedGh?.ghCodeCopied));
  const [gitHelperOpen, setGitHelperOpen] = useState(false);
  const [projectResult, setProjectResult] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("checklist");
  const [focusMode, setFocusMode] = useState(false);

  const nextUnit = { b1: "b2", b2: "b3", b3: "b4" }[unitId];

  useEffect(() => {
    setCode(PROJECT_CALCULATOR_STARTERS[language] || PROJECT_CALCULATOR_STARTERS.Python);
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(
        GH_STORAGE(unitId),
        JSON.stringify({
          githubFlowActive,
          ghDragStep,
          ghRepoUrl,
          ghDropped,
          ghSuccessHttps,
          ghCodeCopied: codeCopiedForGithub,
        })
      );
    } catch {
      /* ignore */
    }
  }, [unitId, githubFlowActive, ghDragStep, ghRepoUrl, ghDropped, ghSuccessHttps, codeCopiedForGithub]);

  const languageMonaco = useMemo(() => {
    if (language === "C++") return "cpp";
    if (language === "Java") return "java";
    return "python";
  }, [language]);

  const switchLang = (nextLang) => {
    if (nextLang === language) return;
    const ok = window.confirm(COPY.practice.langSwitchConfirm);
    if (!ok) return;
    setLanguage(nextLang);
    setProjectResult(null);
  };

  const copyCode = useCallback(() => {
    const text = code || "";
    if (!text.trim()) return;
    void navigator.clipboard.writeText(text).then(() => {
      setCodeCopiedForGithub(true);
    });
  }, [code]);

  const openGitHubFlow = () => {
    setGithubFlowActive(true);
    setMobilePanel("checklist");
  };

  const exitGitHubFlow = () => {
    setGithubFlowActive(false);
  };

  const onRequestHelper = () => {
    setGitHelperOpen(true);
    window.requestAnimationFrame(() => {
      gitHelperRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const runProjectCheck = () => {
    setProjectResult(evaluateCalculatorProject(code, language));
    setGitHelperOpen(false);
  };

  const toggleFocus = async () => {
    if (!document.fullscreenElement && editorPanelRef.current) {
      await editorPanelRef.current.requestFullscreen();
      setFocusMode(true);
    } else {
      await document.exitFullscreen();
      setFocusMode(false);
    }
  };

  const runLiveFromDemo = () => {
    setMobilePanel("editor");
    window.requestAnimationFrame(() => {
      editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      monacoRef.current?.focus();
    });
  };

  if (!unitProgress?.unlocked) return <Navigate to="/foundation" replace />;
  if (!allChallengesDone) return <Navigate to={`/foundation/${unitId}/practice/1`} replace />;

  const helperHint = githubFlowActive
    ? COPY.project.helperDragSteps[Math.min(4, Math.max(1, ghDragStep))]
    : COPY.github.helperIdle;

  const checklist = (
    <>
      <h3>Project checklist</h3>
      <ul className={styles.projectChecklist}>
        <li>✓ Read two numbers and operator input.</li>
        <li>✓ Handle +, -, *, / operations.</li>
        <li>✓ Show friendly errors for invalid operator.</li>
        <li>✓ Prevent division by zero crash.</li>
        <li>Optional: add a short README with run instructions.</li>
      </ul>
      <ProjectOutputTerminal onRunLive={runLiveFromDemo} />
      <p className={styles.githubCtaHint} style={{ marginTop: 16 }}>
        {COPY.project.saveForeverHint}
      </p>
      <button type="button" className={`btn btn-primary ${styles.githubCta}`} onClick={openGitHubFlow}>
        {COPY.github.saveCta}
      </button>
    </>
  );

  return (
    <div className={styles.page}>
      {unitId === "b1" && (
        <div className={styles.warmClosing} style={{ marginBottom: 8 }}>
          <h4>{COPY.b1UnitComplete.title}</h4>
          <p>{COPY.b1UnitComplete.body}</p>
        </div>
      )}

      <div className={styles.header}>
        <span className="badge badge-green">{unitId.toUpperCase()} unit project</span>
        <h1>Build: Simple Calculator CLI</h1>
        <p>Create a command-line calculator with add/subtract/multiply/divide and zero-division handling.</p>
      </div>

      <div className={styles.mobileTabs}>
        <button
          type="button"
          className={`btn btn-ghost ${mobilePanel === "checklist" ? styles.mobileActive : ""}`}
          onClick={() => setMobilePanel("checklist")}
        >
          {githubFlowActive ? COPY.github.flowTitle : "Checklist & demo"}
        </button>
        <button
          type="button"
          className={`btn btn-ghost ${mobilePanel === "editor" ? styles.mobileActive : ""}`}
          onClick={() => setMobilePanel("editor")}
        >
          {COPY.practice.mobileEditor}
        </button>
      </div>

      <div className={styles.practiceLayout}>
        <section
          ref={editorPanelRef}
          className={`${styles.box} ${mobilePanel === "checklist" ? styles.mobileHide : ""}`}
        >
          <div className={styles.editorHeader}>
            <button type="button" className="btn btn-ghost" onClick={toggleFocus}>
              {focusMode ? COPY.practice.focusOff : COPY.practice.focusOn}
            </button>
          </div>
          <p className={styles.projectEditorLead}>
            Live compilers — polish your calculator here. The demo on the right shows what a finished run can look like.
          </p>
          <div className={styles.editorWrap}>
            <div className={styles.tabs}>
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`${styles.tab} ${lang === language ? styles.tabActive : ""}`}
                  onClick={() => switchLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Editor
              height="360px"
              language={languageMonaco}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              onMount={(editor) => {
                monacoRef.current = editor;
              }}
              options={{ fontSize: 14, lineNumbers: "on", minimap: { enabled: false } }}
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={copyCode}>
              {COPY.github.copyCode}
            </button>
            <button type="button" className="btn btn-primary" onClick={runProjectCheck}>
              {COPY.github.checkProject}
            </button>
          </div>
          {projectResult && (
            <div className={styles.projectCheckPanel}>
              <h4>{COPY.github.projectChecksTitle}</h4>
              <ul className={styles.projectCheckList}>
                {projectResult.checks.map((c) => (
                  <li key={c.name} className={c.ok ? styles.checkOk : styles.checkWarn}>
                    {c.ok ? "✓" : "○"} {c.name}
                  </li>
                ))}
              </ul>
              {!projectResult.passed && <p className={styles.metaLine}>{COPY.github.helperIdle}</p>}
            </div>
          )}

          <div
            ref={gitHelperRef}
            className={gitHelperOpen ? styles.sensorActive : styles.sensorIdle}
            style={{ marginTop: 14 }}
          >
            <strong>
              {githubFlowActive ? COPY.project.codeDnaPanelTitle : COPY.github.helperTitle}
            </strong>
            {gitHelperOpen ? (
              <p className={styles.hintText}>{helperHint}</p>
            ) : (
              <p className={styles.metaLine}>{COPY.github.helperIdle}</p>
            )}
          </div>
        </section>

        <section className={`${styles.box} ${mobilePanel === "editor" ? styles.mobileHide : ""}`}>
          {!githubFlowActive ? (
            checklist
          ) : (
            <>
              <div className={styles.githubFlowHeader}>
                <h3>{COPY.github.flowTitle}</h3>
                <button type="button" className="btn btn-ghost" onClick={exitGitHubFlow}>
                  {COPY.github.exitFlow}
                </button>
              </div>
              <GitHubDragDropStepper
                studentName={studentName}
                step={ghDragStep}
                setStep={setGhDragStep}
                repoUrl={ghRepoUrl}
                setRepoUrl={setGhRepoUrl}
                dropped={ghDropped}
                setDropped={setGhDropped}
                successHttps={ghSuccessHttps}
                setSuccessHttps={setGhSuccessHttps}
                copyCodeOk={codeCopiedForGithub}
                onCopyCode={copyCode}
                onRequestHelper={onRequestHelper}
                nextUnitId={nextUnit}
              />
            </>
          )}
        </section>
      </div>

      <div className={styles.nav}>
        <Link className="btn btn-ghost" to={`/foundation/${unitId}/practice/5`}>
          ← Back to Challenge 5
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            markProjectDone(unitId);
            window.location.assign("#/foundation");
          }}
        >
          Complete Unit
        </button>
      </div>

      {nextUnit && (
        <section className={styles.box}>
          <p>
            After completion, <strong>{nextUnit.toUpperCase()}</strong> is unlocked in the Foundation overview.
          </p>
        </section>
      )}
    </div>
  );
}
