"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "test-switcher" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "test-switcher.switch",
    doSwitch,
  );

  context.subscriptions.push(disposable);
}

export interface Rule {
  pattern: string;
  replacement: string;
}

const rules: Rule[] = [
  { pattern: "(\\w+)\\.tsx", replacement: "__tests__/$1.test.tsx" },
  { pattern: "app/models/(\\w+)\\.rb", replacement: "spec/models/$1_spec.rb" },
];

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
