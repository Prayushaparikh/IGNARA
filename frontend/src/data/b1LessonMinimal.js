/**
 * B1 — textbook-style lesson (~5 min read) matching the static HTML prototype.
 * Practice page still carries hints + interactive help.
 */

export const B1_LESSON_MINIMAL = {
  lessonFormat: "textbook",
  title: "Variables, Input & Math",
  subtitle: "B1: Foundations — variables, I/O, and basic math",
  readingTime: "~5 min",
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
      "Read the lesson once, step through the animated example, then go try real problems on the practice page.",
  },
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
