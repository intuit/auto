# Frequently Asked Question

## Cannot read owner and package name from Github URL in package.json?

This means that you do not have a repository set in your package.json. Add something along the line of:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/intuit/auto-release"
  },
  // or simply
  "repository": "intuit/auto-release"
}
```
