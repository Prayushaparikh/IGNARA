/**
 * B1 practice challenges — scaffolding, visual guides, progressive hints.
 *
 * IDs 1–5 map exactly to unit_order_index 1–5 in the DB.
 * All multi-value inputs arrive on ONE line (space-separated) so they work
 * with the sandbox's `echo '...' | python3` delivery.
 * Students read them with: a, b = map(int, input().split())
 */

export const B1_CHALLENGES_ENHANCED = [
  // ── C1: Add Two Numbers ───────────────────────────────────────────
  // sensor_tag: type-conversion-missing
  {
    id: 1,
    title: "Add Two Numbers",
    testsIt: "Converting two text inputs to integers before adding them.",
    needsYouToKnow: "a, b = map(int, input().split())",
    instructions: "Read two integers on one line (separated by a space) and print their sum.",
    testCases: [
      { input: "5 3",   expected: "8"  },
      { input: "12 8",  expected: "20" },
    ],
    misconceptionTag: "type-conversion-missing",
    visualGuide: {
      title: "What input() gives you",
      steps: [
        'input() → the string "5 3"',
        '.split() → the list ["5", "3"]',
        'map(int, ...) → the integers 5, 3',
        "a + b → 8",
      ],
      asciiFlow: '"5 3" → split → ["5","3"] → map(int) → 5,3 → + → 8',
    },
    progressiveHints: [
      {
        level: 1,
        text: "Before adding — what does input() actually give you? A number, or something that looks like a number?",
      },
      {
        level: 2,
        text: 'input() hands you text. "5" + "3" is "53" in Python. You need real integers first.',
      },
      {
        level: 3,
        text: 'Both numbers arrive on one line: "5 3". Use .split() to separate them, then map(int, ...) to convert.',
      },
      {
        level: 4,
        text: "Fill in the last line:\na, b = map(int, input().split())\n# print their sum",
      },
      {
        level: 5,
        text: "Full answer — type it line by line so your hands learn it.",
        solution: "a, b = map(int, input().split())\nprint(a + b)",
      },
    ],
    commonMistakes: [
      {
        symptom: 'Output is "53" instead of 8',
        why: "You added strings instead of integers.",
        fix: "Wrap with int() before adding: map(int, input().split())",
      },
    ],
    mastered: {
      body: "You learned to turn what someone types into real numbers before using +. Every calculator, form, and scoreboard does that same quiet conversion step.",
    },
  },

  // ── C2: Temperature Converter ──────────────────────────────────────
  // sensor_tag: operator-precedence-error
  {
    id: 2,
    title: "Temperature Converter",
    testsIt: "Translating a formula into code with correct operator order and float output.",
    needsYouToKnow: "F = C * 9 / 5 + 32  |  print(f'{result:.1f}')",
    instructions:
      "Read an integer Celsius temperature. Print the Fahrenheit equivalent to 1 decimal place. Formula: F = C * 9 / 5 + 32",
    testCases: [
      { input: "0",   expected: "32.0"  },
      { input: "100", expected: "212.0" },
    ],
    misconceptionTag: "operator-precedence-error",
    visualGuide: {
      title: "Formula breakdown",
      steps: [
        "Read C as an integer",
        "Multiply C by 9 → C * 9",
        "Divide by 5 → C * 9 / 5",
        "Add 32 → C * 9 / 5 + 32",
        "Print with 1 decimal: f'{result:.1f}'",
      ],
      formula: "F = C * 9 / 5 + 32",
    },
    progressiveHints: [
      {
        level: 1,
        text: "In plain English: multiply the Celsius by something, divide, then add a constant. In what order?",
      },
      {
        level: 2,
        text: "Python follows the same order as maths: * and / before +. So C * 9 / 5 + 32 works correctly without extra parentheses.",
      },
      {
        level: 3,
        text: "Watch out: raw floats print messily (98.60000000000001). Use f'{result:.1f}' to get exactly one decimal place.",
      },
      {
        level: 4,
        text: "Skeleton:\nc = int(input())\nresult = c * 9 / 5 + 32\n# print result with 1 decimal place",
      },
      {
        level: 5,
        text: "Full version — retyping it is more useful than just reading.",
        solution: "c = int(input())\nresult = c * 9 / 5 + 32\nprint(f'{result:.1f}')",
      },
    ],
    commonMistakes: [
      {
        symptom: "Output is 98.60000000000001 instead of 98.6",
        why: "Printing a raw float shows full floating-point precision.",
        fix: "Use f'{result:.1f}' to round to 1 decimal place.",
      },
      {
        symptom: "Answer is slightly wrong (e.g. 98 instead of 98.6)",
        why: "Using // (floor division) truncates decimals.",
        fix: "Use / not // in the formula.",
      },
    ],
    mastered: {
      body: "You translated a science formula into code without losing a step — and formatted the output so it looks right. Weather readouts, lab sensors, and cooking apps all depend on that same careful order.",
    },
  },

  // ── C3: Odd or Even ────────────────────────────────────────────────
  // sensor_tag: modulo-confusion
  {
    id: 3,
    title: "Odd or Even",
    testsIt: "Using modulo (%) to classify a number and printing conditional output.",
    needsYouToKnow: "n % 2 == 0 means even  |  if / else",
    instructions: 'Read an integer. Print exactly "Even" if it is even, or "Odd" if it is odd.',
    testCases: [
      { input: "4", expected: "Even" },
      { input: "7", expected: "Odd"  },
    ],
    misconceptionTag: "modulo-confusion",
    visualGuide: {
      title: "Modulo intuition",
      steps: [
        "Divide by 2 and look at the remainder",
        "Remainder 0 → the number divides evenly → Even",
        "Remainder 1 → something is left over → Odd",
      ],
      asciiFlow: "n % 2  →  0 → Even   1 → Odd",
    },
    progressiveHints: [
      {
        level: 1,
        text: "When someone says 'even', are you thinking about the division result — or what's left over after dividing by 2?",
      },
      {
        level: 2,
        text: "The % operator answers 'what's left over?' Even numbers leave 0 when divided by 2.",
      },
      {
        level: 3,
        text: "Classic slips: forgetting int(input()), or mixing up = (assign) with == (compare) inside the condition.",
      },
      {
        level: 4,
        text: "Start here — fill the branches:\nn = int(input())\nif n % 2 == 0:\n    # print Even\nelse:\n    # print Odd",
      },
      {
        level: 5,
        text: "Working answer below — type it out yourself after reading.",
        solution: "n = int(input())\nif n % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
      },
    ],
    commonMistakes: [
      {
        symptom: "Always prints Even (or always Odd)",
        why: "Using = instead of == in the condition.",
        fix: "Comparison is ==, assignment is =. Use if n % 2 == 0.",
      },
    ],
    mastered: {
      body: "You used remainder to classify without guessing. Games, schedules, and fair turn-taking reuse that same 'what's left over?' idea every day.",
    },
  },

  // ── C4: Simple Average ─────────────────────────────────────────────
  // sensor_tag: integer-division-confusion
  {
    id: 4,
    title: "Simple Average",
    testsIt: "Float division vs integer division, and formatting a decimal result.",
    needsYouToKnow: "/ gives a float  |  // gives an integer  |  f'{x:.1f}'",
    instructions:
      "Read three integers on one line (separated by spaces). Print their average with exactly 1 decimal place.",
    testCases: [
      { input: "3 4 5", expected: "4.0" },
      { input: "2 2 3", expected: "2.3" },
    ],
    misconceptionTag: "integer-division-confusion",
    visualGuide: {
      title: "Division types side by side",
      steps: [
        "/ always gives a float:   7 / 2 = 3.5",
        "// truncates the decimal: 7 // 2 = 3",
        "For averages, always use /",
        "Print with :.1f to show exactly one decimal",
      ],
      asciiFlow: "sum / 3  →  float  →  f'{avg:.1f}'  →  print",
    },
    progressiveHints: [
      {
        level: 1,
        text: "In words: add all three, then divide. Which Python operator gives you the decimal answer — / or //?",
      },
      {
        level: 2,
        text: "/ always returns a float in Python 3. 7 / 2 = 3.5. // would give 3 — wrong for an average.",
      },
      {
        level: 3,
        text: "Printing the raw float often gives too many digits. Use f'{avg:.1f}' to show exactly one decimal.",
      },
      {
        level: 4,
        text: "Skeleton:\na, b, c = map(int, input().split())\navg = (a + b + c) / 3\n# print avg with one decimal place",
      },
      {
        level: 5,
        text: "Full solution — type it out; the pattern is worth memorising.",
        solution: "a, b, c = map(int, input().split())\navg = (a + b + c) / 3\nprint(f'{avg:.1f}')",
      },
    ],
    commonMistakes: [
      {
        symptom: "Output is 4 instead of 4.0",
        why: "Using // (floor division) or missing the :.1f formatter.",
        fix: "Use (a + b + c) / 3 and print with f'{avg:.1f}'.",
      },
      {
        symptom: "Output has too many decimals (e.g. 2.3333333333333335)",
        why: "Printing the raw float without formatting.",
        fix: "Wrap with f'{avg:.1f}' to round to 1 decimal place.",
      },
    ],
    mastered: {
      body: "You combined adding, float division, and formatting — the same trio used in grade calculators, sports stats, and dashboards everywhere.",
    },
  },

  // ── C5: Swap Two Values ────────────────────────────────────────────
  // sensor_tag: variable-assignment-confusion
  {
    id: 5,
    title: "Swap Two Values",
    testsIt: "Reordering two values without losing data.",
    needsYouToKnow: "a, b = b, a  (tuple swap)",
    instructions:
      "Read two values on one line separated by a space. Print them in reversed order, separated by a space.",
    testCases: [
      { input: "4 9",  expected: "9 4" },
      { input: "0 1",  expected: "1 0" },
    ],
    misconceptionTag: "variable-assignment-confusion",
    visualGuide: {
      title: "Swap strategies",
      steps: [
        "Read a and b from input",
        "Swap safely: a, b = b, a",
        "Print in new order: print(a, b)",
      ],
      asciiFlow: "a,b → a,b = b,a → b,a → print",
    },
    progressiveHints: [
      {
        level: 1,
        text: "Picture two cups of liquid. If you pour one into the other directly, you lose the first drink. What do you need first?",
      },
      {
        level: 2,
        text: "Python's elegant trick: a, b = b, a swaps both variables in one line without losing either value.",
      },
      {
        level: 3,
        text: "Trap: doing a = b first overwrites a before you've saved it. The tuple swap avoids this entirely.",
      },
      {
        level: 4,
        text: "Scaffold:\na, b = input().split()\n# swap a and b, then print both with a space between",
      },
      {
        level: 5,
        text: "Full answer — everyone peeks sometimes; make your fingers do the work after.",
        solution: "a, b = input().split()\na, b = b, a\nprint(a, b)",
      },
    ],
    commonMistakes: [
      {
        symptom: "Both values are the same after swap",
        why: "a = b overwrites a before you save it — the original a is gone.",
        fix: "Use a, b = b, a (Python evaluates the right side first).",
      },
    ],
    mastered: {
      body: "You reordered two values without throwing one away. Sorting, undo, and shuffle features in real apps are all built from that same careful swap.",
    },
  },
];

// ── Starter templates (one per challenge, one per language) ──────────
// Input format: all multi-value inputs are space-separated on one line.
// Python idiom: a, b = map(int, input().split())

export const B1_STARTER_PYTHON = {
  1: `# Read two integers on one line and print their sum
# Tip: both numbers arrive together — use map() to convert them

a, b = map(int, input().split())
print()  # put a + b inside print(...)
`,
  2: `# Celsius → Fahrenheit: F = C * 9 / 5 + 32
# Tip: use / (not //) and format with :.1f

c = int(input())
result = c * 9 / 5 + 32
print()  # print result with 1 decimal place
`,
  3: `# Read N, print "Even" or "Odd"
# Tip: use n % 2 == 0 to check for even

n = int(input())
if n % 2 == 0:
    print()  # Even
else:
    print()  # Odd
`,
  4: `# Read three integers, print their average to 1 decimal place
# Tip: use / for float division and f'{avg:.1f}' for formatting

a, b, c = map(int, input().split())
avg = (a + b + c) / 3
print()  # print avg with one decimal place
`,
  5: `# Read two values and print them swapped
# Tip: a, b = b, a swaps without losing either value

a, b = input().split()
a, b = b, a
print(a, b)
`,
};
