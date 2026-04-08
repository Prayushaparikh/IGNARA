/**
 * Warm, student-first UI copy — Foundation lesson + practice.
 * Adjust strings here without hunting through components.
 */

export const COPY = {
  walkthrough: {
    varsLabel: "Names in memory right now",
    outputLabel: "What would print",
    noOutputYet: "— nothing printed yet —",
    back: "← Previous step",
    next: "Next step →",
    replay: "Replay from top",
    autoPlay: "Auto-advance (slow)",
    stepOf: (n, total) => `Step ${n} / ${total}`,
  },
  lesson: {
    panelTitle: "Your lesson — your pace",
    /** Single-page B1 minimal lesson */
    minimalPanelTitle: "Quick start (about 5 minutes)",
    swipeDeckHint: "Swipe or use arrow keys ·",
    swipeLearn: "What you'll learn",
    swipeDo: "What you'll do",
    swipePrev: "← Back",
    swipeNext: "Next →",
    swipeOf: (n, t) => `Card ${n} of ${t}`,
    rememberHeading: "Before practice",
    partProgress: (p, total) => `Part ${p} of ${total}`,
    partChip: (p) => `Part ${p}`,
    partNavAria: "Choose which half of the lesson to open",
    parts: [
      {
        title: "Foundations & variables",
        sub: "How programs think, names, and types — the cozy start",
      },
      {
        title: "I/O, math, patterns & wrap-up",
        sub: "Talking to the user, numbers, oopsies, and your cheat sheet",
      },
    ],
    continueToPart: (n) => `When you're ready — part ${n} →`,
    backToPart: (n) => `← Back to part ${n}`,
    partHint: "Two gentle halves. Part 1 plants the ideas; part 2 carries you through the rest. No rush.",
    /** Shown at the top of part 2 only — permission to breathe; no new route */
    part2PauseLine:
      "This half has a little more — stretch, sip water, or close the tab and come back. Nothing here expires on you.",
    backToTrack: "← Back to the Foundation track",
    startPractice: "I'm ready — take me to practice →",
    warmPathTitle: "4-minute warm path",
    warmPathSub:
      "Tiny bites: one plain sentence + one snippet. Skim or skip — the full lesson is still below.",
    analogyLabel: "Think of it like:",
    whyLabel: "Why this shows up in real apps:",
    quickRefTitle: "Little cheat sheet",
    codeCompareAvoid: "Rough draft",
    codeCompareBetter: "Friendlier version",
    /** Visual roadmap on part 1 — how the page is laid out */
    pageGuide: {
      badge: "Map of this page",
      title: "How to move through this lesson (no stress version)",
      intro:
        "You are not being graded on this screen. Read what feels good, tap the little quizzes when you want, and treat the gray code boxes as examples — not homework yet.",
      steps: [
        {
          title: "Scroll in order (mostly)",
          detail:
            "Ideas stack like stairs. If something feels fuzzy, it's fine to skim ahead and circle back — the page isn't going anywhere.",
        },
        {
          title: "Gray boxes = example code",
          detail:
            "They're here so your eyes learn what Python looks like. You don't have to type them unless a Try it asks you to think along.",
        },
        {
          title: "“Try it” = low-stakes check-in",
          detail:
            "Tap an answer; wrong guesses still teach. No one sees your score — it's between you and the screen.",
        },
        {
          title: "Tables & side-by-sides = compare",
          detail:
            "When you see two columns (Avoid / Better), it's showing a habit many beginners bump into — not a lecture.",
        },
        {
          title: "Part 2, then practice",
          detail:
            "After part 2 you'll get starter code and gentle hints so you're never staring at a blank editor alone.",
        },
      ],
      flowAscii: `  YOU                    THIS PAGE                 LATER
    |                         |                        |
    |   read & wonder  ----->  |  Try its + examples    |
    |                         |                        |
    |   part 1, then 2  --->  |  same lesson, split    |
    |                         |                        |
    |   ready to type   ---->  |  practice w/ hints   |`,
      footer: "Confused at any point? That's data — note the heading and ask a teacher, friend, or search the exact error text.",
    },
    /** Compact legend for part 2 — what visual patterns mean */
    part2VisualGuide: {
      title: "What you'll see on this half of the page",
      bullets: [
        "Gray code blocks = examples to read (like samples in a cookbook).",
        "Two-column “Avoid / Better” = a common mix-up next to a calmer fix — not a test.",
        "Little tables = quick compares (like / vs //) so your eyes can scan.",
        "ASCII sketches = flow in plain text — follow the arrows left to right.",
      ],
      flowAscii: `  read section  →  peek at code  →  try a "Try it"
        (no timer)      (no grades)        (tap & learn)`,
    },
  },

  practice: {
    instructionsTitle: "What you're building here",
    testsItLabel: "What we're checking:",
    needsLabel: "Helpful if you've seen:",
    testCasesTitle: "Example inputs & outputs",
    commonMistakesTitle: "Where lots of us stumble (you're not alone)",
    whyPrefix: "Why that happens:",
    fixPrefix: "A friendly fix:",
    visualGuidePrefix: "Picture the flow:",
    mobileChallenge: "Challenge",
    mobileEditor: "Editor",
    focusOn: "Focus mode",
    focusOff: "Exit focus",
    quickRefShow: "Quick reference",
    quickRefHide: "Hide quick reference",
    quickRefTitle: "Quick reference",
    runCode: "Run my code",
    checkWork: "Check my work",
    langSwitchConfirm: "Switching language clears what you typed in the editor — okay to continue?",
    outputIdle: "Run or check your code to see notes here.",
    outputRunning: "Running a quick sanity pass…",
    outputPassed: (n) => `Nice — ${n} checks look good.`,
    prevChallenge: "← Previous",
    nextChallenge: "Next →",
    toLesson: "← Back to lesson",
    toProject: "Project time →",
    breadcrumb: (unit, num) => `${unit.toUpperCase()} · Practice · Challenge ${num} of 5`,
  },

  hints: {
    sectionTitle: "I'm a little stuck",
    hintProgress: (i, total) => `Gentle step ${i} of ${total}`,
    showSolution: "Show full solution",
    solutionWarn: "Copy/paste skips practice — retype in the editor if you can.",
    nextHint: "I need another nudge →",
    atEnd: "That's every hint. Take another pass in the editor — you've got more context now.",
    reset: "Start hints over",
  },

  helper: {
    title: "Hmm — not quite there yet",
    subtitle: "A gentle clue:",
    idleLine: "If a check doesn't pass, we'll leave a hint here — not a grade, just a nudge.",
    whyLabel: "Why this matters:",
    reviewLink: "Peek back at the lesson →",
  },

  mastered: {
    title: "Nice — you cleared this one",
    fallback: "You got it. Keep going when you feel ready.",
  },

  b1UnitComplete: {
    title: "B1 — look what you finished",
    body:
      "You turned ideas into working code across five small wins. That same loop — read, type, check, adjust — is how every real project grows.",
  },

  github: {
    saveCta: "Save your work on GitHub →",
    flowTitle: "Put your calculator on GitHub",
    flowSubtitle: "Same page as before — editor on the left, steps on the right. Go at your own pace.",
    exitFlow: "← Back to checklist",
    stepLabels: ["Account", "New repo", "Git commands", "Celebrate"],
    step1Title: "Step 1 — Do you have a GitHub account?",
    step1Lead: "GitHub is a free website where programmers store and share code. No pressure — we walk through every click.",
    step1Yes: "Yes, I’m signed in →",
    step1No: "No, help me create one",
    signupGuideTitle: "Create your free GitHub account",
    signupGuideLead: "We’ll open GitHub’s sign-up page in a new tab. Use a school or personal email you can open.",
    openJoin: "Open github.com/join in a new tab",
    signupSteps: [
      "Go to github.com and click “Sign up”.",
      "Pick an email and a strong password you’ll remember.",
      "Check your inbox and verify your email (GitHub sends a link).",
      "On the personalization questions, it’s OK to skip — you can finish in under two minutes.",
    ],
    signupPlaceholderLabels: [
      "Screenshot placeholder: GitHub homepage with Sign up",
      "Screenshot placeholder: Create account form",
      "Screenshot placeholder: Verify email message",
      "Screenshot placeholder: Skip / finish setup",
    ],
    signupReadyNext: "I’m signed in — next step →",
    backToQuestion: "← Back",
    step2Title: "Step 2 — Create an empty repository",
    step2Lead: "A “repository” (repo) is just a folder for your project on GitHub.",
    step2Bullets: [
      "On GitHub, click the green “New” (or “+” → New repository).",
      "Name it exactly as shown below (you can copy the name).",
      "Choose Public.",
      "Do not check “Add a README” — we want an empty repo.",
      "Click “Create repository”.",
    ],
    repoPlaceholderLabels: [
      "Screenshot placeholder: “New repository” form",
      "Screenshot placeholder: Name + Public + no README",
    ],
    step2FormHint: "Type your GitHub username and a short tag (like your first name) so we can build your links.",
    labelUsername: "Your GitHub username (from your profile URL)",
    labelNameTag: (unitId) => `Short tag for the repo name (becomes ignara-calculator-${unitId}-…)`,
    repoNameLabel: "Repository name to use:",
    newRepoButton: "Open empty repo creator:",
    step3Title: "Step 3 — Copy your code & run Git",
    step3Lead: "Three small moves: copy from the left, save a file on your computer, paste commands in Terminal (Mac) or PowerShell / Git Bash (Windows).",
    step3CopyFromLeft: "Copy your calculator code from the compiler on the left (button below).",
    step3SaveAs: "Save it in a new folder as",
    step3Terminal: "Open Terminal in that folder and paste the commands below — one block is fine.",
    copyCode: "Copy my code to clipboard",
    copied: "Copied!",
    commitMessage: "My Ignara calculator",
    step3Done: "When git push finishes without errors, your project is backed up on GitHub. If something looks scary, use “Stuck?” below.",
    step4Title: "You did it",
    copyRepoLink: "Copy repo link",
    shareLine: "Share your link with a friend or teacher — they can see your progress.",
    stuckHelper: "Stuck? Ask the AI Helper (CodeDNA) →",
    stepBack: "← Previous step",
    stepNext: "Next step →",
    helperTitle: "CodeDNA — quick help for GitHub",
    helperIdle: "Run “Check my project” on the left if you want a nudge on your calculator code first.",
    helperByStep: {
      1: "Stuck on accounts? Ask a trusted adult to sit with you for the email verification step — that’s the slowest part for many people.",
      2: "Repo name must match what you type here. If GitHub says the name is taken, add your middle initial or a number at the end.",
      3: "If git says “not a repository”, run the commands inside the folder where you saved your file. If it asks for a password, GitHub wants a “personal access token” instead — search “GitHub create token”.",
      4: "If the green “Code” button on GitHub shows your files, you’re done. Celebrate, then hit Complete Unit when you’re ready.",
    },
    checkProject: "Check my project",
    projectChecksTitle: "Quick sanity check (not a grade)",
  },

  project: {
    terminalIntro: "Your calculator works! Here's what it looks like running:",
    runItLive: "Run it live",
    shareDemo: "Share",
    replayDemo: "Replay demo",
    saveForeverHint: "Save it forever on GitHub (2 minutes):",
    githubTwoMinute: "Save it forever on GitHub (2 minutes):",
    doneShareLead: "Done! Share your work:",
    codeCopied: "Code copied to clipboard! Save as calculator.py",
    saveAsCalculator: "Save the pasted code on your computer as calculator.py (one file in a new folder is perfect.)",
    copyForGithub: "Copy my code for GitHub",
    nextStep: "Next →",
    stepBackShort: "← Back",
    openGithubRocket: "🚀 Open GitHub Repo Creator",
    commitMessageHint: "On GitHub, type commit message:",
    suggestedCommit: "My Ignara calculator works!",
    dragHere: "Drag your calculator.py file right here →",
    dropZoneHint: "Drop zone — drag calculator.py from your computer onto the GitHub page in your other tab, then come back.",
    dropScreenshotPlaceholder: "Screenshot placeholder: GitHub in-browser file drop",
    dropNice: "Nice — your file is on its way in GitHub’s tab. Paste your repo link below when the page shows it.",
    repoPerfect: "Perfect! Found",
    repoReadyLine: "Ready to continue →",
    repoTryAgain: "Try again or click",
    repoCreateNew: "Create new repo",
    readyContinue: "Ready to continue →",
    showGitAdvanced: "Show git commands (advanced)",
    advancedCommitMsg: "My Ignara calculator works!",
    stuckGithub: "Stuck on GitHub? Ask the AI Helper (CodeDNA) →",
    codeDnaPanelTitle: "CodeDNA — quick help",
    successTitle: "Your calculator lives forever!",
    successTagline: (firstName) =>
      `${firstName || "You"} built a calculator in about 23 min! 🔥`,
    viewLive: "View live",
    shareWithFriends: "Share with friends",
    continueNextUnit: (id) => (id ? `Continue to ${String(id).toUpperCase()}` : "Back to Foundation"),
    helperDragSteps: {
      1: "If copy didn’t work, click the editor on the left, press ⌘A / Ctrl+A, then ⌘C / Ctrl+C, and paste into a file named calculator.py.",
      2: "GitHub opens in a new tab — keep this page open. Empty repo = drag your file onto the browser window on GitHub’s instructions page.",
      3: "Copy the repo link from the browser address bar on GitHub after you upload, or from the green Code button. It must end with your exact repo name.",
      4: "You’re published! Share your link with a friend or teacher, or tap Complete Unit below when you’re ready for the next chapter.",
    },
  },

  tryIt: {
    badge: "Try it",
    fixBadge: "Spot what's off",
    showHint: "Show a hint",
    quizWrong: "Not quite — another try is normal.",
    quizRightDefault: "Nice — that's the idea.",
  },

  /** Heuristic checker — warm clue when checks fail */
  feedbackByChallenge: {
    1: {
      clue: "Something's off with how the inputs became numbers — did both values get int() (or another numeric conversion) before + ?",
      why: "When text meets +, Python often glues strings; math needs real numeric types first.",
    },
    2: {
      clue: "Double-check the full °F recipe: multiply, divide, then add 32 — one typo changes the whole story.",
      why: "Tiny formula slips show up everywhere science and weather turn numbers into human answers.",
    },
    3: {
      clue: "Even vs odd is about the remainder after dividing by 2 — % and a clear if/else usually do the trick.",
      why: "Parity is a building block for alternating patterns, fair turns, and grid logic in games.",
    },
    4: {
      clue: "Averages want honest division plus a print that shows one decimal (think :.1f) so 4.0 doesn't look like plain 4 by accident.",
      why: "Grades, sports, and lab reports all need averages that look right to humans, not just to the CPU.",
    },
    5: {
      clue: "Swapping needs both values alive at once — tuple swap or a temp variable saves you from overwriting too early.",
      why: "Reordering values shows up in sorting, undo stacks, and shuffling content behind the scenes.",
    },
  },
};
