# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [19.8.1](https://github.com/conventional-changelog/commitlint/compare/v19.8.0...v19.8.1) (2025-05-08)

**Note:** Version bump only for package vitest-environment-commitlint





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

**Note:** Version bump only for package @commitlint/test-environment





# [17.7.0](https://github.com/conventional-changelog/commitlint/compare/v17.6.7...v17.7.0) (2023-08-09)

**Note:** Version bump only for package @commitlint/test-environment





# [17.1.0](https://github.com/conventional-changelog/commitlint/compare/v17.0.3...v17.1.0) (2022-08-27)

**Note:** Version bump only for package @commitlint/test-environment





# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)


* chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)


### BREAKING CHANGES

* drop node v12 support

* chore: rename circleci windows job

node version is not defned by the name anyways (i think)





# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

**Note:** Version bump only for package @commitlint/test-environment





# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

**Note:** Version bump only for package @commitlint/test-environment





# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/test-environment





# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)

**Note:** Version bump only for package @commitlint/test-environment





# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)


* chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)


### BREAKING CHANGES

* minimum node version is 12





# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

**Note:** Version bump only for package @commitlint/test-environment





# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

**Note:** Version bump only for package @commitlint/test-environment





# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)


* refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)


### BREAKING CHANGES

* remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

* docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>





## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/test-environment





## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)


### Bug Fixes

* mark internal packages as private [#972](https://github.com/conventional-changelog/commitlint/issues/972) ([#1970](https://github.com/conventional-changelog/commitlint/issues/1970)) ([2351124](https://github.com/conventional-changelog/commitlint/commit/23511248b2b4020ee87d04a838c7ce31e094c128))





# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)


### Bug Fixes

* update dependency tmp to v0.2.1 ([#1817](https://github.com/conventional-changelog/commitlint/issues/1817)) ([0ff72f4](https://github.com/conventional-changelog/commitlint/commit/0ff72f41bd48b3dd37f881f6fb11477d8f643735))





## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/test-environment





# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

**Note:** Version bump only for package @commitlint/test-environment
