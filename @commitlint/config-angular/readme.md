> Lint your commits, angular-style

# commitlint-config-angular
Shareable `commitlint` config enforcing the angular commit convention.

## Installation

```sh
npm install --save-dev @commitlint/config-angular @commitlint/cli
```

## Usage
Install and use as `commitlint` shareable config.

```js
// .commitlintrc
{
  "extends": ["angular"]
}
```

---
⇨ See [commitlint/shareable-config](../../docs/shareable-config.md) for details

## Rules
### Problems

The following rules are considered problems for `@commitlint/config-angular` and will yield a non-zero exit code when not met.

#### type-enum
* **condition**: `type` is found in value
* **rule**: `always`
* **value**

  ```js
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
	]
  ```

#### type-case
* **description**: `type` is in case `value`
* **rule**: `always`
* **value**
  ```js
    'lowerCase'
  ```

#### type-empty
* **condition**: `type` is empty
* **rule**: `never`

#### scope-case
* **condition**: `scope` is in case `value`
* **rule**: `always`
```js
  'lowerCase'
```

#### subject-empty
* **condition**: `subject` is empty
* **rule**: `never`

#### subject-full-stop
* **condition**: `subject` ends with `value`
* **rule**: `never`
* **value**
```js
  '.'
```

#### header-max-length
* **condition**: `header` has `value` or less characters
* **rule**: `always`
* **value**
```js
  72
```

### Warnings
The following rules are considered warnings for `@commitlint/config-angular` and will print warning messages when not met.

#### body-leading-blank
* **condition**: Body begins with blank line
* **rule**: `always`

#### lang
* **condition**: `subject` is of language `value`
* **rule**: `always`
* **value**
```js
  eng
```

---
⇨ See [commitlint/shareable-config](../../docs/rules.md) for available rules
