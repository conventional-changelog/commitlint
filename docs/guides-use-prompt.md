# Guide: Use prompt

`@commitlint/prompt-cli` helps with fast authoring of commit messages and ensures they adhere to the commit convention configured in `commitlint.config.js`.

## Install

```bash
# Create a git repository if needed
git init

# Create a package.json if needed
npm init

# Install and configure if needed
npm install --save-dev @commitlint/{cli,angular,prompt-cli}
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

### Provide a shortcut

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

## Global Install

While we do recommended a local install, there are some cases you're contributing to a repository that is not commitlint or commitizen friendly,
but you'd still like the use the prompt. In such cases, you can install the prompt globally and set it up as a commitizen adapter:

```bash
npm install -g commitizen @commitlint/prompt-cli @commitlint/config-conventional
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > ~/.commitlintrc.js
echo '{ "path": "@commitlint/prompt" }' > ~/.czrc
```

When you're ready to commit you can just run `git cz` or `commitizen`.
