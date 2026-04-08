/**
 * B1 Foundations — full student-focused lesson (high school friendly).
 * Optional fields: bullets, asciiDiagram, asciiDiagrams[], codeCompare[], tryIts[].
 */

export const B1_LESSON_ENHANCED = {
  title: "B1 Foundations",
  subtitle: "Variables, input/output, basic math",
  readingTime: "25–40 min",
  warmOpening: {
    reassurance:
      "You don't have to memorize any of this — read in a way that feels kind to your brain, tap the Try its when you want, and keep the tab open like a notebook you can revisit.",
  },
  /** ~4 min read: one line + one snippet per beat */
  compactConcepts: [
    {
      title: "A program is a to-do list for the computer",
      sentence: "It runs your steps in order — clear beats clever.",
      code: 'print("Hello")',
    },
    {
      title: "Variables are nicknames for values",
      sentence: "Give things names you'll recognize tomorrow, not just today.",
      code: "score = 0\nscore = score + 1",
    },
    {
      title: "print() is how your program speaks",
      sentence: "Commas add friendly spaces between pieces.",
      code: 'print("Hi", name)',
    },
    {
      title: "input() listens — but only in text",
      sentence: "The keyboard sends characters; you choose when to turn them into numbers.",
      code: 'n = int(input("Number? "))',
    },
    {
      title: "Math symbols match algebra",
      sentence: "// drops the fraction, % finds leftovers, ** is power.",
      code: "10 // 3   # 3\n7 % 2     # 1",
    },
    {
      title: "Parentheses settle arguments first",
      sentence: "When in doubt, add parens — future you will thank you.",
      code: "(2 + 3) * 4  # 20",
    },
    {
      title: "Types have to match on purpose",
      sentence: "Text plus text glues; numbers plus numbers add — mix them on purpose, not by accident.",
      code: "int('5') + int('3')  # 8",
    },
    {
      title: "Tiny programs combine all of the above",
      sentence: "Read, convert, calculate, print — that's the rhythm.",
      code: 'a = int(input())\nb = int(input())\nprint(a + b)',
    },
  ],
  warmClosing: {
    headline: "That's it. Seriously.",
    lines: [
      "You've met the ideas that show up in almost every first program.",
      "The long lesson below goes deeper — or jump to practice when you feel ready.",
    ],
    ctaNote: "We'll nudge you with hints, not judgment.",
  },
  heroIntro: {
    title: "What is programming?",
    analogy:
      "Programming is like writing a recipe for a very literal cook (the computer). If you forget a step or write it in the wrong order, the dish comes out wrong — same with code.",
    whyPython:
      "Python reads almost like English, has a huge community, and powers apps you use every day (Instagram, YouTube backends, games, AI). Perfect first language.",
  },
  sections: [
    {
      id: "section-intro",
      title: "Introduction to programming",
      body: "You give instructions. The computer runs them exactly — no mind-reading. That is why tiny typos matter, and why learning to read error messages is a superpower (not a punishment).",
      bullets: [
        "A program is a sequence of steps.",
        "The computer does what you wrote, not what you meant.",
        "Debugging is normal; even pros spend lots of time on it.",
      ],
      whyItMatters:
        "Every app you use — homework trackers, games, maps — is built from variables, input, math, and logic. You are learning the same building blocks.",
      analogy: "Recipe → code. Ingredients → variables. Steps → lines of code.",
      asciiDiagram: `  YOU                          COMPUTER
   |                                |
   |  write code (.py file)         |
   |------------------------------->|  run line by line
   |                                |
   |  output / errors               |
   |<-------------------------------|`,
      tryIt: {
        type: "quiz",
        prompt: "Which is closest to what a program does?",
        choices: [
          "Guesses what you meant",
          "Follows instructions step by step",
          "Learns like a human without rules",
        ],
        correctIndex: 1,
        success: "Right — computers are literal. Clear steps win.",
      },
    },
    {
      id: "section-how-it-runs",
      title: "How Python runs your file",
      body: "Python reads from top to bottom, one statement at a time (until you later learn loops and functions). If line 3 needs a variable that line 5 creates, that is a problem — order matters.",
      whyItMatters:
        "When something breaks, knowing 'it runs top-down' helps you trace what happened before the crash.",
      asciiDiagram: `LINE 1:  name = "Sam"
LINE 2:  print(name)     --> OK (name exists)
LINE 3:  print(score)    --> NameError if score never created`,
      tryIt: {
        type: "predict",
        prompt: "You run two lines: `x = 5` then `print(x)`. What prints?",
        choices: ["5", "x", "Nothing — error"],
        correctIndex: 0,
        success: "Yes — x holds the value 5.",
      },
    },
    {
      id: "section-1",
      title: "Variables — labeled boxes",
      body: "A variable is a name that refers to a value stored in memory. Assignment (`=`) puts a value into that name. You can reassign — the label stays, the contents can change.",
      analogy:
        "Labeled bins in your room: `homework` vs `random_papers`. Good names = future you knows what is inside without opening every bin.",
      whyItMatters:
        "Social apps store usernames and counts in variables. Games store health and score. Names + values = state.",
      examples: ["name = 'Alex'", "score = 10", "score = score + 1  # update in place", "pi = 3.14"],
      namingRules: {
        valid: ["student_name", "score2", "_temp", "total_score"],
        invalid: ["2score (can't start with digit)", "student-name (no hyphens)", "class (reserved word)"],
      },
      codeCompare: [
        {
          label: "Naming style (PEP 8 friendly)",
          wrong: "sn = \"Alex\"",
          right: "student_name = \"Alex\"",
        },
      ],
      tryIts: [
        {
          type: "quiz",
          prompt: "Which variable name is valid in Python?",
          choices: ["1st_place", "first_place", "first-place"],
          correctIndex: 1,
          success: "Nice — start with a letter or underscore; use underscores, not hyphens.",
        },
        {
          type: "predict",
          prompt: "After `a = 3` then `a = a + 2`, what is `a`?",
          choices: ["3", "5", "32"],
          correctIndex: 1,
          success: "Reassignment uses the current value — 3 + 2 = 5.",
        },
      ],
    },
    {
      id: "section-types",
      title: "Types at a glance",
      body: "Values have types. Early on you will mostly use integers (`int`), decimals (`float`), text (`str`), and later booleans (`bool`). Types decide what operations are allowed.",
      whyItMatters:
        "Likes on a post are numbers you add; a username is text you display — mixing them without converting causes bugs.",
      comparisonVisual: {
        title: "Same symbol, different meaning",
        rows: [
          { left: "3 + 4 (ints)", right: "7" },
          { left: "'3' + '4' (strings)", right: "'34' (text glued)" },
          { left: "3.0 + 4", right: "7.0 (float math)" },
        ],
      },
      tryIt: {
        type: "quiz",
        prompt: "Which expression is most likely to cause a type problem?",
        choices: ["print(2 * 3)", "print('2' * 3)", "print('2' + 3)"],
        correctIndex: 2,
        success: "'2' is text and 3 is a number — + usually needs both sides the same kind (unless multiplying string by int).",
      },
    },
    {
      id: "section-print",
      title: "print() — your program's voice",
      body: "Use `print` to show output. You can print several things separated by commas — Python inserts a space between them. Later you can learn f-strings; for now commas are enough.",
      examples: ['print("Hi")', 'print("Score:", 10)', 'print("A", "B", "C")'],
      whyItMatters:
        "Every scoreboard, chat bubble, and debug line starts as something printed or rendered to the screen.",
      asciiDiagram: `print("Hi", name, "!")
          |
          v
      Hi Alex !   (commas add spaces)`,
      tryIt: {
        type: "predict",
        prompt: 'What does `print("x", 2+2)` show?',
        choices: ["x 4", "x4", "x 2+2"],
        correctIndex: 0,
        success: "Comma-separated prints add spaces; 2+2 is evaluated to 4.",
      },
    },
    {
      id: "section-2",
      title: "input() — your program's ears",
      body: "input() waits for the user to type a line and press Enter. The result is always a string — even if they type digits. Think: the keyboard only sends text; Python believes you when you say it is a number by converting.",
      analogy: "input = listen and write down exactly what they said (as text). print = speak out loud.",
      whyItMatters:
        "Forms, sign-up screens, and calculators all read text — then convert when they need math.",
      criticalWarning:
        "input() ALWAYS returns a str. For math, use int(...) or float(...). For display-only, keep it as text.",
      examples: [
        'name = input("Your name? ")',
        'age = int(input("Age? "))',
        'a, b = input().split()  # two words on one line — still strings!',
      ],
      comparisonVisual: {
        title: "Text vs number (again — this is the #1 beginner trap)",
        rows: [
          { left: "'5' + '3' (strings)", right: "'53' (glued)" },
          { left: "int('5') + int('3')", right: "8 (math)" },
        ],
      },
      codeCompare: [
        {
          label: "Two numbers on one line",
          wrong: "a = input()\nb = input()",
          right: 'line = input()\na, b = line.split()\nx = int(a); y = int(b)',
        },
      ],
      tryIts: [
        {
          type: "fix",
          prompt: "What is wrong? (Think: types)",
          wrong: "x = input()\nprint(x + 1)",
          hint: "input returns text. You need int() before adding 1.",
          reveal: "x = int(input())\nprint(x + 1)",
        },
        {
          type: "quiz",
          prompt: "You want the user to type 7 and store it as a real integer. Best first step?",
          choices: ["x = input()", "x = int(input())", "x = input(int)"],
          correctIndex: 1,
          success: "Wrap input() with int() so x is an int, not text.",
        },
      ],
    },
    {
      id: "section-convert",
      title: "Converting: int(), float(), str()",
      body: "Conversion functions build a new value of the right type. int('12') works; int('12.3') fails. float('12.3') is fine. str(99) turns a number into text for printing or concatenation.",
      bullets: [
        "int('5') → 5",
        "float('3.5') → 3.5",
        "str(10) → '10'",
      ],
      whyItMatters:
        "GPS, banking, and science apps constantly convert between text fields and numeric calculations.",
      tryIt: {
        type: "predict",
        prompt: "What is int('4') + int('5')?",
        choices: ["45", "9", "Error"],
        correctIndex: 1,
        success: "Convert first, then add — 4 + 5 = 9.",
      },
    },
    {
      id: "section-3",
      title: "Math operators",
      body: "Python uses familiar symbols. `/` does true division (often a float). `//` floors toward negative infinity. `%` is remainder. `**` is power.",
      whyItMatters:
        "Games use % for repeating patterns (clock, grid wrap). // snaps to whole steps. Wrong operator = wrong physics.",
      operators: [
        ["+", "Add", "7 + 2 → 9"],
        ["-", "Subtract", "7 - 2 → 5"],
        ["*", "Multiply", "7 * 2 → 14"],
        ["/", "True divide", "7 / 2 → 3.5"],
        ["//", "Floor divide", "7 // 2 → 3"],
        ["%", "Remainder (modulo)", "7 % 2 → 1"],
        ["**", "Power", "2 ** 3 → 8"],
      ],
      divisionCompare: [
        { op: "/", example: "7 / 2", result: "3.5 (float)" },
        { op: "//", example: "7 // 2", result: "3 (floor)" },
        { op: "%", example: "7 % 2", result: "1 (leftover)" },
      ],
      tryIt: {
        type: "predict",
        prompt: "What is 10 // 3 ?",
        choices: ["3", "3.33", "1"],
        correctIndex: 0,
        success: "// is floor division — it drops the fraction (toward -∞ for negatives).",
      },
    },
    {
      id: "section-pemdas",
      title: "Order of operations (PEMDAS)",
      body: "Parentheses first, then exponentiation, then multiplication/division left-to-right, then addition/subtraction. When unsure, add parentheses — clarity beats cleverness.",
      parenthesesExamples: [
        "2 + 3 * 4 → 14 (multiply first)",
        "(2 + 3) * 4 → 20",
        "2 ** 3 ** 2 → 512 (exponent groups right-to-left in Python)",
      ],
      asciiDiagrams: [
        `Expression:   2 + 3 * 4
                      ------
Step 1 (*/):     2 + 12
Step 2 (+-):        14`,
        `Expression:   (2 + 3) * 4
Step 1 (parens):   5 * 4
Step 2:             20`,
      ],
      tryIts: [
        {
          type: "predict",
          prompt: "What is 2 + 4 / 2 ?",
          choices: ["3", "4", "6"],
          correctIndex: 1,
          success: "Divide before add: 4/2 = 2, then 2 + 2 = 4.",
        },
        {
          type: "quiz",
          prompt: "Which adds first: 2 + 3 * 4 or (2 + 3) * 4 ?",
          choices: [
            "First always adds 2+3",
            "Without parens, * before +",
            "Python picks randomly",
          ],
          correctIndex: 1,
          success: "Multiplication before addition unless parentheses change the story.",
        },
      ],
    },
    {
      id: "section-modulo",
      title: "Modulo % — remainder superpower",
      body: "a % b is the remainder after dividing a by b. Even/odd: n % 2 == 0 means even. Clock math: hour hand wraps every 12 — same idea.",
      whyItMatters:
        "Alternating turns in games, zebra-striping rows, checking divisibility — modulo shows up everywhere.",
      asciiDiagrams: [
        ` 7 ÷ 2 = 3 remainder 1   -->   7 % 2 == 1
10 ÷ 3 = 3 remainder 1   -->  10 % 3 == 1`,
        `EVEN:  n % 2 == 0     (0, 2, 4, ...)
ODD:   n % 2 == 1     (1, 3, 5, ...)`,
      ],
      tryIt: {
        type: "predict",
        prompt: "What is 9 % 4 ?",
        choices: ["2", "2.25", "1"],
        correctIndex: 2,
        success: "9 = 4*2 + 1 — remainder is 1.",
      },
    },
    {
      id: "section-mistakes",
      title: "Common mistakes (with fixes)",
      body: "Everyone hits these. The win is spotting the pattern quickly — then you fix faster next time.",
      mistakesDetailed: [
        {
          title: "Forgetting int() on input",
          symptom: "'5' + '3' prints '53' or odd string behavior",
          memoryTrick: "input = text until you int() it",
          wrong: "a = input(); b = input(); print(a + b)",
          correct: "a = int(input()); b = int(input()); print(a + b)",
        },
        {
          title: "Mixing strings and numbers with +",
          symptom: "TypeError or surprise text",
          memoryTrick: "Convert before math; or use commas in print",
          wrong: "print(input() + 1)",
          correct: "print(int(input()) + 1)",
        },
        {
          title: "Off-by-one in formulas",
          symptom: "Answer close but wrong (e.g. 31 vs 32 in °F)",
          memoryTrick: "Write the formula on paper once, then code",
          wrong: "F = C * 9/5 + 31",
          correct: "F = C * 9/5 + 32",
        },
        {
          title: "= vs ==",
          symptom: "SyntaxError or wrong logic in if-statements (coming in B2)",
          memoryTrick: "= assigns, == compares",
          wrong: "if x = 5:",
          correct: "if x == 5:",
        },
      ],
      tryIts: [
        {
          type: "fix",
          prompt: "Spot the bug (sum of two typed numbers)",
          wrong: "x = input()\ny = input()\nprint(x + y)",
          hint: "Both sides are strings. Convert before adding.",
          reveal: "x = int(input())\ny = int(input())\nprint(x + y)",
        },
        {
          type: "quiz",
          prompt: "Which line has the classic beginner mistake?",
          choices: [
            "age = int(input())",
            "print(age + 1)",
            "age = input()  # want a number",
          ],
          correctIndex: 2,
          success: "If you need a number, int() or float() the input.",
        },
      ],
    },
    {
      id: "section-debug",
      title: "Reading errors like a detective",
      body: "When Python errors, it tells you the file, line, and error type. Read bottom-up: the last line says what went wrong; lines above show the call stack.",
      bullets: [
        "NameError → used a variable before defining it",
        "TypeError → wrong types for an operation",
        "ValueError → conversion failed (e.g. int('abc'))",
      ],
      whyItMatters:
        "Professional programmers read stack traces all day. Getting comfortable now saves hours later.",
      asciiDiagram: `  File "main.py", line 4
    print(score)
NameError: name 'score' is not defined
          ^
    Fix: create score before line 4`,
      tryIt: {
        type: "quiz",
        prompt: "You see: TypeError: unsupported operand type(s) for +: 'str' and 'int'. What is the likely fix?",
        choices: [
          "Delete the line",
          "Convert the string to int (or number to str on purpose)",
          "Restart the computer",
        ],
        correctIndex: 1,
        success: "Align types — usually convert input with int() before math.",
      },
    },
    {
      id: "section-together",
      title: "Putting it all together",
      body: "A small program: greet, read two numbers, convert, compute sum and average, print clearly. Trace it line by line in your head — that is how you build intuition.",
      fullExample: `name = input("Name: ")
a = int(input("First number: "))
b = int(input("Second number: "))
print("Hi,", name)
print("Sum:", a + b)
print("Average:", (a + b) / 2)`,
      predict:
        "If you removed int() around input for a and b and typed 2 and 3, what would a + b become?",
      predictAnswer:
        "String concat: '2' + '3' → '23'. That is why conversion matters for numeric programs.",
      tryIts: [
        {
          type: "predict",
          prompt: "What does (a + b) / 2 use — float or int division?",
          choices: [
            "Always int — averages are whole numbers only",
            "In Python 3, / yields float (e.g. 7/2 = 3.5)",
            "Illegal until you learn floats",
          ],
          correctIndex: 1,
          success: "True division `/` gives float results; // would floor.",
        },
        {
          type: "fix",
          prompt: "Mini challenge: average should print with one decimal. What is missing?",
          wrong: 'print("Average:", (a + b) / 2)',
          hint: "Use an f-string: print(f\"Average: {(a + b) / 2:.1f}\") — or round(). (Preview: you'll use this in practice.)",
          reveal: 'print(f"Average: {(a + b) / 2:.1f}")',
        },
      ],
    },
    {
      id: "section-strings",
      title: "Strings — glue, repeat, length (preview)",
      body: "Strings are text in quotes. You can glue with `+`, repeat with `*`, and check length with `len()`. Numbers inside quotes are still text — `'2' + '3'` is `'23'`, not `5`.",
      whyItMatters:
        "Usernames, chat messages, file names — all strings. Numeric-looking text still needs conversion before math.",
      examples: [
        'greeting = "Hi " + name',
        'separator = "-" * 10',
        'len("hello")  # 5',
      ],
      codeCompare: [
        {
          label: "Accidental text math",
          wrong: "total = '10' + '20'",
          right: "total = int('10') + int('20')  # 30",
        },
      ],
      tryIts: [
        {
          type: "predict",
          prompt: 'What is len("Hi!")?',
          choices: ["2", "3", "4"],
          correctIndex: 2,
          success: "H, i, and ! — three characters.",
        },
        {
          type: "quiz",
          prompt: 'What does "na" * 3 produce?',
          choices: ['"nanana"', '"na na na"', "Error"],
          correctIndex: 0,
          success: "Multiplying a string by n repeats it n times.",
        },
      ],
    },
    {
      id: "section-realworld",
      title: "Where you already see this",
      body: "You are not learning random trivia — this is the same logic behind tools you use daily.",
      bullets: [
        "Like counters: take a number, add one, store it again (variables + math).",
        "Checkout totals: read prices as text from a form, convert to numbers, sum.",
        "Games: health and coordinates live in variables; collisions use math and later logic.",
        "Maps and GPS: distances and speeds mix floats and careful order of operations.",
      ],
      asciiDiagram: `  [ user types ] --> [ input() as text ]
                           |
                           v
                    [ int() / float() ]
                           |
                           v
              [ variables + math + print() ]`,
      tryIt: {
        type: "quiz",
        prompt: "Which is closest to what `int(input())` is doing in a tip calculator?",
        choices: [
          "Guessing the user's intent",
          "Turning keyboard text into a real number the program can add",
          "Deleting bad input",
        ],
        correctIndex: 1,
        success: "Conversion bridges human typing and machine math.",
      },
    },
    {
      id: "section-next",
      title: "Ready for practice",
      body: "You now have vocabulary: variables, types, input/output, conversion, and core math. Next, you will write short programs with starter code, visual guides, and layered hints — typing beats copy-pasting.",
      bullets: [
        "Use the Quick reference below while coding.",
        "When stuck: say what you expect vs what you see.",
        "One small test at a time (read inputs you typed).",
      ],
      whyItMatters:
        "Muscle memory comes from reps — the practice challenges are designed to make reps feel guided, not punishing.",
    },
  ],
  quickReference: [
    "input() → str → int() / float() before numeric math",
    "print(a, b) adds spaces; use f-strings later for fancy formatting",
    "= assigns; == compares (you will use == a lot in B2)",
    "/ true division (float); // floor; % remainder; ** power",
    "PEMDAS — add parentheses when unsure",
    "n % 2 == 0 → even; n % 2 == 1 → odd",
    "Read errors bottom-up; TypeError often means bad types",
    "Good variable names beat clever one-letter names",
  ],
};

/** Which lesson page (1–2) a section belongs to — keeps one unit from feeling like a wall of text */
const B1_SECTION_PART = {
  "section-intro": 1,
  "section-how-it-runs": 1,
  "section-1": 1,
  "section-types": 1,
  "section-print": 2,
  "section-2": 2,
  "section-convert": 2,
  "section-3": 2,
  "section-pemdas": 2,
  "section-modulo": 2,
  "section-mistakes": 2,
  "section-debug": 2,
  "section-together": 2,
  "section-strings": 2,
  "section-realworld": 2,
  "section-next": 2,
};

export const B1_LESSON_PART_COUNT = 2;

export function getB1LessonPartForSectionId(sectionId) {
  return B1_SECTION_PART[sectionId] ?? 1;
}
