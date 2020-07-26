> Format commitlint reports

# @commitlint/format

## Getting started

```shell
npm install --save @commitlint/format
```

## Example

```js
const format = require('@commitlint/format');

const output = format(
  {
    valid: false,
    errorCount: 1,
    warningCount: 1,
    results: [
      {
        valid: false,
        input: 'some: commit message',
        errors: [
          {
            valid: false,
            level: 2,
            name: 'some-error',
            message: 'This will show up red as it has level 2',
          },
        ],
        warnings: [
          {
            valid: true,
            level: 0,
            name: 'some-hint',
            message: 'This will not show up as it has level 0',
          },
          {
            valid: false,
            level: 1,
            name: 'some-warning',
            message: 'This will show up yellow as it has level 1',
          },
        ],
      },
    ],
  },
  {
    color: false,
  }
);

process.stdout.write(output);

/* => [
  '✖   This will show up red as it has level 2 [some-error]',
  '    This will not show up as it has level 0 [some-hint]',
  '⚠   This will show up yellow as it has level 1 [some-warning]',
  '✖   found 1 problems, 2 warnings'
] */
```

Consult [docs/api](https://conventional-changelog.github.io/commitlint/#/reference-api) for comprehensive documentation.
