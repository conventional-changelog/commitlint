# Configuration

`@commitlint/cli` picks up configuration from `./commitlint.config.js`.

The file is expected 

* to contain valid JavaScript
* export a configuration object
* adhere to the schema outlined below

```ts
type Config = {
    /*
     * Resolveable ids to commitlint configurations to extend
     */
    extends?: string[];
    /*
     * Resolveable id to conventional-changelog parser preset to import and use
     */
    parserPreset?: string;
    /*
     * Resolveable id to package, from node_modules, which formats the output.
     */
    formatter: string;
    /*
     * Rules to check against
     */
    rules?: {[name: string]: Rule};
}

const Configuration: Config = {
    /*
     * Resolve and load @commitlint/config-conventional from node_modules.
     * Referenced packages must be installed
     */
    extends: ['@commitlint/config-conventional'],
    /*
     * Resolve and load conventional-changelog-atom from node_modules. 
     * Referenced packages must be installed
     */
    parserPreset: 'conventional-changelog-atom',
    /*
     * Resolve and load @commitlint/format from node_modules.
     * Referenced package must be installed
     */
    formatter: '@commitlint/format',
    /*
     * Any rules defined here will override rules from @commitlint/config-conventional
     */
    rules: {
        'type-enum': [2, 'always', ['foo']]
    }
};

module.exports = Configuration;
```

## Shareable configuration

Every commitlint configuration can extend other commitlint configurations.
Specify configurations to extend via the `.extends` key, using ids 
that can be resolved by the node resolve algorithm.

This means installed npm packages and local files can be used.

* npm

```
npm install --save-dev commitlint-config-lerna @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = {
    extends: [
        'lerna' // prefixed with commitlint-config-*,
        '@commitlint/config-conventional' // scoped packages are not prefixed
    ]
}
```

* local


```js
// commitlint.config.js
module.exports = {
    extends: ['./commitlint.base.js', './commitlint.types.js']
}
```

```js
// commitlint.types.js, will be picked up by commitlint.config.js
module.exports = {
    rules: {
        'type-enum': [2, 'always', ['foo']]
    }
}
```

```js
// commitlint.base.js, will be picked up by commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'], // extends can be nested
    parserPreset: 'conventional-changelog-atom'
}
```

## Parser presets

The parser preset used to parse commit messages can be configured. 
Use ids resolveable by the node resolve algorithm.

This means installed npm packages and local files can be used.

* npm

```
npm install --save-dev conventional-changelog-atom
```

```js
// commitlint.config.js
module.exports = {
    parserPreset: 'conventional-changelog-atom'
}
```

* local

```js
// commitlint.config.js
module.exports = {
    parserPreset: './parser-preset'
}
```

```js
// parser-preset.js
module.exports = {
    parserOpts: {
        headerPattern: /^(\w*)\((\w*)\)-(\w*)\s(.*)$/,
        headerCorrespondence: ['type', 'scope', 'ticket', 'subject']
    }
};
```

## Formatter

Commitlint can output the issues encountered in different formats, if necessary.
Use ids resolvable by the node resolve algorithm.

```js
module.exports = {
    formatter: '@commitlint/format'
};
```

## Rules

Refer to [Rules](reference-rules.md) for a complete list of available rules.
