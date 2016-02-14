# Shareable configuration

```js
  "extends": ["angular"]
```

Every array item found in `extends` is resolved to `conventional-changelog-lint-config-${name}`. The default main export found there is merged into the configuration with increasing precedence. This works recursively, enabling shareable configuration to extend on an indefinite chain of other shareable configurations.

See the [angular](/marionebl/conventional-changelog-lint-config-angular) shareable configuration as example. This configuration is the default used by `conventional-changelog-lint`.

---
Copyright 2016 by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('../license.md').
