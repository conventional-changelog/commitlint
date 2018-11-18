# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="7.2.1"></a>
## [7.2.1](https://github.com/marionebl/commitlint/compare/v7.2.0...v7.2.1) (2018-10-11)


### Bug Fixes

* improve format module resolving ([#464](https://github.com/marionebl/commitlint/issues/464)) ([baed8b1](https://github.com/marionebl/commitlint/commit/baed8b1))




<a name="7.2.0"></a>
# [7.2.0](https://github.com/marionebl/commitlint/compare/v7.1.2...v7.2.0) (2018-10-05)


### Bug Fixes

* **rules:** include possible body offset in footer leading blank ([ff0111a](https://github.com/marionebl/commitlint/commit/ff0111a))
* handle case rules for numerics correctly ([cadcfed](https://github.com/marionebl/commitlint/commit/cadcfed))
* ignore merge messages with text after newline ([b32bc93](https://github.com/marionebl/commitlint/commit/b32bc93))
* use grouped regex to ignore merge commits ([#439](https://github.com/marionebl/commitlint/issues/439)) ([905e9d5](https://github.com/marionebl/commitlint/commit/905e9d5))


### Features

* **cli:** add format option for report output ([1ecf097](https://github.com/marionebl/commitlint/commit/1ecf097))
* **load:** add formatter option with default value ([b0e63d9](https://github.com/marionebl/commitlint/commit/b0e63d9))




<a name="7.1.2"></a>
## [7.1.2](https://github.com/marionebl/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)




**Note:** Version bump only for package @commitlint/root

<a name="7.1.0"></a>
# [7.1.0](https://github.com/marionebl/commitlint/compare/v7.0.1...v7.1.0) (2018-08-29)


### Features

* **wildcards:** add new wildcard patterns [#315](https://github.com/marionebl/commitlint/issues/315) ([e9ea17f](https://github.com/marionebl/commitlint/commit/e9ea17f))
* add max line length to body/footer  ([542f50e](https://github.com/marionebl/commitlint/commit/542f50e))




<a name="6.2.0"></a>
# [6.2.0](https://github.com/marionebl/commitlint/compare/v6.1.3...v6.2.0) (2018-05-01)


### Features

* print commit message when the message is invalid ([86c34f1](https://github.com/marionebl/commitlint/commit/86c34f1)), closes [#222](https://github.com/marionebl/commitlint/issues/222)
* **rules:** support array for scope-case and type-case ([#312](https://github.com/marionebl/commitlint/issues/312)) ([1f46b9f](https://github.com/marionebl/commitlint/commit/1f46b9f)), closes [#307](https://github.com/marionebl/commitlint/issues/307)




<a name="6.1.1"></a>
## [6.1.1](https://github.com/marionebl/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)


### Bug Fixes

* **ensure:** ignore word delimiters for case matching [#291](https://github.com/marionebl/commitlint/issues/291) ([fa69299](https://github.com/marionebl/commitlint/commit/fa69299))




<a name="6.1.0"></a>
# [6.1.0](https://github.com/marionebl/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)


### Bug Fixes

* **parse:** default to angular preset for empty parserOpts ([#265](https://github.com/marionebl/commitlint/issues/265)) ([ccb03b4](https://github.com/marionebl/commitlint/commit/ccb03b4)), closes [#262](https://github.com/marionebl/commitlint/issues/262)


### Features

* add "--config" option ([#261](https://github.com/marionebl/commitlint/issues/261)) ([2c03ec6](https://github.com/marionebl/commitlint/commit/2c03ec6))




<a name="6.0.5"></a>
## [6.0.5](https://github.com/marionebl/commitlint/compare/v6.0.4...v6.0.5) (2018-01-31)


### Bug Fixes

* remove utils from prod dependencies ([4fb858a](https://github.com/marionebl/commitlint/commit/4fb858a))




<a name="6.0.4"></a>
## [6.0.4](https://github.com/marionebl/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)


### Bug Fixes

* remove faulty bin entry [#259](https://github.com/marionebl/commitlint/issues/259) ([beafbc6](https://github.com/marionebl/commitlint/commit/beafbc6))




<a name="6.0.3"></a>
## [6.0.3](https://github.com/marionebl/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)


### Bug Fixes

* update dependency cosmiconfig to ^4.0.0 ([#234](https://github.com/marionebl/commitlint/issues/234)) ([7f94ac5](https://github.com/marionebl/commitlint/commit/7f94ac5))
* update dependency semver to v5.5.0 ([#236](https://github.com/marionebl/commitlint/issues/236)) ([6c52bd9](https://github.com/marionebl/commitlint/commit/6c52bd9))




<a name="6.0.2"></a>
## [6.0.2](https://github.com/marionebl/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)


### Bug Fixes

* ignore branch merges with multiple newlines ([#227](https://github.com/marionebl/commitlint/issues/227)) ([1f0c5ca](https://github.com/marionebl/commitlint/commit/1f0c5ca))
* remove typo in error message of type-case ([cb577cb](https://github.com/marionebl/commitlint/commit/cb577cb))




<a name="6.0.1"></a>
## [6.0.1](https://github.com/marionebl/commitlint/compare/v6.0.0...v6.0.1) (2018-01-09)




**Note:** Version bump only for package @commitlint/root

<a name="6.0.0"></a>
# [6.0.0](https://github.com/marionebl/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)


### Bug Fixes

* allow [0] shorthand ([84cf938](https://github.com/marionebl/commitlint/commit/84cf938))
* correctly resolve parserOpts [#115](https://github.com/marionebl/commitlint/issues/115) [#95](https://github.com/marionebl/commitlint/issues/95) ([1353dd5](https://github.com/marionebl/commitlint/commit/1353dd5))
* ignore branch merges with newlines ([#214](https://github.com/marionebl/commitlint/issues/214)) ([c94c4dc](https://github.com/marionebl/commitlint/commit/c94c4dc))
* sanitize ensure.case [#211](https://github.com/marionebl/commitlint/issues/211) ([#217](https://github.com/marionebl/commitlint/issues/217)) ([03aeefc](https://github.com/marionebl/commitlint/commit/03aeefc))


### Styles

* validate rule configuration ([edf7187](https://github.com/marionebl/commitlint/commit/edf7187))


### BREAKING CHANGES

* Due to additional validation while reading
commitlint config, previously ignored rule
settings are now considered critical errors
when starting the CLI. The new behaviour is
designed to help developers find issues with
their configuration quicker.




<a name="5.2.6"></a>
## [5.2.6](https://github.com/marionebl/commitlint/compare/v5.2.5...v5.2.6) (2017-12-21)


### Bug Fixes

* ignore semver commits with chore type ([cdbb085](https://github.com/marionebl/commitlint/commit/cdbb085)), closes [#198](https://github.com/marionebl/commitlint/issues/198)




<a name="5.2.5"></a>
## [5.2.5](https://github.com/marionebl/commitlint/compare/v5.2.4...v5.2.5) (2017-12-08)


### Bug Fixes

* **core:** use correct report message [#192](https://github.com/marionebl/commitlint/issues/192) ([e3a78bc](https://github.com/marionebl/commitlint/commit/e3a78bc))




<a name="5.2.4"></a>
## [5.2.4](https://github.com/marionebl/commitlint/compare/v5.2.3...v5.2.4) (2017-12-08)




**Note:** Version bump only for package @commitlint/root

<a name="5.2.3"></a>
## [5.2.3](https://github.com/marionebl/commitlint/compare/v5.2.2...v5.2.3) (2017-12-05)


### Bug Fixes

* **cli:** add support for GIT_PARAMS on windows ([c62bd41](https://github.com/marionebl/commitlint/commit/c62bd41)), closes [#103](https://github.com/marionebl/commitlint/issues/103) [#175](https://github.com/marionebl/commitlint/issues/175)




<a name="5.2.2"></a>
## [5.2.2](https://github.com/marionebl/commitlint/compare/v5.2.1...v5.2.2) (2017-11-30)


### Bug Fixes

* **travis-cli:** read push commits directly ([9bc56c6](https://github.com/marionebl/commitlint/commit/9bc56c6))




<a name="5.2.1"></a>
## [5.2.1](https://github.com/marionebl/commitlint/compare/v5.2.0...v5.2.1) (2017-11-30)


### Bug Fixes

* **travis-cli:** lint ranges only for pr builds ([85b201f](https://github.com/marionebl/commitlint/commit/85b201f))




<a name="5.2.0"></a>
# [5.2.0](https://github.com/marionebl/commitlint/compare/v5.1.3...v5.2.0) (2017-11-30)


### Bug Fixes

* consider pull requests from forks ([4653c2c](https://github.com/marionebl/commitlint/commit/4653c2c))


### Features

* **babel-preset-commitlint:** add jsx tranform ([#163](https://github.com/marionebl/commitlint/issues/163)) ([5190241](https://github.com/marionebl/commitlint/commit/5190241))




<a name="5.1.3"></a>
## [5.1.3](https://github.com/marionebl/commitlint/compare/v5.1.2...v5.1.3) (2017-11-24)


### Bug Fixes

* **config-conventional:** add missing applicable attribute to type-enum ([a8db0b1](https://github.com/marionebl/commitlint/commit/a8db0b1))




<a name="5.1.2"></a>
## [5.1.2](https://github.com/marionebl/commitlint/compare/v5.1.1...v5.1.2) (2017-11-24)


### Bug Fixes

* **prompt:** apply forced cases properly ([3a569a7](https://github.com/marionebl/commitlint/commit/3a569a7)), closes [#145](https://github.com/marionebl/commitlint/issues/145)




<a name="5.1.1"></a>
## [5.1.1](https://github.com/marionebl/commitlint/compare/v5.1.0...v5.1.1) (2017-11-24)


### Bug Fixes

* set access for npm ([8aeaec2](https://github.com/marionebl/commitlint/commit/8aeaec2))




<a name="5.1.0"></a>
# [5.1.0](https://github.com/marionebl/commitlint/compare/v5.0.2...v5.1.0) (2017-11-24)


### Bug Fixes

* update dependency concurrently to v3.5.1 ([#147](https://github.com/marionebl/commitlint/issues/147)) ([a809d0f](https://github.com/marionebl/commitlint/commit/a809d0f))
* **config-conventional:** remove unneeded dependency ([d0e62fd](https://github.com/marionebl/commitlint/commit/d0e62fd))


### Features

* **prompt:** add description for build, ci and revert ([#148](https://github.com/marionebl/commitlint/issues/148)) ([ee6ec6e](https://github.com/marionebl/commitlint/commit/ee6ec6e))
* **travis-cli:** add reusable travis command line interface ([3e6e6a8](https://github.com/marionebl/commitlint/commit/3e6e6a8))
* add conventional-changelog package ([8bb0a85](https://github.com/marionebl/commitlint/commit/8bb0a85))




<a name="5.0.1"></a>
## [5.0.1](https://github.com/marionebl/commitlint/compare/v5.0.0...v5.0.1) (2017-11-19)


### Bug Fixes

* **core:** fall back to globally installed config if available ([#127](https://github.com/marionebl/commitlint/issues/127)) ([8612eb3](https://github.com/marionebl/commitlint/commit/8612eb3))




<a name="5.0.0"></a>
# [5.0.0](https://github.com/marionebl/commitlint/compare/v4.3.0...v5.0.0) (2017-11-18)

### Bug fixes

* core: interprets array values for subject-case correctly

### Features

* config-angular: disallow subject with uppercase first character, #114
* config-angular-type-enum: remove chore type


BREAKING CHANGE

TL;DR
* chore is no longer a valid commit type
* subject with leading capitalized letter are forbidden now

Angular has removed the chore type from their
conventions as of January 2017

See [angular/angular@dff6ee](https://github.com/angular/angular/commit/dff6ee32725197bdb81f3f63c5bd9805f2ed22bb#diff-6a3371457528722a734f3c51d9238c13L204)
for reference

This removes the previous chore type from the list
of allowed types.

Projects using the Angular commit convention will identify commits with chore type as faulty.

Also, formerly working commit messages are now considered problems:

*  type: SOME MESSAGE
*  type: SomeMessage
*  type: Some Message

<a name="4.3.0"></a>
# [4.3.0](https://github.com/marionebl/commitlint/compare/v4.2.2...v4.3.0) (2017-11-08)


### Bug Fixes

* **core:** deprecate nlp rules  ([bbab1d8](https://github.com/marionebl/commitlint/commit/bbab1d8)), closes [#54](https://github.com/marionebl/commitlint/issues/54)
* **core:** ignore comments ([f3beda1](https://github.com/marionebl/commitlint/commit/f3beda1)), closes [#78](https://github.com/marionebl/commitlint/issues/78)


### Features

* add references-empty rule ([4fc8d5d](https://github.com/marionebl/commitlint/commit/4fc8d5d))
