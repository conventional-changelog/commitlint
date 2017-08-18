> Lint commit messages

<p align="center">
  <img width="750" src="https://marionebl.github.io/commitlint/assets/commitlint.svg">
</p>

# commitlint

[![npm latest][2]][3] [![npm next][10]][3] [![Travis branch][4]][5] [![AppVeyor branch][6]][7]


*  🚓  Be a good `commitizen`
*  📦  Share configuration via `npm`
*  🤖  Tap into `conventional-changelog` 

## Getting started

```sh
npm install --save-dev @commitlint/{config-angular,cli}
echo "module.exports = {extends: ['@commitlint/config-angular']}" > commitlint.config.js
```

## CLI

* Primary way to interact with commitlint.
* `npm install --save-dev @commitlint/cli`
* Packages: [cli](./@commitlint/cli)

## Config

* Configuration is picked up from `commitlint.config.js` files
* Packages: [cli](./@commitlint/cli), [core](./@commitlint/core)
* See [Rules](./docs/reference-rules.md) for a complete list of possible rules
* An example configuration can be found at [@commitlint/config-angular](./@commitlint/config-angular/index.js)

## Shared configuration

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
* See [API](./docs/reference-api.md) for a complete list of methods and examples

## Tools

* [commitizen adapter](./@commitlint/prompt)
* [prompt](./@commitlint/prompt-cli)

## Version Support

* Node.js [LTS](https://github.com/nodejs/LTS#lts-schedule) version and higher: `>= 4`
* git `>= 2`

## Related projects

* [conventional-changelog](https://git.io/v18sw) – Generate a changelog from conventional commit history
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


[0]: https://img.shields.io/badge/stability-stable-green.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/@commitlint/cli.svg?style=flat-square
[3]: https://npmjs.org/package/@commitlint/cli
[4]: https://img.shields.io/travis/marionebl/commitlint/master.svg?style=flat-square
[5]: https://travis-ci.org/marionebl/commitlint
[6]: https://img.shields.io/appveyor/ci/marionebl/commitlint/master.svg?style=flat-square
[7]: https://ci.appveyor.com/project/marionebl/commitlint

[8]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[9]: https://nodejs.org/api/documentation.html#documentation_stability_index

[10]: https://img.shields.io/npm/v/@commitlint/cli/next.svg?style=flat-square
