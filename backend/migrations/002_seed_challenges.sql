-- ── Seed: Skills ─────────────────────────────────────────────────
INSERT INTO skills (id, label, description, category) VALUES
  ('arrays',          'Arrays',            'Work with ordered collections',         'fundamentals'),
  ('loops',           'Loops',             'Iterate with for/while loops',           'fundamentals'),
  ('functions',       'Functions',         'Write reusable functions',               'fundamentals'),
  ('strings',         'Strings',           'Manipulate text data',                   'fundamentals'),
  ('recursion',       'Recursion',         'Solve problems recursively',             'algorithms'),
  ('sorting',         'Sorting',           'Sort and order data',                    'algorithms'),
  ('math',            'Math',              'Apply mathematical reasoning',           'fundamentals'),
  ('debugging',       'Debugging',         'Find and fix bugs',                      'fundamentals'),
  ('OOP',             'OOP',               'Object-oriented programming',            'advanced'),
  ('data-structures', 'Data Structures',   'Stacks, queues, maps, sets',             'advanced')
ON CONFLICT (id) DO NOTHING;

-- ── Seed: Challenges ──────────────────────────────────────────────
INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index)
VALUES

-- 1. Hello World
(
  'Hello, World!',
  'Write a function that returns the string "Hello, World!".',
  '{"js": "function hello() {\n  // your code here\n  return \"\";\n}\n\nconsole.log(hello());", "python": "def hello():\n    # your code here\n    return \"\"\n\nprint(hello())"}',
  '[{"input": "", "expected_output": "Hello, World!", "is_hidden": false}]',
  'easy',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'ux-engineer'],
  ARRAY['functions'],
  1
),

-- 2. Sum Two Numbers
(
  'Sum Two Numbers',
  'Write a function that takes two numbers as input and returns their sum.\n\nExample:\n  add(3, 5) → 8\n  add(-1, 4) → 3',
  '{"js": "function add(a, b) {\n  // your code here\n}\n\nconst [a, b] = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim().split('' '').map(Number);\nconsole.log(add(a, b));", "python": "def add(a, b):\n    # your code here\n    pass\n\nline = input().split()\nprint(add(int(line[0]), int(line[1])))"}',
  '[{"input": "3 5", "expected_output": "8", "is_hidden": false}, {"input": "-1 4", "expected_output": "3", "is_hidden": false}, {"input": "0 0", "expected_output": "0", "is_hidden": true}]',
  'easy',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'data-scientist'],
  ARRAY['functions', 'math'],
  2
),

-- 3. Reverse a String
(
  'Reverse a String',
  'Given a string, return it reversed.\n\nExample:\n  reverse("hello") → "olleh"\n  reverse("abc") → "cba"',
  '{"js": "function reverse(s) {\n  // your code here\n}\n\nconst s = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim();\nconsole.log(reverse(s));", "python": "def reverse(s):\n    # your code here\n    pass\n\nprint(reverse(input()))"}',
  '[{"input": "hello", "expected_output": "olleh", "is_hidden": false}, {"input": "abc", "expected_output": "cba", "is_hidden": false}, {"input": "racecar", "expected_output": "racecar", "is_hidden": true}]',
  'easy',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'ux-engineer'],
  ARRAY['strings', 'functions'],
  3
),

-- 4. Count Even Numbers
(
  'Count Even Numbers',
  'Given a list of space-separated integers, return how many are even.\n\nExample:\n  Input: 1 2 3 4 5 6\n  Output: 3',
  '{"js": "function countEvens(nums) {\n  // your code here\n}\n\nconst nums = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim().split('' '').map(Number);\nconsole.log(countEvens(nums));", "python": "def count_evens(nums):\n    # your code here\n    pass\n\nnums = list(map(int, input().split()))\nprint(count_evens(nums))"}',
  '[{"input": "1 2 3 4 5 6", "expected_output": "3", "is_hidden": false}, {"input": "2 4 6 8", "expected_output": "4", "is_hidden": false}, {"input": "1 3 5 7", "expected_output": "0", "is_hidden": true}]',
  'easy',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'data-scientist'],
  ARRAY['arrays', 'loops'],
  4
),

-- 5. FizzBuzz
(
  'FizzBuzz',
  'Print numbers from 1 to N. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for both print "FizzBuzz".\n\nExample:\n  Input: 5\n  Output:\n  1\n  2\n  Fizz\n  4\n  Buzz',
  '{"js": "const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim());\nfor (let i = 1; i <= n; i++) {\n  // your code here\n}", "python": "n = int(input())\nfor i in range(1, n + 1):\n    # your code here\n    pass"}',
  '[{"input": "5", "expected_output": "1\n2\nFizz\n4\nBuzz", "is_hidden": false}, {"input": "15", "expected_output": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", "is_hidden": false}]',
  'easy',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'devops-engineer'],
  ARRAY['loops', 'math'],
  5
),

-- 6. Find Maximum
(
  'Find the Maximum',
  'Given a list of space-separated integers, return the largest one.\n\nExample:\n  Input: 3 1 4 1 5 9 2 6\n  Output: 9',
  '{"js": "function findMax(nums) {\n  // your code here\n}\n\nconst nums = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim().split('' '').map(Number);\nconsole.log(findMax(nums));", "python": "def find_max(nums):\n    # your code here\n    pass\n\nnums = list(map(int, input().split()))\nprint(find_max(nums))"}',
  '[{"input": "3 1 4 1 5 9 2 6", "expected_output": "9", "is_hidden": false}, {"input": "-5 -1 -3", "expected_output": "-1", "is_hidden": false}, {"input": "42", "expected_output": "42", "is_hidden": true}]',
  'easy',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'data-scientist'],
  ARRAY['arrays', 'loops'],
  6
),

-- 7. Palindrome Check
(
  'Palindrome Check',
  'Return "true" if a string is a palindrome (reads the same forwards and backwards), otherwise "false". Ignore case.\n\nExample:\n  racecar → true\n  hello → false\n  Madam → true',
  '{"js": "function isPalindrome(s) {\n  // your code here\n}\n\nconst s = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim();\nconsole.log(isPalindrome(s));", "python": "def is_palindrome(s):\n    # your code here\n    pass\n\nprint(str(is_palindrome(input())).lower())"}',
  '[{"input": "racecar", "expected_output": "true", "is_hidden": false}, {"input": "hello", "expected_output": "false", "is_hidden": false}, {"input": "Madam", "expected_output": "true", "is_hidden": true}]',
  'medium',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'cybersecurity-analyst'],
  ARRAY['strings', 'functions'],
  7
),

-- 8. Fibonacci
(
  'Fibonacci Sequence',
  'Given a number N, print the first N numbers of the Fibonacci sequence separated by spaces.\n\nExample:\n  Input: 7\n  Output: 0 1 1 2 3 5 8',
  '{"js": "function fibonacci(n) {\n  // return array of first n fibonacci numbers\n}\n\nconst n = parseInt(require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim());\nconsole.log(fibonacci(n).join('' ''));", "python": "def fibonacci(n):\n    # return list of first n fibonacci numbers\n    pass\n\nn = int(input())\nprint('' ''.join(map(str, fibonacci(n))))"}',
  '[{"input": "7", "expected_output": "0 1 1 2 3 5 8", "is_hidden": false}, {"input": "1", "expected_output": "0", "is_hidden": false}, {"input": "10", "expected_output": "0 1 1 2 3 5 8 13 21 34", "is_hidden": true}]',
  'medium',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'data-scientist'],
  ARRAY['recursion', 'math', 'loops'],
  8
),

-- 9. Count Word Frequency
(
  'Word Frequency',
  'Given a sentence, output each unique word and how many times it appears, sorted alphabetically.\n\nExample:\n  Input: the cat sat on the mat\n  Output:\n  cat 1\n  mat 1\n  on 1\n  sat 1\n  the 2',
  '{"js": "const line = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim();\nconst words = line.split('' '');\n// count frequencies and print sorted\n", "python": "from collections import Counter\nwords = input().split()\n# count and print sorted\nfor word, count in sorted(Counter(words).items()):\n    print(word, count)"}',
  '[{"input": "the cat sat on the mat", "expected_output": "cat 1\nmat 1\non 1\nsat 1\nthe 2", "is_hidden": false}, {"input": "hello hello world", "expected_output": "hello 2\nworld 1", "is_hidden": true}]',
  'medium',
  ARRAY['js', 'python'],
  ARRAY['data-scientist', 'software-engineer'],
  ARRAY['strings', 'arrays', 'sorting'],
  9
),

-- 10. Binary Search
(
  'Binary Search',
  'Given a sorted list of integers and a target, return the index of the target using binary search. Return -1 if not found.\n\nFirst line: space-separated sorted integers\nSecond line: target\n\nExample:\n  Input:\n  1 3 5 7 9 11\n  7\n  Output: 3',
  '{"js": "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  // your code here\n  return -1;\n}\n\nconst lines = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim().split(''\\n'');\nconst arr = lines[0].split('' '').map(Number);\nconst target = parseInt(lines[1]);\nconsole.log(binarySearch(arr, target));", "python": "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    # your code here\n    return -1\n\nimport sys\nlines = sys.stdin.read().strip().split(''\\n'')\narr = list(map(int, lines[0].split()))\ntarget = int(lines[1])\nprint(binary_search(arr, target))"}',
  '[{"input": "1 3 5 7 9 11\n7", "expected_output": "3", "is_hidden": false}, {"input": "1 3 5 7 9 11\n6", "expected_output": "-1", "is_hidden": false}, {"input": "2 4 6 8 10\n10", "expected_output": "4", "is_hidden": true}]',
  'hard',
  ARRAY['js', 'python'],
  ARRAY['software-engineer', 'data-scientist', 'cybersecurity-analyst'],
  ARRAY['arrays', 'algorithms', 'data-structures'],
  10
);
