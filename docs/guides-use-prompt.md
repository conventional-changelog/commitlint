# Guide: Use prompt

`@commitlint/prompt-cli` helps with fast authoring of commit messages and ensures they adhere to the commit convention configured in `commitlint.config.js`.

## Install

```bash
# Create a git repository if needed
git init

# Create a package.json if needed
npm init

# Install and configure if needed
npm install --save-dev @commitlint/{cli,config-conventional,prompt-cli}
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
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

```bash
git add .
npm run commit
```

## An alternative to `@commitlint/prompt`: commitizen

Another way to author commit messages that adhere to the commit convention configured in `commitlint.config.js` is to use `commitizen`.
For more information, checkout their [official website](http://commitizen.github.io/cz-cli/).
