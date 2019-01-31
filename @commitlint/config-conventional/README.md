> Lint your conventional commits

# @commitlint/config-conventional

Shareable `commitlint` config enforcing [conventional commits](https://conventionalcommits.org/).
Use with [@commitlint/cli](https://npm.im/@commitlint/cli) and [@commitlint/prompt-cli](https://npm.im/@commitlint/prompt-cli).

| :warning: |  |
|:-------:|--|
| **IMPORTANT** | This is a direct replacement for [@commitlint/config-angular](https://npm.im/@commitlint/config-angular) prior to version 4. `config-angular` diverged from the conventional commit convention as of version 5. See [#146](https://github.com/conventional-changelog/commitlint/issues/146) for details.  |

## Getting started

```sh
npm install --save-dev @commitlint/config-conventional @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

## Rules
### Problems

The following rules are considered problems for `@commitlint/config-conventional` and will yield a non-zero exit code when not met.

Consult [docs/rules](https://conventional-changelog.github.io/commitlint/#/reference-rules) for a list of available rules.


#### type-enum
* **condition**: `type` is found in value
* **rule**: `always`
* **value**

  ```js
  [
    'build',
    'ci',
    'chore',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'revert',
    'style',
    'test'
  ]
  ```

```sh
echo "foo: some message" # fails
echo "fix: some message" # passes
```

#### type-case
* **description**: `type` is in case `value`
* **rule**: `always`
* **value**
  ```js
    'lowerCase'
  ```

```sh
echo "FIX: some message" # fails
echo "fix: some message" # passes
```

#### type-empty
* **condition**: `type` is empty
* **rule**: `never`

```sh
echo ": some message" # fails
echo "fix: some message" # passes
```

#### scope-case
* **condition**: `scope` is in case `value`
* **rule**: `always`
```js
  'lowerCase'
```

```sh
echo "fix(SCOPE): some message" # fails
echo "fix(scope): some message" # passes
```

#### subject-case
* **condition**: `subject` is in one of the cases `['sentence-case', 'start-case', 'pascal-case', 'upper-case']`
* **rule**: `never`

```sh
echo "fix(SCOPE): Some message" # fails
echo "fix(SCOPE): Some Message" # fails
echo "fix(SCOPE): SomeMessage" # fails
echo "fix(SCOPE): SOMEMESSAGE" # fails
echo "fix(scope): some message" # passes
echo "fix(scope): some Message" # passes
```

#### subject-empty
* **condition**: `subject` is empty
* **rule**: `never`

```sh
echo "fix:" # fails
echo "fix: some message" # passes
```

#### subject-full-stop
* **condition**: `subject` ends with `value`
* **rule**: `never`
* **value**
```js
  '.'
```

```sh
echo "fix: some message." # fails
echo "fix: some message" # passes
```


#### header-max-length
* **condition**: `header` has `value` or less characters
* **rule**: `always`
* **value**
```js
  72
```

```sh
echo "fix: some message that is way too long and breaks the line max-length by several characters" # fails
echo "fix: some message" # passes
```
