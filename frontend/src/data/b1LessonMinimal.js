/**
 * B1 — textbook-style lesson (~5 min read) matching the professional HTML prototype.
 * Sections render as a clean, single-column readable page.
 */

export const B1_LESSON_MINIMAL = {
  lessonFormat: "textbook",
  title: "Variables, Input & Math",
  subtitle: "B1: Foundations",
  readingTime: "5 min read",
  challengeCount: 5,
  splitIntoParts: false,

  intro: {
    title: "What You'll Learn",
    body: "Store information in variables, talk to your program with input/output, do basic math, and avoid the mistakes that trip up 90% of beginners.",
  },

  sections: [
    {
      id: "variables",
      title: "Variables",
      body: "Variables store information. Think of them like labeled boxes.",
      code: `name = "Alex"     # A box labeled 'name' contains "Alex"\nage = 16          # A box labeled 'age' contains 16\nscore = 0         # A box labeled 'score' contains 0`,
      tip: {
        label: "✓ Key Rule",
        body: "Text needs quotes. Numbers don't.",
        extra: `city = "London"  ✓\nheight = 170     ✓`,
      },
    },
    {
      id: "io",
      title: "Input & Output",
      body: "Make your program talk to users.",
      code: `# Get info from user\nname = input("What's your name? ")\n\n# Show info on screen\nprint("Hello", name)`,
      warning: {
        title: "SUPER IMPORTANT: input() gives TEXT!",
        body: `If you want to do math, you MUST use int() to convert:`,
        code: `# WRONG - can't do math with text:\nage = input("Your age? ")     # gives "16" (text!)\n\n# RIGHT - converts to number:\nage = int(input("Your age? ")) # gives 16 (number!)`,
      },
    },
    {
      id: "math",
      title: "Math Operators",
      body: "Do calculations with numbers.",
      operatorGrid: [
        { symbol: "+",  name: "Add",          example: "5 + 3 = 8" },
        { symbol: "-",  name: "Subtract",     example: "10 - 4 = 6" },
        { symbol: "*",  name: "Multiply",     example: "7 * 2 = 14" },
        { symbol: "/",  name: "Divide",       example: "10 / 3 = 3.33…" },
        { symbol: "//", name: "Floor Divide", example: "10 // 3 = 3" },
        { symbol: "%",  name: "Remainder",    example: "10 % 3 = 1" },
      ],
      tip: {
        label: "💡 Pro Tip",
        body: "Use % to check even/odd: If number % 2 == 0, it's even!",
      },
    },
    {
      id: "mistakes",
      title: "Common Mistakes",
      body: "Avoid these and you're ahead of most beginners!",
      mistakes: [
        {
          title: "Forgetting int() Conversion",
          note: "This is THE most common beginner mistake.",
          wrong: `num = input()\nprint(num + 5)\n# Shows "165" not 21!`,
          right: `num = int(input())\nprint(num + 5)\n# Shows 21 ✓`,
        },
        {
          title: "Mixing Text + Numbers with +",
          note: "Can't glue text and numbers together with +.",
          wrong: `age = 16\nprint("Age: " + age)\n# ERROR!`,
          right: `age = 16\nprint("Age:", age)\n# Use comma!`,
        },
      ],
    },
  ],

  cta: {
    title: "🎯 Ready to Practice!",
    body: "You've got the basics. Now it's time to write real code and solve real problems. The challenges will guide you step-by-step.",
    label: "Start Challenge 1 →",
  },

  // ── Section 5 data: Division & Decimal Formatting (backs C4 / Simple Average)
  divisionSection: {
    id: "division",
    title: "Division & Decimal Output",
    body: "Python has two division operators and they give very different answers. Knowing which one to use — and how to format the result — is the difference between a program that works and one that silently gives wrong numbers.",
    divisionTable: [
      { op: "/",  label: "Float division",   example: "7 / 2",   result: "3.5  ← keeps the decimal" },
      { op: "//", label: "Floor division",   example: "7 // 2",  result: "3    ← drops the decimal"  },
      { op: "%",  label: "Remainder",        example: "7 % 2",   result: "1    ← what's left over"   },
    ],
    warning: {
      title: "Use / for averages and real-world calculations",
      body: "If you write (3 + 4 + 5) // 3 you get 4 — which looks right here but fails the moment the average is not a whole number. Always use / when the answer might be a decimal.",
      code: "# WRONG — floor division silently drops the decimal:\navg = (2 + 2 + 3) // 3    # gives 2, not 2.333...\n\n# RIGHT — float division keeps it:\navg = (2 + 2 + 3) / 3     # gives 2.3333...",
    },
    formatting: {
      title: "Taming messy floats with f-strings",
      body: "Python raw float output can look like 2.3333333333333335. Use the :.Nf specifier to round to exactly N decimal places.",
      code: 'avg = 7 / 3              # 2.3333333333333335\nprint(f\'{avg:.1f}\')       # 2.3  ← 1 decimal\nprint(f\'{avg:.2f}\')       # 2.33 ← 2 decimals',
    },
    tip: {
      label: "💡 The full C4 pattern",
      body: "Three numbers in → average out → formatted to 1 decimal.",
      extra: "a, b, c = map(int, input().split())\nprint(f'{(a + b + c) / 3:.1f}')",
    },
  },

  quickReference: [
    "input() gives text — use map(int, input().split()) for multiple numbers",
    "/ keeps decimals (float division); // drops them (floor division)",
    "f'{x:.1f}' rounds to 1 decimal — f'{x:.2f}' rounds to 2",
    "a, b = map(int, input().split()) reads two numbers from one line",
    "= stores a value; == compares (coming up in B2)",
  ],

  /** Animated line-by-line walkthrough — rendered after the written lesson in B1TextbookLesson */
  walkthrough: {
    title: "Watch this little program run",
    subtitle: "Tap Next — one line lights up at a time.",
    code: `name = "Alex"
a = int("5")
b = int("3")
print("Hi,", name)
print(a + b)`,
    steps: [
      {
        lineIndex: 0,
        caption: 'Python stores the text "Alex" under the label name.',
        variables: [{ name: "name", value: '"Alex"' }],
        output: "",
      },
      {
        lineIndex: 1,
        caption: 'int("5") turns the characters 5 into the number 5 — now a can do math.',
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
        caption: 'Now the numbers add — 5 + 3 is 8, not "53".',
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
