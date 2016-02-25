> Lint your commits, patternplate-style

# conventional-changelog-lint-config-patternplate
Shareable `conventional-changelog-lint` config enforcing the patternplate commit convention.

## Installation
Fetch it with `npm`
```shell
npm install --save-dev conventional-changelog-lint-config-patternplate conventional-changelog-lint
```


## Usage
Install and use as `conventional-changelog-lint` shareable config.
```js
// .conventional-changelog-lintrc
{
  "extends": ["patternplate"]
}
```

---
⇨ See [conventional-changelog-lint/shareable-config](/marionebl/conventional-changelog-lint/documentation/shareable-config.md) for details

## Rules
`conventional-changelog-lint-config-patternplate` extends the [shareable angular config](/marionebl/conventional-changelog-lint-config-angular#rules). Additionally these rules apply:

### Problems
The following rules are considered problems for `conventional-changelog-lint-config-patterplate` and will yield a non-zero exit code when not met.

#### scope-enum
* **description**: `scope` is found in `value`
* **rule**: `always`
* **value**: determined based on pattern tree. `system` and all pattern ids present in `patterns` are allowed

---
⇨ See [conventional-changelog-lint/shareable-config](/marionebl/conventional-changelog-lint/documentation/rules.md) for available rules

---
Copyright 2016 by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
