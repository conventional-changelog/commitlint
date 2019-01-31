> Lint a string against commitlint rules

# @commitlint/lint

## Getting started

```shell
npm install --save @commitlint/lint
```

## Example

```js
const lint = require('@commitlint/lint');

lint('foo: bar', {'type-enum': [1, 'always', ['foo']]})
  .then(report => console.log(report));
  // => { valid: true, errors: [], warnings: [] }

lint('foo: bar', {'type-enum': [1, 'always', ['bar']]})
  .then(report => console.log(report));
  /* =>
    { valid: true,
      errors: [],
      warnings:
      [ { level: 1,
          valid: false,
          name: 'type-enum',
          message: 'type must be one of [bar]' } ] }
  */
```

Consult [docs/api](https://conventional-changelog.github.io/commitlint/#/reference-api) for comprehensive documentation.
