> Lint commit messages

# commitlint [![stability][0]][1]

[![npm version][6]][7] [![Travis branch][2]][3] [![AppVeyor branch][4]][5]

*  🚓  Enforce commit conventions
*  🤖   Plays nice with `conventional-changelog`
*  📦   Supports shareable configuration

## Installation

Fetch it with `npm`

```shell
npm install --save-dev commitlint
```

## Usage

`commitlint` provides a command line and node interface.

### CLI

![commitlint demo](https://git.io/v2iTI)

The command line interface reads `.commitlintrc`
resolves `extends` configurations.

```shell
❯ commitlint --help
  commitlint - Lint commit messages

  [input] reads from stdin if --edit, --from, --to are omitted
  --color,-c    toggle formatted output, defaults to: true
  --edit,-e     read last commit message found in ./git/COMMIT_EDITMSG
  --extends,-x  array of shareable configurations to extend
  --from,-f     lower end of the commit range to lint; applies if edit=false
  --preset,-p   conventional-changelog-preset to use for commit message parsing, defaults to: angular
  --to,-t       upper end of the commit range to lint; applies if edit=false
  --quiet,-q    toggle console output

```

### Recipes

#### git hook
As a `commitmsg` git-hook with ["husky"](https://git.io/JDwyQg)

```json
  {
    "scripts": {
      "commitmsg": "commitlint -e"
    }
  }
```


#### Last commit
As part of `npm test`

```json
  {
    "scripts": {
      "test": "commitlint --from=HEAD~1"
    }
  }
```

#### Lint all commits in Pull Request

You can lint all commits in a PR by passing all commits that
are present in `SOURCE_BRANCH` but unavailable in `BASE_BRANCH`:

```sh
commitlint --from=BASE_BRANCH to=SOURCE_BRANCH
```

Most of the time `BASE_BRANCH` will be `master` for Github Flow.

This assumes `SOURCE_BRANCH` is available on your local checkout.
This is not true by default for all PRs originating from clones of a repository.

Given you'd like to lint all commits in PR origination from branch `remote-test` on the
repository `github.com/other-name/test` targeting `master` on `github.com/your-name/test`:

```sh
cd test # make sure CWD is in your repository
git remote add other-name https://github.com/other-name/test.git
git fetch other-name

commitlint --from=master --to=other-name/test
```

See [scripts/lint:commit.sh](./scripts/lint:commit.sh#6) for an example on how to obtain `SOURCE_BRANCH` from a Github clone automatically on Travis.

#### Travis

Commit Linting on CI has to handle the following cases

* Direct commits
* Branch Pull Requests
* Fork Pull Requests

An exemplary implementation is provided as bash script working on Travis CI.

```yml
# Force full git checkout
before_install: git fetch --unshallow

script:
  - ./scripts/lint:commit.sh # [1] scripts/lint:commit.sh
```

> \[1\]: See [scripts/lint:commit.sh](./scripts/lint:commit.sh) for reference

### API

The programming interface does not read configuration by default,
it has to be provided as second parameter.

```js
import lint from 'commitlint';
const report = lint(
  'docs: add node api interface usage',
  {
    preset: {},
    configuration: {}
  }
);
```

To achieve the same behavior as with the command line interface
you can use the provided utility functions:

```js
import lint from 'commitlint';
import {
  getPreset,
  getConfiguration
} from 'commitlint';

const report = lint(
  'docs: add node api interface usage',
  {
    preset: await getPreset('angular'),
    configuration: await readConfiguration('commitlint')
  }
);
```

## Configuration

`commitlint` is configured via
`.commitlintrc` and shareable configuration.

When no `.commitlintrc` is found it will use the
[angular](https://github.com/marionebl/commitlint-config-angular#rules)
shareable config.
See the documentation there for default rules.

When a `.commitlintrc` is found it will **not** load any preset
unless specified via [extends](#extends) configuration.

### extends

```js
{
  "extends": ["angular"]
}
```

Array of shareable configurations to extend.
Configurations are resolved as `commitlint-config-${name}`
and have to be installed.
See [npm search](https://www.npmjs.com/search?q=commitlint-config)
for available shareable configurations.

---

⇨ See [shareable-config](./documentation/shareable-config.md) for details

### preset

```js
{
  "preset": "angular"
}
```

`conventional-changelog` preset name to use for parsing of commit messages.

---

⇨ See [conventional-changelog](https://github.com/ajoslin/conventional-changelog#preset)
for details

### rules

```js
{
  "rules": {
    "body-leading-blank": [1, "always"],
    "header-max-length": [1, "always", 72],
    "subject-full-stop": [1, "never", "."]
  }
}
```

Rules applicable to the linted commit messages.
By default all rules are turned off via a level of 0.
They can be enabled by shareable configuration,
such as the
[angular config](https://github.com/marionebl/commitlint-config-angular),
which is loaded by default.

---

⇨ See [rules](./documentation/rules.md) for details

### wildcards

Patterns to exclude from linting

```js
wildcards: {
  merge: [
    '/^(Merge pull request)|(Merge (.*?) into (.*?)$)/'
  ],
  release: [
    '/^\\d.\\d.\\d$/'
  ],
  revert: [
    '/^revert: (.*)/'
  ]
}
```

## Shallow clones

### TL;DR

Perform `git fetch --shallow` before linting.

Most likely you are reading this because you where presented with an error message:

```
  'Could not get git history from shallow clone.
  Use git fetch --shallow before linting.
  Original issue: https://git.io/vyKMq\n Refer to https://git.io/vyKMv for details.'
```

### Explanation

git supports checking out `shallow` clones of a repository to save bandwith in times.
These limited copies do not contain a full git history. This makes `commitlint`
fail, especially when running on large commit ranges.
To ensure linting works every time you should convert a shallow git repo to a complete one.
Use `git fetch --shallow` to do so.

### Travis

Ensure full git checkouts on TravisCI, add to `.travis.yml`:

```yml
before_install:
  - git fetch --unshallow
```

### Appveyor

Ensure full git checkouts on AppVeyor, add to `appveyor.yml`:

```yml
shallow_clone: false
```

## Supported Node.js versions

commitlint supports the active Node.js [LTS](https://github.com/nodejs/LTS#lts-schedule) version and higher: `>= 4`

## Related projects

*   [angular-precommit](https://git.io/vwTDd)
– Pre commit with angular conventions

*   [conventional-changelog-cli](https://git.io/vwTDA)
– Generate a changelog from conventional commit history

*   [cz-commitlint](https://git.io/vwTyf)
– Let an interactive command line interface help you with creating commit
messages matching your `commitlint` configuration

*   [commitlint-config-angular](https://git.io/vwTy4)
– Shareable commitlint config enforcing the angular
commit convention

*   [commitlint-config-atom](https://git.io/vwTy9)
– Shareable configuration for commitlint based on the
atom commit guidelines

*   [commitlint-config-patternplate](https://git.io/vwTyz)
– Lint your commits, patternplate-style

*   [conventional-commits-detector](https://git.io/vwTyk)
– Detect what commit message convention your repository is using

*   [conventional-github-releaser](https://git.io/vwTyI)
– Make a new GitHub release from git metadata

*   [conventional-recommended-bump](https://git.io/vwTyL)
– Get a recommended version bump based on conventional commits

*   [commitizen](https://git.io/vwTym)
– Simple commit conventions for internet citizens

*   [standard-changelog](https://git.io/vwTyO)
– Generate a changelog from conventional commit history, angular-style

---

Copyright 2016 by [Mario Nebl](https://github.com/marionebl)
and [contributors](./graphs/contributors).
Released under the [MIT license]('./license.md').


[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/travis/marionebl/commitlint/master.svg?style=flat-square
[3]: https://travis-ci.org/marionebl/commitlint
[4]: https://img.shields.io/appveyor/ci/marionebl/commitlint/master.svg?style=flat-square
[5]: https://ci.appveyor.com/project/marionebl/commitlint
[6]: https://img.shields.io/npm/v/commitlint.svg?style=flat-square
[7]: https://npmjs.org/package/commitlint
