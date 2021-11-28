# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)


### Features

* simplify config resolution ([#2398](https://github.com/conventional-changelog/commitlint/issues/2398)) ([8a8384f](https://github.com/conventional-changelog/commitlint/commit/8a8384f3c18954447cb633e76a573e1db71a1440)), closes [#327](https://github.com/conventional-changelog/commitlint/issues/327)





# [14.1.0](https://github.com/conventional-changelog/commitlint/compare/v14.0.0...v14.1.0) (2021-11-01)


### Features

* extend helpUrl from shareable config ([#2846](https://github.com/conventional-changelog/commitlint/issues/2846)) ([d7e2e2b](https://github.com/conventional-changelog/commitlint/commit/d7e2e2b943be383f99f4000b6b6bed0eab03bfcf))





# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/resolve-extends





# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

**Note:** Version bump only for package @commitlint/resolve-extends





# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)


* chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)


### BREAKING CHANGES

* minimum node version is 12





## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

**Note:** Version bump only for package @commitlint/resolve-extends





## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

**Note:** Version bump only for package @commitlint/resolve-extends





## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

**Note:** Version bump only for package @commitlint/resolve-extends





# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)


### Bug Fixes

* **resolve-extends:** `extends` field should be resolved from left to right ([#2070](https://github.com/conventional-changelog/commitlint/issues/2070)) ([c0a86f5](https://github.com/conventional-changelog/commitlint/commit/c0a86f5b5ed6ef071acef4baf38e7fc549fbec37))


### BREAKING CHANGES

* **resolve-extends:** The order of the `extends` resolution is changed from right-to-left to left-to-right





# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

**Note:** Version bump only for package @commitlint/resolve-extends





# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)


* refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)


### BREAKING CHANGES

* remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

* docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>





## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/resolve-extends





## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

**Note:** Version bump only for package @commitlint/resolve-extends





# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

**Note:** Version bump only for package @commitlint/resolve-extends





## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/resolve-extends





# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)


### Bug Fixes

* [#840](https://github.com/conventional-changelog/commitlint/issues/840) add caret to lodash versions ([#843](https://github.com/conventional-changelog/commitlint/issues/843)) ([ffc0bac](https://github.com/conventional-changelog/commitlint/commit/ffc0bac26993acb2ab6a8fa51065f93c92b0d644))


### Features

* add possibility to extend from string ([#865](https://github.com/conventional-changelog/commitlint/issues/865)) ([056c6fe](https://github.com/conventional-changelog/commitlint/commit/056c6fef346b4e84f8b1f93038a9461a7cbd9beb))





## [8.3.5](https://github.com/conventional-changelog/commitlint/compare/v8.3.4...v8.3.5) (2020-01-15)


### Bug Fixes

* **resolve-extends:** move node types to dev dependencies ([#883](https://github.com/conventional-changelog/commitlint/issues/883)) ([b131a18](https://github.com/conventional-changelog/commitlint/commit/b131a18)), closes [#874](https://github.com/conventional-changelog/commitlint/issues/874)





## [8.3.4](https://github.com/conventional-changelog/commitlint/compare/v8.3.3...v8.3.4) (2020-01-03)

**Note:** Version bump only for package @commitlint/resolve-extends





# [8.3.0](https://github.com/conventional-changelog/commitlint/compare/v8.2.0...v8.3.0) (2019-10-16)


### Features

* **resolve-extends:** accept absolute path in extends ([#825](https://github.com/conventional-changelog/commitlint/issues/825)) ([ecac29f](https://github.com/conventional-changelog/commitlint/commit/ecac29f))





# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

**Note:** Version bump only for package @commitlint/resolve-extends





# [8.1.0](https://github.com/conventional-changelog/commitlint/compare/v8.0.0...v8.1.0) (2019-07-15)

**Note:** Version bump only for package @commitlint/resolve-extends





# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)


### Features

* **resolve-extends:** accept short scoped package names in extends ([#597](https://github.com/conventional-changelog/commitlint/issues/597)) ([ba90e8e](https://github.com/conventional-changelog/commitlint/commit/ba90e8e))





<a name="7.5.0"></a>
# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)


### Bug Fixes

* **resolve-extends:** override array on extending rules ([#470](https://github.com/conventional-changelog/commitlint/issues/470)) ([#539](https://github.com/conventional-changelog/commitlint/issues/539)) ([b35000c](https://github.com/conventional-changelog/commitlint/commit/b35000c))
* replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))
* replace old require-uncached with import-fresh ([#533](https://github.com/conventional-changelog/commitlint/issues/533)) ([b636e8c](https://github.com/conventional-changelog/commitlint/commit/b636e8c))




<a name="7.3.1"></a>
## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="7.3.0"></a>
# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)


### Bug Fixes

* update to security-patched dependency versions ([97c033b](https://github.com/conventional-changelog/commitlint/commit/97c033b))




<a name="7.1.2"></a>
## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="6.1.1"></a>
## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="6.1.0"></a>
# [6.1.0](https://github.com/conventional-changelog/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="6.0.4"></a>
## [6.0.4](https://github.com/conventional-changelog/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="6.0.3"></a>
## [6.0.3](https://github.com/conventional-changelog/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="6.0.2"></a>
## [6.0.2](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)




**Note:** Version bump only for package @commitlint/resolve-extends

<a name="6.0.0"></a>
# [6.0.0](https://github.com/conventional-changelog/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)


### Bug Fixes

* correctly resolve parserOpts [#115](https://github.com/conventional-changelog/commitlint/issues/115) [#95](https://github.com/conventional-changelog/commitlint/issues/95) ([1353dd5](https://github.com/conventional-changelog/commitlint/commit/1353dd5))
