//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
import { Rule, match, DEFAULT_RULES } from "../extension";

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {
  // Defines a Mocha unit test
  test("Something 1", () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});

suite("match", () => {
  test("match basic", () => {
    const rule: Rule = { pattern: "in", replacement: "in-test" };
    assert.equal(match("xxx", rule), undefined);
    assert.equal(match("in", rule), "in-test");
  });

  test("match replacement 1", () => {
    assert.equal(
      match("in", { pattern: "(in)", replacement: "$1.test" }),
      "in.test",
    );
  });

  test("match replacement 2", () => {
    assert.equal(
      match("ab", { pattern: "a(b)", replacement: "$1.test" }),
      "b.test",
    );
  });

  test("match replacement rails", () => {
    assert.equal(
      match("/home/brian/sample_app_rails_4/app/models/micropost.rb", {
        pattern: "app/models/([^/]+)\\.rb",
        replacement: "spec/models/$1_spec.rb",
      }),
      "/home/brian/sample_app_rails_4/spec/models/micropost_spec.rb",
    );
  });

  test("match bad regex", () => {
    assert.equal(match("(", { pattern: "(", replacement: "b.txt" }), undefined);
  });
});

function allMatches(path: string): string[] {
  const out: string[] = [];
  for (const rule of DEFAULT_RULES) {
    const matched = match(path, rule);
    if (matched) {
      out.push(matched);
    }
  }
  return out;
}

function assertIn<T>(e: T, a: T[]) {
  if (!a.includes(e)) {
    throw new assert.AssertionError({
      message: `${JSON.stringify(e)} not in ${JSON.stringify(a)}`,
    });
  }
}

function defaultMatchesTransitive(path1: string, path2: string) {
  assertIn(path2, allMatches(path1));
  assertIn(path1, allMatches(path2));
}

suite("default rules", () => {
  test("Ruby on Rails", () => {
    defaultMatchesTransitive(
      "/home/brian/sample_app_rails_4/app/models/micropost.rb",
      "/home/brian/sample_app_rails_4/spec/models/micropost_spec.rb",
    );
    defaultMatchesTransitive(
      "/home/brian/sample_app_rails_4/app/controllers/relationships_controller.rb",
      "/home/brian/sample_app_rails_4/spec/controllers/relationships_controller_spec.rb",
    );
  });

  test("JavaScript / TypeScript", () => {
    defaultMatchesTransitive(
      "/home/brian/test-switcher/src/extension.ts",
      "/home/brian/test-switcher/src/test/extension.test.ts",
    );
  });

  test("Go", () => {
    defaultMatchesTransitive(
      "/home/brian/kubernetes/pkg/kubectl/cmd/cmd.go",
      "/home/brian/kubernetes/pkg/kubectl/cmd/cmd_test.go",
    );
  });
});
