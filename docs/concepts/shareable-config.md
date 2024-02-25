# Concept: Shareable configuration

Most commonly shareable configuration is delivered as npm package exporting
an object containing `.rules` as default. To use shared configuration you specify it as item in the `.extends` array:

::: code-group

```js [commitlint.config.js]
/**
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['example'], // => commitlint-config-example
};
```

:::

This causes `commitlint` to pick up `commitlint-config-example`.
Make it available by installing it.

```sh
npm install --save-dev commitlint-config-example
```

The rules found in `commitlint-config-example` are merged with the rules in `commitlint.config.js`, if any.

This works recursively, enabling shareable configuration to extend on an indefinite chain of other shareable configurations.

## Relative config

You can also load local configuration by using a relative path to the file.

::: warning
This must always start with a `.` (dot).
:::

::: code-group

```js [commitlint.config.js]
export default {
  extends: ['./example'], // => ./example.js
};
```

:::

## Scoped packages

When using scoped packages you have two options.

You can provide the full path of the package like:

::: code-group

```js [commitlint.config.js]
export default {
  extends: ['@commitlint/config-conventional'], // => @commitlint/config-conventional
};
```

:::

Or just the scope/owner of the package.

> [!TIP]
> Just like "normal" extends listed above, this will add `<scope>/commitlint-config`.

::: code-group

```js [commitlint.config.js]
export default {
  extends: ['@coolcompany'], // => @coolcompany/commitlint-config
};
```

:::

If you don't use the exact `<scope>/commitlint-config` pattern, you have to provide the full name of the package.
