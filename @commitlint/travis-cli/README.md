> Lint all relevant commits for a change or PR on Travis CI

# @commitlint/travis-cli

This package is a convenience wrapper around `commitlint`, 
providing zero-configuration linting of all relevant commits
for a given change/build combination.

## Getting started

```
npm install --save-dev @commitlint/travis-cli
```

```yml
# .travis.yml
script
  - commitlint-travis
```
