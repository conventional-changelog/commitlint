> Lint commit messages

`commitlint` helps your team adhereing to a commit convention. By supporting npm-installed configurations it makes sharing of commit conventions easy.

# Getting started

## Install 

```sh
npm install -g @commitlint/cli @commitlint/config-angular
```

## Configure

```
echo "module.exports = {extends: [@commitlint/config-angular']}" > .commitlint.config.js
```

## Test

```
# Lint from stdin
echo 'foo: bar' | commitlint
⧗   input: foo: bar
✖   scope must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]
✖   found 1 problems, 0 warnings

# Lint last commit from history
commitlint --from=HEAD~1
```


?> To get the most out of `commitlint` you'll want to autmate its use in your project lifecycle. See our [Local setup guide](./guides-local-setup?id=guide-local-setup) for next steps.

## Documentation

* **Guides** - Common use cases explained in a step-by-step pace
* **Concepts** - Overarching topics important to unterstand the use of `commitlint`
* **Reference** - Mostly technical documentation
* **Changelog**
