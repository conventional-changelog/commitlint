> Lint commit messages against your conventional-changelog ruleset and preset

# conventional-changelog-lint

Lint your commit messages against defined rulesets.
`conventional-changelog-lint` plays nice with `conventional-changelog`
 and takes cues from `eslint`, e.g. shareable configurations.

## Installation

Fetch it with `npm`

```shell
npm install --save-dev conventional-changelog-lint
```

## Usage

`conventional-changelog-lint` provides a command line and node interface.

### CLI

![conventional-changelog-lint demo](https://git.io/v2iTI)

The command line interface reads `.conventional-changelog-lintrc`
resolves `extends` configurations.

```shell
❯ conventional-changelog-lint --help
  conventional-changelog-lint@0.1.0 - Lint commit messages against a conventional-changelog preset and ruleset

  [input] reads from stdin if --edit, --from, --to are omitted
  --color,-c    toggle formatted output, defaults to: true
  --edit,-e     read last commit message found in ./git/COMMIT_EDITMSG
  --extends,-x  array of shareable configurations to extend
  --from,-f     lower end of the commit range to lint; applies if edit=false
  --preset,-p   conventional-changelog-preset to use for commit message parsing, defaults to: angular
  --to,-t       upper end of the commit range to lint; applies if edit=false
  --quiet,-q    toggle console output

```

### API

The programming interface does not read configuration by default,
it has to be provided as second parameter.

```js
import lint from 'conventional-changelog-lint';
const report = lint(
  'docs: add node api interface usage',
  {
    preset: {},
    configuration: {}
  }
);
```

To achieve the same behavior as with the command line interface
you can use the provided utility functions:

```js
import lint from 'conventional-changelog-lint';
import {
  getPreset,
  getConfiguration
} from 'conventional-changelog-lint';

const report = lint(
  'docs: add node api interface usage',
  {
    preset: await getPreset('angular'),
    configuration: await readConfiguration('conventional-changelog-lint')
  }
);
```

### Recipes

*   As a git `commitmsg` hook with husky

```json
  {
    "scripts": {
      "commitmsg": "conventional-changelog-lint -e"
    }
  }
```

*   As part of `npm test`

```json
  {
    "scripts": {
      "test": "conventional-changelog --from=HEAD~1"
    }
  }
```

## Configuration

`conventional-changelog-lint` allows detailed configuration via
`.conventional-changelog-lintrc` and shareable configuration.
By default it will use the
[angular](https://github.com/marionebl/conventional-changelog-lint-config-angular#rules)
shareable config.
See the documentation there for default rules.

### extends

```js
{
  "extends": ["angular"]
}
```

Array of shareable configurations to extend.
Configurations are resolved as `conventional-changelog-lint-config-${name}`
and have to be installed.
See [npm search](https://www.npmjs.com/search?q=conventional-changelog-lint-config)
for available shareable configurations.

---

⇨ See [shareable-config](./documentation/shareable-config.md) for details

### preset

```js
{
  "preset": "angular"
}
```

`conventional-changelog` preset name to use for parsing of commit messages.

---

⇨ See [conventional-changelog](https://github.com/ajoslin/conventional-changelog#preset)
for details

### rules

```js
{
  "rules": {
    "body-leading-blank": [1, "always"],
    "header-max-length": [1, "always", 72],
    "subject-full-stop": [1, "never", "."]
  }
}
```
Rules applicable to the linted commit messages.
By default all rules are disabled via a level of 0.
They can be enabled by shareable configuration,
such as the
[angular config](https://github.com/marionebl/conventional-changelog-lint-config-angular),
which is loaded by default.

---

⇨ See [rules](./documentation/rules.md) for details

### wildcards

Patterns to exclude from linting

```js
wildcards: {
  merge: [
    '/^(Merge pull request)|(Merge (.*?) into (.*?)$)/'
  ],
  release: [
    '/^\\d.\\d.\\d$/'
  ],
  revert: [
    '/^revert: (.*)/'
  ]
}
```

---

Copyright 2016 by [Mario Nebl](https://github.com/marionebl)
and [contributors](./graphs/contributors).
Released under the [MIT license]('./license.md').
