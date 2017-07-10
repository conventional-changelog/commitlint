# Guide: Use prompt

`@commitlint/prompt-cli` helps with fast authoring of commit messages and ensures they adhere to the commit convention configured in `commitlint.config.js`.

## Install

```sh
# Create a git repository if needed
git init

# Create a package.json if needed
npm init

# Install and configure if needed
npm install --save-dev @commitlint-{cli,angular,prompt-cli}
echo "module.exports = {extends: ['@commitlint/config-angular']};"
```

## Provide a shortcut

To make prompt-cli easy to use, add a npm run-script to your `package.json`

```json
{
  "scripts": {
    "commit": "commit"
  }
}
```

Test the prompt by executing

```sh
git add .
npm run commit
```
