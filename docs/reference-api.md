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
/**
 * How to handle violation of rule
 * 0 - ignore
 * 1 - warn
 * 2 - throw
 */
type RuleLevel = 0 | 1 | 2;

/*
 * Application of rule
 * always - positive
 * never - negative
 */
type RuleCondition = 'always' | 'never';

/*
 * Additional, optional options to pass to rule
 */
type RuleOption = any;

/**
 * Basic complete rule definition
 */
type PrimitiveRule = [RuleLevel, RuleCondition, RuleOption?];

/*
 * Async rules are resolved during config lookup.
 * They can be used to set up linting rules based on e.g. the project fs
 */
type AsyncRule = Promise<PrimitiveRule>;

/*
 * Function rules are executed during config lookup.
 * They can be used to set up linting rules based on e.g. the project fs
 */
type FunctionRule = () => PrimitiveRule;

/*
 * Async function rules are executed and awaited during config lookup.
 * They can be used to set up linting rules based on e.g. the project fs
 */
type AsyncFunctionRule () => Promise<PrimitiveRule>;

/*
 * Polymorphic rule struct
 */
type Rule = PrimitiveRule | FunctionRule | AsyncFunctionRule;

/*
 * Parser preset for conventional commits
 */
type ParserPreset = {
  name: string;
  path: string;
  opts: any;
};

type Seed = {
  /*
   * ids resolveable from cwd or configuration file.
   * Imported and merged into configuration
   * with increasing precedence, with top level config taking the highest.
   */
  extends?: string[];
  /*
   * id resolveable from cwd or configuration file.
   * Imported and expanded to {ParserPreset}.
   * Top level parserPresets override presets in extended configuration.
   */
  parserPreset?: string;
  /**
   * Initial map of rules to check against
   */
  rules?: {[ruleName: string]: Rule};
};

type Config = {
  /*
   * Relatives path to all extendend configurations.
   */
  extends: string[];
  /*
   * Expanded parser preset, if any
   */
  parserPreset?: ParserPreset;
  /*
   * Merged map of rules to check against
   */
  rules: {[ruleName: string]: Rule};
};

load(seed: Seed = {}) => Promise<Config>;
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
// => { extends: ['./package', './package-b'], rules: {} }

load({parserPreset: './parser-preset.js'})
.then(config => console.log(config));
// => { extends: [], rules: {}, parserPreset: {name: './parser-preset.js', path: './parser-preset.js', opts: {}}}
```

### read

> Read commit messages from as specified range

* **Signature**

```ts
type Range = {
  /* Lower end of the commit range to read */
  from: string;
  /* Upper end of the commit range to read */
  to: string;
  /* Wether (boolean) to read from ./.git/COMMIT_EDITMSG or where to read from (string) */
  edit?: boolean | string;
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

read({edit: './git/GITGUI_EDITMESSAGE'})
 .then(messages => console.log(messages));
// => ['I did something via git gui\n\n']

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

type Options = {
  parserOpts?: any;
};

lint(message: string, rules: {[ruleName: string]: Rule}, opts?: Options) => Promise<Report>;
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
          message: 'type must be one of [bar]' } ] }
  */

const opts = {parserOpts: {headerPattern: /^(\w*)-(\w*)/, headerCorrespondence: ['type', 'scope']}};

lint('foo-bar', {'type-enum': [2, 'always', ['foo']]}, opts).then(report => console.log(report));
// => { valid: true, errors: [], warnings: [] }
```

* **Load configuration**

```js
const {lint, load} = require('@commitlint/core');

const CONFIG = {
  extends: ['./@commitlint/config-angular']
};

load(CONFIG)
  .then(opts => lint('foo: bar', opts.rules, opts.parserPreset ? {parserOpts: opts.parserPreset.parserOpts} : {}))
  .then(report => console.log(report));
  /* =>
    { valid: false,
      errors:
      [ { level: 2,
          valid: false,
          name: 'type-enum',
          message: 'type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]' } ],
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
    const [{rules, parserPreset}, [commit]] = tasks;
    return lint(commit, rules, parserPreset ? {parserOpts: parserPreset.parserOpts}: {});
  })
  .then(report => console.log(JSON.stringify(result.valid)));
```
