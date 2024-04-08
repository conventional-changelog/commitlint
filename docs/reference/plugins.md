# Working with Plugins

Our plugin implementation is based off of [eslint's plugin implementation](https://github.com/eslint/eslint/blob/5018378131fd5190bbccca902c0cf4276ee1581a/lib/config/plugins.js);
Each plugin is an npm module with a name in the format of `commitlint-plugin-<plugin-name>`, such as `commitlint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/commitlint-plugin-<plugin-name>` such as `@jquery/commitlint-plugin-jquery`.

## Rules in Plugins

Plugins can expose additional rules for use in commitlint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

```js
export default {
  rules: {
    'dollar-sign': function (parsed, when, value) {
      // rule implementation ...
    },
  },
};
```

To use the rule in commitlint, you would use the unprefixed plugin name, followed by a slash, followed by the rule name. So if this plugin were named `commitlint-plugin-myplugin`, then in your configuration you'd refer to the rule by the name `myplugin/dollar-sign`. Example: `"rules": {"myplugin/dollar-sign": 2}`.

## Peer Dependency

To make clear that the plugin requires commitlint to work correctly you have to declare commitlint as a `peerDependency` in your `package.json`.
The plugin support was introduced in commitlint version `7.6.0`. Ensure the `peerDependency` points to @commitlint `7.6.0` or later.

```json
{
  "peerDependencies": {
    "@commitlint/lint": ">=7.6.0"
  }
}
```

## Share Plugins

In order to make your plugin available to the community you have to publish it on npm.

Recommended keywords:

- `commitlint`
- `commitlintplugin`

Add these keywords into your `package.json` file to make it easy for others to find.

## Local Plugins

In case you want to develop your plugins locally without the need to publish to `npm`, you can send declare your plugins inside your project locally. Please be aware that you can declare **only one** local plugin.

### Usage Example

::: code-group

```js [commitlint.config.js]
export default {
  rules: {
    'hello-world-rule': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'hello-world-rule': ({subject}) => {
          const HELLO_WORLD = 'Hello World';
          return [
            subject.includes(HELLO_WORLD),
            `Your subject should contain ${HELLO_WORLD} message`,
          ];
        },
      },
    },
  ],
};
```

:::

```bash
> echo "feat: random subject" | commitlint # fails
> echo "feat: Hello World" | commitlint # passes
```

## Further Reading

- [npm Developer Guide](https://docs.npmjs.com/misc/developers)
