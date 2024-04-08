# Examples

These examples show common usages of how commitlint can be configured.

## Validate for issue/ticket numbers

::: code-group

```jsonc [package.json]
  // ...
  commitlint: {
    "rules": {
      "references-empty": [2, "never"]
    },
    "parserPreset": {
      "parserOpts": {
        "issuePrefixes": ["PROJ-"]
      }
    }
  }
  // ...
```
