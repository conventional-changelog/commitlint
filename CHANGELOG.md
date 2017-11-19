# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="5.0.1"></a>
## [5.0.1](https://github.com/marionebl/commitlint/compare/v5.0.0...v5.0.1) (2017-11-19)


### Bug Fixes

* **core:** fall back to globally installed config if available ([#127](https://github.com/marionebl/commitlint/issues/127)) ([8612eb3](https://github.com/marionebl/commitlint/commit/8612eb3))




<a name="5.0.0"></a>
# [5.0.0](https://github.com/marionebl/commitlint/compare/v4.3.0...v5.0.0) (2017-11-18)

### Bug fixes

* core: interprets array values for subject-case correctly

### Features

* config-angular: disallow subject with uppercase first character, #114
* config-angular-type-enum: remove chore type


BREAKING CHANGE

TL;DR
* chore is no longer a valid commit type
* subject with leading capitalized letter are forbidden now

Angular has removed the chore type from their
conventions as of January 2017

See angular/angular@dff6ee3#diff-6a3371457528722a734f3c51d9238c13L204
for reference

This removes the previous chore type from the list
of allowed types.

Projects using the Angular commit convention will identify commits with chore type as faulty.

Also, formerly working commit messages are now considered problems:

*  type: SOME MESSAGE
*  type: SomeMessage
*  type: Some Message

<a name="4.3.0"></a>
# [4.3.0](https://github.com/marionebl/commitlint/compare/v4.2.2...v4.3.0) (2017-11-08)


### Bug Fixes

* **core:** deprecate nlp rules  ([bbab1d8](https://github.com/marionebl/commitlint/commit/bbab1d8)), closes [#54](https://github.com/marionebl/commitlint/issues/54)
* **core:** ignore comments ([f3beda1](https://github.com/marionebl/commitlint/commit/f3beda1)), closes [#78](https://github.com/marionebl/commitlint/issues/78)


### Features

* add references-empty rule ([4fc8d5d](https://github.com/marionebl/commitlint/commit/4fc8d5d))
