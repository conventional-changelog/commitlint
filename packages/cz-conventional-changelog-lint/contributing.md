# cz-conventional-changelog-lint

Yeay! You want to contribute to cz-conventional-changelog-lint. That's amazing!
To smoothen everyone's experience involved with the project
please take note of the following guidelines and rules.

## I Found an Issue

Thank you for reporting any issues you find. We do our best to test and make
cz-conventional-changelog-lint as solid as possible,
but any reported issue is a real help.

> cz-conventional-changelog-lint issues

Please follow these guidelines when reporting issues:

*   Provide a title in the format of `<Error> when <Task>`

*   Tag your issue with the tag `bug`

*   Provide a short summary of what you are trying to do

*   Provide the log of the encountered error if applicable

*   Provide the exact version of cz-conventional-changelog-lint.
Check `npm ls cz-conventional-changelog-lint` when in doubt

*   Be awesome and consider contributing a [pull request](#want-to-contribute)

## I want to contribute

You consider contributing changes to cz-conventional-changelog-lint –
we dig that!
Please consider these guidelines when filing a pull request:

*   Follow the [Coding Rules](#coding-rules)
*   Follow the [Commit Rules](#commit-rules)
*   Make sure you rebased the current master branch when filing the pull request
*   Squash your commits when filing the pull request
*   Provide a short title with a maximum of 72 characters

## Coding Rules

To keep the code base of cz-conventional-changelog-lint
neat and tidy the following rules apply to every change

> Coding standards

*   [Happiness](/sindresorhus/xo) enforced via eslint
*   Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
*   Coverage never drops below 90%
*   No change may lower coverage by more than 5%
*   Be awesome

## Commit Rules

To help everyone with understanding the commit history of
cz-conventional-changelog-lint the following commit rules are enforced.
To make your life easier cz-conventional-changelog-lint
is commitizen-friendly and provides the npm run-script `commit`.

> Commit standards

*   [conventional-changelog](/commitizen/cz-conventional-changelog)
*   husky commit message hook available
*   present tense
*   maximum of 100 characters
*   message format of `$type($scope): $message`

---

Copyright 2016 by [Mario Nebl](https://github.com/marionebl)
and [contributors](./graphs/contributors).
Released under the [MIT license]('./license.md').
