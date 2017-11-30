# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
