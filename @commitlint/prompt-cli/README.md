# @commitlint/prompt-cli

commit prompt using commitlint.config.js

## Getting started

```sh
npm install -g @commitlint/prompt-cli @commitlint/config-angular
echo "export default {extends: ['@commitlint/config-angular']};" > commitlint.config.js
```

```sh
git add .
commit
```

To load the config from a custom path, pass `--config` (or `-g`):

```sh
commit --config ./config/commitlint.config.js
```

A full usage guide is available at [docs/prompt](https://commitlint.js.org/guides/use-prompt).
