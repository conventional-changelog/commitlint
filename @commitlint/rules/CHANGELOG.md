# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [19.0.3](https://github.com/conventional-changelog/commitlint/compare/v19.0.2...v19.0.3) (2024-02-28)

**Note:** Version bump only for package @commitlint/rules





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

**Note:** Version bump only for package @commitlint/rules





# [18.6.0](https://github.com/conventional-changelog/commitlint/compare/v18.5.1...v18.6.0) (2024-01-25)


### Features

* **rules:** add header-trim rule ([#3199](https://github.com/conventional-changelog/commitlint/issues/3199)) ([#3871](https://github.com/conventional-changelog/commitlint/issues/3871)) ([331579a](https://github.com/conventional-changelog/commitlint/commit/331579a8796af901b5e5103c44fedf1cb3a2f661))





## [18.4.4](https://github.com/conventional-changelog/commitlint/compare/v18.4.3...v18.4.4) (2024-01-04)


### Bug Fixes

* subject-full-stop false positive when using ellipsis ([#3839](https://github.com/conventional-changelog/commitlint/issues/3839)) ([b4246d6](https://github.com/conventional-changelog/commitlint/commit/b4246d6428399177d43296dc8bec6714e664d037))





## [18.4.3](https://github.com/conventional-changelog/commitlint/compare/v18.4.2...v18.4.3) (2023-11-21)

**Note:** Version bump only for package @commitlint/rules





# [18.4.0](https://github.com/conventional-changelog/commitlint/compare/v18.3.0...v18.4.0) (2023-11-10)

**Note:** Version bump only for package @commitlint/rules





# [18.1.0](https://github.com/conventional-changelog/commitlint/compare/v18.0.0...v18.1.0) (2023-10-25)


### Features

* [scope-enum] [scope-case] allow space after comma as scope delimiter ([#3577](https://github.com/conventional-changelog/commitlint/issues/3577)) ([13c4bfc](https://github.com/conventional-changelog/commitlint/commit/13c4bfc637dd6c66477fa1c8da821ed46af28c44)), closes [#3576](https://github.com/conventional-changelog/commitlint/issues/3576)





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

**Note:** Version bump only for package @commitlint/rules





# [17.7.0](https://github.com/conventional-changelog/commitlint/compare/v17.6.7...v17.7.0) (2023-08-09)

**Note:** Version bump only for package @commitlint/rules





## [17.6.7](https://github.com/conventional-changelog/commitlint/compare/v17.6.6...v17.6.7) (2023-07-19)

**Note:** Version bump only for package @commitlint/rules





## [17.6.5](https://github.com/conventional-changelog/commitlint/compare/v17.6.4...v17.6.5) (2023-05-30)

**Note:** Version bump only for package @commitlint/rules





## [17.6.1](https://github.com/conventional-changelog/commitlint/compare/v17.6.0...v17.6.1) (2023-04-14)


### Bug Fixes

* **rules:** avoid processing strings with case-less Letter category symbols in `subject-case` ([#3586](https://github.com/conventional-changelog/commitlint/issues/3586)) ([70a4450](https://github.com/conventional-changelog/commitlint/commit/70a44501ac8459f0c1d2b200608b024585964637)), closes [#3585](https://github.com/conventional-changelog/commitlint/issues/3585)





# [17.6.0](https://github.com/conventional-changelog/commitlint/compare/v17.5.1...v17.6.0) (2023-04-13)


### Features

* **rules:** expand Latin-only characters limitation for `subject-case` with Unicode support ([#3575](https://github.com/conventional-changelog/commitlint/issues/3575)) ([5f83423](https://github.com/conventional-changelog/commitlint/commit/5f8342355a856e5be7b8a7b851e1519d62678465))





## [17.4.4](https://github.com/conventional-changelog/commitlint/compare/v17.4.3...v17.4.4) (2023-02-17)

**Note:** Version bump only for package @commitlint/rules





## [17.4.3](https://github.com/conventional-changelog/commitlint/compare/v17.4.2...v17.4.3) (2023-02-13)


### Bug Fixes

* subject-full-stop rule bugfix ([#3531](https://github.com/conventional-changelog/commitlint/issues/3531)) ([5d3d529](https://github.com/conventional-changelog/commitlint/commit/5d3d529a6a57baee1bfdaaf3f0c503dee009e152))





## [17.4.2](https://github.com/conventional-changelog/commitlint/compare/v17.4.1...v17.4.2) (2023-01-12)

**Note:** Version bump only for package @commitlint/rules





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

**Note:** Version bump only for package @commitlint/rules

# [17.3.0](https://github.com/conventional-changelog/commitlint/compare/v17.2.1...v17.3.0) (2022-11-21)

**Note:** Version bump only for package @commitlint/rules

# [17.2.0](https://github.com/conventional-changelog/commitlint/compare/v17.1.2...v17.2.0) (2022-10-31)

**Note:** Version bump only for package @commitlint/rules

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

## [16.2.4](https://github.com/conventional-changelog/commitlint/compare/v16.2.3...v16.2.4) (2022-04-28)

### Bug Fixes

- **rules:** footer-leading-blank should work with body comments ([#3139](https://github.com/conventional-changelog/commitlint/issues/3139)) ([7dd88c9](https://github.com/conventional-changelog/commitlint/commit/7dd88c913cba9f444acc587c77210cb718c928c9))

## [16.2.1](https://github.com/conventional-changelog/commitlint/compare/v16.2.0...v16.2.1) (2022-02-13)

**Note:** Version bump only for package @commitlint/rules

# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

**Note:** Version bump only for package @commitlint/rules

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

**Note:** Version bump only for package @commitlint/rules

# [14.1.0](https://github.com/conventional-changelog/commitlint/compare/v14.0.0...v14.1.0) (2021-11-01)

**Note:** Version bump only for package @commitlint/rules

# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/rules

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

**Note:** Version bump only for package @commitlint/rules

# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)

### Features

- **rules:** allow body-case to accept an array of cases ([5383c9e](https://github.com/conventional-changelog/commitlint/commit/5383c9edcd9a351ea1c33ed49f47afed9b1cde6b)), closes [#2631](https://github.com/conventional-changelog/commitlint/issues/2631)

# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)

### Features

- add subject-exclamation-mark rule to improve error messages ([#2593](https://github.com/conventional-changelog/commitlint/issues/2593)) ([be701bd](https://github.com/conventional-changelog/commitlint/commit/be701bdb1de4e667b7a872767244285c4fa4fda4))
- **rules:** add `trailer-exists` rule ([#2578](https://github.com/conventional-changelog/commitlint/issues/2578)) ([cd3816d](https://github.com/conventional-changelog/commitlint/commit/cd3816d553762eae99e088689395c55afce0c6cc))

- chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)

### BREAKING CHANGES

- minimum node version is 12

## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

**Note:** Version bump only for package @commitlint/rules

## [12.1.2](https://github.com/conventional-changelog/commitlint/compare/v12.1.1...v12.1.2) (2021-04-29)

**Note:** Version bump only for package @commitlint/rules

## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

**Note:** Version bump only for package @commitlint/rules

# [12.1.0](https://github.com/conventional-changelog/commitlint/compare/v12.0.1...v12.1.0) (2021-03-06)

**Note:** Version bump only for package @commitlint/rules

## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

**Note:** Version bump only for package @commitlint/rules

# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

### Features

- **rules:** add body-full-stop rule ([#2144](https://github.com/conventional-changelog/commitlint/issues/2144)) ([7767ca2](https://github.com/conventional-changelog/commitlint/commit/7767ca2591d10207c4abe7f3e5e6de503ac12a25))

# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

### Bug Fixes

- **rules:** ignore comments in `signed-off-by` ([#2098](https://github.com/conventional-changelog/commitlint/issues/2098)) ([b610bcd](https://github.com/conventional-changelog/commitlint/commit/b610bcd15215cc5f14fb6de07914ed595cc3047b))

# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)

- refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)

### BREAKING CHANGES

- remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

- docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>

## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/rules

## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

**Note:** Version bump only for package @commitlint/rules

# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

### Features

- enable multiple scopes in scope-enum and scope-case rules ([#901](https://github.com/conventional-changelog/commitlint/issues/901)) ([73632ce](https://github.com/conventional-changelog/commitlint/commit/73632cec299d5c3a980d07037c08633c843a8555))

## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/rules

# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

### Bug Fixes

- [#840](https://github.com/conventional-changelog/commitlint/issues/840) add caret to lodash versions ([#843](https://github.com/conventional-changelog/commitlint/issues/843)) ([ffc0bac](https://github.com/conventional-changelog/commitlint/commit/ffc0bac26993acb2ab6a8fa51065f93c92b0d644))

### Features

- add async promise based rules methods into lint ([#976](https://github.com/conventional-changelog/commitlint/issues/976)) ([4443062](https://github.com/conventional-changelog/commitlint/commit/444306249b8a3d04524538f61edca8f6cc10d75f))

## [8.3.4](https://github.com/conventional-changelog/commitlint/compare/v8.3.3...v8.3.4) (2020-01-03)

**Note:** Version bump only for package @commitlint/rules

# [8.3.0](https://github.com/conventional-changelog/commitlint/compare/v8.2.0...v8.3.0) (2019-10-16)

**Note:** Version bump only for package @commitlint/rules

# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

**Note:** Version bump only for package @commitlint/rules

# [8.1.0](https://github.com/conventional-changelog/commitlint/compare/v8.0.0...v8.1.0) (2019-07-15)

**Note:** Version bump only for package @commitlint/rules

# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)

**Note:** Version bump only for package @commitlint/rules

## [7.5.2](https://github.com/conventional-changelog/commitlint/compare/v7.5.1...v7.5.2) (2019-02-11)

### Bug Fixes

- failing sentence-case for subjects with slashes ([#574](https://github.com/conventional-changelog/commitlint/issues/574)) ([48a8602](https://github.com/conventional-changelog/commitlint/commit/48a8602))

<a name="7.5.0"></a>

# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)

### Bug Fixes

- replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))

### Features

- **rule-header-length:** show current header length ([6d61c4f](https://github.com/conventional-changelog/commitlint/commit/6d61c4f))

<a name="7.4.0"></a>

# [7.4.0](https://github.com/conventional-changelog/commitlint/compare/v7.3.2...v7.4.0) (2019-01-27)

### Features

- **rules:** create header-case and header-full-stop rules ([#547](https://github.com/conventional-changelog/commitlint/issues/547)) ([4c36cbd](https://github.com/conventional-changelog/commitlint/commit/4c36cbd))

<a name="7.3.1"></a>

## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)

**Note:** Version bump only for package @commitlint/rules

<a name="7.3.0"></a>

# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)

### Bug Fixes

- update to security-patched dependency versions ([97c033b](https://github.com/conventional-changelog/commitlint/commit/97c033b))
- use correct label for failing empty subjects ([#481](https://github.com/conventional-changelog/commitlint/issues/481)) ([2e7e34d](https://github.com/conventional-changelog/commitlint/commit/2e7e34d)), closes [#476](https://github.com/conventional-changelog/commitlint/issues/476)

<a name="7.2.0"></a>

# [7.2.0](https://github.com/conventional-changelog/commitlint/compare/v7.1.2...v7.2.0) (2018-10-05)

### Bug Fixes

- **rules:** include possible body offset in footer leading blank ([ff0111a](https://github.com/conventional-changelog/commitlint/commit/ff0111a))
- handle case rules for numerics correctly ([cadcfed](https://github.com/conventional-changelog/commitlint/commit/cadcfed))

<a name="7.1.2"></a>

## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)

**Note:** Version bump only for package @commitlint/rules

<a name="7.1.0"></a>

# [7.1.0](https://github.com/conventional-changelog/commitlint/compare/v7.0.1...v7.1.0) (2018-08-29)

### Features

- add max line length to body/footer ([542f50e](https://github.com/conventional-changelog/commitlint/commit/542f50e))

<a name="6.2.0"></a>

# [6.2.0](https://github.com/conventional-changelog/commitlint/compare/v6.1.3...v6.2.0) (2018-05-01)

### Features

- **rules:** support array for scope-case and type-case ([#312](https://github.com/conventional-changelog/commitlint/issues/312)) ([1f46b9f](https://github.com/conventional-changelog/commitlint/commit/1f46b9f)), closes [#307](https://github.com/conventional-changelog/commitlint/issues/307)

<a name="6.1.1"></a>

## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)

**Note:** Version bump only for package @commitlint/rules

<a name="6.1.0"></a>

# [6.1.0](https://github.com/conventional-changelog/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)

**Note:** Version bump only for package @commitlint/rules

<a name="6.0.4"></a>

## [6.0.4](https://github.com/conventional-changelog/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)

**Note:** Version bump only for package @commitlint/rules

<a name="6.0.3"></a>

## [6.0.3](https://github.com/conventional-changelog/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)

**Note:** Version bump only for package @commitlint/rules

<a name="6.0.2"></a>

## [6.0.2](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)

### Bug Fixes

- remove typo in error message of type-case ([cb577cb](https://github.com/conventional-changelog/commitlint/commit/cb577cb))

<a name="6.0.1"></a>

## [6.0.1](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.1) (2018-01-09)

**Note:** Version bump only for package @commitlint/rules

<a name="6.0.0"></a>

# [6.0.0](https://github.com/conventional-changelog/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)

**Note:** Version bump only for package @commitlint/rules
