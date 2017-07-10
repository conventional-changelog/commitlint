> Lint your commits, patternplate-style

# @commitlint/config-patternplate
Shareable `commitlint` config enforcing the patternplate commit convention.

## Getting started
```sh
npm install --save-dev @commitlint/config-patternplate @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-patternplate']};" > .commitlint.config.js
```

## Rules
`@commitlint/config-patternplate` extends the [shareable angular config](../config-angular#rules). Additionally these rules apply:

### Problems
The following rules are considered problems for `@commitlint/config-patterplate` and will yield a non-zero exit code when not met.

#### scope-enum
* **description**: `scope` is found in `value`
* **rule**: `always`
* **value**: determined based on pattern tree. `system` and all pattern ids present in `patterns` are allowed
