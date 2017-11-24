# Upgrade Guides

## validate-commit-msg

The maintainers of [validate-commit-msg](https://github.com/conventional-changelog-archived-repos/validate-commit-msg) have deprecated their package in favor of `commitlint`. 

### Migrating with default settings

The most common `validate-commit-msg` use cases can be recreated with minor changes to your setup.

**Replace validate-commit-msg with commitlint**

```sh
npm remove validate-commit-msg --save-dev
npm install --save-dev @commitlint/cli @commitint/config-conventional
```

**Add a commitmsg run-script to package.json**

```
{
  "scripts": {
    "commitmsg": "commitlint -x @commitlint/config-conventional -e $GIT_PARAMS"
  }
}
```

**Install husky**

```sh
npm install --save-dev husky
```

### Migrating with custom settings

If you used `validate-commit-msg` with custom configuration you might want to customize `commitlint` configuration, too.

**Replace validate-commit-msg with commitlint**

```sh
npm remove validate-commit-msg --save-dev
npm install --save-dev @commitlint/cli @commitint/config-conventional
```

**Add a commitmsg run-script to package.json**

```
{
  "scripts": {
    "commitmsg": "commitlint -e $GIT_PARAMS"
  }
}
```

**Install husky**

```sh
npm install --save-dev husky
```

**Configure commitlint**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Place your rules here
    'scope-enum': [2, 'always', ['a', 'b']] // error if scope is given but not in provided list
  }
}
```

### validate-commit-msg option equivalents

```js
{
  "types": ["a", "b"],              // 'type-enum': [2, 'always', ['a', 'b']]
  "scope": {
    "required": true,               // 'scope-empty': [2, 'never']
    "allowed": ["a", "b"],          // 'scope-enum': [2, 'always', ['a', 'b']]; specify [0] for allowed: ["*"]
    "validate": false,              // 'scope-enum': [0], 'scope-empty': [0]
    "multiple": false               //  multiple scopes are not supported in commitlint
  },
  "warnOnFail": false,              // no equivalent setting in commitlint
  "maxSubjectLength": 100,          // 'header-max-length': [2, 'always', 100]
  "subjectPattern": ".+",           // may be configured via `parser-preset`, contact us
  "subjectPatternErrorMsg": "msg",  // no equivalent setting in commitlint
  "helpMessage": "",                // no equivalent setting in commitlint
  "autoFix": false                  // no equivalent setting in commitlint
}
```

Refer to the [Rules Referece](reference-rules.md) for a list of all avaiable configuration options.

There is also the [#commitlint](https://yargs.slack.com/messages/C7M8XJ4RL/) channel on the DevTools Slack workspace. Join us there and we'll do our best to help you with your migration.


## Version 1 to 2

```bash
npm install --save-dev conventional-changelog-lint@latest
```

### Breaking changes

#### CLI

* None

#### Config

* **wildcards** config is ignored - as of version `2.0.0` the former `.wildcards` configuration is ignored entirely. If your `.conventional-changelog-lintrc`, `commitlint.config.js` or an extended shareable configuration has a `.wildcards` key a warning will be issued.

#### API

* None

## Version 2 to 3

```bash
npm remove --save-dev conventional-changelog-lint
npm install --save commitlint
mv .conventional-changelog-lintrc commitlint.config.js
```

* Rename all calls to `conventional-changelog-lint` to `commitlint`

### Breaking changes

#### CLI

* `conventional-changelog-lint` command now is called `commitlint`
* `commitlint` command now is installed via `@commitlint/cli`
* `.conventional-changelog-lintrc` now is called `commitlint.config.js`
* `commitlint` does not search upwards in the directory structure for config
* `--preset | -p` flag was removed. The `angular` preset is used always.

#### Config

* `.preset` key is removed. The `angular` preset is used always.

#### API

* `getConfiguration(name, settings, seed)` changed to `load(seed)`
* `getMessages(range)` changed to `read(range)`
* `getPreset(name, require)` removed
* `format(report, options)` now only respects `.color` on `options`
* `lint(message, options)` changed to `lint(message, rules)`

## Version 4 to 5

```bash
npm remove --save-dev @commitlint/config-angular
npm install --save @commitlint/cli @commitlint/config-conventional
echo 'module.exports = {extends: ["@commitlint/config-conventional"]};';
```

### Breaking changes

#### Config

* `config-angular` dropped support for the `chore` type, breaking compat with conventional-changelog,
use `config-conventional` instead.
