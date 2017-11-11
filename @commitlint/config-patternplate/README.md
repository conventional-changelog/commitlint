> Lint your commits, patternplate-style

# @commitlint/config-patternplate
Shareable `commitlint` config enforcing the patternplate commit convention.
Use with [@commitlint/cli](../cli) and [@commitlint/prompt-cli](../prompt-cli).

## Getting started
```sh
npm install --save-dev @commitlint/config-patternplate @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-patternplate']};" > commitlint.config.js
```

## Configuring patterns

Create a `.commitlint-patterns.json` with an array of patterns you want to use in your project:

```json
{
  "patterns": [
    "core",
    "navigation"
  ]
}
```

Commitlint will limit the `scope` to only allow those defined, plus a catch-all "system".

## Rules
`@commitlint/config-patternplate` extends the [shareable angular config](../config-angular#rules).
Additionally these rules apply:

### Problems
The following rules are considered problems for `@commitlint/config-patterplate` and will yield a non-zero exit code when not met.

#### scope-enum
* **description**: `scope` is found in `value`
* **rule**: `always`
* **value**: determined based on pattern tree. `system` and all pattern ids present in `patterns` are allowed

Consult [docs/rules](http://marionebl.github.io/commitlint/#/reference-rules) for a list of available rules.
