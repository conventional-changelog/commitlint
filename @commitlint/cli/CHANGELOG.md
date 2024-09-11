# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [19.5.0](https://github.com/conventional-changelog/commitlint/compare/v19.4.1...v19.5.0) (2024-09-11)


### Features

* **cli:** use special errorCode for missing rules/config [#4142](https://github.com/conventional-changelog/commitlint/issues/4142) ([#4143](https://github.com/conventional-changelog/commitlint/issues/4143)) ([d7070d8](https://github.com/conventional-changelog/commitlint/commit/d7070d8a4905da7834a018825b37d52c2dd29f62))





## [19.4.1](https://github.com/conventional-changelog/commitlint/compare/v19.4.0...v19.4.1) (2024-08-28)

**Note:** Version bump only for package @commitlint/cli





# [19.4.0](https://github.com/conventional-changelog/commitlint/compare/v19.3.1...v19.4.0) (2024-08-07)


### Features

* support command line options from a file ([#4109](https://github.com/conventional-changelog/commitlint/issues/4109)) ([a20e890](https://github.com/conventional-changelog/commitlint/commit/a20e890f6b6c8bacdc511d40cb41f29415bdd044))
* support linting from the last tag ([#4110](https://github.com/conventional-changelog/commitlint/issues/4110)) ([4b204ec](https://github.com/conventional-changelog/commitlint/commit/4b204ecfb43dd6a00e24b51111aadbd78f9d58e1))





# [19.3.0](https://github.com/conventional-changelog/commitlint/compare/v19.2.2...v19.3.0) (2024-04-23)

**Note:** Version bump only for package @commitlint/cli





## [19.2.2](https://github.com/conventional-changelog/commitlint/compare/v19.2.1...v19.2.2) (2024-04-14)

**Note:** Version bump only for package @commitlint/cli





## [19.2.1](https://github.com/conventional-changelog/commitlint/compare/v19.2.0...v19.2.1) (2024-03-19)

**Note:** Version bump only for package @commitlint/cli





# [19.2.0](https://github.com/conventional-changelog/commitlint/compare/v19.1.0...v19.2.0) (2024-03-15)


### Features

* **cli:** introduce new --last flag, to stop recommending HEAD~1 ([#3916](https://github.com/conventional-changelog/commitlint/issues/3916)) ([99f4f3f](https://github.com/conventional-changelog/commitlint/commit/99f4f3f4839190a2758083df7ba20b988e7b68a6))





# [19.1.0](https://github.com/conventional-changelog/commitlint/compare/v19.0.3...v19.1.0) (2024-03-12)

**Note:** Version bump only for package @commitlint/cli





## [19.0.3](https://github.com/conventional-changelog/commitlint/compare/v19.0.2...v19.0.3) (2024-02-28)

**Note:** Version bump only for package @commitlint/cli





## [19.0.2](https://github.com/conventional-changelog/commitlint/compare/v19.0.1...v19.0.2) (2024-02-28)

**Note:** Version bump only for package @commitlint/cli





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

**Note:** Version bump only for package @commitlint/cli





# [18.6.0](https://github.com/conventional-changelog/commitlint/compare/v18.5.1...v18.6.0) (2024-01-25)

**Note:** Version bump only for package @commitlint/cli





# [18.5.0](https://github.com/conventional-changelog/commitlint/compare/v18.4.4...v18.5.0) (2024-01-22)


### Features

* **cli:** print-config now can be configured to print a json in stdout ([#3863](https://github.com/conventional-changelog/commitlint/issues/3863)) ([6381a2d](https://github.com/conventional-changelog/commitlint/commit/6381a2daa0d5d89ab2195998d63a9690a533d3f2)), closes [#3819](https://github.com/conventional-changelog/commitlint/issues/3819)





## [18.4.4](https://github.com/conventional-changelog/commitlint/compare/v18.4.3...v18.4.4) (2024-01-04)

**Note:** Version bump only for package @commitlint/cli





## [18.4.3](https://github.com/conventional-changelog/commitlint/compare/v18.4.2...v18.4.3) (2023-11-21)

**Note:** Version bump only for package @commitlint/cli





## [18.4.2](https://github.com/conventional-changelog/commitlint/compare/v18.4.1...v18.4.2) (2023-11-16)

**Note:** Version bump only for package @commitlint/cli





## [18.4.1](https://github.com/conventional-changelog/commitlint/compare/v18.4.0...v18.4.1) (2023-11-12)

**Note:** Version bump only for package @commitlint/cli





# [18.4.0](https://github.com/conventional-changelog/commitlint/compare/v18.3.0...v18.4.0) (2023-11-10)

**Note:** Version bump only for package @commitlint/cli





# [18.2.0](https://github.com/conventional-changelog/commitlint/compare/v18.1.0...v18.2.0) (2023-10-26)

**Note:** Version bump only for package @commitlint/cli





# [18.1.0](https://github.com/conventional-changelog/commitlint/compare/v18.0.0...v18.1.0) (2023-10-25)

**Note:** Version bump only for package @commitlint/cli





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

**Note:** Version bump only for package @commitlint/cli





# [17.8.0](https://github.com/conventional-changelog/commitlint/compare/v17.7.2...v17.8.0) (2023-10-14)

**Note:** Version bump only for package @commitlint/cli





## [17.7.2](https://github.com/conventional-changelog/commitlint/compare/v17.7.1...v17.7.2) (2023-09-28)

**Note:** Version bump only for package @commitlint/cli





## [17.7.1](https://github.com/conventional-changelog/commitlint/compare/v17.7.0...v17.7.1) (2023-08-10)

**Note:** Version bump only for package @commitlint/cli





# [17.7.0](https://github.com/conventional-changelog/commitlint/compare/v17.6.7...v17.7.0) (2023-08-09)

**Note:** Version bump only for package @commitlint/cli





## [17.6.7](https://github.com/conventional-changelog/commitlint/compare/v17.6.6...v17.6.7) (2023-07-19)

**Note:** Version bump only for package @commitlint/cli





## [17.6.6](https://github.com/conventional-changelog/commitlint/compare/v17.6.5...v17.6.6) (2023-06-24)

**Note:** Version bump only for package @commitlint/cli





## [17.6.5](https://github.com/conventional-changelog/commitlint/compare/v17.6.4...v17.6.5) (2023-05-30)

**Note:** Version bump only for package @commitlint/cli





## [17.6.3](https://github.com/conventional-changelog/commitlint/compare/v17.6.2...v17.6.3) (2023-05-04)

**Note:** Version bump only for package @commitlint/cli





## [17.6.1](https://github.com/conventional-changelog/commitlint/compare/v17.6.0...v17.6.1) (2023-04-14)

**Note:** Version bump only for package @commitlint/cli





# [17.6.0](https://github.com/conventional-changelog/commitlint/compare/v17.5.1...v17.6.0) (2023-04-13)

**Note:** Version bump only for package @commitlint/cli





## [17.5.1](https://github.com/conventional-changelog/commitlint/compare/v17.5.0...v17.5.1) (2023-03-28)

**Note:** Version bump only for package @commitlint/cli





# [17.5.0](https://github.com/conventional-changelog/commitlint/compare/v17.4.4...v17.5.0) (2023-03-22)

**Note:** Version bump only for package @commitlint/cli





## [17.4.4](https://github.com/conventional-changelog/commitlint/compare/v17.4.3...v17.4.4) (2023-02-17)

**Note:** Version bump only for package @commitlint/cli





## [17.4.3](https://github.com/conventional-changelog/commitlint/compare/v17.4.2...v17.4.3) (2023-02-13)

**Note:** Version bump only for package @commitlint/cli





## [17.4.2](https://github.com/conventional-changelog/commitlint/compare/v17.4.1...v17.4.2) (2023-01-12)

**Note:** Version bump only for package @commitlint/cli





## [17.4.1](https://github.com/conventional-changelog/commitlint/compare/v17.4.0...v17.4.1) (2023-01-09)

**Note:** Version bump only for package @commitlint/cli





# [17.4.0](https://github.com/conventional-changelog/commitlint/compare/v17.3.0...v17.4.0) (2023-01-04)

### Bug Fixes

- update dependency fs-extra to v11 ([#3460](https://github.com/conventional-changelog/commitlint/issues/3460)) ([a437923](https://github.com/conventional-changelog/commitlint/commit/a43792388e0d9707da770b26592c5e31553384a1))

# [17.3.0](https://github.com/conventional-changelog/commitlint/compare/v17.2.1...v17.3.0) (2022-11-21)

**Note:** Version bump only for package @commitlint/cli

# [17.2.0](https://github.com/conventional-changelog/commitlint/compare/v17.1.2...v17.2.0) (2022-10-31)

### Features

- **cli:** add strict mode ([#3384](https://github.com/conventional-changelog/commitlint/issues/3384)) ([#3385](https://github.com/conventional-changelog/commitlint/issues/3385)) ([fdff2be](https://github.com/conventional-changelog/commitlint/commit/fdff2bee2d688698555de1cab904d0f5038075b1))

## [17.1.2](https://github.com/conventional-changelog/commitlint/compare/v17.1.1...v17.1.2) (2022-08-29)

**Note:** Version bump only for package @commitlint/cli

## [17.1.1](https://github.com/conventional-changelog/commitlint/compare/v17.1.0...v17.1.1) (2022-08-27)

**Note:** Version bump only for package @commitlint/cli

# [17.1.0](https://github.com/conventional-changelog/commitlint/compare/v17.0.3...v17.1.0) (2022-08-27)

### Features

- **commitlint:** add additional git log args ([#3334](https://github.com/conventional-changelog/commitlint/issues/3334)) ([229c65b](https://github.com/conventional-changelog/commitlint/commit/229c65b60f15c15da5f5b11deb555d1f557c673a))

## [17.0.3](https://github.com/conventional-changelog/commitlint/compare/v17.0.2...v17.0.3) (2022-06-25)

**Note:** Version bump only for package @commitlint/cli

## [17.0.2](https://github.com/conventional-changelog/commitlint/compare/v17.0.1...v17.0.2) (2022-06-01)

**Note:** Version bump only for package @commitlint/cli

## [17.0.1](https://github.com/conventional-changelog/commitlint/compare/v17.0.0...v17.0.1) (2022-05-25)

### Bug Fixes

- **cli:** use `core.commentChar` from git config with `--edit` flag ([#3191](https://github.com/conventional-changelog/commitlint/issues/3191)) ([e5fee05](https://github.com/conventional-changelog/commitlint/commit/e5fee05301ab7441b6091e4ee6fc095d26bbd589)), closes [#3190](https://github.com/conventional-changelog/commitlint/issues/3190) [#3190](https://github.com/conventional-changelog/commitlint/issues/3190) [#3190](https://github.com/conventional-changelog/commitlint/issues/3190)

# [17.0.0](https://github.com/conventional-changelog/commitlint/compare/v16.3.0...v17.0.0) (2022-05-16)

- chore!: minimum node version v14 (#3128) ([ac5f9b4](https://github.com/conventional-changelog/commitlint/commit/ac5f9b47a9e3cd5c9d58b14da0feb426f06b1ef9)), closes [#3128](https://github.com/conventional-changelog/commitlint/issues/3128)

### BREAKING CHANGES

- drop node v12 support

- chore: rename circleci windows job

node version is not defned by the name anyways (i think)

# [16.3.0](https://github.com/conventional-changelog/commitlint/compare/v16.2.4...v16.3.0) (2022-05-14)

**Note:** Version bump only for package @commitlint/cli

## [16.2.4](https://github.com/conventional-changelog/commitlint/compare/v16.2.3...v16.2.4) (2022-04-28)

**Note:** Version bump only for package @commitlint/cli

## [16.2.3](https://github.com/conventional-changelog/commitlint/compare/v16.2.2...v16.2.3) (2022-03-16)

**Note:** Version bump only for package @commitlint/cli

## [16.2.1](https://github.com/conventional-changelog/commitlint/compare/v16.2.0...v16.2.1) (2022-02-13)

**Note:** Version bump only for package @commitlint/cli

# [16.1.0](https://github.com/conventional-changelog/commitlint/compare/v16.0.3...v16.1.0) (2022-01-20)

**Note:** Version bump only for package @commitlint/cli

## [16.0.3](https://github.com/conventional-changelog/commitlint/compare/v16.0.2...v16.0.3) (2022-01-19)

**Note:** Version bump only for package @commitlint/cli

## [16.0.2](https://github.com/conventional-changelog/commitlint/compare/v16.0.1...v16.0.2) (2022-01-09)

**Note:** Version bump only for package @commitlint/cli

## [16.0.1](https://github.com/conventional-changelog/commitlint/compare/v16.0.0...v16.0.1) (2021-12-28)

**Note:** Version bump only for package @commitlint/cli

# [16.0.0](https://github.com/conventional-changelog/commitlint/compare/v15.0.0...v16.0.0) (2021-12-26)

### Features

- config validation ([#2412](https://github.com/conventional-changelog/commitlint/issues/2412)) ([c717202](https://github.com/conventional-changelog/commitlint/commit/c7172022097b11f46b33617e4a94d751243c1049)), closes [#327](https://github.com/conventional-changelog/commitlint/issues/327)

# [15.0.0](https://github.com/conventional-changelog/commitlint/compare/v14.2.0...v15.0.0) (2021-11-17)

### Features

- simplify config resolution ([#2398](https://github.com/conventional-changelog/commitlint/issues/2398)) ([8a8384f](https://github.com/conventional-changelog/commitlint/commit/8a8384f3c18954447cb633e76a573e1db71a1440)), closes [#327](https://github.com/conventional-changelog/commitlint/issues/327)

# [14.1.0](https://github.com/conventional-changelog/commitlint/compare/v14.0.0...v14.1.0) (2021-11-01)

**Note:** Version bump only for package @commitlint/cli

# [14.0.0](https://github.com/conventional-changelog/commitlint/compare/v13.2.1...v14.0.0) (2021-10-26)

**Note:** Version bump only for package @commitlint/cli

## [13.2.1](https://github.com/conventional-changelog/commitlint/compare/v13.2.0...v13.2.1) (2021-10-09)

**Note:** Version bump only for package @commitlint/cli

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)

**Note:** Version bump only for package @commitlint/cli

# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)

### Bug Fixes

- **cli:** remove hard coded comment char with linting `COMMIT_EDIT_MSG` ([#2618](https://github.com/conventional-changelog/commitlint/issues/2618)) ([5badf6d](https://github.com/conventional-changelog/commitlint/commit/5badf6dc08116ed3557e6c780e55764b4f07ca67)), closes [#2351](https://github.com/conventional-changelog/commitlint/issues/2351)

# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)

- chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)

### BREAKING CHANGES

- minimum node version is 12

## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

### Bug Fixes

- update dependency fs-extra to v10 ([#2575](https://github.com/conventional-changelog/commitlint/issues/2575)) ([d47d2b5](https://github.com/conventional-changelog/commitlint/commit/d47d2b595b980adadd4fb8ff198c1914caeff18f))
- update dependency yargs to v17 ([#2574](https://github.com/conventional-changelog/commitlint/issues/2574)) ([81c38dd](https://github.com/conventional-changelog/commitlint/commit/81c38ddf15f239b525f673b26b2ee6606f2ee8f6))

## [12.1.2](https://github.com/conventional-changelog/commitlint/compare/v12.1.1...v12.1.2) (2021-04-29)

**Note:** Version bump only for package @commitlint/cli

## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

**Note:** Version bump only for package @commitlint/cli

# [12.1.0](https://github.com/conventional-changelog/commitlint/compare/v12.0.1...v12.1.0) (2021-03-06)

**Note:** Version bump only for package @commitlint/cli

## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)

**Note:** Version bump only for package @commitlint/cli

# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)

### Bug Fixes

- update dependency execa to v5 ([#2341](https://github.com/conventional-changelog/commitlint/issues/2341)) ([f349df9](https://github.com/conventional-changelog/commitlint/commit/f349df90f08096a9bcad46b5e55b411aac327a24))
- update dependency yargs to v16 ([204f36d](https://github.com/conventional-changelog/commitlint/commit/204f36d0a522afaf3a88739b401aea15ffa0b891))

### Features

- **cli:** implement print-config cli flag ([#2391](https://github.com/conventional-changelog/commitlint/issues/2391)) ([8626883](https://github.com/conventional-changelog/commitlint/commit/86268833946dea9dcf1c15459456cd4427d17835))
- **load:** allow specifying helpUrl via config ([#2180](https://github.com/conventional-changelog/commitlint/issues/2180)) ([d6795a3](https://github.com/conventional-changelog/commitlint/commit/d6795a3c4633ba6efd7a0fcff48339dc291cd832))

# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

### Bug Fixes

- **cli:** remove default value from edit option [#2065](https://github.com/conventional-changelog/commitlint/issues/2065) ([3d4116d](https://github.com/conventional-changelog/commitlint/commit/3d4116d044a2f5149a9c9c1d9fa35abf5e232479))

# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)

### Bug Fixes

- update dependency execa to v4 ([#1936](https://github.com/conventional-changelog/commitlint/issues/1936)) ([8efb441](https://github.com/conventional-changelog/commitlint/commit/8efb44193058d286f7325327a6d33936b273ec91))
- update dependency fs-extra to v9 ([#1018](https://github.com/conventional-changelog/commitlint/issues/1018)) ([2df49fa](https://github.com/conventional-changelog/commitlint/commit/2df49fac907993ae78199a1012e918b0e2ff5621))
- update dependency get-stdin to v8 ([#1938](https://github.com/conventional-changelog/commitlint/issues/1938)) ([f94a5c8](https://github.com/conventional-changelog/commitlint/commit/f94a5c82861523aa1cf407ffe062f99ecbbfb4e4))

- refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)

### BREAKING CHANGES

- remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

- docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>

## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/cli

## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

**Note:** Version bump only for package @commitlint/cli

# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)

### Bug Fixes

- update dependency chalk to v4 ([#1275](https://github.com/conventional-changelog/commitlint/issues/1275)) ([a5d8fa1](https://github.com/conventional-changelog/commitlint/commit/a5d8fa118e8221361f14f5fd2b21d7aaad008a27))
- update dependency regenerator-runtime to v0.13.5 ([#1017](https://github.com/conventional-changelog/commitlint/issues/1017)) ([9c4fdf1](https://github.com/conventional-changelog/commitlint/commit/9c4fdf1b5f42677422532dad655af9aed9b43881))

## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

### Bug Fixes

- add missing @babel/runtime dep [#1738](https://github.com/conventional-changelog/commitlint/issues/1738) ([#1754](https://github.com/conventional-changelog/commitlint/issues/1754)) ([09afcd6](https://github.com/conventional-changelog/commitlint/commit/09afcd647a2c1d00538cf1c970e3790d936111f8))

# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)

### Bug Fixes

- **cli:** add missing regenerator-runtime to dependencies ([#919](https://github.com/conventional-changelog/commitlint/issues/919)) ([ee5eac9](https://github.com/conventional-changelog/commitlint/commit/ee5eac98fa97ba5ba17030c8d2705aee5c7f3a3a))
- [#840](https://github.com/conventional-changelog/commitlint/issues/840) add caret to lodash versions ([#843](https://github.com/conventional-changelog/commitlint/issues/843)) ([ffc0bac](https://github.com/conventional-changelog/commitlint/commit/ffc0bac26993acb2ab6a8fa51065f93c92b0d644))

## [8.3.5](https://github.com/conventional-changelog/commitlint/compare/v8.3.4...v8.3.5) (2020-01-15)

**Note:** Version bump only for package @commitlint/cli

## [8.3.4](https://github.com/conventional-changelog/commitlint/compare/v8.3.3...v8.3.4) (2020-01-03)

**Note:** Version bump only for package @commitlint/cli

## [8.3.1](https://github.com/conventional-changelog/commitlint/compare/v8.3.0...v8.3.1) (2019-10-16)

**Note:** Version bump only for package @commitlint/cli

# [8.3.0](https://github.com/conventional-changelog/commitlint/compare/v8.2.0...v8.3.0) (2019-10-16)

### Features

- **cli:** add helpurl flag ([#789](https://github.com/conventional-changelog/commitlint/issues/789)) ([75cef4e](https://github.com/conventional-changelog/commitlint/commit/75cef4e))

# [8.2.0](https://github.com/conventional-changelog/commitlint/compare/v8.1.0...v8.2.0) (2019-09-16)

### Bug Fixes

- pass defaultIgnores from configuration in @commitlint/cli ([#771](https://github.com/conventional-changelog/commitlint/issues/771)) ([a259014](https://github.com/conventional-changelog/commitlint/commit/a259014))

# [8.1.0](https://github.com/conventional-changelog/commitlint/compare/v8.0.0...v8.1.0) (2019-07-15)

### Bug Fixes

- pass ignores from configuration in @commitlint/cli ([#668](https://github.com/conventional-changelog/commitlint/issues/668)) ([da99aaa](https://github.com/conventional-changelog/commitlint/commit/da99aaa))

## [7.6.1](https://github.com/conventional-changelog/commitlint/compare/v7.6.0...v7.6.1) (2019-05-09)

**Note:** Version bump only for package @commitlint/cli

# [7.6.0](https://github.com/conventional-changelog/commitlint/compare/v7.5.2...v7.6.0) (2019-05-06)

### Bug Fixes

- avoid excessive help text [#606](https://github.com/conventional-changelog/commitlint/issues/606) ([#637](https://github.com/conventional-changelog/commitlint/issues/637)) ([8f3c3b1](https://github.com/conventional-changelog/commitlint/commit/8f3c3b1))

### Features

- adds support for plugins ([#228](https://github.com/conventional-changelog/commitlint/issues/228)) ([#588](https://github.com/conventional-changelog/commitlint/issues/588)) ([cea4564](https://github.com/conventional-changelog/commitlint/commit/cea4564))

## [7.5.2](https://github.com/conventional-changelog/commitlint/compare/v7.5.1...v7.5.2) (2019-02-11)

### Bug Fixes

- **cli:** replace old links with new organisation links ([#578](https://github.com/conventional-changelog/commitlint/issues/578)) ([4075903](https://github.com/conventional-changelog/commitlint/commit/4075903))

## [7.5.1](https://github.com/conventional-changelog/commitlint/compare/v7.5.0...v7.5.1) (2019-02-09)

**Note:** Version bump only for package @commitlint/cli

<a name="7.5.0"></a>

# [7.5.0](https://github.com/conventional-changelog/commitlint/compare/v7.4.0...v7.5.0) (2019-01-31)

### Bug Fixes

- **cli:** avoid linebreak in empty input ([#523](https://github.com/conventional-changelog/commitlint/issues/523)) ([3141882](https://github.com/conventional-changelog/commitlint/commit/3141882))
- all broken website references ([#564](https://github.com/conventional-changelog/commitlint/issues/564)) ([82eeb5a](https://github.com/conventional-changelog/commitlint/commit/82eeb5a))
- cleanup message for input with no config ([#519](https://github.com/conventional-changelog/commitlint/issues/519)) ([7d9e760](https://github.com/conventional-changelog/commitlint/commit/7d9e760))
- replace all repository references with conventional changelog ([#561](https://github.com/conventional-changelog/commitlint/issues/561)) ([6c3afcd](https://github.com/conventional-changelog/commitlint/commit/6c3afcd))
- replace all website references with conventional changelog ([#563](https://github.com/conventional-changelog/commitlint/issues/563)) ([6b86fb1](https://github.com/conventional-changelog/commitlint/commit/6b86fb1))

<a name="7.4.0"></a>

# [7.4.0](https://github.com/conventional-changelog/commitlint/compare/v7.3.2...v7.4.0) (2019-01-27)

**Note:** Version bump only for package @commitlint/cli

<a name="7.3.2"></a>

## [7.3.2](https://github.com/conventional-changelog/commitlint/compare/v7.3.1...v7.3.2) (2019-01-15)

**Note:** Version bump only for package @commitlint/cli

<a name="7.3.1"></a>

## [7.3.1](https://github.com/conventional-changelog/commitlint/compare/v7.3.0...v7.3.1) (2019-01-11)

**Note:** Version bump only for package @commitlint/cli

<a name="7.3.0"></a>

# [7.3.0](https://github.com/conventional-changelog/commitlint/compare/v7.2.1...v7.3.0) (2019-01-11)

### Bug Fixes

- add fallback with husky git params to deprecation handling ([#498](https://github.com/conventional-changelog/commitlint/issues/498)) ([5a34b8c](https://github.com/conventional-changelog/commitlint/commit/5a34b8c))
- avoid truncated output on macOS ([#503](https://github.com/conventional-changelog/commitlint/issues/503)) ([3192368](https://github.com/conventional-changelog/commitlint/commit/3192368))
- respect String.protoype.repeat API contract ([f27e7ac](https://github.com/conventional-changelog/commitlint/commit/f27e7ac))
- update to security-patched dependency versions ([97c033b](https://github.com/conventional-changelog/commitlint/commit/97c033b))
- use correct label for failing empty subjects ([#481](https://github.com/conventional-changelog/commitlint/issues/481)) ([2e7e34d](https://github.com/conventional-changelog/commitlint/commit/2e7e34d)), closes [#476](https://github.com/conventional-changelog/commitlint/issues/476)

### Features

- check stage before entering prompt ([#495](https://github.com/conventional-changelog/commitlint/issues/495)) ([3b3667a](https://github.com/conventional-changelog/commitlint/commit/3b3667a)), closes [#51](https://github.com/conventional-changelog/commitlint/issues/51) [#51](https://github.com/conventional-changelog/commitlint/issues/51)
- warn on empty config ([#491](https://github.com/conventional-changelog/commitlint/issues/491)) ([b6bd36e](https://github.com/conventional-changelog/commitlint/commit/b6bd36e)), closes [#107](https://github.com/conventional-changelog/commitlint/issues/107) [#107](https://github.com/conventional-changelog/commitlint/issues/107)

<a name="7.2.1"></a>

## [7.2.1](https://github.com/conventional-changelog/commitlint/compare/v7.2.0...v7.2.1) (2018-10-11)

### Bug Fixes

- improve format module resolving ([#464](https://github.com/conventional-changelog/commitlint/issues/464)) ([baed8b1](https://github.com/conventional-changelog/commitlint/commit/baed8b1))

<a name="7.2.0"></a>

# [7.2.0](https://github.com/conventional-changelog/commitlint/compare/v7.1.2...v7.2.0) (2018-10-05)

### Features

- **cli:** add format option for report output ([1ecf097](https://github.com/conventional-changelog/commitlint/commit/1ecf097))

<a name="7.1.2"></a>

## [7.1.2](https://github.com/conventional-changelog/commitlint/compare/v7.1.1...v7.1.2) (2018-09-04)

**Note:** Version bump only for package @commitlint/cli

<a name="7.1.0"></a>

# [7.1.0](https://github.com/conventional-changelog/commitlint/compare/v7.0.1...v7.1.0) (2018-08-29)

**Note:** Version bump only for package @commitlint/cli

<a name="6.2.0"></a>

# [6.2.0](https://github.com/conventional-changelog/commitlint/compare/v6.1.3...v6.2.0) (2018-05-01)

### Features

- print commit message when the message is invalid ([86c34f1](https://github.com/conventional-changelog/commitlint/commit/86c34f1)), closes [#222](https://github.com/conventional-changelog/commitlint/issues/222)

<a name="6.1.1"></a>

## [6.1.1](https://github.com/conventional-changelog/commitlint/compare/v6.1.0...v6.1.1) (2018-02-22)

**Note:** Version bump only for package @commitlint/cli

<a name="6.1.0"></a>

# [6.1.0](https://github.com/conventional-changelog/commitlint/compare/v6.0.5...v6.1.0) (2018-02-03)

### Features

- add "--config" option ([#261](https://github.com/conventional-changelog/commitlint/issues/261)) ([2c03ec6](https://github.com/conventional-changelog/commitlint/commit/2c03ec6))

<a name="6.0.5"></a>

## [6.0.5](https://github.com/conventional-changelog/commitlint/compare/v6.0.4...v6.0.5) (2018-01-31)

**Note:** Version bump only for package @commitlint/cli

<a name="6.0.4"></a>

## [6.0.4](https://github.com/conventional-changelog/commitlint/compare/v6.0.3...v6.0.4) (2018-01-31)

**Note:** Version bump only for package @commitlint/cli

<a name="6.0.3"></a>

## [6.0.3](https://github.com/conventional-changelog/commitlint/compare/v6.0.2...v6.0.3) (2018-01-31)

**Note:** Version bump only for package @commitlint/cli

<a name="6.0.2"></a>

## [6.0.2](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.2) (2018-01-12)

**Note:** Version bump only for package @commitlint/cli

<a name="6.0.1"></a>

## [6.0.1](https://github.com/conventional-changelog/commitlint/compare/v6.0.0...v6.0.1) (2018-01-09)

**Note:** Version bump only for package @commitlint/cli

<a name="6.0.0"></a>

# [6.0.0](https://github.com/conventional-changelog/commitlint/compare/v5.2.6...v6.0.0) (2018-01-09)

### Bug Fixes

- correctly resolve parserOpts [#115](https://github.com/conventional-changelog/commitlint/issues/115) [#95](https://github.com/conventional-changelog/commitlint/issues/95) ([1353dd5](https://github.com/conventional-changelog/commitlint/commit/1353dd5))

<a name="5.2.6"></a>

## [5.2.6](https://github.com/conventional-changelog/commitlint/compare/v5.2.5...v5.2.6) (2017-12-21)

**Note:** Version bump only for package @commitlint/cli

<a name="5.2.5"></a>

## [5.2.5](https://github.com/conventional-changelog/commitlint/compare/v5.2.4...v5.2.5) (2017-12-08)

**Note:** Version bump only for package @commitlint/cli

<a name="5.2.4"></a>

## [5.2.4](https://github.com/conventional-changelog/commitlint/compare/v5.2.3...v5.2.4) (2017-12-08)

**Note:** Version bump only for package @commitlint/cli

<a name="5.2.3"></a>

## [5.2.3](https://github.com/conventional-changelog/commitlint/compare/v5.2.2...v5.2.3) (2017-12-05)

### Bug Fixes

- **cli:** add support for GIT_PARAMS on windows ([c62bd41](https://github.com/conventional-changelog/commitlint/commit/c62bd41)), closes [#103](https://github.com/conventional-changelog/commitlint/issues/103) [#175](https://github.com/conventional-changelog/commitlint/issues/175)

<a name="5.2.0"></a>

# [5.2.0](https://github.com/conventional-changelog/commitlint/compare/v5.1.3...v5.2.0) (2017-11-30)

**Note:** Version bump only for package @commitlint/cli

<a name="5.1.1"></a>

## [5.1.1](https://github.com/conventional-changelog/commitlint/compare/v5.1.0...v5.1.1) (2017-11-24)

**Note:** Version bump only for package @commitlint/cli

<a name="5.1.0"></a>

# [5.1.0](https://github.com/conventional-changelog/commitlint/compare/v5.0.2...v5.1.0) (2017-11-24)

### Bug Fixes

- update dependency concurrently to v3.5.1 ([#147](https://github.com/conventional-changelog/commitlint/issues/147)) ([a809d0f](https://github.com/conventional-changelog/commitlint/commit/a809d0f))

### Features

- **travis-cli:** add reusable travis command line interface ([3e6e6a8](https://github.com/conventional-changelog/commitlint/commit/3e6e6a8))

<a name="5.0.1"></a>

## [5.0.1](https://github.com/conventional-changelog/commitlint/compare/v5.0.0...v5.0.1) (2017-11-19)

**Note:** Version bump only for package @commitlint/cli

<a name="4.3.0"></a>

# [4.3.0](https://github.com/conventional-changelog/commitlint/compare/v4.2.2...v4.3.0) (2017-11-08)

**Note:** Version bump only for package @commitlint/cli

<a name="4.2.2"></a>

## [4.2.2](https://github.com/conventional-changelog/commitlint/compare/v4.2.1...v4.2.2) (2017-10-26)

**Note:** Version bump only for package @commitlint/cli

<a name="4.2.1"></a>

## [4.2.1](https://github.com/conventional-changelog/commitlint/compare/v4.2.0...v4.2.1) (2017-10-18)

### Bug Fixes

- nicer error messages ([#93](https://github.com/conventional-changelog/commitlint/issues/93)) ([dcfad61](https://github.com/conventional-changelog/commitlint/commit/dcfad61))
- **core:** consider config outside of current git repo ([f7234b6](https://github.com/conventional-changelog/commitlint/commit/f7234b6))

<a name="4.2.0"></a>

# [4.2.0](https://github.com/conventional-changelog/commitlint/compare/v4.1.1...v4.2.0) (2017-10-14)

### Features

- edit flag now accepts the path to the commit file ([c881433](https://github.com/conventional-changelog/commitlint/commit/c881433)), closes [#40](https://github.com/conventional-changelog/commitlint/issues/40)

<a name="4.1.1"></a>

## [4.1.1](https://github.com/conventional-changelog/commitlint/compare/v4.1.0...v4.1.1) (2017-10-09)

**Note:** Version bump only for package @commitlint/cli

<a name="4.1.0"></a>

# [4.1.0](https://github.com/conventional-changelog/commitlint/compare/v4.0.0...v4.1.0) (2017-10-05)

**Note:** Version bump only for package @commitlint/cli

<a name="4.0.0"></a>

# [4.0.0](https://github.com/conventional-changelog/commitlint/compare/v3.2.0...v4.0.0) (2017-10-04)

### Features

- enable alternative config formats ([#83](https://github.com/conventional-changelog/commitlint/issues/83)) ([91968b8](https://github.com/conventional-changelog/commitlint/commit/91968b8)), closes [#73](https://github.com/conventional-changelog/commitlint/issues/73)

### BREAKING CHANGES

- discontinue support of conventional-changelog-lintrc

- test: make git setup reliable

<a name="3.2.0"></a>

# 3.2.0 (2017-09-05)

### Features

- add preset parser ([5cd2335](https://github.com/conventional-changelog/commitlint/commit/5cd2335))

<a name="3.1.3"></a>

## 3.1.3 (2017-08-21)

### Bug Fixes

- **core:** determine git root correctly in sub directories ([#64](https://github.com/conventional-changelog/commitlint/issues/64)) ([d594ec4](https://github.com/conventional-changelog/commitlint/commit/d594ec4)), closes [#62](https://github.com/conventional-changelog/commitlint/issues/62)

<a name="3.1.2"></a>

## 3.1.2 (2017-08-07)

<a name="3.1.1"></a>

## 3.1.1 (2017-08-07)

<a name="3.0.4"></a>

## 3.0.4 (2017-08-04)

### Bug Fixes

- **core:** correct type validation message ([09c2b26](https://github.com/conventional-changelog/commitlint/commit/09c2b26))

<a name="3.0.3"></a>

## 3.0.3 (2017-07-16)

<a name="3.0.2"></a>

## 3.0.2 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.1.3"></a>

## 3.1.3 (2017-08-21)

### Bug Fixes

- **core:** determine git root correctly in sub directories ([#64](https://github.com/conventional-changelog/commitlint/issues/64)) ([d594ec4](https://github.com/conventional-changelog/commitlint/commit/d594ec4)), closes [#62](https://github.com/conventional-changelog/commitlint/issues/62)

<a name="3.1.2"></a>

## 3.1.2 (2017-08-07)

<a name="3.1.1"></a>

## 3.1.1 (2017-08-07)

<a name="3.0.4"></a>

## 3.0.4 (2017-08-04)

### Bug Fixes

- **core:** correct type validation message ([09c2b26](https://github.com/conventional-changelog/commitlint/commit/09c2b26))

<a name="3.0.3"></a>

## 3.0.3 (2017-07-16)

<a name="3.0.2"></a>

## 3.0.2 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.1.2"></a>

## 3.1.2 (2017-08-07)

<a name="3.1.1"></a>

## 3.1.1 (2017-08-07)

<a name="3.0.4"></a>

## 3.0.4 (2017-08-04)

### Bug Fixes

- **core:** correct type validation message ([09c2b26](https://github.com/conventional-changelog/commitlint/commit/09c2b26))

<a name="3.0.3"></a>

## 3.0.3 (2017-07-16)

<a name="3.0.2"></a>

## 3.0.2 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.0.4"></a>

## 3.0.4 (2017-08-04)

### Bug Fixes

- **core:** correct type validation message ([09c2b26](https://github.com/conventional-changelog/commitlint/commit/09c2b26))

<a name="3.0.3"></a>

## 3.0.3 (2017-07-16)

<a name="3.0.2"></a>

## 3.0.2 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.0.3"></a>

## 3.0.3 (2017-07-16)

<a name="3.0.2"></a>

## 3.0.2 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.0.2"></a>

## 3.0.2 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.0.1"></a>

## 3.0.1 (2017-07-11)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([fe8caff](https://github.com/conventional-changelog/commitlint/commit/fe8caff))
- ensure node4 compat ([bfeb653](https://github.com/conventional-changelog/commitlint/commit/bfeb653))

<a name="3.0.1"></a>

## 3.0.1 (2017-07-11)

<a name="3.0.0"></a>

# 3.0.0 (2017-07-10)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([94437e8](https://github.com/conventional-changelog/commitlint/commit/94437e8))
- ensure node4 compat ([a5e658a](https://github.com/conventional-changelog/commitlint/commit/a5e658a))

<a name="3.0.0"></a>

# 3.0.0 (2017-07-10)

### Bug Fixes

- **cli:** remove destructuring for node 4 support ([94437e8](https://github.com/conventional-changelog/commitlint/commit/94437e8))
- ensure node4 compat ([a5e658a](https://github.com/conventional-changelog/commitlint/commit/a5e658a))
