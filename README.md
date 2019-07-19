# Test Switcher: There and Back Again

[![version number](https://vsmarketplacebadge.apphb.com/version-short/bmalehorn.test-switcher.svg)](https://marketplace.visualstudio.com/items?itemName=bmalehorn.test-switcher)
[![download count](https://vsmarketplacebadge.apphb.com/downloads-short/bmalehorn.test-switcher.svg)](https://marketplace.visualstudio.com/items?itemName=bmalehorn.test-switcher)

`Shift+Cmd+Y` / `Shift+Ctrl+Y`: Toggle between editing a file and its unit test.

The following formats are supported by default:

| framework               | application file | unit test file         |
| ----------------------- | ---------------- | ---------------------- |
| JavaScript / TypeScript | `*.js` †         | `__tests__/*.test.js`  |
| JavaScript / TypeScript | `*.js` †         | `test/*.test.js`       |
| JavaScript / TypeScript | `*.js` †         | `test/suite/*.test.js` |
| Python                  | `*.py`           | `test/test_*.py`       |
| Go                      | `*.go`           | `*_test.go`            |
| Ruby on Rails           | `app/*/*.rb`     | `spec/*/*_spec.rb`     |

† Also supports `.jsx`, `.ts`, `.tsx`

## Extension Settings

You can add your own formats by editing `test-switcher.rules`.

Here's what it would look like to add Ruby on Rails support:

```json
"test-switcher.rules": [
  { "pattern": "app/(.*)\\.rb", "replacement": "spec/$1_spec.rb" },
  { "pattern": "spec/(.*)_spec\\.rb", "replacement": "app/$1.rb" },
]
```

Effectively, this extension runs `path.replace(new RegExp(pattern), replacement)`. If the source file matches the regex the replaced filename exists, you'll switch to that file. Otherwise, it will try the next rule.

## Release Notes

### 1.4.0

- Python: added language, using `unittest` convention

### 1.3.0

- JavaScript: support `.js` test on `.ts` file

### 1.2.0

- Rails: allow arbitrary depth directories, like `app/a/b/c.rb`
- JavaScript: add `test/suite/*.test.js` support

### 1.1.1

Update README.

### 1.1.0

Add support for `__tests__/*.test.js` directory.

### 1.0.0

Initial release.

## Similar Projects

- [Rails Go to Spec](https://marketplace.visualstudio.com/items?itemName=sporto.rails-go-to-spec)
- [File Switcher](https://marketplace.visualstudio.com/items?itemName=johnathanludwig.fileswitcher)
