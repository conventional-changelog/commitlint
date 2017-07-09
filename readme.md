> Lint commit messages

# commitlint

*  🚓  Enforce commit conventions
*  🤖  Plays nice with `conventional-changelog`
*  📦  Supports shareable configuration

## CLI

* Primary way to interact with commitlint.
* Install `@commitlint/cli`
* Packages: [cli](./@commitlint/cli)

```
❯ npm install -g @commitlint/cli

❯ commitlint --help
  commitlint - Lint commit messages

  [input] reads from stdin if --edit, --from and --to are omitted
  --color,-c    toggle formatted output, defaults to: true
  --edit,-e     read last commit message found in ./git/COMMIT_EDITMSG
  --extends,-x  array of shareable configurations to extend
  --from,-f     lower end of the commit range to lint; applies if edit=false
  --to,-t       upper end of the commit range to lint; applies if edit=false
  --quiet,-q    toggle console output

```

## Config

* Configuration is picked up from `.commitlint` files
* Packages: [cli](./@commitlint/cli), [core](./@commitlint/core)
* See [Rules](./docs/rules) for a complete list of possible rules

```js
{
  "extends": ["@commitlint/config-angular"], // pull in rules from packages
  "rules": { // overriding rules from extended packages
    "body-leading-blank": [0], // disable rule body-leading-blank,
    "footer-leading-blank": [1, "always"], // footer-leading-blank is a warning if not met
    "body-tense": [2, "always", ["present-imperative"]], // body-tense is an error if not met
  }
}
```

## API

* Alternative, programatic way to interact with `commitlint`
* Install `@commitlint/core`
* Packages: [core](./@commitlint/core)
* See [API](./docs/api) for a complete list of methods and parameters

```js
// example
const {lint} = require('@commitlint/core');

// Pass in configuration manually
lint('docs: add node api', {
	configuration: {
		rules: {
			'scope-empty': [2, 'never']
		}
	}
})
.then(report => {
	console.log(JSON.stringify(report, null, '  '));
});
/* => {
  "valid": false,
  "errors": [
    {
      "level": 2,
      "valid": false,
      "name": "scope-empty",
      "message": "scope may not be empty"
    }
  ],
  "warnings": []
} */
```

## Tools

* [prompt](./@commitlint/prompt) 

## Related projects

## License
Copyright by @marionebl. All `commitlint` packages are released under the MIT license.

## Development

`commitlint` is developed in a mono repository.

### Getting started

```sh
git clone git@github.com:marionebl/commitlint.git
cd commitlint
npm install
npm start # run tests, again on change
npm run build # run build tasks
```
