# @commitlint/load

Load shared commitlint configuration

## Install

```sh
npm install --save @commitlint/load
```

## Signature

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
   * ids resolvable from cwd or configuration file.
   * Imported and merged into configuration
   * with increasing precedence, with top level config taking the highest.
   */
  extends?: string[];
  /*
   * id resolvable from cwd or configuration file.
   * Imported and expanded to {ParserPreset}.
   * Top level parserPresets override presets in extended configuration.
   */
  parserPreset?: string;
  /**
   * Initial map of rules to check against
   */
  rules?: {[ruleName: string]: Rule};
  /**
   * URL to print as help for reports with problems
   */
  helpUrl?: string;
};

type Config = {
  /*
   * Relatives path to all extended configurations.
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
  /**
   * URL to print as help for reports with problems
   */
  helpUrl?: string;
};

type LoadOptions = {
  /*
   * Path to the config file to load.
   */
  file?: string;
  /*
   * The cwd to use when loading config from file parameter.
   */
  cwd: string;
};

load(seed: Seed = {}, options?: LoadOptions = {cwd: process.cwd()}) => Promise<Config>;
```

## Import

```js
import load from '@commitlint/load';
```

## Examples

### Inline rules

```js
const config = await load({
  rules: {
    'body-leading-blank': [2, 'always'],
  },
});
console.log(config);
// => { extends: [], rules: { 'body-leading-blank': [ 2, 'always' ] } }
```

### Reference a file

```js
const config = await load({extends: ['./package']});
console.log(config);
// => { extends: ['./package', './package-b'], rules: {} }
```

### Inline `parserPreset`

```js
const config = await load({parserPreset: './parser-preset.js'});
console.log(config);
/* => 
{ 
  extends: [], 
  rules: {}, 
  parserPreset: {
    name: './parser-preset.js', 
    path: './parser-preset.js', 
    opts: {}
  }
}
*/
```

### Config file with with current working directory

```js
const config = await load({}, {file: '.commitlintrc.yml', cwd: process.cwd()});
console.log(config);
/* => 
{ 
  extends: [], 
  rules: { 
    'body-leading-blank': [ 1, 'always' ] 
  },
  formatter: '@commitlint/format', 
  plugins: {} 
}
*/
```
