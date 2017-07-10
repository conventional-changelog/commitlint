# Shareable configuration

Every array item found in `extends` is resolved to `commitlint-config-${name}`.

The default main export found there is merged into the configuration with increasing precedence.

This works recursively, enabling shareable configuration to extend on an indefinite chain of other shareable configurations.


```js
// .commitlint.config.js
module.exports = {
  extends: ['example'] // => @commitlint-config-example
};
```

Special cases are scoped extend items those are not prefixed.

```js
// .commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-angular'] // => @commitlint/config-angular
};
```

The same is true for relative imports

```js
// .commitlint
module.expors = {
  extends: ['./example'] // => ./example.js
}
```
