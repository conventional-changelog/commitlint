# Configuration

## Config via file

`@commitlint/cli` picks up configuration from the following files:

- `.commitlintrc`
- `.commitlintrc.json`
- `.commitlintrc.yaml`
- `.commitlintrc.yml`
- `.commitlintrc.js`
- `.commitlintrc.cjs`
- `.commitlintrc.mjs`
- `.commitlintrc.ts`
- `.commitlintrc.cts`
- `.commitlintrc.mts`
- `commitlint.config.js`
- `commitlint.config.cjs`
- `commitlint.config.mjs`
- `commitlint.config.ts`
- `commitlint.config.cts`
- `commitlint.config.mts`

The file is expected

- to contain valid JavaScript / TypeScript
- export a configuration object
- adhere to the schema outlined below

Configuration files are resolved using [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig).

## Config via `package.json`

You can add a `commitlint` field in `package.json` (or [`package.yaml`](https://github.com/pnpm/pnpm/pull/1799)) with an object that follows the below structure.

## Config option CLI

Add the path to the configuration file. Example: `commitlint --config commitlint.config.js`

## Configuration object example

```js
const Configuration = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ["@commitlint/config-conventional"],
  /*
   * Resolve and load conventional-changelog-atom from node_modules.
   * Referenced packages must be installed
   */
  parserPreset: "conventional-changelog-atom",
  /*
   * Resolve and load @commitlint/format from node_modules.
   * Referenced package must be installed
   */
  formatter: "@commitlint/format",
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    "type-enum": [2, "always", ["foo"]],
  },
  /*
   * Array of functions that return true if commitlint should ignore the given message.
   * Given array is merged with predefined functions, which consist of matchers like:
   *
   * - 'Merge pull request', 'Merge X into Y' or 'Merge branch X'
   * - 'Revert X'
   * - 'v1.2.3' (ie semver matcher)
   * - 'Automatic merge X' or 'Auto-merged X into Y'
   *
   * To see full list, check https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/is-ignored/src/defaults.ts.
   * To disable those ignores and run rules always, set `defaultIgnores: false` as shown below.
   */
  ignores: [(commit) => commit === ""],
  /*
   * Whether commitlint uses the default ignore rules, see the description above.
   */
  defaultIgnores: true,
  /*
   * Custom URL to show upon failure
   */
  helpUrl:
    "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
  /*
   * Custom prompt configs
   */
  prompt: {
    messages: {},
    questions: {
      type: {
        description: "please input type:",
      },
    },
  },
};

export default Configuration;
```

> [!NOTE]
> CJS format is supported as well:
>
> ```js
> module.exports = Configuration;
> ```

### TypeScript configuration

Configuration can also be a TypeScript file.

Relevant types and enums can be imported from `@commitlint/types`.

Below you can see main changes from a standard js file:

```ts
import type { UserConfig } from "@commitlint/types"; // [!code focus]
import { RuleConfigSeverity } from "@commitlint/types"; // [!code focus]

const Configuration: UserConfig = {
  // [!code focus]
  extends: ["@commitlint/config-conventional"],
  parserPreset: "conventional-changelog-atom",
  formatter: "@commitlint/format",
  rules: {
    "type-enum": [RuleConfigSeverity.Error, "always", ["foo"]], // [!code focus]
  },
  // ...
};

export default Configuration;
```

## Shareable configuration

Every commitlint configuration can extend other commitlint configurations.
Specify configurations to extend via the `.extends` key, using ids
that can be resolved by the node resolve algorithm.

This means installed npm packages and local files can be used.

:::tabs
== npm

```sh
npm install --save-dev commitlint-config-lerna @commitlint/config-conventional
```

::: code-group

```js [commitlint.config.js]
export default {
  extends: [
    'lerna' // prefixed with commitlint-config-*,
    '@commitlint/config-conventional' // scoped packages are not prefixed
  ]
}
```

== local

::: code-group

```js [commitlint.config.js]
export default {
  extends: ["./commitlint.base.js", "./commitlint.types.js"],
};
```

```js [commitlint.types.js]
// will be picked up by commitlint.config.js
export default {
  rules: {
    "type-enum": [2, "always", ["foo"]],
  },
};
```

```js [commitlint.base.js]
// will be picked up by commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"], // extends can be nested
  parserPreset: "conventional-changelog-atom",
};
```

:::

More information can be found in the [Concepts – shareable config section](/concepts/shareable-config).

## Parser presets

The parser preset controls how commit messages are parsed into their component parts (type, scope, subject, body, footer, etc.). By default, commitlint does not ship with a parser preset — it falls back to [`conventional-changelog-angular`](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) defaults. When you extend `@commitlint/config-conventional`, the [`conventional-changelog-conventionalcommits`](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits) preset is applied, which follows the [Conventional Commits specification](https://www.conventionalcommits.org/).

You can override the parser preset using the `parserPreset` property. It accepts:

- A **string** referencing an npm package or local file (resolved via Node's module resolution)
- An **object** with a `parserOpts` property for inline configuration

### Using an npm package

```sh
npm install --save-dev conventional-changelog-atom
```

::: code-group

```js [commitlint.config.js]
export default {
  parserPreset: "conventional-changelog-atom",
};
```

:::

### Using a local file

::: code-group

```js [commitlint.config.js]
export default {
  parserPreset: "./parser-preset",
};
```

```js [parser-preset.js]
export default {
  parserOpts: {
    headerPattern: /^(\w*)\((\w*)\)-(\w*)\s(.*)$/,
    headerCorrespondence: ["type", "scope", "ticket", "subject"],
  },
};
```

:::

### Inline `parserOpts`

You can also pass `parserOpts` directly without a separate file. This is useful for small adjustments like custom issue prefixes:

::: code-group

```js [commitlint.config.js]
export default {
  parserPreset: {
    parserOpts: {
      issuePrefixes: ["PROJ-", "JIRA-"],
    },
  },
};
```

:::

### Common `parserOpts`

The parser is powered by [`conventional-commits-parser`](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser). Common options include:

| Option                  | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `headerPattern`         | Regex to match the commit header (type, scope, subject)              |
| `headerCorrespondence`  | Array of field names matching the capture groups in headerPattern    |
| `issuePrefixes`         | Prefixes to match issue references (e.g. `["#", "PROJ-"]`)           |
| `noteKeywords`          | Keywords that mark footer notes (e.g. `["BREAKING CHANGE"]`)         |
| `breakingHeaderPattern` | Regex to detect breaking changes in the header (e.g. the `!` marker) |

For the complete list of options, see the [`conventional-commits-parser` documentation](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#options).

### `presetConfig`

When using a preset like `conventional-changelog-conventionalcommits`, you can pass a `presetConfig` object to customize the preset's behavior without replacing the entire parser configuration. This is commonly used to set commit types that appear in generated changelogs:

::: code-group

```js [commitlint.config.js]
export default {
  parserPreset: {
    name: "conventional-changelog-conventionalcommits",
    presetConfig: {
      types: [
        { type: "feat", section: "Features" },
        { type: "fix", section: "Bug Fixes" },
        { type: "docs", section: "Documentation", hidden: false },
        { type: "chore", hidden: true },
      ],
    },
  },
};
```

:::

The available `presetConfig` options depend on the preset you are using. See the [`conventional-changelog-conventionalcommits` documentation](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits#preset-configuration) for details.

### Usage with semantic-release

If you use [semantic-release](https://github.com/semantic-release/semantic-release), both commitlint and semantic-release can share the same `conventional-changelog-conventionalcommits` preset. Keeping `parserOpts` and `presetConfig` consistent across both tools ensures that commits parsed during linting match what semantic-release uses for versioning and changelog generation:

::: code-group

```js [commitlint.config.js]
export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    name: "conventional-changelog-conventionalcommits",
    presetConfig: {
      types: [
        { type: "feat", section: "Features" },
        { type: "fix", section: "Bug Fixes" },
        { type: "docs", section: "Documentation", hidden: false },
      ],
    },
  },
};
```

:::

```js [.releaserc.js]
export default {
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "docs", section: "Documentation", hidden: false },
          ],
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "docs", section: "Documentation", hidden: false },
          ],
        },
      },
    ],
  ],
};
```

## Formatter

Commitlint can output the issues encountered in different formats, if necessary.
Use ids resolvable by the node resolve algorithm.

```js
export default {
  formatter: "@commitlint/format",
};
```

## Rules

Refer to [Rules](/reference/rules.md) for a complete list of available rules.

## Prompt

Config command-line submit interaction, works with `@commitlint/cz-commitlint`.

Refer to [Prompt Config](/reference/prompt.md) for details.
