/**
 * B1 practice challenges — scaffolding, visual guides, progressive hints.
 */

export const B1_CHALLENGES_ENHANCED = [
  {
    id: 1,
    title: "Add Two Numbers",
    testsIt: "Reading two values and adding them as numbers (not text).",
    needsYouToKnow: "int(input()) or split + int for each token.",
    instructions: "Read two integers and print their sum.",
    testCases: [
      { input: "5 3", expected: "8" },
      { input: "10 -5", expected: "5" },
    ],
    misconceptionTag: "type-conversion-missing",
    visualGuide: {
      title: "Data flow",
      steps: [
        "User types two numbers (maybe with a space)",
        "Your program reads them as text first",
        "Convert each to int",
        "Add and print the result",
      ],
      asciiFlow: "input → int → int → + → print",
    },
    progressiveHints: [
      {
        level: 1,
        text: "Before anything else — what should happen first: reading what the user typed, or adding? (Reading usually wins.)",
      },
      {
        level: 2,
        text: "Big idea: input() hands you text. Real addition needs integers (or floats) — conversion is the bridge.",
      },
      {
        level: 3,
        text: "Classic trap: you used + on two strings, so you might see \"53\" instead of 8. Sound familiar?",
      },
      {
        level: 4,
        text: "Partial scaffold — fill the last line:\na = int(input())\nb = int(input())\n# print their sum",
      },
      {
        level: 5,
        text: "Here's a full answer — needing it doesn't mean you're behind; type it line by line so your hands learn it.",
        solution: "a = int(input())\nb = int(input())\nprint(a + b)",
      },
    ],
    commonMistakes: [
      {
        symptom: "Output is '53' instead of 8",
        why: "You concatenated strings instead of adding integers.",
        fix: "Use int() on inputs before adding.",
      },
    ],
    mastered: {
      body: "You learned to turn what someone types into real numbers before using +. Every calculator, form, and scoreboard that does math on human input starts with that same quiet conversion step.",
    },
  },
  {
    id: 2,
    title: "Temperature Converter",
    testsIt: "Applying a formula with correct operator order.",
    needsYouToKnow: "F = C × 9/5 + 32. Use floats if needed.",
    instructions: "Read Celsius and print Fahrenheit using F = C*9/5 + 32.",
    testCases: [
      { input: "0", expected: "32" },
      { input: "100", expected: "212" },
    ],
    misconceptionTag: "operator-precedence-error",
    visualGuide: {
      title: "Formula breakdown",
      steps: ["Read C as a number", "Multiply C by 9", "Divide by 5", "Add 32", "Print"],
      formula: "F = (C × 9) / 5 + 32  — parentheses optional if you trust order, but clarity wins.",
    },
    progressiveHints: [
      {
        level: 1,
        text: "Pause — in words, what are you doing to Celsius before you touch 9, 5, or 32?",
      },
      {
        level: 2,
        text: "Concept: once the input is a real number, the formula is a single expression — multiply, divide, then add the constant.",
      },
      {
        level: 3,
        text: "Trap alley: typing +31 instead of +32, or skipping a step so the order drifts. The answer often looks \"almost\" right.",
      },
      {
        level: 4,
        text: "Skeleton to finish:\nc = float(input())\n# print c * 9 / 5 + 32",
      },
      {
        level: 5,
        text: "Full version below — peeking is allowed; retyping is how it sticks.",
        solution: "c = float(input())\nprint(c * 9 / 5 + 32)",
      },
    ],
    commonMistakes: [
      {
        symptom: "Answer off by a little (e.g. +31 instead of +32)",
        why: "Wrong constant or typo in formula.",
        fix: "Memorize +32 for Celsius to Fahrenheit.",
      },
    ],
    mastered: {
      body: "You translated a science-class formula into code without losing a step. Weather readouts, lab sensors, and cooking conversions all depend on that same careful order.",
    },
  },
  {
    id: 3,
    title: "Odd or Even",
    testsIt: "Using modulo to classify integers.",
    needsYouToKnow: "n % 2 == 0 means even.",
    instructions: "Read integer N. Print 'Even' or 'Odd'.",
    testCases: [
      { input: "4", expected: "Even" },
      { input: "7", expected: "Odd" },
    ],
    misconceptionTag: "modulo-confusion",
    visualGuide: {
      title: "Modulo intuition",
      steps: [
        "Divide by 2 and look at remainder",
        "Remainder 0 → Even",
        "Remainder 1 → Odd",
      ],
      asciiFlow: "n % 2  →  0 → Even   1 → Odd",
    },
    progressiveHints: [
      {
        level: 1,
        text: "When someone says \"even,\" are you thinking about the division result — or what's left over after dividing by 2?",
      },
      {
        level: 2,
        text: "The % operator answers \"what's left over?\" — even numbers leave 0 when you divide by 2.",
      },
      {
        level: 3,
        text: "Typical slips: forgetting int(input()), or mixing up = with == inside the condition.",
      },
      {
        level: 4,
        text: "Start here — finish the branches:\nn = int(input())\nif n % 2 == 0:\n    # print Even\nelse:\n    # print Odd",
      },
      {
        level: 5,
        text: "Working answer below — using it is practice too if you type it yourself.",
        solution:
          "n = int(input())\nif n % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
      },
    ],
    commonMistakes: [
      {
        symptom: "Wrong parity for negative numbers (advanced)",
        why: "Python % behaves well for negatives — if stuck, test with abs(n).",
        fix: "For this course, positive N is enough.",
      },
    ],
    mastered: {
      body: "You used remainder to separate even from odd without guessing. Games, schedules, and fair turn-taking reuse that same \"what's left over?\" idea.",
    },
  },
  {
    id: 4,
    title: "Simple Average",
    testsIt: "Averaging three numbers with decimal output.",
    needsYouToKnow: "Sum / 3, format to one decimal.",
    instructions: "Read 3 integers and print the average with exactly one decimal place.",
    testCases: [
      { input: "3 4 5", expected: "4.0" },
      { input: "2 2 3", expected: "2.3" },
    ],
    misconceptionTag: "integer-division-confusion",
    visualGuide: {
      title: "Average recipe",
      steps: ["Read three numbers", "Add them", "Divide by 3", "Print with one decimal"],
      formula: "avg = (a + b + c) / 3",
    },
    progressiveHints: [
      {
        level: 1,
        text: "If you explained this to a friend, would you say \"add three scores, then…\" what?",
      },
      {
        level: 2,
        text: "Concept: sum everything, divide by how many there are, then show one decimal so humans read it cleanly.",
      },
      {
        level: 3,
        text: "Trap: printing 4 when the checker wants 4.0, or skipping formatting so the decimal disappears.",
      },
      {
        level: 4,
        text: "Almost there:\na, b, c = map(int, input().split())\navg = (a + b + c) / 3\n# print avg with one decimal",
      },
      {
        level: 5,
        text: "Full solution — you’re not \"cheating,\" you’re reading a worked example. Still type it out if you can.",
        solution:
          "a, b, c = map(int, input().split())\navg = (a + b + c) / 3\nprint(f\"{avg:.1f}\")",
      },
    ],
    commonMistakes: [
      {
        symptom: "4 instead of 4.0",
        why: "Integer division or wrong formatting.",
        fix: "Use :.1f in an f-string.",
      },
    ],
    mastered: {
      body: "You combined adding, honest division, and formatting so the average looks right on screen. Grades, sports stats, and lab reports all ask for that same human-readable precision.",
    },
  },
  {
    id: 5,
    title: "Swap Two Values",
    testsIt: "Reordering two values without losing data.",
    needsYouToKnow: "Tuple swap in Python: a, b = b, a",
    instructions: "Read two values (space-separated) and print them in reverse order.",
    testCases: [
      { input: "2 8", expected: "8 2" },
      { input: "cat dog", expected: "dog cat" },
    ],
    misconceptionTag: "variable-assignment-confusion",
    visualGuide: {
      title: "Swap strategies",
      steps: [
        "Read into a and b",
        "Swap (tuple or temp variable)",
        "Print in new order",
      ],
      asciiFlow: "a,b → swap → b,a → print",
    },
    progressiveHints: [
      {
        level: 1,
        text: "Picture two cups — if you pour blindly, you might lose a drink. What do you need before you can reverse a and b safely?",
      },
      {
        level: 2,
        text: "Python's gentle trick: once both values exist, `a, b = b, a` swaps without losing either one.",
      },
      {
        level: 3,
        text: "Trap: doing `a = b` first — that overwrites the old `a`, so you can't finish the swap.",
      },
      {
        level: 4,
        text: "Scaffold:\na, b = input().split()\n# swap a and b, then print both with a space between",
      },
      {
        level: 5,
        text: "Full answer here — everyone peek sometimes; make your fingers do the work after.",
        solution: "a, b = input().split()\na, b = b, a\nprint(a, b)",
      },
    ],
    commonMistakes: [
      {
        symptom: "Lost one value",
        why: "a = b without saving old a first.",
        fix: "Use temp or tuple swap.",
      },
    ],
    mastered: {
      body: "You reordered two values without throwing one away. Sorting, undo, and shuffle features in real apps are built from that same careful swap.",
    },
  },
];

export const B1_STARTER_PYTHON = {
  1: `# Read two integers and print their sum (remember int()!)

a = int(input())
b = int(input())
print()  # put a + b inside print(...)
`,
  2: `# Celsius → Fahrenheit: F = C * 9/5 + 32

c = float(input())
print()  # formula result
`,
  3: `# Read N, print Even or Odd

n = int(input())
# use: if n % 2 == 0:
#     print("Even")
# else:
#     print("Odd")

`,
  4: `# Read three integers, print average to 1 decimal
# Tip: (a + b + c) / 3 and format with :.1f

a = int(input())
b = int(input())
c = int(input())
print(  )  # average, one decimal place
`,
  5: `# Read two tokens, print them swapped
# Tip: a, b = input().split() then swap

a, b = input().split()
# swap and print on one line, e.g. print(b, a)

`,
};
