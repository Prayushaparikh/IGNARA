import { useCallback, useState } from "react";
import styles from "./LandingTaskDemo.module.css";

const DEMO_STATES = [
  [
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
    { icon: "tiFail", mark: "✗", st: "failed", stc: "stFail" },
    { icon: "tiFail", mark: "✗", st: "failed", stc: "stFail" },
    { icon: "tiWait", mark: "—", st: "skipped", stc: "stWait" },
  ],
  [
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
    { icon: "tiPass", mark: "✓", st: "passed", stc: "stPass" },
  ],
];

const ROWS = [
  "Valid transaction passes",
  "Negative amount rejected",
  "Invalid account_id rejected",
  "Unsupported currency rejected",
  "Multiple errors returned together",
];

export default function LandingTaskDemo() {
  const [run, setRun] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);

  const runTests = useCallback(() => {
    setRun((r) => r + 1);
  }, []);

  const state = DEMO_STATES[run % DEMO_STATES.length];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.ctx}>
          <span className={styles.pillP}>Midas Financial</span>
          <span className={styles.pillM}>Backend Engineer Intern · Task 2 of 6</span>
        </div>
        <div className={styles.progRow}>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotDone}`} />
            <span className={`${styles.dot} ${styles.dotNow}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <span className={styles.progLabel}>2 / 6</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.brief}>
          <h2>Task 2: Input validation module</h2>
          <div className={styles.chips}>
            <span className={styles.chipO}>Intermediate</span>
            <span className={styles.chipG}>25–30 min</span>
          </div>
          <div className={styles.label}>Background</div>
          <p className={styles.btext}>
            Midas processes thousands of payment transactions per minute. Inputs must be validated before they hit
            the pipeline — bad data here is cheap; bad data in production is not.
          </p>
          <div className={styles.label}>Requirements</div>
          <ul className={styles.reqs}>
            <li>Accept: amount (float), account_id (string), currency (string)</li>
            <li>Reject zero or negative amounts with a clear error</li>
            <li>account_id: alphanumeric, 8–12 characters</li>
            <li>Currency: USD, EUR, GBP, or JPY</li>
            <li>Return {"{"} valid: bool, errors: [...] {"}"}</li>
          </ul>
          <div className={styles.label}>Portfolio line</div>
          <div className={styles.portfolio}>
            &quot;Built a financial transaction validation module with edge-case handling — Midas Backend
            Simulation&quot;
          </div>
        </div>

        <div className={styles.codeCol}>
          <div className={styles.chrome}>
            <div className={styles.bar}>
              <span className={styles.edDot} style={{ background: "#FF5F57" }} />
              <span className={styles.edDot} style={{ background: "#FFBD2E" }} />
              <span className={styles.edDot} style={{ background: "#28C840" }} />
              <span className={styles.file}>validate.py</span>
            </div>
            <div className={styles.editorBody}>
              <span className={styles.kw}>def</span> <span className={styles.fn}>validate_transaction</span>(amount,
              account_id, currency):
              <br />
              &nbsp;&nbsp;<span className={styles.cmt}># Your implementation here</span>
              <br />
              &nbsp;&nbsp;errors = []
              <br />
              <br />
              &nbsp;&nbsp;<span className={styles.kw}>if</span> amount &lt;= <span className={styles.num}>0</span>:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;errors.append(<span className={styles.str}>&quot;Amount must be positive&quot;</span>
              )
              <br />
              <br />
              &nbsp;&nbsp;<span className={styles.cmt}># TODO: account_id, currency</span>
              <br />
              <br />
              &nbsp;&nbsp;<span className={styles.kw}>return</span> {"{"}
              <span className={styles.str}>&quot;valid&quot;</span>: <span className={styles.kw}>len</span>(errors) ==
              <span className={styles.num}> 0</span>, <span className={styles.str}>&quot;errors&quot;</span>: errors{"}"}
              <span className={styles.cursor} aria-hidden />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnRun} onClick={runTests}>
              ▶ Run tests
            </button>
            <button
              type="button"
              className={styles.btnHint}
              onClick={() => setHintOpen((v) => !v)}
              aria-expanded={hintOpen}
            >
              AI hint
            </button>
          </div>

          <div className={styles.tests}>
            <div className={styles.ttitle}>Test results</div>
            {ROWS.map((name, i) => (
              <div key={name} className={styles.trow}>
                <div className={`${styles.ticon} ${styles[state[i].icon]}`}>{state[i].mark}</div>
                <span className={styles.tname}>{name}</span>
                <span className={`${styles.st} ${styles[state[i].stc]}`}>{state[i].st}</span>
              </div>
            ))}
          </div>

          <div className={`${styles.hint} ${hintOpen ? styles.show : ""}`} id="landing-demo-hint">
            <div className={styles.hhead}>AI Tutor — based on Code DNA</div>
            <div className={styles.htext}>
              You&apos;re checking <code>len(account_id)</code> but not whether characters are alphanumeric. Try{" "}
              <code>account_id.isalnum()</code> together with length using <code>and</code>.
            </div>
            <div className={styles.hdna}>Code DNA signal: string-method-gap</div>
          </div>
        </div>
      </div>
    </div>
  );
}
