# Concept: Shareable configuration

Most commonly shareable configuration is delivered as npm package exporting
an object containing `.rules` as default. To use shared configuration you specify it as item in the `.extends` array:

```js
// commitlint.config.js
module.exports = {
  extends: ['example'] // => @commitlint-config-example
};
```

This causes `commitlint` to pick up `commitlint-config-example`. Make it available by installing it.

```bash
npm install --save-dev commitlint-config-example
```

The rules found in `commitlint-config-example` are merged with the rules in `commitlint.config.js`, if any.

This works recursively, enabling shareable configuration to extend on an indefinite chain of other shareable configurations.

## Special cases

Scoped npm packages are not prefixed.

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-angular'] // => @commitlint/config-angular
};
```

The same is true for relative imports

```js
// commitlint.config.js
module.expors = {
  extends: ['./example'] // => ./example.js
}
```
