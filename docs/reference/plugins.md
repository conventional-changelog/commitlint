# Working with Plugins

Our plugin implementation is based off of [eslint's plugin implementation](https://github.com/eslint/eslint/blob/5018378131fd5190bbccca902c0cf4276ee1581a/lib/config/plugins.js);
Each plugin is an npm module with a name in the format of `commitlint-plugin-<plugin-name>`, such as `commitlint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/commitlint-plugin-<plugin-name>` such as `@jquery/commitlint-plugin-jquery`.

## Rules in Plugins

Plugins can expose additional rules for use in commitlint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

```js
export default {
  rules: {
    "dollar-sign": (parsed, when, value = "$") => {
      const inHeader = (parsed.header ?? "").includes(value);
      const bodyLines = (parsed.body ?? "").split("\n").filter((line) => line.startsWith(value));
      const found = inHeader && bodyLines.length >= 2;
      const negated = when === "never";
      return [
        found !== negated,
        `${value} ${negated ? "must not" : "must"} be in the header and start at least two body lines`,
      ];
    },
  },
};
```

To use the rule, refer to it by its rule ID. commitlint does not add the plugin name to it, so if this plugin were named `commitlint-plugin-myplugin`, the rule would still be `dollar-sign`. Like any other rule, it takes a level, a condition and an optional value. Example: `"rules": {"dollar-sign": [2, "always", "$"]}`.

A rule ID that matches a built-in rule or a rule from another plugin replaces that rule, and plugins later in the `plugins` list win. To avoid clashes, a plugin can export its rules under prefixed keys, for example `"myplugin/dollar-sign": (parsed, when, value) => { /* ... */ }`, and the configuration then uses that exact key.

### Rule implementation

A rule is a function that gets three arguments:

- `parsed`: the parsed commit. It has the fields from the parser's `headerCorrespondence` (`type`, `scope` and `subject` by default) and `header`, `body`, `footer`, `notes`, `references`, `mentions`, `merge`, `revert` and `raw`. `revert` is an object with `header` and `hash` for a revert commit. Fields for parts the parser did not find are `null`, and the lists are empty.
- `when`: the condition from the configuration, `"always"` or `"never"`. It is always set, because commitlint rejects an enabled rule without one. The rule itself decides what `"never"` means, usually the opposite check.
- `value`: the third item of the rule configuration, or `undefined` if it is not set.

It returns `[valid, message]`, or a promise of it. When `valid` is `false`, commitlint reports `message` with the level from the configuration and the rule ID. `message` can be left out, but a failing rule without one is reported as `undefined`. The `RuleImplementation` and `RuleOutcome` types in the [lint API](/api/lint#signature) describe the same contract.

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

In case you want to develop your plugins locally without the need to publish to `npm`, you can declare your plugins inside your project locally.

### Usage Example

::: code-group

```js [commitlint.config.js]
export default {
  rules: {
    "hello-world-rule": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "hello-world-rule": ({ subject }) => {
          const HELLO_WORLD = "Hello World";
          return [
            (subject ?? "").includes(HELLO_WORLD),
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

### Plugin in its own file

An entry in `plugins` that is a string is loaded as an npm package, so a path like `"./plugins/my-plugin.js"` fails with `Cannot find module 'commitlint-plugin-./plugins/my-plugin.js'`. Import the file instead:

::: code-group

```js [commitlint.config.js]
import myPlugin from "./plugins/my-plugin.js";

export default {
  rules: {
    "hello-world-rule": [2, "always"],
  },
  plugins: [myPlugin],
};
```

```js [plugins/my-plugin.js]
export default {
  rules: {
    "hello-world-rule": ({ subject }) => {
      const HELLO_WORLD = "Hello World";
      return [
        (subject ?? "").includes(HELLO_WORLD),
        `Your subject should contain ${HELLO_WORLD} message`,
      ];
    },
  },
};
```

:::

To use rules from more than one file, import each one and list them all:

::: code-group

```js [commitlint.config.js]
import first from "./plugins/first.js";
import second from "./plugins/second.js";

export default {
  plugins: [first, second],
};
```

:::

### JSON and YAML configurations

JSON and YAML can't hold functions. Export the local plugin from a JavaScript file and add that file to [`extends`](/reference/configuration#shareable-configuration):

::: code-group

```js [local-plugins.js]
import myPlugin from "./plugins/my-plugin.js";

export default { plugins: [myPlugin] };
```

```json [.commitlintrc.json]
{
  "extends": ["./local-plugins.js"],
  "rules": { "hello-world-rule": [2, "always"] }
}
```

:::

## Further Reading

- [npm Developer Guide](https://docs.npmjs.com/misc/developers)
