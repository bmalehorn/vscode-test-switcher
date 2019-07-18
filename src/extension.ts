"use strict";
import * as vscode from "vscode";
import * as fs from "fs";

export interface Rule {
  pattern: string;
  replacement: string;
}

export const DEFAULT_RULES: Rule[] = [
  // Ruby on Rails
  { pattern: "app/(.*)\\.rb", replacement: "spec/$1_spec.rb" },
  { pattern: "spec/(.*)_spec\\.rb", replacement: "app/$1.rb" },
  // Mocha
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "test/$1.test.$2" },
  { pattern: "test/([^/]+)\\.test\\.([jt]sx?)", replacement: "$1.$2" },
  // Go
  { pattern: "([^/]+)\\.go", replacement: "$1_test.go" },
  { pattern: "([^/]+)_test\\.go", replacement: "$1.go" },
  // Jest
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "__tests__/$1.test.$2" },
  {
    pattern: "__tests__/([^/]+)\\.test\\.([jt]sx?)",
    replacement: "$1.$2",
  },
  // new "yo code"
  {
    pattern: "([^/]+)\\.([tj]sx?)",
    replacement: "test/suite/$1.test.$2",
  },
  {
    pattern: "test/suite/([^/]+)\\.test\\.([tj]sx?)",
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
