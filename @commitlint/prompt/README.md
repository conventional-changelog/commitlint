> commitizen adapter using commitlint.config.js

# @commitlint/prompt

This is the library and commitizen adapter version of commitlint prompt.
A ready-to-use cli version is available at [@commitlint/prompt-cli](../prompt-cli).
Learn how to use it at [docs/prompt](https://conventional-changelog.github.io/commitlint/#/guides-use-prompt).

## Getting started

```bash
npm install --save-dev @commitlint/prompt @commitlint/config-conventional commitizen
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

In package.json

```
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/prompt"
    }
  }
}
```

```bash
git add .
npm run commit
```
