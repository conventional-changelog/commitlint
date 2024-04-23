# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [19.3.0](https://github.com/conventional-changelog/commitlint/compare/v19.2.2...v19.3.0) (2024-04-23)

**Note:** Version bump only for package @commitlint/config-nx-scopes





## [19.2.1](https://github.com/conventional-changelog/commitlint/compare/v19.2.0...v19.2.1) (2024-03-19)


### Bug Fixes

* **config-nx-scopes:** include file extension in nx imports ([#3979](https://github.com/conventional-changelog/commitlint/issues/3979)) ([583250b](https://github.com/conventional-changelog/commitlint/commit/583250b919cf1eb338de3e3f5c848fff611a6212))





# [19.1.0](https://github.com/conventional-changelog/commitlint/compare/v19.0.3...v19.1.0) (2024-03-12)


### Bug Fixes

* add `main` and `types` keys in package.json ([#3953](https://github.com/conventional-changelog/commitlint/issues/3953)) ([7ddaad4](https://github.com/conventional-changelog/commitlint/commit/7ddaad4bc4e71afe89f25cc02d3e19beba1ce6cd))





## [19.0.3](https://github.com/conventional-changelog/commitlint/compare/v19.0.2...v19.0.3) (2024-02-28)

**Note:** Version bump only for package @commitlint/config-nx-scopes





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

**Note:** Version bump only for package @commitlint/config-nx-scopes





## [18.5.1](https://github.com/conventional-changelog/commitlint/compare/v18.5.0...v18.5.1) (2024-01-22)


### Bug Fixes

* **config-nx-scopes:** replace import with require ([#3865](https://github.com/conventional-changelog/commitlint/issues/3865)) ([#3867](https://github.com/conventional-changelog/commitlint/issues/3867)) ([3ede3e0](https://github.com/conventional-changelog/commitlint/commit/3ede3e0e9d5af1302fff896aba049b487b90c0bf))





# [18.5.0](https://github.com/conventional-changelog/commitlint/compare/v18.4.4...v18.5.0) (2024-01-22)


### Bug Fixes

* **config-nx-scopes:** restore compatibility with nx 17.2.0 and higher ([#3855](https://github.com/conventional-changelog/commitlint/issues/3855)) ([1e08a17](https://github.com/conventional-changelog/commitlint/commit/1e08a17eb354b40776be814e8d787eee44d5df2c)), closes [#3820](https://github.com/conventional-changelog/commitlint/issues/3820)





## [18.4.4](https://github.com/conventional-changelog/commitlint/compare/v18.4.3...v18.4.4) (2024-01-04)

**Note:** Version bump only for package @commitlint/config-nx-scopes





## [18.4.3](https://github.com/conventional-changelog/commitlint/compare/v18.4.2...v18.4.3) (2023-11-21)

**Note:** Version bump only for package @commitlint/config-nx-scopes





# [18.4.0](https://github.com/conventional-changelog/commitlint/compare/v18.3.0...v18.4.0) (2023-11-10)

**Note:** Version bump only for package @commitlint/config-nx-scopes





# [18.3.0](https://github.com/conventional-changelog/commitlint/compare/v18.2.0...v18.3.0) (2023-10-26)


### Features

* **config-nx-scopes:** support latest nx version ([#3728](https://github.com/conventional-changelog/commitlint/issues/3728)) ([22e6f74](https://github.com/conventional-changelog/commitlint/commit/22e6f74e3cae74497162c8ae8f5d3888e3b19f6e))





# [18.1.0](https://github.com/conventional-changelog/commitlint/compare/v18.0.0...v18.1.0) (2023-10-25)

**Note:** Version bump only for package @commitlint/config-nx-scopes





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

**Note:** Version bump only for package @commitlint/config-nx-scopes





## [17.6.4](https://github.com/conventional-changelog/commitlint/compare/v17.6.3...v17.6.4) (2023-05-07)

**Note:** Version bump only for package @commitlint/config-nx-scopes





## [17.4.3](https://github.com/conventional-changelog/commitlint/compare/v17.4.2...v17.4.3) (2023-02-13)

**Note:** Version bump only for package @commitlint/config-nx-scopes





## [17.4.2](https://github.com/conventional-changelog/commitlint/compare/v17.4.1...v17.4.2) (2023-01-12)

**Note:** Version bump only for package @commitlint/config-nx-scopes





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

**Note:** Version bump only for package @commitlint/config-nx-scopes

# [17.2.0](https://github.com/conventional-changelog/commitlint/compare/v17.1.2...v17.2.0) (2022-10-31)

### Features

- **config-nx-scopes:** add nx version ^15.0.0 as peerDependency ([#3416](https://github.com/conventional-changelog/commitlint/issues/3416)) ([f529a3f](https://github.com/conventional-changelog/commitlint/commit/f529a3f58e03d633bbd3949d397a38d9c993579b))

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

# [16.3.0](https://github.com/conventional-changelog/commitlint/compare/v16.2.4...v16.3.0) (2022-05-14)

### Features

- add ability to filter Nx projects in @commitlint/config-nx-scopes ([#3155](https://github.com/conventional-changelog/commitlint/issues/3155)) ([e595693](https://github.com/conventional-changelog/commitlint/commit/e595693eb9be51a874cff01580b883982083ba0e)), closes [#3152](https://github.com/conventional-changelog/commitlint/issues/3152)

## [16.2.1](https://github.com/conventional-changelog/commitlint/compare/v16.2.0...v16.2.1) (2022-02-13)

**Note:** Version bump only for package @commitlint/config-nx-scopes

# [16.2.0](https://github.com/conventional-changelog/commitlint/compare/v16.1.0...v16.2.0) (2022-01-25)

### Features

- add support for Nx monorepos via @commitlint/config-nx-scopes ([#2995](https://github.com/conventional-changelog/commitlint/issues/2995)) ([11879ad](https://github.com/conventional-changelog/commitlint/commit/11879adacbef3c939311b1ff597a7b894fcca0dc))
