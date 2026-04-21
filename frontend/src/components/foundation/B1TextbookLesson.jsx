import { Link } from "react-router-dom";
import CodeWalkthrough from "./CodeWalkthrough.jsx";
import styles from "./B1TextbookLesson.module.css";
import { B1_CHALLENGES_ENHANCED } from "../../data/b1ChallengeData.js";
import { useProgressStore } from "../../store/progressStore.js";

const OPS = [
  { sym: "+", name: "Add", ex: "5 + 3 = 8" },
  { sym: "-", name: "Subtract", ex: "10 - 4 = 6" },
  { sym: "*", name: "Multiply", ex: "7 * 2 = 14" },
  { sym: "/", name: "Divide", ex: "10 / 3 = 3.33..." },
  { sym: "//", name: "Floor Divide", ex: "10 // 3 = 3" },
  { sym: "%", name: "Remainder", ex: "10 % 3 = 1" },
];

/**
 * Long-form B1 lesson matching the static HTML prototype (Variables, I/O, math, mistakes).
 */
export default function B1TextbookLesson({ lesson, unitId }) {
  const nChallenges    = B1_CHALLENGES_ENHANCED?.length ?? 5;
  const wt             = lesson.walkthrough;
  const markLessonRead = useProgressStore((s) => s.markLessonRead);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/foundation">Foundation Track</Link>
          {" / "}
          <span>B1: Foundations</span>
        </div>
        <h1 className={styles.title}>{lesson.title}</h1>
        <div className={styles.meta}>
          <span>
            📚 <strong>Lesson</strong>
          </span>
          <span>
            ⏱️ {lesson.readingTime} read
          </span>
          <span>
            🎯 {nChallenges} challenges
          </span>
        </div>
      </header>

      <div className={styles.intro}>
        <h2>What You&apos;ll Learn</h2>
        <p>
          Store information in variables, talk to your program with input/output, do basic math, and avoid the
          mistakes that trip up 90% of beginners.
        </p>
      </div>

      <section className={styles.section}>
        <h2>
          <span className={styles.num}>1</span> Variables
        </h2>
        <p>Variables store information. Think of them like labeled boxes.</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>
              name = &quot;Alex&quot; <span className={styles.comment}># A box labeled &apos;name&apos; contains &quot;Alex&quot;</span>
              {"\n\n"}
              age = 16 <span className={styles.comment}># A box labeled &apos;age&apos; contains 16</span>
              {"\n"}
              score = 0 <span className={styles.comment}># A box labeled &apos;score&apos; contains 0</span>
            </code>
          </pre>
        </div>
        <div className={styles.example}>
          <div className={styles.exampleTitle}>✓ Key Rule</div>
          <p>
            <strong>Text needs quotes.</strong> Numbers don&apos;t.
          </p>
          <div className={styles.monoLines}>
            city = &quot;London&quot; ✓{"\n"}
            height = 170 ✓
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>
          <span className={styles.num}>2</span> Input &amp; Output
        </h2>
        <p>Make your program talk to users.</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>
              <span className={styles.comment}># Get info from user</span>
              {"\n\n"}
              name = input(&quot;What&apos;s your name? &quot;)
              {"\n\n"}
              <span className={styles.comment}># Show info on screen</span>
              {"\n"}
              print(&quot;Hello&quot;, name)
            </code>
          </pre>
        </div>
        <div className={styles.warning}>
          <div className={styles.warningIcon} aria-hidden>
            🚨
          </div>
          <h3>SUPER IMPORTANT: input() gives TEXT!</h3>
          <p>
            If you want to do math, you MUST use <code className={styles.inlineCode}>int()</code> to convert:
          </p>
          <div className={styles.codeBlock} style={{ marginTop: 12 }}>
            <pre>
              <code>
                <span className={styles.comment}># WRONG - can&apos;t do math with text:</span>
                {"\n\n"}
                age = input(&quot;Your age? &quot;) <span className={styles.comment}># gives &quot;16&quot; (text!)</span>
                {"\n\n"}
                <span className={styles.comment}># RIGHT - converts to number:</span>
                {"\n"}
                age = int(input(&quot;Your age? &quot;)) <span className={styles.comment}># gives 16 (number!)</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>
          <span className={styles.num}>3</span> Math Operators
        </h2>
        <p>Do calculations with numbers.</p>
        <div className={styles.operators}>
          {OPS.map((op) => (
            <div key={op.sym} className={styles.opCard}>
              <div className={styles.opSymbol}>{op.sym}</div>
              <div className={styles.opName}>{op.name}</div>
              <div className={styles.opExample}>{op.ex}</div>
            </div>
          ))}
        </div>
        <div className={styles.example}>
          <div className={styles.exampleTitle}>💡 Pro Tip</div>
          <p>
            Use <strong>%</strong> to check even/odd: If{" "}
            <code className={styles.inlineCode}>number % 2 == 0</code>, it&apos;s even!
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>
          <span className={styles.num}>4</span> Common Mistakes
        </h2>
        <p>Avoid these and you&apos;re ahead of most beginners!</p>

        <div className={styles.mistake}>
          <div className={styles.mistakeHeader}>
            <div className={styles.mistakeNum}>1</div>
            <h4>Forgetting int() Conversion</h4>
          </div>
          <p className={styles.mistakeLead}>This is THE most common beginner mistake.</p>
          <div className={styles.mistakeContent}>
            <div>
              <div className={`${styles.label} ${styles.labelWrong}`}>❌ Wrong</div>
              <div className={styles.wrong}>
                num = input()
                {"\n"}
                print(num + 5)
                {"\n"}# Shows &quot;165&quot; not 21!
              </div>
            </div>
            <div>
              <div className={`${styles.label} ${styles.labelRight}`}>✓ Right</div>
              <div className={styles.right}>
                num = int(input())
                {"\n"}
                print(num + 5)
                {"\n"}# Shows 21 ✓
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mistake}>
          <div className={styles.mistakeHeader}>
            <div className={styles.mistakeNum}>2</div>
            <h4>Mixing Text + Numbers with +</h4>
          </div>
          <p className={styles.mistakeLead}>Can&apos;t glue text and numbers together.</p>
          <div className={styles.mistakeContent}>
            <div>
              <div className={`${styles.label} ${styles.labelWrong}`}>❌ Wrong</div>
              <div className={styles.wrong}>
                age = 16{"\n"}
                print(&quot;Age: &quot; + age)
                {"\n"}# ERROR!
              </div>
            </div>
            <div>
              <div className={`${styles.label} ${styles.labelRight}`}>✓ Right</div>
              <div className={styles.right}>
                age = 16{"\n"}
                print(&quot;Age:&quot;, age)
                {"\n"}# Use comma!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Division & Decimal Formatting ── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.num}>5</span> Division &amp; Decimal Output
        </h2>
        <p>Python has two division operators. They give very different answers.</p>

        <div className={styles.codeBlock}>
          <pre>
            <code>
              7 / 2{" "}
              <span className={styles.comment}># → 3.5  (float division — keeps the decimal)</span>
              {"\n"}
              7 // 2{" "}
              <span className={styles.comment}># → 3    (floor division — drops the decimal)</span>
              {"\n"}
              7 % 2{" "}
              <span className={styles.comment}># → 1    (remainder — what's left over)</span>
            </code>
          </pre>
        </div>

        <div className={styles.warning}>
          <div className={styles.warningIcon} aria-hidden>⚠️</div>
          <h3>Use / for averages — never //</h3>
          <p>
            <code className={styles.inlineCode}>(2 + 2 + 3) // 3</code> gives{" "}
            <code className={styles.inlineCode}>2</code>, not{" "}
            <code className={styles.inlineCode}>2.333…</code>.
            {" "}Floor division silently truncates — your answer looks close but is wrong.
          </p>
        </div>

        <p>Raw float output can look messy. Use an f-string to control decimal places:</p>
        <div className={styles.codeBlock}>
          <pre>
            <code>
              avg = 7 / 3{" "}
              <span className={styles.comment}># 2.3333333333333335</span>
              {"\n\n"}
              print(f&quot;&#123;avg:.1f&#125;&quot;){" "}
              <span className={styles.comment}># 2.3  (exactly 1 decimal)</span>
              {"\n"}
              print(f&quot;&#123;avg:.2f&#125;&quot;){" "}
              <span className={styles.comment}># 2.33 (exactly 2 decimals)</span>
            </code>
          </pre>
        </div>

        <div className={styles.example}>
          <div className={styles.exampleTitle}>💡 C4 Pattern — Simple Average</div>
          <p>Three numbers in, average out, formatted to one decimal.</p>
          <div className={styles.monoLines}>
            a, b, c = map(int, input().split()){"\n"}
            print(f&quot;&#123;(a + b + c) / 3:.1f&#125;&quot;)
          </div>
        </div>
      </section>

      {wt?.code && wt?.steps?.length > 0 && (
        <div className={styles.walkthroughWrap}>
          <CodeWalkthrough title={wt.title} subtitle={wt.subtitle} code={wt.code} steps={wt.steps} />
        </div>
      )}

      <div className={styles.ctaSection}>
        <h2>🎯 Ready to Practice!</h2>
        <p>
          You&apos;ve got the basics. Now it&apos;s time to write real code and solve real problems.
          <br />
          The challenges will guide you step-by-step.
        </p>
        <Link
          className="btn btn-primary"
          style={{ display: "inline-block" }}
          to={`/foundation/${unitId}/practice/1`}
          onClick={() => markLessonRead(unitId)}
        >
          Start Challenge 1 →
        </Link>
      </div>

      <div className={styles.navBottom}>
        <Link className={`${styles.navBtn} ${styles.navBack}`} to="/foundation">
          ← Back to Track
        </Link>
        <Link
          className={`${styles.navBtn} ${styles.navNext}`}
          to={`/foundation/${unitId}/practice/1`}
          onClick={() => markLessonRead(unitId)}
        >
          Start Challenges →
        </Link>
      </div>
    </div>
  );
}
