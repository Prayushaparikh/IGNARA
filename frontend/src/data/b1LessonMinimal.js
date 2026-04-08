/**
 * B1 — minimal lesson (~5 min read) for high school beginners.
 * Heavy teaching lives on the practice page (hints + helper).
 */

export const B1_LESSON_MINIMAL = {
  lessonFormat: "minimal",
  title: "B1 Foundations",
  subtitle: "Variables, input, and a little math",
  readingTime: "~5 min",
  /** Disables multi-part lesson UI */
  splitIntoParts: false,
  quickReference: [
    "input() gives text — int() before math on typed numbers",
    "print(a, b) prints both with a space",
    "+ − * / // % ** — same spirit as math class",
    "= stores a value; == compares (coming up in B2)",
  ],
  heroIntro: {
    title: "Start here",
    blurb:
      "A tiny tour so practice won’t feel like a cold start. Read once, tap through the animated example, then go try real problems.",
  },
  /** Flashcard-style slides: short learn / do columns */
  swipeSlides: [
    {
      id: "intro",
      title: "Start here",
      learn: ["Super short cards — no essay", "One animated code walk next", "Then real challenges with hints"],
      do: ["Swipe right or tap Next", "On laptop: ← → keys"],
    },
    {
      id: "variables",
      title: "Variables",
      learn: ["A label your program uses to remember one value"],
      do: ["You'll write lines like this in practice:"],
      code: "score = 10",
    },
    {
      id: "io",
      title: "Input & output",
      learn: ["print() shows text", "input() reads typing — always as text, even if they type digits"],
      do: ["Turn text into a number before math:"],
      code: 'age = int(input("Age? "))',
      alert: "Classic trap: without int(), 5 + 3 can become \"53\" instead of 8.",
    },
    {
      id: "math",
      title: "Basic math",
      learn: ["Same spirit as class: + − * /", "// whole division, % remainder, ** power"],
      do: ["Example output:"],
      code: "print(10 // 3)   # 3",
    },
    {
      id: "mistakes",
      title: "Two oopsies",
      learn: ["Everyone hits these once"],
      do: [
        "Forgetting int() on typed numbers → text + text instead of real math",
        "Using = when you mean == (saving vs comparing — you'll use == soon)",
      ],
    },
    {
      id: "remember",
      title: "Pin this",
      learn: ["input → text until you convert", "print can take several things with commas", "Not sure? int() before math on input"],
      do: ["Next: animated example", "Then practice — help lives there, not here"],
    },
  ],
  variables: {
    title: "Variables",
    body: "A variable is just a name for a value your program remembers.",
    example: "score = 10",
  },
  io: {
    title: "Input & output",
    body: "print() shows text. input() reads what someone types — but it always arrives as text, even if they type digits.",
    warning: "Need a real number? Wrap with int() or float() before you do math.",
    example: 'age = int(input("Age? "))',
  },
  math: {
    title: "Basic math",
    body: "Same ideas as arithmetic class: + − * /, // for whole-number division, % for remainder, ** for powers.",
    example: "print(10 // 3)   # 3",
  },
  mistakes: {
    title: "Two mistakes almost everyone makes once",
    items: [
      {
        title: "Forgetting int() on numbers you typed",
        tip: "Without int(), 5 + 3 can become \"53\" instead of 8.",
      },
      {
        title: "Using = when you mean ==",
        tip: "= saves a value. == compares two values. (You’ll use == a lot soon.)",
      },
    ],
  },
  remember: [
    "input() → text until you convert it",
    "print() can show several things separated by commas",
    "When unsure, use int() before adding or comparing numbers from input",
  ],
  /** Single animated walkthrough — no video, no AI */
  walkthrough: {
    title: "Watch this little program “run”",
    subtitle: "Tap Next — one line lights up at a time.",
    code: `name = "Alex"
a = int("5")
b = int("3")
print("Hi,", name)
print(a + b)`,
    steps: [
      {
        lineIndex: 0,
        caption: "Python stores the text \"Alex\" under the label name.",
        variables: [
          { name: "name", value: '"Alex"' },
        ],
        output: "",
      },
      {
        lineIndex: 1,
        caption: "int(\"5\") turns the characters 5 into the number 5 — now a can do math.",
        variables: [
          { name: "name", value: '"Alex"' },
          { name: "a", value: "5" },
        ],
        output: "",
      },
      {
        lineIndex: 2,
        caption: "Same idea for b — both are real integers now.",
        variables: [
          { name: "name", value: '"Alex"' },
          { name: "a", value: "5" },
          { name: "b", value: "3" },
        ],
        output: "",
      },
      {
        lineIndex: 3,
        caption: "print sends text to the screen. Commas add a space between pieces.",
        variables: [
          { name: "name", value: '"Alex"' },
          { name: "a", value: "5" },
          { name: "b", value: "3" },
        ],
        output: "Hi, Alex",
      },
      {
        lineIndex: 4,
        caption: "Now the numbers add — 5 + 3 is 8, not \"53\".",
        variables: [
          { name: "name", value: '"Alex"' },
          { name: "a", value: "5" },
          { name: "b", value: "3" },
        ],
        output: "Hi, Alex\n8",
      },
    ],
  },
};
