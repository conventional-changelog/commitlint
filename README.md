> Lint commit messages

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/marionebl/commitlint/3594397919c6188ce31ccfc94a0113d625d55516/docs/assets/commitlint.svg">
</p>

> Demo generated with [svg-term-cli](https://github.com/marionebl/svg-term-cli) 
>
> `cat docs/assets/commitlint.json | svg-term --out docs/assets/commitlint.svg --frame --profile=Seti --height=20 --width=80`

# commitlint [![slack][11]][12]

[![npm latest][2]][3] [![Travis branch][4]][5] [![AppVeyor branch][6]][7]


*  🚓  Be a good `commitizen`
*  📦  Share configuration via `npm`
*  🤖  Tap into `conventional-changelog`

## Contents

* [Getting started](#getting-started)
* [CLI](#cli)
* [Config](#config)
* [Shared configuration](#shared-configuration)
* [API](#api)
* [Tools](#tools)
* [Roadmap](#roadmap) 
* [Version Support](#version-support)
* [Related projects](#related-projects)
* [License](#license)
* [Development](#development)
  * [Install and run](#install-and-run)
  * [Publishing a release](#publishing-a-release)

* * *

## Getting started

```sh
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Configure commitlint to use conventional config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```


To lint commits before they are created you can use Husky's 'commit-msg' hook:
```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }  
  }
}
```


**Detailed Setup instructions**

* [Local setup](http://marionebl.github.io/commitlint/#/guides-local-setup) - Lint messages on commit with husky
* [CI setup](http://marionebl.github.io/commitlint/#/guides-ci-setup) - Lint messages during CI builds


## CLI

* Primary way to interact with commitlint.
* `npm install --save-dev @commitlint/cli`
* Packages: [cli](./@commitlint/cli)

## Config

* Configuration is picked up from `commitlint.config.js`, `.commitlintrc.js`, `.commitlintrc.json`, or `.commitlintrc.yml` file or a `commitlint` field in `package.json`
* Packages: [cli](./@commitlint/cli), [core](./@commitlint/core)
* See [Rules](./docs/reference-rules.md) for a complete list of possible rules
* An example configuration can be found at [@commitlint/config-conventional](./@commitlint/config-conventional/index.js)

## Shared configuration

A number of shared configurations are available to install and use with `commitlint`:

* [@commitlint/config-angular](./@commitlint/config-angular)
* [@commitlint/config-conventional](./@commitlint/config-conventional)
* [@commitlint/config-lerna-scopes](./@commitlint/config-lerna-scopes)
* [@commitlint/config-patternplate](./@commitlint/config-patternplate)
* [conventional-changelog-lint-config-atom](https://github.com/erikmueller/conventional-changelog-lint-config-atom)
* [conventional-changelog-lint-config-canonical](https://github.com/gajus/conventional-changelog-lint-config-canonical)


## API

* Alternative, programmatic way to interact with `commitlint`
* Packages: 
  * [format](./@commitlint/format) - Format commitlint reports
  * [lint](./@commitlint/lint) - Lint a string against commitlint rules
  * [load](./@commitlint/load) - Load shared commitlint configuration
  * [read](./@commitlint/read) - Read commit messages from a specified range or last edit
* See [API](./docs/reference-api.md) for a complete list of methods and examples

## Tools

* [commitizen adapter](./@commitlint/prompt)
* [prompt](./@commitlint/prompt-cli)

## Roadmap

> **Ideas**: [marionebl/commitlint#94](https://github.com/marionebl/commitlint/issues/94)

`commitlint` is considered stable and is used in various projects as development tool. 

We identify **ease of adoption** and **developer experience** as fields where there
is room and need for improvement. The items on the roadmap should enhance `commitlint` regarding those aspects.

* [x] **Adoption**: Provide reusable Travis CI integration: `@commitlint/travis-cli` (https://github.com/marionebl/commitlint/releases/tag/v5.1.0)
* [ ] **DX**: Support PR squash scenario via [ahmed-taj/commitlint-bot](https://github.com/ahmed-taj/commitlint-bot/) and `@commitlint/travis-cli`
* [ ] **Adoption**: Make [ahmed-taj/commitlint-bot](https://github.com/ahmed-taj/commitlint-bot/) configurable via `commitlint` configuration
* [ ] **Adoption**: Create `commitlint init`
* [ ] **DX**: Extend the configuration schema to allow for additional fields (descriptions, examples, fixes) on both the rule and value level
* [ ] **DX**: Incorporate an extended version of [lennym/commit-template](https://github.com/lennym/commit-template) deducing a template from commitlint configuration
* [ ] **DX**: Rewrite `@commitlint/prompt` for better usability (might involve a lot of yak-shaving)

## Version Support

* Node.js [LTS](https://github.com/nodejs/LTS#lts-schedule) `>= 6`
* git `>= 2`

## Related projects

* [conventional-changelog](https://git.io/v18sw) – Generate a changelog from conventional commit history
* [commitizen](https://git.io/vwTym) – Simple commit conventions for internet citizens
* [create-semantic-module](https://git.io/vFjFg) – CLI for quickly integrating commitizen and commitlint in new or existing projects

## License
Copyright by @marionebl. All `commitlint` packages are released under the MIT license.

## Development

`commitlint` is developed in a mono repository.

### Install and run

```sh
git clone git@github.com:marionebl/commitlint.git
cd commitlint
npx yarn install
npx yarn run build # run build tasks
npx yarn start # run tests, again on change
```

For more information on how to contribute please take a look at our [contribution guide](./.github/CONTRIBUTING.md).

### Publishing a release

```sh
npx yarn run clean
npx yarn install
npx yarn run build
npx yarn test
npx yarn run publish
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

[11]: http://devtoolscommunity.herokuapp.com/badge.svg?style=flat-square
[12]: http://devtoolscommunity.herokuapp.com
