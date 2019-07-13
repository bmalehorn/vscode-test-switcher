# Test Switcher: There and Back Again

`Shift+Cmd+Y` / `Shift+Ctrl+Y`: Toggle between editing a file and its unit test.

The following formats are supported by default:

| framework     | application file | unit test file     |
| ------------- | ---------------- | ------------------ |
| Ruby on Rails | `app/*/*.rb`     | `spec/*/*_spec.rb` |
| JavaScript    | `*.js`           | `test/*.test.js`   |
| TypeScript    | `*.ts`           | `test/*.test.ts`   |
| Go            | `*.go`           | `*_test.go`        |

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

### 1.0.0

Initial release.
