# Rules

Rules are made up by a name and a configuration array. The configuration array contains:

- **Level** `[0..2]`: `0` disables the rule. For `1` it will be considered a warning for `2` an error.
- **Applicable** `always|never`: `never` inverts the rule.
- **Value**: value to use for this rule.

Rule configurations are either of type `array` residing on a key with the rule's name as key on the rules `object` or of type function returning type `array` or `Promise<array>`. This means all of the following notations are supported.

**Plain array**

```
  "rules": {
    "header-max-length": [0, "always", 72],
  }
```

**Function returning array**

```
  "rules": {
    "header-max-length": () => [0, "always", 72],
  }
```

**Async function returning array**

```
  "rules": {
    "header-max-length": async () => [0, "always", 72],
  }
```

**Function returning a promise resolving to array**

```
  "rules": {
    "header-max-length": () => Promise.resolve([0, "always", 72]),
  }
```

### Available rules

#### body-leading-blank

- **condition**: `body` begins with blank line
- **rule**: `always`

#### body-max-length

- **condition**: `body` has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### body-max-line-length

- **condition**: `body` lines has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### body-min-length

- **condition**: `body` has `value` or more characters
- **rule**: `always`
- **value**

```
0
```

#### footer-leading-blank

- **condition**: `footer` begins with blank line
- **rule**: `always`

#### footer-max-length

- **condition**: `footer` has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### footer-max-line-length

- **condition**: `footer` lines has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### footer-min-length

- **condition**: `footer` has `value` or more characters
- **rule**: `always`
- **value**

```
0
```

#### header-case

- **condition**: `header` is in case `value`
- **rule**: `always`
- **value**

```
'lowerCase'
```

- **possible values**

```
[
  'lower-case', // default
  'upper-case', // UPPERCASE
  'camel-case', // camelCase
  'kebab-case', // kebab-case
  'pascal-case', // PascalCase
  'sentence-case', // Sentence case
  'snake-case', // snake_case
  'start-case' // Start Case
]
```

#### header-full-stop

- **condition**: `header` ends with `value`
- **rule**: `never`
- **value**

```
'.'
```

#### header-max-length

- **condition**: `header` has `value` or less characters
- **rule**: `always`
- **value**

```
72
```

#### header-min-length

- **condition**: `header` has `value` or more characters
- **rule**: `always`
- **value**

```
0
```

#### references-empty

- **condition**: `references` has at least one entry
- **rule**: `never`

#### scope-enum

- **condition**: `scope` is found in value
- **rule**: `always`
- **value**
  ```
  []
  ```

#### scope-case

- **condition**: `scope` is in case `value`
- **rule**: `always`
- **value**

```
'lowerCase'
```

- **possible values**

```
[
  'lower-case', // default
  'upper-case', // UPPERCASE
  'camel-case', // camelCase
  'kebab-case', // kebab-case
  'pascal-case', // PascalCase
  'sentence-case', // Sentence case
  'snake-case', // snake_case
  'start-case' // Start Case
]
```

#### scope-empty

- **condition**: `scope` is empty
- **rule**: `never`

#### scope-max-length

- **condition**: `scope` has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### scope-min-length

- **condition**: `scope` has `value` or more characters
- **rule**: `always`
- **value**

```
0
```

#### subject-case

- **condition**: `subject` is in case `value`
- **rule**: `always`
- **value**

```
'lowerCase'
```

- **possible values**

```
[
  'lower-case', // default
  'upper-case', // UPPERCASE
  'camel-case', // camelCase
  'kebab-case', // kebab-case
  'pascal-case', // PascalCase
  'sentence-case', // Sentence case
  'snake-case', // snake_case
  'start-case' // Start Case
]
```

#### subject-empty

- **condition**: `subject` is empty
- **rule**: `never`

#### subject-full-stop

- **condition**: `subject` ends with `value`
- **rule**: `never`
- **value**

```
'.'
```

#### subject-max-length

- **condition**: `subject` has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### subject-min-length

- **condition**: `subject` has `value` or more characters
- **rule**: `always`
- **value**

```
0
```

#### type-enum

- **condition**: `type` is found in value
- **rule**: `always`
- **value**
  ```
  ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert']
  ```

#### type-case

- **description**: `type` is in case `value`
- **rule**: `always`
- **value**
  ```
  'lower-case'
  ```
- **possible values**

```
[
  'lower-case', // default
  'upper-case', // UPPERCASE
  'camel-case', // camelCase
  'kebab-case', // kebab-case
  'pascal-case', // PascalCase
  'sentence-case', // Sentence case
  'snake-case', // snake_case
  'start-case' // Start Case
];
```

#### type-empty

- **condition**: `type` is empty
- **rule**: `never`

#### type-max-length

- **condition**: `type` has `value` or less characters
- **rule**: `always`
- **value**

```
Infinity
```

#### type-min-length

- **condition**: `type` has `value` or more characters
- **rule**: `always`
- **value**

```
0
```

#### signed-off-by

- **condition**: `message` has `value`
- **rule**: `always`
- **value**

```
'Signed-off-by:'
```

### Deprecated rules

#### body-tense `deprecated`

- **condition**: `body` is verbalized in tense present in `value`
- **rule**: `always`
- **value**

```
['present-imperative']
```

- **possible values**

```
[
  'past-tense', // did
  'present-imperative', // do
  'present-participle', // doing
  'present-third-person' // does
]
```

#### footer-tense `deprecated`

- **condition**: `footer` is verbalized in tense present in `value`
- **rule**: `always`
- **value**

```
['present-imperative']
```

- **possible values**

```
[
  'past-tense', // did
  'present-imperative', // do
  'present-participle', // doing
  'present-third-person' // does
]
```

#### lang `deprecated`

- **condition**: `subject` is of language `value`
- **rule**: `always`
- **value**

```
eng
```

#### subject-tense `deprecated`

- **condition**: `subject` is verbalized in tense present in `value`
- **rule**: `always`
- **value**

```
['present-imperative']
```

- **possible values**

```
[
  'past-tense', // did
  'present-imperative', // do
  'present-participle', // doing
  'present-third-person' // does
]
```
