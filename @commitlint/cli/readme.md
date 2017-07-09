> Lint commit messages

# @commitlint/cli

## Installation

```shell
npm install --save-dev @commitlint/cli @commitlint/config-angular
echo '{"extends": ["@commitlint/config-angular"]}' > .commitlintrc
```

## Usage

```shell
❯ commitlint --help
  commitlint - Lint commit messages

  [input] reads from stdin if --edit, --from, --to are omitted
  --color,-c    toggle formatted output, defaults to: true
  --edit,-e     read last commit message found in ./git/COMMIT_EDITMSG
  --extends,-x  array of shareable configurations to extend
  --from,-f     lower end of the commit range to lint; applies if edit=false
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

Copyright by [Mario Nebl](https://github.com/marionebl)
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
