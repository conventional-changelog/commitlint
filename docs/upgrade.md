# Upgrade Guides

## Version 1 to 2

```sh
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

```sh
npm remove --save-dev conventional-changelog-lint
npm install --save commitlint
mv .conventional-changelog-lintrc .commitlintrc
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
