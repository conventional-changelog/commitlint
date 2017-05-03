#!/bin/bash
set -e
set -u

# Add the clone as remote if this is a PR from a clone
if [[ $TRAVIS_PULL_REQUEST_SLUG != "" && $TRAVIS_PULL_REQUEST_SLUG != $TRAVIS_REPO_SLUG ]]; then
	git remote add "$TRAVIS_PULL_REQUEST_SLUG" "https://github.com/$TRAVIS_PULL_REQUEST_SLUG.git"
	git fetch "$TRAVIS_PULL_REQUEST_SLUG"
fi

# Use REMOTE/BRANCH as comparison if applicable
if [[ $TRAVIS_PULL_REQUEST_SLUG != "" ]]; then
	TO="$TRAVIS_PULL_REQUEST_SLUG/$TRAVIS_PULL_REQUEST_BRANCH"
else
	TO="$TRAVIS_PULL_REQUEST_BRANCH"
fi

# Lint all commits in the PR
conventional-changelog-lint --from="$TRAVIS_BRANCH" --to="$TO"

# Always lint the triggerig commit
conventional-changelog-lint --from="$TRAVIS_COMMIT"
