# Guide: CI Setup

Enforce commit conventions with confidence by linting on your CI servers with `commitlint`.

 We'll use TravisCI for this guide but the principles are valid for any CI server.

## Install

```bash
# Create a git repository if needed
git init

# Create a package.json if needed
npm init

# Install and configure if needed
npm install --save-dev @commitlint/{config-conventional,cli}
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

Alternatively the configuration can be defined in `.commitlintrc.js`, `.commitlintrc.json`, or `.commitlintrc.yml` file or a `commitlint` field in `package.json`.

## First test run with Travis

Add a `.travis.yml` to your project root

```yaml
# .travis.yml
language: node_js
before_install: git fetch --unshallow
script:
  - ./node_modules/.bin/commitlint --from=HEAD~1
  - npm test
```

Make sure Travis is connected to your git repository.
Trigger a build by pushing to your repository.

```bash
git add .
git commit -m "add travis stuff"
```

We expect this build to fail:

```yaml
...
./node_modules/.bin/commitlint --from=HEAD~1
⧗   input: add travis stuff
✖   message may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings
```

## Linting relevant commits

What we did so far works but is not very useful as it simply lints the last commit in history.
Let's change that by using environment information provided by TravisCI.

Every build exposes the commit that triggered the build via `TRAVIS_COMMIT`.

```yaml
# .travis.yml
language: node_js
before_install: git fetch --unshallow
script:
  - ./node_modules/.bin/commitlint --from=$TRAVIS_COMMIT
  - npm test
```

That's a bit better, but we are not handling branches at all yet. Travis provides the branch we are on via `TRAVIS_BRANCH`.

```yaml
# .travis.yml
language: node_js
before_install: git fetch --unshallow
script:
  - ./node_modules/.bin/commitlint --from="$TRAVIS_BRANCH" --to="$TRAVIS_COMMIT"
  - ./node_modules/.bin/commitlint --from=$TRAVIS_COMMIT
  - npm test
```

Nice. This handles direct commits and PR originating from the same repository. Let's add forks to the mix.

## The full scripts

We'll have to differentiate between forks and same-repo PRs on our own and move the linting to a dedicated script.

```yaml
# .travis.yml
language: node_js
before_install: git fetch --unshallow
script:
  - /bin/bash lint-commits.sh
  - npm test
```

```bash
# lint-commits.sh
#!/bin/bash
set -e
set -u

if [[ $TRAVIS_PULL_REQUEST_SLUG != "" && $TRAVIS_PULL_REQUEST_SLUG != $TRAVIS_REPO_SLUG ]]; then
	# This is a Pull Request from a different slug, hence a forked repository
	git remote add "$TRAVIS_PULL_REQUEST_SLUG" "https://github.com/$TRAVIS_PULL_REQUEST_SLUG.git"
	git fetch "$TRAVIS_PULL_REQUEST_SLUG"

	# Use the fetched remote pointing to the source clone for comparison
	TO="$TRAVIS_PULL_REQUEST_SLUG/$TRAVIS_PULL_REQUEST_BRANCH"
else
	# This is a Pull Request from the same remote, no clone repository
	TO=$TRAVIS_COMMIT
fi

# Lint all commits in the PR
# - Covers fork pull requests (when TO=slug/branch)
# - Covers branch pull requests (when TO=branch)
./node_modules/.bin/commitlint --from="$TRAVIS_BRANCH" --to="$TO"

# Always lint the triggering commit
# - Covers direct commits
./node_modules/.bin/commitlint --from="$TRAVIS_COMMIT"
```

?> Help yourself adopting a commit convention by using an interactive commit prompt. Learn how to use `@commitlint/prompt-cli` in the [Use prompt guide](guides-use-prompt.md)
