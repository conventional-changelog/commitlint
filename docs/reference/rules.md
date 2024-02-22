# Rules

## body-full-stop

- **condition**: `body` ends with `value`
- **rule**: `never`
- **value**

  ```text
  '.'
  ```

## body-leading-blank

- **condition**: `body` begins with blank line
- **rule**: `always`

## body-empty

- **condition**: `body` is empty
- **rule**: `never`

## body-max-length

- **condition**: `body` has `value` or less characters
- **rule**: `always`
- **value**

  ```text
  Infinity
  ```

## body-max-line-length

- **condition**: `body` lines has `value` or less characters
- **rule**: `always`
- **value**

  ```text
  Infinity
  ```

## body-min-length

- **condition**: `body` has `value` or more characters
- **rule**: `always`
- **value**

  ```text
  0
  ```

## body-case

- **condition**: `body` is in case `value`
- **rule**: `always`
- **value**

  ```text
  'lower-case'
  ```

- **possible values**

  ```js
  [
    'lower-case', // default
    'upper-case', // UPPERCASE
    'camel-case', // camelCase
    'kebab-case', // kebab-case
    'pascal-case', // PascalCase
    'sentence-case', // Sentence case
    'snake-case', // snake_case
    'start-case', // Start Case
  ];
  ```

## footer-leading-blank

- **condition**: `footer` begins with blank line
- **rule**: `always`

## footer-empty

- **condition**: `footer` is empty
- **rule**: `never`

## footer-max-length

- **condition**: `footer` has `value` or less characters
- **rule**: `always`
- **value**

  ```text
  Infinity
  ```

## footer-max-line-length

- **condition**: `footer` lines has `value` or less characters
- **rule**: `always`
- **value**

  ```text
  Infinity
  ```

## footer-min-length

- **condition**: `footer` has `value` or more characters
- **rule**: `always`
- **value**

  ```text
  0
  ```

## header-case

- **condition**: `header` is in case `value`
- **rule**: `always`
- **value**

  ```text
  'lower-case'
  ```

- **possible values**

  ```js
  [
    'lower-case', // default
    'upper-case', // UPPERCASE
    'camel-case', // camelCase
    'kebab-case', // kebab-case
    'pascal-case', // PascalCase
    'sentence-case', // Sentence case
    'snake-case', // snake_case
    'start-case', // Start Case
  ];
  ```

## header-full-stop

- **condition**: `header` ends with `value`
- **rule**: `never`
- **value**

  ```text
  '.'
  ```

## header-max-length

- **condition**: `header` has `value` or less characters
- **rule**: `always`
- **value**

  ```text
  72
  ```

## header-min-length

- **condition**: `header` has `value` or more characters
- **rule**: `always`
- **value**

  ```text
  0
  ```

## header-trim

- **condition**: `header` must not have initial and / or trailing whitespaces
- **rule**: `always`

## references-empty

- **condition**: `references` has at least one entry
- **rule**: `never`

## scope-enum

- **condition**: `scope` is found in value
- **rule**: `always`
- **value**

  ```text
  []
  ```

> [!NOTE]
>
> - This rule always passes if no scopes are provided in the message or the value > is an empty array.
> - When set to `always`, all message scopes must be found in the value.
> - When set to `never`, none of the message scopes can be found in the value.

## scope-case

- **condition**: `scope` is in case `value`
- **rule**: `always`
- **value**

  ```text
  'lower-case'
  ```

- **possible values**

```js
[
  'lower-case', // default
  'upper-case', // UPPERCASE
  'camel-case', // camelCase
  'kebab-case', // kebab-case
  'pascal-case', // PascalCase
  'sentence-case', // Sentence case
  'snake-case', // snake_case
  'start-case', // Start Case
];
```

## scope-empty

- **condition**: `scope` is empty
- **rule**: `never`

## scope-max-length

- **condition**: `scope` has `value` or less characters
- **rule**: `always`
- **value**

```text
Infinity
```

## scope-min-length

- **condition**: `scope` has `value` or more characters
- **rule**: `always`
- **value**

```text
0
```

## subject-case

- **condition**: `subject` is in case `value`
- **rule**: `always`
- **value**

```js
['sentence-case', 'start-case', 'pascal-case', 'upper-case'];
```

- **possible values**

```js
[
  'lower-case',    // lower case
  'upper-case',    // UPPERCASE
  'camel-case',    // camelCase
  'kebab-case',    // kebab-case
  'pascal-case',   // PascalCase
  'sentence-case', // Sentence case
  'snake-case',    // snake_case
  'start-case'.    // Start Case
]
```

## subject-empty

- **condition**: `subject` is empty
- **rule**: `never`

## subject-full-stop

- **condition**: `subject` ends with `value`
- **rule**: `never`
- **value**

```text
'.'
```

## subject-max-length

- **condition**: `subject` has `value` or less characters
- **rule**: `always`
- **value**

```text
Infinity
```

## subject-min-length

- **condition**: `subject` has `value` or more characters
- **rule**: `always`
- **value**

```text
0
```

## subject-exclamation-mark

- **condition**: `subject` has exclamation before the `:` marker
- **rule**: `never`

## type-enum

- **condition**: `type` is found in value
- **rule**: `always`
- **value**

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
    'test',
  ];
  ```

## type-case

- **description**: `type` is in case `value`
- **rule**: `always`
- **value**

  ```text
  'lower-case'
  ```

- **possible values**

  ```js
  [
    'lower-case', // default
    'upper-case', // UPPERCASE
    'camel-case', // camelCase
    'kebab-case', // kebab-case
    'pascal-case', // PascalCase
    'sentence-case', // Sentence case
    'snake-case', // snake_case
    'start-case', // Start Case
  ];
  ```

## type-empty

- **condition**: `type` is empty
- **rule**: `never`

## type-max-length

- **condition**: `type` has `value` or less characters
- **rule**: `always`
- **value**

  ```text
  Infinity
  ```

## type-min-length

- **condition**: `type` has `value` or more characters
- **rule**: `always`
- **value**

  ```text
  0
  ```

## signed-off-by

- **condition**: `message` has `value`
- **rule**: `always`
- **value**

  ```text
  'Signed-off-by:'
  ```

## trailer-exists

- **condition**: `message` has trailer `value`
- **rule**: `always`
- **value**

  ```text
  'Signed-off-by:'
  ```
