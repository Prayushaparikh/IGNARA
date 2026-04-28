import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link, Navigate, useParams } from "react-router-dom";
import styles from "./Foundation.module.css";
import pro from "./FoundationProject.module.css";
import { PROJECT_CALCULATOR_STARTERS } from "../data/foundationCurriculum.js";
import { useProgressStore } from "../store/progressStore.js";
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

  const { units, sync, markProjectDone } = useProgressStore();
  const unitProgress = units?.[unitId];
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
  const [checkedItems, setCheckedItems] = useState(() => new Set());
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState(1);

  const nextUnit = { b1: "b2", b2: "b3", b3: "b4" }[unitId];

  // Fetch real progress from DB on mount
  useEffect(() => {
    if (!units) sync();
  }, [units, sync]);

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

  if (units && !unitProgress?.unlocked) return <Navigate to="/foundation" replace />;
  if (units && !allChallengesDone) return <Navigate to={`/foundation/${unitId}/practice/1`} replace />;

  const helperHint = githubFlowActive
    ? COPY.project.helperDragSteps[Math.min(4, Math.max(1, ghDragStep))]
    : COPY.github.helperIdle;

  const ext =
    language === "Python" ? "py" : language === "C++" ? "cpp" : "java";

  const CHECKLIST_STEPS = [
    { title: "Print a welcome message", desc: "Use print() to show a header" },
    { title: "Read two numbers", desc: "Use int(input()) for each number" },
    { title: "Ask for the operator", desc: 'Ask: "+ - * /" and store it' },
    { title: "Handle all 4 operations", desc: "Use if/elif to pick +, -, *, /" },
    { title: "Prevent divide-by-zero", desc: "Check if second number is 0" },
    { title: "Print the result nicely", desc: 'e.g. "5 + 3 = 8"' },
  ];

  const HINT_STEPS = [
    { title: "Print a welcome message", desc: "Start with a friendly header.", code: 'print("=== Simple Calculator ===")\nprint()' },
    { title: "Read two numbers", desc: "Convert input to int so you can do math.", code: "num1 = int(input(\"Enter first number: \"))\nnum2 = int(input(\"Enter second number: \"))" },
    { title: "Ask for the operator", desc: "Store it as a string.", code: 'op = input("Enter operator (+, -, *, /): ")' },
    { title: "Handle each operation", desc: "Use if/elif to pick the right math.", code: 'if op == "+":\n    result = num1 + num2\nelif op == "-":\n    result = num1 - num2\nelif op == "*":\n    result = num1 * num2\nelif op == "/":\n    result = num1 / num2\nelse:\n    print("Unknown operator!")\n    exit()' },
    { title: "Prevent divide-by-zero", desc: "Add a check before dividing.", code: 'elif op == "/":\n    if num2 == 0:\n        print("Error: Cannot divide by zero!")\n    else:\n        result = num1 / num2' },
    { title: "Print the result", desc: "Show it in a clean format.", code: 'print(f"\\n{num1} {op} {num2} = {result}")' },
  ];

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const checklist = (
    <>
      <div className={pro.proCardHead}>
        <span className={pro.proCardIcon} aria-hidden>💪</span>
        <h3 className={pro.proCardTitle}>Try it yourself first!</h3>
      </div>
      <p className={pro.proChecklistLead}>Check off each step as you build it. You know everything you need!</p>

      <div className={pro.proChecklistInteractive}>
        {CHECKLIST_STEPS.map((step, i) => {
          const done = checkedItems.has(i);
          return (
            <button
              key={i}
              type="button"
              className={`${pro.proCheckItem} ${done ? pro.proCheckItemDone : ""}`}
              onClick={() => toggleCheck(i)}
            >
              <span className={`${pro.proCheckBox} ${done ? pro.proCheckBoxDone : ""}`}>
                {done ? "✓" : ""}
              </span>
              <span className={pro.proCheckContent}>
                <span className={pro.proCheckTitle}>{step.title}</span>
                <span className={pro.proCheckDesc}>{step.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Progressive hints */}
      <div className={`${pro.proGlass} ${pro.proHintCard}`} style={{ marginTop: 16 }}>
        <div className={pro.proCardHead}>
          <span className={pro.proCardIcon} aria-hidden>💡</span>
          <h3 className={pro.proCardTitle}>Need help?</h3>
        </div>
        <p className={pro.proChecklistLead}>Stuck? We'll reveal one step at a time.</p>
        {!hintsOpen ? (
          <button
            type="button"
            className={pro.proHintTrigger}
            onClick={() => setHintsOpen(true)}
          >
            <span>📖</span>
            <span>Show me how to build it</span>
          </button>
        ) : (
          <div className={pro.proHintSteps}>
            {HINT_STEPS.slice(0, revealedHints).map((hint, i) => (
              <div key={i} className={pro.proHintStep} style={{ animationDelay: `${i * 60}ms` }}>
                <span className={pro.proHintNum}>{i + 1}</span>
                <div className={pro.proHintBody}>
                  <strong className={pro.proHintTitle}>{hint.title}</strong>
                  <p className={pro.proHintDesc}>{hint.desc}</p>
                  <pre className={pro.proHintCode}>{hint.code}</pre>
                  {i === revealedHints - 1 && revealedHints < HINT_STEPS.length && (
                    <button
                      type="button"
                      className={pro.proNextHintBtn}
                      onClick={() => setRevealedHints((n) => n + 1)}
                    >
                      Next step →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    <div className={`${styles.page} ${pro.proRoot}`}>
      <div className={pro.proInner}>
      {unitId === "b1" && (
        <div className={`${styles.warmClosing} ${pro.proWarm}`}>
          <h4>{COPY.b1UnitComplete.title}</h4>
          <p>{COPY.b1UnitComplete.body}</p>
        </div>
      )}

      <nav className={pro.proBreadcrumb} aria-label="Breadcrumb">
        <Link to="/foundation">Foundation</Link>
        <span aria-hidden className={pro.proBreadcrumbSep}>
          /
        </span>
        <span>
          {unitId.toUpperCase()} · Unit project
        </span>
      </nav>

      <div className={pro.proHeaderRow}>
        <h1 className={pro.proTitle}>Build: Simple Calculator CLI</h1>
        <div className={pro.proBadgeRow}>
          <span className={`${pro.proBadge} ${pro.proBadgeProject}`}>📟 Unit project</span>
          <span className={`${pro.proBadge} ${pro.proBadgeTime}`}>~60 min</span>
        </div>
      </div>

      <div className={pro.proIntro}>
        <div className={pro.proIntroInner}>
          <h2>What you’re shipping</h2>
          <p>
            A small command-line calculator: read input, apply + − × ÷, handle bad operators, and never
            divide by zero. When it works, you’ll push it to GitHub so it counts as portfolio proof.
          </p>
        </div>
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

      <div className={pro.proLayout}>
        <section
          ref={editorPanelRef}
          className={`${pro.proGlass} ${mobilePanel === "checklist" ? styles.mobileHide : ""}`}
        >
          <div className={pro.proCardHead}>
            <span className={pro.proCardIcon} aria-hidden>
              ⚡
            </span>
            <h3 className={pro.proCardTitle}>Editor</h3>
          </div>
          <div className={styles.editorHeader}>
            <button type="button" className="btn btn-ghost" onClick={toggleFocus}>
              {focusMode ? COPY.practice.focusOff : COPY.practice.focusOn}
            </button>
          </div>
          <p className={styles.projectEditorLead}>
            Live compiler — polish your calculator here. The panel beside this shows a sample run and your
            checklist.
          </p>
          <div className={pro.proEditorShell}>
            <div className={pro.proEditorTop}>
              <div className={pro.proDots} aria-hidden>
                <span className={`${pro.proDot} ${pro.proDotRed}`} />
                <span className={`${pro.proDot} ${pro.proDotYellow}`} />
                <span className={`${pro.proDot} ${pro.proDotGreen}`} />
              </div>
              <span className={pro.proEditorFile}>calculator.{ext}</span>
            </div>
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

        <section
          className={`${pro.proGlass} ${pro.proSidebar} ${mobilePanel === "editor" ? styles.mobileHide : ""}`}
        >
          {!githubFlowActive ? (
            <>
              <div className={pro.proProgressCard}>
                <div className={pro.proProgressTop}>
                  <span className={pro.proProgressLabel}>Unit progress</span>
                  <span className={pro.proProgressValue}>Final project</span>
                </div>
                <div className={pro.proProgressBar} aria-hidden>
                  <div className={pro.proProgressFill} />
                </div>
              </div>
              {checklist}
            </>
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

      <div className={`${styles.nav} ${pro.proNav}`}>
        <Link className="btn btn-ghost" to={`/foundation/${unitId}/practice/5`}>
          ← Back to Challenge 5
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            await markProjectDone(unitId);
            window.location.assign("#/foundation");
          }}
        >
          Complete Unit
        </button>
      </div>

      {nextUnit && (
        <section className={pro.proGlass}>
          <p>
            After completion, <strong>{nextUnit.toUpperCase()}</strong> is unlocked in the Foundation overview.
          </p>
        </section>
      )}
      </div>
    </div>
  );
}
