# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [13.2.0](https://github.com/conventional-changelog/commitlint/compare/v13.1.0...v13.2.0) (2021-09-28)


### Bug Fixes

* **types:** prompt messages key ([4825a52](https://github.com/conventional-changelog/commitlint/commit/4825a521e2c74d63a11920b48094fddc79001b3c))
* **types:** prompt messages props optional ([0bd0592](https://github.com/conventional-changelog/commitlint/commit/0bd0592148ab4266fd76816b19d352e2cf947f8c))
* **types:** user config prompt ([6d7a1c4](https://github.com/conventional-changelog/commitlint/commit/6d7a1c40e2f8a8ff22595e0e17f71f3702b0699c))





# [13.1.0](https://github.com/conventional-changelog/commitlint/compare/v13.0.0...v13.1.0) (2021-07-24)


### Bug Fixes

* **types:** adds TargetCaseType[] for CaseRuleConfig ([c3bef38](https://github.com/conventional-changelog/commitlint/commit/c3bef384ff1a3ec428ba7c86bc778c50a9e6eead))





# [13.0.0](https://github.com/conventional-changelog/commitlint/compare/v12.1.4...v13.0.0) (2021-05-24)


### Features

* **rules:** add `trailer-exists` rule ([#2578](https://github.com/conventional-changelog/commitlint/issues/2578)) ([cd3816d](https://github.com/conventional-changelog/commitlint/commit/cd3816d553762eae99e088689395c55afce0c6cc))


* chore!: remove node 10 support (#2596) ([4db4ba1](https://github.com/conventional-changelog/commitlint/commit/4db4ba1b0b312410a0f62100a93a80c246a6c410)), closes [#2596](https://github.com/conventional-changelog/commitlint/issues/2596)


### BREAKING CHANGES

* minimum node version is 12





## [12.1.3](https://github.com/conventional-changelog/commitlint/compare/v12.1.2...v12.1.3) (2021-05-12)

**Note:** Version bump only for package @commitlint/types





## [12.1.2](https://github.com/conventional-changelog/commitlint/compare/v12.1.1...v12.1.2) (2021-04-29)


### Bug Fixes

* **rules:** fix subject-full-stop rule config value type ([#2534](https://github.com/conventional-changelog/commitlint/issues/2534)) ([2ab3c57](https://github.com/conventional-changelog/commitlint/commit/2ab3c57b709ddad3fc98d768309ac4fdac8cb68a))
* **types:** update chalk import ([#2535](https://github.com/conventional-changelog/commitlint/issues/2535)) ([89f9a6d](https://github.com/conventional-changelog/commitlint/commit/89f9a6d759f7296438e184a93c1f766aba1443ca))





## [12.1.1](https://github.com/conventional-changelog/commitlint/compare/v12.1.0...v12.1.1) (2021-04-02)

**Note:** Version bump only for package @commitlint/types





## [12.0.1](https://github.com/conventional-changelog/commitlint/compare/v12.0.0...v12.0.1) (2021-02-23)


### Bug Fixes

* **load:** use `Rule | AsyncRule | SyncRule` as rule value type in `Plugin` ([#2146](https://github.com/conventional-changelog/commitlint/issues/2146)) ([75b67b8](https://github.com/conventional-changelog/commitlint/commit/75b67b8fb7fc4df21267b98f0c9daeeb1130b824))
* **types:** correct chalkColor type ([#2420](https://github.com/conventional-changelog/commitlint/issues/2420)) ([ef8bdad](https://github.com/conventional-changelog/commitlint/commit/ef8bdad96c9ee7c3ad67f8280818c7f49c1df1fe))





# [12.0.0](https://github.com/conventional-changelog/commitlint/compare/v11.0.0...v12.0.0) (2021-01-18)


### Features

* **load:** allow specifying helpUrl via config ([#2180](https://github.com/conventional-changelog/commitlint/issues/2180)) ([d6795a3](https://github.com/conventional-changelog/commitlint/commit/d6795a3c4633ba6efd7a0fcff48339dc291cd832))
* **rules:** add body-full-stop rule ([#2144](https://github.com/conventional-changelog/commitlint/issues/2144)) ([7767ca2](https://github.com/conventional-changelog/commitlint/commit/7767ca2591d10207c4abe7f3e5e6de503ac12a25))





# [11.0.0](https://github.com/conventional-changelog/commitlint/compare/v10.0.0...v11.0.0) (2020-09-05)

**Note:** Version bump only for package @commitlint/types





# [10.0.0](https://github.com/conventional-changelog/commitlint/compare/v9.1.2...v10.0.0) (2020-08-16)


* refactor!: drop support for node 8 (#1999) ([751f39f](https://github.com/conventional-changelog/commitlint/commit/751f39f284ef232574a176c3c11b1982ee544166)), closes [#1999](https://github.com/conventional-changelog/commitlint/issues/1999)


### BREAKING CHANGES

* remove node 8 from circle-ci checks

also remove node 13 because we do not support experimental versions

* docs: update node v10 to latest LTS 10 version

Co-authored-by: Cedric van Putten <me@bycedric.com>

Co-authored-by: Cedric van Putten <me@bycedric.com>





## [9.1.2](https://github.com/conventional-changelog/commitlint/compare/v9.1.1...v9.1.2) (2020-07-13)

**Note:** Version bump only for package @commitlint/types





## [9.1.1](https://github.com/conventional-changelog/commitlint/compare/v9.1.0...v9.1.1) (2020-06-30)

**Note:** Version bump only for package @commitlint/types





# [9.1.0](https://github.com/conventional-changelog/commitlint/compare/v9.0.1...v9.1.0) (2020-06-21)


### Features

* add local plugins support ([#1692](https://github.com/conventional-changelog/commitlint/issues/1692)) ([7b29c48](https://github.com/conventional-changelog/commitlint/commit/7b29c48321b513e091849fbb2cc2bf0e6ebb94a6))





## [9.0.1](https://github.com/conventional-changelog/commitlint/compare/v9.0.0...v9.0.1) (2020-05-26)

**Note:** Version bump only for package @commitlint/types





# [9.0.0](https://github.com/conventional-changelog/commitlint/compare/v8.3.5...v9.0.0) (2020-05-21)


### Features

* add async promise based rules methods into lint ([#976](https://github.com/conventional-changelog/commitlint/issues/976)) ([4443062](https://github.com/conventional-changelog/commitlint/commit/444306249b8a3d04524538f61edca8f6cc10d75f))
