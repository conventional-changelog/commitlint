# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [19.2.0](https://github.com/conventional-changelog/commitlint/compare/v19.1.0...v19.2.0) (2024-03-15)


### Features

* **load:** update cosmiconfig to v9 to add support for `package.yaml` config ([#3976](https://github.com/conventional-changelog/commitlint/issues/3976)) ([94eab40](https://github.com/conventional-changelog/commitlint/commit/94eab40798e0c8d3945aa2b1e629669b231d8468))





# [19.1.0](https://github.com/conventional-changelog/commitlint/compare/v19.0.3...v19.1.0) (2024-03-12)

**Note:** Version bump only for package @commitlint/load





## [19.0.3](https://github.com/conventional-changelog/commitlint/compare/v19.0.2...v19.0.3) (2024-02-28)

**Note:** Version bump only for package @commitlint/load





## [19.0.2](https://github.com/conventional-changelog/commitlint/compare/v19.0.1...v19.0.2) (2024-02-28)

**Note:** Version bump only for package @commitlint/load





## [19.0.1](https://github.com/conventional-changelog/commitlint/compare/v19.0.0...v19.0.1) (2024-02-27)


### Bug Fixes

* drop `resolve-from`, `resolve-global` and `import-fresh`, resolve global packages correctly ([#3939](https://github.com/conventional-changelog/commitlint/issues/3939)) ([8793c63](https://github.com/conventional-changelog/commitlint/commit/8793c639c083c33714da0a29429b338776813d0c)), closes [#3938](https://github.com/conventional-changelog/commitlint/issues/3938)





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

**Note:** Version bump only for package @commitlint/load





# [18.6.0](https://github.com/conventional-changelog/commitlint/compare/v18.5.1...v18.6.0) (2024-01-25)

**Note:** Version bump only for package @commitlint/load





# [18.5.0](https://github.com/conventional-changelog/commitlint/compare/v18.4.4...v18.5.0) (2024-01-22)

**Note:** Version bump only for package @commitlint/load





## [18.4.4](https://github.com/conventional-changelog/commitlint/compare/v18.4.3...v18.4.4) (2024-01-04)


### Bug Fixes

* **@commitlint/load:** Remove unused `@types/node` dependency ([#3801](https://github.com/conventional-changelog/commitlint/issues/3801)) ([7b3f8b3](https://github.com/conventional-changelog/commitlint/commit/7b3f8b3fe106311682a2e8ad281dd9a4e42443c6))





## [18.4.3](https://github.com/conventional-changelog/commitlint/compare/v18.4.2...v18.4.3) (2023-11-21)

**Note:** Version bump only for package @commitlint/load





## [18.4.2](https://github.com/conventional-changelog/commitlint/compare/v18.4.1...v18.4.2) (2023-11-16)

**Note:** Version bump only for package @commitlint/load





## [18.4.1](https://github.com/conventional-changelog/commitlint/compare/v18.4.0...v18.4.1) (2023-11-12)


### Bug Fixes

* update cosmiconfig to specific version ([#3755](https://github.com/conventional-changelog/commitlint/issues/3755)) ([636b8b1](https://github.com/conventional-changelog/commitlint/commit/636b8b1338835b239ab0585e062bfe305fca4424))





# [18.4.0](https://github.com/conventional-changelog/commitlint/compare/v18.3.0...v18.4.0) (2023-11-10)


### Features

* bump cosmiconfig version and conditionally support mjs config ([#3747](https://github.com/conventional-changelog/commitlint/issues/3747)) ([a2b65fc](https://github.com/conventional-changelog/commitlint/commit/a2b65fc0cfee2259e197c291ea40ef2d076ab837))





# [18.2.0](https://github.com/conventional-changelog/commitlint/compare/v18.1.0...v18.2.0) (2023-10-26)


### Features

* **load:** use cosmiconfig-typescript-loader v5 to remove ts-node dependency for @commitlint/load ([#3722](https://github.com/conventional-changelog/commitlint/issues/3722)) ([1ff49ea](https://github.com/conventional-changelog/commitlint/commit/1ff49ea14adb180eb54ec3d7479990b66ba26720))





# [18.1.0](https://github.com/conventional-changelog/commitlint/compare/v18.0.0...v18.1.0) (2023-10-25)

**Note:** Version bump only for package @commitlint/load





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

**Note:** Version bump only for package @commitlint/load





# [17.8.0](https://github.com/conventional-changelog/commitlint/compare/v17.7.2...v17.8.0) (2023-10-14)


### Features

* lazy load cosmiconfig-typescript-loader ([#3694](https://github.com/conventional-changelog/commitlint/issues/3694)) ([b058c7c](https://github.com/conventional-changelog/commitlint/commit/b058c7cc49333e7898402fa55467ec097801ce25))





## [17.7.2](https://github.com/conventional-changelog/commitlint/compare/v17.7.1...v17.7.2) (2023-09-28)


### Bug Fixes

* update dependency @types/node to v20.5.1 ([#3653](https://github.com/conventional-changelog/commitlint/issues/3653)) ([cd8b775](https://github.com/conventional-changelog/commitlint/commit/cd8b7750d3a15fbfd96e20196d53df064df6e138))





## [17.7.1](https://github.com/conventional-changelog/commitlint/compare/v17.7.0...v17.7.1) (2023-08-10)


### Reverts

* Revert "feat(load): use cosmiconfig-typescript-loader v5 to remove ts-node dependency for @commitlint/load (#3633)" ([8e41897](https://github.com/conventional-changelog/commitlint/commit/8e41897a42c45988ff8c25576c4f13bb11d84c4e)), closes [#3633](https://github.com/conventional-changelog/commitlint/issues/3633)





# [17.7.0](https://github.com/conventional-changelog/commitlint/compare/v17.6.7...v17.7.0) (2023-08-09)


### Features

* **load:** use cosmiconfig-typescript-loader v5 to remove ts-node dependency for @commitlint/load ([#3633](https://github.com/conventional-changelog/commitlint/issues/3633)) ([4aa46d7](https://github.com/conventional-changelog/commitlint/commit/4aa46d796ad74958f5569d3346b60a1f92c33892))





## [17.6.7](https://github.com/conventional-changelog/commitlint/compare/v17.6.6...v17.6.7) (2023-07-19)

**Note:** Version bump only for package @commitlint/load





# [17.5.0](https://github.com/conventional-changelog/commitlint/compare/v17.4.4...v17.5.0) (2023-03-22)


### Features

* support typescript 5.0 ([#3566](https://github.com/conventional-changelog/commitlint/issues/3566)) ([c0a27ff](https://github.com/conventional-changelog/commitlint/commit/c0a27ffa3dcaef296ef58ce37bd8ca0a9d315d6e))





## [17.4.4](https://github.com/conventional-changelog/commitlint/compare/v17.4.3...v17.4.4) (2023-02-17)

**Note:** Version bump only for package @commitlint/load





## [17.4.2](https://github.com/conventional-changelog/commitlint/compare/v17.4.1...v17.4.2) (2023-01-12)


### Bug Fixes

* **load:** fixes a bug when a ts commitlint config is compiled twice ([#3499](https://github.com/conventional-changelog/commitlint/issues/3499)) ([dc2c899](https://github.com/conventional-changelog/commitlint/commit/dc2c899b5d7e4e7a7be79901b28e46da9f519211))





## [17.4.1](https://github.com/conventional-changelog/commitlint/compare/v17.4.0...v17.4.1) (2023-01-09)

**Note:** Version bump only for package @commitlint/load





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

### Bug Fixes

- update dependency cosmiconfig to v8 ([#3459](https://github.com/conventional-changelog/commitlint/issues/3459)) ([ee732fe](https://github.com/conventional-changelog/commitlint/commit/ee732fe0ef2057bdae93b7c368392934ac0de3af))

### Features

- support config .cts extension ([#3461](https://github.com/conventional-changelog/commitlint/issues/3461)) ([85ad18b](https://github.com/conventional-changelog/commitlint/commit/85ad18b8990567df516effcacbf04edbcbb6b6d7))

# [17.3.0](https://github.com/conventional-changelog/commitlint/compare/v17.2.1...v17.3.0) (2022-11-21)

**Note:** Version bump only for package @commitlint/load

# [17.2.0](https://github.com/conventional-changelog/commitlint/compare/v17.1.2...v17.2.0) (2022-10-31)

**Note:** Version bump only for package @commitlint/load

## [17.1.2](https://github.com/conventional-changelog/commitlint/compare/v17.1.1...v17.1.2) (2022-08-29)

### Bug Fixes

- **load:** add ts-node as direct dependency ([#3351](https://github.com/conventional-changelog/commitlint/issues/3351)) ([3b66891](https://github.com/conventional-changelog/commitlint/commit/3b668911d8f9fd93e0f613842d5c0b7c3f24360a))
- update dependency cosmiconfig-typescript-loader to v4 ([#3346](https://github.com/conventional-changelog/commitlint/issues/3346)) ([5a9d80f](https://github.com/conventional-changelog/commitlint/commit/5a9d80fba352deae1c2855792be4f8458a973431))

## [17.1.1](https://github.com/conventional-changelog/commitlint/compare/v17.1.0...v17.1.1) (2022-08-27)

### Bug Fixes

- **load:** peer-dep version [#3345](https://github.com/conventional-changelog/commitlint/issues/3345) ([2dd7b50](https://github.com/conventional-changelog/commitlint/commit/2dd7b50c983e2720ad25c368e5a0f13b80ab7927))

# [17.1.0](https://github.com/conventional-changelog/commitlint/compare/v17.0.3...v17.1.0) (2022-08-27)

### Bug Fixes

- update dependency cosmiconfig-typescript-loader to v3 ([#3253](https://github.com/conventional-changelog/commitlint/issues/3253)) ([4e87d14](https://github.com/conventional-changelog/commitlint/commit/4e87d1431df6d39990e5f56a579604b1b3268ce6))

## [17.0.3](https://github.com/conventional-changelog/commitlint/compare/v17.0.2...v17.0.3) (2022-06-25)

**Note:** Version bump only for package @commitlint/load

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

# [16.3.0](https://github.com/conventional-changelog/commitlint/compare/v16.2.4...v16.3.0) (2022-05-14)

### Bug Fixes

- update dependency cosmiconfig-typescript-loader to v2 ([#3154](https://github.com/conventional-changelog/commitlint/issues/3154)) ([20122e8](https://github.com/conventional-changelog/commitlint/commit/20122e8d6e999b74eab3bab08a6d52cda3f13e37))

## [16.2.4](https://github.com/conventional-changelog/commitlint/compare/v16.2.3...v16.2.4) (2022-04-28)

**Note:** Version bump only for package @commitlint/load

## [16.2.3](https://github.com/conventional-changelog/commitlint/compare/v16.2.2...v16.2.3) (2022-03-16)

**Note:** Version bump only for package @commitlint/load

## [16.2.1](https://github.com/conventional-changelog/commitlint/compare/v16.2.0...v16.2.1) (2022-02-13)

### Bug Fixes

- **load:** satisfy @types/node peer dependency for cosmiconfig-loader-typescript ([#3008](https://github.com/conventional-changelog/commitlint/issues/3008)) ([338180c](https://github.com/conventional-changelog/commitlint/commit/338180c7174625cddd7a0ea2b9d2786fee375756)), closes [#3007](https://github.com/conventional-changelog/commitlint/issues/3007)

# [16.1.0](https://github.com/conventional-changelog/commitlint/compare/v16.0.3...v16.1.0) (2022-01-20)

### Features

- **load:** accept functions as parser presets ([#2982](https://github.com/conventional-changelog/commitlint/issues/2982)) ([420e8d6](https://github.com/conventional-changelog/commitlint/commit/420e8d6a4d5663ade953272275a9e0fa7c5ddff0)), closes [#2964](https://github.com/conventional-changelog/commitlint/issues/2964) [#2964](https://github.com/conventional-changelog/commitlint/issues/2964)

# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

### Features

- config validation ([#2412](https://github.com/conventional-changelog/commitlint/issues/2412)) ([c717202](https://github.com/conventional-changelog/commitlint/commit/c7172022097b11f46b33617e4a94d751243c1049)), closes [#327](https://github.com/conventional-changelog/commitlint/issues/327)

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

### Bug Fixes

- **types:** fix signature of QualifiedRuleConfig for async configurations ([#2868](https://github.com/conventional-changelog/commitlint/issues/2868)) ([#2869](https://github.com/conventional-changelog/commitlint/issues/2869)) ([c7f355b](https://github.com/conventional-changelog/commitlint/commit/c7f355b25e5baddab0b9559892f5ce4112e4f93a))

### Features

- simplify config resolution ([#2398](https://github.com/conventional-changelog/commitlint/issues/2398)) ([8a8384f](https://github.com/conventional-changelog/commitlint/commit/8a8384f3c18954447cb633e76a573e1db71a1440)), closes [#327](https://github.com/conventional-changelog/commitlint/issues/327)

# [14.1.0](https://github.com/conventional-changelog/commitlint/compare/v14.0.0...v14.1.0) (2021-11-01)

### Features

- extend helpUrl from shareable config ([#2846](https://github.com/conventional-changelog/commitlint/issues/2846)) ([d7e2e2b](https://github.com/conventional-changelog/commitlint/commit/d7e2e2b943be383f99f4000b6b6bed0eab03bfcf))
- **load:** add support for `.commitlintrc.cjs` and `commitlint.config.cjs` files ([#2797](https://github.com/conventional-changelog/commitlint/issues/2797)) ([fabb495](https://github.com/conventional-changelog/commitlint/commit/fabb49509730609276ff9ef6357536c95a1f6bb1))

# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/load

## [13.2.1](https://github.com/conventional-changelog/commitlint/compare/v13.2.0...v13.2.1) (2021-10-09)

### Bug Fixes

- **load:** added a direct dependency on typescript ([#2785](https://github.com/conventional-changelog/commitlint/issues/2785)) ([9c17f8d](https://github.com/conventional-changelog/commitlint/commit/9c17f8d423404b484f72df41358a18bd90014ecd)), closes [EndemolShineGroup/cosmiconfig-typescript-loader#147](https://github.com/EndemolShineGroup/cosmiconfig-typescript-loader/issues/147) [#2779](https://github.com/conventional-changelog/commitlint/issues/2779)

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

### Bug Fixes

- **types:** user config prompt ([6d7a1c4](https://github.com/conventional-changelog/commitlint/commit/6d7a1c40e2f8a8ff22595e0e17f71f3702b0699c))

### Features

- **load:** add cosmiconfig typescript loader ([b65aced](https://github.com/conventional-changelog/commitlint/commit/b65acedc3334a859811762539ec8716de3e73f85))

# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)

**Note:** Version bump only for package @commitlint/load

# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)

- chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)

### BREAKING CHANGES

- minimum node version is 12

## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

**Note:** Version bump only for package @commitlint/load

## [12.1.2](https://github.com/conventional-changelog/commitlint/compare/v12.1.1...v12.1.2) (2021-04-29)

**Note:** Version bump only for package @commitlint/load

## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

**Note:** Version bump only for package @commitlint/load

# [12.1.0](https://github.com/conventional-changelog/commitlint/compare/v12.0.1...v12.1.0) (2021-03-06)

**Note:** Version bump only for package @commitlint/load

## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

### Bug Fixes

- **load:** use `Rule | AsyncRule | SyncRule` as rule value type in `Plugin` ([#2146](https://github.com/conventional-changelog/commitlint/issues/2146)) ([75b67b8](https://github.com/conventional-changelog/commitlint/commit/75b67b8fb7fc4df21267b98f0c9daeeb1130b824))

# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

### Bug Fixes

- update dependency execa to v4.1.0 ([#2251](https://github.com/conventional-changelog/commitlint/issues/2251)) ([b5743dd](https://github.com/conventional-changelog/commitlint/commit/b5743dd1e49bbe7eac03f34bc38c59df5fbaf2a0))
- update dependency execa to v5 ([#2341](https://github.com/conventional-changelog/commitlint/issues/2341)) ([f349df9](https://github.com/conventional-changelog/commitlint/commit/f349df90f08096a9bcad46b5e55b411aac327a24))

### Features

- **load:** allow specifying helpUrl via config ([#2180](https://github.com/conventional-changelog/commitlint/issues/2180)) ([d6795a3](https://github.com/conventional-changelog/commitlint/commit/d6795a3c4633ba6efd7a0fcff48339dc291cd832))

# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

**Note:** Version bump only for package @commitlint/load

# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)

### Bug Fixes

- update dependency cosmiconfig to v7 ([#2044](https://github.com/conventional-changelog/commitlint/issues/2044)) ([f4db933](https://github.com/conventional-changelog/commitlint/commit/f4db93324698ea39528be0d2692151546c2b5517))
- update dependency execa to v4 ([#1936](https://github.com/conventional-changelog/commitlint/issues/1936)) ([8efb441](https://github.com/conventional-changelog/commitlint/commit/8efb44193058d286f7325327a6d33936b273ec91))

- refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)

### BREAKING CHANGES

- remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

- docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>

## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/load

## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

### Bug Fixes

- **load:** resolve plugins from extended configs ([#1976](https://github.com/conventional-changelog/commitlint/issues/1976)) ([d0f0eb9](https://github.com/conventional-changelog/commitlint/commit/d0f0eb9fde7efc2dff7a3aad190ded14303d3079))

# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

### Bug Fixes

- update dependency chalk to v4 ([#1275](https://github.com/conventional-changelog/commitlint/issues/1275)) ([a5d8fa1](https://github.com/conventional-changelog/commitlint/commit/a5d8fa118e8221361f14f5fd2b21d7aaad008a27))

### Features

- add local plugins support ([#1692](https://github.com/conventional-changelog/commitlint/issues/1692)) ([7b29c48](https://github.com/conventional-changelog/commitlint/commit/7b29c48321b513e091849fbb2cc2bf0e6ebb94a6))

## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/load

# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

### Bug Fixes

- [#840](https://github.com/conventional-changelog/commitlint/issues/840) add caret to lodash versions ([#843](https://github.com/conventional-changelog/commitlint/issues/843)) ([ffc0bac](https://github.com/conventional-changelog/commitlint/commit/ffc0bac26993acb2ab6a8fa51065f93c92b0d644))

## [8.3.5](https://github.com/conventional-changelog/commitlint/compare/v8.3.4...v8.3.5) (2020-01-15)

**Note:** Version bump only for package @commitlint/load

## [8.3.4](https://github.com/conventional-changelog/commitlint/compare/v8.3.3...v8.3.4) (2020-01-03)

**Note:** Version bump only for package @commitlint/load

## [8.3.1](https://github.com/conventional-changelog/commitlint/compare/v8.3.0...v8.3.1) (2019-10-16)

### Bug Fixes

- **load:** resolve nested parser preset factories ([#831](https://github.com/conventional-changelog/commitlint/issues/831)) ([73a7df7](https://github.com/conventional-changelog/commitlint/commit/73a7df7))

# [8.3.0](https://github.com/conventional-changelog/commitlint/compare/v8.2.0...v8.3.0) (2019-10-16)

### Features

- **config-conventional:** use parser with short breaking change support ([#821](https://github.com/conventional-changelog/commitlint/issues/821)) ([4b5300a](https://github.com/conventional-changelog/commitlint/commit/4b5300a))

# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

**Note:** Version bump only for package @commitlint/load

# [8.1.0](https://github.com/conventional-changelog/commitlint/compare/v8.0.0...v8.1.0) (2019-07-15)

### Bug Fixes

- add explicit dependency on chalk ([#687](https://github.com/conventional-changelog/commitlint/issues/687)) ([9075844](https://github.com/conventional-changelog/commitlint/commit/9075844))

## [7.6.1](https://github.com/conventional-changelog/commitlint/compare/v7.6.0...v7.6.1) (2019-05-09)

### Bug Fixes

- handle absolute config paths correctly [#647](https://github.com/conventional-changelog/commitlint/issues/647) ([49b3a77](https://github.com/conventional-changelog/commitlint/commit/49b3a77))

# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)

### Bug Fixes

- remove unneeded dev dependency ([6ccaf79](https://github.com/conventional-changelog/commitlint/commit/6ccaf79))
- update cosmiconfig to safe >=5 [#599](https://github.com/conventional-changelog/commitlint/issues/599) ([f186fcb](https://github.com/conventional-changelog/commitlint/commit/f186fcb))

### Features

- adds support for plugins ([#228](https://github.com/conventional-changelog/commitlint/issues/228)) ([#588](https://github.com/conventional-changelog/commitlint/issues/588)) ([cea4564](https://github.com/conventional-changelog/commitlint/commit/cea4564))
- config based is-ignored overrides ([#595](https://github.com/conventional-changelog/commitlint/issues/595)) ([2434d71](https://github.com/conventional-changelog/commitlint/commit/2434d71))

<a name="7.5.0"></a>

# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)

### Bug Fixes

- all broken website references ([#564](https://github.com/conventional-changelog/commitlint/issues/564)) ([82eeb5a](https://github.com/conventional-changelog/commitlint/commit/82eeb5a))
- replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))
- replace all website references with conventional changelog ([#563](https://github.com/conventional-changelog/commitlint/issues/563)) ([6b86fb1](https://github.com/conventional-changelog/commitlint/commit/6b86fb1))

<a name="7.3.1"></a>

## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)

**Note:** Version bump only for package @commitlint/load

<a name="7.3.0"></a>

# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)

### Bug Fixes

- update to security-patched dependency versions ([97c033b](https://github.com/conventional-changelog/commitlint/commit/97c033b))

### Features

- check stage before entering prompt ([#495](https://github.com/conventional-changelog/commitlint/issues/495)) ([3b3667a](https://github.com/conventional-changelog/commitlint/commit/3b3667a)), closes [#51](https://github.com/conventional-changelog/commitlint/issues/51) [#51](https://github.com/conventional-changelog/commitlint/issues/51)

<a name="7.2.1"></a>

## [7.2.1](https://github.com/conventional-changelog/commitlint/compare/v7.2.0...v7.2.1) (2018-10-11)

### Bug Fixes

- improve format module resolving ([#464](https://github.com/conventional-changelog/commitlint/issues/464)) ([baed8b1](https://github.com/conventional-changelog/commitlint/commit/baed8b1))

<a name="7.2.0"></a>

# [7.2.0](https://github.com/conventional-changelog/commitlint/compare/v7.1.2...v7.2.0) (2018-10-05)

### Features

- **load:** add formatter option with default value ([b0e63d9](https://github.com/conventional-changelog/commitlint/commit/b0e63d9))

<a name="7.1.2"></a>

## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)

**Note:** Version bump only for package @commitlint/load

<a name="6.1.1"></a>

## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)

**Note:** Version bump only for package @commitlint/load
