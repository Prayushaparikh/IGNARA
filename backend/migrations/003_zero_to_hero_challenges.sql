-- ================================================================
-- DREAMPATH CODEX — ZERO TO HERO CHALLENGE CURRICULUM
-- 50 challenges across 6 stages
-- ================================================================

-- Clean existing challenges and re-seed properly
TRUNCATE challenges CASCADE;

-- ================================================================
-- STAGE 1: FOUNDATIONS (Challenges 1–10)
-- "Your first lines of code"
-- ================================================================

INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index) VALUES

-- S1-1
('Say Hello',
'Every coder starts here. Print the text: Hello, World!\n\nNo input needed. Just print it.',
'{"js":"// Print Hello, World!\nconsole.log(/* your text here */);","python":"# Print Hello, World!\nprint(# your text here)"}',
'[{"input":"","expected_output":"Hello, World!","is_hidden":false}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','mobile-developer','game-developer'],
ARRAY['functions'], 1),

-- S1-2
('Print Your Name',
'Print a name given as input.\n\nExample:\n  Input: Alex\n  Output: Hello, Alex!',
'{"js":"const name = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\n// print Hello, <name>!","python":"name = input()\n# print Hello, <name>!"}',
'[{"input":"Alex","expected_output":"Hello, Alex!","is_hidden":false},{"input":"Maya","expected_output":"Hello, Maya!","is_hidden":false},{"input":"CodeX","expected_output":"Hello, CodeX!","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','mobile-developer'],
ARRAY['strings','functions'], 2),

-- S1-3
('Add Two Numbers',
'Read two integers and print their sum.\n\nExample:\n  Input: 3 7\n  Output: 10',
'{"js":"const [a,b] = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\n// print a + b","python":"a, b = map(int, input().split())\n# print a + b"}',
'[{"input":"3 7","expected_output":"10","is_hidden":false},{"input":"0 0","expected_output":"0","is_hidden":false},{"input":"-5 5","expected_output":"0","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['math','functions'], 3),

-- S1-4
('Multiply and Divide',
'Read two numbers a and b. Print a*b on the first line and a/b (rounded to 2 decimal places) on the second.\n\nExample:\n  Input: 6 3\n  Output:\n  18\n  2.00',
'{"js":"const [a,b] = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\n// print product then division to 2 decimal places","python":"a, b = map(float, input().split())\n# print product then division to 2 decimal places"}',
'[{"input":"6 3","expected_output":"18\n2.00","is_hidden":false},{"input":"5 2","expected_output":"10\n2.50","is_hidden":false},{"input":"7 4","expected_output":"28\n1.75","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['math','functions'], 4),

-- S1-5
('Swap Two Values',
'Read two integers a and b. Print them swapped.\n\nExample:\n  Input: 4 9\n  Output: 9 4',
'{"js":"const [a,b] = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\n// print b then a","python":"a, b = map(int, input().split())\n# print them swapped"}',
'[{"input":"4 9","expected_output":"9 4","is_hidden":false},{"input":"0 1","expected_output":"1 0","is_hidden":false},{"input":"-3 7","expected_output":"7 -3","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','game-developer','mobile-developer'],
ARRAY['math','functions'], 5),

-- S1-6
('Circle Area',
'Given the radius of a circle, print its area rounded to 2 decimal places. Use π = 3.14159.\n\nExample:\n  Input: 5\n  Output: 78.54',
'{"js":"const r = parseFloat(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// area = π * r * r","python":"import math\nr = float(input())\n# area = math.pi * r * r"}',
'[{"input":"5","expected_output":"78.54","is_hidden":false},{"input":"1","expected_output":"3.14","is_hidden":false},{"input":"10","expected_output":"314.16","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['game-developer','software-engineer','ml-engineer'],
ARRAY['math','functions'], 6),

-- S1-7
('Celsius to Fahrenheit',
'Convert Celsius to Fahrenheit. Formula: F = C × 9/5 + 32. Round to 1 decimal.\n\nExample:\n  Input: 100\n  Output: 212.0',
'{"js":"const c = parseFloat(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// F = C * 9/5 + 32","python":"c = float(input())\n# F = c * 9/5 + 32"}',
'[{"input":"100","expected_output":"212.0","is_hidden":false},{"input":"0","expected_output":"32.0","is_hidden":false},{"input":"37","expected_output":"98.6","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['data-scientist','ml-engineer','software-engineer'],
ARRAY['math','functions'], 7),

-- S1-8
('String Length',
'Print the number of characters in the given string.\n\nExample:\n  Input: hello\n  Output: 5',
'{"js":"const s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\n// print length","python":"s = input()\n# print length"}',
'[{"input":"hello","expected_output":"5","is_hidden":false},{"input":"DreamPath","expected_output":"9","is_hidden":false},{"input":"","expected_output":"0","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','cybersecurity-analyst'],
ARRAY['strings','functions'], 8),

-- S1-9
('Odd or Even',
'Read an integer and print "Even" if it is even, "Odd" if it is odd.\n\nExample:\n  Input: 4\n  Output: Even',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// check odd or even","python":"n = int(input())\n# check odd or even"}',
'[{"input":"4","expected_output":"Even","is_hidden":false},{"input":"7","expected_output":"Odd","is_hidden":false},{"input":"0","expected_output":"Even","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','game-developer','mobile-developer'],
ARRAY['math','functions'], 9),

-- S1-10
('Largest of Three',
'Read three integers and print the largest one.\n\nExample:\n  Input: 4 9 2\n  Output: 9',
'{"js":"const [a,b,c] = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\n// print the largest","python":"a, b, c = map(int, input().split())\n# print the largest"}',
'[{"input":"4 9 2","expected_output":"9","is_hidden":false},{"input":"-1 -5 -2","expected_output":"-1","is_hidden":false},{"input":"7 7 7","expected_output":"7","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','game-developer'],
ARRAY['math','functions'], 10);


-- ================================================================
-- STAGE 2: CONTROL FLOW (Challenges 11–20)
-- "Make decisions and repeat"
-- ================================================================

INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index) VALUES

-- S2-1
('FizzBuzz',
'Print numbers 1 to N.\n- Multiples of 3 → "Fizz"\n- Multiples of 5 → "Buzz"\n- Multiples of both → "FizzBuzz"\n\nExample:\n  Input: 5\n  Output:\n  1\n  2\n  Fizz\n  4\n  Buzz',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nfor (let i = 1; i <= n; i++) {\n  // your logic here\n}","python":"n = int(input())\nfor i in range(1, n + 1):\n    # your logic here\n    pass"}',
'[{"input":"5","expected_output":"1\n2\nFizz\n4\nBuzz","is_hidden":false},{"input":"15","expected_output":"1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz","is_hidden":false}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','devops-engineer','game-developer'],
ARRAY['loops','math'], 11),

-- S2-2
('Count Down',
'Print all numbers from N down to 1, one per line.\n\nExample:\n  Input: 5\n  Output:\n  5\n  4\n  3\n  2\n  1',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// count down from n to 1","python":"n = int(input())\n# count down from n to 1"}',
'[{"input":"5","expected_output":"5\n4\n3\n2\n1","is_hidden":false},{"input":"3","expected_output":"3\n2\n1","is_hidden":false},{"input":"1","expected_output":"1","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','game-developer','mobile-developer'],
ARRAY['loops'], 12),

-- S2-3
('Multiplication Table',
'Print the multiplication table for N (1×N through 10×N).\n\nExample:\n  Input: 3\n  Output:\n  3\n  6\n  9\n  ...\n  30',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nfor (let i = 1; i <= 10; i++) {\n  // print i * n\n}","python":"n = int(input())\nfor i in range(1, 11):\n    # print i * n\n    pass"}',
'[{"input":"3","expected_output":"3\n6\n9\n12\n15\n18\n21\n24\n27\n30","is_hidden":false},{"input":"1","expected_output":"1\n2\n3\n4\n5\n6\n7\n8\n9\n10","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['loops','math'], 13),

-- S2-4
('Grade Calculator',
'Given a score (0–100), print the letter grade:\n  90–100 → A\n  80–89  → B\n  70–79  → C\n  60–69  → D\n  0–59   → F\n\nExample:\n  Input: 85\n  Output: B',
'{"js":"const score = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// determine and print grade","python":"score = int(input())\n# determine and print grade"}',
'[{"input":"85","expected_output":"B","is_hidden":false},{"input":"72","expected_output":"C","is_hidden":false},{"input":"95","expected_output":"A","is_hidden":false},{"input":"55","expected_output":"F","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','mobile-developer'],
ARRAY['functions','math'], 14),

-- S2-5
('Sum of Digits',
'Given a positive integer, print the sum of its digits.\n\nExample:\n  Input: 1234\n  Output: 10',
'{"js":"const n = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\n// sum the digits","python":"n = input().strip()\n# sum the digits"}',
'[{"input":"1234","expected_output":"10","is_hidden":false},{"input":"999","expected_output":"27","is_hidden":false},{"input":"100","expected_output":"1","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','cybersecurity-analyst'],
ARRAY['loops','math','strings'], 15),

-- S2-6
('Star Pattern',
'Print a right triangle of stars with N rows.\n\nExample:\n  Input: 4\n  Output:\n  *\n  **\n  ***\n  ****',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nfor (let i = 1; i <= n; i++) {\n  // print i stars\n}","python":"n = int(input())\nfor i in range(1, n + 1):\n    # print i stars\n    pass"}',
'[{"input":"4","expected_output":"*\n**\n***\n****","is_hidden":false},{"input":"1","expected_output":"*","is_hidden":false},{"input":"6","expected_output":"*\n**\n***\n****\n*****\n******","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['game-developer','ux-engineer','software-engineer'],
ARRAY['loops','strings'], 16),

-- S2-7
('Count Vowels',
'Count the vowels (a,e,i,o,u — case insensitive) in a string.\n\nExample:\n  Input: Hello World\n  Output: 3',
'{"js":"const s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\n// count vowels","python":"s = input()\n# count vowels"}',
'[{"input":"Hello World","expected_output":"3","is_hidden":false},{"input":"aeiou","expected_output":"5","is_hidden":false},{"input":"rhythm","expected_output":"0","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','mobile-developer'],
ARRAY['strings','loops'], 17),

-- S2-8
('Prime Check',
'Print "Prime" if N is a prime number, otherwise "Not Prime".\n\nExample:\n  Input: 7\n  Output: Prime',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\n// check if n is prime","python":"n = int(input())\n# check if n is prime"}',
'[{"input":"7","expected_output":"Prime","is_hidden":false},{"input":"4","expected_output":"Not Prime","is_hidden":false},{"input":"1","expected_output":"Not Prime","is_hidden":true},{"input":"97","expected_output":"Prime","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['cybersecurity-analyst','software-engineer','ml-engineer'],
ARRAY['loops','math'], 18),

-- S2-9
('Number Pyramid',
'Print a number pyramid of N rows where row i contains numbers 1 to i.\n\nExample:\n  Input: 4\n  Output:\n  1\n  1 2\n  1 2 3\n  1 2 3 4',
'{"js":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nfor (let i = 1; i <= n; i++) {\n  // print numbers 1 to i on one line\n}","python":"n = int(input())\nfor i in range(1, n + 1):\n    # print numbers 1 to i on one line\n    pass"}',
'[{"input":"4","expected_output":"1\n1 2\n1 2 3\n1 2 3 4","is_hidden":false},{"input":"2","expected_output":"1\n1 2","is_hidden":false},{"input":"5","expected_output":"1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['game-developer','software-engineer','ux-engineer'],
ARRAY['loops','math'], 19),

-- S2-10
('Collatz Conjecture',
'The Collatz sequence: if N is even → N/2, if odd → 3N+1, repeat until N=1.\nPrint how many steps it takes.\n\nExample:\n  Input: 6\n  Steps: 6→3→10→5→16→8→4→2→1\n  Output: 8',
'{"js":"let n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nlet steps = 0;\n// count steps until n === 1\nconsole.log(steps);","python":"n = int(input())\nsteps = 0\n# count steps until n == 1\nprint(steps)"}',
'[{"input":"6","expected_output":"8","is_hidden":false},{"input":"1","expected_output":"0","is_hidden":false},{"input":"27","expected_output":"111","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','data-scientist'],
ARRAY['loops','math'], 20);


-- ================================================================
-- STAGE 3: FUNCTIONS (Challenges 21–28)
-- "Write code that does one thing well"
-- ================================================================

INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index) VALUES

-- S3-1
('Reverse a String',
'Return a string reversed.\n\nExample:\n  Input: hello\n  Output: olleh',
'{"js":"function reverse(s) {\n  // your code\n}\nconst s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconsole.log(reverse(s));","python":"def reverse(s):\n    # your code\n    pass\nprint(reverse(input()))"}',
'[{"input":"hello","expected_output":"olleh","is_hidden":false},{"input":"racecar","expected_output":"racecar","is_hidden":false},{"input":"OpenAI","expected_output":"IAnepO","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','mobile-developer'],
ARRAY['strings','functions'], 21),

-- S3-2
('Is Palindrome',
'Return true if a string is the same forwards and backwards (ignore case), false otherwise.\n\nExample:\n  Input: Racecar\n  Output: true',
'{"js":"function isPalindrome(s) {\n  // your code\n}\nconst s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconsole.log(isPalindrome(s));","python":"def is_palindrome(s):\n    # your code\n    pass\nprint(str(is_palindrome(input())).lower())"}',
'[{"input":"Racecar","expected_output":"true","is_hidden":false},{"input":"hello","expected_output":"false","is_hidden":false},{"input":"A man a plan a canal Panama","expected_output":"false","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['cybersecurity-analyst','software-engineer','data-scientist'],
ARRAY['strings','functions'], 22),

-- S3-3
('Fibonacci',
'Print first N Fibonacci numbers separated by spaces.\n\nExample:\n  Input: 8\n  Output: 0 1 1 2 3 5 8 13',
'{"js":"function fibonacci(n) {\n  // return array of first n fibonacci numbers\n}\nconst n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nconsole.log(fibonacci(n).join('' ''));","python":"def fibonacci(n):\n    # return list of first n fibonacci numbers\n    pass\nprint('' ''.join(map(str, fibonacci(int(input())))))"}',
'[{"input":"8","expected_output":"0 1 1 2 3 5 8 13","is_hidden":false},{"input":"1","expected_output":"0","is_hidden":false},{"input":"12","expected_output":"0 1 1 2 3 5 8 13 21 34 55 89","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','data-scientist'],
ARRAY['recursion','math','functions'], 23),

-- S3-4
('Factorial',
'Compute N! recursively.\n\nExample:\n  Input: 6\n  Output: 720',
'{"js":"function factorial(n) {\n  // use recursion\n}\nconst n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nconsole.log(factorial(n));","python":"def factorial(n):\n    # use recursion\n    pass\nprint(factorial(int(input())))"}',
'[{"input":"6","expected_output":"720","is_hidden":false},{"input":"0","expected_output":"1","is_hidden":false},{"input":"10","expected_output":"3628800","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','game-developer'],
ARRAY['recursion','math','functions'], 24),

-- S3-5
('Count Words',
'Count how many words are in a sentence (words separated by spaces).\n\nExample:\n  Input: the quick brown fox\n  Output: 4',
'{"js":"function countWords(s) {\n  // your code\n}\nconst s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconsole.log(countWords(s));","python":"def count_words(s):\n    # your code\n    pass\nprint(count_words(input()))"}',
'[{"input":"the quick brown fox","expected_output":"4","is_hidden":false},{"input":"hello","expected_output":"1","is_hidden":false},{"input":"one two three four five","expected_output":"5","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','ux-engineer','data-scientist'],
ARRAY['strings','functions'], 25),

-- S3-6
('Caesar Cipher',
'Shift each letter in the string by K positions (wrap around z→a). Numbers and spaces stay the same.\n\nExample:\n  Input:\n  hello world\n  3\n  Output: khoor zruog',
'{"js":"function caesarCipher(text, k) {\n  // shift each letter by k\n}\nconst lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconsole.log(caesarCipher(lines[0], parseInt(lines[1])));","python":"def caesar_cipher(text, k):\n    # shift each letter by k\n    pass\nimport sys\nlines = sys.stdin.read().strip().split(''\\n'')\nprint(caesar_cipher(lines[0], int(lines[1])))"}',
'[{"input":"hello world\n3","expected_output":"khoor zruog","is_hidden":false},{"input":"abc\n1","expected_output":"bcd","is_hidden":false},{"input":"xyz\n3","expected_output":"abc","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['cybersecurity-analyst','software-engineer','blockchain-developer'],
ARRAY['strings','functions','loops'], 26),

-- S3-7
('Power Function',
'Implement power(base, exp) without using built-in power operators. exp is a non-negative integer.\n\nExample:\n  Input: 2 10\n  Output: 1024',
'{"js":"function power(base, exp) {\n  // no Math.pow!\n}\nconst [b, e] = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\nconsole.log(power(b, e));","python":"def power(base, exp):\n    # no ** operator!\n    pass\nb, e = map(int, input().split())\nprint(power(b, e))"}',
'[{"input":"2 10","expected_output":"1024","is_hidden":false},{"input":"3 0","expected_output":"1","is_hidden":false},{"input":"5 4","expected_output":"625","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','game-developer'],
ARRAY['recursion','math','functions'], 27),

-- S3-8
('Flatten Array',
'Given a nested list (max 2 levels deep) as space-separated groups separated by |, print all numbers flat.\n\nExample:\n  Input: 1 2 | 3 4 | 5\n  Output: 1 2 3 4 5',
'{"js":"function flatten(groups) {\n  // flatten array of arrays\n}\nconst input = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconst groups = input.split('' | '').map(g => g.split('' '').map(Number));\nconsole.log(flatten(groups).join('' ''));","python":"def flatten(groups):\n    # flatten list of lists\n    pass\ngroups = [list(map(int, g.split())) for g in input().split('' | '')]\nprint('' ''.join(map(str, flatten(groups))))"}',
'[{"input":"1 2 | 3 4 | 5","expected_output":"1 2 3 4 5","is_hidden":false},{"input":"10 | 20 30","expected_output":"10 20 30","is_hidden":false},{"input":"1 | 2 | 3 | 4","expected_output":"1 2 3 4","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['arrays','functions','recursion'], 28);


-- ================================================================
-- STAGE 4: DATA STRUCTURES (Challenges 29–36)
-- "Store and access data efficiently"
-- ================================================================

INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index) VALUES

-- S4-1
('Find Maximum',
'Find the maximum value in a list of integers.\n\nExample:\n  Input: 3 1 4 1 5 9 2 6\n  Output: 9',
'{"js":"function findMax(nums) {\n  // your code\n}\nconst nums = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\nconsole.log(findMax(nums));","python":"def find_max(nums):\n    # your code\n    pass\nprint(find_max(list(map(int, input().split()))))"}',
'[{"input":"3 1 4 1 5 9 2 6","expected_output":"9","is_hidden":false},{"input":"-5 -1 -3","expected_output":"-1","is_hidden":false},{"input":"42","expected_output":"42","is_hidden":true}]',
'easy', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['arrays','loops'], 29),

-- S4-2
('Word Frequency',
'Count how many times each word appears. Print word and count sorted alphabetically.\n\nExample:\n  Input: the cat sat on the mat\n  Output:\n  cat 1\n  mat 1\n  on 1\n  sat 1\n  the 2',
'{"js":"const words = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '');\n// count and print sorted","python":"from collections import Counter\nwords = input().split()\nfor word, count in sorted(Counter(words).items()):\n    print(word, count)"}',
'[{"input":"the cat sat on the mat","expected_output":"cat 1\nmat 1\non 1\nsat 1\nthe 2","is_hidden":false},{"input":"hello hello world","expected_output":"hello 2\nworld 1","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['data-scientist','software-engineer','ml-engineer'],
ARRAY['arrays','data-structures','sorting'], 30),

-- S4-3
('Remove Duplicates',
'Remove duplicates from a list, preserving original order.\n\nExample:\n  Input: 1 2 3 2 1 4\n  Output: 1 2 3 4',
'{"js":"function removeDups(nums) {\n  // your code\n}\nconst nums = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\nconsole.log(removeDups(nums).join('' ''));","python":"def remove_dups(nums):\n    # your code\n    pass\nprint('' ''.join(map(str, remove_dups(list(map(int, input().split()))))))"}',
'[{"input":"1 2 3 2 1 4","expected_output":"1 2 3 4","is_hidden":false},{"input":"5 5 5","expected_output":"5","is_hidden":false},{"input":"1 2 3","expected_output":"1 2 3","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['arrays','data-structures'], 31),

-- S4-4
('Valid Parentheses',
'Given a string of brackets ()[]{}. Return "true" if all brackets are correctly matched, "false" otherwise.\n\nExample:\n  Input: ({[]})\n  Output: true',
'{"js":"function isValid(s) {\n  // use a stack\n}\nconst s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconsole.log(isValid(s));","python":"def is_valid(s):\n    # use a stack\n    pass\nprint(str(is_valid(input())).lower())"}',
'[{"input":"({[]})","expected_output":"true","is_hidden":false},{"input":"([)]","expected_output":"false","is_hidden":false},{"input":"{{}}","expected_output":"true","is_hidden":true},{"input":"{","expected_output":"false","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','cybersecurity-analyst','devops-engineer'],
ARRAY['data-structures','arrays','functions'], 32),

-- S4-5
('Two Sum',
'Find two indices whose values sum to target. Print the two 0-based indices.\n\nLine 1: integers\nLine 2: target\n\nExample:\n  Input:\n  2 7 11 15\n  9\n  Output: 0 1',
'{"js":"function twoSum(nums, target) {\n  // use a hashmap for O(n)\n}\nconst lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconsole.log(twoSum(lines[0].split('' '').map(Number), parseInt(lines[1])));","python":"def two_sum(nums, target):\n    # use a dict for O(n)\n    pass\nimport sys; lines = sys.stdin.read().strip().split(''\\n'')\nresult = two_sum(list(map(int,lines[0].split())), int(lines[1]))\nprint(result)"}',
'[{"input":"2 7 11 15\n9","expected_output":"0 1","is_hidden":false},{"input":"3 2 4\n6","expected_output":"1 2","is_hidden":false},{"input":"1 5 3 7\n8","expected_output":"1 3","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','cybersecurity-analyst'],
ARRAY['arrays','data-structures','algorithms'], 33),

-- S4-6
('Reverse Linked List Logic',
'Given space-separated integers representing a linked list, print them in reverse order.\n\nExample:\n  Input: 1 2 3 4 5\n  Output: 5 4 3 2 1',
'{"js":"const nums = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\n// reverse and print","python":"nums = list(map(int, input().split()))\n# reverse and print"}',
'[{"input":"1 2 3 4 5","expected_output":"5 4 3 2 1","is_hidden":false},{"input":"10 20","expected_output":"20 10","is_hidden":false},{"input":"42","expected_output":"42","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','game-developer','mobile-developer'],
ARRAY['data-structures','arrays'], 34),

-- S4-7
('Queue Simulation',
'Simulate a queue with operations. Each line is either "enqueue X" or "dequeue".\nFor dequeue, print the removed value. If queue is empty print "empty".\n\nExample:\n  Input:\n  enqueue 5\n  enqueue 3\n  dequeue\n  dequeue\n  dequeue\n  Output:\n  5\n  3\n  empty',
'{"js":"const lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconst queue = [];\nfor (const line of lines) {\n  // process each operation\n}","python":"import sys\nlines = sys.stdin.read().strip().split(''\\n'')\nqueue = []\nfor line in lines:\n    # process each operation\n    pass"}',
'[{"input":"enqueue 5\nenqueue 3\ndequeue\ndequeue\ndequeue","expected_output":"5\n3\nempty","is_hidden":false},{"input":"dequeue","expected_output":"empty","is_hidden":false}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','devops-engineer','cloud-architect'],
ARRAY['data-structures','arrays'], 35),

-- S4-8
('Group Anagrams',
'Group words that are anagrams of each other. Each group on one line, words sorted alphabetically. Groups sorted by first word.\n\nExample:\n  Input: eat tea tan ate nat bat\n  Output:\n  ate eat tea\n  bat\n  nat tan',
'{"js":"const words = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '');\n// group anagrams","python":"from collections import defaultdict\nwords = input().split()\n# group anagrams"}',
'[{"input":"eat tea tan ate nat bat","expected_output":"ate eat tea\nbat\nnat tan","is_hidden":false},{"input":"abc bca cab xyz","expected_output":"abc bca cab\nxyz","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['data-scientist','software-engineer','ml-engineer'],
ARRAY['data-structures','arrays','sorting'], 36);


-- ================================================================
-- STAGE 5: ALGORITHMS (Challenges 37–44)
-- "Solve it fast"
-- ================================================================

INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index) VALUES

-- S5-1
('Bubble Sort',
'Sort integers using bubble sort. Print the sorted list.\n\nExample:\n  Input: 5 3 8 1 2\n  Output: 1 2 3 5 8',
'{"js":"function bubbleSort(arr) {\n  // implement bubble sort\n  return arr;\n}\nconst arr = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\nconsole.log(bubbleSort(arr).join('' ''));","python":"def bubble_sort(arr):\n    # implement bubble sort\n    return arr\narr = list(map(int, input().split()))\nprint('' ''.join(map(str, bubble_sort(arr))))"}',
'[{"input":"5 3 8 1 2","expected_output":"1 2 3 5 8","is_hidden":false},{"input":"1","expected_output":"1","is_hidden":false},{"input":"9 8 7 6 5 4 3 2 1","expected_output":"1 2 3 4 5 6 7 8 9","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ml-engineer'],
ARRAY['sorting','algorithms','arrays'], 37),

-- S5-2
('Binary Search',
'Find the index of target in a sorted list. Return -1 if not found.\n\nLine 1: sorted integers\nLine 2: target\n\nExample:\n  Input:\n  1 3 5 7 9 11\n  7\n  Output: 3',
'{"js":"function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  // your code\n  return -1;\n}\nconst lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconsole.log(binarySearch(lines[0].split('' '').map(Number), parseInt(lines[1])));","python":"def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    # your code\n    return -1\nimport sys; lines = sys.stdin.read().strip().split(''\\n'')\nprint(binary_search(list(map(int,lines[0].split())), int(lines[1])))"}',
'[{"input":"1 3 5 7 9 11\n7","expected_output":"3","is_hidden":false},{"input":"1 3 5 7 9 11\n6","expected_output":"-1","is_hidden":false},{"input":"2 4 6 8 10\n10","expected_output":"4","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','cybersecurity-analyst'],
ARRAY['algorithms','arrays','data-structures'], 38),

-- S5-3
('Merge Sort',
'Implement merge sort. Print sorted integers.\n\nExample:\n  Input: 38 27 43 3 9 82 10\n  Output: 3 9 10 27 38 43 82',
'{"js":"function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  // divide and conquer\n}\nconst arr = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\nconsole.log(mergeSort(arr).join('' ''));","python":"def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    # divide and conquer\narr = list(map(int, input().split()))\nprint('' ''.join(map(str, merge_sort(arr))))"}',
'[{"input":"38 27 43 3 9 82 10","expected_output":"3 9 10 27 38 43 82","is_hidden":false},{"input":"5 1","expected_output":"1 5","is_hidden":false},{"input":"1 2 3 4 5","expected_output":"1 2 3 4 5","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','data-scientist'],
ARRAY['algorithms','recursion','sorting','arrays'], 39),

-- S5-4
('Longest Common Prefix',
'Find the longest common prefix among space-separated words.\n\nExample:\n  Input: flower flow flight\n  Output: fl',
'{"js":"function longestPrefix(words) {\n  // your code\n}\nconst words = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '');\nconsole.log(longestPrefix(words));","python":"def longest_prefix(words):\n    # your code\n    pass\nprint(longest_prefix(input().split()))"}',
'[{"input":"flower flow flight","expected_output":"fl","is_hidden":false},{"input":"dog racecar car","expected_output":"","is_hidden":false},{"input":"interview inter internet","expected_output":"inter","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','data-scientist','ux-engineer'],
ARRAY['strings','algorithms','loops'], 40),

-- S5-5
('Move Zeros',
'Move all zeros to the end of a list while maintaining relative order of non-zero elements.\n\nExample:\n  Input: 0 1 0 3 12\n  Output: 1 3 12 0 0',
'{"js":"function moveZeros(nums) {\n  // your code\n}\nconst nums = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' '').map(Number);\nconsole.log(moveZeros(nums).join('' ''));","python":"def move_zeros(nums):\n    # your code\n    pass\nprint('' ''.join(map(str, move_zeros(list(map(int, input().split()))))))"}',
'[{"input":"0 1 0 3 12","expected_output":"1 3 12 0 0","is_hidden":false},{"input":"0 0 1","expected_output":"1 0 0","is_hidden":false},{"input":"1 2 3","expected_output":"1 2 3","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','game-developer'],
ARRAY['algorithms','arrays'], 41),

-- S5-6
('Count Islands',
'Given a grid of 1s (land) and 0s (water), count the number of islands (connected groups of 1s).\n\nRows separated by | and cells by spaces.\n\nExample:\n  Input: 1 1 0 | 0 1 0 | 0 0 1\n  Output: 2',
'{"js":"const rows = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split('' | '').map(r => r.split('' '').map(Number));\n// count islands using DFS/BFS","python":"rows = [list(map(int, r.split())) for r in input().split('' | '')]\n# count islands using DFS/BFS"}',
'[{"input":"1 1 0 | 0 1 0 | 0 0 1","expected_output":"2","is_hidden":false},{"input":"1 0 | 0 1","expected_output":"2","is_hidden":false},{"input":"1 1 | 1 1","expected_output":"1","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','cloud-architect'],
ARRAY['algorithms','data-structures','recursion'], 42),

-- S5-7
('Longest Substring Without Repeating',
'Find the length of the longest substring without repeating characters.\n\nExample:\n  Input: abcabcbb\n  Output: 3',
'{"js":"function lengthOfLongest(s) {\n  // sliding window approach\n}\nconst s = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconsole.log(lengthOfLongest(s));","python":"def length_of_longest(s):\n    # sliding window approach\n    pass\nprint(length_of_longest(input()))"}',
'[{"input":"abcabcbb","expected_output":"3","is_hidden":false},{"input":"bbbbb","expected_output":"1","is_hidden":false},{"input":"pwwkew","expected_output":"3","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','cybersecurity-analyst','ml-engineer'],
ARRAY['algorithms','data-structures','strings'], 43),

-- S5-8
('Climbing Stairs',
'You can climb 1 or 2 steps at a time. In how many distinct ways can you reach step N?\n\nExample:\n  Input: 4\n  Output: 5',
'{"js":"function climbStairs(n) {\n  // dynamic programming\n}\nconst n = parseInt(require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim());\nconsole.log(climbStairs(n));","python":"def climb_stairs(n):\n    # dynamic programming\n    pass\nprint(climb_stairs(int(input())))"}',
'[{"input":"4","expected_output":"5","is_hidden":false},{"input":"2","expected_output":"2","is_hidden":false},{"input":"10","expected_output":"89","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','ml-engineer','game-developer'],
ARRAY['algorithms','recursion','math'], 44);


-- ================================================================
-- STAGE 6: REAL WORLD (Challenges 45–50)
-- "Build things that matter"
-- ================================================================

INSERT INTO challenges (title, description, starter_code, test_cases, difficulty, language, career_tags, skill_tags, order_index) VALUES

-- S6-1
('JSON Parser Lite',
'Parse a simple key=value string (comma separated) and print values for given keys.\n\nLine 1: key=value pairs\nLine 2: comma-separated keys to look up\n\nExample:\n  Input:\n  name=Alex,age=17,role=student\n  name,role\n  Output:\n  Alex\n  student',
'{"js":"const lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconst data = {};\nlines[0].split('','').forEach(pair => {\n  const [k, v] = pair.split(''='');\n  data[k] = v;\n});\nlines[1].split('','').forEach(k => console.log(data[k] || ''not found''));","python":"lines = __import__(''sys'').stdin.read().strip().split(''\\n'')\ndata = dict(p.split(''='') for p in lines[0].split('',''))\nfor k in lines[1].split('',''):\n    print(data.get(k, ''not found''))"}',
'[{"input":"name=Alex,age=17,role=student\nname,role","expected_output":"Alex\nstudent","is_hidden":false},{"input":"x=10,y=20\ny,x","expected_output":"20\n10","is_hidden":true}]',
'medium', ARRAY['js','python'],
ARRAY['software-engineer','mobile-developer','devops-engineer'],
ARRAY['strings','data-structures','functions'], 45),

-- S6-2
('Rate Limiter',
'Simulate a rate limiter: max K requests per window of N seconds.\nEach line is a timestamp (integer seconds). Print "allowed" or "blocked".\n\nLine 1: K N (max requests, window size)\nRemaining lines: timestamps\n\nExample:\n  Input:\n  3 10\n  1\n  2\n  3\n  4\n  12\n  Output:\n  allowed\n  allowed\n  allowed\n  blocked\n  allowed',
'{"js":"const lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconst [k, n] = lines[0].split('' '').map(Number);\nconst window = [];\nfor (let i = 1; i < lines.length; i++) {\n  const t = parseInt(lines[i]);\n  // sliding window logic\n}","python":"import sys\nlines = sys.stdin.read().strip().split(''\\n'')\nk, n = map(int, lines[0].split())\nwindow = []\nfor line in lines[1:]:\n    t = int(line)\n    # sliding window logic\n    pass"}',
'[{"input":"3 10\n1\n2\n3\n4\n12","expected_output":"allowed\nallowed\nallowed\nblocked\nallowed","is_hidden":false}]',
'hard', ARRAY['js','python'],
ARRAY['devops-engineer','cybersecurity-analyst','cloud-architect','software-engineer'],
ARRAY['algorithms','data-structures','arrays'], 46),

-- S6-3
('LRU Cache',
'Implement a Least Recently Used cache with capacity C.\nOperations: "set K V" or "get K" (print value or -1 if not found).\n\nExample:\n  Input:\n  2\n  set a 1\n  set b 2\n  get a\n  set c 3\n  get b\n  get a\n  Output:\n  1\n  -1\n  1',
'{"js":"const lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconst cap = parseInt(lines[0]);\nconst cache = new Map();\nfor (let i = 1; i < lines.length; i++) {\n  const parts = lines[i].split('' '');\n  // implement LRU logic\n}","python":"import sys\nfrom collections import OrderedDict\nlines = sys.stdin.read().strip().split(''\\n'')\ncap = int(lines[0])\ncache = OrderedDict()\nfor line in lines[1:]:\n    parts = line.split()\n    # implement LRU logic\n    pass"}',
'[{"input":"2\nset a 1\nset b 2\nget a\nset c 3\nget b\nget a","expected_output":"1\n-1\n1","is_hidden":false}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','devops-engineer','cloud-architect'],
ARRAY['data-structures','algorithms','OOP'], 47),

-- S6-4
('Mini Interpreter',
'Evaluate simple arithmetic expressions with +, -, *, / and integers. No parentheses. Respect operator precedence.\n\nExample:\n  Input: 3 + 5 * 2 - 8 / 4\n  Output: 11',
'{"js":"function evaluate(expr) {\n  // tokenize and evaluate with precedence\n}\nconst expr = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim();\nconsole.log(evaluate(expr));","python":"def evaluate(expr):\n    # use eval carefully, or implement shunting yard\n    pass\nprint(evaluate(input()))"}',
'[{"input":"3 + 5 * 2 - 8 / 4","expected_output":"11","is_hidden":false},{"input":"10 + 2 * 6","expected_output":"22","is_hidden":false},{"input":"100 * 2 + 12","expected_output":"212","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','blockchain-developer','cybersecurity-analyst'],
ARRAY['algorithms','data-structures','strings','functions'], 48),

-- S6-5
('Inventory System',
'Manage a product inventory.\nOperations: "add ITEM QTY", "sell ITEM QTY", "stock ITEM"\n- sell: if not enough stock print "insufficient"\n- stock: print current quantity (0 if not exists)\n\nExample:\n  Input:\n  add apple 10\n  add banana 5\n  sell apple 3\n  stock apple\n  sell banana 10\n  stock banana\n  Output:\n  7\n  insufficient\n  5',
'{"js":"const lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconst inv = {};\nfor (const line of lines) {\n  const [op, item, qty] = line.split('' '');\n  // handle operations\n}","python":"import sys\nlines = sys.stdin.read().strip().split(''\\n'')\ninv = {}\nfor line in lines:\n    parts = line.split()\n    op, item = parts[0], parts[1]\n    # handle operations\n    pass"}',
'[{"input":"add apple 10\nadd banana 5\nsell apple 3\nstock apple\nsell banana 10\nstock banana","expected_output":"7\ninsufficient\n5","is_hidden":false}]',
'hard', ARRAY['js','python'],
ARRAY['software-engineer','mobile-developer','cloud-architect'],
ARRAY['data-structures','OOP','functions'], 49),

-- S6-6
('Task Scheduler',
'Schedule tasks with cooldown: same task cannot run within N intervals.\nPrint the minimum total intervals to finish all tasks.\n\nLine 1: tasks (letters)\nLine 2: cooldown N\n\nExample:\n  Input:\n  AAABBB\n  2\n  Output: 8',
'{"js":"const lines = require(''fs'').readFileSync(''/dev/stdin'',''utf8'').trim().split(''\\n'');\nconst tasks = lines[0].split('''');\nconst n = parseInt(lines[1]);\n// compute minimum intervals","python":"import sys\nfrom collections import Counter\nlines = sys.stdin.read().strip().split(''\\n'')\ntasks = list(lines[0])\nn = int(lines[1])\n# compute minimum intervals"}',
'[{"input":"AAABBB\n2","expected_output":"8","is_hidden":false},{"input":"AAAA\n2","expected_output":"10","is_hidden":false},{"input":"ABCDEF\n2","expected_output":"6","is_hidden":true}]',
'hard', ARRAY['js','python'],
ARRAY['devops-engineer','cloud-architect','software-engineer','ml-engineer'],
ARRAY['algorithms','data-structures','math'], 50);
