import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../services/api.js";
import styles from "./Compiler.module.css";

const LANG_MAP = { js: "javascript", python: "python", cpp: "cpp" };

export default function Compiler() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [lang, setLang]           = useState("js");
  const [code, setCode]           = useState("");
  const [output, setOutput]       = useState(null);
  const [running, setRunning]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]       = useState(null);
  const [failAttempts, setFailAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);

  useEffect(() => {
    api.get(`/challenges/${id}`).then(r => {
      setChallenge(r.data);
      const firstLang = r.data.language?.[0] || "js";
      setLang(firstLang);
      setCode(r.data.starter_code?.[firstLang] || "// Write your solution here\n");
    });
  }, [id]);

  const run = async () => {
    setRunning(true); setOutput(null); setResult(null);
    try {
      const { data } = await api.post("/compiler/run", { code, language: lang });
      setOutput(data);
    } finally { setRunning(false); }
  };

  const submit = async () => {
    setSubmitting(true); setResult(null); setOutput(null);
    try {
      const { data } = await api.post("/compiler/submit", { code, language: lang, challengeId: id });
      setResult(data);
      if (data.passed) {
        setFailAttempts(0);
        setHintLevel(0);
      } else {
        setFailAttempts((n) => n + 1);
      }
    } finally { setSubmitting(false); }
  };

  if (!challenge) return <div className={styles.loading}><span className={styles.spinner} /></div>;

  const allPassed = result?.passed;

  return (
    <div className={styles.page}>
      {/* ── Left: Problem ── */}
      <aside className={styles.problem}>
        <div className={styles.problemHeader}>
          <span className={`badge ${challenge.difficulty === "easy" ? "badge-teal" : challenge.difficulty === "hard" ? "badge-coral" : "badge-amber"}`}>
            {challenge.difficulty}
          </span>
          <h2 className={styles.title}>{challenge.title}</h2>
        </div>
        <div className={styles.description}>{challenge.description}</div>

        {/* Test cases preview */}
        <div className={styles.testSection}>
          <h4>Example Tests</h4>
          {challenge.test_cases?.filter(t => !t.is_hidden).slice(0,2).map((tc, i) => (
            <div key={i} className={styles.testCase}>
              {tc.input && <div><span className={styles.tcLabel}>Input:</span> <code>{tc.input}</code></div>}
              <div><span className={styles.tcLabel}>Expected:</span> <code>{tc.expected_output}</code></div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          {challenge.skill_tags?.map(t => <span key={t} className="badge badge-violet">{t}</span>)}
        </div>
      </aside>

      {/* ── Right: Editor + Output ── */}
      <div className={styles.editorSide}>
        {/* Lang selector + Actions */}
        <div className={styles.toolbar}>
          <div className={styles.langTabs}>
            {challenge.language?.map(l => (
              <button key={l} className={`${styles.langTab} ${lang === l ? styles.langActive : ""}`}
                onClick={() => { setLang(l); setCode(challenge.starter_code?.[l] || ""); }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              className="btn btn-ghost"
              onClick={() => setHintLevel((n) => Math.min(2, n + 1))}
              disabled={!result?.tutor}
            >
              Get a hint
            </button>
            <button className="btn btn-ghost" onClick={run} disabled={running || submitting}>
              {running ? "▶ Running…" : "▶ Run"}
            </button>
            <button className="btn btn-primary" onClick={submit} disabled={running || submitting}>
              {submitting ? "Submitting…" : "Submit →"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className={styles.editorWrap}>
          <Editor
            height="100%"
            language={LANG_MAP[lang] || lang}
            value={code}
            onChange={v => setCode(v || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Output Panel */}
        {(output || result) && (
          <div className={styles.outputPanel}>
            {output && (
              <div>
                <div className={styles.outputHeader}>Output</div>
                <pre className={styles.output}>{output.stdout || output.stderr || "(no output)"}</pre>
                {output.stderr && <pre className={styles.stderr}>{output.stderr}</pre>}
              </div>
            )}
            {result && (
              <div>
                <div className={`${styles.resultBanner} ${allPassed ? styles.pass : styles.fail}`}>
                  {allPassed ? "🎉 All tests passed!" : "✗ Some tests failed"}
                </div>
                <div className={styles.testResults}>
                  {result.results?.map((r, i) => (
                    <div key={i} className={`${styles.testRow} ${r.passed ? styles.testPass : styles.testFail}`}>
                      <span>{r.passed ? "✓" : "✗"}</span>
                      <span>Test {i + 1}</span>
                      {!r.passed && r.actual !== "✗" && (
                        <span className="text-muted" style={{ fontSize: 12 }}>
                          got <code>{r.actual}</code>, expected <code>{r.expected}</code>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {!result.passed && result.tutor && hintLevel > 0 && (
                  <div className={styles.hintBox}>
                    <strong>What happened:</strong> Your output did not match expected tests.
                    <br />
                    <strong>Why it happened:</strong> {result.tutor.title}.
                    <br />
                    <strong>Try this:</strong> {result.tutor.hint}
                  </div>
                )}
                {!result.passed && failAttempts >= 3 && (
                  <div className={styles.hintBox}>
                    <strong>Show solution:</strong> Re-read the prompt and rewrite from starter code. Solve one example input by hand first, then code that exact logic.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
