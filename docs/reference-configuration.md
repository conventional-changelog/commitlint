# Configuration

`@commitlint/cli` picks up configuration from `./commitlint.config.js`.

The file is expected

- to contain valid JavaScript
- export a configuration object
- adhere to the schema outlined below

## Config option CLI

Add the path to the configuration file. Example: `commitlint --config commitlint.config.js`

## Configuration object example

### JavaScript

```js
const Configuration = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],
  /*
   * Resolve and load conventional-changelog-atom from node_modules.
   * Referenced packages must be installed
   */
  parserPreset: 'conventional-changelog-atom',
  /*
   * Resolve and load @commitlint/format from node_modules.
   * Referenced package must be installed
   */
  formatter: '@commitlint/format',
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'type-enum': [2, 'always', ['foo']],
  },
  /*
   * Functions that return true if commitlint should ignore the given message.
   */
  ignores: [(commit) => commit === ''],
  /*
   * Whether commitlint uses the default ignore rules.
   */
  defaultIgnores: true,
  /*
   * Custom URL to show upon failure
   */
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  /*
   * Custom prompt configs
   */
  prompt: {
    messages: {},
    questions: {
      type: {
        description: 'please input type:',
      },
    },
  },
};

module.exports = Configuration;
```

### TypeScript

```ts
import type {UserConfig} from '@commitlint/types';
import {RuleConfigSeverity} from '@commitlint/types';

const Configuration: UserConfig = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],
  /*
   * Resolve and load conventional-changelog-atom from node_modules.
   * Referenced packages must be installed
   */
  parserPreset: 'conventional-changelog-atom',
  /*
   * Resolve and load @commitlint/format from node_modules.
   * Referenced package must be installed
   */
  formatter: '@commitlint/format',
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'type-enum': [RuleConfigSeverity.Error, 'always', ['foo']],
  },
  /*
   * Functions that return true if commitlint should ignore the given message.
   */
  ignores: [(commit) => commit === ''],
  /*
   * Whether commitlint uses the default ignore rules.
   */
  defaultIgnores: true,
  /*
   * Custom URL to show upon failure
   */
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  /*
   * Custom prompt configs
   */
  prompt: {
    messages: {},
    questions: {
      type: {
        description: 'please input type:',
      },
    },
  },
};

module.exports = Configuration;
```

## Shareable configuration

Every commitlint configuration can extend other commitlint configurations.
Specify configurations to extend via the `.extends` key, using ids
that can be resolved by the node resolve algorithm.

This means installed npm packages and local files can be used.

- npm

```
npm install --save-dev commitlint-config-lerna @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = {
    extends: [
        'lerna' // prefixed with commitlint-config-*,
        '@commitlint/config-conventional' // scoped packages are not prefixed
    ]
}
```

- local

```js
// commitlint.config.js
module.exports = {
  extends: ['./commitlint.base.js', './commitlint.types.js'],
};
```

```js
// commitlint.types.js, will be picked up by commitlint.config.js
module.exports = {
  rules: {
    'type-enum': [2, 'always', ['foo']],
  },
};
```

```js
// commitlint.base.js, will be picked up by commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'], // extends can be nested
  parserPreset: 'conventional-changelog-atom',
};
```

## Parser presets

The parser preset used to parse commit messages can be configured.
Use ids resolvable by the node resolve algorithm.

This means installed npm packages and local files can be used.

- npm

```
npm install --save-dev conventional-changelog-atom
```

```js
// commitlint.config.js
module.exports = {
  parserPreset: 'conventional-changelog-atom',
};
```

- local

```js
// commitlint.config.js
module.exports = {
  parserPreset: './parser-preset',
};
```

```js
// parser-preset.js
module.exports = {
  parserOpts: {
    headerPattern: /^(\w*)\((\w*)\)-(\w*)\s(.*)$/,
    headerCorrespondence: ['type', 'scope', 'ticket', 'subject'],
  },
};
```

## Formatter

Commitlint can output the issues encountered in different formats, if necessary.
Use ids resolvable by the node resolve algorithm.

```js
module.exports = {
  formatter: '@commitlint/format',
};
```

## Rules

Refer to [Rules](reference-rules.md) for a complete list of available rules.

## Prompt

Config command-line submit interaction, works with `@commitlint/cz-commitlint`.

Refer to [Prompt Config](reference-prompt.md) for details.
