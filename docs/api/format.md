# @commitlint/format

Format commitlint reports

## Install

```sh
npm install --save @commitlint/format
```

## Signature

```ts
type Problem = {
  /*
   * Level of the problem hint | warning | error
   */
  level: 0 | 1 | 2;
  /*
   * Name of the problem to annotate the message with
   */
  name: string;
  /*
   * Message to print
   */
  message: string;
}

type Report = {
  results: ReportResult[];
}

type ReportResult = {
  errors: Problem[];
  warnings: Problem[];
}

type formatOptions = {
  /**
   * Color the output
   **/
  color: boolean = true;

  /**
   * Signs to use as decoration for messages with severity 0, 1, 2
   **/
  signs: readonly [string; string; string] = [' ', '⚠', '✖'];

  /**
   * Colors to use for messages with severity 0, 1, 2
   **/
  colors: readonly [string; string; string] = ['white', 'yellow', 'red'];

  /**
   * Print summary and inputs for reports without problems
   **/
  verbose: boolean = false;

  /**
   * URL to print as help for reports with problems
   **/
  helpUrl: string;
}

format(report?: Report = {}, options?: formatOptions = {}) => string[];
```

## Import

```js
import format from '@commitlint/format';
```

## Examples

### Empty usage (no error founds with colors)

```js
format();
/* => 
[ 
  '\u001b[1m\u001b[32m✔\u001b[39m   found 0 problems, 0 warnings\u001b[22m' 
] 
*/
```

### Without colors

```js
format(
  {
    results: [
      {
        warnings: [
          {
            level: 0,
            name: 'some-hint',
            message: 'This will not show up as it has level 0',
          },
          {
            level: 1,
            name: 'some-warning',
            message: 'This will show up yellow as it has level 1',
          },
        ],
        errors: [
          {
            level: 2,
            name: 'some-error',
            message: 'This will show up red as it has level 2',
          },
        ],
      },
    ],
  },
  {
    color: false,
  }
);
/* => 
[
  '✖   This will show up red as it has level 2 [some-error]',
  '    This will not show up as it has level 0 [some-hint]',
  '⚠   This will show up yellow as it has level 1 [some-warning]',
  '✖   found 1 problems, 2 warnings'
] 
*/
```
