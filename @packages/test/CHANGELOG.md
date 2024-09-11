# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [19.5.0](https://github.com/conventional-changelog/commitlint/compare/v19.4.1...v19.5.0) (2024-09-11)

**Note:** Version bump only for package @commitlint/test





# [19.0.0](https://github.com/conventional-changelog/commitlint/compare/v18.6.2...v19.0.0) (2024-02-27)


* feat!: migrate to pure ESM (#3850) ([3423735](https://github.com/conventional-changelog/commitlint/commit/342373559bdf7c783c4ef37ff05dc38a5f681159)), closes [#3850](https://github.com/conventional-changelog/commitlint/issues/3850)


### Reverts

* Revert "chore!: minimum node version v20" ([2816783](https://github.com/conventional-changelog/commitlint/commit/2816783d00e7eb967de3ac9347c2fc43dc8b94fa))


### BREAKING CHANGES

* migrate to pure ESM

* feat: migrate to pure ESM

* chore: update snapshot

* fix: load `parserPreset` with another `await`

* test: migrate to vitest

* test: remove no replacement `--runInBand` test-ci script

* chore: fix code reviews

* refactor(load): rewrite resolve logic

* fix(config-nx-scopes): fix syntax error

* feat(resolve-extends): add resolveFrom and loadParserPreset

* feat(load): use resolveFrom and loadParserPreset from resolve-extends

* test: include only @commitlint/* packages src in coverage

* test: explicit import vitest utilities

* test: remove @jest/globals from dependencies

* fix(resolve-extends): `resolveFrom` output should be platform aware

* test: restore NO_COLOR to test script

* chore: fix linting issues

* fix: should use fileURLToPath instead of pathname for Windows compatibility

* Apply suggestions from code review

* fix: should reuse `cli` instead call `yargs()`

* feat(cli): set terminalWidth as wrap to avoid work break on help

* Update .eslintrc.cjs

* feat: migrate @commitlint/config-conventional to pure ESM





# [18.0.0](https://github.com/conventional-changelog/commitlint/compare/v17.8.1...v18.0.0) (2023-10-20)


* chore!: minimum node version v18 (#3644) ([5b4aeaf](https://github.com/conventional-changelog/commitlint/commit/5b4aeaf4f01c2726a7bc8631a23bb34c849baad2)), closes [#3644](https://github.com/conventional-changelog/commitlint/issues/3644)


### BREAKING CHANGES

* drop node v14 and v16 support

* chore: remove unused types

* docs: prepare node update and new release

* chore!: minimum TS version v5
* drop TS v4 support

* ci: remove node v14/16 checks

* chore: adjust node types to minimal supported version

* chore!: further major versions of other deps
* upgrade conventional-changelog-conventionalcommits, conventional-commits-parser, conventional-changelog-atom, 

* docs: simplify releases and remove roadmap





## [17.8.1](https://github.com/conventional-changelog/commitlint/compare/v17.8.0...v17.8.1) (2023-10-20)

**Note:** Version bump only for package @commitlint/test





## [17.4.2](https://github.com/conventional-changelog/commitlint/compare/v17.4.1...v17.4.2) (2023-01-12)


### Bug Fixes

* update dependency @types/fs-extra to v11 ([#3494](https://github.com/conventional-changelog/commitlint/issues/3494)) ([8f553c7](https://github.com/conventional-changelog/commitlint/commit/8f553c7603e3ee0f435d878e396eec899a213de8))





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

### Bug Fixes

- update dependency fs-extra to v11 ([#3460](https://github.com/conventional-changelog/commitlint/issues/3460)) ([a437923](https://github.com/conventional-changelog/commitlint/commit/a43792388e0d9707da770b26592c5e31553384a1))

# [17.2.0](https://github.com/conventional-changelog/commitlint/compare/v17.1.2...v17.2.0) (2022-10-31)

**Note:** Version bump only for package @commitlint/test

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

**Note:** Version bump only for package @commitlint/test

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

### Tests

- **config-lerna-scopes:** reuse npm bootstrap to simplify tests ([#2479](https://github.com/conventional-changelog/commitlint/issues/2479)) ([9a7a43a](https://github.com/conventional-changelog/commitlint/commit/9a7a43aa8a7eca18f2fe05c78d27dcb1a128930c)), closes [#2447](https://github.com/conventional-changelog/commitlint/issues/2447)

### BREAKING CHANGES

- **config-lerna-scopes:** upgrade to lerna v4

Co-authored-by: Renovate Bot <bot@renovateapp.com>
Co-authored-by: escapedcat <github@htmlcss.de>

- test(config-lerna-scopes): reuse npm bootstrap to simplify tests

- test(config-lerna-scopes): reuse npm bootstrap to simplify tests

- test: fix issue after merge

- test: one more fix after merge

Co-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>
Co-authored-by: Renovate Bot <bot@renovateapp.com>
Co-authored-by: escapedcat <github@htmlcss.de>

# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/test

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

**Note:** Version bump only for package @commitlint/test

# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)

- chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)

### BREAKING CHANGES

- minimum node version is 12

## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

### Bug Fixes

- update dependency fs-extra to v10 ([#2575](https://github.com/conventional-changelog/commitlint/issues/2575)) ([d47d2b5](https://github.com/conventional-changelog/commitlint/commit/d47d2b595b980adadd4fb8ff198c1914caeff18f))

# [12.1.0](https://github.com/conventional-changelog/commitlint/compare/v12.0.1...v12.1.0) (2021-03-06)

**Note:** Version bump only for package @commitlint/test

## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

**Note:** Version bump only for package @commitlint/test

# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

### Bug Fixes

- update dependency execa to v5 ([#2341](https://github.com/conventional-changelog/commitlint/issues/2341)) ([f349df9](https://github.com/conventional-changelog/commitlint/commit/f349df90f08096a9bcad46b5e55b411aac327a24))
- update dependency pkg-dir to v5 ([#2168](https://github.com/conventional-changelog/commitlint/issues/2168)) ([b9d1c84](https://github.com/conventional-changelog/commitlint/commit/b9d1c8462950303a7695f248849dd9f6a58b5a9a))

# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

- refactor!: drop support for lerna v2 ([59667b3](https://github.com/conventional-changelog/commitlint/commit/59667b376118323b1312d3d1084b9178918f3d23))

### Bug Fixes

- update dependency @types/fs-extra to ^9.0.1 ([#2088](https://github.com/conventional-changelog/commitlint/issues/2088)) ([cb1028e](https://github.com/conventional-changelog/commitlint/commit/cb1028ef2700d86991c69a1e2ad391bc1bdc9d90))

### BREAKING CHANGES

- remove lerna v2 support and tests

# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)

### Bug Fixes

- update dependency execa to v4 ([#1936](https://github.com/conventional-changelog/commitlint/issues/1936)) ([8efb441](https://github.com/conventional-changelog/commitlint/commit/8efb44193058d286f7325327a6d33936b273ec91))
- update dependency fs-extra to v9 ([#1018](https://github.com/conventional-changelog/commitlint/issues/1018)) ([2df49fa](https://github.com/conventional-changelog/commitlint/commit/2df49fac907993ae78199a1012e918b0e2ff5621))

- refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)

### BREAKING CHANGES

- remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

- docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>

## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/test

## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

### Bug Fixes

- mark internal packages as private [#972](https://github.com/conventional-changelog/commitlint/issues/972) ([#1970](https://github.com/conventional-changelog/commitlint/issues/1970)) ([2351124](https://github.com/conventional-changelog/commitlint/commit/23511248b2b4020ee87d04a838c7ce31e094c128))

# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

### Bug Fixes

- update dependency tmp to v0.2.1 ([#1817](https://github.com/conventional-changelog/commitlint/issues/1817)) ([0ff72f4](https://github.com/conventional-changelog/commitlint/commit/0ff72f41bd48b3dd37f881f6fb11477d8f643735))

## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/test

# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

**Note:** Version bump only for package @commitlint/test

# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

**Note:** Version bump only for package @commitlint/test

# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)

**Note:** Version bump only for package @commitlint/test

<a name="7.5.0"></a>

# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)

### Bug Fixes

- replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))

<a name="7.3.1"></a>

## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)

**Note:** Version bump only for package @commitlint/test

<a name="7.3.0"></a>

# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)

**Note:** Version bump only for package @commitlint/test

<a name="7.1.2"></a>

## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)

**Note:** Version bump only for package @commitlint/test

<a name="6.1.1"></a>

## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)

**Note:** Version bump only for package @commitlint/test

<a name="6.1.0"></a>

# [6.1.0](https://github.com/conventional-changelog/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)

**Note:** Version bump only for package @commitlint/test

<a name="6.0.4"></a>

## [6.0.4](https://github.com/conventional-changelog/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)

**Note:** Version bump only for package @commitlint/test

<a name="6.0.3"></a>

## [6.0.3](https://github.com/conventional-changelog/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)

**Note:** Version bump only for package @commitlint/test

<a name="6.0.2"></a>

## [6.0.2](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)

**Note:** Version bump only for package @commitlint/test

<a name="6.0.0"></a>

# [6.0.0](https://github.com/conventional-changelog/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)

**Note:** Version bump only for package @commitlint/test

<a name="5.2.6"></a>

## [5.2.6](https://github.com/conventional-changelog/commitlint/compare/v5.2.5...v5.2.6) (2017-12-21)

**Note:** Version bump only for package @commitlint/test

<a name="5.2.0"></a>

# [5.2.0](https://github.com/conventional-changelog/commitlint/compare/v5.1.3...v5.2.0) (2017-11-30)

**Note:** Version bump only for package @commitlint/test

<a name="5.1.1"></a>

## [5.1.1](https://github.com/conventional-changelog/commitlint/compare/v5.1.0...v5.1.1) (2017-11-24)

**Note:** Version bump only for package @commitlint/test

<a name="5.1.0"></a>

# [5.1.0](https://github.com/conventional-changelog/commitlint/compare/v5.0.2...v5.1.0) (2017-11-24)

### Bug Fixes

- update dependency concurrently to v3.5.1 ([#147](https://github.com/conventional-changelog/commitlint/issues/147)) ([a809d0f](https://github.com/conventional-changelog/commitlint/commit/a809d0f))

### Features

- **travis-cli:** add reusable travis command line interface ([3e6e6a8](https://github.com/conventional-changelog/commitlint/commit/3e6e6a8))

<a name="5.0.1"></a>

## [5.0.1](https://github.com/conventional-changelog/commitlint/compare/v5.0.0...v5.0.1) (2017-11-19)

### Bug Fixes

- **core:** fall back to globally installed config if available ([#127](https://github.com/conventional-changelog/commitlint/issues/127)) ([8612eb3](https://github.com/conventional-changelog/commitlint/commit/8612eb3))

<a name="4.3.0"></a>

# [4.3.0](https://github.com/conventional-changelog/commitlint/compare/v4.2.2...v4.3.0) (2017-11-08)

**Note:** Version bump only for package @commitlint/test

<a name="4.2.1"></a>

## [4.2.1](https://github.com/conventional-changelog/commitlint/compare/v4.2.0...v4.2.1) (2017-10-18)

### Bug Fixes

- **core:** consider config outside of current git repo ([f7234b6](https://github.com/conventional-changelog/commitlint/commit/f7234b6))

<a name="4.2.0"></a>

# [4.2.0](https://github.com/conventional-changelog/commitlint/compare/v4.1.1...v4.2.0) (2017-10-14)

**Note:** Version bump only for package @commitlint/test

<a name="4.1.1"></a>

## [4.1.1](https://github.com/conventional-changelog/commitlint/compare/v4.1.0...v4.1.1) (2017-10-09)

**Note:** Version bump only for package @commitlint/test
