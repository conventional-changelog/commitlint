# CLI

## Installation

```shell
npm install --save-dev @commitlint/cli
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
