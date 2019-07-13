//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
import { Rule, match } from "../extension";

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {
  // Defines a Mocha unit test
  test("Something 1", function() {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });

  test("match basic", function() {
    const rule: Rule = { pattern: "in", replacement: "in-test" };
    assert.equal(match("xxx", rule), undefined);
    assert.equal(match("in", rule), "in-test");
  });

  test("match replacement 1", function() {
    assert.equal(
      match("in", { pattern: "(in)", replacement: "$1.test" }),
      "in.test",
    );
  });

  test("match replacement 2", function() {
    assert.equal(
      match("ab", { pattern: "a(b)", replacement: "$1.test" }),
      "b.test",
    );
  });

  test("match replacement rails", () => {
    assert.equal(
      match("/home/brian/sample_app_rails_4/app/models/micropost.rb", {
        pattern: "app/models/(\\w+)\\.rb",
        replacement: "spec/models/$1_spec.rb",
      }),
      "/home/brian/sample_app_rails_4/spec/models/micropost_spec.rb",
    );
  });
});
