> Lint commit messages

<p align="center">
  <img width="750" src="https://conventional-changelog.github.io/commitlint/assets/commitlint.svg">
</p>

# @commitlint/cli

## Getting started

Commitlint works with zero configuration, it uses the `@commitlint/config-conventional` by default.

```
npm install --save-dev @commitlint/cli
```

If you want to use other conventions, you can to specify the configuration you want to use.

```
npm install --save-dev @commitlint/cli @commitlint/config-angular
echo "module.exports = {extends: ['@commitlint/config-angular']};" > commitlint.config.js
```

Consult [docs/cli](https://conventional-changelog.github.io/commitlint/#/reference-cli) for comprehensive documentation.
