"use strict";
import * as vscode from "vscode";
import * as fs from "fs";

export interface Rule {
  pattern: string;
  replacement: string;
}

export const DEFAULT_RULES: Rule[] = [
  ////////////////////////////////////////////////////////////
  // Ruby on Rails
  ////////////////////////////////////////////////////////////

  { pattern: "app/(.*)\\.rb", replacement: "spec/$1_spec.rb" },
  { pattern: "spec/(.*)_spec\\.rb", replacement: "app/$1.rb" },

  ////////////////////////////////////////////////////////////
  // Go
  ////////////////////////////////////////////////////////////

  { pattern: "([^/]+)\\.([^/.]+)", replacement: "$1_test.$2" },
  { pattern: "([^/]+)_test\\.([^/.]+)", replacement: "$1.$2" },

  ////////////////////////////////////////////////////////////
  // JavaScript
  ////////////////////////////////////////////////////////////

  // *.js => test/*.test.js
  { pattern: "([^/]+)\\.([^/.]+)", replacement: "test/$1.test.$2" },
  { pattern: "([^/]+)\\.([^/.]+)", replacement: "__tests__/$1.test.$2" },
  {
    pattern: "([^/]+)\\.([^/.]+)",
    replacement: "test/suite/$1.test.$2",
  },
  // *.ts => test/*.test.js
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "test/$1.test.js" },
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "__tests__/$1.test.js" },
  {
    pattern: "([^/]+)\\.([jt]sx?)",
    replacement: "test/suite/$1.test.js",
  },
  // *.js => test/*.test.ts
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "test/$1.test.ts" },
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "__tests__/$1.test.ts" },
  {
    pattern: "([^/]+)\\.([jt]sx?)",
    replacement: "test/suite/$1.test.ts",
  },
  // test.ts => file.js
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)",
    replacement: "$2.$3",
  },
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)",
    replacement: "$2.js",
  },
  {
    pattern: "(test|__tests__|test/suite)/([^/]+)\\.test\\.([^/.]+)",
    replacement: "$2.ts",
  },

  ////////////////////////////////////////////////////////////
  // Python
  ////////////////////////////////////////////////////////////

  // Python unittest
  // depth 0
  {
    pattern: "([^/]*)\\.([^/.]+)",
    replacement: "test/test_$1.$2",
  },
  {
    pattern: "test/test_([^/]*)\\.([^/.]+)",
    replacement: "$1.$2",
  },
  // depth 1
  {
    pattern: "([^/]*)/([^/]*)\\.([^/.]+)",
    replacement: "test/test_$1/test_$2.$3",
  },
  {
    pattern: "test/test_([^/]*)/test_([^/]*)\\.([^/.]+)",
    replacement: "$1/$2.$3",
  },
  // depth 0, "tests"
  {
    pattern: "([^/]*)\\.([^/.]+)",
    replacement: "tests/test_$1.$2",
  },
  {
    pattern: "tests/test_([^/]*)\\.([^/.]+)",
    replacement: "$1.$2",
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
