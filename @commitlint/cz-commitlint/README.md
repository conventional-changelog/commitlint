> Commitizen adapter using the commitlint.config.js

# @commitlint/cz-commitlint

This is a commitizen adapter, using this adapter, commitizen works based on commitlint.config.js.

Submit by commitizen, lint by commitlint, just need maintain one configuration file, Consistent and Scalable.

The interactive process is inspired by [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog).

## Getting started

### Configure commitizen adapter

```bash
npm install --save-dev @commitlint/cz-commitlint commitizen
# or yarn
yarn add -D @commitlint/cz-commitlint commitizen
```

In package.json

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

### Configure commitlint

**⚠️ Important: The required version of commitlint and shared configuration is above 12.1.2, update them if already existed in project**

```bash
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/config-conventional @commitlint/cli
# or yarn
yarn add @commitlint/config-conventional @commitlint/cli -D

# Simple: config with conventional
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

### Try it out

```bash
git add .
npm run commit
# or yarn
yarn commit
```

## Related

- [Commitlint Reference Prompt](https://commitlint.js.org/#/reference-prompt) - How to customize prompt information by setting commitlint.config.js
