# @commitlint/config-angular

Lint your commits, angular-style

Shareable `commitlint` config enforcing the [Angular commit convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).
Use with [@commitlint/cli](../cli) and [@commitlint/prompt-cli](../prompt-cli).

## Getting started

```sh
npm install --save-dev @commitlint/config-angular @commitlint/cli
echo "export default {extends: ['@commitlint/config-angular']};" > commitlint.config.js
```

## Rules

### Problems

The following rules are considered problems for `@commitlint/config-angular` and will yield a non-zero exit code when not met.
Consult [Rules reference](https://commitlint.js.org/reference/rules) for a list of available rules.

#### type-enum

- **condition**: `type` is found in value
- **rule**: `always`
- **value**

  ```
  [
    'build',
    'ci',
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

- **description**: `type` is in case `value`
- **rule**: `always`
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

```sh
echo ": some message" # fails
echo "fix: some message" # passes
```

#### scope-case

- **condition**: `scope` is in case `value`
- **rule**: `always`

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

```sh
echo "fix:" # fails
echo "fix: some message" # passes
```

#### subject-full-stop

- **condition**: `subject` ends with `value`
- **rule**: `never`
- **value**

```
'.'
```

```sh
echo "fix: some message." # fails
echo "fix: some message" # passes
```

#### subject-exclamation-mark

- **condition**: `subject` must not have a `!` before the `:` marker
- **rule**: `never`

The [angular commit
convention](hhttps://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
does not use a `!` to define a breaking change in the commit subject. If you
want to use this feature please consider using the [conventional commit
config](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#commitlintconfig-conventional).

#### header-max-length

- **condition**: `header` has `value` or less characters
- **rule**: `always`
- **value**

```
72
```

```sh
echo "fix: some message that is way too long and breaks the line max-length by several characters" # fails
echo "fix: some message" # passes
```

### Warnings

The following rules are considered warnings for `@commitlint/config-angular` and will print warning messages when not met.

#### body-leading-blank

- **condition**: Body begins with blank line
- **rule**: `always`
