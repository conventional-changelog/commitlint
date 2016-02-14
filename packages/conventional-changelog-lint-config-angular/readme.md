> Lint your commits, angular-style

# conventional-changelog-lint-config-angular
Shareable `conventional-changelog-lint` config enforcing the angular commit convention.

## Installation
Fetch it with `npm`
```shell
npm install --save-dev conventional-changelog-lint-config-angular conventional-changelog-lint
```


## Usage
Install and use as `conventional-changelog-lint` shareable config.
```js
// .conventional-changelog-lintrc
{
  "extends": ["angular"]
}
```

---
⇨ See [conventional-changelog-lint/shareable-config](/marionebl/conventional-changelog-lint/documentation/shareable-config.md) for details

## Rules
### Problems
The following rules are considered problems for `conventional-changelog-lint-config-angular` and will yield a non-zero exit code when not met.
#### type-enum
* **condition**: `type` is found in value
* **rule**: `always`
* **value**
  ```js
    [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'test',
      'chore',
      'revert'
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
The following rules are considered warnings for `conventional-changelog-lint-config-angular` and will print warning messages when not met.

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

### Wildcards
The following rules identify commits that pass linting by skipping all other rules.

#### merge
* **condition**: `header` matches `pattern`
* **pattern**:
  ```js
    /^(Merge pull request)|(Merge (.*?) into (.*?)$)/
  ```

#### release
* **condition**: `header` matches `pattern`
* **pattern**: `always`
* **pattern**:
  ```js
    /^\\d.\\d.\\d$/
  ```

#### revert
* **condition**: `header` matches `pattern`
* **pattern**: `always`
* **pattern**:
  ```js
    /^revert: (.*)/
  ```

---
⇨ See [conventional-changelog-lint/shareable-config](/marionebl/conventional-changelog-lint/documentation/rules.md) for available rules

---
Copyright 2016 by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
