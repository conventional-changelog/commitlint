# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [19.8.0](https://github.com/conventional-changelog/commitlint/compare/v19.7.1...v19.8.0) (2025-03-07)


### Reverts

* Revert "fix: improve security validation regex in is-ignored function (#4258)" (#4314) ([b27024a](https://github.com/conventional-changelog/commitlint/commit/b27024a5ae509d1df9373ed712f2279d0bc39170)), closes [#4258](https://github.com/conventional-changelog/commitlint/issues/4258) [#4314](https://github.com/conventional-changelog/commitlint/issues/4314)





## [19.7.1](https://github.com/conventional-changelog/commitlint/compare/v19.7.0...v19.7.1) (2025-02-02)


### Bug Fixes

* improve security validation regex in is-ignored function ([#4258](https://github.com/conventional-changelog/commitlint/issues/4258)) ([7403d63](https://github.com/conventional-changelog/commitlint/commit/7403d6382cc2fb1f066a47d7229593eefe528561))





# [19.6.0](https://github.com/conventional-changelog/commitlint/compare/v19.5.0...v19.6.0) (2024-11-19)


### Features

* **is-ignored:** ignore reapply commits ([#4186](https://github.com/conventional-changelog/commitlint/issues/4186)) ([49ba56d](https://github.com/conventional-changelog/commitlint/commit/49ba56d9dd4c72e918005e6ca62f110a393b8f07))





# [19.5.0](https://github.com/conventional-changelog/commitlint/compare/v19.4.1...v19.5.0) (2024-09-11)

**Note:** Version bump only for package @commitlint/is-ignored





## [19.2.2](https://github.com/conventional-changelog/commitlint/compare/v19.2.1...v19.2.2) (2024-04-14)


### Bug Fixes

* **is-ignored:** ignore "amend!" commits ([#4024](https://github.com/conventional-changelog/commitlint/issues/4024)) ([90078f6](https://github.com/conventional-changelog/commitlint/commit/90078f6a58523e0bde386b9b6aa3c05e8b916653))





## [19.0.3](https://github.com/conventional-changelog/commitlint/compare/v19.0.2...v19.0.3) (2024-02-28)

**Note:** Version bump only for package @commitlint/is-ignored





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





## [18.6.1](https://github.com/conventional-changelog/commitlint/compare/v18.6.0...v18.6.1) (2024-02-13)


### Bug Fixes

* update dependency semver to v7.6.0 ([#3900](https://github.com/conventional-changelog/commitlint/issues/3900)) ([df33003](https://github.com/conventional-changelog/commitlint/commit/df33003dce77bc5ff48678cddf9401dffedaeb57))





# [18.6.0](https://github.com/conventional-changelog/commitlint/compare/v18.5.1...v18.6.0) (2024-01-25)

**Note:** Version bump only for package @commitlint/is-ignored





## [18.4.4](https://github.com/conventional-changelog/commitlint/compare/v18.4.3...v18.4.4) (2024-01-04)

**Note:** Version bump only for package @commitlint/is-ignored





## [18.4.3](https://github.com/conventional-changelog/commitlint/compare/v18.4.2...v18.4.3) (2023-11-21)

**Note:** Version bump only for package @commitlint/is-ignored





## [18.4.2](https://github.com/conventional-changelog/commitlint/compare/v18.4.1...v18.4.2) (2023-11-16)

**Note:** Version bump only for package @commitlint/is-ignored





# [18.4.0](https://github.com/conventional-changelog/commitlint/compare/v18.3.0...v18.4.0) (2023-11-10)

**Note:** Version bump only for package @commitlint/is-ignored





# [18.1.0](https://github.com/conventional-changelog/commitlint/compare/v18.0.0...v18.1.0) (2023-10-25)

**Note:** Version bump only for package @commitlint/is-ignored





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

**Note:** Version bump only for package @commitlint/is-ignored





# [17.8.0](https://github.com/conventional-changelog/commitlint/compare/v17.7.2...v17.8.0) (2023-10-14)

**Note:** Version bump only for package @commitlint/is-ignored





# [17.7.0](https://github.com/conventional-changelog/commitlint/compare/v17.6.7...v17.7.0) (2023-08-09)

**Note:** Version bump only for package @commitlint/is-ignored





## [17.6.7](https://github.com/conventional-changelog/commitlint/compare/v17.6.6...v17.6.7) (2023-07-19)

**Note:** Version bump only for package @commitlint/is-ignored





## [17.6.6](https://github.com/conventional-changelog/commitlint/compare/v17.6.5...v17.6.6) (2023-06-24)

**Note:** Version bump only for package @commitlint/is-ignored





## [17.6.5](https://github.com/conventional-changelog/commitlint/compare/v17.6.4...v17.6.5) (2023-05-30)

**Note:** Version bump only for package @commitlint/is-ignored





## [17.6.3](https://github.com/conventional-changelog/commitlint/compare/v17.6.2...v17.6.3) (2023-05-04)


### Bug Fixes

* update dependency semver to v7.5.0 ([#3604](https://github.com/conventional-changelog/commitlint/issues/3604)) ([01e35e0](https://github.com/conventional-changelog/commitlint/commit/01e35e06cf9123a0c367e0d0ac79988ec4334e6a))





## [17.4.4](https://github.com/conventional-changelog/commitlint/compare/v17.4.3...v17.4.4) (2023-02-17)

**Note:** Version bump only for package @commitlint/is-ignored





## [17.4.2](https://github.com/conventional-changelog/commitlint/compare/v17.4.1...v17.4.2) (2023-01-12)

**Note:** Version bump only for package @commitlint/is-ignored





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

### Bug Fixes

- update dependency semver to v7.3.8 ([#3441](https://github.com/conventional-changelog/commitlint/issues/3441)) ([7599ad6](https://github.com/conventional-changelog/commitlint/commit/7599ad6ab622ecbb6efa9ddba7acc3bbf66db5b5))

# [17.2.0](https://github.com/conventional-changelog/commitlint/compare/v17.1.2...v17.2.0) (2022-10-31)

**Note:** Version bump only for package @commitlint/is-ignored

# [17.1.0](https://github.com/conventional-changelog/commitlint/compare/v17.0.3...v17.1.0) (2022-08-27)

**Note:** Version bump only for package @commitlint/is-ignored

## [17.0.3](https://github.com/conventional-changelog/commitlint/compare/v17.0.2...v17.0.3) (2022-06-25)

**Note:** Version bump only for package @commitlint/is-ignored

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

## [16.2.4](https://github.com/conventional-changelog/commitlint/compare/v16.2.3...v16.2.4) (2022-04-28)

### Bug Fixes

- update dependency semver to v7.3.6 ([#3112](https://github.com/conventional-changelog/commitlint/issues/3112)) ([ad886fd](https://github.com/conventional-changelog/commitlint/commit/ad886fd7ea46bc2df346099f9d4f10defd51fe75))
- update dependency semver to v7.3.7 ([#3119](https://github.com/conventional-changelog/commitlint/issues/3119)) ([c9c49b2](https://github.com/conventional-changelog/commitlint/commit/c9c49b2de935528d84a817de750cd65b8f765c48))

## [16.2.1](https://github.com/conventional-changelog/commitlint/compare/v16.2.0...v16.2.1) (2022-02-13)

**Note:** Version bump only for package @commitlint/is-ignored

# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

### Bug Fixes

- **is-ignored:** ignore merge tag commit messages ([#2920](https://github.com/conventional-changelog/commitlint/issues/2920)) ([914782a](https://github.com/conventional-changelog/commitlint/commit/914782aad70d353baf4d9fbbf9824c0211241484))

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

**Note:** Version bump only for package @commitlint/is-ignored

# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/is-ignored

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

**Note:** Version bump only for package @commitlint/is-ignored

# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)

**Note:** Version bump only for package @commitlint/is-ignored

# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)

- chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)

### BREAKING CHANGES

- minimum node version is 12

## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

**Note:** Version bump only for package @commitlint/is-ignored

## [12.1.2](https://github.com/conventional-changelog/commitlint/compare/v12.1.1...v12.1.2) (2021-04-29)

**Note:** Version bump only for package @commitlint/is-ignored

## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

### Bug Fixes

- update dependency semver to v7.3.5 ([#2519](https://github.com/conventional-changelog/commitlint/issues/2519)) ([5113f22](https://github.com/conventional-changelog/commitlint/commit/5113f22c620e7b187fd558e5befa541b448ea18b))

# [12.1.0](https://github.com/conventional-changelog/commitlint/compare/v12.0.1...v12.1.0) (2021-03-06)

**Note:** Version bump only for package @commitlint/is-ignored

## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

**Note:** Version bump only for package @commitlint/is-ignored

# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

### Bug Fixes

- update dependency semver to v7.3.4 ([#2336](https://github.com/conventional-changelog/commitlint/issues/2336)) ([790b61a](https://github.com/conventional-changelog/commitlint/commit/790b61afa668d0eab80bbe49db58d3d5d29bb16e))
- **is-ignored:** ignore azure devops messages ([#2230](https://github.com/conventional-changelog/commitlint/issues/2230)) ([fe29ce7](https://github.com/conventional-changelog/commitlint/commit/fe29ce76bd87d5b42048228fbf0f47cc8d5411ec))

# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

**Note:** Version bump only for package @commitlint/is-ignored

# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)

- refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)

### BREAKING CHANGES

- remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

- docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>

## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/is-ignored

## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

**Note:** Version bump only for package @commitlint/is-ignored

# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

### Bug Fixes

- update dependency semver to v7.3.2 ([#1369](https://github.com/conventional-changelog/commitlint/issues/1369)) ([3c09722](https://github.com/conventional-changelog/commitlint/commit/3c09722d2db85a94cd1f4bf25c6b4251b2c41bbb))

## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/is-ignored

# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

### Bug Fixes

- update dependency semver to v7.1.3 ([#995](https://github.com/conventional-changelog/commitlint/issues/995)) ([4ee307a](https://github.com/conventional-changelog/commitlint/commit/4ee307a1f8c861ae5d8a038560d166c5d00ea8ba))

## [8.3.5](https://github.com/conventional-changelog/commitlint/compare/v8.3.4...v8.3.5) (2020-01-15)

### Bug Fixes

- **is-ignored:** move types to dev dependencies ([#897](https://github.com/conventional-changelog/commitlint/issues/897)) ([aabc549](https://github.com/conventional-changelog/commitlint/commit/aabc549))

## [8.3.4](https://github.com/conventional-changelog/commitlint/compare/v8.3.3...v8.3.4) (2020-01-03)

**Note:** Version bump only for package @commitlint/is-ignored

# [8.3.0](https://github.com/conventional-changelog/commitlint/compare/v8.2.0...v8.3.0) (2019-10-16)

**Note:** Version bump only for package @commitlint/is-ignored

# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

**Note:** Version bump only for package @commitlint/is-ignored

# [8.1.0](https://github.com/conventional-changelog/commitlint/compare/v8.0.0...v8.1.0) (2019-07-15)

**Note:** Version bump only for package @commitlint/is-ignored

# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)

### Features

- config based is-ignored overrides ([#595](https://github.com/conventional-changelog/commitlint/issues/595)) ([2434d71](https://github.com/conventional-changelog/commitlint/commit/2434d71))

## [7.5.1](https://github.com/conventional-changelog/commitlint/compare/v7.5.0...v7.5.1) (2019-02-09)

### Bug Fixes

- **is-ignored:** ignore bitbuckets automatic merge ([#573](https://github.com/conventional-changelog/commitlint/issues/573)) ([e5bdc5c](https://github.com/conventional-changelog/commitlint/commit/e5bdc5c))

<a name="7.5.0"></a>

# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)

### Bug Fixes

- replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))

<a name="7.3.1"></a>

## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="7.3.0"></a>

# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="7.2.1"></a>

## [7.2.1](https://github.com/conventional-changelog/commitlint/compare/v7.2.0...v7.2.1) (2018-10-11)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="7.2.0"></a>

# [7.2.0](https://github.com/conventional-changelog/commitlint/compare/v7.1.2...v7.2.0) (2018-10-05)

### Bug Fixes

- ignore merge messages with text after newline ([b32bc93](https://github.com/conventional-changelog/commitlint/commit/b32bc93))
- use grouped regex to ignore merge commits ([#439](https://github.com/conventional-changelog/commitlint/issues/439)) ([905e9d5](https://github.com/conventional-changelog/commitlint/commit/905e9d5))

<a name="7.1.2"></a>

## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="7.1.0"></a>

# [7.1.0](https://github.com/conventional-changelog/commitlint/compare/v7.0.1...v7.1.0) (2018-08-29)

### Features

- **wildcards:** add new wildcard patterns [#315](https://github.com/conventional-changelog/commitlint/issues/315) ([e9ea17f](https://github.com/conventional-changelog/commitlint/commit/e9ea17f))

<a name="6.1.1"></a>

## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="6.1.0"></a>

# [6.1.0](https://github.com/conventional-changelog/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="6.0.4"></a>

## [6.0.4](https://github.com/conventional-changelog/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)

**Note:** Version bump only for package @commitlint/is-ignored

<a name="6.0.3"></a>

## [6.0.3](https://github.com/conventional-changelog/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)

### Bug Fixes

- update dependency semver to v5.5.0 ([#236](https://github.com/conventional-changelog/commitlint/issues/236)) ([6c52bd9](https://github.com/conventional-changelog/commitlint/commit/6c52bd9))

<a name="6.0.2"></a>

## [6.0.2](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)

### Bug Fixes

- ignore branch merges with multiple newlines ([#227](https://github.com/conventional-changelog/commitlint/issues/227)) ([1f0c5ca](https://github.com/conventional-changelog/commitlint/commit/1f0c5ca))

<a name="6.0.0"></a>

# [6.0.0](https://github.com/conventional-changelog/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)

### Bug Fixes

- ignore branch merges with newlines ([#214](https://github.com/conventional-changelog/commitlint/issues/214)) ([c94c4dc](https://github.com/conventional-changelog/commitlint/commit/c94c4dc))
