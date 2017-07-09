# Shareable configuration

```js
// .commitlint
{
  "extends": ["example"] // => @commitlint-config-example
}
```

Every array item found in `extends` is resolved to `commitlint-config-${name}`. The default main export found there is merged into the configuration with increasing precedence. This works recursively, enabling shareable configuration to extend on an indefinite chain of other shareable configurations.

Special cases are scoped extend items those are not prefixed.

```js
// .commitlint
{
  "extends": ["@commitlint/config-angular"] // => @commitlint/config-angular
}
```

The same is true for relative imports

```js
// .commitlint
{
  "extends": ["./example"] // => ./example.js
}
```

See the [angular](../@commitlint/config-angular) shareable configuration as example. This configuration is the default used by `commitlint`.
