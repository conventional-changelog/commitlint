> Lint commit messages

# commitlint

Yeay! You want to contribute to commitlint. That's amazing!
To smoothen everyone's experience involved with the project please take note of the following guidelines and rules.

## Found an Issue?
Thank you for reporting any issues you find. We do our best to test and make commitlint as solid as possible, but any reported issue is a real help.

> commitlint issues

Please follow these guidelines when reporting issues:
* Provide a title in the format of `<Error> when <Task>`
* Tag your issue with the tag `bug`
* Provide a short summary of what you are trying to do
* Provide the log of the encountered error if applicable
* Provide the exact version of commitlint. Check `npm ls @commitlint/cli` when in doubt
* Be awesome and consider contributing a [pull request](#want-to-contribute)

## Want to contribute?
You consider contributing changes to commitlint – we dig that!
Please consider these guidelines when filing a pull request:

> commitlint pull requests

* Follow the [Coding Rules](#coding-rules)
* Follow the [Commit Rules](#commit-rules)
* Make sure you rebased the current master branch when filing the pull request
* Squash your commits when filing the pull request
* Provide a short title with a maximum of 100 characters
* Provide a more detailed description containing
	* What you want to achieve
	* What you changed
	* What you added
	* What you removed

## Coding Rules
To keep the code base of commitlint neat and tidy the following rules apply to every change

> Coding standards

* [Happiness](https://github.com/sindresorhus/xo) enforced
* Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
* Be awesome

## Commit Rules
To help everyone with understanding the commit history of commitlint the following commit rules are enforced.
To make your life easier commitlint is commitizen-friendly and provides the npm run-script `commit`.

> Commit standards

* [conventional-changelog](https://github.com/marionebl/commitlint/tree/master/%40commitlint/prompt)
* husky commit message hook available
* present tense
* maximum of 100 characters
* message format of `$type($scope): $message`
