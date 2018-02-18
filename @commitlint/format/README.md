> Format commitlint reports

# @commitlint/format

## Getting started

```shell
npm install --save @commitlint/format
```

## Example

```js
const format = require('@commitlint/format');

format({
  warnings: [
    {
      level: 0,
      name: 'some-hint',
      message: 'This will not show up as it has level 0'
    },
    {
      level: 1,
      name: 'some-warning',
      message: 'This will show up yellow as it has level 1'
    }
  ],
  errors: [
    {
      level: 2,
      name: 'some-error',
      message: 'This will show up red as it has level 2'
    }
  ]
}, {
  color: false
});
/* => [
  '✖   This will show up red as it has level 2 [some-error]',
  '    This will not show up as it has level 0 [some-hint]',
  '⚠   This will show up yellow as it has level 1 [some-warning]',
  '✖   found 1 problems, 2 warnings'
] */
```

Consult [docs/api](http://marionebl.github.io/commitlint/#/reference-api) for comprehensive documentation.
