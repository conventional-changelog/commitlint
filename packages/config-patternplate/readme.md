> Lint your commits, patternplate-style

# @commitlint/config-patternplate
Shareable `commitlint` config enforcing the patternplate commit convention.

## Installation
Fetch it with `npm`
```shell
npm install --save-dev @commitlint/config-patternplate @commitlint/cli
```


## Usage
Install and use as `commitlint` shareable config.
```js
// .commitlintrc
{
  "extends": ["patternplate"]
}
```

---
⇨ See [commitlint/shareable-config](/marionebl/commitlint/documentation/shareable-config.md) for details

## Rules
`@commitlint/config-patternplate` extends the [shareable angular config](../config-angular#rules). Additionally these rules apply:

### Problems
The following rules are considered problems for `@commitlint/config-patterplate` and will yield a non-zero exit code when not met.

#### scope-enum
* **description**: `scope` is found in `value`
* **rule**: `always`
* **value**: determined based on pattern tree. `system` and all pattern ids present in `patterns` are allowed

---
⇨ See [commitlint/shareable-config](/marionebl/commitlint/documentation/rules.md) for available rules

---
Copyright by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
