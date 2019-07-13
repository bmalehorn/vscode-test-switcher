"use strict";
import * as vscode from "vscode";
import * as fs from "fs";

export interface Rule {
  pattern: string;
  replacement: string;
}

export const DEFAULT_RULES: Rule[] = [
  // rails
  { pattern: "app/([^/]+)/([^/]+)\\.rb", replacement: "spec/$1/$2_spec.rb" },
  { pattern: "spec/([^/]+)/([^/]+)_spec\\.rb", replacement: "app/$1/$2.rb" },
  // vscode / js
  { pattern: "([^/]+)\\.([jt]sx?)", replacement: "test/$1.test.$2" },
  { pattern: "test/([^/]+)\\.test\\.([jt]sx?)", replacement: "$1.$2" },
  // { pattern: "([^/]+)\\.tsx", replacement: "__tests__/$1.test.tsx" },
];

const rules = DEFAULT_RULES;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("test-switcher.switch", doSwitch),
  );
}

export function match(path: string, rule: Rule): string | undefined {
  const { pattern, replacement } = rule;
  const regex = new RegExp(pattern);
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
