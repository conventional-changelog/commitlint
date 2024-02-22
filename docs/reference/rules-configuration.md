# Rules configuration

Rules are made up by a name and a configuration array. The configuration array contains:

- **Level** `[0..2]`: `0` disables the rule. For `1` it will be considered a warning for `2` an error.
- **Applicable** `always|never`: `never` inverts the rule.
- **Value**: value to use for this rule.

Rule configurations are either of type `array` residing on a key with the rule's name as key on the rules `object` or of type function returning type `array` or `Promise<array>`. This means all of the following notations are supported.

## Plain array

:::code-group

```js [commitlint.config.js]
export default {
  // ...
  rules: {
    'header-max-length': [0, 'always', 72], // [!code focus]
  },
  // ...
};
```

:::

## Function returning array

:::code-group

```js [commitlint.config.js]
export default {
  // ...
  rules: {
    'header-max-length': () => [0, 'always', 72], // [!code focus]
  },
  // ...
};
```

:::

## Async function returning array

:::code-group

```js [commitlint.config.js]
export default {
  // ...
  rules: {
    'header-max-length': async () => [0, 'always', 72], // [!code focus]
  },
  // ...
};
```

:::
