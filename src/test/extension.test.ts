import * as assert from "assert";
import { before } from "mocha";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { Rule, match, DEFAULT_RULES } from "../extension";

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {
  before(() => {
    vscode.window.showInformationMessage("Start all tests.");
  });

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

function transitive(path1: string, path2: string) {
  assertIn(path2, allMatches(path1));
  assertIn(path1, allMatches(path2));
}

suite("Ruby", () => {
  test("app/models", () => {
    transitive(
      "/home/brian/sample_app_rails_4/app/models/micropost.rb",
      "/home/brian/sample_app_rails_4/spec/models/micropost_spec.rb",
    );
  });

  test("app/controllers", () => {
    transitive(
      "/home/brian/sample_app_rails_4/app/controllers/relationships_controller.rb",
      "/home/brian/sample_app_rails_4/spec/controllers/relationships_controller_spec.rb",
    );
  });

  test("minitest 1", () => {
    transitive(
      "app/controllers/a/file_controller.rb",
      "test/integration/a/file_controller.rb",
    );
  });

  test("minitest 2", () => {
    transitive("app/lib/dir/file_api.rb", "test/unit/lib/dir/file_api_test.rb");
  });

  test("lib/", () => {
    transitive("lib/file.rb", "spec/lib/file_spec.rb");
  });

  test("rails 6+", () => {
    transitive("app/models/article.rb", "test/models/article_test.rb");
  });
});

suite("Go", () => {
  test("_test.go", () => {
    transitive(
      "/home/brian/kubernetes/pkg/kubectl/cmd/cmd.go",
      "/home/brian/kubernetes/pkg/kubectl/cmd/cmd_test.go",
    );
  });
});

suite("JavaScript / TypeScript", () => {
  test("Mocha", () => {
    transitive(
      "/home/brian/test-switcher/src/extension.ts",
      "/home/brian/test-switcher/src/test/extension.test.ts",
    );
  });

  test("Jest", () => {
    transitive(
      "src/components/foo/bar.tsx",
      "src/components/foo/__tests__/bar.test.tsx",
    );
  });

  test("Jest file tsx <=> test ts", () => {
    transitive("src/__tests__/file.test.ts", "src/file.tsx");
  });

  test("Jest file ts <=> test tsx", () => {
    transitive("src/__tests__/file.test.tsx", "src/file.ts");
  });

  test("Storybook", () => {
    transitive(
      "frontend/src/components/Button.tsx",
      "frontend/src/components/Button.stories.tsx",
    );
  });

  test("new VSCode", () => {
    transitive(
      "/home/brian/test/src/extension.ts",
      "/home/brian/test/src/test/suite/extension.test.ts",
    );
  });

  test("foo.ts <=> test.foo.js", () => {
    transitive("src/worker.ts", "src/__tests__/worker.test.js");
  });

  test("xterm.js", () => {
    transitive("xterm.js/src/Terminal.ts", "xterm.js/src/Terminal.test.ts");
  });
});

suite("Python", () => {
  test("unittest", () => {
    transitive("Lib/base64.py", "Lib/test/test_base64.py");
  });

  test("unittest depth 1", () => {
    transitive(
      "/home/brian/tmp/cpython/Lib/email/headerregistry.py",
      "/home/brian/tmp/cpython/Lib/test/test_email/test_headerregistry.py",
    );
  });

  test("unittest tests directory", () => {
    transitive(
      "/home/brian/tmp/cpython/Lib/lib2to3/pytree.py",
      "/home/brian/tmp/cpython/Lib/lib2to3/tests/test_pytree.py",
    );
  });

  test("parallel test directory depth 0", () => {
    transitive("src/foo.py", "test/test_foo.py");
  });

  test("parallel test directory depth 1", () => {
    transitive("src/bar/foo.py", "test/bar/test_foo.py");
  });
});

suite("misc", () => {
  test("any file extension", () => {
    transitive("cmd.foo", "cmd_test.foo");
  });

  test("directories with '.' in them", () => {
    transitive("/example.com/file.tsx", "/example.com/__tests__/file.test.tsx");
  });

  test("generic *.test.* in the same directory", () => {
    transitive("foo.js", "foo.test.js");
  });

  test("generic *.test.py in the same directory", () => {
    transitive(
      "backend/python/services/fooservice/core_utils.py",
      "backend/python/services/fooservice/core_utils_test.py",
    );
  });
});
