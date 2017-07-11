# API

## Install

```
npm install --save @commitlint/core
```

## Methods

### format
> Format commitlint report data to a human-readable format

* **Signature**

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
  errors: Problem[];
  warnings: Problem[];
}

type formatOptions = {
  /*
   * Color the output
   */
  color: boolean = true;
}

format(report?: Report = {}, options?: formatOptions = {}) => string[];
```

* **Example**

```js
const {format} = require('@commitlint/core');

format(); // => [ '\u001b[1m\u001b[32m✔\u001b[39m   found 0 problems, 0 warnings\u001b[22m' ]

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

### load

> load all relevant shared configuration

* **Signature**

```ts
type RuleLevel = 0 | 1 | 2;
type RuleCondition = 'always' | 'never';
type RuleOption = any;
type PrimitiveRule = [RuleLevel, RuleCondition, RuleOption?];
type AsyncRule = Promise<PrimitiveRule>;
type FunctionRule = () => PrimitiveRule;
type AsyncFunctionRule () => Promise<PrimitiveRule>;
type Rule = PrimitiveRule | FunctionRule | AsyncFunctionRule;

type Config = {
  extends: string[];
  rules: {[ruleName: string]: Rule};
}

load(seed: Config = {}) => Promise<Config>;
```

* **Example**

```js
const {load} = require('@commitlint/core');

load({
  rules: {
    'body-leading-blank': [2, 'always']
  }
})
.then(config => console.log(config));
// => { extends: [], rules: { 'body-leading-blank': [ 2, 'always' ] } }

load({extends: ['./package']})
.then(config => console.log(config));
// => { extends: [], rules: {} }
```

### read

> Read commit messages from as specified range

* **Signature**

```ts
type Range = {
  from: string;
  to: string;
  edit?: boolean;
};

read(range: Range) => Promise<string[]>
```

* **Example**

```js
// git commit -m "I did something"
const {read} = require('@commitlint/core');

read({edit: true})
 .then(messages => console.log(messages));
// => ['I did something\n\n']

read({from: 'HEAD~2'})
  .then(messages => console.log(messages));
// => ['I did something\n\n', 'Initial commit\n\n']

read({from: 'HEAD~2', to: 'HEAD~1'})
  .then(messages => console.log(messages));
// => ['Initial commit\n\n']
```

### lint

* **Signature**

```ts
type RuleLevel = 0 | 1 | 2;
type RuleCondition = 'always' | 'never';
type RuleOption = any;
type PrimitiveRule = [RuleLevel, RuleCondition, RuleOption?];
type AsyncRule = Promise<PrimitiveRule>;
type FunctionRule = () => PrimitiveRule;
type AsyncFunctionRule () => Promise<PrimitiveRule>;
type Rule = PrimitiveRule | FunctionRule | AsyncFunctionRule;

type Problem = {
  level: number;
  valid: boolean;
  name: string;
  message: string;
}

type Report = {
  valid: boolean;
  errors: Problem[];
  warnings: Problem[];
}

lint(message: string, rules: {[ruleName: string]: Rule}) => Promise<Report>;
```

* **Basic Example**

```js
const {lint} = require('@commitlint/core');

lint('foo: bar')
  .then(report => console.log(report)); 
  // => { valid: true, errors: [], warnings: [] }

lint('foo: bar', {'type-enum': [1, 'always', ['foo']]})
  .then(report => console.log(report)); 
  // => { valid: true, errors: [], warnings: [] }

lint('foo: bar', {'type-enum': [1, 'always', ['bar']]})
  .then(report => console.log(report)); 
  /* =>
    { valid: true,
      errors: [],
      warnings:
      [ { level: 1,
          valid: false,
          name: 'type-enum',
          message: 'scope must be one of [bar]' } ] }
  */
```

* **Load configuration**

```js
const {lint, load} = require('@commitlint/core');

const CONFIG = {
  extends: ['./@commitlint/config-angular']
};

load(CONFIG)
  .then(opts =>lint('foo: bar', opts.rules)) 
  .then(report => console.log(report));
  /* =>
    { valid: false,
      errors:
      [ { level: 2,
          valid: false,
          name: 'type-enum',
          message: 'scope must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]' } ],
      warnings: [] } 
    */
```

* **Read git history**

```js
const {lint, read} = require('@commitlint/core');

const RULES = {
  'type-enum': [2, 'always', ['foo']]
};

const check = commit => lint(commit, RULES);

read({to: 'HEAD', from: 'HEAD~2'})
  .then(commits => Promise.all(commits.map(check)));
```

* **Simplfied last-commit checker**

```js
const {lint, load, read} = require('@commitlint/core');

Promise.all([load(), read({from: 'HEAD~1'})])
  .then(tasks => {
    const [{rules}, [commit]] = tasks;
    return lint(commit, rules);
  })
  .then(report => console.log(JSON.stringify(result.valid)));
```
