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

  quickReference: [
    "input() gives text — int() before math on typed numbers",
    "print(a, b) prints both with a space",
    "+ − * / // % ** — same spirit as math class",
    "= stores a value; == compares (coming up in B2)",
  ],
};
