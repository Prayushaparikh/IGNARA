import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Careers.module.css";

const careers = [
  {
    id: "software-engineer",
    icon: "💻",
    title: "Software Engineer",
    salary: "$95k – $160k / year",
    tagline: "You build the apps and websites a billion people use every day.",
    tools: ["JavaScript", "Python", "React", "Git", "Node.js"],
    skills: ["Logic", "Problem solving", "Creativity", "Attention to detail"],
    realWorld: "Every app on your phone — Spotify, Instagram, Google Maps — was built by a software engineer. Someone your age is already shipping code at a startup.",
    color: "#F59E0B",
    difficulty: "Great starting point",
  },
  {
    id: "data-scientist",
    icon: "📊",
    title: "Data Scientist",
    salary: "$90k – $150k / year",
    tagline: "You find the hidden patterns in numbers that nobody else can see.",
    tools: ["Python", "SQL", "Pandas", "Tableau", "Jupyter"],
    skills: ["Math", "Curiosity", "Pattern recognition", "Storytelling"],
    realWorld: "Netflix knows what show you'll watch next before you do. That's a data scientist's work — turning raw numbers into decisions that affect millions.",
    color: "#8B5CF6",
    difficulty: "Strong math helps",
  },
  {
    id: "ml-engineer",
    icon: "🤖",
    title: "ML Engineer",
    salary: "$110k – $180k / year",
    tagline: "You teach computers to think, learn, and make decisions.",
    tools: ["Python", "TensorFlow", "PyTorch", "AWS", "Docker"],
    skills: ["Math", "Statistics", "Programming", "Experimentation"],
    realWorld: "ChatGPT, self-driving cars, Face ID on your phone — all built by ML engineers. The most in-demand engineering role of the next decade.",
    color: "#EF6820",
    difficulty: "Advanced — but worth it",
  },
  {
    id: "ux-engineer",
    icon: "🎨",
    title: "UX Engineer",
    salary: "$85k – $140k / year",
    tagline: "You make sure apps feel so good that people never get frustrated.",
    tools: ["Figma", "React", "CSS", "User testing", "Framer"],
    skills: ["Empathy", "Design eye", "Coding", "User psychology"],
    realWorld: "Ever used an app that just felt perfect? Someone spent weeks making every button, animation, and color feel exactly right. That's you.",
    color: "#14B8A6",
    difficulty: "Creative + technical",
  },
  {
    id: "cybersecurity-analyst",
    icon: "🔒",
    title: "Cybersecurity Analyst",
    salary: "$85k – $140k / year",
    tagline: "You think like a hacker to protect people from real ones.",
    tools: ["Kali Linux", "Wireshark", "Python", "Metasploit", "Burp Suite"],
    skills: ["Curiosity", "Logic", "Attention to detail", "Persistence"],
    realWorld: "Every time your bank stops a fraudulent charge at 3am — a cybersecurity system caught it. You build those systems.",
    color: "#EF4444",
    difficulty: "Great for problem solvers",
  },
  {
    id: "devops-engineer",
    icon: "⚙️",
    title: "DevOps Engineer",
    salary: "$95k – $155k / year",
    tagline: "You make sure the internet never goes down.",
    tools: ["Docker", "AWS", "Linux", "Kubernetes", "Terraform"],
    skills: ["Systems thinking", "Automation", "Problem solving", "Reliability"],
    realWorld: "When millions of people stream the Super Bowl at the same time without buffering — that's DevOps. You automate everything so nothing breaks.",
    color: "#F59E0B",
    difficulty: "Systems thinkers thrive",
  },
  {
    id: "game-developer",
    icon: "🎮",
    title: "Game Developer",
    salary: "$80k – $140k / year",
    tagline: "You build the worlds people escape to after school.",
    tools: ["Unity", "C++", "Unreal Engine", "Blender", "C#"],
    skills: ["Math", "Creativity", "Logic", "Storytelling"],
    realWorld: "Fortnite made $5 billion in one year. Minecraft sold 238 million copies. Someone your age is already building the next one. It could be you.",
    color: "#10B981",
    difficulty: "Creative + math",
  },
  {
    id: "mobile-developer",
    icon: "📱",
    title: "Mobile Developer",
    salary: "$90k – $150k / year",
    tagline: "You build the apps people check before getting out of bed.",
    tools: ["Swift", "Kotlin", "React Native", "Xcode", "Flutter"],
    skills: ["Design thinking", "Problem solving", "User empathy", "Performance"],
    realWorld: "TikTok, Snapchat, your school's app — all built by mobile developers. A billion people check their phones before getting out of bed. You build what they reach for.",
    color: "#8B5CF6",
    difficulty: "Great entry point",
  },
  {
    id: "cloud-architect",
    icon: "☁️",
    title: "Cloud Architect",
    salary: "$120k – $190k / year",
    tagline: "You design the invisible infrastructure that runs everything.",
    tools: ["AWS", "Azure", "Terraform", "Docker", "Kubernetes"],
    skills: ["Systems thinking", "Scale", "Security", "Cost optimization"],
    realWorld: "Every photo you've ever taken lives on a server somewhere. Every app you use runs on cloud infrastructure. A cloud architect designed those systems.",
    color: "#14B8A6",
    difficulty: "Senior role — aim high",
  },
  {
    id: "blockchain-developer",
    icon: "⛓️",
    title: "Blockchain Developer",
    salary: "$100k – $170k / year",
    tagline: "You build systems where people can trust each other without a middleman.",
    tools: ["Solidity", "Web3.js", "Ethereum", "Rust", "Hardhat"],
    skills: ["Cryptography", "Logic", "Math", "Security thinking"],
    realWorld: "Every crypto transaction, every smart contract, every DeFi app — built by blockchain developers. You're building the financial infrastructure of the future.",
    color: "#EF6820",
    difficulty: "Cutting edge",
  },
];

export default function Careers() {
  const [active, setActive] = useState(null);
  const nav = useNavigate();
  const career = active !== null ? careers[active] : null;

  return (
    <div className={styles.page}>

      <div className={styles.orb} />

      <div className={styles.header}>
        <span className="badge badge-ember">✦ 10 Career Paths</span>
        <h1 className={styles.title}>Find the work<br /><em className={styles.italic}>that feels like you.</em></h1>
        <p className={styles.sub}>Not sure what you want to do? Read these. One will click.</p>
      </div>

      <div className={styles.grid}>
        {careers.map((c, i) => (
          <button key={c.id} className={`${styles.card} ${active === i ? styles.cardActive : ""}`}
            onClick={() => setActive(active === i ? null : i)}
            style={active === i ? { borderColor: c.color, boxShadow: `0 0 32px ${c.color}20` } : {}}>
            <div className={styles.cardTop}>
              <span className={styles.cardIcon}>{c.icon}</span>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <span className={styles.cardSalary} style={{ color: c.color }}>{c.salary}</span>
              </div>
              <span className={styles.cardArrow} style={{ transform: active === i ? "rotate(180deg)" : "rotate(0)" }}>↓</span>
            </div>

            <p className={styles.cardTagline}>{c.tagline}</p>

            {active === i && (
              <div className={styles.cardExpanded}>
                <div className={styles.divider} />

                <div className={styles.expandGrid}>
                  <div className={styles.expandBlock}>
                    <span className={styles.expandLabel}>🛠️ Tools they use</span>
                    <div className={styles.tags}>
                      {c.tools.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  </div>

                  <div className={styles.expandBlock}>
                    <span className={styles.expandLabel}>⚡ Skills they need</span>
                    <div className={styles.tags}>
                      {c.skills.map(s => <span key={s} className={`${styles.tag} ${styles.tagSkill}`}>{s}</span>)}
                    </div>
                  </div>
                </div>

                <div className={styles.realWorld}>
                  <span className={styles.expandLabel}>🌍 Real world</span>
                  <p className={styles.realWorldText}>{c.realWorld}</p>
                </div>

                <div className={styles.cardCTA}>
                  <span className={styles.difficulty}>
                    <span className={styles.diffDot} style={{ background: c.color }} />
                    {c.difficulty}
                  </span>
                  <button className="btn btn-primary" style={{ background: c.color, boxShadow: `0 0 20px ${c.color}40` }}
                    onClick={(e) => { e.stopPropagation(); nav("/register"); }}>
                    Start this path →
                  </button>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>Not sure which one? <a href="/register">Take the quiz</a> — we'll match you.</p>
      </div>

    </div>
  );
}
