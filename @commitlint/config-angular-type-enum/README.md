# @commitlint/config-angular-type-enum

Shareable `commitlint` config enforcing the angular commit convention types.
Use with [@commitlint/cli](../cli) and [@commitlint/prompt-cli](../prompt-cli).

See [@commitlint/config-angular](../config-angular) for full angular conventions.

## Getting started

```sh
npm install --save-dev @commitlint/config-angular-type-enum @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-angular-type-enum']};" > commitlint.config.js
```

## Usage

```sh
echo "foo: bar" | commitlint # fails
echo "build: bar" | commitlint # passes
```

## Examples

```js
// commitlint.config.js
const types = require('@commitlint/config-angular-type-enum');

// Use as rule creating errors for non-allowed types
module.exports = {
  rules: {
    ...types.rules,
  },
};

// Warn for non-allowed types
module.exports = {
  rules: {
    'type-enum': [1, 'always', types.values()],
  },
};
```
