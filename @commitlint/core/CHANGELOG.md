# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="6.0.3"></a>
## [6.0.3](https://github.com/marionebl/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)


### Bug Fixes

* update dependency cosmiconfig to ^4.0.0 ([#234](https://github.com/marionebl/commitlint/issues/234)) ([7f94ac5](https://github.com/marionebl/commitlint/commit/7f94ac5))




<a name="6.0.2"></a>
## [6.0.2](https://github.com/marionebl/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)




**Note:** Version bump only for package @commitlint/core

<a name="6.0.1"></a>
## [6.0.1](https://github.com/marionebl/commitlint/compare/v6.0.0...v6.0.1) (2018-01-09)




**Note:** Version bump only for package @commitlint/core

<a name="6.0.0"></a>
# [6.0.0](https://github.com/marionebl/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)


### Bug Fixes

* allow [0] shorthand ([84cf938](https://github.com/marionebl/commitlint/commit/84cf938))
* correctly resolve parserOpts [#115](https://github.com/marionebl/commitlint/issues/115) [#95](https://github.com/marionebl/commitlint/issues/95) ([1353dd5](https://github.com/marionebl/commitlint/commit/1353dd5))


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




**Note:** Version bump only for package @commitlint/core

<a name="5.2.0"></a>
# [5.2.0](https://github.com/marionebl/commitlint/compare/v5.1.3...v5.2.0) (2017-11-30)


### Bug Fixes

* consider pull requests from forks ([4653c2c](https://github.com/marionebl/commitlint/commit/4653c2c))




<a name="5.1.1"></a>
## [5.1.1](https://github.com/marionebl/commitlint/compare/v5.1.0...v5.1.1) (2017-11-24)




**Note:** Version bump only for package @commitlint/core

<a name="5.1.0"></a>
# [5.1.0](https://github.com/marionebl/commitlint/compare/v5.0.2...v5.1.0) (2017-11-24)


### Bug Fixes

* update dependency concurrently to v3.5.1 ([#147](https://github.com/marionebl/commitlint/issues/147)) ([a809d0f](https://github.com/marionebl/commitlint/commit/a809d0f))


### Features

* **travis-cli:** add reusable travis command line interface ([3e6e6a8](https://github.com/marionebl/commitlint/commit/3e6e6a8))




<a name="5.0.1"></a>
## [5.0.1](https://github.com/marionebl/commitlint/compare/v5.0.0...v5.0.1) (2017-11-19)


### Bug Fixes

* **core:** fall back to globally installed config if available ([#127](https://github.com/marionebl/commitlint/issues/127)) ([8612eb3](https://github.com/marionebl/commitlint/commit/8612eb3))




<a name="4.3.0"></a>
# [4.3.0](https://github.com/marionebl/commitlint/compare/v4.2.2...v4.3.0) (2017-11-08)


### Bug Fixes

* **core:** deprecate nlp rules  ([bbab1d8](https://github.com/marionebl/commitlint/commit/bbab1d8)), closes [#54](https://github.com/marionebl/commitlint/issues/54)
* **core:** ignore comments ([f3beda1](https://github.com/marionebl/commitlint/commit/f3beda1)), closes [#78](https://github.com/marionebl/commitlint/issues/78)


### Features

* add references-empty rule ([4fc8d5d](https://github.com/marionebl/commitlint/commit/4fc8d5d))




<a name="4.2.2"></a>
## [4.2.2](https://github.com/marionebl/commitlint/compare/v4.2.1...v4.2.2) (2017-10-26)


### Bug Fixes

* default to process.cwd [#100](https://github.com/marionebl/commitlint/issues/100) ([#101](https://github.com/marionebl/commitlint/issues/101)) ([a04f12f](https://github.com/marionebl/commitlint/commit/a04f12f))




<a name="4.2.1"></a>
## [4.2.1](https://github.com/marionebl/commitlint/compare/v4.2.0...v4.2.1) (2017-10-18)


### Bug Fixes

* **core:** consider config outside of current git repo ([f7234b6](https://github.com/marionebl/commitlint/commit/f7234b6))




<a name="4.2.0"></a>
# [4.2.0](https://github.com/marionebl/commitlint/compare/v4.1.1...v4.2.0) (2017-10-14)


### Features

* edit flag now accepts the path to the commit file ([c881433](https://github.com/marionebl/commitlint/commit/c881433)), closes [#40](https://github.com/marionebl/commitlint/issues/40)




<a name="4.1.1"></a>
## [4.1.1](https://github.com/marionebl/commitlint/compare/v4.1.0...v4.1.1) (2017-10-09)




**Note:** Version bump only for package @commitlint/core

<a name="4.1.0"></a>
# [4.1.0](https://github.com/marionebl/commitlint/compare/v4.0.0...v4.1.0) (2017-10-05)


### Features

* **core:** ignore version commits with footers ([3804176](https://github.com/marionebl/commitlint/commit/3804176))




<a name="4.0.0"></a>
# [4.0.0](https://github.com/marionebl/commitlint/compare/v3.2.0...v4.0.0) (2017-10-04)


### Bug Fixes

* incorrect 'git fetch' option ([5826c11](https://github.com/marionebl/commitlint/commit/5826c11))


### Features

* enable alternative config formats  ([#83](https://github.com/marionebl/commitlint/issues/83)) ([91968b8](https://github.com/marionebl/commitlint/commit/91968b8)), closes [#73](https://github.com/marionebl/commitlint/issues/73)
* **core:** add additional case options ([#84](https://github.com/marionebl/commitlint/issues/84)) ([79c0cee](https://github.com/marionebl/commitlint/commit/79c0cee))


### BREAKING CHANGES

* discontinue support of conventional-changelog-lintrc

* test: make git setup reliable




<a name="3.2.0"></a>
# 3.2.0 (2017-09-05)


### Features

* add preset parser  ([5cd2335](https://github.com/marionebl/commitlint/commit/5cd2335))



<a name="3.1.3"></a>
## 3.1.3 (2017-08-21)


### Bug Fixes

* **core:** correct typo in report ([3eb08e8](https://github.com/marionebl/commitlint/commit/3eb08e8))
* **core:** determine git root correctly in sub directories ([#64](https://github.com/marionebl/commitlint/issues/64)) ([d594ec4](https://github.com/marionebl/commitlint/commit/d594ec4)), closes [#62](https://github.com/marionebl/commitlint/issues/62)



<a name="3.1.2"></a>
## 3.1.2 (2017-08-07)


### Bug Fixes

* **core:** harden to-lines typecheck ([248010b](https://github.com/marionebl/commitlint/commit/248010b))



<a name="3.1.1"></a>
## 3.1.1 (2017-08-07)



<a name="3.0.4"></a>
## 3.0.4 (2017-08-04)


### Bug Fixes

* **core:** correct type validation message ([09c2b26](https://github.com/marionebl/commitlint/commit/09c2b26))


### Features

* **core:** add Signed-off-by rule ([cefeb74](https://github.com/marionebl/commitlint/commit/cefeb74))



<a name="3.0.3"></a>
## 3.0.3 (2017-07-16)



<a name="3.0.2"></a>
## 3.0.2 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.1.3"></a>
## 3.1.3 (2017-08-21)


### Bug Fixes

* **core:** correct typo in report ([3eb08e8](https://github.com/marionebl/commitlint/commit/3eb08e8))
* **core:** determine git root correctly in sub directories ([#64](https://github.com/marionebl/commitlint/issues/64)) ([d594ec4](https://github.com/marionebl/commitlint/commit/d594ec4)), closes [#62](https://github.com/marionebl/commitlint/issues/62)



<a name="3.1.2"></a>
## 3.1.2 (2017-08-07)


### Bug Fixes

* **core:** harden to-lines typecheck ([248010b](https://github.com/marionebl/commitlint/commit/248010b))



<a name="3.1.1"></a>
## 3.1.1 (2017-08-07)



<a name="3.0.4"></a>
## 3.0.4 (2017-08-04)


### Bug Fixes

* **core:** correct type validation message ([09c2b26](https://github.com/marionebl/commitlint/commit/09c2b26))


### Features

* **core:** add Signed-off-by rule ([cefeb74](https://github.com/marionebl/commitlint/commit/cefeb74))



<a name="3.0.3"></a>
## 3.0.3 (2017-07-16)



<a name="3.0.2"></a>
## 3.0.2 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.1.2"></a>
## 3.1.2 (2017-08-07)


### Bug Fixes

* **core:** harden to-lines typecheck ([248010b](https://github.com/marionebl/commitlint/commit/248010b))



<a name="3.1.1"></a>
## 3.1.1 (2017-08-07)



<a name="3.0.4"></a>
## 3.0.4 (2017-08-04)


### Bug Fixes

* **core:** correct type validation message ([09c2b26](https://github.com/marionebl/commitlint/commit/09c2b26))


### Features

* **core:** add Signed-off-by rule ([cefeb74](https://github.com/marionebl/commitlint/commit/cefeb74))



<a name="3.0.3"></a>
## 3.0.3 (2017-07-16)



<a name="3.0.2"></a>
## 3.0.2 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.0.4"></a>
## 3.0.4 (2017-08-04)


### Bug Fixes

* **core:** correct type validation message ([09c2b26](https://github.com/marionebl/commitlint/commit/09c2b26))


### Features

* **core:** add Signed-off-by rule ([cefeb74](https://github.com/marionebl/commitlint/commit/cefeb74))



<a name="3.0.3"></a>
## 3.0.3 (2017-07-16)



<a name="3.0.2"></a>
## 3.0.2 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.0.3"></a>
## 3.0.3 (2017-07-16)



<a name="3.0.2"></a>
## 3.0.2 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.0.2"></a>
## 3.0.2 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.0.1"></a>
## 3.0.1 (2017-07-11)


### Bug Fixes

* enable recursive relative extends ([4decd4d](https://github.com/marionebl/commitlint/commit/4decd4d))
* ensure node4 compat ([bfeb653](https://github.com/marionebl/commitlint/commit/bfeb653))
* **core:** ignore version commits with leading whitespace ([9551bd6](https://github.com/marionebl/commitlint/commit/9551bd6))
* **core:** resolve extends relative to config file ([0dd18bc](https://github.com/marionebl/commitlint/commit/0dd18bc))
* use conventional-changelog-angular again ([633d835](https://github.com/marionebl/commitlint/commit/633d835))


### Features

* **core:** do not prefix relative extends ([8fbbaed](https://github.com/marionebl/commitlint/commit/8fbbaed))
* **core:** readd support for .conventional-changelog-lintrc ([02e4f43](https://github.com/marionebl/commitlint/commit/02e4f43))
* **core:** support conventional-changelog-lint-config-* ([c80766b](https://github.com/marionebl/commitlint/commit/c80766b))




<a name="3.0.1"></a>
## 3.0.1 (2017-07-11)


### Bug Fixes

* use conventional-changelog-angular again ([2bcc941](https://github.com/marionebl/commitlint/commit/2bcc941))



<a name="3.0.0"></a>
# 3.0.0 (2017-07-10)


### Bug Fixes

* enable recursive relative extends ([e715d86](https://github.com/marionebl/commitlint/commit/e715d86))
* ensure node4 compat ([a5e658a](https://github.com/marionebl/commitlint/commit/a5e658a))
* **core:** ignore version commits with leading whitespace ([ead20b6](https://github.com/marionebl/commitlint/commit/ead20b6))
* **core:** resolve extends relative to config file ([2257a80](https://github.com/marionebl/commitlint/commit/2257a80))


### Features

* **core:** do not prefix relative extends ([dfb661f](https://github.com/marionebl/commitlint/commit/dfb661f))
* **core:** readd support for .conventional-changelog-lintrc ([030298e](https://github.com/marionebl/commitlint/commit/030298e))
* **core:** support conventional-changelog-lint-config-* ([3092ce5](https://github.com/marionebl/commitlint/commit/3092ce5))




<a name="3.0.0"></a>
# 3.0.0 (2017-07-10)


### Bug Fixes

* enable recursive relative extends ([e715d86](https://github.com/marionebl/commitlint/commit/e715d86))
* ensure node4 compat ([a5e658a](https://github.com/marionebl/commitlint/commit/a5e658a))
* **core:** ignore version commits with leading whitespace ([ead20b6](https://github.com/marionebl/commitlint/commit/ead20b6))
* **core:** resolve extends relative to config file ([2257a80](https://github.com/marionebl/commitlint/commit/2257a80))


### Features

* **core:** do not prefix relative extends ([dfb661f](https://github.com/marionebl/commitlint/commit/dfb661f))
* **core:** readd support for .conventional-changelog-lintrc ([030298e](https://github.com/marionebl/commitlint/commit/030298e))
* **core:** support conventional-changelog-lint-config-* ([3092ce5](https://github.com/marionebl/commitlint/commit/3092ce5))
