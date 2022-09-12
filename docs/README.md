> Lint commit messages

<div class="sequence">
    <img src="./assets/commitlint.svg"/>
</div>

> Demo generated with [svg-term-cli](https://github.com/marionebl/svg-term-cli)

# commitlint &nbsp; [![slack][11]][12]

[![npm latest][2]][3] [![CircleCI][4]][5] <!-- [![AppVeyor][6]][7] -->

`commitlint` helps your team adhere to a commit convention. By supporting npm-installed configurations it makes sharing of commit conventions easy.

# Getting started

## Install

```bash
npm install -g @commitlint/cli @commitlint/config-conventional
```

## Configure

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

## Test

```bash
# Lint from stdin
echo 'foo: bar' | commitlint
⧗   input: foo: bar
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```

```bash
# Lint last commit from history
commitlint --from=HEAD~1
```

?> To get the most out of `commitlint` you'll want to automate it in your project lifecycle. See our [Local setup guide](./guides-local-setup.md?id=guides-local-setup) for next steps.

## Documentation

- **Guides** - Common use cases explained in a step-by-step pace
- **Concepts** - Overarching topics important to understand the use of `commitlint`
- **Reference** - Mostly technical documentation

## Attributions

- `commitlint` is possible because of the hard work of the folks of the `conventional-changelog` project
- Thanks [@markusoelhafen](https://github.com/markusoelhafen) for providing
  the `commitlint` icon

[0]: https://img.shields.io/badge/stability-stable-green.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/@commitlint/cli.svg?style=flat-square
[3]: https://npmjs.org/package/@commitlint/cli
[4]: https://img.shields.io/circleci/project/github/conventional-changelog/commitlint/master.svg?style=flat-square
[5]: https://circleci.com/gh/conventional-changelog/commitlint

<!-- [6]: https://img.shields.io/appveyor/ci/conventional-changelog/commitlint/master.svg?style=flat-square
[7]: https://ci.appveyor.com/project/conventional-changelog/commitlint -->

[8]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[9]: https://nodejs.org/api/documentation.html#documentation_stability_index
[10]: https://img.shields.io/npm/v/@commitlint/cli/next.svg?style=flat-square
[11]: http://devtoolscommunity.herokuapp.com/badge.svg?style=flat-square
[12]: http://devtoolscommunity.herokuapp.com
