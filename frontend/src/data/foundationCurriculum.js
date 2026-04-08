import { B1_LESSON_MINIMAL } from "./b1LessonMinimal.js";
import { B1_CHALLENGES_ENHANCED, B1_STARTER_PYTHON } from "./b1ChallengeData.js";

export const FOUNDATION_UNITS = [
  {
    id: "b1",
    code: "B1",
    title: "Foundations",
    subtitle: "Variables, input/output, basic math",
    estimated: "~5 min lesson + practice",
  },
  {
    id: "b2",
    code: "B2",
    title: "Control Flow",
    subtitle: "If/else, loops, nested logic",
    estimated: "55 min",
  },
  {
    id: "b3",
    code: "B3",
    title: "Functions",
    subtitle: "Parameters, return values, decomposition",
    estimated: "60 min",
  },
  {
    id: "b4",
    code: "B4",
    title: "Arrays & Strings",
    subtitle: "Lists, iteration patterns, text processing",
    estimated: "65 min",
  },
];

export const FOUNDATION_LESSONS = {
  b1: B1_LESSON_MINIMAL,
};

export const B1_CHALLENGES = B1_CHALLENGES_ENHANCED;

/** Unit project — CLI calculator starters (all languages). */
export const PROJECT_CALCULATOR_STARTERS = {
  Python: `# Simple CLI calculator — finish the checklist on the right
# Read two numbers and an operator (+ - * /), print the result, handle divide-by-zero

def main():
    a = float(input("First number: "))
    op = input("Operator (+ - * /): ").strip()
    b = float(input("Second number: "))
    # TODO: handle each operator and division by zero
    print("Result goes here")

if __name__ == "__main__":
    main()
`,
  "C++": `#include <iostream>
#include <string>
using namespace std;

int main() {
    double a, b;
    string op;
    cout << "First number: ";
    cin >> a;
    cout << "Operator (+ - * /): ";
    cin >> op;
    cout << "Second number: ";
    cin >> b;
    // TODO: switch on op, guard divide-by-zero
    cout << "Result goes here" << endl;
    return 0;
}
`,
  Java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("First number: ");
        double a = sc.nextDouble();
        System.out.print("Operator (+ - * /): ");
        String op = sc.next();
        System.out.print("Second number: ");
        double b = sc.nextDouble();
        // TODO: handle operators and divide-by-zero
        System.out.println("Result goes here");
    }
}
`,
};

export const STARTER_TEMPLATES = {
  Python: {
    ...B1_STARTER_PYTHON,
  },
  "C++": {
    1: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Read two integers and print their sum\n  return 0;\n}\n",
    2: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Celsius to Fahrenheit\n  return 0;\n}\n",
    3: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Odd or Even\n  return 0;\n}\n",
    4: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Average with 1 decimal\n  return 0;\n}\n",
    5: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Swap and print\n  return 0;\n}\n",
  },
  Java: {
    1: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Read two integers and print their sum\n  }\n}\n",
    2: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Celsius to Fahrenheit\n  }\n}\n",
    3: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Odd or Even\n  }\n}\n",
    4: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Average with 1 decimal\n  }\n}\n",
    5: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Swap and print\n  }\n}\n",
  },
};
