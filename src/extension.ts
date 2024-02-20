"use strict";
import * as vscode from "vscode";
import * as fs from "fs";

export interface Rule {
  pattern: string;
  replacement: string;
}

export const DEFAULT_RULES: Rule[] = [
  ////////////////////////////////////////////////////////////
  // Ruby
  ////////////////////////////////////////////////////////////

  // rspec
  { pattern: "app/(.*)\\.rb$", replacement: "spec/$1_spec.rb" },
  { pattern: "spec/(.*)_spec\\.rb$", replacement: "app/$1.rb" },
  // rails 6+
  { pattern: "app/(.*)/([^/]*).rb", replacement: "test/$1/$2_test.rb" },
  { pattern: "test/(.*)/([^/]*)_test.rb", replacement: "app/$1/$2.rb" },
  // minitest
  {
    pattern: "app/controllers/(.*)\\.rb$",
    replacement: "test/integration/$1.rb",
  },
  {
    pattern: "test/integration/(.*)\\.rb$",
    replacement: "app/controllers/$1.rb",
  },
  {
    pattern: "app/(.*)\\.rb$",
    replacement: "test/unit/$1_test.rb",
  },
  {
    pattern: "test/unit/(.*)_test\\.rb$",
    replacement: "app/$1.rb",
  },
  // lib/
  {
    pattern: "lib/(.*)\\.rb$",
    replacement: "spec/lib/$1_spec.rb",
  },
  {
    pattern: "spec/lib/(.*)_spec\\.rb$",
    replacement: "lib/$1.rb",
  },

  ////////////////////////////////////////////////////////////
  // Go
  ////////////////////////////////////////////////////////////

  { pattern: "([^/]+)\\.([^/.]+)$", replacement: "$1_test.$2" },
  { pattern: "([^/]+)_test\\.([^/.]+)$", replacement: "$1.$2" },

  ////////////////////////////////////////////////////////////
  // JavaScript / TypeScript
  ////////////////////////////////////////////////////////////

  //--------------------//

  // *.* => test/*.test.*
  { pattern: "([^/]+)\\.([^/.]+)$", replacement: "test/$1.test.$2" },
  { pattern: "([^/]+)\\.([^/.]+)$", replacement: "__tests__/$1.test.$2" },
  {
    pattern: "([^/]+)\\.([^/.]+)",
    replacement: "test/suite/$1.test.$2",
  },
  // file.ts => file.test.ts
  { pattern: "/([^/]+)\\.([^/.]+)$", replacement: "/$1.test.$2" },
  { pattern: "/([^/]+)\\.test\\.([^/.]+)$", replacement: "/$1.$2" },

  //--------------------//

  // *.* => test/*.test.js
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "test/$1.test.js" },
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "__tests__/$1.test.js" },
  {
    pattern: "([^/]+)\\.([jt]sx?)",
    replacement: "test/suite/$1.test.js",
  },
  // *.* => test/*.test.ts
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "test/$1.test.ts" },
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "__tests__/$1.test.ts" },
  {
    pattern: "([^/]+)\\.([jt]sx?)$",
    replacement: "test/suite/$1.test.ts",
  },
  // *.* => test/*.test.jsx
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "test/$1.test.jsx" },
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "__tests__/$1.test.jsx" },
  {
    pattern: "([^/]+)\\.([jt]sx?)",
    replacement: "test/suite/$1.test.jsx",
  },
  // *.* => test/*.test.tsx
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "test/$1.test.tsx" },
  { pattern: "([^/]+)\\.([jt]sx?)$", replacement: "__tests__/$1.test.tsx" },
  {
    pattern: "([^/]+)\\.([jt]sx?)$",
    replacement: "test/suite/$1.test.tsx",
  },

  //--------------------//

  // test/*.test.* => *.*
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)$",
    replacement: "$2.$3",
  },
  // test/*.test.* => *.js
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)$",
    replacement: "$2.js",
  },
  // test/*.test.* => *.ts
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)$",
    replacement: "$2.ts",
  },
  // test/*.test.* => *.jsx
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)$",
    replacement: "$2.jsx",
  },
  // test/*.test.* => *.tsx
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)$",
    replacement: "$2.tsx",
  },

  // *.* => *.stories.*
  {
    pattern: "/(.*)\\.([^.]+)$",
    replacement: "/$1.stories.$2",
  },
  {
    pattern: "/(.*)\\.stories\\.([^.]+)$",
    replacement: "/$1.$2",
  },

  ////////////////////////////////////////////////////////////
  // Python
  ////////////////////////////////////////////////////////////

  // Python unittest
  // depth 0
  {
    pattern: "([^/]*)\\.([^/.]+)$",
    replacement: "test/test_$1.$2",
  },
  {
    pattern: "test/test_([^/]*)\\.([^/.]+)$",
    replacement: "$1.$2",
  },
  // depth 1
  {
    pattern: "([^/]*)/([^/]*)\\.([^/.]+)$",
    replacement: "test/test_$1/test_$2.$3",
  },
  {
    pattern: "test/test_([^/]*)/test_([^/]*)\\.([^/.]+)$",
    replacement: "$1/$2.$3",
  },
  // depth 0, "tests"
  {
    pattern: "([^/]*)\\.([^/.]+)$",
    replacement: "tests/test_$1.$2",
  },
  {
    pattern: "tests/test_([^/]*)\\.([^/.]+)$",
    replacement: "$1.$2",
  },
  //  parallel test directory, depth 0
  {
    pattern: "src/([^/]*)$",
    replacement: "test/test_$1",
  },
  {
    pattern: "test/test_([^/]*)$",
    replacement: "src/$1",
  },
  //  parallel test directory, depth 1+
  {
    pattern: "src/(([^/]*)/)*([^/]*)$",
    replacement: "test/$1test_$3",
  },
  {
    pattern: "test/(([^/]*)/)test_*([^/]*)$",
    replacement: "src/$1$3",
  },

  ////////////////////////////////////////////////////////////
  // Generic
  ////////////////////////////////////////////////////////////
  // *.* <-> *.test.*
  {
    pattern: "([^/]*)\\.([^/.]*)$",
    replacement: "$1.test.$2",
  },
  {
    pattern: "([^/]*)\\.test\\.([^/.]*)$",
    replacement: "$1.$2",
  },
  {
    pattern: "src/([^/]*)\\.([^/.]*)$",
    replacement: "test/$1.test.$2",
  },
  {
    pattern: "test/([^/]*)\\.test\\.([^/.]*)$",
    replacement: "src/$1.$2",
  },
];

let rules = DEFAULT_RULES;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("test-switcher.switch", doSwitch),
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(updateFromConfig),
  );
  updateFromConfig();
}

function updateFromConfig() {
  const configuration = vscode.workspace.getConfiguration("test-switcher");
  const extraRules: Rule[] = configuration.get("rules") || [];
  rules = [...extraRules, ...DEFAULT_RULES];
}

export function match(path: string, rule: Rule): string | undefined {
  const { pattern, replacement } = rule;
  let regex: RegExp;
  try {
    regex = new RegExp(pattern);
  } catch {
    return;
  }
  if (!path.match(regex)) {
    return;
  }
  const replaced = path.replace(regex, replacement);
  return replaced;
}

async function doSwitch() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const fileName = editor.document.fileName;
  for (const rule of rules) {
    const related = match(fileName, rule);
    if (related && fs.existsSync(related)) {
      const document = await vscode.workspace.openTextDocument(related);
      await vscode.window.showTextDocument(document);
      return;
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
