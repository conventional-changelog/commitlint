# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [20.3.1](https://github.com/conventional-changelog/commitlint/compare/v20.3.0...v20.3.1) (2026-01-08)

**Note:** Version bump only for package @commitlint/ensure





# [20.2.0](https://github.com/conventional-changelog/commitlint/compare/v20.1.0...v20.2.0) (2025-12-05)


### Bug Fixes

* update dependency glob to v11 [security] ([#4561](https://github.com/conventional-changelog/commitlint/issues/4561)) ([a89a08b](https://github.com/conventional-changelog/commitlint/commit/a89a08b2fd3c72a6cd09e00508fc2e972f27c64c))





# [20.0.0](https://github.com/conventional-changelog/commitlint/compare/v19.9.1...v20.0.0) (2025-09-25)


* feat(rules)!: make body-max-line-length ignore lines with URLs (#4486) ([2f37a88](https://github.com/conventional-changelog/commitlint/commit/2f37a886be4b07bcd8e1126cc6a13256e7b6cc37)), closes [#4486](https://github.com/conventional-changelog/commitlint/issues/4486)


### BREAKING CHANGES

* when lines contain URLs exceeding the maximum
line length `body-max-line-length` will be ignored





## [19.8.1](https://github.com/conventional-changelog/commitlint/compare/v19.8.0...v19.8.1) (2025-05-08)

**Note:** Version bump only for package @commitlint/ensure





# [19.8.0](https://github.com/conventional-changelog/commitlint/compare/v19.7.1...v19.8.0) (2025-03-07)


### Performance Improvements

* use `node:` prefix to bypass require.cache call for builtins ([#4302](https://github.com/conventional-changelog/commitlint/issues/4302)) ([0cd8f41](https://github.com/conventional-changelog/commitlint/commit/0cd8f410573fe11383f788b1ceb7e0946143591d))





# [19.5.0](https://github.com/conventional-changelog/commitlint/compare/v19.4.1...v19.5.0) (2024-09-11)

**Note:** Version bump only for package @commitlint/ensure





## [19.0.3](https://github.com/conventional-changelog/commitlint/compare/v19.0.2...v19.0.3) (2024-02-28)

**Note:** Version bump only for package @commitlint/ensure





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

**Note:** Version bump only for package @commitlint/ensure





# [18.6.0](https://github.com/conventional-changelog/commitlint/compare/v18.5.1...v18.6.0) (2024-01-25)

**Note:** Version bump only for package @commitlint/ensure





## [18.4.4](https://github.com/conventional-changelog/commitlint/compare/v18.4.3...v18.4.4) (2024-01-04)

**Note:** Version bump only for package @commitlint/ensure





## [18.4.3](https://github.com/conventional-changelog/commitlint/compare/v18.4.2...v18.4.3) (2023-11-21)

**Note:** Version bump only for package @commitlint/ensure





# [18.4.0](https://github.com/conventional-changelog/commitlint/compare/v18.3.0...v18.4.0) (2023-11-10)

**Note:** Version bump only for package @commitlint/ensure





# [18.1.0](https://github.com/conventional-changelog/commitlint/compare/v18.0.0...v18.1.0) (2023-10-25)

**Note:** Version bump only for package @commitlint/ensure





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

**Note:** Version bump only for package @commitlint/ensure





## [17.6.7](https://github.com/conventional-changelog/commitlint/compare/v17.6.6...v17.6.7) (2023-07-19)

**Note:** Version bump only for package @commitlint/ensure





## [17.4.4](https://github.com/conventional-changelog/commitlint/compare/v17.4.3...v17.4.4) (2023-02-17)

**Note:** Version bump only for package @commitlint/ensure





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

**Note:** Version bump only for package @commitlint/ensure

# [17.3.0](https://github.com/conventional-changelog/commitlint/compare/v17.2.1...v17.3.0) (2022-11-21)

**Note:** Version bump only for package @commitlint/ensure

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

## [16.2.1](https://github.com/conventional-changelog/commitlint/compare/v16.2.0...v16.2.1) (2022-02-13)

**Note:** Version bump only for package @commitlint/ensure

# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

**Note:** Version bump only for package @commitlint/ensure

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

**Note:** Version bump only for package @commitlint/ensure

# [14.1.0](https://github.com/conventional-changelog/commitlint/compare/v14.0.0...v14.1.0) (2021-11-01)

**Note:** Version bump only for package @commitlint/ensure

# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/ensure

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

**Note:** Version bump only for package @commitlint/ensure

# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)

**Note:** Version bump only for package @commitlint/ensure

# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)

- chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)

### BREAKING CHANGES

- minimum node version is 12

## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

**Note:** Version bump only for package @commitlint/ensure

## [12.1.2](https://github.com/conventional-changelog/commitlint/compare/v12.1.1...v12.1.2) (2021-04-29)

**Note:** Version bump only for package @commitlint/ensure

## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

**Note:** Version bump only for package @commitlint/ensure

## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

**Note:** Version bump only for package @commitlint/ensure

# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

**Note:** Version bump only for package @commitlint/ensure

# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

**Note:** Version bump only for package @commitlint/ensure

# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)

- refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)

### BREAKING CHANGES

- remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

- docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>

## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/ensure

## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

**Note:** Version bump only for package @commitlint/ensure

# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

**Note:** Version bump only for package @commitlint/ensure

## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/ensure

# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

### Bug Fixes

- [#840](https://github.com/conventional-changelog/commitlint/issues/840) add caret to lodash versions ([#843](https://github.com/conventional-changelog/commitlint/issues/843)) ([ffc0bac](https://github.com/conventional-changelog/commitlint/commit/ffc0bac26993acb2ab6a8fa51065f93c92b0d644))

## [8.3.4](https://github.com/conventional-changelog/commitlint/compare/v8.3.3...v8.3.4) (2020-01-03)

**Note:** Version bump only for package @commitlint/ensure

# [8.3.0](https://github.com/conventional-changelog/commitlint/compare/v8.2.0...v8.3.0) (2019-10-16)

**Note:** Version bump only for package @commitlint/ensure

# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

**Note:** Version bump only for package @commitlint/ensure

# [8.1.0](https://github.com/conventional-changelog/commitlint/compare/v8.0.0...v8.1.0) (2019-07-15)

**Note:** Version bump only for package @commitlint/ensure

# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)

**Note:** Version bump only for package @commitlint/ensure

## [7.5.2](https://github.com/conventional-changelog/commitlint/compare/v7.5.1...v7.5.2) (2019-02-11)

### Bug Fixes

- failing sentence-case for subjects with slashes ([#574](https://github.com/conventional-changelog/commitlint/issues/574)) ([48a8602](https://github.com/conventional-changelog/commitlint/commit/48a8602))

<a name="7.5.0"></a>

# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)

### Bug Fixes

- `sentence-case` allow upper-case characters in first word ([#531](https://github.com/conventional-changelog/commitlint/issues/531)) ([5a6a4a8](https://github.com/conventional-changelog/commitlint/commit/5a6a4a8)), closes [#211](https://github.com/conventional-changelog/commitlint/issues/211)
- replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))
- slash in scope [#291](https://github.com/conventional-changelog/commitlint/issues/291) ([#529](https://github.com/conventional-changelog/commitlint/issues/529)) ([b2b63e5](https://github.com/conventional-changelog/commitlint/commit/b2b63e5))

<a name="7.3.1"></a>

## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)

**Note:** Version bump only for package @commitlint/ensure

<a name="7.3.0"></a>

# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)

### Bug Fixes

- fall back to conventional commit-parser settings for missing keys ([#496](https://github.com/conventional-changelog/commitlint/issues/496)) ([831a141](https://github.com/conventional-changelog/commitlint/commit/831a141)), closes [#399](https://github.com/conventional-changelog/commitlint/issues/399)
- update to security-patched dependency versions ([97c033b](https://github.com/conventional-changelog/commitlint/commit/97c033b))

<a name="7.2.0"></a>

# [7.2.0](https://github.com/conventional-changelog/commitlint/compare/v7.1.2...v7.2.0) (2018-10-05)

### Bug Fixes

- handle case rules for numerics correctly ([cadcfed](https://github.com/conventional-changelog/commitlint/commit/cadcfed))

<a name="7.1.2"></a>

## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)

**Note:** Version bump only for package @commitlint/ensure

<a name="7.1.0"></a>

# [7.1.0](https://github.com/conventional-changelog/commitlint/compare/v7.0.1...v7.1.0) (2018-08-29)

### Features

- add max line length to body/footer ([542f50e](https://github.com/conventional-changelog/commitlint/commit/542f50e))

<a name="6.1.1"></a>

## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)

### Bug Fixes

- **ensure:** ignore word delimiters for case matching [#291](https://github.com/conventional-changelog/commitlint/issues/291) ([fa69299](https://github.com/conventional-changelog/commitlint/commit/fa69299))

<a name="6.1.0"></a>

# [6.1.0](https://github.com/conventional-changelog/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)

**Note:** Version bump only for package @commitlint/ensure

<a name="6.0.4"></a>

## [6.0.4](https://github.com/conventional-changelog/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)

**Note:** Version bump only for package @commitlint/ensure

<a name="6.0.3"></a>

## [6.0.3](https://github.com/conventional-changelog/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)

**Note:** Version bump only for package @commitlint/ensure

<a name="6.0.2"></a>

## [6.0.2](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)

**Note:** Version bump only for package @commitlint/ensure

<a name="6.0.0"></a>

# [6.0.0](https://github.com/conventional-changelog/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)

### Bug Fixes

- sanitize ensure.case [#211](https://github.com/conventional-changelog/commitlint/issues/211) ([#217](https://github.com/conventional-changelog/commitlint/issues/217)) ([03aeefc](https://github.com/conventional-changelog/commitlint/commit/03aeefc))
