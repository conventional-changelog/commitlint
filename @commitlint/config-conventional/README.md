# @commitlint/config-conventional

Lint your conventional commits

Shareable `commitlint` config enforcing [conventional commits](https://conventionalcommits.org/).
Use with [@commitlint/cli](https://npm.im/@commitlint/cli) and [@commitlint/prompt-cli](https://npm.im/@commitlint/prompt-cli).

## Getting started

```sh
npm install --save-dev @commitlint/config-conventional @commitlint/cli
echo "export default {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

## Beyond the specification

This config enforces the [Conventional Commits](https://conventionalcommits.org/) convention, plus a few stylistic rules the specification itself does not require.
The stylistic rules are inherited from the [Angular commit convention](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) commitlint originates from:

- `header-max-length`, `body-max-line-length` and `footer-max-line-length` limit lines to 100 characters to keep messages readable in git tooling — body and footer lines containing URLs are exempt
- `type-enum` restricts the type to the list below, while the specification allows any type
- `type-case`, `subject-case` and `subject-full-stop` normalize style: lower-case types, no sentence-case, start-case, pascal-case or upper-case subjects, no trailing full-stop

These rules narrow the specification — they do not conflict with it.
If you prefer the plain specification, override the rules you do not want in your config:

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
```

## Rules

### Problems

The following rules are considered problems for `@commitlint/config-conventional` and will yield a non-zero exit code when not met.

Consult [Rules reference](https://commitlint.js.org/reference/rules) for a list of available rules.

#### type-enum

- **condition**: `type` is found in value
- **rule**: `always`
- **level**: `error`
- **value**

  ```
  [
    'build',
    'chore',
    'ci',
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
- **level**: `warning`

```sh
echo "fix: some message
BREAKING CHANGE: It will be significant" # warning

echo "fix: some message

BREAKING CHANGE: It will be significant" # passes
```

#### footer-max-line-length

- **condition**: `footer` each line has `value` or less characters
- **rule**: `always`
- **level**: `error`
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
- **level**: `warning`

```sh
echo "fix: some message
body" # warning

echo "fix: some message

body" # passes
```

#### body-max-line-length

- **condition**: `body` each line has `value` or less characters
- **rule**: `always`
- **level**: `error`
- **value**

```
100
```

```sh
echo "fix: some message

body with multiple lines
has a message that is way too long and will break the line rule 'line-max-length' by several characters" # fails

echo "fix: some message

body with multiple lines
but still no line is too long" # passes
```
