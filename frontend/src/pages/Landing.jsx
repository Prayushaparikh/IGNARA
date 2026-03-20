import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import ignaraLogo from "../assets/ignara-logo.svg";
const careers = [
  { icon: "💻", title: "Software Engineer", salary: "$95k–$160k" },
  { icon: "📊", title: "Data Scientist",    salary: "$90k–$150k" },
  { icon: "🤖", title: "ML Engineer",       salary: "$110k–$180k" },
  { icon: "🎨", title: "UX Engineer",       salary: "$85k–$140k" },
  { icon: "🔒", title: "Cybersecurity",     salary: "$85k–$140k" },
  { icon: "☁️", title: "Cloud Architect",   salary: "$120k–$190k" },
  { icon: "🎮", title: "Game Developer",    salary: "$80k–$140k" },
  { icon: "📱", title: "Mobile Developer",  salary: "$90k–$150k" },
];

const steps = [
  { num: "01", title: "Discover your path", desc: "Answer 10 questions. We match you to the tech career that fits how you think." },
  { num: "02", title: "Learn by doing",     desc: "120 challenges built to take you from zero to job-ready. No fluff." },
  { num: "03", title: "Get the internship", desc: "Interview prep, readiness score, and mentors who've done it before." },
];

export default function Landing() {
  return (
    <div className={styles.page}>

      {/* ── Ember background orbs ── */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* ── Nav ── */}

      <nav className={styles.nav}>
        <div className={styles.navLogo}>
         <img src={ignaraLogo} alt="Ignara" height="28" />
        </div>
        <div className={styles.navLinks}>
          <Link to="/register" className="btn btn-ghost" style={{padding:"10px 20px"}}>Sign up</Link>
          <Link to="/login"    className="btn btn-primary" style={{padding:"10px 20px"}}>Sign in →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`${styles.heroBadge} animate-fade-up`}>
          <span className="badge badge-ember">✦ Free forever for students</span>
        </div>

        <h1 className={`${styles.heroTitle} animate-fade-up-delay-1`}>
          Every dream begins<br />
          <em className={styles.heroItalic}>with a dreamer.</em>
        </h1>

        <p className={`${styles.heroSub} animate-fade-up-delay-2`}>
          Ignara ignites the fire within every student — connecting your curiosity
          to tech careers, real challenges, and mentors who've walked your path.
        </p>

        <div className={`${styles.heroCTA} animate-fade-up-delay-3`}>
          <Link to="/register" className="btn btn-primary" style={{fontSize:"16px", padding:"16px 32px"}}>
            Start your journey →
          </Link>
          <Link to="/careers" className="btn btn-ghost" style={{fontSize:"16px", padding:"16px 32px"}}>
            Explore careers
          </Link>
        </div>

        <div className={`${styles.heroStats} animate-fade-up-delay-4`}>
          <div className={styles.stat}>
            <span className={styles.statNum}>120</span>
            <span className={styles.statLabel}>Challenges</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>10</span>
            <span className={styles.statLabel}>Career paths</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>Free</span>
            <span className={styles.statLabel}>Forever</span>
          </div>
        </div>
      </section>

      {/* ── Career Ticker ── */}
      <div className={styles.tickerWrap}>
        <div className={styles.ticker}>
          {[...careers, ...careers].map((c, i) => (
            <div key={i} className={styles.tickerItem}>
              <span>{c.icon}</span>
              <span className={styles.tickerTitle}>{c.title}</span>
              <span className={styles.tickerSalary}>{c.salary}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          <span className="badge badge-ember">How it works</span>
        </div>
        <h2 className={styles.sectionTitle}>
          Three steps to your<br />first tech internship
        </h2>

        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={i} className={styles.step}>
              <span className={styles.stepNum}>{s.num}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote ── */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteCard}>
          <span className={styles.quoteGlyph}>✦</span>
          <blockquote className={styles.quote}>
            "You have within you the strength, the patience, and the passion
            to reach for the stars and change the world."
          </blockquote>
          <span className={styles.quoteAuthor}>— The spirit of Ignara</span>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to ignite<br />
          <span className="ember-glow-text">your future?</span>
        </h2>
        <p className={styles.ctaSub}>Free forever. No credit card. Just you and your goals.</p>
        <Link to="/register" className="btn btn-primary" style={{fontSize:"16px", padding:"18px 40px"}}>
          Create your free account →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>✦ Ignara</span>
        <span className={styles.footerText}>Igniting the fire within every student.</span>
      </footer>

    </div>
  );
}
