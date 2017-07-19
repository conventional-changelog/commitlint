> Lint commit messages

<div class="sequence">
    <svg class="placeholder" width="832" height="517">
        <style>
            .tuohi3 {fill: #50b3dd}
            .tZ1XQohX {fill: #d4d6d6}
            .t1b70aa {fill: #1d262b}
            .tZLMqtg {fill: #9fcc4e}
        </style>
        <circle cx="18" cy="18" r="7.5" fill="#999"></circle>
        <circle cx="42" cy="18" r="7.5" fill="#999"></circle>
        <circle cx="65" cy="18" r="7.5" fill="#999"></circle>
        <svg x="15" y="50">
            <rect class="text tuohi3" x="0" y="0" width="250" height="14"/>
            <rect class="text t1b70aa" x="255" y="0" width="68" height="14"/>
            <rect class="text tZLMqtg" x="0" y="19" width="10" height="14"/>
        </svg>
    </svg>
    <img src="./assets/commitlint.svg"/>
</div>

# commitlint

[![npm latest][2]][3] [![npm next][10]][3] [![Travis branch][4]][5] [![AppVeyor branch][6]][7]

`commitlint` helps your team adhereing to a commit convention. By supporting npm-installed configurations it makes sharing of commit conventions easy.

# Getting started

## Install

```bash
npm install -g @commitlint/cli @commitlint/config-angular
```

## Configure

```bash
echo "module.exports = {extends: [@commitlint/config-angular']}" > commitlint.config.js
```

## Test

```bash
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


[0]: https://img.shields.io/badge/stability-stable-green.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/@commitlint/cli.svg?style=flat-square
[3]: https://npmjs.org/package/@commitlint/cli
[4]: https://img.shields.io/travis/marionebl/commitlint/master.svg?style=flat-square
[5]: https://travis-ci.org/marionebl/commitlint
[6]: https://img.shields.io/appveyor/ci/marionebl/commitlint/master.svg?style=flat-square
[7]: https://ci.appveyor.com/project/marionebl/commitlint

[8]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[9]: https://nodejs.org/api/documentation.html#documentation_stability_index

[10]: https://img.shields.io/npm/v/@commitlint/cli/next.svg?style=flat-square
