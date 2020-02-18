> Lint your conventional commits

# @commitlint/config-conventional

Shareable `commitlint` config enforcing [conventional commits](https://conventionalcommits.org/).
Use with [@commitlint/cli](https://npm.im/@commitlint/cli) and [@commitlint/prompt-cli](https://npm.im/@commitlint/prompt-cli).

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

- **condition**: `type` is found in value
- **rule**: `always`
- **level**: `error`
- **value**

  ```
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
  ];
  ```

```sh
echo "foo: some message" # fails
echo "fix: some message" # passes
```

#### type-case

- **description**: `type` is in case `value`
- **rule**: `always`
- **level**: `error`
- **value**
  ```
  'lowerCase'
  ```

```sh
echo "FIX: some message" # fails
echo "fix: some message" # passes
```

#### type-empty

- **condition**: `type` is empty
- **rule**: `never`
- **level**: `error`

```sh
echo ": some message" # fails
echo "fix: some message" # passes
```

#### scope-case

- **condition**: `scope` is in case `value`
- **rule**: `always`
- **level**: `error`

```
'lowerCase'
```

```sh
echo "fix(SCOPE): some message" # fails
echo "fix(scope): some message" # passes
```

#### subject-case

- **condition**: `subject` is in one of the cases `['sentence-case', 'start-case', 'pascal-case', 'upper-case']`
- **rule**: `never`
- **level**: `error`

```sh
echo "fix(SCOPE): Some message" # fails
echo "fix(SCOPE): Some Message" # fails
echo "fix(SCOPE): SomeMessage" # fails
echo "fix(SCOPE): SOMEMESSAGE" # fails
echo "fix(scope): some message" # passes
echo "fix(scope): some Message" # passes
```

#### subject-empty

- **condition**: `subject` is empty
- **rule**: `never`
- **level**: `error`

```sh
echo "fix:" # fails
echo "fix: some message" # passes
```

#### subject-full-stop

- **condition**: `subject` ends with `value`
- **rule**: `never`
- **level**: `error`
- **value**

```
'.'
```

```sh
echo "fix: some message." # fails
echo "fix: some message" # passes
```

#### header-max-length

- **condition**: `header` has `value` or less characters
- **rule**: `always`
- **level**: `error`
- **value**

```
100
```

```sh
echo "fix: some message that is way too long and breaks the line max-length by several characters" # fails
echo "fix: some message" # passes
```

#### footer-leading-blank

- **condition**: `footer` should have a leading blank line
- **rule**: `always`
- level: `warning`
- **value**

```
100
```

```sh
echo "fix: some message
BREAKING CHANGE: It will be significant" # warning

echo "fix: some message

BREAKING CHANGE: It will be significant" # passes
```

#### footer-max-line-length

- **condition**: `footer` each line has `value` or less characters
- **rule**: `always`
- level: `error`
- **value**

```
100
```

```sh
echo "fix: some message

BREAKING CHANGE: footer with multiple lines
has a message that is way too long and will break the line rule 'line-max-length' by several characters" # fails

echo "fix: some message

BREAKING CHANGE: footer with multiple lines
but still no line is too long" # passes
```

#### body-leading-blank

- **condition**: `body` should have a leading blank line
- **rule**: `always`
- level: `warning`
- **value**

```js
100;
```

```sh
echo "fix: some message
body" # warning

echo "fix: some message

body" # passes
```

#### body-max-line-length

- **condition**: `body` each line has `value` or less characters
- **rule**: `always`
- level: `error`
- **value**

```js
100;
```

```sh
echo "fix: some message

body with multiple lines
has a message that is way too long and will break the line rule 'line-max-length' by several characters" # fails

echo "fix: some message

body with multiple lines
but still no line is too long" # passes
```
