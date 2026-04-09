import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import ignaraLogo from "../assets/ignara-logo.svg";
import LandingTaskDemo from "../components/landing/LandingTaskDemo.jsx";

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Landing() {
  const [navTrack, setNavTrack] = useState("learn");

  const goLearn = useCallback(() => {
    setNavTrack("learn");
    scrollToId("learn-start");
  }, []);

  const goSim = useCallback(() => {
    setNavTrack("sim");
    scrollToId("sims");
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <img src={ignaraLogo} alt="" width={28} height={28} />
            <span>Ignara</span>
          </Link>

          <div className={styles.navPillWrap}>
            <div className={styles.navPill} role="tablist" aria-label="Choose track">
              <button
                type="button"
                role="tab"
                aria-selected={navTrack === "learn"}
                className={`${styles.pillBtn} ${navTrack === "learn" ? styles.pillLearnOn : ""}`}
                onClick={goLearn}
              >
                Learn
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={navTrack === "sim"}
                className={`${styles.pillBtn} ${navTrack === "sim" ? styles.pillSimOn : ""}`}
                onClick={goSim}
              >
                Simulate
              </button>
            </div>
          </div>

          <div className={styles.navLinks}>
            <button type="button" className={styles.navLinkBtn} onClick={goSim}>
              Simulations
            </button>
            <button type="button" className={styles.navLinkBtn} onClick={() => scrollToId("pricing")}>
              Pricing
            </button>
            <Link to="/register" className={`${styles.navCta} btn btn-primary`}>
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <header className={styles.hero} id="learn-start">
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} aria-hidden />
              Code DNA · 48 misconception patterns
            </div>
            <h1 className={styles.heroTitle}>
              Learn to code.
              <br />
              <em className={styles.heroEm}>Simulate the job.</em>
            </h1>
            <p className={styles.heroSub}>
              The only platform that teaches you to write code <em>and</em> shows you what it actually feels like to work as a developer — before your first interview.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/quiz" className={`btn btn-primary ${styles.heroBtn}`}>
                Take the placement quiz
              </Link>
              <button type="button" className={`btn btn-ghost ${styles.heroBtn}`} onClick={goSim}>
                Browse simulations
              </button>
            </div>
            <p className={styles.heroNote}>
              Already have an account? <Link to="/login">Log in</Link> — then take the placement quiz from your dashboard.
            </p>
          </div>

          <button
            type="button"
            className={styles.videoCard}
            onClick={() => scrollToId("demo")}
            aria-label="Scroll to interactive demo"
          >
            <div className={styles.videoGlow} />
            <div className={styles.videoInner}>
              <span className={styles.playBtn} aria-hidden>
                ▶
              </span>
              <div className={styles.videoTitle}>See how Ignara works</div>
              <div className={styles.videoSub}>Intro video placeholder — tap to jump to the live demo below</div>
            </div>
          </button>
        </div>

        <div className={styles.statBar}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>12</span>
            <span className={styles.statLab}>Curriculum units</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>60</span>
            <span className={styles.statLab}>Micro-challenges</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>48</span>
            <span className={styles.statLab}>Error patterns</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>3</span>
            <span className={styles.statLab}>Job simulations</span>
          </div>
        </div>
      </header>

      {/* Dual path */}
      <section className={styles.dualSection} aria-labelledby="paths-heading">
        <h2 id="paths-heading" className={styles.visuallyHidden}>
          Choose your path
        </h2>
        <div className={styles.dualGrid}>
          <Link to="/quiz" className={`${styles.dualCard} ${styles.dualLearn}`}>
            <div className={`${styles.dualIcon} ${styles.dualIconLearn}`}>📚</div>
            <span className={`${styles.dualTag} ${styles.dualTagLearn}`}>Learning track</span>
            <h3 className={styles.dualH}>Learn to code</h3>
            <p className={styles.dualP}>A structured curriculum that diagnoses exactly why you get things wrong — not just whether you do.</p>
            <ul className={styles.dualList}>
              <li>Placement quiz sets your exact starting point</li>
              <li>5-minute lessons + hands-on challenges</li>
              <li>Code DNA tracks 48 misconception types</li>
              <li>12 portfolio projects pushed to GitHub</li>
              <li>Foundation track is permanently free</li>
            </ul>
            <span className={`${styles.dualCta} ${styles.dualCtaLearn}`}>Take the placement quiz →</span>
          </Link>

          <button type="button" className={`${styles.dualCard} ${styles.dualSim}`} onClick={goSim}>
            <div className={`${styles.dualIcon} ${styles.dualIconSim}`}>💼</div>
            <span className={`${styles.dualTag} ${styles.dualTagSim}`}>Job simulation track</span>
            <h3 className={styles.dualH}>Simulate the job</h3>
            <p className={styles.dualP}>Real engineering tasks. Real GitHub commits. A certificate for LinkedIn — and proof you can do the work.</p>
            <ul className={styles.dualList}>
              <li>No quiz required — jump straight in</li>
              <li>5–6 sequential tasks modeled on real work</li>
              <li>AI Tutor adapts to your known error patterns</li>
              <li>GitHub repo auto-built as you complete tasks</li>
              <li>Certificate + LinkedIn post on completion</li>
            </ul>
            <span className={`${styles.dualCta} ${styles.dualCtaSim}`}>Browse simulations →</span>
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.band} id="how-it-works">
        <div className={styles.contain}>
          <p className={styles.kicker}>How it works</p>
          <h2 className={styles.h2}>Four steps. No busywork.</h2>
          <p className={styles.lead}>Pick a path, write code, ship to GitHub, walk away with proof.</p>
          <div className={styles.steps4}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>1</div>
              <h4>Pick your path</h4>
              <p>Take a 2-minute placement quiz or jump straight into a job simulation. We route you to the right starting point.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>2</div>
              <h4>Write real code</h4>
              <p>Monaco editor. Real test suites. AI Tutor gives hints based on your specific Code DNA error profile — not a generic script.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>3</div>
              <h4>Build your GitHub</h4>
              <p>Every task auto-commits your solution to a real repo. Walk away with commit history, not just a score.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>4</div>
              <h4>Earn your proof</h4>
              <p>Download a verifiable certificate. Generate a LinkedIn post. Show interviewers something concrete.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Task demo */}
      <section className={styles.demoSection} id="demo">
        <div className={styles.contain}>
          <p className={`${styles.kicker} ${styles.kickerV}`}>Try it now</p>
          <h2 className={styles.h2}>A real simulation task — on the landing page</h2>
          <p className={styles.lead}>Run tests and open an AI hint. No signup required for this preview.</p>
        </div>
        <div className={styles.demoPad}>
          <LandingTaskDemo />
        </div>
      </section>

      {/* Compare + cert */}
      <section className={styles.contain} style={{ marginBottom: "72px" }}>
        <p className={`${styles.kicker} ${styles.kickerV}`}>Why Ignara</p>
        <h2 className={styles.h2}>Not passive. Not one-size-fits-all.</h2>
        <p className={styles.lead}>Hints adapt to your mistakes. Simulations add GitHub + certificate story.</p>
        <div className={styles.compareGrid}>
          <div className={styles.compareList}>
            {[
              ["Same hints for everyone", "Hints from your Code DNA profile"],
              ["Certificate only", "Certificate + real GitHub commits"],
              ["Static difficulty", "Adaptive — reacts to your errors"],
              ["Simulation disconnected from learning", "Sim data feeds your learning path"],
            ].map(([them, us]) => (
              <div key={them} className={styles.compareRow}>
                <div>
                  <div className={styles.cmpLab}>Others</div>
                  <div className={styles.cmpThem}>{them}</div>
                </div>
                <span className={styles.cmpVs}>vs</span>
                <div>
                  <div className={styles.cmpLab}>Ignara</div>
                  <div className={styles.cmpUs}>{us}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.certCard}>
            <div className={styles.certBrand}>Ignara</div>
            <div className={styles.certSub}>Certificate of completion</div>
            <p className={styles.certPre}>This certifies that</p>
            <div className={styles.certName}>Your name</div>
            <p className={styles.certPre}>completed</p>
            <div className={styles.certSim}>Fintech Backend Simulation</div>
            <div className={styles.certChips}>
              <span>REST</span>
              <span>Validation</span>
              <span>Tests</span>
              <span>Git</span>
            </div>
            <div className={styles.certFoot}>
              <span>2026</span>
              <span>ignara.com/verify</span>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus — compact */}
      <section className={styles.band} id="syllabus">
        <div className={styles.contain}>
          <p className={styles.kicker}>Foundation syllabus</p>
          <h2 className={styles.h2}>Free track — units B1–B4</h2>
          <p className={styles.lead}>Tap a unit to expand. Each has 5 challenges + 1 portfolio project.</p>
          <TrackGroup badge="Free" tone="free" title="Foundation" desc="Start here — no experience required.">
            <Unit
              compact
              code="B1"
              title="Foundations"
              subtitle="Variables, I/O, basic math"
              challenges={[
                ["Add Two Numbers", "type-conversion-missing"],
                ["Temperature Converter", "operator-precedence-error"],
                ["Odd or Even", "modulo-confusion"],
                ["Simple Average", "integer-division-confusion"],
                ["Swap Two Values", "variable-assignment-confusion"],
              ]}
              projectTitle="CLI calculator"
              projectDesc="Operators + divide-by-zero handling."
              portfolioLine="Built a CLI calculator in Python with full basic ops."
            />
            <Unit
              compact
              code="B2"
              title="Control flow"
              subtitle="If/else, loops"
              challenges={[
                ["FizzBuzz", "condition-order-wrong"],
                ["Count Down", "off-by-one-loop"],
                ["Star Pattern", "nested-loop-confusion"],
                ["Grade Calculator", "boundary-condition-error"],
                ["Sum of Digits", "loop-termination-confusion"],
              ]}
              projectTitle="Number guessing game"
              projectDesc="Random number, hints, loop."
              portfolioLine="Built a guessing game with loops and user feedback."
            />
            <Unit
              compact
              code="B3"
              title="Functions"
              subtitle="Parameters, return, scope"
              challenges={[
                ["Reverse a String", "print-instead-of-return"],
                ["Is Palindrome", "missing-return-value"],
                ["Factorial", "missing-base-case"],
                ["Fibonacci", "off-by-one-sequence"],
                ["Caesar Cipher", "ascii-wrap-confusion"],
              ]}
              projectTitle="Password strength"
              projectDesc="Modular checks with helper functions."
              portfolioLine="Built a modular password strength checker."
            />
            <Unit
              compact
              code="B4"
              title="Arrays & strings"
              subtitle="Lists, iteration"
              challenges={[
                ["Find Maximum", "built-in-shortcut-misuse"],
                ["Remove Duplicates", "order-not-preserved"],
                ["Count Vowels", "case-sensitivity-missed"],
                ["Word Frequency", "dict-key-missing-error"],
                ["Title Case", "split-join-confusion"],
              ]}
              projectTitle="To-do CLI"
              projectDesc="Add, list, mark done with lists/dicts."
              portfolioLine="Built a CLI task manager with lists and dicts."
            />
          </TrackGroup>
        </div>
      </section>

      {/* Journey */}
      <section className={styles.contain} style={{ marginBottom: "64px" }}>
        <p className={styles.kicker}>After signup</p>
        <h2 className={styles.h2}>Your first 10 minutes</h2>
        <div className={styles.journey}>
          <div className={styles.jStep}>
            <span>1</span>
            <h4>Account</h4>
            <p>30 seconds.</p>
            <Link to="/register" className="btn btn-ghost">
              Register
            </Link>
          </div>
          <div className={styles.jStep}>
            <span>2</span>
            <h4>Quiz</h4>
            <p>Find your level.</p>
            <Link to="/register" className="btn btn-ghost">
              Then quiz
            </Link>
          </div>
          <div className={styles.jStep}>
            <span>3</span>
            <h4>Lesson</h4>
            <p>Quick read + practice.</p>
            <Link to="/register" className="btn btn-ghost">
              Start B1
            </Link>
          </div>
          <div className={styles.jStep}>
            <span>4</span>
            <h4>Challenges</h4>
            <p>Unlock with passes.</p>
            <Link to="/register" className="btn btn-primary">
              Go
            </Link>
          </div>
        </div>
      </section>

      {/* Simulations */}
      <section className={styles.band} id="sims">
        <div className={styles.contain}>
          <p className={`${styles.kicker} ${styles.kickerV}`}>Simulations</p>
          <h2 className={styles.h2}>Pick a role. Do the work.</h2>
          <p className={styles.lead}>Fictional companies — real-shaped tasks. More sims shipping soon.</p>
          <div className={styles.simGrid}>
            <div className={`${styles.simCard} ${styles.simFeatured}`}>
              <div className={styles.simLive}>● Available</div>
              <div className={styles.simCo}>Midas Financial</div>
              <h3 className={styles.simRole}>Backend Engineer Intern</h3>
              <p className={styles.simMeta}>6 tasks · ~3–4 hr · Intermediate</p>
              <div className={styles.simSkills}>
                <span>Python</span>
                <span>APIs</span>
                <span>Tests</span>
                <span>Git</span>
              </div>
              <Link to="/register" className={styles.simCta}>
                Start with free account →
              </Link>
            </div>
            <div className={styles.simCard}>
              <div className={styles.simSoon}>Soon</div>
              <div className={styles.simCo}>Orbit Labs</div>
              <h3 className={styles.simRole}>Full Stack Intern</h3>
              <p className={styles.simMeta}>React · Node · DB</p>
              <button type="button" className={styles.simCtaOff} disabled>
                Notify me
              </button>
            </div>
            <div className={styles.simCard}>
              <div className={styles.simSoon}>Soon</div>
              <div className={styles.simCo}>Clearpath</div>
              <h3 className={styles.simRole}>Data Engineer Intern</h3>
              <p className={styles.simMeta}>Python · Pandas · SQL</p>
              <button type="button" className={styles.simCtaOff} disabled>
                Notify me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — Stripe ready */}
      <section className={styles.contain} id="pricing" style={{ marginBottom: "72px" }}>
        <p className={styles.kicker}>Pricing</p>
        <h2 className={styles.h2}>Start free. Upgrade when it’s worth it.</h2>
        <div className={styles.priceGrid}>
          <div className={styles.priceCard}>
            <div className={styles.priceTier}>Foundation</div>
            <div className={styles.priceAmt}>$0</div>
            <div className={styles.pricePer}>free forever</div>
            <ul className={styles.priceList}>
              <li>Units B1–B4 (variables → functions)</li>
              <li>20 micro-challenges</li>
              <li>4 portfolio projects</li>
              <li>Code DNA error tracking</li>
              <li>Placement quiz</li>
            </ul>
            <Link to="/quiz" className={`${styles.priceBtn} ${styles.priceBtnGhost}`}>
              Start learning
            </Link>
          </div>
          <div className={`${styles.priceCard} ${styles.priceHighlight}`}>
            <div className={styles.priceTier}>Pro</div>
            <div className={styles.priceAmt}>
              $9<span>/mo</span>
            </div>
            <div className={styles.pricePer}>or $79/year — save 27%</div>
            <ul className={styles.priceList}>
              <li>Everything in Foundation</li>
              <li>Full 12-unit curriculum</li>
              <li>All 60 micro-challenges</li>
              <li>Job simulation access</li>
              <li>Verifiable certificates</li>
              <li>LinkedIn post generator</li>
              <li>GitHub portfolio builder</li>
            </ul>
            <button type="button" className={`${styles.priceBtn} ${styles.priceBtnSolid}`} disabled title="Stripe integration pending">
              Start free trial
            </button>
            <p className={styles.priceLegal}>Billed monthly when live · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className={styles.band} id="schools">
        <div className={`${styles.contain} ${styles.schoolFlex}`}>
          <div>
            <p className={styles.kicker}>For schools</p>
            <h2 className={styles.h2}>Classrooms & clubs</h2>
            <p className={styles.lead}>Teacher dashboard, bulk seats, misuse analytics. Talk to us for pilot pricing.</p>
          </div>
          <a href="mailto:hello@ignara.com" className="btn btn-primary">
            Contact
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <div className={styles.fBrand}>Ignara</div>
          <div className={styles.fTag}>Ignite the fire within every student.</div>
        </div>
        <div className={styles.fLinks}>
          <button type="button" onClick={goLearn}>
            Learn
          </button>
          <button type="button" onClick={goSim}>
            Simulations
          </button>
          <Link to="/register">Start free</Link>
          <button type="button" onClick={() => scrollToId("pricing")}>
            Pricing
          </button>
        </div>
        <div className={styles.fCopy}>© 2026 Ignara</div>
      </footer>
    </div>
  );
}

function TrackGroup({ badge, tone, title, desc, children }) {
  return (
    <div className={styles.trackGroup}>
      <div className={styles.trackHead}>
        <span className={tone === "free" ? styles.badgeFree : styles.badgePaid}>{badge}</span>
        <div>
          <div className={styles.trackTitle}>{title}</div>
          <div className={styles.trackDesc}>{desc}</div>
        </div>
      </div>
      <div className={styles.unitList}>{children}</div>
    </div>
  );
}

function Unit({ code, title, subtitle, challenges, projectTitle, projectDesc, portfolioLine, compact }) {
  return (
    <details className={styles.unitItem} open={!compact}>
      <summary className={styles.unitSum}>
        <span className={styles.unitCode}>{code}</span>
        <div>
          <h4 className={styles.unitH}>{title}</h4>
          <p className={styles.unitSub}>{subtitle}</p>
        </div>
        <span className={styles.unitChev}>⌄</span>
      </summary>
      <div className={styles.unitBody}>
        {challenges && (
          <div>
            <div className={styles.detLab}>Challenges</div>
            <ul className={styles.chalList}>
              {challenges.map(([name, tag]) => (
                <li key={name}>
                  <span>{name}</span>
                  <code className={styles.tag}>{tag}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
        {projectTitle && (
          <div>
            <div className={styles.detLab}>Project</div>
            <div className={styles.projBox}>
              <strong>{projectTitle}</strong>
              <p>{projectDesc}</p>
              <span className={styles.portLine}>Portfolio: {portfolioLine}</span>
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
