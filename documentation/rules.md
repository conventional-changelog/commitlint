# Rules
```js
  "rules": {
    "header-max-length": [0, "always", 72],
    // name: [level, applicable, value]
  }
```
Rules are made up by a name and a configuration array. The configuration array contains:
* **Level** `[0..2]`: `0` disables the rule. For `1` it will be considered a warning for `2` an error.
* **Applicable** `always|never`: `never` inverts the rule.
* **Value**: value to use for this rule.

### Available rules
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

#### type-max-length
* **condition**: `type` has `value` or less characters
* **rule**: `always`
* **value**
```js
  Infinity
```

#### type-min-length
* **condition**: `type` has `value` or more characters
* **rule**: `always`
* **value**
```js
  0
```

#### scope-enum
* **condition**: `scope` is found in value
* **rule**: `always`
* **value**
  ```js
    []
  ```

#### scope-case
* **condition**: `scope` is in case `value`
* **rule**: `always`
```js
  'lowerCase'
```

#### scope-empty
* **condition**: `scope` is empty
* **rule**: `never`

#### scope-max-length
* **condition**: `scope` has `value` or less characters
* **rule**: `always`
* **value**
```js
  Infinity
```

#### scope-min-length
* **condition**: `scope` has `value` or more characters
* **rule**: `always`
* **value**
```js
  0
```

#### subject-case
* **condition**: `subject` is in case `value`
* **rule**: `always`
```js
  'lowerCase'
```

#### subject-empty
* **condition**: `subject` is empty
* **rule**: `never`

#### subject-max-length
* **condition**: `subject` has `value` or less characters
* **rule**: `always`
* **value**
```js
  Infinity
```

#### subject-min-length
* **condition**: `subject` has `value` or more characters
* **rule**: `always`
* **value**
```js
  0
```

#### subject-full-stop
* **condition**: `subject` ends with `value`
* **rule**: `never`
* **value**
```js
  '.'
```

#### body-leading-blank
* **condition**: `body` begins with blank line
* **rule**: `always`

#### body-max-length
* **condition**: `body` has `value` or less characters
* **rule**: `always`
* **value**
```js
  Infinity
```

#### body-min-length
* **condition**: `body` has `value` or more characters
* **rule**: `always`
* **value**
```js
  0
```

#### header-max-length
* **condition**: `header` has `value` or less characters
* **rule**: `always`
* **value**
```js
  72
```

#### header-min-length
* **condition**: `header` has `value` or more characters
* **rule**: `always`
* **value**
```js
  0
```

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

#### release
* **condition**: `header` matches `pattern`

#### revert
* **condition**: `header` matches `pattern`

---
Copyright 2016 by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('../license.md').
