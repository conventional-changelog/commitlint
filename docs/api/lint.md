# @commitlint/lint

Lint a string against commitlint rules

## Install

```sh
npm install --save @commitlint/lint
```

## Signature

```ts
type RuleLevel = 0 | 1 | 2;
type RuleCondition = 'always' | 'never';
type RuleOption = any;
type PrimitiveRule = [RuleLevel, RuleCondition, RuleOption?];
type AsyncRule = Promise<PrimitiveRule>;
type FunctionRule = () => PrimitiveRule;
type AsyncFunctionRule = () => Promise<PrimitiveRule>;
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

type Options = {
  parserOpts?: any;
};

lint(message: string, rules: {[ruleName: string]: Rule}, opts?: Options) => Promise<Report>;
```

## Basic Examples

### Import

```js
import lint '@commitlint/lint';
```

### Usage without config

```js
const report = await lint('foo: bar');
console.log(report);
// => { valid: true, errors: [], warnings: [] }
```

### Usage with type-enum rules and valid message

```js
const report = await lint('foo: bar', {'type-enum': [1, 'always', ['foo']]});
console.log(report);
// => { valid: true, errors: [], warnings: [] }
```

### Usage with type-enum rules and invalid message

```js
const report = await lint('foo: bar', {'type-enum': [1, 'always', ['bar']]});
console.log(report);
/* => 
{ 
  valid: false,
  errors: [],
  warnings: [ 
    { 
      level: 1,
      valid: false,
      name: 'type-enum',
      message: 'type must be one of [bar]' 
    } 
  ]
}
*/
```

### Usage with custom parser options

```js
const opts = {
  parserOpts: {
    headerPattern: /^(\w*)-(\w*)/,
    headerCorrespondence: ['type', 'scope'],
  },
};

const report = await lint(
  'foo-bar',
  {'type-enum': [2, 'always', ['foo']]},
  opts
);
console.log(report);
// => { valid: true, errors: [], warnings: [] }
```

## Load configuration

```js
import load from '@commitlint/load';
import lint from '@commitlint/lint';

const CONFIG = {
  extends: ['@commitlint/config-conventional'],
};

const opts = await load(CONFIG);
const report = await lint(
  'foo: bar',
  opts.rules,
  opts.parserPreset ? {parserOpts: opts.parserPreset.parserOpts} : {}
);
console.log(report);
/* => 
{ 
  valid: false,
  errors: [ 
    { 
      level: 2,
      valid: false,
      name: 'type-enum',
      message: 'type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]' 
    } 
  ],
  warnings: [] 
}
*/
```

## Read git history

```js
import lint from '@commitlint/lint';
import read from '@commitlint/read';

const RULES = {
  'type-enum': [2, 'always', ['foo']],
};

const commits = await read({to: 'HEAD', from: 'HEAD~2'});

console.info(commits.map((commit) => lint(commit, RULES)));
```

## Simplified last-commit checker

```js
import load from '@commitlint/load';
import read from '@commitlint/read';
import lint from '@commitlint/lint';

const {rules, parserPreset} = load();
const [commit] = await read({from: 'HEAD~1'});

const report = await lint(
  commit,
  rules,
  parserPreset ? {parserOpts: parserPreset.parserOpts} : {}
);

console.log(JSON.stringify(result.valid));
```
