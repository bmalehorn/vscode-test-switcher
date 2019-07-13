# Test Switcher: There and Back Again

`Shift+Cmd+Y` / `Shift+Ctrl+Y`: Toggle between editing a file and its unit test.

The following formats are supported by default:

| framework     | application file | unit test file        |
| ------------- | ---------------- | --------------------- |
| Ruby on Rails | `app/*/*.rb`     | `spec/*/*_spec.rb`    |
| Go            | `*.go`           | `*_test.go`           |
| JavaScript    | `*.js`           | `test/*.test.js`      |
| JavaScript    | `*.js`           | `__tests__/*.test.js` |

## Extension Settings

You can add your own formats by editing `test-switcher.rules`.

Here's what it would look like to add Ruby on Rails support:

```json
"test-switcher.rules": [
  {
    "pattern": "app/([^/]+)/([^/]+)\\.rb",
    "replacement": "spec/$1/$2_spec.rb"
  },
  {
    "pattern": "spec/([^/]+)/([^/]+)_spec\\.rb",
    "replacement": "app/$1/$2.rb"
  }
]
```

Effectively, this extension runs `path.replace(new RegExp(pattern), replacement)`. If the source file matches the regex the replaced filename exists, you'll switch to that file. Otherwise, it will try the next rule.

## Release Notes

### 1.1.0

Add support for `__tests__/*.test.js` directory.

### 1.0.0

Initial release.
