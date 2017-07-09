> Lint commit messages

# commitlint

*  🚓  Enforce commit conventions
*  🤖  Plays nice with `conventional-changelog`
*  📦  Supports shareable configuration

## Getting started

```
npm install --save-dev @commitlint/{angular,cli}
echo '{"extends": ["@commitlint/config-angular"]}' > .commitlintrc
```

## CLI

* Primary way to interact with commitlint.
* `npm install --save-dev @commitlint/cli`
* Packages: [cli](./@commitlint/cli)

## Config

* Configuration is picked up from `.commitlint` files
* Packages: [cli](./@commitlint/cli), [core](./@commitlint/core)
* See [Rules](./docs/rules) for a complete list of possible rules
* An example configurations can be found at [@commitlint/config-angular](./@commitlint/config-angular/index.js)

## Shared configurations

A number of shared configurations are available to install and use with `commitlint`:

* [@commitlint/config-angular](./@commitlint/config-angular)
* [@commitlint/config-lerna-scopes](./@commitlint/config-lerna-scopes)
* [@commitlint/config-patternplate](./@commitlint/config-patternplate)
* [conventional-changelog-lint-config-atom](https://github.com/erikmueller/conventional-changelog-lint-config-atom)
* [conventional-changelog-lint-config-canonical](https://github.com/gajus/conventional-changelog-lint-config-canonical)


## API

* Alternative, programatic way to interact with `commitlint`
* `npm install --save @commitlint/core`
* Packages: [core](./@commitlint/core)
* See [API](./docs/api) for a complete list of methods and examples

## Tools

* [prompt](./@commitlint/prompt)

## Version Support

* Node.js [LTS](https://github.com/nodejs/LTS#lts-schedule) version and higher: `>= 4`
* git `>= 2`

## Related projects

* [angular-precommit](https://git.io/vwTDd) – Pre commit with angular conventions
* [conventional-changelog](https://git.io/v18sw) – Generate a changelog from conventional commit history
* [conventional-commits-detector](https://git.io/vwTyk) – Detect what commit message convention your repository is using
* [conventional-github-releaser](https://git.io/vwTyI) – Make a new GitHub release from git metadata
* [commitizen](https://git.io/vwTym) – Simple commit conventions for internet citizens

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
