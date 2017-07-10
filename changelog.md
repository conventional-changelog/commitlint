<a name="2.1.1"></a>
## [2.1.1](https://github.com/marionebl/conventional-changelog-lint/compare/v2.1.0...v2.1.1) (2017-07-10)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.9...v2.1.0) (2017-07-07)


### Bug Fixes

* prevent false positives for footer-leading-blank ([#33](https://github.com/marionebl/conventional-changelog-lint/issues/33)) ([05b4427](https://github.com/marionebl/conventional-changelog-lint/commit/05b4427))
* rebuff rules ([#34](https://github.com/marionebl/conventional-changelog-lint/issues/34)) ([702a2f7](https://github.com/marionebl/conventional-changelog-lint/commit/702a2f7))
* throw when detecting a shallow clone ([8c354c5](https://github.com/marionebl/conventional-changelog-lint/commit/8c354c5)), closes [#7](https://github.com/marionebl/conventional-changelog-lint/issues/7) [#12](https://github.com/marionebl/conventional-changelog-lint/issues/12)
* update to latest angular config ([b1f3606](https://github.com/marionebl/conventional-changelog-lint/commit/b1f3606))


### Features

* ignore fixup and squash commit ([#17](https://github.com/marionebl/conventional-changelog-lint/issues/17)) ([f0b83d8](https://github.com/marionebl/conventional-changelog-lint/commit/f0b83d8))



<a name="2.0.0"></a>
# 2.0.0 (2017-07-07)

### Documentation

* add recipe for linting of all commits in a PR (#36) ([1e69d54](https://github.com/marionebl/conventional-changelog-lint/commit/1e69d54)), closes [#35](https://github.com/marionebl/conventional-changelog-lint/issues/35)


### Bug Fixes

* prevent false positives for footer-leading-blank ([#33](https://github.com/marionebl/conventional-changelog-lint/issues/33)) ([05b4427](https://github.com/marionebl/conventional-changelog-lint/commit/05b4427))
* rebuff rules ([#34](https://github.com/marionebl/conventional-changelog-lint/issues/34)) ([702a2f7](https://github.com/marionebl/conventional-changelog-lint/commit/702a2f7))
* throw when detecting a shallow clone ([8c354c5](https://github.com/marionebl/conventional-changelog-lint/commit/8c354c5)), closes [#7](https://github.com/marionebl/conventional-changelog-lint/issues/7) [#12](https://github.com/marionebl/conventional-changelog-lint/issues/12)

### BREAKING CHANGES :warning:

* wildcards config is now ignored entirely

<a name="1.1.9"></a>
## [1.1.9](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.8...v1.1.9) (2017-04-05)


### Bug Fixes

* **rules:** export subject-min-length rule ([29d149e](https://github.com/marionebl/conventional-changelog-lint/commit/29d149e))
* override arrays when merging user configuration ([8637292](https://github.com/marionebl/conventional-changelog-lint/commit/8637292)), closes [#11](https://github.com/marionebl/conventional-changelog-lint/issues/11)



<a name="1.1.8"></a>
## [1.1.8](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.7...v1.1.8) (2017-03-31)



<a name="1.1.7"></a>
## [1.1.7](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.6...v1.1.7) (2017-03-12)


### Bug Fixes

* move mz to dependencies ([3b3f057](https://github.com/marionebl/conventional-changelog-lint/commit/3b3f057))



<a name="1.1.6"></a>
## [1.1.6](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.5...v1.1.6) (2017-03-12)


### Bug Fixes

* add missing globby dependency ([4e71f84](https://github.com/marionebl/conventional-changelog-lint/commit/4e71f84))



<a name="1.1.5"></a>
## [1.1.5](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.4...v1.1.5) (2017-03-12)



<a name="1.1.4"></a>
## [1.1.4](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.3...v1.1.4) (2017-03-12)


### Bug Fixes

* move git-toplevel to dependencies ([d036390](https://github.com/marionebl/conventional-changelog-lint/commit/d036390))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.2...v1.1.3) (2017-03-12)


### Bug Fixes

* determine git toplevel before reading .git/COMMIT_EDITMSG ([c45a62b](https://github.com/marionebl/conventional-changelog-lint/commit/c45a62b))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.0...v1.1.2) (2017-03-10)


### Bug Fixes

* allow empty scopes in scope-enum check ([b433c07](https://github.com/marionebl/conventional-changelog-lint/commit/b433c07))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/marionebl/conventional-changelog-lint/compare/v1.1.0...v1.1.1) (2017-03-03)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/marionebl/conventional-changelog-lint/compare/v1.0.1...v1.1.0) (2016-11-01)


### Features

* update angular config ([0a28ca0](https://github.com/marionebl/conventional-changelog-lint/commit/0a28ca0))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/marionebl/conventional-changelog-lint/compare/v1.0.0...v1.0.1) (2016-08-15)


### Bug Fixes

* **rules:** respect keyword setting for scope-empty (#11) ([c646a60](https://github.com/marionebl/conventional-changelog-lint/commit/c646a60)), closes [#10](https://github.com/marionebl/conventional-changelog-lint/issues/10)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/marionebl/conventional-changelog-lint/compare/v0.3.2...v1.0.0) (2016-06-20)


### Bug Fixes

* **cli:** disable angular defaults when a rc file is provided ([ef9a2b7](https://github.com/marionebl/conventional-changelog-lint/commit/ef9a2b7))

### Features

* **rules:** update to latest default ruleset ([1c2f772](https://github.com/marionebl/conventional-changelog-lint/commit/1c2f772))


### BREAKING CHANGES

* rules: fix: remove revert type
*  fix: add perf type
*  fix: allow multidigit release versions
*  feat: warn on footer-leading-blank



<a name="0.3.4"></a>
## [0.3.4](https://github.com/marionebl/conventional-changelog-lint/compare/v0.3.2...v0.3.4) (2016-04-15)


### Bug Fixes

* **cli:** disable angular defaults when a rc file is provided ([8c3ee6c](https://github.com/marionebl/conventional-changelog-lint/commit/8c3ee6c))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/marionebl/conventional-changelog-lint/compare/v0.3.1...v0.3.2) (2016-03-03)


### Bug Fixes

* execute dynamic configuration in get-configuration ([ecb041e](https://github.com/marionebl/conventional-changelog-lint/commit/ecb041e))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/marionebl/conventional-changelog-lint/compare/v0.3.0...v0.3.1) (2016-02-25)


### Bug Fixes

* guard pos lexer against errors ([a12f1b2](https://github.com/marionebl/conventional-changelog-lint/commit/a12f1b2))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/marionebl/conventional-changelog-lint/compare/v0.2.0...v0.3.0) (2016-02-25)


### Features

* add footer rules ([6acb930](https://github.com/marionebl/conventional-changelog-lint/commit/6acb930))
* add subject-leading-capital rule ([c6714a4](https://github.com/marionebl/conventional-changelog-lint/commit/c6714a4))
* **rules:** add rules for tense-checking ([d7b8d4b](https://github.com/marionebl/conventional-changelog-lint/commit/d7b8d4b))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.10...v0.2.0) (2016-02-25)


### Bug Fixes

* catch unhandled rejections ([b7e4bf9](https://github.com/marionebl/conventional-changelog-lint/commit/b7e4bf9))

### Features

* support for dynamic and async rules ([efce01a](https://github.com/marionebl/conventional-changelog-lint/commit/efce01a))



<a name="0.1.10"></a>
## [0.1.10](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.9...v0.1.10) (2016-02-24)


### Bug Fixes

* skip language check if no lang is detected ([d3e8454](https://github.com/marionebl/conventional-changelog-lint/commit/d3e8454))



<a name="0.1.9"></a>
## [0.1.9](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.8...v0.1.9) (2016-02-22)


### Bug Fixes

* use raw commit message to check for leading blank line ([9c1ca3b](https://github.com/marionebl/conventional-changelog-lint/commit/9c1ca3b))



<a name="0.1.8"></a>
## [0.1.8](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.7...v0.1.8) (2016-02-22)




<a name="0.1.7"></a>
## [0.1.7](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.6...v0.1.7) (2016-02-14)


### Bug Fixes

* prune duplicate dependency ([33a6fca](https://github.com/marionebl/conventional-changelog-lint/commit/33a6fca))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.5...v0.1.6) (2016-02-14)




<a name="0.1.5"></a>
## [0.1.5](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.3...v0.1.5) (2016-02-14)


### Bug Fixes

* add missing dependency ([f3efa01](https://github.com/marionebl/conventional-changelog-lint/commit/f3efa01))
* correct dependencies ([5d3c219](https://github.com/marionebl/conventional-changelog-lint/commit/5d3c219))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.3...v0.1.4) (2016-02-14)


### Bug Fixes

* correct dependencies ([eeb6149](https://github.com/marionebl/conventional-changelog-lint/commit/eeb6149))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.2...v0.1.3) (2016-02-14)


### Bug Fixes

* add missing shebang ([461e50f](https://github.com/marionebl/conventional-changelog-lint/commit/461e50f))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.1...v0.1.2) (2016-02-14)


### Bug Fixes

* enforce addition of distribution folder ([cbe3a90](https://github.com/marionebl/conventional-changelog-lint/commit/cbe3a90))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/marionebl/conventional-changelog-lint/compare/v0.1.0...v0.1.1) (2016-02-14)


### Bug Fixes

* rebuild before releases ([763bf53](https://github.com/marionebl/conventional-changelog-lint/commit/763bf53))



<a name="0.1.0"></a>
# 0.1.0 (2016-02-14)


### Bug Fixes

* be less strict with matched languages ([dae11d1](https://github.com/marionebl/conventional-changelog-lint/commit/dae11d1))
* handle precedence and defaults correctly ([a8b980a](https://github.com/marionebl/conventional-changelog-lint/commit/a8b980a))

### Features

* add extends flag ([276dcaf](https://github.com/marionebl/conventional-changelog-lint/commit/276dcaf))
* add input from git history ([d426b34](https://github.com/marionebl/conventional-changelog-lint/commit/d426b34))
* support multiple inputs ([0a11c72](https://github.com/marionebl/conventional-changelog-lint/commit/0a11c72))





---
Copyright 2016 by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
