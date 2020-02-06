# Examples

These examples show common usages of how commitlint can be configured.

## Validate for issue/ticket numbers

In your `package.json` add:

```js
  commitlint: {
    'rules': {
      'references-empty': [2, 'never'],
    },
    parserPreset: {
      parserOpts: {
        issuePrefixes: ['PROJ-']
      }
    },
  }
```
